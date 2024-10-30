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
        this.tileProbability = [90, 10];
        this.currentDifficulty = 0;
        this.canChangeDifficulty = true;

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
        let emptyCells = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.grid[i][j] === 0) emptyCells.push({ i, j });
            }
        }
        if (emptyCells.length) {
            const { i, j } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.grid[i][j] = Math.random() < this.tileProbability[0] / 100 ? 2 : 4;
            this.saveState();
        }
    }

    updateBackgroundColor() {
        const bodyStyle = document.body.style;
        const hue = this.maxTile * 10;
        bodyStyle.backgroundColor = `hsl(${hue}, 60%, 90%)`;
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
        this.updateBackgroundColor();

        if (this.checkGameOver()) {
            this.gameOverDisplay.classList.remove("hidden");
            this.finalScoreDisplay.innerText = this.score;
            if (this.soundEnabled) this.gameOverSound.play();
            this.playerNameInput.classList.remove("hidden");
            this.submitScoreButton.classList.remove("hidden");
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
        let combined = false;

        switch (direction) {
            case 'left':
                for (let i = 0; i < 4; i++) {
                    const result = this.slideRow(this.grid[i], direction);
                    if (result.moved) moved = true;
                    if (result.combined) combined = true;
                    this.grid[i] = result.newRow;
                }
                break;

            case 'right':
                for (let i = 0; i < 4; i++) {
                    const result = this.slideRow(this.grid[i].slice().reverse(), 'left');
                    if (result.moved) moved = true;
                    if (result.combined) combined = true;
                    this.grid[i] = result.newRow.reverse();
                }
                break;

            case 'up':
                for (let j = 0; j < 4; j++) {
                    const column = [this.grid[0][j], this.grid[1][j], this.grid[2][j], this.grid[3][j]];
                    const result = this.slideColumn(column, 'up');
                    for (let i = 0; i < 4; i++) {
                        this.grid[i][j] = result.newColumn[i];
                    }
                    if (result.moved) moved = true;
                    if (result.combined) combined = true;
                }
                break;

            case 'down':
                for (let j = 0; j < 4; j++) {
                    const column = [this.grid[0][j], this.grid[1][j], this.grid[2][j], this.grid[3][j]];
                    const result = this.slideColumn(column, 'down');
                    for (let i = 0; i < 4; i++) {
                        this.grid[i][j] = result.newColumn[i];
                    }
                    if (result.moved) moved = true;
                    if (result.combined) combined = true;
                }
                break;
        }

        if (moved || combined) {
            if (this.soundEnabled) this.moveSound.play();
            setTimeout(() => {
                this.addNewTile();
                this.updateGrid();
            }, 200);
        }
    }

    slideRow(row, direction) {
        let newRow = row
                        .filter(val => val !== 0); // Удаляем нулевые элементы
        const combinedRow = [];

        for (let i = 0; i < newRow.length; i++) {
            if (newRow[i] === newRow[i + 1] && !combinedRow.includes(newRow[i])) {
                combinedRow.push(newRow[i] * 2);
                this.score += newRow[i] * 2; // Увеличиваем счёт
                this.maxTile = Math.max(this.maxTile, newRow[i] * 2); // Максимальная плитка
                i++; // Пропускаем следующий элемент
            } else {
                combinedRow.push(newRow[i]);
            }
        }

        // Заполняем оставшиеся пустые места нулями
        while (combinedRow.length < 4) {
            combinedRow.push(0);
        }

        const moved = combinedRow.toString() !== row.toString();
        return { newRow: combinedRow, moved, combined: combinedRow.length !== newRow.length };
    }

    slideColumn(column, direction) {
        // Работает аналогично slideRow, но с колонками
        const newColumn = column.filter(val => val !== 0);
        const combinedColumn = [];

        for (let i = 0; i < newColumn.length; i++) {
            if (newColumn[i] === newColumn[i + 1] && !combinedColumn.includes(newColumn[i])) {
                combinedColumn.push(newColumn[i] * 2);
                this.score += newColumn[i] * 2;
                this.maxTile = Math.max(this.maxTile, newColumn[i] * 2);
                i++;
            } else {
                combinedColumn.push(newColumn[i]);
            }
        }

        // Заполняем оставшиеся пустые места нулями
        while (combinedColumn.length < 4) {
            combinedColumn.push(0);
        }

        const moved = combinedColumn.toString() !== column.toString();
        return { newColumn: combinedColumn, moved, combined: combinedColumn.length !== newColumn.length };
    }

    saveState() {
        this.history.push({
            grid: this.grid.map(row => row.slice()),
            score: this.score,
            balance: this.balance,
            additionalClicks: this.additionalClicks
        });
    }

    undo() {
        if (this.history.length > 1) {
            this.history.pop(); // Убираем текущее состояние
            const lastState = this.history[this.history.length - 1]; // Последнее состояние
            this.grid = lastState.grid;
            this.score = lastState.score;
            this.balance = lastState.balance;
            this.additionalClicks = lastState.additionalClicks;
            this.updateGrid();
        }
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        const soundIcon = document.getElementById("sound-icon");
        soundIcon.src = this.soundEnabled ? "sound-on.png" : "sound-off.png";
    }
}

// Инициализация игры
const game2048 = new Game2048();

// Обработка действий игрока
document.addEventListener("keydown", (event) => {
    if (!game2048.gameOverDisplay.classList.contains("hidden")) return;

    switch (event.key) {
        case 'ArrowLeft':
            game2048.move('left');
            break;
        case 'ArrowRight':
            game2048.move('right');
            break;
        case 'ArrowUp':
            game2048.move('up');
            break;
        case 'ArrowDown':
            game2048.move('down');
            break;
    }
});

// Перезапуск игры
document.getElementById("restart").addEventListener("click", () => {
    game2048.initGame();
});

// Обработка кнопки "Слышимость"
document.getElementById("sound").addEventListener("click", () => {
    game2048.toggleSound();
});

// Обработка кнопки "Ход назад"
document.getElementById("undo").addEventListener("click", () => {
    game2048.undo();
});

// Обработка кнопки "Добавить средства"
document.getElementById("add-funds").addEventListener("click", () => {
    game2048.balance += 50; // Добавить 50 к балансу
    game2048.updateGrid();
});

// Обработка кнопки "Правила"
document.getElementById("rules").addEventListener("click", () => {
    window.location.href = "rules.html";
});

// Обработка кнопки "Турнирная таблица"
document.getElementById("rating").addEventListener("click", () => {
    window.location.href = "victory.html";
});

// Запись результата на турнире
document.getElementById("submit-score").addEventListener("click", () => {
    const name = game2048.playerNameInput.value.trim();
    if (!name) {
        alert("Пожалуйста, введите ваше имя!");
        return;
    }

    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboard.push({
        name,
        score: game2048.score,
        date: new Date().toLocaleString(),
        tile: game2048.maxTile,
        difficulty: game2048.currentDifficulty,
        additionalClicks: game2048.additionalClicks
    });
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    alert("Ваш результат сохранён!");
});
