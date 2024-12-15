// GEPT 初級單字測驗資料
const quizData = [
    {
        word: "Afraid",
        options: ["害怕的", "快樂的", "生氣的", "傷心的"],
        correct: 0
    },
    {
        word: "Begin",
        options: ["開始", "結束", "繼續", "停止"],
        correct: 0
    },
    {
        word: "Careful",
        options: ["小心的", "粗心的", "開心的", "傷心的"],
        correct: 0
    },
    {
        word: "Different",
        options: ["不同的", "相同的", "普通的", "特別的"],
        correct: 0
    },
    {
        word: "Early",
        options: ["早的", "晚的", "準時的", "遲到的"],
        correct: 0
    },
    {
        word: "Family",
        options: ["家庭", "朋友", "同學", "老師"],
        correct: 0
    },
    {
        word: "Garden",
        options: ["花園", "公園", "遊樂場", "停車場"],
        correct: 0
    },
    {
        word: "Happy",
        options: ["快樂的", "悲傷的", "生氣的", "害怕的"],
        correct: 0
    },
    {
        word: "Important",
        options: ["重要的", "普通的", "簡單的", "困難的"],
        correct: 0
    },
    {
        word: "Kitchen",
        options: ["廚房", "浴室", "臥室", "客廳"],
        correct: 0
    },
    {
        word: "Learn",
        options: ["學習", "教導", "閱讀", "寫作"],
        correct: 0
    },
    {
        word: "Morning",
        options: ["早上", "下午", "晚上", "中午"],
        correct: 0
    },
    {
        word: "Number",
        options: ["數字", "字母", "符號", "標點"],
        correct: 0
    },
    {
        word: "Office",
        options: ["辦公室", "教室", "餐廳", "商店"],
        correct: 0
    },
    {
        word: "People",
        options: ["人們", "動物", "植物", "物品"],
        correct: 0
    }
];

let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft;
let answered = false;

const wordEl = document.getElementById('word');
const speakerEl = document.getElementById('speaker');
const optionsEl = document.getElementById('options');
const timerEl = document.getElementById('timer');
const scoreEl = document.getElementById('score');
const feedbackEl = document.getElementById('feedback');

// 語音合成
const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.8; // 稍微放慢速度
    speechSynthesis.speak(utterance);
};

function startTimer() {
    timeLeft = 15;
    timerEl.textContent = timeLeft;
    timer = setInterval(() => {
        timeLeft--;
        timerEl.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            if (!answered) {
                checkAnswer(null);
            }
        }
    }, 1000);
}

function loadQuestion() {
    // 隨機選擇題目
    if (currentQuestion === 0) {
        // 在開始時打亂題目順序
        for (let i = quizData.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [quizData[i], quizData[j]] = [quizData[j], quizData[i]];
        }
    }

    const question = quizData[currentQuestion];
    wordEl.innerText = question.word;
    
    optionsEl.innerHTML = '';
    question.options.forEach((option, index) => {
        const button = document.createElement('div');
        button.className = 'option';
        button.innerText = option;
        button.addEventListener('click', () => checkAnswer(index));
        optionsEl.appendChild(button);
    });

    feedbackEl.textContent = '';
    answered = false;
    startTimer();
    updateScore();
}

function checkAnswer(selectedIndex) {
    if (answered) return;
    
    clearInterval(timer);
    answered = true;

    const correct = quizData[currentQuestion].correct;
    const options = document.querySelectorAll('.option');

    if (selectedIndex === null) {
        feedbackEl.textContent = '時間到！正確答案是：' + quizData[currentQuestion].options[correct];
    } else {
        if (selectedIndex === correct) {
            score++;
            options[selectedIndex].classList.add('correct');
            feedbackEl.textContent = '答對了！';
        } else {
            options[selectedIndex].classList.add('incorrect');
            options[correct].classList.add('correct');
            feedbackEl.textContent = '答錯了！正確答案是：' + quizData[currentQuestion].options[correct];
        }
    }

    setTimeout(nextQuestion, 2000);
}

function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < quizData.length) {
        loadQuestion();
    } else {
        showFinalScore();
    }
}

function updateScore() {
    scoreEl.innerText = `得分：${score}/${quizData.length}`;
}

function showFinalScore() {
    const percentage = (score / quizData.length) * 100;
    wordEl.style.display = 'none';
    speakerEl.style.display = 'none';
    timerEl.style.display = 'none';
    optionsEl.innerHTML = `
        <h2>測驗完成！</h2>
        <p>最終得分：${score}/${quizData.length} (${percentage}%)</p>
        <button onclick="restartQuiz()">重新開始</button>
    `;
    feedbackEl.textContent = '';
}

function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    wordEl.style.display = 'block';
    speakerEl.style.display = 'block';
    timerEl.style.display = 'block';
    loadQuestion();
}

// 發音按鈕事件
speakerEl.addEventListener('click', () => {
    speak(quizData[currentQuestion].word);
});

// 開始測驗
loadQuestion();
