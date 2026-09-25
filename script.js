const menu=document.querySelector('#menu'),nav=document.querySelector('nav');
menu.addEventListener('click',()=>nav.classList.toggle('open'));
document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
document.querySelector('#year').textContent=new Date().getFullYear();

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
