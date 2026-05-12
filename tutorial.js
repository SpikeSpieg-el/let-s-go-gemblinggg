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
    text: 'Здесь отображаются ваши амулеты. Они дают постоянные или временные бонусы. Сейчас у вас нет амулетов, вы можете купить их в магазине.',
    waitFor: 'next',
  },
  {
    selector: '#btn-deposit',
    text: 'Это кнопка внесения монет в банк. Храните деньги на банковском счёте — в начале каждого следующего раунда вы будете получать проценты.',
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
    // Показываем маленький угловой тост, пока прокруты не закончатся
    tutorialOverlay = document.createElement('div');
    tutorialOverlay.className = 'tutorial-waiting-toast';
    tutorialOverlay.innerHTML = `
      <div class="tutorial-step-counter">Шаг ${stepIdx + 1} / ${tutorialSteps.length}</div>
      <div class="tutorial-text">Сделайте все прокруты, чтобы продолжить обучение...</div>
      <button class="tutorial-skip">Пропустить</button>
    `;
    document.body.appendChild(tutorialOverlay);
    tutorialOverlay.querySelector('.tutorial-skip').onclick = stopTutorial;

    function checkSpins() {
      if (!tutorialActive) return;
      if (window.state && Number(window.state.spinsLeft) === 0) {
        removeTutorialOverlay();
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

  // Определяем текущий индекс шага для счётчика
  const currentStepIdx = tutorialSteps.indexOf(step);
  const isLastStep = step.waitFor === 'finish';

  // Окно подсказки
  tutorialOverlay = document.createElement('div');
  tutorialOverlay.className = 'tutorial-overlay';
  tutorialOverlay.innerHTML = `
    <div class="tutorial-popup">
      ${!isLastStep ? '<button class="tutorial-skip">× пропустить</button>' : ''}
      <div class="tutorial-step-counter">Шаг ${currentStepIdx + 1} / ${tutorialSteps.length}</div>
      <div class="tutorial-text">${step.text}</div>
      <div class="tutorial-actions">
        ${step.waitFor === 'next' ? '<button class="tutorial-next">Далее</button>' : ''}
        ${isLastStep ? '<button class="tutorial-finish">Завершить обучение</button>' : ''}
      </div>
    </div>
  `;
  document.body.appendChild(tutorialOverlay);

  // Позиционирование popup рядом с элементом, если есть selector
  if (step.selector && highlightEl) {
    const popup = tutorialOverlay.querySelector('.tutorial-popup');
    const rect = highlightEl.getBoundingClientRect();
    const popupRect = { width: 340, height: 160 }; // примерная ширина/высота
    // getBoundingClientRect возвращает координаты относительно вьюпорта,
    // а overlay — position:fixed от (0,0), поэтому scrollX/Y не нужен
    let top = rect.top;
    let left = rect.right + 18;
    // Если не помещается справа — ставим снизу
    if (left + popupRect.width > window.innerWidth) {
      left = rect.left;
      top = rect.bottom + 18;
    }
    // Если не помещается снизу — ставим сверху
    if (top + popupRect.height > window.innerHeight) {
      top = rect.top - popupRect.height - 18;
    }
    // Минимальные отступы и зажим по правому/нижнему краям
    if (left < 8) left = 8;
    if (top < 8) top = 8;
    if (left + popupRect.width > window.innerWidth - 8) left = window.innerWidth - popupRect.width - 8;
    if (top + popupRect.height > window.innerHeight - 8) top = window.innerHeight - popupRect.height - 8;
    popup.style.position = 'fixed';
    popup.style.left = left + 'px';
    popup.style.top = top + 'px';
    popup.style.zIndex = 10002;
  }

  // Кнопка пропуска (только для не-финальных шагов)
  const skipBtn = tutorialOverlay.querySelector('.tutorial-skip');
  if (skipBtn) skipBtn.onclick = stopTutorial;
  // Кнопка далее
  if (step.waitFor === 'next') {
    tutorialOverlay.querySelector('.tutorial-next').onclick = () => nextTutorialStep();
  }
  // Кнопка завершения (финальный шаг)
  const finishBtn = tutorialOverlay.querySelector('.tutorial-finish');
  if (finishBtn) finishBtn.onclick = stopTutorial;

  // Ожидание действия пользователя
  if (step.waitFor === 'click' && highlightEl) {
    const elRef = highlightEl; // Сохраняем ссылку
    const handler = () => {
      // Проверяем, существует ли элемент и висит ли на нем слушатель
      if (elRef && elRef.parentNode) {
        elRef.removeEventListener('click', handler, true);
      }
      nextTutorialStep();
    };
    elRef.addEventListener('click', handler, true);
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
.tutorial-step-counter { font-size: 0.78em; color: #ffd600; margin-bottom: 8px; opacity: 0.85; }
.tutorial-popup { position: relative; }
.tutorial-popup button { font-size: 1em; padding: 8px 18px; border-radius: 6px; border: none; background: #ffd600; color: #222; font-weight: bold; cursor: pointer; transition: background 0.2s; }
.tutorial-popup button:hover { background: #ffe066; }
.tutorial-popup button.tutorial-finish { background: #4caf50; color: #fff; }
.tutorial-popup button.tutorial-finish:hover { background: #66bb6a; }
.tutorial-popup button.tutorial-skip {
  position: absolute; top: 8px; right: 10px;
  background: transparent; color: #888; font-size: 0.72em;
  padding: 2px 6px; font-weight: normal; border-radius: 4px;
  border: 1px solid #555; transition: color 0.2s, border-color 0.2s;
}
.tutorial-popup button.tutorial-skip:hover { background: transparent; color: #ccc; border-color: #999; }
.tutorial-waiting-toast {
  position: fixed; bottom: 16px; right: 16px; z-index: 10002;
  background: #232323; color: #fff; border-radius: 10px;
  padding: 22px 18px 14px; max-width: 280px; box-shadow: 0 4px 20px #000a;
  font-size: 0.95em; text-align: center; pointer-events: auto;
  border: 2px solid #ffd600;
}
.tutorial-waiting-toast .tutorial-step-counter { font-size: 0.75em; color: #ffd600; margin-bottom: 6px; opacity: 0.85; }
.tutorial-waiting-toast .tutorial-text { margin-bottom: 0; }
.tutorial-waiting-toast button.tutorial-skip {
  position: absolute; top: 6px; right: 8px;
  background: transparent; color: #888; font-size: 0.72em;
  padding: 2px 6px; font-weight: normal; border-radius: 4px;
  border: 1px solid #555; cursor: pointer; transition: color 0.2s, border-color 0.2s;
}
.tutorial-waiting-toast button.tutorial-skip:hover { color: #ccc; border-color: #999; }
`;
document.head.appendChild(style); 