import { needCount, bomDone, countSt, dealShort, money } from '../lib/logic.js';

function KV({ k, v }){
  return <div className="kvl"><div className="k2">{k}</div><div className="v2">{v || <span className="muted">—</span>}</div></div>;
}
function Chk({ b }){
  return b ? <span className="pill p-grn">YES</span> : <span className="pill p-gry">NO</span>;
}

export default function TabSum({ d }){
  return (
    <div className="sgrid">
      <div className="card"><div className="ch"><span className="t">Customer</span></div><div className="cb">
        <KV k="Deal Number" v={<span style={{fontFamily:'var(--m)',fontWeight:700}}>{d.id}</span>} />
        <KV k="Customer" v={<b>{d.cust}</b>} />
        <KV k="Engine Count" v={d.engines.length} />
        <KV k="Supporting Documents" v={d.docs+' files'} />
      </div><div className="src"><span>Source <b>Deals</b> &middot; synced from CRM</span><span></span></div></div>

      <div className="card"><div className="ch"><span className="t">What the customer asked for</span></div><div className="cb">
        <div className="para"><b>Reported problem</b>{d.problem}</div>
        <div className="para"><b>Customer remarks</b>{d.remarks}</div>
        <div className="para"><b>Requested scope</b>{d.scope}</div>
      </div></div>

      <div className="card"><div className="ch"><span className="t">Factory review</span></div><div className="cb">
        <KV k="Repair Feasibility" v={<span className={'pill '+(d.feas==='Feasible'?'p-grn':d.feas==='Not Feasible'?'p-red':'p-amb')}>{d.feas.toUpperCase()}</span>} />
        <KV k="Estimated Turnaround" v={d.turn ? d.turn+' days' : ''} />
        <div className="para" style={{marginTop:'.5rem'}}><b>Internal review remarks</b>{d.review ? d.review : <span className="muted">Not recorded</span>}</div>
      </div></div>

      <div className="card"><div className="ch"><span className="t">Status</span></div><div className="cb">
        <KV k="Deal Status" v={<span className="pill p-blu">{d.status.toUpperCase()}</span>} />
        <KV k="Won Date" v={d.won} />
        <KV k="Planning BOM Created" v={<Chk b={d.planBom} />} />
        <KV k="BOM Approved" v={<Chk b={d.bomAppr} />} />
        <KV k="Availability Status" v={<span className="pill p-gry">{d.availStatus.toUpperCase()}</span>} />
        <KV k="Availability Start" v={d.availFrom} />
        <KV k="Availability End" v={d.availTo} />
        <KV k="Production Order" v={d.po} />
      </div><div className="src"><span>Dates and production order are set after approval</span><span></span></div></div>

      <div className="card"><div className="ch"><span className="t">Cost summary</span></div><div className="cb">
        <KV k="Deal Parts Cost" v={d.parts ? money(d.parts)+' SAR' : ''} />
        <KV k="Deal Labour Cost" v={d.labour ? money(d.labour)+' SAR' : ''} />
        <KV k="Deal Vendor Cost" v={d.vendor ? money(d.vendor)+' SAR' : ''} />
        <KV k="Deal Total Cost" v={d.parts ? <b>{money(d.parts+d.labour+d.vendor)} SAR</b> : ''} />
        <KV k="Deal Total Hours" v={d.hours ? d.hours.toFixed(1) : ''} />
      </div></div>

      <div className="card"><div className="ch"><span className="t">Progress</span></div><div className="cb">
        <KV k="Engines" v={d.engines.length} />
        <KV k="BOMs created" v={<><b>{bomDone(d)}</b> of {d.engines.length}</>} />
        <KV k="Awaiting your action" v={needCount(d) ? <span className="pill p-act">{needCount(d)}</span> : <span className="pill p-gry">NONE</span>} />
        <KV k="With Factory Manager" v={countSt(d,'pending')} />
        <KV k="Approved" v={countSt(d,'approved')} />
        <KV k="Items short" v={dealShort(d).length} />
      </div></div>
    </div>
  );
}
