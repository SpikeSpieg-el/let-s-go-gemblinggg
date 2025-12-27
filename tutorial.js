// Интерактивный туториал для игры

export const tutorialSteps = [
  {
    selector: '#buy-spins-7',
    text: 'Первым делом купите 7 прокрутов — это ваши попытки на этот раунд. Без них вы не сможете играть!',
    waitFor: 'click',
  },
  {
    selector: '#shop-items',
    text: 'Это магазин амулетов. Здесь вы можете покупать амулеты за талоны (🎟️), чтобы получить уникальные бонусы.',
    waitFor: 'next',
  },
  {
    selector: '.stats-grid.compact-stats',
    text: 'Здесь отображаются ваши основные показатели: цикл, раунд, монеты, талоны, удача. Следите за ними, чтобы не проиграть!',
    waitFor: 'next',
  },
  {
    selector: '.controls',
    text: 'В этой панели отображается, сколько у вас осталось прокрутов (спинов), а также находятся основные кнопки управления: завершение раунда, просмотр статистики и лога.',
    waitFor: 'next',
  },
  {
    selector: '#slot-machine',
    text: 'Это слот-машина. Здесь выпадают символы, которые приносят вам монеты.',
    waitFor: 'next',
  },
  {
    selector: '#lever',
    text: 'Нажмите на рычаг, чтобы сделать прокрут и испытать удачу!',
    waitFor: 'click',
  },
  {
    selector: '#inventory-items',
    text: 'Здесь отображаются ваши амулеты. Они дают постоянные или временные бонусы. Сейчас у вас нет амулетов, мы можете купить их в магазине.',
    waitFor: 'next',
  },
  {
    selector: '#bank-balance',
    text: 'Это ваш банк. Вносите деньги сюда, чтобы получать проценты в начале следующего раунда.',
    waitFor: 'next',
  },
  {
    selector: null,
    text: 'Когда у вас закончатся прокруты, вы сможете завершить раунд. Следите за их количеством! Если завершить досрочно, вы потеряете прокруты на раунд.',
    waitFor: 'next',
  },
  {
    selector: '#btn-end-turn',
    text: 'У вас закончились прокруты, теперь можно завершить раунд этой кнопкой и перейти дальше в новый раунд.',
    waitFor: 'click',
    waitForSpinsEnd: true,
  },
  {
    selector: null,
    text: 'Поздравляем! Вы прошли базовое обучение. Теперь вы готовы к игре. Удачи!',
    waitFor: 'finish',
  },
];

let tutorialActive = false;
let tutorialStep = 0;
let tutorialOverlay = null;
let highlightEl = null;

function showTutorialStep(stepIdx) {
  removeTutorialOverlay();
  const step = tutorialSteps[stepIdx];
  if (!step) return;

  // Если шаг требует дождаться окончания прокрутов
  if (step.waitForSpinsEnd) {
    function checkSpins() {
      // DEBUG: выводим состояние
      console.log('[ТУТОРИАЛ] checkSpins: tutorialActive=', tutorialActive, 'spinsLeft=', window.state && window.state.spinsLeft, 'tutorialStep=', tutorialStep);
      if (!tutorialActive) return;
      if (window.state && Number(window.state.spinsLeft) === 0) {
        actuallyShowStep(step);
      } else {
        setTimeout(checkSpins, 500);
      }
    }
    checkSpins();
    return;
  }
  actuallyShowStep(step);
}

function actuallyShowStep(step) {
  // Подсветка элемента
  if (step.selector) {
    highlightEl = document.querySelector(step.selector);
    if (highlightEl) {
      highlightEl.classList.add('tutorial-highlight');
      highlightEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  // Окно подсказки
  tutorialOverlay = document.createElement('div');
  tutorialOverlay.className = 'tutorial-overlay';
  tutorialOverlay.innerHTML = `
    <div class="tutorial-popup">
      <div class="tutorial-text">${step.text}</div>
      <div class="tutorial-actions">
        <button class="tutorial-skip">Пропустить обучение</button>
        ${step.waitFor === 'next' ? '<button class="tutorial-next">Далее</button>' : ''}
      </div>
    </div>
  `;
  document.body.appendChild(tutorialOverlay);

  // Позиционирование popup рядом с элементом, если есть selector
  if (step.selector && highlightEl) {
    const popup = tutorialOverlay.querySelector('.tutorial-popup');
    const rect = highlightEl.getBoundingClientRect();
    const popupRect = { width: 340, height: 140 }; // примерная ширина/высота
    let top = rect.top + window.scrollY;
    let left = rect.right + 18 + window.scrollX;
    // Если не помещается справа — ставим снизу
    if (left + popupRect.width > window.innerWidth) {
      left = rect.left + window.scrollX;
      top = rect.bottom + 18 + window.scrollY;
    }
    // Если не помещается снизу — ставим сверху
    if (top + popupRect.height > window.innerHeight + window.scrollY) {
      top = rect.top + window.scrollY - popupRect.height - 18;
    }
    // Минимальные отступы
    if (left < 8) left = 8;
    if (top < 8) top = 8;
    popup.style.position = 'absolute';
    popup.style.left = left + 'px';
    popup.style.top = top + 'px';
    popup.style.zIndex = 10002;
  }

  // Кнопка пропуска
  tutorialOverlay.querySelector('.tutorial-skip').onclick = stopTutorial;
  // Кнопка далее
  if (step.waitFor === 'next') {
    tutorialOverlay.querySelector('.tutorial-next').onclick = () => nextTutorialStep();
  }

  // Ожидание действия пользователя
  // DEBUG: выводим состояние
  // ошибка v2:1 Uncaught TypeError: Cannot read properties of null (reading 'removeEventListener') 
  //{columnNumber: 19, fileName: 'http://127.0.0.1:5500/tutorial.js', lineNumber: 149, message: "Uncaught TypeError: Cannot read properties of null (reading 'removeEventListener')", name: 'TypeError', …}

  //tutorial.js:149 Uncaught TypeError: Cannot read properties of null (reading 'removeEventListener')
   // at HTMLDivElement.handler (tutorial.js:149:19)

  if (step.waitFor === 'click' && highlightEl) {
    const handler = () => {
      highlightEl.removeEventListener('click', handler, true);
      nextTutorialStep();
    };
    highlightEl.addEventListener('click', handler, true);
  }
}

function removeTutorialOverlay() {
  if (highlightEl) {
    highlightEl.classList.remove('tutorial-highlight');
    highlightEl = null;
  }
  if (tutorialOverlay) {
    tutorialOverlay.remove();
    tutorialOverlay = null;
  }
}

function nextTutorialStep() {
  removeTutorialOverlay();
  tutorialStep++;
  if (tutorialStep >= tutorialSteps.length) {
    stopTutorial();
    return;
  }
  showTutorialStep(tutorialStep);
}

export function startTutorial() {
  tutorialActive = true;
  tutorialStep = 0;
  // Запускаем обычную игру, но в режиме обучения
  if (window.initGame) window.initGame();
  setTimeout(() => showTutorialStep(0), 600); // Даем время UI отрисоваться
}

function stopTutorial() {
  tutorialActive = false;
  removeTutorialOverlay();
}

// Стили для подсветки и окна туториала
const style = document.createElement('style');
style.innerHTML = `
.tutorial-highlight {
  outline: 3px solid #ffd600 !important;
  box-shadow: 0 0 16px 4px #ffd60099 !important;
  position: relative;
  z-index: 10001 !important;
}
.tutorial-overlay {
  position: fixed; left: 0; top: 0; width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.25); z-index: 10000; display: flex; align-items: center; justify-content: center;
  pointer-events: none;
}
.tutorial-popup {
  background: #232323; color: #fff; border-radius: 12px; padding: 32px 28px; max-width: 420px; box-shadow: 0 8px 32px #000a; font-size: 1.15em; text-align: center;
  pointer-events: auto;
}
.tutorial-actions { margin-top: 18px; display: flex; gap: 12px; justify-content: center; }
.tutorial-popup button { font-size: 1em; padding: 8px 18px; border-radius: 6px; border: none; background: #ffd600; color: #222; font-weight: bold; cursor: pointer; transition: background 0.2s; }
.tutorial-popup button:hover { background: #ffe066; }
`;
document.head.appendChild(style); 