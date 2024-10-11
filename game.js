const gridContainer = document.getElementById("grid-container");
const scoreDisplay = document.getElementById("score");
const balanceDisplay = document.getElementById("balance");
const gameOverDisplay = document.getElementById("game-over");

let grid = [];
let score = 0;
let balance = 100;
let history = [];
let removeTileLimit = 3; // Лимит удалений за ход
let shuffleLimit = 3; // Лимит перемешиваний за ход

// Инициализация игры
function initGame() {
    grid = Array.from({ length: 4 }, () => Array(4).fill(0));  
    score = 0; 
    balance = 100; 
    removeTileLimit = 3; // Сбрасываем лимит
    shuffleLimit = 3; // Сбрасываем лимит
    history = [];  
    addNewTile(); 
    addNewTile(); 
    updateGrid();
}

// Сохранение состояния игры в localStorage
function saveGame() {
    localStorage.setItem('2048game', JSON.stringify({
        grid,
        score,
        balance,
        history
    }));
}

// Загрузка игры из localStorage
function loadGame() {
    const savedGame = localStorage.getItem('2048game');
    if (savedGame) {
        const { grid: savedGrid, score: savedScore, balance: savedBalance, history: savedHistory } = JSON.parse(savedGame);
        grid = savedGrid;
        score = savedScore;
        balance = savedBalance;
        history = savedHistory;
        updateGrid();
    }
}

// Обновление отображения плиток
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
    }
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
        saveState(); 
    }
    saveGame(); // Сохранение игры после добавления новой плитки
}

// Проверка окончания игры
function checkGameOver() {
    return grid.flat().every(cell => cell !== 0) &&
        !grid.some((row, i) => row.some((cell, j) => 
            (j < 3 && cell === row[j + 1]) || (i < 3 && cell === grid[i + 1][j])
        ));
}

initGame();
