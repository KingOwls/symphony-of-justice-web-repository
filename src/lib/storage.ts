export function loadStored<T>(key:string,fallback:T):T{try{const raw=localStorage.getItem('soj.v2.'+key);return raw?JSON.parse(raw) as T:fallback}catch{return fallback}}
export function saveStored<T>(key:string,value:T){try{localStorage.setItem('soj.v2.'+key,JSON.stringify(value))}catch{/* private mode */}}
