// DOM Elements
const mainMenu = document.getElementById("main-menu");
const gameScreen = document.getElementById("game-screen");
const startButton = document.getElementById("start-button");
const backButton = document.getElementById("back-button");
const emojiCountInput = document.getElementById("emoji-count");
const spawnButton = document.getElementById("spawn-button");
const arena = document.getElementById("arena");
const winnerAnnouncement = document.getElementById("winner-announcement");

// Game Variables
let emojis = [];
let animationFrame;

// Constants
const EMOJI_TYPES = ["🪨", "📄", "✂️"];
const MAX_EMOJIS = 50;
const MIN_SPEED = 0.5; // Slower minimum speed
const MAX_SPEED = 2;   // Slower maximum speed
const CORNER_RADIUS = 100; // Spawn radius for corners
const EMOJI_SIZE = 15; // Standard size of emojis
const ARENA_PADDING = 20; // Padding to prevent emojis from spawning outside arena

// Utility Functions
function random(min, max) {
    return Math.random() * (max - min) + min;
}

function checkCollision(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < a.size + b.size;
}

function resolveCollision(emojiA, emojiB) {
    if (emojiA.type === "🪨" && emojiB.type === "✂️") {
        emojiB.type = "🪨";
    } else if (emojiA.type === "✂️" && emojiB.type === "📄") {
        emojiB.type = "✂️";
    } else if (emojiA.type === "📄" && emojiB.type === "🪨") {
        emojiB.type = "📄";
    }
}

// Emoji Class
class Emoji {
    constructor(type, x, y, size, speedX, speedY) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.size = size;
        this.speedX = speedX;
        this.speedY = speedY;
        this.element = document.createElement("div");
        this.element.className = "emoji";
        this.element.textContent = this.type;
        this.updatePosition();
        arena.appendChild(this.element);
    }

    updatePosition() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
        this.element.style.fontSize = `${this.size * 2}px`;
    }

    move() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce on walls
        if (this.x <= ARENA_PADDING || this.x >= arena.offsetWidth - this.size * 2 - ARENA_PADDING) {
            this.speedX *= -1;
        }
        if (this.y <= ARENA_PADDING || this.y >= arena.offsetHeight - this.size * 2 - ARENA_PADDING) {
            this.speedY *= -1;
        }

        this.updatePosition();
    }
}

// Game Functions
function startGame() {
    mainMenu.classList.add("hidden");
    gameScreen.classList.remove("hidden");
}

function backToMenu() {
    gameScreen.classList.add("hidden");
    mainMenu.classList.remove("hidden");
    resetGame();
}

function spawnEmojis() {
    resetGame();
    const count = Math.min(MAX_EMOJIS, parseInt(emojiCountInput.value));
    const cornerRegions = [
        { x: ARENA_PADDING, y: ARENA_PADDING }, // Top-left corner
        { x: arena.offsetWidth - CORNER_RADIUS - ARENA_PADDING, y: ARENA_PADDING }, // Top-right corner
        { x: ARENA_PADDING, y: arena.offsetHeight - CORNER_RADIUS - ARENA_PADDING }, // Bottom-left corner
        { x: arena.offsetWidth - CORNER_RADIUS - ARENA_PADDING, y: arena.offsetHeight - CORNER_RADIUS - ARENA_PADDING } // Bottom-right corner
    ];

    for (let i = 0; i < count; i++) {
        const type = EMOJI_TYPES[i % 3];
        let validPosition = false;
        let x, y;

        while (!validPosition) {
            const corner = cornerRegions[Math.floor(i / (count / 4))]; // Distribute emojis among corners
            x = random(corner.x, corner.x + CORNER_RADIUS);
            y = random(corner.y, corner.y + CORNER_RADIUS);

            // Ensure emoji is within arena boundaries
            if (
                x < ARENA_PADDING || x > arena.offsetWidth - EMOJI_SIZE * 2 - ARENA_PADDING ||
                y < ARENA_PADDING || y > arena.offsetHeight - EMOJI_SIZE * 2 - ARENA_PADDING
            ) {
                continue;
            }

            // Check for overlap with existing emojis
            validPosition = emojis.every(e => {
                const dx = e.x - x;
                const dy = e.y - y;
                return Math.sqrt(dx * dx + dy * dy) > EMOJI_SIZE * 2; // Ensure separation
            });
        }

        const speedX = random(MIN_SPEED, MAX_SPEED) * (Math.random() > 0.5 ? 1 : -1);
        const speedY = random(MIN_SPEED, MAX_SPEED) * (Math.random() > 0.5 ? 1 : -1);
        emojis.push(new Emoji(type, x, y, EMOJI_SIZE, speedX, speedY));
    }

    animate();
}

function resetGame() {
    cancelAnimationFrame(animationFrame);
    emojis.forEach(emoji => emoji.element.remove());
    emojis = [];
    winnerAnnouncement.classList.add("hidden");
}

function checkForWinner() {
    const types = new Set(emojis.map(e => e.type));
    if (types.size === 1) {
        winnerAnnouncement.textContent = `${Array.from(types)[0]} Wins!`;
        winnerAnnouncement.classList.remove("hidden");
        cancelAnimationFrame(animationFrame);
    }
}

function animate() {
    emojis.forEach(emoji => {
        emoji.move();
        emojis.forEach(other => {
            if (emoji !== other && checkCollision(emoji, other)) {
                resolveCollision(emoji, other);
                other.element.textContent = other.type;
            }
        });
    });

    checkForWinner();
    animationFrame = requestAnimationFrame(animate);
}

// Event Listeners
startButton.addEventListener("click", startGame);
backButton.addEventListener("click", backToMenu);
spawnButton.addEventListener("click", spawnEmojis);
