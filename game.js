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
        this.balance = 100; // Начальный баланс
        this.canChangeDifficulty = true; // Переменная для установки сложности
        this.difficulty = 1; // Начальный уровень сложности
        this.initGame();
    }

    initGame() {
        this.resetGame();
        this.addNewTile(); // Добавляем первую плитку
        this.addNewTile(); // Добавляем вторую плитку
        this.updateGrid(); // Обновляем отображение сетки
        this.attachEventListeners(); // Подключаем обработчики событий
    }

    resetGame() {
        this.grid = Array.from({ length: 4 }, () => Array(4).fill(0));
        this.score = 0;
        this.updateBalance(-10); // Уменьшаем баланс при перезапуске
    }

    updateBalance(amount) {
        this.balance += amount;
        this.balanceDisplay.innerText = this.balance;
    }

    addNewTile() {
        let emptyCells = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.grid[i][j] === 0) {
                    emptyCells.push({ i, j });
                }
            }
        }

        if (emptyCells.length > 0) {
            const { i, j } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.grid[i][j] = Math.random() < 0.9 ? 2 : 4; // Вероятность появления 2 или 4
        }
    }

    updateGrid() {
        this.gridContainer.innerHTML = ''; // Очищаем контейнер
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
        this.scoreDisplay.innerText = this.score; // Обновление счётчика
        if (this.checkGameOver()) {
            this.gameOverDisplay.classList.remove("hidden");
            this.finalScoreDisplay.innerText = this.score;
            if (this.gameOverSound) this.gameOverSound.play(); // Игра окончена, звуковой сигнал
        }
    }

    checkGameOver() {
        return this.grid.flat().every(cell => cell !== 0) &&
            !this.grid.some((row, i) => row.some((cell, j) =>
                (j < 3 && cell === row[j + 1]) || (i < 3 && cell === this.grid[i + 1][j])
            ));
    }

    move(direction) {
        let hasMoved = false;

        switch (direction) {
            case 'left':
                for (let i = 0; i < 4; i++) {
                    const result = this.slideRow(this.grid[i]);
                    if (result.moved) hasMoved = true;
                    this.grid[i] = result.newRow;
                }
                break;
            case 'right':
                for (let i = 0; i < 4; i++) {
                    const result = this.slideRow(this.grid[i].slice().reverse());
                    if (result.moved) hasMoved = true;
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
                    if (result.moved) hasMoved = true;
                }
                break;
            case 'down':
                for (let j = 0; j < 4; j++) {
                    const column = [this.grid[0][j], this.grid[1][j], this.grid[2][j], this.grid[3][j]];
                    const result = this.slideColumn(column.reverse());
                    for (let i = 0; i < 4; i++) {
                        this.grid[i][j] = result.newColumn.reverse()[i];
                    }
                    if (result.moved) hasMoved = true;
                }
                break;
        }

        if (hasMoved) {
            this.addNewTile(); // Если произошло движение, добавляем новую плитку
            this.updateGrid(); // Обновляем отображение сетки
        }
    }

    slideRow(row) {
        let newRow = row.filter(cell => cell !== 0); // Убираем нули
        let moved = false;

        for (let i = 0; i < newRow.length - 1; i++) {
            if (newRow[i] === newRow[i + 1]) { // Проверка на объединение
                newRow[i] *= 2; // Объединяем плитки
                this.score += newRow[i];
                this.updateBalance(5); // Увеличиваем баланс за объединение
                newRow.splice(i + 1, 1); // Удаляем вторую плитку
                moved = true;
            }
        }

        while (newRow.length < 4) {
            newRow.push(0); // Заполняем оставшиеся нули
        }

        return { newRow, moved };
    }

    slideColumn(column) {
        let newColumn = column.filter(cell => cell !== 0); // Убираем нули
        let moved = false;

        for (let i = 0; i < newColumn.length - 1; i++) {
            if (newColumn[i] === newColumn[i + 1]) {
                newColumn[i] *= 2;
                this.score += newColumn[i];
                this.updateBalance(5); // Увеличиваем баланс за объединение
                newColumn.splice(i + 1, 1);
                moved = true;
            }
        }

        while (newColumn.length < 4) {
            newColumn.push(0); // Заполняем оставшиеся нули
        }

        return { newColumn, moved };
    }

    attachEventListeners() {
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
                case 'r':
                    this.resetGame();
                    this.updateGrid();
                    break;
            }
        });

        this.submitScoreButton.addEventListener('click', () => {
            const playerName = this.playerNameInput.value;
            if (playerName) {
                // Сохранить результат в локальном хранилище
                let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
                leaderboard.push({ name: playerName, score: this.score, date: new Date().toLocaleString() });
                localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
                alert('Результат сохранён!');
            } else {
                alert('Пожалуйста, введите ваше имя.');
            }
        });

        document.getElementById("restart").addEventListener("click", () => {
            this.resetGame();
            this.updateGrid();
            this.gameOverDisplay.classList.add("hidden");
        });
    }
}

// Инициализация игры при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new Game2048();
});
            
