import { DEALS } from '../lib/data.js';
import { dealShort, countSt, byId } from '../lib/logic.js';
import { go } from '../lib/store.js';
import TabPr from './TabPr.jsx';

export default function PrSplit({ dealId }){
  var open=DEALS.filter(function(d){ return dealShort(d).length; });
  var list=open.map(function(d){
    var n=dealShort(d).length, noBom=countSt(d,'none');
    return (
      <div key={d.id} className={'di'+(d.id===dealId?' on':'')} onClick={function(){ go('#/pr/'+d.id); }}>
        <div className="c1"><span className="cd3">{d.id}</span><span className="bd2">{n}</span></div>
        <div className="nm">{d.cust}</div>
        <div className="m">{noBom ? noBom+' engine'+(noBom>1?'s':'')+' without a BOM' : 'ready to raise'}</div>
      </div>
    );
  });

  return (
    <>
      <button className="bk" onClick={function(){ go('#/pr'); }}>&larr; All purchase requests</button>
      <div className="dsplit">
        <div className="dlist"><div className="card">
          <div className="ch"><span className="t">Requests</span><span className="rgt tot">{open.length}</span></div>
          <div className="dlwrap">{list}</div>
          <div className="src"><span>One per deal</span><span></span></div>
        </div></div>
        <div className="dbody"><TabPr d={byId(dealId)} /></div>
      </div>
    </>
  );
}
