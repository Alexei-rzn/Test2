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
        this.maxTile = 0;
        this.additionalClicks = 0;

        this.initGame();
        this.setupControls();
    }

    initGame() {
        this.grid = Array.from({ length: 4 }, () => Array(4).fill(0));
        this.score = 0;
        this.maxTile = 0;
        this.addNewTile();
        this.addNewTile();
        this.updateGrid();
    }

    addNewTile() {
        let emptyCells = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.grid[i][j] === 0) emptyCells.push({ i, j });
            }
        }
        if (emptyCells.length) {
            const { i, j } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.grid[i][j] = Math.random() < 0.9 ? 2 : 4; // 90% шанс на 2, 10% на 4
            this.updateGrid();
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

        if (this.checkGameOver()) {
            this.gameOverDisplay.classList.remove("hidden");
            this.finalScoreDisplay.innerText = this.score;
            this.playerNameInput.classList.remove("hidden");
            this.submitScoreButton.classList.remove("hidden");
            if (this.soundEnabled) this.gameOverSound.play();
        }
    }

    checkGameOver() {
        return this.grid.flat().every(cell => cell !== 0) &&
               !this.grid.some((row, i) => row.some((cell, j) =>
                   (j < 3 && cell === row[j + 1]) || (i < 3 && cell === this.grid[i + 1][j])
               ));
    }

    move(direction) {
        let moved = false;

        // Обработка движения в зависимости от направления
        switch (direction) {
            case 'left':
                for (let i = 0; i < 4; i++) {
                    const result = this.slideRow(this.grid[i]);
                    if (result.moved) moved = true;
                    this.grid[i] = result.newRow;
                }
                break;

            case 'right':
                for (let i = 0; i < 4; i++) {
                    const result = this.slideRow(this.grid[i].slice().reverse());
                    if (result.moved) moved = true;
                    this.grid[i] = result.newRow.reverse();
                }
                break;

            case 'up':
                for (let j = 0; j < 4; j++) {
                    const column = [this.grid[0][j], this.grid[1][j], this.grid[2][j], this.grid[3][j]];
                    const result = this.slideColumn(column);
                    for (let i = 0; i < 4; i++) {
                        this.grid[i][j] = result.newColumn[i];
                    }
                    if (result.moved) moved = true;
                }
                break;

            case 'down':
                for (let j = 0; j < 4; j++) {
                    const column = [this.grid[0][j], this.grid[1][j], this.grid[2][j], this.grid[3][j]];
                    const result = this.slideColumn(column.reverse());
                    for (let i = 0; i < 4; i++) {
                        this.grid[i][j] = result.newColumn.reverse()[i];
                    }
                    if (result.moved) moved = true;
                }
                break;
        }

        if (moved) {
            if (this.soundEnabled) this.moveSound.play();
            this.addNewTile();
            this.updateGrid();
        }
    }

    slideRow(row) {
        const newRow = row.filter(tile => tile !== 0); // Убираем нули
        let moved = false;

        // Объединение плиток
        for (let i = 0; i < newRow.length - 1; i++) {
            if (newRow[i] === newRow[i + 1]) {
                newRow[i] *= 2; // Удвичение плитки
                this.score += newRow[i];
                this.maxTile = Math.max(this.maxTile, newRow[i]);
                newRow[i + 1] = 0; // Обнуляем следующую плитку
                moved = true;
            }
        }

        // Убираем нули после объединения
        const finalRow = newRow.filter(tile => tile !== 0);
        while (finalRow.length < 4) {
            finalRow.push(0); // Заполняем до 4 плиток
        }

        return { newRow: finalRow, moved };
    }

    slideColumn(column) {
        const newColumn = column.filter(tile => tile !== 0); // Убираем нули
        let moved = false;

        // Объединение плиток
        for (let i = 0; i < newColumn.length - 1; i++) {
            if (newColumn[i] === newColumn[i + 1]) {
                newColumn[i] *= 2; // Удвичение плитки
                this.score += newColumn[i];
                this.maxTile = Math.max(this.maxTile, newColumn[i]);
                newColumn[i + 1] = 0; // Обнуляем следующую плитку
                moved = true;
            }
        }

        // Убираем нули после объединения
        const finalColumn = newColumn.filter(tile => tile !== 0);
        while (finalColumn.length < 4) {
            finalColumn.push(0); // Заполняем до 4 плиток
        }

        return { newColumn: finalColumn, moved };
    }

    setupControls() {
        // Клавиатурное управление
        document.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'ArrowLeft':
                    this.move('left');
                    break;
                case 'ArrowRight':
                    this.move('right');
                    break;
                case 'ArrowUp':
                    this.move('up');
                    break;
                case 'ArrowDown':
                    this.move('down');
                    break;
            }
        });

        // Сенсорное управление
        this.setupTouchControls();
    }

    setupTouchControls() {
        let touchstartX = 0;
        let touchendX = 0;
        let touchstartY = 0;
        let touchendY = 0;

        const element = this.gridContainer;

        element.addEventListener('touchstart', event => {
            touchstartX = event.changedTouches[0].clientX;
            touchstartY = event.changedTouches[0].clientY;
        });

        element.addEventListener('touchend', event => {
            touchendX = event.changedTouches[0].clientX;
            touchendY = event.changedTouches[0].clientY;

            this.handleSwipe();
        });

        this.handleSwipe = () => {
            const deltaX = touchendX - touchstartX;
            const deltaY = touchendY - touchstartY;

            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                // Горизонтальный сдвиг
                if (deltaX > 0) {
                    this.move('right');
                } else {
                    this.move('left');
                }
            } else {
                // Вертикальный сдвиг
                if (deltaY > 0) {
                    this.move('down');
                } else {
                    this.move('up');
                }
            }
        };
    }
}

// Создание и инициализация игры
document.addEventListener('DOMContentLoaded', () => {
    const game = new Game2048();
});
            
