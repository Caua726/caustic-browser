#!/bin/bash
# What one.sh needs: a private display, the page served, QuickJS's bundle. Stays in the background.
ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"; W=$ROOT/build/motor/cmp; mkdir -p $W
cd $ROOT/tests/motor/cmp
[ -x node_modules/.bin/esbuild ] || npm i --no-audit --no-fund jsdom linkedom esbuild >/dev/null 2>&1
node_modules/.bin/esbuild qjs-entry.js --bundle --format=esm --platform=neutral --main-fields=module,main --outfile=$W/qjs-bundle.mjs --log-level=warning --alias:linkedom=$PWD/node_modules/linkedom/esm/index.js
cp qjs-main.js $W/
Xvfb :79 -screen 0 1280x800x24 >/dev/null 2>&1 &
$ROOT/build/motor/srv $ROOT/tests/motor/site 5197 &
