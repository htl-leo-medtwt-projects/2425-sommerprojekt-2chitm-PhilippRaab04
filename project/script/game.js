function createGameBoard() {
    const board = document.getElementById('game-board');

    const rows = 7;
    const cols = 7;

    //basen
    const baseCoordinates = ["0-0", "0-3", "0-6", "6-0", "6-3", "6-6"];

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');

            // Koordinate des aktuellen Feldes
            const coordinate = `${row}-${col}`;

            // checkt durch ob wo ne basis hingehört
            if (baseCoordinates.includes(coordinate)) {
                const base = document.createElement('div');
                base.classList.add('base'); // Klasse für die Basis
                cell.appendChild(base);
            }

            if ((row === 0 || row === 1 || row === 5 || row === 6) && col >= 0 && col <= 6) {
                cell.classList.add('dark-cell'); // Dunkelgraue Zelle
            }

            board.appendChild(cell);
        }
    }
}

createGameBoard();