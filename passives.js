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
    // --- Слот-эффекты (объединённые пары) ---
    {
        id: 'fruit_less',
        name: 'Горькие фрукты',
        desc: 'Лимоны 🍋 и Вишни 🍒 выпадают реже.',
        emoji: '🍋🍒',
        type: 'slot_modifier',
        effect: (state) => {
            const lemon = window.SYMBOLS.find(s => s.id === 'lemon');
            const cherry = window.SYMBOLS.find(s => s.id === 'cherry');
            if (lemon) lemon.weight = Math.floor(lemon.weight * 0.75);
            if (cherry) cherry.weight = Math.floor(cherry.weight * 0.75);
        }
    },
    {
        id: 'fruit_less2',
        name: 'Забытые фрукты',
        desc: 'Лимоны 🍋 и Вишни 🍒 выпадают сильно реже.',
        emoji: '🍋🍒',
        type: 'slot_modifier',
        effect: (state) => {
            const lemon = window.SYMBOLS.find(s => s.id === 'lemon');
            const cherry = window.SYMBOLS.find(s => s.id === 'cherry');
            if (lemon) lemon.weight = Math.floor(lemon.weight * 0.4);
            if (cherry) cherry.weight = Math.floor(cherry.weight * 0.4);
        }
    },
    {
        id: 'fruit_more',
        name: 'Фруктовая удача',
        desc: 'Лимоны 🍋 и Вишни 🍒 выпадают чаще.',
        emoji: '🍋🍒',
        type: 'slot_modifier',
        effect: (state) => {
            const lemon = window.SYMBOLS.find(s => s.id === 'lemon');
            const cherry = window.SYMBOLS.find(s => s.id === 'cherry');
            if (lemon) lemon.weight = Math.floor(lemon.weight * 1.2);
            if (cherry) cherry.weight = Math.floor(cherry.weight * 1.2);
        }
    },
    {
        id: 'lucky_less',
        name: 'Неудачливые символы',
        desc: 'Клеверы 🍀 и Колокольчики 🔔 выпадают реже.',
        emoji: '🍀🔔',
        type: 'slot_modifier',
        effect: (state) => {
            const clover = window.SYMBOLS.find(s => s.id === 'clover');
            const bell = window.SYMBOLS.find(s => s.id === 'bell');
            if (clover) clover.weight = Math.floor(clover.weight * 0.75);
            if (bell) bell.weight = Math.floor(bell.weight * 0.75);
        }
    },
    {
        id: 'lucky_less2',
        name: 'Проклятые символы',
        desc: 'Клеверы 🍀 и Колокольчики 🔔 выпадают сильно реже.',
        emoji: '🍀🔔',
        type: 'slot_modifier',
        effect: (state) => {
            const clover = window.SYMBOLS.find(s => s.id === 'clover');
            const bell = window.SYMBOLS.find(s => s.id === 'bell');
            if (clover) clover.weight = Math.floor(clover.weight * 0.4);
            if (bell) bell.weight = Math.floor(bell.weight * 0.4);
        }
    },
    {
        id: 'lucky_more',
        name: 'Удачливые символы',
        desc: 'Клеверы 🍀 и Колокольчики 🔔 выпадают чаще.',
        emoji: '🍀🔔',
        type: 'slot_modifier',
        effect: (state) => {
            const clover = window.SYMBOLS.find(s => s.id === 'clover');
            const bell = window.SYMBOLS.find(s => s.id === 'bell');
            if (clover) clover.weight = Math.floor(clover.weight * 1.2);
            if (bell) bell.weight = Math.floor(bell.weight * 1.2);
        }
    },
    {
        id: 'premium_less',
        name: 'Тусклые драгоценности',
        desc: 'Алмазы 💎 и Монеты 💰 выпадают реже.',
        emoji: '💎💰',
        type: 'slot_modifier',
        effect: (state) => {
            const diamond = window.SYMBOLS.find(s => s.id === 'diamond');
            const coins = window.SYMBOLS.find(s => s.id === 'coins');
            if (diamond) diamond.weight = Math.floor(diamond.weight * 0.75);
            if (coins) coins.weight = Math.floor(coins.weight * 0.75);
        }
    },
    {
        id: 'premium_less2',
        name: 'Потухшие драгоценности',
        desc: 'Алмазы 💎 и Монеты 💰 выпадают сильно реже.',
        emoji: '💎💰',
        type: 'slot_modifier',
        effect: (state) => {
            const diamond = window.SYMBOLS.find(s => s.id === 'diamond');
            const coins = window.SYMBOLS.find(s => s.id === 'coins');
            if (diamond) diamond.weight = Math.floor(diamond.weight * 0.4);
            if (coins) coins.weight = Math.floor(coins.weight * 0.4);
        }
    },
    {
        id: 'premium_more',
        name: 'Сверкающие драгоценности',
        desc: 'Алмазы 💎 и Монеты 💰 выпадают чаще.',
        emoji: '💎💰',
        type: 'slot_modifier',
        effect: (state) => {
            const diamond = window.SYMBOLS.find(s => s.id === 'diamond');
            const coins = window.SYMBOLS.find(s => s.id === 'coins');
            if (diamond) diamond.weight = Math.floor(diamond.weight * 1.2);
            if (coins) coins.weight = Math.floor(coins.weight * 1.2);
        }
    },
    {
        id: 'seven_less',
        name: 'Потерянная семёрка',
        desc: 'Семёрки 7️⃣ выпадают реже.',
        emoji: '7️⃣',
        type: 'slot_modifier',
        effect: (state) => {
            const seven = window.SYMBOLS.find(s => s.id === 'seven');
            if (seven) seven.weight = Math.floor(seven.weight * 0.7);
        }
    },
    {
        id: 'seven_less2',
        name: 'Забытая семёрка',
        desc: 'Семёрки 7️⃣ выпадают сильно реже.',
        emoji: '7️⃣',
        type: 'slot_modifier',
        effect: (state) => {
            const seven = window.SYMBOLS.find(s => s.id === 'seven');
            if (seven) seven.weight = Math.floor(seven.weight * 0.4);
        }
    },
    {
        id: 'seven_more',
        name: 'Семёрочная удача',
        desc: 'Семёрки 7️⃣ выпадают чаще.',
        emoji: '7️⃣',
        type: 'slot_modifier',
        effect: (state) => {
            const seven = window.SYMBOLS.find(s => s.id === 'seven');
            if (seven) seven.weight = Math.floor(seven.weight * 1.25);
        }
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
        id: 'learning_from_mistakes',
        name: 'Обучение на ошибках',
        desc: 'Каждые 4 проигрышных прокрута подряд перманентно увеличивают вашу Удачу на 2.',
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
        desc: 'Стоимость покупки "7 прокрутов" перманентно снижена на 15%.',
        emoji: '🛒',
        type: 'one_time',
        effect: (state) => { CONFIG.SPIN_PACKAGE_1.cost = Math.max(1, Math.floor(CONFIG.SPIN_PACKAGE_1.base_cost * 0.85)); }
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
        id: 'expanded_choice',
        name: 'Расширенный выбор',
        desc: 'При выборе пассивок вам будет предложено 4 варианта вместо 3.',
        emoji: '🎯',
        type: 'slot_modifier',
        effect: (state) => { state.flags = {...state.flags, expandedPassiveChoice: true }; }
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
    },
    {
        id: 'modification_master',
        name: 'Мастер модификаций',
        desc: 'Предметы с модификаторами больше не получают штраф увеличения стоимости (+20%).',
        emoji: '⚡',
        type: 'item_mod',
        effect: (state) => { /* Логика реализуется в items.js addRandomModifier */ }
    }
];

// --- ВЫБОР 3 СЛУЧАЙНЫХ ПАССИВОК ---
// Пассивка, которую игрок только что использовал, не будет предложена в следующем выборе.
// Пассивки второго уровня появляются только после получения пассивки первого уровня той же категории.
function getRandomPassives(count = 3, excludeIds = [], state = null) {
    let available = ALL_PASSIVES.filter(p => !excludeIds.includes(p.id));
    
    // Если передан state, проверяем зависимости пассивок второго уровня
    if (state && state.activePassives) {
        const activePassiveIds = state.activePassives.map(p => p.id);
        
        // Определяем пассивки второго уровня и их зависимости
        const secondLevelDependencies = {
            'fruit_less2': 'fruit_less',
            'lucky_less2': 'lucky_less', 
            'premium_less2': 'premium_less',
            'seven_less2': 'seven_less'
        };
        
        // Фильтруем пассивки второго уровня, если не получена зависимость
        available = available.filter(passive => {
            if (secondLevelDependencies[passive.id]) {
                return activePassiveIds.includes(secondLevelDependencies[passive.id]);
            }
            return true;
        });
    }
    
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
            
            // --- ОСОБАЯ ЛОГИКА ДЛЯ ПАССИВКИ "МАСТЕР МОДИФИКАЦИЙ" ---
            if (passive.id === 'modification_master') {
                // Обновляем цены в текущем магазине
                if (state.shop && state.shop.length > 0) {
                    let updatedCount = 0;
                    state.shop.forEach(item => {
                        if (item.modifier) {
                            // Восстанавливаем оригинальную стоимость (убираем штраф +20%)
                            const originalCost = Math.ceil(item.cost / 1.2);
                            if (item.cost !== originalCost) {
                                item.cost = originalCost;
                                updatedCount++;
                            }
                        }
                    });
                    
                    if (updatedCount > 0) {
                        // Добавляем сообщение в лог
                        if (typeof window.addLog === 'function') {
                            window.addLog(`⚡ Мастер модификаций: цены ${updatedCount} модифицированных предметов обновлены!`, 'win');
                        }
                        
                        // Обновляем UI магазина
                        if (typeof window.renderShop === 'function') {
                            window.renderShop();
                        }
                        if (typeof window.renderPlanningShop === 'function') {
                            window.renderPlanningShop();
                        }
                    }
                }
            }
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