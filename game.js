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
        // Логика сдвига плиток

Function move(direction) {

    Let moved = false;

    Let combined = false;



    Switch (direction) {

        Case 'left':

            For (let i = 0; i < 4; i++) {

                Const result = slideRow(grid[i], direction);

                If (result.moved) moved = true;

                If (result.combined) combined = true;

                Grid[i] = result.newRow;

            }

            Break;



        Case 'right':

            For (let i = 0; i < 4; i++) {

                Const result = slideRow(grid[i].slice().reverse(), 'left');

                If (result.moved) moved = true;

                If (result.combined) combined = true;

                Grid[i] = result.newRow.reverse();

            }

            Break;



        Case 'up':

            For (let j = 0; j < 4; j++) {

                Const column = [grid[0][j], grid[1][j], grid[2][j], grid[3][j]];

                Const result = slideColumn(column, 'up');

                For (let i = 0; i < 4; i++) {

                    Grid[i][j] = result.newColumn[i];

                }

                If (result.moved) moved = true;

                If (result.combined) combined = true;

            }

            Break;



        Case 'down':

            For (let j = 0; j < 4; j++) {

                Const column = [grid[0][j], grid[1][j], grid[2][j], grid[3][j]];

                Const result = slideColumn(column, 'down');

                For (let i = 0; i < 4; i++) {

                    Grid[i][j] = result.newColumn[i];

                }

                If (result.moved) moved = true;

                If (result.combined) combined = true;

            }

            Break;

    }



    If (moved || combined) {

        If (soundEnabled) moveSound.play(); // Звук передвижения плиток

        setTimeout(() => {

            addNewTile(); // Добавляем новую плитку после хода

            updateGrid(); // Обновляем интерфейс

        }, 200);

    }

}



// Логика сдвига плиток в строке

Function slideRow(row, direction) {

    Let newRow = row.filter(value => value);

    Const emptySpaces = 4 – newRow.length;

    Let moved = false;

    Let combined = false;



    newRow = direction === 'left' 

        ? […newRow, …Array(emptySpaces).fill(0)] 

        : […Array(emptySpaces).fill(0), …newRow];



    For (let i = 0; i < 3; i++) {

        If (newRow[i] !== 0 && newRow[i] === newRow[i + 1]) {

            newRow[i] *= 2;

            score += newRow[i];

            newRow[i + 1] = 0;

            combined = true;

            if (soundEnabled) mergeSound.play(); // Звук слияния плиток

        }

    }



    If (JSON.stringify(newRow) !== JSON.stringify(row)) {

        Moved = true;

    }



    newRow = newRow.filter(value => value);

    while (newRow.length < 4) newRow.push(0);



    maxTile = Math.max(maxTile, …newRow); // Обновляем максимальную плитку



    return { newRow, moved, combined };

}



// Логика сдвига плиток в колонне

Function slideColumn(column, direction) {

    Let newColumn = column.filter(value => value);

    Let moved = false;

    Let combined = false;



    While (newColumn.length < 4) {

        Direction === 'up' ? newColumn.push(0) : newColumn.unshift(0);

    }



    If (direction === 'up') {

        For (let i = 0; i < 3; i++) {

            If (newColumn[i] !== 0 && newColumn[i] === newColumn[i + 1]) {

                newColumn[i] *= 2;

                score += newColumn[i];

                newColumn[i + 1] = 0;

                combined = true;

                if (soundEnabled) mergeSound.play(); // Звук слияния плиток

            }

        }

    } else { // down

        For (let i = 3; i > 0; i--) {

            If (newColumn[i] !== 0 && newColumn[i] === newColumn[i – 1]) {

                newColumn[i] *= 2;

                score += newColumn[i];

                newColumn[i – 1] = 0;

                combined = true;

                if (soundEnabled) mergeSound.play(); // Звук слияния плиток

            }

        }

    }



    If (JSON.stringify(newColumn) !== JSON.stringify(column)) {

        Moved = true;

    }



    newColumn = newColumn.filter(value => value);

    while (newColumn.length < 4) {

        direction === 'up' ? newColumn.push(0) : newColumn.unshift(0);

    }



    maxTile = Math.max(maxTile, …newColumn); // Обновляем максимальную плитку



    return { newColumn, moved, combined };

}

        
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
    
}// Сенсорное управление

Let touchStartX = 0;

Let touchStartY = 0;



gridContainer.addEventListener('touchstart', (event) => {

    touchStartX = event.touches[0].clientX;

    touchStartY = event.touches[0].clientY;

});



gridContainer.addEventListener('touchmove', (event) => {

    event.preventDefault(); // предотвращаем прокрутку страницы

});



gridContainer.addEventListener('touchend', (event) => {

    const touchEndX = event.changedTouches[0].clientX;

    const touchEndY = event.changedTouches[0].clientY;



    const deltaX = touchEndX – touchStartX;

    const deltaY = touchEndY – touchStartY;



    const absDeltaX = Math.abs(deltaX);

    const absDeltaY = Math.abs(deltaY);



}


// Инициализация игры
const game = new Game2048();
