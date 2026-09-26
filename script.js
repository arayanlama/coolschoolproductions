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
  document.querySelectorAll('.vinyl-video iframe').forEach(frame=>{
    const disc=frame.closest('.vinyl-disc');
    new YT.Player(frame,{events:{onStateChange:e=>{
      disc.classList.toggle('is-playing',e.data===YT.PlayerState.PLAYING);
    }}});
  });
}
if(document.querySelector('.vinyl-video iframe')){
  const yt=document.createElement('script');
  yt.src='https://www.youtube.com/iframe_api';
  document.head.appendChild(yt);
}
