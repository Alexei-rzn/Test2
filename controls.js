document.getElementById('undo-button').addEventListener('click', undoMove);
document.getElementById('delete-button').addEventListener('click', deleteTile);
document.getElementById('shuffle-button').addEventListener('click', shuffleBoard);
"""

# Save the files to the filesystem
with open("/mnt/data/index.html", "w") as file:
    file.write(html_content)

with open("/mnt/data/styles.css", "w") as file:
    file.write(css_content)

with open("/mnt/data/game.js", "w") as file:
    file.write(game_js_content)

with open("/mnt/data/controls.js", "w") as file:
    file.write(controls_js_content)

"/mnt/data/index.html", "/mnt/data/styles.css", "/mnt/data/game.js", "/mnt/data/controls.js"
