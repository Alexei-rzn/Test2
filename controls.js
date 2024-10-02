const balanceDisplay = document.getElementById("balance");
const undoButton = document.getElementById("undo");
const deleteTileButton = document.getElementById("delete");
const shuffleButton = document.getElementById("shuffle");
const addFundsButton = document.getElementById("add-funds");
const gridContainer = document.getElementById("grid-container");

let deleteMode = false; // Режим удаления плитки
let history = []; // Стек для хранения предыдущих состояний
let balance = 100; // Начальный баланс

// Ход назад
undoButton.addEventListener("click", () => {
    if (history.length > 0 && balance >= 25) {
        grid = history.pop(); // Восстанавливаем последнее состояние
        balance -= 25; // Списываем 25 очков
        updateGrid();
    }
});

// Удаление плитки
deleteTileButton.addEventListener("click", () => {
    deleteMode = !deleteMode; // Переключаем режим удаления
    deleteTileButton.style.backgroundColor = deleteMode ? "lightcoral" : ""; // Меняем цвет кнопки для визуального обозначения

    if (deleteMode) {
        gridContainer.addEventListener("click", (event) => {
            const tileToDelete = getTileFromTouch(event.clientX, event.clientY);
            if (tileToDelete) {
                const { row, col } = tileToDelete;
                deleteTile(row, col);
            }
        });
    } else {
        gridContainer.removeEventListener("click", (event) => {
            const tileToDelete = getTileFromTouch(event.clientX, event.clientY);
            if (tileToDelete) {
                const { row, col } = tileToDelete;
                deleteTile(row, col);
            }
        });
    }
});

// Перемешивание плиток
shuffleButton.addEventListener("click", () => {
    if (balance >= 20) {
        shuffleTiles();
        balance -= 20; // Списываем 20 очков
        updateGrid();
    }
});

// Пополнение баланса
addFundsButton.addEventListener("click", () => {
    balance += 50; // Добавляем 50 к балансу
    updateGrid();
});

// Функция для получения координат плитки из касания
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

// Обработка касаний для кнопок
function addTouchListeners() {
    const buttons = [undoButton, deleteTileButton, shuffleButton, addFundsButton];
    buttons.forEach(button => {
        button.addEventListener("touchstart", (event) => {
            event.preventDefault(); // Предотвращаем возможные конфликты с другими событиями
            button.click(); // Вызываем клик по кнопке
        });
    });
}

// Инициализация касаний для кнопок
addTouchListeners();
