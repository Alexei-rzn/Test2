const gridContainer = document.getElementById("grid-container");
const scoreDisplay = document.getElementById("score");
const restartButton = document.getElementById("restart");
const gameOverDisplay = document.getElementById("game-over");

let grid = [];
let score = 0;

// Инициализация игры
function initGame() {
    grid = Array.from({ length: 4 }, () => Array(4).fill(0));
    score = 0;
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
        grid[i][j] = Math.random() < 0.8 ? 2 : 4; // 80% вероятность 2, 20% - 4
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
        setTimeout(() => {
            addNewTile();
            updateGrid();
        }, 200); // Задержка 200 мс
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
    while (newColumn.length < 4) newColumn.unshift(0); // Заполняем до 4 в начале

    return { newColumn, moved, combined };
}

// Обработка свайпов
function handleSwipe(direction) {
    move(direction);
}

// Кнопка перезапуска игры
restartButton.addEventListener("click", () => {
    gameOverDisplay.classList.add("hidden");
    initGame();
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
});

// Инициализация игры при загрузке
initGame();
