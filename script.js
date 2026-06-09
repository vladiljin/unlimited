let questions = [];
let index = 0;
let showingAnswer = false;

const card = document.getElementById("card");
const content = document.getElementById("content");
const counter = document.getElementById("counter");

async function load() {
    const res = await fetch("questions.json");
    questions = await res.json();
    renderQuestion();
}

function renderQuestion() {
    showingAnswer = false;

    counter.textContent = `Question ${index + 1} / ${questions.length}`;
    content.textContent = questions[index].question;

    speak(questions[index].question);
}

function showAnswer() {
    showingAnswer = true;
    content.textContent = questions[index].answer;

    speak(questions[index].answer);
}

card.addEventListener("click", () => {
    if (showingAnswer) {
        renderQuestion();
    } else {
        showAnswer();
    }
});

function next() {
    index = (index + 1) % questions.length;
    renderQuestion();
}

function prev() {
    index = (index - 1 + questions.length) % questions.length;
    renderQuestion();
}

/* Swipe */
let startX = 0;

document.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
});

document.addEventListener("touchend", e => {
    let endX = e.changedTouches[0].clientX;

    if (endX < startX - 50) next();
    if (endX > startX + 50) prev();
});

/* Keyboard */
document.addEventListener("keydown", e => {
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
});

/* Speech (better voice attempt) */
function speak(text) {
    speechSynthesis.cancel();

    let utterance = new SpeechSynthesisUtterance(text);

    let voices = speechSynthesis.getVoices();

    let voice =
        voices.find(v =>
            v.lang.includes("en") &&
            v.name.toLowerCase().includes("male")
        ) ||
        voices.find(v =>
            v.lang.includes("en")
        );

    if (voice) utterance.voice = voice;

    utterance.rate = 0.95;
    utterance.pitch = 0.8;
    utterance.volume = 1;

    speechSynthesis.speak(utterance);
}

speechSynthesis.onvoiceschanged = () => {};

setTimeout(() => speechSynthesis.getVoices(), 200);

load();