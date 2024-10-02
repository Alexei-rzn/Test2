const gridContainer = document.getElementById("grid-container");
const scoreDisplay = document.getElementById("score");
const balanceDisplay = document.getElementById("balance");
const restartButton = document.getElementById("restart");
const gameOverDisplay = document.getElementById("game-over");

let grid = [];
let score = 0;
let balance = 100;
let history = [];

// Инициализация игры
function initGame() {
    grid = Array.from({ length: 4 }, () => Array(4).fill(0));
    score = 0;
    balance = 100;
    history = [];
    addNewTile();
    addNewTile();
    updateGrid();
}

// Добавление новой плитки
function addNewTile() {
    let emptyCells = [];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] === 0) emptyCells.push({ i, j });
        }
    }
    if (emptyCells.length) {
        const { i, j } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        grid[i][j] = Math.random() < 0.8 ? 2 : 4;
    }
}

// Обновление отображения плиток на экране
function updateGrid() {
    gridContainer.innerHTML = '';
    grid.forEach(row => {
        row.forEach(tile => {
            const tileElement = document.createElement("div");
            tileElement.classList.add("tile");
            if (tile > 0) {
                tileElement.classList.add(`tile-${tile}`);
                tileElement.innerText = tile;
            }
            gridContainer.appendChild(tileElement);
        });
    });
    scoreDisplay.innerText = score;
    balanceDisplay.innerText = balance;

    if (checkGameOver()) {
        gameOverDisplay.classList.remove("hidden");
    } else {
        gameOverDisplay.classList.add("hidden");
    }
}

// Проверка на окончание игры
function checkGameOver() {
    return grid.flat().every(cell => cell !== 0) &&
        !grid.some((row, i) => row.some((cell, j) => 
            (j < 3 && cell === row[j + 1]) || (i < 3 && cell === grid[i + 1][j])
        ));
}

// Логика перемещения плиток
function move(direction) {
    let moved = false;
    let combined = false;
    saveHistory();

    switch (direction) {
        case 'left':
            for (let i = 0; i < 4; i++) {
                const result = slideRow(grid[i], direction);
                if (result.moved) moved = true;
                if (result.combined) combined = true;
                grid[i] = result.newRow;
            }
            break;

        case 'right':
            for (let i = 0; i < 4; i++) {
                const result = slideRow(grid[i].slice().reverse(), 'left');
                if (result.moved) moved = true;
                if (result.combined) combined = true;
                grid[i] = result.newRow.reverse();
            }
            break;

        case 'up':
            for (let j = 0; j < 4; j++) {
                const column = [grid[0][j], grid[1][j], grid[2][j], grid[3][j]];
                const result = slideColumnUp(column);
                for (let i = 0; i < 4; i++) {
                    grid[i][j] = result.newColumn[i];
                }
                if (result.moved) moved = true;
                if (result.combined) combined = true;
            }
            break;

        case 'down':
            for (let j = 0; j < 4; j++) {
                const column = [grid[0][j], grid[1][j], grid[2][j], grid[3][j]];
                const result = slideColumnDown(column);
                for (let i = 0; i < 4; i++) {
                    grid[i][j] = result.newColumn[i];
                }
                if (result.moved) moved = true;
                if (result.combined) combined = true;
            }
            break;
    }

    if (moved || combined) {
        setTimeout(() => {
            addNewTile();
            updateGrid();
        }, 200);
    }
}

// Сохранение текущего состояния для хода назад
function saveHistory() {
    history.push(grid.map(row => [...row]));
}

// Логика для других кнопок перемещена в controls.js

// Кнопка перезапуска игры
restartButton.addEventListener("click", () => {
    initGame();
});

// Инициализация игры при загрузке
initGame();
                
