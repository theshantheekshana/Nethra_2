import {useState} from 'react';
import {Plus,Search,FolderOpen,RefreshCw,Download,Trash2} from 'lucide-react';
import {listReadings,deleteReading} from '../services/history';
export default function Dashboard({go}){
  const [q,setQ]=useState(''),[items,setItems]=useState(listReadings());
  const shown=items.filter(r=>(r.input.legalName+r.input.commonName).toLowerCase().includes(q.toLowerCase()));
  const del=r=>{if(confirm('මෙම Reading එක මකන්නද?')){deleteReading(r.id);setItems(listReadings());}};
  const B=({t,f,children})=><button title={t} onClick={f} className="p-2 rounded-lg hover:bg-white/10 text-[#c9a24b]">{children}</button>;
  return(<main className="max-w-3xl mx-auto p-6">
    <h1 className="serif text-3xl text-[#c9a24b] mb-6">Welcome to NETHRA</h1>
    <button onClick={()=>go('new')} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#c9a24b] text-[#0b1030] font-semibold"><Plus size={18}/> New Life Reading</button>
    <div className="mt-10 flex items-center gap-2 border-b border-[#c9a24b]/40 pb-2"><Search size={16}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search readings" className="bg-transparent outline-none flex-1"/></div>
    {shown.length===0&&<p className="opacity-60 mt-6">තවම Reading නැත. “New Life Reading” ඔබා පළමු එක සාදන්න.</p>}
    {shown.map(r=><div key={r.id} className="flex items-center justify-between py-3 border-b border-white/10">
      <div><div className="font-semibold">{r.input.legalName}</div><div className="text-xs opacity-60">{r.analysis.dob} · {new Date(r.createdAt).toLocaleDateString('en-GB')} · {r.status}</div></div>
      <div className="flex"><B t="Open" f={()=>go('reading',{initial:r})}><FolderOpen size={18}/></B><B t="Regenerate" f={()=>go('new',{initial:{id:r.id,input:r.input},auto:true})}><RefreshCw size={18}/></B>
      <B t="Download" f={()=>go('reading',{initial:r,print:true})}><Download size={18}/></B><B t="Delete" f={()=>del(r)}><Trash2 size={18}/></B></div></div>)}
  </main>);
}
