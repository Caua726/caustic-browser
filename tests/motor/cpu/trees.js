for(var __r=0;__r<3;__r++){
function make(d) { if (d == 0) return { l: null, r: null }; return { l: make(d - 1), r: make(d - 1) }; }
function check(t) { return t.l === null ? 1 : 1 + check(t.l) + check(t.r); }
var total = 0;
for (var i = 0; i < 8; i++) { total += check(make(18)); }
console.log(total);
}
