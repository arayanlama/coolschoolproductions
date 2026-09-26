const menu=document.querySelector('#menu'),nav=document.querySelector('nav');
menu.addEventListener('click',()=>nav.classList.toggle('open'));
document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
const year=document.querySelector('#year');if(year)year.textContent=new Date().getFullYear();

const heroTrack=document.querySelector('.hero-track');
if(heroTrack){
  const slides=[...heroTrack.querySelectorAll('figure')];
  let current=0,timer;
  const goTo=i=>{
    current=(i+slides.length)%slides.length;
    heroTrack.scrollTo({left:slides[current].offsetLeft,behavior:'smooth'});
  };
  const start=()=>{clearInterval(timer);timer=setInterval(()=>goTo(current+1),4000)};
  heroTrack.addEventListener('scroll',()=>{
    const nearest=slides.reduce((best,slide,i)=>Math.abs(heroTrack.scrollLeft-slide.offsetLeft)<Math.abs(heroTrack.scrollLeft-slides[best].offsetLeft)?i:best,0);
    current=nearest;
  },{passive:true});
  heroTrack.addEventListener('pointerdown',()=>clearInterval(timer));
  heroTrack.addEventListener('pointerup',start);
  heroTrack.addEventListener('mouseenter',()=>clearInterval(timer));
  heroTrack.addEventListener('mouseleave',start);
  start();
}

const videoTrack=document.querySelector('.video-track');
if(videoTrack){
  const videoSlides=[...videoTrack.querySelectorAll('.video-slide')];
  const move=dir=>{
    const current=videoSlides.reduce((best,slide,i)=>Math.abs(videoTrack.scrollLeft-slide.offsetLeft)<Math.abs(videoTrack.scrollLeft-videoSlides[best].offsetLeft)?i:best,0);
    const next=Math.max(0,Math.min(videoSlides.length-1,current+dir));
    videoTrack.scrollTo({left:videoSlides[next].offsetLeft-videoTrack.offsetLeft,behavior:'smooth'});
  };
  document.querySelector('.gallery-prev')?.addEventListener('click',()=>move(-1));
  document.querySelector('.gallery-next')?.addEventListener('click',()=>move(1));
}

function onYouTubeIframeAPIReady(){
  const hidden=document.createElement('div');hidden.id='vinyl-audio-youtube';hidden.style.cssText='position:absolute;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none';document.body.appendChild(hidden);audioPlayer=new YT.Player('vinyl-audio-youtube',{height:'1',width:'1',videoId:audioIds[0],playerVars:{playsinline:1},events:{onReady:()=>{syncAudioUI();audioTimer=setInterval(syncAudioUI,500)},onStateChange:e=>{const p=e.data===YT.PlayerState.PLAYING;audioRecord?.classList.toggle('playing',p);if(audioPlay)audioPlay.textContent=p?'Ⅱ':'▶';if(e.data===YT.PlayerState.ENDED)loadAudio(audioIndex+1)}}});
  document.querySelectorAll('.vinyl-video-panel iframe').forEach(frame=>{
    const disc=frame.closest('.vinyl-piece').querySelector('.vinyl-disc');
    new YT.Player(frame,{events:{onStateChange:e=>{
      const playing=e.data===YT.PlayerState.PLAYING;disc.classList.toggle('is-playing',playing);document.querySelector('.vinyl-discover')?.classList.toggle('is-playing',playing);
    }}});
  });
}
if(document.querySelector('.vinyl-video-panel iframe')){
  const yt=document.createElement('script');
  yt.src='https://www.youtube.com/iframe_api';
  document.head.appendChild(yt);
}

const vinylTrack=document.querySelector('.vinyl-track');
if(vinylTrack){
 const vinylSlides=[...vinylTrack.querySelectorAll('.vinyl-piece')],dots=[...document.querySelectorAll('.vinyl-dots button')];
 const go=i=>{const n=Math.max(0,Math.min(vinylSlides.length-1,i));vinylTrack.scrollTo({left:vinylSlides[n].offsetLeft,behavior:'smooth'})};
 const current=()=>vinylSlides.reduce((best,s,i)=>Math.abs(vinylTrack.scrollLeft-s.offsetLeft)<Math.abs(vinylTrack.scrollLeft-vinylSlides[best].offsetLeft)?i:best,0);
 document.querySelector('.vinyl-prev')?.addEventListener('click',()=>go(current()-1));
 document.querySelector('.vinyl-next')?.addEventListener('click',()=>go(current()+1));
 dots.forEach((d,i)=>d.addEventListener('click',()=>go(i)));
 let raf;vinylTrack.addEventListener('scroll',()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{const n=current();dots.forEach((d,i)=>d.classList.toggle('active',i===n))})},{passive:true});
}

const musicSection=document.querySelector('.vinyl-discover');
const musicTabs=[...document.querySelectorAll('.music-tab')];
const vinylAtmosphere=document.querySelector('.vinyl-atmosphere'),audioRecord=document.querySelector('.audio-record'),audioArt=document.querySelector('.audio-art'),audioPlay=document.querySelector('.audio-play'),audioRange=document.querySelector('.audio-range'),audioCurrent=document.querySelector('.audio-time.current'),audioDuration=document.querySelector('.audio-time.duration'),audioKicker=document.querySelector('.audio-kicker'),audioTitle=document.querySelector('.audio-deck h2'),audioCount=document.querySelector('.audio-track-count');
let audioIndex=0,audioPlayer=null,audioTimer=null;
const audioIds=['Fwh7mNnAlLo','-DFW8CKMvQo','y7Yft2SFBBQ'];
const fmt=s=>{s=Math.max(0,Math.floor(s||0));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};
function syncAudioUI(){if(!audioPlayer||!audioPlayer.getDuration)return;try{const d=audioPlayer.getDuration(),t=audioPlayer.getCurrentTime();audioCurrent.textContent=fmt(t);audioDuration.textContent=fmt(d);audioRange.value=d?Math.round(t/d*1000):0}catch(e){}}
function loadAudio(i){audioIndex=(i+audioIds.length)%audioIds.length;const art=`url('https://i.ytimg.com/vi/${audioIds[audioIndex]}/maxresdefault.jpg')`;audioArt.style.backgroundImage=art;if(vinylAtmosphere){vinylAtmosphere.style.opacity='0';setTimeout(()=>{vinylAtmosphere.style.backgroundImage=art;vinylAtmosphere.style.opacity=''},180)}audioKicker.textContent=`NOW PLAYING · CSP—00${audioIndex+1}`;audioTitle.textContent=`PROJECT 0${audioIndex+1}`;audioCount.textContent=`0${audioIndex+1} / 03`;if(audioPlayer?.loadVideoById)audioPlayer.loadVideoById(audioIds[audioIndex])}
musicTabs.forEach(t=>t.addEventListener('click',()=>{musicTabs.forEach(x=>x.classList.toggle('active',x===t));musicSection?.classList.toggle('vinyl-mode',t.dataset.view==='vinyl')}));
document.querySelector('.audio-prev')?.addEventListener('click',()=>loadAudio(audioIndex-1));document.querySelector('.audio-next')?.addEventListener('click',()=>loadAudio(audioIndex+1));
audioPlay?.addEventListener('click',()=>{if(!audioPlayer)return;const p=audioPlayer.getPlayerState()===YT.PlayerState.PLAYING;p?audioPlayer.pauseVideo():audioPlayer.playVideo()});
audioRange?.addEventListener('input',()=>{if(audioPlayer?.getDuration)audioPlayer.seekTo(audioPlayer.getDuration()*audioRange.value/1000,true)});

audioRecord?.addEventListener('click',()=>audioPlay?.click());
document.addEventListener('keydown',e=>{
 if(!musicSection||!musicSection.matches(':hover'))return;
 if(e.key==='ArrowLeft') musicSection.classList.contains('vinyl-mode')?document.querySelector('.audio-prev')?.click():document.querySelector('.vinyl-prev')?.click();
 if(e.key==='ArrowRight') musicSection.classList.contains('vinyl-mode')?document.querySelector('.audio-next')?.click():document.querySelector('.vinyl-next')?.click();
 if(e.code==='Space'&&musicSection.classList.contains('vinyl-mode')){e.preventDefault();audioPlay?.click()}
});

if(vinylAtmosphere)vinylAtmosphere.style.backgroundImage=`url('https://i.ytimg.com/vi/${audioIds[0]}/maxresdefault.jpg')`;

document.querySelectorAll('.artist-link[data-track]').forEach(card=>{
 const openArtistRecord=()=>{
  const i=Number(card.dataset.track);
  loadAudio(i);
  document.querySelector('#discover')?.scrollIntoView({behavior:'smooth',block:'start'});
 };
 card.addEventListener('click',openArtistRecord);
 card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openArtistRecord()}});
});
