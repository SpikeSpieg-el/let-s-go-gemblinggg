const ALL_PASSIVES = [
    // ==========================================
    // КАТЕГОРИЯ: ЕЖЕЦИКЛИЧНЫЕ (PER_CYCLE)
    // Срабатывают при выборе И в начале каждого нового цикла
    // ==========================================
    {
        id: 'start_money',
        name: 'Стартовый капитал',
        desc: 'Получайте +20💲 × номер цикла в начале каждого цикла.',
        emoji: '💰',
        type: 'per_cycle',
        effect: (state) => { state.coins += 20 * (state.run || 1); }
    },
    {
        id: 'start_tickets',
        name: 'Поставка талонов',
        desc: 'Получайте +5🎟️ в начале каждого цикла.',
        emoji: '🎟️',
        type: 'per_cycle',
        effect: (state) => { state.tickets += 5; }
    },
    {
        id: 'lucky_start',
        name: 'Удачный старт',
        desc: 'Вы начинаете каждый раунд с +3 к временной удаче.',
        emoji: '🌅',
        type: 'item_mod', // Это обрабатывается внутри startTurn, не меняем тип
        effect: (state) => {} 
    },
    {
        id: 'seasoned_veteran',
        name: 'Опытный ветеран',
        desc: 'В начале каждого нового Цикла вы получаете случайный ОБЫЧНЫЙ амулет.',
        emoji: '🎖️',
        type: 'per_cycle', // Меняем на per_cycle для явной логики, хотя в скрипте была отдельная проверка
        effect: (state) => {
            // Логика перенесена внутрь эффекта для универсальности
            const commonItems = window.ALL_ITEMS.filter(i => i.rarity === 'common' && !window.hasItem(i.id));
            if (commonItems.length > 0) {
                const randomItem = commonItems[Math.floor(Math.random() * commonItems.length)];
                state.inventory.push(randomItem);
                if (typeof window.addLog === 'function') window.addLog(`Опытный ветеран: получен амулет "${randomItem.name}"`, 'win');
            }
        } 
    },

    // ==========================================
    // КАТЕГОРИЯ: РАЗОВЫЕ (ONE_TIME)
    // Срабатывают ТОЛЬКО ОДИН РАЗ при выборе
    // ==========================================
    {
        id: 'deal_with_the_devil',
        name: 'Сделка с дьяволом',
        desc: 'Немедленно получите +33💲 × номер цикла и +3🎟️. Но базовая ставка банка снижается на 3% НАВСЕГДА.',
        emoji: '😈',
        type: 'one_time',
        effect: (state) => { 
            state.coins += 33 * (state.run || 1); 
            state.tickets += 3;
            state.passiveInterestBonus = (state.passiveInterestBonus || 0) - 0.03;
        }
    },
    {
        id: 'interest_spike',
        name: 'Процентный всплеск',
        desc: 'Базовая процентная ставка банка увеличивается на 2% навсегда.',
        emoji: '📈',
        type: 'one_time',
        effect: (state) => { state.passiveInterestBonus = (state.passiveInterestBonus || 0) + 0.02; }
    },
    {
        id: 'frugal_spinner',
        name: 'Экономный игрок',
        desc: 'Стоимость одиночного прокрута снижается с 3💲 до 2💲 навсегда.',
        emoji: '💸',
        type: 'one_time',
        effect: (state) => {} // Логика внутри buySpins
    },
    {
        id: 'bulk_buyer',
        name: 'Оптовый покупатель',
        desc: 'Стоимость пакета "7 прокрутов" снижается на 2💲 навсегда.',
        emoji: '🛒',
        type: 'one_time',
        effect: (state) => { /* Логика внутри updateSpinCosts */ }
    },
    {
        id: 'debt_forgiveness',
        name: 'Прощение долга',
        desc: 'Цель по долгу в СЛЕДУЮЩЕМ Цикле будет снижена на 10%.',
        emoji: '📜',
        type: 'one_time',
        effect: (state) => { state.flags = {...state.flags, nextDebtReduced: true }; }
    },
    {
        id: 'expanded_choice',
        name: 'Расширенный выбор',
        desc: 'В будущем вам будет предложено 4 пассивки на выбор вместо 3.',
        emoji: '🎯',
        type: 'one_time',
        effect: (state) => { state.flags = {...state.flags, expandedPassiveChoice: true }; }
    },
    {
        id: 'inventory_plus_one',
        name: 'Портфель коллекционера',
        desc: 'Максимальный размер инвентаря увеличивается на +1.',
        emoji: '🧳',
        type: 'one_time',
        effect: (state) => {} // Логика внутри getMaxInventorySize
    },
    {
        id: 'vault_insurance_passive',
        name: 'Страхование вклада',
        desc: 'Минимальная процентная ставка банка не опускается ниже 10%.',
        emoji: '🏦',
        type: 'one_time',
        effect: (state) => {} // Логика внутри getMinInterestRate
    },

    // ==========================================
    // КАТЕГОРИЯ: МОДИФИКАТОРЫ СЛОТОВ (SLOT_MODIFIER)
    // Изменяют веса символов
    // ==========================================
    {
        id: 'fruit_less',
        name: 'Горькие фрукты',
        desc: 'Шанс выпадения Лимонов 🍋 и Вишен 🍒 снижен на 25%.',
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
        desc: 'Шанс выпадения Лимонов 🍋 и Вишен 🍒 снижен на 60%.',
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
        desc: 'Шанс выпадения Лимонов 🍋 и Вишен 🍒 увеличен на 20%.',
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
        desc: 'Шанс выпадения Клеверов 🍀 и Колокольчиков 🔔 снижен на 25%.',
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
        desc: 'Шанс выпадения Клеверов 🍀 и Колокольчиков 🔔 снижен на 60%.',
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
        desc: 'Шанс выпадения Клеверов 🍀 и Колокольчиков 🔔 увеличен на 20%.',
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
        desc: 'Шанс выпадения Алмазов 💎 и Монет 💰 снижен на 25%.',
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
        desc: 'Шанс выпадения Алмазов 💎 и Монет 💰 снижен на 60%.',
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
        desc: 'Шанс выпадения Алмазов 💎 и Монет 💰 увеличен на 20%.',
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
        desc: 'Шанс выпадения Семёрок 7️⃣ снижен на 30%.',
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
        desc: 'Шанс выпадения Семёрок 7️⃣ снижен на 60%.',
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
        desc: 'Шанс выпадения Семёрок 7️⃣ увеличен на 25%.',
        emoji: '7️⃣',
        type: 'slot_modifier',
        effect: (state) => {
            const seven = window.SYMBOLS.find(s => s.id === 'seven');
            if (seven) seven.weight = Math.floor(seven.weight * 1.25);
        }
    },
    {
        id: 'middle_man',
        name: 'Центральный элемент',
        desc: 'Центральный символ с шансом 50% заменяется на 💎, 💰 или 7️⃣ перед прокрутом.',
        emoji: '📍',
        type: 'slot_modifier',
        effect: (state) => {} 
    },

    // ==========================================
    // КАТЕГОРИЯ: МОДИФИКАТОРЫ ПРЕДМЕТОВ/ИГРЫ (ITEM_MOD)
    // Проверяются в коде игры через hasPassive()
    // ==========================================
    {
        id: 'bankers_friend',
        name: 'Друг банкира',
        desc: 'Ваш первый депозит в каждом раунде увеличивается на 10% (бесплатно).',
        emoji: '🤝',
        type: 'item_mod',
        effect: (state) => { state.flags = {...state.flags, firstDepositThisRound: true }; }
    },
    {
        id: 'shopaholic',
        name: 'Шопоголик',
        desc: 'Ваша первая покупка амулета в каждом раунде стоит на 2🎟️ дешевле.',
        emoji: '🛍️',
        type: 'item_mod',
        effect: (state) => { state.flags = {...state.flags, firstPurchaseThisRound: true }; }
    },
    {
        id: 'combo_king',
        name: 'Король комбо',
        desc: 'Базовый бонус за каждую линию в комбо увеличен с 25% до 40%.',
        emoji: '👑',
        type: 'item_mod',
        effect: (state) => {} 
    },
    {
        id: 'early_bird',
        name: 'Ранняя пташка',
        desc: 'Бонусы за досрочное погашение долга (монеты и талоны) увеличены на 50%.',
        emoji: '🐦',
        type: 'item_mod',
        effect: (state) => {} 
    },
    {
        id: 'seven_symphony',
        name: 'Симфония семёрок',
        desc: 'Символы 7️⃣ приносят в 1.5 раза больше 💲.',
        emoji: '🎶',
        type: 'item_mod', 
        effect: (state) => {} 
    },
    {
        id: 'reroll_master',
        name: 'Мастер Реролла',
        desc: 'Первый реролл магазина в каждом раунде стоит на 1🎟️ дешевле.',
        emoji: '🧙',
        type: 'item_mod',
        effect: (state) => { state.flags = {...state.flags, firstRerollUsed: false }; }
    },
    {
        id: 'financial_literacy',
        name: 'Финансовая грамотность',
        desc: 'Ваша процентная ставка в банке никогда не опускается ниже 5%.',
        emoji: '🧑‍🏫',
        type: 'item_mod',
        effect: (state) => {} 
    },
    {
        id: 'learning_from_mistakes',
        name: 'Обучение на ошибках',
        desc: 'Каждые 4 проигрышных прокрута подряд дают +2 к Удаче навсегда.',
        emoji: '🧠',
        type: 'item_mod',
        effect: (state) => { state.permanentLuckBonus = (state.permanentLuckBonus || 0); state.flags.consecutiveLosses = 0; }
    },
    {
        id: 'bell_ringer',
        name: 'Звонарь',
        desc: 'Каждый 🔔 на всем поле добавляет +1💲 к выигрышу любой линии из Колокольчиков.',
        emoji: '⛪',
        type: 'item_mod',
        effect: (state) => {} 
    },
    {
        id: 'geologist',
        name: 'Геолог',
        desc: 'Линии типа "Небо" и "Земля" приносят дополнительно +3🎟️.',
        emoji: '🌍',
        type: 'item_mod',
        effect: (state) => {} 
    },
    {
        id: 'calculated_risk',
        name: 'Просчитанный риск',
        desc: 'Если завершить раунд с 0 прокрутов, получите +5💲 × номер цикла.',
        emoji: '🎲',
        type: 'item_mod',
        effect: (state) => {} 
    },
    {
        id: 'chain_reaction',
        name: 'Цепная реакция',
        desc: 'В комбо каждая выигрышная линия имеет 10% шанс дать +1🎟️.',
        emoji: '⛓️',
        type: 'item_mod',
        effect: (state) => {} 
    },
    {
        id: 'diamond_cutter',
        name: 'Огранщик алмазов',
        desc: 'Каждый 💎 в выигрышной линии увеличивает её множитель на +1.',
        emoji: '💍',
        type: 'item_mod',
        effect: (state) => {} 
    },
    {
        id: 'beginners_luck_passive',
        name: 'Удача новичка',
        desc: 'Ваш первый прокрут в каждом раунде получает +10 к Удаче.',
        emoji: '🎯',
        type: 'item_mod',
        effect: (state) => { state.flags = {...state.flags, isFirstSpinOfRound: true }; }
    },
    {
        id: 'barterer',
        name: 'Специалист по бартеру',
        desc: 'Все амулеты в магазине стоимостью 5🎟️ и выше продаются на 1🎟️ дешевле.',
        emoji: '🗣️',
        type: 'item_mod',
        effect: (state) => {} 
    },
    {
        id: 'major_investor',
        name: 'Крупный инвестор',
        desc: 'Депозит в банк на сумму 100💲 и более дает +1🎟️.',
        emoji: '💼',
        type: 'item_mod',
        effect: (state) => {} 
    },
    {
        id: 'anticipation',
        name: 'Предвкушение',
        desc: 'Если предмет с "шансом срабатывания" НЕ сработал, вы получаете +1💲.',
        emoji: '⏳',
        type: 'item_mod',
        effect: (state) => {} 
    },
    {
        id: 'almost_there',
        name: 'Почти получилось',
        desc: 'Выигрышные линии длиной 4 получают +1 к множителю.',
        emoji: '🤏',
        type: 'item_mod',
        effect: (state) => {} 
    },
    {
        id: 'prosperity_clover',
        name: 'Процветание',
        desc: 'Каждый символ 💰 на поле увеличивает выигрыш линий Клевера 🍀 на +2💲.',
        emoji: '🤑',
        type: 'item_mod',
        effect: (state) => {} 
    },
    {
        id: 'maintenance',
        name: 'Техническое обслуживание',
        desc: 'В начале раунда: 25% шанс восстановить 1 использование каждому ломающемуся предмету.',
        emoji: '🛠️',
        type: 'item_mod',
        effect: (state) => {} 
    },
    {
        id: 'phoenix_passive',
        name: 'Феникс',
        desc: 'При поломке предмета вы получаете +5 удачи и +10💲 × номер цикла.',
        emoji: '🔥',
        type: 'item_mod',
        effect: (state) => {} 
    },
    {
        id: 'modification_master',
        name: 'Мастер модификаций',
        desc: 'Модифицированные предметы в магазине больше не имеют наценки в стоимости.',
        emoji: '⚡',
        type: 'item_mod',
        effect: (state) => {} 
    },
    {
        id: 'clover_bonus',
        name: 'Клеверный бонус',
        desc: 'При любом выигрыше каждый 🍀 на поле дает +1💲.',
        emoji: '☘️',
        type: 'item_mod',
        effect: (state) => {} 
    },
    {
        id: 'wilder_clover',
        name: 'Дичайший клевер',
        desc: 'Если есть "Дикий Клевер", каждый 🍀 дополнительно дает +1💲 при выигрыше.',
        emoji: '🃏',
        type: 'item_mod',
        effect: (state) => {} 
    },
    {
        id: 'cherry_luck',
        name: 'Вишнёвая удача',
        desc: 'Каждая 🍒 накапливает +1 удачи для следующего прокрута.',
        emoji: '🍒',
        type: 'item_mod',
        effect: (state) => {} 
    },
    {
        id: 'lucky_bomb',
        name: 'Счастливая бомба',
        desc: 'Если есть "Вишневая бомба", линии из вишен дают +1🎟️.',
        emoji: '💣',
        type: 'item_mod',
        effect: (state) => {} 
    },
    {
        id: 'sticky_fingers_plus',
        name: 'Ловкие пальцы',
        desc: 'Усиливает "Липкие пальцы": бонус за линию из 3-х символов +1💲.',
        emoji: '🖖',
        type: 'item_mod',
        effect: (state) => {} 
    },
    {
        id: 'golden_touch',
        name: 'Золотое касание',
        desc: 'Если есть "Золотой Лимон", множитель 🍋 увеличен на +1.',
        emoji: '👆',
        type: 'item_mod',
        effect: (state) => {} 
    },
    {
        id: 'ritualist_focus',
        name: 'Фокус ритуалиста',
        desc: '"Кровавый Ритуал": стоимость -1💲, бонус удачи +2.',
        emoji: '🩸',
        type: 'item_mod',
        effect: (state) => {} 
    },
    {
        id: 'gamblers_delight',
        name: 'Азартный восторг',
        desc: 'Шанс срабатывания "Дублона" удвоен.',
        emoji: '🏴‍☠️',
        type: 'item_mod',
        effect: (state) => {} 
    },
    {
        id: 'watchmaker_precision',
        name: 'Точность часовщика',
        desc: '"Карманные часы" имеют 50% шанс дать +2 прокрута вместо +1.',
        emoji: '🕰️',
        type: 'item_mod',
        effect: (state) => {} 
    },
    {
        id: 'ticket_liquidator',
        name: 'Ликвидатор талонов',
        desc: 'В начале раунда можно обменять до 5 талонов на монеты (1 к 1).',
        emoji: '♻️',
        type: 'item_mod',
        effect: (state) => {} 
    }
];

// --- ВЫБОР 3 СЛУЧАЙНЫХ ПАССИВОК ---
function getRandomPassives(count = 3, excludeIds = [], state = null) {
    let available = ALL_PASSIVES.filter(p => !excludeIds.includes(p.id));
    
    if (state && state.activePassives) {
        const activePassiveIds = state.activePassives.map(p => p.id);
        const secondLevelDependencies = {
            'fruit_less2': 'fruit_less',
            'lucky_less2': 'lucky_less', 
            'premium_less2': 'premium_less',
            'seven_less2': 'seven_less'
        };
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

// --- ПРИМЕНЕНИЕ ВЫБРАННОЙ ПАССИВКИ ---
function applyPassive(passive, state) {
    if (!state.activePassives) state.activePassives = [];
    if (passive && typeof passive.effect === 'function') {
        const alreadyActive = state.activePassives.find(p => p.id === passive.id);
        if (alreadyActive) {
            console.log(`Пассивка ${passive.name} уже активна!`);
        } else {
            state.activePassives.push(passive);
            
            // Запускаем эффект немедленно при выборе (для one_time, per_cycle и флагов)
            // Это гарантирует, что "Сделка с дьяволом" или "Стартовые талоны" сработают сразу
            if (passive.type === 'one_time' || passive.type === 'per_cycle' || passive.type === 'item_mod') {
                passive.effect(state);
            }
            
            // Логика "Мастер модификаций": обновление цен в магазине
            if (passive.id === 'modification_master' && state.shop && state.shop.length > 0) {
                let updatedCount = 0;
                state.shop.forEach(item => {
                    if (item.modifier) {
                        const originalCost = Math.ceil(item.cost / 1.2);
                        if (item.cost !== originalCost) {
                            item.cost = originalCost;
                            updatedCount++;
                        }
                    }
                });
                if (updatedCount > 0 && typeof window.renderShop === 'function') {
                    window.renderShop();
                }
            }
        }
        if (typeof window.updateWeightedSymbols === 'function') window.updateWeightedSymbols();
        if (typeof window.populateStats === 'function') window.populateStats();
    }
}

function showActivePassives(state) {
    if (!state.activePassives || state.activePassives.length === 0) return;
    console.log('Активные пассивки:', state.activePassives.map(p => p.name).join(', '));
}

if (typeof window !== 'undefined') {
    window.ALL_PASSIVES = ALL_PASSIVES;
    window.getRandomPassives = getRandomPassives;
    window.applyPassive = applyPassive;
    window.showActivePassives = showActivePassives;
    window.DEBUG_PASSIVES = true;
}