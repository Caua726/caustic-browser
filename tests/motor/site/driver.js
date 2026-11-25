// Same driver in every engine: wait for the first render, click, and write what happened into the document.
(function(){
 var N=Number((location.search.match(/n=(\d+)/)||[])[1]||1000);
 var ch=new MessageChannel(),wake=null;ch.port1.onmessage=function(){var w=wake;wake=null;w()};
 function yld(){return new Promise(function(r){wake=r;ch.port2.postMessage(0)})}
 function btn(){var b=document.querySelector('button.counter')||document.querySelector('button');return b}
 var t0=performance.now();
 (function wait(){
  if(!btn()){setTimeout(wait,0);return}
  var t1=performance.now();
  (async function(){
    for(var i=0;i<N;i++){btn().click();await yld()}
    await yld();await yld();
    var t2=performance.now();
    var p=document.createElement('pre');p.id='result';
    p.textContent='final='+btn().textContent+' nodes='+document.querySelectorAll('*').length+' firstRenderMs='+(t1-t0).toFixed(1)+' clicksMs='+(t2-t1).toFixed(1);
    document.body.appendChild(p);
  })();
 })();
})();
