const undoButton = document.getElementById("undo");
const deleteTileButton = document.getElementById("delete");
const shuffleButton = document.getElementById("shuffle");
const addFundsButton = document.getElementById("add-funds");
const restartButton = document.getElementById("restart");
const rulesButton = document.getElementById("rules");
const ratingButton = document.getElementById("rating");
const soundButton = document.getElementById("sound");
const soundIcon = document.getElementById("sound-icon");
const submitScoreButton = document.getElementById("submit-score");
const gameOverDisplay = document.getElementById("game-over");
const playerNameInput = document.getElementById("player-name");
const difficultyButton = document.getElementById("difficulty");

let currentDifficulty = 0;
difficultyButton.innerText = currentDifficulty + 1;

undoButton.addEventListener("click", () => {
    if (game.history.length > 0 && game.balance >= 30) {
        game.grid = game.history.pop();
        game.balance -= 30;
        game.additionalClicks++;
        game.updateGrid();
    }
});

function deleteTile() {
    if (game.balance >= 50) {
        const tiles = document.querySelectorAll(".tile");
        tiles.forEach(tile => {
            tile.addEventListener("click", () => {
                const tileValue = parseInt(tile.innerText);
                if (tileValue > 0) {
                    const [rowIndex, colIndex] = getTileIndex(tile);
                    game.grid[rowIndex][colIndex] = 0;
                    tile.innerText = '';
                    game.balance -= 50;
                    game.additionalClicks++;
                    game.updateGrid();
                    game.saveState();
                }
            }, { once: true });
        });
    }
}

deleteTileButton.addEventListener("mousedown", () => {
    deleteTileButton.classList.add("active");
    deleteTile();
});

deleteTileButton.addEventListener("mouseup", () => {
    deleteTileButton.classList.remove("active");
});

function getTileIndex(tile) {
    const index = Array.from(tile.parentNode.children).indexOf(tile);
    const rowIndex = Math.floor(index / 4);
    const colIndex = index % 4;
    return [rowIndex, colIndex];
}

shuffleButton.addEventListener("click", () => {
    if (game.balance >= 20) {
        shuffleTiles();
        game.balance -= 20;
        game.additionalClicks++;
        game.updateGrid();
        game.saveState();
    }
});

function shuffleTiles() {
    const flattenedGrid = game.grid.flat();
    flattenedGrid.sort(() => Math.random() - 0.5);
    for (let i = 0; i < 4; i++) {
        game.grid[i] = flattenedGrid.slice(i * 4, (i + 1) * 4);
    }
}

addFundsButton.addEventListener("click", () => {
    game.balance += 50;
    game.additionalClicks++;
    game.updateGrid();
});

difficultyButton.addEventListener("click", () => {
    if (game.canChangeDifficulty) { // Проверяем, можно ли менять уровень сложности
        currentDifficulty = (currentDifficulty + 1) % 5;
        difficultyButton.innerText = currentDifficulty + 1;
        game.setDifficulty(currentDifficulty);
    }
});

restartButton.addEventListener("click", () => {
    gameOverDisplay.classList.add("hidden");
    game.initGame();
});

ratingButton.addEventListener("click", () => {
    window.location.href = "victory.html";
});

rulesButton.addEventListener("click", () => {
    window.location.href = "rules.html";
});

soundButton.addEventListener("click", () => {
    game.soundEnabled = !game.soundEnabled;
    soundIcon.src = game.soundEnabled ? "sound-on.png" : "sound-off.png";
});

submitScoreButton.addEventListener("click", () => {
    const name = playerNameInput.value.trim();
    if (name) {
        game.saveToLeaderboard(name, difficultyButton.innerText);
        playerNameInput.value = '';
        gameOverDisplay.classList.add("hidden");
        game.initGame();
    } else {
        alert("Пожалуйста, введите ваше имя!");
    }
});
