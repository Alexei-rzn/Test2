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
        this.moves = 0; // количество ходов
        this.initGame();
    }

    initGame() {
        this.grid = Array.from({ length: 4 }, () => Array(4).fill(0));
        this.score = 0;
        this.balance = 100;
        this.history = [];
        this.maxTile = 0;
        this.additionalClicks = 0;
        this.moves = 0; // сбросить количество ходов при новой игре
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
            this.moves++; // Увеличить количество ходов
            if (this.soundEnabled) this.moveSound.play();
            setTimeout(() => {
                this.addNewTile();
                this.updateGrid();
            }, 200);
        }
    }

    slideRow(row, direction) {
        let newRow = row.filter(value => value);
        const emptySpaces = 4 - newRow.length;
        let moved = false;
        let combined = false;

        newRow = direction === 'left'
            ? [...newRow, ...Array(emptySpaces).fill(0)]
            : [...Array(emptySpaces).fill(0), ...newRow];

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

    slideColumn(column, direction) {
        let newColumn = column.filter(value => value);
        let moved = false;
        let combined = false;

        while (newColumn.length < 4) {
            direction === 'up' ? newColumn.push(0) : newColumn.unshift(0);
        }

        if (direction === 'up') {
            for (let i = 0; i < 3; i++) {
                if (newColumn[i] !== 0 && newColumn[i] === newColumn[i + 1]) {
                    newColumn[i] *= 2;
                    this.score += newColumn[i];
                    newColumn[i + 1] = 0;
                    combined = true;
                    if (this.soundEnabled) this.mergeSound.play();
                }
            }
        } else {
            for (let i = 3; i > 0; i--) {
                if (newColumn[i] !== 0 && newColumn[i] === newColumn[i - 1]) {
                    newColumn[i] *= 2;
                    this.score += newColumn[i];
                    newColumn[i - 1] = 0;
                    combined = true;
                    if (this.soundEnabled) this.mergeSound.play();
                }
            }
        }

        if (JSON.stringify(newColumn) !== JSON.stringify(column)) {
            moved = true;
        }

        newColumn = newColumn.filter(value => value);
        while (newColumn.length < 4) {
            direction === 'up' ? newColumn.push(0) : newColumn.unshift(0);
        }

        this.maxTile = Math.max(this.maxTile, ...newColumn);

        return { newColumn, moved, combined };
    }

    saveToLeaderboard(name) {
        const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
        leaderboard.push({
            name,
            score: this.score,
            tile: this.maxTile,
            moves: this.moves,
            clicks: this.additionalClicks,
            difficulty: this.currentDifficulty + 1,
            date: new Date().toLocaleString()
        });
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    }

    start() {
        this.setupTouchControls();
        this.updateGrid();
    }

    setDifficulty(level) {
        if (this.grid.flat().filter(value => value > 0).length < 3) { // Изменение сложности только если менее 3 плиток
            this.tileProbability = [90 - level * 10, 10 + level * 10];
            this.currentDifficulty = level;
            this.canChangeDifficulty = false;
        }
    }
}

const game = new Game2048();
game.start();
