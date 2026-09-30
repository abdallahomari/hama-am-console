import { CUSTOMERS, custStats, money } from '../lib/logic.js';
import { go } from '../lib/store.js';

export default function CustPage(){
  var customers=CUSTOMERS();
  var rows=customers.map(function(c){
    var s=custStats(c);
    return (
      <tr key={c.id} className="clk" onClick={function(){ go('#/customers/'+c.id); }}>
        <td style={{fontWeight:600}}>{c.name}</td>
        <td className="n r">{c.deals.length}</td><td className="n r">{s.eng}</td>
        <td className="n r">{s.bom} of {s.eng}</td>
        <td>{s.need ? <span className="pill p-act">{s.need} OPEN</span> : <span className="pill p-gry">NONE</span>}</td>
        <td className="n r">{s.val ? money(s.val) : '—'}</td><td className="r chev">&rsaquo;</td>
      </tr>
    );
  });

  return (
    <>
      <div className="phead"><div><h1>Customers</h1>
        <div className="sub">Everything that belongs to one customer, in one place</div></div></div>
      <div className="card"><div className="ch"><span className="t">All customers</span><span className="tot">{customers.length}</span></div>
        <table><thead><tr><th>Customer</th><th className="r">Deals</th><th className="r">Engines</th>
          <th className="r">BOMs created</th><th>Action required</th><th className="r">BOM value (SAR)</th><th></th></tr></thead>
        <tbody>{rows}</tbody></table>
        <div className="src"><span>Source <b>Customers</b> &middot; rolled up from their deals</span><span></span></div>
      </div>
    </>
  );
}
