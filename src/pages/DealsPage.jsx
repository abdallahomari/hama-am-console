import { DEALS } from '../lib/data.js';
import { needCount, bomDone, dealGroup } from '../lib/logic.js';
import { go } from '../lib/store.js';

export default function DealsPage(){
  var groups=[
    {k:'notcreated', t:'BOM not created'},
    {k:'inprogress', t:'BOM in progress'},
    {k:'created',    t:'BOM created'}
  ];

  var body=[];
  groups.forEach(function(g){
    var list=DEALS.filter(function(d){ return dealGroup(d)===g.k; });
    if(!list.length) return;
    body.push(<tr className="grp" key={'grp-'+g.k}><td colSpan={7}>{g.t}<span className="cnt3">{list.length}</span></td></tr>);
    list.forEach(function(d){
      var nd=needCount(d);
      body.push(
        <tr key={d.id} className="clk" onClick={function(){ go('#/deals/'+d.id); }}>
          <td className="k">{d.id}</td><td style={{fontWeight:600}}>{d.cust}</td>
          <td className="n r">{d.engines.length}</td>
          <td className="n r">{bomDone(d)} of {d.engines.length}</td>
          <td>{d.feas}</td>
          <td>{nd ? <span className="pill p-act">{nd} OPEN</span> : <span className="pill p-gry">NONE</span>}</td>
          <td className="r chev">&rsaquo;</td>
        </tr>
      );
    });
  });

  return (
    <>
      <div className="phead"><div><h1>Deals</h1><div className="sub">Grouped by how far the bills of materials have got</div></div>
        <select className="ddl"><option>All deals</option><option>Open only</option></select></div>
      <div className="card">
        <div className="ch"><span className="t">All deals</span><span className="tot">{DEALS.length}</span></div>
        <table><thead><tr><th>Deal</th><th>Customer</th><th className="r">Engines</th><th className="r">BOMs created</th>
          <th>Repair feasibility</th><th>Action required</th><th></th></tr></thead>
          <tbody>{body}</tbody>
        </table>
        <div className="src"><span>Source <b>Deals</b> &middot; select a deal to work through its engines</span><span>{DEALS.length} shown</span></div>
      </div>
    </>
  );
}
