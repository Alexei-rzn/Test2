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
        this.difficultyLevel = 1; // Уровень сложности

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

    updateBackgroundColor() {
        const bodyStyle = document.body.style;
        const colorMap = {
            2: '#ffecb3',
            4: '#ffe0b2',
            8: '#ffcc80',
            16: '#ffb74d',
            32: '#ffa726',
            64: '#fb8c00',
            128: '#f57c00',
            256: '#ef6c00',
            512: '#e65100',
            1024: '#bf360c',
            2048: '#b71c1c',
            default: '#8cceff'
        };
        bodyStyle.backgroundColor = colorMap[this.maxTile] || colorMap.default;
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
            this.grid[i][j] = Math.random() < this.getTileProbability() ? 2 : 4;
            this.saveState();
        }
    }

    getTileProbability() {
        switch (this.difficultyLevel) {
            case 1: return 0.9; // 90% для 2
            case 2: return 0.8; // 80% для 2
            case 3: return 0.7; // 70% для 2
            case 4: return 0.6; // 60% для 2
            case 5: return 0.5; // 50% для 2
            default: return 0.9;
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
    saveState() {
        if (this.history.length >= 10) {
            this.history.shift();
        }
        this.history.push(JSON.parse(JSON.stringify(this.grid)));
    }

    loadLeaderboard() {
        const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
        const leaderboardTable = document.getElementById('leaderboard');
        leaderboardTable.innerHTML = `
            <tr>
                <th>Имя</th>
                <th>Счёт</th>
                <th>Дата</th>
                <th>Макс. плитка</th>
                <th>Доп. кнопки</th>
                <th>Уровень сложности</th>
            </tr>
        `;
        const today = new Date().toISOString().split('T')[0]; // Получаем текущую дату
        leaderboard.forEach(entry => {
            const entryDate = new Date(entry.date).toISOString().split('T')[0];
            if (entry.tile >= 2048 || entryDate === today) {
                const row = document.createElement('tr');
                row.innerHTML = `<td>${entry.name}</td><td>${entry.score}</td><td>${entry.date}</td><td>${entry.tile}</td><td>${entry.additionalClicks}</td><td>${entry.difficulty}</td>`;
                leaderboardTable.appendChild(row);
            }
        });
    }

    saveToLeaderboard(name) {
        const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
        leaderboard.push({ 
            name, 
            score: this.score, 
            date: new Date().toLocaleString(), 
            tile: this.maxTile, 
            additionalClicks: this.additionalClicks,
            difficulty: this.difficultyLevel
        });
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    }
}

const game2048 = new Game2048();
