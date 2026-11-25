for(var __r=0;__r<3;__r++){
class Circle { constructor(r) { this.r = r; } area() { return this.r * this.r * 3; } }
class Rect { constructor(w, h) { this.w = w; this.h = h; } area() { return this.w * this.h; } }
class Tri { constructor(b, h) { this.b = b; this.h = h; } area() { return (this.b * this.h) >> 1; } }
var shapes = [];
for (var i = 0; i < 300; i++) { shapes.push(i % 3 == 0 ? new Circle(i % 7) : i % 3 == 1 ? new Rect(i % 5, 3) : new Tri(i % 11, 4)); }
var t = 0;
for (var r = 0; r < 60000; r++) { for (var i = 0; i < 300; i++) { t = (t + shapes[i].area()) & 1048575; } }
console.log(t);
}
