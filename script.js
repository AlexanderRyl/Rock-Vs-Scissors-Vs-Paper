const canvas = document.getElementById('arena');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 50; // Reserve space for controls
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const emojis = {
  '🪨': { beats: '✂️', color: 'gray' },
  '📄': { beats: '🪨', color: 'blue' },
  '✂️': { beats: '📄', color: 'red' },
};

class Entity {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.size = 50;
  }

  draw() {
    ctx.fillStyle = emojis[this.type].color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawBackground() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function update() {
  drawBackground();
  // Logic for entities
  requestAnimationFrame(update);
}

function initializeGame() {
  resizeCanvas();
  update();
}
