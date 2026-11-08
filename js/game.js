import { renderBoard } from "./board.js";
import { getGeneratedWord, normalizeWord } from "./words.js";

const TOTAL_ATTEMPTS = 6;
const WORD_LENGTH = 5;
let generatedWord;

let currentAttempt = 1;
let currentColumn = 0;
let currentWord = "";
let gameFinished = false;

export async function initializeGame() {
    renderBoard(TOTAL_ATTEMPTS, WORD_LENGTH);
    // const game = new Game();
    generatedWord = await getGeneratedWord();
    // game.start();
    console.log("El juego ha comenzado");
    console.log("La palabra es:", generatedWord);
}

export function handleKeyPress(event) {
    if (gameFinished) {
        return;
    }

    const key = normalizeWord(event.key);
    // Nos interesan solo las letras, Enter y Backspace
    if (/^[A-ZÑ]$/.test(key)) {
        event.preventDefault();
        handleLetterInput(key);
    } else if (event.key === "Enter") {
        event.preventDefault();
        // Lógica para enviar la palabra actual
        submitWord(currentWord, generatedWord);
        currentWord = "";
    } else if (event.key === "Backspace") {
        event.preventDefault();
        // Lógica para eliminar la última letra de la palabra actual
        currentWord = deleteLetter(currentWord);
    }
}

function handleLetterInput(letter) {
    if (currentAttempt > TOTAL_ATTEMPTS || currentColumn >= WORD_LENGTH) {
        return;
    }

    const row = document.getElementById(`div_intento_${currentAttempt}`);
    const cell = row.querySelector(`#cell-${currentAttempt}-${currentColumn + 1}`);
    cell.value = letter;
    currentColumn++;
    currentWord += letter; // Agrega la letra a la palabra actual
}

async function submitWord(word, generatedWord) {
    if (currentColumn !== WORD_LENGTH || currentAttempt > TOTAL_ATTEMPTS) {
        return;
    }
    const colorsArray = evaluateGuess(word, generatedWord);
    const tilesPainted = colorGuessTiles(currentAttempt, colorsArray);
    if (word === generatedWord) {
        gameFinished = true;
        await tilesPainted;
        handleWin();
        return;
    }

    if (currentAttempt >= TOTAL_ATTEMPTS) {
        gameFinished = true;
        await tilesPainted;
        handleLoss();
        return;
    }

    currentAttempt++;
    currentColumn = 0;
}

function deleteLetter(currentWord) {
    if (currentColumn === 0 || currentAttempt > TOTAL_ATTEMPTS) {
        return;
    }

    currentColumn--;
    const cell = document.getElementById(`cell-${currentAttempt}-${currentColumn + 1}`);
    cell.value = "";
    currentWord = currentWord.slice(0, -1); // Elimina la última letra de la palabra actual
    return currentWord;
}

function evaluateGuess(word, generatedWord) {
    // CASO 1: La letra está en la posición correcta -> marcarla de color verde
    // CASO 2: La letra está en la palabra pero en otra posición -> marcarla de color amarillo
    // CASO 3: La letra no está en la palabra -> marcarla de color rojo
    // Retorna un array con los colores correspondientes a cada letra de la palabra
    let result = [];
    for (let i = 0; i < WORD_LENGTH; i++) {
        if (word[i] === generatedWord[i]) {
            result.push("green");
        } else if (generatedWord.includes(word[i])) {
            result.push("yellow");
        } else {
            result.push("red");
        }
    }
    return result;
}

function colorGuessTiles(row, colors) {
    const tiles = [];

    for (let i = 0; i < WORD_LENGTH; i++) {
        const cell = document.getElementById(`cell-${row}-${i + 1}`);
        tiles.push(new Promise((resolve) => {
            cell.addEventListener("transitionend", function onTransitionEnd(event) {
                if (event.propertyName === "background-color") {
                    cell.removeEventListener("transitionend", onTransitionEnd);
                    resolve();
                }
            });
        }));
        cell.style.backgroundColor = colors[i];
    }

    return Promise.all(tiles);
}

function handleWin() {
    alert("¡Felicidades! Has adivinado la palabra.");
}

function handleLoss() {
    alert(`¡Lo siento! Has agotado tus intentos. La palabra era: ${generatedWord}`);
}
