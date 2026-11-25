// Node + jsdom: fetches page and scripts over HTTP, like a browser would.
const {JSDOM}=require('jsdom');
(async()=>{
 const url=process.argv[2];const base=new URL(url).origin;
 const html=await (await fetch(url)).text();
 const dom=new JSDOM(html,{url,runScripts:'outside-only',pretendToBeVisual:true});
 const w=dom.window;w.MessageChannel=MessageChannel;
 const srcs=[...w.document.querySelectorAll('script[src]')].map(s=>s.getAttribute('src'));
 const texts=await Promise.all(srcs.map(async s=>(await fetch(base+s)).text()));
 for(const t of texts)w.eval('(function(){'+t+'\n})()');
 const iv=setInterval(()=>{if(w.document.getElementById('result')){clearInterval(iv);process.stdout.write(w.document.documentElement.outerHTML+'\n',()=>process.exit(0))}},1);
})();
