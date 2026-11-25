// Survives collections: linked structures, closures, generators, async, strings, regex, Map.
function Node(l,r){this.l=l;this.r=r}
function mk(d){return d===0?new Node(null,null):new Node(mk(d-1),mk(d-1))}
function ck(n){return n.l===null?1:1+ck(n.l)+ck(n.r)}
var keep=mk(14),tot=0;for(var i=0;i<40;i++)tot+=ck(mk(12));console.log(tot,ck(keep));
var m=new Map(),ks=[];for(var i=0;i<20000;i++){var k='key'+i;m.set(k,{v:i,s:k+'!'});if(i%1000==0)ks.push(k)}
for(var i=0;i<200000;i++){var t={a:i,b:[i,i+1],c:'x'+(i%7)}}
console.log(m.size,ks.map(k=>m.get(k).s).join().length);
function* g(){var a=[];for(var i=0;;i++){a.push('s'+i);if(a.length>50)a.shift();yield a.join('').length}}
var it=g(),last;for(var i=0;i<20000;i++)last=it.next().value;console.log(last);
var fs=[];for(let i=0;i<1000;i++)fs.push(()=>'c'+i);for(var q=0;q<200000;q++){var z=[q]}console.log(fs.map(f=>f()).join('').length);
var s='';for(var i=0;i<20000;i++)s+=String.fromCharCode(97+i%26);var cnt=0;for(var i=0;i<300;i++){cnt+=s.replace(/a/g,'bb').length;cnt+=s.split('b').length}console.log(cnt);
var dyn={};for(var i=0;i<100000;i++){dyn['k'+(i%5000)]=i}console.log(Object.keys(dyn).length,dyn.k77);
for(var i=0;i<100000;i++){var o={};o['tmp'+i]=1}console.log('dyn ok');
var ps=[];(async function(){var sum=0;for(var i=0;i<5000;i++){var arr=await Promise.resolve(new Array(100).fill(i));sum+=arr[99]}console.log('async',sum)})();
var ws=new WeakMap();var ok={};ws.set(ok,1);for(var i=0;i<300000;i++){var t=[i]}console.log(ws.get(ok));
class C{#p=1;get p(){return this.#p}}var cs=[];for(var i=0;i<50000;i++){var c=new C();if(i%100==0)cs.push(c)}console.log(cs.reduce((a,c)=>a+c.p,0));
setTimeout(function(){var a=[];for(var i=0;i<300000;i++){a=[a.length,i]}console.log('timer',a[1])},1);
