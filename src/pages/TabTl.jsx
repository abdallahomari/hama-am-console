import { bomDone, countSt, dealShort } from '../lib/logic.js';

export default function TabTl({ d }){
  var nBom=bomDone(d), nPend=countSt(d,'pending'), shorts=dealShort(d).length;
  var cur = nBom<d.engines.length ? 1 : (nPend? 2 : 3);
  var steps=[
    {h:'Deal received', s:'Synced from CRM · '+d.engines.length+' engines'},
    {h:'Bill of materials', s:nBom+' of '+d.engines.length+' created'+(nBom<d.engines.length? ' · '+(d.engines.length-nBom)+' outstanding':'')},
    {h:'Factory Manager approval', s: nPend? nPend+' awaiting decision' : 'Begins when the first is submitted'},
    {h:'Purchase request', s: shorts? shorts+' parts short · not yet raised' : 'Nothing to buy'}
  ];

  var rows=steps.map(function(x,i){
    var c = i<cur ? 'done' : (i===cur ? 'now':'todo');
    return (
      <div key={x.h} style={{display:'flex',gap:'.8rem'}}>
        <div style={{flex:'none',width:'1.4rem',display:'flex',flexDirection:'column',alignItems:'center'}}>
          <div style={{
            width:'1.3rem',height:'1.3rem',borderRadius:'50%',fontSize:'.6rem',fontWeight:800,
            display:'flex',alignItems:'center',justifyContent:'center',
            background: c==='done'?'var(--green)':c==='now'?'var(--accent)':'#fff',
            color: c==='done'||c==='now' ? '#fff' : 'var(--ink3)',
            border: c==='todo' ? '2px solid #D3D9E0' : undefined
          }}>{c==='done'?'✓':(i+1)}</div>
          {i<steps.length-1
            ? <div style={{flex:1,width:'2px',background:(c==='done'?'#B9E2CB':'var(--line2)'),margin:'.25rem 0'}}></div>
            : null}
        </div>
        <div style={{paddingBottom:'1rem'}}>
          <div style={{fontSize:'.82rem',fontWeight:700,color:(c==='todo'?'var(--ink3)':undefined)}}>{x.h}</div>
          <div style={{fontSize:'.7rem',color:'var(--ink2)',marginTop:'.1rem'}}>{x.s}</div>
        </div>
      </div>
    );
  });

  return (
    <div className="card"><div className="ch"><span className="t">Timeline</span><span className="tot">your part of the work</span></div>
      <div className="cb">{rows}</div>
      <div className="src"><span>Built from <b>Deals</b>, <b>Repair_BOM</b> and <b>Purchase_Requests</b></span><span></span></div>
    </div>
  );
}
