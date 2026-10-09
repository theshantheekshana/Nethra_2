import {useState,useEffect} from 'react';
import {Sparkles,Eye,Download,RefreshCw,Save,ArrowLeft} from 'lucide-react';
import {analyze} from '../numerology/engine';
import {SECTIONS} from '../data/sections';
import {generateSection,accessKey} from '../ai/aiService';
import {saveReading} from '../services/history';
import ReportDocument,{printReport,fileName} from '../pdf/ReportDocument';
const empty={legalName:'',commonName:'',dd:'',mm:'',yyyy:'',birthTime:''};
const inp="rounded-lg bg-[#0b1030] border border-[#c9a24b]/40 px-3 py-2 outline-none focus:border-[#c9a24b]";
const Step=({n,label,help,children})=><div className="rounded-2xl bg-white/5 border border-[#c9a24b]/25 p-5"><div className="text-[#c9a24b] text-xs mb-1">STEP {n}</div><label className="block font-semibold mb-2">{label}</label>{children}<p className="text-xs opacity-60 mt-2">{help}</p></div>;
export default function NewReading({initial,auto,print,go}){
  const [f,setF]=useState(initial?.input||empty),[rd,setRd]=useState(initial?.texts?initial:null);
  const [prog,setProg]=useState(null),[err,setErr]=useState(''),[prev,setPrev]=useState(false),[saved,setSaved]=useState(false);
  const set=(k,up)=>e=>setF({...f,[k]:up?e.target.value.toUpperCase():e.target.value});
  const ok=f.legalName.trim()&&f.commonName.trim()&&f.dd&&f.mm&&f.yyyy.length===4;
  async function run(){
    setErr('');setRd(null);setSaved(false);setPrev(false);setProg(0);
    try{
      const analysis=analyze(f),texts={};accessKey();
      for(let i=0;i<SECTIONS.length;i+=4){
        await Promise.all(SECTIONS.slice(i,i+4).map(async s=>{texts[s.id]=await generateSection(s,analysis);}));
        setProg(Math.round(Math.min(i+4,SECTIONS.length)/SECTIONS.length*100));
      }
      setRd({id:initial?.id||crypto.randomUUID(),input:f,analysis,texts,createdAt:Date.now(),status:'Complete'});
    }catch(e){setErr(e.message);}
    setProg(null);
  }
  const download=()=>{setPrev(true);setTimeout(()=>printReport(fileName(rd)),400);};
  useEffect(()=>{if(auto)run();if(print&&rd)download();},[]);
  const Btn=({onClick,children})=><button onClick={onClick} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#c9a24b] text-[#c9a24b] hover:bg-[#c9a24b]/10">{children}</button>;
  return(<>
    <main className="no-print max-w-2xl mx-auto p-6 space-y-4">
      <button onClick={()=>go('home')} className="flex items-center gap-1 text-sm opacity-70"><ArrowLeft size={14}/> Dashboard</button>
      {!rd&&<>
        <Step n={1} label="උප්පැන්න සහතිකයේ සඳහන් සම්පූර්ණ නම" help="උප්පැන්න සහතිකයේ සඳහන් සම්පූර්ණ නම English Block Capitals වලින් ඇතුළත් කරන්න."><input className={inp+' w-full'} placeholder="KAMAL PERERA" value={f.legalName} onChange={set('legalName',1)}/></Step>
        <Step n={2} label="දැනට ඔබ බහුලව භාවිත කරන නම" help="සමාජයේ, රැකියාවේ හෝ මිතුරන් අතර ඔබව හඳුන්වන නම."><input className={inp+' w-full'} placeholder="KAMAL" value={f.commonName} onChange={set('commonName',1)}/></Step>
        <Step n={3} label="උපන් දිනය" help="DD / MM / YYYY"><div className="flex gap-2"><input className={inp+' w-20'} placeholder="DD" maxLength={2} value={f.dd} onChange={set('dd')}/><input className={inp+' w-20'} placeholder="MM" maxLength={2} value={f.mm} onChange={set('mm')}/><input className={inp+' w-28'} placeholder="YYYY" maxLength={4} value={f.yyyy} onChange={set('yyyy')}/></div></Step>
        <Step n={4} label="උපන් වේලාව (අවශ්‍ය නොවේ)" help="සාමාන්‍ය අංක විද්‍යාව සඳහා උපන් දිනය ප්‍රමාණවත් වේ. උපන් වේලාව ලබාදී ඇත්නම් අමතර time-based interpretation සඳහා භාවිත කළ හැක."><input type="time" className={inp} value={f.birthTime} onChange={set('birthTime')}/></Step>
        {err&&<p className="text-red-300">{err}</p>}
        <button disabled={!ok||prog!==null} onClick={run} className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-[#c9a24b] text-[#0b1030] font-semibold disabled:opacity-40"><Sparkles size={18}/>{prog===null?'සම්පූර්ණ Life Reading එක සකස් කරන්න':`සකස් කරමින්… ${prog}%`}</button>
      </>}
      {rd&&<div className="rounded-2xl border border-[#c9a24b]/40 p-6 space-y-4"><p className="serif text-lg text-[#c9a24b]">ඔබගේ NETHRA Life Reading එක සාර්ථකව සකස් කර ඇත.</p>
        <div className="flex flex-wrap gap-2"><Btn onClick={()=>setPrev(!prev)}><Eye size={16}/> Preview PDF</Btn><Btn onClick={download}><Download size={16}/> Download PDF</Btn>
        <Btn onClick={()=>{setRd(null);run();}}><RefreshCw size={16}/> Generate Again</Btn><Btn onClick={()=>{saveReading(rd);setSaved(true);}}><Save size={16}/> {saved?'Saved':'Save Reading'}</Btn></div></div>}
    </main>
    {rd&&prev&&<ReportDocument r={rd}/>}
  </>);
}
