// Получаем кнопки управления
const upButton = document.getElementById("up");
const downButton = document.getElementById("down");
const leftButton = document.getElementById("left");
const rightButton = document.getElementById("right");

// Назначаем обработчики событий для кнопок
upButton.addEventListener("click", () => handleSwipe('up'));
downButton.addEventListener("click", () => handleSwipe('down'));
leftButton.addEventListener("click", () => handleSwipe('left'));
rightButton.addEventListener("click", () => handleSwipe('right'));
