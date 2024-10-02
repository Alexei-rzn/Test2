const undoButton = document.getElementById("undo");
const deleteTileButton = document.getElementById("delete");
const shuffleButton = document.getElementById("shuffle");
const addFundsButton = document.getElementById("add-funds");

let deleteMode = false;

// Ход назад
undoButton.addEventListener("click", () => {
    if (history.length > 0 && balance >= 25) {
        grid = history.pop();  // Восстанавливаем последнее состояние
        balance -= 25;  // Списываем 25 баллов
        updateGrid();
    }
});

// Удаление плитки
deleteTileButton.addEventListener("click", () => {
    deleteMode = !deleteMode;  // Переключаем режим удаления
    deleteTileButton.style.backgroundColor = deleteMode ? "lightcoral" : "";

    if (deleteMode) {
        gridContainer.addEventListener("click", deleteTileFromGrid);
    } else {
        gridContainer.removeEventListener("click", deleteTileFromGrid);
    }
});

// Функция удаления плитки по клику
function deleteTileFromGrid(event) {
    const tileElement = event.target;
    if (tileElement.classList.contains("tile") && balance >= 10) {
        const index = Array.from(gridContainer.children).indexOf(tileElement);
        const row = Math.floor(index / 4);
        const col = index % 4;
        grid[row][col] = 0;  // Удаляем плитку
        balance -= 10;  // Списываем 10 баллов
        updateGrid();
    }
}

// Перемешивание плиток
shuffleButton.addEventListener("click", () => {
    if (balance >= 20) {
        shuffleTiles();
        balance -= 20;
        updateGrid();
    }
});

// Функция перемешивания плиток
function shuffleTiles() {
    const flattenedGrid = grid.flat();
    flattenedGrid.sort(() => Math.random() - 0.5);  // Перемешиваем массив
    for (let i = 0; i < 4; i++) {
        grid[i] = flattenedGrid.slice(i * 4, (i + 1) * 4);
    }
}

// Пополнение баланса
addFundsButton.addEventListener("click", () => {
    balance += 50;
    updateGrid();
});
