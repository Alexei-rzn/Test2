class Game2048 {
    constructor() {
        this.gridContainer = document.getElementById("grid-container");
        this.scoreDisplay = document.getElementById("score");
        this.balanceDisplay = document.getElementById("balance");
        this.gameOverDisplay = document.getElementById("game-over");
        this.finalScoreDisplay = document.getElementById("final-score-value");
        this.playerNameInput = document.getElementById("player-name");
        this.submitScoreButton = document.getElementById("submit-score");

        this.moveSound = document.getElementById("move-sound");
        this.mergeSound = document.getElementById("merge-sound");
        this.gameOverSound = document.getElementById("game-over-sound");

        this.grid = [];
        this.score = 0;
        this.balance = 100;
        this.history = [];
        this.soundEnabled = true;
        this.maxTile = 0;
        this.additionalClicks = 0;

        this.initGame();
    }

    initGame() {
        this.grid = Array.from({ length: 4 }, () => Array(4).fill(0));
        this.score = 0; 
        this.balance = 100; 
        this.history = [];
        this.maxTile = 0;
        this.additionalClicks = 0;
        this.addNewTile();
        this.addNewTile();
        this.updateGrid();
    }

    addNewTile() {
        const emptyCells = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.grid[i][j] === 0) emptyCells.push({ i, j });
            }
        }
        if (emptyCells.length) {
            const { i, j } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.grid[i][j] = Math.random() < 0.8 ? 2 : 4;
            this.saveState();
        }
    }

    updateGrid() {
        this.gridContainer.innerHTML = '';
        this.grid.forEach(row => {
            row.forEach(tile => {
                const tileElement = document.createElement("div");
                tileElement.classList.add("tile");
                if (tile > 0) {
                    tileElement.classList.add(`tile-${tile}`);
                    tileElement.innerText = tile;
                } else {
                    tileElement.innerText = '';
                }
                this.gridContainer.appendChild(tileElement);
            });
        });
        this.scoreDisplay.innerText = this.score;
        this.balanceDisplay.innerText = this.balance;
        this.updateBackgroundColor(this.maxTile);
        
        if (this.checkGameOver()) {
            this.gameOverDisplay.classList.remove("hidden");
            this.finalScoreDisplay.innerText = this.score;
            if (this.soundEnabled) this.gameOverSound.play();
            this.playerNameInput.classList.remove("hidden");
            this.submitScoreButton.classList.remove("hidden");
        }
    }

    updateBackgroundColor(maxTileValue) {
        const colors = {
            2: '#ffecb3', 4: '#ffe0b2', 8: '#ffcc80',
            16: '#ffb74d', 32: '#ffa726', 64: '#fb8c00',
            128: '#f57c00', 256: '#ef6c00', 512: '#e65100',
            1024: '#bf360c', 2048: '#b71c1c'
        };
        document.body.style.backgroundColor = colors[maxTileValue] || '#8cceff';
    }

    checkGameOver() {
        return this.grid.flat().every(cell => cell !== 0) &&
            !this.grid.some((row, i) => row.some((cell, j) => 
                (j < 3 && cell === row[j + 1]) || (i < 3 && cell === this.grid[i + 1][j])
            ));
    }

    move(direction) {
        // Логика передвижения плиток
        // Код перемещения плиток с учетом направления
        // ...
        this.updateGrid();
    }

    saveState() {
        if (this.history.length >= 10) {
            this.history.shift();
        }
        this.history.push(JSON.parse(JSON.stringify(this.grid)));
    }

    // Дополнительные методы для управления игрой и обработки событий
    // ...
}

// Инициализация игры
const game = new Game2048();
