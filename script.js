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
const MAX_SPEED = 1.2; // Adjusted for better performance
const MIN_SPEED = 0.6; // Slow but observable
const EMOJI_SIZE = 15; // Standard emoji size
const SPAWN_REGION_SIZE = 120; // Square size for corner spawn regions
const ARENA_PADDING = EMOJI_SIZE * 2; // Ensures emojis don't spawn too close to walls

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

        // Bounce off walls
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
    const count = parseInt(emojiCountInput.value);
    const perCornerCount = Math.ceil(count / 4);
    const cornerRegions = [
        { x: ARENA_PADDING, y: ARENA_PADDING }, // Top-left
        { x: arena.offsetWidth - SPAWN_REGION_SIZE - ARENA_PADDING, y: ARENA_PADDING }, // Top-right
        { x: ARENA_PADDING, y: arena.offsetHeight - SPAWN_REGION_SIZE - ARENA_PADDING }, // Bottom-left
        { x: arena.offsetWidth - SPAWN_REGION_SIZE - ARENA_PADDING, y: arena.offsetHeight - SPAWN_REGION_SIZE - ARENA_PADDING } // Bottom-right
    ];

    cornerRegions.forEach(corner => {
        for (let i = 0; i < perCornerCount && emojis.length < count; i++) {
            const type = EMOJI_TYPES[i % EMOJI_TYPES.length];
            let x, y;
            let validPosition = false;

            while (!validPosition) {
                x = random(corner.x, corner.x + SPAWN_REGION_SIZE - EMOJI_SIZE);
                y = random(corner.y, corner.y + SPAWN_REGION_SIZE - EMOJI_SIZE);

                // Ensure no overlap
                validPosition = emojis.every(e => {
                    const dx = e.x - x;
                    const dy = e.y - y;
                    return Math.sqrt(dx * dx + dy * dy) > EMOJI_SIZE * 2;
                });
            }

            const speedX = random(MIN_SPEED, MAX_SPEED) * (Math.random() > 0.5 ? 1 : -1);
            const speedY = random(MIN_SPEED, MAX_SPEED) * (Math.random() > 0.5 ? 1 : -1);
            emojis.push(new Emoji(type, x, y, EMOJI_SIZE, speedX, speedY));
        }
    });

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
