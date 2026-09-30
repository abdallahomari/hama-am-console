import { dealShort, countSt, money } from '../lib/logic.js';
import { toast } from '../lib/store.js';

export default function TabPr({ d }){
  var items=dealShort(d);
  if(!items.length){
    return (
      <div className="card"><div className="ch"><span className="t">Purchase Request</span><span className="tot">nothing outstanding</span></div>
        <div className="cb" style={{textAlign:'center',padding:'2.2rem 1rem',color:'var(--ink3)'}}>
          <div style={{fontSize:'.86rem',fontWeight:700,color:'var(--ink2)',marginBottom:'.25rem'}}>Nothing to buy for this deal</div>
          Every part on every bill of materials is in stock.
        </div>
        <div className="src"><span>One purchase request per deal</span><span></span></div>
      </div>
    );
  }

  var totQty=items.reduce(function(a,i){ return a+(i.need-i.stock); },0);
  var nNew=items.filter(function(i){ return i.isNew; }).length;
  var noBom=countSt(d,'none');

  var rows=items.slice().sort(function(a,b){ return (b.need-b.stock)-(a.need-a.stock); })
    .map(function(i){
      return (
        <tr key={i.code} className="hov"><td className="k">{i.code}</td>
          <td style={{fontWeight:600}}>{i.part}{i.isNew ? <> <span className="pill p-gry">NEW ITEM</span></> : null}
            <div className="sub2">{i.from.length>1
                ? 'wanted by '+i.from.length+' bills of materials · '+i.from.join(', ')
                : i.from[0]}</div></td>
          <td className="n r">{i.need}</td>
          <td className={'n r'+(i.stock?'':' muted')}>{i.stock}</td>
          <td className="n r" style={{fontWeight:700,color:'#B4231A'}}>{i.need-i.stock}</td>
        </tr>
      );
    });

  return (
    <div className="card hot">
      <div className="ch"><span className="t">Purchase Request</span>
        <span className="tot">{items.length} item{items.length!==1?'s':''} to buy &middot; {totQty} units{nNew ? ' · '+nNew+' new' : ''}</span>
        <span className="rgt">
          {noBom
            ? <>
                <span style={{fontSize:'.72rem',color:'#8A6412',fontWeight:600}}>{noBom} engine{noBom>1?'s':''} still without a BOM</span>
                <button className="btn pri" disabled title="Every engine in the deal needs a bill of materials before the request can go">Proceed</button>
              </>
            : <button className="btn pri" onClick={function(){ toast('Purchase request raised for '+d.id+' — pushed to Inventory, submitted, Factory Manager notified'); }}>Proceed</button>}
        </span>
      </div>
      <table><thead><tr><th>Item code</th><th>Item</th><th className="r">Required across the deal</th>
        <th className="r">In stock</th><th className="r">Balance to buy</th></tr></thead>
      <tbody>{rows}</tbody></table>
      <div className="src"><span>Consolidated by item &middot; stock is counted once for the whole deal
        {noBom ? <> &middot; <b>{noBom}</b> engine{noBom>1?'s':''} still without a BOM, so this may grow</> : null}</span>
      <span>One request per deal</span></div>
    </div>
  );
}
