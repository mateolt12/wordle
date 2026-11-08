export function renderBoard(totalAttempts, wordLength) {
    const board = document.querySelector(".board");

    for (let attempt = 1; attempt <= totalAttempts; attempt++) {
        const row = document.createElement("div");
        row.className = "board__row";
        row.id = `div_intento_${attempt}`;
        row.setAttribute("aria-label", `Intento ${attempt}`);

        for (let column = 1; column <= wordLength; column++) {
            const cell = document.createElement("input");
            cell.className = "tile";
            cell.type = "text";
            cell.id = `cell-${attempt}-${column}`;
            cell.maxLength = 1;
            cell.readOnly = true;
            cell.autocapitalize = "characters";
            cell.autocomplete = "off";
            cell.spellcheck = false;
            cell.setAttribute("aria-label", `Intento ${attempt}, letra ${column}`);
            cell.dataset.row = attempt;
            cell.dataset.col = column;
            row.appendChild(cell);
        }

        board.appendChild(row);
    }
}
