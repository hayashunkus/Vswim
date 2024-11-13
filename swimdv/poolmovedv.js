// 初期設定関数
function setup() {
    canvasSize(1200, 600); // キャンバスサイズを設定
    loadImg(0, "poolsc.png"); // 背景画像のロード
    loadImg(1, "motoda1.png"); // プレイヤー画像のロード
    loadImg(2, "shun1.png"); // オブジェクト画像のロード
}

// プレイヤーとオブジェクトの移動
var spX = 50, spY = 330;
var soX = 50, soY = 420;
var playerReachedEnd = false;
var objectReachedEnd = false;
var gameStarted = false;

// タイム関連の変数
var playerStartTime, objectStartTime; // スタート時刻
var playerEndTime, objectEndTime; // 到達時刻

// ゲーム開始フラグ
var gameStarted = false;

// 四角形のカウント
var rectangleCount = 0;


// カウントダウン関連
var countdown = 3;
var countdownInterval;


// 単振動関連の変数
var playerSpeed = 0.5; // プレイヤーの基本移動速度
var objectSpeed = 0.5; // オブジェクトの基本移動速度
var playerOscillationFreq = Math.random() * 2 + 1; // ランダムな周期 (1~3)
var objectOscillationFreq = Math.random() * 2 + 1; // ランダムな周期 (1~3)
var oscillationAmplitude = 50; // 振幅

// プレイヤーとオブジェクトがスクロールした距離を追跡
var totalScrollDistance = 0;
var stopScroll = false; // スクロール停止フラグ
var playerReachedEnd = false; // プレイヤーが右端に到達したか
var objectReachedEnd = false; // オブジェクトが右端に到達したか


let lastFrameTime = performance.now();
// メインループ
function mainloop() {

    let currentTime = performance.now();
    let deltaTime = (currentTime - lastFrameTime) / 1000; // 前のフレームからの経過時間（秒単位）
    lastFrameTime = currentTime;

    // deltaTimeが異常に大きくならないように制限（例えば、1秒以上の遅れは無視）
    if (deltaTime > 1) {
        deltaTime = 1;
    }

    if (gameStarted) {
        // 背景を描画
        drowBG(0);  // 背景は毎フレーム再描画

        // プレイヤーまたはオブジェクトのいずれかが端に到達していない場合にスクロール
        if (!playerReachedEnd && !objectReachedEnd) {
            drowBG(0.2); // 背景を少し速くスクロール
        }

        moveSPlayer(deltaTime);
        moveSObject(deltaTime);
        if (!playerReachedEnd) {
            drawRectangles(); // プレイヤーが右端に到達していない場合のみ四角形を描画
        }
        displayCountdown(); // カウントダウンを表示
    }

    requestAnimationFrame(mainloop); // メインループを継続
}

// 背景のスクロール
var bgX = 0;
function drowBG(spd) {
    if (!stopScroll) { // スクロールが停止していない場合のみスクロール
        bgX = (bgX + spd * 0.1) % 1200;
        drawImg(0, -bgX, 0);
        drawImg(0, 1200 - bgX, 0);
        if (spd > 0) {
            totalScrollDistance += spd * 0.1; // スクロールした距離を加算
        }
    } else {
        drawImg(0, -bgX, 0); // スクロールを停止しても背景は再描画
        drawImg(0, 1200 - bgX, 0);
    }
}

//プレイヤーの移動
function moveSPlayer(deltaTime) {
    if (spX < 1150) {
        spX += playerSpeed * deltaTime * 60; // フレームごとの時間差を補正して移動速度を安定化
        //spX += oscillationAmplitude * Math.sin(playerOscillationFreq * currentTime / 1000); // 単振動
    } else if (!playerReachedEnd) {
        playerReachedEnd = true; // プレイヤーが右端に到達したらフラグを立てる
        playerEndTime = performance.now(); // プレイヤーの到達時刻を記録
        displayTimes(); // タイムを表示

        // オブジェクトのスピードを1.5倍にする
        objectSpeed *= 1.5;
    }

    drawImgC(1, spX, spY); // プレイヤーを描画
}


// オブジェクトの移動
function moveSObject(deltaTime) {
    if (soX < 1150) {
        soX += objectSpeed * deltaTime * 60;
    } else if (!objectReachedEnd) {
        objectReachedEnd = true; // オブジェクトが右端に到達したらフラグを立てる
        objectEndTime = performance.now(); // オブジェクトの到達時刻を記録
        displayTimes(); // タイムを表示
    }

    drawImgC(2, soX, soY); // オブジェクトを描画
}


// 四角形を描画する（プレイヤーの上に）
function drawRectangles() {
    for (let i = 0; i < rectangleCount; i++) {
        fRect(spX - 20 + i * 30, spY - 70, 20, 50, colorRGB(20, 200, 20));  // プレイヤーの上に四角形を描画
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
            clearInterval(countdownInterval); // カウントダウン終了
            window.addEventListener("keydown", handleKeyPress); // スペースキーの入力を再度受け付ける
        }
    }, 1000);
}

// ゲーム開始処理
function startGame() {
    playerStartTime = performance.now(); // プレイヤーのスタート時刻を記録
    objectStartTime = performance.now(); // オブジェクトのスタート時刻を記録

    gameStarted = true;
    playerReachedEnd = false;
    objectReachedEnd = false;
    spX = 50; // プレイヤーの位置を初期化
    soX = 50; // オブジェクトの位置を初期化
    rectangleCount = 0; // 四角形の数をリセット

    document.getElementById("startButton").disabled = true; // ボタンを無効化
    document.getElementById("resetButton").disabled = false; // リセットボタンを有効化

    startCountdown(); // カウントダウンを開始
}


// タイムを表示する
function displayTimes() {
    if (playerReachedEnd && objectReachedEnd) {
        var playerTime = (playerEndTime - playerStartTime) / 1000;
        var objectTime = (objectEndTime - objectStartTime) / 1000;

        document.getElementById("times").innerText = `Player Time: ${playerTime.toFixed(2)} seconds, Object Time: ${objectTime.toFixed(2)} seconds`;

        document.getElementById("startButton").disabled = false; // ゲームが終了したらボタンを再び有効化
    }
}

// リセット処理
function resetGame() {
    spX = 50;
    soX = 50;
    playerReachedEnd = false;
    objectReachedEnd = false;
    gameStarted = false;

    document.getElementById("times").innerText = "";
    rectangleCount = 0; // 四角形をリセット
    document.getElementById("countdown").innerText = ""; // カウントダウンをクリア

    document.getElementById("startButton").disabled = false;
    document.getElementById("resetButton").disabled = true;
}

// メインループの開始
setup();
mainloop();
