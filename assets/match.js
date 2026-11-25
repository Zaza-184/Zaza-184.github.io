/* بحث ذكي مشترك (عربي/إنجليزي/أخطاء إملائية) لاستخدامه في لوحة التحكم.
   بيعتمد على data/kb.js لأسماء الألعاب بالعربي. نفس منطق مساعد الموقع. */
(function(){
const KB=window.ZKB||{t:[]};
const nz=s=>String(s||'').toLowerCase().replace(/[\u064b-\u0652\u0640]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/ؤ/g,'و').replace(/ئ/g,'ي').replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d));
const nq=s=>nz(s).replace(/[^a-z0-9\u0621-\u064a]/g,'');
const bgm=s=>{const a=[];for(let i=0;i<s.length-1;i++)a.push(s.slice(i,i+2));return a};
const dice=(a,b)=>{if(a==b)return 1;const x=bgm(a),y=bgm(b);if(!x.length||!y.length)return 0;const z=[...y];let c=0;x.forEach(p=>{const i=z.indexOf(p);if(i>-1){c++;z.splice(i,1)}});return 2*c/(x.length+y.length)};
const lev=(a,b)=>{const m=a.length,n=b.length;if(Math.abs(m-n)>2)return 9;let p=Array.from({length:n+1},(_,j)=>j);for(let i=1;i<=m;i++){const r=[i];for(let j=1;j<=n;j++)r[j]=Math.min(p[j]+1,r[j-1]+1,p[j-1]+(a[i-1]==b[j-1]?0:1));p=r}return p[n]};
const skel=s=>nq(s).replace(/[ثصزذظ]/g,'س').replace(/ض/g,'د').replace(/ط/g,'ت').replace(/ق/g,'ك').replace(/ح/g,'ه').replace(/[aeiouyاوي]/g,'').replace(/(.)\1+/g,'$1');
const LT={b:'ب',p:'ب',t:'ت',j:'ج',g:'ج',k:'ك',d:'د',r:'ر',z:'ز',s:'س',f:'ف',v:'ف',q:'ك',l:'ل',m:'م',n:'ن',h:'ه',w:'و',y:'ي',x:'كس'};
const tr=s=>s.toLowerCase().replace(/\b(ii|iii|iv|vi|vii|viii|ix)\b/g,m=>({ii:2,iii:3,iv:4,vi:6,vii:7,viii:8,ix:9}[m])).replace(/[^a-z0-9 ]/g,'').replace(/gh/g,'').replace(/\bkn/g,'n').replace(/\bwr/g,'r').replace(/sh/g,'ش').replace(/ch/g,'تش').replace(/kh/g,'خ').replace(/th/g,'ذ').replace(/ph/g,'ف').replace(/ck/g,'ك').replace(/c(?=[eiy])/g,'س').replace(/c/g,'ك').replace(/[a-z]/g,m=>LT[m]||'');
function aliases(title){const l=String(title).toLowerCase(),o=[];for(const r of KB.t)if(r[0].length<=4?new RegExp('(^|[^a-z0-9])'+r[0].replace(/[^a-z0-9 ]/g,'')+'([^a-z0-9]|$)').test(l):l.includes(r[0]))r[1].split('|').filter(Boolean).forEach(a=>o.push(a));return o}
function score(title,q){const c=nq(q);if(c.length<2)return 0;const cs=skel(q),toks=nz(q).split(/\s+/).map(nq),dg=nz(q).match(/\d+/g)||[];let b=0;
for(const a of [title,...aliases(title)]){const d=nq(a);if(!d)continue;if(d==c){b=1;break}if(d.length>=3&&toks.includes(d))b=Math.max(b,.9);
if(c.length>=3&&d.includes(c))b=Math.max(b,.9);else if(d.length>=4&&c.includes(d))b=Math.max(b,.88);else if(c.length>=4)b=Math.max(b,dice(d,c)*.95);
const ds=skel(a);if(cs.length>=3&&ds==cs)b=Math.max(b,.85);else if(cs.length>=4&&ds.includes(cs))b=Math.max(b,.8);
if(c.length>=6&&d.length>=6&&lev(d,c)<=(d.length>=10?2:1))b=Math.max(b,.85);
for(const w of a.split(/\s+/)){const x=nq(w);if(c.length>=5&&x.length>=5&&lev(x,c)<=1)b=Math.max(b,.8);if(cs.length>=3&&x.length>=4&&skel(w)==cs)b=Math.max(b,.8)}}
if(cs.length>=3&&/[\u0621-\u064a]/.test(c)){let ab;const as=skel(tr(String(title)));if(as==cs)b=Math.max(b,.82);else if(cs.length>=4&&as.includes(cs))b=Math.max(b,.76);else if(cs.length>=5&&lev(as,cs)<=1)b=Math.max(b,.78);else if((ab=as.replace(/[0-9]/g,'')).length>=3&&(ab.length>=4?cs.includes(ab):String(q).split(/\s+/).some(w=>skel(w)==ab)))b=Math.max(b,.8);else if(as.startsWith(cs))b=Math.max(b,cs.length>=4?.8:.78)}
if(b>=.6&&dg.length&&dg.every(d=>nq(title).includes(d)))b=Math.min(1.05,b+.08);return b}
window.ZM={nz,nq,skel,aliases,score,hit:(title,q)=>String(title).toLowerCase().includes(String(q).toLowerCase())||score(title,q)>=.6};
})();
