import { PARTS } from '../lib/data.js';
import { money, lineTotal } from '../lib/logic.js';
import {
  DRAFT, draftShort, draftTotal, closeDraft, toggleVerify, setNote, setQty,
  removeLine, addLine, cloneFrom, submitDraft, go, toast
} from '../lib/store.js';

function ItemCell({ l, i }){
  var others=PARTS.slice(0,6).filter(function(p){ return p!==l.part; }).slice(0,4);
  return (
    <td>
      <select className="inp" defaultValue={l.code+' — '+l.part} onChange={function(ev){
        if(ev.target.value==='__new'){
          ev.target.selectedIndex=0;
          toast('Add New Item — the item is created in Creator, then pushed to Inventory');
        }
      }}>
        <option>{l.code+' — '+l.part}</option>
        {others.map(function(p){ return <option key={p}>{p}</option>; })}
        <option value="__new">+ Add New Item</option>
      </select>
    </td>
  );
}

export default function FormPanel({ d, e }){
  var shorts=draftShort(), total=draftTotal();

  var lines=DRAFT.lines.map(function(l,i){
    return (
      <tr key={i} className="hov"><td className="muted" style={{width:'2rem'}}>{i+1}</td>
        <ItemCell l={l} i={i} />
        <td style={{width:'7rem'}}><input className="inp" style={{textAlign:'right',fontFamily:'var(--m)'}} value={l.qty} onChange={function(ev){ setQty(i,ev.target.value); }} /></td>
        <td style={{width:'11rem'}}><input className="inp" value={l.note} placeholder="Line notes" onChange={function(ev){ setNote(i,ev.target.value); }} /></td>
        <td className="n r" style={{width:'6rem'}}>{money(l.price)}</td>
        <td className="n r" style={{width:'7rem',fontWeight:600}}>{money(lineTotal(l))}</td>
        <td style={{width:'4.5rem'}}><button className="btn sm" onClick={function(){ removeLine(i); }}>Remove</button></td>
      </tr>
    );
  });

  var shortTable = DRAFT.verified ? (
    <div className="shortbox">
      <div className="sh">{shorts.length} item{shorts.length!==1?'s':''} not fully available <em>&mdash; these go on the purchase request for {d.id}</em></div>
      {shorts.length
        ? <table><thead><tr><th>Item code</th><th>Part</th><th className="r">Required</th><th className="r">Available to this BOM</th><th className="r">To buy</th></tr></thead>
            <tbody>{shorts.map(function(l){
              return (
                <tr key={l.code}><td className="k">{l.code}</td><td style={{fontWeight:600}}>{l.part}</td>
                  <td className="n r">{l.qty}</td><td className={'n r'+(l.take?'':' muted')}>{l.take}</td>
                  <td className="n r" style={{fontWeight:700,color:'#B4231A'}}>{l.shortQty}</td>
                </tr>
              );
            })}</tbody>
          </table>
        : <div className="cb" style={{color:'var(--ink3)',fontSize:'.74rem'}}>Everything on this bill of materials is in stock. Nothing will be added to the purchase request.</div>}
      {shorts.length
        ? <div className="note2"><b>Submitting will do both.</b> The bill of materials is created and these {shorts.length}{' '}
            item{shorts.length!==1?'s':''} are added to this deal&rsquo;s purchase request. The request is not sent yet.</div>
        : null}
    </div>
  ) : null;

  return (
    <div className="ovl">
      <div className="ovlh"><span className="t">Repair BOM{DRAFT.edit ? ' · '+e.bom : ''}</span>
        <span className={'pill '+(DRAFT.edit?'p-red':'p-act')}>{DRAFT.edit?'UPDATING':'CREATING'}</span>
        <button className="x" onClick={closeDraft}>&times;</button></div>
      {DRAFT.edit ? (
        <div className="bnr bnr-red" style={{borderBottom:'1px solid #F4CDCA'}}><div>
          <div className="hl" style={{fontSize:'.78rem'}}>Returned by the Factory Manager</div>
          <div className="ln">&ldquo;{e.note||'Change requested.'}&rdquo;</div>
        </div></div>
      ) : null}

      <div className="ovlb">
        <div className="frow"><label>Deal</label><div className="fld"><input className="inp lock" value={d.id} readOnly /></div></div>
        <div className="frow"><label>Engine</label><div className="fld"><input className="inp lock" value={e.id+' · '+e.tag+' · '+e.model} readOnly /></div></div>
        <div className="frow"><label>Clone BOM</label><div className="fld">
          <select className="inp" defaultValue="" onChange={function(ev){ cloneFrom(ev.target.value); }}>
            <option value="">&ndash; Select &ndash;</option>
            {d.engines.filter(function(x){ return x.bom && x.id!==e.id; }).map(function(x){
              return <option key={x.id} value={x.id}>{x.tag} &mdash; {x.bom}</option>;
            })}
          </select></div>
          <span className="ghost">copy the lines from another engine in this deal</span></div>

        <div className="flab">BOM Lines</div>
        <div className="gtbl"><table><thead><tr><th></th><th>Item</th><th className="r">Required quantity <span className="req">*</span></th>
          <th>Line notes</th><th className="r">Unit price</th><th className="r">Line cost</th><th></th></tr></thead>
          <tbody>{lines}</tbody></table>
          <div className="addnew" onClick={addLine}>+ Add Row</div>
        </div>
        <div style={{fontSize:'.68rem',color:'var(--ink3)',marginTop:'.35rem'}}>The item lookup carries <b style={{color:'var(--ink2)'}}>+ Add New Item</b>{' '}
          for a part that is not in Inventory yet. <b style={{color:'var(--ink2)'}}>Repair_BOM_Line_Items.Item</b> does not allow new entries today &mdash; this is a change to the form.</div>

        <div className={'verify'+(DRAFT.verified?' done':'')} onClick={toggleVerify}>
          <div className="bx">{DRAFT.verified?'✓':''}</div>
          <div><div className="vt">Calculate the availability stocks</div>
          <div className="vs">{DRAFT.verified
            ? 'Checked against Inventory. See what is short below.'
            : 'You must do this before you can submit.'}</div></div>
        </div>

        {shortTable}
      </div>

      <div className="ovlf">
        <button className="btn" onClick={function(){ go('#/bom'); }} title="Go to all BOMs — this form is kept">&larr; All BOM</button>
        <span style={{fontSize:'.74rem',color:'var(--ink2)'}}><b style={{color:'var(--ink)'}}>{DRAFT.lines.length}</b> lines
          {DRAFT.verified ? <> &middot; <b style={{color:'var(--ink)'}}>{shorts.length}</b> short</> : null}</span>
        <span style={{fontSize:'1rem',fontWeight:800,fontVariantNumeric:'tabular-nums'}}>{money(total)}{' '}
          <span style={{fontSize:'.68rem',color:'var(--ink3)',fontWeight:700}}>SAR</span></span>
        <span className="rgt">
          <button className="btn" onClick={closeDraft}>Cancel</button>
          <button className="btn pri" disabled={!DRAFT.verified} title={!DRAFT.verified ? 'Tick Calculate the availability stocks first' : undefined}
            onClick={submitDraft}>{DRAFT.edit ? 'Resubmit and update purchase request' : 'Submit and add to purchase request'}</button>
        </span>
      </div>
    </div>
  );
}
