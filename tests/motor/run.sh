#!/bin/bash
# The engine against what Node printed, then the DOM suite against what Chromium printed.
# Run from the checkout, after `caustic-mk build browser`. Display :88 is private.
cd "$(dirname "$0")/../.."; O=build/motor/test; mkdir -p $O
caustic -q -O1 tools/motor_tojs.cst -o build/motor/tojs 2>/dev/null || exit 1
caustic -q -O1 tests/motor/srv.cst -o build/motor/srv 2>/dev/null || exit 1
MAIN='fn main() as i32 { js_main(cast(*i64, 0)); while (1 == 1) { let is i64 as w = js_next_timer(); if (w < 0) { break; } if (w > 0) { let is [2]i64 as ts; ts[0] = w / 1000; ts[1] = (w % 1000) * 1000000; syscall(35, &ts, 0); } js_tick(); } return 0; }'
fails=0
for c in a b g features; do
  build/motor/tojs tests/motor/cases/$c.js > $O/$c.gen || { echo "$c: not translated"; fails=$((fails+1)); continue; }
  { cat build/motor/rt.cst $O/$c.gen; echo "$MAIN"; } > $O/$c.cst
  caustic -q -O1 $O/$c.cst -o $O/$c 2>/dev/null
  if timeout 60 $O/$c 2>&1 | diff -q - tests/motor/cases/$c.expected >/dev/null; then echo "$c: same as Node"; else echo "$c: DIFFERS"; fails=$((fails+1)); fi
done
Xvfb :88 -screen 0 1280x800x24 >/dev/null 2>&1 & XP=$!
build/motor/srv tests/motor/dom 5196 & SP=$!
sleep 0.5
env -u WAYLAND_DISPLAY DISPLAY=:88 timeout 60 build/browser --run http://127.0.0.1:5196/ > $O/dom.html 2>/dev/null
kill $SP $XP 2>/dev/null
uv run --no-project python - "$O/dom.html" > $O/dom.txt <<'P'
import re,html,sys
m=re.search(r'<pre id="out">(.*?)</pre>',open(sys.argv[1]).read(),re.S)
print(html.unescape(m.group(1)) if m else 'NO RESULT')
P
if diff -q $O/dom.txt tests/motor/dom/expected.txt >/dev/null; then echo "dom: same as Chromium"; else echo "dom: DIFFERS"; diff $O/dom.txt tests/motor/dom/expected.txt | head -10 | cut -c1-160; fails=$((fails+1)); fi
# Then eval, the global scope, Date, cookies and location, against Chromium in UTC.
Xvfb :88 -screen 0 1280x800x24 -nolisten tcp >/dev/null 2>&1 & XP=$!
build/motor/srv tests/motor/eval 5198 & SP=$!
sleep 0.5
env -u WAYLAND_DISPLAY DISPLAY=:88 timeout 60 build/browser --run http://127.0.0.1:5198/ > $O/eval.html 2>/dev/null
kill $SP $XP 2>/dev/null
uv run --no-project python - "$O/eval.html" > $O/eval.txt <<'P'
import re,html,sys
m=re.search(r'<pre id="out">(.*?)</pre>',open(sys.argv[1],errors='replace').read(),re.S)
print(html.unescape(m.group(1)).strip() if m else 'NO RESULT')
P
if diff -q $O/eval.txt tests/motor/eval/expected.txt >/dev/null; then echo "eval: same as Chromium"; else echo "eval: DIFFERS"; diff $O/eval.txt tests/motor/eval/expected.txt | head -10 | cut -c1-160; fails=$((fails+1)); fi
# Then workers and what scripts ask of frames, against Chromium.
Xvfb :88 -screen 0 1280x800x24 -nolisten tcp >/dev/null 2>&1 & XP=$!
build/motor/srv tests/motor/worker 5192 & SP=$!
sleep 0.5
env -u WAYLAND_DISPLAY DISPLAY=:88 timeout 40 build/browser --run http://127.0.0.1:5192/ > $O/worker.html 2>/dev/null
kill $SP $XP 2>/dev/null
uv run --no-project python - "$O/worker.html" > $O/worker.txt <<'P'
import re,html,sys
m=re.search(r'<pre id="out">(.*?)</pre>',open(sys.argv[1]).read(),re.S)
print(html.unescape(m.group(1)) if m else 'NO RESULT')
P
if diff -q $O/worker.txt tests/motor/worker/expected.txt >/dev/null; then echo "worker: same as Chromium"; else echo "worker: DIFFERS"; diff $O/worker.txt tests/motor/worker/expected.txt | head -10 | cut -c1-200; fails=$((fails+1)); fi
# Then frames, on two origins, against Chromium.
Xvfb :88 -screen 0 1280x800x24 -nolisten tcp >/dev/null 2>&1 & XP=$!
build/motor/srv tests/motor/frame 5193 & SP=$!
build/motor/srv tests/motor/frame 5194 & SQ=$!
sleep 0.5
env -u WAYLAND_DISPLAY DISPLAY=:88 timeout 70 build/browser --run http://127.0.0.1:5193/ > $O/frame.html 2>/dev/null
kill $SP $SQ $XP 2>/dev/null
uv run --no-project python - "$O/frame.html" > $O/frame.txt <<'P'
import re,html,sys
m=re.search(r'<pre id="out">(.*?)</pre>',open(sys.argv[1],errors='replace').read(),re.S)
print(html.unescape(m.group(1)).strip() if m else 'NO RESULT')
P
if diff -q $O/frame.txt tests/motor/frame/expected.txt >/dev/null; then echo "frame: same as Chromium"; else echo "frame: DIFFERS"; diff $O/frame.txt tests/motor/frame/expected.txt | head -10 | cut -c1-160; fails=$((fails+1)); fi
exit $fails
