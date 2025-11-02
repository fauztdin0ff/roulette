/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
__webpack_require__.r(__webpack_exports__);

document.addEventListener('DOMContentLoaded', () => {
   const toggle = document.querySelector('.app__sidebar-toggle');
   const sidebar = document.querySelector('.app__sidebar');
   const body = document.body;

   if (toggle && sidebar) {
      toggle.addEventListener('click', () => {
         sidebar.classList.toggle('opened');
         body.classList.toggle('aside-opened');
      });
   }
});


/*---------------------------------------------------------------------------
Stars
---------------------------------------------------------------------------*/
const starsContainer = document.querySelector('.game__stars');

function random(min, max) {
   return Math.random() * (max - min) + min;
}

function createStar() {
   const star = document.createElement('img');
   star.src = 'img/star.png';
   star.classList.add('star');

   // Случайные координаты
   const x = random(0, window.innerWidth - 50);
   const y = random(0, window.innerHeight - 50);
   const size = random(15, 100); // Случайный размер
   const rotate = random(0, 360);

   Object.assign(star.style, {
      left: `${x}px`,
      top: `${y}px`,
      width: `${size}px`,
      height: `${size}px`,
      transform: `scale(0.5) rotate(${rotate}deg)`
   });

   starsContainer.appendChild(star);

   // Появление
   setTimeout(() => {
      star.style.opacity = 1;
      star.style.transform = `scale(1) rotate(${rotate + random(30, 90)}deg)`;
   }, 100);

   // Исчезновение
   const lifetime = random(4000, 8000);
   setTimeout(() => {
      star.style.opacity = 0;
      setTimeout(() => star.remove(), 1000);
   }, lifetime);
}

// Бесконечный поток звёзд
function loopStars() {
   createStar();
   setTimeout(loopStars, random(300, 800));
}

loopStars();




/*---------------------------------------------------------------------------
Показ приза
---------------------------------------------------------------------------*/

//Анимация конфети
const confettiCanvas = document.createElement("canvas");
confettiCanvas.style.position = "fixed";
confettiCanvas.style.top = "0";
confettiCanvas.style.left = "0";
confettiCanvas.style.width = "100%";
confettiCanvas.style.height = "100%";
confettiCanvas.style.pointerEvents = "none";
confettiCanvas.style.zIndex = "99999";
document.body.appendChild(confettiCanvas);

const myConfetti = confetti.create(confettiCanvas, {
   resize: true,
   useWorker: true,
});

function playConfetti() {
   const end = Date.now() + 4 * 1000;
   const colors = ["#bb0000", "#ffffff"];

   (function frame() {
      myConfetti({
         particleCount: 3,
         angle: 60,
         spread: 55,
         origin: { x: 0 },
         colors,
      });
      myConfetti({
         particleCount: 3,
         angle: 120,
         spread: 55,
         origin: { x: 1 },
         colors,
      });

      if (Date.now() < end) requestAnimationFrame(frame);
   })();
}

//Открытие попапа
function openPopup() {
   const popup = document.querySelector('.win-popup');
   const closeBtn = popup.querySelector('.win-popup__close');

   popup.classList.add('show');

   closeBtn.addEventListener('click', () => {
      popup.classList.remove('show');
   }, { once: true });
}



/*===========================================================================
🎮 1. ВАЛИДАЦИЯ СКОРОСТИ ВРАЩЕНИЯ
===========================================================================*/
document.addEventListener("DOMContentLoaded", () => {
   const speed = document.querySelector(".game__speed");
   const mode1 = speed.querySelector(".game__speed-mode-1");
   const mode2 = speed.querySelector(".game__speed-mode-2");
   const toggle = speed.querySelector(".game__speed-toggle");
   const att = speed.querySelector(".game__speed-att");
   const playBtn = document.querySelector(".game__button");

   mode2.style.display = "none";
   let currentMode = 1;

   const disablePlay = () => {
      playBtn.classList.add("disabled");
      playBtn.setAttribute("disabled", "true");
   };

   const enablePlay = () => {
      playBtn.classList.remove("disabled");
      playBtn.removeAttribute("disabled");
   };

   toggle.addEventListener("click", () => {
      if (currentMode === 1) {
         mode1.style.display = "none";
         mode2.style.display = "flex";
         toggle.classList.add("active");
         currentMode = 2;
      } else {
         mode2.style.display = "none";
         mode1.style.display = "block";
         toggle.classList.remove("active");
         currentMode = 1;
      }

      att.textContent = "";
      validateAndToggleButton();
   });

   function validate() {
      att.textContent = "";

      if (currentMode === 1) {
         const input = mode1.querySelector("input");
         const value = Number(input.value);
         if (!Number.isFinite(value) || value < 5 || value > 50) {
            att.textContent = "Значение должно быть от 5 до 50 секунд";
            return false;
         }
         return true;
      } else {
         const [inputFrom, inputTo] = mode2.querySelectorAll("input");
         const from = Number(inputFrom.value);
         const to = Number(inputTo.value);

         if (
            !Number.isFinite(from) || !Number.isFinite(to) ||
            from < 5 || from > 100 || to < 5 || to > 100
         ) {
            att.textContent = "Значения должны быть от 5 до 50 секунд";
            return false;
         }
         if (to < from) {
            att.textContent = "Максимальное значение не может быть меньше минимального";
            return false;
         }
         return true;
      }
   }

   function validateAndToggleButton() {
      if (!validate()) disablePlay();
      else enablePlay();
   }

   speed.querySelectorAll("input").forEach(input => {
      input.addEventListener("input", validateAndToggleButton);
      input.addEventListener("blur", validateAndToggleButton);
   });

   validateAndToggleButton();
});


/*===========================================================================
🎨 2. ОТРИСОВКА КОЛЕСА
===========================================================================*/
const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

const prizes = [...document.querySelectorAll(".game__prize")].map(el => ({
   name: el.dataset.name,
   chance: parseFloat(el.dataset.chance),
   color: el.dataset.color,
   image: el.dataset.image,
   element: el
}));

let hoveredPrize = null;
let fade = 1;
let targetFade = 1;

function resizeCanvas() {
   const size = Math.min(window.innerWidth, window.innerHeight) * 0.8;
   canvas.width = size;
   canvas.height = size;
}

function drawWheel() {
   ctx.clearRect(0, 0, canvas.width, canvas.height);

   const centerX = canvas.width / 2;
   const centerY = canvas.height / 2;
   const radius = canvas.width / 2 - 10;

   const totalChance = prizes.reduce((s, p) => s + p.chance, 0);
   let startAngle = 0; // в радианах, 0 = 3 часа (вправо)

   prizes.forEach(prize => {
      const sliceAngle = (prize.chance / totalChance) * 2 * Math.PI;

      const gradient = ctx.createRadialGradient(centerX, centerY, radius / 4, centerX, centerY, radius);
      gradient.addColorStop(0, "#37224f");
      gradient.addColorStop(1, prize.color);

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();

      ctx.fillStyle = gradient;
      ctx.globalAlpha = hoveredPrize && hoveredPrize !== prize ? fade : 1;
      ctx.fill();

      ctx.lineWidth = 2;
      ctx.strokeStyle = "#fff";
      ctx.stroke();

      // текст
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#fff";
      ctx.font = `${canvas.width / 25}px sans-serif`;
      ctx.fillText(prize.name, radius - 20, 5);
      ctx.restore();

      ctx.globalAlpha = 1;
      startAngle += sliceAngle;
   });

   // обод и центр
   ctx.beginPath();
   ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
   ctx.lineWidth = 15;
   ctx.strokeStyle = "rgba(0,0,0,0.1)";
   ctx.stroke();

   ctx.beginPath();
   ctx.arc(centerX, centerY, radius * 0.1, 0, 2 * Math.PI);
   ctx.fillStyle = "#fff";
   ctx.fill();
}

function animate() {
   fade += (targetFade - fade) * 0.1;
   drawWheel();
   requestAnimationFrame(animate);
}

prizes.forEach(prize => {
   prize.element.addEventListener("mouseenter", () => {
      hoveredPrize = prize;
      targetFade = 0.4;
   });
   prize.element.addEventListener("mouseleave", () => {
      hoveredPrize = null;
      targetFade = 1;
   });
});

resizeCanvas();
animate();
window.addEventListener("resize", () => {
   resizeCanvas();
   drawWheel();
});

/*=========================================================================== 
Утилиты для вычислений (градусы) 
===========================================================================*/
function computePrizeMiddleAngleDeg(targetPrize) {
   const totalChance = prizes.reduce((s, p) => s + p.chance, 0);
   let acc = 0;
   for (const p of prizes) {
      const sliceDeg = (p.chance / totalChance) * 360;
      const startDeg = acc;
      const endDeg = acc + sliceDeg;
      if (p === targetPrize) return (startDeg + endDeg) / 2;
      acc = endDeg;
   }
   return 0;
}

function getPrizeAtTopByRotation(rotationDeg) {
   // rotationDeg — абсолютный угол поворота canvas (градусы, положительный — по часовой)
   const totalChance = prizes.reduce((s, p) => s + p.chance, 0);
   let acc = 0;
   for (const p of prizes) {
      const sliceDeg = (p.chance / totalChance) * 360;
      const startDeg = acc;
      const endDeg = acc + sliceDeg;
      const mid = (startDeg + endDeg) / 2; // средний угол сектора от 0°(вправо)
      // после поворота позиция mid окажется в (mid + rotationDeg) % 360
      let positioned = (mid + rotationDeg) % 360;
      if (positioned < 0) positioned += 360;
      // стрелка находится на 270° (12 часов)
      const diff = Math.min(Math.abs(positioned - 270), 360 - Math.abs(positioned - 270));
      if (diff <= sliceDeg / 2 + 0.0001) return p;
      acc += sliceDeg;
   }
   return null;
}


/*=========================================================================== 
🎯 3. ВРАЩЕНИЕ И ВЫБОР ПОБЕДИТЕЛЯ (исправлено: хранение абсолютного угла, проверка фактического сектора) 
===========================================================================*/
const playButton = document.querySelector(".game__button");
let isSpinning = false;
let totalRotation = 0;
let hasSpun = false; // 👉 Было ли уже основное вращение
let bgRotation = 0;  // Текущий угол для фонового вращения
let bgSpinId;        // ID интервала фонового вращения

playButton.addEventListener("click", startSpin);

// =============================
// 🌈 Фоновое вращение до первого запуска
// =============================
function startBackgroundSpin() {
   const speed = 0.05;
   function animate() {
      if (hasSpun) return;
      bgRotation = (bgRotation + speed) % 360;
      canvas.style.transform = `rotate(${bgRotation}deg)`;
      bgSpinId = requestAnimationFrame(animate);
   }
   animate();
}
startBackgroundSpin(); // запустить сразу после загрузки

function stopBackgroundSpin() {
   if (bgSpinId) cancelAnimationFrame(bgSpinId);
}

function getRandomPrize(prizes) {
   const totalChance = prizes.reduce((sum, p) => sum + p.chance, 0);
   const rand = Math.random() * totalChance;
   let cumulative = 0;
   for (const prize of prizes) {
      cumulative += prize.chance;
      if (rand <= cumulative) return prize;
   }
   return prizes[prizes.length - 1];
}

function norm360(v) {
   return ((v % 360) + 360) % 360;
}

function startSpin() {
   if (isSpinning) return;

   if (!hasSpun) {
      hasSpun = true;
      stopBackgroundSpin();
   }

   playButton.classList.add("disabled");

   const speedArea = document.querySelector(".game__speed");
   const mode1 = speedArea.querySelector(".game__speed-mode-1");
   const mode2 = speedArea.querySelector(".game__speed-mode-2");
   const toggle = speedArea.querySelector(".game__speed-toggle");
   const isRangeMode = toggle.classList.contains("active");

   // =============================
   // 1. Определяем длительность
   // =============================
   let duration;
   if (isRangeMode) {
      const [fromInput, toInput] = mode2.querySelectorAll("input");
      const min = Number(fromInput.value);
      const max = Number(toInput.value);
      duration = Math.random() * (max - min) + min;
   } else {
      const input = mode1.querySelector("input");
      duration = Number(input.value);
   }

   // =============================
   // 2. Определяем победителя
   // =============================
   const winner = getRandomPrize(prizes);
   const prizeMiddleAngle = computePrizeMiddleAngleDeg(winner);
   let baseRotation = 360 - (prizeMiddleAngle - 270);
   baseRotation = norm360(baseRotation);

   // =============================
   // 3. Управление скоростью вращения
   // =============================
   const degreesPerSecond = 360;
   const rotationBySpeed = degreesPerSecond * duration;
   const finalRotation = totalRotation + rotationBySpeed + baseRotation;

   let easing;
   if (duration >= 30) {
      easing = "cubic-bezier(0.45, 0.95, 0.6, 1)";
   } else if (duration >= 20) {
      easing = "cubic-bezier(0.3, 0.88, 0.4, 1)";
   } else {
      easing = "cubic-bezier(0.25, 1, 0.3, 1)";
   }

   // =============================
   // 6. Запуск вращения
   // =============================
   isSpinning = true;
   canvas.style.transition = `transform ${duration}s ${easing}`;
   canvas.style.transform = `rotate(${finalRotation}deg)`;

   // =============================
   // 7. После остановки
   // =============================
   setTimeout(() => {
      isSpinning = false;
      totalRotation = finalRotation;
      canvas.style.transition = "";

      const actual = getPrizeAtTopByRotation(norm360(totalRotation));

      console.log(
         "Ожидалось:", winner.name,
         "| Фактически:", actual ? actual.name : "—",
         "| prizeMiddleAngle:", prizeMiddleAngle.toFixed(1),
         "| baseRotation:", baseRotation.toFixed(1),
         "| totalRotation:", norm360(totalRotation).toFixed(1)
      );

      const prizeToShow = actual && actual !== winner ? actual : winner;
      showPrize(prizeToShow);
   }, duration * 1000 + 60);
}



/*===========================================================================
🎉 4. ПОКАЗ ПОПАПА С ПРИЗОМ
===========================================================================*/
function showPrize(prize) {
   console.log("Вы выиграли:", prize.name);
   playButton.classList.remove("disabled");

   const popup = document.querySelector(".win-popup");
   const prizeNameEl = popup.querySelector(".win-popup__prize");
   const prizeImgEl = popup.querySelector(".win-popup__image img");

   prizeNameEl.textContent = prize.name;
   prizeImgEl.src = prize.image;
   prizeImgEl.alt = prize.name;

   playConfetti();
   openPopup();
}

/******/ })()
;