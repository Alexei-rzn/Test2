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

// Functions for swiping
function swipeLeft() {
    console.log("Swiped left");
    // Logic for moving tiles left
}

function swipeRight() {
    console.log("Swiped right");
    // Logic for moving tiles right
}

function swipeUp() {
    console.log("Swiped up");
    // Logic for moving tiles up
}

function swipeDown() {
    console.log("Swiped down");
    // Logic for moving tiles down
}
