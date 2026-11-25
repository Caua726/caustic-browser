for(var __r=0;__r<3;__r++){
var h = 0;
for (var i = 0; i < 40000000; i++) { h = (h ^ (i & 255)) + 1 | 0; }
console.log(h);
}
