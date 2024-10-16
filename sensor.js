// Файл для управления сенсорным управлением

let touchStartX = 0;
let touchStartY = 0;

gridContainer.addEventListener('touchstart', (event) => {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
});

gridContainer.addEventListener('touchmove', (event) => {
    event.preventDefault(); // предотвращаем прокрутку страницы
});

gridContainer.addEventListener('touchend', (event) => {
    const touchEndX = event.changedTouches[0].clientX;
    const touchEndY = event.changedTouches[0].clientY;

    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    if (absDeltaX > absDeltaY && absDeltaX > 30) {
        if (deltaX > 0) {
            move('right');
        } else {
            move('left');
        }
    } else if (absDeltaY > absDeltaX && absDeltaY > 30) {
        if (deltaY > 0) {
            move('down');
        } else {
            move('up');
        }
    }
});
