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
const MIN_SPEED = 0.5; // Slower for better visibility
const MAX_SPEED = 2;
const SPAWN_PADDING = 20;

// Arena Bounds
const ARENA_BOUNDS = {
    width: arena.offsetWidth,
    height: arena.offsetHeight
};

// Utility Functions
function random(min, max) {
    return Math.random() * (max - min) + min;
}

function checkCollision(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < a.size;
}

function resolveCollision(emojiA, emojiB) {
    if (emojiA.type === "🪨" && emojiB.type === "✂️") {
        emojiB.type = "🪨";
    } else if (emojiA.type === "✂️" && emojiB.type === "📄") {
        emojiB.type = "✂️";
    } else if (emojiA.type === "📄" && emojiB.type === "🪨") {
        emojiB.type = "📄";
    }
    emojiB.element.textContent = emojiB.type;
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

        // Create visible emoji
        this.element = document.createElement("div");
        this.element.className = "emoji";
        this.element.textContent = this.type;

        // Style for visible emoji
        this.element.style.fontSize = `${this.size}px`;
        this.element.style.position = "absolute";

        // Invisible hitbox
        this.hitbox = document.createElement("div");
        this.hitbox.className = "hitbox";
        this.hitbox.style.position = "absolute";
        this.hitbox.style.width = `${this.size}px`;
        this.hitbox.style.height = `${this.size}px`;
        this.hitbox.style.visibility = "hidden"; // Invisible hitbox

        arena.appendChild(this.hitbox);
        arena.appendChild(this.element);
        this.updatePosition();
    }

    updatePosition() {
        // Position emoji
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;

        // Position hitbox (aligned with emoji)
        this.hitbox.style.left = `${this.x}px`;
        this.hitbox.style.top = `${this.y}px`;
    }

    move() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce off walls
        if (this.x <= SPAWN_PADDING || this.x >= ARENA_BOUNDS.width - this.size - SPAWN_PADDING) {
            this.speedX *= -1;
        }
        if (this.y <= SPAWN_PADDING || this.y >= ARENA_BOUNDS.height - this.size - SPAWN_PADDING) {
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
    const spawnRegions = [
        { xMin: 0, yMin: 0, xMax: ARENA_BOUNDS.width / 3, yMax: ARENA_BOUNDS.height / 3 },
        { xMin: ARENA_BOUNDS.width / 3 * 2, yMin: 0, xMax: ARENA_BOUNDS.width, yMax: ARENA_BOUNDS.height / 3 },
        { xMin: 0, yMin: ARENA_BOUNDS.height / 3 * 2, xMax: ARENA_BOUNDS.width / 3, yMax: ARENA_BOUNDS.height }
    ];

    const size = 15;

    EMOJI_TYPES.forEach((type, regionIndex) => {
        for (let i = 0; i < Math.floor(count / EMOJI_TYPES.length); i++) {
            const region = spawnRegions[regionIndex];
            const x = random(region.xMin + SPAWN_PADDING, region.xMax - size - SPAWN_PADDING);
            const y = random(region.yMin + SPAWN_PADDING, region.yMax - size - SPAWN_PADDING);
            const speedX = random(MIN_SPEED, MAX_SPEED) * (Math.random() > 0.5 ? 1 : -1);
            const speedY = random(MIN_SPEED, MAX_SPEED) * (Math.random() > 0.5 ? 1 : -1);

            emojis.push(new Emoji(type, x, y, size, speedX, speedY));
        }
    });

    animate();
}

function resetGame() {
    cancelAnimationFrame(animationFrame);
    emojis.forEach(emoji => {
        emoji.element.remove();
        emoji.hitbox.remove();
    });
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
