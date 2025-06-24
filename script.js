let currentQuestion = 0;
let questions = [];
let userAnswers = [];

const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const submitBtn = document.getElementById('submit');

async function fetchQuestions() {
  try {
    const response = await fetch('https://opentdb.com/api.php?amount=5&type=multiple');
    const data = await response.json();
    questions = data.results.map(q => ({
      question: q.question,
      options: [...q.incorrect_answers, q.correct_answer].sort(),
      answer: q.correct_answer
    }));
    renderQuestion();
  } catch (error) {
    document.getElementById('quiz-container').innerHTML = 'Error loading quiz. Please try again later.';
  }
}

function renderQuestion() {
  const container = document.getElementById('quiz-container');
  container.innerHTML = '';

  const q = questions[currentQuestion];
  const qElem = document.createElement('div');
  qElem.className = 'question';
  qElem.innerHTML = `Q${currentQuestion + 1}: ${q.question}`;
  container.appendChild(qElem);

  const ul = document.createElement('ul');
  ul.className = 'options';

  q.options.forEach(option => {
    const li = document.createElement('li');
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'option';
    input.value = option;
    input.checked = userAnswers[currentQuestion] === option;
    li.appendChild(input);
    li.appendChild(document.createTextNode(option));
    ul.appendChild(li);
  });

  container.appendChild(ul);
  updateButtonsState();
}

function updateButtonsState() {
  prevBtn.disabled = currentQuestion === 0;
  nextBtn.disabled = currentQuestion === questions.length - 1;
  submitBtn.style.display = currentQuestion === questions.length - 1 ? 'inline-block' : 'none';
}

function getSelectedAnswer() {
  const selected = document.querySelector('input[name="option"]:checked');
  return selected ? selected.value : null;
}

function nextQuestion() {
  const answer = getSelectedAnswer();
  if (!answer) return alert('Please select an option');
  userAnswers[currentQuestion] = answer;

  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    renderQuestion();
  }
}

function prevQuestion() {
  const answer = getSelectedAnswer();
  if (answer) userAnswers[currentQuestion] = answer;

  if (currentQuestion > 0) {
    currentQuestion--;
    renderQuestion();
  }
}

function submitQuiz() {
  const answer = getSelectedAnswer();
  if (!answer) return alert('Please select an option before submitting.');
  userAnswers[currentQuestion] = answer;

  let correct = 0;
  questions.forEach((q, i) => {
    if (userAnswers[i] === q.answer) correct++;
  });

  const total = questions.length;
  const incorrect = total - correct;
  const percentage = ((correct / total) * 100).toFixed(2);

  document.getElementById('result').innerHTML = `
    <p>Total Questions: ${total}</p>
    <p>Correct Answers: ${correct}</p>
    <p>Incorrect Answers: ${incorrect}</p>
    <p>Score: ${percentage}%</p>
  `;

  document.getElementById('quiz-container').innerHTML = '';
  prevBtn.style.display = 'none';
  nextBtn.style.display = 'none';
  submitBtn.style.display = 'none';
}

prevBtn.addEventListener('click', prevQuestion);
nextBtn.addEventListener('click', nextQuestion);
submitBtn.addEventListener('click', submitQuiz);

fetchQuestions();
