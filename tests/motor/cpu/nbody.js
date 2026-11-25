for(var __r=0;__r<3;__r++){
function Body(x, y, z, m) { this.x = x; this.y = y; this.z = z; this.vx = 0.1 * m; this.vy = 0.2 * m; this.vz = 0.3 * m; this.mass = m; }
var bs = [new Body(0, 0, 0, 39.47), new Body(4.84, -1.16, -0.10, 0.037), new Body(8.34, 4.12, -0.4, 0.011), new Body(12.89, -15.11, -0.22, 0.0017), new Body(15.37, -25.91, 0.17, 0.002)];
function adv(dt) {
  var n = bs.length;
  for (var i = 0; i < n; i++) {
    var a = bs[i];
    for (var j = i + 1; j < n; j++) {
      var b = bs[j], dx = a.x - b.x, dy = a.y - b.y, dz = a.z - b.z;
      var d2 = dx * dx + dy * dy + dz * dz, mag = dt / (d2 * Math.sqrt(d2));
      a.vx -= dx * b.mass * mag; a.vy -= dy * b.mass * mag; a.vz -= dz * b.mass * mag;
      b.vx += dx * a.mass * mag; b.vy += dy * a.mass * mag; b.vz += dz * a.mass * mag;
    }
  }
  for (var i = 0; i < n; i++) { var c = bs[i]; c.x += dt * c.vx; c.y += dt * c.vy; c.z += dt * c.vz; }
}
for (var s = 0; s < 200000; s++) adv(0.01);
console.log(Math.floor(bs[0].x * 1000000));
}
