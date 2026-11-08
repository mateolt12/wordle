export function normalizeWord(word) {
    return word.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
}

export async function generateRandomWord() {
    const response = await fetch("palabras.json");
    const data = await response.json();
    const randomIndex = Math.floor(Math.random() * data.length);
    console.log(data[randomIndex]);
    return normalizeWord(data[randomIndex]);
}

export async function getGeneratedWord() {
    return await generateRandomWord();
}
