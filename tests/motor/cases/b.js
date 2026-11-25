// UTF-16 over UTF-8
var a='ação 😀 é';console.log(a.length,a[1],a.charCodeAt(1),a.charAt(2),a.slice(5,7),a.indexOf('é'),a.lastIndexOf('o'),a.codePointAt(5),a.toUpperCase(),'ÁÉ'.toLowerCase(),a.substring(0,4),a.substr(-1),a.split('').length,[...a].length,a.padEnd(11,'*'));
var bb='😀';console.log(bb.length,bb.charCodeAt(0),bb.charCodeAt(1),bb[0]+bb[1]===bb,String.fromCharCode(0xD83D,0xDE00)===bb,String.fromCodePoint(0x1F600)===bb);
console.log(/ç/.exec('ação').index,'ação'.replace(/ã/,'a'),/^.{4}$/.test('ação'),/[à-ú]+/.exec('xação')[0],/é+/.exec('éééa')[0],/\W/.exec('aé').index,'a,é;b'.split(/[,;]/).join('|'),/\u00e7/.test('ç'),/[\u{1F600}]/u.test('😀'),'xé'.search(/é/),[...'éa'.matchAll(/./g)].length);
var rx=/é/g;rx.test('aéb');console.log(rx.lastIndex);
console.log(encodeURIComponent('a b&é'),decodeURIComponent('a%20b%26%C3%A9'),encodeURI('a b/é?x=1'),btoa('hello'),atob('aGVsbG8='),new TextDecoder().decode(new TextEncoder().encode('é')),new TextEncoder().encode('é').length);
// tagged
function tag(s,...v){return s.raw.join('|')+':'+s.join('|')+':'+v.join()}console.log(tag`a\n${1}b${2}`,String.raw===undefined);
// new.target
function NT(){return new.target===NT}console.log(new NT()instanceof NT,NT());class Abs{constructor(){this.t=new.target===Abs}}class Der extends Abs{}console.log(new Abs().t,new Der().t);
// static blocks and names
class SB{static x=1;static{this.y=this.x+1}}console.log(SB.y);
function named(a,b){}var anon=function(a){};var arrow=()=>{};var ob={meth(){},fld:function(){}};class Cn{m(){}}
console.log(named.name,named.length,anon.name,anon.length,arrow.name,ob.meth.name,ob.fld.name,Cn.name,new Cn().m.name,new Cn().constructor.name);
// private
class Pv{#a=1;#m(){return this.#a}get v(){return this.#m()}set v(x){this.#a=x}has(o){return true}}var pv=new Pv();pv.v=5;console.log(pv.v,Object.keys(pv).length,JSON.stringify(pv));
// async generators
async function*ag(){yield 1;var x=await Promise.resolve(2);yield x;return 3}
(async()=>{for await(var v of ag())console.log('ag',v);for await(var w of [Promise.resolve('p'),'q'])console.log('fa',w);var it=ag();console.log(JSON.stringify(await it.next()),JSON.stringify(await it.return(9)));})();
// proxy
var log=[];var px=new Proxy({a:1},{get(t,k,r){log.push('get:'+String(k));return k in t?t[k]:'dflt'},set(t,k,v){log.push('set:'+k);t[k]=v*2;return true},has(t,k){return k==='magic'||k in t},deleteProperty(t,k){log.push('del');delete t[k];return true},ownKeys(t){return['a','z']}});
console.log(px.a,px.b,'magic'in px,'no'in px);px.c=2;console.log(px.c,delete px.c,log.join());console.log(typeof new Proxy(function(){},{}),new Proxy(function(a){return a+1},{apply(t,th,args){return t(args[0])*10}})(1),new (new Proxy(function(){this.k=1},{}))().k,Array.isArray(new Proxy([],{})),new Proxy({x:1},{}).x,Object.keys(new Proxy({q:1},{})).join());
// typed arrays
var u8=new Uint8Array(3);u8[0]=300;u8[1]=-1;u8[5]=1;console.log(u8[0],u8[1],u8.length,u8[5],Array.isArray(u8),u8.join());var i8=new Int8Array([200]);var f32=new Float32Array([1.1]);var cl=new Uint8ClampedArray([300,-5,1.5]);var u32=new Uint32Array([-1]);var i16=new Int16Array([40000]);console.log(i8[0],f32[0],cl.join(),u32[0],i16[0],Uint8Array.BYTES_PER_ELEMENT,new Float64Array(2).byteLength,Array.from(new Uint8Array([1,2]).map(x=>x*2)).join(),[...new Uint8Array([7])].join(),new Uint8Array([1,2,3]).slice(1).length,new Uint16Array(new ArrayBuffer(8)).length);
// misc
console.log(new URLSearchParams('a=1&b=x%20y').get('b'),new URL('http://h.com:8/p/q?x=1#f').pathname,new URL('../r','http://h.com/p/q').host,structuredClone({a:[1]}).a[0]);
console.log(Object.prototype.toString.call([]),Object.prototype.toString.call(null),Object.prototype.toString.call(/x/),String(Symbol('q')),isFinite(1/0));
var e=new RangeError('m');console.log(e.name,e.message,String(e),e instanceof RangeError,Object.keys(e).length,typeof e.stack);class ME extends Error{constructor(m){super(m);this.name='ME'}}var me=new ME('z');console.log(String(me),me instanceof Error,me instanceof ME);
var ge=(function*(){})();console.log(typeof ge.next,typeof ge[Symbol.iterator]);
label:{console.log('in');break label;}
var getSet={_v:1,get v(){return this._v},set v(x){this._v=x+1}};getSet.v=1;console.log(getSet.v);console.log(((a,b=2)=>a+b)(1),(function(){'use strict';return this})()===undefined?'strict':'sloppy');
var w=[1,2,3];for(var i in w)console.log(i);for(var c of 'aé')console.log(c);console.log(Array.from('aé').length,Object.entries('ab').length);
