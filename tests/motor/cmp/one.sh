#!/bin/bash
# one.sh ENGINE N: one whole run of the React page with N clicks. Needs up.sh running.
# Engines: jsdom linkedom qjs chromium caustic caustic-cold. CAUSTIC_JS_OPT picks the level.
ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"; W=$ROOT/build/motor/cmp; mkdir -p $W
E=$1; N=$2; URL="http://127.0.0.1:5197/?n=$N"; O=$W/o.$$; CMP=$ROOT/tests/motor/cmp
case $E in
 chromium) C="chromium --headless=new --no-sandbox --disable-gpu --user-data-dir=$W/prof --virtual-time-budget=120000 --dump-dom $URL";;
 jsdom) C="node $CMP/jsdom-run.js $URL";;
 linkedom) C="node $CMP/linkedom-node.js $URL";;
 qjs) C="qjs --std -m $W/qjs-main.js $ROOT/tests/motor/site $N";;
 caustic-cold) rm -rf $ROOT/build/motor/cache; C="$ROOT/build/browser --run $URL";;
 caustic) C="$ROOT/build/browser --run $URL";;
esac
export C O
env -u WAYLAND_DISPLAY DISPLAY=:79 timeout 180 systemd-run --user --scope -q -p MemoryMax=1500M -p MemorySwapMax=0 bash -c '
 cg=/sys/fs/cgroup$(cut -d: -f3 /proc/self/cgroup)
 a=$(date +%s%N)
 /usr/bin/time -o $O.t -f "%U %S" $C > $O.out 2> $O.err
 rc=$?
 b=$(date +%s%N)
 echo "$(( (b-a)/1000000 )) $(tail -1 $O.t) $(( $(cat $cg/memory.peak)/1048576 )) $rc" > $O.m
'
read MS U S P RC < $O.m
R=$(rg -o 'final=[^<]*' $O.out | head -1)
echo "$E n=$N wall=${MS}ms cpu=$(awk "BEGIN{print $U+$S}")s peak=${P}MB rc=$RC | $R"
rm -f $O.*
