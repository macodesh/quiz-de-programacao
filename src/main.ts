import "./style.css";
import questions from "./questions";

const question = document.querySelector("#question") as HTMLParagraphElement;
const answersBox = document.querySelector("#answers-box") as HTMLDivElement;
const quizContainer = document.querySelector(
  "#quiz-container"
) as HTMLDivElement;
const scoreContainer = document.querySelector(
  "#score-container"
) as HTMLDivElement;

const options = ["a", "b", "c", "d"];
let actualQuestion: number;
let points: number;

function init(): void {
  actualQuestion = 0;
  points = 0;
  createQuestion(0);
}

function createQuestion(index: number): void {
  const oldButtons = answersBox.querySelectorAll(
    "button"
  ) as NodeListOf<HTMLButtonElement>;

  oldButtons.forEach((button) => {
    button.remove();
  });

  const questionText = question.querySelector(
    "#question-text"
  ) as HTMLSpanElement;
  const questionNumber = question.querySelector(
    "#question-number"
  ) as HTMLSpanElement;

  questionText.textContent = questions[index].question;
  questionNumber.textContent = (index + 1).toString();

  questions[index].answers.forEach(createAnswers());
  actualQuestion++;
}

function createAnswers(): (
  value: { answer: string; correct: boolean },
  index: number,
  array: { answer: string; correct: boolean }[]
) => void {
  return (answer, i) => {
    const answerTemplate = document
      .querySelector(".answer-template")
      ?.cloneNode(true) as HTMLButtonElement;

    const letterOption = answerTemplate.querySelector(
      ".btn-option"
    ) as HTMLSpanElement;
    const answerText = answerTemplate.querySelector(
      ".question-answer"
    ) as HTMLSpanElement;

    letterOption.textContent = options[i];
    answerText.textContent = answer.answer;

    answerTemplate.setAttribute("correct", answer.correct.toString());
    answerTemplate.classList.remove("hide");
    answerTemplate.classList.remove("answer-template");

    answersBox.appendChild(answerTemplate);
    answerTemplate.addEventListener("click", checkAnswer());
  };
}

function checkAnswer(): (this: HTMLButtonElement, ev: MouseEvent) => void {
  return function () {
    const buttons = answersBox.querySelectorAll(
      "button"
    ) as NodeListOf<HTMLButtonElement>;
    const clickedButton = this;

    buttons.forEach(function (button) {
      if (button.getAttribute("correct") === "true") {
        button.classList.add("correct-answer");
        if (clickedButton === button) points++;
      } else {
        button.classList.add("wrong-answer");
      }
    });

    nextQuestion();
  };
}

function nextQuestion(): void {
  setTimeout(() => {
    if (actualQuestion >= questions.length) {
      showSuccessMessage();
      return;
    }

    createQuestion(actualQuestion);
  }, 850);
}

function showSuccessMessage(): void {
  toggleQuiz();

  const displayScore = document.querySelector(
    "#display-score"
  ) as HTMLSpanElement;
  const score = ((points / questions.length) * 100).toFixed(2);
  displayScore.textContent = score;

  const correctAnswers = document.querySelector(
    "#correct-answers"
  ) as HTMLSpanElement;
  correctAnswers.textContent = points.toString();

  const questionsQty = document.querySelector(
    "#questions-qty"
  ) as HTMLSpanElement;
  questionsQty.textContent = questions.length.toString();
}

function toggleQuiz(): void {
  quizContainer.classList.toggle("hide");
  scoreContainer.classList.toggle("hide");
}

const restartBtn = document.querySelector("#restart") as HTMLButtonElement;
restartBtn.addEventListener("click", () => {
  toggleQuiz();
  init();
});

init();
