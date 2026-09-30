import { ST } from '../lib/data.js';
import { CUSTOMERS, custById, custStats, bomDone, needCount, dealBomValue, linesFor, money, dealShort, countSt } from '../lib/logic.js';
import { go } from '../lib/store.js';

function KV({ k, v }){
  return <div className="kvl"><div className="k2">{k}</div><div className="v2">{v || <span className="muted">&mdash;</span>}</div></div>;
}

export default function CustSplit({ id }){
  var all=CUSTOMERS(), c=custById(id), s=custStats(c);

  var list=all.map(function(x){
    var y=custStats(x);
    return (
      <div key={x.id} className={'di'+(x.id===id?' on':'')} onClick={function(){ go('#/customers/'+x.id); }}>
        <div className="c1"><span className="cd3">{x.deals.length} deal{x.deals.length>1?'s':''}</span>
          {y.need ? <span className="bd2">{y.need}</span> : null}</div>
        <div className="nm">{x.name}</div>
        <div className="m">{y.eng} engines &middot; {y.bom} BOM</div>
      </div>
    );
  });

  var deals=c.deals.map(function(d){
    return (
      <tr key={d.id} className="clk" onClick={function(){ go('#/deals/'+d.id+'/sum'); }}>
        <td className="k">{d.id}</td><td className="n r">{d.engines.length}</td>
        <td className="n r">{bomDone(d)} of {d.engines.length}</td>
        <td>{d.feas}</td>
        <td>{needCount(d) ? <span className="pill p-act">{needCount(d)} OPEN</span> : <span className="pill p-gry">NONE</span>}</td>
        <td className="n r">{dealBomValue(d) ? money(dealBomValue(d)) : '—'}</td><td className="r chev">&rsaquo;</td>
      </tr>
    );
  });

  var boms=[];
  c.deals.forEach(function(d){ d.engines.forEach(function(e){ if(e.bom){ linesFor(e); boms.push({d:d,e:e}); } }); });
  var bomRows=boms.map(function(x){
    var st=ST[x.e.st];
    return (
      <tr key={x.e.bom} className="clk" onClick={function(){ go('#/bom/'+x.e.bom); }}>
        <td className="k">{x.e.bom}</td><td className="k">{x.e.tag}</td><td className="k">{x.d.id}</td>
        <td><span className={'pill '+st.cls}>{st.pill}</span></td>
        <td className="n r">{money(x.e.val)}</td><td className="r chev">&rsaquo;</td>
      </tr>
    );
  });

  return (
    <>
      <button className="bk" onClick={function(){ go('#/customers'); }}>&larr; All customers</button>
      <div className="dsplit">
        <div className="dlist"><div className="card">
          <div className="ch"><span className="t">Customers</span><span className="rgt tot">{all.length}</span></div>
          <div className="dlwrap">{list}</div>
          <div className="src"><span>Source <b>Customers</b></span><span></span></div>
        </div></div>

        <div className="dbody">
          <div className="cols">
            <div className="col"><div className="card"><div className="ch"><span className="t">{c.name}</span></div><div className="cb">
              <KV k="Deals" v={c.deals.length} />
              <KV k="Engines" v={s.eng} />
              <KV k="BOMs created" v={<><b>{s.bom}</b> of {s.eng}</>} />
              <KV k="Awaiting your action" v={s.need ? <span className="pill p-act">{s.need}</span> : <span className="pill p-gry">NONE</span>} />
              <KV k="Items to buy" v={s.short} />
              <KV k="BOM value" v={s.val ? <b>{money(s.val)} SAR</b> : ''} />
            </div><div className="src"><span>Source <b>Customers</b> &middot; synced from CRM</span><span></span></div></div></div>
          </div>

          <div className="card"><div className="ch"><span className="t">Their deals</span><span className="tot">{c.deals.length}</span></div>
            <table><thead><tr><th>Deal</th><th className="r">Engines</th><th className="r">BOMs created</th>
              <th>Repair feasibility</th><th>Action required</th><th className="r">BOM value (SAR)</th><th></th></tr></thead>
            <tbody>{deals}</tbody></table></div>

          <div className="card"><div className="ch"><span className="t">Their bills of materials</span><span className="tot">{boms.length}</span></div>
            {boms.length
              ? <table><thead><tr><th>BOM</th><th>Unit tag</th><th>Deal</th><th>Status</th><th className="r">Value (SAR)</th><th></th></tr></thead>
                  <tbody>{bomRows}</tbody></table>
              : <div className="cb" style={{color:'var(--ink3)',fontSize:'.76rem'}}>No bill of materials created yet.</div>}
          </div>

          <PrSummary deals={c.deals} />
        </div>
      </div>
    </>
  );
}

function PrSummary({ deals }){
  var rows=[];
  deals.forEach(function(d){
    var items = dealShortOf(d);
    if(!items.n) return;
    rows.push(
      <tr key={d.id} className="clk" onClick={function(){ go('#/pr/'+d.id); }}>
        <td className="k">{d.id}</td><td className="n r">{items.n}</td><td className="n r">{items.units}</td>
        <td>{items.noBom ? <span className="pill p-amb">COLLECTING</span> : <span className="pill p-act">READY TO RAISE</span>}</td>
        <td className="r chev">&rsaquo;</td>
      </tr>
    );
  });
  return (
    <div className="card"><div className="ch"><span className="t">Their purchase requests</span></div>
      {rows.length
        ? <table><thead><tr><th>Deal</th><th className="r">Items to buy</th><th className="r">Units</th><th>Status</th><th></th></tr></thead>
            <tbody>{rows}</tbody></table>
        : <div className="cb" style={{color:'var(--ink3)',fontSize:'.76rem'}}>Nothing outstanding to buy.</div>}
    </div>
  );
}

function dealShortOf(d){
  var items=dealShort(d);
  var units=items.reduce(function(a,i){ return a+(i.need-i.stock); },0);
  return {n:items.length, units:units, noBom:countSt(d,'none')};
}
