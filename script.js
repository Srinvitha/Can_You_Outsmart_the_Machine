const GAMES=[
 ['twentyfour','🔢','24 Game','Arithmetic','easy'],['pattern','🧩','Pattern Duel','Sequences','easy'],['guess','🔮','Number Hunt','Binary search','easy'],['operator','⛓️','Operator Network','Arithmetic','easy'],['grinder','⚙️','Target Grinder','Reverse arithmetic','easy'],['monty','🚪','Monty Hall','Probability','easy'],
 ['bulls','🐂','Bulls & Cows','Logic','medium'],['mastermind','🕵️','Mastermind','Deduction','medium'],['nim','🥢','Nim','Game theory','medium'],['optimal','♟️','Optimal Move','Minimax','medium'],['greenred','🟢','Green–Yellow–Red','Strategy','medium'],
 ['dots','🔵','Dots & Boxes','Game theory','hard'],['lights','💡','Lights Out','Linear algebra','hard'],['wythoff','♜','Wythoff’s Game','Number theory','hard'],
];
const DIFFICULTY={easy:{label:'EASY',points:10},medium:{label:'MEDIUM',points:15},hard:{label:'HARD',points:20}};
function gameMeta(){return GAMES.find(g=>g[0]===current)||GAMES[0]}
function difficultyInfo(){return DIFFICULTY[gameMeta()[4]]}
function difficultyPoints(){return difficultyInfo().points}
let current='nim', score=0, state={};

const menu=document.getElementById('menu'), panel=document.getElementById('panel');
GAMES.forEach(([id,ic,name,type,diff])=>{
 const b=document.createElement('button'); b.className='game-btn '+diff; b.dataset.id=id;
 b.innerHTML=`<span class="game-icon">${ic}</span><span><span class="game-name">${name}</span> <span class="diff-badge ${diff}">${DIFFICULTY[diff].label}</span><br><span class="game-type">${type} • up to ${DIFFICULTY[diff].points} pts</span></span>`;
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

/* PATTERN */
const patterns=[
 {s:[2,6,12,20,30],a:42,w:'These are n(n+1): 1×2, 2×3, 3×4, 4×5, 5×6, so next is 6×7 = 42.'},
 {s:[3,6,12,24,48],a:96,w:'Each term doubles.'},
 {s:[1,4,9,16,25],a:36,w:'Perfect squares: 1², 2², 3², 4², 5², 6².'},
 {s:[5,8,14,23,35],a:50,w:'Differences are +3, +6, +9, +12, then +15.'},
 {s:[2,3,5,8,13,21],a:34,w:'Each term is the sum of the previous two.'}
];
function startPattern(){state={p:patterns[Math.floor(Math.random()*patterns.length)],over:false};
 header('🧩 Pattern Duel','The machine sees a rule. Can you infer it first?',
 `<div class="big">${state.p.s.join(', ')} , ?</div><input id="pat" type="number" placeholder="Next number">
 ${btns([B('PREDICT','checkPattern'),B('🧠 Show the math','patternMath','secondary'),B('↻ New pattern','startPattern','secondary')])}<div id="msg" class="notice">There can be many patterns — find the intended rule.</div>`);
}
function checkPattern(){if(state.over)return;const x=Number(document.getElementById('pat').value);if(x===state.p.a){state.over=true;notice('🏆 <b>Correct.</b> You spotted the rule.','good');saveWin('You predicted the pattern',1)}else notice('Not quite. Try again or reveal the intended rule.','bad')}
function patternMath(){math('Pattern prediction','The key is to inspect differences, ratios, or familiar sequences.',[`Sequence: <div class="formula">${state.p.s.join(', ')}</div>`,`Intended rule: <b>${state.p.w}</b>`,'A machine can generate or test many candidate rules. Your advantage is recognizing structure quickly.'],'Before calculating, ask: what happens to the differences? The ratios? The position n?')}

/* OPTIMAL MOVE: 2-pile removal game with minimax */
function startOptimal(){state={a:7,b:9,over:false,turn:'human',memo:new Map()};
 header('♟️ Optimal Move','Two piles. On each turn remove 1–3 objects from ONE pile. Take the last object to win.',
 `<div class="grid two"><div class="big" id="pileA">7</div><div class="big" id="pileB">9</div></div>
 <div class="muted center">Choose a pile and how many to remove.</div><div class="choice-row" style="justify-content:center;margin-top:13px">
 ${[1,2,3].map(k=>`<button class="choice" onclick="optMove('a',${k})">A − ${k}</button>`).join('')}
 ${[1,2,3].map(k=>`<button class="choice" onclick="optMove('b',${k})">B − ${k}</button>`).join('')}</div>
 ${btns([B('🧠 Show the math','optimalMath','secondary'),B('↻ New game','startOptimal','secondary')])}<div id="msg" class="notice">The machine uses minimax — it searches the game tree.</div>`);
}
function optWin(a,b){return a+b===0}
function optBest(a,b){
 // normal-play impartial game; recursive winning-state test
 const key=a+','+b;if(state.memo.has(key))return state.memo.get(key);
 for(const p of ['a','b'])for(let k=1;k<=3;k++){let x=a,y=b;if(p==='a')x-=k;else y-=k;if(x<0||y<0)continue;if(!optWin(x,y)&&!optBest(x,y)){state.memo.set(key,{p,k,win:true});return {p,k,win:true}}}
 const r={win:false};state.memo.set(key,r);return r;
}
function optMove(p,k){
 if(state.over)return;let x=state.a,y=state.b;if(p==='a')x-=k;else y-=k;if(x<0||y<0)return;
 state.a=x;state.b=y;drawOpt();if(optWin(x,y)){state.over=true;notice('🏆 <b>YOU WIN.</b> You took the last object.','good');saveWin('You beat the Optimal Move machine',1.2);return}
 notice('🤖 Machine is searching the game tree…');setTimeout(()=>{
  const r=optBest(state.a,state.b);let mp,mk;
  if(r.win){mp=r.p;mk=r.k}else{mp=state.a?'a':'b';mk=Math.min(1,mp==='a'?state.a:state.b)}
  if(mp==='a')state.a-=mk;else state.b-=mk;drawOpt();
  if(optWin(state.a,state.b)){state.over=true;notice('🤖 <b>MACHINE WINS.</b> It found a winning move.','bad')}else notice(`Machine removed <b>${mk}</b> from pile ${mp.toUpperCase()}. Your turn.`);
 },380)
}
function drawOpt(){document.getElementById('pileA').textContent=state.a;document.getElementById('pileB').textContent=state.b}
function optimalMath(){math('What “optimal” means','The machine looks ahead instead of reacting randomly.',[
'Every position is classified as <b>winning</b> or <b>losing</b> for the player whose turn it is.',
'A position is winning if there is at least one legal move that sends the opponent to a losing position.',
'A position is losing if every legal move gives the opponent a winning position.',
'<div class="formula">WIN → choose a move → OPPONENT gets LOSS</div>',
'The machine computes this recursively (minimax-style game-tree search).'
],'The trick in many games is not “find the best-looking move”; it is “move to a position from which every reply is manageable.”')}

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

/* GREEN–YELLOW–RED custom strategic game */
function greenStateWin(n,turn,memo){
 // Exact dynamic-programming solver for this custom finite game.
 // n = tokens remaining; turn = 'human' or 'machine'.
 // A player who makes n=0 loses (they took the final Red token).
 if(n===0)return false;
 const key=n+'|'+turn;if(memo.has(key))return memo.get(key);
 for(let k=1;k<=Math.min(3,n);k++){
   const rem=n-k;
   if(rem===0)continue; // taking Red immediately loses
   const nextTurn=(rem%5===0)?turn:(turn==='human'?'machine':'human');
   if(!greenStateWin(rem,nextTurn,memo)){memo.set(key,true);return true}
 }
 memo.set(key,false);return false;
}
function greenBestMachine(n,memo){
 for(let k=1;k<=Math.min(3,n);k++){
   const rem=n-k;if(rem===0)continue;
   const nextTurn=(rem%5===0)?'machine':'human';
   if(!greenStateWin(rem,nextTurn,memo))return k;
 }
 return Math.min(1,n);
}
function startGreen(){state={n:15,over:false,memo:new Map()};
 header('🟢 Green–Yellow–Red','A custom Aptus Gana strategy game. Take 1–3 tokens. Landing on Yellow gives a bonus turn; taking the final Red token loses.',
 `<div class="big" id="gry">15</div><div class="center muted">Green = normal turn • Yellow = bonus turn • Red = final token and instant loss.</div>
 <div class="choice-row" style="justify-content:center;margin-top:14px">${[1,2,3].map(k=>`<button class="choice" onclick="greenMove(${k})">Take ${k}</button>`).join('')}</div>
 ${btns([B('🧠 Show the math','greenMath','secondary'),B('↻ New game','startGreen','secondary')])}<div id="msg" class="notice">The machine has solved the finite game tree.</div>`);
}
function greenMove(k){
 if(state.over||k>state.n)return;
 state.n-=k;drawGreen();
 if(state.n===0){state.over=true;notice('🤖 <b>MACHINE WINS.</b> You took the final Red token.','bad');return}
 if(state.n%5===0){notice('🟡 <b>Yellow!</b> Bonus turn — you move again.');return}
 notice('🤖 Machine is searching the exact game tree…');
 setTimeout(()=>{
   const take=greenBestMachine(state.n,state.memo),rem=state.n-take;
   if(rem===0){state.over=true;notice('🤖 <b>MACHINE WINS.</b> It avoided taking Red and left you the losing choice.','bad');return}
   state.n=rem;drawGreen();
   if(state.n%5===0)notice(`Machine took <b>${take}</b>. 🟡 Yellow gives the machine another turn.`);
   else notice(`Machine took <b>${take}</b>. Your turn.`);
   if(state.n>0&&state.n%5===0)setTimeout(()=>greenMachineBonus(),320);
 },380);
}
function greenMachineBonus(){
 if(state.over)return;
 const take=greenBestMachine(state.n,state.memo),rem=state.n-take;
 if(rem===0){state.over=true;notice('🤖 <b>MACHINE WINS.</b> It has forced the final Red token onto you.','bad');return}
 state.n=rem;drawGreen();
 if(state.n%5===0){notice(`🤖 Machine took <b>${take}</b> and landed on Yellow again. It gets another turn.`);setTimeout(greenMachineBonus,320)}
 else notice(`🤖 Machine took <b>${take}</b>. Your turn.`);
}
function drawGreen(){document.getElementById('gry').textContent=state.n}
function greenMath(){const memo=new Map();const winning=greenStateWin(15,'human',memo);math('Green–Yellow–Red: exact game-tree solving','This is a custom game, so the machine does not use a guessed pattern. It solves the finite state space exactly.',[
'There are only 15 possible token counts, so the machine can evaluate every future state with dynamic programming.',
'For each state, it asks: <b>“Is there at least one legal move that gives the opponent a losing state?”</b>',
'If yes, the state is winning. If every legal move gives the opponent a winning state, it is losing.',
'<div class="formula">WIN ⇔ ∃ move → LOSS &nbsp;&nbsp;&nbsp; LOSS ⇔ every move → WIN</div>',
`From 15 tokens with the rules shown, the starting state is <b>${winning?'winning':'losing'}</b> for the player to move under perfect play.`
],'This is the same core idea used by many optimal-game algorithms: solve the states from the end backwards instead of relying on intuition.')}

/* start */
function start(){updateMenu();if(state.tick)clearInterval(state.tick);const map={nim:startNim,twentyfour:start24,guess:startGuess,pattern:startPattern,optimal:startOptimal,mastermind:startMastermind,monty:startMonty,lights:startLights,dots:startDots,operator:startOperatorNetwork,bulls:startBulls,wythoff:startWythoff,grinder:startGrinder,greenred:startGreen};map[current]();setScore(0)}
renderBoard();start();
