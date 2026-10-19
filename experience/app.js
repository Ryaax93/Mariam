'use strict';
(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  document.documentElement.classList.add('js');

  // Every chapter is real document content: native scrolling, no scroll hijacking.
  if ('IntersectionObserver' in window) {
    const reveals = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); reveals.unobserve(entry.target); }
    }), { rootMargin: '0px 0px -35px 0px', threshold: .06 });
    $$('.reveal').forEach(element => reveals.observe(element));
  } else $$('.reveal').forEach(element => element.classList.add('visible'));

  const memories = {
    christmas: { image:'IMG_5797.jpeg', title:'Notre premier Noël.', alt:'Les cadeaux et petites attentions de notre premier Noël', text:'Dans les cadeaux, il y a les choses qu’on offre. Et puis il y a ce qu’on essaie de dire avec : je pense à toi, j’ai envie de te faire sourire, tu comptes pour moi. Tout ça à la fois.' },
    gift: { image:'IMG_5796.jpeg', title:'Ce que je garde.', alt:'Un souvenir pendant l’ouverture d’un cadeau', text:'Ce n’est pas seulement le cadeau. C’est l’attente avant, le petit instant où tu le découvres, et le bonheur de partager ça avec toi. J’ai envie qu’on en ait encore beaucoup, des instants comme celui-là.' },
    snow: { image:'IMG_5798.jpeg', title:'Ton prénom, même dans la neige.', alt:'Mariam et un cœur tracés dans la neige', text:'La neige finit par fondre. Mais l’envie de mettre ton prénom dans les jolies choses, elle, reste. Un petit cœur, quelques lettres… et tout est dit.' },
    heart: { image:'IMG_5799.jpeg', title:'La recette ? Un peu de nous.', alt:'Une initiale R et un cœur dans une poêle', text:'Un R et un cœur. Franchement, même les grands chefs n’ont pas cette recette. C’est le genre de petit détail qui ne fait pas beaucoup de bruit, mais qui reste longtemps dans le cœur.' },
    nails: { image:'IMG_5800.jpeg', title:'Une toute petite lettre.', alt:'Une initiale R sur un ongle de la manucure', text:'Un petit R sur tes ongles. Une place minuscule, et pourtant tellement grande pour moi. J’aime ces attentions qui disent « je pense à toi » sans avoir besoin de le prononcer.' }
  };
  const letters = {
    courage: { title:'Les jours où tu doutes de toi.', paragraphs:[
      'Si tu ouvres cette lettre un jour où tout te semble trop lourd, respire un peu. Tu n’as rien à prouver ici. Tu n’as pas besoin d’être forte à chaque minute pour que je sois fier de toi.',
      'Je vois les efforts que tu fais. Je vois ton courage, même quand toi, tu ne le vois plus. Une mauvaise journée ne raconte pas toute ton histoire.',
      'Pour tes études, tes projets, tout ce qui compte pour toi : avance à ton rythme. Je veux être à tes côtés, t’écouter, te faire rire quand tu peux rire, et simplement rester quand tu en as besoin.',
      '<strong>Je crois en toi, Mariam. Même les jours où tu as du mal à le faire.</strong>' ] },
    smile: { title:'Une lettre très sérieuse. Enfin, presque.', paragraphs:[
      'Déjà, il faut parler d’un problème : ton rire. Je suis censé garder mon calme, être mystérieux, avoir un minimum de charisme… et toi tu rigoles, et je redeviens complètement amoureux.',
      'En plus, tu es beaucoup trop belle. Je ne sais pas à quel moment c’est devenu normal que j’aie une copine pareille. Voilà. Réclamation déposée.',
      'Et si tu trouves que ce cadeau en fait un peu trop, rappelle-toi que c’est toi qui as demandé à ce que je t’ajoute sur le live. Maintenant, il faut assumer les conséquences : beaucoup d’amour et mes blagues avec.',
      '<strong>J’espère que tu souris en lisant ça. C’était le plan depuis le début.</strong>' ] },
    love: { title:'Je t’aime dans les petites choses.', paragraphs:[
      'Je pourrais chercher une phrase immense, une phrase de film. Mais la vérité, c’est que je t’aime surtout dans les choses toutes simples.',
      'Dans ton rire. Dans ta présence. Dans l’envie de te raconter quelque chose dès qu’il m’arrive un petit truc. Dans ces attentions qui font qu’un jour ordinaire ressemble un peu moins à tous les autres.',
      'Tu es ma première vraie relation, et tu m’apprends une chose précieuse : aimer, c’est aussi faire attention, écouter et apprendre à mieux se comprendre.',
      'Je n’ai pas envie de prétendre que je saurai toujours tout faire parfaitement. J’ai envie de continuer à apprendre à t’aimer, pour de vrai.',
      '<strong>Et de construire avec toi des souvenirs qu’on n’a même pas encore imaginés.</strong>' ] },
    final: { title:'Si c’était à refaire, ce serait toi.', paragraphs:[
      'Quand tu as écrit ce commentaire pendant mon live, tu ne savais pas que je garderais ce moment comme le début de quelque chose d’aussi précieux. Moi non plus.',
      'Puis il y a eu ce soir de décembre. Le froid, la voiture, les vitres embuées. Mon baiser sur ta joue. Le tien sur mes lèvres. Si je pouvais retourner dans un seul instant pour le ressentir encore une fois, celui-là serait tout près du haut de la liste.',
      'Depuis, il y a eu les cadeaux, les lettres, les petites attentions. Mais derrière chacun de ces souvenirs, il y a la même chose : toi. Toi qui rends ma vie plus vivante, et qui me donnes envie d’aimer mieux.',
      'Aujourd’hui, pour ton anniversaire, j’aimerais surtout que tu te sentes aimée. Pas parce que tu dois réussir quelque chose. Pas parce que tu dois être parfaite. Simplement parce que tu es Mariam, et que cette personne-là compte énormément pour moi.',
      '<strong>Si tout recommençait, je chercherais encore ton commentaire. Je t’écrirais encore. Et dans cette voiture, je me rapprocherais encore de toi.</strong>',
      'Joyeux anniversaire, mon amour. Je t’aime. Et j’ai tellement envie de découvrir la suite avec toi.' ] }
  };

  let returnFocus = null;
  const openDialog = dialog => {
    returnFocus = document.activeElement;
    dialog.showModal();
    document.body.classList.add('modal-open');
    dialog.scrollTop = 0;
  };
  const closeDialog = dialog => {
    dialog.close();
    if (!document.querySelector('dialog[open]')) document.body.classList.remove('modal-open');
  };
  $$('dialog').forEach(dialog => {
    $('[data-close]',dialog).addEventListener('click', () => closeDialog(dialog));
    dialog.addEventListener('click', event => {
      const rect = dialog.getBoundingClientRect();
      if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) closeDialog(dialog);
    });
    dialog.addEventListener('close', () => {
      if (!document.querySelector('dialog[open]')) document.body.classList.remove('modal-open');
      returnFocus?.focus({preventScroll:true});
    });
  });
  $('#menu-toggle').addEventListener('click', () => openDialog($('#chapter-menu')));
  const moveTo = id => {
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({behavior:motion.matches ? 'instant' : 'smooth',block:'start'});
  };
  $$('.chapter-menu nav a').forEach(link => link.addEventListener('click', event => {
    event.preventDefault();closeDialog($('#chapter-menu'));moveTo(link.hash.slice(1));
  }));
  $$('[data-memory]').forEach(button => button.addEventListener('click', () => {
    const memory = memories[button.dataset.memory];
    $('#memory-image').src = 'assets/'+memory.image;
    $('#memory-image').alt = memory.alt;
    $('#memory-title').textContent = memory.title;
    $('#memory-text').textContent = memory.text;
    openDialog($('#memory-dialog')); chime(659.25);
  }));
  const showLetter = key => {
    const letter = letters[key];
    $('#letter-title').textContent = letter.title;
    $('#letter-body').innerHTML = letter.paragraphs.map(text=>`<p>${text}</p>`).join('');
    openDialog($('#letter-dialog'));chime(523.25);
  };
  $$('[data-letter]').forEach(button => button.addEventListener('click', () => {
    button.dataset.opened = 'true';showLetter(button.dataset.letter);
  }));

  // A gentle original instrumental, synthesized locally; never autoplay.
  let audio = null, master = null, musicOn = false, melodyTimer = null, noteIndex = 0;
  const notes = [60,67,72,76,74,72,67,64,57,64,69,72,71,69,64,60,53,60,65,69,67,65,60,57,55,62,67,71,74,71,67,62];
  const createAudio = () => {
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) return false;
    audio = new Audio();
    master = audio.createGain();master.gain.value = .25;master.connect(audio.destination);
    return true;
  };
  const playNote = (frequency, duration=3, volume=.18) => {
    if (!audio || !master || audio.state !== 'running') return;
    const at = audio.currentTime;
    const gain = audio.createGain();gain.gain.setValueAtTime(0,at);gain.gain.linearRampToValueAtTime(volume,at+.018);gain.gain.exponentialRampToValueAtTime(.0001,at+duration);gain.connect(master);
    const oscillator=audio.createOscillator();oscillator.type='sine';oscillator.frequency.value=frequency;oscillator.connect(gain);oscillator.start(at);oscillator.stop(at+duration+.05);
    const overtone=audio.createOscillator();const overtoneGain=audio.createGain();overtone.frequency.value=frequency*2.004;overtoneGain.gain.value=.14;overtone.connect(overtoneGain);overtoneGain.connect(gain);overtone.start(at);overtone.stop(at+duration+.05);
    oscillator.onended=()=>{oscillator.disconnect();overtone.disconnect();overtoneGain.disconnect();gain.disconnect();};
  };
  const musicTick=()=>{
    if (!musicOn || document.hidden) return;
    const note=notes[noteIndex%notes.length];playNote(440*Math.pow(2,(note-69)/12),3.2,.16);
    if(noteIndex%4===0)playNote(440*Math.pow(2,(note-24-69)/12),4.2,.11);
    noteIndex++;
  };
  const chime=frequency=>{if(musicOn)playNote(frequency,1.6,.12);};
  const updateSound=()=>{
    $('#sound-toggle').setAttribute('aria-pressed',String(musicOn));
    $('#sound-toggle').setAttribute('aria-label',musicOn?'Couper l’ambiance musicale':'Activer l’ambiance musicale');
    $('#sound-label').textContent=musicOn?'Son activé':'Son coupé';
  };
  $('#sound-toggle').addEventListener('click',async()=>{
    try {
      if(!audio&&!createAudio()){ $('#sound-label').textContent='Son indisponible';return; }
      musicOn=!musicOn;
      if(musicOn){await audio.resume();musicTick();melodyTimer=setInterval(musicTick,690);}
      else{clearInterval(melodyTimer);await audio.suspend();}
      updateSound();
    } catch {musicOn=false;clearInterval(melodyTimer);updateSound();$('#sound-label').textContent='Son indisponible';}
  });
  document.addEventListener('visibilitychange',()=>{
    if(audio&&musicOn){if(document.hidden)audio.suspend().catch(()=>{});else audio.resume().catch(()=>{});}
  });

  $('#send-message').addEventListener('click', () => {
    $('#live-card').classList.add('sent');$('#message-answer').hidden=false;
    $('#send-message').innerHTML='Et tout a commencé. <span aria-hidden="true">♡</span>';
    $('#send-message').disabled=true;chime(783.99);
    const rect=$('#live-card').getBoundingClientRect();burst(rect.left+rect.width/2,rect.top+150,35);
  });
  $('#light-christmas').addEventListener('click',()=>{
    const lit=$('#noel').classList.toggle('lit');
    $('#light-christmas').setAttribute('aria-pressed',String(lit));
    $('#light-christmas').innerHTML=lit?'La magie est là <span aria-hidden="true">♡</span>':'Allumer la magie <span aria-hidden="true">✧</span>';
    $('#christmas-message').textContent=lit?'Et si on gardait un peu de cette magie, toute l’année ?':'Il y a des lumières qu’on n’oublie pas.';
    if(lit){chime(1046.5);burst(innerWidth/2,innerHeight*.45,60);}
  });
  $('#last-heart').addEventListener('click',()=>{
    const r=$('#last-heart').getBoundingClientRect();burst(r.left+r.width/2,r.top+35,95);
    showLetter('final');
  });

  // Frost is an actual scratchable layer; the button offers the same result by keyboard.
  const fog=$('#fog'), glass=$('#glass-frame');
  const fogContext=fog.getContext('2d');
  let fogWidth=0,fogHeight=0,erasing=false,previous=null,cleared=false,dirtyCells=new Set();
  const drawFog=()=>{
    if(!fogContext||cleared)return;
    const rect=glass.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);
    if(Math.abs(rect.width-fogWidth)<2&&Math.abs(rect.height-fogHeight)<2)return;
    fogWidth=rect.width;fogHeight=rect.height;fog.width=Math.round(fogWidth*dpr);fog.height=Math.round(fogHeight*dpr);
    fogContext.setTransform(dpr,0,0,dpr,0,0);fogContext.globalCompositeOperation='source-over';
    const gradient=fogContext.createLinearGradient(0,0,fogWidth,fogHeight);gradient.addColorStop(0,'rgba(149,164,181,.95)');gradient.addColorStop(.55,'rgba(104,123,145,.95)');gradient.addColorStop(1,'rgba(86,101,122,.96)');
    fogContext.fillStyle=gradient;fogContext.fillRect(0,0,fogWidth,fogHeight);
    let seed=42;const random=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;};
    for(let i=0;i<3500;i++){fogContext.fillStyle=`rgba(230,239,248,${random()*.07})`;fogContext.fillRect(random()*fogWidth,random()*fogHeight,1.5,1.5);}
    for(let i=0;i<35;i++){const x=random()*fogWidth,y=random()*fogHeight;fogContext.strokeStyle='rgba(221,234,245,.09)';fogContext.lineWidth=.7;fogContext.beginPath();fogContext.moveTo(x,y);fogContext.lineTo(x+2,y+random()*55);fogContext.stroke();}
    dirtyCells.clear();glass.classList.remove('scratching');
  };
  const clearFog=()=>{
    if(cleared)return;cleared=true;erasing=false;glass.classList.add('clear');
    $('#kiss-copy').classList.add('revealed');$('#clear-fog').textContent='Ce soir-là, nous deux. ♡';$('#clear-fog').disabled=true;chime(587.33);
  };
  const eraseAt=(x,y)=>{
    if(!fogContext||cleared)return;
    const radius=28;
    fogContext.globalCompositeOperation='destination-out';
    fogContext.lineWidth=radius*2;fogContext.lineCap='round';fogContext.lineJoin='round';
    fogContext.beginPath();if(previous)fogContext.moveTo(previous.x,previous.y);else fogContext.moveTo(x+.1,y+.1);fogContext.lineTo(x,y);fogContext.stroke();previous={x,y};
    const cell=18;for(let row=Math.floor((y-radius)/cell);row<=Math.ceil((y+radius)/cell);row++)for(let col=Math.floor((x-radius)/cell);col<=Math.ceil((x+radius)/cell);col++){
      if(row>=0&&col>=0&&row*cell<fogHeight&&col*cell<fogWidth&&Math.hypot(col*cell-x,row*cell-y)<=radius)dirtyCells.add(col+':'+row);
    }
    if(dirtyCells.size/(Math.ceil(fogWidth/cell)*Math.ceil(fogHeight/cell))>.24)clearFog();
  };
  fog.addEventListener('pointerdown',event=>{
    if(cleared)return;erasing=true;previous=null;glass.classList.add('scratching');fog.setPointerCapture(event.pointerId);
    const r=fog.getBoundingClientRect();eraseAt(event.clientX-r.left,event.clientY-r.top);
  });
  fog.addEventListener('pointermove',event=>{if(!erasing)return;const r=fog.getBoundingClientRect();eraseAt(event.clientX-r.left,event.clientY-r.top);});
  ['pointerup','pointercancel','lostpointercapture'].forEach(type=>fog.addEventListener(type,()=>{erasing=false;previous=null;}));
  $('#clear-fog').addEventListener('click',clearFog);
  if(!fogContext)clearFog();
  if('ResizeObserver' in window)new ResizeObserver(drawFog).observe(glass);else addEventListener('resize',drawFog);
  drawFog();

  // One bounded animation loop: layered depth, camera drift, snow, and scroll choreography.
  const canvas=$('#universe'),context=canvas.getContext('2d');
  let width=innerWidth,height=innerHeight,dpr=1,stars=[],sparks=[],warpUntil=0,lastTime=0,raf=0;
  let scrollY=window.scrollY,pointerX=0,pointerY=0,cameraX=0,cameraY=0,chapter='01';
  let heroHeight=0,finalTop=0,finalHeight=0,pageHeight=0;
  const hero=$('.hero'),landscape=$('#hero-landscape'),finale=$('.finale'),finalLandscape=$('.final-landscape'),finalHalo=$('.final-halo');
  const finalPhrases=$$('[data-final]');
  const measure=()=>{
    width=innerWidth;height=innerHeight;dpr=Math.min(devicePixelRatio||1,1.75);
    canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
    context?.setTransform(dpr,0,0,dpr,0,0);
    heroHeight=hero.offsetHeight;finalTop=finale.offsetTop;finalHeight=finale.offsetHeight;pageHeight=document.documentElement.scrollHeight;
    stars=Array.from({length:Math.min(95,Math.floor(width*height/5000))},()=>({x:Math.random()*width,y:Math.random()*height,z:.2+Math.random()*.8,size:.3+Math.random()*1.2,phase:Math.random()*6.28,speed:6+Math.random()*13}));
  };
  function burst(x,y,count){
    if(motion.matches||!context)return;
    const amount=Math.min(count,120-sparks.length);
    for(let i=0;i<amount;i++){const angle=Math.random()*Math.PI*2,speed=20+Math.random()*110;sparks.push({x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,life:1,size:.6+Math.random()*1.6});}
  }
  const updateScroll=()=>{scrollY=window.scrollY;if(motion.matches)paint(performance.now());};
  addEventListener('scroll',updateScroll,{passive:true});
  let resizeTimer;
  addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{measure();drawFog();if(motion.matches)paint(performance.now());},140);});
  document.fonts?.ready.then(measure);
  $$('img').forEach(img=>img.addEventListener('load',measure,{once:true}));
  if('IntersectionObserver' in window){
    const chapters=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting)chapter=entry.target.dataset.chapter;},{rootMargin:'-25% 0px -35% 0px',threshold:0});
    $$('[data-chapter]').forEach(section=>chapters.observe(section));
  }
  if(matchMedia('(pointer:fine)').matches) addEventListener('pointermove',event=>{pointerX=(event.clientX/width-.5)*14;pointerY=(event.clientY/height-.5)*9;},{passive:true});
  $('#enter-story').addEventListener('click',()=>{
    if(motion.matches){moveTo('rencontre');return;}
    if(hero.classList.contains('is-entering'))return;
    hero.classList.add('is-entering');warpUntil=performance.now()+1050;chime(523.25);
    setTimeout(()=>moveTo('rencontre'),630);
    setTimeout(()=>hero.classList.remove('is-entering'),1700);
  });
  function paint(time){
    const dt=Math.min((time-lastTime)/1000||.016,.04);lastTime=time;
    const reduce=motion.matches;
    cameraX+=(pointerX-cameraX)*.035;cameraY+=(pointerY-cameraY)*.035;
    $('#reading-progress').style.transform=`scaleX(${clamp(scrollY/Math.max(1,pageHeight-height))})`;
    $('.site-header').classList.toggle('scrolled',scrollY>80);
    if(!reduce){
      if(scrollY<heroHeight+height){const h=clamp(scrollY/heroHeight);landscape.style.transform=`translate3d(${cameraX}px,${h*90+cameraY}px,0) scale(${1+h*.12+(time<warpUntil?(1-(warpUntil-time)/1050)*.09:0)})`;}
      const p=clamp((scrollY-finalTop)/Math.max(1,finalHeight-height));
      if(scrollY+height>finalTop&&scrollY<finalTop+finalHeight){
        const stage=p*2.6;
        finalPhrases.forEach((phrase,i)=>{const distance=stage-i;const opacity=i===2&&stage>2?1:clamp(1-Math.abs(distance)*1.65);phrase.style.opacity=String(opacity);phrase.style.transform=`translate3d(0,${-distance*42}px,0) scale(${1+distance*.07})`;});
        finalLandscape.style.transform=`scale(${1+p*.23})`;finalHalo.style.opacity=String(.2+p*.7);finalHalo.style.transform=`scale(${.6+p*.8})`;
        $('.final-scroll').style.opacity=String(clamp(1-p*1.6));
      }
    }
    if(context){
      context.clearRect(0,0,width,height);
      const snow=chapter==='03';
      for(const star of stars){
        if(!reduce){star.y+=dt*(snow?star.speed:star.speed*.12)*star.z;if(star.y>height+5){star.y=-5;star.x=Math.random()*width;}}
        const x=star.x+cameraX*star.z*1.6,y=star.y+cameraY*star.z;
        context.globalAlpha=(.18+(Math.sin(time*.0008+star.phase)+1)*.19)*star.z;
        context.fillStyle=snow?'#fff2da':'#e7c6a4';
        context.beginPath();context.arc(x,y,star.size*(snow?1.5:1),0,Math.PI*2);context.fill();
        if(time<warpUntil&&!reduce){const dx=x-width/2,dy=y-height/2;context.strokeStyle='#edceaa';context.lineWidth=star.size*.7;context.beginPath();context.moveTo(x,y);context.lineTo(x+dx*.15,y+dy*.15);context.stroke();}
      }
      sparks=sparks.filter(s=>s.life>0);
      for(const spark of sparks){spark.x+=spark.vx*dt;spark.y+=spark.vy*dt;spark.vy+=8*dt;spark.life-=dt*.5;context.globalAlpha=clamp(spark.life);context.fillStyle='#f4cf99';context.beginPath();context.arc(spark.x,spark.y,spark.size,0,Math.PI*2);context.fill();}
      context.globalAlpha=1;
    }
    if(!reduce&&!document.hidden)raf=requestAnimationFrame(paint);
  }
  const restart=()=>{cancelAnimationFrame(raf);lastTime=performance.now();measure();paint(lastTime);};
  document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelAnimationFrame(raf);else restart();});
  motion.addEventListener?.('change',restart);
  measure();paint(performance.now());
  addEventListener('pageshow',()=>{measure();scrollY=window.scrollY;});
})();
