'use strict';
const eventDate = new Date('2026-10-25T11:30:00+05:30');
const $ = id => document.getElementById(id);
function tick(){const diff=Math.max(0,eventDate.getTime()-Date.now());const seconds=Math.floor(diff/1000);const values=[Math.floor(seconds/86400),Math.floor(seconds%86400/3600),Math.floor(seconds%3600/60),seconds%60];['days','hours','minutes','seconds'].forEach((id,i)=>$(id).textContent=String(values[i]).padStart(2,'0'));if(diff===0)$('countdown-caption').textContent='The celebration day has arrived! 🌸';}tick();setInterval(tick,1000);
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){const container=document.querySelector('.petals');for(let i=0;i<14;i++){const el=document.createElement('span');el.className='petal';el.textContent=i%3===0?'✿':'❀';el.style.left=(i*71%100)+'%';el.style.fontSize=(12+i%4*5)+'px';el.style.animationDuration=(12+i%6*3)+'s';el.style.animationDelay=(-i*2)+'s';container.appendChild(el);}}
function whatsappMessage(text){window.open('https://api.whatsapp.com/send?text='+encodeURIComponent(text),'_blank','noopener,noreferrer');}
// Autoplay with sound is restricted by Chrome, Safari and many mobile browsers.
// Attempt on load; if blocked, start on the first user tap/click/keypress without a visible button.
const music=$('backgroundMusic');music.volume=0.55;
async function tryStartMusic(){
 if(!music.paused)return;
 try{await music.play();}catch(e){/* Browser blocked audible autoplay or music.mp3 is missing. */}
}
window.addEventListener('load',tryStartMusic);
for(const type of ['pointerdown','keydown','touchstart']){
 document.addEventListener(type,()=>{tryStartMusic();},{capture:true,passive:true});
}

const pollApi=(window.BABY_POLL_API_URL||'').trim();const demoKey='janak-rajni-baby-poll-demo-v2';
const safeDemoRead=()=>{try{return JSON.parse(localStorage.getItem(demoKey)||'[]')}catch(e){return []}};
const safeDemoSave=items=>{try{localStorage.setItem(demoKey,JSON.stringify(items));return true}catch(e){return false}};
const pollStatus=$('pollStatus');
function showPoll(items){items=Array.isArray(items)?items:[];const boys=items.filter(v=>v.prediction==='Boy');const girls=items.filter(v=>v.prediction==='Girl');const total=boys.length+girls.length;
 $('boyCount').textContent=`${boys.length} (${total?Math.round(boys.length*100/total):0}%)`; $('girlCount').textContent=`${girls.length} (${total?Math.round(girls.length*100/total):0}%)`;
 $('boyNumber').textContent=boys.length; $('girlNumber').textContent=girls.length; $('boyPercent').textContent=(total?Math.round(boys.length*100/total):0)+'%'; $('girlPercent').textContent=(total?Math.round(girls.length*100/total):0)+'%';
 $('boyBar').style.width=(total?boys.length*100/total:0)+'%';$('girlBar').style.width=(total?girls.length*100/total:0)+'%';$('totalVotes').textContent=`${total} prediction${total===1?'':'s'} so far`;
 for(const [id,votes] of [['boyNames',boys],['girlNames',girls]]){const list=$(id);list.replaceChildren();if(!votes.length){const li=document.createElement('li');li.textContent='Be the first!';list.appendChild(li);}else votes.forEach(v=>{const li=document.createElement('li');li.textContent=String(v.name||'Guest');list.appendChild(li);});}}
// JSONP is used for reading because Google Apps Script redirects can trigger
// cross-origin restrictions for fetch() from a GitHub Pages site.
let liveVotes=[];
function getLiveVotes(){return new Promise((resolve,reject)=>{
 const cb='babyPollCb_'+Date.now()+'_'+Math.floor(Math.random()*100000);
 const tag=document.createElement('script');let done=false;
 const timer=setTimeout(()=>finish(new Error('Live poll request timed out')),12000);
 function finish(err,data){if(done)return;done=true;clearTimeout(timer);delete window[cb];tag.remove();err?reject(err):resolve(data);}
 window[cb]=data=>finish(null,data);
 tag.onerror=()=>finish(new Error('Cannot load Google Sheets results'));
 tag.src=pollApi+(pollApi.includes('?')?'&':'?')+'callback='+encodeURIComponent(cb)+'&t='+Date.now();
 document.head.appendChild(tag);
});}
async function refreshPoll(){
 if(!pollApi){showPoll(safeDemoRead());$('liveIndicator').textContent='Demo only';return;}
 try{const data=await getLiveVotes();if(!data.ok)throw Error(data.error||'Unable to load results');liveVotes=data.votes||[];showPoll(liveVotes);$('liveIndicator').textContent='● Live';$('liveIndicator').classList.add('connected');pollStatus.textContent='';}
 catch(e){$('liveIndicator').textContent='Connection issue';$('liveIndicator').classList.remove('connected');pollStatus.textContent='Could not load live predictions: '+e.message;}
}
$('pollMode').textContent=pollApi?'Live shared predictions — names and votes are public':'Local test mode — connect Google Sheets to share votes with everyone';

function celebratePrediction(prediction,name){
 const panel=$('babyCelebration');panel.hidden=false;panel.classList.toggle('boy-celebration',prediction==='Boy');
 $('babyFace').textContent=prediction==='Boy'?'👶🏻💙':'👶🏻🎀';
 $('babyCheer').textContent=prediction==='Boy'?'Hehe! Team Boy! 💙':'Yay! Team Girl! 💗';
 $('babyMessage').textContent=`Thank you, ${name}! Your prediction makes our celebration sweeter!`;
 const confetti=$('babyConfetti');confetti.replaceChildren();
 if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){for(let i=0;i<22;i++){const piece=document.createElement('span');piece.textContent=i%3===0?'✿':i%3===1?'♥':'✦';piece.style.left=(i*47%100)+'%';piece.style.color=prediction==='Boy'?'#6bb7df':'#e58fae';piece.style.animationDelay=(i%9*.15)+'s';piece.style.fontSize=(13+i%5*4)+'px';confetti.appendChild(piece);}}
 panel.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'});
}
// Preview reactions without saving a vote.
$('previewBaby').addEventListener('click',()=>{
 const choice=document.querySelector('input[name="prediction"]:checked');
 if(!choice){$('pollStatus').textContent='Please select Baby Boy or Baby Girl first.';return;}
 celebratePrediction(choice.value,$('pollName').value.trim()||'dear guest');
});
document.querySelectorAll('input[name="prediction"]').forEach(radio=>radio.addEventListener('change',()=>{
 celebratePrediction(radio.value,$('pollName').value.trim()||'dear guest');
}));
$('closeCelebration').addEventListener('click',()=>{$('babyCelebration').hidden=true;});

$('pollForm').addEventListener('submit',async event=>{
 event.preventDefault();const choice=document.querySelector('input[name="prediction"]:checked');
 const name=$('pollName').value.trim();if(!choice||!name)return;
 const button=$('voteButton');button.disabled=true;pollStatus.textContent='Saving prediction…';
 try{
  if(!pollApi){const votes=safeDemoRead();votes.push({name,prediction:choice.value});if(!safeDemoSave(votes))throw Error('Browser storage unavailable');showPoll(votes);pollStatus.textContent='Test vote saved on this device only.';}
  else{
   const id='vote-'+Date.now()+'-'+Math.random().toString(36).slice(2);
   // A simple form POST works with Google Apps Script as an opaque request.
   // Never claim success until the submitted ID is visible in shared results.
   const form=new URLSearchParams({id,name,prediction:choice.value});
   await fetch(pollApi,{method:'POST',mode:'no-cors',body:form});
   let found=false;
   for(let attempt=0;attempt<5;attempt++){
    await new Promise(r=>setTimeout(r,1200));
    const data=await getLiveVotes();if(!data.ok)throw Error(data.error||'Backend error');
    liveVotes=data.votes||[];showPoll(liveVotes);
    if(liveVotes.some(v=>v.id===id)){found=true;break;}
   }
   if(!found)throw Error('Vote not confirmed yet. Refresh results before trying again.');
   pollStatus.textContent='Your prediction is on the shared board!';
  }
  celebratePrediction(choice.value,name);$('pollForm').reset();
 }catch(e){pollStatus.textContent='Vote could not be confirmed: '+e.message;}
 finally{button.disabled=false;}
});
refreshPoll();if(pollApi)setInterval(refreshPoll,30000);
const eventUrl=()=>window.location.href.split('#')[0];$('share').addEventListener('click',async()=>{const data={title:'Janak & Rajni Baby Shower',text:'🌸 You are invited! Sunday, 25 October 2026 at 11:30 AM.',url:eventUrl()};if(navigator.share){try{await navigator.share(data);return;}catch(e){if(e.name==='AbortError')return;}}if(navigator.clipboard&&window.isSecureContext){try{await navigator.clipboard.writeText(`${data.text}\n${data.url}`);$('shareStatus').textContent='Invitation link copied!';return;}catch(e){}}whatsappMessage(`${data.text}\n${data.url}`);});
const start='20261025T113000',end='20261025T143000';const calendarUrl='https://calendar.google.com/calendar/render?action=TEMPLATE&text='+encodeURIComponent('Janak & Rajni Baby Shower')+'&dates='+start+'/'+end+'&ctz=Asia%2FKolkata&details='+encodeURIComponent('Join us for a blooming beautiful baby shower!')+'&location='+encodeURIComponent('B140, Harikrishna Township, Ajwa Road, Vadodara');$('calendar').href=calendarUrl;$('calendar').target='_blank';$('calendar').rel='noopener';

// One-tap envelope opening: user gesture permits audible music on most browsers.
(function(){
 const gate=document.getElementById('invitationGate');
 const button=document.getElementById('openEnvelope');
 if(!gate||!button)return;
 document.body.classList.add('gate-locked');
 button.addEventListener('click',function(){
   if(gate.classList.contains('opening'))return;
   gate.classList.add('opening');
   const audio=document.getElementById('backgroundMusic');
   if(audio){audio.volume=.55;audio.play().catch(function(){/* Browser or missing file */});}
   window.setTimeout(function(){gate.classList.add('gate-done');document.body.classList.remove('gate-locked');button.disabled=true;},1400);
 });
})();
