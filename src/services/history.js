// Single-operator history in localStorage; swap for Firebase later without touching pages.
const K='nethra_readings';
const read=()=>{try{return JSON.parse(localStorage.getItem(K))||[];}catch{return [];}};
export const listReadings=()=>read().sort((a,b)=>b.createdAt-a.createdAt);
export const saveReading=r=>localStorage.setItem(K,JSON.stringify([r,...read().filter(x=>x.id!==r.id)]));
export const deleteReading=id=>localStorage.setItem(K,JSON.stringify(read().filter(x=>x.id!==id)));
