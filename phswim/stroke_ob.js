// プレイヤーの変数
let faceX = 500;
let faceY = 100;
let r = 30;
let angle1 = 0;
let angle2 = Math.PI;
let leftLegAngle = -Math.PI / 6;
let rightLegAngle = Math.PI / 6;
let speed = 0.05;
let leftLegDirection = speed * 0.8;
let rightLegDirection = -speed * 0.8;

// 敵キャラクターの変数
let enemyFaceX = 500; // 敵キャラクターのX位置
let enemyFaceY = 400; // 敵キャラクターのY位置
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
        ctx.clearRect(0, 0, canvas.width, canvas.height);

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
        ctx.fillStyle = "green"; // 敵キャラクターの顔の色
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
        ctx.fillStyle = "purple"; // 敵キャラクターの左足の色
        drawLeg(ctx, enemyFaceX - 6 * r, enemyFaceY, enemyLeftLegAngle, false);
        ctx.fillStyle = "orange"; // 敵キャラクターの右足の色
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
