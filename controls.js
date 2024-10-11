const undoButton = document.getElementById("undo");
const deleteTileButton = document.getElementById("delete");
const shuffleButton = document.getElementById("shuffle");
const addFundsButton = document.getElementById("add-funds");
const restartButton = document.getElementById("restart");

// Ход назад
undoButton.addEventListener("click", () => {
    if (history.length > 0) {
        grid = history.pop();  // Восстанавливаем последнее состояние
        updateGrid(); 
        saveGame(); // Сохраняем после undo
    }
});

// Удаление плитки
deleteTileButton.addEventListener("click", () => {
    if (balance >= 50 && removeTileLimit > 0) {
        removeTileLimit--; // Уменьшаем лимит на удаление
        deleteTile();
    } else {
        alert("Лимит на удаление исчерпан или недостаточно баланса.");
    }
});

// Перемешивание плиток
shuffleButton.addEventListener("click", () => {
    if (balance >= 50 && shuffleLimit > 0) {
        shuffleLimit--; // Уменьшаем лимит на перемешивание
        shuffleTiles(); 
    } else {
        alert("Лимит на перемешивание исчерпан или недостаточно баланса.");
    }
});

// Пополнение баланса
addFundsButton.addEventListener("click", () => {
    balance += 50;
    updateGrid();
    saveGame(); // Сохраняем после пополнения баланса
});

// Рестарт игры
restartButton.addEventListener("click", () => {
    initGame();
    saveGame(); // Сохраняем после рестарта
});
