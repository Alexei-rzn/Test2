let removalLimit = 1;
let shuffleLimit = 1;
let removalCount = 0;
let shuffleCount = 0;
let undoUsed = false;

// Grid and game state management
let grid = [];
let score = 0;
let balance = 100;

// Tile removal logic
function removeTile() {
    if (removalCount < removalLimit) {
        // Existing remove tile logic
        console.log("Tile removed");
        removalCount++;
    } else {
        alert("You've reached the limit for tile removals this turn.");
    }
}

// Shuffle tiles logic
function shuffleTiles() {
    if (shuffleCount < shuffleLimit) {
        // Existing shuffle logic
        console.log("Tiles shuffled");
        shuffleCount++;
    } else {
        alert("You've reached the limit for shuffles this turn.");
    }
}

// Undo move logic
function undoMove() {
    if (!undoUsed) {
        // Perform the undo
        restorePreviousState(); // Custom function to load the previous state
        balance--;  // Deduct balance once
        console.log("Move undone");
        undoUsed = true;
    }
}

// End turn reset
function endTurn() {
    removalCount = 0;
    shuffleCount = 0;
    undoUsed = false;
    console.log("Turn ended");
}

// Save game state to localStorage
function saveGame() {
    const gameState = {
        grid: JSON.stringify(grid),
        score: score,
        balance: balance
    };
    localStorage.setItem('gameState', JSON.stringify(gameState));
    alert("Game saved!");
}

// Load game state from localStorage
function loadGame() {
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
        const gameState = JSON.parse(savedState);
        grid = JSON.parse(gameState.grid);
        score = gameState.score;
        balance = gameState.balance;
        updateGameBoard(); // Ensure to update the visuals
        alert("Game loaded!");
    } else {
        alert("No saved game found.");
    }
}

// Update game board UI
function updateGameBoard() {
    // Logic to refresh the visual representation of the grid
    console.log("Game board updated");
}

// Tile movement with animation
function moveTile(tile, x, y) {
    tile.style.setProperty('--moveX', x + 'px');
    tile.style.setProperty('--moveY', y + 'px');
    tile.classList.add('moving');
    setTimeout(() => tile.classList.remove('moving'), 200); // Remove class after animation
}
