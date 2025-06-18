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
    const GRAPHICS = { // Emojis replaced with more thematic symbols
        lemon: '💀', cherry: '🩸', clover: '👁️', bell: '⛓️', diamond: '❖', coins: '⚙️', seven: '7',
    };
    const SYMBOLS = [
        { id: 'lemon',    value: 2, weight: 194, graphic: GRAPHICS.lemon },   // Skull
        { id: 'cherry',   value: 2, weight: 194, graphic: GRAPHICS.cherry },  // Blood Drop
        { id: 'clover',   value: 3, weight: 149, graphic: GRAPHICS.clover },  // Eye
        { id: 'bell',     value: 3, weight: 149, graphic: GRAPHICS.bell },    // Chains
        { id: 'diamond',  value: 5, weight: 119, graphic: GRAPHICS.diamond }, // Rune
        { id: 'coins',    value: 5, weight: 119, graphic: GRAPHICS.coins },   // Cog/Shard
        { id: 'seven',    value: 7, weight: 75,  graphic: GRAPHICS.seven },   // The Number 7
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

    let state = {};
    let weightedSymbols = [];
    let devDebugLuck = false;

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
            // console.log('[DEBUG] Сундук-Мимик: mimicItem=', mimicItem, 'targetId=', targetId, 'target=', target);
            if (target) items.push({...target, id: 'mimic_copy'});
        }
        return items.reduce((acc, item) => {
            if (item.effect && item.effect[effectKey] !== undefined) {
                if (accumulator === 'multiply') return acc * item.effect[effectKey];
                return acc + item.effect[effectKey];
            }
            return acc;
        }, defaultValue);
    }
    function addLog(message, type = 'normal') {
        const logEntry = document.createElement('p');
        logEntry.textContent = `> ${message}`;
        if (type === 'win') logEntry.style.color = 'var(--highlight-color)';
        if (type === 'loss') logEntry.style.color = 'var(--danger-color)';
        ui.logPanel.insertBefore(logEntry, ui.logPanel.firstChild);
        if (ui.logPanel.children.length > 50) ui.logPanel.removeChild(ui.logPanel.lastChild);
    }

    function updateWeightedSymbols() {
        let currentSymbols = [...SYMBOLS];
        // Применяем эффект "Фильтр Душ"
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
                addLog(`Кровавый Ритуал: -${effect.cost}⚙️, +${effect.bonus.luck} к удаче.`, 'win');
            }
        }
        
        const perRunLuck = hasItem('growing_debt') ? getItemEffectValue('per_run_bonus.luck', 0, 'sum') * state.run : 0;

        const totalLuck = getItemEffectValue('luck', 0) + state.tempLuck + tempLuck + perRunLuck;
        
        let adjustedSymbols = weightedSymbols.map(symbol => {
            let newWeight = symbol.weight + Math.floor(symbol.value * totalLuck * 2);
            return { ...symbol, weight: newWeight };
        });

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
        }
        // --- ЭФФЕКТ: sync_cells ---
        const sync = state.inventory.find(item => item.effect?.sync_cells);
        if (sync) {
            const positions = sync.effect.sync_cells.cells;
            if (Array.isArray(positions) && positions.length > 0 && grid.length > 0) {
                const symbol = grid[positions[0]];
                positions.forEach(pos => grid[pos] = symbol);
            }
        }

        return grid;
    }

    function calculateWinnings() {
        let grid = [...state.grid];
        let totalWinnings = 0;
        const allWinningPositions = new Set();
        let winningLinesInfo = [];
        
        const wildSymbolId = state.inventory.find(item => item.effect?.wild_symbol)?.effect.wild_symbol;

        // --- 0. ПРЕДВАРИТЕЛЬНЫЕ ЭФФЕКТЫ ---
        state.tempLuck = 0; // Сбрасываем временную удачу от "Контракт на Крови"
        state.inventory.forEach(item => {
            if (item.effect?.temporary_luck_on_spin) {
                const symbolId = item.effect.temporary_luck_on_spin;
                const count = grid.filter(s => s.id === symbolId).length;
                if (count > 0) { state.tempLuck += count; }
            }
        });
        if(state.tempLuck > 0) addLog(`Контракт на Крови: +${state.tempLuck} к временной удаче.`, 'win');

        const substitutions = state.inventory.filter(item => item.effect?.substitute).map(item => item.effect.substitute);
        if (substitutions.length > 0) {
            let substitutionLogged = false;
            grid = grid.map(symbol => {
                const sub = substitutions.find(s => s.from === symbol.id);
                if (sub) {
                    if(!substitutionLogged) { addLog(`Алхимия: 💀 стали 👁️.`, 'win'); substitutionLogged = true; }
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

        if (payBothWays) {
            const mirrored = activePaylines.filter(l => l.scannable).map(line => ({
                ...line,
                name: line.name + ' (обратно)',
                positions: [...line.positions].reverse(),
            }));
            activePaylines = activePaylines.concat(mirrored);
        }

        const symbolMultipliers = {};
        state.inventory.forEach(item => {
            if (item.effect?.symbol_value_multiplier) {
                const eff = item.effect.symbol_value_multiplier;
                symbolMultipliers[eff.symbol] = (symbolMultipliers[eff.symbol] || 1) * eff.multiplier;
            }
        });
        const lineLengthBonuses = {};
        state.inventory.forEach(item => {
            if (item.effect?.line_length_win_bonus) {
                const eff = item.effect.line_length_win_bonus;
                lineLengthBonuses[eff.length] = (lineLengthBonuses[eff.length] || 0) + eff.bonus;
            }
        });
        const lineWinBonuses = {};
        state.inventory.forEach(item => {
            if (item.effect?.on_line_win_bonus) {
                const eff = item.effect.on_line_win_bonus;
                lineWinBonuses[eff.length] = (lineWinBonuses[eff.length] || 0) + eff.tickets;
            }
        });

        activePaylines.forEach(line => {
            const symbolsOnLine = line.positions.map(pos => grid[pos]);

            if (line.scannable) {
                const lengthMultipliers = { 3: 1, 4: 2, 5: 3 };
                let i = 0;
                while (i < symbolsOnLine.length) {
                    const currentSymbol = symbolsOnLine[i];
                    let comboLength = 1;
                    let isWildMatch = false;

                    if (wildSymbolId && currentSymbol.id === wildSymbolId) {
                        isWildMatch = true;
                    }
                    
                    for (let j = i + 1; j < symbolsOnLine.length; j++) {
                        if (symbolsOnLine[j].id === currentSymbol.id || (wildSymbolId && (symbolsOnLine[j].id === wildSymbolId || currentSymbol.id === wildSymbolId))) {
                            comboLength++;
                        } else {
                            break;
                        }
                    }

                    if (comboLength >= 3) {
                        const actualSymbol = isWildMatch && symbolsOnLine[i+1] ? symbolsOnLine[i+1] : currentSymbol;
                        
                        let lineMultiplier = lengthMultipliers[comboLength];
                        const typeBonus = state.inventory.filter(item => item.effect?.line_type_multiplier_bonus).reduce((acc, item) => item.effect.line_type_multiplier_bonus.types.some(type => line.type === type) ? acc + item.effect.line_type_multiplier_bonus.bonus : acc, 0);
                        lineMultiplier += typeBonus;
                        const lengthBonus = state.inventory.filter(item => item.effect?.line_length_multiplier_bonus).reduce((acc, item) => (item.effect.line_length_multiplier_bonus.length === comboLength) ? acc * item.effect.line_length_multiplier_bonus.multiplier : acc, 1);
                        lineMultiplier *= lengthBonus;

                        let symbolValue = actualSymbol.value;
                        if (symbolMultipliers[actualSymbol.id]) {
                            symbolValue = Math.floor(symbolValue * symbolMultipliers[actualSymbol.id]);
                        }

                        let win = symbolValue * lineMultiplier;
                        if (lineLengthBonuses[comboLength]) win += lineLengthBonuses[comboLength];
                        
                        // Handle ticket wins
                        if (lineWinBonuses[comboLength]) {
                            state.tickets += lineWinBonuses[comboLength];
                            addLog(`Печать Душ: +${lineWinBonuses[comboLength]}⛁`, 'win');
                        }

                        const symbolWinBonus = state.inventory.filter(item => item.effect?.symbol_win_bonus).reduce((acc, item) => (item.effect.symbol_win_bonus.symbol === actualSymbol.id) ? acc + item.effect.symbol_win_bonus.bonus : acc, 0);
                        win += symbolWinBonus;
                        
                        const winningPositions = line.positions.slice(i, i + comboLength);
                        winningLinesInfo.push({ name: `${line.name} (x${comboLength})`, symbol: actualSymbol.id, win, positions: winningPositions });
                        totalWinnings += win;
                        winningPositions.forEach(pos => allWinningPositions.add(pos));
                        
                        i += comboLength;
                    } else {
                        i++;
                    }
                }
            } 
            else {
                const firstSymbol = symbolsOnLine[0];
                const allMatch = symbolsOnLine.every(s => s.id === firstSymbol.id || (wildSymbolId && s.id === wildSymbolId));
                if (allMatch) {
                    const actualSymbol = firstSymbol.id === wildSymbolId && symbolsOnLine[1] ? symbolsOnLine[1] : firstSymbol;

                    let lineMultiplier = line.multiplier;
                    const typeBonus = state.inventory.filter(item => item.effect?.line_type_multiplier_bonus).reduce((acc, item) => item.effect.line_type_multiplier_bonus.types.some(type => line.type === type) ? acc + item.effect.line_type_multiplier_bonus.bonus : acc, 0);
                    lineMultiplier += typeBonus;
                    const lengthBonus = state.inventory.filter(item => item.effect?.line_length_multiplier_bonus).reduce((acc, item) => (item.effect.line_length_multiplier_bonus.length === line.positions.length) ? acc * item.effect.line_length_multiplier_bonus.multiplier : acc, 1);
                    lineMultiplier *= lengthBonus;

                    let symbolValue = actualSymbol.value;
                    if (symbolMultipliers[actualSymbol.id]) {
                        symbolValue = Math.floor(symbolValue * symbolMultipliers[actualSymbol.id]);
                    }

                    let win = symbolValue * lineMultiplier;
                    if (lineLengthBonuses[line.positions.length]) win += lineLengthBonuses[line.positions.length];
                    
                    if (lineWinBonuses[line.positions.length]) {
                         state.tickets += lineWinBonuses[line.positions.length];
                         addLog(`Печать Душ: +${lineWinBonuses[line.positions.length]}⛁`, 'win');
                    }
                    
                    const symbolWinBonus = state.inventory.filter(item => item.effect?.symbol_win_bonus).reduce((acc, item) => (item.effect.symbol_win_bonus.symbol === actualSymbol.id) ? acc + item.effect.symbol_win_bonus.bonus : acc, 0);
                    win += symbolWinBonus;

                    totalWinnings += win;
                    winningLinesInfo.push({ name: line.name, symbol: actualSymbol.id, win, positions: line.positions });
                    line.positions.forEach(pos => allWinningPositions.add(pos));
                }
            }
        });

        // --- 2. ПРОВЕРКА СПЕЦИАЛЬНЫХ ПАТТЕРНОВ ---
        const symbolCounts = grid.reduce((acc, s) => { acc[s.id] = (acc[s.id] || 0) + 1; return acc; }, {});
        const [topSymbolId, topCount] = Object.entries(symbolCounts).sort((a,b) => b[1] - a[1])[0] || [null, 0];
        
        // No changes to logic, just text
        if (topCount === 15) {
            const jackpotWin = SYMBOLS.find(s => s.id === topSymbolId).value * 10 * topCount;
            totalWinnings += jackpotWin;
            addLog(`💥 ПОЛНОЕ ЕДИНЕНИЕ! 💥 (${topSymbolId} x15): +${jackpotWin}⚙️`, 'win');
            for(let i=0; i<15; i++) allWinningPositions.add(i);
        } else if (topCount >= 12 && topCount < 15) {
            const eyeWin = SYMBOLS.find(s => s.id === topSymbolId).value * 8 * topCount;
            totalWinnings += eyeWin;
            addLog(`👁️ ПРОБУЖДЕНИЕ! 👁️ (${topSymbolId} x${topCount}): +${eyeWin}⚙️`, 'win');
            grid.forEach((s, i) => { if(s.id === topSymbolId) allWinningPositions.add(i); });
        }

        // --- 3. ПОСТ-БОНУСЫ И ЛОГИРОВАНИЕ ---
        const loggedLines = new Set();
        winningLinesInfo.forEach(info => {
             if (!loggedLines.has(info.name)) {
                addLog(`${info.name} (${GRAPHICS[info.symbol]}): +${info.win}⚙️`, 'win');
                loggedLines.add(info.name);
             }
        });

        if (winningLinesInfo.length > 1) {
            let comboMultiplier = 1;
            if (hasItem('combo_counter')) {
                comboMultiplier = state.inventory.find(item => item.id === 'combo_counter')?.effect?.combo_bonus_multiplier || 1.5;
            }
            const comboBonus = Math.floor(totalWinnings * ((1 + (winningLinesInfo.length - 1) * 0.25 - 1) * comboMultiplier));
            totalWinnings += comboBonus;
            addLog(`🔥 КОМБО x${winningLinesInfo.length}! Бонус: +${comboBonus}⚙️`, 'win');
        }

        state.inventory.forEach(item => {
            if (item.on_spin_bonus) {
                const bonus = item.on_spin_bonus(state.grid, totalWinnings);
                if (bonus > 0) { totalWinnings += bonus; addLog(`${item.name}: +${bonus}⚙️`, 'win'); }
            }
        });
        
        const finalMultiplier = getItemEffectValue('winMultiplier', 1);
        if (finalMultiplier > 1 && totalWinnings > 0) {
            const bonus = Math.floor(totalWinnings * (finalMultiplier - 1));
            totalWinnings += bonus;
            addLog(`Амулет Рока: +${Math.round((finalMultiplier-1)*100)}% бонус! (+${bonus}⚙️)`, 'win');
        }

        if (hasItem('last_chance') && state.spinsLeft === 0) {
            const lastChanceMultiplier = state.inventory.find(item => item.id === 'last_chance')?.effect?.on_last_spin_bonus?.multiplier || 3;
            if (totalWinnings > 0) {
                const bonus = totalWinnings * (lastChanceMultiplier - 1);
                totalWinnings += bonus;
                addLog(`Жест Отчаяния: x${lastChanceMultiplier} к выигрышу! (+${bonus}⚙️)`, 'win');
            }
        }

        totalWinnings = Math.floor(totalWinnings);

        if (totalWinnings > 0) {
            state.coins += totalWinnings;
            highlightWinningCells(Array.from(allWinningPositions), totalWinnings);
        } else { 
            addLog('Пустота... Ничего.');
            if (hasItem('scrap_metal')) {
                const lossBonus = getItemEffectValue('on_loss_bonus', 0);
                state.piggyBank += lossBonus;
                addLog(`Глиняный Идол впитал: +${lossBonus}⚙️. Всего: ${state.piggyBank}⚙️`);
            }
        }
    }

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

        let freeSpin = false;
        if (hasItem('lucky_penny') && !state.firstSpinUsed) {
            freeSpin = true;
            state.firstSpinUsed = true;
            addLog('Проклятая Монета: первая попытка бесплатна.', 'win');
        }
        if (!freeSpin) {
            state.spinsLeft--;
        }
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
            firstSpinUsed: false,
        };
        updateInterestRate();
        state.grid = generateGrid();
        
        ui.startScreen.classList.add('hidden');
        ui.gameOverScreen.classList.add('hidden');
        ui.logPanel.innerHTML = '';
        
        renderGrid(true); 

        populateShop();
        addLog(`Начался Круг Бездны #${state.run}. Долг: ${state.targetDebt}⚙️ за 3 дня.`);
        startTurn();
    }

    function startTurn() {
        state.tempLuck = 0;
        state.firstSpinUsed = false;
        updateInterestRate();
        
        const roundStartCoins = getItemEffectValue('on_round_start_coins', 0);
        if (roundStartCoins > 0) {
            state.coins += roundStartCoins;
            addLog(`Настойка дарует: +${roundStartCoins}⚙️.`, 'win');
        }
        state.freeRerolls = getItemEffectValue('free_reroll_per_round', 0);
        if (state.freeRerolls > 0) {
            addLog(`Бесплатный поиск в лавке: ${state.freeRerolls}.`, 'win');
        }
        const roundStartSpins = getItemEffectValue('on_round_start_spins', 0);
        if (roundStartSpins > 0) {
            state.spinsLeft += roundStartSpins;
            addLog(`Застывшие Часы: +${roundStartSpins} попытка.`, 'win');
        }

        if (state.turn > 1 || state.run > 1) {
            const interest = Math.floor(state.bankBalance * state.baseInterestRate);
            if (interest > 0) {
                state.coins += interest;
                addLog(`Проценты схрона: +${interest}⚙️.`, 'win');
            }
        }
        
        ui.purchaseModalTitle.textContent = `День ${state.turn}. Затишье перед бурей.`;
        ui.purchaseModalCoins.textContent = `${state.coins}⚙️`;
        ui.btnBuySpins7.disabled = state.coins < CONFIG.SPIN_PACKAGE_1.cost;
        ui.btnBuySpins3.disabled = state.coins < CONFIG.SPIN_PACKAGE_2.cost;
        ui.spinPurchaseModal.classList.remove('hidden');
        updateUI();

        updateMimicTarget();
    }
    
    function buySpins(pkg) {
        if (pkg) {
            if (state.coins >= pkg.cost) {
                state.coins -= pkg.cost;
                state.spinsLeft += pkg.spins;
                state.tickets += pkg.tickets;
                addLog(`Куплено: ${pkg.spins} попыток и ${pkg.tickets} жетон(а/ов).`);
            } else { addLog(`Недостаточно осколков.`, 'loss'); }
        }
        ui.spinPurchaseModal.classList.add('hidden');
        updateUI();
    }

    function endTurn() {
        if (state.isSpinning) return;
        
        const spinBonus = getItemEffectValue('on_spin_count_bonus', 0);
        if (spinBonus > 0 && state.spinsLeft === 0) {
            state.coins += spinBonus;
            addLog(`Бонус за все использованные попытки: +${spinBonus}⚙️.`, 'win');
        }
        ui.eorTitle.textContent = `Конец Дня ${state.turn}`;
        ui.eorCoins.textContent = `${state.coins}⚙️`;
        ui.eorBank.textContent = `${state.bankBalance}⚙️`;
        ui.eorDepositAmount.value = '';
        ui.endOfRoundModal.classList.remove('hidden');
    }

    function confirmEndTurn() {
        if (hasItem('scrap_metal') && state.piggyBank > 0) {
            addLog(`💥 Идол раскололся! Вы получили +${state.piggyBank}⚙️.`, 'win');
            state.coins += state.piggyBank;
            state.piggyBank = 0;
        }

        ui.endOfRoundModal.classList.add('hidden');
        addLog(`--- Ночь ${state.turn} окончена ---`);
        state.turn++;
        if (state.turn > 3) {
            judgementDay();
        } else {
            startTurn();
        }
    }

    function judgementDay() {
        const totalMoney = state.coins + state.bankBalance;
        addLog(`ЧАС РАСПЛАТЫ. Твоя ценность: ${totalMoney}⚙️. Требуется: ${state.targetDebt}⚙️.`);
        if (totalMoney >= state.targetDebt) {
            const remainder = totalMoney - state.targetDebt;
            const rewardTickets = 5 + state.run;
            ui.judgementTitle.textContent = "ДОЛГ УПЛАЧЕН";
            ui.judgementTitle.classList.remove('failure');
            ui.judgementText.innerHTML = `Ты выжил... на этот раз. Остаток <span style="color:var(--money-color)">${remainder}⚙️</span> уходит в схрон.<br>Награда: <span style="color:var(--ticket-color)">${rewardTickets}⛁</span>.`;
            ui.judgementContinue.onclick = () => {
                ui.judgementModal.classList.add('hidden');
                state.run++;
                state.turn = 1;
                state.targetDebt = Math.floor(state.targetDebt * 1.8 + 20);
                state.coins = 0;
                state.bankBalance = remainder;
                state.tickets += rewardTickets;
                state.spinsLeft = 0;
                updateInterestRate();
                addLog(`Новый Круг Бездны #${state.run} начался. Долг: ${state.targetDebt}⚙️.`);
                populateShop();
                startTurn();
            };
        } else {
            ui.judgementTitle.textContent = "ПРОВАЛ";
            ui.judgementTitle.classList.add('failure');
            ui.judgementText.textContent = `Ты не смог собрать нужную плату. Бездна ждет.`;
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
        addLog("ТВОЯ ИСТОРИЯ ОКОНЧЕНА.", 'loss');
    }
    
    function deposit(amount, isFromEOR = false) {
        if (isNaN(amount) || amount <= 0) return addLog("Неверная сумма.", 'loss');
        if (amount > state.coins) return addLog("Недостаточно осколков.", 'loss');
        state.coins -= amount;
        state.bankBalance += amount;
        addLog(`Спрятано в схрон: ${amount}⚙️.`);
        if (isFromEOR) {
            ui.eorDepositAmount.value = '';
            ui.eorCoins.textContent = `${state.coins}⚙️`;
            ui.eorBank.textContent = `${state.bankBalance}⚙️`;
        }
        ui.depositAmountInput.value = '';
        updateUI();
    }

    function rerollShop() {
        if (state.freeRerolls && state.freeRerolls > 0) {
            state.freeRerolls--;
            populateShop();
            addLog('Бесплатный поиск в Лавке!', 'win');
            if (hasItem('resellers_ticket')) {
                state.tickets += 1;
                addLog('Пакт Скупщика: +1⛁ за поиск!', 'win');
            }
            updateUI();
            return;
        }
        if (state.tickets >= CONFIG.REROLL_COST) {
            state.tickets -= CONFIG.REROLL_COST;
            populateShop();
            addLog(`Лавка обновлена за ${CONFIG.REROLL_COST}⛁.`);
            if (hasItem('resellers_ticket')) {
                state.tickets += 1;
                addLog('Пакт Скупщика: +1⛁ за поиск!', 'win');
            }
            updateUI();
        } else { addLog('Недостаточно жетонов.', 'loss'); }
    }

    function buyItem(itemId) {
        const item = state.shop.find(i => i.id === itemId);
        if (!item || state.tickets < item.cost) return addLog('Недостаточно жетонов.', 'loss');
        state.tickets -= item.cost;
        state.inventory.push(item);
        state.shop = state.shop.filter(i => i.id !== itemId);
        addLog(`Приобретена реликвия: ${item.name}`, 'win');
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
        ui.statDebt.textContent = `${state.targetDebt}⚙️`;
        ui.statCoins.textContent = `${state.coins}⚙️`;
        ui.bankBalance.textContent = `${state.bankBalance}⚙️`;
        ui.statTickets.textContent = `${state.tickets}⛁`;
        const baseLuck = getItemEffectValue('luck', 0);
        ui.statLuck.textContent = `${baseLuck}${state.tempLuck > 0 ? ` (+${state.tempLuck})` : ''}`;
        ui.spinsLeft.textContent = state.spinsLeft;
        ui.atmInterestRate.textContent = (state.baseInterestRate * 100).toFixed(0);
        
        let bonus = state.inventory.reduce((acc, item) => acc + (item.effect?.interest_rate_bonus || 0), 0);
        let bonusText = '';
        if (bonus > 0) bonusText = ` <span style="color:var(--highlight-color); font-size:12px;">(+${(bonus*100).toFixed(0)}% от реликвий)</span>`;
        let percent = state.baseInterestRate;
        let bank = state.bankBalance;
        let profit = Math.floor(bank * percent);
        let profitText = `<div style='font-size:13px; margin-top:4px;'>Следующая ночь: <b style='color:var(--money-color)'>+${profit}⚙️</b> (${(percent*100).toFixed(0)}%${bonusText})</div>`;
        let infoBlock = document.getElementById('interest-info-block');
        if (!infoBlock) {
            infoBlock = document.createElement('div');
            infoBlock.id = 'interest-info-block';
            ui.atmInterestRate.parentElement.parentElement.appendChild(infoBlock);
        }
        infoBlock.innerHTML = profitText;
        
        ui.btnEndTurn.disabled = state.isSpinning || state.spinsLeft > 0;
        ui.btnRerollShop.textContent = `Искать (${CONFIG.REROLL_COST}⛁)`;
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
            itemDiv.innerHTML = `<span class="item-cost">${item.cost}⛁</span><span class="item-name">${item.name}</span><p class="item-desc">${item.desc}</p>`;
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
            if(item.id === 'mimic_chest') {
                let mimicInfo = '';
                if(item.effect && item.effect.mimic && item.effect.mimic.target) {
                    const target = ALL_ITEMS.find(i => i.id === item.effect.mimic.target);
                    if(target) {
                        mimicInfo = `<div style='color:var(--ticket-color); font-size:12px; margin-top:6px;'>Копирует: <b>${target.name}</b></div>`;
                    } else {
                        mimicInfo = `<div style='color:var(--ticket-color); font-size:12px; margin-top:6px;'>Нет цели для копирования</div>`;
                    }
                } else {
                    mimicInfo = `<div style='color:var(--ticket-color); font-size:12px; margin-top:6px;'>Нет цели для копирования</div>`;
                }
                itemDiv.innerHTML += mimicInfo;
            }
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
            itemDiv.innerHTML = `<span class="item-cost">${item.cost}⛁</span><span class="item-name">${item.name}</span><p class="item-desc">${item.desc}</p>`;
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
            addLog(`Лавка обновлена за ${CONFIG.REROLL_COST}⛁.`);
            if (hasItem('resellers_ticket')) {
                state.tickets += 1;
                addLog('Пакт Скупщика: +1⛁ за поиск!', 'win');
            }
            ui.planningTickets.textContent = state.tickets;
            renderPlanningShop();
            updateUI();
        } else { addLog('Недостаточно жетонов.', 'loss'); }
    }
    
    function getMinInterestRate() {
        let min = 0.03;
        const bonus = state.inventory.reduce((acc, item) => acc + (item.effect?.interest_rate_bonus || 0), 0);
        const floor = state.inventory.reduce((acc, item) => Math.max(acc, (item.effect?.min_interest_rate_floor || 0)), 0);
        return Math.max(min, floor);
    }
    
    function updateInterestRate() {
        let base = 0.40;
        base -= (state.run - 1) * 0.03;
        base -= (state.turn - 1) * 0.10;
        
        const bonus = state.inventory.reduce((acc, item) => acc + (item.effect?.interest_rate_bonus || 0), 0);
        base += bonus;
        
        const minRate = getMinInterestRate();
        if (base < minRate) base = minRate;

        state.baseInterestRate = base;
    }

    function updateMimicTarget() {
        const mimicItem = state.inventory.find(item => item.id === 'mimic_chest');
        if (mimicItem) {
            const candidates = state.inventory.filter(item => item.id !== 'mimic_chest');
            if (candidates.length > 0) {
                const target = candidates[Math.floor(Math.random() * candidates.length)];
                mimicItem.effect.mimic = { target: target.id };
            } else {
                mimicItem.effect.mimic = { target: undefined };
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
    ui.btnBuyNothing.onclick = () => buySpins(null);
    ui.btnRerollShop.onclick = rerollShop;
    ui.btnPlanning.onclick = openPlanningMode;
    ui.btnPlanningReroll.onclick = rerollPlanningShop;
    ui.btnFinishPlanning.onclick = closePlanningMode;

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
        devItemSelect.innerHTML = '';
        ALL_ITEMS.forEach(item => {
            const opt = document.createElement('option');
            opt.value = item.id;
            opt.textContent = `${item.name} (${item.rarity})`;
            devItemSelect.appendChild(opt);
        });
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
        devLuckInput.value = state.tempLuck;
    };
    devClose.onclick = () => { devModal.classList.add('hidden'); };
    devAddCoins.onclick = () => { state.coins += 1000; addLog('Dev: +1000 осколков', 'win'); updateUI(); };
    devAddTickets.onclick = () => { state.tickets += 100; addLog('Dev: +100 жетонов', 'win'); updateUI(); };
    devSetInterest.onclick = () => { state.baseInterestRate = 0.5; addLog('Dev: Ставка 50%', 'win'); updateUI(); };
    devGiveItem.onclick = () => {
        const id = devItemSelect.value;
        if (!state.inventory.some(i => i.id === id)) {
            const item = ALL_ITEMS.find(i => i.id === id);
            state.inventory.push(item);
            addLog(`Dev: Выдана реликвия: ${item.name}`, 'win');
            updateUI();
        } else {
            addLog('Dev: Эта реликвия уже есть.', 'loss');
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
            addLog(`Dev: Временная удача: ${val}`, 'win');
            const totalLuck = getItemEffectValue('luck', 0) + state.tempLuck + (hasItem('growing_debt') ? getItemEffectValue('per_run_bonus.luck', 0, 'sum') * state.run : 0);
            let weights = SYMBOLS.map(s => `${s.graphic}:${s.weight}`).join(' ');
            addLog(`Dev: Итоговая удача: ${totalLuck}, веса: ${weights}`);
            devDebugLuck = true;
            updateUI();
        }
    };
});