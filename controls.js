const undoButton = document.getElementById("undo");
const deleteTileButton = document.getElementById("delete");
const shuffleButton = document.getElementById("shuffle");
const addFundsButton = document.getElementById("add-funds");

let deleteMode = false;

// Ход назад
undoButton.addEventListener("click", () => {
    if (history.length > 0 && balance >= 25) {
        grid = history.pop();
        balance -= 25;
        updateGrid();
    }
});

// Удаление плитки
deleteTileButton.addEventListener("click", () => {
    deleteMode = !deleteMode;
    deleteTileButton.style.backgroundColor = deleteMode ? "#ff6666" : "#8f7a66";
});

gridContainer.addEventListener("click", (event) => {
    if (deleteMode && balance >= 50) {
        const target = event.target;
        if (target.classList.contains("tile") && target.innerText !== "") {
            const index = Array.from(gridContainer.children).indexOf(target);
            const i = Math.floor(index / 4);
            const j = index % 4;
            grid[i][j] = 0;
            balance -= 50;
            deleteMode = false;
            deleteTileButton.style.backgroundColor = "#8f7a66";
            updateGrid();
        }
    }
});

// Перемешивание плиток
shuffleButton.addEventListener("click", () => {
    if (balance >= 100) {
        grid = grid.flat().sort(() => Math.random() - 0.5).reduce((rows, value, index) => {
            if (index % 4 === 0) rows.push([]);
            rows[rows.length - 1].push(value);
            return rows;
        }, []);
        balance -= 100;
        updateGrid();
    }
});

// Пополнение баланса
addFundsButton.addEventListener("click", () => {
    balance += 50;
    updateGrid();
});
