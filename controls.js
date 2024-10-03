const undoButton = document.getElementById("undo");
const deleteTileButton = document.getElementById("delete");
const shuffleButton = document.getElementById("shuffle");
const addFundsButton = document.getElementById("add-funds");
const restartButton = document.getElementById("restart");

let deleteMode = false;

// Huidige balans
let balance = 0;

// Geschiedenis voor undo
let history = [];

// Huidige rooster
let grid = [];

// Teruggaan
undoButton.addEventListener("click", () => {
    if (history.length > 0) {
        grid = history.pop(); // Herstel de laatste status
        updateGrid(); // Update de interface
    }
});

// Verwijder tegel
function deleteTile() {
    if (balance >= 50) {
        const tiles = document.querySelectorAll(".tile");
        tiles.forEach(tile => {
            tile.addEventListener("click", () => {
                const tileValue = parseInt(tile.innerText);
                if (tileValue > 0) {
                    const [rowIndex, colIndex] = getTileIndex(tile);
                    grid[rowIndex][colIndex] = 0; // Verwijder tegel
                    tile.innerText = ''; // Update de interface
                    balance -= 50; // Aftrek 50
                    updateGrid(); // Update de interface

                    // Sla de status op na verwijdering
                    saveState(); 
                }
            }, { once: true });
        });
    }
}

// Toon en verberg verwijdermodus
deleteTileButton.addEventListener("mousedown", () => {
    deleteTileButton.classList.add("active");
    deleteMode = true;
    deleteTile();
});

deleteTileButton.addEventListener("mouseup", () => {
    deleteTileButton.classList.remove("active");
    deleteMode = false;
});

// Logica om de index van de tegel te krijgen
function getTileIndex(tile) {
    const index = Array.from(tile.parentNode.children).indexOf(tile);
    const rowIndex = Math.floor(index / 4);
    const colIndex = index % 4;
    return [rowIndex, colIndex];
}

// Schud tegels
shuffleButton.addEventListener("click", () => {
    if (balance >= 20) {
        shuffleTiles();
        balance -= 20; // Balans wordt opnieuw geüpdatet
        updateGrid(); // Update de interface

        // Sla de status op na het schudden
        saveState();
    }
});

// Logica om tegels te schudden
function shuffleTiles() {
    const flattenedGrid = grid.flat();
    flattenedGrid.sort(() => Math.random() - 0.5); // Schud de array
    for (let i = 0; i < 4; i++) {
        grid[i] = flattenedGrid.slice(i * 4, (i + 1) * 4);
    }
}

// Voeg geld toe
addFundsButton.addEventListener("click", () => {
    balance += 50;
    updateGrid(); // Update de interface
});

// Herstart het spel (enkel het rooster resetten)
restartButton.addEventListener("click", () => {
    gameOverDisplay.classList.add("hidden");
    initGame(); // Herstart een nieuwe game
});

// Sla de huidige staat van het spel op in de geschiedenis
function saveState() {
    if (history.length >= 10) {
        history.shift(); // Verwijder het oudste element als er meer dan 10 zijn
    }
    history.push(JSON.parse(JSON.stringify(grid))); // Sla de huidige status van het spel op
}
