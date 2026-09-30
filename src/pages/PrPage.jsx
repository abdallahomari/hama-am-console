import { DEALS } from '../lib/data.js';
import { dealShort, countSt } from '../lib/logic.js';
import { go } from '../lib/store.js';

export default function PrPage(){
  var rows=DEALS.map(function(d){
    var n=dealShort(d).length;
    if(!n) return null;
    var noBom=countSt(d,'none');
    var units=dealShort(d).reduce(function(a,i){ return a+(i.need-i.stock); },0);
    return (
      <tr key={d.id} className="clk" onClick={function(){ go('#/pr/'+d.id); }}>
        <td className="k">{d.id}</td><td style={{fontWeight:600}}>{d.cust}</td>
        <td className="n r">{n}</td><td className="n r">{units}</td>
        <td>{noBom
          ? <><span className="pill p-amb">COLLECTING</span><div className="sub2">{noBom} engine{noBom>1?'s':''} still without a BOM</div></>
          : <span className="pill p-act">READY TO RAISE</span>}</td>
        <td className="r chev">&rsaquo;</td>
      </tr>
    );
  });

  return (
    <>
      <div className="phead"><div><h1>Purchase Request</h1>
        <div className="sub">One request per deal, consolidated by item</div></div></div>
      <div className="card"><div className="ch"><span className="t">Purchase requests</span><span className="tot">by deal</span></div>
        <table><thead><tr><th>Deal</th><th>Customer</th><th className="r">Items to buy</th>
          <th className="r">Units</th><th>Status</th><th></th></tr></thead>
        <tbody>{rows}</tbody></table>
        <div className="src"><span>A request goes once every engine in the deal has a bill of materials</span><span></span></div>
      </div>
    </>
  );
}
