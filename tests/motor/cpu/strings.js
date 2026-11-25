for(var __r=0;__r<3;__r++){
var words = []; for (var i = 0; i < 5000; i++) { words.push("w" + (i * 7)); }
var counts = {};
for (var r = 0; r < 80; r++) { for (var i = 0; i < 5000; i++) { var k = words[i]; counts[k] = (counts[k] || 0) + 1; } }
var s = ""; for (var i = 0; i < 400000; i++) { s += String.fromCharCode(97 + (i % 26)); }
var h = 0; for (var i = 0; i < s.length; i++) { h = (h * 31 + s.charCodeAt(i)) & 16777215; }
console.log(counts["w700"], s.length, h);
}
