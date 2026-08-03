#!/usr/bin/env python3
"""Generate tests/vec_tok.cst from the html5lib tokenizer conformance suite.

    git clone --depth 1 https://github.com/html5lib/html5lib-tests
    python3 tools/gen_tok_vectors.py html5lib-tests/tokenizer > tests/vec_tok.cst

6810 cases across six initial states. This is the suite every browser's
tokenizer is checked against, and using it rather than cases I invent is the
whole point: a tokenizer tested against its author's idea of HTML passes.

WHAT IS COMPARED. The expected token stream is flattened to one canonical
string on this side, and tests/test_tok.cst builds the same string from what
the tokenizer emits. A mismatch prints both, which is readable in a way that
"token 3 differs" is not.

    DOCTYPE   'D' name \\x01 public \\x01 system \\x01 quirks \\x02
              with a leading '-' where the field is ABSENT, because
              `<!DOCTYPE html PUBLIC "">` and `<!DOCTYPE html>` differ only
              there and quirks mode turns on it.
    start tag 'S' name (\\x03 attr \\x04 value)* [\\x05 if self-closing] \\x02
    end tag   'E' name \\x02
    comment   'C' data \\x02
    characters'T' data \\x02

ATTRIBUTES ARE SORTED BY NAME on both sides. html5lib stores them as a JSON
object, so their order is already gone by the time the file is written; sorting
is the only comparison that means anything.

CHARACTER TOKENS ARE CONCATENATED. The suite splits them arbitrarily — a
tokenizer may emit `ab` as one token or two and both are conforming — so
adjacent runs are joined before comparing.

ERRORS ARE NOT COMPARED. Each case lists the parse errors it expects with
positions; this tokenizer counts errors without recording where. Ignoring the
list is honest, and it costs the one thing a count cannot check: that an error
fired at the right place. Written down rather than implied.
"""
import glob
import json
import os
import sys

STATES = {
    "Data state": 0,
    "RCDATA state": 1,
    "RAWTEXT state": 2,
    "Script data state": 3,
    "PLAINTEXT state": 4,
    "CDATA section state": 68,
}

CHUNK = 400


def unescape_double(s: str) -> str:
    """html5lib's `doubleEscaped` cases carry \\uXXXX inside the JSON string."""
    return s.encode("utf-8").decode("unicode_escape")


def canon(tokens, double: bool) -> bytes:
    out = bytearray()
    text = []

    def flush():
        if text:
            out.append(0x54)                      # 'T'
            out.extend("".join(text).encode("utf-8", "surrogatepass"))
            out.append(0x02)
            text.clear()

    for tk in tokens:
        kind = tk[0]
        if kind == "Character":
            s = tk[1]
            if double:
                s = unescape_double(s)
            text.append(s)
            continue
        flush()
        if kind == "DOCTYPE":
            name, pub, sys_, correct = tk[1], tk[2], tk[3], tk[4]
            out.append(0x44)                      # 'D'
            out.extend(b"-" if name is None else name.encode("utf-8", "surrogatepass"))
            out.append(0x01)
            out.extend(b"-" if pub is None else pub.encode("utf-8", "surrogatepass"))
            out.append(0x01)
            out.extend(b"-" if sys_ is None else sys_.encode("utf-8", "surrogatepass"))
            out.append(0x01)
            out.extend(b"1" if correct else b"0")
            out.append(0x02)
        elif kind == "StartTag":
            out.append(0x53)                      # 'S'
            out.extend(tk[1].encode("utf-8", "surrogatepass"))
            for k in sorted(tk[2]):
                out.append(0x03)
                out.extend(k.encode("utf-8", "surrogatepass"))
                out.append(0x04)
                v = tk[2][k]
                if double:
                    v = unescape_double(v)
                out.extend(v.encode("utf-8", "surrogatepass"))
            if len(tk) > 3 and tk[3]:
                out.append(0x05)
            out.append(0x02)
        elif kind == "EndTag":
            out.append(0x45)                      # 'E'
            out.extend(tk[1].encode("utf-8", "surrogatepass"))
            out.append(0x02)
        elif kind == "Comment":
            s = tk[1]
            if double:
                s = unescape_double(s)
            out.append(0x43)                      # 'C'
            out.extend(s.encode("utf-8", "surrogatepass"))
            out.append(0x02)
        else:
            raise SystemExit("unknown token kind: %r" % (kind,))
    flush()
    return bytes(out)


def u32(n: int) -> bytes:
    return bytes([(n >> 24) & 255, (n >> 16) & 255, (n >> 8) & 255, n & 255])


def esc(bs: bytes) -> str:
    out = []
    for b in bs:
        if b == 0x22:
            out.append('\\"')
        elif b == 0x5C:
            out.append("\\\\")
        elif 0x20 <= b < 0x7F:
            out.append(chr(b))
        else:
            out.append("\\x%02x" % b)
    return "".join(out)


def main() -> None:
    root = sys.argv[1]
    records = []
    skipped = 0

    for path in sorted(glob.glob(os.path.join(root, "*.test"))):
        # xmlViolation.test asks for XML-compatible output, which is a
        # different (and non-normative) contract. Left out on purpose.
        if os.path.basename(path) == "xmlViolation.test":
            continue
        with open(path) as fh:
            doc = json.load(fh)
        for tc in doc.get("tests", []):
            double = tc.get("doubleEscaped", False)
            src = tc["input"]
            if double:
                src = unescape_double(src)
            last = tc.get("lastStartTag", "")
            for sname in tc.get("initialStates", ["Data state"]):
                if sname not in STATES:
                    skipped += 1
                    continue
                records.append((
                    STATES[sname],
                    last.encode("utf-8"),
                    src.encode("utf-8", "surrogatepass"),
                    canon(tc["output"], double),
                    ("%s [%s]" % (tc.get("description", ""), sname)).encode("utf-8")[:120],
                ))

    blobs = []
    for i in range(0, len(records), CHUNK):
        buf = bytearray()
        for st, last, src, exp, desc in records[i:i + CHUNK]:
            buf.append(st)
            buf += u32(len(last)) + last
            buf += u32(len(src)) + src
            buf += u32(len(exp)) + exp
            buf += u32(len(desc)) + desc
        blobs.append(bytes(buf))

    w = sys.stdout.write
    w("// =======================================================\n")
    w("// caustic-browser/tests/vec_tok.cst  —  GENERATED, do not edit.\n")
    w("//\n")
    w("//   git clone --depth 1 https://github.com/html5lib/html5lib-tests\n")
    w("//   python3 tools/gen_tok_vectors.py html5lib-tests/tokenizer > tests/vec_tok.cst\n")
    w("//\n")
    w("// %d cases from the html5lib tokenizer conformance suite — the one every\n" % len(records))
    w("// browser is checked against. Using it rather than cases written here is\n")
    w("// the point: a tokenizer tested against its own author's idea of HTML\n")
    w("// passes.\n")
    w("//\n")
    w("// Each record is  state | u32+lastStartTag | u32+input | u32+expected |\n")
    w("// u32+description, laid end to end. Lengths rather than terminators\n")
    w("// because the inputs contain NUL — several cases exist to check exactly\n")
    w("// that.\n")
    w("//\n")
    w("// `expected` is the token stream flattened to one string; the format and\n")
    w("// why attributes are sorted and character runs joined are documented in\n")
    w("// tools/gen_tok_vectors.py.\n")
    w("//\n")
    w("// xmlViolation.test is left out: it asks for XML-compatible output, a\n")
    w("// different and non-normative contract.\n")
    w("// =======================================================\n\n")

    w("let is i64 as VEC_COUNT  with imut = %d;\n" % len(records))
    w("let is i64 as VEC_BLOBS  with imut = %d;\n\n" % len(blobs))
    for i, b in enumerate(blobs):
        w("let is i64 as _VL%02d with imut = %d;\n" % (i, len(b)))
        w('let is *u8 as _VB%02d with imut =\n    "%s";\n' % (i, esc(b)))
    w("\n")
    w("fn vec_blob(i as i64) as *u8 {\n")
    for i in range(len(blobs)):
        w("    if (i == %d) { return _VB%02d; }\n" % (i, i))
    w("    return cast(*u8, 0);\n}\n\n")
    w("fn vec_blob_len(i as i64) as i64 {\n")
    for i in range(len(blobs)):
        w("    if (i == %d) { return _VL%02d; }\n" % (i, i))
    w("    return 0;\n}\n")

    if skipped:
        sys.stderr.write("skipped %d case(s) in unhandled initial states\n" % skipped)
    sys.stderr.write("%d records in %d blobs\n" % (len(records), len(blobs)))


if __name__ == "__main__":
    main()
