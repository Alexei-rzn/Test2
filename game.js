let gameState = [];
let undoStack = [];

function initGame() {
    // Инициализация игры
    gameState = [...Array(4)].map(() => Array(4).fill(null));
    addRandomTile();
    addRandomTile();
    renderGrid();
    saveGameState();
}

function renderGrid() {
    const gridContainer = document.getElementById('game-grid');
    gridContainer.innerHTML = '';

    gameState.forEach((row, rowIndex) => {
        row.forEach((tile, colIndex) => {
            const tileElement = document.createElement('div');
            tileElement.classList.add('tile');
            tileElement.style.transform = `translate(${colIndex * 110}px, ${rowIndex * 110}px)`;
            if (tile !== null) {
                tileElement.textContent = tile;
            }
            gridContainer.appendChild(tileElement);
        });
    });
}

function addRandomTile() {
    // Логика добавления случайного тайла
    let emptyTiles = [];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (gameState[i][j] === null) {
                emptyTiles.push([i, j]);
            }
        }
    }
    if (emptyTiles.length > 0) {
        let [row, col] = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        gameState[row][col] = Math.random() > 0.1 ? 2 : 4;
    }
}

function move(direction) {
    // Логика перемещения тайлов
    undoStack.push(JSON.parse(JSON.stringify(gameState)));
    // Реализация движения в зависимости от направления
    renderGrid();
    addRandomTile();
    saveGameState();
}

function saveGameState() {
    localStorage.setItem('gameState', JSON.stringify(gameState));
}

function loadGameState() {
    const savedState = JSON.parse(localStorage.getItem('gameState'));
    if (savedState) {
        gameState = savedState;
        renderGrid();
    }
}

function undoMove() {
    if (undoStack.length > 0) {
        gameState = undoStack.pop();
        renderGrid();
    }
}

// Пример использования событий клавиш для управления
document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowUp') move('up');
    else if (event.key === 'ArrowDown') move('down');
    else if (event.key === 'ArrowLeft') move('left');
    else if (event.key === 'ArrowRight') move('right');
});

initGame();
