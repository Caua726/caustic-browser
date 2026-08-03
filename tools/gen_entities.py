#!/usr/bin/env python3
"""Generate src/html/entities.cst from the WHATWG named character reference table.

    curl -o entities.json https://html.spec.whatwg.org/entities.json
    python3 tools/gen_entities.py entities.json > src/html/entities.cst

The table is 2231 names and it is not optional: `&amp;` is the least of it, and
a page that writes `&nbsp;` or `&mdash;` — most of them do — renders as literal
text without it.

THE ENCODING. Caustic has no array literals, so `tls/roots.cst` in caustic-net
solves the same problem by emitting one `let` per entry plus a `_fill()` that
copies them into mmap'd arrays. That is fine for 121 roots and would be 4462
globals here.

Instead the whole table is a handful of BLOBS: `name\\x00value\\x00` repeated,
with an explicit byte length beside each because the NULs make strlen useless.
`_fill()` walks them once and records pointers INTO the blob — no copy, no
mutation, and the strings are already NUL-terminated where they sit. The chunks
exist so no single literal is enormous, not for any semantic reason.

Three properties of the table drive the rest:

  * 106 names have NO trailing semicolon (`&amp`, `&lt`, `&copy`). They are
    legacy, the spec still requires them, and only outside attribute values. The
    semicolon is part of the KEY here so the tokenizer decides what a missing
    one means.
  * Names match LONGEST-FIRST. `&not` and `&notin;` are both in the table and
    only trying the longer one first tells them apart. The output is SORTED so
    the tokenizer can binary-search each candidate length.
  * A replacement can be TWO codepoints (`&NotEqualTilde;` is U+2242 U+0338).
    Never three, and never a NUL — which is what makes the encoding above safe.
"""
import json
import sys

CHUNK = 200


def esc(bs: bytes) -> str:
    """A Caustic string literal for these bytes."""
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
    with open(sys.argv[1]) as fh:
        raw = json.load(fh)

    ents = sorted((k[1:], v["characters"]) for k, v in raw.items())
    assert all(len(v) <= 2 for _, v in ents), "a replacement grew past two codepoints"
    assert not any("\x00" in v for _, v in ents), "a replacement contains NUL"
    assert not any("\x00" in n for n, _ in ents), "a name contains NUL"
    longest = max(len(n) for n, _ in ents)
    no_semi = sum(1 for n, _ in ents if not n.endswith(";"))

    chunks = [ents[i:i + CHUNK] for i in range(0, len(ents), CHUNK)]

    w = sys.stdout.write
    w("// =======================================================\n")
    w("// caustic-browser/src/html/entities.cst  —  GENERATED, do not edit.\n")
    w("//\n")
    w("//   curl -o entities.json https://html.spec.whatwg.org/entities.json\n")
    w("//   python3 tools/gen_entities.py entities.json > src/html/entities.cst\n")
    w("//\n")
    w("// The WHATWG named character reference table: %d names.\n" % len(ents))
    w("//\n")
    w("// SORTED BY NAME, and the tokenizer depends on it. A reference matches the\n")
    w("// LONGEST name that follows the '&', and `&not` and `&notin;` are both in\n")
    w("// here — only trying the longer one first tells them apart. ent_find walks\n")
    w("// candidate lengths downwards with a binary search at each.\n")
    w("//\n")
    w("// The trailing ';' is part of the name. %d of these have none — `&amp`,\n" % no_semi)
    w("// `&lt`, `&copy` — which the spec still requires, with a parse error, and\n")
    w("// only outside an attribute value. Keeping the ';' in the key leaves that\n")
    w("// decision to the tokenizer instead of burying it here.\n")
    w("//\n")
    w("// Encoded as blobs of `name\\x00value\\x00`, with an explicit length beside\n")
    w("// each because the embedded NULs make strlen useless. _fill records\n")
    w("// pointers INTO the blob: the strings are already NUL-terminated where\n")
    w("// they sit, so nothing is copied.\n")
    w("// =======================================================\n\n")

    w('use "std/mem.cst" as mem;\n\n')

    w("let is i64 as ENT_COUNT   with imut = %d;\n" % len(ents))
    w("let is i64 as ENT_MAXNAME with imut = %d;   // '%s'\n"
      % (longest, max((n for n, _ in ents), key=len)))
    w("let is i64 as ENT_CHUNKS  with imut = %d;\n\n" % len(chunks))

    for ci, ch in enumerate(chunks):
        blob = b"".join(n.encode() + b"\x00" + v.encode("utf-8") + b"\x00" for n, v in ch)
        w("let is i64 as _L%02d with imut = %d;\n" % (ci, len(blob)))
        w('let is *u8 as _B%02d with imut =\n    "%s";\n' % (ci, esc(blob)))
    w("\n")

    w("let is [%d]*u8 as _name  with mut;\n" % len(ents))
    w("let is [%d]*u8 as _value with mut;\n" % len(ents))
    w("let is [%d]i64 as _nlen  with mut;\n" % len(ents))
    w("let is i64 as _ready with mut = 0;\n\n")

    w("// Walk one blob, recording where each name and value already sit.\n")
    w("fn _scan(b as *u8, len as i64, at as i64) as i64 {\n")
    w("    let is i64 as p with mut = 0;\n")
    w("    let is i64 as i with mut = at;\n")
    w("    while (p < len) {\n")
    w("        _name[i] = cast(*u8, cast(i64, b) + p);\n")
    w("        let is i64 as s = p;\n")
    w("        while (b[p] != 0) { p = p + 1; }\n")
    w("        _nlen[i] = p - s;\n")
    w("        p = p + 1;\n")
    w("        _value[i] = cast(*u8, cast(i64, b) + p);\n")
    w("        while (b[p] != 0) { p = p + 1; }\n")
    w("        p = p + 1;\n")
    w("        i = i + 1;\n")
    w("    }\n")
    w("    return i;\n")
    w("}\n\n")

    w("fn ent_ensure() as void {\n")
    w("    if (_ready == 1) { return; }\n")
    w("    let is i64 as n with mut = 0;\n")
    for ci in range(len(chunks)):
        w("    n = _scan(_B%02d, _L%02d, n);\n" % (ci, ci))
    w("    _ready = 1;\n")
    w("}\n\n")

    w("fn ent_count() as i64 { return ENT_COUNT; }\n")
    w("fn ent_name(i as i64) as *u8 { return _name[i]; }\n")
    w("fn ent_name_len(i as i64) as i64 { return _nlen[i]; }\n")
    w("fn ent_value(i as i64) as *u8 { return _value[i]; }\n")


if __name__ == "__main__":
    main()
