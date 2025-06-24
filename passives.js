const ALL_PASSIVES = [
    // --- Разовые бафы ---
    {
        id: 'start_money',
        name: 'Стартовый капитал',
        desc: 'Получите +20💰 × номер цикла в начале игры.',
        emoji: '💰',
        type: 'one_time',
        effect: (state) => { state.coins += 20 * (state.cycle || 1); }
    },
    {
        id: 'deal_with_the_devil',
        name: 'Сделка с дьяволом',
        desc: 'Немедленно получите +33💰 × номер цикла и +3🎟️. Ваша базовая процентная ставка в банке перманентно снижается на 3%.',
        emoji: '😈',
        type: 'one_time',
        effect: (state) => { 
            state.coins += 33 * (state.cycle || 1); 
            state.tickets += 3;
            state.passiveInterestBonus = (state.passiveInterestBonus || 0) - 0.03;
        }
    },
    {
        id: 'start_tickets',
        name: 'Стартовые талоны',
        desc: 'Получите +5🎟️ в начале игры.',
        emoji: '🎟️',
        type: 'one_time',
        effect: (state) => { state.tickets += 5; }
    },
    // --- Слот-эффекты ---
    {
        id: 'lemon_less',
        name: 'Горький лимон',
        desc: 'Лимоны 🍋 выпадают на 30% реже.',
        emoji: '🍋',
        type: 'slot_modifier',
        effect: (state) => {
            const lemon = window.SYMBOLS.find(s => s.id === 'lemon');
            if (lemon) lemon.weight = Math.floor(lemon.weight * 0.7);
        }
    },
    {
        id: 'lemon_more',
        name: 'Лимонная удача',
        desc: 'Лимоны 🍋 выпадают на 20% чаще.',
        emoji: '🍋',
        type: 'slot_modifier',
        effect: (state) => {
            const lemon = window.SYMBOLS.find(s => s.id === 'lemon');
            if (lemon) lemon.weight = Math.floor(lemon.weight * 1.2);
        }
    },
    {
        id: 'cherry_less',
        name: 'Кислая вишня',
        desc: 'Вишни 🍒 выпадают на 30% реже.',
        emoji: '🍒',
        type: 'slot_modifier',
        effect: (state) => {
            const cherry = window.SYMBOLS.find(s => s.id === 'cherry');
            if (cherry) cherry.weight = Math.floor(cherry.weight * 0.7);
        }
    },
    {
        id: 'cherry_more',
        name: 'Вишнёвая удача',
        desc: 'Вишни 🍒 выпадают на 20% чаще.',
        emoji: '🍒',
        type: 'slot_modifier',
        effect: (state) => {
            const cherry = window.SYMBOLS.find(s => s.id === 'cherry');
            if (cherry) cherry.weight = Math.floor(cherry.weight * 1.2);
        }
    },
    {
        id: 'clover_less',
        name: 'Увядший клевер',
        desc: 'Клеверы 🍀 выпадают на 30% реже.',
        emoji: '🍀',
        type: 'slot_modifier',
        effect: (state) => {
            const clover = window.SYMBOLS.find(s => s.id === 'clover');
            if (clover) clover.weight = Math.floor(clover.weight * 0.7);
        }
    },
    {
        id: 'clover_more',
        name: 'Клеверная удача',
        desc: 'Клеверы 🍀 выпадают на 20% чаще.',
        emoji: '🍀',
        type: 'slot_modifier',
        effect: (state) => {
            const clover = window.SYMBOLS.find(s => s.id === 'clover');
            if (clover) clover.weight = Math.floor(clover.weight * 1.2);
        }
    },
    {
        id: 'bell_less',
        name: 'Тихий звон',
        desc: 'Колокольчики 🔔 выпадают на 30% реже.',
        emoji: '🔔',
        type: 'slot_modifier',
        effect: (state) => {
            const bell = window.SYMBOLS.find(s => s.id === 'bell');
            if (bell) bell.weight = Math.floor(bell.weight * 0.7);
        }
    },
    {
        id: 'bell_more',
        name: 'Звонкая удача',
        desc: 'Колокольчики 🔔 выпадают на 20% чаще.',
        emoji: '🔔',
        type: 'slot_modifier',
        effect: (state) => {
            const bell = window.SYMBOLS.find(s => s.id === 'bell');
            if (bell) bell.weight = Math.floor(bell.weight * 1.2);
        }
    },
    {
        id: 'diamond_less',
        name: 'Тусклый алмаз',
        desc: 'Алмазы 💎 выпадают на 30% реже.',
        emoji: '💎',
        type: 'slot_modifier',
        effect: (state) => {
            const diamond = window.SYMBOLS.find(s => s.id === 'diamond');
            if (diamond) diamond.weight = Math.floor(diamond.weight * 0.7);
        }
    },
    {
        id: 'diamond_more',
        name: 'Алмазная удача',
        desc: 'Алмазы 💎 выпадают на 20% чаще.',
        emoji: '💎',
        type: 'slot_modifier',
        effect: (state) => {
            const diamond = window.SYMBOLS.find(s => s.id === 'diamond');
            if (diamond) diamond.weight = Math.floor(diamond.weight * 1.2);
        }
    },
    {
        id: 'coins_less',
        name: 'Потерянные монеты',
        desc: 'Монеты 💰 выпадают на 30% реже.',
        emoji: '💰',
        type: 'slot_modifier',
        effect: (state) => {
            const coins = window.SYMBOLS.find(s => s.id === 'coins');
            if (coins) coins.weight = Math.floor(coins.weight * 0.7);
        }
    },
    {
        id: 'coins_more',
        name: 'Монетная удача',
        desc: 'Монеты 💰 выпадают на 20% чаще.',
        emoji: '💰',
        type: 'slot_modifier',
        effect: (state) => {
            const coins = window.SYMBOLS.find(s => s.id === 'coins');
            if (coins) coins.weight = Math.floor(coins.weight * 1.2);
        }
    },
    {
        id: 'seven_less',
        name: 'Потерянная семёрка',
        desc: 'Семёрки 7️⃣ выпадают на 30% реже.',
        emoji: '7️⃣',
        type: 'slot_modifier',
        effect: (state) => {
            const seven = window.SYMBOLS.find(s => s.id === 'seven');
            if (seven) seven.weight = Math.floor(seven.weight * 0.7);
        }
    },
    {
        id: 'seven_more',
        name: 'Семёрочная удача',
        desc: 'Семёрки 7️⃣ выпадают на 20% чаще.',
        emoji: '7️⃣',
        type: 'slot_modifier',
        effect: (state) => {
            const seven = window.SYMBOLS.find(s => s.id === 'seven');
            if (seven) seven.weight = Math.floor(seven.weight * 1.2);
        }
    },
    // --- Предметные эффекты ---
    {
        id: 'clover_bonus',
        name: 'Клеверный бонус',
        desc: 'Каждый клевер 🍀 на поле даёт +1💰 при выигрыше.',
        emoji: '🌱',
        type: 'item_mod',
        effect: (state) => {
            // Логика применяется в calculateWinnings
        }
    },
    {
        id: 'cherry_luck',
        name: 'Вишнёвая удача',
        desc: 'Каждый прокрут с вишней 🍒 даёт +1 к удаче на этот спин.',
        emoji: '🍒',
        type: 'item_mod',
        effect: (state) => {
            // Логика применяется в calculateWinnings и generateGrid
        }
    },

    // --- СИНЕРГИЯ С ПРЕДМЕТАМИ ---
    {
        id: 'piggy_bank_pro',
        name: 'Профессиональная копилка',
        desc: 'Амулет "Копилка" 🐷 собирает в 2 раза больше монет с проигрышных прокрутов.',
        emoji: '🏦',
        type: 'item_mod',
        effect: (state) => {} // Логика в skript.js
    },
    {
        id: 'watchmaker_precision',
        name: 'Точность часовщика',
        desc: 'Амулет "Карманные часы" 🕰️ имеет 50% шанс дать +2 прокрута вместо +1.',
        emoji: '⌛',
        type: 'item_mod',
        effect: (state) => {} // Логика в skript.js
    },
    {
        id: 'ritualist_focus',
        name: 'Фокус ритуалиста',
        desc: 'Амулет "Кровавый Ритуал" 🩸 стоит на 1💰 дешевле и даёт на 2 удачи больше.',
        emoji: '🔪',
        type: 'item_mod',
        effect: (state) => {} // Логика в skript.js
    },
    {
        id: 'lucky_bomb',
        name: 'Счастливая бомба',
        desc: 'Амулет "Вишневая бомба" 💣 теперь также даёт +1🎟️ при срабатывании.',
        emoji: '🧨',
        type: 'item_mod',
        effect: (state) => {} // Логика в skript.js
    },
    {
        id: 'magnetic_personality',
        name: 'Магнитная личность',
        desc: 'Амулет "Денежный магнит" 🧲 теперь также притягивает +1💰 за каждый Алмаз 💎 на поле.',
        emoji: '✨',
        type: 'item_mod',
        effect: (state) => {} // Логика в items.js
    },
    {
        id: 'vault_insurance_passive',
        name: 'Страхование вклада',
        desc: 'Амулет "Ключ от хранилища" 🔑 дополнительно не даёт процентной ставке упасть ниже 10%.',
        emoji: '🛡️',
        type: 'item_mod',
        effect: (state) => {} // Логика в skript.js
    },
    {
        id: 'golden_touch',
        name: 'Золотое прикосновение',
        desc: 'Множитель амулета "Золотой Лимон" 🍋 увеличен на 1 (с x3 до x4).',
        emoji: '🏆',
        type: 'item_mod',
        effect: (state) => {} // Логика в skript.js
    },
    {
        id: 'gamblers_delight',
        name: 'Восторг игрока',
        desc: 'Удваивает шанс срабатывания амулета "Дублон" 🏴.',
        emoji: '🎲',
        type: 'item_mod',
        effect: (state) => {} // Логика в skript.js
    },
    {
        id: 'wilder_clover',
        name: 'Дичайший клевер',
        desc: 'Если у вас есть "Дикий Клевер" 🃏, каждый клевер на поле дополнительно даёт +1💰 (даже при проигрыше).',
        emoji: '🌿',
        type: 'item_mod',
        effect: (state) => {} // Логика в skript.js
    },
    {
        id: 'sticky_fingers_plus',
        name: 'Очень липкие пальцы',
        desc: 'Амулет "Липкие пальцы" 🤏 теперь даёт +2💰 вместо +1💰.',
        emoji: '🙌',
        type: 'item_mod',
        effect: (state) => {} // Логика в skript.js
    },

    // --- СИНЕРГИЯ С МЕХАНИКАМИ ---
    {
        id: 'bankers_friend',
        name: 'Друг банкира',
        desc: 'Ваш первый депозит в каждом раунде увеличивается на 10%.',
        emoji: '🤝',
        type: 'slot_modifier',
        effect: (state) => { state.flags = {...state.flags, firstDepositThisRound: true }; }
    },
    {
        id: 'shopaholic',
        name: 'Шопоголик',
        desc: 'Ваша первая покупка амулета в каждом раунде на 2🎟️ дешевле (мин. стоимость 1🎟️).',
        emoji: '🛍️',
        type: 'item_mod',
        effect: (state) => { state.flags = {...state.flags, firstPurchaseThisRound: true }; }
    },
    {
        id: 'combo_king',
        name: 'Король комбо',
        desc: 'Базовый бонус за комбо-линию увеличен с 25% до 40%.',
        emoji: '👑',
        type: 'slot_modifier',
        effect: (state) => {} // Логика в skript.js
    },
    {
        id: 'lucky_start',
        name: 'Удачный старт',
        desc: 'Вы начинаете каждый раунд с +3 к удаче (эффект временный, на 1 раунд).',
        emoji: '🌅',
        type: 'slot_modifier',
        effect: (state) => {} // Логика в skript.js
    },
    {
        id: 'interest_spike',
        name: 'Процентный всплеск',
        desc: 'В начале каждой новой игры (Цикла) базовая процентная ставка банка перманентно увеличивается на 2%.',
        emoji: '📈',
        type: 'one_time',
        effect: (state) => { state.passiveInterestBonus = (state.passiveInterestBonus || 0) + 0.02; }
    },
    {
        id: 'frugal_spinner',
        name: 'Экономный игрок',
        desc: 'Стоимость одиночного прокрута (1 спин за 3💰) перманентно снижена до 2💰.',
        emoji: '💸',
        type: 'one_time',
        effect: (state) => {} // Логика в skript.js
    },
    {
        id: 'diamond_hands',
        name: 'Алмазные руки',
        desc: 'Алмазы 💎 выпадают на 25% чаще.',
        emoji: '💎',
        type: 'slot_modifier',
        effect: (state) => {
            const diamond = window.SYMBOLS.find(s => s.id === 'diamond');
            if (diamond) diamond.weight = Math.floor(diamond.weight * 1.25);
        }
    },
    {
        id: 'early_bird',
        name: 'Ранняя пташка',
        desc: 'Бонусы за досрочное погашение долга увеличены на 50%.',
        emoji: '🐦',
        type: 'slot_modifier',
        effect: (state) => {} // Логика в skript.js
    },
    {
        id: 'seven_symphony',
        name: 'Симфония семёрок',
        desc: 'Символы Семёрки 7️⃣ приносят в 1.5 раза больше 💰.',
        emoji: '🎶',
        type: 'item_mod',
        effect: (state) => {} // Логика в skript.js
    },
    {
        id: 'reroll_master',
        name: 'Мастер Реролла',
        desc: 'Первый реролл магазина в каждом раунде стоит на 1🎟️ дешевле.',
        emoji: '🧙',
        type: 'item_mod',
        effect: (state) => { state.flags = {...state.flags, firstRerollUsed: false }; } // Логика в skript.js
    },
    
    // --- НОВЫЕ ПАССИВКИ, СВЯЗАННЫЕ С МЕХАНИКАМИ (20) ---
    {
        id: 'financial_literacy',
        name: 'Финансовая грамотность',
        desc: 'Процентная ставка банка никогда не опускается ниже 5%.',
        emoji: '🧑‍🏫',
        type: 'slot_modifier',
        effect: (state) => {} // Логика в skript.js updateInterestRate
    },
    {
        id: 'hoarders_pride',
        name: 'Гордость барахольщика',
        desc: 'Даёт +1 к удаче за каждый пустой слот для амулета.',
        emoji: '📦',
        type: 'slot_modifier',
        effect: (state) => {} // Логика в skript.js generateGrid
    },
    {
        id: 'learning_from_mistakes',
        name: 'Обучение на ошибках',
        desc: 'Каждые 5 проигрышных прокрутов подряд перманентно увеличивают вашу Удачу на 1.',
        emoji: '🧠',
        type: 'slot_modifier',
        effect: (state) => { state.permanentLuckBonus = (state.permanentLuckBonus || 0); state.flags.consecutiveLosses = 0; }
    },
    {
        id: 'bell_ringer',
        name: 'Звонарь',
        desc: 'Каждый Колокольчик 🔔 на поле добавляет +1💰 к выигрышу с линий Колокольчиков.',
        emoji: '⛪',
        type: 'item_mod',
        effect: (state) => {} // Логика в skript.js calculateWinnings
    },
    {
        id: 'geologist',
        name: 'Геолог',
        desc: 'Линии типа "Небо/Земля" дополнительно приносят +3🎟️ при выигрыше.',
        emoji: '🌍',
        type: 'item_mod',
        effect: (state) => {} // Логика в skript.js calculateWinnings
    },
    {
        id: 'bulk_buyer',
        name: 'Оптовый покупатель',
        desc: 'Стоимость покупки "7 прокрутов" перманентно снижена на 2💰.',
        emoji: '🛒',
        type: 'one_time',
        effect: (state) => { CONFIG.SPIN_PACKAGE_1.cost = Math.max(1, CONFIG.SPIN_PACKAGE_1.base_cost - 2); }
    },
    {
        id: 'calculated_risk',
        name: 'Просчитанный риск',
        desc: 'Если вы заканчиваете раунд с 0 оставшихся прокрутов, вы получаете +5💰 × номер цикла.',
        emoji: '🎲',
        type: 'slot_modifier',
        effect: (state) => {} // Логика в skript.js confirmEndTurn
    },
    {
        id: 'chain_reaction',
        name: 'Цепная реакция',
        desc: 'Каждая выигрышная линия в КОМБО имеет 10% шанс принести +1🎟️.',
        emoji: '⛓️',
        type: 'slot_modifier',
        effect: (state) => {} // Логика в skript.js calculateWinnings
    },
    {
        id: 'diamond_cutter',
        name: 'Огранщик алмазов',
        desc: 'Каждый Алмаз 💎 на выигрышной линии из Алмазов увеличивает множитель этой линии на +1.',
        emoji: '💍',
        type: 'item_mod',
        effect: (state) => {} // Логика в skript.js calculateWinnings
    },
    {
        id: 'beginners_luck_passive',
        name: 'Удача новичка',
        desc: 'Ваш первый прокрут в каждом раунде получает +10 к Удаче.',
        emoji: '🎯',
        type: 'slot_modifier',
        effect: (state) => { state.flags = {...state.flags, isFirstSpinOfRound: true }; }
    },
    {
        id: 'barterer',
        name: 'Специалист по бартеру',
        desc: 'Все амулеты в магазине стоимостью 5🎟️ и выше продаются на 1🎟️ дешевле.',
        emoji: '🗣️',
        type: 'item_mod',
        effect: (state) => {} // Логика в skript.js buyItem
    },
    {
        id: 'seasoned_veteran',
        name: 'Опытный ветеран',
        desc: 'Вы начинаете каждый новый Цикл (начиная со второго) со случайным ОБЫЧНЫМ амулетом.',
        emoji: '🎖️',
        type: 'slot_modifier',
        effect: (state) => {} // Логика в skript.js startNewCycle
    },
    {
        id: 'major_investor',
        name: 'Крупный инвестор',
        desc: 'Каждый раз, когда вы вносите в банк 100💰 или более за один раз, вы получаете +1🎟️.',
        emoji: '💼',
        type: 'slot_modifier',
        effect: (state) => {} // Логика в skript.js deposit
    },
    {
        id: 'middle_man',
        name: 'Центральный элемент',
        desc: 'Символ в центре поля (2-й ряд, 3-я колонка) с шансом 50% становится 💎, 💰 или 7️⃣.',
        emoji: '📍',
        type: 'slot_modifier',
        effect: (state) => {} // Логика в skript.js generateGrid
    },
    {
        id: 'anticipation',
        name: 'Предвкушение',
        desc: 'Каждый раз, когда предмет с "шансом удачи" НЕ срабатывает, вы получаете +1💰 × номер цикла.',
        emoji: '⏳',
        type: 'item_mod',
        effect: (state) => {} // Логика в skript.js processLuckChanceItems
    },
    {
        id: 'almost_there',
        name: 'Почти получилось',
        desc: 'Все выигрышные линии из 4 символов получают дополнительный множитель +1.',
        emoji: '🤏',
        type: 'slot_modifier',
        effect: (state) => {} // Логика в skript.js calculateWinnings
    },
    {
        id: 'debt_forgiveness',
        name: 'Прощение долга',
        desc: 'Снижает целевую сумму долга для СЛЕДУЮЩЕГО Цикла на 10%.', // Описание изменено для ясности
        emoji: '📜',
        type: 'one_time',
        effect: (state) => { state.flags = {...state.flags, nextDebtReduced: true }; }
    },
    {
        id: 'prosperity_clover',
        name: 'Процветание',
        desc: 'Каждый символ Монет 💰 на поле увеличивает выигрыш с линий Клевера 🍀 на +2💰.',
        emoji: '🤑',
        type: 'item_mod',
        effect: (state) => {} // Логика в skript.js calculateWinnings
    },
    {
        id: 'maintenance',
        name: 'Техническое обслуживание',
        desc: 'В начале раунда есть 25% шанс восстановить 1 использование для каждого "ломающегося" амулета.',
        emoji: '🛠️',
        type: 'item_mod',
        effect: (state) => {} // Логика в skript.js startTurn
    },
    {
        id: 'inventory_plus_one',
        name: 'Портфель коллекционера',
        desc: 'Максимальный размер инвентаря увеличен на 1 (до 10 амулетов).',
        emoji: '🧳',
        type: 'slot_modifier',
        effect: (state) => {} // Логика в skript.js
    },
    {
        id: 'phoenix_passive',
        name: 'Феникс',
        desc: 'Когда один из ваших предметов ломается, вы получаете +5 к удаче и +10💰 × номер цикла.',
        emoji: '🔥',
        type: 'item_mod',
        effect: (state) => { /* Логика реализуется в skript.js при поломке предмета */ }
    }
];

// --- ВЫБОР 3 СЛУЧАЙНЫХ ПАССИВОК ---
// Пассивка, которую игрок только что использовал, не будет предложена в следующем выборе.
function getRandomPassives(count = 3, excludeIds = []) {
    const available = ALL_PASSIVES.filter(p => !excludeIds.includes(p.id));
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

// --- ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ ДЛЯ ОТЛАДКИ ПАССИВОК ---
function debugLogPassive(message) {
    if (window.DEBUG_PASSIVES) {
        console.log('[PASSIVE DEBUG]', message);
    }
}

// --- ПРИМЕНЕНИЕ ВЫБРАННОЙ ПАССИВКИ ---
function applyPassive(passive, state) {
    if (!state.activePassives) state.activePassives = [];
    if (passive && typeof passive.effect === 'function') {
        // Проверка на стакаемость
        const alreadyActive = state.activePassives.find(p => p.id === passive.id);
        if (alreadyActive) {
            debugLogPassive(`Пассивка ${passive.name} (${passive.id}) уже активна!`);
        } else {
            state.activePassives.push(passive);
            debugLogPassive(`Пассивка ${passive.name} (${passive.id}) активирована.`);
            passive.effect(state);
        }
        // После любого выбора пассивки — обновляем веса и статистику
        if (typeof window.updateWeightedSymbols === 'function') window.updateWeightedSymbols();
        if (typeof window.populateStats === 'function') window.populateStats();
    }
}

// --- ОТОБРАЖЕНИЕ АКТИВНЫХ ПАССИВОК ---
function showActivePassives(state) {
    if (!state.activePassives || state.activePassives.length === 0) {
        console.log('Нет активных пассивок.');
        return;
    }
    console.log('Активные пассивки:');
    state.activePassives.forEach(p => {
        console.log(`- ${p.name} (${p.id}): ${p.desc}`);
    });
}

// --- ЭКСПОРТ ДЛЯ ИМПОРТА В ОСНОВНОЙ СКРИПТ ---
if (typeof window !== 'undefined') {
    window.ALL_PASSIVES = ALL_PASSIVES;
    window.getRandomPassives = getRandomPassives;
    window.applyPassive = applyPassive;
    window.showActivePassives = showActivePassives;
    window.DEBUG_PASSIVES = true; // Включить режим отладки по умолчанию
}