const GAMES=[
 ['twentyfour','🔢','24 Game','Arithmetic','easy'],['pattern','🧩','Pattern Duel','Sequences','easy'],['guess','🔮','Number Hunt','Binary search','easy'],['operator','⛓️','Operator Network','Arithmetic','easy'],['grinder','⚙️','Target Grinder','Reverse arithmetic','easy'],['monty','🚪','Monty Hall','Probability','easy'],
 ['bulls','🐂','Bulls & Cows','Logic','medium'],['mastermind','🕵️','Mastermind','Deduction','medium'],['nim','🥢','Nim','Game theory','medium'],['wythoff','♜','Wythoff’s Game','Number theory','medium'],
 ['symbiotic','🧬','Symbiotic Feedback','Adaptive game theory','hard'],['parity','⚖️','Parity-Shift Wythoff','Positional strategy','hard'],['inertia','⚡','Inertia Engine','Dynamic strategy','hard'],['decay','🧬','Fibonacci Decay','Move locking','hard'],['dots','🔵','Dots & Boxes','Game theory','hard'],['lights','💡','Lights Out','Linear algebra','hard'],
];
const DIFFICULTY={easy:{label:'EASY',points:10},medium:{label:'MEDIUM',points:15},hard:{label:'HARD',points:20}};
function gameMeta(){return GAMES.find(g=>g[0]===current)||GAMES[0]}
function difficultyInfo(){return DIFFICULTY[gameMeta()[4]]}
function difficultyPoints(){return difficultyInfo().points}
let current='nim', score=0, state={};

const menu=document.getElementById('menu'), panel=document.getElementById('panel');
GAMES.forEach(([id,ic,name,type,diff])=>{
 const b=document.createElement('button'); b.className='game-btn '+diff; b.dataset.id=id;
 b.innerHTML=`<span class="game-icon">${ic}</span><span class="game-copy"><span class="game-title"><span class="game-name">${name}</span><span class="diff-badge ${diff}">${DIFFICULTY[diff].label}</span></span><span class="game-type">${type} • up to ${DIFFICULTY[diff].points} pts</span></span>`;
 b.onclick=()=>{current=id;score=0;start();}; menu.appendChild(b);
});
function updateMenu(){document.querySelectorAll('.game-btn').forEach(b=>b.classList.toggle('active',b.dataset.id===current))}
function header(title,desc,body){
 score=0;
 const d=difficultyInfo();
 panel.innerHTML=`<div class="panel-head"><div><h2>${title} <span class="diff-badge ${gameMeta()[4]}">${d.label}</span></h2><p class="desc">${desc}</p></div><div class="scorebox ${gameMeta()[4]}">🏆 <span id="score">0</span><span class="score-note">${d.points} max</span></div></div><div class="game-area">${body}</div>`;
}
function setScore(v){score=v;const s=document.getElementById('score');if(s)s.textContent=score}
function addScore(v){setScore(score+v)}
function notice(text,cls=''){const n=document.getElementById('msg');if(n){n.className='notice '+cls;n.innerHTML=text}}
function btns(arr){return `<div class="actions">${arr.join('')}</div>`}
function B(text,fn,cls=''){return `<button type="button" class="btn ${cls}" onclick="${fn}()">${text}</button>`}
function math(title,subtitle,steps,tip){
 document.getElementById('mathContent').innerHTML=`<h2>🧠 ${title}</h2><p class="muted">${subtitle}</p>${steps.map((s,i)=>`<div class="math-step"><div class="step-num">${i+1}</div><div>${s}</div></div>`).join('')}<div class="notice good"><b>Takeaway:</b> ${tip}</div>`;
 document.getElementById('mathOverlay').style.display='flex';
}
function closeMath(){document.getElementById('mathOverlay').style.display='none'}
function toast(t){const x=document.getElementById('toast');x.textContent=t;x.style.display='block';clearTimeout(window._toast);window._toast=setTimeout(()=>x.style.display='none',2200)}
function saveWin(label,multiplier=1){
 // One round has one score. Difficulty only nudges the maximum upward:
 // Easy 10, Medium 15, Hard 20. There is no large base-point bonus.
 const points=Math.max(1,Math.min(difficultyPoints(),Math.round(difficultyPoints()*multiplier)));
 setScore(points);
 // Gameplay must never break because browser storage or a prompt is unavailable.
 let name='Player';
 try{
   const entered=window.prompt(`🏆 ${label}!\n+${points} points\nEnter your name for the Machine Breakers board:`);
   if(entered!==null && entered.trim()) name=entered.trim().slice(0,22);
 }catch(e){ /* prompts may be blocked in some browser contexts */ }
 try{
   let a=JSON.parse(localStorage.getItem('aptusMachineBoard')||'[]');
   a.push({name,score,game:GAMES.find(g=>g[0]===current)[2],difficulty:difficultyInfo().label,time:Date.now()});
   a.sort((a,b)=>b.score-a.score);a=a.slice(0,10);
   localStorage.setItem('aptusMachineBoard',JSON.stringify(a));
 }catch(e){
   // File:// and privacy-restricted browsers can disable localStorage.
 }
 renderBoard();
}
function renderBoard(){
 const el=document.getElementById('board');
 let a=[];
 try{a=JSON.parse(localStorage.getItem('aptusMachineBoard')||'[]')}catch(e){a=[]}
 el.innerHTML=a.length?a.map((x,i)=>`<div class="leader-row"><span><span class="rank">${i+1}.</span> ${esc(x.name)} <span class="pill">${esc(x.game)}</span> <span class="difficulty-badge ${String(x.difficulty||'').toLowerCase()}">${esc(x.difficulty||'')}</span></span><b>${x.score}</b></div>`).join(''):'<div class="empty">No Machine Breakers yet. Be the first.</div>';
}
function clearBoard(){try{localStorage.removeItem('aptusMachineBoard')}catch(e){}renderBoard()}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}

/* NIM */
function startNim(){
 state={n:21,over:false};
 header('🥢 Nim','Take 1, 2 or 3 sticks. Whoever takes the last stick wins.',
 `<div class="sticks" id="stickbox"></div><div class="muted" style="margin-top:10px">You move first. The machine plays optimally.</div>
 <div class="choice-row" style="margin-top:13px">${[1,2,3].map(n=>`<button class="choice" onclick="nim(${n})">${n} stick${n>1?'s':''}</button>`).join('')}</div>
 ${btns([B('🧠 Show the math','nimMath','secondary'),B('↻ New game','startNim','secondary')])}<div id="msg" class="notice">Your turn.</div>`);
 drawNim();
}
function drawNim(){document.getElementById('stickbox').innerHTML=Array.from({length:state.n},()=>'<i class="stick"></i>').join('')||'<b>No sticks left.</b>'}
function nim(k){
 if(state.over||k>state.n)return;state.n-=k;drawNim();
 if(state.n===0){state.over=true;notice('🏆 <b>YOU WIN.</b> You found a way through the machine.','good');saveWin('You beat the machine at Nim',1);return}
 notice('🤖 Machine is thinking…');
 setTimeout(()=>{let take=state.n%4||Math.min(1,state.n);state.n-=take;drawNim();
 if(state.n===0){state.over=true;notice('🤖 <b>MACHINE WINS.</b> Try to discover why it always wants a multiple of 4.','bad')}
 else notice(`Machine removed <b>${take}</b>. Your turn.`)},350);
}
function nimMath(){math('Why Nim works','The machine is not guessing. It is preserving a losing position for the player.',[
'With moves of 1, 2 or 3, the key positions are <b>4, 8, 12, 16, 20…</b> — multiples of 4.',
'After your move, the machine removes enough sticks to make the total removed in the round equal to 4. If you take 1, it takes 3; if you take 2, it takes 2; if you take 3, it takes 1.',
'<div class="formula">21 → your move → machine leaves 20, 16, 12, 8, 4 → machine takes the last stick</div>',
'So if you move first from 21, the machine can force the win. Your challenge is to notice the invariant before it does.'
],'In take-away games, look for a repeating “safe” state rather than calculating every move.')}

/* 24 */
const puzzles24=[[3,3,8,8],[1,5,5,5],[4,7,8,8],[2,3,4,6],[3,4,6,7],[1,3,4,6],[2,5,7,8]];
function solve24(nums){
 function rec(vals,exps){
  if(vals.length===1)return Math.abs(vals[0]-24)<1e-9?exps[0]:null;
  for(let i=0;i<vals.length;i++)for(let j=i+1;j<vals.length;j++){
   const rest=vals.filter((_,k)=>k!==i&&k!==j), er=exps.filter((_,k)=>k!==i&&k!==j),a=vals[i],b=vals[j],ea=exps[i],eb=exps[j];
   const ops=[[a+b,`(${ea}+${eb})`],[a*b,`(${ea}×${eb})`],[a-b,`(${ea}−${eb})`],[b-a,`(${eb}−${ea})`]];
   if(Math.abs(b)>1e-12)ops.push([a/b,`(${ea}÷${eb})`]);if(Math.abs(a)>1e-12)ops.push([b/a,`(${eb}÷${ea})`]);
   for(const [v,e] of ops){const r=rec([...rest,v],[...er,e]);if(r)return r}
  }return null
 }
 return rec(nums.map(Number),nums.map(String))
}
function start24(){
 if(state.tick)clearInterval(state.tick);
 state={nums:puzzles24[Math.floor(Math.random()*puzzles24.length)],over:false,t0:Date.now()};
 header('🔢 24 Game','Use +, −, ×, ÷ and every number exactly once to make 24.',
 `<div class="cards">${state.nums.map(n=>`<div class="card-num">${n}</div>`).join('')}</div>
 <div class="center muted">Example: (8 − 3) × 6 − 6 — but your expression must use the four given numbers exactly once.</div>
 <div class="big" id="timer24">60</div>
 <div style="margin-top:16px"><input id="expr24" type="text" placeholder="Type your expression, e.g. (8-3)*6-6"></div>
 ${btns([B('CHECK','check24'),B('💡 Show a solution','show24','secondary'),B('↻ New puzzle','start24','secondary')])}<div id="msg" class="notice">You have 60 seconds. Go!</div>`);
 state.tick=setInterval(()=>{if(state.over)return;const left=Math.max(0,60-Math.floor((Date.now()-state.t0)/1000));const e=document.getElementById('timer24');if(e)e.textContent=left;if(left===0){state.over=true;clearInterval(state.tick);notice('⏰ <b>TIME!</b> The machine wins this round.','bad')}},250);
}
function safeEvaluate(expr){
 try{
   const src=expr.replaceAll('×','*').replaceAll('÷','/').replaceAll('−','-').replace(/\s+/g,'');
   let i=0;
   function number(){
     const start=i; while(i<src.length && /[0-9.]/.test(src[i])) i++;
     if(start===i)return null;
     const n=Number(src.slice(start,i)); return Number.isFinite(n)?n:null;
   }
   function factor(){
     if(src[i]==='+'){i++;return factor()}
     if(src[i]==='-'){i++;const v=factor();return v===null?null:-v}
     if(src[i]==='('){i++;const v=expression();if(src[i]!==')')return null;i++;return v}
     return number()
   }
   function term(){
     let v=factor(); if(v===null)return null;
     while(src[i]==='*'||src[i]==='/'){
       const op=src[i++],r=factor(); if(r===null || (op==='/'&&Math.abs(r)<1e-12))return null;
       v=op==='*'?v*r:v/r;
     } return v;
   }
   function expression(){
     let v=term(); if(v===null)return null;
     while(src[i]==='+'||src[i]==='-'){
       const op=src[i++],r=term(); if(r===null)return null;
       v=op==='+'?v+r:v-r;
     } return v;
   }
   const value=expression();
   return i===src.length?value:null;
 }catch{return null}
}
function check24(){
 if(state.over)return;const e=document.getElementById('expr24').value.trim();if(!e)return;
 if(!/^[0-9+\-*/().\s×÷−]+$/.test(e)){notice('Use only numbers, parentheses and + − × ÷.','warn');return}
 const nums=(e.match(/\d+/g)||[]).map(Number).sort((a,b)=>a-b),req=[...state.nums].sort((a,b)=>a-b);
 if(JSON.stringify(nums)!==JSON.stringify(req)){notice('You must use each given number exactly once.','warn');return}
 const v=safeEvaluate(e);
 if(v===null || !Number.isFinite(v)){notice('That expression could not be evaluated.','bad');return}
 if(Math.abs(v-24)<1e-9){state.over=true;clearInterval(state.tick);notice('🏆 <b>24!</b> You solved it before the machine.','good');saveWin('You solved the 24 Game',1)}else notice(`That equals <b>${v}</b>, not 24.`,'bad')
}
function show24(){const s=solve24(state.nums);math('How the 24 Game is solved','A computer can search combinations systematically, but humans can often spot a useful factorization.',[`One valid solution is:<div class="formula">${s||'No solution for this puzzle — generate a new one.'}</div>`,'The search tries every pair of numbers and every legal operation, recursively reducing four numbers to one.','Division by zero is rejected, and every original number must be used exactly once.'],'Work backwards from 24: look for factors such as 3×8, 4×6, or a way to create them.')}

/* NUMBER HUNT */
function startGuess(){state={target:Math.floor(Math.random()*100)+1,g:0,over:false,lo:1,hi:100};
 header('🔮 Number Hunt','Find the machine’s number from 1–100 in at most 7 guesses.',
 `<div class="big">1 — 100</div><div class="progress"><div class="bar" id="gb"></div></div>
 <div style="margin-top:16px"><input id="guessInput" type="number" min="1" max="100" placeholder="Your guess"></div>
 ${btns([B('GUESS','guessMove'),B('🧠 Show the math','guessMath','secondary'),B('↻ New number','startGuess','secondary')])}<div id="msg" class="notice">7 guesses. Choose wisely.</div>`);
}
function guessMove(){if(state.over)return;const x=Number(document.getElementById('guessInput').value);if(x<1||x>100)return;
 state.g++;document.getElementById('gb').style.width=(state.g/7*100)+'%';
 if(x===state.target){state.over=true;notice(`🏆 <b>Found it!</b> ${state.target} in ${state.g} guess${state.g>1?'es':''}.`,'good');saveWin('You beat Number Hunt',Math.max(.6,1.8-(state.g-1)*.2));return}
 if(x<state.target){state.lo=Math.max(state.lo,x+1);notice(`Too low. New range: <b>${state.lo}–${state.hi}</b>. ${7-state.g} left.`)}
 else{state.hi=Math.min(state.hi,x-1);notice(`Too high. New range: <b>${state.lo}–${state.hi}</b>. ${7-state.g} left.`)}
 if(state.g>=7){state.over=true;notice(`🤖 <b>MACHINE WINS.</b> The number was ${state.target}.`,'bad')}
 document.getElementById('guessInput').value=''
}
function guessMath(){math('Binary search','Seven guesses are enough because each good guess roughly halves the remaining possibilities.',[
'<div class="formula">100 → 50 → 25 → 13 → 7 → 4 → 2 → 1</div>',
'If the number is not your guess, the “too high/too low” clue eliminates about half of the remaining candidates.',
'After 6 halvings, 100 possibilities are reduced to roughly 1–2 candidates; a 7th guess finishes the job.',
'Random guessing does not have this guarantee. The winning idea is to choose the midpoint of the current range.'
],'When a problem gives you an ordered search space and a yes/no clue, think binary search.')}

/* PATTERN DUEL */
const PATTERN_FAMILIES=[
 {name:'Arithmetic Progression',difficulty:1,gen(){const a=rint(2,25),d=rint(2,9);return seq(9,n=>a+n*d,{rule:`Add ${d} each time`,explain:`Each term increases by a constant difference of +${d}.`})}},
 {name:'Geometric Progression',difficulty:1,gen(){const a=rint(2,6),r=rint(2,4);return seq(9,n=>a*r**n,{rule:`Multiply by ${r} each time`,explain:`Each term is multiplied by ${r}.`})}},
 {name:'Increasing Differences',difficulty:1,gen(){const a=rint(1,12),d=rint(1,5),inc=rint(1,4);return seq(9,n=>a+d*n+inc*n*(n-1)/2,{rule:`Differences increase by ${inc}`,explain:`The first differences are ${d}, ${d+inc}, ${d+2*inc}, ...`})}},
 {name:'Decreasing Differences',difficulty:2,gen(){const a=rint(35,70),d=rint(8,13),dec=rint(1,3);return seq(9,n=>a-d*n+dec*n*(n-1)/2,{rule:'Subtract a decreasing amount',explain:`The differences shrink by ${dec} each step.`})}},
 {name:'Squares',difficulty:1,gen(){const k=rint(1,8);return seq(9,n=>(n+k)**2,{rule:`Consecutive squares starting at ${k+1}²`,explain:`The terms are ${k+1}², ${k+2}², ${k+3}², ...`})}},
 {name:'Cubes',difficulty:2,gen(){const k=rint(1,5);return seq(9,n=>(n+k)**3,{rule:'Consecutive cubes',explain:'The terms are consecutive cubes.'})}},
 {name:'Triangular Numbers',difficulty:1,gen(){const k=rint(0,4);return seq(9,n=>(n+k)*(n+k+1)/2,{rule:'Triangular-number progression',explain:'Each term is the sum of consecutive integers, shifted by the starting index.'})}},
 {name:'Fibonacci-Type',difficulty:2,gen(){const a=rint(1,7),b=rint(1,9),values=[a,b];for(let i=2;i<9;i++)values.push(values[i-1]+values[i-2]);return arr(values,{rule:'Add the previous two terms',explain:`Starting with ${a}, ${b}, each new term is the sum of the previous two.`})}},
 {name:'Alternating Operations',difficulty:2,gen(){const a=rint(2,12),m=rint(2,4),d=rint(1,6);let value=a,values=[value];for(let i=0;i<6;i++){value=i%2===0?value*m:value+d;values.push(value)}return arr(values,{rule:`Repeat ×${m}, +${d}`,explain:`Operations alternate: multiply by ${m}, then add ${d}.`})}},
 {name:'Interleaved Sequences',difficulty:2,gen(){const a=rint(1,9),da=rint(1,4),b=rint(10,25),db=rint(2,6),values=[];for(let i=0;i<9;i++)values.push(i%2===0?a+(i/2)*da:b+Math.floor(i/2)*db);return arr(values,{rule:'Two interleaved arithmetic sequences',explain:'Separate odd and even positions; each forms its own arithmetic progression.'})}},
 {name:'Multiply and Add',difficulty:2,gen(){const a=rint(2,8),m=rint(2,3),d=rint(1,5);return seq(9,n=>{let value=a;for(let i=0;i<n;i++)value=value*m+d;return value},{rule:`Repeat ×${m} + ${d}`,explain:`Every step multiplies by ${m} and then adds ${d}.`})}},
 {name:'Powers',difficulty:2,gen(){const base=rint(2,3),k=rint(0,2);return seq(9,n=>base**(n+k),{rule:`Powers of ${base}`,explain:'The exponent increases by 1 each term.'})}},
 {name:'Factorials',difficulty:2,gen(){const k=rint(1,3);return arr(Array.from({length:9},(_,i)=>fact(i+k)),{rule:'Consecutive factorials',explain:'Each term is a factorial of consecutive integers.'})}},
 {name:'Primes',difficulty:2,gen(){const primes=firstPrimes(80),start=rint(0,18);return arr(primes.slice(start,start+9),{rule:'Consecutive prime numbers',explain:'Each term is the next prime after the previous term.'})}},
 {name:'Second Differences',difficulty:3,gen(){const a=rint(1,10),d=rint(2,6),dd=rint(1,3);return seq(9,n=>a+d*n+dd*n*(n-1)/2,{rule:'Constant second difference',explain:`The first differences rise by ${dd}, so the second difference is constant.`})}},
 {name:'Third Differences',difficulty:4,gen(){const a=rint(1,5),d=rint(2,4),dd=rint(1,3),ddd=rint(1,2);return seq(9,n=>a+d*n+dd*n*(n-1)/2+ddd*n*(n-1)*(n-2)/6,{rule:'Constant third difference',explain:`The third differences are constant at ${ddd}.`})}},
 {name:'Modulo Cycle',difficulty:3,gen(){const m=rint(7,12),a=rint(0,m-1),step=rint(2,5);return seq(9,n=>(a+n*step)%m,{rule:`Cycle modulo ${m}`,explain:`Values advance by ${step} and wrap around after ${m}.`})}},
 {name:'Square Plus Offset',difficulty:3,gen(){const k=rint(1,6),d=rint(1,4);return seq(9,n=>(n+k)**2+d*n,{rule:`Square term + ${d}n`,explain:'Consecutive squares receive a steadily increasing linear offset.'})}}
];
function rint(min,max){return Math.floor(Math.random()*(max-min+1))+min}
function seq(length,fn,meta){return arr(Array.from({length},(_,index)=>fn(index)),meta)}
function arr(values,meta){return {values,rule:meta.rule,explain:meta.explain}}
function fact(value){let result=1;for(let i=2;i<=value;i++)result*=i;return result}
function firstPrimes(count){const primes=[];for(let value=2;primes.length<count;value++){let prime=true;for(let divisor=2;divisor*divisor<=value;divisor++)if(value%divisor===0){prime=false;break}if(prime)primes.push(value)}return primes}
function patternDifficultyLabel(level){return level===1?'ROOKIE':level===2?'THINKER':level===3?'STRATEGIST':'MACHINE MODE'}
function patternMachineTime(level){return ({1:rint(5500,7500),2:rint(4800,6800),3:rint(4000,6000),4:rint(3000,5000)})[level]}
function generatePattern(){const family=PATTERN_FAMILIES[rint(0,PATTERN_FAMILIES.length-1)];let pattern;do{pattern=family.gen()}while(pattern.values.slice(-2).some(value=>!Number.isSafeInteger(value)||Math.abs(value)>999999)||new Set(pattern.values).size<5);pattern.difficulty=family.difficulty;pattern.level=patternDifficultyLabel(family.difficulty);pattern.familyName=family.name;return pattern}
function startPattern(){
 if(state.tick)clearInterval(state.tick);if(state.machineTimer)clearTimeout(state.machineTimer);
 const pattern=generatePattern();state={p:pattern,over:false,submitted:false,t0:Date.now(),limit:pattern.difficulty===4?10:pattern.difficulty===3?12:14,machineTime:patternMachineTime(pattern.difficulty),machineLocked:false};state.answer=pattern.values.slice(-2);
 const shown=pattern.values.slice(0,7);
 header('🧩 Pattern Duel','Predict the next TWO terms. Beat the machine before it locks in its answer.',`<div class="pattern-battle-head"><div class="pattern-level ${pattern.difficulty}">${pattern.level} • ${pattern.familyName}</div><div class="pattern-machine">🤖 MACHINE <span id="patternMachineState">ANALYZING</span></div></div><div class="pattern-sequence">${shown.map((value,index)=>`<span>${value}</span>${index<shown.length-1?'<i>→</i>':''}`).join('')}<i>→</i><strong>?</strong><i>→</i><strong>?</strong></div><div class="pattern-inputs"><input id="pat1" type="number" inputmode="numeric" placeholder="Next term"><span>→</span><input id="pat2" type="number" inputmode="numeric" placeholder="Next term"></div><div class="pattern-timer"><span>TIME</span><b id="patternTimer">${state.limit.toFixed(1)}</b><div class="progress"><div class="bar" id="patternBar"></div></div></div><div class="pattern-duel-note">The machine has the same sequence. <b>Accuracy first. Speed decides the duel.</b></div>${btns([B('⚔️ BEAT THE MACHINE','checkPattern'),B('🧠 Show the math','patternMath','secondary'),B('↻ New duel','startPattern','secondary')])}<div id="msg" class="notice">Two answers. One chance. Find the rule.</div>`);
 document.getElementById('pat1').focus();state.tick=setInterval(updatePatternTimer,100);state.machineTimer=setTimeout(()=>patternMachineLock(),state.machineTime);
}
function updatePatternTimer(){if(state.over)return;const elapsed=(Date.now()-state.t0)/1000,left=Math.max(0,state.limit-elapsed),timer=document.getElementById('patternTimer'),bar=document.getElementById('patternBar');if(timer)timer.textContent=left.toFixed(1);if(bar)bar.style.width=`${Math.min(100,elapsed/state.limit*100)}%`;if(left<=0)patternMachineLock(true)}
function patternMachineLock(timeout=false){if(state.over)return;state.machineLocked=true;const machineState=document.getElementById('patternMachineState');if(machineState)machineState.textContent='LOCKED IN';if(timeout){state.over=true;clearInterval(state.tick);notice('🤖 <b>MACHINE WINS.</b> It locked in before you.','bad')}}
function checkPattern(){if(state.over||state.submitted)return;const first=Number(document.getElementById('pat1').value),second=Number(document.getElementById('pat2').value);if(!Number.isFinite(first)||!Number.isFinite(second)){notice('Enter both predicted terms.','warn');return}state.submitted=true;clearInterval(state.tick);if(state.machineTimer)clearTimeout(state.machineTimer);const elapsed=(Date.now()-state.t0)/1000,correct=first===state.answer[0]&&second===state.answer[1],machineBeaten=elapsed*1000<state.machineTime;if(correct&&machineBeaten){state.over=true;notice(`🏆 <b>MACHINE OUTSMARTED.</b> ${first}, ${second} — solved in <b>${elapsed.toFixed(2)}s</b>; machine lock: <b>${(state.machineTime/1000).toFixed(2)}s</b>.`,'good');saveWin('You beat the machine at Pattern Duel',state.p.difficulty===4?1.5:state.p.difficulty===3?1.25:1)}else if(correct){state.over=true;notice(`⚔️ <b>YOU GOT IT — BUT THE MACHINE WAS FASTER.</b> Your ${elapsed.toFixed(2)}s vs machine ${(state.machineTime/1000).toFixed(2)}s.`,'warn')}else{state.over=true;notice(`🤖 <b>MACHINE WINS.</b> The correct next terms were <b>${state.answer[0]}, ${state.answer[1]}</b>.`,'bad')}}
function patternMath(){const pattern=state.p;if(!pattern)return;const shown=pattern.values.slice(0,7);math(`Pattern Duel — ${pattern.familyName}`,'The machine knows the generating rule. Recognize the structure quickly enough to beat its lock time.',[`<div class="formula">${shown.join(' → ')} → <b>${state.answer.join(' → ')}</b></div>`,`<b>Intended rule:</b> ${pattern.rule}`,`<b>Why it works:</b> ${pattern.explain}`,'The generator creates the full sequence first, then hides exactly the final two terms.'],'Check differences, ratios, alternating positions, familiar sequences, and repeating operations before committing to both answers.')}

/* SYMBIOTIC FEEDBACK */
function startSymbiotic(){state={a:8,b:12,maxA:3,maxB:3,turn:'human',over:false,aiTimer:null,lastMove:null};header('🧬 Symbiotic Feedback','Two linked piles. Taking k from one pile changes the opponent’s maximum on the other pile to 4 − k.',`<div class="strategy-rules"><b>Linked rule:</b> Take 1–3 tokens from either pile. If you take <b>k</b> from A, the next player may take at most <b>4 − k</b> from B, and vice versa.<div class="formula">Opposite max = 4 − previous take</div><span>Take the final token to win.</span></div><div class="strategy-dashboard"><div class="strategy-stat"><span>Last move</span><b id="symLast">None</b></div><div class="strategy-stat warning"><span>Opposite restriction</span><b id="symRestriction">None</b></div></div><div class="strategy-piles"><div class="strategy-pile a"><div class="strategy-pile-title">Pile A</div><div class="strategy-count" id="symA">8</div><div class="strategy-limit" id="symLimitA">Allowed: 1–3</div><div class="strategy-actions" id="symActionsA"></div></div><div class="strategy-pile b"><div class="strategy-pile-title">Pile B</div><div class="strategy-count" id="symB">12</div><div class="strategy-limit" id="symLimitB">Allowed: 1–3</div><div class="strategy-actions" id="symActionsB"></div></div></div>${btns([B('🧠 Show the math','symbioticMath','secondary'),B('↻ New game','startSymbiotic','secondary')])}<div id="msg" class="notice">Your turn. Choose a pile and remove 1–3 tokens.</div>`);renderSymbiotic()}
function symbioticMoves(){const moves=[];for(let k=1;k<=Math.min(state.maxA,state.a);k++)moves.push({pile:'a',amount:k});for(let k=1;k<=Math.min(state.maxB,state.b);k++)moves.push({pile:'b',amount:k});return moves}
function applySymbioticMove(pile,amount,who){if(pile==='a'){state.a-=amount;state.maxB=4-amount;state.maxA=3}else{state.b-=amount;state.maxA=4-amount;state.maxB=3}state.lastMove=`${who==='human'?'You':'Machine'}: ${pile.toUpperCase()} − ${amount}`;if(state.a===0&&state.b===0){state.over=true;if(state.aiTimer)clearTimeout(state.aiTimer);renderSymbiotic();if(who==='human'){notice('🏆 <b>YOU WIN.</b> You captured the final token!','good');saveWin('You beat Symbiotic Feedback',1)}else notice('🤖 <b>MACHINE WINS.</b> It captured the final token.','bad')}}
function symbioticMove(pile,amount){if(state.over||state.turn!=='human')return;const max=pile==='a'?state.maxA:state.maxB,count=pile==='a'?state.a:state.b;if(amount<1||amount>max||amount>count)return;applySymbioticMove(pile,amount,'human');if(!state.over){state.turn='ai';renderSymbiotic();state.aiTimer=setTimeout(symbioticAI,500)}}
function symbioticScore(move){const a=state.a-(move.pile==='a'?move.amount:0),b=state.b-(move.pile==='b'?move.amount:0);if(a===0&&b===0)return 100000;const maxA=move.pile==='b'?4-move.amount:3,maxB=move.pile==='a'?4-move.amount:3;return -(Math.min(maxA,a)+Math.min(maxB,b))*100+Math.abs(a-b)+(maxA+maxB)*8}
function symbioticAI(){if(state.over||state.turn!=='ai')return;const moves=symbioticMoves();if(!moves.length){state.over=true;notice('🤖 <b>MACHINE WINS.</b> The feedback loop left no legal response.','bad');return}let best=moves[0],bestScore=-Infinity;for(const move of moves){const value=symbioticScore(move);if(value>bestScore){bestScore=value;best=move}}applySymbioticMove(best.pile,best.amount,'ai');if(state.over)return;state.turn='human';renderSymbiotic();notice(`🤖 Machine removed <b>${best.amount}</b> from pile ${best.pile.toUpperCase()}. Your turn.`)}
function renderSymbiotic(){const a=document.getElementById('symA'),b=document.getElementById('symB');if(!a||!b)return;a.textContent=state.a;b.textContent=state.b;document.getElementById('symLimitA').textContent=`Allowed: 1–${Math.min(state.maxA,state.a)}`;document.getElementById('symLimitB').textContent=`Allowed: 1–${Math.min(state.maxB,state.b)}`;document.getElementById('symLast').textContent=state.lastMove||'None';const match=state.lastMove&&state.lastMove.match(/([AB]) − (\d+)/);document.getElementById('symRestriction').textContent=match?`${match[1]==='A'?'B':'A'} max ${4-Number(match[2])}`:'None';const wa=document.getElementById('symActionsA'),wb=document.getElementById('symActionsB');wa.innerHTML='';wb.innerHTML='';for(let k=1;k<=3;k++){const ba=document.createElement('button');ba.className='strategy-action';ba.textContent=`Remove ${k}`;ba.disabled=state.over||state.turn!=='human'||k>state.maxA||k>state.a;ba.onclick=()=>symbioticMove('a',k);wa.appendChild(ba);const bb=document.createElement('button');bb.className='strategy-action';bb.textContent=`Remove ${k}`;bb.disabled=state.over||state.turn!=='human'||k>state.maxB||k>state.b;bb.onclick=()=>symbioticMove('b',k);wb.appendChild(bb)}if(!state.over&&state.turn==='ai')notice('🤖 Machine is reading the feedback loop…')}
function symbioticMath(){math('Symbiotic Feedback','The piles are linked: your move changes the legal move range on the opposite pile.',[`<div class="formula">Opposite maximum = 4 − amount taken</div>`,'If you remove 1 from A, the next player can remove at most 3 from B. If you remove 2, B is capped at 2. If you remove 3, B is capped at 1.','Your own pile resets to the normal 1–3 range after your move.','The position includes pile sizes and the feedback state, so classic Nim XOR is not enough.'],'Watch the restriction you create for the other pile. A smaller move can still be stronger if it gives the opponent a worse legal set.')}

/* PARITY-SHIFT WYTHOFF */
function startParity(){state={a:8,b:13,lastStyle:null,lastMove:null,turn:'human',over:false,aiTimer:null};header('⚖️ Parity-Shift Wythoff','Wythoff-style moves with a forced alternation: Single-Pile and Both-Piles must alternate.',`<div class="strategy-rules"><b>Wythoff core:</b> Remove any positive amount from A, B, or the same amount from both.<br><b>Parity shift:</b> A Single-Pile move must be followed by a Both-Piles move; a Both-Piles move must be followed by a Single-Pile move.<br><span>Take the final token to win.</span></div><div class="strategy-dashboard"><div class="strategy-stat"><span>Last action</span><b id="parityLast">None</b></div><div class="strategy-stat warning"><span>Required next style</span><b id="parityRequired">Either</b></div></div><div class="strategy-piles"><div class="strategy-pile a"><div class="strategy-pile-title">Pile A</div><div class="strategy-count" id="parityA">8</div></div><div class="strategy-pile b"><div class="strategy-pile-title">Pile B</div><div class="strategy-count" id="parityB">13</div></div></div><div class="strategy-controls-title">Available move vectors</div><div class="strategy-vector-grid" id="parityVectors"></div>${btns([B('🧠 Show the math','parityMath','secondary'),B('↻ New game','startParity','secondary')])}<div id="msg" class="notice">Your turn. Choose a legal vector.</div>`);renderParity()}
function parityRequiredStyle(){return state.lastStyle==='SINGLE'?'BOTH':state.lastStyle==='BOTH'?'SINGLE':'ANY'}
function parityIsLegal(type,amount){const required=parityRequiredStyle();if(required!=='ANY'&&type!==required)return false;if(amount<1)return false;if(type==='A')return amount<=state.a;if(type==='B')return amount<=state.b;if(type==='BOTH')return amount<=Math.min(state.a,state.b);return false}
function parityMoves(){const moves=[],required=parityRequiredStyle();if(required==='SINGLE'||required==='ANY'){for(let k=1;k<=state.a;k++)moves.push({type:'A',amount:k});for(let k=1;k<=state.b;k++)moves.push({type:'B',amount:k})}if(required==='BOTH'||required==='ANY')for(let k=1;k<=Math.min(state.a,state.b);k++)moves.push({type:'BOTH',amount:k});return moves}
function applyParityMove(type,amount,who){if(type==='A')state.a-=amount;else if(type==='B')state.b-=amount;else{state.a-=amount;state.b-=amount}state.lastStyle=type==='BOTH'?'BOTH':'SINGLE';state.lastMove=`${who==='human'?'You':'Machine'}: ${type==='BOTH'?'Both':type} − ${amount}`;if(state.a===0&&state.b===0){state.over=true;if(state.aiTimer)clearTimeout(state.aiTimer);renderParity();if(who==='human'){notice('🏆 <b>MATRIX CLEARED.</b> You took the final objects!','good');saveWin('You beat Parity-Shift Wythoff',1)}else notice('🤖 <b>MACHINE WINS.</b> It cleared the final state.','bad')}}
function parityMove(type,amount){if(state.over||state.turn!=='human'||!parityIsLegal(type,amount))return;applyParityMove(type,amount,'human');if(!state.over){state.turn='ai';renderParity();state.aiTimer=setTimeout(parityAI,550)}}
function parityHeuristic(move){const a=state.a-(move.type==='A'||move.type==='BOTH'?move.amount:0),b=state.b-(move.type==='B'||move.type==='BOTH'?move.amount:0);if(a===0&&b===0)return 100000;const nextRequired=move.type==='BOTH'?'SINGLE':'BOTH',opponentOptions=nextRequired==='SINGLE'?a+b:Math.min(a,b);return -opponentOptions*100-Math.abs(a-b)}
function parityAI(){if(state.over||state.turn!=='ai')return;const moves=parityMoves();if(!moves.length){state.over=true;notice('🏆 <b>YOU WIN.</b> The parity constraint left the machine with no legal move.','good');saveWin('You locked Parity-Shift Wythoff',1);return}let best=moves[0],bestScore=-Infinity;for(const move of moves){const value=parityHeuristic(move);if(value>bestScore){bestScore=value;best=move}}applyParityMove(best.type,best.amount,'ai');if(state.over)return;state.turn='human';renderParity();notice(`🤖 Machine used <b>${best.type==='BOTH'?'Both':best.type} − ${best.amount}</b>. Your turn.`)}
function renderParity(){const a=document.getElementById('parityA'),b=document.getElementById('parityB');if(!a||!b)return;a.textContent=state.a;b.textContent=state.b;document.getElementById('parityLast').textContent=state.lastStyle||'None';document.getElementById('parityRequired').textContent=parityRequiredStyle()==='ANY'?'Either':parityRequiredStyle();const wrapper=document.getElementById('parityVectors');wrapper.innerHTML='';const required=parityRequiredStyle();if(required==='SINGLE'||required==='ANY'){for(let k=1;k<=state.a;k++)addParityButton(wrapper,'A',k);for(let k=1;k<=state.b;k++)addParityButton(wrapper,'B',k)}if(required==='BOTH'||required==='ANY')for(let k=1;k<=Math.min(state.a,state.b);k++)addParityButton(wrapper,'BOTH',k);if(!state.over&&state.turn==='ai')notice('🤖 Machine is reading the parity constraint…')}
function addParityButton(wrapper,type,amount){const btn=document.createElement('button');btn.className='strategy-action vector';btn.textContent=`${type==='BOTH'?'Both':type} − ${amount}`;btn.disabled=state.over||state.turn!=='human';btn.onclick=()=>parityMove(type,amount);wrapper.appendChild(btn)}
function parityMath(){math('Parity-Shift Wythoff','This variant keeps Wythoff’s three move types but forces the move style to alternate.',['<b>Single-Pile:</b> remove any positive amount from A or B.','<b>Both-Piles:</b> remove the same positive amount from both A and B.','<b>Parity shift:</b> after a Single-Pile move, the next move must be Both-Piles; after Both-Piles, the next must be Single-Pile.','<div class="formula">Single → Both → Single → Both → …</div>','The previous move style becomes part of the state, so classic Wythoff cold positions alone are not sufficient.'],'Track both the pile coordinates and the move style the opponent is forced to use next.')}

/* MASTERMIND */
const colors=6, codeLen=4;
function randCode(){return Array.from({length:codeLen},()=>Math.floor(Math.random()*colors))}
function feedback(guess,secret){let exact=0,sg=[...secret],gg=[...guess];for(let i=0;i<codeLen;i++)if(gg[i]===sg[i]){exact++;gg[i]=-1;sg[i]=-1}
 let partial=0;for(let i=0;i<codeLen;i++){if(gg[i]<0)continue;const j=sg.indexOf(gg[i]);if(j>=0){partial++;sg[j]=-1}}
 return [exact,partial]
}
function startMastermind(){state={secret:randCode(),guess:[],tries:0,over:false};
 header('🕵️ Mastermind','Crack the machine’s 4-colour code in 8 guesses. Repeated colours are allowed.',
 `<div class="master-code" id="currentCode">${Array.from({length:4},(_,i)=>`<div class="peg" id="peg${i}"></div>`).join('')}</div>
 <div class="palette">${Array.from({length:colors},(_,i)=>`<button class="color-btn color-${i}" onclick="pickColor(${i})" aria-label="colour ${i+1}"></button>`).join('')}</div>
 <div class="center muted" style="margin-top:10px">Pick four colours, then submit. Exact = right colour/right place. Partial = right colour/wrong place.</div>
 ${btns([B('SUBMIT GUESS','submitMastermind'),B('↩ Clear','clearMM','secondary'),B('🧠 Show the math','mmMath','secondary'),B('↻ New code','startMastermind','secondary')])}
 <table class="small-table"><thead><tr><th>Guess</th><th>Exact</th><th>Partial</th></tr></thead><tbody id="mmHistory"></tbody></table><div id="msg" class="notice">The machine has chosen a secret code.</div>`);
}
function pickColor(c){if(state.over||state.guess.length>=4)return;state.guess.push(c);drawMM()}
function clearMM(){state.guess=[];drawMM()}
function drawMM(){for(let i=0;i<4;i++){const e=document.getElementById('peg'+i);e.className='peg '+(state.guess[i]!==undefined?`color-${state.guess[i]}`:'')}}
function submitMastermind(){if(state.over||state.guess.length!==4){notice('Choose four colours first.','warn');return}state.tries++;const [e,p]=feedback(state.guess,state.secret);document.getElementById('mmHistory').insertAdjacentHTML('beforeend',`<tr><td>${state.guess.map(c=>`<span class="pill color-${c}" style="color:white">●</span>`).join(' ')}</td><td>${e}</td><td>${p}</td></tr>`);
 if(e===4){state.over=true;notice(`🏆 <b>CODE CRACKED</b> in ${state.tries} guesses!`,'good');saveWin('You cracked Mastermind',1.4);return}
 if(state.tries>=8){state.over=true;notice(`🤖 <b>MACHINE WINS.</b> The code was ${state.secret.map(x=>x+1).join('–')}.`,'bad');return}
 state.guess=[];drawMM();notice(`Feedback: <b>${e}</b> exact, <b>${p}</b> partial. ${8-state.tries} guesses left.`)
}
function mmMath(){math('Mastermind = constraint solving','Every guess gives the machine a constraint. Strong play keeps eliminating impossible codes.',[
'There are <b>6⁴ = 1,296</b> possible codes when repeats are allowed.',
'“Exact” feedback fixes a colour in a position. “Partial” feedback proves a colour exists but is misplaced.',
'<div class="formula">Guess → feedback → eliminate incompatible codes → choose next guess</div>',
'That is essentially the same idea used by a constraint-satisfaction solver: maintain candidates and remove anything inconsistent with the evidence.'
],'Don\'t only ask “what could the code be?” Ask “which guesses would eliminate the most possibilities?”')}

/* MONTY */
function startMonty(){state={choice:null,opened:null,prize:Math.floor(Math.random()*3),over:false,switched:null};
 header('🚪 Monty Hall','Pick a door. The host knows where the prize is and will always open a losing door.',
 `<div class="door-grid">${[0,1,2].map(i=>`<button class="door" id="door${i}" onclick="chooseDoor(${i})">🚪<br>Door ${i+1}</button>`).join('')}</div>
 <div id="msg" class="notice">Choose a door.</div>${btns([B('↻ New round','startMonty','secondary'),B('🧠 Show the math','montyMath','secondary')])}`);
}
function chooseDoor(i){if(state.over||state.choice!==null)return;state.choice=i;const choices=[0,1,2].filter(x=>x!==i&&x!==state.prize);state.opened=choices[Math.floor(Math.random()*choices.length)];
 document.querySelectorAll('.door').forEach((d,j)=>{if(j===state.opened){d.classList.add('open');d.innerHTML='❌<br>Empty'}});notice(`You chose Door ${i+1}. Door ${state.opened+1} is empty. <b>STAY or SWITCH?</b>`);
 panel.querySelector('.actions').insertAdjacentHTML('afterbegin',B('SWITCH','montyDecision','good')+B('STAY','montyStay','secondary'));
}
function montyDecision(){if(state.choice===null||state.over)return;const other=[0,1,2].find(x=>x!==state.choice&&x!==state.opened);state.switched=other;revealMonty(other,true)}
function montyStay(){revealMonty(state.choice,false)}
function revealMonty(final,sw){state.over=true;document.querySelectorAll('.door').forEach((d,j)=>{if(j===state.prize){d.classList.add('prize');d.innerHTML='🏆<br>PRIZE'}else if(j!==state.opened){d.innerHTML='❌<br>Empty'}});
 if(final===state.prize){notice(`🏆 <b>YOU WIN!</b> You ${sw?'switched':'stayed'} and found the prize.`,'good');saveWin('You beat Monty Hall',1)}else notice(`🤖 <b>YOU LOSE.</b> The prize was Door ${state.prize+1}.`,'bad')}
function montyMath(){math('Why switching wins more often','The host’s behaviour contains information: they never open the prize door.',[
'Your first choice has a <b>1/3</b> chance of being correct.',
'That means the two doors you did not choose collectively have a <b>2/3</b> chance of hiding the prize.',
'The host is forced to open one losing door among those two. The remaining unopened door inherits the full <b>2/3</b> probability.',
'<div class="formula">STAY = 1/3 win chance &nbsp;&nbsp; SWITCH = 2/3 win chance</div>'
],'When someone reveals information conditionally, do not treat the remaining choices as automatically 50–50.')}

/* LIGHTS OUT: 5x5, brute-force solver for explanation */
function startLights(){state={grid:Array.from({length:25},()=>Math.random()<.5),moves:0,over:false};
 header('💡 Lights Out','Click a cell: it toggles itself and its orthogonal neighbours. Turn every light off.',
 `<div class="light-grid" id="lightsGrid"></div><div class="center muted">Moves: <b id="lmoves">0</b></div>
 ${btns([B('🧠 Show the math','lightsMath','secondary'),B('↻ New board','startLights','secondary')])}<div id="msg" class="notice">Turn every light off.</div>`);
 drawLights();
}
function lightClick(i){if(state.over)return;for(const [dr,dc] of [[0,0],[1,0],[-1,0],[0,1],[0,-1]]){const r=Math.floor(i/5)+dr,c=i%5+dc;if(r>=0&&r<5&&c>=0&&c<5)state.grid[r*5+c]=!state.grid[r*5+c]}state.moves++;drawLights();if(state.grid.every(x=>!x)){state.over=true;notice(`🏆 <b>GRID CLEARED</b> in ${state.moves} moves!`,'good');saveWin('You cleared Lights Out',1.4)}}
function drawLights(){document.getElementById('lightsGrid').innerHTML=state.grid.map((on,i)=>`<button class="light ${on?'on':''}" onclick="lightClick(${i})"></button>`).join('');document.getElementById('lmoves').textContent=state.moves}
function solveLights(grid){ // exhaustive row-by-row first-row patterns; returns min presses
 let best=null;
 for(let mask=0;mask<32;mask++){
  let g=grid.slice(), presses=Array.from({length:25},()=>false), count=0;
  const press=(r,c)=>{for(const [dr,dc] of [[0,0],[1,0],[-1,0],[0,1],[0,-1]]){let rr=r+dr,cc=c+dc;if(rr>=0&&rr<5&&cc>=0&&cc<5)g[rr*5+cc]=!g[rr*5+cc]}presses[r*5+c]=!presses[r*5+c];count++};
  for(let c=0;c<5;c++)if(mask&(1<<c))press(0,c);
  for(let r=1;r<5;r++)for(let c=0;c<5;c++)if(g[(r-1)*5+c])press(r,c);
  if(g.slice(20,25).every(x=>!x)&&(!best||count<best.count))best={count,presses};
 }
 return best;
}
function lightsMath(){const sol=solveLights(state.grid);math('Lights Out and linear algebra','Every switch is binary: pressed or not pressed. Toggling twice cancels itself.',[
'Think of every cell as a variable that is either 0 or 1. The final condition is “all zeros”.',
'Because toggling is addition modulo 2, the puzzle can be represented as a system of linear equations over <b>GF(2)</b>.',
'For this 5×5 board, a simple solver can try the 32 possible choices for the first row; after that, each next-row press is forced.',
`For the current board, the machine’s shortest solution uses <b>${sol?sol.count:'an unsolved/randomly generated state'}</b> moves.`,
'<div class="formula">toggle + toggle = 0 (mod 2)</div>'
],'Binary states + local interactions often turn a puzzle into linear algebra over modulo 2.')}

/* DOTS & BOXES 2x2 with exhaustive minimax */
function startDots(){state={h:[false,false,false,false,false,false],v:[false,false,false,false,false,false],owners:[null,null,null,null],turn:'human',over:false,hmemo:new Map()};
 header('🔵 Dots & Boxes','2×2 board. Draw an edge; complete a box and you get another turn. Most boxes wins.',
 `<div id="dotsBoard" class="dots-grid"></div><div class="center">You: <b id="dYou">0</b> • Machine: <b id="dMac">0</b></div>
 ${btns([B('🧠 Show the math','dotsMath','secondary'),B('↻ New board','startDots','secondary')])}<div id="msg" class="notice">Your turn. Click an edge.</div>`);
 drawDots();
}
function edgeIndexH(r,c){return r*3+c} // r 0..2,c 0..1 => 0..5
function edgeIndexV(r,c){return 6+r*2+c} // r 0..1,c 0..2 => 6..11, but arrays need 12
function startDots(){state={h:Array(6).fill(false),v:Array(6).fill(false),owners:Array(4).fill(null),turn:'human',over:false,memo:new Map()};
 header('🔵 Dots & Boxes','2×2 board. Draw an edge; complete a box and you get another turn. Most boxes wins.',
 `<div id="dotsBoard" class="dots-grid"></div><div class="center">You: <b id="dYou">0</b> • Machine: <b id="dMac">0</b></div>
 ${btns([B('🧠 Show the math','dotsMath','secondary'),B('↻ New board','startDots','secondary')])}<div id="msg" class="notice">Your turn. Click an edge.</div>`);
 drawDots();
}
function boxEdges(b){const r=Math.floor(b/2),c=b%2;return [r*3+c,(r+1)*3+c,6+r*3+c,6+r*3+c+1]}
function drawDots(){
 let s='';for(let r=0;r<2;r++)for(let c=0;c<2;c++){const b=r*2+c;const [top,bot,left,right]=boxEdges(b);
 s+=`<div class="box-cell">
 <button class="edge h ${state.h[top]?'claimH':''}" onclick="dotsEdge('h',${top})"></button>
 <button class="edge h bottom ${state.h[bot]?'claimH':''}" onclick="dotsEdge('h',${bot})"></button>
 <button class="edge v ${state.v[r*3+c]?'claimV':''}" onclick="dotsEdge('v',${r*3+c})"></button>
 <button class="edge v right ${state.v[r*3+c+1]?'claimV':''}" onclick="dotsEdge('v',${r*3+c+1})"></button>
 ${state.owners[b]?'<div class="box-owned">'+(state.owners[b]==='human'?'H':'M')+'</div>':''}
 <i class="dotp d-t"></i><i class="dotp d-tr"></i><i class="dotp d-b"></i><i class="dotp d-br"></i></div>`}
 document.getElementById('dotsBoard').innerHTML=s;
 document.getElementById('dYou').textContent=state.owners.filter(x=>x==='human').length;document.getElementById('dMac').textContent=state.owners.filter(x=>x==='machine').length;
}
function cloneDots(){return {h:state.h.slice(),v:state.v.slice(),owners:state.owners.slice()}}
function completeBoxes(){
 let got=[];for(let b=0;b<4;b++){if(state.owners[b])continue;const e=boxEdges(b),filled=e.every((x,i)=>i<2?state.h[x]:state.v[x-6]);if(filled)got.push(b)}return got;
}
function dotsEdge(type,i){
 if(state.over||state.turn!=='human')return;if(type==='h'){if(state.h[i])return;state.h[i]=true}else{if(state.v[i])return;state.v[i]=true}
 const got=completeBoxes();got.forEach(b=>state.owners[b]='human');drawDots();
 if(state.owners.every(Boolean)){endDots();return}
 if(!got.length){state.turn='machine';notice('🤖 Machine is calculating the best edge…');setTimeout(machineDots,350)}else notice('🎯 Box claimed! You get another turn.');
}
function dotsMoves(s){let arr=[];for(let i=0;i<6;i++)if(!s.h[i])arr.push(['h',i]);for(let i=0;i<6;i++)if(!s.v[i])arr.push(['v',i]);return arr}
function applyDots(s,m,owner){let ns={h:s.h.slice(),v:s.v.slice(),owners:s.owners.slice()};if(m[0]==='h')ns.h[m[1]]=true;else ns.v[m[1]]=true;
 let got=[];for(let b=0;b<4;b++){if(ns.owners[b])continue;const e=boxEdges(b);if(e[0]<6&&e[1]<6?ns.h[e[0]]&&ns.h[e[1]]:false){};const ok=ns.h[e[0]]&&ns.h[e[1]]&&ns.v[e[2]-6]&&ns.v[e[3]-6];if(ok){ns.owners[b]=owner;got.push(b)}}
 return {ns,got};
}
function dotsMinimax(s,turn,memo){
 const key=s.h.map(x=>x?1:0).join('')+'|'+s.v.map(x=>x?1:0).join('')+'|'+s.owners.map(x=>x||'0').join('')+'|'+turn;
 if(memo.has(key))return memo.get(key);
 if(s.owners.every(Boolean)){let val=s.owners.filter(x=>x==='machine').length-s.owners.filter(x=>x==='human').length;return {v:val,m:null}}
 let best=null;
 for(const m of dotsMoves(s)){const a=applyDots(s,m,'machine');const nt=a.got.length?turn:'human';let r=dotsMinimax(a.ns,nt,memo);let val=r.v;
  if(!a.got.length){ // human's eventual score is opponent's perspective; minimax value remains machine-human
   // same state evaluation already handles turns through role-specific choice below
  }
  if(turn==='machine'){if(!best||val>best.v)best={v:val,m}}else{if(!best||val<best.v)best={v:val,m}}
 }
 memo.set(key,best);return best;
}
function machineDots(){
 if(state.over)return;const moves=dotsMoves(state), scored=[];
 // Use exact minimax with turn-aware recursion, implemented directly below.
 let bestM=null,bestV=-Infinity;
 for(const m of moves){const a=applyDots(state,m,'machine');const nt=a.got.length?'machine':'human';const v=dotsValue(a.ns,nt,state.memo);
  if(v>bestV){bestV=v;bestM=m}}
 const a=applyDots(state,bestM,'machine');state.h=a.ns.h;state.v=a.ns.v;state.owners=a.ns.owners;drawDots();
 if(state.owners.every(Boolean)){endDots();return}
 if(a.got.length){notice('🤖 Machine completed a box and gets another turn.');setTimeout(machineDots,300)}
 else{state.turn='human';notice('Your turn.')}
}
function dotsValue(s,turn,memo){
 const key=s.h.map(x=>x?1:0).join('')+'|'+s.v.map(x=>x?1:0).join('')+'|'+s.owners.map(x=>x||'0').join('')+'|'+turn;
 if(memo.has(key))return memo.get(key);
 if(s.owners.every(Boolean)){const v=s.owners.filter(x=>x==='machine').length-s.owners.filter(x=>x==='human').length;memo.set(key,v);return v}
 let best=turn==='machine'?-Infinity:Infinity;
 for(const m of dotsMoves(s)){const a=applyDots(s,m,turn);const nt=a.got.length?turn:(turn==='machine'?'human':'machine');const v=dotsValue(a.ns,nt,memo);best=turn==='machine'?Math.max(best,v):Math.min(best,v)}
 memo.set(key,best);return best;
}
function endDots(){state.over=true;const y=state.owners.filter(x=>x==='human').length,m=state.owners.filter(x=>x==='machine').length;if(y>m){notice(`🏆 <b>YOU WIN ${y}–${m}!</b>`,'good');saveWin('You beat Dots & Boxes',1.5)}else if(y<m)notice(`🤖 <b>MACHINE WINS ${m}–${y}.</b>`,'bad');else notice(`⚔️ <b>DRAW ${y}–${m}.</b>`)}
function dotsMath(){math('Dots & Boxes is a game-tree problem','The tiny 2×2 version is small enough for the machine to examine every legal continuation.',[
'Completing a box gives another turn, so the value of an edge depends on what it causes later — not just whether it scores now.',
'The machine evaluates future states recursively and chooses the move that maximizes its eventual box advantage.',
'<div class="formula">state → legal edge → future states → best eventual score</div>',
'This is minimax-style reasoning: assume the opponent also chooses moves that are best for them.'
],'In strategic games, a move can be bad now but excellent if it changes the structure of future moves.')}

/* OPERATOR NETWORK */
const OPERATOR_SYMBOLS=['+','−','×','÷'];
let operatorPuzzle={start:0,nums:[],target:0,solution:[],ops:[]};
let operatorSolved=0;
let operatorScoreRecorded=false;
function operatorRandomInt(min,max){return Math.floor(Math.random()*(max-min+1))+min}
function evaluateOperator(start,nums,ops){let value=start;const steps=[String(start)];for(let i=0;i<nums.length;i++){const n=nums[i],op=ops[i];if(op==='+')value+=n;else if(op==='−')value-=n;else if(op==='×')value*=n;else if(op==='÷'){if(n===0||value%n!==0)return {result:null,steps};value/=n}steps.push(`${op} ${n} = ${value}`)}return {result:value,steps}}
function generateOperatorPuzzle(){let found=null;const minStart=2+Math.min(operatorSolved,8),maxStart=9+Math.min(Math.floor(operatorSolved/2),8);for(let attempt=0;attempt<3000;attempt++){const start=operatorRandomInt(minStart,maxStart),nums=Array.from({length:4},()=>operatorRandomInt(2,10)),solution=Array.from({length:4},()=>OPERATOR_SYMBOLS[operatorRandomInt(0,3)]),evaluation=evaluateOperator(start,nums,solution);if(evaluation.result!==null&&evaluation.result>0&&evaluation.result<400&&evaluation.result!==start){found={start,nums,target:evaluation.result,solution};break}}if(!found)found={start:5,nums:[3,4,2,6],target:36,solution:['+','×','−','+']};operatorPuzzle={...found,ops:Array(4).fill('+')}}
function startOperatorNetwork(){if(state.tick)clearInterval(state.tick);state={over:false,tick:null,operatorTime:60};operatorSolved=0;operatorScoreRecorded=false;score=0;generateOperatorPuzzle();header('⛓️ Operator Network','Toggle the operators to transform the starting number into the target. Solve as many pipelines as you can in 60 seconds.',`<div class="operator-dashboard"><div class="operator-stat">🏆 Round Score <b id="operatorScore">0</b></div><div class="operator-stat operator-timer" id="operatorTimerCard">⏱️ Time <b id="operatorTime">60s</b></div></div><div class="network-pipeline" id="operatorPipeline"></div><div class="telemetry-readout" id="operatorTelemetry">Pipeline: Loading execution map...</div>${btns([B('💡 Show solution','operatorRevealSolution','secondary'),B('🧠 Show the math','operatorMath','secondary'),B('↻ New round','startOperatorNetwork','secondary')])}<div id="msg" class="notice">Click an operator to cycle: + → − → × → ÷. Each solved pipeline earns 2 points.</div>`);renderOperatorPipeline();runOperatorClock()}
function runOperatorClock(){if(state.tick)clearInterval(state.tick);state.tick=setInterval(()=>{if(state.over)return;state.operatorTime--;const t=document.getElementById('operatorTime'),card=document.getElementById('operatorTimerCard');if(t)t.textContent=state.operatorTime+'s';if(card&&state.operatorTime<=15)card.classList.add('warn');if(state.operatorTime<=0){clearInterval(state.tick);state.over=true;finishOperatorRound()}},1000)}
function finishOperatorRound(){if(operatorScoreRecorded)return;operatorScoreRecorded=true;notice(`⏰ <b>TIME!</b> You solved ${operatorSolved} pipeline${operatorSolved===1?'':'s'} and scored <b>${score}</b> points.`,'warn');if(score<=0)return;let name='Player';try{const entered=window.prompt(`🏆 Operator Network round complete!\nFinal score: ${score}\nEnter your name for the Machine Breakers board:`);if(entered!==null&&entered.trim())name=entered.trim().slice(0,22)}catch(e){}try{let board=JSON.parse(localStorage.getItem('aptusMachineBoard')||'[]');board.push({name,score,game:'Operator Network',difficulty:'EASY',time:Date.now()});board.sort((a,b)=>b.score-a.score);localStorage.setItem('aptusMachineBoard',JSON.stringify(board.slice(0,10)))}catch(e){}renderBoard()}
function cycleOperator(index){if(state.over)return;const currentIndex=OPERATOR_SYMBOLS.indexOf(operatorPuzzle.ops[index]);operatorPuzzle.ops[index]=OPERATOR_SYMBOLS[(currentIndex+1)%OPERATOR_SYMBOLS.length];renderOperatorPipeline()}
function renderOperatorPipeline(){const wrapper=document.getElementById('operatorPipeline');if(!wrapper)return;wrapper.innerHTML='';const startNode=document.createElement('div');startNode.className='node start';startNode.textContent=operatorPuzzle.start;wrapper.appendChild(startNode);operatorPuzzle.nums.forEach((n,i)=>{const valve=document.createElement('div');valve.className='pipe-valve';const button=document.createElement('button');button.className='btn-operator';button.textContent=operatorPuzzle.ops[i];button.disabled=state.over;button.title='Click to change operator';button.onclick=()=>cycleOperator(i);valve.appendChild(button);wrapper.appendChild(valve);const numberNode=document.createElement('div');numberNode.className='node';numberNode.textContent=n;wrapper.appendChild(numberNode);if(i<operatorPuzzle.nums.length-1){const arrow=document.createElement('div');arrow.className='operator-arrow';arrow.textContent='➜';wrapper.appendChild(arrow)}});const arrow=document.createElement('div');arrow.className='operator-arrow';arrow.textContent='➜';wrapper.appendChild(arrow);const target=document.createElement('div');target.className='node target';target.textContent=`Goal: ${operatorPuzzle.target}`;wrapper.appendChild(target);const evaluation=evaluateOperator(operatorPuzzle.start,operatorPuzzle.nums,operatorPuzzle.ops),telemetry=document.getElementById('operatorTelemetry');if(telemetry)telemetry.innerHTML=evaluation.result===null?'Flow Log: <span class="operator-error">Fractional division — pipeline rejected.</span>':`Flow Log: <span>${esc(evaluation.steps.join(' → '))}</span> <b>Current: ${evaluation.result}</b>`;if(evaluation.result===operatorPuzzle.target&&!state.over){state.over=true;if(state.tick)clearInterval(state.tick);operatorSolved++;score=Math.min(difficultyPoints(),score+2);setScore(score);const roundScore=document.getElementById('operatorScore');if(roundScore)roundScore.textContent=score;notice(score>=difficultyPoints()?`🏆 <b>EASY ROUND COMPLETE!</b> You reached ${difficultyPoints()} points.`:`🏆 <b>Pipeline solved!</b> +2 points. ${difficultyPoints()-score} points remaining.`,'good');setTimeout(()=>{if(score>=difficultyPoints()){finishOperatorRound();return}state.over=false;generateOperatorPuzzle();renderOperatorPipeline()},700)}}
function operatorRevealSolution(){if(state.over)return;operatorPuzzle.ops=[...operatorPuzzle.solution];renderOperatorPipeline();notice('💡 The machine has set the operators to one valid solution.')}
function operatorMath(){math('Operator Network = sequential computation','Unlike ordinary expression puzzles, this pipeline executes from left to right. Every operator changes the value passed to the next stage.',[`<div class="formula">${operatorPuzzle.start} ${operatorPuzzle.solution.map((op,i)=>`${op} ${operatorPuzzle.nums[i]}`).join(' ')}</div>`,'Each valve controls one operation. Changing an early valve changes every later intermediate value.','Division is accepted only when it produces a whole number, preventing fractional pipeline states.','The starting-number range increases slightly as you solve more pipelines in the same round.'],'Watch the intermediate values. The fastest solution is usually to reason about what value you need at the final stages, then work backwards.')}

function solveTarget(nums,target){
 function rec(vals,exps){
  if(vals.length===1)return Math.abs(vals[0]-target)<1e-9?exps[0]:null;
  for(let i=0;i<vals.length;i++)for(let j=i+1;j<vals.length;j++){
   const rest=vals.filter((_,k)=>k!==i&&k!==j),er=exps.filter((_,k)=>k!==i&&k!==j),a=vals[i],b=vals[j],ea=exps[i],eb=exps[j];
   const ops=[[a+b,`(${ea}+${eb})`],[a*b,`(${ea}×${eb})`],[a-b,`(${ea}−${eb})`],[b-a,`(${eb}−${ea})`]];
   if(Math.abs(b)>1e-12)ops.push([a/b,`(${ea}÷${eb})`]);
   if(Math.abs(a)>1e-12)ops.push([b/a,`(${eb}÷${ea})`]);
   for(const [value,expression] of ops){const result=rec([...rest,value],[...er,expression]);if(result)return result}
  }
  return null;
 }
 for(let mask=1;mask<(1<<nums.length);mask++){
  const values=[],expressions=[];
  for(let i=0;i<nums.length;i++)if(mask&(1<<i)){values.push(nums[i]);expressions.push(String(nums[i]))}
  const result=rec(values,expressions);if(result)return result;
 }
 return null;
}

/* BULLS */
function rand4(){return String(Math.floor(1000+Math.random()*9000)).split('').map(Number)}
function bullFeedback(g,s){let bull=0,cg={},cs={};for(let i=0;i<4;i++){if(g[i]===s[i])bull++;else{cg[g[i]]=(cg[g[i]]||0)+1;cs[s[i]]=(cs[s[i]]||0)+1}}let cow=0;for(const k in cg)cow+=Math.min(cg[k],cs[k]||0);return [bull,cow]}
function startBulls(){state={secret:rand4(),tries:0,over:false};
 header('🐂 Bulls & Cows','Guess the machine’s 4-digit number. A bull is correct digit + position; a cow is correct digit, wrong position.',
 `<div class="big">_ _ _ _</div><input id="bullInput" inputmode="numeric" maxlength="4" placeholder="Four digits">
 ${btns([B('GUESS','bullGuess'),B('🧠 Show the math','bullMath','secondary'),B('↻ New number','startBulls','secondary')])}<table class="small-table"><thead><tr><th>Guess</th><th>Bulls</th><th>Cows</th></tr></thead><tbody id="bullHist"></tbody></table><div id="msg" class="notice">You have 15 attempts.</div>`);
}
function bullGuess(){if(state.over)return;const x=document.getElementById('bullInput').value.trim();if(!/^\d{4}$/.test(x)){notice('Enter exactly four digits.','warn');return}const g=x.split('').map(Number),[b,c]=bullFeedback(g,state.secret);state.tries++;document.getElementById('bullHist').insertAdjacentHTML('beforeend',`<tr><td>${x}</td><td>${b}</td><td>${c}</td></tr>`);if(b===4){state.over=true;notice(`🏆 <b>CODE CRACKED</b> in ${state.tries} guesses!`,'good');saveWin('You cracked Bulls & Cows',1.4);return}if(state.tries>=15){state.over=true;notice(`🤖 <b>MACHINE WINS.</b> It was ${state.secret.join('')}.`,'bad');return}notice(`<b>${b} bull${b!==1?'s':''}</b>, <b>${c} cow${c!==1?'s':''}</b>. ${15-state.tries} guesses left.`);document.getElementById('bullInput').value=''}
function bullMath(){math('Bulls & Cows = information','Each result shrinks the set of possible secret numbers.',[
'A bull fixes both a digit and its position.',
'A cow proves the digit exists but cannot be in that position.',
'<div class="formula">guess → feedback → eliminate impossible numbers → repeat</div>',
'If digits can repeat, frequency counts matter too. This is the same general reasoning behind Mastermind.'
],'A good guess is not only one you hope is correct; it is one that gives you useful information if it is wrong.')}

/* WYTHOFF */
function startWythoff(){state={a:8,b:13,over:false};
 header('♜ Wythoff’s Game','Two piles. Remove any positive number from one pile, OR the same positive number from both. Take the last object to win.',
 `<div class="grid two"><div class="big" id="wa">8</div><div class="big" id="wb">13</div></div>
 <div class="muted center">Choose one pile or take the same amount from both.</div>
 <div class="choice-row" style="justify-content:center;margin-top:13px">${[1,2,3,4,5].map(k=>`<button class="choice" onclick="wythMove('a',${k})">A − ${k}</button>`).join('')}${[1,2,3,4,5].map(k=>`<button class="choice" onclick="wythMove('b',${k})">B − ${k}</button>`).join('')}</div>
 <div class="choice-row" style="justify-content:center;margin-top:9px">${[1,2,3,4,5].map(k=>`<button class="choice" onclick="wythMove('both',${k})">Both − ${k}</button>`).join('')}</div>
 ${btns([B('🧠 Show the math','wythMath','secondary'),B('↻ New game','startWythoff','secondary')])}<div id="msg" class="notice">The machine knows the cold positions.</div>`);
}
function wythP(a,b){if(a>b)[a,b]=[b,a];const k=b-a;const phi=(1+Math.sqrt(5))/2;return Math.floor(k*phi)===a}
function wythBest(a,b){
 for(let x=1;x<=a;x++)if(wythP(a-x,b))return ['a',x];for(let x=1;x<=b;x++)if(wythP(a,b-x))return ['b',x];for(let x=1;x<=Math.min(a,b);x++)if(wythP(a-x,b-x))return ['both',x];return null
}
function wythMove(p,k){if(state.over)return;let a=state.a,b=state.b;if(p==='a')a-=k;if(p==='b')b-=k;if(p==='both'){a-=k;b-=k}if(a<0||b<0)return;state.a=a;state.b=b;drawWyth();if(a+b===0){state.over=true;notice('🏆 <b>YOU WIN.</b>','good');saveWin('You beat Wythoff’s Game',1.5);return}notice('🤖 Machine is checking the position…');setTimeout(()=>{const r=wythBest(state.a,state.b);if(!r){const p2=state.a?'a':'b';if(p2==='a')state.a--;else state.b--}else if(r[0]==='a')state.a-=r[1];else if(r[0]==='b')state.b-=r[1];else{state.a-=r[1];state.b-=r[1]}drawWyth();if(state.a+state.b===0){state.over=true;notice('🤖 <b>MACHINE WINS.</b> It moved to a cold position.','bad')}else notice('Machine moved. Your turn.')},400)}
function drawWyth(){document.getElementById('wa').textContent=state.a;document.getElementById('wb').textContent=state.b}
function wythMath(){math('Wythoff’s Game and the golden ratio','The losing (“cold”) positions are generated by the golden ratio.',[
'Sort the piles so <b>a ≤ b</b> and let <b>k = b − a</b>.',
'A cold position occurs when <b>a = floor(kφ)</b>, where <b>φ = (1+√5)/2 ≈ 1.618</b>.',
'<div class="formula">(0,0), (1,2), (2,4), (3,5), (4,7), (5,8), …</div>',
'The machine tries to move you into one of these positions. If you are already in one, the position is mathematically losing under perfect play.'
],'Look for invariant positions: states where every legal move hands the opponent an advantage.')}

/* TARGET GRINDER */
const GRINDER_OPS=['DIV','SUB','ADD'];
let grinderPuzzle={initial:1,slots:[],solutionOrder:[],target:1};
let grinderMoves=[];
let grinderSolved=0;
function grinderRandomInt(min,max){return Math.floor(Math.random()*(max-min+1))+min}
function generateGrinderPuzzle(){
 let value=1;
 const reverseOps=[];
 for(let i=0;i<4;i++){
  const choice=grinderRandomInt(0,2);
  if(choice===0){const multiplier=grinderRandomInt(2,5);value*=multiplier;reverseOps.push({type:'DIV',value:multiplier,label:`÷${multiplier}`})}
  else if(choice===1){const adder=grinderRandomInt(5,18);value+=adder;reverseOps.push({type:'SUB',value:adder,label:`−${adder}`})}
  else if(value>15){const subtractor=grinderRandomInt(4,14);value-=subtractor;reverseOps.push({type:'ADD',value:subtractor,label:`+${subtractor}`})}
  else{const adder=grinderRandomInt(6,16);value+=adder;reverseOps.push({type:'SUB',value:adder,label:`−${adder}`})}
 }
 const shuffled=reverseOps.map((op,index)=>({op,originalIndex:index})).sort(()=>Math.random()-.5);
 const solutionOrder=reverseOps.slice().reverse().map(op=>shuffled.findIndex(item=>item.originalIndex===reverseOps.indexOf(op)));
 grinderPuzzle={initial:value,slots:shuffled.map(item=>item.op),solutionOrder,target:1};
 grinderMoves=[];
}
function startGrinder(){
 if(state.tick)clearInterval(state.tick);
 state={over:false,tick:null,grinderTime:60};score=0;grinderSolved=0;generateGrinderPuzzle();
 header('⚙️ Target Grinder','Start with a generated value and grind it down to exactly 1. Use every module once — order matters.',
 `<div class="grinder-display"><div class="grinder-current" id="grinderValue">${grinderPuzzle.initial}</div><div class="grinder-goal">Target destination: <b>1</b></div></div>
 <div class="grinder-timer" id="grinderTimer">⏱️ 60s</div><div class="grinder-slots" id="grinderSlots"></div>
 <div class="grinder-history" id="grinderHistory">Processing Stream: <span>Awaiting reduction input...</span></div>
 ${btns([B('💡 Show solution','grinderReveal','secondary'),B('↩ Reset sequence','resetGrinderAttempt','secondary'),B('🧠 Show the math','grinderMath','secondary'),B('↻ Restart round','startGrinder','secondary')])}
 <div id="msg" class="notice">Use every module exactly once. Division must produce a whole number.</div>`);
 renderGrinder();runGrinderClock();
}
function runGrinderClock(){
 if(state.tick)clearInterval(state.tick);
 state.tick=setInterval(()=>{if(state.over)return;state.grinderTime--;const timer=document.getElementById('grinderTimer');if(timer)timer.textContent=`⏱️ ${state.grinderTime}s`;if(timer&&state.grinderTime<=15)timer.classList.add('warn');if(state.grinderTime<=0){clearInterval(state.tick);state.over=true;notice('⏰ <b>TIME!</b> The target escaped the grinder.','bad')}},1000);
}
function resetGrinderAttempt(){if(state.over)return;grinderMoves=[];renderGrinder();notice('↩ Sequence reset. Try a different order.')}
function processGrinder(index){
 if(state.over||grinderMoves.includes(index))return;
 const op=grinderPuzzle.slots[index],valueBefore=grinderValueAfterMoves();let value=valueBefore;
 if(op.type==='DIV'){if(value%op.value!==0){notice(`💥 <b>Processing crash!</b> ${value} cannot be divided cleanly by ${op.value}.`,'warn');return}value/=op.value}
 else if(op.type==='SUB')value-=op.value;else value+=op.value;
 grinderMoves.push(index);renderGrinder(true,value);
 if(grinderMoves.length!==grinderPuzzle.slots.length)return;
 if(value===1){state.over=true;clearInterval(state.tick);grinderSolved++;score=Math.min(difficultyPoints(),score+2);setScore(score);notice(score>=difficultyPoints()?`🏆 <b>Target fully ground!</b> You reached ${difficultyPoints()} points.`:`🏆 <b>Perfect grind!</b> +2 points. ${difficultyPoints()-score} points to go.`,'good');if(score>=difficultyPoints())setTimeout(finishGrinderRound,700);else setTimeout(()=>{if(state.over){state.over=false;generateGrinderPuzzle();renderGrinder()}},700)}
 else notice(`❌ All modules used, but the final value is <b>${value}</b>. Reset and try another order.`,'bad');
}
function grinderValueAfterMoves(){let value=grinderPuzzle.initial;for(const index of grinderMoves){const op=grinderPuzzle.slots[index];if(op.type==='DIV')value=value%op.value===0?value/op.value:value;else if(op.type==='SUB')value-=op.value;else value+=op.value}return value}
function renderGrinder(updateValue=true,currentValue=null){
 const wrapper=document.getElementById('grinderSlots');if(!wrapper)return;wrapper.innerHTML='';
 grinderPuzzle.slots.forEach((op,index)=>{const btn=document.createElement('button');btn.className='btn-grind';btn.textContent=op.label;btn.disabled=state.over||grinderMoves.includes(index);btn.onclick=()=>processGrinder(index);wrapper.appendChild(btn)});
 const value=currentValue===null?grinderValueAfterMoves():currentValue,display=document.getElementById('grinderValue');if(display&&updateValue)display.textContent=value;
 const history=document.getElementById('grinderHistory');if(history)history.innerHTML=grinderMoves.length?`Processing Stream: <span>${grinderMoves.map(i=>grinderPuzzle.slots[i].label).join(' ➜ ')}</span>`:'Processing Stream: <span>Awaiting reduction input...</span>';
}
function grinderReveal(){if(state.over)return;const sequence=grinderPuzzle.solutionOrder.map(index=>grinderPuzzle.slots[index].label).join(' → ');notice(`💡 <b>Machine solution:</b> ${sequence}`)}
function grinderMath(){const solution=grinderPuzzle.solutionOrder.map(index=>grinderPuzzle.slots[index]);let value=grinderPuzzle.initial;const steps=[String(value)];for(const op of solution){if(op.type==='DIV')value/=op.value;else if(op.type==='SUB')value-=op.value;else value+=op.value;steps.push(`${op.label} = ${value}`)}math('Target Grinder = reverse arithmetic','The puzzle is generated backwards from 1, which guarantees that one ordering reaches the destination exactly.',[`Starting target: <b>${grinderPuzzle.initial}</b>`,'Use all four modules exactly once.',`Correct execution path: <div class="formula">${steps.join(' → ')}</div>`,'Division is legal only when the current value is divisible by the module value.','The challenge is finding the correct order of transformations.'],'Think backwards: ask what operation could have produced the current value, then choose the module that makes the next step clean.')}
function finishGrinderRound(){if(state.tick)clearInterval(state.tick);const finalScore=score;let name='Player';try{const entered=window.prompt(`🏆 Target Grinder round complete!\nFinal score: ${finalScore}\nEnter your name for the Machine Breakers board:`);if(entered!==null&&entered.trim())name=entered.trim().slice(0,22)}catch(e){}let board=[];try{board=JSON.parse(localStorage.getItem('aptusMachineBoard')||'[]')}catch(e){}board.push({name,score:finalScore,game:'Target Grinder',difficulty:'EASY',time:Date.now()});board.sort((a,b)=>b.score-a.score);try{localStorage.setItem('aptusMachineBoard',JSON.stringify(board.slice(0,10)))}catch(e){}renderBoard();notice(`🏆 <b>Round complete!</b> Final score: ${finalScore}.`,'good')}

/* INERTIA ENGINE */
const INERTIA_TOTAL=31,INERTIA_MIN=2,INERTIA_MAX=5,INERTIA_YELLOW=new Set([7,14,21]);
function inertiaMoves(pos,inertia){const moves=[];for(let value=inertia-1;value<=inertia+1;value++)if(value>=INERTIA_MIN&&value<=INERTIA_MAX)moves.push(value);return moves}
function inertiaWin(pos,inertia,memo=new Map()){if(pos>=INERTIA_TOTAL-1)return false;const key=`${pos}|${inertia}`;if(memo.has(key))return memo.get(key);for(const value of inertiaMoves(pos,inertia)){const next=pos+value;if(next>=INERTIA_TOTAL-1)continue;const child=inertiaWin(next,value,memo),sameTurn=INERTIA_YELLOW.has(next);if(sameTurn?child:!child){memo.set(key,true);return true}}memo.set(key,false);return false}
function inertiaBestMove(pos,inertia,memo){for(const value of inertiaMoves(pos,inertia)){const next=pos+value;if(next>=INERTIA_TOTAL-1)continue;const child=inertiaWin(next,value,memo),sameTurn=INERTIA_YELLOW.has(next);if(sameTurn?child:!child)return value}return inertiaMoves(pos,inertia)[0]||INERTIA_MIN}
function startInertia(){state={pos:0,inertia:3,turn:'human',over:false,memo:new Map(),aiTimer:null};header('⚡ Inertia Engine','Your previous velocity controls the next move window. Reach Red and you lose.',`<div class="engine-rules inertia-rules"><div class="engine-rule-title">Dynamic velocity</div><div class="engine-rule-grid"><div><b>1</b><span>Choose velocity ±1.</span></div><div><b>2</b><span>Velocity stays between 2 and 5.</span></div><div><b>3</b><span>Yellow gives a chain turn.</span></div><div><b>4</b><span>Red loses immediately.</span></div></div><div class="engine-formula">Allowed next steps = {v−1, v, v+1} ∩ {2,3,4,5}</div></div><div class="engine-dashboard"><div class="engine-stat"><span>Position</span><b id="inertiaPos">0</b></div><div class="engine-stat"><span>Current velocity</span><b id="inertiaVel">3</b></div><div class="engine-stat"><span>Distance to Red</span><b id="inertiaRem">30</b></div><div class="engine-stat accent"><span>Next options</span><b id="inertiaOptions">2, 3, 4</b></div></div><div class="engine-track-wrap"><div class="engine-track" id="inertiaTrack"></div></div><div class="engine-control-card"><div class="engine-turn" id="inertiaTurn">YOUR TURN</div><div class="engine-prompt">Choose your next velocity.</div><div class="engine-moves" id="inertiaMoves"></div></div>${btns([B('🧠 Show the math','inertiaMath','secondary'),B('↻ New engine run','startInertia','secondary')])}<div id="msg" class="notice">The machine uses exact finite-state game-tree analysis.</div>`);renderInertia()}
function inertiaMove(value){if(state.over||state.turn!=='human'||!inertiaMoves(state.pos,state.inertia).includes(value))return;inertiaApply(value,'human');if(!state.over&&state.turn==='ai'){renderInertia();state.aiTimer=setTimeout(inertiaAI,480)}}
function inertiaApply(value,who){state.pos+=value;state.inertia=value;if(state.pos>=INERTIA_TOTAL-1){state.over=true;if(state.aiTimer)clearTimeout(state.aiTimer);renderInertia();if(who==='human')notice('🔴 <b>TRAPPED.</b> You hit Red. The machine wins.','bad');else{notice('🏆 <b>YOU OUTSMARTED IT.</b> The machine was forced onto Red.','good');saveWin('You beat the Inertia Engine',1)}return}if(INERTIA_YELLOW.has(state.pos)){state.turn=who==='human'?'human':'ai';notice(`🟡 <b>Yellow ${state.pos}.</b> ${who==='human'?'You':'Machine'} keep the turn.`,'warn')}else{state.turn=who==='human'?'ai':'human'}}
function inertiaAI(){if(state.over||state.turn!=='ai')return;const value=inertiaBestMove(state.pos,state.inertia,state.memo);inertiaApply(value,'ai');if(!state.over&&state.turn==='ai')setTimeout(inertiaAI,420);renderInertia();if(!state.over&&state.turn==='human')notice(`🤖 Machine chose <b>+${value}</b>. Your legal range is <b>${inertiaMoves(state.pos,state.inertia).join(', ')}</b>.`)}
function renderInertia(){const track=document.getElementById('inertiaTrack');if(!track)return;document.getElementById('inertiaPos').textContent=state.pos;document.getElementById('inertiaVel').textContent=state.inertia;document.getElementById('inertiaRem').textContent=Math.max(0,INERTIA_TOTAL-1-state.pos);document.getElementById('inertiaOptions').textContent=inertiaMoves(state.pos,state.inertia).join(', ')||'—';const turn=document.getElementById('inertiaTurn');turn.textContent=state.over?'ENGINE HALTED':state.turn==='human'?'YOUR TURN':'MACHINE THINKING';turn.className='engine-turn '+(state.turn==='human'?'human':'machine');track.innerHTML='';for(let index=0;index<INERTIA_TOTAL;index++){const node=document.createElement('div');const code=index===INERTIA_TOTAL-1?'R':INERTIA_YELLOW.has(index)?'Y':'G';node.className=`engine-node ${code} ${index<state.pos?'passed':''} ${index===state.pos?'current':''}`;node.textContent=index;track.appendChild(node)}const wrapper=document.getElementById('inertiaMoves');wrapper.innerHTML='';inertiaMoves(state.pos,state.inertia).forEach(value=>{const button=document.createElement('button');button.className='engine-move-btn';button.textContent=`+${value}`;button.disabled=state.over||state.turn!=='human';button.onclick=()=>inertiaMove(value);wrapper.appendChild(button)})}
function inertiaMath(){const memo=new Map(),winning=inertiaWin(0,3,memo);math('Inertia Engine: velocity is part of the state','The machine tracks both position and velocity, while Yellow changes who moves next.',[`<div class="formula">Next velocity ∈ {v−1, v, v+1} ∩ {2,3,4,5}</div>`,'A normal cell passes the turn. A Yellow cell lets the same player move again.','For every state (position, velocity), the solver checks each legal next velocity.','Landing on Red is an immediate loss.',`From (0, 3), the starting state is <b>${winning?'winning':'losing'}</b>; the solver evaluated ${memo.size} states.`],'Track position and velocity together. A small move can create a much worse future move window.')}

/* FIBONACCI DECAY / STATIC LOCK ENGINE */
const DECAY_TOTAL=31,DECAY_MIN=2,DECAY_MAX=5,DECAY_YELLOW=new Set([5,11,17,23]);
function decayMoves(pos,banned){const moves=[];for(let value=DECAY_MIN;value<=DECAY_MAX;value++)if(value!==banned)moves.push(value);return moves}
function decayWin(pos,banned,memo=new Map()){if(pos>=DECAY_TOTAL-1)return false;const key=`${pos}|${banned??0}`;if(memo.has(key))return memo.get(key);for(const value of decayMoves(pos,banned)){const next=pos+value;if(next>=DECAY_TOTAL-1)continue;const child=decayWin(next,value,memo),sameTurn=DECAY_YELLOW.has(next);if(sameTurn?child:!child){memo.set(key,true);return true}}memo.set(key,false);return false}
function decayBestMove(pos,banned,memo){for(const value of decayMoves(pos,banned)){const next=pos+value;if(next>=DECAY_TOTAL-1)continue;const child=decayWin(next,value,memo),sameTurn=DECAY_YELLOW.has(next);if(sameTurn?child:!child)return value}return decayMoves(pos,banned)[0]||DECAY_MIN}
function startDecay(){state={pos:0,banned:null,turn:'human',over:false,memo:new Map(),aiTimer:null};header('🧬 Fibonacci Decay','Each move locks that same number for the opponent. Yellow keeps the turn; Red ends the game.',`<div class="engine-rules decay-rules"><div class="engine-rule-title">Static lock system</div><div class="engine-rule-grid"><div><b>1</b><span>Choose a step from 2–5.</span></div><div><b>2</b><span>Your step becomes locked.</span></div><div><b>3</b><span>The opponent cannot repeat it.</span></div><div><b>4</b><span>Yellow preserves the turn.</span></div></div><div class="engine-formula">Legal moves = {2,3,4,5} − {locked step}</div></div><div class="engine-dashboard"><div class="engine-stat"><span>Position</span><b id="decayPos">0</b></div><div class="engine-stat danger"><span>Locked step</span><b id="decayLock">None</b></div><div class="engine-stat"><span>Distance to Red</span><b id="decayRem">30</b></div><div class="engine-stat accent"><span>Legal now</span><b id="decayOptions">2, 3, 4, 5</b></div></div><div class="engine-track-wrap"><div class="engine-track" id="decayTrack"></div></div><div class="engine-control-card"><div class="engine-turn" id="decayTurn">YOUR TURN</div><div class="engine-prompt">Pick a step. That number locks for the next decision.</div><div class="engine-moves" id="decayMoves"></div></div>${btns([B('🧠 Show the math','decayMath','secondary'),B('↻ New engine run','startDecay','secondary')])}<div id="msg" class="notice">The machine uses exact finite-state game-tree analysis.</div>`);renderDecay()}
function decayMove(value){if(state.over||state.turn!=='human'||!decayMoves(state.pos,state.banned).includes(value))return;decayApply(value,'human');if(!state.over&&state.turn==='ai'){renderDecay();state.aiTimer=setTimeout(decayAI,500)}}
function decayApply(value,who){state.pos+=value;state.banned=value;if(state.pos>=DECAY_TOTAL-1){state.over=true;if(state.aiTimer)clearTimeout(state.aiTimer);renderDecay();if(who==='human')notice('🔴 <b>LOCKED INTO RED.</b> The machine wins.','bad');else{notice('🏆 <b>YOU OUTSMARTED IT.</b> The machine was forced onto Red.','good');saveWin('You beat Fibonacci Decay',1)}return}if(DECAY_YELLOW.has(state.pos)){state.turn=who==='human'?'human':'ai';notice(`🟡 <b>Yellow ${state.pos}.</b> ${who==='human'?'You':'Machine'} keep the turn.`,'warn')}else state.turn=who==='human'?'ai':'human'}
function decayAI(){if(state.over||state.turn!=='ai')return;const value=decayBestMove(state.pos,state.banned,state.memo);decayApply(value,'ai');if(!state.over&&state.turn==='ai')setTimeout(decayAI,430);renderDecay();if(!state.over&&state.turn==='human')notice(`🤖 Machine chose <b>+${value}</b>. You cannot choose <b>+${value}</b> now.`)}
function renderDecay(){const track=document.getElementById('decayTrack');if(!track)return;document.getElementById('decayPos').textContent=state.pos;document.getElementById('decayLock').textContent=state.banned==null?'None':`+${state.banned}`;document.getElementById('decayRem').textContent=Math.max(0,DECAY_TOTAL-1-state.pos);document.getElementById('decayOptions').textContent=decayMoves(state.pos,state.banned).join(', ')||'—';const turn=document.getElementById('decayTurn');turn.textContent=state.over?'ENGINE HALTED':state.turn==='human'?'YOUR TURN':'MACHINE THINKING';turn.className='engine-turn '+(state.turn==='human'?'human':'machine');track.innerHTML='';for(let index=0;index<DECAY_TOTAL;index++){const node=document.createElement('div');const code=index===DECAY_TOTAL-1?'R':DECAY_YELLOW.has(index)?'Y':'G';node.className=`engine-node ${code} ${index<state.pos?'passed':''} ${index===state.pos?'current':''}`;node.textContent=index;track.appendChild(node)}const wrapper=document.getElementById('decayMoves');wrapper.innerHTML='';for(let value=DECAY_MIN;value<=DECAY_MAX;value++){const button=document.createElement('button');button.className='engine-move-btn';button.textContent=`+${value}`;button.disabled=state.over||state.turn!=='human'||value===state.banned;button.classList.toggle('locked',value===state.banned);button.onclick=()=>decayMove(value);wrapper.appendChild(button)}}
function decayMath(){const memo=new Map(),winning=decayWin(0,null,memo);math('Fibonacci Decay: move locking changes the state','The same position can be winning or losing depending on which step is forbidden.',[`<div class="formula">Legal moves = {2,3,4,5} − {locked step}</div>`,'Choosing +4 locks +4 for the opponent. Yellow keeps the turn, but the lock still carries into the next decision.','The solver represents (position, locked step), not just distance to Red.','Landing on Red loses immediately.',`From (0, no lock), the starting state is <b>${winning?'winning':'losing'}</b>; the solver evaluated ${memo.size} states.`],'Track where you land and which move value you ban next.')}

/* start */
function start(){updateMenu();if(state.tick)clearInterval(state.tick);const map={nim:startNim,twentyfour:start24,guess:startGuess,pattern:startPattern,symbiotic:startSymbiotic,parity:startParity,mastermind:startMastermind,monty:startMonty,lights:startLights,dots:startDots,operator:startOperatorNetwork,bulls:startBulls,wythoff:startWythoff,grinder:startGrinder,inertia:startInertia,decay:startDecay};map[current]();setScore(0)}
renderBoard();start();
