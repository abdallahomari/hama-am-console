import { DEALS, PARTS, NOTES, ST } from './data.js';

export function hash32(s){ var h=2166136261; for(var i=0;i<s.length;i++){ h^=s.charCodeAt(i); h=Math.imul(h,16777619); } return h>>>0; }
export function rng(s){ var x=hash32(s)||1; return function(){ x=(Math.imul(x,1664525)+1013904223)>>>0; return x/4294967296; }; }

export var LINES={};
export function linesFor(e){
  if(!e.bom) return [];
  if(LINES[e.bom]) return LINES[e.bom];
  var r=rng(e.bom), pre=(e.model.indexOf('Perkins')===0?'PK-2':'DZ-04');
  /* an item code identifies the item, so the same part in two BOMs is the same
     item and the purchase request can add the quantities together */
  var pool=PARTS.slice();
  for(var s=pool.length-1;s>0;s--){ var j=Math.floor(r()*(s+1)), t=pool[s]; pool[s]=pool[j]; pool[j]=t; }
  var n=26+Math.floor(r()*10), out=[];
  for(var i=0;i<n;i++){
    var name=pool[i];
    var qty=1+Math.floor(r()*6);
    var isNew=r()<0.012;
    var roll=r(), stock;
    if(isNew)          stock=0;
    else if(roll<0.955) stock=qty+Math.floor(r()*6);
    else if(roll<0.985) stock=Math.max(1,Math.floor(qty*r()));
    else                stock=0;
    out.push({no:i+1,
      code:isNew? 'NEW-'+(100+hash32(name)%899) : pre+String(100000+hash32(pre+name)%899999),
      part:name, qty:qty, stock:stock, price:Math.round((28+r()*760)*100)/100, isNew:isNew,
      note: r()<0.12 ? NOTES[Math.floor(r()*NOTES.length)] : ''});
  }
  var raw=out.reduce(function(a,l){ return a+l.qty*l.price; },0), run=0, f=e.val/raw;
  out.forEach(function(l,i){
    l.price=Math.round(l.price*f*100)/100;
    if(i<out.length-1) run+=Math.round(l.qty*l.price*100)/100;
  });
  var last=out[out.length-1];
  last.price=Math.round(((e.val-run)/last.qty)*100)/100;
  if(last.price<=0) last.price=0.01;
  e.val=Math.round(out.reduce(function(a,l){ return a+Math.round(l.qty*l.price*100)/100; },0)*100)/100;
  LINES[e.bom]=out;
  return out;
}

/* =========================================================
   STOCK LEDGER — one pool of stock per deal.
   If BOM-1 asks 20 bearings and only 10 are on hand it takes the 10 and is
   short 10. The next BOM asking 20 finds nothing left and is short 20.
   The purchase request therefore says 30, not 20.
   ========================================================= */
export function dealOfEngine(e){
  for(var i=0;i<DEALS.length;i++){ if(DEALS[i].engines.indexOf(e)>=0) return DEALS[i]; }
  return null;
}
export function ledger(d){
  if(d._led) return d._led;
  var onHand={}, left={};
  d.engines.forEach(function(e){ if(e.bom) linesFor(e); });
  /* one stock figure per item code, whichever BOM mentions it first */
  d.engines.forEach(function(e){
    if(!e.bom) return;
    LINES[e.bom].forEach(function(l){
      if(onHand[l.code]===undefined){ onHand[l.code]=l.stock; left[l.code]=l.stock; }
    });
  });
  /* walk the BOMs in order and draw down the pool */
  d.engines.forEach(function(e){
    if(!e.bom) return;
    LINES[e.bom].forEach(function(l){
      var take=Math.min(left[l.code]||0, l.qty);
      left[l.code]=(left[l.code]||0)-take;
      l.take=take;
      l.shortQty=l.qty-take;
    });
  });
  d._led={onHand:onHand, left:left};
  return d._led;
}
export function shortFor(e){
  var d=dealOfEngine(e);
  if(d) ledger(d);
  return linesFor(e).filter(function(l){ return (l.shortQty||0)>0; });
}

/* the purchase request: one line per item for the whole deal, never per engine */
export function dealShort(d){
  var led=ledger(d), by={}, out=[];
  d.engines.forEach(function(e){
    if(!e.bom) return;
    LINES[e.bom].forEach(function(l){
      if(!by[l.code]){
        by[l.code]={code:l.code, part:l.part, isNew:l.isNew, need:0,
                    stock:led.onHand[l.code]||0, from:[]};
        out.push(by[l.code]);
      }
      by[l.code].need+=l.qty;
      if(by[l.code].from.indexOf(e.bom)<0) by[l.code].from.push(e.bom);
    });
  });
  return out.filter(function(i){ return i.need>i.stock; });
}
export function lineTotal(l){ return Math.round(l.qty*l.price*100)/100; }

/* =========================================================
   HELPERS
   ========================================================= */
export function money(v){ return (v||0).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}); }
export function byId(id){ for(var i=0;i<DEALS.length;i++){ if(DEALS[i].id===id) return DEALS[i]; } return null; }
export function countSt(d,s){ var n=0; d.engines.forEach(function(e){ if(e.st===s) n++; }); return n; }
export function needCount(d){ var n=0; d.engines.forEach(function(e){ if(ST[e.st].need) n++; }); return n; }
export function bomDone(d){ var n=0; d.engines.forEach(function(e){ if(e.bom) n++; }); return n; }
export function dealBomValue(d){ var t=0; d.engines.forEach(function(e){ linesFor(e); t+=e.val||0; }); return Math.round(t*100)/100; }
export function dealGroup(d){ return bomDone(d)===0 ? 'notcreated' : (bomDone(d)<d.engines.length ? 'inprogress' : 'created'); }
export function engOf(d,id){ for(var i=0;i<d.engines.length;i++){ if(d.engines[i].id===id) return d.engines[i]; } return null; }

/* ---------------------------------------------------------
   How far this BOM has got:
   BOM created -> Purchase request -> Purchase order -> Factory Manager
   --------------------------------------------------------- */
export function chainOf(e){
  if(!e.bom) return null;
  var sh=shortFor(e).length, r=rng('CHAIN-'+e.bom), n=r();
  /* a BOM he has just submitted can only be at "purchase request created" */
  var st = sh===0 ? 'nopr' : e.fresh ? 'pr' : (n<0.34 ? 'pr' : (n<0.74 ? 'po' : 'done'));
  return { short:sh, st:st,
    pr: sh ? 'PR-'+(30+Math.floor(r()*40)) : '',
    po: (st==='po'||st==='done') ? 'PO-'+(110+Math.floor(r()*80)) : '',
    prDate:'18 Sep 2026', poDate:'20 Sep 2026' };
}

/* =========================================================
   BOM / PR listings
   ========================================================= */
export function allBoms(){
  var all=[];
  DEALS.forEach(function(d){ d.engines.forEach(function(e){ if(e.bom){ linesFor(e); all.push({d:d,e:e}); } }); });
  return all;
}
export function findBom(no){
  for(var i=0;i<DEALS.length;i++){
    var d=DEALS[i];
    for(var j=0;j<d.engines.length;j++){ if(d.engines[j].bom===no) return {d:d, e:d.engines[j]}; }
  }
  return null;
}

/* =========================================================
   CUSTOMERS
   ========================================================= */
export function custId(name){ return name.replace(/[^A-Za-z0-9]+/g,'-'); }
export function CUSTOMERS(){
  var seen={}, out=[];
  DEALS.forEach(function(d){
    if(!seen[d.cust]){ seen[d.cust]={name:d.cust, id:custId(d.cust), deals:[]}; out.push(seen[d.cust]); }
    seen[d.cust].deals.push(d);
  });
  return out;
}
export function custById(id){
  var all=CUSTOMERS();
  for(var i=0;i<all.length;i++){ if(all[i].id===id) return all[i]; }
  return null;
}
export function custStats(c){
  var eng=0, bom=0, val=0, need=0, short=0;
  c.deals.forEach(function(d){
    eng+=d.engines.length; bom+=bomDone(d); val+=dealBomValue(d);
    need+=needCount(d); short+=dealShort(d).length;
  });
  return {eng:eng, bom:bom, val:Math.round(val*100)/100, need:need, short:short};
}
