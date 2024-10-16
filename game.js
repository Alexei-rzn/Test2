const gridContainer = document.getElementById("grid-container");
const scoreDisplay = document.getElementById("score");
const balanceDisplay = document.getElementById("balance");
const gameOverDisplay = document.getElementById("game-over");
const finalScoreDisplay = document.getElementById("final-score-value");
const playerNameInput = document.getElementById("player-name");
const submitScoreButton = document.getElementById("submit-score");

let grid = [];
let score = 0;
let balance = 100;
let history = [];
let soundEnabled = true; // Переменная для управления звуком
let maxTile = 0; // Макс. собранная плитка
let additionalClicks = 0; // Сумма нажатий на дополнительные кнопки
let controlMode = "touch"; // Режим управления

// Инициализация игры
function initGame() {
    grid = Array.from({ length: 4 }, () => Array(4).fill(0));  // Создаем пустое игровое поле
    score = 0; 
    balance = 100; 
    history = [];  // Обнуляем историю
    maxTile = 0; // Обнуляем максимальную плитку
    additionalClicks = 0; // Обнуляем количество дополнительных нажатий
    addNewTile(); // Добавляем первую плитку
    addNewTile(); // Добавляем вторую плитку
    updateGrid(); // Обновляем отображение
}

// Добавление новой плитки
function addNewTile() {
    let emptyCells = [];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] === 0) emptyCells.push({ i, j });
        }
    }
    if (emptyCells.length) {
        const { i, j } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        grid[i][j] = Math.random() < 0.8 ? 2 : 4; // 80% вероятность 2, 20% - 4
        saveState(); // Сохраняем состояние после добавления новой плитки
    }
}

// Обновление отображения плиток на экране
function updateGrid() {
    gridContainer.innerHTML = '';
    grid.forEach(row => {
        row.forEach(tile => {
            const tileElement = document.createElement("div");
            tileElement.classList.add("tile");
            tileElement.style.backgroundColor = tile > 0 ? getTileColor(tile) : "#8cceff"; // Установка цвета плитки
            if (tile > 0) {
                tileElement.innerText = tile;
                if (tile > maxTile) maxTile = tile; // Обновляем максимальную плитку
            }
            gridContainer.appendChild(tileElement);
        });
    });
    scoreDisplay.innerText = score;
    balanceDisplay.innerText = balance;

    if (checkGameOver()) {
        gameOverDisplay.classList.remove("hidden");
        finalScoreDisplay.innerText = score; // Отображаем финальный счёт
        if (soundEnabled) document.getElementById("game-over-sound").play(); // Звук окончания игры
        playerNameInput.classList.remove("hidden"); // Показываем поле для ввода имени
        submitScoreButton.classList.remove("hidden"); // Показываем кнопку сохранения результата
    }
}

// Получение цвета плитки в зависимости от её значения
function getTileColor(value) {
    switch(value) {
        case 2: return "#ffecb3";
        case 4: return "#ffe0b2";
        case 8: return "#ffcc80";
        case 16: return "#ffb74d";
        case 32: return "#ffa726";
        case 64: return "#fb8c00";
        case 128: return "#f57c00";
        case 256: return "#ef6c00";
        case 512: return "#e65100";
        case 1024: return "#bf360c";
        case 2048: return "#b71c1c";
        default: return "#8cceff"; // Цвет фона
    }
}

// Проверка на окончание игры
function checkGameOver() {
    return grid.flat().every(cell => cell !== 0) &&
        !grid.some((row, i) => row.some((cell, j) => 
            (j < 3 && cell === row[j + 1]) || (i < 3 && cell === grid[i + 1][j])
        ));
}

// Сохранение результата в таблицу лидеров
function saveToLeaderboard(name) {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboard.push({ 
        name, 
        score, 
        date: new Date().toLocaleString(), 
        tile: maxTile, 
        additionalClicks 
    });
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}

// Инициализация игры
initGame(); // Начало игры
