# caustic-browser

**A web browser written in [Caustic](https://github.com/Caua726/Caustic), from the pixels up. Milestone 0.**

![version](https://img.shields.io/badge/version-0.0.1-blue)
![status](https://img.shields.io/badge/status-M0%20%C2%B7%20skeleton-red)
![dependencies](https://img.shields.io/badge/dependencies-caustic--sdl3-brightgreen)
![license](https://img.shields.io/badge/license-MIT-blue)

> **Read this first.** This is 155 lines. It opens a window and paints a mock of
> a browser UI — a chrome bar, a URL bar and two cards — by writing individual
> pixels into a CPU buffer. There is **no HTML parser, no CSS, no layout engine,
> no JavaScript and no networking**. The name describes the intent, not the
> contents. Milestone 0 exists to prove one thing, and it proves it: every pixel
> on screen was written by this program.

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

## Not built yet

Everything else, in the order it is likely to be needed: a URL parser, HTTP
(from [`caustic-net`](https://github.com/Caua726/caustic-net), when it gets
there), an HTML tokeniser and tree builder, CSS parsing and the cascade, box
layout, text shaping and font rasterisation, the paint tree, and — much later,
if ever — a JavaScript engine.

## Building it

Requires the [Caustic toolchain](https://github.com/Caua726/Caustic) and SDL3.
[`caustic-sdl3`](https://github.com/Caua726/caustic-sdl3) is a declared
dependency, cloned into `.caustic/deps` at its pinned tag on the first build.

```sh
caustic-mk run test         # the surface test, then the window build
caustic-mk build browser && ./build/browser
```

## License

MIT — see [LICENSE](LICENSE).
