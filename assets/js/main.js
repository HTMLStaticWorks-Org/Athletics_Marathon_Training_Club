
(() => {
 const $=(s,el=document)=>el.querySelector(s), $$=(s,el=document)=>[...el.querySelectorAll(s)];

 // Local reliable photography fallbacks if an asset fails to load.
 const photoFallbacks=[
  'assets/img/image-1.png',
  'assets/img/image-2.png',
  'assets/img/image-fallback.jpg'
 ];
 $$('img').forEach(img=>{img.addEventListener('error',()=>{
  const step=Number(img.dataset.photoFallbackStep||0);
  if(step<photoFallbacks.length){img.dataset.photoFallbackStep=String(step+1);img.src=photoFallbacks[step];}
 }, {passive:true});});
 const savedTheme=localStorage.getItem('stride-theme')||'light';
 document.documentElement.dataset.theme=savedTheme;
 const savedDir=localStorage.getItem('stride-dir')||'ltr';
 document.documentElement.dir=savedDir;
 const themeButtons=$$('.theme-toggle'), dirButtons=$$('.dir-toggle');
 function updateControls(){
  const dark=document.documentElement.dataset.theme==='dark';
  themeButtons.forEach(b=>{
   const symbol=$('.theme-symbol',b),label=$('.utility-label',b);
   if(symbol)symbol.textContent=dark?'☀':'☾';
   else b.textContent=dark?'☀':'☾';
   b.setAttribute('aria-label',dark?'Switch to light theme':'Switch to dark theme');
   b.setAttribute('title',dark?'Switch to light theme':'Switch to dark theme');
   if(label)label.textContent=dark?'Light':'Dark';
  });
  dirButtons.forEach(b=>{
   const label=$('.utility-label',b);
   if(label)label.textContent=document.documentElement.dir==='rtl'?'LTR':'RTL';
   b.setAttribute('aria-label',document.documentElement.dir==='rtl'?'Switch to left-to-right direction':'Switch to right-to-left direction');
  });
 }
 themeButtons.forEach(b=>b.addEventListener('click',()=>{let v=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=v;localStorage.setItem('stride-theme',v);updateControls()}));
 dirButtons.forEach(b=>b.addEventListener('click',()=>{let v=document.documentElement.dir==='rtl'?'ltr':'rtl';document.documentElement.dir=v;localStorage.setItem('stride-dir',v);updateControls()}));
 updateControls();
 const menu=$('.menu-btn'), links=$('.nav-links');
 if(menu&&links){menu.addEventListener('click',()=>{links.classList.toggle('open');menu.setAttribute('aria-expanded',links.classList.contains('open')?'true':'false')});$$('a',links).forEach(a=>a.addEventListener('click',()=>links.classList.remove('open')))}
 const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.12});
 $$('.reveal').forEach(el=>observer.observe(el));
 const top=$('.back-top');window.addEventListener('scroll',()=>{if(top)top.classList.toggle('show',window.scrollY>550)});if(top)top.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
 $$('.faq-q').forEach(q=>q.addEventListener('click',()=>q.parentElement.classList.toggle('open')));
 const form=$('#join-form');if(form)form.addEventListener('submit',e=>{e.preventDefault();const msg=$('.form-message',form);msg.textContent='Thanks! Your interest has been recorded in this demo. Our coaching team will contact you soon.';form.reset()});
 const range=$('#rotation-range'), shoe=$('.shoe-wrap img');if(range&&shoe)range.addEventListener('input',()=>shoe.style.setProperty('--rotate',(range.value*1.8-90)+'deg'));
 const year=$('#year');if(year)year.textContent=new Date().getFullYear();
 const current=location.pathname.split('/').pop()||'index.html';$$('.nav-links a:not(.mobile-join)').forEach(a=>{if(a.getAttribute('href')===current)a.classList.add('active')});

 // Functional 3D cube-flow card transitions on Home 1.
 const cube=$('[data-cube-slider]');
 if(cube){
  const slides=$$('[data-cube-slide]',cube), dots=$$('.cube-dot',cube), count=$('.cube-count strong',cube);
  let active=0, locked=false;
  function showCube(next){
   if(locked||!slides.length)return;
   active=(next+slides.length)%slides.length;
   slides.forEach((slide,i)=>{
    slide.classList.toggle('is-active',i===active);
    slide.classList.toggle('is-before',i<active);
    slide.classList.toggle('is-after',i>active);
    slide.setAttribute('aria-hidden',i===active?'false':'true');
   });
   dots.forEach((dot,i)=>{dot.classList.toggle('is-active',i===active);if(i===active)dot.setAttribute('aria-current','true');else dot.removeAttribute('aria-current')});
   if(count)count.textContent=String(active+1).padStart(2,'0');
   locked=true;window.setTimeout(()=>locked=false,780);
  }
  slides.forEach((slide,i)=>{slide.classList.toggle('is-before',i<active);slide.classList.toggle('is-after',i>active);slide.setAttribute('aria-hidden',i===active?'false':'true')});
  const prev=$('.cube-prev',cube), next=$('.cube-next',cube);
  if(prev)prev.addEventListener('click',()=>showCube(active-1));
  if(next)next.addEventListener('click',()=>showCube(active+1));
  dots.forEach((dot,i)=>dot.addEventListener('click',()=>showCube(i)));
 }
 // Smooth horizontal hexagon-card slider with working arrow controls.
 const hex=$('#stride-hex-slider');
 if(hex){
  const wrap=hex.closest('.hex-slider-wrap'), prev=$('.hex-prev',wrap), next=$('.hex-next',wrap), progress=$('.hex-progress-track span');
  const step=()=>{const card=hex.querySelector('.hex-card');return card?card.getBoundingClientRect().width+parseFloat(getComputedStyle(hex).gap||0):300};
  const update=()=>{
   const max=Math.max(1,hex.scrollWidth-hex.clientWidth);
   if(progress)progress.style.width=Math.max(12,Math.min(100,(hex.scrollLeft/max)*75+25))+'%';
   if(prev)prev.disabled=hex.scrollLeft<=3;
   if(next)next.disabled=hex.scrollLeft>=max-3;
  };
  if(prev)prev.addEventListener('click',()=>hex.scrollBy({left:-step(),behavior:'smooth'}));
  if(next)next.addEventListener('click',()=>hex.scrollBy({left:step(),behavior:'smooth'}));
  hex.addEventListener('scroll',update,{passive:true});
  hex.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();hex.scrollBy({left:step(),behavior:'smooth'})}if(e.key==='ArrowLeft'){e.preventDefault();hex.scrollBy({left:-step(),behavior:'smooth'})}});
  window.addEventListener('resize',update);update();
 }


 // Four-image service cube: rotate sequentially and support manual controls.
 const serviceCube=$('[data-service-cube]');
 if(serviceCube){
  const panels=$$('[data-service-slide]',serviceCube), dots=$$('.service-cube-dot',serviceCube), number=$('.service-cube-number b',serviceCube);
  let current=0, timer=null, busy=false;
  function activateService(index){
   if(!panels.length||busy)return;
   current=(index+panels.length)%panels.length;
   panels.forEach((panel,i)=>{
    panel.classList.toggle('active',i===current);
    panel.setAttribute('aria-hidden',i===current?'false':'true');
   });
   dots.forEach((dot,i)=>dot.classList.toggle('active',i===current));
   if(number)number.textContent=String(current+1).padStart(2,'0');
   busy=true;window.setTimeout(()=>busy=false,850);
  }
  function restartServiceTimer(){
   if(timer)window.clearInterval(timer);
   timer=window.setInterval(()=>activateService(current+1),6200);
  }
  panels.forEach((panel,i)=>panel.setAttribute('aria-hidden',i===0?'false':'true'));
  dots.forEach((dot,i)=>dot.addEventListener('click',()=>{activateService(i);restartServiceTimer()}));
  const servicePrev=$('.service-cube-prev',serviceCube), serviceNext=$('.service-cube-next',serviceCube);
  if(servicePrev)servicePrev.addEventListener('click',()=>{activateService(current-1);restartServiceTimer()});
  if(serviceNext)serviceNext.addEventListener('click',()=>{activateService(current+1);restartServiceTimer()});
  serviceCube.addEventListener('mouseenter',()=>{if(timer)window.clearInterval(timer)});
  serviceCube.addEventListener('mouseleave',restartServiceTimer);
  serviceCube.addEventListener('focusin',()=>{if(timer)window.clearInterval(timer)});
  serviceCube.addEventListener('focusout',restartServiceTimer);
  restartServiceTimer();
 }

 // 3D Cube Flow Cards (Example 2.18 Coverflow on Home 2)
 const cubeFlow = $('[data-cubeflow-carousel]');
 if(cubeFlow){
  const cards = $$('.cubeflow-card', cubeFlow);
  const dots = $$('.cubeflow-dot', cubeFlow);
  const prevBtn = $('.cubeflow-arrow.prev', cubeFlow);
  const nextBtn = $('.cubeflow-arrow.next', cubeFlow);
  const total = cards.length;
  let active = 0;

  function updateFlow(nextIndex){
   active = (nextIndex + total) % total;
   cards.forEach((card, i) => {
    card.classList.remove('pos-center', 'pos-left-1', 'pos-left-2', 'pos-right-1', 'pos-right-2', 'pos-hidden');
    let diff = (i - active) % total;
    if(diff > total / 2) diff -= total;
    if(diff < -total / 2) diff += total;

    if(diff === 0){
     card.classList.add('pos-center');
     card.setAttribute('aria-hidden', 'false');
    } else if(diff === -1){
     card.classList.add('pos-left-1');
     card.setAttribute('aria-hidden', 'true');
    } else if(diff === -2){
     card.classList.add('pos-left-2');
     card.setAttribute('aria-hidden', 'true');
    } else if(diff === 1){
     card.classList.add('pos-right-1');
     card.setAttribute('aria-hidden', 'true');
    } else if(diff === 2){
     card.classList.add('pos-right-2');
     card.setAttribute('aria-hidden', 'true');
    } else {
     card.classList.add('pos-hidden');
     card.setAttribute('aria-hidden', 'true');
    }
   });

   dots.forEach((dot, i) => {
    dot.classList.toggle('is-active', i === active);
   });
  }

  if(prevBtn) prevBtn.addEventListener('click', () => updateFlow(active - 1));
  if(nextBtn) nextBtn.addEventListener('click', () => updateFlow(active + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => updateFlow(i)));

  cards.forEach((card, i) => {
   card.addEventListener('click', () => {
    if(i !== active) updateFlow(i);
   });
  });

  // Swipe support for touch devices
  let touchStartX = 0;
  cubeFlow.addEventListener('touchstart', e => {
   touchStartX = e.changedTouches[0].screenX;
  }, {passive:true});
  cubeFlow.addEventListener('touchend', e => {
   let touchEndX = e.changedTouches[0].screenX;
   if(touchStartX - touchEndX > 45) updateFlow(active + 1);
   if(touchEndX - touchStartX > 45) updateFlow(active - 1);
  }, {passive:true});

  updateFlow(0);
 }

 // Example 2.17: Toggle Info Cards (Programs: Pathways Curriculum)
 const toggleCarousel = $('[data-toggle-carousel]');
 if(toggleCarousel){
  const cards = $$('.toggle-card', toggleCarousel);
  const dots = $$('.toggle-dot', toggleCarousel);
  const prevBtn = $('.toggle-nav-btn.prev', toggleCarousel);
  const nextBtn = $('.toggle-nav-btn.next', toggleCarousel);
  const total = cards.length;
  let active = 1; // Center card (Tier 2) active by default

  function updateToggleCards(nextIndex, autoOpenInfo = true){
   active = (nextIndex + total) % total;
   cards.forEach((card, i) => {
    card.classList.remove('active', 'is-prev', 'is-next', 'is-hidden');
    let diff = (i - active) % total;
    if(diff > total / 2) diff -= total;
    if(diff < -total / 2) diff += total;

    if(diff === 0){
     card.classList.add('active');
     if(autoOpenInfo) card.classList.add('info-open');
     card.setAttribute('aria-hidden', 'false');
    } else if(diff === -1 || (total === 2 && diff === 1)){
     card.classList.add('is-prev');
     card.classList.remove('info-open');
     card.setAttribute('aria-hidden', 'true');
    } else if(diff === 1){
     card.classList.add('is-next');
     card.classList.remove('info-open');
     card.setAttribute('aria-hidden', 'true');
    } else {
     card.classList.add('is-hidden');
     card.classList.remove('info-open');
     card.setAttribute('aria-hidden', 'true');
    }
   });

   dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === active);
   });
  }

  // Arrow controls
  if(prevBtn) prevBtn.addEventListener('click', () => updateToggleCards(active - 1));
  if(nextBtn) nextBtn.addEventListener('click', () => updateToggleCards(active + 1));

  // Dots
  dots.forEach((dot, i) => {
   dot.addEventListener('click', () => updateToggleCards(i));
  });

  // Card click & toggle interactions
  cards.forEach((card, i) => {
   // Plus button to open info
   const plusBtn = $('.toggle-plus-btn', card);
   if(plusBtn){
    plusBtn.addEventListener('click', (e) => {
     e.stopPropagation();
     if(i !== active){
      updateToggleCards(i, true);
     } else {
      card.classList.add('info-open');
     }
    });
   }

   // Flip / close button to toggle view back to photo
   const flipBtn = $('.toggle-flip-btn', card);
   if(flipBtn){
    flipBtn.addEventListener('click', (e) => {
     e.stopPropagation();
     card.classList.toggle('info-open');
    });
   }

   // Clicking on side cards brings them to center
   card.addEventListener('click', (e) => {
    if(e.target.closest('a') || e.target.closest('.toggle-flip-btn')) return;
    if(i !== active){
     updateToggleCards(i, true);
    }
   });
  });

  // Touch swipe support
  let touchStartX = 0;
  toggleCarousel.addEventListener('touchstart', e => {
   touchStartX = e.changedTouches[0].screenX;
  }, {passive:true});
  toggleCarousel.addEventListener('touchend', e => {
   let touchEndX = e.changedTouches[0].screenX;
   if(touchStartX - touchEndX > 45) updateToggleCards(active + 1);
   if(touchEndX - touchStartX > 45) updateToggleCards(active - 1);
  }, {passive:true});

  updateToggleCards(1, true); // Initialize Tier 2 active in center with info open
 }

 // Example 2.22: Expandable Cards Carousel (events.html)
 const expandCarousel = $('[data-expandable-carousel]');
 if(expandCarousel){
  const cards = $$('.expand-card', expandCarousel);
  const prevBtn = $('[data-expand-prev]', expandCarousel);
  const nextBtn = $('[data-expand-next]', expandCarousel);
  const dots = $$('.expand-dot', expandCarousel);
  const currentCounter = $('[data-expand-current]', expandCarousel);

  let active = 1; // Default to card 1 (Osaka Marathon Breakthrough) in center
  let isExpanded = true;

  function updateCarousel(newIndex, expand = true){
   if(cards.length === 0) return;
   active = (newIndex + cards.length) % cards.length;
   isExpanded = expand;

   const isMobile = window.innerWidth <= 680;
   const isTablet = window.innerWidth <= 960;

   cards.forEach((card, i) => {
    let diff = i - active;
    // Circular distance
    if(diff > cards.length / 2) diff -= cards.length;
    if(diff < -cards.length / 2) diff += cards.length;

    card.classList.remove('active', 'expanded', 'is-prev', 'is-next', 'is-far-prev', 'is-far-next', 'is-hidden');

    if(diff === 0){
     card.classList.add('active');
     if(isExpanded){
      card.classList.add('expanded');
     }
     card.style.transform = 'translateX(0) scale(1)';
     card.style.zIndex = '12';
     card.style.opacity = '1';
     card.style.pointerEvents = 'auto';
     card.setAttribute('aria-hidden', 'false');
    } else if(diff === -1){
     card.classList.add('is-prev');
     const offset = isExpanded ? (isMobile ? -270 : (isTablet ? -380 : -500)) : -260;
     card.style.transform = `translateX(${offset}px) scale(0.88)`;
     card.style.zIndex = '6';
     card.style.opacity = '0.75';
     card.style.pointerEvents = 'auto';
     card.setAttribute('aria-hidden', 'true');
    } else if(diff === 1){
     card.classList.add('is-next');
     const offset = isExpanded ? (isMobile ? 270 : (isTablet ? 380 : 500)) : 260;
     card.style.transform = `translateX(${offset}px) scale(0.88)`;
     card.style.zIndex = '6';
     card.style.opacity = '0.75';
     card.style.pointerEvents = 'auto';
     card.setAttribute('aria-hidden', 'true');
    } else if(diff === -2){
     card.classList.add('is-far-prev');
     const offset = isExpanded ? (isMobile ? -360 : (isTablet ? -520 : -720)) : -440;
     card.style.transform = `translateX(${offset}px) scale(0.76)`;
     card.style.zIndex = '3';
     card.style.opacity = '0.35';
     card.style.pointerEvents = 'auto';
     card.setAttribute('aria-hidden', 'true');
    } else if(diff === 2){
     card.classList.add('is-far-next');
     const offset = isExpanded ? (isMobile ? 360 : (isTablet ? 520 : 720)) : 440;
     card.style.transform = `translateX(${offset}px) scale(0.76)`;
     card.style.zIndex = '3';
     card.style.opacity = '0.35';
     card.style.pointerEvents = 'auto';
     card.setAttribute('aria-hidden', 'true');
    } else {
     card.classList.add('is-hidden');
     card.style.transform = `translateX(${diff > 0 ? 800 : -800}px) scale(0.6)`;
     card.style.zIndex = '0';
     card.style.opacity = '0';
     card.style.pointerEvents = 'none';
     card.setAttribute('aria-hidden', 'true');
    }
   });

   dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === active);
   });

   if(currentCounter){
    currentCounter.textContent = String(active + 1).padStart(2, '0');
   }
  }

  // Arrow navigation
  if(prevBtn) prevBtn.addEventListener('click', () => updateCarousel(active - 1, true));
  if(nextBtn) nextBtn.addEventListener('click', () => updateCarousel(active + 1, true));

  // Dots navigation
  dots.forEach((dot, i) => {
   dot.addEventListener('click', () => updateCarousel(i, true));
  });

  // Card interactions
  cards.forEach((card, i) => {
   // Click on central '+' button to expand
   const plusBtn = $('.expand-toggle-plus', card);
   if(plusBtn){
    plusBtn.addEventListener('click', (e) => {
     e.stopPropagation();
     if(i !== active){
      updateCarousel(i, true);
     } else {
      isExpanded = true;
      card.classList.add('expanded');
      updateCarousel(active, true);
     }
    });
   }

   // Click on close '✕' button
   const closeBtn = $('.expand-close-btn', card);
   if(closeBtn){
    closeBtn.addEventListener('click', (e) => {
     e.stopPropagation();
     isExpanded = false;
     card.classList.remove('expanded');
     updateCarousel(active, false);
    });
   }

   // Click on bottom-right '-' button to collapse
   const minusBtn = $('.expand-toggle-minus', card);
   if(minusBtn){
    minusBtn.addEventListener('click', (e) => {
     e.stopPropagation();
     isExpanded = false;
     card.classList.remove('expanded');
     updateCarousel(active, false);
    });
   }

   // Clicking an inactive card brings it to center & expands it
   card.addEventListener('click', (e) => {
    if(e.target.closest('button')) return;
    if(i !== active){
     updateCarousel(i, true);
    }
   });
  });

  // Touch swipe support
  let touchStartX = 0;
  expandCarousel.addEventListener('touchstart', e => {
   touchStartX = e.changedTouches[0].screenX;
  }, {passive:true});
  expandCarousel.addEventListener('touchend', e => {
   let touchEndX = e.changedTouches[0].screenX;
   if(touchStartX - touchEndX > 45) updateCarousel(active + 1, true);
   if(touchEndX - touchStartX > 45) updateCarousel(active - 1, true);
  }, {passive:true});

  // Window resize handler to adjust offsets
  let resizeTimer;
  window.addEventListener('resize', () => {
   clearTimeout(resizeTimer);
   resizeTimer = setTimeout(() => updateCarousel(active, isExpanded), 100);
  });

  // Initialize Card 1 in center, expanded
  updateCarousel(1, true);
 }

 // Example 2.7: Circle Card Slider (contact.html)
 const circleSlider = $('[data-circle-slider]');
 if(circleSlider){
  const cards = $$('.circle-card', circleSlider);
  const prevBtn = $('[data-circle-prev]', circleSlider);
  const nextBtn = $('[data-circle-next]', circleSlider);
  const dots = $$('.circle-dot', circleSlider);
  const panels = $$('.circle-detail-panel', circleSlider);

  let active = 0; // Default to Base 0 (Gachibowli Stadium Track)

  function updateCircleSlider(newIndex){
   if(cards.length === 0) return;
   active = (newIndex + cards.length) % cards.length;

   const isMobile = window.innerWidth <= 520;
   const isTablet = window.innerWidth <= 768;

   const xOffset = isMobile ? 130 : (isTablet ? 160 : 240);
   const sideScale = isMobile ? 0.62 : (isTablet ? 0.68 : 0.72);

   cards.forEach((card, i) => {
    let diff = i - active;
    if(diff > cards.length / 2) diff -= cards.length;
    if(diff < -cards.length / 2) diff += cards.length;

    card.classList.remove('active', 'is-prev', 'is-next', 'is-hidden');

    if(diff === 0){
     card.classList.add('active');
     card.style.transform = 'translateX(0) scale(1)';
     card.style.zIndex = '10';
     card.style.opacity = '1';
     card.style.pointerEvents = 'auto';
     card.setAttribute('aria-hidden', 'false');
    } else if(diff === -1 || (diff === 2 && cards.length === 3)){
     card.classList.add('is-prev');
     card.style.transform = `translateX(-${xOffset}px) scale(${sideScale})`;
     card.style.zIndex = '4';
     card.style.opacity = isMobile ? '0.5' : '0.85';
     card.style.pointerEvents = 'auto';
     card.setAttribute('aria-hidden', 'true');
    } else if(diff === 1 || (diff === -2 && cards.length === 3)){
     card.classList.add('is-next');
     card.style.transform = `translateX(${xOffset}px) scale(${sideScale})`;
     card.style.zIndex = '4';
     card.style.opacity = isMobile ? '0.5' : '0.85';
     card.style.pointerEvents = 'auto';
     card.setAttribute('aria-hidden', 'true');
    } else {
     card.classList.add('is-hidden');
     card.style.transform = 'translateX(0) scale(0.5)';
     card.style.zIndex = '0';
     card.style.opacity = '0';
     card.style.pointerEvents = 'none';
     card.setAttribute('aria-hidden', 'true');
    }
   });

   dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === active);
   });

   panels.forEach((panel, i) => {
    panel.classList.toggle('active', i === active);
   });
  }

  if(prevBtn) prevBtn.addEventListener('click', () => updateCircleSlider(active - 1));
  if(nextBtn) nextBtn.addEventListener('click', () => updateCircleSlider(active + 1));

  dots.forEach((dot, i) => {
   dot.addEventListener('click', () => updateCircleSlider(i));
  });

  cards.forEach((card, i) => {
   card.addEventListener('click', () => {
    if(i !== active) updateCircleSlider(i);
   });
  });

  // Touch swipe support
  let touchStartX = 0;
  circleSlider.addEventListener('touchstart', e => {
   touchStartX = e.changedTouches[0].screenX;
  }, {passive:true});
  circleSlider.addEventListener('touchend', e => {
   let touchEndX = e.changedTouches[0].screenX;
   if(touchStartX - touchEndX > 40) updateCircleSlider(active + 1);
   if(touchEndX - touchStartX > 40) updateCircleSlider(active - 1);
  }, {passive:true});

  // Window resize handler
  let resizeTimer;
  window.addEventListener('resize', () => {
   clearTimeout(resizeTimer);
   resizeTimer = setTimeout(() => updateCircleSlider(active), 100);
  });

  // Initialize
  updateCircleSlider(0);
 }

})();
