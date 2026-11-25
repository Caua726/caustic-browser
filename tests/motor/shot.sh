#!/bin/bash
# The React page in the real window on a private display, capped at 500 MB: a picture before and
# after two clicks, and the memory it took. Pictures in build/motor/shots.
cd "$(dirname "$0")/../.."; O=$PWD/build/motor/shots; mkdir -p $O; rm -f $O/*
unset WAYLAND_DISPLAY; export DISPLAY=:77 O
Xvfb :77 -screen 0 1280x800x24 >/dev/null 2>&1 & XP=$!
build/motor/srv tests/motor/site 5199 & SP=$!
sleep 0.5
systemd-run --user --scope -q -p MemoryMax=500M -p MemorySwapMax=0 bash -c '
  build/browser "http://127.0.0.1:5199/?n=0" > $O/stdout.txt 2> $O/stderr.txt & B=$!
  cg=/sys/fs/cgroup$(cut -d: -f3 /proc/self/cgroup)
  sleep ${WAIT:-5}
  import -window root $O/1-loaded.png
  xdotool mousemove 490 443; sleep 0.2; xdotool click 1; sleep 0.6; xdotool click 1; sleep 0.8
  import -window root $O/2-clicked.png
  cat $cg/memory.peak > $O/peak.txt
  kill $B
'
kill $SP $XP 2>/dev/null
