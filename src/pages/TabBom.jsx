import { ST } from '../lib/data.js';
import { linesFor, shortFor, bomDone, engOf, money } from '../lib/logic.js';
import { go, DRAFT, formOpen, openCreate, openEdit, toast } from '../lib/store.js';
import FormPanel from './FormPanel.jsx';

export default function TabBom({ d }){
  /* the form takes the engine table's place — close it and the table is back */
  if(formOpen() && DRAFT.deal===d.id){
    var fe=engOf(d,DRAFT.eng);
    if(fe) return <FormPanel d={d} e={fe} />;
  }

  var rows=d.engines.slice().sort(function(a,b){ return ST[a.st].order-ST[b.st].order; }).map(function(e){
    var s=ST[e.st]; linesFor(e);
    var sh=shortFor(e).length;
    var note=(e.note||'')+(sh? (e.note?' · ':'')+sh+' item'+(sh>1?'s':'')+' short':'');
    var isDraft = DRAFT && DRAFT.eng===e.id;
    var view=function(){ go('#/deals/'+d.id+'/bom/view/'+e.id); };

    return (
      <tr key={e.id} className="hov">
        <td className="k">{e.id}</td><td className="k">{e.tag}</td><td>{e.model}</td>
        <td className="k">{e.bom
          ? <><span className="lnk" onClick={view}>{e.bom}</span><div className="sub2" style={{fontFamily:'var(--f)'}}>{linesFor(e).length} lines</div></>
          : <span className="muted">not created</span>}</td>
        <td className="n r">{e.val ? money(e.val) : <span className="muted">—</span>}</td>
        <td><span className={'pill '+s.cls}>{s.pill}</span>
          {isDraft
            ? <div className="sub2" style={{color:'var(--accent-d)',fontWeight:600}}>Draft open &middot; {DRAFT.lines.length} lines entered</div>
            : (note ? <div className="sub2">{note}</div> : null)}
        </td>
        <td style={{whiteSpace:'nowrap'}}>
          {e.st==='none'
            ? <button className="btn sm pri" onClick={function(){ openCreate(d.id,e.id); }}>{isDraft?'Continue':'Create BOM'}</button>
            : <>
                <button className="btn sm" onClick={view}>View BOM</button>
                {e.st==='returned'
                  ? <> <button className="btn sm pri" onClick={function(){ openEdit(d.id,e.id); }}>{isDraft?'Continue':'Update BOM'}</button></>
                  : null}
              </>}
        </td>
      </tr>
    );
  });

  return (
    <div className="card">
      <div className="ch"><span className="t">Engines in this deal</span>
        <span className="tot">{bomDone(d)} of {d.engines.length} have a bill of materials</span>
        <span className="rgt"><button className="btn sm" onClick={function(){ toast('Consolidated BOM for '+d.id); }}>View consolidated BOM</button></span></div>
      <table><thead><tr><th>Engine</th><th>Unit tag</th><th>Model</th><th>Bill of materials</th>
        <th className="r">BOM value (SAR)</th><th>Status</th><th>Action</th></tr></thead><tbody>{rows}</tbody></table>
      <div className="src"><span>Source <b>Deal_Engines</b> + <b>Repair_BOM</b> &middot; one bill of materials per engine</span>
      <span>All {d.engines.length} shown</span></div>
    </div>
  );
}
