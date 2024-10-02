const boardSize = 4;
let board = [];
let hasMoved = false;

function initializeBoard() {
    board = Array(boardSize).fill().map(() => Array(boardSize).fill(0));
    addNewTile();
    addNewTile();
    renderBoard();
}

function renderBoard() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = ''; // Очистка предыдущего состояния
    
    board.forEach(row => {
        row.forEach(tile => {
            const tileElement = document.createElement('div');
            tileElement.classList.add('tile');
            if (tile > 0) {
                tileElement.innerText = tile;
                tileElement.setAttribute('data-value', tile);
            }
            gameBoard.appendChild(tileElement);
        });
    });
}

function addNewTile() {
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

function moveTile(row, col, newRow, newCol) {
    if (board[newRow][newCol] === 0 || board[newRow][newCol] === board[row][col]) {
        if (board[newRow][newCol] === board[row][col]) {
            board[newRow][newCol] *= 2; // Объединение плиток
        } else {
            board[newRow][newCol] = board[row][col];
        }
        board[row][col] = 0;
        hasMoved = true;
    }
}

function move(direction) {
    hasMoved = false;
    
    switch (direction) {
        case 'up':
            for (let col = 0; col < boardSize; col++) {
                for (let row = 1; row < boardSize; row++) {
                    if (board[row][col] > 0) {
                        let newRow = row;
                        while (newRow > 0 && (board[newRow - 1][col] === 0 || board[newRow - 1][col] === board[newRow][col])) {
                            newRow--;
                        }
                        if (newRow !== row) {
                            moveTile(row, col, newRow, col);
                        }
                    }
                }
            }
            break;
        case 'down':
            for (let col = 0; col < boardSize; col++) {
                for (let row = boardSize - 2; row >= 0; row--) {
                    if (board[row][col] > 0) {
                        let newRow = row;
                        while (newRow < boardSize - 1 && (board[newRow + 1][col] === 0 || board[newRow + 1][col] === board[newRow][col])) {
                            newRow++;
                        }
                        if (newRow !== row) {
                            moveTile(row, col, newRow, col);
                        }
                    }
                }
            }
            break;
        case 'left':
            for (let row = 0; row < boardSize; row++) {
                for (let col = 1; col < boardSize; col++) {
                    if (board[row][col] > 0) {
                        let newCol = col;
                        while (newCol > 0 && (board[row][newCol - 1] === 0 || board[row][newCol - 1] === board[row][newCol])) {
                            newCol--;
                        }
                        if (newCol !== col) {
                            moveTile(row, col, row, newCol);
                        }
                    }
                }
            }
            break;
        case 'right':
            for (let row = 0; row < boardSize; row++) {
                for (let col = boardSize - 2; col >= 0; col--) {
                    if (board[row][col] > 0) {
                        let newCol = col;
                        while (newCol < boardSize - 1 && (board[row][newCol + 1] === 0 || board[row][newCol + 1] === board[row][newCol])) {
                            newCol++;
                        }
                        if (newCol !== col) {
                            moveTile(row, col, row, newCol);
                        }
                    }
                }
            }
            break;
    }
    
    if (hasMoved) {
        addNewTile();
        renderBoard();
    }
    
    if (checkGameOver()) {
        alert('Game Over!');
    }
}

function checkGameOver() {
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            if (board[row][col] === 0) return false;
            if (col < boardSize - 1 && board[row][col] === board[row][col + 1]) return false;
            if (row < boardSize - 1 && board[row][col] === board[row + 1][col]) return false;
        }
    }
    return true;
}

function restartGame() {
    initializeBoard();
}

initializeBoard();
                 
