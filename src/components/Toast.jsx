import { useEffect, useRef, useState } from 'react';
import { TOAST_LISTENERS } from '../lib/store.js';

export default function Toast(){
  var [msg, setMsg]=useState('');
  var [on, setOn]=useState(false);
  var timer=useRef(null);

  useEffect(function(){
    function show(m){
      setMsg(m);
      setOn(true);
      clearTimeout(timer.current);
      timer.current=setTimeout(function(){ setOn(false); },2400);
    }
    TOAST_LISTENERS.add(show);
    return function(){ TOAST_LISTENERS.delete(show); clearTimeout(timer.current); };
  },[]);

  return <div id="toast" className={on?'on':''}>{msg}</div>;
}
