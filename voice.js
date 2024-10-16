// Файл для управления голосом

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

    recognition.onend = () => {
        if (controlMode === "voice") {
            recognition.start(); // Перезапускаем распознавание
        }
    };

    recognition.start(); // Начинаем распознавание
}
