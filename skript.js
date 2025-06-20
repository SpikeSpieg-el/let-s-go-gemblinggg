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
        btnBuySpin1: document.getElementById('buy-spin-1'),
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
        purchaseModalDebt: document.getElementById('purchase-modal-debt'),
        btnPayDebtEarly: document.getElementById('btn-pay-debt-early'),
        earlyPayoffBonusInfo: document.getElementById('early-payoff-bonus-info'),
        earlyPayoffSection: document.getElementById('early-payoff-section'),
        statDebtStart: document.getElementById('stat-debt-start'),
    };

    const CONFIG = {
        ROWS: 3, COLS: 5, REROLL_COST: 2,
        SPIN_ANIMATION_TIME: 1200, 
        SPIN_PACKAGE_1: { spins: 7, tickets: 1, cost: 10, base_cost: 10 },
        SPIN_PACKAGE_2: { spins: 3, tickets: 2, cost: 7, base_cost: 7 },
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
    window.SYMBOLS = SYMBOLS;
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

    let state = {};
    let weightedSymbols = [];
    let devDebugLuck = false;

    // --- ДОБАВЛЯЕМ ПОДДЕРЖКУ ПАССИВОК ---
    let chosenPassive = null;

    function showPassiveChoiceModal() {
        // Создаём модалку выбора пассивки
        let modal = document.getElementById('passive-choice-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'passive-choice-modal';
            modal.className = 'modal-overlay';
            modal.innerHTML = `
                <div class="modal-card">
                    <h2>Выберите пассивку на всю игру</h2>
                    <div id="passive-choices" style="display:flex;gap:16px;justify-content:center;"></div>
                    <button id="passive-confirm-btn" disabled>Подтвердить</button>
                </div>
            `;
            document.body.appendChild(modal);
        }
        const choicesDiv = modal.querySelector('#passive-choices');
        const confirmBtn = modal.querySelector('#passive-confirm-btn');
        choicesDiv.innerHTML = '';
        confirmBtn.disabled = true;
        const passives = getRandomPassives(3);
        passives.forEach((p, idx) => {
            const div = document.createElement('div');
            div.className = 'passive-choice-card';
            div.innerHTML = `
                <div class="passive-choice-emoji">${p.emoji || ''}</div>
                <div class="passive-choice-name">${p.name}</div>
                <div class="passive-choice-desc">${p.desc}</div>
            `;
            div.onclick = () => {
                choicesDiv.querySelectorAll('.passive-choice-card').forEach(el => el.classList.remove('selected'));
                div.classList.add('selected');
                chosenPassive = p;
                confirmBtn.disabled = false;
            };
            choicesDiv.appendChild(div);
        });
        confirmBtn.onclick = () => {
            modal.classList.add('hidden');
            state.chosenPassive = chosenPassive;
            applyPassive(chosenPassive, state);
            updateUI();
        };
        modal.classList.remove('hidden');
    }

    // --- ДОБАВЛЯЕМ ВЫЗОВ В НАЧАЛЕ ИГРЫ ---
    const origInitGameWithPassive = initGame;
    initGame = function() {
        origInitGameWithPassive.apply(this, arguments);
        // Показываем выбор пассивки только если не выбрана и цикл больше или равен 2
        if (!state.chosenPassive && state.run >= 2) {
            showPassiveChoiceModal();
        }
    };

    // --- ПРИМЕНЕНИЕ slot_mod ПАССИВОК ПРИ ГЕНЕРАЦИИ СЛОТОВ ---
    const origGenerateGrid = generateGrid;
    generateGrid = function() {
        // Применяем slot_mod пассивки
        if (state.chosenPassive && state.chosenPassive.type === 'slot_mod') {
            state.chosenPassive.effect(state);
        }
        return origGenerateGrid.apply(this, arguments);
    };

    // --- ПРИМЕНЕНИЕ item_mod ПАССИВОК ПРИ ВЫПЛАТАХ ---
    const origCalculateWinnings = calculateWinnings;
    calculateWinnings = function() {
        origCalculateWinnings.apply(this, arguments);
        // Клеверный бонус
        if (state.passiveEffects && state.passiveEffects.clover_bonus && state.grid) {
            const cloverCount = state.grid.filter(s => s.id === 'clover').length;
            if (cloverCount > 0 && state.lastWinningLines && state.lastWinningLines.length > 0) {
                const bonus = cloverCount;
                state.coins += bonus;
                addLog('Клеверный бонус: +' + bonus + '💰 за клеверы на поле.', 'win');
            }
        }
        // Вишнёвая удача
        if (state.passiveEffects && state.passiveEffects.cherry_luck && state.grid) {
            const cherryCount = state.grid.filter(s => s.id === 'cherry').length;
            if (cherryCount > 0) {
                state.tempLuck = (state.tempLuck || 0) + 1;
                addLog('Вишнёвая удача: +1 к удаче за вишню на поле.', 'win');
            }
        }
    };

    // ВОССТАНАВЛИВАЕМ ФУНКЦИИ
    function hasItem(itemId) {
        return state.inventory && state.inventory.some(item => item.id === itemId);
    }
    function getItemEffectValue(effectKey, defaultValue, accumulator = 'sum') {
        let items = [...state.inventory];
        // mimic: копируем эффект другого предмета
        const mimicItem = items.find(item => item.effect?.mimic);
        if (mimicItem) {
            const targetId = mimicItem.effect.mimic.target;
            const target = ALL_ITEMS.find(i => i.id === targetId);
            // --- ОТЛАДКА ДЛЯ СУНДУКА-МИМИКА ---
            console.log('[DEBUG] Сундук-Мимик: mimicItem=', mimicItem, 'targetId=', targetId, 'target=', target);
            if (target) items.push({...target, id: 'mimic_copy'});
        }
        return items.reduce((acc, item) => {
            if (item.effect) {
                // поддержка вложенных ключей через точку
                let value = item.effect;
                for (const key of effectKey.split('.')) {
                    if (value && value.hasOwnProperty(key)) {
                        value = value[key];
                    } else {
                        value = undefined;
                        break;
                    }
                }
                if (value !== undefined) {
                    if (accumulator === 'multiply') return acc * value;
                    return acc + value;
                }
            }
            return acc;
        }, defaultValue);
    }
    function addLog(message, type = 'normal') {
        // Не добавлять в log-panel сообщения, начинающиеся с '[DEBUG]', '[Квантовая Запутанность]' или 'Dev:'
        if (typeof message === 'string' && (message.startsWith('[DEBUG]') || message.startsWith('[Квантовая Запутанность]') || message.startsWith('Dev:'))) return;
        const logEntry = document.createElement('p');
        logEntry.textContent = `> ${message}`;
        if (type === 'win') logEntry.style.color = 'var(--highlight-color)';
        if (type === 'loss') logEntry.style.color = 'var(--danger-color)';
        ui.logPanel.insertBefore(logEntry, ui.logPanel.firstChild);
        if (ui.logPanel.children.length > 50) ui.logPanel.removeChild(ui.logPanel.lastChild);
    }

    function updateWeightedSymbols() {
        let currentSymbols = [...SYMBOLS];
        // Применяем эффект "Фильтр Неудач"
        const removedSymbolId = state.inventory.find(item => item.effect?.remove_symbol)?.effect.remove_symbol;
        if (removedSymbolId) {
            currentSymbols = currentSymbols.filter(s => s.id !== removedSymbolId);
        }
        weightedSymbols = currentSymbols.flatMap(s => Array(s.weight).fill(s));
    }

    function generateGrid() {
        updateWeightedSymbols(); // Обновляем пул символов перед генерацией

        let tempLuck = 0;
        if(hasItem('blood_ritual')) {
            const effect = ALL_ITEMS.find(i => i.id === 'blood_ritual').effect.on_spin_sacrifice;
            if(state.coins >= effect.condition_coin){
                state.coins -= effect.cost;
                tempLuck += effect.bonus.luck;
                addLog(`Кровавый Ритуал: -${effect.cost}💰, +${effect.bonus.luck} к удаче на этот спин.`, 'win');
            }
        }
        
        const perRunLuck = hasItem('growing_debt') ? getItemEffectValue('per_run_bonus.luck', 0, 'sum') * state.run : 0;
        if (hasItem('growing_debt')) {
            console.log('[DEBUG] Растущий Долг: +', getItemEffectValue('per_run_bonus.luck', 0, 'sum'), 'к удаче за каждый цикл. Текущий цикл:', state.run, '=> бонус:', perRunLuck);
        }

        const totalLuck = getItemEffectValue('luck', 0) + state.tempLuck + tempLuck + perRunLuck;
        
        // --- НОВАЯ ЛОГИКА: удача влияет только на один случайный символ ---
        const luckySymbolIndex = Math.floor(Math.random() * SYMBOLS.length);
        const luckySymbolId = SYMBOLS[luckySymbolIndex].id;

        let adjustedSymbols = weightedSymbols.map(symbol => {
            if (symbol.id === luckySymbolId) {
                let newWeight = symbol.weight + Math.floor(symbol.value * totalLuck * 40);
                return { ...symbol, weight: newWeight };
            }
            return { ...symbol, weight: symbol.weight };
        });

        // addLog(`В этот спин удача увеличивает вес символа: ${GRAPHICS[luckySymbolId]}`, 'win');
        // Собираем уникальные веса по id
        const uniqueWeights = {};
        adjustedSymbols.forEach(s => { uniqueWeights[s.id] = s.weight; });
        const weightsDebug = Object.entries(uniqueWeights)
            .map(([id, w]) => `${GRAPHICS[id]}:${w}`)
            .join(' ');
        console.log(`[DEBUG] В этот спин удача увеличивает вес символа: ${GRAPHICS[luckySymbolId]}. Веса: ${weightsDebug}`);
        if (hasItem('twins_mirror')) {
            console.log('[DEBUG] Зеркало Близнецов: горизонтальные линии выплат работают в обе стороны.');
        }

        if (devDebugLuck) {
            // Считаем уникальные веса
            let uniqueWeights = {};
            adjustedSymbols.forEach(s => { uniqueWeights[s.id] = s.weight; });
            let weightsStr = Object.entries(uniqueWeights)
                .map(([id, w]) => `${GRAPHICS[id]}:${w}`)
                .join(' ');
            addLog(`Dev: generateGrid() totalLuck=${totalLuck}, веса: ${weightsStr}`);
            devDebugLuck = false;
        }

        const adjustedWeightedSymbols = adjustedSymbols.flatMap(s => Array(s.weight > 0 ? s.weight : 0).fill(s));

        let grid = Array.from({ length: CONFIG.ROWS * CONFIG.COLS }, () =>
            adjustedWeightedSymbols[Math.floor(Math.random() * adjustedWeightedSymbols.length)]
        );

        // --- ЭФФЕКТ: guarantee_symbol ---
        const guarantee = state.inventory.find(item => item.effect?.guarantee_symbol);
        if (guarantee) {
            const { symbol, count } = guarantee.effect.guarantee_symbol;
            let positions = Array.from({length: grid.length}, (_, i) => i);
            for (let i = 0; i < count; i++) {
                if (positions.length === 0) break;
                const idx = Math.floor(Math.random() * positions.length);
                grid[positions[idx]] = SYMBOLS.find(s => s.id === symbol);
                positions.splice(idx, 1);
            }
            // --- ОТЛАДКА ДЛЯ МАГНИТА СЕМЁРОК ---
            if(guarantee.id === 'seven_magnet') {
                console.log('[DEBUG] Магнит Семёрок: grid после гарантии =', grid);
            }
        }
        // --- ЭФФЕКТ: sync_cells ---
        const sync = state.inventory.find(item => item.effect?.sync_cells);
        if (sync) {
            const positions = sync.effect.sync_cells.cells;
            if (Array.isArray(positions) && positions.length > 0 && grid.length > 0) {
                const symbol = grid[positions[0]];
                positions.forEach(pos => grid[pos] = symbol);
                // DEBUG LOG
                console.log('[Квантовая Запутанность] Синхронизированы позиции', positions, 'Символ:', symbol);
            }
        }

        return grid;
    }

    function showTotalWinPopup(amount) {
        // Создаем поп-ап
        const popup = document.createElement('div');
        popup.className = 'total-win-popup';
        popup.innerHTML = `
            <div class="win-title">ОБЩИЙ ВЫИГРЫШ</div>
            <div class="win-amount">+${amount}💰</div>
        `;
        document.body.appendChild(popup);

        // Создаем конфетти для больших выигрышей
        if (amount >= 100) {
            const colors = ['#FFD700', '#00ff7f', '#ff3b3b', '#40c4ff', '#b388ff'];
            for (let i = 0; i < 50; i++) {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * 100 + 'vw';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.animationDuration = (Math.random() * 1 + 1) + 's';
                document.body.appendChild(confetti);
                setTimeout(() => confetti.remove(), 2000);
            }
        }

        // Показываем поп-ап
        setTimeout(() => {
            popup.classList.add('show');
            // Удаляем поп-ап через 2 секунды (1.5 сек показа + 0.5 fade-out)
            setTimeout(() => {
                popup.classList.remove('show');
                popup.classList.add('fade-out');
                setTimeout(() => popup.remove(), 1000);
            }, 1500);
        }, 100);
    }

    function calculateWinnings() {
        let grid = [...state.grid];
        let totalWinnings = 0;
        const allWinningPositions = new Set();
        let winningLinesInfo = [];
        
        const wildSymbolId = state.inventory.find(item => item.effect?.wild_symbol)?.effect.wild_symbol;

        // --- 0. ПРЕДВАРИТЕЛЬНЫЕ ЭФФЕКТЫ ---
        state.tempLuck = 0; // Сбрасываем временную удачу от "Пакт Семёрок"
        state.inventory.forEach(item => {
            if (item.effect?.temporary_luck_on_spin) {
                const symbolId = item.effect.temporary_luck_on_spin;
                const count = grid.filter(s => s.id === symbolId).length;
                if (count > 0) { state.tempLuck += count; }
            }
        });
        if(state.tempLuck > 0) addLog(`Пакт Семёрок: +${state.tempLuck} к временной удаче.`, 'win');

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
        
        const payBothWays = hasItem("twins_mirror") || state.inventory.some(item => item.effect?.pay_both_ways);

        // pay_both_ways: если активен, добавляем зеркальные линии для scannable
        if (payBothWays) {
            const mirrored = activePaylines.filter(l => l.scannable).map(line => ({
                ...line,
                name: line.name + ' (обратно)',
                positions: [...line.positions].reverse(),
            }));
            activePaylines = activePaylines.concat(mirrored);
        }

        // --- ДОБАВЛЯЕМ ЭФФЕКТЫ ПРЕДМЕТОВ К ВЫПЛАТАМ ---
        // symbol_value_multiplier
        const symbolMultipliers = {};
        state.inventory.forEach(item => {
            if (item.effect?.symbol_value_multiplier) {
                const eff = item.effect.symbol_value_multiplier;
                symbolMultipliers[eff.symbol] = (symbolMultipliers[eff.symbol] || 1) * eff.multiplier;
            }
        });
        // line_length_win_bonus
        const lineLengthBonuses = {};
        state.inventory.forEach(item => {
            if (item.effect?.line_length_win_bonus) {
                const eff = item.effect.line_length_win_bonus;
                lineLengthBonuses[eff.length] = (lineLengthBonuses[eff.length] || 0) + eff.bonus;
                // --- ОТЛАДКА ДЛЯ ЛИПКИХ ПАЛЬЦЕВ ---
                if(item.id === 'sticky_fingers') {
                    console.log('[DEBUG] Липкие Пальцы: найден эффект line_length_win_bonus', eff, 'item:', item);
                }
            }
        });
        // on_line_win_bonus
        const lineWinBonuses = {};
        const lineWinTickets = {};
        state.inventory.forEach(item => {
            if (item.effect?.on_line_win_bonus) {
                const eff = item.effect.on_line_win_bonus;
                if (eff.bonus) lineWinBonuses[eff.length] = (lineWinBonuses[eff.length] || 0) + eff.bonus;
                if (eff.tickets) lineWinTickets[eff.length] = (lineWinTickets[eff.length] || 0) + eff.tickets;
            }
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

                        // --- ПРИМЕНЯЕМ symbol_value_multiplier ---
                        let symbolValue = currentSymbol.value;
                        if (symbolMultipliers[currentSymbol.id]) {
                            symbolValue = Math.floor(symbolValue * symbolMultipliers[currentSymbol.id]);
                        }

                        let win = comboLength * symbolValue * lineMultiplier;

                        // --- ПРИМЕНЯЕМ line_length_win_bonus ---
                        if (lineLengthBonuses[comboLength]) {
                            win += lineLengthBonuses[comboLength];
                            // --- ОТЛАДКА ДЛЯ ЛИПКИХ ПАЛЬЦЕВ ---
                            if (hasItem('sticky_fingers') && comboLength === 3) {
                                console.log('[DEBUG] Липкие Пальцы: добавлен бонус', lineLengthBonuses[comboLength], 'к линии', line.name, 'символ', currentSymbol.id, 'win:', win);
                            }
                        }
                        // --- ПРИМЕНЯЕМ on_line_win_bonus ---
                        if (lineWinBonuses[comboLength]) {
                            win += lineWinBonuses[comboLength];
                        }
                        if (lineWinTickets[comboLength]) {
                            state.tickets += lineWinTickets[comboLength];
                            addLog(`Принтер Талонов: +${lineWinTickets[comboLength]}🎟️`, 'win');
                        }

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

                    // --- ПРИМЕНЯЕМ symbol_value_multiplier ---
                    let symbolValue = firstSymbol.value;
                    if (symbolMultipliers[firstSymbol.id]) {
                        symbolValue = Math.floor(symbolValue * symbolMultipliers[firstSymbol.id]);
                    }

                    let win = line.positions.length * symbolValue * lineMultiplier;
                    
                    // --- ПРИМЕНЯЕМ line_length_win_bonus ---
                    if (lineLengthBonuses[line.positions.length]) {
                        win += lineLengthBonuses[line.positions.length];
                        // --- ОТЛАДКА ДЛЯ ЛИПКИХ ПАЛЬЦЕВ ---
                        if (hasItem('sticky_fingers') && line.positions.length === 3) {
                            console.log('[DEBUG] Липкие Пальцы: добавлен бонус', lineLengthBonuses[line.positions.length], 'к линии', line.name, 'символ', firstSymbol.id, 'win:', win);
                        }
                    }
                    // --- ПРИМЕНЯЕМ on_line_win_bonus ---
                    if (lineWinBonuses[line.positions.length]) {
                        win += lineWinBonuses[line.positions.length];
                    }
                    if (lineWinTickets[line.positions.length]) {
                        state.tickets += lineWinTickets[line.positions.length];
                        addLog(`Принтер Талонов: +${lineWinTickets[line.positions.length]}🎟️`, 'win');
                    }

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
            
            // Создаем эффект джекпота с задержкой
            setTimeout(() => {
                const jackpotOverlay = document.createElement('div');
                jackpotOverlay.className = 'jackpot-overlay';
                jackpotOverlay.innerHTML = `
                    <div class="jackpot-content">
                        <div class="jackpot-title">ДЖЕКПОТ!!!</div>
                        <div class="jackpot-amount">+${jackpotWin}💰</div>
                    </div>
                `;
                document.body.appendChild(jackpotOverlay);
                
                // Создаем взрывающиеся частицы
                for (let i = 0; i < 50; i++) {
                    const particle = document.createElement('div');
                    particle.className = 'jackpot-particle';
                    particle.style.setProperty('--angle', `${Math.random() * 360}deg`);
                    particle.style.setProperty('--delay', `${Math.random() * 0.5}s`);
                    jackpotOverlay.appendChild(particle);
                }
                
                // Удаляем оверлей через 4 секунды
                setTimeout(() => {
                    jackpotOverlay.classList.add('fade-out');
                    setTimeout(() => jackpotOverlay.remove(), 1000);
                }, 4000);
            }, 1000); // Задержка перед показом джекпота
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

        // Сохраняем выигрышные линии для on_spin_bonus предметов
        state.lastWinningLines = winningLinesInfo;

        if (winningLinesInfo.length > 1) {
            let comboMultiplier = 1;
            if (hasItem('combo_counter')) {
                comboMultiplier = state.inventory.find(item => item.id === 'combo_counter')?.effect?.combo_bonus_multiplier || 1.5;
            }
            const comboBonus = Math.floor(totalWinnings * ((1 + (winningLinesInfo.length - 1) * 0.25 - 1) * comboMultiplier));
            totalWinnings += comboBonus;
            addLog(`🔥 КОМБО x${winningLinesInfo.length}! Бонус: +${comboBonus}💰`, 'win');

            // Задержка для анимации комбо если был джекпот
            const jackpotDelay = topCount === 15 ? 5500 : 0;
            
            setTimeout(() => {
                highlightWinningCells(Array.from(allWinningPositions), totalWinnings, winningLinesInfo.length > 1, winningLinesInfo);

                // Показываем поп-ап общего выигрыша после всех анимаций только для реального комбо
                const sequenceTime = allWinningPositions.size * 150 + 2500; // Время последовательности + удержания
                if (winningLinesInfo.length > 1) {
                    setTimeout(() => showTotalWinPopup(totalWinnings), sequenceTime);
                }
            }, jackpotDelay);
        } else if (totalWinnings > 0) {
            const jackpotDelay = topCount === 15 ? 5500 : 0;
            setTimeout(() => {
                highlightWinningCells(Array.from(allWinningPositions), totalWinnings, false, winningLinesInfo);
                // Для больших одиночных выигрышей тоже показываем поп-ап
                if (totalWinnings >= 50) {
                    setTimeout(() => showTotalWinPopup(totalWinnings), 2000);
                }
            }, jackpotDelay);
        }

        state.inventory.forEach(item => {
            if (item.on_spin_bonus) {
                // --- ОТЛАДКА ДЛЯ РАДУЖНОГО КЛЕВЕРА ---
                if(item.id === 'rainbow_clover') {
                    console.log('[DEBUG] Радужный клевер: grid=', state.grid, 'totalWinnings=', totalWinnings);
                }
                const bonus = item.on_spin_bonus(state.grid, totalWinnings, state);
                if (bonus > 0) { totalWinnings += bonus; addLog(`${item.name}: +${bonus}💰`, 'win'); }
            }
        });
        
        const finalMultiplier = getItemEffectValue('winMultiplier', 1);
        if (finalMultiplier > 1 && totalWinnings > 0) {
            const bonus = Math.floor(totalWinnings * (finalMultiplier - 1));
            totalWinnings += bonus;
            addLog(`Амулет Фортуны: +25% бонус! (+${bonus}💰)`, 'win');
        }

        // --- LAST CHANCE ---
        if (hasItem('last_chance') && state.spinsLeft === 0 && state.turn === 3) {
            const lastChanceMultiplier = state.inventory.find(item => item.id === 'last_chance')?.effect?.on_last_spin_bonus?.multiplier || 3;
            if (totalWinnings > 0) {
                const bonus = totalWinnings * (lastChanceMultiplier - 1);
                totalWinnings += bonus;
                addLog(`Последний Шанс: x${lastChanceMultiplier} к выигрышу! (+${bonus}💰)`, 'win');
            }
        }

        totalWinnings = Math.floor(totalWinnings);

        if (totalWinnings > 0) {
            state.coins += totalWinnings;
        } else { 
            addLog('Ничего не выпало.');
            if (hasItem('scrap_metal')) {
                const lossBonus = getItemEffectValue('on_loss_bonus', 0);
                state.piggyBank += lossBonus;
                addLog(`Копилка: +${lossBonus}💰. Всего: ${state.piggyBank}💰`);
            }
        }
    }

    function highlightWinningCells(positions, winAmount, isCombo = false, winningLines = []) {
        const cells = ui.slotMachine.querySelectorAll('.slot-cell');
        let highlightClass = 'highlight';
        
        // Определяем класс подсветки на основе выигрыша
        if (winAmount > 50) highlightClass = 'highlight-huge';
        else if (winAmount > 20) highlightClass = 'highlight-big';

        // Проверяем, был ли джекпот
        const isJackpot = positions.length === 15;

        // Добавляем комбо-эффекты только если это действительно комбо (несколько выигрышных линий)
        let comboLevel;
        if (isCombo) {
            if (winningLines.length >= 9) comboLevel = 5;
            else if (winningLines.length >= 7) comboLevel = 4;
            else if (winningLines.length >= 5) comboLevel = 3;
            else if (winningLines.length >= 3) comboLevel = 2;
            else comboLevel = 1;
        } else {
            comboLevel = 0;
        }
        
        if (comboLevel > 0) {
            ui.slotMachine.classList.add('combo-active');
            if (isJackpot) ui.slotMachine.classList.add('jackpot');
            
            // Последовательная анимация для каждой позиции
            const sequenceTime = positions.length * 150; // Время на последовательное появление
            const holdTime = 2500; // Время удержания всех эффектов

            positions.forEach((pos, index) => {
                setTimeout(() => {
                    const cell = cells[pos];
                    if (cell) {
                        // Добавляем начальную анимацию появления
                        cell.classList.add('sequential-highlight');
                        if (isJackpot) cell.classList.add('jackpot');
                        
                        // Создаем эффект частиц для больших комбо
                        if (comboLevel >= 3) {
                            for (let i = 0; i < 3; i++) {
                                const particle = document.createElement('div');
                                particle.className = 'particle' + (isJackpot ? ' jackpot' : '');
                                cell.appendChild(particle);
                                setTimeout(() => particle.remove(), 500);
                            }
                        }

                        // Для высоких комбо (4-5) добавляем вылетающие монеты
                        if (comboLevel >= 4) {
                            const coinCount = isJackpot ? (comboLevel === 5 ? 12 : 8) : (comboLevel === 5 ? 8 : 5);
                            const cellRect = cell.getBoundingClientRect();
                            // Центр ячейки
                            const cellCenterX = cellRect.left + cellRect.width / 2;
                            const cellCenterY = cellRect.top + cellRect.height / 2;
                            for (let i = 0; i < coinCount; i++) {
                                setTimeout(() => {
                                    const coin = document.createElement('div');
                                    coin.className = 'flying-coin' + (isJackpot ? ' jackpot' : '');
                                    coin.textContent = '💰';
                                    coin.style.position = 'fixed';
                                    coin.style.left = (cellCenterX - 16) + 'px';
                                    coin.style.top = (cellCenterY - 16) + 'px';
                                    coin.style.width = '32px';
                                    coin.style.height = '32px';
                                    coin.style.fontSize = '2em';
                                    coin.style.pointerEvents = 'none';
                                    coin.style.zIndex = 9999;
                                    document.body.appendChild(coin);
                                    // Генерируем угол разлёта (от -70 до +70 градусов относительно вертикали)
                                    const angle = (-70 + Math.random() * 140) * (Math.PI / 180);
                                    const radius = 80 + Math.random() * 40; // расстояние разлёта
                                    const dx = Math.sin(angle) * radius;
                                    const dy = -Math.cos(angle) * radius; // вверх
                                    // Первая фаза: разлёт в сторону
                                    coin.animate([
                                        { transform: 'translate(0,0) scale(1)', opacity: 1 },
                                        { transform: `translate(${dx}px,${dy}px) scale(1.1)`, opacity: 1 }
                                    ], {
                                        duration: 350,
                                        easing: 'cubic-bezier(0.5,0,0.7,1)'
                                    });
                                    // Вторая фаза: падение вниз и исчезновение
                                    setTimeout(() => {
                                        coin.animate([
                                            { transform: `translate(${dx}px,${dy}px) scale(1.1)`, opacity: 1 },
                                            { transform: `translate(${dx}px,${dy+180+Math.random()*40}px) scale(0.9)`, opacity: 0 }
                                        ], {
                                            duration: 600,
                                            easing: 'cubic-bezier(0.3,0.7,0.7,1)'
                                        });
                                        setTimeout(() => coin.remove(), 600);
                                    }, 350);
                                }, i * 100);
                            }
                        }

                        // После начальной анимации добавляем постоянный эффект комбо
                        setTimeout(() => {
                            cell.classList.remove('sequential-highlight');
                            cell.classList.add(`combo-${comboLevel}`, 'sequential');
                            if (isJackpot) cell.classList.add('jackpot');
                            
                            // Добавляем эффект выигрышного символа
                            const symbol = cell.querySelector('.symbol');
                            if (symbol) {
                                symbol.classList.add('winning');
                                if (isJackpot) symbol.classList.add('jackpot');
                            }
                        }, 500);
                    }
                }, index * 150);
            });

            // Показываем текст комбо с задержкой
            setTimeout(() => {
                const comboText = document.createElement('div');
                comboText.className = 'combo-text';
                comboText.textContent = `КОМБО x${winningLines.length}!`;
                document.body.appendChild(comboText);
                
                // Анимируем появление текста
                setTimeout(() => comboText.classList.add('show'), 100);
                
                // Удаляем текст через некоторое время
                setTimeout(() => {
                    comboText.classList.remove('show');
                    comboText.classList.add('fade-out');
                    setTimeout(() => comboText.remove(), 500);
                }, 1500);
            }, sequenceTime); // Показываем после того, как все символы загорелись

            // Очищаем все эффекты через 2.5 секунды после завершения последовательной анимации
            setTimeout(() => {
                cells.forEach(cell => {
                    cell.classList.remove('highlight', 'highlight-big', 'highlight-huge');
                    cell.classList.remove('combo-1', 'combo-2', 'combo-3', 'combo-4', 'combo-5', 'sequential');
                    cell.classList.remove('sequential-highlight');
                    const symbol = cell.querySelector('.symbol');
                    if (symbol) {
                        symbol.classList.remove('winning');
                    }
                });
                ui.slotMachine.classList.remove('combo-active');
            }, sequenceTime + holdTime); // Общее время = последовательность + удержание

        } else {
            // Для одиночных выигрышей просто добавляем базовый класс
            positions.forEach(pos => cells[pos]?.classList.add(highlightClass));
            
            // Очищаем эффекты через 2 секунды для одиночных выигрышей
            setTimeout(() => {
                cells.forEach(cell => {
                    cell.classList.remove('highlight', 'highlight-big', 'highlight-huge');
                });
            }, 2000);
        }
    }

    function populateShop() {
        state.shop = [];
        const availableItems = [...ALL_ITEMS].filter(item => !hasItem(item.id));
        // Группируем по редкости
        const commons = availableItems.filter(i => i.rarity === 'common');
        const rares = availableItems.filter(i => i.rarity === 'rare');
        const legendaries = availableItems.filter(i => i.rarity === 'legendary');
        for (let i = 0; i < 5; i++) { // Изменено с 3 на 5
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
    
    function animateSpinsCounter(oldValue, newValue) {
        const counter = ui.spinsLeft;
        const counterRect = counter.getBoundingClientRect();
        const counterWrapper = document.createElement('div');
        counterWrapper.className = 'spins-counter';
        counterWrapper.style.height = `${counterRect.height}px`;
        
        // Создаем элементы для старого и нового значения
        const oldSpan = document.createElement('span');
        oldSpan.className = 'old-value';
        oldSpan.textContent = oldValue;
        
        const newSpan = document.createElement('span');
        newSpan.className = 'new-value';
        newSpan.textContent = newValue;
        
        counterWrapper.appendChild(oldSpan);
        counterWrapper.appendChild(newSpan);
        
        // Заменяем содержимое счётчика
        counter.textContent = '';
        counter.appendChild(counterWrapper);
        
        // Удаляем обёртку и восстанавливаем обычный текст после анимации
        setTimeout(() => {
            counter.textContent = newValue;
        }, 400);
    }

    function showLuckChancePopups(triggeredItems) {
        if (!triggeredItems || triggeredItems.length === 0) return;
        let idx = 0;
        function showNext() {
            const item = triggeredItems[idx];
            // Создаём попап в стиле дублона, но с кастомным текстом
            const popup = document.createElement('div');
            popup.className = 'doubloon-popup';
            popup.innerHTML = `
                <div class="doubloon-star">
                    <svg viewBox="0 0 100 100" width="50" height="50" class="doubloon-svg">
                        <polygon points="50,8 61,38 94,38 67,58 77,90 50,70 23,90 33,58 6,38 39,38" fill="gold" stroke="#fffbe6" stroke-width="2"/>
                    </svg>
                    <span class="doubloon-text">${item.name}${item.id === 'doubloon' ? ': +1 прокрут!' : (item.effect.luck_chance.luck ? `: +${item.effect.luck_chance.luck} к удаче!` : '')}</span>
                </div>
            `;
            // Размещаем поп-ап в левом верхнем углу блока .controls
            const controls = document.querySelector('.controls');
            if (controls) {
                const rect = controls.getBoundingClientRect();
                popup.style.position = 'fixed';
                popup.style.top = (rect.top - 10) + 'px';
                popup.style.left = (rect.left - 10) + 'px';
                popup.style.transform = 'scale(0)';
            }
            document.body.appendChild(popup);
            setTimeout(() => {
                popup.classList.add('show');
                setTimeout(() => {
                    popup.classList.remove('show');
                    popup.classList.add('fade-out');
                    setTimeout(() => {
                        popup.remove();
                        idx++;
                        if (idx < triggeredItems.length) showNext();
                    }, 500);
                }, 1200);
            }, 100);
        }
        showNext();
    }

    function processLuckChanceItems(state) {
        let chanceMultiplier = 1;
        state.inventory.forEach(item => {
            if (item.effect && item.effect.luck_chance_multiplier) {
                chanceMultiplier *= item.effect.luck_chance_multiplier;
            }
        });

        let luckBonus = 0;
        let itemsToRemove = [];
        let triggeredItems = [];
        state.inventory.forEach((item, idx) => {
            if (item.effect && item.effect.luck_chance) {
                const eff = item.effect.luck_chance;
                let chance = eff.chance * chanceMultiplier;
                if (chance > 1) chance = 1;
                if (Math.random() < chance) {
                    triggeredItems.push(item);
                    // Если предмет даёт luck
                    if (eff.luck) {
                        luckBonus += eff.luck;
                        addLog(`${item.name}: +${eff.luck} к удаче (шанс ${(eff.chance*100).toFixed(1)}% x${chanceMultiplier} = ${(chance*100).toFixed(1)}%)!`, 'win');
                    }
                    // Если предмет даёт прокрут (например, Дублон)
                    if (item.id === 'doubloon') {
                        state.spinsLeft += 1;
                        if (typeof showDoubloonPopup === 'function') showDoubloonPopup();
                        addLog(`${item.name}: +1 прокрут! (шанс ${(eff.chance*100).toFixed(1)}% x${chanceMultiplier} = ${(chance*100).toFixed(1)}%)`, 'win');
                    }
                    // Если breakable, уменьшаем uses
                    if (eff.breakable) {
                        if (item.uses === undefined) item.uses = eff.max_uses || 1;
                        item.uses--;
                        if (item.uses <= 0) {
                            addLog(`${item.name} сломался!`, 'loss');
                            itemsToRemove.push(idx);
                        }
                    }
                }
            }
        });
        // Удаляем сломанные предметы
        for (let i = itemsToRemove.length - 1; i >= 0; i--) {
            state.inventory.splice(itemsToRemove[i], 1);
        }
        if (luckBonus > 0) {
            state.tempLuck = (state.tempLuck || 0) + luckBonus;
        }
        // Показываем попапы, если что-то сработало
        if (triggeredItems.length > 0) {
            showLuckChancePopups(triggeredItems);
        }
    }

    async function spin() {
        if (state.spinsLeft <= 0 || state.gameover || state.isSpinning) return;
        
        state.isSpinning = true;
        ui.lever.classList.add('pulled');
        
        // --- ЛОГИКА СЧАСТЛИВОЙ МОНЕТКИ ---
        let freeSpin = false;
        if (hasItem('lucky_penny') && !state.firstSpinUsed) {
            freeSpin = true;
            state.firstSpinUsed = true;
            addLog('Счастливая монетка: первый прокрут бесплатный!', 'win');
        }
        
        // --- ОБРАБОТКА ПРЕДМЕТОВ С ШАНСОМ ---
        processLuckChanceItems(state);

        const oldSpinsLeft = state.spinsLeft;
        if (!freeSpin) {
            state.spinsLeft--;
        }
        
        // Анимируем изменение счётчика прокрутов
        animateSpinsCounter(oldSpinsLeft, state.spinsLeft);
        
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
            run: 1, // <-- теперь всегда сбрасывается на 1
            targetDebt: 66,
            turn: 1,
            coins: 20,
            bankBalance: 0,
            tickets: 5,
            spinsLeft: 0,
            baseInterestRate: 0.30,
            inventory: [],
            shop: [],
            gameover: false,
            isSpinning: false,
            piggyBank: 0,
            tempLuck: 0,
            firstSpinUsed: false,
        };
        // Сброс цен на прокруты к базовым значениям
        CONFIG.SPIN_PACKAGE_1.cost = CONFIG.SPIN_PACKAGE_1.base_cost;
        CONFIG.SPIN_PACKAGE_2.cost = CONFIG.SPIN_PACKAGE_2.base_cost;
        updateInterestRate();
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
        state.firstSpinUsed = false;
        // СНАЧАЛА НАЧИСЛЯЕМ ПРОЦЕНТЫ, ПОТОМ ОБНОВЛЯЕМ СТАВКУ
        // --- ЭФФЕКТ: on_round_start_coins ---
        const roundStartCoins = getItemEffectValue('on_round_start_coins', 0);
        if (roundStartCoins > 0) {
            state.coins += roundStartCoins;
            addLog(`Монеты за раунд: +${roundStartCoins}💰.`, 'win');
        }
        // --- ЭФФЕКТ: free_reroll_per_round ---
        state.freeRerolls = getItemEffectValue('free_reroll_per_round', 0);
        if (state.freeRerolls > 0) {
            addLog(`Бесплатный реролл магазина: ${state.freeRerolls} за раунд.`, 'win');
        }
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
        // ТОЛЬКО ТЕПЕРЬ обновляем ставку
        updateInterestRate();
        
        ui.purchaseModalTitle.textContent = `Раунд ${state.turn}. Время закупаться.`;
        ui.purchaseModalCoins.textContent = `${state.coins}💰`;
        if (ui.purchaseModalDebt) ui.purchaseModalDebt.textContent = `${state.targetDebt}💰`;

        // Обновляем текст на кнопках с актуальными ценами
        ui.btnBuySpins7.textContent = `7 прокрутов + 1🎟️ (${CONFIG.SPIN_PACKAGE_1.cost}💰)`;
        ui.btnBuySpins3.textContent = `3 прокрута + 2🎟️ (${CONFIG.SPIN_PACKAGE_2.cost}💰)`;
        ui.btnBuySpin1.textContent = `1 прокрут (3💰)`;

        ui.btnBuySpins7.disabled = state.coins < CONFIG.SPIN_PACKAGE_1.cost;
        ui.btnBuySpins3.disabled = state.coins < CONFIG.SPIN_PACKAGE_2.cost;
        ui.btnBuySpin1.disabled = state.coins < 3 || state.coins >= CONFIG.SPIN_PACKAGE_2.cost;
        if (state.coins < CONFIG.SPIN_PACKAGE_2.cost) {
            ui.btnBuySpin1.style.display = '';
        } else {
            ui.btnBuySpin1.style.display = 'none';
        }
        ui.spinPurchaseModal.classList.remove('hidden');
        updateUI();

        updateMimicTarget();
    }
    
    function buySpins(pkg) {
        if (pkg === 'single') {
            if (state.coins >= 3) {
                state.coins -= 3;
                state.spinsLeft += 1;
                addLog('Куплен 1 прокрут за 3💰 (без талонов).', 'win');
            } else {
                addLog('Недостаточно наличных.', 'loss');
            }
            ui.spinPurchaseModal.classList.add('hidden');
            updateUI();
            return;
        }
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
        // --- ЭФФЕКТ: on_spin_count_bonus ---
        const spinBonus = getItemEffectValue('on_spin_count_bonus', 0);
        if (spinBonus > 0 && state.spinsLeft === 0) {
            state.coins += spinBonus;
            addLog(`Бонус за все использованные спины: +${spinBonus}💰.`, 'win');
        }
        ui.eorTitle.textContent = `Конец Раунда ${state.turn}`;
        ui.eorCoins.textContent = `${state.coins}💰`;
        ui.eorBank.textContent = `${state.bankBalance}💰`;
        ui.eorDepositAmount.value = '';
        ui.endOfRoundModal.classList.remove('hidden');
    }

    function confirmEndTurn() {
        if (hasItem('scrap_metal') && state.piggyBank > 0) {
            addLog(`💥 Копилка разбита! Вы получили +${state.piggyBank}💰.`, 'win');
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

    // НОВАЯ ФУНКЦИЯ ДЛЯ ПЕРЕХОДА НА СЛЕДУЮЩИЙ ЦИКЛ
    function advanceToNextCycle(bonusCoins = 0, bonusTickets = 0) {
        const totalMoney = state.coins + state.bankBalance;
        const standardTickets = 5 + state.run;
        
        // Показываем модальное окно с результатами
        ui.judgementTitle.textContent = "ДОЛГ ВЫПЛАЧЕН";
        ui.judgementTitle.classList.remove('failure');
        
        let bonusText = '';
        if (bonusCoins > 0 || bonusTickets > 0) {
            bonusText = `Бонус за быстроту: <span style=\"color:var(--money-color)\">+${bonusCoins}💰</span> и <span style=\"color:var(--ticket-color)\">+${bonusTickets}🎟️</span>.<br>`;
        }
        
        ui.judgementText.innerHTML = `Вы выжили. Весь баланс <span style=\"color:var(--money-color)\">${totalMoney}💰</span> переведен в банк.<br>
            Стандартная награда: <span style=\"color:var(--ticket-color)\">${standardTickets}🎟️</span>.<br>
            ${bonusText}`;
        
        ui.judgementContinue.onclick = function() {
            ui.judgementModal.classList.add('hidden');
            
            state.run++;
            state.turn = 1;
            
            // Фиксированные значения для первых циклов, далее экспоненциально
            if (state.run === 2) state.targetDebt = 111;
            else if (state.run === 3) state.targetDebt = 666;
            else if (state.run === 4) state.targetDebt = 3333;
            else if (state.run === 5) state.targetDebt = 8888;
            else {
                state.targetDebt = Math.min(Math.floor(state.targetDebt * 2.5 + 10000), 88888888);
            }
            
            // Обновляем цены на прокруты
            CONFIG.SPIN_PACKAGE_1.cost = CONFIG.SPIN_PACKAGE_1.base_cost + (state.run - 1) * 10;
            CONFIG.SPIN_PACKAGE_2.cost = CONFIG.SPIN_PACKAGE_2.base_cost + (state.run - 1) * 10;
            
            state.bankBalance = totalMoney;
            state.coins = bonusCoins;
            state.tickets += standardTickets + bonusTickets;
            state.spinsLeft = 0;
            
            updateInterestRate();
            addLog(`Новый Цикл Долга #${state.run} начался. Цель: ${state.targetDebt}💰.`);
            if (bonusCoins > 0 || bonusTickets > 0) addLog(`Бонус за быстроту: +${bonusCoins}💰 и +${bonusTickets}🎟️`, 'win');
            populateShop();
            startTurn();
        };
        
        ui.judgementModal.classList.remove('hidden');
    }

    // ОБНОВЛЕННАЯ ФУНКЦИЯ ДЛЯ СУДНОГО ДНЯ
    function judgementDay() {
        const totalMoney = state.coins + state.bankBalance;
        addLog(`СУДНЫЙ ДЕНЬ. Ваша сумма: ${totalMoney}💰. Требуется: ${state.targetDebt}💰.`);
        
        if (state.targetDebt >= 88888888) {
             if (totalMoney >= 88888888) {
                ui.judgementTitle.textContent = "ПОБЕДА!";
                ui.judgementTitle.classList.remove('failure');
                ui.judgementText.innerHTML = `Вы выплатили весь долг! Поздравляем, вы победили!<br>Ваш путь завершён.`;
                ui.judgementContinue.onclick = () => { ui.judgementModal.classList.add('hidden'); gameOver(); };
             } else {
                ui.judgementTitle.textContent = "ПРОВАЛ";
                ui.judgementTitle.classList.add('failure');
                ui.judgementText.textContent = `Вы не смогли выплатить финальный долг. Яма ждет.`;
                ui.judgementContinue.onclick = () => { ui.judgementModal.classList.add('hidden'); gameOver(); };
             }
             ui.judgementModal.classList.remove('hidden');
             return;
        }

        if (totalMoney >= state.targetDebt) {
            // На 3-й день бонусов нет, вызываем advanceToNextCycle без доп. параметров
            advanceToNextCycle(); 
        } else {
            ui.judgementTitle.textContent = "ПРОВАЛ";
            ui.judgementTitle.classList.add('failure');
            ui.judgementText.textContent = `Вы не смогли собрать нужную сумму. Яма ждет.`;
            ui.judgementContinue.onclick = function() {
                ui.judgementModal.classList.add('hidden');
                gameOver();
            };
            ui.judgementModal.classList.remove('hidden');
        }
    }

    // НОВАЯ ФУНКЦИЯ ДЛЯ ДОСРОЧНОЙ ВЫПЛАТЫ
    function payDebtEarly() {
        if (state.turn >= 3) return; // Бонуса нет на 3-м раунде
        const totalMoney = state.coins + state.bankBalance;
        if (totalMoney < state.targetDebt) return; // Проверяем общую сумму

        let bonusCoins = 0;
        let bonusTickets = 0;

        if (state.turn === 1) {
            bonusCoins = Math.floor(state.targetDebt * 0.25);
            bonusTickets = 5 + state.run;
            addLog('Досрочное погашение в 1-й раунд!', 'win');
        } else if (state.turn === 2) {
            bonusCoins = Math.floor(state.targetDebt * 0.10);
            bonusTickets = 2 + state.run;
            addLog('Досрочное погашение во 2-й раунд!', 'win');
        }

        // Сначала используем наличные
        if (state.coins >= state.targetDebt) {
            state.coins -= state.targetDebt;
        } else {
            // Если наличных не хватает, берем из банка
            const fromBank = state.targetDebt - state.coins;
            state.bankBalance -= fromBank;
            state.coins = 0;
        }
        
        // В банк вносим ровно сумму долга
        state.bankBalance = state.targetDebt;

        // Показываем модальное окно с результатами
        ui.judgementTitle.textContent = "ДОЛГ ВЫПЛАЧЕН";
        ui.judgementTitle.classList.remove('failure');
        
        let bonusText = '';
        if (bonusCoins > 0 || bonusTickets > 0) {
            bonusText = `Бонус за быстроту: <span style=\"color:var(--money-color)\">+${bonusCoins}💰</span> и <span style=\"color:var(--ticket-color)\">+${bonusTickets}🎟️</span>.<br>`;
        }
        
        ui.judgementText.innerHTML = `Вы выжили. Долг погашен.<br>
            Стандартная награда: <span style=\"color:var(--ticket-color)\">${5 + state.run}🎟️</span>.<br>
            ${bonusText}`;
        
        ui.judgementContinue.onclick = function() {
            ui.judgementModal.classList.add('hidden');
            
            state.run++;
            state.turn = 1;
            
            // Фиксированные значения для первых циклов, далее экспоненциально
            if (state.run === 2) state.targetDebt = 111;
            else if (state.run === 3) state.targetDebt = 666;
            else if (state.run === 4) state.targetDebt = 3333;
            else if (state.run === 5) state.targetDebt = 8888;
            else {
                state.targetDebt = Math.min(Math.floor(state.targetDebt * 2.5 + 10000), 88888888);
            }
            
            // Обновляем цены на прокруты
            CONFIG.SPIN_PACKAGE_1.cost = CONFIG.SPIN_PACKAGE_1.base_cost + (state.run - 1) * 10;
            CONFIG.SPIN_PACKAGE_2.cost = CONFIG.SPIN_PACKAGE_2.base_cost + (state.run - 1) * 10;
            
            // Банк остается как есть (равен сумме предыдущего долга)
            // В наличные добавляем бонусные монеты
            state.coins += bonusCoins;
            state.tickets += (5 + state.run) + bonusTickets;
            state.spinsLeft = 0;
            
            updateInterestRate();
            addLog(`Новый Цикл Долга #${state.run} начался. Цель: ${state.targetDebt}💰.`);
            if (bonusCoins > 0 || bonusTickets > 0) addLog(`Бонус за быстроту: +${bonusCoins}💰 и +${bonusTickets}🎟️`, 'win');
            populateShop();
            startTurn();
        };
        
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
        // --- ЭФФЕКТ: free_reroll_per_round ---
        if (state.freeRerolls && state.freeRerolls > 0) {
            state.freeRerolls--;
            populateShop();
            addLog('Бесплатный реролл магазина!', 'win');
            // --- ЭФФЕКТ: resellers_ticket ---
            if (hasItem('resellers_ticket')) {
                state.tickets += 1;
                addLog('Билет перекупщика: +1🎟️ за реролл!', 'win');
            }
            updateUI();
            return;
        }
        if (state.tickets >= CONFIG.REROLL_COST) {
            state.tickets -= CONFIG.REROLL_COST;
            populateShop();
            addLog(`Магазин обновлен за ${CONFIG.REROLL_COST}🎟️.`);
            // --- ЭФФЕКТ: resellers_ticket ---
            if (hasItem('resellers_ticket')) {
                state.tickets += 1;
                addLog('Билет перекупщика: +1🎟️ за реролл!', 'win');
            }
            updateUI();
        } else { addLog('Недостаточно талонов.', 'loss'); }
    }

    function buyItem(itemId) {
        if (state.inventory.length >= 9) {
            addLog('В инвентаре максимум 9 амулетов!', 'loss');
            return;
        }
        const item = state.shop.find(i => i.id === itemId);
        if (!item || state.tickets < item.cost) return addLog('Недостаточно талонов.', 'loss');
        state.tickets -= item.cost;
        state.inventory.push(item);
        state.shop = state.shop.filter(i => i.id !== itemId);
        addLog(`Куплен амулет: ${item.name}`, 'win');
        updateMimicTarget();
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
        if (ui.statDebtStart) ui.statDebtStart.textContent = `${state.targetDebt}💰`;
        ui.statCoins.textContent = `${state.coins}💰`;
        ui.bankBalance.textContent = `${state.bankBalance}💰`;
        ui.statTickets.textContent = `${state.tickets}🎟️`;
        const baseLuck = getItemEffectValue('luck', 0);
        const debtLuck = getItemEffectValue('per_run_bonus.luck', 0) * state.run;
        let luckText = `${baseLuck}`;
        if (debtLuck > 0) luckText += ` (+${debtLuck} от долга)`;
        if (state.tempLuck > 0) luckText += ` (+${state.tempLuck})`;
        ui.statLuck.textContent = luckText;
        if (!ui.spinsLeft.querySelector('.spins-counter')) {
            ui.spinsLeft.textContent = state.spinsLeft;
        }
        ui.atmInterestRate.textContent = (state.baseInterestRate * 100).toFixed(0);
        
        let bonus = state.inventory.reduce((acc, item) => acc + (item.effect?.interest_rate_bonus || 0), 0);
        let bonusText = '';
        if (bonus > 0) bonusText = ` <span style="color:var(--highlight-color); font-size:12px;">(+${(bonus*100).toFixed(0)}% от предметов)</span>`;
        let percent = state.baseInterestRate;
        let bank = state.bankBalance;
        let profit = Math.floor(bank * percent);
        let profitText = `<div style='font-size:13px; margin-top:4px;'>След. процент: <b style='color:var(--money-color)'>+${profit}💰</b> (${(percent*100).toFixed(0)}%${bonusText})</div>`;
        let infoBlock = document.getElementById('interest-info-block');
        if (!infoBlock) {
            infoBlock = document.createElement('div');
            infoBlock.id = 'interest-info-block';
            ui.atmInterestRate.parentElement.parentElement.appendChild(infoBlock);
        }
        infoBlock.innerHTML = profitText;
        
        // ОБНОВЛЕНИЕ СЕКЦИИ ДОСРОЧНОГО ПОГАШЕНИЯ
        if (state.turn >= 3) {
            ui.earlyPayoffSection.style.display = 'none';
        } else {
            ui.earlyPayoffSection.style.display = 'block';
            const totalMoney = state.coins + state.bankBalance;
            const canAfford = totalMoney >= state.targetDebt; // Проверяем общую сумму
            ui.btnPayDebtEarly.disabled = !canAfford;

            let bonusInfo = '';
            if (state.turn === 1) {
                const bCoins = Math.floor(state.targetDebt * 0.25);
                const bTickets = 5 + state.run;
                bonusInfo = `Награда за раунд 1: <b style="color:var(--money-color)">+${bCoins}💰</b> и <b style="color:var(--ticket-color)">+${bTickets}🎟️</b>`;
            } else if (state.turn === 2) {
                const bCoins = Math.floor(state.targetDebt * 0.10);
                const bTickets = 2 + state.run;
                bonusInfo = `Награда за раунд 2: <b style="color:var(--money-color)">+${bCoins}💰</b> и <b style="color:var(--ticket-color)">+${bTickets}🎟️</b>`;
            }
            ui.earlyPayoffBonusInfo.innerHTML = bonusInfo;
        }

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

    // --- NEW: HELPER FUNCTION TO CREATE ITEM ELEMENTS ---
    function createItemElement(item, purchaseCallback) {
        const itemDiv = document.createElement('div');
        itemDiv.className = `item rarity-${item.rarity}`;
        
        // Set click handlers
        if (purchaseCallback) {
            itemDiv.onclick = () => purchaseCallback(item.id);
            if (state.tickets < item.cost || state.inventory.length >= 9) {
                itemDiv.style.opacity = '0.5';
                itemDiv.style.cursor = 'not-allowed';
            }
        } else {
            itemDiv.style.cursor = 'pointer';
            itemDiv.onclick = () => showAmuletPopup(item);
        }

        // Thumbnail
        const thumbnailDiv = document.createElement('div');
        thumbnailDiv.className = 'item-thumbnail';
        const thumbnailValue = item.thumbnail || '?';
        if (thumbnailValue.endsWith('.png') || thumbnailValue.endsWith('.jpg') || thumbnailValue.endsWith('.gif')) {
            thumbnailDiv.innerHTML = `<img src="img/${thumbnailValue}" alt="${item.name}" style="width:100%; height:100%; object-fit:cover;">`;
        } else {
            thumbnailDiv.textContent = thumbnailValue;
        }

        // Info container
        const infoDiv = document.createElement('div');
        infoDiv.className = 'item-info';
        
        // Header (Name + Cost)
        const headerDiv = document.createElement('div');
        headerDiv.className = 'item-header';
        
        const nameSpan = document.createElement('span');
        nameSpan.className = 'item-name';
        nameSpan.textContent = item.name;
        
        headerDiv.appendChild(nameSpan);

        if (purchaseCallback && item.cost) {
            const costSpan = document.createElement('span');
            costSpan.className = 'item-cost';
            costSpan.textContent = `${item.cost}🎟️`;
            headerDiv.appendChild(costSpan);
        }
        
        // Description
        const descP = document.createElement('p');
        descP.className = 'item-desc';
        descP.innerHTML = item.desc; // Use innerHTML to support potential formatting
        
        // Assembling info
        infoDiv.appendChild(headerDiv);
        infoDiv.appendChild(descP);

        // Add uses info if applicable
        if (item.effect?.luck_chance?.breakable) {
            const maxUses = item.effect.luck_chance.max_uses || item.uses || 10;
            const usesSpan = document.createElement('span');
            usesSpan.style.cssText = 'color:#ffab40; font-size:11px; margin-top: auto;';
            usesSpan.textContent = `(Исп: ${item.uses !== undefined ? item.uses : maxUses}/${maxUses})`;
            infoDiv.appendChild(usesSpan);
        }

        // Add mimic info if applicable
        if(item.id === 'mimic_chest') {
            let mimicInfoText = '';
            if(item.effect?.mimic?.target) {
                const target = ALL_ITEMS.find(i => i.id === item.effect.mimic.target);
                mimicInfoText = target ? `Копирует: <b>${target.name}</b>` : `Цель не найдена`;
            } else {
                mimicInfoText = `<i>Нет цели для копирования</i>`;
            }
            const mimicDiv = document.createElement('div');
            mimicDiv.style.cssText = 'color:#b388ff; font-size:11px; margin-top: auto;';
            mimicDiv.innerHTML = mimicInfoText;
            infoDiv.appendChild(mimicDiv);
        }

        // Assembling the final item element
        itemDiv.appendChild(thumbnailDiv);
        itemDiv.appendChild(infoDiv);

        return itemDiv;
    }

    function renderShop() {
        ui.shopItems.innerHTML = '';
        if (state.shop.length === 0) {
            ui.shopItems.innerHTML = '<p style="text-align:center; color: #777;">Пусто</p>';
        }
        state.shop.forEach(item => {
            const itemDiv = createItemElement(item, buyItem);
            ui.shopItems.appendChild(itemDiv);
        });
    }

    // --- ПОПАП КАРТОЧКИ АМУЛЕТА ---
    let amuletPopup = null;
    function showAmuletPopup(item) {
        if (amuletPopup) amuletPopup.remove();
        amuletPopup = document.createElement('div');
        amuletPopup.className = 'amulet-popup-overlay';
        
        const thumbnailValue = item.thumbnail || '?';
        let thumbnailHTML = '';
        if (thumbnailValue.endsWith('.png') || thumbnailValue.endsWith('.jpg') || thumbnailValue.endsWith('.gif')) {
            thumbnailHTML = `<img src="img/${thumbnailValue}" alt="${item.name}" style="max-width: 100%; max-height: 100%; object-fit: contain;">`;
        } else {
            thumbnailHTML = thumbnailValue;
        }
        
        amuletPopup.innerHTML = `
            <div class="amulet-popup-card">
                <div class="amulet-popup-thumbnail">${thumbnailHTML}</div>
                <div class="amulet-popup-title">${item.name}</div>
                <div class="amulet-popup-desc">${item.desc}</div>
                <div style="margin-top: 20px;">
                    <button class="amulet-popup-remove">Выкинуть</button>
                    <button class="amulet-popup-close">Закрыть</button>
                </div>
            </div>
        `;
        document.body.appendChild(amuletPopup);
        // Кнопка закрыть
        amuletPopup.querySelector('.amulet-popup-close').onclick = () => amuletPopup.remove();
        // Клик вне карточки
        amuletPopup.onclick = (e) => { if (e.target === amuletPopup) amuletPopup.remove(); };
        // Кнопка выкинуть
        amuletPopup.querySelector('.amulet-popup-remove').onclick = () => {
            removeAmulet(item.id);
            amuletPopup.remove();
        };
    }
    function removeAmulet(itemId) {
        // Находим амулет в инвентаре
        const idx = state.inventory.findIndex(i => i.id === itemId);
        if (idx !== -1) {
            // Удаляем из инвентаря
            const [removed] = state.inventory.splice(idx, 1);
            // Возвращаем в пул магазина (ALL_ITEMS)
            if (!ALL_ITEMS.some(i => i.id === removed.id)) {
                ALL_ITEMS.push(removed);
            }
            // Возврат талонов за редкие и легендарные
            let refund = 0;
            if (removed.rarity === 'rare') refund = 2;
            if (removed.rarity === 'legendary') refund = 3;
            if (refund > 0) {
                state.tickets += refund;
                addLog(`Вы получили обратно ${refund} 🎟️ за выкинутый амулет (${removed.rarity === 'rare' ? 'редкий' : 'легендарный'}).`, 'win');
            }
            addLog(`Амулет "${removed.name}" выкинут и снова может появиться в магазине.`, 'loss');
            updateMimicTarget();
            updateUI();
        }
    }

    function renderInventory() {
        ui.inventoryItems.innerHTML = '';
        let counter = document.getElementById('inventory-counter');
        if (!counter) {
            counter = document.createElement('div');
            counter.id = 'inventory-counter';
            counter.style.textAlign = 'right';
            counter.style.fontSize = '13px';
            counter.style.marginBottom = '4px';
            ui.inventoryItems.parentElement.insertBefore(counter, ui.inventoryItems);
        }
        counter.textContent = `Амулеты: ${state.inventory.length} / 9`;
        if (state.inventory.length >= 9) {
            counter.style.color = 'var(--danger-color)';
            counter.style.fontWeight = 'bold';
            counter.style.textShadow = '0 0 6px var(--danger-color)';
        } else {
            counter.style.color = '';
            counter.style.fontWeight = '';
            counter.style.textShadow = '';
        }
        if (state.inventory.length === 0) {
            ui.inventoryItems.innerHTML = '<p style="text-align:center; color: #777; grid-column: 1 / -1;">Пусто</p>';
        }
        state.inventory.forEach(item => {
            const itemDiv = createItemElement(item, null);
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
        if (state.shop.length === 0) {
            ui.planningShopItems.innerHTML = '<p style="text-align:center; color: #777;">Пусто</p>';
        }
        state.shop.forEach(item => {
            const itemDiv = createItemElement(item, buyItem);
            ui.planningShopItems.appendChild(itemDiv);
        });
    }

    function renderPlanningInventory() {
        ui.planningInventoryItems.innerHTML = '';
        let counter = document.getElementById('planning-inventory-counter');
        if (!counter) {
            counter = document.createElement('div');
            counter.id = 'planning-inventory-counter';
            counter.style.textAlign = 'right';
            counter.style.fontSize = '13px';
            counter.style.marginBottom = '4px';
            ui.planningInventoryItems.parentElement.insertBefore(counter, ui.planningInventoryItems);
        }
        counter.textContent = `Амулеты: ${state.inventory.length} / 9`;
        if (state.inventory.length >= 9) {
            counter.style.color = 'var(--danger-color)';
            counter.style.fontWeight = 'bold';
            counter.style.textShadow = '0 0 6px var(--danger-color)';
        } else {
            counter.style.color = '';
            counter.style.fontWeight = '';
            counter.style.textShadow = '';
        }
        if (state.inventory.length === 0) {
            ui.planningInventoryItems.innerHTML = '<p style="text-align:center; color: #777; grid-column: 1 / -1;">Пусто</p>';
        }
        state.inventory.forEach(item => {
            const itemDiv = createItemElement(item, null);
            ui.planningInventoryItems.appendChild(itemDiv);
        });
    }

    function rerollPlanningShop() {
        if (state.tickets >= CONFIG.REROLL_COST) {
            state.tickets -= CONFIG.REROLL_COST;
            populateShop();
            addLog(`Магазин обновлен за ${CONFIG.REROLL_COST}🎟️.`);
            // --- ЭФФЕКТ: resellers_ticket ---
            if (hasItem('resellers_ticket')) {
                state.tickets += 1;
                addLog('Билет перекупщика: +1🎟️ за реролл!', 'win');
            }
            ui.planningTickets.textContent = state.tickets;
            renderPlanningShop();
            updateUI();
        } else { addLog('Недостаточно талонов.', 'loss'); }
    }

    // --- ДОБАВЛЯЕМ ФУНКЦИЮ ДЛЯ ПОДСЧЁТА МИНИМАЛЬНОЙ СТАВКИ ---
    function getMinInterestRate() {
        let min = 0.03;
        const bonus = state.inventory.reduce((acc, item) => acc + (item.effect?.interest_rate_bonus || 0), 0);
        const floor = state.inventory.reduce((acc, item) => acc + (item.effect?.min_interest_rate_floor || 0), 0);
        return min + bonus + floor;
    }

    // --- ФУНКЦИЯ ДЛЯ ОБНОВЛЕНИЯ СТАВКИ ---
    function updateInterestRate() {
        // Базовая ставка 30% (0.30)
        let base = 0.30;
        // Снижение за циклы (run)
        base -= (state.run - 1) * 0.03;
        // Снижение за дни (turn)
        base -= (state.turn - 1) * 0.10;
        // Минимум
        const minRate = getMinInterestRate();
        if (base < minRate) base = minRate;
        state.baseInterestRate = base;
    }

    // --- ВЫБОР ЦЕЛИ ДЛЯ СУНДУКА-МИМИКА ---
    function updateMimicTarget() {
        const mimicItem = state.inventory.find(item => item.id === 'mimic_chest');
        if (mimicItem) {
            // Выбираем случайный амулет, кроме самого мимика
            const candidates = state.inventory.filter(item => item.id !== 'mimic_chest');
            if (candidates.length > 0) {
                const target = candidates[Math.floor(Math.random() * candidates.length)];
                mimicItem.effect.mimic = { target: target.id };
                console.log('[DEBUG] Сундук-Мимик выбрал цель:', target);
            } else {
                mimicItem.effect.mimic = { target: undefined };
                console.log('[DEBUG] Сундук-Мимик: нет других амулетов для копирования');
            }
        }
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
    ui.btnBuySpin1.onclick = () => buySpins('single');
    ui.btnBuyNothing.onclick = () => buySpins(null);
    ui.btnRerollShop.onclick = rerollShop;
    ui.btnPlanning.onclick = openPlanningMode;
    ui.btnPlanningReroll.onclick = rerollPlanningShop;
    ui.btnFinishPlanning.onclick = closePlanningMode;
    ui.btnPayDebtEarly.onclick = payDebtEarly; // Добавляем новый обработчик

    ui.startScreen.classList.remove('hidden');

    // --- DEV MENU ---
    const devBtn = document.getElementById('dev-menu-btn');
    const devModal = document.getElementById('dev-menu-modal');
    const devAddCoins = document.getElementById('dev-add-coins');
    const devAddTickets = document.getElementById('dev-add-tickets');
    const devSetInterest = document.getElementById('dev-set-interest');
    const devGiveItem = document.getElementById('dev-give-item');
    const devClose = document.getElementById('dev-close-menu');
    const devItemSelect = document.getElementById('dev-item-select');
    const devSymbolChances = document.getElementById('dev-symbol-chances');
    const devApplyChances = document.getElementById('dev-apply-chances');
    const devApplyLuck = document.getElementById('dev-apply-luck');
    const devLuckInput = document.getElementById('dev-luck-input');

    devBtn.onclick = () => { 
        devModal.classList.remove('hidden');
        // Заполнить список предметов
        devItemSelect.innerHTML = '';
        ALL_ITEMS.forEach(item => {
            const opt = document.createElement('option');
            opt.value = item.id;
            opt.textContent = `${item.name} (${item.rarity})`;
            devItemSelect.appendChild(opt);
        });
        // Отобразить шансы символов
        devSymbolChances.innerHTML = '';
        SYMBOLS.forEach((sym, idx) => {
            const row = document.createElement('div');
            row.style.display = 'flex';
            row.style.alignItems = 'center';
            row.style.gap = '8px';
            row.style.marginBottom = '2px';
            row.innerHTML = `<span style='width:30px;'>${sym.graphic}</span><input type='number' min='1' style='width:60px;' id='dev-sym-${idx}' value='${sym.weight}'>`;
            devSymbolChances.appendChild(row);
        });
        // Подставить текущее значение временной удачи
        devLuckInput.value = state.tempLuck;
    };
    devClose.onclick = () => { devModal.classList.add('hidden'); };
    devAddCoins.onclick = () => { state.coins += 1000; addLog('Dev: +1000 монет', 'win'); updateUI(); };
    devAddTickets.onclick = () => { state.tickets += 100; addLog('Dev: +100 талонов', 'win'); updateUI(); };
    devSetInterest.onclick = () => { state.baseInterestRate = 0.5; addLog('Dev: Ставка установлена 50%', 'win'); updateUI(); };
    devGiveItem.onclick = () => {
        const id = devItemSelect.value;
        if (!state.inventory.some(i => i.id === id)) {
            const item = ALL_ITEMS.find(i => i.id === id);
            state.inventory.push(item);
            addLog(`Dev: Выдан предмет: ${item.name}`, 'win');
            updateUI();
        } else {
            addLog('Dev: Этот предмет уже есть в инвентаре.', 'loss');
        }
    };
    devApplyChances.onclick = () => {
        SYMBOLS.forEach((sym, idx) => {
            const val = parseInt(document.getElementById(`dev-sym-${idx}`).value, 10);
            if (!isNaN(val) && val > 0) sym.weight = val;
        });
        updateWeightedSymbols();
        addLog('Dev: Шансы символов обновлены.', 'win');
    };
    devApplyLuck.onclick = () => {
        const val = parseInt(devLuckInput.value, 10);
        if (!isNaN(val)) {
            state.tempLuck = val;
            addLog(`Dev: Временная удача установлена: ${val}`, 'win');
            // Вывести итоговую удачу и веса символов (только уникальные)
            const totalLuck = getItemEffectValue('luck', 0) + state.tempLuck + (hasItem('growing_debt') ? getItemEffectValue('per_run_bonus.luck', 0, 'sum') * state.run : 0);
            let weights = SYMBOLS.map(s => `${s.graphic}:${s.weight}`).join(' ');
            addLog(`Dev: Итоговая удача: ${totalLuck}, веса: ${weights}`);
            devDebugLuck = true;
            updateUI();
        }
    };

    window.showDoubloonPopup = function() {
        const popup = document.createElement('div');
        popup.className = 'doubloon-popup';
        popup.innerHTML = `
            <div class="doubloon-star">
                <svg viewBox="0 0 100 100" width="50" height="50" class="doubloon-svg">
                    <polygon points="50,8 61,38 94,38 67,58 77,90 50,70 23,90 33,58 6,38 39,38" fill="gold" stroke="#fffbe6" stroke-width="2"/>
                </svg>
                <span class="doubloon-text">Дублон +1</span>
            </div>
        `;
        // Размещаем поп-ап в левом верхнем углу блока .controls
        const controls = document.querySelector('.controls');
        if (controls) {
            const rect = controls.getBoundingClientRect();
            popup.style.position = 'fixed';
            popup.style.top = (rect.top - 10) + 'px';
            popup.style.left = (rect.left - 10) + 'px';
            popup.style.transform = 'scale(0)';
        }
        document.body.appendChild(popup);
        setTimeout(() => {
            popup.classList.add('show');
            setTimeout(() => {
                popup.classList.remove('show');
                popup.classList.add('fade-out');
                setTimeout(() => popup.remove(), 500);
            }, 1800);
        }, 100);
    }

    // --- ДОБАВЛЯЮ ОТОБРАЖЕНИЕ ДОЛГА НА СТАРТЕ ---
    function updateStartDebt() {
        const el = document.getElementById('start-debt-value');
        if (el) el.textContent = state.targetDebt;
    }
    // --- МИНИ-ТУТОРИАЛ ---
    const tutorialPages = [
        {
            title: 'Цель игры',
            text: 'Ваша задача — выплатить долг за 3 раунда. Каждый цикл долг увеличивается. Достигните 88,888,888💰, чтобы победить!'
        },
        {
            title: 'Прокруты и банк',
            text: 'Покупайте прокруты за монеты, выигрывайте и вносите деньги в банк. В конце каждого раунда банк приносит проценты.'
        },
        {
            title: 'Амулеты и магазин',
            text: 'Покупайте амулеты за талоны. Амулеты дают бонусы: больше выигрышей, проценты, уникальные эффекты.'
        },
        {
            title: 'Планирование и удача',
            text: 'Планируйте покупки, используйте удачу и бонусы, чтобы пройти все циклы и выплатить долг!'
        }
    ];
    let tutorialIndex = 0;
    function showTutorialPage(idx) {
        const pages = document.getElementById('tutorial-pages');
        if (!pages) return;
        const page = tutorialPages[idx];
        pages.innerHTML = `<h3>${page.title}</h3><p>${page.text}</p><div style='text-align:center;margin-top:10px;color:#aaa;'>Страница ${idx+1} / ${tutorialPages.length}</div>`;
        document.getElementById('tutorial-prev').disabled = idx === 0;
        document.getElementById('tutorial-next').disabled = idx === tutorialPages.length-1;
    }
    function openTutorial() {
        document.getElementById('tutorial-modal').classList.remove('hidden');
        showTutorialPage(tutorialIndex);
    }
    function closeTutorial() {
        document.getElementById('tutorial-modal').classList.add('hidden');
    }
    // --- Навешиваем обработчики для туториала ---
    const btnShowTutorial = document.getElementById('btn-show-tutorial');
    if (btnShowTutorial) btnShowTutorial.onclick = openTutorial;
    const tutorialPrev = document.getElementById('tutorial-prev');
    const tutorialNext = document.getElementById('tutorial-next');
    const tutorialClose = document.getElementById('tutorial-close');
    if (tutorialPrev) tutorialPrev.onclick = () => { if (tutorialIndex > 0) { tutorialIndex--; showTutorialPage(tutorialIndex); } };
    if (tutorialNext) tutorialNext.onclick = () => { if (tutorialIndex < tutorialPages.length-1) { tutorialIndex++; showTutorialPage(tutorialIndex); } };
    if (tutorialClose) tutorialClose.onclick = closeTutorial;
    // Обновлять сумму долга на старте
    const origInitGame = initGame;
    initGame = function() {
        origInitGame.apply(this, arguments);
        updateStartDebt();
    };
});