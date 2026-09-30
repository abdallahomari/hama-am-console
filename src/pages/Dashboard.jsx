import { DEALS } from '../lib/data.js';
import { linesFor, needCount, dealShort, bomDone, dealBomValue, money } from '../lib/logic.js';
import { go } from '../lib/store.js';

export default function Dashboard(){
  var nNew=0,nRet=0,retVal=0,nPend=0,pendVal=0,shorts=0;
  DEALS.forEach(function(d){
    d.engines.forEach(function(e){
      linesFor(e);
      if(e.st==='none') nNew++;
      if(e.st==='returned'){ nRet++; retVal+=e.val||0; }
      if(e.st==='pending'){ nPend++; pendVal+=e.val||0; }
    });
    shorts+=dealShort(d).length;
  });
  var totalNeed=0; DEALS.forEach(function(d){ totalNeed+=needCount(d); });

  /* how his submissions have gone — past decisions over three months, live pending.
     It tells him whether he is getting BOMs right first time. */
  var HIST={approved:41, rejected:9, pending:nPend};
  var dec=HIST.approved+HIST.rejected, C=2*Math.PI*52;
  var aLen=C*(HIST.approved/dec), rLen=C*(HIST.rejected/dec);

  /* what is still waiting to go on a purchase request, by deal */
  var prN=0, prUnits=0, prRows=[];
  DEALS.forEach(function(d){
    var items=dealShort(d);
    if(!items.length) return;
    var units=items.reduce(function(a,i){ return a+(i.need-i.stock); },0), noBom=0;
    d.engines.forEach(function(e){ if(e.st==='none') noBom++; });
    prN++; prUnits+=units;
    prRows.push(
      <tr key={d.id} className="clk" onClick={function(){ go('#/pr/'+d.id); }}>
        <td className="k">{d.id}</td><td style={{fontWeight:600}}>{d.cust}</td>
        <td className="n r">{items.length}</td><td className="n r">{units}</td>
        <td>{noBom ? <span className="pill p-amb">COLLECTING</span> : <span className="pill p-act">READY</span>}</td>
        <td className="r chev">&rsaquo;</td>
      </tr>
    );
  });

  var rows=DEALS.slice().sort(function(a,b){ return needCount(b)-needCount(a); }).map(function(d){
    var nd=needCount(d);
    return (
      <tr key={d.id} className="clk" onClick={function(){ go('#/deals/'+d.id); }}>
        <td className="k">{d.id}</td><td style={{fontWeight:600}}>{d.cust}</td>
        <td className="n r">{d.engines.length}</td>
        <td className="n r">{bomDone(d)} of {d.engines.length}</td>
        <td>{nd ? <span className="pill p-act">{nd} OPEN</span> : <span className="pill p-gry">NONE</span>}</td>
        <td className="n r">{dealBomValue(d) ? money(dealBomValue(d)) : '—'}</td>
        <td className="r chev">&rsaquo;</td>
      </tr>
    );
  });

  return (
    <>
      <div className="phead">
        <div><h1>Application Manager</h1>
          <div className="sub">{totalNeed} engines require action across {DEALS.length} open deals</div>
        </div>
        <select className="ddl"><option>This month</option><option>Last month</option><option>Last 3 months</option></select>
      </div>

      <div className="kpis">
        <div className="kpi hot"><div className="kl">BOMs to create</div><div className="kv">{nNew}</div><div className="kd">across <b>{DEALS.length}</b> deals</div></div>
        <div className="kpi hot"><div className="kl">Returned for revision</div><div className="kv">{nRet}</div><div className="kd"><b>{money(retVal)}</b> SAR to revise</div></div>
        <div className="kpi"><div className="kl">Awaiting approval</div><div className="kv">{nPend}</div><div className="kd"><b>{money(pendVal)}</b> SAR with the Factory Manager</div></div>
        <div className="kpi"><div className="kl">Items short</div><div className="kv">{shorts}</div><div className="kd">waiting to go on a purchase request</div></div>
      </div>

      <div className="cols eq">
        <div className="col" style={{flex:'0 0 24rem'}}>
          <div className="card">
            <div className="ch"><span className="t">Factory Manager Decisions</span>
              <span className="tot">{dec+HIST.pending} submitted</span></div>
            <div className="cb"><div className="dstrip">
              <svg width="150" height="150" viewBox="0 0 132 132">
                <circle cx="66" cy="66" r="52" fill="none" stroke="#EDEFF3" strokeWidth="17"/>
                <circle cx="66" cy="66" r="52" fill="none" stroke="#16A34A" strokeWidth="17" strokeDasharray={aLen.toFixed(2)+' '+C.toFixed(2)} transform="rotate(-90 66 66)"/>
                <circle cx="66" cy="66" r="52" fill="none" stroke="#D9463C" strokeWidth="17" strokeDasharray={rLen.toFixed(2)+' '+C.toFixed(2)} strokeDashoffset={(-aLen).toFixed(2)} transform="rotate(-90 66 66)"/>
                <text x="66" y="62" textAnchor="middle" fontSize="26" fontWeight="800" fill="#14181F" fontFamily="IBM Plex Mono,monospace">{dec}</text>
                <text x="66" y="80" textAnchor="middle" fontSize="8.5" fontWeight="700" letterSpacing="1.1" fill="#9CA3AF">DECIDED</text>
              </svg>
              <div className="dstats">
                <div className="dstat"><div className="sl"><i style={{background:'#16A34A'}}></i>Approved first time</div>
                  <div className="sv">{HIST.approved}<em>{Math.round(HIST.approved/dec*100)}%</em></div></div>
                <div className="dstat"><div className="sl"><i style={{background:'#D9463C'}}></i>Returned for revision</div>
                  <div className="sv">{HIST.rejected}<em>{Math.round(HIST.rejected/dec*100)}%</em></div></div>
                <div className="dstat mut"><div className="sl"><i style={{background:'#C7CEDA'}}></i>Still awaiting a decision</div>
                  <div className="sv">{HIST.pending}</div></div>
              </div>
            </div></div>
            <div className="src"><span>Source <b>Repair_BOM</b> &middot; last 3 months</span><span>% of the {dec} decided</span></div>
          </div>
        </div>

        <div className="col">
          <div className="card">
            <div className="ch"><span className="t">Yet to create Purchase Request</span>
              <span className="tot">{prN} deal{prN!==1?'s':''}</span>
              <span className="rgt"><button className="btn sm" onClick={function(){ go('#/pr'); }}>Open</button></span></div>
            <table><thead><tr><th>Deal</th><th>Customer</th><th className="r">Items to buy</th>
              <th className="r">Units</th><th>Status</th><th></th></tr></thead><tbody>{prRows}</tbody></table>
            <div className="src"><span>Source <b>Repair_BOM_Line_Items</b> &middot; consolidated by item</span>
            <span>{prUnits} units in total</span></div>
          </div>
        </div>
      </div>

      <div className="card hot">
        <div className="ch"><span className="t">Your Deals</span><span className="tot">{DEALS.length} open</span>
          <span className="rgt"><button className="btn sm" onClick={function(){ go('#/deals'); }}>Open Deals</button></span></div>
        <table><thead><tr><th>Deal</th><th>Customer</th><th className="r">Engines</th><th className="r">BOMs created</th>
          <th>Action required</th><th className="r">BOM value (SAR)</th><th></th></tr></thead><tbody>{rows}</tbody></table>
        <div className="src"><span>A dashboard is for a glance &middot; the work happens under <b>Deals</b></span><span>{DEALS.length} shown</span></div>
      </div>
    </>
  );
}
