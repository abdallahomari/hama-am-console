import { DEALS } from '../lib/data.js';
import { needCount, dealShort } from '../lib/logic.js';
import { go } from '../lib/store.js';

export default function Sidebar({ hash }){
  var need=0, shorts=0;
  DEALS.forEach(function(d){ need+=needCount(d); shorts+=dealShort(d).length; });
  var items=[
    {k:'', t:'Dashboard', hash:'#/'},
    {k:'deals', t:'Deals', hash:'#/deals', bd:need},
    {k:'bom', t:'BOM', hash:'#/bom'},
    {k:'pr', t:'Purchase Request', hash:'#/pr', bd:shorts},
    {k:'cust', t:'Customers', hash:'#/customers'}
  ];
  var cur = hash.indexOf('#/deals')===0 ? 'deals' : hash.indexOf('#/bom')===0 ? 'bom'
          : hash.indexOf('#/pr')===0 ? 'pr' : hash.indexOf('#/customers')===0 ? 'cust' : '';

  return (
    <aside className="side">
      <div className="sidetop">
        <img src="https://hama-ind.com/wp-content/uploads/2024/10/hamalogo-1024x511.webp" alt="HAMA" />
        <div className="nm2">HAMA</div>
      </div>
      <div className="snav">
        <div className="sgl">Workspace</div>
        {items.map(function(x){
          return (
            <div key={x.k} className={'sitem'+(cur===x.k?' on':'')} onClick={function(){ go(x.hash); }}>
              <i></i>{x.t}
              {x.bd ? <span className="bd">{x.bd}</span> : null}
            </div>
          );
        })}
      </div>
      <div className="sfoot"><span className="av">AM</span><span className="who">Application Manager</span></div>
    </aside>
  );
}
