var inDoc=typeof document,inWin=typeof window,got=[];
onmessage=function(e){
  got.push(e.data);
  if(e.data==='lib'){importScripts('lib.js');return}
  if(e.data&&e.data.port){var p=e.ports[0];p.onmessage=function(m){p.postMessage('port got '+m.data)};p.postMessage('port ready');return}
  postMessage({echo:e.data,doc:inDoc,win:inWin,n:got.length});
};
