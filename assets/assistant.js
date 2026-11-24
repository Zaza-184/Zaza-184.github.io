/* مساعد ZAZA: بيشتغل جوه الموقع من غير أي خدمة برّه ومن غير تكلفة.
   بيفهم أسماء الألعاب بالعربي والإنجليزي (مع الأخطاء الإملائية)، ويرشّح حسب النوع والجمهور (بنات/أطفال/مع صحابك…)،
   ويرد على الجديد والملحقات والأسعار والسلام والكلام العادي. القاعدة في data/kb.js
   لو عايز ذكاء اصطناعي حقيقي بعدين: حط لينك الوسيط في ZAI.url */
(function(){
const KB=window.ZKB||{t:[],fm:[]},$=s=>document.querySelector(s),E=s=>String(s??'').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
const nz=s=>String(s||'').toLowerCase().replace(/[\u064b-\u0652\u0640]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/ؤ/g,'و').replace(/ئ/g,'ي').replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d));
const nq=s=>nz(s).replace(/[^a-z0-9\u0621-\u064a]/g,'');
const bgm=s=>{const a=[];for(let i=0;i<s.length-1;i++)a.push(s.slice(i,i+2));return a};
const dice=(a,b)=>{if(a==b)return 1;const x=bgm(a),y=bgm(b);if(!x.length||!y.length)return 0;const z=[...y];let c=0;x.forEach(p=>{const i=z.indexOf(p);if(i>-1){c++;z.splice(i,1)}});return 2*c/(x.length+y.length)};
const pick=a=>a[Math.floor(Math.random()*a.length)],sleep=ms=>new Promise(r=>setTimeout(r,ms));
const GEN={'أكشن ومغامرات':'action','عالم مفتوح':'openworld','تصويب وحرب':'shooter war','سباق':'racing cars','رياضة':'sports','قتال':'fighting','رعب':'horror','أطفال وعائلة':'family kids','قصصية وألغاز':'story puzzle'};
const FRI=/على جهاز واحد|محلي|لاعبين اثنين|حتى لاعبين|حتى 4 لاعبين|حتى 8 لاعبين|لاعبين أو أكتر|ألعاب جماعية|تعاوني|أو لاعبين/,ONL=/أونلاين/;
const SYN={girls:'بنات|بنت|بنوته|بنتي|اختي|حريمي|مراتي|خطيبتي',kids:'اطفال|عيال|ابني|ابنتي|بنتي|صغير|ولادي|طفل|kids',family:'عائل|اسره',horror:'رعب|مخيف|خوف|مرعب|horror',openworld:'عالم مفتوح|اوبن|حريه',story:'قصه|حكايه|سينمائي|دراما',racing:'سباق|عربيات|سيارات|ريسينج|ريسنج|cars|racing',football:'كوره|فيفا|بيس|فوتبول|football|soccer',sports:'رياضه',fighting:'قتال|ضرب|فايتنج|مصارعه|fighting',coop:'تعاوني|كوب|سوا',friends:'صحاب|اتنين|نفس الجهاز|مع حد|اخويا|صاحبي|سهره|جماعي',online:'اونلاين|اون لاين',single:'لوحدي|لاعب واحد|solo|بمفردي',shooter:'تصويب|اطلاق نار|شوتر|حرب|shooter|fps',action:'اكشن|مغامر',superhero:'سوبر هيرو|ابطال خارقين',soulslike:'سولز',hard:'صعبه|صعب|تحدي|تتعب',relax:'هاديه|هادي|تريح|مريحه|استرخاء|بدون ضغط',short:'قصيره|سريعه|وقت قليل|نهايه سريعه',long:'طويله|كبيره|ساعات طويله|اقضي وقت',cinematic:'سينمائي|فيلم|جرافيك|اخراج',comedy:'مضحكه|كوميدي|ضحك',cartoon:'كرتون|كرتوني|انيميشن|رسوم',dark:'ظلام|مظلم|داكنه',survival:'بقاء|نجاه',creative:'بناء|ابداع',stealth:'تسلل|خفيه',puzzle:'الغاز|لغز|تفكير',cooking:'طبخ|مطبخ|طباخ|كوكنج|cooking',zombie:'زومبي|zombie',platformer:'منصات|قفز'};
const INTRO={girls:'دي ألعاب هادية ومناسبة للبنات',kids:'دي ألعاب مناسبة للأطفال',family:'دي ألعاب عائلية',friends:'دي ألعاب حلوة تلعبها مع صحابك',horror:'دي ألعاب رعب',racing:'دي ألعاب سباقات',football:'دي ألعاب كورة',fighting:'دي ألعاب قتال',openworld:'دي ألعاب عالم مفتوح',action:'دي ألعاب أكشن',story:'دي ألعاب بقصة قوية',zombie:'دي ألعاب زومبي',shooter:'دي ألعاب تصويب وحرب',creative:'دي ألعاب إبداع وبناء',cooking:'دي ألعاب طبخ وفوضى وضحك',single:'دي ألعاب تتسلى بيها لوحدك',relax:'دي ألعاب هادية تريّح الأعصاب',hard:'دي ألعاب صعبة ومليانة تحدي',short:'دي ألعاب قصيرة تخلّصها في وقت قليل',long:'دي ألعاب طويلة تاخد منك ساعات',cinematic:'دي ألعاب سينمائية بإخراج قوي',comedy:'دي ألعاب مضحكة',cartoon:'دي ألعاب كرتونية',dark:'دي ألعاب بجو مظلم وتقيل'};
const CAT=[['شاحن|شواحن|شحن دراع|شحن الدراع','شواحن'],['وصل|كبل|كابل|hdmi|اتش دي|باور','وصلات وكابلات'],['استند|ستاند|حامل','استاندات'],['جراب|سكن|شنط|كفر','جرابات وسكنات'],['دراع|كنترولر','دراعات']];
let C,isNew,Ent=[],Prod=[],last=null,ready=0;
const Z=window.ZAI={url:'',search,searchAcc,open};
Z.init=ctx=>{C=ctx.C;isNew=ctx.isNew;Z.ctx=ctx;build();Z.ents=()=>Ent;mount();ready=1};
function kb(t){const l=t.toLowerCase(),ar=[],tg=new Set();for(const r of KB.t)if(r[0].length<=4?new RegExp('(^|[^a-z0-9])'+r[0].replace(/[^a-z0-9 ]/g,'')+'([^a-z0-9]|$)').test(l):l.includes(r[0])){r[1].split('|').forEach(a=>ar.push(a));r[2].split(' ').forEach(x=>tg.add(x))}return{ar,tg}}
function build(){const M=new Map();
const add=(t,tab,key,price,combo,g,oos)=>{const k=nq(t);let e=M.get(k);if(!e){const b=kb(t);e={title:t,ar:b.ar,tags:b.tg,icon:'',genres:new Set(),players:'',blurb:'',av:[],isnew:false};M.set(k,e)}
if(!e.icon&&g.icon)e.icon=g.icon;(g.genres||[]).forEach(x=>{e.genres.add(x);(GEN[x]||'').split(' ').forEach(y=>y&&e.tags.add(y))});
if(g.players&&!e.players)e.players=g.players;if(g.blurb&&!e.blurb)e.blurb=g.blurb;if(FRI.test(g.players||''))e.tags.add('friends');if(ONL.test(g.players||''))e.tags.add('online');if(/لاعب واحد/.test(g.players||''))e.tags.add('single');
e.av.push({tab:tab.id,tabTitle:tab.title,key,price,combo,oos:!!oos});if(isNew(tab.id,key))e.isnew=true};
for(const tab of C.tabs){if(tab.kind=='modded')for(const g of C.games[tab.id])add(g.title,tab,g._k||g.title,g.price||null,false,g,g.oos);
else if(tab.kind=='originals')for(const g of C.originals)add(g.title,tab,g._k||g.title,(g.prices&&g.prices[0]&&g.prices[0][1])||null,false,g,g.oos);
else if(tab.kind=='accounts')for(const a of C.accts[tab.id])for(const i of a.items)add(i.title,tab,a._k||a.name,a.items.length==1?a.price:null,a.items.length>1,i,a.oos)}
Ent=[...M.values()];Ent.forEach(e=>{e.open=e.av.find(a=>!a.combo)||e.av[0];e.newAv=e.av.filter(a=>isNew(a.tab,a.key))});
Prod=(C.products||[]).map(p=>({name:p.name,price:p.price,cat:p.cat,ok:p.in_stock,img:p.img,key:p._k||p.name}))}
const lev=(a,b)=>{const m=a.length,n=b.length;if(Math.abs(m-n)>2)return 9;let p=Array.from({length:n+1},(_,j)=>j);for(let i=1;i<=m;i++){const r=[i];for(let j=1;j<=n;j++)r[j]=Math.min(p[j]+1,r[j-1]+1,p[j-1]+(a[i-1]==b[j-1]?0:1));p=r}return p[n]};
const skel=s=>nq(s).replace(/[ثصزذظ]/g,'س').replace(/ض/g,'د').replace(/ط/g,'ت').replace(/ق/g,'ك').replace(/ح/g,'ه').replace(/[aeiouyاوي]/g,'').replace(/(.)\1+/g,'$1');
const LT={b:'ب',p:'ب',t:'ت',j:'ج',g:'ج',k:'ك',d:'د',r:'ر',z:'ز',s:'س',f:'ف',v:'ف',q:'ك',l:'ل',m:'م',n:'ن',h:'ه',w:'و',y:'ي',x:'كس'};
const tr=s=>s.toLowerCase().replace(/\b(ii|iii|iv|vi|vii|viii|ix)\b/g,m=>({ii:2,iii:3,iv:4,vi:6,vii:7,viii:8,ix:9}[m])).replace(/[^a-z0-9 ]/g,'').replace(/gh/g,'').replace(/\bkn/g,'n').replace(/\bwr/g,'r').replace(/sh/g,'ش').replace(/ch/g,'تش').replace(/kh/g,'خ').replace(/th/g,'ذ').replace(/ph/g,'ف').replace(/ck/g,'ك').replace(/c(?=[eiy])/g,'س').replace(/c/g,'ك').replace(/[a-z]/g,m=>LT[m]||'');
const arsk=e=>e._ak||(e._ak=skel(tr(e.title)));
function sc(e,q){const c=nq(q);if(c.length<2)return 0;const toks=nz(q).split(/\s+/).map(nq);const cs=skel(q),dg=nz(q).match(/\d+/g)||[];let b=0;
for(const a of [e.title,...e.ar]){const d=nq(a);if(!d)continue;if(d==c){b=1;break}if(d.length>=3&&toks.includes(d))b=Math.max(b,.9);
if(c.length>=3&&d.includes(c))b=Math.max(b,.9);else if(d.length>=4&&c.includes(d))b=Math.max(b,.88);else if(c.length>=4)b=Math.max(b,dice(d,c)*.95);
const ds=skel(a);if(cs.length>=3&&ds==cs)b=Math.max(b,.85);else if(cs.length>=4&&ds.includes(cs))b=Math.max(b,.8);
if(c.length>=6&&d.length>=6&&lev(d,c)<=(d.length>=10?2:1))b=Math.max(b,.85);
for(const w of a.split(/\s+/)){const x=nq(w);if(c.length>=5&&x.length>=5&&lev(x,c)<=1)b=Math.max(b,.8);if(cs.length>=3&&x.length>=4&&skel(w)==cs)b=Math.max(b,.8)}}
if(cs.length>=3&&/[\u0621-\u064a]/.test(c)){let ab;const as=arsk(e);if(as==cs)b=Math.max(b,.82);else if(cs.length>=4&&as.includes(cs))b=Math.max(b,.76);else if(cs.length>=5&&lev(as,cs)<=1)b=Math.max(b,.78);else if((ab=as.replace(/[0-9]/g,'')).length>=3&&(ab.length>=4?cs.includes(ab):q.split(/\s+/).some(w=>skel(w)==ab)))b=Math.max(b,.8);else if(as.startsWith(cs))b=Math.max(b,cs.length>=4?.8:.78)}
if(b<1&&c.length>=3&&nq([...e.genres].join(' ')).includes(c))b=Math.max(b,.7);
if(b>=.6&&dg.length&&dg.every(d=>nq(e.title).includes(d)))b=Math.min(1.05,b+.08);return b}
const find=q=>Ent.map(e=>[e,sc(e,q)]).filter(s=>s[1]>=.6).sort((a,b)=>b[1]-a[1]);
function search(q){let r=find(q).slice(0,30).map(s=>s[0]);if(!r.length){const n=nz(q),t=Object.keys(SYN).filter(k=>new RegExp(SYN[k]).test(n));if(t.length)r=rank(t).slice(0,12)}return r}
function searchAcc(q){const c=nq(q);if(c.length<2)return[];return Prod.filter(p=>nq(p.name).includes(c)||nq(p.cat).includes(c))}
const hs=s=>[...s].reduce((a,c)=>(a*31+c.charCodeAt(0))>>>0,7),fw=e=>nq(e.title.split(' ')[0]);
const W=t=>{const f=Ent.filter(e=>e.tags.has(t)).length||1;return Math.log(1+Ent.length/f)};
const rank=(tags,skip,neg)=>Ent.filter(e=>e!==skip&&!(neg&&neg.some(t=>e.tags.has(t)))).map(e=>[e,tags.reduce((s,t)=>s+(e.tags.has(t)?W(t):0),0)+(e.isnew?.05:0)-(e.av.every(x=>x.oos)?.3:0)]).filter(s=>s[1]>=.5).sort((a,b)=>b[1]-a[1]||hs(a[0].title)-hs(b[0].title)).map(s=>s[0]);
const div=l=>{const seen=new Set(),a=[],b=[];l.forEach(e=>{const k=fw(e);seen.has(k)?b.push(e):(seen.add(k),a.push(e))});return a.concat(b)};
const simi=(e,n)=>div(rank([...e.tags].filter(t=>!['online','friends'].includes(t)),e).filter(x=>fw(x)!=fw(e))).slice(0,n);
const tabsOf=e=>{const m=[...new Set(e.av.filter(a=>!a.combo).map(a=>a.tabTitle))];return m.length?m.join(' • '):'ضمن أكونت'};
const wal=t=>`https://wa.me/2${C.phones[0]}?text=${encodeURIComponent(t)}`;
const href=e=>`#${e.open.tab}/${encodeURIComponent(e.open.key)}`;
const ecard=e=>`<div class="zrc"><a class="zro" href="${href(e)}" data-zo>${e.icon?`<img src="${encodeURI(e.icon)}" alt="">`:'<i>🎮</i>'}<div><b dir="auto">${E(e.title)}${e.isnew?' <u>جديد</u>':''}</b><small>${E(e.ar[0]||e.title)} · ${E(tabsOf(e))}</small></div></a>${e.av.some(x=>!x.oos)?`<a class="zrq" target="_blank" rel="noopener" href="${wal('أهلًا، عايز أطلب: '+e.title+' ('+e.open.tabTitle+')')}">عايزها</a>`:'<small>نفذت</small>'}</div>`;
const pcard=p=>`<div class="zrc"><div class="zro"><i>🔌</i><div><b dir="auto">${E(p.name)}</b><small>${E(p.cat)} · ${p.price?p.price+' ج':'اسأل عن السعر'}${p.ok?'':' · نفذت الكمية'}</small></div></div>${p.ok?`<a class="zrq" target="_blank" rel="noopener" href="${wal('أهلًا، عايز أطلب: '+p.name)}">عايزه</a>`:''}</div>`;
const money=a=>a.price?a.price+' ج':'اسأل عن السعر';
function found(e){const by={};e.av.forEach(a=>{(by[a.tabTitle]=by[a.tabTitle]||[]).push(a)});
const ls=Object.entries(by).map(([t,a])=>{const s=a.filter(x=>!x.combo);return `• ${t} — ${s.length?money(s[0])+(s[0].oos?' ⛔ نفذت الكمية حاليًا':''):'ضمن أكونت فيه أكتر من لعبة'}`});
return `${pick(['أيوه عندنا','موجودة يا صاحبي ✅','لقيتها ✅'])} ${e.title}${e.ar[0]?' ('+e.ar[0]+')':''}\n${ls.join('\n')}`}
function page(list,intro,extra,tg){last={list:div(list),off:0,intro,tags:tg};return more(intro,extra)}
function more(intro,extra){const s=last.list.slice(last.off,last.off+6);last.off+=6;const left=last.list.length-last.off;
return{t:(intro||'')+(left>0?'\n(لو عايز كمان اكتب "كمان" وهجيبلك غيرهم)':''),feat:s[0],ents:s.slice(1),tags:last.tags,...extra}}
const M={focus:null,list:[],shown:new Set(),tags:[]};
const mem=r=>{const l=[r.feat,...(r.ents||[])].filter(Boolean);if(l.length){M.list=l;M.focus=l[0];l.forEach(e=>M.shown.add(e.title))}if(r.tags)M.tags=r.tags};
const RS={friends:'ممكن تلعبوها سوا',coop:'فيها تعاون',cooking:'فيها طبخ وفوضى وضحك',horror:'هتخوّفك بجد',racing:'سباقات مجنونة',football:'كورة حلوة',fighting:'فيها قتال جامد',relax:'بتريّح الأعصاب',hard:'هتتحداك بجد',short:'بتخلصها بسرعة',long:'هتاخد معاك ساعات',cinematic:'إخراجها سينمائي',comedy:'هتضحّكك',kids:'مناسبة للأطفال',girls:'مناسبة للبنات',story:'قصتها قوية',openworld:'عالمها مفتوح وكبير',action:'أكشن جامد',zombie:'مليانة زومبي',superhero:'فيها أبطال خارقين',survival:'فيها بقاء وتحدي',creative:'فيها إبداع وبناء',puzzle:'فيها ألغاز',stealth:'فيها تسلل',shooter:'فيها تصويب',cartoon:'كرتونية ولطيفة',platformer:'فيها قفز ومنصات',single:'بتلعبها لوحدك براحتك'};
const reasonFor=(e,tags)=>{const sh=(tags||[]).filter(t=>e.tags.has(t)&&RS[t]).slice(0,3).map(t=>RS[t]),c=sh.length?sh:[...e.tags].filter(t=>RS[t]).sort((x,y)=>W(y)-W(x)).slice(0,2).map(t=>RS[t]);return c.length?'دي '+c.join(' و')+'.':''};
const fcard=e=>`<div class="zfc">${e.icon?`<img src="${encodeURI(e.icon)}" alt="">`:''}<b dir="auto">${E(e.title)}${e.ar[0]?' · '+E(e.ar[0]):''}</b><p>${E((e.blurb||'').slice(0,150))}</p><span class="zok${e.av.every(x=>x.oos)?' no':''}">${e.av.every(x=>x.oos)?'نفذت الكمية حاليًا':'موجودة في الكتالوج'}</span><small>*السعر والتوفر بيتحددوا من بيانات الموقع</small><div class="zfa"><a class="zrq" href="${href(e)}" data-zo>شوف التفاصيل</a>${e.av.some(x=>!x.oos)?`<a class="zrq" target="_blank" rel="noopener" href="${wal('أهلًا، عايز أطلب: '+e.title+' ('+e.open.tabTitle+')')}">عايزها</a>`:''}</div></div>`;
function follow(n,q){if(!M.focus)return null;const e=M.focus,c=n.replace(/[؟?!.]/g,'').trim();
const mo=n.match(/(الاولي|التانيه|الثانيه|التالته|الثالثه|الاخيره)/);
if(mo&&M.list.length){const x=M.list[{'الاولي':0,'التانيه':1,'الثانيه':1,'التالته':2,'الثالثه':2,'الاخيره':M.list.length-1}[mo[1]]];if(x){M.focus=x;return{t:found(x),feat:x}}}
if(/^(بكام|سعرها|سعره|ودي بكام|ديه بكام|دي بكام|بكام دي|بكام ديه)$/.test(c))return{t:found(e),feat:e};
if(/^(هاخدها|هاخده|عايز اخدها|عايزها|اطلبها|اشتريها|عايز اطلبها|تمام هاخدها)$/.test(c))return{t:pick(['تمام يا صاحبي! 🎮 دوس هنا وكمّل معانا على واتساب.','حلو اختيارك! دوس وكلّمنا واتساب ونظبطها لك 👇']),links:[['كلّمنا على واتساب',wal('أهلًا، عايز أطلب: '+e.title+' ('+e.open.tabTitle+')')]]};
if(/(شبهها|شبهه|زيها|زيه|حاجه زيها|بديل|عندك حاجه شبه|هات كمان|فيه كمان)/.test(n)||/^(كمان|غيرها|تاني)$/.test(c)){
const l=simi(e,14).filter(x=>!M.shown.has(x.title)),sh=l.length?[...e.tags].filter(t=>l[0].tags.has(t)&&PHN[t]&&t!='online').sort((x,y)=>W(y)-W(x)).slice(0,2).map(t=>PHN[t]).join(' و')||'نفس الجو':'';last=null;
return l.length?{t:pick([`أكيد! خليني أرشحلك ألعاب فيها ${sh}، بدل ما أكرر نفس اللعبة.`,`طبعًا يا صاحبي 😄 دي قريبة منها في ${sh}:`]),feat:l[0],ents:l.slice(1,4),tags:[...e.tags]}:{t:'خلصت اللي عندي شبهها 😅 تحب نغيّر النوع؟ قولّي بتحب إيه.'}}
return null}
const PH={action:'أكشن جامد',story:'قصة قوية',openworld:'عالم مفتوح كبير',horror:'رعب حقيقي',friends:'بتتلعب مع صحابك',coop:'تعاون',relax:'هادية وتريّح',hard:'صعبة ومليانة تحدي',short:'بتخلصها بسرعة',long:'هتاخد معاك ساعات',cinematic:'إخراج سينمائي',comedy:'مضحكة',kids:'مناسبة للأطفال',girls:'مناسبة للبنات',racing:'سباقات',football:'كورة',fighting:'قتال',superhero:'أبطال خارقين',survival:'بقاء',zombie:'زومبي',creative:'إبداع وبناء',puzzle:'ألغاز',cooking:'طبخ',stealth:'تسلل',shooter:'تصويب',soulslike:'صعبة على طريقة السولز',platformer:'منصات وقفز',cartoon:'كرتونية',dark:'جو مظلم',single:'بتتلعب لوحدك'};
const PHN={action:'الأكشن',story:'القصة القوية',openworld:'العالم المفتوح',horror:'الرعب',friends:'اللعب مع صحابك',coop:'التعاون',relax:'الهدوء',hard:'التحدي',short:'اللعبة القصيرة',long:'اللعبة الطويلة',cinematic:'الإخراج السينمائي',comedy:'الضحك',racing:'السباقات',football:'الكورة',fighting:'القتال',superhero:'الأبطال الخارقين',survival:'البقاء',zombie:'الزومبي',creative:'الإبداع',puzzle:'الألغاز',cooking:'الطبخ',stealth:'التسلل',shooter:'التصويب',single:'اللعب الفردي'};
const why=(e,n=3)=>[...e.tags].filter(t=>PH[t]).sort((x,y)=>W(y)-W(x)).slice(0,n).map(t=>PH[t]).join(' و');
const JOKES=['الجيمر قالولو خد استراحة.. قال ماشي بس خليني أعمل سيڤ الأول 😂','صاحبي قالي ماتش واحد بس.. الساعة دلوقتي 4 الفجر 😅','أصعب مستوى في أي لعبة هو إنك تقنع أمك إنك قربت تخلّص 😂'];
const MOOD=[['زهقان|ملل|مليت|فاضي|عايز اتسلي|عايز اهزر|عايز اضحك',['comedy','friends'],'ولا يهمك يا صاحبي، الملل ده بنكسره بلعبة حلوة 😄 جرّب دول:'],['متضايق|مضايق|زعلان|مخنوق|اتخنقت|عايز اهدي|عايز استرخي|مرهق|تعبان',['relax'],'ألف سلامة عليك يا صاحبي 🤍 اللعب بيفرق، جرّب حاجة هادية تريّح دماغك:'],['معصب|متعصب|عايز افرغ|عايز اكسر|عايز اضرب',['action','fighting'],'فرّغ طاقتك يا وحش 💥 دي ألعاب بتفضي الغضب:'],['عايز اتحدي|عايز حاجه صعبه|عايز حاجه تتعبني',['hard'],'يا بطل! دي حاجات هتتحداك بجد 🔥:'],['عايز ابكي|تاثر|قصه تحزن',['story','cinematic'],'قصص تلمس القلب، جهّز المناديل 😅:'],['هسهر|سهره|نسهر|اسهر|جاي صحابي|جايلي صحابي',['friends'],'سهرة مظبوطة! 🔥 دي بتحلّي القعدة:'],['خطيبتي|مراتي|جوزي',['coop','story'],'حلو! دي ألعاب تتلعب أو تتفرج عليها مع بعض براحة:']];
function persona(n,q){
for(const m of MOOD)if(new RegExp(m[0]).test(n)){const l=rank(m[1]);if(l.length)return page(l,m[2],null,m[1])}
if(/مش لاقي حاجه|مش عاجبني حاجه|مفيش حاجه تعجبني|مش عارف اختار/.test(n))return{t:pick(['ولا يهمك يا صاحبي، نحدد ذوقك سوا 😄 بتحب إيه أكتر؟','طيب تعالى نظبطها: بتحب أكشن ولا ضحك ولا رعب؟ قولّي وأنا أطلعلك أحلى حاجة.']),chips:['أكشن 💥','رعب 👻','سباقات 🏎️','كورة ⚽','قصة قوية 🎬','ضحك مع صحابي 😂','هادية 🌿'],q:['لعبة أكشن','لعبة رعب','لعبة سباق','لعبة كورة','لعبة قصة قوية','لعبة مضحكة مع صحابي','لعبة هادية']};
if(/نكته|فرفشني|اضحكني|هزار/.test(n))return{t:pick(JOKES)+'\nتحب نكمل بلعبة حلوة؟'};
if(/(انت|انتا).*(بتلعب|لاعب)|بتلعب ايه|لعبتك المفضله|اكتر لعبه بتحبها/.test(n))return{t:'أنا مساعد ZAZA (ذكاء اصطناعي) فمش بمسك دراع 😄 بس عارف الألعاب كويس وبرشحلك زي صاحب بيفهم. إنت بتحب إيه؟'};
if(/(غبي|زفت|بتهبد|مش فاهم حاجه|مفيش فايده)/.test(n))return{t:'معلش يا صاحبي 🙏 قولّي تاني بطريقة تانية أو اكتب اسم اللعبة وأنا هركّز معاك.'};
const bm=n.match(/(?:معايا|ميزانيتي|ميزانيه|في ايدي|عندي)\s*(\d{2,5})/);
if(bm&&/جنيه|ج |ميزاني|فلوس|معايا/.test(n+' ')&&!/سن(ه|ين)/.test(n)){const pr=Object.values(C.games).flat().map(g=>g.price).filter(Boolean),mn=Math.min(...pr),b=+bm[1];
return b<mn?{t:`الميزانية دي صغيرة شوية يا صاحبي 😅 أقل لعبة عندنا بـ ${mn} ج.`}:{t:`بـ ${b} ج تقدر تاخد حوالي ${Math.floor(b/mn)} ألعاب معدّلة (اللعبة بتبدأ من ${mn} ج) 😉 تحب أرشحلك أحلاهم؟`,chips:['رشحلي ألعاب'],q:['رشحلي لعبة']}}
const pf=/ps ?5|بي اس 5|بلايستيشن ?5/.test(n)?'PS5':/ps ?4|بي اس 4|بلايستيشن ?4/.test(n)?'PS4':'';
if(pf&&/عندي|معايا|جهازي|اشتريت|جبت/.test(n)){const tb=C.tabs.filter(x=>x.title.includes(pf));if(tb.length)return{t:`حلو يا صاحبي! لجهاز ${pf} عندنا:`,nav:tb.map(x=>[x.title,'#'+x.id])}}
const cmp=n.split(/\s(?:ولا|او|مقابل|vs)\s/);
if(/احسن|افضل|الفرق|مقارنه|ولا/.test(n)&&cmp.length==2){const x=find(cmp[0])[0],y=find(cmp[1])[0];if(x&&y&&x[1]>=.8&&y[1]>=.8&&x[0]!==y[0]){const A=x[0],B=y[0],ph=(u,v)=>[...u.tags].filter(t=>PHN[t]&&!v.tags.has(t)).slice(0,2).map(t=>PHN[t]).join(' و'),pa=ph(A,B),pb=ph(B,A);
return{t:`سؤال حلو! 🤔\n• ${A.title}: ${why(A)||'لعبة حلوة'}\n• ${B.title}: ${why(B)||'لعبة حلوة'}\n${pa||pb?`لو بتحب ${pa||'جو مختلف'} خد ${A.title}، ولو بتحب ${pb||'التغيير'} يبقى ${B.title}.`:'الاتنين قريبين من بعض، فاختار اللي اسمه يعجبك 😄'}`,ents:[A,B]}}}
if(/رايك في|رايك ب|ايه رايك|تنصحني ب|تنصح ب|تستاهل|كويسه ولا|حلوه ولا/.test(n)){const f=find(q);if(f.length&&f[0][1]>=.8){const e=f[0][0],w=why(e);return{t:`بصراحة ${e.title}${e.ar[0]?' ('+e.ar[0]+')':''}${w?': '+w+'.':''}${e.tags.has('cinematic')||e.tags.has('long')?' من النوع اللي بيستاهل وقتك.':''}\nلو بتحب النوع ده هتعشقها، ولو لا قولي وأرشحلك بديل 😉`,feat:e}}}
return null}
function local(q){const n=nz(q).trim();
if(!n)return{t:'اكتب سؤالك وأنا معاك 😊'};
if(/^(هات كمان|كمان|غيرها|غيرهم|تاني|مزيد|ايه كمان|فيه كمان|وكمان)$/.test(n)&&last&&last.off<last.list.length)return more('دول كمان:');
if(/انت مين|مين انت|اسمك|بتعمل ايه|تقدر تعمل ايه|ساعدني|مساعده|help/.test(n))return{t:'أنا مساعد ZAZA 🎮 بساعدك تختار لعبتك: ارشحلك حسب النوع (أكشن، رعب، سباق…) أو للبنات والأطفال، أو لعب مع صحابك، وأقولك لو لعبة موجودة وبكام، وأجيبلك أقرب ألعاب لو مش موجودة. وكمان بجاوب عن الشواحن والوصلات والدراعات.'};
if(n.length<=34&&/(^|\s)(هلو|هاي|هالو|اهلا|اهلين|مرحبا|ازيك|ازيكم|عامل ايه|عاملين ايه|اخبارك|صباح|مساء|السلام عليكم|سلام|hello|hi|hey|يا باشا)(\s|$)/.test(n)){
const ok=/ازيك|عامل ايه|عاملين ايه|اخبارك/.test(n);return{t:/السلام عليكم/.test(n)?'وعليكم السلام ورحمة الله 🌹 نورتنا! تحب أرشحلك لعبة ولا بتدوّر على حاجة معينة؟':ok?'أنا تمام الحمد لله 😄 إنت عامل إيه؟ قولي تحب تلعب إيه وأرشحلك.':pick(['يا أهلًا يا صاحبي! 👋 نورت. تحب تلعب إيه النهاردة؟','أهلًا بيك 😄 أنا معاك، احكيلي مزاجك وأرشحلك لعبة تظبطك.','يا مرحب! 🎮 قولّي بتدوّر على إيه وأنا أساعدك.'])}}
if(/شكرا|تسلم|متشكر|ميرسي|thanks|thx|يسلمو/.test(n))return{t:pick(['ولا يهمك يا صاحبي 🤍 أنا موجود في أي وقت.','تحت أمرك يا بطل 😄 أي حاجة تانية؟'])};
if(/مع السلامه|باي|bye|تصبح|يلا سلام/.test(n))return{t:'في أمان الله 👋 نورتنا، ولو احتجت حاجة ارجع تاني.'};
if(n.length<=8&&/^(تمام|اوكي|اوك|ok|حاضر|ماشي|حلو)/.test(n))return{t:'ماشي 👍 لو عايز أرشحلك حاجة قولي بتحب إيه.'};
const fw2=follow(n,q);if(fw2)return fw2;
const px=persona(n,q);if(px)return px;
if(/جديد|نزلت|نزل |وصلت|وصل |اخر (الالعاب|لعبه|اصدار|ما)|ايه الجديد|اي الجديد|احدث/.test(n)){
const by={};Ent.forEach(e=>e.newAv.forEach(a=>(by[a.tabTitle]=by[a.tabTitle]||new Set()).add(e.title)));const L=Object.entries(by).map(([t,s])=>`• ${[...s].join('، ')} — ${t}`);
const es=Ent.filter(e=>e.isnew);return es.length?{t:'الجديد عندنا دلوقتي:\n'+L.join('\n'),ents:es.slice(0,6)}:{t:'مفيش ألعاب متعلّم عليها "جديد" دلوقتي، بس تقدر تتصفح الأقسام وهتلاقي كل الألعاب المتاحة.'}}
if(/اشتراك|اشتراكات|بلس|plus/.test(n)){const pl=Ent.find(e=>/plus/i.test(e.title));return pl?{t:pick(['عندنا اشتراك بلايستيشن بلس 🎮','أيوه فيه بلس عندنا 👇']),feat:pl}:{t:'الاشتراكات مش معروضة على الموقع دلوقتي، بس كلّمنا واتساب وهنقولك المتاح.',wa:q}}
const cats=CAT.filter(c=>new RegExp(c[0]).test(n)).map(c=>c[1]);
if(cats.length||/(^|\s)(ملحق|اكسسوار|ماوس|سماعه|هارد|كشاف|هيدفون|هيدست|كارت|ترنس|دربس|كونفيرت)/.test(n)){
let use=cats.includes('شواحن')?['شواحن']:cats;
if(!use.length){const ws2=n.replace(/[^\u0621-\u064aa-z0-9\s]/g,' ').split(/\s+/).filter(w=>w.length>=3&&!/^(عندكم|عايز|فيه|عندك|بكام|سعر|ملحقات|اكسسوار|اكسسوارات|ايه|الي|اللي)$/.test(w)),hit=Prod.filter(p=>ws2.some(w=>nz(p.name).includes(w)));if(hit.length)return{t:`لقيتلك ${hit.length} من الملحقات:`,prods:hit.slice(0,8)}}
if(!use.length){const m={};Prod.forEach(p=>m[p.cat]=(m[p.cat]||0)+1);return{t:'عندنا ملحقات كتير، تحب أنهي نوع؟',chips:Object.entries(m).map(([c,k])=>`${c} (${k})`),q:Object.keys(m)}}
let l=Prod.filter(p=>use.includes(p.cat));const tk=n.match(/ps[45]|xbox|x-box|اوريجنال|كوبي|hdmi|برو|slim|بطاريه|بطاريتين|دراع/g)||[];
if(tk.length){const a=l.filter(p=>tk.every(t=>nz(p.name).includes(t))),b=l.filter(p=>tk.some(t=>nz(p.name).includes(t)));l=a.length?a:b.length?b:l}
l=[...l].sort((a,b)=>!!b.ok-!!a.ok);const pr=l.map(p=>p.price).filter(Boolean),r=pr.length?` (من ${Math.min(...pr)} لـ ${Math.max(...pr)} ج)`:'';
return l.length?{t:`عندنا ${l.length} من ${use.join(' و')}${r}:`,prods:l.slice(0,8)}:{t:'مش لاقي النوع ده بالظبط، تحب تسأل على واتساب؟',wa:q}}
const f=find(q);
if(f.length&&f[0][1]>=.8){let top=f.filter(s=>s[1]>=f[0][1]-.001).map(s=>s[0]),e=top[0];const dg=nz(q).match(/\d+/g)||[];
if(top.length>1&&dg.length){const nr=top.filter(x=>dg.every(d=>nq(x.title).includes(d)));if(nr.length){top=nr;e=top[0]}else return page(top,`مفيش إصدار ${dg.join(' ')} بالظبط يا صاحبي، بس دي اللي عندنا من السلسلة دي:`)}
if(top.length>1)return page(top,`${e.ar[0]||e.title} عندنا منها ${top.length} إصدارات ✅ اختار اللي يعجبك يا صاحبي:`);
last=null;if(/شبه|زي |مثل/.test(n))return{t:`${e.title} موجودة عندنا ✅ ولو بتدور على حاجة شبهها جرّب دي:`,feat:e,ents:simi(e,4)};
const s3=simi(e,3);return{t:found(e)+(s3.length?'\nودي ألعاب شبهها:':''),feat:e,ents:s3}}
const c=nq(q),fm=KB.fm.find(x=>x[0].split('|').some(a=>{const d=nq(a);return d.length>=4&&c.includes(d)}));
if(fm){const l=rank(fm[1].split(' '));return page(l,`${fm[0].split('|')[0]} مش عندنا حاليًا يا صاحبي، بس دي أقرب حاجات ليها:`,{wa:q})}
if(/اكونت|حسابات|معدل/.test(n)&&!/(ازاي|الفرق|بكام|سعر)/.test(n)){const w5=/ps ?5|بي اس 5/.test(n),w4=/ps ?4|بي اس 4/.test(n),ac=/اكونت|حسابات/.test(n),cn=x=>x.kind=='products'?C.products.length:x.kind=='modded'?C.games[x.id].length:x.kind=='originals'?C.originals.length:C.accts[x.id].length;
const tb=C.tabs.filter(x=>{const t=nz(x.title);return(!w5||t.includes('ps5'))&&(!w4||t.includes('ps4'))&&(ac?t.includes('اكونت'):t.includes('معدل'))});
if(tb.length&&tb.length<=3)return{t:pick(['تمام يا صاحبي! دي الأقسام اللي تهمك 👇','أكيد، افتح القسم اللي يناسبك:']),nav:tb.map(x=>[`${x.title} (${cn(x)} ${x.kind=='products'?'منتج':'لعبة'})`,'#'+x.id])}}
const fq=(KB.faq||[]).find(x=>new RegExp(x[0]).test(n));
if(fq){if(fq[1]=='SECTIONS')return{t:'الأقسام عندنا:\n'+C.tabs.map(x=>`• ${x.title} — ${(KB.caps||{})[x.id]||''}`).join('\n')+'\nولأي تفاصيل أكتر كلّمنا على واتساب 👇',wa:q};return{t:fq[1],wa:fq[2]?q:undefined}}
if(/رقم|واتساب|تليفون|موبايل|اتصل|تواصل|كلمكم/.test(n))return{t:'أرقامنا:\n'+C.phones.map(p=>`• ${(C.pnames||{})[p]||'واتساب'}: ${p}`).join('\n'),wa:q,links:[['صفحتنا على فيسبوك',KB.fb||'']]};
if(/فيس|فيسبوك|صفحتكم|بيدج/.test(n))return{t:'دي صفحتنا على فيسبوك 👇',links:[['صفحة ZAZA على فيسبوك',KB.fb||'']]};
if(/كام لعبه|عدد الالعاب|عندكم كام|عندكم اد ايه/.test(n))return{t:'عندنا دلوقتي:\n'+C.tabs.map(x=>`• ${x.title}: ${x.kind=='products'?C.products.length:x.kind=='modded'?C.games[x.id].length:x.kind=='originals'?C.originals.length:C.accts[x.id].length} ${x.kind=='products'?'منتج':'لعبة'}`).join('\n')};
if(/اسعار|الاسعار|بكام|سعر|كام/.test(n)){const rg=l=>{const v=l.filter(Boolean);return v.length?(Math.min(...v)==Math.max(...v)?Math.min(...v)+' ج':`من ${Math.min(...v)} لـ ${Math.max(...v)} ج`):'اسأل عن السعر'};
return{t:'الأسعار عندنا:\n'+C.tabs.map(x=>`• ${x.title}: ${rg(x.kind=='products'?C.products.map(p=>p.price):x.kind=='modded'?C.games[x.id].map(g=>g.price):x.kind=='originals'?C.originals.map(g=>g.prices&&g.prices[0]&&g.prices[0][1]):C.accts[x.id].map(g=>g.price))}`).join('\n')+'\nولو بتسأل عن لعبة معينة اكتب اسمها وأقولك بكام.'}}
let neg=[],tags=Object.keys(SYN).filter(k=>{const m=new RegExp(SYN[k]).exec(n);if(!m)return false;if(/(مش|ماتكونش|بدون|من غير|غير)\s+(عايزها\s+|عايزه\s+|تكون\s+)?$/.test(n.slice(Math.max(0,m.index-14),m.index))){neg.push(k);return false}return true});if(!tags.length&&neg.includes('hard'))tags=['relax'];if(tags.length&&last&&last.tags&&n.split(' ').length<=3&&/^(و|بس|طيب)/.test(n))tags=[...new Set([...last.tags,...tags])];
if(tags.length){const l=rank(tags,null,neg);if(l.length){const d0=div(l)[0];return page(l,`${pick(['يا سلام!','حلو!','تمام يا صاحبي!'])} ${pick(['عندي ليك','جبتلك','شوف'])} ${d0.title}${d0.ar[0]?' ('+d0.ar[0]+')':''} 😄 ${reasonFor(d0,tags)}${neg.length?' ومن غير '+neg.map(t=>PHN[t]||t).join(' و')+' زي ما طلبت.':''}`,null,tags)}}
const ws=n.split(/\s+/).filter(w=>w.length>=4);
if(ws.length){const l=Ent.map(e=>[e,ws.filter(w=>nz(e.blurb).includes(w)).length]).filter(s=>s[1]>=2).sort((a,b)=>b[1]-a[1]).map(s=>s[0]);if(l.length)return page(l,'ممكن تعجبك دي:')}
const un=n.match(/(?:لعبه|العاب)\s+فيها\s+(\S+)/);if(un)return{t:`ملقيتش لعبة فيها ${un[1]} في الكتالوج 🤔 قولّي بتحب إيه وأدوّرلك على حاجة قريبة، أو اسأل الفريق على واتساب.`,chips:['أكشن 💥','رعب 👻','سباقات 🏎️','كورة ⚽','قصة قوية 🎬','ضحك مع صحابي 😂','هادية 🌿'],q:['لعبة أكشن','لعبة رعب','لعبة سباق','لعبة كورة','لعبة قصة قوية','لعبة مضحكة مع صحابي','لعبة هادية'],wa:q};
return{t:'مش فاهمك أوي يا صاحبي 😅 قولّي بتحب إيه، أو اكتب اسم لعبة بأي شكل (عربي أو إنجليزي) وأنا أدوّر عليها.',chips:['أكشن 💥','رعب 👻','سباقات 🏎️','كورة ⚽','قصة قوية 🎬','ضحك مع صحابي 😂','هادية 🌿'],q:['لعبة أكشن','لعبة رعب','لعبة سباق','لعبة كورة','لعبة قصة قوية','لعبة مضحكة مع صحابي','لعبة هادية'],wa:q}}
async function brain(q){if(Z.url){try{const r=await fetch(Z.url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({q})});if(r.ok){const j=await r.json();if(j&&j.t)return j}}catch(e){}}return local(q)}
let D,RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
const CHIPS=['إيه الجديد؟','زهقان 😅','ألعاب بنات','ألعاب مع صحابي','لعبة هادية وقصيرة','عايز حاجة شبه Elden Ring','الشواحن','نكتة'];
function mount(){D=$('#ai');D.innerHTML=`<div class="zah"><div><b>مساعد ZAZA</b><small>صاحبك في اختيار الألعاب والملحقات</small></div><button class="zx" id="aix" aria-label="إغلاق">✕</button></div><div id="zml"></div><div class="zqc">${CHIPS.map(c=>`<button data-q="${E(c)}">${E(c)}</button>`).join('')}</div><div class="zar"><input id="zaq" placeholder="اكتب سؤالك…" enterkeyhint="send" autocomplete="off" dir="auto"><button id="zas" aria-label="إرسال">↑</button></div>`;
D.addEventListener('click',e=>{const q=e.target.closest('[data-q]');if(q){ask(q.dataset.q);return}
if(e.target.closest('[data-zo]'))D.close();else if(e.target.closest('#aix')||e.target==D)D.close();else if(e.target.closest('#zas')){ask($('#zaq').value);$('#zaq').value=''}});
$('#zaq').addEventListener('keydown',e=>{if(e.key=='Enter'&&!e.isComposing){ask(e.target.value);e.target.value=''}})}
const bub=(h,me)=>{const d=document.createElement('div');d.className='zbb'+(me?' me':'');d.innerHTML=h;$('#zml').append(d);$('#zml').scrollTop=1e6;return d};
async function ask(q){q=String(q).trim();if(!q)return;bub(E(q),1);const t=bub('<i class="zty"><u></u><u></u><u></u></i>'),r=await brain(q);mem(r);if(!RM&&!r.ai)await sleep(450);
const x=(r.chips||[]).map((c,i)=>`<button class="zch" data-q="${E((r.q||[])[i]||c)}">${E(c)}</button>`).join('');
t.innerHTML=E(r.t||'').replace(/\n/g,'<br>')+(r.feat?fcard(r.feat):'')+(r.ents||[]).map(ecard).join('')+(r.prods||[]).map(pcard).join('')+(x?`<div class="zcs">${x}</div>`:'')+(r.nav||[]).map(l=>`<a class="zrq zw2" data-zo href="${E(l[1])}">${E(l[0])}</a>`).join('')+(r.links||[]).map(l=>`<a class="zrq zw2" target="_blank" rel="noopener" href="${E(l[1])}">${E(l[0])}</a>`).join('')+(r.wa?`<a class="zrq zw2" target="_blank" rel="noopener" href="${wal('أهلًا، عايز أسأل عن: '+r.wa)}">كلّمنا على واتساب</a>`:'');$('#zml').scrollTop=1e6}
function open(q){if(!ready)return;D.showModal();if(!$('#zml').children.length)bub('أهلًا يا صاحبي 👋 أنا مساعد ZAZA، ذكاء اصطناعي بيحب الألعاب زيك. احكيلي بتحب تلعب إيه، أو اسأل عن أي لعبة أو ملحق، أو حتى قولّي مزاجك إيه النهاردة 😄');if(q)ask(q)}
})();
