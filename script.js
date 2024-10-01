const gridContainer = document.getElementById("grid-container");
const scoreDisplay = document.getElementById("score");
const balanceDisplay = document.getElementById("balance");
const restartButton = document.getElementById("restart");
const gameOverDisplay = document.getElementById("game-over");
const deleteButton = document.getElementById("delete");
const shuffleButton = document.getElementById("shuffle");
const addFundsButton = document.getElementById("add-funds");

let grid = [];
let score = 0;
let balance = 100; // Начальный баланс
let history = []; // Стек для хранения предыдущих состояний
let deleteMode = false; // Режим удаления плитки

// Инициализация игры
function initGame() {
    grid = Array.from({ length: 4 }, () => Array(4).fill(0));
    score = 0;
    history = []; // Сбрасываем историю
    balance = 100; // Сбрасываем баланс
    addNewTile();
    addNewTile();
    updateGrid();
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
        grid[i][j] = Math.random() < 0.9 ? 2 : 4; // 90% вероятность 2, 10% - 4
    }
}

// Обновление отображения плиток на экране
function updateGrid() {
    gridContainer.innerHTML = '';
    grid.forEach(row => {
        row.forEach(tile => {
            const tileElement = document.createElement("div");
            tileElement.classList.add("tile");
            if (tile > 0) {
                tileElement.classList.add(`tile-${tile}`);
                tileElement.innerText = tile;
            }
            gridContainer.appendChild(tileElement);
        });
    });
    scoreDisplay.innerText = score;
    balanceDisplay.innerText = balance; // Обновляем баланс

    if (checkGameOver()) {
        gameOverDisplay.classList.remove("hidden");
    }
}

// Проверка на окончание игры
function checkGameOver() {
    return grid.flat().every(cell => cell !== 0) &&
        !grid.some((row, i) => row.some((cell, j) => 
            (j < 3 && cell === row[j + 1]) || (i < 3 && cell === grid[i + 1][j])
        ));
}

// Логика перемещения плиток
function move(direction) {
    let moved = false;
    let combined = false;

    // Сохраняем текущее состояние в историю
    history.push(JSON.parse(JSON.stringify(grid)));

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
                const result = slideRow(grid[i].slice().reverse(), 'left'); // Обрабатываем как движение влево
                if (result.moved) moved = true;
                if (result.combined) combined = true;
                grid[i] = result.newRow.reverse(); // Возвращаем порядок обратно
            }
            break;

        case 'up':
            for (let j = 0; j < 4; j++) {
                const column = [grid[0][j], grid[1][j], grid[2][j], grid[3][j]];
                const result = slideColumnUp(column);
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
                const result = slideColumnDown(column);
                for (let i = 0; i < 4; i++) {
                    grid[i][j] = result.newColumn[i];
                }
                if (result.moved) moved = true;
                if (result.combined) combined = true;
            }
            break;
    }

    // Добавляем новую плитку только если было движение или складывание
    if (moved || combined) {
        addNewTile();
    }
    updateGrid();
}

// Логика скольжения плиток в строке
function slideRow(row) {
    let newRow = row.filter(val => val); // Убираем все нули
    for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) { // Суммируем плитки
            newRow[i] *= 2;
            score += newRow[i]; // Обновляем счёт
            newRow.splice(i + 1, 1); // Удаляем вторую плитку
            newRow.push(0); // Добавляем 0 в конец
        }
    }
    while (newRow.length < 4) newRow.push(0); // Добавляем 0 в конец строки до длины 4
    return {
        newRow,
        moved: row.some((val, idx) => val !== newRow[idx]), // Проверяем, было ли движение
        combined: newRow.some((val, idx) => val !== row[idx] && val !== 0) // Проверяем, были ли сложены плитки
    };
}

// Логика скольжения плиток в колонке вверх
function slideColumnUp(column) {
    let newColumn = column.filter(val => val);
    for (let i = 0; i < newColumn.length - 1; i++) {
        if (newColumn[i] === newColumn[i + 1]) {
            newColumn[i] *= 2;
            score += newColumn[i];
            newColumn.splice(i + 1, 1);
            newColumn.push(0);
        }
    }
    while (newColumn.length < 4) newColumn.push(0);
    return {
        newColumn,
        moved: column.some((val, idx) => val !== newColumn[idx]),
        combined: newColumn.some((val, idx) => val !== column[idx] && val !== 0)
    };
}

// Логика скольжения плиток в колонке вниз
function slideColumnDown(column) {
    let newColumn = column.filter(val => val);
    for (let i = newColumn.length - 1; i > 0; i--) {
        if (newColumn[i] === newColumn[i - 1]) {
            newColumn[i] *= 2;
            score += newColumn[i];
            newColumn.splice(i - 1, 1);
            newColumn.unshift(0);
        }
    }
    while (newColumn.length < 4) newColumn.unshift(0);
    return {
        newColumn,
        moved: column.some((val, idx) => val !== newColumn[idx]),
        combined: newColumn.some((val, idx) => val !== column[idx] && val !== 0)
    };
}

// Обработчики клавиш для управления
document.addEventListener("keydown", (e) => {
    if (gameOverDisplay.classList.contains("hidden")) {
        switch (e.key) {
            case "ArrowLeft":
                move("left");
                break;
            case "ArrowRight":
                move("right");
                break;
            case "ArrowUp":
                move("up");
                break;
            case "ArrowDown":
                move("down");
                break;
        }
    }
});

// Сброс игры
restartButton.addEventListener("click", () => {
    gameOverDisplay.classList.add("hidden");
    initGame();
});

// Перетасовка плиток (опционально)
shuffleButton.addEventListener("click", () => {
    if (balance >= 10) {
        balance -= 10; // Снимаем 10 очков с баланса за перетасовку
        grid = grid.flat().sort(() => Math.random() - 0.5).reduce((rows, key, index) => (index % 4 === 0 ? rows.push([key]) : rows[rows.length - 1].push(key)) && rows, []);
        updateGrid();
    }
});

// Добавление средств на счёт
addFundsButton.addEventListener("click", () => {
    balance += 50; // Добавляем 50 единиц к балансу
    updateGrid();
});

// Удаление плитки (опционально)
deleteButton.addEventListener("click", () => {
    deleteMode = true;
});

gridContainer.addEventListener("click", (e) => {
    if (deleteMode && balance >= 20) {
        const tileElement = e.target;
        if (tileElement.classList.contains("tile")) {
            const index = Array.from(gridContainer.children).indexOf(tileElement);
            const row = Math.floor(index / 4);
            const col = index % 4;
            if (grid[row][col] !== 0) {
                grid[row][col] = 0; // Удаляем плитку
                balance -= 20; // Снимаем 20 очков с баланса за удаление плитки
                updateGrid();
            }
        }
        deleteMode = false; // Выходим из режима удаления
    }
});

// Инициализация игры при загрузке страницы
initGame();
