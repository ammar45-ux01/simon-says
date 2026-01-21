const colors = ['green','red','yellow','blue'];
let sequence = [];
let userSequence = [];
let level = 0;
const buttons = document.querySelectorAll('.btn');
const startBtn = document.getElementById('startBtn');
const levelDisplay = document.getElementById('level');
const msg = document.getElementById('message');

function flash(btn) {
  btn.classList.add('active');
  setTimeout(()=>btn.classList.remove('active'),350);
}
function playSound(color) {
  const ctx = new(window.AudioContext||window.webkitAudioContext)();
  const osc = ctx.createOscillator(); const g = ctx.createGain();
  const freqMap = {green:315, red:420, yellow:555, blue:670};
  osc.type='triangle'; osc.frequency.value=freqMap[color];
  osc.connect(g); g.connect(ctx.destination);
  g.gain.setValueAtTime(0.15, ctx.currentTime);
  osc.start(); osc.stop(ctx.currentTime+0.25); osc.onended=()=>ctx.close();
}
function setMessage(str) { msg.textContent=str; }

function nextSequence() {
  userSequence = [];
  level++;
  levelDisplay.textContent = "Level " + level;
  sequence.push(colors[Math.floor(Math.random()*4)]);
  setMessage("Watch the sequence");
  let i = 0;
  const interval = setInterval(()=>{
    const color = sequence[i];
    const btn = document.querySelector(`.btn.${color}`);
    flash(btn);
    playSound(color);
    i++;
    if(i>=sequence.length) {
      clearInterval(interval);
      setTimeout(()=>setMessage("Your turn!"),350);
    }
  }, 600);
}

buttons.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    if(!sequence.length || msg.textContent!=="Your turn!") return;
    const color = btn.dataset.color;
    userSequence.push(color);
    flash(btn); playSound(color);
    const idx = userSequence.length - 1;
    if(userSequence[idx] !== sequence[idx]) {
      setMessage("Game Over! Score: " + (level-1));
      sequence = []; userSequence = [];
      level = 0; levelDisplay.textContent = "";
      return;
    }
    if(userSequence.length === sequence.length) {
      setTimeout(nextSequence,700);
    }
  });
});
startBtn.onclick = ()=>{
  sequence = []; userSequence = []; level = 0; 
  nextSequence();
};