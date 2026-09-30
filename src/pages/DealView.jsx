import { DEALS } from '../lib/data.js';
import { needCount, bomDone, dealShort, engOf } from '../lib/logic.js';
import { go, DRAFT, formOpen } from '../lib/store.js';
import TabSum from './TabSum.jsx';
import TabBom from './TabBom.jsx';
import TabPr from './TabPr.jsx';
import TabTl from './TabTl.jsx';
import BomDetail from './BomDetail.jsx';

export default function DealView({ deal:d, tab }){
  var shorts=dealShort(d).length;

  function Tab(k,label,extra){
    return (
      <div className={'tab'+(tab===k?' on':'')} onClick={function(){ go('#/deals/'+d.id+'/'+k); }}>
        {label}{extra}
      </div>
    );
  }

  /* clicking an engine's BOM opens a page inside this tab — the tabs stay put */
  var mv=(location.hash||'').match(/\/bom\/view\/([A-Z0-9-]+)/);
  var ve=mv ? engOf(d,mv[1]) : null;

  var body = tab==='bom' ? (ve && ve.bom ? <BomDetail d={d} e={ve} ctx="deal" /> : <TabBom d={d} />)
           : tab==='pr' ? <TabPr d={d} /> : tab==='tl' ? <TabTl d={d} /> : <TabSum d={d} />;

  /* the deals pane on the left — the report is still the way in, this is for
     moving between deals once you are inside one */
  var froze = formOpen();   /* disabled only while the form is actually open */
  var list=DEALS.map(function(x){
    var n=needCount(x);
    return (
      <div key={x.id} className={'di'+(x.id===d.id?' on':'')} onClick={function(){ go('#/deals/'+x.id+'/'+tab); }}>
        <div className="c1"><span className="cd3">{x.id}</span>{n ? <span className="bd2">{n}</span> : null}</div>
        <div className="nm">{x.cust}</div>
        <div className="m">{x.engines.length} engines &middot; {bomDone(x)} of {x.engines.length} BOM</div>
      </div>
    );
  });

  return (
    <>
      <button className="bk" onClick={function(){ go('#/deals'); }}>&larr; All deals</button>
      <div className="dsplit">
        <div className={'dlist'+(froze?' froze':'')}><div className="card">
          <div className="ch"><span className="t">Deals</span><span className="rgt tot">{DEALS.length} open</span></div>
          <div className="dlwrap">{list}</div>
          {froze
            ? <div className="frznote">Close or submit the BOM form before you move to another deal</div>
            : <div className="src"><span>Source <b>Deals</b></span><span></span></div>}
        </div></div>

        <div className="dbody">
          <div className="tabs">
            {Tab('sum','Summary')}
            {Tab('bom','BOM',<span className="cnt">{d.engines.length}</span>)}
            {Tab('pr','Purchase Request', shorts ? <span className="cnt">{shorts}</span> : null)}
            {Tab('tl','Timeline')}
          </div>
          {body}
        </div>
      </div>
    </>
  );
}
