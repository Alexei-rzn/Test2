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

// Обработчики для переключателей управления
document.getElementById("touch-control").addEventListener("click", () => {
    controlMode = "touch";
    controlIcon.src = "touch-control.png"; // Изменяем изображение
});

document.getElementById("keyboard-control").addEventListener("click", () => {
    controlMode = "keyboard";
    controlIcon.src = "keyboard-control.png"; // Изменяем изображение
});

document.getElementById("voice-control").addEventListener("click", () => {
    controlMode = "voice";
    controlIcon.src = "voice-control.png"; // Изменяем изображение
    if ('webkitSpeechRecognition' in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.onresult = (event) => {
            const command = event.results[0][0].transcript.toLowerCase();
            switch (command) {
                case "up":
                    move('up');
                    break;
                case "down":
                    move('down');
                    break;
                case "right":
                    move('right');
                    break;
                case "left":
                    move('left');
                    break;
            }
        };
        recognition.start(); // Начинаем распознавание
    }
});
