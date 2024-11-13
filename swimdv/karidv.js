// 初期設定関数
function setup() {
    canvasSize(1200, 600); // キャンバスサイズを設定
    loadImg(0, "poolsc.png"); // 背景画像のロード
    loadImg(1, "motoda1.png"); // キャラクター1の画像ロード
    loadImg(2, "shun1.png"); // キャラクター2の画像ロード
}

// キャラクターオブジェクトの配列
let characters = [
    { x: 50, y: 330, speed: 0, acceleration: Math.random() * 0.1 + 0.05, imgIndex: 1, reachedEnd: false, startTime: null, endTime: null },
    { x: 50, y: 420, speed: 0, acceleration: Math.random() * 0.1 + 0.05, imgIndex: 2, reachedEnd: false, startTime: null, endTime: null }
];

let gameStarted = false;
let countdown = 3;
let countdownInterval;
let lastFrameTime = performance.now();
let totalScrollDistance = 0;
let stopScroll = false;

// メインループ
function mainloop() {
    let currentTime = performance.now();
    let deltaTime = (currentTime - lastFrameTime) / 1000;
    lastFrameTime = currentTime;

    if (deltaTime > 1) deltaTime = 1;

    if (gameStarted) {
        drowBG(0.2); // 背景を描画

        // キャラクターの移動処理
        for (let character of characters) {
            moveCharacter(character, deltaTime);
            drawImgC(character.imgIndex, character.x, character.y); // キャラクターを描画
        }

        displayCountdown(); // カウントダウンを表示
    }

    requestAnimationFrame(mainloop);
}

// 背景のスクロール
let bgX = 0;
function drowBG(spd) {
    if (!stopScroll) {
        bgX = (bgX + spd * 0.1) % 1200;
        drawImg(0, -bgX, 0);
        drawImg(0, 1200 - bgX, 0);
        if (spd > 0) {
            totalScrollDistance += spd * 0.1;
        }
    } else {
        drawImg(0, -bgX, 0);
        drawImg(0, 1200 - bgX, 0);
    }
}

// キャラクターの移動
function moveCharacter(character, deltaTime) {
    if (character.x < 1150) {
        character.speed += character.acceleration * deltaTime * 60; // 加速度を用いて速度を更新
        character.x += character.speed * deltaTime * 60; // 速度を基に位置を更新
    } else if (!character.reachedEnd) {
        character.reachedEnd = true;
        character.endTime = performance.now();
        checkGameEnd();
    }
}

// ゲーム終了判定
function checkGameEnd() {
    if (characters.every(char => char.reachedEnd)) {
        let times = characters.map(char => ((char.endTime - char.startTime) / 1000).toFixed(2));
        document.getElementById("times").innerText = `Times: ${times.join(' seconds, ')} seconds`;
        document.getElementById("startButton").disabled = false;
    }
}

// カウントダウンを表示する
function displayCountdown() {
    document.getElementById("countdown").innerText = countdown;
}

// カウントダウンを開始する
function startCountdown() {
    countdown = 3;
    displayCountdown();

    countdownInterval = setInterval(function () {
        countdown--;
        displayCountdown();

        if (countdown <= 0) {
            clearInterval(countdownInterval);
            window.addEventListener("keydown", handleKeyPress);
        }
    }, 1000);
}

// ゲーム開始処理
function startGame() {
    characters.forEach(char => {
        char.x = 50;
        char.speed = 0;
        char.reachedEnd = false;
        char.startTime = performance.now();
    });

    gameStarted = true;
    document.getElementById("startButton").disabled = true;
    document.getElementById("resetButton").disabled = false;

    startCountdown();
}

// リセット処理
function resetGame() {
    characters.forEach(char => {
        char.x = 50;
        char.speed = 0;
        char.reachedEnd = false;
    });
    gameStarted = false;
    document.getElementById("times").innerText = "";
    document.getElementById("countdown").innerText = "";
    document.getElementById("startButton").disabled = false;
    document.getElementById("resetButton").disabled = true;
}

// メインループの開始
setup();
mainloop();
