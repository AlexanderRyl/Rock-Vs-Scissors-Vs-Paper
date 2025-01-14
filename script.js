// JavaScript (script.js)
const titleScreen = document.getElementById('title-screen');
const controls = document.getElementById('controls');
const canvas = document.getElementById('arena');
const ctx = canvas.getContext('2d');
const emojiTypes = ['🪨', '📄', '✂️'];
const entities = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function spawnInitialEntities(count = 3) {
  entities.length = 0; // Clear entities
  for (let i = 0; i < count; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const type = emojiTypes[i % emojiTypes.length];
    entities.push({ x, y, type });
  }
}

function drawEntities() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  entities.forEach(entity => {
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(entity.type, entity.x, entity.y);
  });
}

function startGame() {
  titleScreen.style.display = 'none';
  canvas.style.display = 'block';
  controls.style.display = 'flex';

  resizeCanvas();
  spawnInitialEntities();
  requestAnimationFrame(updateArena);
}

function updateArena() {
  drawEntities();
  requestAnimationFrame(updateArena);
}

document.getElementById('start-btn').addEventListener('click', startGame);
document.getElementById('respawn-all').addEventListener('click', () => spawnInitialEntities(5));
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
