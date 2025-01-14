const canvas = document.getElementById('arena');
const ctx = canvas.getContext('2d');
const emojiTypes = ['🪨', '📄', '✂️'];
const entities = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// Spawn emojis
function spawnInitialEntities() {
  for (let i = 0; i < 3; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const type = emojiTypes[i % emojiTypes.length];
    entities.push({ x, y, type });
  }
}

function drawEntities() {
  entities.forEach(entity => {
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(entity.type, entity.x, entity.y);
  });
}

function updateArena() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawEntities();
  requestAnimationFrame(updateArena);
}

function startGame() {
  document.getElementById('title-screen').style.display = 'none';
  canvas.style.display = 'block';
  document.getElementById('controls').style.display = 'flex';

  resizeCanvas();
  spawnInitialEntities();
  updateArena();
}

document.getElementById('start-btn').addEventListener('click', startGame);
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
