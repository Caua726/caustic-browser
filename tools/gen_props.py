#!/usr/bin/env python3
"""Generates src/css/props.cst: every CSS longhand this browser knows, its keywords,
what kinds of value it takes, its initial value, and whether it inherits.

    uv run tools/gen_props.py > src/css/props.cst
"""

LEN, PCT, NUM, COLOR, URL, STR, INT = 1, 2, 4, 8, 16, 32, 64
AUTO = "auto"

SIDES = ["top", "right", "bottom", "left"]
BSTYLE = "none hidden dotted dashed solid double groove ridge inset outset"
SELF = "normal stretch flex-start flex-end center baseline start end"
DIST = "flex-start flex-end center space-between space-around space-evenly start end left right normal stretch"

# name, flags, keywords, initial (keyword name, or a number meaning its pixels / value)
OWN = [
    ("display", 0, "block inline inline-block list-item flow-root none table inline-table table-row "
     "table-row-group table-header-group table-footer-group table-column table-column-group table-cell "
     "table-caption flex inline-flex grid inline-grid contents", "inline"),
    ("position", 0, "static relative absolute fixed sticky", "static"),
    ("float", 0, "none left right", "none"),
    ("clear", 0, "none left right both", "none"),
] + [(s, LEN | PCT, AUTO, AUTO) for s in SIDES] + [
    ("z-index", INT, AUTO, AUTO),
] + [("margin-" + s, LEN | PCT, AUTO, 0) for s in SIDES] \
  + [("padding-" + s, LEN | PCT, "", 0) for s in SIDES] \
  + [("border-%s-width" % s, LEN, "thin medium thick", 3) for s in SIDES] \
  + [("border-%s-style" % s, 0, BSTYLE, "none") for s in SIDES] \
  + [("border-%s-color" % s, COLOR, "", "currentcolor") for s in SIDES] \
  + [("border-%s-radius" % s, LEN | PCT, "", 0) for s in ["top-left", "top-right", "bottom-right", "bottom-left"]] + [
    ("width", LEN | PCT, "auto min-content max-content fit-content", AUTO),
    ("height", LEN | PCT, "auto min-content max-content fit-content", AUTO),
    ("min-width", LEN | PCT, "auto min-content max-content fit-content", AUTO),
    ("max-width", LEN | PCT, "none min-content max-content fit-content", "none"),
    ("min-height", LEN | PCT, "auto min-content max-content fit-content", AUTO),
    ("max-height", LEN | PCT, "none min-content max-content fit-content", "none"),
    ("box-sizing", 0, "content-box border-box", "content-box"),
    ("overflow-x", 0, "visible hidden clip scroll auto", "visible"),
    ("overflow-y", 0, "visible hidden clip scroll auto", "visible"),
    ("opacity", NUM | PCT, "", 1),
    # An SVG's, which its renderer inherits down its own way: auto is "not said here".
    ("stroke-width", LEN | NUM, AUTO, AUTO),
    ("stroke-miterlimit", NUM, AUTO, AUTO),
    ("stroke-opacity", NUM, AUTO, AUTO),
    ("fill-opacity", NUM, AUTO, AUTO),
    ("stroke-linecap", 0, "auto butt round square", AUTO),
    ("stroke-linejoin", 0, "auto miter round bevel", AUTO),
    ("fill-rule", 0, "auto nonzero evenodd", AUTO),
    ("background-color", COLOR, "", "transparent"),
    ("background-image", URL, "none", "none"),
    ("background-repeat", 0, "repeat repeat-x repeat-y no-repeat space round", "repeat"),
    ("background-position-x", LEN | PCT, "left center right", 0),
    ("background-position-y", LEN | PCT, "top center bottom", 0),
    ("background-size-w", LEN | PCT, "auto cover contain", AUTO),
    ("background-size-h", LEN | PCT, AUTO, AUTO),
    ("-x-gradient", STR, "none", "none"),
    ("box-shadow", STR, "none", "none"),
    ("flex-direction", 0, "row row-reverse column column-reverse", "row"),
    ("flex-wrap", 0, "nowrap wrap wrap-reverse", "nowrap"),
    ("flex-grow", NUM, "", 0),
    ("flex-shrink", NUM, "", 1),
    ("flex-basis", LEN | PCT, "auto content min-content max-content fit-content", AUTO),
    ("justify-content", 0, DIST, "normal"),
    ("align-items", 0, SELF, "normal"),
    ("align-self", 0, "auto " + SELF, AUTO),
    ("align-content", 0, DIST, "normal"),
    ("order", INT, "", 0),
    ("row-gap", LEN | PCT, "normal", "normal"),
    ("column-gap", LEN | PCT, "normal", "normal"),
    ("column-count", INT, AUTO, AUTO),
    ("column-width", LEN, AUTO, AUTO),
    ("justify-items", 0, SELF + " left right", "normal"),
    ("justify-self", 0, "auto " + SELF + " left right", AUTO),
    ("grid-template-columns", STR, "none", "none"),
    ("grid-template-rows", STR, "none", "none"),
    ("grid-auto-columns", STR, AUTO, AUTO),
    ("grid-auto-rows", STR, AUTO, AUTO),
    ("grid-auto-flow", 0, "row column", "row"),
    ("grid-row-start", INT, AUTO, AUTO),
    ("grid-column-start", INT, AUTO, AUTO),
    ("grid-row-end", INT, AUTO, AUTO),
    ("grid-column-end", INT, AUTO, AUTO),
    ("scroll-padding-top", LEN | PCT, AUTO, AUTO),
    ("scroll-margin-top", LEN, "", 0),
    ("transform", STR, "none", "none"),
    ("transform-origin-x", LEN | PCT, AUTO, AUTO),
    ("transform-origin-y", LEN | PCT, AUTO, AUTO),
    ("transition-property", STR, "all none", "all"),
    ("transition-duration", STR, "none", "none"),
    ("transition-delay", STR, "none", "none"),
    ("transition-timing-function", STR, "none", "none"),
    ("animation-name", STR, "none", "none"),
    ("animation-duration", NUM, "", 0),
    ("animation-delay", NUM, "", 0),
    ("animation-iteration-count", NUM, "infinite", 1),
    ("animation-direction", 0, "normal reverse alternate alternate-reverse", "normal"),
    ("animation-fill-mode", 0, "none forwards backwards both", "none"),
    ("animation-timing-function", STR, "none", "none"),
    ("table-layout", 0, "auto fixed", AUTO),
    ("content", STR, "none normal", "normal"),
    ("text-decoration-line", INT, "none underline overline line-through", "none"),
    ("vertical-align", LEN | PCT, "baseline sub super top text-top middle bottom text-bottom", "baseline"),
    ("outline-width", LEN, "thin medium thick", 3),
    ("outline-style", 0, "auto " + BSTYLE, "none"),
    ("outline-color", COLOR, "", "currentcolor"),
    ("outline-offset", LEN, "", 0),
]

INHERITED = [
    ("visibility", 0, "visible hidden collapse", "visible"),
    ("accent-color", COLOR, AUTO, AUTO),
    ("fill", COLOR | URL, "none auto", AUTO),
    ("stroke", COLOR | URL, "none auto", AUTO),
    ("color", COLOR, "", "black"),
    ("font-family", STR, "", "family"),
    ("font-size", LEN | PCT, "xx-small x-small small medium large x-large xx-large xxx-large smaller larger", 16),
    ("font-weight", NUM, "normal bold bolder lighter", 400),
    ("font-style", 0, "normal italic oblique", "normal"),
    ("line-height", LEN | PCT | NUM, "normal", "normal"),
    ("text-align", 0, "left right center justify start end -internal-center -webkit-center -moz-center -webkit-left -webkit-right -moz-left -moz-right", "start"),
    ("text-indent", LEN | PCT, "", 0),
    ("text-transform", 0, "none uppercase lowercase capitalize", "none"),
    ("white-space", 0, "normal nowrap pre pre-wrap pre-line break-spaces", "normal"),
    ("list-style-type", 0, "disc circle square decimal decimal-leading-zero lower-alpha upper-alpha lower-latin upper-latin lower-roman upper-roman none", "disc"),
    ("list-style-position", 0, "outside inside", "outside"),
    ("list-style-image", URL, "none", "none"),
    ("border-collapse", 0, "separate collapse", "separate"),
    ("border-spacing-h", LEN, "", 0),
    ("border-spacing-v", LEN, "", 0),
    ("caption-side", 0, "top bottom", "top"),
    ("cursor", 0, "auto default none context-menu help pointer progress wait cell crosshair text vertical-text "
     "alias copy move no-drop not-allowed grab grabbing e-resize n-resize ne-resize nw-resize s-resize se-resize "
     "sw-resize w-resize ew-resize ns-resize nesw-resize nwse-resize col-resize row-resize all-scroll zoom-in zoom-out", AUTO),
    ("pointer-events", 0, "auto none", AUTO),
    ("scroll-behavior", 0, "auto smooth", AUTO),
    ("letter-spacing", LEN, "normal", "normal"),
    ("word-spacing", LEN, "normal", "normal"),
    ("word-break", 0, "normal break-all keep-all break-word", "normal"),
    ("overflow-wrap", 0, "normal break-word anywhere", "normal"),
    ("-x-decorations", INT, "", 0),
]

# Everything else the code names, or that shorthands set.
EXTRA = "inherit initial unset revert revert-layer currentcolor transparent family number black"

PROPS = OWN + INHERITED

def ident(s):
    return s.lstrip("-").replace("-", "_").upper()

words = []
def add(w):
    if w and w not in words:
        words.append(w)

for _, _, kws, init in PROPS:
    for w in kws.split():
        add(w)
    if isinstance(init, str):
        add(init)
for w in EXTRA.split():
    add(w)

out = []
w = out.append
w("// css/props.cst — every longhand property and keyword. GENERATED by tools/gen_props.py.")
w("//")
w("// A computed style is three arrays indexed by property, so inheriting, resetting and")
w("// copying a value are one line each and need no knowledge of what the value means:")
w("//   i[p]  a keyword (K_*), or a colour, or a pointer to a string; 0 for a length")
w("//   f[p]  pixels, or a plain number")
w("//   p[p]  the percentage part of a length")
w("")
for n, (name, *_rest) in enumerate(PROPS):
    w("let is i64 as P_%s with imut = %d;" % (ident(name), n))
w("let is i64 as P_COUNT with imut = %d;" % len(PROPS))
w("let is i64 as P_INHERITED with imut = %d;" % len(OWN))
w("")
for n, name in enumerate(words):
    w("let is i64 as K_%s with imut = %d;" % (ident(name), n + 1))
w("")
w("let is i64 as F_LEN with imut = %d;" % LEN)
w("let is i64 as F_PCT with imut = %d;" % PCT)
w("let is i64 as F_NUM with imut = %d;" % NUM)
w("let is i64 as F_COLOR with imut = %d;" % COLOR)
w("let is i64 as F_URL with imut = %d;" % URL)
w("let is i64 as F_STR with imut = %d;" % STR)
w("let is i64 as F_INT with imut = %d;" % INT)
w("")
w("struct Values {")
w("    i as [P_COUNT]i64;")
w("    f as [P_COUNT]f64;")
w("    p as [P_COUNT]f64;")
w("}")
w("")
w("let is *u8 as _PROPS with imut = \"%s \";" % " ".join(p[0] for p in PROPS))
w("let is *u8 as _KEYWORDS with imut = \"%s \";" % " ".join(words))
w("")
w("fn _lower(c as i64) as i64 {")
w("    if (c >= 65 && c <= 90) { return c + 32; }")
w("    return c;")
w("}")
w("")
w("// Which word of a space-separated list s[0..n] is, ignoring case; -1 for none.")
w("fn _word(list as *u8, s as *u8, n as i64) as i64 {")
w("    let is i64 as at with mut = 0;")
w("    let is i64 as k with mut = 0;")
w("    while (list[at] != 0) {")
w("        let is i64 as i with mut = 0;")
w("        while (i < n && _lower(cast(i64, s[i])) == cast(i64, list[at + i])) { i = i + 1; }")
w("        if (i == n && list[at + i] == 32) { return k; }")
w("        while (list[at] != 32) { at = at + 1; }")
w("        at = at + 1;")
w("        k = k + 1;")
w("    }")
w("    return 0 - 1;")
w("}")
w("")
w("fn prop_lookup(s as *u8, n as i64) as i64 { return _word(_PROPS, s, n); }")
w("")
w("// The keyword's K_ number, 0 for a word this browser has no use for.")
w("fn kw_lookup(s as *u8, n as i64) as i64 { return _word(_KEYWORDS, s, n) + 1; }")
w("")
w("fn in_list(list as *u8, s as *u8, n as i64) as i64 {")
w("    if (_word(list, s, n) >= 0) { return 1; }")
w("    return 0;")
w("}")
w("")
w("fn flags_of(p as i64) as i64 {")
for name, flags, _, _ in PROPS:
    if flags:
        w("    if (p == P_%s) { return %d; }" % (ident(name), flags))
w("    return 0;")
w("}")
w("")
w("// The keywords a property takes, each followed by a space. Null for none.")
w("fn keywords_of(p as i64) as *u8 {")
for name, _, kws, _ in PROPS:
    if kws:
        w("    if (p == P_%s) { return \"%s \"; }" % (ident(name), kws))
w("    return null;")
w("}")
w("")
w("fn set_initial(v as *Values) as void {")
for name, _, _, init in PROPS:
    p = "P_" + ident(name)
    if isinstance(init, str):
        if init == "black":
            w("    v.i[%s] = 4278190080;" % p)
        elif init == "currentcolor":
            w("    v.i[%s] = 0 - 1;" % p)
        elif init == "transparent":
            w("    v.i[%s] = 0;" % p)
        elif init == "family":
            w("    v.i[%s] = cast(i64, \"serif\");" % p)
        else:
            w("    v.i[%s] = K_%s;" % (p, ident(init)))
    else:
        w("    v.f[%s] = %s;" % (p, float(init)))
w("}")
print("\n".join(out))
