// 背景画像の設定
const backgroundImage = new Image();
backgroundImage.src = 'bg2.png'; // 画像のパスを設定

let backgroundX = 0;           // 背景画像の描画位置X座標
const backgroundSpeed = 1;      // 背景のスクロール速度

backgroundImage.onload = () => {
    init();
};

function changeSpeed(newSpeed) {
    speed = newSpeed;
    leftLegDirection = speed * 0.6; //補正
    rightLegDirection = -speed * 0.6; //補正
}

function calculateAndDisplayResults() {
    const height = parseFloat(document.getElementById("high").value) || 0;
    const weight = parseFloat(document.getElementById("weight").value) || 0;
    const strl = parseFloat(document.getElementById("strl").value) || 0;
    const strt = parseFloat(document.getElementById("strt").value) || 0;

    if (height < 120 || height > 220 || weight < 30 || weight > 120 ||
        strt < 0.3 || strt > 2.0 || strl < 0.3 || strl > 2.0) {
        document.getElementById("result").innerHTML = "計算できません";
        return;
    }

    // ストロークテンポから腕の回転速度を設定
    speed = 2 * Math.PI * strt / 60; // 秒単位で角速度を設定
    changeSpeed(speed * 0.4); // 更新した speed を脚の方向にも反映
    // 速度を計算（ストローク長 × ストロークテンポ）
    const swimSpeed = strl * strt;

    // ヒトの断面積 A を計算
    const A = 0.20247 * Math.pow(height / 100, 0.725) * Math.pow(weight, 0.425);
    // 抵抗力 R を計算　Cd=0.7
    const R = 0.5 * 0.7 * 1000 * A * Math.pow(swimSpeed, 2);

    // パワー P を計算
    const P = R * swimSpeed;
    // 結果表示
    document.getElementById("result").innerHTML =
        `速度: ${swimSpeed.toFixed(2)} m/s<br> 抵抗力 R: ${R.toFixed(2)} N<br>パワー P: ${P.toFixed(2)} W<br>ストロークテンポ: ${strt.toFixed(2)} 回/秒<br>角速度（speed）:${speed.toFixed(2)}`;
}

function moveForward(distance) {
    faceX += distance; // distance ピクセル分右に移動
}

function resetAnimation() {
    faceX = 400; // 初期位置
    faceY = 300;
    angle1 = 0;
    angle2 = Math.PI;
    leftLegAngle = -Math.PI / 8;
    rightLegAngle = Math.PI / 8;
    speed = 0.05;
    leftLegDirection = speed * 0.8;
    rightLegDirection = -speed * 0.8;
    angleSum = 0;

    // 結果表示のリセット
    document.getElementById("result").innerHTML =
        `速度: 0 m/s<br> 抵抗力 R: 0 N<br>パワー P: 0 W<br>ストロークテンポ: 0 回/s<br>角速度(speed): 0 rad/fps`;
    // 入力フォームをリセット
    document.getElementById("high").value = "";   // 身長をリセット
    document.getElementById("weight").value = ""; // 体重をリセット
    document.getElementById("strt").value = "";   // ストロークテンポをリセット
    document.getElementById("strl").value = "";   // ストローク長をリセット

}



// プレイヤーの変数
let faceX = 400;
let faceY = 300;
let r = 30;
let angle1 = 0;
let angle2 = Math.PI;
let leftLegAngle = -Math.PI / 6;
let rightLegAngle = Math.PI / 6;
let speed = 0.05;
let leftLegDirection = speed * 0.8;
let rightLegDirection = -speed * 0.8;

// 敵キャラクターの変数
let enemyFaceX = 400;
let enemyFaceY = 600;
let enemyAngle1 = 0;
let enemyAngle2 = Math.PI;
let enemyLeftLegAngle = -Math.PI / 6;
let enemyRightLegAngle = Math.PI / 6;
let enemySpeed = 0.03;
let enemyLeftLegDirection = enemySpeed * 0.8;
let enemyRightLegDirection = -enemySpeed * 0.8;

function init() {
    const canvas = document.getElementById("graph");
    if (!canvas || !canvas.getContext) {
        document.body.innerHTML = "エラーです";
        return;
    }
    const ctx = canvas.getContext("2d");

    function drawArm(ctx, x, y, angle, isLeft) {
        const shoulderX = x - 5 / 3 * r;
        const shoulderY = y;
        let elbowX, elbowY, handX, handY;
        if (Math.sin(angle) < 0) {
            elbowX = shoulderX + Math.cos(angle) * 2 * r;
            elbowY = shoulderY + Math.sin(angle) * 2 * r;
            handX = elbowX + Math.cos(angle) * 2 * r;
            handY = elbowY + Math.sin(angle) * 2 * r;
        } else {
            elbowX = shoulderX + Math.cos(angle) * 2.5 * r;
            elbowY = shoulderY + Math.sin(angle) * 2.5 * r;
            handX = elbowX + Math.cos(angle + Math.PI / 12) * 1.5 * r;
            handY = elbowY + Math.sin(angle + Math.PI / 12) * 1.5 * r;
        }
        ctx.beginPath();
        ctx.moveTo(shoulderX, shoulderY);
        ctx.lineTo(elbowX, elbowY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(elbowX, elbowY);
        ctx.lineTo(handX - (isLeft ? 0.2 : -0.2) * r, handY + 2 / 3 * r);
        ctx.stroke();
    }

    function drawLeg(ctx, x, y, angle, isLeft) {
        const footX = x - Math.cos(angle) * r;
        const footY = y - Math.sin(angle) * r + 5;
        const ankleX = footX - Math.cos(angle + Math.PI / 24) * 2.5 * r;
        const ankleY = footY - Math.sin(angle + Math.PI / 24) * 2.5 * r + 10;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(footX, footY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(footX, footY);
        ctx.lineTo(ankleX, ankleY);
        ctx.stroke();
    }

    function animate() {
        // 背景をスクロールさせる
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        backgroundX -= backgroundSpeed;  // 背景の位置を左に移動

        // 背景画像の描画
        if (backgroundImage.complete) {
            ctx.drawImage(backgroundImage, backgroundX, 0, canvas.width, canvas.height);
            ctx.drawImage(backgroundImage, backgroundX + canvas.width, 0, canvas.width, canvas.height);
            if (backgroundX <= -canvas.width) {
                backgroundX = 0; // 画像が完全にスクロールされたらリセット
            }
        }

        // プレイヤーの描画
        ctx.fillStyle = "red";
        drawArm(ctx, faceX, faceY, angle1, true);
        ctx.beginPath();
        ctx.arc(faceX, faceY, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(faceX - r, faceY);
        ctx.lineTo(faceX - 6 * r, faceY);
        ctx.stroke();
        drawArm(ctx, faceX, faceY, angle2, false);
        ctx.fillStyle = "blue";
        drawLeg(ctx, faceX - 6 * r, faceY, leftLegAngle, false);
        ctx.fillStyle = "red";
        drawLeg(ctx, faceX - 6 * r, faceY, rightLegAngle, true);

        // 敵キャラクターの描画
        ctx.fillStyle = "green";
        drawArm(ctx, enemyFaceX, enemyFaceY, enemyAngle1, true);
        ctx.beginPath();
        ctx.arc(enemyFaceX, enemyFaceY, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(enemyFaceX - r, enemyFaceY);
        ctx.lineTo(enemyFaceX - 6 * r, enemyFaceY);
        ctx.stroke();
        drawArm(ctx, enemyFaceX, enemyFaceY, enemyAngle2, false);
        ctx.fillStyle = "purple";
        drawLeg(ctx, enemyFaceX - 6 * r, enemyFaceY, enemyLeftLegAngle, false);
        ctx.fillStyle = "orange";
        drawLeg(ctx, enemyFaceX - 6 * r, enemyFaceY, enemyRightLegAngle, true);

        // プレイヤーの腕と脚の角度を更新
        leftLegAngle += leftLegDirection;
        rightLegAngle += rightLegDirection;
        if (leftLegAngle > Math.PI / 6 || leftLegAngle < -Math.PI / 6) {
            leftLegDirection *= -1;
        }
        if (rightLegAngle > Math.PI / 6 || rightLegAngle < -Math.PI / 6) {
            rightLegDirection *= -1;
        }
        angle1 += speed;
        angle2 += speed;

        // 敵キャラクターの腕と脚の角度を更新
        enemyLeftLegAngle += enemyLeftLegDirection;
        enemyRightLegAngle += enemyRightLegDirection;
        if (enemyLeftLegAngle > Math.PI / 6 || enemyLeftLegAngle < -Math.PI / 6) {
            enemyLeftLegDirection *= -1;
        }
        if (enemyRightLegAngle > Math.PI / 6 || enemyRightLegAngle < -Math.PI / 6) {
            enemyRightLegDirection *= -1;
        }
        enemyAngle1 += enemySpeed;
        enemyAngle2 += enemySpeed;

        requestAnimationFrame(animate);
    }

    animate();
}

window.onload = init;
