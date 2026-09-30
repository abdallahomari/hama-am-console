import { chainOf, linesFor, shortFor, money, lineTotal } from '../lib/logic.js';
import { go, openEdit, toast } from '../lib/store.js';

function KV({ k, v }){
  return <div className="kvl"><div className="k2">{k}</div><div className="v2">{v || <span className="muted">&mdash;</span>}</div></div>;
}
function MB({ k, children }){
  return <div className="mb"><b>{k}</b>{children}</div>;
}

export default function BomDetail({ d, e, ctx }){
  ctx = ctx || 'deal';
  var c=chainOf(e), lines=linesFor(e), sh=shortFor(e);

  /* --- the banner: headline + the alert set --- */
  var hl,ln,tone;
  if(e.st==='returned'){
    tone='bnr-red'; hl='Returned for revision by the Factory Manager';
    ln=<>&ldquo;{e.note||'Change requested.'}&rdquo; &mdash; correct the bill of materials and submit it again.</>;
  } else if(e.st==='approved'){
    tone='bnr-grn'; hl='Approved by the Factory Manager';
    ln=<>A proposal has been created for this deal. {
      c.st==='done'? 'Purchase request and purchase order are complete.' :
      c.st==='po'  ? 'Purchase order '+c.po+' is still in progress.' :
      c.st==='pr'  ? 'Purchase request '+c.pr+' is still waiting for a purchase order.' :
                     'Nothing on this bill of materials needed buying.'
    }</>;
  } else {
    tone = c.st==='done' || c.st==='nopr' ? 'bnr-blu' : 'bnr-amb';
    hl='Waiting for Factory Manager approval';
    ln = c.st==='nopr' ? 'Everything on this bill of materials is in stock, so no purchase request was needed.'
       : c.st==='pr'   ? 'Purchase request '+c.pr+' was created for '+c.short+' short item'+(c.short>1?'s':'')+'. Procurement has not raised a purchase order yet.'
       : c.st==='po'   ? 'Purchase request '+c.pr+' was converted to purchase order '+c.po+'. The order is in progress.'
       :                 'Purchase request '+c.pr+' and purchase order '+c.po+' are complete. The parts have been received.';
  }

  /* --- the chain of dots --- */
  var s3 = c.st==='nopr' ? 'skip' : c.st==='pr' ? 'now' : c.st==='po' ? 'now' : 'done';
  var steps=[
    {t:'BOM created', s:'done'},
    {t: c.short? 'Purchase request created' : 'No purchase request needed', s: c.short? 'done':'skip'},
    {t: c.st==='nopr' ? 'Purchase order'
      : c.st==='pr'   ? 'Purchase order not yet raised'
      : c.st==='po'   ? 'Purchase order in progress'
      :                 'Purchase order complete', s:s3},
    {t: e.st==='approved' ? 'Approved by Factory Manager'
      : e.st==='returned' ? 'Returned for revision'
      :                     'Waiting for Factory Manager', s: e.st==='approved'?'done':e.st==='returned'?'stop':'now'}
  ];
  var chain=steps.map(function(x,i){
    var dot = x.s==='done'?'✓' : x.s==='stop'?'!' : (i+1);
    return (
      <span key={i}>
        {i ? <span className={'cbar'+(steps[i-1].s==='done'||steps[i-1].s==='skip'?' done':'')}></span> : null}
        <span className={'cstep '+x.s}><span className="cd2">{dot}</span>{x.t}</span>
      </span>
    );
  });

  /* --- the small facts under the banner --- */
  var mini=(
    <div className="mini">
      <MB k="BOM"><span>{e.bom}</span></MB>
      <MB k="Purchase request">{c.pr ? <span>{c.pr}</span> : <em>not needed</em>}</MB>
      <MB k="Purchase order">{c.po ? <span>{c.po}</span> : <em>&mdash;</em>}</MB>
      <MB k="Lines"><span>{lines.length}</span></MB>
      <MB k="Items short"><span style={sh.length && c.st!=='done' ? {color:'#B4231A'} : undefined}>{sh.length}</span></MB>
      <MB k="Value"><span>{money(e.val)} SAR</span></MB>
    </div>
  );

  /* --- what he can do from here --- */
  var acts = e.st==='returned'
    ? <button className="btn pri sm" onClick={function(){ openEdit(d.id,e.id); }}>Update BOM</button>
    : e.st==='approved'
      ? <button className="btn out sm" onClick={function(){ toast('Proposal for '+d.id+' — opens the proposal record'); }}>View proposal</button>
      : <button className="btn sm" disabled title="It is with the Factory Manager — you cannot change it now">Update BOM</button>;

  var appr = e.st==='approved' ? <span className="pill p-grn">APPROVED</span>
           : e.st==='returned' ? <span className="pill p-red">REJECTED</span>
           :                     <span className="pill p-blu">PENDING</span>;

  var cards=(
    <div className="cols">
      <div className="col"><div className="card"><div className="ch"><span className="t">Bill of materials</span></div><div className="cb">
        <KV k="BOM Number" v={<span style={{fontFamily:'var(--m)',fontWeight:700}}>{e.bom}</span>} />
        <KV k="Deal" v={<><span style={{fontFamily:'var(--m)',fontWeight:700}}>{d.id}</span> &middot; {d.cust}</>} />
        <KV k="Engine" v={<><span style={{fontFamily:'var(--m)',fontWeight:700}}>{e.id}</span> &middot; {e.tag}</>} />
        <KV k="Engine Display" v={e.tag+' — '+e.model} />
        <KV k="Current BOM Stage" v="Planning" />
        <KV k="Is Estimated" v={<span className="pill p-gry">NO</span>} />
        <KV k="Consolidated" v={<span className="pill p-gry">NO</span>} />
        <KV k="Last Revised" v="21 Sep 2026" />
        <KV k="Total Value" v={<b>{money(e.val)} SAR</b>} />
      </div><div className="src"><span>Source <b>Repair_BOM</b></span><span></span></div></div></div>

      <div className="col">
        <div className="card"><div className="ch"><span className="t">Approval</span></div><div className="cb">
          <KV k="Approval Status" v={appr} />
          <KV k="Approved by" v={e.st==='approved'? 'Factory Manager' : ''} />
          <KV k="Approved On" v={e.st==='approved'? '18 Sep 2026' : ''} />
          <div className="para" style={{marginTop:'.5rem'}}><b>Review remarks</b>
            {e.st==='returned' ? (e.note||'Change requested.')
              : e.st==='approved' ? 'Approved as submitted. No changes requested.'
              : <span className="muted">Nothing recorded yet</span>}
          </div>
        </div><div className="src"><span>Set by the Factory Manager &middot; read only for you</span><span></span></div></div>

        <div className="card"><div className="ch"><span className="t">Purchase</span></div><div className="cb">
          <KV k="Short items" v={sh.length? <><b>{sh.length}</b> of {lines.length} lines</> : <span className="muted">none</span>} />
          <KV k="Purchase Request" v={c.pr ? <><span className="lnk" onClick={function(){ go('#/deals/'+d.id+'/pr'); }}>{c.pr}</span> &middot; raised {c.prDate}</> : <span className="muted">not needed</span>} />
          <KV k="Purchase Order" v={c.po ? <><span style={{fontFamily:'var(--m)',fontWeight:700}}>{c.po}</span> &middot; {c.st==='done'?'complete':'in progress'}</> : ''} />
          <KV k="Received" v={c.st==='done'? <span className="pill p-grn">ALL RECEIVED</span> : (c.short? <span className="pill p-amb">AWAITING</span>: '')} />
        </div><div className="src"><span>Status comes back from Inventory &middot; you do not edit it here</span><span></span></div></div>
      </div>
    </div>
  );

  /* --- the lines --- */
  var rows=lines.map(function(l,i){
    var short=(l.shortQty||0)>0;
    var stat = !short ? <span className="pill p-gry">IN STOCK</span>
             : c.st==='done' ? <span className="pill p-grn">RECEIVED</span>
             : <span className="pill p-amb">ON ORDER</span>;
    return (
      <tr key={l.code+i} className="hov"><td className="muted" style={{width:'2rem'}}>{i+1}</td>
        <td className="k">{l.code}{l.isNew ? <> <span className="pill p-gry">NEW</span></> : null}</td>
        <td style={{fontWeight:600}}>{l.part}</td>
        <td className="n r">{l.qty}</td>
        <td className={'n r'+(short?'':' muted')} style={short?{color:'#B4231A',fontWeight:700}:undefined}>{short ? l.shortQty : '0'}</td>
        <td>{l.note ? l.note : <span className="muted">&mdash;</span>}</td>
        <td className="n r">{money(l.price)}</td>
        <td className="n r" style={{fontWeight:600}}>{money(lineTotal(l))}</td>
        <td>{stat}</td>
      </tr>
    );
  });

  return (
    <>
      <div className="bar2">
        {ctx==='bom'
          ? <span style={{fontSize:'.73rem',color:'var(--ink2)'}}>
              <span className="lnk" onClick={function(){ go('#/deals/'+d.id+'/bom'); }}>{d.id}</span> &middot;{' '}
              <span className="lnk" onClick={function(){ go('#/customers/'+d.cust.replace(/[^A-Za-z0-9]+/g,'-')); }}>{d.cust}</span> &middot;{' '}
              {e.id} {e.tag}
            </span>
          : <button className="bk" style={{margin:0}} onClick={function(){ go('#/deals/'+d.id+'/bom'); }}>&larr; Engines in this deal</button>}
        <span className="sp">{acts}</span>
      </div>

      <div className={'card'+(e.st==='returned'?' hot':'')}>
        <div className={'bnr '+tone}><div><div className="hl">{hl}</div><div className="ln">{ln}</div></div></div>
        <div className="chain">{chain}</div>
        {mini}
      </div>

      {cards}

      <div className="card"><div className="ch"><span className="t">{e.bom} &middot; {e.id} {e.tag}</span>
        <span className="tot">{lines.length} lines{sh.length ? ' · '+sh.length+' short' : ''}</span>
        <span className="rgt"><button className="btn sm" onClick={function(){ toast('Export '+e.bom); }}>Export</button></span></div>
        <table><thead><tr><th></th><th>Item code</th><th>Item</th><th className="r">Required qty</th>
          <th className="r">To buy</th><th>Line notes</th><th className="r">Unit price</th><th className="r">Line cost</th><th>Status</th></tr></thead>
        <tbody>{rows}</tbody>
        <tfoot><tr><td colSpan={7} className="r" style={{fontWeight:700,borderTop:'1px solid var(--line2)'}}>Total value</td>
          <td className="n r" style={{fontWeight:800,borderTop:'1px solid var(--line2)'}}>{money(e.val)}</td>
          <td style={{borderTop:'1px solid var(--line2)'}}></td></tr></tfoot></table>
        <div className="src"><span>Source <b>Repair_BOM_Line_Items</b> &middot; Status comes from Inventory once the order is received</span>
        <span>All {lines.length} shown</span></div>
      </div>
    </>
  );
}
