import { useSyncExternalStore } from 'react';
import { subscribe, getVersion, getHash } from './store.js';

/* re-renders whenever bump() fires (draft edits, toasts-in-place actions) */
export function useVersion(){
  return useSyncExternalStore(subscribe, getVersion);
}

/* re-renders on hash navigation, mirroring the original hashchange listener */
export function useHash(){
  useVersion();
  return useSyncExternalStore(
    function(onChange){
      window.addEventListener('hashchange', onChange);
      return function(){ window.removeEventListener('hashchange', onChange); };
    },
    getHash
  );
}
