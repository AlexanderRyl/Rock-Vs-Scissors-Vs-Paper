// JavaScript (script.js)
const menu = document.getElementById('menu');
const arena = document.getElementById('arena');
const controls = document.getElementById('controls');
const startBtn = document.getElementById('start-btn');
const spawnBtn = document.getElementById('spawn-btn');
const respawnBtn = document.getElementById('respawn-btn');
const emojiCountInput = document.getElementById('emoji-count');
const emojiSpeedInput = document.getElementById('emoji-speed');
const ctx = arena.getContext('2d');
const entities = [];
const emojis = ['🌟', '🌈', '🔥', '⚡', '💎', '🎉'];

let gameInterval = null;

function createParticles(canvas) {
  // Create swirling particles for the background (neon effect)
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = Array.from({ length: 100 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 3 + 1,
    dx: Math.random() * 2 - 1,
    dy: Math.random() * 2 - 1,
    color: `rgba(0, 255, 204, ${Math.random()})`
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();

      p.x += p.dx;
      p.y += p.dy;

      if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    });

    requestAnimationFrame(draw);
  }

  draw();
}

function startGame() {
  menu.style.display = 'none';
  controls.style.display = 'flex';
  arena.style.display = 'block';

  createParticles(arena);
  spawnEntities(parseInt(emojiCountInput.value));
}

function spawnEntities(count) {
  entities.length = 0;
  for (let i = 0; i < count; i++) {
    entities.push({
      x: Math.random() * arena.width,
      y: Math.random() * arena.height,
      emoji: emojis[i % emojis.length]
    });
  }
  drawEntities();
}

function drawEntities() {
  ctx.clearRect(0, 0, arena.width, arena.height);
  entities.forEach(({ x, y, emoji }) => {
    ctx.font = '40px Arial';
    ctx.fillText(emoji, x, y);
  });
}

startBtn.addEventListener('click', startGame);
spawnBtn.addEventListener('click', () => spawnEntities(1));
respawnBtn.addEventListener('click', () => spawnEntities(emojiCountInput.value));
