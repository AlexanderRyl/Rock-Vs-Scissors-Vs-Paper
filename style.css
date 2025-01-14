// script.js - Core Game Logic

const canvas = document.getElementById('arena');
const ctx = canvas.getContext('2d');
resizeCanvas();

window.addEventListener('resize', resizeCanvas);

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight * 0.9; // Leave space for controls
}

// Define emoji properties
const emojis = {
  '🪨': { beats: '✂️', color: 'gray', glow: '#808080' },
  '📄': { beats: '🪨', color: 'blue', glow: '#0099ff' },
  '✂️': { beats: '📄', color: 'red', glow: '#ff0033' },
};

// Create abstract animated background
let gradientShift = 0;
function drawBackground() {
  gradientShift += 1;
  const gradient = ctx.createLinearGradient(0, gradientShift, canvas.width, canvas.height + gradientShift);
  gradient.addColorStop(0, '#003333');
  gradient.addColorStop(0.25, '#330033');
  gradient.addColorStop(0.5, '#330000');
  gradient.addColorStop(0.75, '#000033');
  gradient.addColorStop(1, '#003333');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Add abstract shapes
  for (let i = 0; i < 10; i++) {
    ctx.strokeStyle = `rgba(0, 255, 255, 0.1)`;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.arc(
      Math.random() * canvas.width,
      Math.random() * canvas.height,
      Math.random() * 100,
      0,
      Math.PI * 2
    );
    ctx.stroke();
  }
}

// Define Entity class
class Entity {
  constructor(x, y, type, size = Math.random() * 40 + 20) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.type = type;
    this.dx = (Math.random() - 0.5) * 6;
    this.dy = (Math.random() - 0.5) * 6;
  }

  draw() {
    ctx.shadowBlur = 15;
    ctx.shadowColor = emojis[this.type].glow;
    ctx.fillStyle = emojis[this.type].color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.font = `${this.size / 2}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'white';
    ctx.fillText(this.type, this.x, this.y);
  }

  move() {
    this.x += this.dx;
    this.y += this.dy;
    if (this.x - this.size / 2 <= 0 || this.x + this.size / 2 >= canvas.width) this.dx *= -1;
    if (this.y - this.size / 2 <= 0 || this.y + this.size / 2 >= canvas.height) this.dy *= -1;
  }

  collideWith(other) {
    const distance = Math.hypot(this.x - other.x, this.y - other.y);
    return distance < (this.size + other.size) / 2;
  }

  interact(other) {
    if (emojis[this.type].beats === other.type) other.type = this.type;
  }
}

// Initialize entities
const entities = [
  new Entity(100, 100, '🪨'),
  new Entity(400, 400, '📄'),
  new Entity(700, 700, '✂️'),
];

// Add event listener for random-size emoji spawning
canvas.addEventListener('click', (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const randomEmoji = Object.keys(emojis)[Math.floor(Math.random() * 3)];
  entities.push(new Entity(x, y, randomEmoji));
});

// Update game state
function update() {
  drawBackground();
  entities.forEach((entity, i) => {
    entity.move();
    entity.draw();
    entities.slice(i + 1).forEach(other => {
      if (entity.collideWith(other)) entity.interact(other);
    });
  });
  requestAnimationFrame(update);
}

update();
