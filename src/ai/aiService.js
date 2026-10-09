// Provider-agnostic client: the browser only talks to our own /api/generate.
export const accessKey=()=>localStorage.getItem('nethra_key')||(()=>{const k=prompt('NETHRA access key');if(k)localStorage.setItem('nethra_key',k);return k;})();
export async function generateSection(section,analysis){
  const r=await fetch('/api/generate',{method:'POST',headers:{'Content-Type':'application/json','x-nethra-key':localStorage.getItem('nethra_key')||''},body:JSON.stringify({section,analysis})});
  const j=await r.json().catch(()=>({}));
  if(r.status===401) localStorage.removeItem('nethra_key');
  if(!r.ok) throw new Error(j.error||r.statusText);
  return j.text;
}
