// 初期設定関数
function setup() {
    canvasSize(1200, 600); // キャンバスサイズを設定
    loadImg(0, "poolsc.png"); // 背景画像のロード
    for (let i = 1; i <= 6; i++) {
        loadImg(i, `motoda${i}.png`); // 修正
        loadImg(i + 6, `shun${i}.png`); // 修正
        loadImg(i + 12, `motoda${i}.png`); // 修正
        loadImg(i + 18, `shun${i}.png`); // 修正
        loadImg(i + 24, `yoshitaka${i}.png`); // 修正
    }
}

// キャラクターオブジェクトの配列
let characters = [
    { x: 50, y: 145, speed: 0, acceleration: ((Math.random() * 2 - 1)), imgIndex: 1, frameIndex: 0, frameDelay: 100, frameTime: 0, reachedEnd: false, startTime: null, endTime: null },
    { x: 50, y: 195, speed: 0, acceleration: ((Math.random() * 2 - 1)), imgIndex: 7, frameIndex: 0, frameDelay: 100, frameTime: 0, reachedEnd: false, startTime: null, endTime: null },
    { x: 50, y: 250, speed: 0, acceleration: ((Math.random() * 2 - 1)), imgIndex: 13, frameIndex: 0, frameDelay: 100, frameTime: 0, reachedEnd: false, startTime: null, endTime: null },
    { x: 50, y: 325, speed: 0, acceleration: ((Math.random() * 2 - 1)), imgIndex: 19, frameIndex: 0, frameDelay: 100, frameTime: 0, reachedEnd: false, startTime: null, endTime: null },
    { x: 50, y: 420, speed: 0, acceleration: ((Math.random() * 2 - 1)), imgIndex: 25, frameIndex: 0, frameDelay: 100, frameTime: 0, reachedEnd: false, startTime: null, endTime: null },
];

let gameStarted = false;
let lastFrameTime = performance.now();
let totalScrollDistance = 0;
let stopScroll = false;

// 1秒ごとにキャラクターの加速度を更新
setInterval(() => {
    characters.forEach(char => {
        char.acceleration = Math.random() * 0.6 - 0.1; // -0.1 〜 0.5 に調整
    });
}, 1000);

// メインループ
function mainloop() {
    let currentTime = performance.now();
    let deltaTime = (currentTime - lastFrameTime) / 1000;
    lastFrameTime = currentTime;

    if (deltaTime > 1) deltaTime = 1;

    if (gameStarted) {
        drowBG(0.2); // 背景を描画

        // キャラクターの移動処理とアニメーション更新
        for (let character of characters) {
            moveCharacter(character, deltaTime);
            if (!character.reachedEnd) { // 到達していない場合のみフレームを更新
                updateCharacterFrame(character, currentTime); // フレーム更新
            }
            drawImgC(character.imgIndex + character.frameIndex, character.x, character.y); // フレーム画像を描画
        }
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

// キャラクターの移動処理を修正
function moveCharacter(character, deltaTime) {
    if (character.x < 1150) {
        character.speed += character.acceleration * deltaTime * 20; // 加速度で速度を更新
        character.speed *= 0.90; // 減衰を弱める
        character.speed = Math.min(Math.max(character.speed, 0.5), 6); // 速度を少し高めに調整

        character.x += character.speed * deltaTime * 20; // 移動量を増加
    } else if (!character.reachedEnd) {
        character.reachedEnd = true;
        character.endTime = performance.now();
        showLabel(character); // 到達したらラベルを表示
        if (!stopScroll) {
            stopScroll = true; // スクロールを止める
        }
        checkGameEnd(); // ゲーム終了判定
    }
}
// キャラクターのフレームを更新
function updateCharacterFrame(character, currentTime) {
    if (currentTime - character.frameTime > character.frameDelay) {
        character.frameTime = currentTime;
        character.frameIndex = (character.frameIndex + 1) % 6; // フレーム番号をループ (0～5)
    }
}

// ゲーム終了判定
function checkGameEnd() {
    if (characters.every(char => char.reachedEnd)) {
        let ranks = characters
            .sort((a, b) => a.endTime - b.endTime)
            .map((char, index) => ({ name: `レーン ${char.imgIndex % 5}`, rank: index + 1, time: ((char.endTime - char.startTime) / 1000).toFixed(2) }));

        let results = ranks.map(
            r => ` 順位: ${r.rank}位-${r.name} `
        );

        let timesElement = document.getElementById("times");
        timesElement.innerText = results.join('\n');

        // 背景色とスタイルを設定
        timesElement.style.backgroundColor = "#161212"; // 黒色
        timesElement.style.padding = "30px"; // パディング追加
        timesElement.style.border = "none"; // 初期状態で境界線を非表示
        timesElement.style.borderRadius = "10px"; // 角を丸める

        document.getElementById("startButton").disabled = false;
    }
}


// ゲーム開始処理
function startGame() {
    characters.forEach(char => {
        char.x = 50;
        char.speed = 0;
        char.reachedEnd = false;
        char.startTime = performance.now();
        char.endTime = null;
    });

    stopScroll = false; // スクロールを再開可能にする
    gameStarted = true;
    document.getElementById("startButton").disabled = true;
    document.getElementById("resetButton").disabled = false;
}

// リセット処理にラベルのクリアを追加
function resetGame() {
    characters.forEach(char => {
        char.x = 50;
        char.speed = 0;
        char.reachedEnd = false;
    });
    bgX = 0; // 背景の位置をリセット
    gameStarted = false;
    stopScroll = false; // スクロールを再開可能にする
    document.getElementById("times").innerText = "";
    document.getElementById("startButton").disabled = false;
    document.getElementById("resetButton").disabled = true;
    labelsContainer.innerHTML = ""; // ラベルをクリア
    drowBG(0); // 背景を初期状態で描画
}
// ラベルコンテナ要素を取得
const labelsContainer = document.getElementById("labels-container");

// キャラクターが右端に到達したときにラベルを表示
function showLabel(character) {
    const label = document.createElement("div");
    label.className = "lane-label";
    label.innerText = `Lane ${character.imgIndex % 5}: ${((character.endTime - character.startTime) / 1000).toFixed(2)}s`;

    // ラベルを配置
    label.style.left = `${character.x + 50}px`; // キャラクターのX座標 + 少し右
    label.style.top = `${character.y}px`; // キャラクターのY座標
    label.style.opacity = 1; // ラベルを表示

    labelsContainer.appendChild(label);
}


// メインループの開始
setup();
mainloop();

// ボタンをクリックしたときに画面遷移
function navigateBack() {
    window.location.href = "choice.html"; // 遷移先のHTMLファイル名を指定
}
