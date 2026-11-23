const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
/* Slot aset animasi nyata (isi bila sudah punya): {sean:{webm:'url',png:'url'},dhara:{...}} */
const ASSETS={sean:null,dhara:null};
for(const [k,a] of Object.entries(ASSETS)){if(!a)continue;const bd=$('#'+k+' .bd');const v=document.createElement('video');v.src=a.webm;v.loop=v.muted=v.autoplay=v.playsInline=true;v.style.cssText='position:absolute;inset:0;width:100%;height:100%;object-fit:contain';v.oncanplay=()=>{bd.innerHTML='';bd.append(v);v.play()};}
$$('[data-split]').forEach(e=>{e.innerHTML=e.textContent.split(' ').map((w,i)=>`<span class="w" style="transition-delay:${i*.12}s">${w}</span>`).join(' ');e.classList.add('rv')});
const qt=$('#qt');let typed=0;
const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;e.target.classList.add('in');if(e.target===qt&&!typed){typed=1;const t=qt.dataset.t;if(RM){qt.firstChild?qt.prepend(t):qt.textContent=t;return}let i=0;const s=document.createTextNode('');qt.prepend(s);(function n(){s.data=t.slice(0,++i);if(i<t.length)setTimeout(n,/[,.]/.test(t[i-1])?260:42)})()}}),{threshold:.25});
$$('.rv').forEach(e=>io.observe(e));io.observe(qt);
/* nav, progress, top */
const bar=$('#bar'),nav=$('#nav'),top_=$('#top'),cv=$('#cv');
addEventListener('scroll',()=>{const h=document.documentElement,y=scrollY;bar.style.transform=`scaleX(${y/(h.scrollHeight-innerHeight||1)})`;top_.classList.toggle('on',y>innerHeight);if(!RM&&y<innerHeight)cv.style.transform=`translateY(${y*.18}px) scale(${1+y/4000})`},{passive:true});
top_.onclick=()=>scrollTo({top:0});$('#burger').onclick=()=>$('#menu').classList.toggle('open');$$('#menu a').forEach(a=>a.onclick=()=>$('#menu').classList.remove('open'));
/* book transition */
$('#go').onclick=()=>{const b=$('#book');nav.classList.add('on');if(RM){$('#prologue').scrollIntoView();return}b.classList.add('go');setTimeout(()=>{$('#prologue').scrollIntoView({behavior:'instant'});b.classList.add('out')},1500);setTimeout(()=>b.className='',2700)};
setTimeout(()=>nav.classList.add('on'),RM?0:5500);
/* characters */
const figs=$$('.fig'),inf=$$('.info p'),pk=$$('.pick .btn');
function sel(c){figs.forEach((f,i)=>{f.classList.toggle('act',i==c);f.classList.toggle('dim',i!=c)});pk.forEach((b,i)=>b.classList.toggle('on',i==c));inf.forEach(p=>p.classList.toggle('on',p.dataset.i==c))}
figs.forEach(f=>{f.onclick=()=>sel(+f.dataset.c);f.onmouseenter=()=>{if(!$('.fig.act'))f.classList.add('act')};f.onmouseleave=()=>{if(!inf.some(p=>p.dataset.i!='d'&&p.classList.contains('on')))f.classList.remove('act')}});
pk.forEach(b=>b.onclick=()=>sel(+b.dataset.c));
const st=$('#stage');if(!RM)$('#chars').addEventListener('mousemove',e=>{const r=st.getBoundingClientRect();st.style.setProperty('--mx',(e.clientX-r.left)/r.width-.5);st.style.setProperty('--my',(e.clientY-r.top)/r.height-.5);figs.forEach(f=>{f.style.setProperty('--mx',(e.clientX-r.left)/r.width-.5);f.style.setProperty('--my',(e.clientY-r.top)/r.height-.5)})});
/* particles */
function fit(c){c.width=c.clientWidth*devicePixelRatio;c.height=c.clientHeight*devicePixelRatio}
if(!RM){const d=$('#dust'),x=d.getContext('2d');fit(d);const P=[...Array(55)].map(()=>({x:Math.random(),y:Math.random(),r:Math.random()*2+.6,v:Math.random()*.0007+.0002,p:Math.random()*6}));
(function a(t){x.clearRect(0,0,d.width,d.height);P.forEach(p=>{p.y-=p.v;p.x+=Math.sin(t/2000+p.p)*.0004;if(p.y<0)p.y=1;x.beginPath();x.fillStyle=`rgba(255,226,180,${.35+.35*Math.sin(t/700+p.p)})`;x.arc(p.x*d.width,p.y*d.height,p.r*devicePixelRatio,0,7);x.fill()});requestAnimationFrame(a)})(0);
const c=$('#cur'),cx=c.getContext('2d');c.width=innerWidth;c.height=innerHeight;addEventListener('resize',()=>{c.width=innerWidth;c.height=innerHeight;fit(d)});const Q=[];
addEventListener('pointermove',e=>{if(e.pointerType=='touch')return;for(let i=0;i<2;i++)Q.push({x:e.clientX,y:e.clientY,vx:(Math.random()-.5)*.8,vy:Math.random()*-.6-.1,l:1,r:Math.random()*2.5+1})});
(function a(){cx.clearRect(0,0,c.width,c.height);for(let i=Q.length;i--;){const q=Q[i];q.x+=q.vx;q.y+=q.vy;q.l-=.02;if(q.l<=0){Q.splice(i,1);continue}cx.fillStyle=`rgba(240,162,122,${q.l*.7})`;cx.beginPath();cx.arc(q.x,q.y,q.r*q.l,0,7);cx.fill()}requestAnimationFrame(a)})()}
/* Soundtrack asli dari video yang diberikan pengguna.
   Browser dapat memblokir autoplay bersuara; jika terjadi, tampilkan tombol aktivasi.
   Tombol Mulai Membaca juga mencoba memulai musik dalam user gesture. */
const song=$('#song'),mus=$('#mus'),musicPrompt=$('#musicPrompt');
let musicOn=false;
song.volume=.62;
function syncMusicUI(){
  mus.textContent=musicOn?'Ⅱ':'♫';
  mus.classList.toggle('playing',musicOn);
  mus.setAttribute('aria-label',musicOn?'Jeda soundtrack':'Putar soundtrack');
  mus.title=musicOn?'Jeda LANY – you!':'Putar LANY – you!';
  musicPrompt.classList.toggle('show',!musicOn);
}
async function playSong(){
  try{
    await song.play();
    musicOn=true;
    syncMusicUI();
  }catch(err){
    musicOn=false;
    syncMusicUI();
  }
}
function pauseSong(){
  song.pause();
  musicOn=false;
  syncMusicUI();
}
mus.onclick=()=>musicOn?pauseSong():playSong();
musicPrompt.onclick=playSong;
song.addEventListener('play',()=>{musicOn=true;syncMusicUI()});
song.addEventListener('pause',()=>{musicOn=false;syncMusicUI()});
/* Coba autoplay saat halaman dibuka. Jika ditolak browser, tombol aktivasi muncul. */
playSong();
/* Mulai Membaca adalah interaksi pengguna; gunakan kesempatan ini untuk mengaktifkan audio. */
$('#go').addEventListener('click',()=>{if(!musicOn)playSong()},{capture:true});
