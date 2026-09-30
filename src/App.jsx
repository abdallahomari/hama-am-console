import { useEffect } from 'react';
import Sidebar from './components/Sidebar.jsx';
import Toast from './components/Toast.jsx';
import { useHash } from './lib/hooks.js';
import { byId, findBom, custById } from './lib/logic.js';
import { startDraft, DRAFT } from './lib/store.js';

import Dashboard from './pages/Dashboard.jsx';
import DealsPage from './pages/DealsPage.jsx';
import DealView from './pages/DealView.jsx';
import BomPage from './pages/BomPage.jsx';
import BomSplit from './pages/BomSplit.jsx';
import PrPage from './pages/PrPage.jsx';
import PrSplit from './pages/PrSplit.jsx';
import CustPage from './pages/CustPage.jsx';
import CustSplit from './pages/CustSplit.jsx';

export default function App(){
  var h=useHash();

  useEffect(function(){ window.scrollTo(0,0); },[h]);

  /* a draft can be opened straight from the URL, so the overlay is linkable */
  var mc=h.match(/^#\/deals\/([A-Z0-9-]+)\/bom\/(create|edit)\/([A-Z0-9-]+)(\/verified)?/);
  if(mc && byId(mc[1])){
    startDraft(mc[1], mc[3], mc[2]==='edit');
    if(mc[4]) DRAFT.verified=true;
  }

  var page=renderPage(h);

  return (
    <>
      <div className="appbar"></div>
      <Sidebar hash={h} />
      <div className="shell"><div className="main">{page}</div></div>
      <Toast />
    </>
  );
}

function renderPage(h){
  var md=h.match(/^#\/deals\/([A-Z0-9-]+)(?:\/(sum|bom|pr|tl))?/);
  if(md && byId(md[1])){
    return <DealView deal={byId(md[1])} tab={md[2]||'sum'} />;
  }
  if(h.indexOf('#/deals')===0){
    return <DealsPage />;
  }
  if(h.indexOf('#/bom')===0){
    /* a BOM opens inside the BOM section — BOM stays primary */
    var mb=h.match(/^#\/bom\/([A-Z0-9-]+)/);
    var hit = mb && findBom(mb[1]);
    return hit ? <BomSplit no={mb[1]} /> : <BomPage />;
  }
  if(h.indexOf('#/pr')===0){
    var mp=h.match(/^#\/pr\/([A-Z0-9-]+)/);
    return (mp && byId(mp[1])) ? <PrSplit dealId={mp[1]} /> : <PrPage />;
  }
  if(h.indexOf('#/customers')===0){
    var mu=h.match(/^#\/customers\/([A-Za-z0-9-]+)/);
    return (mu && custById(mu[1])) ? <CustSplit id={mu[1]} /> : <CustPage />;
  }
  return <Dashboard />;
}
