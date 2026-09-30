import { ST } from '../lib/data.js';
import { allBoms, findBom, money } from '../lib/logic.js';
import { go } from '../lib/store.js';
import BomDetail from './BomDetail.jsx';

export default function BomSplit({ no }){
  var hit=findBom(no), all=allBoms();
  var list=all.map(function(x){
    var s=ST[x.e.st];
    return (
      <div key={x.e.bom} className={'di'+(x.e.bom===no?' on':'')} onClick={function(){ go('#/bom/'+x.e.bom); }}>
        <div className="c1"><span className="cd3">{x.e.bom}</span></div>
        <div className="nm">{x.d.cust}</div>
        <div className="m">{x.e.tag} &middot; {money(x.e.val)} SAR</div>
        <div style={{marginTop:'.3rem'}}><span className={'pill '+s.cls}>{s.pill}</span></div>
      </div>
    );
  });

  return (
    <>
      <button className="bk" onClick={function(){ go('#/bom'); }}>&larr; All BOM</button>
      <div className="dsplit">
        <div className="dlist"><div className="card">
          <div className="ch"><span className="t">All BOM</span><span className="rgt tot">{all.length}</span></div>
          <div className="dlwrap">{list}</div>
          <div className="src"><span>Source <b>Repair_BOM</b></span><span></span></div>
        </div></div>
        <div className="dbody"><BomDetail d={hit.d} e={hit.e} ctx="bom" /></div>
      </div>
    </>
  );
}
