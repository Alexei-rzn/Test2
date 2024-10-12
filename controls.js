document.getElementById('undo-btn').addEventListener('click', () => {
    undoMove();
});

document.getElementById('delete-btn').addEventListener('click', () => {
    // Логика удаления тайла
    let [row, col] = getRandomNonEmptyTile();
    if (row !== null && col !== null) {
        gameState[row][col] = null;
        renderGrid();
    }
});

document.getElementById('shuffle-btn').addEventListener('click', () => {
    // Логика перемешивания
    gameState = gameState.flat().sort(() => Math.random() - 0.5).reduce((rows, key, index) => (index % 4 == 0 ? rows.push([key]) : rows[rows.length-1].push(key)) && rows, []);
    renderGrid();
});

document.getElementById('save-btn').addEventListener('click', () => {
    saveGameState();
});

document.getElementById('load-btn').addEventListener('click', () => {
    loadGameState();
});

function getRandomNonEmptyTile() {
    let nonEmptyTiles = [];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (gameState[i][j] !== null) {
                nonEmptyTiles.push([i, j]);
            }
        }
    }
    return nonEmptyTiles.length > 0 ? nonEmptyTiles[Math.floor(Math.random() * nonEmptyTiles.length)] : [null, null];
}
