let questions = [];
let index = 0;
let showingAnswer = false;
let ttsSpeed = 1.1;
let ttsPitch = 0.8;

const content = document.getElementById("content");
const counter = document.getElementById("counter");
const questionId = document.getElementById("question-id");
const btnLeft = document.getElementById("btn-left");
const btnQuestion = document.getElementById("btn-question");
const btnAnswer = document.getElementById("btn-answer");
const btnRight = document.getElementById("btn-right");
const btnSettings = document.getElementById("btn-settings");
const settingsModal = document.getElementById("settings-modal");
const closeSettings = document.getElementById("close-settings");
const speedSlider = document.getElementById("speed-slider");
const pitchSlider = document.getElementById("pitch-slider");
const speedValue = document.getElementById("speed-value");
const pitchValue = document.getElementById("pitch-value");

function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

async function load() {
    const res = await fetch("questions.json");
    questions = shuffleArray(await res.json());
    renderQuestion();
}

function renderQuestion() {
    showingAnswer = false;
    const q = questions[index];
    questionId.textContent = `#${q.id}`;
    counter.textContent = `${index + 1} / ${questions.length}`;
    content.innerHTML = q.question;
    speak(stripHtml(q.question));
}

function showAnswer() {
    showingAnswer = true;
    const q = questions[index];
    content.innerHTML = q.answer;
    speak(stripHtml(q.answer));
}

function stripHtml(html) {
    const temp = document.createElement("div");
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || "";
}

btnLeft.addEventListener("click", prev);
btnQuestion.addEventListener("click", renderQuestion);
btnAnswer.addEventListener("click", showAnswer);
btnRight.addEventListener("click", next);

function next() {
    index = (index + 1) % questions.length;
    renderQuestion();
}

function prev() {
    index = (index - 1 + questions.length) % questions.length;
    renderQuestion();
}

// Settings Modal
btnSettings.addEventListener("click", () => {
    settingsModal.classList.remove("hidden");
});

closeSettings.addEventListener("click", () => {
    settingsModal.classList.add("hidden");
});

settingsModal.addEventListener("click", (e) => {
    if (e.target === settingsModal) {
        settingsModal.classList.add("hidden");
    }
});

// TTS Sliders
speedSlider.addEventListener("input", () => {
    ttsSpeed = parseFloat(speedSlider.value);
    speedValue.textContent = ttsSpeed.toFixed(1);
});

pitchSlider.addEventListener("input", () => {
    ttsPitch = parseFloat(pitchSlider.value);
    pitchValue.textContent = ttsPitch.toFixed(1);
});

/* Speech */
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
    utterance.rate = ttsSpeed;
    utterance.pitch = ttsPitch;
    utterance.volume = 1;
    speechSynthesis.speak(utterance);
}

speechSynthesis.onvoiceschanged = () => {};

setTimeout(() => speechSynthesis.getVoices(), 200);

load();
