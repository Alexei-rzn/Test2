// keyboard.js
// Файл для управления с клавиатуры

document.addEventListener("keydown", (event) => {
    if (controlMode === "keyboard") {
        switch(event.key) {
            case "w":
            case "ArrowUp":
                move('up');
                break;
            case "s":
            case "ArrowDown":
                move('down');
                break;
            case "d":
            case "ArrowRight":
                move('right');
                break;
            case "a":
            case "ArrowLeft":
                move('left');
                break;
        }
    }
});
