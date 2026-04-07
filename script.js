// クイズデータ
let currentCourseData = null;
let characters = [];
let currentQuestionText = "";
let currentQuestionIndex = 0;
let score = 0;
let currentCourse = null;
let answerHistory = []; // 各問題の正解/不正解記録

// DOM要素
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const courseList = document.getElementById("course-list");
const btnCircle = document.getElementById("btn-circle");
const btnCross = document.getElementById("btn-cross");
const nextBtn = document.getElementById("next-btn");
const headerRestartBtn = document.getElementById("header-restart-btn");
const questionText = document.getElementById("question-text");
const imagesContainer = document.getElementById("images-container");
const resultMessage = document.getElementById("result-message");
const resultText = document.getElementById("result-text");
const countdownImgTens = document.getElementById("countdown-img-tens");
const countdownImgOnes = document.getElementById("countdown-img-ones");
const leftBar = document.getElementById("left-bar");
const rightBar = document.getElementById("right-bar");
const finalScoreSpan = document.getElementById("final-score");
const finalTotalSpan = document.getElementById("final-total");
const scorePercentageSpan = document.getElementById("score-percentage");
const resultCardsContainer = document.getElementById("result-cards-container");
const explanationOverlay = document.getElementById("explanation-overlay");
const closeOverlay = document.getElementById("close-overlay");
const pageTitle = document.getElementById("page-title");
const resultQuestionText = document.getElementById("result-question-text");
const perfectOverlay = document.getElementById("perfect-overlay");
const disclaimerBtn = document.getElementById("disclaimer-btn");
const disclaimerOverlay = document.getElementById("disclaimer-overlay");
const closeDisclaimer = document.getElementById("close-disclaimer");
const shareBtn = document.getElementById("share-btn");

// 配列をシャッフルする関数（Fisher-Yates アルゴリズム）
function shuffleArray(array) {
  const shuffled = [...array]; // 元の配列を変更しないようコピー
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// 画面切り替え
function showScreen(screen) {
  [startScreen, quizScreen, resultScreen].forEach((s) =>
    s.classList.remove("active"),
  );
  screen.classList.add("active");
}

// コース選択画面を表示
function displayCourseList() {
  courseList.innerHTML = "";

  quizCourses.forEach((course) => {
    const courseCard = document.createElement("div");
    courseCard.className = "course-card";
    courseCard.innerHTML = `
      <h3>${course.title}</h3>
      <p>${course.description}</p>
    `;
    courseCard.addEventListener("click", () => selectCourse(course));
    courseList.appendChild(courseCard);
  });
}

// コース選択
function selectCourse(course) {
  currentCourse = course;

  // データ変数のマッピング（動的生成）
  const fileName = course.dataFile.replace(".js", "");
  const dataVariable = window[fileName];

  if (dataVariable) {
    currentCourseData = dataVariable;
    currentQuestionText = currentCourseData.question;
    characters = currentCourseData.characters;
    startQuiz();
  } else {
    alert(`コースデータ (${course.dataFile}) が見つかりません。`);
  }
}

// クイズ開始
function startQuiz() {
  if (!characters || characters.length === 0) {
    alert("問題データが読み込まれていません。");
    return;
  }

  // ページタイトルを戻す
  pageTitle.innerHTML = '<img src="images/system/title.png" alt="〇×クイズ">';

  // 問題をシャッフル
  characters = shuffleArray(characters);

  // 記録を初期化
  answerHistory = [];

  currentQuestionIndex = 0;
  score = 0;

  // バーを初期化（満タン50%）
  leftBar.style.width = "50%";
  rightBar.style.width = "50%";

  showScreen(quizScreen);

  // クイズ画面ではヘッダーを非表示
  document.querySelector("header").style.display = "none";

  showQuestion();
}

// 問題表示
function showQuestion() {
  const character = characters[currentQuestionIndex];

  // 問題文を表示（コース共通）
  questionText.textContent = currentQuestionText;

  // カウントダウン数字を更新（2桁表示）
  const remainingQuestions = characters.length - currentQuestionIndex;
  const tens = Math.floor(remainingQuestions / 10);
  const ones = remainingQuestions % 10;
  countdownImgTens.src = `images/system/${tens}.png`;
  countdownImgTens.alt = tens.toString();
  countdownImgOnes.src = `images/system/${ones}.png`;
  countdownImgOnes.alt = ones.toString();

  // 画像を表示
  imagesContainer.innerHTML = "";
  if (character.images && character.images.length > 0) {
    // 画像の枚数に応じてクラスを設定
    if (character.images.length === 1) {
      imagesContainer.className = "images-container single-image";
    } else if (character.images.length === 2) {
      imagesContainer.className = "images-container double-images";
    }

    character.images.forEach((imagePath) => {
      const img = document.createElement("img");
      img.src = "images/" + imagePath;
      img.alt = "問題画像";
      img.className = "question-image";
      img.onerror = function () {
        console.error("画像の読み込みに失敗:", imagePath);
        this.alt = "画像が見つかりません";
        this.style.display = "none";
      };
      imagesContainer.appendChild(img);
    });
  }

  // UI更新
  resultMessage.classList.remove("show", "correct", "incorrect");
  resultText.innerHTML = "";
  btnCircle.disabled = false;
  btnCross.disabled = false;
}

// 解答チェック
function checkAnswer(userAnswer) {
  const character = characters[currentQuestionIndex];
  const isCorrect = userAnswer === character.answer;

  // 解答を記録
  answerHistory.push({
    characterData: character,
    userAnswer: userAnswer,
    correctAnswer: character.answer,
    isCorrect: isCorrect,
    questionIndex: currentQuestionIndex,
  });

  // バーを更新
  const totalQuestions = characters.length;
  const correctCount = score + (isCorrect ? 1 : 0);
  const incorrectCount = answerHistory.length - correctCount;
  const rightBarWidth = ((totalQuestions - correctCount) / totalQuestions) * 50;
  const leftBarWidth =
    ((totalQuestions - incorrectCount) / totalQuestions) * 50;
  rightBar.style.width = rightBarWidth + "%";
  leftBar.style.width = leftBarWidth + "%";

  // ボタンを無効化
  btnCircle.disabled = true;
  btnCross.disabled = true;

  // 結果表示
  const answerIcon = character.answer ? "maru.png" : "batu.png";

  if (isCorrect) {
    score++;
    resultText.innerHTML = `正解！ <img src="images/icon/${answerIcon}" class="answer-icon" alt="${character.answer ? "〇" : "×"}"> です`;
    resultMessage.classList.add("show", "correct");
  } else {
    resultText.innerHTML = `不正解！ <img src="images/icon/${answerIcon}" class="answer-icon" alt="${character.answer ? "〇" : "×"}"> です`;
    resultMessage.classList.add("show", "incorrect");
  }

  // 解説がある場合は表示
  if (character.explanation) {
    const explanationDiv = document.createElement("div");
    explanationDiv.className = "explanation-text";
    explanationDiv.textContent = character.explanation;
    resultText.appendChild(explanationDiv);
  }
}

// 次の問題へ
function nextQuestion() {
  currentQuestionIndex++;

  if (currentQuestionIndex < characters.length) {
    showQuestion();
  } else {
    // 全問正解チェック
    if (score === characters.length) {
      showPerfectAnimation();
    } else {
      showResult();
    }
  }
}

// 全問正解演出
function showPerfectAnimation() {
  // クイズ画面を非表示
  quizScreen.classList.remove("active");

  // 白い画面を表示（opacity: 0の状態）
  perfectOverlay.style.display = "flex";

  // フェードイン開始
  setTimeout(() => {
    perfectOverlay.classList.add("show");
  }, 10);

  // 2秒後にフェードアウト開始
  setTimeout(() => {
    perfectOverlay.classList.remove("show");
    perfectOverlay.classList.add("fadeOut");
    // フェードアウト完了後に結果画面へ
    setTimeout(() => {
      perfectOverlay.style.display = "none";
      perfectOverlay.classList.remove("fadeOut");
      showResult();
    }, 500);
  }, 2000);
}

// 結果画面表示
function showResult() {
  // ページタイトルを画像に変更
  pageTitle.innerHTML = '<img src="images/system/result.png" alt="結果">';

  // ヘッダーを表示
  document.querySelector("header").style.display = "";
  headerRestartBtn.style.display = "block";

  // 問題文を表示
  resultQuestionText.textContent = currentQuestionText;

  finalScoreSpan.textContent = score;
  finalTotalSpan.textContent = characters.length;

  const percentage = Math.round((score / characters.length) * 100);
  scorePercentageSpan.textContent = percentage;

  // Xシェアボタンのイベント設定
  shareBtn.onclick = () => shareToTwitter();

  // 結果カードを生成
  displayResultCards();

  showScreen(resultScreen);
}

// 結果カードを生成
function displayResultCards() {
  resultCardsContainer.innerHTML = "";

  answerHistory.forEach((record, index) => {
    const card = document.createElement("div");
    card.className = `result-card ${record.isCorrect ? "correct" : "incorrect"}`;

    // キャラクター画像
    const img = document.createElement("img");
    img.src = "images/" + record.characterData.images[0];
    img.alt = "キャラクター";
    img.className = "result-card-image";
    card.appendChild(img);

    // 正解の〇×アイコン
    const answerDiv = document.createElement("div");
    answerDiv.className = "result-card-answer";
    const answerIcon = document.createElement("img");
    answerIcon.src = `images/icon/${record.correctAnswer ? "maru.png" : "batu.png"}`;
    answerIcon.alt = record.correctAnswer ? "〇" : "×";
    answerDiv.appendChild(answerIcon);
    card.appendChild(answerDiv);

    // クリックイベント
    card.addEventListener("click", () => showExplanationOverlay(record));

    resultCardsContainer.appendChild(card);
  });
}

// 解説オーバーレイを表示
function showExplanationOverlay(record) {
  // キャラクター画像
  const overlayCharImage = document.getElementById("overlay-character-image");
  overlayCharImage.innerHTML = "";
  const img = document.createElement("img");
  img.src = "images/" + record.characterData.images[0];
  img.alt = "キャラクター";
  overlayCharImage.appendChild(img);

  // 問題文
  const overlayQuestion = document.getElementById("overlay-question");
  overlayQuestion.textContent = currentQuestionText;

  // 回答結果
  const overlayAnswer = document.getElementById("overlay-answer");
  overlayAnswer.className = `overlay-answer ${record.isCorrect ? "correct" : "incorrect"}`;
  const answerIcon = document.createElement("img");
  answerIcon.src = `images/icon/${record.correctAnswer ? "maru.png" : "batu.png"}`;
  answerIcon.alt = record.correctAnswer ? "〇" : "×";

  if (record.isCorrect) {
    overlayAnswer.innerHTML = "";
    overlayAnswer.appendChild(answerIcon);
    overlayAnswer.appendChild(document.createTextNode(" 正解！"));
  } else {
    overlayAnswer.innerHTML = "";
    overlayAnswer.appendChild(document.createTextNode("不正解　正解は "));
    overlayAnswer.appendChild(answerIcon);
    overlayAnswer.appendChild(document.createTextNode(" です"));
  }

  // 解説
  const overlayExplanation = document.getElementById("overlay-explanation");
  overlayExplanation.textContent =
    record.characterData.explanation || "解説はありません。";

  // オーバーレイを表示
  explanationOverlay.classList.add("show");
}

// オーバーレイを閉じる
function closeExplanationOverlay() {
  explanationOverlay.classList.remove("show");
}

// イベントリスナー
btnCircle.addEventListener("click", () => checkAnswer(true));
btnCross.addEventListener("click", () => checkAnswer(false));
nextBtn.addEventListener("click", nextQuestion);
headerRestartBtn.addEventListener("click", () => {
  pageTitle.innerHTML = '<img src="images/system/title.png" alt="〇×クイズ">';
  headerRestartBtn.style.display = "none";
  document.querySelector("header").style.display = "";
  showScreen(startScreen);
});

// オーバーレイ関連のイベントリスナー
closeOverlay.addEventListener("click", closeExplanationOverlay);
explanationOverlay.addEventListener("click", (e) => {
  // オーバーレイ背景をクリックした時に閉じる
  if (e.target === explanationOverlay) {
    closeExplanationOverlay();
  }
});

// 免責事項関連のイベントリスナー
disclaimerBtn.addEventListener("click", () => {
  disclaimerOverlay.classList.add("show");
});

closeDisclaimer.addEventListener("click", () => {
  disclaimerOverlay.classList.remove("show");
});

disclaimerOverlay.addEventListener("click", (e) => {
  if (e.target === disclaimerOverlay) {
    disclaimerOverlay.classList.remove("show");
  }
});

// Xでシェアする関数
function shareToTwitter() {
  const url = "https://nagaihigh.github.io/marubatu/";
  const percentage = Math.round((score / characters.length) * 100);
  const text = `ストリートファイター6 〇×クイズ\n【${currentQuestionText}】\n結果：${score}/${characters.length} (${percentage}%)\n\n#SF6 #SF6クイズ`;

  const twitterUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;

  window.open(twitterUrl, "_blank", "width=550,height=420");
}

// ページ読み込み時にコース一覧を表示
window.addEventListener("load", () => {
  displayCourseList();
});
