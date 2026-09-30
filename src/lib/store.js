import { byId, engOf, linesFor, ledger, lineTotal, hash32, rng, LINES } from './logic.js';
import { PARTS } from './data.js';

/* =========================================================
   THE DRAFT — this is what makes the form survive a tab switch.
   It lives outside React state, so switching tabs never clears it.
   ========================================================= */
export var DRAFT=null;   /* {deal, eng, lines:[], verified:false} */

/* ---------------------------------------------------------
   A tiny external store: every mutation below calls bump(),
   which notifies subscribers so the tree re-renders — the same
   role render() played in the original hash-router version.
   --------------------------------------------------------- */
var version=0;
var listeners=new Set();
export function bump(){ version++; listeners.forEach(function(l){ l(); }); }
export function subscribe(cb){ listeners.add(cb); return function(){ listeners.delete(cb); }; }
export function getVersion(){ return version; }

/* the segregation picker on the BOM page — just a plain module var, like BOMCUT */
export var BOMCUT='status';
export function setCut(v){ BOMCUT=v; bump(); }

/* ---------------------------------------------------------
   Routing — identical semantics to the original go()/hashchange.
   --------------------------------------------------------- */
export function go(h){
  if(location.hash===h){ bump(); } else { location.hash=h; }
}
export function getHash(){ return location.hash || '#/'; }

var T=null;
export var TOAST_LISTENERS=new Set();
export function toast(msg){
  TOAST_LISTENERS.forEach(function(fn){ fn(msg); });
}

export function startDraft(dealId, engId, edit){
  var d=byId(dealId), e=engOf(d,engId);
  if(!DRAFT || DRAFT.eng!==engId){
    var lines=[];
    if(edit && e.bom){
      /* Update BOM opens the same form with the saved lines already in it */
      lines=linesFor(e).map(function(l,i){
        return {no:i+1, code:l.code, part:l.part, qty:l.qty, stock:l.stock,
                price:l.price, isNew:l.isNew, note:l.note};
      });
    } else {
      /* a few lines already typed in, so the retained state is visible */
      var seed=rng('DRAFT-'+engId), pre=(e.model.indexOf('Perkins')===0?'PK-2':'DZ-04');
      for(var i=0;i<5;i++){
        var qty=1+Math.floor(seed()*6);
        var stock=seed()<0.55 ? qty+Math.floor(seed()*4) : Math.floor(seed()*qty);
        lines.push({no:i+1, code:pre+String(100000+Math.floor(seed()*899999)),
          part:PARTS[Math.floor(seed()*PARTS.length)], qty:qty, stock:stock,
          price:Math.round((28+seed()*520)*100)/100, isNew:false, note:''});
      }
    }
    DRAFT={deal:dealId, eng:engId, lines:lines, verified:false, edit:!!edit};
  }
}
/* the form is only on screen on the BOM tab of its own deal — on any other tab
   the draft is kept but hidden, and the deals pane stays live */
export function formOpen(){
  if(!DRAFT) return false;
  var h=location.hash||'';
  return h.indexOf('/bom')>0 && h.indexOf(DRAFT.deal)>0 && h.indexOf('/bom/view/')<0;
}
export function draftTotal(){ return DRAFT? DRAFT.lines.reduce(function(a,l){ return a+lineTotal(l); },0) : 0; }
/* the availability check on the open form draws on what the deal's other BOMs
   have already taken, so it tells him the truth and not a stale stock figure */
export function draftShort(){
  if(!DRAFT) return [];
  var d=byId(DRAFT.deal), led=ledger(d), left={}, out=[];
  for(var k in led.left) left[k]=led.left[k];
  DRAFT.lines.forEach(function(l){
    var avail = (left[l.code]!==undefined) ? left[l.code] : l.stock;
    var take=Math.min(avail, l.qty);
    left[l.code]=avail-take;
    l.take=take;
    l.shortQty=l.qty-take;
    if(l.shortQty>0) out.push(l);
  });
  return out;
}

export function openCreate(dealId, engId){
  go('#/deals/'+dealId+'/bom/create/'+engId);
}
export function openEdit(dealId, engId){
  go('#/deals/'+dealId+'/bom/edit/'+engId);
}
export function closeDraft(){
  var back = DRAFT ? '#/deals/'+DRAFT.deal+'/bom' : null;
  DRAFT=null;
  if(back) go(back); else bump();   /* leave the create route or it reopens */
}
export function toggleVerify(){ if(DRAFT){ DRAFT.verified=!DRAFT.verified; bump(); } }
/* every edit writes back to DRAFT, so the form survives a tab switch */
export function setNote(i,v){ if(DRAFT && DRAFT.lines[i]) DRAFT.lines[i].note=v; }
export function setQty(i,v){
  if(!DRAFT || !DRAFT.lines[i]) return;
  DRAFT.lines[i].qty=Math.max(0, parseInt(v,10)||0);
  DRAFT.verified=false;                 /* the quantity changed — check stock again */
  bump();
}
export function removeLine(i){
  if(!DRAFT) return;
  DRAFT.lines.splice(i,1);
  DRAFT.verified=false;
  bump();
}
export function addLine(){
  if(!DRAFT) return;
  var d=byId(DRAFT.deal), e=engOf(d,DRAFT.eng);
  var pre=(e.model.indexOf('Perkins')===0?'PK-2':'DZ-04'), used={};
  DRAFT.lines.forEach(function(l){ used[l.part]=1; });
  var pick=PARTS.filter(function(p){ return !used[p]; })[0] || PARTS[0];
  DRAFT.lines.push({no:DRAFT.lines.length+1,
    code:pre+String(100000+hash32(pre+pick)%899999), part:pick, qty:1,
    stock:hash32(pick)%8, price:Math.round((28+hash32(pick)%700)*100)/100,
    isNew:false, note:''});
  DRAFT.verified=false;
  bump();
}
export function cloneFrom(engId){
  if(!DRAFT || !engId) return;
  var d=byId(DRAFT.deal), src=engOf(d,engId);
  if(!src || !src.bom) return;
  DRAFT.lines=linesFor(src).map(function(l,i){
    return {no:i+1, code:l.code, part:l.part, qty:l.qty, stock:l.stock,
            price:l.price, isNew:l.isNew, note:l.note};
  });
  DRAFT.verified=false;                 /* the stock check has to be done again */
  toast(DRAFT.lines.length+' lines copied from '+src.tag+' · '+src.bom+' — check availability again');
  bump();
}
export function pickItem(value){
  if(value==='__new'){
    toast('Add New Item — the item is created in Creator, then pushed to Inventory');
    return true; /* caller should reset the select back to index 0 */
  }
  return false;
}

var NEXTBOM=90;
export function submitDraft(){
  if(!DRAFT || !DRAFT.verified) return;
  var d=byId(DRAFT.deal), e=engOf(d,DRAFT.eng), shorts=draftShort(), was=!!e.bom;

  /* the draft becomes the saved bill of materials */
  var lines=DRAFT.lines.map(function(l,i){
    return {no:i+1, code:l.code, part:l.part, qty:l.qty, stock:l.stock,
            price:l.price, isNew:l.isNew, note:l.note};
  });
  if(!e.bom) e.bom='BOM-'+(NEXTBOM++);
  LINES[e.bom]=lines;
  d._led=null;                          /* the stock pool is recounted with this BOM in it */
  e.val=Math.round(lines.reduce(function(a,l){ return a+lineTotal(l); },0)*100)/100;
  e.st='pending';                       /* Create BOM is gone — it is View BOM now */
  e.fresh=true;
  e.note=(was?'Resubmitted':'Submitted')+' just now · with the Factory Manager';

  toast((was?'BOM updated for ':'BOM created for ')+e.id+' · '+e.bom+' · '+
        shorts.length+' item'+(shorts.length!==1?'s':'')+
        (was?' on':' added to')+' the purchase request for '+d.id+' · Factory Manager notified');
  var deal=DRAFT.deal, eng=DRAFT.eng;
  DRAFT=null;
  go('#/deals/'+deal+'/bom/view/'+eng);   /* straight to the page he just created */
}
