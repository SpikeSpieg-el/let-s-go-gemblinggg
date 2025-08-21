(function() {
	// Лёгкий слой диалога NPC, не вмешивающийся в логику игры. Только текстовые подсказки.
	const LOG_PANEL_ID = 'log-panel';
	const GIRL_SELECTOR = '.girl-sitting-img';
	const MAX_LOG_BUFFER = 20;

	let recentLogs = [];
	let lastHintTime = 0;
	let dialogEl = null;
	let overlayEl = null;

	function getEl(selector) {
		return document.querySelector(selector);
	}

	function ensureStyles() {
		if (document.getElementById('npc-guide-styles')) return;
		const style = document.createElement('style');
		style.id = 'npc-guide-styles';
		style.textContent = `
			.npc-overlay{position:fixed;inset:0;z-index:5000;background:transparent;}
			.npc-dialog{position:absolute;max-width:320px;background:var(--cell-bg,#232323);
            color:var(--text-color,#fff);border:1px solid var(--border-color,#444);border-radius:10px;
            box-shadow:0 8px 28px #0008;padding:12px 14px;font-size:14px;line-height:1.35;animation:popup-in .15s ease-out; z-index:99999}
			.npc-dialog .npc-text{margin-bottom:10px;white-space:pre-wrap}
			.npc-dialog .npc-actions{display:flex;gap:8px;justify-content:flex-end}
			.npc-dialog button{background:#ffd600;color:#222;border:none;border-radius:6px;padding:6px 12px;font-weight:700;cursor:pointer}
			.npc-dialog .npc-close{background:#444;color:#fff}
		`;
		document.head.appendChild(style);
	}

	function readLogPanel() {
		const panel = document.getElementById(LOG_PANEL_ID);
		if (!panel) return [];
		const items = Array.from(panel.querySelectorAll('p'));
		return items.map(p => (p.textContent || '').trim()).slice(0, MAX_LOG_BUFFER);
	}

	function initLogObserver() {
		const panel = document.getElementById(LOG_PANEL_ID);
		if (!panel) return;
		recentLogs = readLogPanel();
		const obs = new MutationObserver(() => {
			recentLogs = readLogPanel();
		});
		obs.observe(panel, { childList: true });
	}

	function choose(array) {
		return array[Math.floor(Math.random() * array.length)];
	}

	function hasRecentLog(substr) {
		return recentLogs.some(line => line.toLowerCase().includes(substr.toLowerCase()));
	}

	function getStateSafe() {
		return (window && window.state) ? window.state : null;
	}

	function getTickets() {
		const s = getStateSafe();
		return s ? (s.tickets || 0) : 0;
	}

	function getCoins() {
		const s = getStateSafe();
		return s ? (s.coins || 0) : 0;
	}

	function getSpinsLeft() {
		const s = getStateSafe();
		return s ? (s.spinsLeft || 0) : 0;
	}

	function getTurn() {
		const s = getStateSafe();
		return s ? (s.turn || 1) : 1;
	}

	function getBankBalance() {
		const s = getStateSafe();
		return s ? (s.bankBalance || 0) : 0;
	}

	function getDebt() {
		const s = getStateSafe();
		return s ? (s.targetDebt || 0) : 0;
	}

	function getInterest() {
		const s = getStateSafe();
		return s ? (s.baseInterestRate || 0) : 0;
	}

	function getInventorySize() {
		const s = getStateSafe();
		return s && Array.isArray(s.inventory) ? s.inventory.length : 0;
	}

	function getRun() {
		const s = getStateSafe();
		return s ? (s.run || 1) : 1;
	}

	function getWinStreak() {
		const s = getStateSafe();
		return s ? (s.winStreak || 0) : 0;
	}

	function getRoundSpinsMade() {
		const s = getStateSafe();
		return s ? (s.roundSpinsMade || 0) : 0;
	}

	function getTotalSpins() {
		const s = getStateSafe();
		return s ? (s.totalSpinsMade || 0) : 0;
	}

	function hasFreeRerolls() {
		const s = getStateSafe();
		return s ? (s.freeRerolls || 0) > 0 : false;
	}

	// Набор мягких реплик под разные ситуации. Никаких действий не совершается — только слова.
	function generateHint() {
		const s = getStateSafe();
		const turns = getTurn();
		const spins = getSpinsLeft();
		const tickets = getTickets();
		const coins = getCoins();
		const bank = getBankBalance();
		const debt = getDebt();
		const interest = getInterest();
		const inv = getInventorySize();
		const run = getRun();
		const winStreak = getWinStreak();
		const roundSpins = getRoundSpinsMade();
		const totalSpins = getTotalSpins();

		const candidates = [];

		// Контекст по последним логам
		if (hasRecentLog('ДЖЕКПОТ') || hasRecentLog('ДЖЕКПОТ')) {
			candidates.push(
				'Жарко было! Такой шанс редко дышит рядом. Лови волну, но не теряй голову.',
				'Вот это всплеск! Иногда машина сама подмигивает. Запомним момент.'
			);
		}
		if (hasRecentLog('Ничего не выпало')) {
			candidates.push(
				'Тишина тоже говорит. Иногда лучший ход — выдох и следующий спин.',
				'Пусто — не приговор. Бывает, что пауза откладывает удачу на потом.'
			);
		}
		if (hasRecentLog('Бесплатный реролл') || hasFreeRerolls()) {
			candidates.push(
				'Бесплатные рероллы — как мелкий дождь: незаметно освежают шансы.',
				'Есть бесплатные обновления? Значит, можно примерять варианты спокойнее.'
			);
		}
		if (hasRecentLog('Внесено в банк') || hasRecentLog('Внесено:')) {
			candidates.push(
				'Вклады обожают время. Чем раньше капля — тем громче эхо процентов.',
				'Банк услышал звон монет. Тихая работа, которая потом удивляет.'
			);
		}
		if (hasRecentLog('Реролл') || hasRecentLog('магазин')) {
			candidates.push(
				'Магазин — это зеркало твоего стиля. Иногда он понимает с третьего раза.',
				'Если витрина молчит — не беда. Настойчивость часто находит характерные вещи.'
			);
		}
		if (hasRecentLog('Легендар')) {
			candidates.push('Легендарные штуки любят сопровождение. Остальные амулеты у тебя под это танцуют?');
		}
		if (hasRecentLog('пассива') || hasRecentLog('Пассив')) {
			candidates.push('Пассивки — это привычки игры. Они тихо накапливают результат.');
		}

		// Ситуационные правила "что если" (адаптация под состояние)
		if (spins === 0 && coins >= 3) {
			candidates.push('Без прокрутов настроение другое. Что если приберечь пару монет на завтра — иногда это сильнее спина.');
		}
		if (spins <= 1 && tickets >= 2) {
			candidates.push('Когда спинов мало, билеты звучат громче. Иногда витрина откликается именно тогда.');
		}
		if (tickets >= 6) {
			candidates.push('Много талонов — простор для вкуса. Что если поискать что-то, что поддержит уже рабочую связку?');
		}
		if (bank > 0 && interest >= 0.2) {
			candidates.push('Проценты любят ранние вклады. Иногда одно спокойное решение делает раунд легче.');
		}
		if (bank >= debt && debt > 0) {
			candidates.push('Долг под контролем. Что если оставить себе чуть свободы на случайный всплеск удачи?');
		}
		if (turns === 3 && spins > 0) {
			candidates.push('Третий день щепетилен к времени. Пара точных ходов лучше десятка суеты.');
		}
		if (inv === 0) {
			candidates.push('Пустой инвентарь — чистый холст. Любая находка сразу заметна в рисунке игры.');
		}
		if (inv >= 7) {
			candidates.push('Инвентарь тяжелеет — осмотрись. Иногда одна вещь поёт громче, чем три вполголоса.');
		}
		if (winStreak >= 3) {
			candidates.push('Серия на твоей стороне. Спокойствие удерживает ритм лучше эйфории.');
		}
		if (roundSpins === 0 && totalSpins > 0) {
			candidates.push('Новый раунд — новое дыхание. Вспомни, что вчера звучало особенно громко.');
		}
		if (coins >= 20 && spins === 0) {
			candidates.push('Монеты звенят, а барабаны молчат. Иногда пауза перед громким аккордом полезна.');
		}
		if (interest < 0.1) {
			candidates.push('Низкая ставка — просто фон. Сцена всё равно у символов и связок.');
		}
		if (debt > 0 && bank === 0 && turns === 1) {
			candidates.push('Старт без подушки — бодрит. Но даже маленький вклад меняет финальный рисунок.');
		}
		if (totalSpins > 0 && totalSpins % 10 === 0) {
			candidates.push('Круглая десятка спинов позади. Такие отметки любят маленькие переоценки плана.');
		}

		// Нейтральные мягкие фразы, без навязывания
		const neutral = [
			'Я рядом, наблюдаю за ритмом. Если захочешь — подсвечу то, что уже шепчет.',
			'Иногда достаточно одного точного хода. И он всегда звучит спокойнее остальных.',
			'Мелкие бонусы складываются тихо, а потом вдруг поют в унисон.',
			'Витрина меняется, а стиль остаётся. Игра любит узнаваемость.',
			'Оставь себе чуть свободы — случай тоже художник.',
			'Когда лог говорит слишком громко — просто смотри на тенденции, не на всплески.',
			'Подсказки — это огонёк сбоку. Твоё решение — это фонарь.',
			'Риск без повода — просто шум. Риск с идеей — метрика.',
			'Если что-то сработало, дай ему шанс повториться. Ритм любит повтор.',
			'Тишина между спинами — это тоже ход. В ней слышно, куда тянет игру.'
		];

		// Гарантируем минимум 20 уникальных вариантов: совокупность candidates + neutral перекрывает это условие
		const pool = candidates.length > 0 ? candidates.concat(neutral) : neutral;
		return choose(pool);
	}

	function placeDialogNear(target) {
		const container = target.closest('.gif_icon') || document.body;
		overlayEl = document.createElement('div');
		overlayEl.className = 'npc-overlay';
		overlayEl.addEventListener('click', closeDialog);

		dialogEl = document.createElement('div');
		dialogEl.className = 'npc-dialog';
		const text = document.createElement('div');
		text.className = 'npc-text';
		text.textContent = generateHint();
		dialogEl.appendChild(text);

		const actions = document.createElement('div');
		actions.className = 'npc-actions';
		const btnNext = document.createElement('button');
		btnNext.textContent = 'Ещё';
		btnNext.addEventListener('click', function(e){ e.stopPropagation(); text.textContent = generateHint(); });
		const btnClose = document.createElement('button');
		btnClose.className = 'npc-close';
		btnClose.textContent = 'Закрыть';
		btnClose.addEventListener('click', function(e){ e.stopPropagation(); closeDialog(); });
		actions.appendChild(btnNext);
		actions.appendChild(btnClose);
		dialogEl.appendChild(actions);

		// Позиционирование рядом с картинкой
		const rect = target.getBoundingClientRect();
		const top = Math.max(12, rect.top + window.scrollY - 10);
		
		dialogEl.style.top = top + 'px';
		

		container.appendChild(overlayEl);
		container.appendChild(dialogEl);
	}

	function closeDialog() {
		if (dialogEl && dialogEl.parentNode) dialogEl.parentNode.removeChild(dialogEl);
		if (overlayEl && overlayEl.parentNode) overlayEl.parentNode.removeChild(overlayEl);
		dialogEl = null;
		overlayEl = null;
	}

	function onGirlClick(e) {
		const now = Date.now();
		if (now - lastHintTime < 300) return; // защита от дабл-клика
		lastHintTime = now;
		ensureStyles();
		closeDialog();
		placeDialogNear(e.currentTarget);
	}

	function initGirl() {
		const girl = getEl(GIRL_SELECTOR);
		if (!girl) return;
		girl.style.cursor = 'pointer';
		girl.addEventListener('click', onGirlClick);
	}

	document.addEventListener('DOMContentLoaded', function() {
		initLogObserver();
		initGirl();
	});

	// Экспорт для отладки при необходимости
	window.npcGuide = { generateHint };
})(); 