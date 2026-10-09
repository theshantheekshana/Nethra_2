import {Fragment} from 'react';
import {SECTIONS,GROUPS} from '../data/sections';
import {THEMES} from '../data/lucky';
export const fileName=r=>`NETHRA_${(r.input.commonName||r.input.legalName).trim().replace(/\s+/g,'_')}_Life_Reading`;
export function printReport(name){const t=document.title;document.title=name;window.onafterprint=()=>{document.title=t;};window.print();}
const CARDS=[['lifePath','ජීවිත මාර්ග අංකය','Life Path'],['destiny','ඉරණම් අංකය','Destiny'],['soulUrge','ආත්ම අභිලාෂ අංකය','Soul Urge'],['personality','පෞරුෂ අංකය','Personality'],['birthday','උපන් දින අංකය','Birthday'],['maturity','පරිණත අංකය','Maturity'],['personalYear','පුද්ගලික වර්ෂ අංකය','Personal Year'],['personalMonth','පුද්ගලික මාස අංකය','Personal Month'],['nameNumber','නීතිමය නාම අංකය','Name'],['commonName','ව්‍යවහාර නාම අංකය','Common Name']];
const Paras=({t})=>(t||'').split(/\n\s*\n/).map((p,i)=><p key={i}>{p}</p>);
const Chips=({items})=><div className="flex gap-2 flex-wrap mb-4">{items.map(x=><span key={x} className="px-3 py-1 rounded-full bg-[#3b1a6e] text-[#f6efdc] text-sm">{x}</span>)}</div>;
export default function ReportDocument({r}){
  const {input:i,analysis:a,texts}=r,date=new Date(r.createdAt).toLocaleDateString('en-GB');let last=-1;
  const extra={
    profile:<div className="grid grid-cols-5 gap-2 mb-5">{CARDS.map(([k,si,en])=><div key={k} className="break-inside-avoid text-center rounded-xl border border-[#c9a24b] bg-white/60 p-2">
      <div className="serif text-3xl text-[#3b1a6e]">{a[k].value}</div><div className="text-[9pt] leading-tight">{si}</div><div className="text-[8pt] opacity-60">{en}</div><div className="text-[8pt] text-[#8a6a1f]">{a[k].calc}</div></div>)}</div>,
    luckynum:<><Chips items={a.lucky.primary}/><Chips items={a.lucky.supporting}/></>,
    luckydays:<Chips items={a.lucky.days}/>,luckycolors:<Chips items={a.lucky.colors}/>,
    periods:<table className="w-full text-sm mb-5 border-collapse"><tbody>{a.timeline.map(t=><tr key={t.year} className="border-b border-[#c9a24b]/50"><td className="py-1 font-semibold">{t.year}</td><td className="text-center">{t.personalYear}</td><td>{THEMES[t.personalYear]}</td></tr>)}</tbody></table>
  };
  return(<div id="report" className="sheet">
    <section className="cover"><div className="text-[#c9a24b] tracking-[.5em]">✦ ✦ ✦</div>
      <h1 className="serif text-7xl tracking-[.25em] text-[#c9a24b] mt-6">NETHRA</h1>
      <div className="mt-3 tracking-[.3em] text-lg">PERSONAL LIFE READING</div>
      <p className="mt-6 text-[#c9a24b]">ඔබේ අංකවලින් ඔබේ මාවත හඳුනාගන්න</p>
      <p className="mt-24 text-2xl">{i.legalName}</p><p className="mt-2 text-sm opacity-70">{date}</p></section>
    <section className="body"><h2>පාරිභෝගික තොරතුරු</h2>
      <table className="w-full mb-6"><tbody>{[['Full Legal Name',i.legalName],['Common Name',i.commonName],['Date of Birth',a.dob],['Birth Time',i.birthTime||'—']].map(([k,v])=><tr key={k} className="border-b border-[#c9a24b]/50"><td className="py-2 w-1/3 text-[#3b1a6e]">{k}</td><td>{v}</td></tr>)}</tbody></table>
      <p>මෙම වාර්තාව අංක විද්‍යාත්මක සංකේතාත්මක අර්ථකථනයක් පමණි. එය නිශ්චිත අනාවැකියක් හෝ සහතිකයක් නොවේ; ඔබගේ තීරණ ඔබගේම විචාර බුද්ධිය මත පදනම් විය යුතුය.</p></section>
    {SECTIONS.map((s,k)=>{const nd=s.group!==last;last=s.group;return(<Fragment key={s.id}>
      {nd&&<section className="cover"><div className="text-[#c9a24b] text-xl tracking-widest">{['I','II','III','IV','V','VI'][s.group]}</div><h2 className="serif text-4xl mt-4">{GROUPS[s.group]}</h2></section>}
      <section className="body"><h2>{k+1}. {s.title}</h2>{extra[s.id]}<Paras t={texts[s.id]}/></section></Fragment>);})}
    <section className="cover"><h2 className="serif text-5xl tracking-[.25em] text-[#c9a24b]">NETHRA</h2><p className="mt-6">ඔබේ අංකවලින් ඔබේ මාවත හඳුනාගන්න</p><p className="mt-10 text-sm opacity-70">ඔබගේ ගමන සාර්ථක වේවා.</p></section>
  </div>);
}
