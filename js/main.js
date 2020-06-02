'use strict';
// TODO
// 1. Code cleanup; 2. GameOver (overdue[40sec], not dimensions check); 3. Difficulty levels (based on wind); 4. Game state indicators & overall better UX

var gBalloons;
var gBalloonId = 100;
var gPopsCount;
var gameInterval;
var gWind;

function init() {
    var quantity = (gPopsCount) ? gPopsCount : +prompt('Let\'s Play! How many balloons do you want to send off?');
    gPopsCount = 0;
    gBalloons = createBalloons(quantity)
    renderBalloons(quantity);
    changeBalloonSize(quantity);
    gWind = getRandomInt(0, 15);
    gameInterval = setInterval(moveBalloons, 16.667); // 60 FPS
}

function moveBalloons() {
    var elBalloons = document.querySelectorAll('.balloon');
    for (var i = 0; i < elBalloons.length; i++) {
        var elBalloon = elBalloons[i];
        drawWind(i, 15, 0.07, 0.04);
        elBalloon.style.left = gBalloons[i].left + '%'; // Applying side wind
        gBalloons[i].bottom += gBalloons[i].speed; // Updating DOM &
        elBalloon.style.bottom = gBalloons[i].bottom + '%';
    }
}

function drawWind(i, bottomDistance, drift, accelerate) {
    // Side wind
    gBalloons[i].left += (gBalloons[i].bottom % bottomDistance < gWind) ? getRandomInt(0, drift) : getRandomInt(-drift, 0);
    // Vertical wind accelerate/deaccelerate
    if (gBalloons[i].bottom % (bottomDistance * 2) < 0.05) {
        gBalloons[i].speed += getRandomInt(-(accelerate * 0.8), accelerate);
    }
}

function popBalloon(elBalloon) {
    if (elBalloon.style.zIndex !== '-1') {
        var popSound = new Audio('pop.wav');
        popSound.volume = 0.2;
        popSound.play();
        gPopsCount++;
        elBalloon.style.transform = 'scale(1.1)';
        elBalloon.style.opacity = '0%';
        elBalloon.style.zIndex = -1;
        setTimeout(isVictory, 150);
    }
}

function isVictory() {
    if (gPopsCount === gBalloons.length) {
        alert(`Victory! You have completed level ${gPopsCount++}!`);
        clearInterval(gameInterval);
        if (confirm(`Next level? (${gPopsCount})`)) {
            init();
        }
    }
}

function changeBalloonSize(quantity) {
    var size = (quantity < 96) ? 1 - quantity * 0.00625 : 0.4;
    var elBalloons = document.querySelectorAll('.balloon');
    for (var i = 0; i < elBalloons.length; i++) {
        elBalloons[i].style.transform = `scale(${size})`;
    }
}

function createBalloons(count) {
    var balloons = [];
    for (var i = 0; i < count; i++) {
        var balloon = { id: gBalloonId++, bottom: getRandomInt(0, 5), left: getRandomInt(0, 93), speed: getRandomInt(0.06, 0.2) }
        balloons.push(balloon)
    }
    return balloons
}

function renderBalloons() {
    var strHTML = '';
    for (var i = 0; i < gBalloons.length; i++) {
        strHTML += `<div class="balloon balloon${Math.floor(Math.random() * 2 + 1)}" 
                         onclick="popBalloon(this)"
                         style="bottom: ${gBalloons[i].bottom}%; left: ${gBalloons[i].left}%;">
                            <span class="shine">&#9694;</span>
                            <div class="string"></div>
                    </div>`
    }
    var field = document.querySelector('body');
    field.innerHTML = strHTML;
}

function getRandomInt(min, max) {
    return Math.random() * (max - min) + min;
}






// `<div class="balloon-container" style="bottom: ${gBalloons[i].bottom}%;l eft: ${gBalloons[i].left}%;">
//         <div onclick="popBalloon(this)" class="balloon${Math.floor(Math.random() * 2 + 1)}"><span class="shine">&#9694;</span><div class="string"></div></div>
//     </div>`;