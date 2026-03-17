// ==========================================
// BOSS BATTLE SYSTEM
// ==========================================

const ALL_BOSSES = [
    {
        id: 'cherry_nemesis',
        name: 'Вишнёвый Немезис',
        emoji: '🍒😈',
        description: 'Подавляет вишнёвые стратегии',
        targetStrategy: 'cherry',
        effect: (state) => {
            // Ослабляем вишни - уменьшаем базовую ценность на 30%
            const cherry = window.SYMBOLS.find(s => s.id === 'cherry');
            if (cherry) {
                const originalWeight = cherry.weight;
                cherry.weight = Math.floor(originalWeight * 0.7); // Уменьшаем шанс выпадения
                window.addLog(`Вишнёвый Немезис: шанс выпадения вишен снижен на 30%!`, 'danger');
            }
        }
    },
    {
        id: 'lemon_destroyer',
        name: 'Лимонный Разрушитель',
        emoji: '🍋💀',
        description: 'Уничтожает лимонные стратегии',
        targetStrategy: 'lemon',
        effect: (state) => {
            const lemon = window.SYMBOLS.find(s => s.id === 'lemon');
            if (lemon) {
                const originalWeight = lemon.weight;
                lemon.weight = Math.floor(originalWeight * 0.7);
                window.addLog(`Лимонный Разрушитель: шанс выпадения лимонов снижен на 30%!`, 'danger');
            }
        }
    },
    {
        id: 'clover_curse',
        name: 'Клеверное Проклятие',
        emoji: '🍀👻',
        description: 'Проклинает клеверные стратегии',
        targetStrategy: 'clover',
        effect: (state) => {
            const clover = window.SYMBOLS.find(s => s.id === 'clover');
            if (clover) {
                const originalWeight = clover.weight;
                clover.weight = Math.floor(originalWeight * 0.7);
                window.addLog(`Клеверное Проклятие: шанс выпадения клеверов снижен на 30%!`, 'danger');
            }
        }
    },
    {
        id: 'bell_bane',
        name: 'Колокольная Погибель',
        emoji: '🔔⚰️',
        description: 'Подавляет колокольные стратегии',
        targetStrategy: 'bell',
        effect: (state) => {
            const bell = window.SYMBOLS.find(s => s.id === 'bell');
            if (bell) {
                const originalWeight = bell.weight;
                bell.weight = Math.floor(originalWeight * 0.7);
                window.addLog(`Колокольная Погибель: шанс выпадения колокольчиков снижен на 30%!`, 'danger');
            }
        }
    },
    {
        id: 'diamond_doom',
        name: 'Алмазная Гибель',
        emoji: '💎☠️',
        description: 'Уничтожает алмазные стратегии',
        targetStrategy: 'diamond',
        effect: (state) => {
            const diamond = window.SYMBOLS.find(s => s.id === 'diamond');
            if (diamond) {
                const originalWeight = diamond.weight;
                diamond.weight = Math.floor(originalWeight * 0.7);
                window.addLog(`Алмазная Гибель: шанс выпадения алмазов снижен на 30%!`, 'danger');
            }
        }
    },
    {
        id: 'seven_slayer',
        name: 'Семёрочный Убийца',
        emoji: '7️⃣🗡️',
        description: 'Охотится на семёрки',
        targetStrategy: 'seven',
        effect: (state) => {
            const seven = window.SYMBOLS.find(s => s.id === 'seven');
            if (seven) {
                const originalWeight = seven.weight;
                seven.weight = Math.floor(originalWeight * 0.7);
                window.addLog(`Семёрочный Убийца: шанс выпадения семёрок снижен на 30%!`, 'danger');
            }
        }
    },
    {
        id: 'coins_thief',
        name: 'Монетный Вор',
        emoji: '💰🦹',
        description: 'Крадёт монетные стратегии',
        targetStrategy: 'coins',
        effect: (state) => {
            const coins = window.SYMBOLS.find(s => s.id === 'coins');
            if (coins) {
                const originalWeight = coins.weight;
                coins.weight = Math.floor(originalWeight * 0.7);
                window.addLog(`Монетный Вор: шанс выпадения монет снижен на 30%!`, 'danger');
            }
        }
    },
    {
        id: 'void_boss',
        name: 'Пустота',
        emoji: '🌑👁️',
        description: 'Универсальный босс без специализации',
        targetStrategy: 'none',
        effect: (state) => {
            // Не ослабляет ничего, просто сложный босс
            window.addLog(`Пустота: босс не имеет специализации!`, 'danger');
        }
    }
];

// Определяет доминирующую стратегию игрока на основе предметов
function determinePlayerStrategy(state) {
    const inventory = state.inventory || [];
    
    // Подсчитываем "очки" для каждой стратегии
    const strategyScores = {
        cherry: 0,
        lemon: 0,
        clover: 0,
        bell: 0,
        diamond: 0,
        seven: 0,
        coins: 0
    };
    
    // Предметы для каждой стратегии
    const strategyItems = {
        cherry: ['cherry_bomb', 'lucky_cherry', 'cherry_catalyst', 'gardening_shears', 'wild_cherry', 'royal_cherry_upgrade', 'cherry_value_engine', 'golden_cherry_polish'],
        lemon: ['golden_lemon', 'golden_lemon_polish', 'lemon_zest'],
        clover: ['wild_clover', 'golden_clover_polish'],
        bell: ['silver_bell', 'shiny_bell', 'golden_bell_polish', 'ringing_luck'],
        diamond: ['shiny_rock', 'golden_diamond_polish'],
        seven: ['lucky_seven_bonus', 'golden_seven_polish', 'sevens_pact'],
        coins: ['money_magnet', 'golden_coins_polish']
    };
    
    inventory.forEach(item => {
        Object.keys(strategyItems).forEach(strategy => {
            if (strategyItems[strategy].includes(item.id)) {
                strategyScores[strategy] += 2; // +2 за каждый предмет стратегии
            }
        });
        
        // Дополнительные очки за множители значений
        if (item.effect?.symbol_value_multiplier) {
            const symbol = item.effect.symbol_value_multiplier.symbol;
            if (strategyScores[symbol] !== undefined) {
                strategyScores[symbol] += 3; // +3 за множители
            }
        }
        
        // Дополнительные очки за увеличение базового значения
        if (item.effect?.base_value_increase) {
            item.effect.base_value_increase.symbols.forEach(sym => {
                if (strategyScores[sym] !== undefined) {
                    strategyScores[sym] += 2;
                }
            });
        }
    });
    
    // Находим стратегию с наибольшим счетом
    let maxStrategy = 'none';
    let maxScore = 0;
    
    Object.keys(strategyScores).forEach(strategy => {
        if (strategyScores[strategy] > maxScore) {
            maxScore = strategyScores[strategy];
            maxStrategy = strategy;
        }
    });
    
    // Если нет явной стратегии (счет < 2), возвращаем 'none'
    return maxScore >= 2 ? maxStrategy : 'none';
}

// Выбирает босса на основе стратегии игрока
function selectBossForPlayer(state) {
    const playerStrategy = determinePlayerStrategy(state);
    
    if (playerStrategy === 'none') {
        // Если нет явной стратегии, выбираем случайного босса
        const randomIndex = Math.floor(Math.random() * ALL_BOSSES.length);
        return ALL_BOSSES[randomIndex];
    }
    
    // Находим босса, который контрит стратегию игрока
    const counterBoss = ALL_BOSSES.find(boss => boss.targetStrategy === playerStrategy);
    
    if (counterBoss) {
        return counterBoss;
    }
    
    // Если не нашли контр-босса, выбираем случайного
    const randomIndex = Math.floor(Math.random() * ALL_BOSSES.length);
    return ALL_BOSSES[randomIndex];
}

// Вычисляет цель долга для босса (в 1.3 раза меньше следующего цикла)
function calculateBossDebtTarget(cycle) {
    // Следующий цикл после босса
    const nextCycle = cycle + 1;
    
    // Получаем цель следующего цикла
    let nextCycleDebt;
    if (nextCycle === 2) nextCycleDebt = 111;
    else if (nextCycle === 3) nextCycleDebt = 450;
    else if (nextCycle === 4) nextCycleDebt = 1999;
    else if (nextCycle === 5) nextCycleDebt = 3333;
    else if (nextCycle === 6) nextCycleDebt = 8888;
    else nextCycleDebt = Math.min(Math.floor(nextCycleDebt * 2.5 + 10000), 88888888);
    
    // Делим на 1.3
    return Math.floor(nextCycleDebt / 1.3);
}

// Проверяет, должен ли начаться босс (каждый 3-й цикл)
function isBossBattle(cycle) {
    return cycle % 3 === 0 && cycle > 0;
}

// Экспортируем функции
if (typeof window !== 'undefined') {
    window.ALL_BOSSES = ALL_BOSSES;
    window.determinePlayerStrategy = determinePlayerStrategy;
    window.selectBossForPlayer = selectBossForPlayer;
    window.calculateBossDebtTarget = calculateBossDebtTarget;
    window.isBossBattle = isBossBattle;
}
