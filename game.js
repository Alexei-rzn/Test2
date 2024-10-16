// Основной файл для логики игры 2048

const gridContainer = document.getElementById("grid-container");
const scoreDisplay = document.getElementById("score");
const balanceDisplay = document.getElementById("balance");
const gameOverDisplay = document.getElementById("game-over");
const finalScoreDisplay = document.getElementById("final-score-value");
const playerNameInput = document.getElementById("player-name");
const submitScoreButton = document.getElementById("submit-score");
const controlToggleButton = document.getElementById("control-toggle");
const controlIcon = document.getElementById("control-icon");

const moveSound = document.getElementById("move-sound");
const mergeSound = document.getElementById("merge-sound");
const gameOverSound = document.getElementById("game-over-sound");

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
        if (soundEnabled) gameOverSound.play(); // Звук окончания игры
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

// Логика сдвига плиток
function move(direction) {
    let moved = false;
    let combined = false;

    switch (direction) {
        case 'left':
            for (let i = 0; i < 4; i++) {
                const result = slideRow(grid[i], direction);
                if (result.moved) moved = true;
                if (result.combined) combined = true;
                grid[i] = result.newRow;
            }
            break;

        case 'right':
            for (let i = 0; i < 4; i++) {
                const result = slideRow(grid[i].slice().reverse(), 'left');
                if (result.moved) moved = true;
                if (result.combined) combined = true;
                grid[i] = result.newRow.reverse();
            }
            break;

        case 'up':
            for (let j = 0; j < 4; j++) {
                const column = [grid[0][j], grid[1][j], grid[2][j], grid[3][j]];
                const result = slideColumn(column, 'up');
                for (let i = 0; i < 4; i++) {
                    grid[i][j] = result.newColumn[i];
                }
                if (result.moved) moved = true;
                if (result.combined) combined = true;
            }
            break;

        case 'down':
            for (let j = 0; j < 4; j++) {
                const column = [grid[0][j], grid[1][j], grid[2][j], grid[3][j]];
                const result = slideColumn(column, 'down');
                for (let i = 0; i < 4; i++) {
                    grid[i][j] = result.newColumn[i];
                }
                if (result.moved) moved = true;
                if (result.combined) combined = true;
            }
            break;
    }

    if (moved || combined) {
        if (soundEnabled) moveSound.play(); // Звук передвижения плиток
        setTimeout(() => {
            addNewTile(); // Добавляем новую плитку после хода
            updateGrid(); // Обновляем интерфейс
        }, 200);
    }
}

// Логика сдвига плиток в строке
function slideRow(row, direction) {
    let newRow = row.filter(value => value);
    const emptySpaces = 4 - newRow.length;
    let moved = false;
    let combined = false;

    newRow = direction === 'left' 
        ? [...newRow, ...Array(emptySpaces).fill(0)] 
        : [...Array(emptySpaces).fill(0), ...newRow];

    for (let i = 0; i < 3; i++) {
        if (newRow[i] !== 0 && newRow[i] === newRow[i + 1]) {
            newRow[i] *= 2;
            score += newRow[i];
            newRow[i + 1] = 0;
            combined = true;
            if (soundEnabled) mergeSound.play(); // Звук слияния плиток
        }
    }

    if (JSON.stringify(newRow) !== JSON.stringify(row)) {
        moved = true;
    }

    newRow = newRow.filter(value => value);
    while (newRow.length < 4) newRow.push(0);

    return { newRow, moved, combined };
}

// Логика сдвига плиток в колонне
function slideColumn(column, direction) {
    let newColumn = column.filter(value => value);
    let moved = false;
    let combined = false;

    while (newColumn.length < 4) {
        direction === 'up' ? newColumn.push(0) : newColumn.unshift(0);
    }

    if (direction === 'up') {
        for (let i = 0; i < 3; i++) {
            if (newColumn[i] !== 0 && newColumn[i] === newColumn[i + 1]) {
                newColumn[i] *= 2;
                score += newColumn[i];
                newColumn[i + 1] = 0;
                combined = true;
                if (soundEnabled) mergeSound.play(); // Звук слияния плиток
            }
        }
    } else { // down
        for (let i = 3; i > 0; i--) {
            if (newColumn[i] !== 0 && newColumn[i] === newColumn[i - 1]) {
                newColumn[i] *= 2;
                score += newColumn[i];
                newColumn[i - 1] = 0;
                combined = true;
                if (soundEnabled) mergeSound.play(); // Звук слияния плиток
            }
        }
    }

    if (JSON.stringify(newColumn) !== JSON.stringify(column)) {
        moved = true;
    }

    newColumn = newColumn.filter(value => value);
    while (newColumn.length < 4) {
        direction === 'up' ? newColumn.push(0) : newColumn.unshift(0);
    }

    return { newColumn, moved, combined };
}

// Сохранение состояния игры в истории
function saveState() {
    if (history.length >= 10) {
        history.shift(); // Удаляем самый старый элемент, если их стало больше 10
    }
    history.push(JSON.parse(JSON.stringify(grid))); // Сохраняем текущее состояние игры
}

// Инициализация игры
initGame(); // Начало игры
