document.addEventListener('DOMContentLoaded', () => {
    const ui = {
        slotMachine: document.getElementById('slot-machine'),
        lever: document.getElementById('lever'),
        spinsLeft: document.getElementById('spins-left'),
        logPanel: document.getElementById('log-panel'),
        statRun: document.getElementById('stat-run'),
        statTurn: document.getElementById('stat-turn'),
        statCoins: document.getElementById('stat-coins'),
        statTickets: document.getElementById('stat-tickets'),
        statLuck: document.getElementById('stat-luck'),
        statDebt: document.getElementById('stat-debt'),
        bankBalance: document.getElementById('bank-balance'),
        atmInterestRate: document.getElementById('atm-interest-rate'),
        depositAmountInput: document.getElementById('deposit-amount'),
        btnDeposit: document.getElementById('btn-deposit'),
        shopItems: document.getElementById('shop-items'),
        btnRerollShop: document.getElementById('btn-reroll-shop'),
        inventoryItems: document.getElementById('inventory-items'),
        btnEndTurn: document.getElementById('btn-end-turn'),
        startScreen: document.getElementById('start-screen'),
        gameOverScreen: document.getElementById('game-over-screen'),
        spinPurchaseModal: document.getElementById('spin-purchase-modal'),
        purchaseModalTitle: document.getElementById('purchase-modal-title'),
        purchaseModalCoins: document.getElementById('purchase-modal-coins'),
        btnBuySpins7: document.getElementById('buy-spins-7'),
        btnBuySpins3: document.getElementById('buy-spins-3'),
        btnBuyNothing: document.getElementById('buy-nothing'),
        btnPlanning: document.getElementById('btn-planning'),
        planningModal: document.getElementById('planning-modal'),
        planningShopItems: document.getElementById('planning-shop-items'),
        planningInventoryItems: document.getElementById('planning-inventory-items'),
        planningTickets: document.getElementById('planning-tickets'),
        btnPlanningReroll: document.getElementById('btn-planning-reroll'),
        btnFinishPlanning: document.getElementById('btn-finish-planning'),
        judgementModal: document.getElementById('judgement-modal'),
        judgementTitle: document.getElementById('judgement-title'),
        judgementText: document.getElementById('judgement-text'),
        judgementContinue: document.getElementById('judgement-continue'),
        finalRun: document.getElementById('final-run'),
        btnStartGame: document.getElementById('btn-start-game'),
        btnRestartGame: document.getElementById('btn-restart-game'),
        endOfRoundModal: document.getElementById('end-of-round-modal'),
        eorTitle: document.getElementById('eor-title'),
        eorCoins: document.getElementById('eor-coins'),
        eorBank: document.getElementById('eor-bank'),
        eorDepositAmount: document.getElementById('eor-deposit-amount'),
        btnEorDeposit: document.getElementById('btn-eor-deposit'),
        btnConfirmEndTurn: document.getElementById('btn-confirm-end-turn'),
    };

    const CONFIG = {
        ROWS: 3, COLS: 5, REROLL_COST: 2,
        SPIN_ANIMATION_TIME: 1200, 
        SPIN_PACKAGE_1: { spins: 7, tickets: 1, cost: 10 },
        SPIN_PACKAGE_2: { spins: 3, tickets: 2, cost: 7 },
    };
    const GRAPHICS = {
        lemon: '🍋', cherry: '🍒', clover: '🍀', bell: '🔔', diamond: '💎', coins: '💰', seven: '7️⃣',
    };
    const SYMBOLS = [
        { id: 'lemon',    value: 2, weight: 194, graphic: GRAPHICS.lemon },   // 19.4%
        { id: 'cherry',   value: 2, weight: 194, graphic: GRAPHICS.cherry },  // 19.4%
        { id: 'clover',   value: 3, weight: 149, graphic: GRAPHICS.clover },  // 14.9%
        { id: 'bell',     value: 3, weight: 149, graphic: GRAPHICS.bell },    // 14.9%
        { id: 'diamond',  value: 5, weight: 119, graphic: GRAPHICS.diamond }, // 11.9%
        { id: 'coins',    value: 5, weight: 119, graphic: GRAPHICS.coins },   // 11.9%
        { id: 'seven',    value: 7, weight: 75,  graphic: GRAPHICS.seven },   // 7.5%
    ];
    const PAYLINES = [
        // Scannable lines (will be checked for 3, 4, 5 in a row)
        { name: "Верхняя линия", positions: [0, 1, 2, 3, 4], scannable: true, type: "Горизонтальная" },
        { name: "Средняя линия", positions: [5, 6, 7, 8, 9], scannable: true, type: "Горизонтальная" },
        { name: "Нижняя линия", positions: [10, 11, 12, 13, 14], scannable: true, type: "Горизонтальная" },
        
        // Fixed-pattern lines (must match all positions)
        { name: "Колонка 1", positions: [0, 5, 10], multiplier: 1, type: "Вертикальная" },
        { name: "Колонка 2", positions: [1, 6, 11], multiplier: 1, type: "Вертикальная" },
        { name: "Колонка 3", positions: [2, 7, 12], multiplier: 1, type: "Вертикальная" },
        { name: "Колонка 4", positions: [3, 8, 13], multiplier: 1, type: "Вертикальная" },
        { name: "Колонка 5", positions: [4, 9, 14], multiplier: 1, type: "Вертикальная" },
        { name: "Диагональ ↘", positions: [0, 6, 12], multiplier: 1, type: "Диагональная" },
        { name: "Диагональ ↙", positions: [10, 6, 2], multiplier: 1, type: "Диагональная" },
        { name: "Малая диагональ ↘", positions: [1, 7, 13], multiplier: 1, type: "Диагональная" },
        { name: "Малая диагональ ↙", positions: [11, 7, 3], multiplier: 1, type: "Диагональная" },

        { name: "Заг", positions: [0, 6, 12, 8, 4], multiplier: 4, type: "Зиг-Заг" },
        { name: "Зиг", positions: [10, 6, 2, 8, 14], multiplier: 4, type: "Зиг-Заг" },
        { name: "Ступени вниз", positions: [0, 5, 7, 9, 14], multiplier: 4, type: "Зиг-Заг" },
        { name: "Ступени вверх", positions: [10, 5, 7, 9, 4], multiplier: 4, type: "Зиг-Заг" },
        
        { name: "Небо", positions: [2, 6, 7, 8, 12], multiplier: 7, type: "Небо/Земля" },
        { name: "Земля", positions: [5, 1, 7, 13, 9], multiplier: 7, type: "Небо/Земля" },
    ];
    const ALL_ITEMS = [
        // Common
        { id: 'lucky_clover', name: 'Счастливый клевер', desc: '+1 к удаче.', cost: 3, rarity: 'common', effect: { luck: 1 } },
        { id: 'scrap_metal', name: 'Копилка', desc: 'Каждый проигрышный спин добавляет 1💰 в Копилку. Разбивается в конце раунда.', cost: 4, rarity: 'common', effect: { on_loss_bonus: 1 } },
        { id: 'timepiece', name: 'Карманные часы', desc: 'Дает +1 прокрут в начале каждого раунда.', cost: 6, rarity: 'common', effect: { on_round_start_spins: 1 } },

        // Rare
        { id: 'golden_ticket', name: 'Золотой билет', desc: '+2 к удаче.', cost: 5, rarity: 'rare', effect: { luck: 2 } },
        { id: 'money_magnet', name: 'Денежный магнит', desc: '2 подряд 💰 на линиях дают +3💰 (только за каждую пару, не масштабируется).', cost: 6, rarity: 'rare', on_spin_bonus: (grid) => {
            // Проверяем горизонтали, вертикали и диагонали на наличие ровно двух подряд идущих символов "coins"
            const ROWS = 3, COLS = 5;
            let bonus = 0;
            // Горизонтали
            for (let r = 0; r < ROWS; r++) {
                for (let c = 0; c < COLS - 1; c++) {
                    const i1 = r * COLS + c;
                    const i2 = r * COLS + c + 1;
                    if (grid[i1].id === 'coins' && grid[i2].id === 'coins') bonus += 3;
                }
            }
            // Вертикали
            for (let c = 0; c < COLS; c++) {
                for (let r = 0; r < ROWS - 1; r++) {
                    const i1 = r * COLS + c;
                    const i2 = (r + 1) * COLS + c;
                    if (grid[i1].id === 'coins' && grid[i2].id === 'coins') bonus += 3;
                }
            }
            // Диагонали (↘)
            for (let r = 0; r < ROWS - 1; r++) {
                for (let c = 0; c < COLS - 1; c++) {
                    const i1 = r * COLS + c;
                    const i2 = (r + 1) * COLS + (c + 1);
                    if (grid[i1].id === 'coins' && grid[i2].id === 'coins') bonus += 3;
                }
            }
            // Диагонали (↙)
            for (let r = 0; r < ROWS - 1; r++) {
                for (let c = 1; c < COLS; c++) {
                    const i1 = r * COLS + c;
                    const i2 = (r + 1) * COLS + (c - 1);
                    if (grid[i1].id === 'coins' && grid[i2].id === 'coins') bonus += 3;
                }
            }
            return bonus;
        } },
        { id: 'architect_blueprint', name: 'Чертеж архитектора', desc: 'Горизонтальные и вертикальные линии получают +1 к множителю.', cost: 8, rarity: 'rare', effect: { line_type_multiplier_bonus: { types: ["Горизонтальная", "Вертикальная"], bonus: 1 } } },
        { id: 'cherry_bomb', name: 'Вишневая бомба', desc: 'Линии из Вишен 🍒 дополнительно дают +10💰.', cost: 7, rarity: 'rare', effect: { symbol_win_bonus: { symbol: 'cherry', bonus: 10 } } },
        
        // Legendary
        { id: 'lemon_zest', name: 'Цедра лимона', desc: 'Лимоны 🍋 считаются как Клеверы 🍀 для комбинаций.', cost: 9, rarity: 'legendary', effect: { substitute: { from: 'lemon', to: 'clover' } } },
        { id: 'fortune_charm', name: 'Амулет фортуны', desc: 'Увеличивает ВСЕ денежные выигрыши на 25%.', cost: 10, rarity: 'legendary', effect: { winMultiplier: 1.25 } },
        { id: 'double_down', name: 'Стеклянный Глаз', desc: 'Удваивает множитель для всех 5-символьных линий.', cost: 9, rarity: 'legendary', effect: { line_length_multiplier_bonus: { length: 5, multiplier: 2 } } },
        { id: 'sevens_pact', name: 'Пакт Семёрок', desc: 'Каждая 7️⃣ на поле увеличивает Удачу на 1 до конца раунда.', cost: 12, rarity: 'legendary', effect: { temporary_luck_on_spin: 'seven' } },
        { id: 'all_seeing_eye', name: 'Всевидящее Око', desc: 'Открывает новую линию "Третий Глаз" (x5).', cost: 11, rarity: 'legendary', effect: { add_payline: { name: 'Третий Глаз', positions: [1, 6, 12, 8, 3], multiplier: 5, type: "Секретная" } } }
    ];

    let state = {};
    const weightedSymbols = SYMBOLS.flatMap(s => Array(s.weight).fill(s));
    
    function addLog(message, type = 'normal') {
        const logEntry = document.createElement('p');
        logEntry.textContent = `> ${message}`;
        if (type === 'win') logEntry.style.color = 'var(--highlight-color)';
        if (type === 'loss') logEntry.style.color = 'var(--danger-color)';
        ui.logPanel.insertBefore(logEntry, ui.logPanel.firstChild);
        if (ui.logPanel.children.length > 50) ui.logPanel.removeChild(ui.logPanel.lastChild);
    }

    function hasItem(itemId) { return state.inventory.some(item => item.id === itemId); }

    function getItemEffectValue(effectKey, defaultValue) {
        return state.inventory.reduce((acc, item) => {
            if (item.effect && item.effect[effectKey]) {
                return effectKey.includes('Multiplier') ? acc * item.effect[effectKey] : acc + item.effect[effectKey];
            }
            return acc;
        }, defaultValue);
    }

    function generateGrid() {
        const baseLuck = getItemEffectValue('luck', 0);
        const totalLuck = baseLuck + state.tempLuck;
        let adjustedSymbols = [...SYMBOLS];
        
        if (totalLuck > 0) {
            adjustedSymbols = adjustedSymbols.map(symbol => ({
                ...symbol,
                weight: symbol.weight + Math.floor(symbol.value * totalLuck * 2)
            }));
        }
        
        const adjustedWeightedSymbols = adjustedSymbols.flatMap(s => Array(s.weight).fill(s));
        
        return Array.from({ length: CONFIG.ROWS * CONFIG.COLS }, () => 
            adjustedWeightedSymbols[Math.floor(Math.random() * adjustedWeightedSymbols.length)]
        );
    }

    function calculateWinnings() {
        let grid = [...state.grid];
        let totalWinnings = 0;
        const allWinningPositions = new Set();
        const winningLinesInfo = [];

        // --- 0. ПРЕДВАРИТЕЛЬНЫЕ ЭФФЕКТЫ ---
        state.tempLuck = 0;
        state.inventory.forEach(item => {
            if (item.effect?.temporary_luck_on_spin) {
                const symbolId = item.effect.temporary_luck_on_spin;
                const count = grid.filter(s => s.id === symbolId).length;
                if (count > 0) { state.tempLuck += count; }
            }
        });
        if (state.tempLuck > 0) addLog(`Пакт Семёрок: +${state.tempLuck} к временной удаче.`, 'win');
        updateUI(); 

        const substitutions = state.inventory.filter(item => item.effect?.substitute).map(item => item.effect.substitute);
        if (substitutions.length > 0) {
            let substitutionLogged = false;
            grid = grid.map(symbol => {
                const sub = substitutions.find(s => s.from === symbol.id);
                if (sub) {
                    if(!substitutionLogged) { addLog(`Цедра лимона: 🍋 стали 🍀.`, 'win'); substitutionLogged = true; }
                    return SYMBOLS.find(s_data => s_data.id === sub.to) || symbol;
                }
                return symbol;
            });
        }

        // --- 1. ПРОВЕРКА ЛИНИЙ ВЫПЛАТ ---
        let activePaylines = [...PAYLINES];
        state.inventory.forEach(item => {
            if (item.effect?.add_payline) { activePaylines.push(item.effect.add_payline); }
        });

        activePaylines.forEach(line => {
            const symbolsOnLine = line.positions.map(pos => grid[pos]);

            // *** НОВАЯ ЛОГИКА ДЛЯ SCANNABLE ЛИНИЙ ***
            if (line.scannable) {
                const lengthMultipliers = { 3: 1, 4: 2, 5: 3 };
                let i = 0;
                while (i < symbolsOnLine.length) {
                    const currentSymbol = symbolsOnLine[i];
                    let comboLength = 1;
                    for (let j = i + 1; j < symbolsOnLine.length; j++) {
                        if (symbolsOnLine[j].id === currentSymbol.id) {
                            comboLength++;
                        } else {
                            break;
                        }
                    }

                    if (comboLength >= 3) {
                        let lineMultiplier = lengthMultipliers[comboLength];
                        
                        const typeBonus = state.inventory.filter(item => item.effect?.line_type_multiplier_bonus).reduce((acc, item) => item.effect.line_type_multiplier_bonus.types.some(type => line.type === type) ? acc + item.effect.line_type_multiplier_bonus.bonus : acc, 0);
                        lineMultiplier += typeBonus;
                        
                        const lengthBonus = state.inventory.filter(item => item.effect?.line_length_multiplier_bonus).reduce((acc, item) => (item.effect.line_length_multiplier_bonus.length === comboLength) ? acc * item.effect.line_length_multiplier_bonus.multiplier : acc, 1);
                        lineMultiplier *= lengthBonus;

                        let win = currentSymbol.value * lineMultiplier;

                        const symbolWinBonus = state.inventory.filter(item => item.effect?.symbol_win_bonus).reduce((acc, item) => (item.effect.symbol_win_bonus.symbol === currentSymbol.id) ? acc + item.effect.symbol_win_bonus.bonus : acc, 0);
                        win += symbolWinBonus;
                        
                        const winningPositions = line.positions.slice(i, i + comboLength);
                        winningLinesInfo.push({ name: `${line.name} (x${comboLength})`, symbol: currentSymbol.id, win, positions: winningPositions });
                        totalWinnings += win;
                        winningPositions.forEach(pos => allWinningPositions.add(pos));
                        
                        i += comboLength;
                    } else {
                        i++;
                    }
                }
            } 
            // *** СТАРАЯ ЛОГИКА ДЛЯ ФИКСИРОВАННЫХ ЛИНИЙ ***
            else {
                const firstSymbol = symbolsOnLine[0];
                if (symbolsOnLine.every(s => s.id === firstSymbol.id)) {
                    let lineMultiplier = line.multiplier;
                    const typeBonus = state.inventory.filter(item => item.effect?.line_type_multiplier_bonus).reduce((acc, item) => item.effect.line_type_multiplier_bonus.types.some(type => line.type === type) ? acc + item.effect.line_type_multiplier_bonus.bonus : acc, 0);
                    lineMultiplier += typeBonus;

                    const lengthBonus = state.inventory.filter(item => item.effect?.line_length_multiplier_bonus).reduce((acc, item) => (item.effect.line_length_multiplier_bonus.length === line.positions.length) ? acc * item.effect.line_length_multiplier_bonus.multiplier : acc, 1);
                    lineMultiplier *= lengthBonus;

                    let win = firstSymbol.value * lineMultiplier;
                    
                    const symbolWinBonus = state.inventory.filter(item => item.effect?.symbol_win_bonus).reduce((acc, item) => (item.effect.symbol_win_bonus.symbol === firstSymbol.id) ? acc + item.effect.symbol_win_bonus.bonus : acc, 0);
                    win += symbolWinBonus;

                    totalWinnings += win;
                    winningLinesInfo.push({ name: line.name, symbol: firstSymbol.id, win, positions: line.positions });
                    line.positions.forEach(pos => allWinningPositions.add(pos));
                }
            }
        });

        // --- 2. ПРОВЕРКА СПЕЦИАЛЬНЫХ ПАТТЕРНОВ (без изменений) ---
        const symbolCounts = grid.reduce((acc, s) => { acc[s.id] = (acc[s.id] || 0) + 1; return acc; }, {});
        const [topSymbolId, topCount] = Object.entries(symbolCounts).sort((a,b) => b[1] - a[1])[0] || [null, 0];

        if (topCount === 15) {
            const jackpotWin = SYMBOLS.find(s => s.id === topSymbolId).value * 10 * topCount;
            totalWinnings += jackpotWin;
            addLog(`💥 ДЖЕКПОТ!!! 💥 (${topSymbolId} x15): +${jackpotWin}💰`, 'win');
            for(let i=0; i<15; i++) allWinningPositions.add(i);
        } else if (topCount >= 12 && topCount < 15) {
            const eyeWin = SYMBOLS.find(s => s.id === topSymbolId).value * 8 * topCount;
            totalWinnings += eyeWin;
            addLog(`👁️ ГЛАЗ! 👁️ (${topSymbolId} x${topCount}): +${eyeWin}💰`, 'win');
            grid.forEach((s, i) => { if(s.id === topSymbolId) allWinningPositions.add(i); });
        }

        // --- 3. ПОСТ-БОНУСЫ И ЛОГИРОВАНИЕ ---
        const loggedLines = new Set();
        winningLinesInfo.forEach(info => {
             if (!loggedLines.has(info.name)) {
                addLog(`${info.name} (${GRAPHICS[info.symbol]}): +${info.win}💰`, 'win');
                loggedLines.add(info.name);
             }
        });

        if (winningLinesInfo.length > 1) {
            const comboBonus = Math.floor(totalWinnings * (1 + (winningLinesInfo.length - 1) * 0.25 - 1));
            totalWinnings += comboBonus;
            addLog(`🔥 КОМБО x${winningLinesInfo.length}! Бонус: +${comboBonus}💰`, 'win');
        }

        state.inventory.forEach(item => {
            if (item.on_spin_bonus) {
                const bonus = item.on_spin_bonus(state.grid);
                if (bonus > 0) { totalWinnings += bonus; addLog(`${item.name}: +${bonus}💰`, 'win'); }
            }
        });
        
        const finalMultiplier = getItemEffectValue('winMultiplier', 1);
        if (finalMultiplier > 1 && totalWinnings > 0) {
            const bonus = Math.floor(totalWinnings * (finalMultiplier - 1));
            totalWinnings += bonus;
            addLog(`Амулет Фортуны: +${Math.round((finalMultiplier-1)*100)}% бонус! (+${bonus}💰)`, 'win');
        }

        totalWinnings = Math.floor(totalWinnings);

        if (totalWinnings > 0) {
            state.coins += totalWinnings;
            highlightWinningCells(Array.from(allWinningPositions), totalWinnings);
        } else { 
            addLog('Ничего не выпало.');
            if (hasItem('scrap_metal')) {
                const lossBonus = getItemEffectValue('on_loss_bonus', 0);
                state.piggyBank += lossBonus;
                addLog(`Копилка: +${lossBonus}💰. Всего: ${state.piggyBank}💰`);
            }
        }
    }

    // Остальная часть JS кода остается без изменений...
    
    function highlightWinningCells(positions, winAmount) {
        const cells = ui.slotMachine.querySelectorAll('.slot-cell');
        let highlightClass = 'highlight';
        if (winAmount > 50) highlightClass = 'highlight-huge';
        else if (winAmount > 20) highlightClass = 'highlight-big';
        positions.forEach(pos => cells[pos]?.classList.add(highlightClass));
        setTimeout(() => cells.forEach(cell => cell.classList.remove('highlight', 'highlight-big', 'highlight-huge')), 2000);
    }

    function populateShop() {
        state.shop = [];
        const availableItems = [...ALL_ITEMS].filter(item => !hasItem(item.id));
        // Группируем по редкости
        const commons = availableItems.filter(i => i.rarity === 'common');
        const rares = availableItems.filter(i => i.rarity === 'rare');
        const legendaries = availableItems.filter(i => i.rarity === 'legendary');
        for (let i = 0; i < 3; i++) {
            let pool = [];
            const roll = Math.random();
            if (roll < 0.6 && commons.length > 0) pool = commons;
            else if (roll < 0.9 && rares.length > 0) pool = rares;
            else if (legendaries.length > 0) pool = legendaries;
            else if (commons.length > 0) pool = commons;
            else if (rares.length > 0) pool = rares;
            else if (legendaries.length > 0) pool = legendaries;
            if (pool.length > 0) {
                const randomIndex = Math.floor(Math.random() * pool.length);
                state.shop.push(pool[randomIndex]);
                // Удаляем из всех пулов
                const idx = availableItems.findIndex(x => x.id === pool[randomIndex].id);
                if (idx !== -1) availableItems.splice(idx, 1);
                if (pool === commons) commons.splice(commons.indexOf(pool[randomIndex]), 1);
                if (pool === rares) rares.splice(rares.indexOf(pool[randomIndex]), 1);
                if (pool === legendaries) legendaries.splice(legendaries.indexOf(pool[randomIndex]), 1);
            }
        }
    }
    
    async function spin() {
        if (state.spinsLeft <= 0 || state.gameover || state.isSpinning) return;
        
        state.isSpinning = true;
        ui.lever.classList.add('pulled');
        state.spinsLeft--;
        updateUI(); 

        state.grid = generateGrid();
        
        await runSpinAnimation();
        
        calculateWinnings();
        
        state.tempLuck = 0;
        state.isSpinning = false;
        ui.lever.classList.remove('pulled');
        updateUI();
    }
    
    function initGame() {
        state = {
            run: 1, targetDebt: 50, turn: 1, coins: 20, bankBalance: 0, tickets: 5,
            spinsLeft: 0, baseInterestRate: 0.40, inventory: [], shop: [], gameover: false, isSpinning: false,
            piggyBank: 0, tempLuck: 0,
        };
        state.grid = generateGrid();
        
        ui.startScreen.classList.add('hidden');
        ui.gameOverScreen.classList.add('hidden');
        ui.logPanel.innerHTML = '';
        
        renderGrid(true); 

        populateShop();
        addLog(`Начался Цикл Долга #${state.run}. Цель: ${state.targetDebt}💰 за 3 дня.`);
        startTurn();
    }

    function startTurn() {
        state.tempLuck = 0;
         const roundStartSpins = getItemEffectValue('on_round_start_spins', 0);
        if (roundStartSpins > 0) {
            state.spinsLeft += roundStartSpins;
            addLog(`Карманные часы: +${roundStartSpins} прокрут в начале раунда.`, 'win');
        }

        if (state.turn > 1 || state.run > 1) {
            const interest = Math.floor(state.bankBalance * state.baseInterestRate);
            if (interest > 0) {
                state.coins += interest;
                addLog(`Банковский кэшбек: +${interest}💰.`, 'win');
            }
        }
        
        ui.purchaseModalTitle.textContent = `Раунд ${state.turn}. Время закупаться.`;
        ui.purchaseModalCoins.textContent = `${state.coins}💰`;
        ui.btnBuySpins7.disabled = state.coins < CONFIG.SPIN_PACKAGE_1.cost;
        ui.btnBuySpins3.disabled = state.coins < CONFIG.SPIN_PACKAGE_2.cost;
        ui.spinPurchaseModal.classList.remove('hidden');
        updateUI();
    }
    
    function buySpins(pkg) {
        if (pkg) {
            if (state.coins >= pkg.cost) {
                state.coins -= pkg.cost;
                state.spinsLeft += pkg.spins;
                state.tickets += pkg.tickets;
                addLog(`Куплено: ${pkg.spins} прокрутов и ${pkg.tickets} талон(а/ов).`);
            } else { addLog(`Недостаточно наличных.`, 'loss'); }
        }
        ui.spinPurchaseModal.classList.add('hidden');
        updateUI();
    }

    function endTurn() {
        if (state.isSpinning) return;
        ui.eorTitle.textContent = `Конец Раунда ${state.turn}`;
        ui.eorCoins.textContent = `${state.coins}💰`;
        ui.eorBank.textContent = `${state.bankBalance}💰`;
        ui.eorDepositAmount.value = '';
        ui.endOfRoundModal.classList.remove('hidden');
    }

    function confirmEndTurn() {
        if (hasItem('scrap_metal') && state.piggyBank > 0) {
            addLog(`Копилка разбита! Вы получили +${state.piggyBank}💰.`, 'win');
            state.coins += state.piggyBank;
            state.piggyBank = 0;
        }

        ui.endOfRoundModal.classList.add('hidden');
        addLog(`--- Раунд ${state.turn} окончен ---`);
        state.turn++;
        if (state.turn > 3) {
            judgementDay();
        } else {
            startTurn();
        }
    }

    function judgementDay() {
        const totalMoney = state.coins + state.bankBalance;
        addLog(`СУДНЫЙ ДЕНЬ. Ваша сумма: ${totalMoney}💰. Требуется: ${state.targetDebt}💰.`);
        if (totalMoney >= state.targetDebt) {
            const remainder = totalMoney - state.targetDebt;
            const rewardTickets = 5 + state.run;
            ui.judgementTitle.textContent = "ДОЛГ ВЫПЛАЧЕН";
            ui.judgementTitle.classList.remove('failure');
            ui.judgementText.innerHTML = `Вы выжили. Остаток <span style="color:var(--money-color)">${remainder}💰</span> переведен в банк.<br>Награда: <span style="color:var(--ticket-color)">${rewardTickets}🎟️</span>.`;
            ui.judgementContinue.onclick = () => {
                ui.judgementModal.classList.add('hidden');
                state.run++;
                state.turn = 1;
                state.targetDebt = Math.floor(state.targetDebt * 1.8 + 20);
                state.coins = 0;
                state.bankBalance = remainder;
                state.tickets += rewardTickets;
                state.spinsLeft = 0;
                addLog(`Новый Цикл Долга #${state.run} начался. Цель: ${state.targetDebt}💰.`);
                populateShop();
                startTurn();
            };
        } else {
            ui.judgementTitle.textContent = "ПРОВАЛ";
            ui.judgementTitle.classList.add('failure');
            ui.judgementText.textContent = `Вы не смогли собрать нужную сумму. Яма ждет.`;
            ui.judgementContinue.onclick = () => {
                ui.judgementModal.classList.add('hidden');
                gameOver();
            };
        }
        ui.judgementModal.classList.remove('hidden');
    }
    
    function gameOver() {
        state.gameover = true;
        ui.finalRun.textContent = state.run;
        ui.gameOverScreen.classList.remove('hidden');
        addLog("ИГРА ОКОНЧЕНА.", 'loss');
    }
    
    function deposit(amount, isFromEOR = false) {
        if (isNaN(amount) || amount <= 0) return addLog("Некорректная сумма.", 'loss');
        if (amount > state.coins) return addLog("Недостаточно наличных.", 'loss');
        state.coins -= amount;
        state.bankBalance += amount;
        addLog(`Внесено в банк: ${amount}💰.`);
        if (isFromEOR) {
            ui.eorDepositAmount.value = '';
            ui.eorCoins.textContent = `${state.coins}💰`;
            ui.eorBank.textContent = `${state.bankBalance}💰`;
        }
        ui.depositAmountInput.value = '';
        updateUI();
    }

    function rerollShop() {
        if (state.tickets >= CONFIG.REROLL_COST) {
            state.tickets -= CONFIG.REROLL_COST;
            populateShop();
            addLog(`Магазин обновлен за ${CONFIG.REROLL_COST}🎟️.`);
            updateUI();
        } else { addLog('Недостаточно талонов.', 'loss'); }
    }

    function buyItem(itemId) {
        const item = state.shop.find(i => i.id === itemId);
        if (!item || state.tickets < item.cost) return addLog('Недостаточно талонов.', 'loss');
        state.tickets -= item.cost;
        state.inventory.push(item);
        state.shop = state.shop.filter(i => i.id !== itemId);
        addLog(`Куплен амулет: ${item.name}`, 'win');
        
        if (ui.planningModal.classList.contains('hidden')) {
            updateUI();
        } else {
            ui.planningTickets.textContent = state.tickets;
            renderPlanningShop();
            renderPlanningInventory();
            updateUI();
        }
    }
    
    function updateUI() {
        ui.statRun.textContent = state.run;
        ui.statTurn.textContent = `${state.turn} / 3`;
        ui.statDebt.textContent = `${state.targetDebt}💰`;
        ui.statCoins.textContent = `${state.coins}💰`;
        ui.bankBalance.textContent = `${state.bankBalance}💰`;
        ui.statTickets.textContent = `${state.tickets}🎟️`;
        const baseLuck = getItemEffectValue('luck', 0);
        ui.statLuck.textContent = `${baseLuck}${state.tempLuck > 0 ? ` (+${state.tempLuck})` : ''}`;
        ui.spinsLeft.textContent = state.spinsLeft;
        ui.atmInterestRate.textContent = (state.baseInterestRate * 100).toFixed(0);
        
        ui.btnEndTurn.disabled = state.isSpinning || state.spinsLeft > 0;
        
        ui.btnRerollShop.textContent = `Reroll (${CONFIG.REROLL_COST}🎟️)`;
        renderInventory(); 
        renderShop();
    }
    
    function renderGrid(isInitialSetup = false) {
        if (!isInitialSetup) return;

        ui.slotMachine.innerHTML = '';
        for (let i = 0; i < CONFIG.ROWS * CONFIG.COLS; i++) {
            const cell = document.createElement('div');
            cell.className = 'slot-cell';
            
            const reel = document.createElement('div');
            reel.className = 'reel';
            cell.appendChild(reel);
            
            ui.slotMachine.appendChild(cell);
        }
        updateReels(true);
    }

    function updateReels(isInitial = false) {
        const reels = ui.slotMachine.querySelectorAll('.reel');
        const finalGrid = state.grid;

        reels.forEach((reel, i) => {
            reel.innerHTML = '';
            
            const reelSymbols = [];
            for (let j = 0; j < 19; j++) {
                reelSymbols.push(weightedSymbols[Math.floor(Math.random() * weightedSymbols.length)]);
            }
            reelSymbols.push(finalGrid[i]);

            reelSymbols.forEach(symbol => {
                const symbolDiv = document.createElement('div');
                symbolDiv.className = 'symbol';
                symbolDiv.textContent = symbol.graphic;
                reel.appendChild(symbolDiv); 
            });

            if (isInitial) {
                reel.style.transition = 'none';
                reel.style.transform = `translateY(-95%)`;
            }
        });
    }
    
    async function runSpinAnimation() {
        updateReels(false);

        const reels = ui.slotMachine.querySelectorAll('.reel');
        const promises = [];
        
        reels.forEach((reel, i) => {
            reel.style.transition = 'none';
            reel.style.transform = 'translateY(0)';
            reel.offsetHeight;

            const delay = (i % CONFIG.COLS) * 100;
            promises.push(new Promise(resolve => {
                setTimeout(() => {
                    reel.style.transition = `transform ${CONFIG.SPIN_ANIMATION_TIME / 1000}s cubic-bezier(0.25, 0.1, 0.25, 1)`;
                    reel.style.transform = `translateY(-95%)`;
                    reel.addEventListener('transitionend', resolve, { once: true });
                }, delay);
            }));
        });
        
        await Promise.all(promises);
        await new Promise(res => setTimeout(res, 200));
    }

    function renderShop() {
        ui.shopItems.innerHTML = '';
        if (state.shop.length === 0) ui.shopItems.innerHTML = '<p style="text-align:center; color: #777;">Пусто</p>';
        state.shop.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = `item rarity-${item.rarity}`;
            itemDiv.onclick = () => buyItem(item.id);
            itemDiv.innerHTML = `<span class="item-cost">${item.cost}🎟️</span><span class="item-name">${item.name}</span><p class="item-desc">${item.desc}</p>`;
            if (state.tickets < item.cost) itemDiv.style.opacity = '0.5';
            ui.shopItems.appendChild(itemDiv);
        });
    }

    function renderInventory() {
        ui.inventoryItems.innerHTML = '';
        if (state.inventory.length === 0) ui.inventoryItems.innerHTML = '<p style="text-align:center; color: #777;">Пусто</p>';
        state.inventory.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = `item rarity-${item.rarity}`;
            itemDiv.style.cursor = 'default';
            itemDiv.innerHTML = `<span class="item-name">${item.name}</span><p class="item-desc">${item.desc}</p>`;
            ui.inventoryItems.appendChild(itemDiv);
        });
    }

    function openPlanningMode() {
        ui.spinPurchaseModal.classList.add('hidden');
        ui.planningModal.classList.remove('hidden');
        ui.planningTickets.textContent = state.tickets;
        renderPlanningShop();
        renderPlanningInventory();
    }

    function closePlanningMode() {
        ui.planningModal.classList.add('hidden');
        ui.spinPurchaseModal.classList.remove('hidden');
    }

    function renderPlanningShop() {
        ui.planningShopItems.innerHTML = '';
        if (state.shop.length === 0) ui.planningShopItems.innerHTML = '<p style="text-align:center; color: #777;">Пусто</p>';
        state.shop.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = `item rarity-${item.rarity}`;
            itemDiv.onclick = () => buyItem(item.id);
            itemDiv.innerHTML = `<span class="item-cost">${item.cost}🎟️</span><span class="item-name">${item.name}</span><p class="item-desc">${item.desc}</p>`;
            if (state.tickets < item.cost) itemDiv.style.opacity = '0.5';
            ui.planningShopItems.appendChild(itemDiv);
        });
    }

    function renderPlanningInventory() {
        ui.planningInventoryItems.innerHTML = '';
        if (state.inventory.length === 0) ui.planningInventoryItems.innerHTML = '<p style="text-align:center; color: #777;">Пусто</p>';
        state.inventory.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = `item rarity-${item.rarity}`;
            itemDiv.style.cursor = 'default';
            itemDiv.innerHTML = `<span class="item-name">${item.name}</span><p class="item-desc">${item.desc}</p>`;
            ui.planningInventoryItems.appendChild(itemDiv);
        });
    }

    function rerollPlanningShop() {
        if (state.tickets >= CONFIG.REROLL_COST) {
            state.tickets -= CONFIG.REROLL_COST;
            populateShop();
            addLog(`Магазин обновлен за ${CONFIG.REROLL_COST}🎟️.`);
            ui.planningTickets.textContent = state.tickets;
            renderPlanningShop();
            updateUI();
        } else { addLog('Недостаточно талонов.', 'loss'); }
    }

    // --- СОБЫТИЯ ---
    ui.btnStartGame.onclick = initGame;
    ui.btnRestartGame.onclick = initGame;
    ui.lever.onclick = spin;
    ui.btnDeposit.onclick = () => deposit(parseInt(ui.depositAmountInput.value, 10), false);
    ui.btnEndTurn.onclick = endTurn;
    ui.btnConfirmEndTurn.onclick = confirmEndTurn;
    ui.btnEorDeposit.onclick = () => deposit(parseInt(ui.eorDepositAmount.value, 10), true);
    ui.btnBuySpins7.onclick = () => buySpins(CONFIG.SPIN_PACKAGE_1);
    ui.btnBuySpins3.onclick = () => buySpins(CONFIG.SPIN_PACKAGE_2);
    ui.btnBuyNothing.onclick = () => buySpins(null);
    ui.btnRerollShop.onclick = rerollShop;
    ui.btnPlanning.onclick = openPlanningMode;
    ui.btnPlanningReroll.onclick = rerollPlanningShop;
    ui.btnFinishPlanning.onclick = closePlanningMode;

    ui.startScreen.classList.remove('hidden');
});