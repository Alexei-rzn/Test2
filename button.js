// button.js
// Файл для управления остальными кнопками

const submitScoreButton = document.getElementById("submit-score");
const playerNameInput = document.getElementById("player-name");

// Сохранение результата в таблицу лидеров
submitScoreButton.addEventListener("click", () => {
    const name = playerNameInput.value.trim();
    if (name) {
        saveToLeaderboard(name);
        playerNameInput.value = ''; // Очищаем поле ввода
        loadLeaderboard(); // Перезагружаем таблицу лидеров
        gameOverDisplay.classList.add("hidden"); // Скрываем окно окончания игры
        submitScoreButton.disabled = true; // Запрещаем повторное нажатие
        initGame(); // Начинаем новую игру
    } else {
        alert("Пожалуйста, введите ваше имя!");
    }
});

// Обработчик для кнопки назад
document.getElementById("back-button").addEventListener("click", () => {
    window.location.href = "index.html"; // Переход обратно к игре
});
