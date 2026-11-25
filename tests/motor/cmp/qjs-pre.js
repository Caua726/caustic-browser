globalThis.Buffer=globalThis.Buffer||{from(){return{toString(){return ''}}}};
globalThis.Intl=globalThis.Intl||{Collator:function(){this.compare=(a,b)=>a<b?-1:a>b?1:0},NumberFormat:function(){this.format=String},DateTimeFormat:function(){this.format=String},Segmenter:function(){this.segment=s=>[...s].map(x=>({segment:x}))}};
