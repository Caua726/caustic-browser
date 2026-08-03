# caustic-browser

**A web browser written in [Caustic](https://github.com/Caua726/Caustic), from the pixels up. Milestone 1.**

![version](https://img.shields.io/badge/version-0.0.2-blue)
![status](https://img.shields.io/badge/status-M1%20%C2%B7%20tokeniser-orange)
![html5lib](https://img.shields.io/badge/html5lib-7032%2F7032-brightgreen)
![dependencies](https://img.shields.io/badge/dependencies-caustic--sdl3-brightgreen)
![license](https://img.shields.io/badge/license-MIT-blue)

> **Read this first.** Two things exist. A window that paints a mock of a
> browser UI by writing individual pixels into a CPU buffer, and an HTML
> tokeniser that passes the whole html5lib conformance suite. There is **no tree
> builder, no CSS, no layout engine, no JavaScript and no networking** — nothing
> connects the two yet. The name describes the intent, not the contents.

## What M0 establishes

The platform seam. SDL3 opens the window and publishes a buffer; **nothing else
is SDL's**. There are no SDL drawing calls and no GPU involved — `clear`,
`fill_rect` and `put_pixel` in `src/platform/surface.cst` write bytes into the
window's own pixel buffer, and `present` hands it to the compositor.

That matters for what comes next: a browser is a program that decides the colour
of every pixel it shows. Starting from a rasteriser we own, instead of from a
drawing API we borrow, means the layout and paint layers have somewhere to land
that will not have to be rewritten when the toolkit is not enough.

```
src/platform/surface.cst   the seam: open, clear, put_pixel, fill_rect, present, poll, close
src/main.cst               M0: paint the mock, then an event-driven idle loop
tests/surftest.cst         the seam, exercised without opening a window
```

## What M1 establishes

**The HTML tokeniser, WHATWG §13.2.5 — all of it.** 7032 of 7032 cases in the
[html5lib conformance suite](https://github.com/html5lib/html5lib-tests) pass,
at every optimization level the compiler offers — `-O0`, `-O1` and `-O2` — in
0.1 s each.

The whole state machine rather than the subset that gets `<p>hello</p>` working,
because the subset is what turns into a rewrite the first time a real page
arrives. Three things break a naive tokeniser on the first site anyone tries:

- `<script>if (a<b) {}</script>` — inside a script, `<` is not markup. Worse,
  `<!--` inside a script enters an escaped state where `</` **is** markup again,
  and `<script` inside *that* enters a double-escaped state where it is not.
  Fourteen states exist for this one problem and every one is reachable from a
  page that ships an ad tag.
- `&notin;` and `&not` are both named references and one is a prefix of the
  other. Matching is longest-first over 2231 names — and in an attribute value
  `?a=1&nots=2` must **not** become `?a=1¬s=2`, while outside one the same
  input is the entity.
- `<title>a < b</title>` — RCDATA. `<` is text unless what follows is the end
  tag for *this* element, so the tokeniser has to remember which start tag
  opened the region.

It reads **bytes, not codepoints**. Not a shortcut: every character the machine
branches on is ASCII, and in UTF-8 no byte of a multi-byte sequence is ever
below 0x80, so a byte-oriented scanner takes the same transitions. The two
places it would matter are handled — U+0000 becomes U+FFFD, and numeric
references are encoded to UTF-8.

```
src/html/tokenizer.cst     the state machine (1759 lines)
src/html/entities.cst      GENERATED — the 2231 named references
tests/test_tok.cst         the html5lib suite, replayed and compared
tests/vec_tok.cst          GENERATED — 7032 cases, six initial states
tools/gen_entities.py      entities.json    -> src/html/entities.cst
tools/gen_tok_vectors.py   html5lib-tests/  -> tests/vec_tok.cst
```

Both generated files are committed and both generators are committed with them;
regenerating either is one command, documented at the top of the script.

**Parse errors are counted, not itemised.** Each html5lib case lists the errors
it expects and where; this counts them without recording positions, so a case
that should have raised one and did not still passes. That is a real hole rather
than an oversight — closing it means carrying a position with every error, which
the tree builder will want anyway.

## Not built yet

Everything else, in the order it is likely to be needed: the tree builder, a URL
parser and HTTP (from [`caustic-net`](https://github.com/Caua726/caustic-net),
which now does `fetch(url) -> bytes` with TLS), CSS parsing and the cascade, box
layout, text shaping and font rasterisation, the paint tree, and — much later,
if ever — a JavaScript engine.

## Building it

Requires the [Caustic toolchain](https://github.com/Caua726/Caustic) and SDL3.
[`caustic-sdl3`](https://github.com/Caua726/caustic-sdl3) is a declared
dependency, cloned into `.caustic/deps` at its pinned tag on the first build.

```sh
caustic-mk run test         # the tokeniser suite, the surface test, the window build
caustic-mk run test-opt     # the tokeniser suite at -O1 and -O2
caustic-mk build browser && ./build/browser
```

## License

MIT — see [LICENSE](LICENSE).
