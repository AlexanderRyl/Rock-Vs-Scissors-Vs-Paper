const canvas = document.getElementById('arena');
const ctx = canvas.getContext('2d');

// Adjust canvas size
canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.8;

const emojis = {
    '🪨': { beats: '✂️', color: 'gray' },
    '📄': { beats: '🪨', color: 'blue' },
    '✂️': { beats: '📄', color: 'red' },
};

class Entity {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.size = 40;
        this.type = type;
        this.dx = (Math.random() - 0.5) * 6;
        this.dy = (Math.random() - 0.5) * 6;
    }

    draw() {
        ctx.fillStyle = emojis[this.type].color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'white';
        ctx.fillText(this.type, this.x, this.y);
    }

    move() {
        this.x += this.dx;
        this.y += this.dy;

        if (this.x - this.size / 2 <= 0 || this.x + this.size / 2 >= canvas.width) {
            this.dx *= -1;
        }
        if (this.y - this.size / 2 <= 0 || this.y + this.size / 2 >= canvas.height) {
            this.dy *= -1;
        }
    }

    collideWith(other) {
        const distance = Math.hypot(this.x - other.x, this.y - other.y);
        return distance < this.size;
    }

    interact(other) {
        if (emojis[this.type].beats === other.type) {
            other.type = this.type;
        }
    }
}

const entities = [
    new Entity(100, 100, '🪨'),
    new Entity(400, 400, '📄'),
    new Entity(700, 700, '✂️'),
];

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < entities.length; i++) {
        const entity = entities[i];
        entity.move();
        entity.draw();

        for (let j = i + 1; j < entities.length; j++) {
            const other = entities[j];
            if (entity.collideWith(other)) {
                entity.interact(other);
            }
        }
    }

    requestAnimationFrame(update);
}

update();
