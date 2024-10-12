let gameBoard = [];
let score = 0;
let bestScore = 0;
const boardSize = 4;

window.onload = function () {
    initGame();
    loadGame();
};

function initGame() {
    for (let i = 0; i < boardSize * boardSize; i++) {
        gameBoard[i] = 0;
    }
    addRandomTile();
    addRandomTile();
    renderBoard();
}

function renderBoard() {
    const gameBoardElement = document.getElementById("game-board");
    gameBoardElement.innerHTML = '';
    gameBoard.forEach((tileValue, index) => {
        const tileElement = document.createElement("div");
        tileElement.classList.add("tile");
        if (tileValue) {
            tileElement.innerText = tileValue;
        }
        gameBoardElement.appendChild(tileElement);
    });
    updateScore();
}

function addRandomTile() {
    let emptyTiles = [];
    gameBoard.forEach((tile, index) => {
        if (tile === 0) {
            emptyTiles.push(index);
        }
    });

    if (emptyTiles.length > 0) {
        let randomIndex = Math.floor(Math.random() * emptyTiles.length);
        gameBoard[emptyTiles[randomIndex]] = Math.random() > 0.5 ? 2 : 4;
    }
}

function updateScore() {
    document.getElementById("score").innerText = score;
    if (score > bestScore) {
        bestScore = score;
        document.getElementById("best-score").innerText = bestScore;
    }
    saveGame();
}

function saveGame() {
    localStorage.setItem("gameBoard", JSON.stringify(gameBoard));
    localStorage.setItem("score", score);
    localStorage.setItem("bestScore", bestScore);
}

function loadGame() {
    const savedBoard = localStorage.getItem("gameBoard");
    const savedScore = localStorage.getItem("score");
    const savedBestScore = localStorage.getItem("bestScore");

    if (savedBoard) {
        gameBoard = JSON.parse(savedBoard);
        score = parseInt(savedScore);
        bestScore = parseInt(savedBestScore);
        renderBoard();
    }
}
