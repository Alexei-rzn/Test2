const gridContainer = document.getElementById("grid-container");
const scoreDisplay = document.getElementById("score");
const gameOverDisplay = document.getElementById("game-over");

let grid = [];
let score = 0;
let previousGrid = [];  // Для функции "Ход назад"

// Инициализация игры
function initGame() {
    grid = Array.from({ length: 4 }, () => Array(4).fill(0));
    score = 0;
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

// Обновление сетки
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

    if (checkGameOver()) {
        gameOverDisplay.classList.remove("hidden");
    }
}

// Удаление плитки
function deleteTile(x, y) {
    if (grid[x][y] !== 0) {
        grid[x][y] = 0;  // Просто удаляем плитку, без добавления новых
        updateGrid();
    }
}

// Сохранение предыдущего состояния для "Ход назад"
function savePreviousState() {
    previousGrid = JSON.parse(JSON.stringify(grid));  // Сохраняем копию
}

// Возврат хода назад
function undoMove() {
    if (previousGrid.length) {
        grid = JSON.parse(JSON.stringify(previousGrid));
        updateGrid();
    }
}

// Проверка на конец игры
function checkGameOver() {
    return grid.flat().every(cell => cell !== 0) &&
        !grid.some((row, i) => row.some((cell, j) => 
            (j < 3 && cell === row[j + 1]) || (i < 3 && cell === grid[i + 1][j])
        ));
}

// Свайп и перемещения остались прежними (предположительно уже реализованы).
// Не забывайте сохранять состояние перед каждым ходом через savePreviousState() перед move()
