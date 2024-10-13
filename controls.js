const undoButton = document.getElementById("undo");
const deleteTileButton = document.getElementById("delete");
const shuffleButton = document.getElementById("shuffle");
const addFundsButton = document.getElementById("add-funds");
const restartButton = document.getElementById("restart");
const rulesButton = document.getElementById("rules");
const shareButton = document.getElementById("share");

let deleteMode = false;
let deleteCount = 0;
let shuffleCount = 0;

// Ход назад
let undoAvailable = false; // Флаг для отслеживания доступности хода назад
undoButton.addEventListener("click", () => {
    if (undoAvailable) {
        grid = history.pop();  // Восстанавливаем последнее состояние
        balance -= 30; // Списываем 30 баллов
        updateGrid(); // Обновление интерфейса
        undoAvailable = history.length > 0; // Проверяем доступность следующего хода назад
    }
});

// Удаление плитки
function deleteTile() {
    if (balance >= 50 && deleteCount < 1) { // Ограничение на одно удаление за ход
        const tiles = document.querySelectorAll(".tile");
        tiles.forEach(tile => {
            tile.addEventListener("click", () => {
                const tileValue = parseInt(tile.innerText);
                if (tileValue > 0) {
                    const [rowIndex, colIndex] = getTileIndex(tile);
                    grid[rowIndex][colIndex] = 0; // Удаляем плитку
                    tile.innerText = ''; // Обновляем интерфейс
                    balance -= 50; // Списываем 50
                    updateGrid(); // Обновление интерфейса

                    // Сохраняем состояние после удаления
                    saveState();
                    deleteCount++; // Увеличиваем счетчик удалений
                }
            }, { once: true });
        });
    }
}

// Показать и скрыть режим удаления плиток
deleteTileButton.addEventListener("mousedown", () => {
    deleteTileButton.classList.add("active");
    deleteMode = true;
    deleteTile();
});

deleteTileButton.addEventListener("mouseup", () => {
    deleteTileButton.classList.remove("active");
    deleteMode = false;
});

// Логика получения индекса плитки
function getTileIndex(tile) {
    const index = Array.from(tile.parentNode.children).indexOf(tile);
    const rowIndex = Math.floor(index / 4);
    const colIndex = index % 4;
    return [rowIndex, colIndex];
}

// Перемешивание плиток
shuffleButton.addEventListener("click", () => {
    if (balance >= 20 && shuffleCount < 1) { // Ограничение на одно перемешивание за ход
        shuffleTiles();
        balance -= 20;
        updateGrid(); // Обновление интерфейса
        saveState();
        shuffleCount++; // Увеличиваем счетчик перемешиваний
    }
});

// Логика перемешивания плиток
function shuffleTiles() {
    const flattenedGrid = grid.flat();
    flattenedGrid.sort(() => Math.random() - 0.5); // Перемешиваем массив
    for (let i = 0; i < 4; i++) {
        grid[i] = flattenedGrid.slice(i * 4, (i + 1) * 4);
    }
}

// Пополнение баланса
addFundsButton.addEventListener("click", () => {
    balance += 50;
    updateGrid(); // Обновление интерфейса
});

// Перезапуск игры
restartButton.addEventListener("click", () => {
    gameOverDisplay.classList.add("hidden");
    initGame(); // Инициализация новой игры
});

// Сохранение состояния игры в истории
function saveState() {
    if (history.length >= 10) {
        history.shift(); // Удаляем самый старый элемент, если их стало больше 10
    }
    history.push(JSON.parse(JSON.stringify(grid))); // Сохраняем текущее состояние игры
    undoAvailable = true; // Устанавливаем флаг доступности хода назад
}

// Правила игры
rulesButton.addEventListener("click", () => {
    window.location.href = "rules.html"; // Переход на страницу правил
});

// Поделиться
shareButton.addEventListener("click", () => {
    const shareText = "Я сыграл в 2048! Попробуйте и вы!";
    navigator.clipboard.writeText(window.location.href)
        .then(() => {
            alert("Ссылка скопирована в буфер обмена!"); // Сообщение об успешном копировании
        })
        .catch(err => console.error('Ошибка копирования:', err));
});
