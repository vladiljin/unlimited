let questions = [];
let index = 0;
let showingAnswer = false;

const content = document.getElementById("content");
const counter = document.getElementById("counter");
const card = document.getElementById("card");

async function load() {
    const res = await fetch("questions.json");
    questions = await res.json();
    render();
}

function render() {
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
        render();
    } else {
        showAnswer();
    }
});

function next() {
    index = (index + 1) % questions.length;
    render();
}

function prev() {
    index = (index - 1 + questions.length) % questions.length;
    render();
}

/* swipe */
let startX = 0;

document.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
});

document.addEventListener("touchend", e => {
    let endX = e.changedTouches[0].clientX;

    if (endX < startX - 50) next();
    if (endX > startX + 50) prev();
});

/* keyboard */
document.addEventListener("keydown", e => {
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
});

/* speech */
function speak(text) {
    speechSynthesis.cancel();
    speechSynthesis.speak(new SpeechSynthesisUtterance(text));
}

load();