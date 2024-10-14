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
undoButton.addEventListener("click", () => {
    if (history.length > 0 && balance >= 30) {
        grid = history.pop();  // Восстанавливаем последнее состояние
        balance -= 30;  // Списываем 30 баллов
        updateGrid(); // Обновление интерфейса
    }
});

// Удаление плитки
function deleteTile() {
    if (balance >= 50) { // Проверяем, достаточно ли баланса
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
    if (balance >= 20) {
        shuffleTiles();
        balance -= 20;
        updateGrid(); // Обновление интерфейса

        // Сохраняем состояние после перемешивания
        saveState();
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
}

// Правила игры
rulesButton.addEventListener("click", () => {
    window.location.href = "rules.html"; // Переход на страницу правил
});

// Поделиться
shareButton.addEventListener("click", () => {
    const shareText = "Я сыграл в 2048! Попробуйте и вы!";
    const url = window.location.href;
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText)}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)} ${encodeURIComponent(url)}`;
    const viberUrl = `viber://forward?text=${encodeURIComponent(shareText)} ${encodeURIComponent(url)}`;

    // Открываем ссылки в новых вкладках
    window.open(telegramUrl, '_blank');
    window.open(whatsappUrl, '_blank');
    window.open(viberUrl, '_blank');

    // Копируем ссылку в буфер обмена
    navigator.clipboard.writeText(url)
        .then(() => {
            alert("Ссылка на игру скопирована в буфер обмена!");
        })
        .catch(err => console.error('Ошибка копирования:', err));
});
