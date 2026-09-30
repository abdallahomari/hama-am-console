import { DEALS } from '../lib/data.js';
import { ST } from '../lib/data.js';
import { allBoms, shortFor, money } from '../lib/logic.js';
import { go, BOMCUT, setCut } from '../lib/store.js';

export default function BomPage(){
  var all=allBoms(), groups=[];
  if(BOMCUT==='status'){
    groups=[{t:'Returned for revision', f:function(x){ return x.e.st==='returned'; }},
            {t:'Awaiting approval',     f:function(x){ return x.e.st==='pending'; }},
            {t:'Approved',              f:function(x){ return x.e.st==='approved'; }}];
  } else if(BOMCUT==='purchase'){
    groups=[{t:'Waiting for a purchase request', f:function(x){ return shortFor(x.e).length>0; }},
            {t:'Nothing to buy',                 f:function(x){ return shortFor(x.e).length===0; }}];
  } else if(BOMCUT==='deal'){
    DEALS.forEach(function(d){ groups.push({t:d.id+' · '+d.cust, f:function(x){ return x.d.id===d.id; }}); });
  } else {
    DEALS.forEach(function(d){ groups.push({t:d.cust, f:function(x){ return x.d.cust===d.cust; }}); });
  }

  var body=[];
  groups.forEach(function(g){
    var list=all.filter(g.f);
    if(!list.length) return;
    body.push(<tr className="grp" key={'grp-'+g.t}><td colSpan={7}>{g.t}<span className="cnt3">{list.length}</span></td></tr>);
    list.forEach(function(x){
      var s=ST[x.e.st];
      body.push(
        <tr key={x.e.bom} className="clk" onClick={function(){ go('#/bom/'+x.e.bom); }}>
          <td className="k">{x.e.bom}</td><td className="k">{x.e.tag}</td><td>{x.e.model}</td>
          <td className="k">{x.d.id}</td><td style={{fontWeight:600}}>{x.d.cust}</td>
          <td><span className={'pill '+s.cls}>{s.pill}</span></td>
          <td className="n r">{money(x.e.val)}</td><td className="r chev">&rsaquo;</td>
        </tr>
      );
    });
  });

  function cut(v,t){ return <option key={v} value={v}>{t}</option>; }

  return (
    <>
      <div className="phead"><div><h1>BOM</h1><div className="sub">Every bill of materials you have created</div></div>
        <select className="ddl" value={BOMCUT} onChange={function(ev){ setCut(ev.target.value); }}>
          {cut('status','Group by status')}{cut('purchase','Group by purchase need')}
          {cut('deal','Group by deal')}{cut('customer','Group by customer')}
        </select></div>
      <div className="card"><div className="ch"><span className="t">All BOM</span><span className="tot">{all.length}</span></div>
        <table><thead><tr><th>BOM</th><th>Unit tag</th><th>Model</th><th>Deal</th><th>Customer</th>
          <th>Status</th><th className="r">Value (SAR)</th><th></th></tr></thead><tbody>{body}</tbody></table>
        <div className="src"><span>Source <b>Repair_BOM</b></span><span>{all.length} shown</span></div>
      </div>
    </>
  );
}
