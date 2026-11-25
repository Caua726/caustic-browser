// QuickJS + linkedom, bundled. It has no network, so it reads the same files from disk.
import './qjs-pre.js';
import {parseHTML} from 'linkedom';
const std=globalThis.__std,os=globalThis.__os;
const root=scriptArgs[1],n=scriptArgs[2];
const read=p=>std.loadFile(root+p);
const html=read('/index.html');
const win=parseHTML(html);const d=win.document;
globalThis.window=win;globalThis.document=d;globalThis.location={href:'http://127.0.0.1/?n='+n,search:'?n='+n,origin:'http://127.0.0.1'};win.location=globalThis.location;
for(const k of ['HTMLElement','Node','Element','Event','navigator'])if(win[k]&&!globalThis[k])try{globalThis[k]=win[k]}catch(e){}
globalThis.MutationObserver=win.MutationObserver=win.MutationObserver||function(){this.observe=function(){};this.disconnect=function(){}};
globalThis.HTMLIFrameElement=win.HTMLIFrameElement=win.HTMLIFrameElement||function(){};
globalThis.setTimeout=os.setTimeout;globalThis.clearTimeout=os.clearTimeout;win.setTimeout=os.setTimeout;win.clearTimeout=os.clearTimeout;win.addEventListener=win.addEventListener||function(){};
globalThis.performance={now:()=>os.now()};
globalThis.queueMicrotask=globalThis.queueMicrotask||(f=>Promise.resolve().then(f));
globalThis.MessageChannel=function(){const a={onmessage:null},b={onmessage:null};a.postMessage=x=>os.setTimeout(()=>b.onmessage&&b.onmessage({data:x}),0);b.postMessage=x=>os.setTimeout(()=>a.onmessage&&a.onmessage({data:x}),0);this.port1=a;this.port2=b};
const srcs=[...d.querySelectorAll('script[src]')].map(s=>s.getAttribute('src'));
for(const s of srcs)(0,eval)('(function(){'+read(s)+'\n})()');
(function poll(){if(d.getElementById('result')){std.out.puts(d.documentElement.outerHTML+'\n');std.exit(0)}os.setTimeout(poll,1)})();
