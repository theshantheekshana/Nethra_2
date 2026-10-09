// Serverless function (Vercel). The AI key lives only here, never in the browser.
export const config={maxDuration:60};
const SYSTEM=`You are NETHRA, a senior Sinhala numerology consultant. Write natural, elegant Sinhala (Unicode), with English numerology terms in brackets, e.g. ජීවිත මාර්ග අංකය (Life Path Number). Sound like a human consultant; never mention AI. Use only the supplied calculated numbers. Never state exact events, dates, guaranteed outcomes or wealth, number of children, pregnancy or fertility; use tendency language such as "ඔබගේ අංක රටාව අනුව ... ප්‍රවණතාවක් පෙනේ". Never say the person must change a name. Plain paragraphs only, no markdown or bullets, blank line between paragraphs, about 220-300 words.`;
// Add providers here to swap AI vendors; select with AI_PROVIDER.
const providers={
  anthropic:async(system,user)=>{
    const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',
      headers:{'x-api-key':process.env.ANTHROPIC_API_KEY,'anthropic-version':'2023-06-01','content-type':'application/json'},
      body:JSON.stringify({model:process.env.AI_MODEL||'claude-sonnet-5-5',max_tokens:3500,system,messages:[{role:'user',content:user}]})});
    const j=await r.json(); if(!r.ok) throw new Error(j.error?.message||'AI error');
    return j.content.map(c=>c.text||'').join('');
  }};
export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'POST only'});
  if(req.headers['x-nethra-key']!==process.env.NETHRA_ACCESS_KEY) return res.status(401).json({error:'Invalid access key'});
  try{
    const {section,analysis}=req.body;
    const text=await providers[process.env.AI_PROVIDER||'anthropic'](SYSTEM,
      `Section: ${section.title}\nWrite about: ${section.brief}\nCalculated data (JSON): ${JSON.stringify(analysis)}`);
    res.status(200).json({text});
  }catch(e){res.status(500).json({error:e.message});}
}
