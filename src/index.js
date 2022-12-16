import './style.css';
import soundRight from './right.mp3';
import soundWrong from './wrong.mp3';
import birdsData from './birds-data';
import l18n from './l18n';
import CustomPlayer from './custom-player';

const questionSection = document.querySelector('.question');

const questionPlayer = new CustomPlayer();
questionSection.append(questionPlayer.createCustomPlayer());
const playBtn = questionSection.children[questionSection.children.length - 1].children[0];

const descPlayer = new CustomPlayer();

let totalScore = 0;
let questionScore = 5;

let questionNum = 0;
let answerId;

const homePage = document.querySelector('.home-page');
const ngButton = document.getElementById('new-game-btn');
const cgButton = document.getElementById('continue-game-btn');

const langSelector = document.querySelector('.home-page__lang-select');

const scorePanel = document.querySelector('.top-panel__score');
const questions = document.querySelector('.questions');
const questionImg = document.querySelector('.question__img');
const questionName = document.querySelector('.question__name');
const answers = document.querySelector('.answers');
const description = document.querySelector('.bird-desc');
const nextButton = document.querySelector('.main__button');

const finishPopUp = document.querySelector('.congrat');
const popUpHeader = document.querySelector('.congrat__header');
const popUpInfo = document.querySelector('.congrat__info');
const popUpButton = document.querySelector('.congrat__btn');

langSelector.value = localStorage.getItem('lang') ?? 'ru';
let lang = langSelector.value;

if (localStorage.getItem('question') === '0' || localStorage.getItem('question') === null) {
  cgButton.setAttribute('disabled', true);
}

const updatePopUp = () => {
  popUpHeader.textContent = l18n.popUpHeader[lang];
  popUpInfo.textContent = `${l18n.popUpInfo1[lang]} ${totalScore} ${l18n.popUpInfo2[lang]}`;
  popUpButton.textContent = l18n.ngButton[lang];
};

const showQuestionPlaceholder = () => {
  questionImg.setAttribute('src', 'https://nationalzoo.si.edu/sites/default/files/conservation/migratory-birds/ftb-placeholder-image.png');
  questionName.textContent = '*****';
};

const setLanguage = () => {
  ngButton.textContent = l18n.ngButton[lang];
  cgButton.textContent = l18n.cgButton[lang];
  nextButton.textContent = l18n.nextLevel[lang];
};

const saveGame = () => {
  localStorage.setItem('score', totalScore);
  localStorage.setItem('question', questionNum);
};

const resetGame = () => {
  localStorage.setItem('score', 0);
  localStorage.setItem('question', 0);
  questionNum = 0;
  totalScore = 0;
  showQuestionPlaceholder();
};

const restoreGame = () => {
  totalScore = Number(localStorage.getItem('score'));
  questionNum = Number(localStorage.getItem('question'));
};

const updateScore = () => {
  scorePanel.textContent = `${l18n.scoreLabel[lang]}: ${totalScore}`;
};

const generateAnswer = () => {
  answerId = Math.floor(Math.random() * 6);
};

const generateQuestions = () => {
  while (questions.children.length !== 0) questions.children[0].remove();

  l18n.questions[lang].forEach((question) => {
    const span = document.createElement('span');
    span.className = 'questions__question';
    span.textContent = question;
    questions.append(span);
  });
};

const highLightQuestion = () => questions
  .children[questionNum]
  .classList
  .toggle('questions__question_activ');

const playWrong = () => {
  const audio = new Audio(soundWrong);
  audio.play();
};

const playRight = () => {
  const audio = new Audio(soundRight);
  audio.play();
};

const markWrong = (event) => {
  const indicator = event.currentTarget.children[0];
  indicator.classList.add('answers__indicator_wrong');
};

const markRight = (event) => {
  const indicator = event.currentTarget.children[0];
  indicator.classList.add('answers__indicator_right');
};

const onWrongAnswer = (event) => {
  questionScore--;
  markWrong(event);
  playWrong();
  event.currentTarget.removeEventListener('click', onWrongAnswer);
};

const removeEvents = () => {
  const answersList = answers.children;

  for (let i = 0; i < answersList.length; i++) {
    answersList[i].removeEventListener('click', onWrongAnswer);
  }
};

const onRightAnswer = (event) => {
  questionImg.setAttribute('src', birdsData[lang][questionNum][answerId].image);
  questionName.textContent = birdsData[lang][questionNum][answerId].name;

  questionPlayer.pause();

  playBtn.classList.add('question__play-btn_on-pause');
  playBtn.classList.remove('question__play-btn_on-play');

  totalScore += questionScore;

  if (questionNum === birdsData[lang].length - 1) {
    updatePopUp();
    finishPopUp.classList.toggle('congrat_hidden');
  } else {
    nextButton.removeAttribute('disabled');
  }

  questionScore = 5;

  updateScore();

  markRight(event);
  playRight();
  removeEvents();
  event.currentTarget.removeEventListener('click', onRightAnswer);
};

const showBirdDesc = (index, player) => {
  while (description.children.length !== 0) description.children[0].remove();

  const birdData = birdsData[lang][questionNum][index];

  const img = document.createElement('img');
  img.setAttribute('src', birdData.image);
  img.setAttribute('alt', birdData.name);
  img.className = 'bird-desc__img';

  const name = document.createElement('h2');
  name.textContent = birdData.name;
  name.className = 'bird-desc__name bird-name';

  const latName = document.createElement('h3');
  latName.textContent = birdData.species;
  latName.className = 'bird-desc__lat-name bird-name';

  player.setAudioSource(birdData.audio);

  const desc = document.createElement('span');
  desc.textContent = birdData.description;
  desc.className = 'bird-desc__desc plain-text';

  description.append(img);
  description.append(name);
  description.append(latName);
  description.append(player.createCustomPlayer());
  description.append(desc);
};

const generateAnswers = () => {
  while (answers.children.length !== 0) answers.children[0].remove();

  birdsData[lang][questionNum].forEach((bird, index) => {
    const answer = document.createElement('div');
    const indicator = document.createElement('div');
    const name = document.createElement('span');

    answer.className = 'answers__answer-block';
    indicator.className = 'answers__indicator';

    name.textContent = bird.name;
    answer.append(indicator, name);

    if (index === answerId) {
      answer.addEventListener('click', onRightAnswer);
    } else {
      answer.addEventListener('click', onWrongAnswer);
    }

    answer.addEventListener('click', showBirdDesc.bind(this, index, descPlayer));

    answers.append(answer);
  });
};

const descPlaceHolder = document.createElement('span');

const showBirdDescPlaceholder = () => {
  while (description.children.length !== 0) description.children[0].remove();

  descPlaceHolder.textContent = l18n.placeHolder[lang];
  descPlaceHolder.classList = 'bird-desc__placeholder plain-text';

  description.append(descPlaceHolder);
};

nextButton.addEventListener('click', (event) => {
  playBtn.classList.add('question__play-btn_on-pause');
  playBtn.classList.remove('question__play-btn_on-play');

  descPlayer.audio.pause();

  highLightQuestion();
  questionNum++;
  highLightQuestion();
  generateAnswer();
  questionPlayer.setAudioSource(birdsData[lang][questionNum][answerId].audio);
  generateAnswers();
  showBirdDescPlaceholder();
  showQuestionPlaceholder();
  event.target.setAttribute('disabled', true);
  saveGame();
});

const startGame = () => {
  updateScore();
  generateAnswer();
  generateQuestions();
  highLightQuestion();
  questionPlayer.setAudioSource(birdsData[lang][questionNum][answerId].audio);
  generateAnswers();
  showBirdDescPlaceholder();
};

langSelector.addEventListener('change', (event) => {
  localStorage.setItem('lang', event.target.value);
  lang = event.target.value;
  setLanguage();
  showBirdDescPlaceholder();
});

ngButton.addEventListener('click', () => {
  resetGame();
  startGame();
  homePage.classList.add('home-page_hidden');
});

cgButton.addEventListener('click', () => {
  restoreGame();
  startGame();
  homePage.classList.add('home-page_hidden');
});

popUpButton.addEventListener('click', () => {
  resetGame();
  startGame();
  finishPopUp.classList.toggle('congrat_hidden');
});

setLanguage();
