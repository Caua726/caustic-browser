function add(a, b) { return a + b; }
console.log(add(2, 3), add("a", 1), 7 / 2, 6 / 2, 7 % 3, -7 % 3, 2147483647 + 1);
var o = { x: 1, y: "s" }; o.z = [1, 2, 3]; o.z.push(4);
console.log(o.x, o.y, o.z.length, o.z.join("-"), o["x"], typeof o, typeof add, typeof 1, typeof "a");
function counter() { var n = 0; return function () { n++; return n; }; }
var c = counter(); c(); console.log(c(), c());
class P { constructor(x) { this.x = x; } get1() { return this.x + 1; } }
var p = new P(41); console.log(p.get1());
function Q() { this.v = 5; } Q.prototype.twice = function () { return this.v * 2; };
console.log(new Q().twice());
var arrow = { v: 9, f: function () { var g = () => this.v; return g(); } }; console.log(arrow.f());
console.log([1, 2, 3].map(x => x * 2).filter(x => x > 2).reduce((a, b) => a + b, 0));
var s = ""; for (var i = 0; i < 5; i++) { if (i == 2) continue; s += i; } console.log(s);
var k = 0; while (true) { k++; if (k > 3) break; } console.log(k);
var d = 0; do { d++; } while (d < 3); console.log(d);
switch (2) { case 1: console.log("one"); case 2: console.log("two"); case 3: console.log("three"); break; default: console.log("d"); }
console.log(1 < 2 && "yes", 0 || "alt", null == undefined, null === undefined, 1 == 1.0, "a" < "b", !0);
console.log(5 & 3, 5 | 3, 5 ^ 3, ~5, 1 << 4, -16 >> 2, -1 >>> 28);
var x = 1; var y = x++ + ++x; console.log(x, y); x += 5; x *= 2; console.log(x);
console.log("abc".charCodeAt(1), String.fromCharCode(65), "hello".slice(1, 3), "abc".length, "abc"[1]);
for (const e of [10, 20]) console.log(e);
console.log(Math.floor(3.7), Math.sqrt(16), Math.abs(-2), Math.max(1, 2), Math.min(1, 2), 0.1 + 0.2 > 0.3);
var t = 0; var z = 3 > 2 ? 4 : 5; t = (1, 2); console.log(z, t, `v=${z}!`);
function f4(a, b, c, d) { return d === undefined ? "missing" : d; } console.log(f4(1), f4(1, 2, 3, 4));
var fact = function me(n) { return n < 2 ? 1 : n * fact(n - 1); }; console.log(fact(10));
var nested = { a: { b: { c: 7 } } }; nested.a.b.c += 1; console.log(nested.a.b.c);
var arr = []; arr[3] = 1; console.log(arr.length, arr[0], [1, [2, 3]].join("|"));
function hoisted() { return later(); function later() { return "up"; } } console.log(hoisted());
// this without a receiver: the global object, unless the code is strict
function sloppyThis(){return this===globalThis}
function strictThis(){"use strict";return this===undefined}
function strictInner(){"use strict";return (function(){return this===undefined})()}
var arrowInSloppy=function(){return (()=>this===globalThis)()};
class StrictMethod{m(){return (function(){return this===undefined})()}}
console.log(sloppyThis(),strictThis(),strictInner(),arrowInSloppy(),new StrictMethod().m(),sloppyThis.call(null),(function(){return this===globalThis}).call(undefined));
// Each function has its own arguments, and new on a bound function makes what its target makes.
function argsOuter(){var a0=arguments.length;var inner=function(){return arguments.length+":"+arguments[0]};return a0+"/"+inner("x",2,3)+"/"+(()=>arguments.length)()}
console.log(argsOuter(1,2));
function argsForward(P,I){var q=Array.prototype.slice.call(arguments,1);return function(){var D=q.slice();D.push.apply(D,arguments);return D.join()}}
console.log(argsForward(0,7)("V","W"));
function BoundC(a,b){this.a=a;this.b=b}
var bc=new (BoundC.bind(null,1))(2);console.log(bc.a,bc.b,bc instanceof BoundC,new (Function.prototype.bind.apply(BoundC,[null,3,4]))().b);
