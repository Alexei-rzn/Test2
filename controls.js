const undoButton = document.getElementById("undo");
const deleteTileButton = document.getElementById("delete");
const shuffleButton = document.getElementById("shuffle");
const addFundsButton = document.getElementById("add-funds");
const restartButton = document.getElementById("restart");
const rulesButton = document.getElementById("rules");
const shareButton = document.getElementById("share");
const soundButton = document.getElementById("sound");
const soundIcon = document.getElementById("sound-icon");
const ratingButton = document.getElementById("rating");
const difficultyButton = document.getElementById("difficulty");

let deleteMode = false;

// Ход назад
undoButton.addEventListener("click", () => {
    if (game.history.length > 0 && game.balance >= 30) {
        game.grid = game.history.pop();  // Восстанавливаем последнее состояние
        game.balance -= 30;  // Списываем 30 баллов
        game.additionalClicks++; // Увеличиваем счетчик нажатий
        game.updateGrid(); // Обновление интерфейса
    }
});

// Удаление плитки
function deleteTile() {
    if (game.balance >= 50) {
        const tiles = document.querySelectorAll(".tile");
        tiles.forEach(tile => {
            tile.addEventListener("click", () => {
                const tileValue = parseInt(tile.innerText);
                if (tileValue > 0) {
                    const [rowIndex, colIndex] = getTileIndex(tile);
                    game.grid[rowIndex][colIndex] = 0; // Удаляем плитку
                    tile.innerText = ''; // Обновляем интерфейс
                    game.balance -= 50; // Списываем 50
                    game.additionalClicks++; // Увеличиваем счетчик нажатий
                    game.updateGrid(); // Обновление интерфейса
                    game.saveState(); 
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
    if (game.balance >= 20) {
        shuffleTiles();
        game.balance -= 20;
        game.additionalClicks++; // Увеличиваем счетчик нажатий
        game.updateGrid(); // Обновление интерфейса
        game.saveState();
    }
});

// Логика перемешивания плиток
function shuffleTiles() {
    const flattenedGrid = game.grid.flat();
    flattenedGrid.sort(() => Math.random() - 0.5); // Перемешиваем массив
    for (let i = 0; i < 4; i++) {
        game.grid[i] = flattenedGrid.slice(i * 4, (i + 1) * 4);
    }
}

// Пополнение баланса
addFundsButton.addEventListener("click", () => {
    game.balance += 50;
    game.additionalClicks++; // Увеличиваем счетчик нажатий
    game.updateGrid(); // Обновление интерфейса
});

// Уровень сложности
let currentDifficulty = 0;
difficultyButton.addEventListener("click", () => {
    currentDifficulty = (currentDifficulty + 1) % 5; // Циклический переход по уровням
    difficultyButton.innerText = currentDifficulty + 1; // Обновляем текст кнопки
    switch (currentDifficulty) {
        case 0: game.tileProbability = [90, 10]; break;
        case 1: game.tileProbability = [80, 20]; break;
        case 2: game.tileProbability = [70, 30]; break;
        case 3: game.tileProbability = [60, 40]; break;
        case 4: game.tileProbability = [50, 50]; break;
    }
});

// Перезапуск игры
restartButton.addEventListener("click", () => {
    gameOverDisplay.classList.add("hidden");
    game.initGame(); // Инициализация новой игры
});

// Правила игры
rulesButton.addEventListener("click", () => {
    window.location.href = "rules.html"; // Переход на страницу правил
});

// Поделиться
shareButton.addEventListener("click", () => {
    const shareText = "Я сыграл в 2048! Попробуйте и вы!";
    const url = window.location.href;
    const shareUrl = `https://web.whatsapp.com/send?text=${encodeURIComponent(shareText)} ${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
});

// Управление звуком
soundButton.addEventListener("click", () => {
    game.soundEnabled = !game.soundEnabled; // Переключаем состояние звука
    soundIcon.src = game.soundEnabled ? "sound-on.png" : "sound-off.png"; // Меняем иконку
});

// Переход на страницу с таблицей лидеров
ratingButton.addEventListener("click", () => {
    window.location.href = "victory.html"; // Переход на страницу таблицы лидеров
});
