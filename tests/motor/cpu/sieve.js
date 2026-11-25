for(var __r=0;__r<3;__r++){
function sieve(n) {
  var a = new Array(n + 1), c = 0;
  for (var i = 2; i <= n; i++) a[i] = true;
  for (var i = 2; i <= n; i++) { if (a[i]) { c++; for (var j = i * 2; j <= n; j += i) a[j] = false; } }
  return c;
}
var t = 0; for (var r = 0; r < 1; r++) t += sieve(5000000);
console.log(t);
}
