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