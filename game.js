const boardSize = 4;

let board = [];

let previousState = [];

let score = 0;

let movesHistory = [];

let maxUndo = 3;



window.onload = function() {

    initializeBoard();

    loadGame();

    renderBoard();

};



function initializeBoard() {

    board = Array(boardSize).fill().map(() => Array(boardSize).fill(0));

    generateRandomTile();

    generateRandomTile();

}



function renderBoard() {

    const gameBoard = document.getElementById('game-board');

    gameBoard.innerHTML = '';

    for (let row = 0; row < boardSize; row++) {

        for (let col = 0; col < boardSize; col++) {

            const tile = document.createElement('div');

            tile.classList.add('tile');

            tile.textContent = board[row][col] === 0 ? '' : board[row][col];

            gameBoard.appendChild(tile);

        }

    }

}



function generateRandomTile() {

    let emptyTiles = [];

    for (let row = 0; row < boardSize; row++) {

        for (let col = 0; col < boardSize; col++) {

            if (board[row][col] === 0) {

                emptyTiles.push({ row, col });

            }

        }

    }

    if (emptyTiles.length > 0) {

        let { row, col } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];

        board[row][col] = Math.random() < 0.9 ? 2 : 4;

    }

}



function saveGame() {

    localStorage.setItem('board', JSON.stringify(board));

    localStorage.setItem('score', score);

}



function loadGame() {

    const savedBoard = localStorage.getItem('board');

    const savedScore = localStorage.getItem('score');

    if (savedBoard) {

        board = JSON.parse(savedBoard);

        score = savedScore ? parseInt(savedScore) : 0;

    }

}



function undoMove() {

    if (movesHistory.length > 0 && maxUndo > 0) {

        board = movesHistory.pop();

        renderBoard();

        maxUndo--;

    }

}



function deleteTile() {

    let maxTile = Math.max(...board.flat());

    if (maxTile > 0) {

        for (let row = 0; row < boardSize; row++) {

            for (let col = 0; col < boardSize; col++) {

                if (board[row][col] === maxTile) {

                    board[row][col] = 0;

                    renderBoard();

                    return;

                }

            }

        }

    }

}



function shuffleBoard() {

    let tiles = board.flat().filter(tile => tile !== 0);

    board = Array(boardSize).fill().map(() => Array(boardSize).fill(0));

    tiles.forEach(tile => generateRandomTile());

    renderBoard();

}
