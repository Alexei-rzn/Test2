class GameControls {
    constructor(game) {
        this.game = game;
        this.undoButton = document.getElementById("undo");
        this.deleteTileButton = document.getElementById("delete");
        this.shuffleButton = document.getElementById("shuffle");
        this.addFundsButton = document.getElementById("add-funds");
        this.restartButton = document.getElementById("restart");
        this.rulesButton = document.getElementById("rules");
        this.shareButton = document.getElementById("share");
        this.soundButton = document.getElementById("sound");
        this.soundIcon = document.getElementById("sound-icon");
        this.ratingButton = document.getElementById("rating");

        this.deleteMode = false;

        this.initControls();
    }

    initControls() {
        this.undoButton.addEventListener("click", () => this.handleUndo());
        this.deleteTileButton.addEventListener("mousedown", () => this.handleDeleteMode(true));
        this.deleteTileButton.addEventListener("mouseup", () => this.handleDeleteMode(false));
        this.shuffleButton.addEventListener("click", () => this.handleShuffle());
        this.addFundsButton.addEventListener("click", () => this.handleAddFunds());
        this.restartButton.addEventListener("click", () => this.handleRestart());
        this.rulesButton.addEventListener("click", () => this.handleRules());
        this.shareButton.addEventListener("click", () => this.handleShare());
        this.soundButton.addEventListener("click", () => this.handleSoundToggle());
        this.ratingButton.addEventListener("click", () => this.handleRating());
    }

    handleUndo() {
        if (this.game.history.length > 0 && this.game.balance >= 30) {
            this.game.grid = this.game.history.pop();
            this.game.balance -= 30;
            this.game.additionalClicks++;
            this.game.updateGrid();
        }
    }

    handleDeleteMode(active) {
        this.deleteTileButton.classList.toggle("active", active);
        this.deleteMode = active;
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
                        this.game.grid[rowIndex][colIndex] = 0; // Удаляем плитку
                        tile.innerText = ''; // Обновляем интерфейс
                        this.game.balance -= 50; // Списываем 50
                        this.game.additionalClicks++;
                        this.game.updateGrid();
                        this.game.saveState();
                    }
                }, { once: true });
            });
        }
    }

    getTileIndex(tile) {
        const index = Array.from(tile.parentNode.children).indexOf(tile);
        const rowIndex = Math.floor(index / 4);
        const colIndex = index % 4;
        return [rowIndex, colIndex];
    }

    handleShuffle() {
        if (this.game.balance >= 20) {
            this.shuffleTiles();
            this.game.balance -= 20;
            this.game.additionalClicks++;
            this.game.updateGrid();
            this.game.saveState();
        }
    }

    shuffleTiles() {
        const flattenedGrid = this.game.grid.flat();
        flattenedGrid.sort(() => Math.random() - 0.5);
        for (let i = 0; i < 4; i++) {
            this.game.grid[i] = flattenedGrid.slice(i * 4, (i + 1) * 4);
        }
    }

    handleAddFunds() {
        this.game.balance += 50;
        this.game.additionalClicks++;
        this.game.updateGrid();
    }

    handleRestart() {
        this.game.gameOverDisplay.classList.add("hidden");
        this.game.initGame();
    }

    handleRules() {
        window.location.href = "rules.html";
    }

    handleShare() {
        const shareText = "Я сыграл в 2048! Попробуйте и вы!";
        const url = window.location.href;
        const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText)}`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)} ${encodeURIComponent(url)}`;
        const viberUrl = `viber://forward?text=${encodeURIComponent(shareText)} ${encodeURIComponent(url)}`;

        window.open(telegramUrl, '_blank');
        window.open(whatsappUrl, '_blank');
        window.open(viberUrl, '_blank');

        navigator.clipboard.writeText(url)
            .then(() => {
                alert("Ссылка на игру скопирована в буфер обмена!");
            })
            .catch(err => console.error('Ошибка копирования:', err));
    }

    handleSoundToggle() {
        this.game.soundEnabled = !this.game.soundEnabled;
        this.soundIcon.src = this.game.soundEnabled ? "sound-on.png" : "sound-off.png";
    }

    handleRating() {
        window.location.href = "victory.html";
    }
}

const gameControls = new GameControls(game2048);
