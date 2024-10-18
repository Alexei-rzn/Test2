class GameControls {
    constructor(game) {
        this.game = game;
        this.initControls();
    }

    initControls() {
        document.getElementById("undo").addEventListener("click", () => this.undo());
        document.getElementById("delete").addEventListener("mousedown", () => this.deleteTileMode(true));
        document.getElementById("delete").addEventListener("mouseup", () => this.deleteTileMode(false));
        document.getElementById("shuffle").addEventListener("click", () => this.shuffleTiles());
        document.getElementById("add-funds").addEventListener("click", () => this.addFunds());
        document.getElementById("restart").addEventListener("click", () => this.restartGame());
        document.getElementById("rules").addEventListener("click", () => this.openRules());
        document.getElementById("share").addEventListener("click", () => this.shareGame());
        document.getElementById("sound").addEventListener("click", () => this.toggleSound());
        document.getElementById("rating").addEventListener("click", () => this.openLeaderboard());
    }

    undo() {
        if (this.game.history.length > 0 && this.game.balance >= 30) {
            this.game.grid = this.game.history.pop();
            this.game.balance -= 30;
            this.game.additionalClicks++;
            this.game.updateGrid();
        }
    }

    deleteTileMode(active) {
        if (active) {
            this.deleteTile();
        }
    }

    deleteTile() {
        if (this.game.balance >= 50) {
            const tiles = document.querySelectorAll(".tile");
            tiles.forEach(tile => {
                tile.addEventListener("click", () => {
                    const tileValue = parseInt(tile.innerText);
                    if (tileValue > 0) {
                        const [rowIndex, colIndex] = this.getTileIndex(tile);
                        this.game.grid[rowIndex][colIndex] = 0;
                        tile.innerText = '';
                        this.game.balance -= 50;
                        this.game.additionalClicks++;
                        this.game.updateGrid();
                        this.game.saveState();
                    }
                }, { once: true });
            });
        }
    }

    shuffleTiles() {
        if (this.game.balance >= 20) {
            const flattenedGrid = this.game.grid.flat();
            flattenedGrid.sort(() => Math.random() - 0.5);
            for (let i = 0; i < 4; i++) {
                this.game.grid[i] = flattenedGrid.slice(i * 4, (i + 1) * 4);
            }
            this.game.balance -= 20;
            this.game.additionalClicks++;
            this.game.updateGrid();
            this.game.saveState();
        }
    }

    addFunds() {
        this.game.balance += 50;
        this.game.additionalClicks++;
        this.game.updateGrid();
    }

    restartGame() {
        this.game.gameOverDisplay.classList.add("hidden");
        this.game.initGame();
    }

    openRules() {
        window.location.href = "rules.html";
    }

    shareGame() {
        const shareText = "Я сыграл в 2048! Попробуйте и вы!";
        const url = window.location.href;
        const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText)}`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)} ${encodeURIComponent(url)}`;
        const viberUrl = `viber://forward?text=${encodeURIComponent(shareText)} ${encodeURIComponent(url)}`;
        window.open(telegramUrl, '_blank');
        window.open(whatsappUrl, '_blank');
        window.open(viberUrl, '_blank');
        navigator.clipboard.writeText(url);
    }

    toggleSound() {
        this.game.soundEnabled = !this.game.soundEnabled;
        document.getElementById("sound-icon").src = this.game.soundEnabled ? "sound-on.png" : "sound-off.png";
    }

    openLeaderboard() {
        window.location.href = "victory.html";
    }

    getTileIndex(tile) {
        const index = Array.from(tile.parentNode.children).indexOf(tile);
        const rowIndex = Math.floor(index / 4);
        const colIndex = index % 4;
        return [rowIndex, colIndex];
    }
}

// Инициализация управления
new GameControls(game);
