const undoButton = document.getElementById("undo");
const deleteTileButton = document.getElementById("delete");
const shuffleButton = document.getElementById("shuffle");
const addFundsButton = document.getElementById("add-funds");

let deleteMode = false;

// Ход назад
undoButton.addEventListener("click", () => {
    if (history.length > 0 && balance >= 25) {
        grid = history.pop();
        balance -= 25;
        updateGrid();
    }
});

// Удаление плитки
deleteTileButton.addEventListener("click", () => {
    deleteMode = !deleteMode;
    deleteTileButton.style.backgroundColor = deleteMode ? "lightcoral" : "";
    
    gridContainer.addEventListener("click", (event) => {
        if (deleteMode) {
            const tileToDelete = getTileFromTouch(event.clientX, event.clientY);
            if (tileToDelete) {
                const { row, col } = tileToDelete;
                grid[row][col] = 0;
                updateGrid();
            }
        }
    });
});

// Перемешивание плиток
shuffleButton.addEventListener("click", () => {
    if (balance >= 20) {
        balance -= 20;
        shuffleTiles();
        updateGrid();
    }
});

// Пополнение баланса
addFundsButton.addEventListener("click", () => {
    balance += 50;
    updateGrid();
});

// Функция перемешивания плиток
function shuffleTiles() {
    const allTiles = grid.flat().filter(value => value !== 0);
    grid = grid.map(row => row.map(() => 0));
    allTiles.forEach(() => addNewTile());
}

// Получение координат плитки для удаления
function getTileFromTouch(x, y) {
    const tileElements = document.getElementsByClassName("tile");
    for (let i = 0; i < tileElements.length; i++) {
        const rect = tileElements[i].getBoundingClientRect();
        if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
            const tileRow = Math.floor(i / 4);
            const tileCol = i % 4;
            return { row: tileRow, col: tileCol };
        }
    }
    return null;
}
