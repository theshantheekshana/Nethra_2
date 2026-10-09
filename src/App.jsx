import {useState} from 'react';
import Dashboard from './pages/Dashboard';
import NewReading from './pages/NewReading';
export default function App(){
  const [r,setR]=useState({name:'home'});
  const go=(name,extra={})=>setR({name,...extra,k:Date.now()});
  return(<div className="min-h-screen">
    <header className="no-print px-6 py-4 border-b border-[#c9a24b]/30"><span className="serif text-xl tracking-[.3em] text-[#c9a24b]">NETHRA</span><span className="ml-4 text-xs opacity-60">ඔබේ අංකවලින් ඔබේ මාවත හඳුනාගන්න</span></header>
    {r.name==='home'?<div className="no-print"><Dashboard go={go}/></div>:<NewReading key={r.k} {...r} go={go}/>}
  </div>);
}
