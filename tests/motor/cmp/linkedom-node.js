// Node + linkedom: same, with a lighter DOM.
const {parseHTML}=require('linkedom');
const vm=require('vm');
(async()=>{
 const url=process.argv[2];const u=new URL(url);
 const html=await (await fetch(url)).text();
 const win=parseHTML(html);const d=win.document;
 globalThis.window=win;globalThis.document=d;globalThis.location={href:url,search:u.search,origin:u.origin};win.location=globalThis.location;
 for(const k of ['HTMLElement','HTMLIFrameElement','Node','Element','Event','navigator'])if(win[k]&&!globalThis[k])try{globalThis[k]=win[k]}catch(e){}
 globalThis.MutationObserver=win.MutationObserver=win.MutationObserver||function(){this.observe=function(){};this.disconnect=function(){}};win.setTimeout=setTimeout;win.clearTimeout=clearTimeout;win.addEventListener=win.addEventListener||function(){};
 win.HTMLIFrameElement=win.HTMLIFrameElement||function(){};
 const srcs=[...d.querySelectorAll('script[src]')].map(s=>s.getAttribute('src'));
 const texts=await Promise.all(srcs.map(async s=>(await fetch(u.origin+s)).text()));
 for(const t of texts)(0,eval)('(function(){'+t+'\n})()');
 const iv=setInterval(()=>{if(d.getElementById('result')){clearInterval(iv);process.stdout.write(d.documentElement.outerHTML+'\n',()=>process.exit(0))}},1);
})();
