let faceX = 500;
let faceY = 200;
let r = 30;
let angle1 = 0; // 腕1の角度
let angle2 = Math.PI; // 腕2の角度（反対側から開始）
let leftLegAngle = -Math.PI / 6; // 左足の初期角度
let rightLegAngle = Math.PI / 6; // 右足の初期角度
let speed = 0.08; // デフォルトの速度
let leftLegDirection = speed; // 左足の動く方向（増減）
let rightLegDirection = -speed; // 右足の動く方向（増減）

function changeSpeed(newSpeed) {
    speed = newSpeed;
    leftLegDirection = speed;
    rightLegDirection = -speed;
}
function calculateAndDisplayResults() {
    // 入力値を取得して小数点第一位まで読み取る
    const height = parseFloat(document.getElementById("high").value) || 0;
    const weight = parseFloat(document.getElementById("weight").value) || 0;
    const strl = parseFloat(document.getElementById("strl").value) || 0;
    const strt = parseFloat(document.getElementById("strt").value) || 0;

    // 速度を計算（ストローク長 × ストロークテンポ）
    const speed = strl * strt;

    // ヒトの断面積 A を計算
    const A = 0.20247 * Math.pow(height, 0.725) * Math.pow(weight, 0.425);

    // 抵抗力 R を計算　Cd=0.7
    const R = 0.5 * 0.7 * 1000 * A * Math.pow(speed, 2);

    // パワー P を計算
    const P = R * speed;

    // 結果を右上の #result に表示
    document.getElementById("result").innerHTML =
        `速度: ${speed.toFixed(1)}m/s<br>抵抗力 R: ${R.toFixed(1)}N<br>パワー P: ${P.toFixed(1)}W`;
}
function init() {
    const canvas = document.getElementById("graph");
    if (!canvas || !canvas.getContext) {
        document.body.innerHTML = "エラーです";
        return;
    }
    const ctx = canvas.getContext("2d");

    function drawArm(angle, isLeft) {
        const shoulderX = faceX - 5 / 3 * r;
        const shoulderY = faceY;
        let elbowX, elbowY, handX, handY;

        // 腕の位置を計算
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

        // 肩から肘を描画
        ctx.beginPath();
        ctx.moveTo(shoulderX, shoulderY);
        ctx.lineTo(elbowX, elbowY);
        ctx.stroke();

        // 肘から手を描画
        ctx.beginPath();
        ctx.moveTo(elbowX, elbowY);
        ctx.lineTo(handX - (isLeft ? 0.2 : -0.2) * r, handY + 2 / 3 * r);
        ctx.stroke();
    }

    function drawLeg(x, y, angle, isLeft) {
        const footX = x - Math.cos(angle) * r;
        const footY = y - Math.sin(angle) * r + 5;
        const ankleX = footX - Math.cos(angle + Math.PI / 24) * 2.5 * r;
        const ankleY = footY - Math.sin(angle + Math.PI / 24) * 2.5 * r + 10;

        // 足の基点から足先への線を描画
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(footX, footY);
        ctx.stroke();

        // 足首の線を描画
        ctx.beginPath();
        ctx.moveTo(footX, footY);
        ctx.lineTo(ankleX, ankleY);
        ctx.stroke();
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 1本目の腕（通常）
        drawArm(angle1, true);

        // 顔の円を描画
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(faceX, faceY, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // 胴体の描画
        ctx.beginPath();
        ctx.moveTo(faceX - r, faceY);
        ctx.lineTo(faceX - 6 * r, faceY);
        ctx.stroke();

        // 2本目の腕（後ろ側）
        ctx.save();
        ctx.globalCompositeOperation = 'destination-over';
        drawArm(angle2, false);
        ctx.restore();

        // 左足を描画
        ctx.fillStyle = "blue";
        drawLeg(faceX - 6 * r, faceY, leftLegAngle, false);

        // 右足を描画
        ctx.fillStyle = "red";
        drawLeg(faceX - 6 * r, faceY, rightLegAngle, true);

        // 左足と右足の角度を更新してワイパーの動きを作成
        leftLegAngle += leftLegDirection;
        rightLegAngle += rightLegDirection;

        // 左足が-150度から150度の範囲を超えたら方向を反転
        if (leftLegAngle > Math.PI / 6 || leftLegAngle < -Math.PI / 6) {
            leftLegDirection *= -1;
        }

        // 右足が-150度から150度の範囲を超えたら方向を反転
        if (rightLegAngle > Math.PI / 6 || rightLegAngle < -Math.PI / 6) {
            rightLegDirection *= -1;
        }

        // 腕の角度を変化させて動かす
        angle1 += speed;
        angle2 += speed;

        requestAnimationFrame(animate);
    }

    animate();
}

window.onload = init;