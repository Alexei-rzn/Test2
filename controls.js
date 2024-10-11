let startX, startY;

function handleTouchStart(evt) {
    const touch = evt.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
}

function handleTouchEnd(evt) {
    const touch = evt.changedTouches[0];
    const diffX = touch.clientX - startX;
    const diffY = touch.clientY - startY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 50) swipeRight();
        if (diffX < -50) swipeLeft();
    } else {
        if (diffY > 50) swipeDown();
        if (diffY < -50) swipeUp();
    }
}

document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchend', handleTouchEnd, false);

// Функции для свайпов
function swipeLeft() {
    console.log("Свайп влево");
    // Логика перемещения плиток влево
}

function swipeRight() {
    console.log("Свайп вправо");
    // Логика перемещения плиток вправо
}

function swipeUp() {
    console.log("Свайп вверх");
    // Логика перемещения плиток вверх
}

function swipeDown() {
    console.log("Свайп вниз");
    // Логика перемещения плиток вниз
}
