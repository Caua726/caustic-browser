// classes
class A { #x; static s=5; y=2; constructor(a){this.a=a} get g(){return this.a*2} set g(v){this.a=v} m(){return 'A.m'} static sm(){return 'sm'} toString(){return 'A('+this.a+')'} }
class B extends A { z=3; constructor(a){super(a);this.b=1} m(){return 'B>'+super.m()} }
var b=new B(4); console.log(b.g,b.m(),A.sm(),A.s,b.y,b.z,String(b),b instanceof A,b instanceof B,B.name===undefined?'noname':'name');
b.g=9; console.log(b.a,Object.keys(b).join());
// destructuring
var {p,q:{r=7}={},...rest}={p:1,x:2,y:3}; console.log(p,r,JSON.stringify(rest));
var [h,,t=5,...more]=[1,2,undefined,4,5]; console.log(h,t,more.join());
function df(a,b=a+1,{c}={c:3},...d){return [a,b,c,d.length].join()} console.log(df(1),df(1,2,{c:9},7,8));
// spread/optional
var o1={a:1,b:{c:2}},n1=null; console.log(o1?.b?.c,n1?.x,n1?.x.y.z,o1.f?.(),n1??'dflt',0??1,0||1);
let la=null; la??=3; la||=4; la&&=5; console.log(la,2**10,(-2)**3);
console.log(Math.max(...[1,5,3]),[...'abc'].join('-'),[...new Set([1,1,2])].length);
// closures per-iteration
var fs=[];for(let i=0;i<3;i++)fs.push(()=>i);console.log(fs.map(f=>f()).join());
// labels, switch
outer:for(var i=0;i<3;i++){for(var j=0;j<3;j++){if(j==1)continue outer;if(i==2)break outer;console.log(i,j)}}
function sw(x){switch(x){case 1:return 'one';case 'a':case 'b':return 'ab';default:return 'def'}} console.log(sw(1),sw('b'),sw(9));
// try
function tf(){try{return 'try'}finally{console.log('fin')}} console.log(tf());
function tg(){try{throw new TypeError('bad')}catch(e){return e.name+':'+e.message+':'+(e instanceof TypeError)+':'+(e instanceof Error)}} console.log(tg());
try{null.x}catch(e){console.log(e instanceof TypeError)} try{undefinedVar}catch(e){console.log(e.name)}
function deep(n){return deep(n+1)+1} try{deep(0)}catch(e){console.log(e.name)}
// generators
function* g1(){var x=yield 1;console.log('got',x);try{yield 2}finally{console.log('cleanup')}return 3}
var it=g1();console.log(JSON.stringify(it.next()),JSON.stringify(it.next('v')),JSON.stringify(it.return(9)),JSON.stringify(it.next()));
function* g2(){yield* [1,2];yield* g3()} function* g3(){yield 3} console.log([...g2()].join());
// async order
console.log('sync1');
setTimeout(()=>console.log('timeout'),0);
Promise.resolve().then(()=>console.log('micro1')).then(()=>console.log('micro2'));
(async()=>{console.log('as1');var v=await 5;console.log('as2',v);try{await Promise.reject(new Error('x'))}catch(e){console.log('caught',e.message)}return 7})().then(v=>console.log('asdone',v));
queueMicrotask(()=>console.log('qm'));
Promise.all([1,Promise.resolve(2)]).then(v=>console.log('all',v.join()));
Promise.allSettled([Promise.reject(1),2]).then(v=>console.log(JSON.stringify(v)));
Promise.race([new Promise(r=>setTimeout(r,20,'slow')),new Promise(r=>setTimeout(r,1,'fast'))]).then(console.log);
console.log('sync2');
// Map Set WeakMap
var m=new Map([[1,'a'],['1','b']]);var ko={};m.set(ko,'o').set(NaN,'n');console.log(m.size,m.get(1),m.get('1'),m.get(ko),m.get(NaN),m.has(2));m.delete(1);console.log([...m.keys()].length,[...m.values()].join());
m.forEach((v,k)=>{if(typeof k==='string')console.log(k,v)});
var st=new Set([3,1,3]);st.add(2);console.log([...st].join(),st.has(1),st.size);
var wm=new WeakMap();wm.set(ko,5);console.log(wm.get(ko),wm.has({}),wm.delete(ko),wm.has(ko));
// JSON
console.log(JSON.stringify({a:[1,{b:2}],c:'x"y\n',d:undefined,e:null,f:true},null,1));
console.log(JSON.stringify(JSON.parse('{"a":[1,2.5,{"b":"c\\n"}],"d":null,"e":false}')));
// arrays
var ar=[5,1,4];console.log(ar.sort().join(),ar.sort((a,b)=>b-a).join(),ar.reverse().join(),ar.indexOf(4),ar.includes(9),ar.slice(1).join(),ar.concat([7],8).join());
console.log([1,2,3].reduce((a,b)=>a+b),[1,[2,[3]]].flat(9).join(),[1,2].flatMap(x=>[x,x]).join(),Array.from({length:2},(_,i)=>i*2).join(),Array.of(1,2).length,new Array(3).fill(0).join());
var sp=[1,2,3,4];console.log(sp.splice(1,2,'a','b','c').join(),sp.join());sp.length=2;console.log(sp.join(),sp.length);
console.log(ar.find(x=>x>4),ar.findIndex(x=>x>99),ar.every(x=>x>0),ar.some(x=>x>4),ar.at(-1),[..."hi"].entries().next().value.join());
// strings
var s='Hello, World';console.log(s.length,s.toUpperCase(),s.slice(-5),s.substring(7,3),s.indexOf('o',5),s.split(', ').join('|'),s.replace('World','X'),s.charCodeAt(1),s[0],s.at(-1),s.padStart(14,'*'),s.padEnd(14,'-'),' x '.trim()+'|',s.startsWith('He'),s.endsWith('ld'),s.includes('lo,'),'ab'.repeat(2));
console.log(`t${1+1}x${'y'}`,typeof s,String(12),String(null),String(undefined),String(true),String([1,2]),String({}),1+'2','3'*'4',+'5',-'6',!!'',[]+[],[]+{});
// regex
console.log(/a(b+)c/.exec('xabbc').slice().join(),/(\d+)-(?<n>\d+)/.exec('10-20').groups.n,'a1b22'.replace(/\d+/g,m=>'['+m+']'),'x-y_z'.split(/[-_]/).join(),'aBc'.match(/b/i).index,'aaa'.match(/a/g).length,/^\s*$/.test('  '),/\bfoo\b/.test('a foo b'),/(a|b)*c/.test('ababc'),'2020-01-02'.replace(/(\d+)-(\d+)-(\d+)/,'$3/$2/$1'),/x(?=y)/.test('xy'),/x(?!y)/.test('xy'),/a{2,3}/.exec('aaaa')[0],/a+?/.exec('aaa')[0],/[^abc]/.exec('abcd')[0],/./.source);
var rg=/o/g;console.log(rg.test('foo'),rg.lastIndex,rg.test('foo'),rg.lastIndex,rg.test('foo'),rg.lastIndex,String(/a\/b/gi));
console.log([...'a1b2'.matchAll(/\d/g)].map(m=>m[0]).join());
// numbers
console.log(0.1+0.2,1/3,1e21,1e-7,100,-0,0/0,1/0,(255).toString(16),(0.5).toString(2),(3.14159).toFixed(2),(1.005).toFixed(1),parseInt('42px'),parseInt('ff',16),parseFloat('3.5x'),Number('12'),Number(''),Number('x'),Number(null),Number(true),Math.round(2.5),Math.round(-2.5),Math.floor(-1.5),Math.trunc(-1.5),5%3,-5%3,5.5%2,1<<31,1>>>0,-1>>>0,-1>>1,~5,5&3,5|3,5^3);
console.log(Number.isInteger(5),Number.isNaN(NaN),isNaN('x'),Number.MAX_SAFE_INTEGER,Math.abs(-3),Math.sign(-3),Math.min(1,2),Math.pow(2,0.5),Math.imul(3,4),Math.clz32(1),typeof Math.random());
// objects
var ob={b:1,a:2,1:3,[`k${1}`]:4,get v(){return 5},m(){return this.b}};console.log(Object.keys(ob).join(),ob.v,ob.m(),'a' in ob,delete ob.a,'a' in ob,Object.values(ob).length,Object.entries({x:1})[0].join());
var fr=Object.freeze({a:1});fr.a=2;console.log(fr.a,Object.isFrozen(fr));
var pr=Object.create({inh:1});pr.own=2;var ks=[];for(var k in pr)ks.push(k);console.log(ks.join(),pr.hasOwnProperty('inh'),Object.getPrototypeOf(pr).inh);
Object.defineProperty(pr,'hid',{value:1,enumerable:false});console.log(Object.keys(pr).join(),pr.hid,JSON.stringify(Object.getOwnPropertyDescriptor(pr,'hid')));
console.log(Object.assign({},{a:1},{b:2}).b,Object.fromEntries([['a',1]]).a,typeof null,typeof undefined,typeof function(){},typeof {},typeof [],typeof Symbol(),void 0);
var sy=Symbol('d');var so={[sy]:1};console.log(so[sy],sy.toString(),sy.description,Symbol.for('z')===Symbol.for('z'),Object.keys(so).length);
// functions
function fa(){return arguments.length+':'+this}console.log(fa.call('t',1,2),fa.apply('u',[1]),fa.bind('v',1)(2));
var named=function nm(n){return n<=0?0:n+nm(n-1)};console.log(named(3));
console.log((function(){return typeof this}).call(5)!==undefined,(()=>1)(),new (function(){this.x=1})().x);
var it2={*[Symbol.iterator](){yield 1;yield 2}};console.log([...it2].join());for(const [k,v] of Object.entries({a:1}))console.log(k,v);
var ctor=function(){};ctor.prototype.pm=function(){return 'pm'};console.log(new ctor().pm(),new ctor().constructor===ctor);
var d=new Date(Date.UTC(2020,1,29,12,30,5));console.log(d.toISOString(),d.getTime(),d.getUTCDay(),JSON.stringify(d));console.log(new Date('2021-03-04T05:06:07Z').getTime());
console.log(1==1,1=='1',null==undefined,null==0,''==0,[]==false,NaN==NaN,'a'<'b',2<'10',null>=0,undefined>=0);
console.log([1,2,3]+'',[,1].length,[1,2,3].length,[[1,2],[3]].toString(),String(function(){}).length>0);
