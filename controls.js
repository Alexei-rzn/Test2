const restartButton = document.getElementById("restart");
const undoButton = document.getElementById("undo");
const deleteButton = document.getElementById("delete");
const shuffleButton = document.getElementById("shuffle");
const addFundsButton = document.getElementById("add-funds");
const balanceDisplay = document.getElementById("balance");

restartButton.addEventListener("click", () => {
    initGame();
});

undoButton.addEventListener("click", () => {
    // Добавьте здесь логику для хода назад
});

deleteButton.addEventListener("click", () => {
    // Добавьте здесь логику для удаления плитки
});

shuffleButton.addEventListener("click", () => {
    // Добавьте здесь логику для перемешивания плиток
});

addFundsButton.addEventListener("click", () => {
    balance += 50;
    balanceDisplay.textContent = balance;
});
