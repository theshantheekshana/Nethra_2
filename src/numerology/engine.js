import {LUCKY} from '../data/lucky';
const MASTER=[11,22,33], VOW='AEIOU';
const sumD=n=>String(n).split('').reduce((a,d)=>a+ +d,0);
// keeps master numbers 11/22/33
export const reduce=n=>{while(n>9&&!MASTER.includes(n))n=sumD(n);return n;};
// 1-9 only (used for yearly/monthly cycles)
const plain=n=>{while(n>9)n=sumD(n);return n;};
const VAL={};[...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].forEach((c,i)=>VAL[c]=i%9+1); // Pythagorean; Y = consonant
function nameCalc(name,pick=()=>true){
  const L=[...name.toUpperCase()].filter(c=>VAL[c]&&pick(c));
  const total=L.reduce((a,c)=>a+VAL[c],0),value=reduce(total);
  return {value,total,calc:`${total}${total>9?` → ${value}`:''}`,letters:L.map(c=>[c,VAL[c]])};
}
const base=n=>({11:2,22:4,33:6}[n]||n);
export function analyze({legalName,commonName,dd,mm,yyyy,birthTime},now=new Date()){
  const d=+dd,m=+mm,y=+yyyy,t=new Date(y,m-1,d);
  if(t.getFullYear()!==y||t.getMonth()!==m-1||t.getDate()!==d) throw new Error('උපන් දිනය වලංගු නැත.');
  const full=nameCalc(legalName),common=nameCalc(commonName);
  if(!full.letters.length||!common.letters.length) throw new Error('නම් English අකුරින් ඇතුළත් කරන්න.');
  const soul=nameCalc(legalName,c=>VOW.includes(c)),pers=nameCalc(legalName,c=>!VOW.includes(c));
  const rd=reduce(d),rm=reduce(m),ry=reduce(y),lp=reduce(rd+rm+ry),destiny=full.value;
  const py=yr=>plain(plain(d)+plain(m)+plain(yr)),Y=now.getFullYear(),pyNow=py(Y),pmNow=plain(pyNow+now.getMonth()+1);
  const mat=reduce(lp+destiny),L1=LUCKY[base(lp)],L2=LUCKY[base(destiny)],u=a=>[...new Set(a)];
  return {
    names:{legal:legalName.trim(),common:commonName.trim()},dob:`${dd}/${mm}/${yyyy}`,birthTime:birthTime||null,currentYear:Y,
    lifePath:{value:lp,calc:`${rd} + ${rm} + ${ry} = ${rd+rm+ry} → ${lp}`},
    destiny:{value:destiny,calc:full.calc},soulUrge:{value:soul.value,calc:soul.calc},personality:{value:pers.value,calc:pers.calc},
    birthday:{value:reduce(d),calc:`${d} → ${reduce(d)}`},
    maturity:{value:mat,calc:`${lp} + ${destiny} = ${lp+destiny} → ${mat}`},
    personalYear:{value:pyNow,calc:`${plain(d)} + ${plain(m)} + ${plain(Y)} → ${pyNow}`},
    personalMonth:{value:pmNow,calc:`${pyNow} + ${now.getMonth()+1} → ${pmNow}`},
    nameNumber:{value:full.value,calc:full.calc},commonName:{value:common.value,calc:common.calc},
    letters:{legal:full.letters,common:common.letters},
    timeline:Array.from({length:9},(_,k)=>({year:Y+k,personalYear:py(Y+k)})),
    lucky:{primary:L1.n,supporting:L2.n,days:u([...L1.d,...L2.d]),colors:u([...L1.c,...L2.c])}
  };
}
