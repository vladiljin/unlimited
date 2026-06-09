let questions = [];

let currentIndex = 0;
let showingAnswer = false;

const content =
    document.getElementById("content");

const card =
    document.getElementById("card");

const counter =
    document.getElementById("questionNumber");

async function loadQuestions()
{
    const response =
        await fetch("questions.json");

    questions =
        await response.json();

    showQuestion();
}

function showQuestion()
{
    showingAnswer = false;

    counter.textContent =
        `Question ${currentIndex + 1}`;

    content.textContent =
        questions[currentIndex].question;

    speak(
        questions[currentIndex].question
    );
}

function showAnswer()
{
    showingAnswer = true;

    content.textContent =
        questions[currentIndex].answer;

    speak(
        questions[currentIndex].answer
    );
}

card.addEventListener("click", () =>
{
    if(showingAnswer)
    {
        showQuestion();
    }
    else
    {
        showAnswer();
    }
});

function nextQuestion()
{
    currentIndex++;

    if(currentIndex >= questions.length)
    {
        currentIndex = 0;
    }

    showQuestion();
}

function previousQuestion()
{
    currentIndex--;

    if(currentIndex < 0)
    {
        currentIndex =
            questions.length - 1;
    }

    showQuestion();
}

/* Swipe support */

let touchStartX = 0;

document.addEventListener(
    "touchstart",
    e =>
    {
        touchStartX =
            e.changedTouches[0].screenX;
    }
);

document.addEventListener(
    "touchend",
    e =>
    {
        let touchEndX =
            e.changedTouches[0].screenX;

        let distance =
            touchEndX - touchStartX;

        if(distance < -50)
        {
            nextQuestion();
        }

        if(distance > 50)
        {
            previousQuestion();
        }
    }
);

/* Desktop arrows */

document.addEventListener(
    "keydown",
    e =>
    {
        if(e.key === "ArrowRight")
        {
            nextQuestion();
        }

        if(e.key === "ArrowLeft")
        {
            previousQuestion();
        }
    }
);

/* Voice */

function speak(text)
{
    speechSynthesis.cancel();

    const speech =
        new SpeechSynthesisUtterance(text);

    speech.rate = 1;

    speechSynthesis.speak(speech);
}

loadQuestions();