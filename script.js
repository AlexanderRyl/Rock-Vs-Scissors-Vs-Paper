// script.js - Enhanced Core Game Logic

const canvas = document.getElementById('arena');
const ctx = canvas.getContext('2d');
const emojiTypes = ['🪨', '📄', '✂️'];
const entities = [];

// Resize canvas dynamically
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 100; // Adjust for controls
}

// Initialize arena shapes
function drawArenaShape(shape) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#00ffcc";
  ctx.lineWidth = 5;

  if (shape === "circle") {
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) / 3, 0, Math.PI * 2);
    ctx.stroke();
  } else if (shape === "square") {
    const size = Math.min(canvas.width, canvas.height) * 0.6;
    ctx.strokeRect((canvas.width - size) / 2, (canvas.height - size) / 2, size, size);
  } else if (shape === "hexagon" || shape === "octagon") {
    const sides = shape === "hexagon" ? 6 : 8;
    const radius = Math.min(canvas.width, canvas.height) / 3;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.beginPath();
    for (let i = 0; i <= sides; i++) {
      const angle = (i / sides) * Math.PI * 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  }
}

// Draw emojis
function drawEntities() {
  entities.forEach(entity => {
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(entity.type, entity.x, entity.y);
  });
}

// Spawn initial entities
function spawnInitialEntities() {
  for (let i = 0; i < 3; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const type = emojiTypes[i % emojiTypes.length];
    entities.push({ x, y, type });
  }
}

// Game update loop
function update() {
  const selectedShape = document.getElementById("map-shape").value;
  drawArenaShape(selectedShape);
  drawEntities();
  requestAnimationFrame(update);
}

// Initialize game setup
function initializeGame() {
  resizeCanvas();
  spawnInitialEntities();
  update();
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);
