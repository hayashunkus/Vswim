let faceX = 500;
let faceY = 200;
let r = 30;
let angle1 = 0;
let angle2 = Math.PI;
let leftLegAngle = -Math.PI / 6;
let rightLegAngle = Math.PI / 6;
let speed = 0.08;
let leftLegDirection = speed;
let rightLegDirection = -speed;
let angleSum = 0;
let strokeTempo = 0;
let lastTimestamp = 0;

function changeSpeed(newSpeed) {
    speed = newSpeed;
    leftLegDirection = speed;
    rightLegDirection = -speed;
}

function calculateAndDisplayResults() {
    const height = parseFloat(document.getElementById("high").value) || 0;
    const weight = parseFloat(document.getElementById("weight").value) || 0;
    const strl = parseFloat(document.getElementById("strl").value) || 0;
    const strt = parseFloat(document.getElementById("strt").value) || 0;

    if (height < 120 || height > 220 || weight < 30 || weight > 120 ||
        strt < 0.5 || strt > 3.0 || strl < 0.5 || strl > 3.0) {
        document.getElementById("result").innerHTML = "計算できません";
        return;
    }

    const speed = strl * strt;
    const A = 0.20247 * Math.pow(height / 100, 0.725) * Math.pow(weight, 0.425);
    const R = 0.5 * 0.7 * 1000 * A * Math.pow(speed, 2);
    const P = R * speed;

    document.getElementById("result").innerHTML =
        `速度: ${speed.toFixed(2)} m/s<br> 抵抗力 R: ${R.toFixed(2)} N<br>パワー P: ${P.toFixed(2)} W<br>ストロークテンポ: ${strokeTempo.toFixed(2)} 回/秒`;
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

    function drawLeg(x, y, angle, isLeft) {
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

    function animate(timestamp) {
        if (!lastTimestamp) lastTimestamp = timestamp;
        const deltaTime = (timestamp - lastTimestamp) / 1000;
        lastTimestamp = timestamp;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawArm(angle1, true);

        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(faceX, faceY, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(faceX - r, faceY);
        ctx.lineTo(faceX - 6 * r, faceY);
        ctx.stroke();

        ctx.save();
        ctx.globalCompositeOperation = 'destination-over';
        drawArm(angle2, false);
        ctx.restore();

        ctx.fillStyle = "blue";
        drawLeg(faceX - 6 * r, faceY, leftLegAngle, false);

        ctx.fillStyle = "red";
        drawLeg(faceX - 6 * r, faceY, rightLegAngle, true);

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
        angleSum += Math.abs(speed);

        if (angleSum >= Math.PI * 2) {
            strokeTempo = 1 / deltaTime;
            angleSum = 0;
        }

        requestAnimationFrame(animate);
    }

    animate();
}

window.onload = init;
