let removalLimit = 1;  // Ограничение на удаление плиток
let shuffleLimit = 1;  // Ограничение на перемешивание
let removalCount = 0;  // Счетчик удалений в текущем ходу
let shuffleCount = 0;  // Счетчик перемешиваний в текущем ходу
let undoUsed = false;  // Контроль использования функции "ход назад"

// Основные переменные для игры
let grid = [];
let score = 0;
let balance = 100;
let previousState = {};

// Логика удаления плиток
function removeTile() {
    if (removalCount < removalLimit) {
        // Логика удаления плитки
        console.log("Tile removed");
        removalCount++;
    } else {
        alert("Превышено количество удалений плиток за ход.");
    }
}

// Логика перемешивания плиток
function shuffleTiles() {
    if (shuffleCount < shuffleLimit) {
        // Логика перемешивания плиток
        console.log("Tiles shuffled");
        shuffleCount++;
    } else {
        alert("Превышено количество перемешиваний плиток за ход.");
    }
}

// Логика отката хода
function undoMove() {
    if (!undoUsed) {
        // Восстановление предыдущего состояния
        restorePreviousState();
        balance--;  // Баланс списывается один раз
        console.log("Ход отменен");
        undoUsed = true;
    }
}

// Восстановление предыдущего состояния (перед каждым ходом сохраняй его)
function savePreviousState() {
    previousState.grid = JSON.parse(JSON.stringify(grid));
    previousState.score = score;
    previousState.balance = balance;
}

function restorePreviousState() {
    grid = JSON.parse(JSON.stringify(previousState.grid));
    score = previousState.score;
    balance = previousState.balance;
    updateGameBoard();
}

// Логика конца хода
function endTurn() {
    removalCount = 0;
    shuffleCount = 0;
    undoUsed = false;
    console.log("Ход завершен");
}

// Сохранение игры с помощью localStorage
function saveGame() {
    const gameState = {
        grid: JSON.stringify(grid),
        score: score,
        balance: balance
    };
    localStorage.setItem('gameState', JSON.stringify(gameState));
    alert("Игра сохранена!");
}

// Загрузка игры из localStorage
function loadGame() {
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
        const gameState = JSON.parse(savedState);
        grid = JSON.parse(gameState.grid);
        score = gameState.score;
        balance = gameState.balance;
        updateGameBoard();
        alert("Игра загружена!");
    } else {
        alert("Сохраненная игра не найдена.");
    }
}

// Обновление визуального отображения игрового поля
function updateGameBoard() {
    // Логика для обновления отображения сетки игры
    console.log("Игровое поле обновлено");
}

// Логика перемещения плиток с анимацией
function moveTile(tile, x, y) {
    tile.style.setProperty('--moveX', x + 'px');
    tile.style.setProperty('--moveY', y + 'px');
    tile.classList.add('moving');
    setTimeout(() => tile.classList.remove('moving'), 200); // Удаление класса после анимации
}
