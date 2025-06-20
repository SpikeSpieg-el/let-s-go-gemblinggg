const ALL_PASSIVES = [
    // --- Разовые бафы ---
    {
        id: 'start_money',
        name: 'Стартовый капитал',
        desc: 'Получите +20💰 в начале игры.',
        emoji: '💰',
        type: 'one_time',
        effect: (state) => { state.coins += 20; }
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
    // --- НОВЫЕ ПАССИВКИ (20 штук) ---

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
    }
];

// --- ВЫБОР 3 СЛУЧАЙНЫХ ПАССИВОК ---
function getRandomPassives(count = 3) {
    const shuffled = [...ALL_PASSIVES].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

// --- ПРИМЕНЕНИЕ ВЫБРАННОЙ ПАССИВКИ ---
function applyPassive(passive, state) {
    if (passive && typeof passive.effect === 'function') {
        passive.effect(state);
    }
}

// --- ЭКСПОРТ ДЛЯ ИМПОРТА В ОСНОВНОЙ СКРИПТ ---
if (typeof window !== 'undefined') {
    window.ALL_PASSIVES = ALL_PASSIVES;
    window.getRandomPassives = getRandomPassives;
    window.applyPassive = applyPassive;
}