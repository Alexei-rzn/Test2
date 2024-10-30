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
                    const result = this.slideRow(this.grid[i]);
                    if (result.moved) moved = true;
                    if (result.combined) combined = true;
                    this.grid[i] = result.newRow;
                }
                break;

            case 'right':
                for (let i = 0; i < 4; i++) {
                    const result = this.slideRow(this.grid[i].slice().reverse()).newRow.reverse();
                    if (result.moved) moved = true;
                    if (result.combined) combined = true;
                    this.grid[i] = result;
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
                    if (result.combined) combined = true;
                }
                break;

            case 'down':
                for (let j = 0; j < 4; j++) {
                    const column = [this.grid[0][j], this.grid[1][j], this.grid[2][j], this.grid[3][j]];
                    const result = this.slideColumn(column.reverse()).newColumn.reverse();
                    for (let i = 0; i < 4; i++) {
                        this.grid[i][j] = result[i];
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

    slideRow(row) {
        let newRow = row.filter(value => value);
        const emptySpaces = 4 - newRow.length;
        let moved = false;
        let combined = false;

        newRow = [...newRow, ...Array(emptySpaces).fill(0)];

        for (let i = 0; i < 3; i++) {
            if (newRow[i] !== 0 && newRow[i] === newRow[i + 1]) {
                newRow[i] *= 2;
                this.score += newRow[i];
                newRow[i + 1] = 0;
                combined = true;
                if (this.soundEnabled) this.mergeSound.play();
            }
        }

        if (JSON.stringify(newRow) !== JSON.stringify(row)) {
            moved = true;
        }

        newRow = newRow.filter(value => value);
        while (newRow.length < 4) newRow.push(0);

        this.maxTile = Math.max(this.maxTile, ...newRow);

        return { newRow, moved, combined };
    }

    slideColumn(column) {
        let newColumn = column.filter(value => value);
        let moved = false;
        let combined = false;

        while (newColumn.length < 4) {
            newColumn.push(0);
        }

        for (let i = 0; i < 3; i++) {
            if (newColumn[i] !== 0 && newColumn[i] === newColumn[i + 1]) {
                newColumn[i] *= 2;
                this.score += newColumn[i];
                newColumn[i + 1] = 0;
                combined = true;
                if (this.soundEnabled) this.mergeSound.play();
            }
        }

        if (JSON.stringify(newColumn) !== JSON.stringify(column)) {
            moved = true;
        }

        newColumn = newColumn.filter(value => value);
        while (newColumn.length < 4) {
            newColumn.push(0);
        }

        this.maxTile = Math.max(this.maxTile, ...newColumn);

        return { newColumn, moved, combined };
    }

    saveState() {
        if (this.history.length >= 10) {
            this.history.shift();
        }
        this.history.push(JSON.parse(JSON.stringify(this.grid)));
    }

    setupTouchControls() {
        let touchStartX = 0;
        let touchStartY = 0;

        this.gridContainer.addEventListener('touchstart', (event) => {
            touchStartX = event.touches[0].clientX;
            touchStartY = event.touches[0].clientY;
        });

        this.gridContainer.addEventListener('touchmove', (event) => {
            event.preventDefault();
        });

        this.gridContainer.addEventListener('touchend', (event) => {
            const touchEndX = event.changedTouches[0].clientX;
            const touchEndY = event.changedTouches[0].clientY;

            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;

            const absDeltaX = Math.abs(deltaX);
            const absDeltaY = Math.abs(deltaY);

            if (absDeltaX > absDeltaY && absDeltaX > 30) {
                this.move(deltaX > 0 ? 'right' : 'left');
            } else if (absDeltaY > absDeltaX && absDeltaY > 30) {
                this.move(deltaY > 0 ? 'down' : 'up');
            }
        });
    }

    saveToLeaderboard(name, difficulty) {
        const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
        const existingEntryIndex = leaderboard.findIndex(entry => entry.name === name && entry.tile === 2048);
        if (existingEntryIndex > -1) {
            leaderboard[existingEntryIndex].score = Math.max(leaderboard[existingEntryIndex].score, this.score);
            leaderboard[existingEntryIndex].date = new Date().toLocaleString();
            leaderboard[existingEntryIndex].additionalClicks += this.additionalClicks;
        } else {
            leaderboard.push({
                name,
                score: this.score,
                date: new Date().toLocaleString(),
                tile: this.maxTile,
                additionalClicks: this.additionalClicks,
                difficulty
            });
        }
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));

        // Сохранение в table.csv
        this.saveToCSV(name, difficulty);
    }

    saveToCSV(name, difficulty) {
        const csvData = `${name},${this.score},${new Date().toLocaleString()},${this.maxTile},${difficulty},${this.additionalClicks}\n`;
        const existingData = localStorage.getItem('tableData') || "Имя,Счёт,Дата,Макс. плитка,Уровень сложности,Доп. кнопки\n";
        localStorage.setItem('tableData', existingData + csvData);
    }

    start() {
        this.setupTouchControls();
        this.updateGrid();
    }

    setDifficulty(level) {
        if (this.grid.flat().filter(tile => tile > 0).length < 3) { // Условие для смены уровня сложности
            switch (level) {
                case 0: this.tileProbability = [90, 10]; break;
                case 1: this.tileProbability = [80, 20]; break;
                case 2: this.tileProbability = [70, 30]; break;
                case 3: this.tileProbability = [60, 40]; break;
                case 4: this.tileProbability = [50, 50]; break;
            }
        }
    }
}

const game = new Game2048();
game.start();
