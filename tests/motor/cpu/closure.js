for(var __r=0;__r<3;__r++){
function adder(k) { return function (x) { return x + k; }; }
var fs = []; for (var i = 0; i < 16; i++) fs.push(adder(i));
var v = 0;
for (var r = 0; r < 4000000; r++) { v = fs[r & 15](v) & 65535; }
console.log(v);
var a = []; for (var i = 0; i < 1000; i++) a.push(i);
var s = 0;
for (var r = 0; r < 4000; r++) { s = (s + a.map(x => x + 1).filter(x => x % 2 == 0).reduce((p, c) => p + c, 0)) & 65535; }
console.log(s);
}
