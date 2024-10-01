const gridContainer = document.getElementById("grid-container");
const scoreDisplay = document.getElementById("score");
const bonusScoreDisplay = document.getElementById("bonus-score");
const restartButton = document.getElementById("restart");
const gameOverDisplay = document.getElementById("game-over");

let grid = [];
let score = 0;
let bonusScore = 100; // Начальный бонусный счет
let history = []; // Стек для хранения предыдущих состояний
let deleteMode = false; // Режим удаления плитки

// Инициализация игры
function initGame() {
    grid = Array.from({ length: 4 }, () => Array(4).fill(0));
    score = 0;
    history = []; // Сбрасываем историю
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
    bonusScoreDisplay.innerText = bonusScore; // Обновляем бонусный счет

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

// Ход назад
function undoMove() {
    if (history.length > 0 && bonusScore >= 25) {
        grid = history.pop(); // Восстанавливаем последнее состояние
        bonusScore -= 25; // Списываем 25 очков
        updateGrid();
    }
}

// Удаление плитки
function deleteTile(i, j) {
    if (grid[i][j] !== 0 && bonusScore >= 30) {
        grid[i][j] = 0; // Удаляем плитку
        bonusScore -= 30; // Списываем 30 очков
        updateGrid();
    }
}

// Перемешивание плиток
function shuffleTiles() {
    if (bonusScore >= 20) {
        const flatGrid = grid.flat().filter(value => value !== 0); // Убираем нули
        for (let i = flatGrid.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [flatGrid[i], flatGrid[j]] = [flatGrid[j], flatGrid[i]]; // Перемешиваем
        }
        // Заполняем сетку новыми перемешанными плитками
        grid = Array.from({ length: 4 }, () => Array(4).fill(0));
        flatGrid.forEach((value, index) => {
            const row = Math.floor(index / 4);
            const col = index % 4;
            grid[row][col] = value;
        });
        bonusScore -= 20; // Списываем 20 очков
        updateGrid();
    }
}

// Логика сдвига плиток в строке
function slideRow(row, direction) {
    let newRow = row.filter(value => value); // Удаляем нули
    const emptySpaces = 4 - newRow.length; // Количество пустых мест
    let moved = false;
    let combined = false;

    // Добавляем пустые места в конец или начало в зависимости от направления
    if (direction === 'left') {
        newRow = [...newRow, ...Array(emptySpaces).fill(0)];
    } else {
        newRow = [...Array(emptySpaces).fill(0), ...newRow];
    }

    // Складывание плиток
    for (let i = 0; i < 3; i++) {
        if (newRow[i] !== 0 && newRow[i] === newRow[i + 1]) {
            newRow[i] *= 2; // Складываем плитки
            score += newRow[i]; // Увеличиваем счёт
            newRow[i + 1] = 0; // Обнуляем следующую плитку
            combined = true; // Отметить, что произошло складывание
        }
    }

    // Проверка на движение
    if (JSON.stringify(newRow) !== JSON.stringify(row)) {
        moved = true; // Отметить, что произошло движение
    }

    // Убираем нули после складывания
    newRow = newRow.filter(value => value);
    while (newRow.length < 4) newRow.push(0); // Заполняем до 4

    return { newRow, moved, combined };
}

// Логика сдвига плиток в колонне вверх
function slideColumnUp(column) {
    let newColumn = column.filter(value => value); // Удаляем нули
    let moved = false;
    let combined = false;

    while (newColumn.length < 4) newColumn.push(0); // Заполняем до 4

    // Складывание плиток
    for (let i = 0; i < 3; i++) {
        if (newColumn[i] !== 0 && newColumn[i] === newColumn[i + 1]) {
            newColumn[i] *= 2; // Складываем плитки
            score += newColumn[i]; // Увеличиваем счёт
            newColumn[i + 1] = 0; // Обнуляем следующую плитку
            combined = true; // Отметить, что произошло складывание
        }
    }

    // Проверка на движение
    if (JSON.stringify(newColumn) !== JSON.stringify(column)) {
        moved = true; // Отметить, что произошло движение
    }

    // Убираем нули после складывания
    newColumn = newColumn.filter(value => value);
    while (newColumn.length < 4) newColumn.push(0); // Заполняем до 4

    return { newColumn, moved, combined };
}

// Логика сдвига плиток в колонне вниз
function slideColumnDown(column) {
    let newColumn = column.filter(value => value); // Удаляем нули
    let moved = false;
    let combined = false;

    while (newColumn.length < 4) newColumn.unshift(0); // Заполняем до 4 в начале

    // Складывание плиток
    for (let i = 3; i > 0; i--) {
        if (newColumn[i] !== 0 && newColumn[i] === newColumn[i - 1]) {
            newColumn[i] *= 2; // Складываем плитки
            score += newColumn[i]; // Увеличиваем счёт
            newColumn[i - 1] = 0; // Обнуляем предыдущую плитку
            combined = true; // Отметить, что произошло складывание
        }
    }

    // Проверка на движение
    if (JSON.stringify(newColumn) !== JSON.stringify(column)) {
        moved = true; // Отметить, что произошло движение
    }

    // Убираем нули после складывания
    newColumn = newColumn.filter(value => value);
    while (newColumn.length < 4) newColumn.unshift(0); // Заполняем до 4

    return { newColumn, moved, combined };
}

// Обработка свайпов
function handleSwipe(direction) {
    move(direction);
}

// Кнопка перезапуска игры
restartButton.addEventListener("click", () => {
    if (bonusScore >= 10) {
        gameOverDisplay.classList.add("hidden");
        bonusScore -= 10; // Списываем 10 очков
        initGame();
    }
});

// События касания
let startX, startY;
gridContainer.addEventListener("touchstart", (event) => {
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
});

gridContainer.addEventListener("touchend", (event) => {
    const endX = event.changedTouches[0].clientX;
    const endY = event.changedTouches[0].clientY;

    const deltaX = endX - startX;
    const deltaY = endY - startY;

    if (deleteMode) {
        // Выбор плитки для удаления
        const tileToDelete = getTileFromTouch(startX, startY);
                if (tileToDelete) {
            const { row, col } = tileToDelete;
            deleteTile(row, col);
            deleteMode = false; // Выключаем режим удаления после удаления плитки
        }
    } else {
        // Определяем движение
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Определяем горизонтальное движение
            if (deltaX > 0) {
                handleSwipe('right'); // Свайп вправо
            } else {
                handleSwipe('left'); // Свайп влево
            }
        } else {
            // Определяем вертикальное движение
            if (deltaY > 0) {
                handleSwipe('down'); // Свайп вниз
            } else {
                handleSwipe('up'); // Свайп вверх
            }
        }
    }
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

// Создаем кнопки для дополнительных действий
const undoButton = document.createElement("button");
undoButton.innerText = "Ход назад";
undoButton.addEventListener("click", undoMove);
document.body.appendChild(undoButton);

const deleteTileButton = document.createElement("button");
deleteTileButton.innerText = "Удалить плитку";
deleteTileButton.addEventListener("click", () => {
    deleteMode = !deleteMode; // Переключаем режим удаления
    deleteTileButton.style.backgroundColor = deleteMode ? "lightcoral" : ""; // Меняем цвет кнопки для визуального обозначения
});
document.body.appendChild(deleteTileButton);

const shuffleButton = document.createElement("button");
shuffleButton.innerText = "Перемешать плитки";
shuffleButton.addEventListener("click", shuffleTiles);
document.body.appendChild(shuffleButton);

// Создаем поле для отображения бонусного счета
const bonusScoreElement = document.createElement("div");
bonusScoreElement.id = "bonus-score";
bonusScoreElement.innerText = bonusScore;
bonusScoreElement.style.fontSize = "20px";
bonusScoreElement.style.marginBottom = "10px";
document.body.prepend(bonusScoreElement);

// Инициализация игры при загрузке
initGame();
