// События для кнопок "Перезапуск", "Ход назад" и "Удалить плитку"
document.getElementById("restart").addEventListener("click", () => {
    gameOverDisplay.classList.add("hidden");
    initGame();
});

document.getElementById("undo-btn").addEventListener("click", () => {
    undoMove();
});

document.getElementById("delete-btn").addEventListener("click", () => {
    const x = parseInt(document.getElementById("delete-x").value, 10);
    const y = parseInt(document.getElementById("delete-y").value, 10);
    
    if (x >= 0 && x <= 3 && y >= 0 && y <= 3) {
        deleteTile(x, y);
    } else {
        alert("Введите корректные координаты X и Y (0-3)");
    }
});
