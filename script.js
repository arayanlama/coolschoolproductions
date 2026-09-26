const menu=document.querySelector('#menu'),nav=document.querySelector('nav');
menu?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close menu':'Open menu')});
document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu?.setAttribute('aria-expanded','false');menu?.setAttribute('aria-label','Open menu')}));
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

function onYouTubeIframeAPIReady(){
  const hidden=document.createElement('div');hidden.id='vinyl-audio-youtube';hidden.style.cssText='position:fixed;left:-9999px;top:-9999px;width:200px;height:113px;overflow:hidden;opacity:0;pointer-events:none';document.body.appendChild(hidden);audioPlayer=new YT.Player('vinyl-audio-youtube',{height:'113',width:'200',videoId:audioIds[0],playerVars:{playsinline:1,rel:0},events:{onReady:()=>{syncAudioUI();audioTimer=setInterval(syncAudioUI,500)},onStateChange:e=>{const p=e.data===YT.PlayerState.PLAYING;audioRecord?.classList.toggle('playing',p);if(audioPlay){audioPlay.textContent=p?'Ⅱ':'▶';audioPlay.setAttribute('aria-label',p?`Pause ${audioArtists[audioIndex]}`:`Play ${audioArtists[audioIndex]}`)}if(e.data===YT.PlayerState.ENDED)loadAudio(audioIndex+1)}}});
}
const yt=document.createElement('script');yt.src='https://www.youtube.com/iframe_api';document.head.appendChild(yt);

const musicSection=document.querySelector('.vinyl-discover');
const vinylAtmosphere=document.querySelector('.vinyl-atmosphere'),audioRecord=document.querySelector('.audio-record'),audioArt=document.querySelector('.audio-art'),audioPlay=document.querySelector('.audio-play'),audioRange=document.querySelector('.audio-range'),audioCurrent=document.querySelector('.audio-time.current'),audioDuration=document.querySelector('.audio-time.duration'),audioKicker=document.querySelector('.audio-kicker'),audioTitle=document.querySelector('.audio-deck h2'),audioCount=document.querySelector('.audio-track-count');
let audioIndex=0,audioPlayer=null,audioTimer=null;
const audioIds=['rxdvPtSi1rs','-DFW8CKMvQo','oHMU5AneTAg'];
const audioArtists=['Ryhaan Giri','Madhura Naik','Mellow Gyatso'];
const fmt=s=>{s=Math.max(0,Math.floor(s||0));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};
function syncAudioUI(){if(!audioPlayer||!audioPlayer.getDuration)return;try{const d=audioPlayer.getDuration(),t=audioPlayer.getCurrentTime();audioCurrent.textContent=fmt(t);audioDuration.textContent=fmt(d);audioRange.value=d?Math.round(t/d*1000):0}catch(e){}}
function loadAudio(i){audioIndex=(i+audioIds.length)%audioIds.length;const art=`url('https://i.ytimg.com/vi/${audioIds[audioIndex]}/maxresdefault.jpg')`;audioArt.style.backgroundImage=art;if(vinylAtmosphere){vinylAtmosphere.style.opacity='0';setTimeout(()=>{vinylAtmosphere.style.backgroundImage=art;vinylAtmosphere.style.opacity=''},180)}audioKicker.textContent=`NOW PLAYING · CSP—00${audioIndex+1}`;audioTitle.textContent=audioArtists[audioIndex];audioCount.textContent=`0${audioIndex+1} / 03`;audioRecord?.setAttribute('aria-label',`Play ${audioArtists[audioIndex]}`);audioPlay?.setAttribute('aria-label',`Play ${audioArtists[audioIndex]}`);if(audioPlayer?.cueVideoById)audioPlayer.cueVideoById(audioIds[audioIndex])}
document.querySelector('.audio-prev')?.addEventListener('click',()=>loadAudio(audioIndex-1));document.querySelector('.audio-next')?.addEventListener('click',()=>loadAudio(audioIndex+1));
audioPlay?.addEventListener('click',()=>{if(!audioPlayer)return;const p=audioPlayer.getPlayerState()===YT.PlayerState.PLAYING;p?audioPlayer.pauseVideo():audioPlayer.playVideo()});
audioRange?.addEventListener('input',()=>{if(audioPlayer?.getDuration)audioPlayer.seekTo(audioPlayer.getDuration()*audioRange.value/1000,true)});

audioRecord?.addEventListener('click',()=>audioPlay?.click());audioRecord?.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();audioPlay?.click()}});
document.addEventListener('keydown',e=>{
 if(!musicSection||!musicSection.matches(':hover'))return;
 if(e.key==='ArrowLeft') document.querySelector('.audio-prev')?.click();
 if(e.key==='ArrowRight') document.querySelector('.audio-next')?.click();
 if(e.code==='Space'){e.preventDefault();audioPlay?.click()}
});

document.addEventListener('visibilitychange',()=>{if(document.hidden)clearInterval(audioTimer);else if(audioPlayer){clearInterval(audioTimer);audioTimer=setInterval(syncAudioUI,500)}});

if(vinylAtmosphere)vinylAtmosphere.style.backgroundImage=`url('https://i.ytimg.com/vi/${audioIds[0]}/maxresdefault.jpg')`;if(audioArt)audioArt.style.backgroundImage=`url('https://i.ytimg.com/vi/${audioIds[0]}/maxresdefault.jpg')`;

document.querySelectorAll('.artist-link[data-track]').forEach(card=>{
 const openArtistRecord=()=>{
  const i=Number(card.dataset.track);
  loadAudio(i);
  document.querySelector('#discover')?.scrollIntoView({behavior:'smooth',block:'start'});
 };
 card.addEventListener('click',openArtistRecord);
 card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openArtistRecord()}});
});
