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
        btnDepositAll: document.getElementById('btn-deposit-all'),
        btnDepositExcept7: document.getElementById('btn-deposit-except-7'),
        btnDepositExcept3: document.getElementById('btn-deposit-except-3'),
        btnDepositHalf: document.getElementById('btn-deposit-half'),
        btnEorDepositAll: document.getElementById('btn-eor-deposit-all'),
        btnEorDepositExcept7: document.getElementById('btn-eor-deposit-except-7'),
        btnEorDepositExcept3: document.getElementById('btn-eor-deposit-except-3'),
        btnEorDepositHalf: document.getElementById('btn-eor-deposit-half'),
    };

    const CONFIG = {
        ROWS: 3, COLS: 5, REROLL_COST: 2,
        SPIN_ANIMATION_TIME: 1200, 
        SPIN_PACKAGE_1: { spins: 7, tickets: 1, cost: 10, base_cost: 10 },
        SPIN_PACKAGE_2: { spins: 3, tickets: 2, cost: 7, base_cost: 7 },
    };
    window.CONFIG = CONFIG;
    const GRAPHICS = {
        lemon: '🍋', cherry: '🍒', clover: '🍀', bell: '🔔', diamond: '💎', coins: '💰', seven: '7️⃣',
        pirate: '🏴‍☠️', // Секретный символ
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
    const ORIGINAL_SYMBOLS = JSON.parse(JSON.stringify(SYMBOLS)); // Для сброса шансов в новой игре

    // Экспортируем данные для поп-апа статистики
    window.symbols = SYMBOLS;
    window.symbolWeights = {};
    window.gameState = {};

    function updateWeightedSymbols() {
        // Всегда начинаем с оригинальных, не изменённых символов
        let currentSymbols = JSON.parse(JSON.stringify(ORIGINAL_SYMBOLS));

        // Применяем ВСЕ активные пассивки типа slot_modifier к этой чистой копии
        if (state.activePassives && state.activePassives.length > 0) {
            state.activePassives.forEach(passive => {
                if (passive.type === 'slot_modifier' && typeof passive.effect === 'function') {
                    const tempState = { ...state };
                    const originalWindowSymbols = window.SYMBOLS;
                    window.SYMBOLS = currentSymbols;
                    passive.effect(tempState);
                    window.SYMBOLS = originalWindowSymbols;
                }
            });
        }

        // Применяем увеличение базовой ценности от Лупы
        if (hasItem('magnifying_glass')) {
            const effect = ALL_ITEMS.find(i => i.id === 'magnifying_glass').effect.base_value_increase;
            currentSymbols.forEach(s => {
                if (effect.symbols.includes(s.id)) {
                    s.value += effect.amount;
                }
            });
        }

        // Применяем эффект "Фильтр Неудач"
        const removedSymbolId = state.inventory.find(item => item.effect?.remove_symbol)?.effect.remove_symbol;
        if (removedSymbolId) {
            currentSymbols = currentSymbols.filter(s => s.id !== removedSymbolId);
        }

        weightedSymbols = currentSymbols.flatMap(s => Array(s.weight).fill(s));

        // Синхронизация window.symbols и window.symbolWeights
        window.symbols = currentSymbols;
        window.symbolWeights = {};
        currentSymbols.forEach(symbol => {
            window.symbolWeights[symbol.id] = symbol.weight;
        });
        window.totalWeight = currentSymbols.reduce((acc, s) => acc + s.weight, 0);
        if (!Array.isArray(window.symbols)) {
            console.error('[BUG] window.symbols не массив!', window.symbols);
        }
    }

    // --- устаревшая функция, теперь просто вызывает updateWeightedSymbols ---
    function updateSymbolWeightsForStats() {
        if (window.updateWeightedSymbols) {
            window.updateWeightedSymbols();
        }
    }

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
    let lastKnownTickets = 0;
    let lastKnownCoins = 0;

    function showTicketChangePopup(change) {
        if (change === 0) return;

        const ticketCounter = ui.statTickets;
        const innerSpan = ticketCounter.querySelector('span');
        if (!ticketCounter || !innerSpan) return;

        const popup = document.createElement('div');
        popup.className = 'ticket-change-popup';
        popup.textContent = (change > 0 ? '+' : '') + change;
        
        if (change > 0) {
            popup.classList.add('gain');
        } else {
            popup.classList.add('loss');
        }

        document.body.appendChild(popup);
        
        const rect = innerSpan.getBoundingClientRect();
        popup.style.left = `${rect.right + 5}px`;
        popup.style.top = `${rect.top + rect.height / 2}px`;
        
        popup.addEventListener('animationend', () => {
            popup.remove();
        });
    }

    function showCoinChangePopup(change) {
        if (change === 0) return;

        const coinCounter = ui.statCoins;
        const innerSpan = coinCounter.querySelector('span');
        if (!coinCounter || !innerSpan) return;

        const popup = document.createElement('div');
        popup.className = 'coin-change-popup';
        popup.textContent = (change > 0 ? '+' : '') + change;
        
        if (change > 0) {
            popup.classList.add('gain');
        } else {
            popup.classList.add('loss');
        }

        document.body.appendChild(popup);
        
        const rect = innerSpan.getBoundingClientRect();
        popup.style.left = `${rect.right + 5}px`;
        popup.style.top = `${rect.top + rect.height / 2}px`;
        
        popup.addEventListener('animationend', () => {
            popup.remove();
        });
    }

    function showPassiveChoiceModal(excludeIds = []) {
        let modal = document.getElementById('passive-choice-modal');
        if (modal) modal.remove();

        modal = document.createElement('div');
        modal.id = 'passive-choice-modal';
        modal.className = 'passive-choice-modal';

        const passives = getRandomPassives(3, excludeIds);
        let choicesHTML = '';

        const typeMap = {
            'item_mod': { text: 'Пассивный', class: 'passive' },
            'one_time': { text: 'Разовый', class: 'temporary' },
            'slot_modifier': { text: 'Модификатор', class: 'slot_modifier' }
        };

        passives.forEach(p => {
            const typeInfo = typeMap[p.type] || { text: 'Эффект', class: '' };
            choicesHTML += `
                <div class="passive-choice" data-passive-id="${p.id}">
                    <div class="choice-header">
                        <h3>${p.emoji || ''} ${p.name}</h3>
                        <span class="choice-type ${typeInfo.class}">${typeInfo.text}</span>
                    </div>
                    <p>${p.desc}</p>
                </div>
            `;
        });

        modal.innerHTML = `
            <div class="passive-choice-content">
                <h2>Выберите пассивный бонус</h2>
                <p>Этот бонус будет действовать до конца игры. Выберите мудро.</p>
                <div class="passive-choices">
                    ${choicesHTML}
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelectorAll('.passive-choice').forEach(choiceDiv => {
            choiceDiv.onclick = () => {
                const passiveId = choiceDiv.dataset.passiveId;
                const chosenPassive = ALL_PASSIVES.find(p => p.id === passiveId);
                applyPassive(chosenPassive, state);
                modal.remove();
                updateUI();
                startTurn(); // Продолжаем игру после выбора
            };
        });
    }

    function hasItem(itemId) {
        return state.inventory && state.inventory.some(item => item.id === itemId);
    }

    function hasPassive(passiveId) {
        return state.activePassives && state.activePassives.some(p => p.id === passiveId);
    }

    function getItemEffectValue(effectKey, defaultValue, accumulator = 'sum') {
        let items = [...state.inventory];
        // mimic: копируем эффект другого предмета
        const mimicItem = items.find(item => item.effect?.mimic);
        if (mimicItem) {
            const targetId = mimicItem.effect.mimic.target;
            const target = ALL_ITEMS.find(i => i.id === targetId);
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

    function generateGrid() {
        updateWeightedSymbols(); // Обновляем пул символов перед генерацией

        let tempLuck = 0;
        
        // --- ПАССИВКА: Удача новичка ---
        if (hasPassive('beginners_luck_passive') && state.flags.isFirstSpinOfRound) {
            tempLuck += 10;
            addLog(`Удача новичка: +10 к удаче на первый прокрут!`, 'win');
            state.flags.isFirstSpinOfRound = false; // Используем бонус
        }

        // [NEW] Логика предмета 'desperate_measures'
        if (hasItem('desperate_measures') && state.coins < 10) {
            const bonus = ALL_ITEMS.find(i => i.id === 'desperate_measures').effect.on_spin_luck_bonus.bonus;
            tempLuck += bonus;
            addLog(`Отчаянные меры: +${bonus} к удаче (мало монет).`, 'win');
            animateInventoryItem('desperate_measures');
        }

        if(hasItem('blood_ritual')) {
            const effect = ALL_ITEMS.find(i => i.id === 'blood_ritual').effect.on_spin_sacrifice;
            // --- ПАССИВКА: Фокус ритуалиста ---
            let cost = effect.cost;
            let bonusLuck = effect.bonus.luck;
            if (hasPassive('ritualist_focus')) {
                cost = Math.max(0, cost - 1);
                bonusLuck += 2;
            }

            if(state.coins >= cost){
                state.coins -= cost;
                tempLuck += bonusLuck;
                addLog(`Кровавый Ритуал: -${cost}💰, +${bonusLuck} к удаче на этот спин.`, 'win');
                animateInventoryItem('blood_ritual'); // [NEW] Анимация
            }
        }
        
        const perRunLuck = hasItem('growing_debt') ? getItemEffectValue('per_run_bonus.luck', 0, 'sum') * state.run : 0;
        
        // [FIX] Пассивка "Гордость барахольщика" теперь использует getMaxInventorySize
        let hoarderLuck = 0;
        if (hasPassive('hoarders_pride')) {
            hoarderLuck = Math.max(0, getMaxInventorySize() - state.inventory.length);
        }

        // [NEW] Логика предмета 'ticket_hoarder'
        let ticketLuck = 0;
        if (hasItem('ticket_hoarder')) {
            const effect = ALL_ITEMS.find(i => i.id === 'ticket_hoarder').effect.per_ticket_luck;
            ticketLuck = Math.floor(state.tickets / effect.per) * effect.luck;
        }
        
        const totalLuck = (state.permanentLuckBonus || 0) + getItemEffectValue('luck', 0) + state.tempLuck + tempLuck + perRunLuck + hoarderLuck + ticketLuck + (state.cherryLuckBonus || 0);

        if (state.cherryLuckBonus > 0) {
            addLog(`Вишнёвая удача: +${state.cherryLuckBonus} к удаче на этот спин.`, 'win');
            state.cherryLuckBonus = 0; // Используем бонус
        }
        if (hoarderLuck > 0) {
            addLog(`Гордость барахольщика: +${hoarderLuck} к удаче за пустые слоты.`, 'win');
        }
        if (ticketLuck > 0) {
            addLog(`Коллекционер талонов: +${ticketLuck} к удаче за талоны.`, 'win');
        }
        
        // --- НОВАЯ ЛОГИКА: удача распределяется на 3 части по случайным символам ---
        // 1. Делим удачу на 3 случайные части
        function splitLuckRandomly(total, parts) {
            if (total <= 0) return Array(parts).fill(0);
            let cuts = Array.from({length: parts-1}, () => Math.random());
            cuts.sort();
            let result = [];
            let prev = 0;
            for (let i = 0; i < cuts.length; i++) {
                result.push(Math.floor((cuts[i] - prev) * total));
                prev = cuts[i];
            }
            result.push(Math.floor((1 - prev) * total));
            // Корректируем сумму (на случай округления)
            let diff = total - result.reduce((a,b)=>a+b,0);
            for(let i=0; i<Math.abs(diff); i++) result[i%parts] += Math.sign(diff);
            return result;
        }
        const luckParts = splitLuckRandomly(totalLuck, 3);
        // 2. Выбираем 2 случайных символа
        const chosenSymbolIds = [];
        for (let i = 0; i < 2; i++) {
            const idx = Math.floor(Math.random() * SYMBOLS.length);
            chosenSymbolIds.push(SYMBOLS[idx].id);
        }
        // 3. Каждую часть случайно назначаем одному из двух символов
        const luckBonuses = {};
        for (let i = 0; i < 3; i++) {
            const symbolIdx = Math.floor(Math.random() * 2); // 0 или 1
            const id = chosenSymbolIds[symbolIdx];
            luckBonuses[id] = (luckBonuses[id] || 0) + luckParts[i];
        }
        // --- DEBUG LOGS ---
        console.log('[DEBUG] Удача разбита на части:', luckParts);
        console.log('[DEBUG] Символы для удачи:', chosenSymbolIds);
        console.log('[DEBUG] Итоговые бонусы по символам:', luckBonuses);
        // 4. Применяем бонусы к весам
        let adjustedSymbols = weightedSymbols.map(symbol => {
            if (luckBonuses[symbol.id]) {
                let newWeight = symbol.weight + Math.floor(symbol.value * luckBonuses[symbol.id] * 18);
                return { ...symbol, weight: newWeight };
            }
            return { ...symbol, weight: symbol.weight };
        });

        if (devDebugLuck) {
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

        // --- ПАССИВКА: Центральный элемент ---
        if (hasPassive('middle_man') && Math.random() < 0.5) {
            const highValueSymbols = SYMBOLS.filter(s => ['diamond', 'coins', 'seven'].includes(s.id));
            if (highValueSymbols.length > 0) {
                const randomHighSymbol = highValueSymbols[Math.floor(Math.random() * highValueSymbols.length)];
                grid[7] = randomHighSymbol; // 7 - это центральная ячейка (индекс)
                addLog(`Центральный элемент сработал! В центре появился ${randomHighSymbol.graphic}.`, 'win');
            }
        }
        
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
            animateInventoryItem(guarantee.id); // [NEW] Анимация
        }

        // --- ЭФФЕКТ: sync_cells ---
        const sync = state.inventory.find(item => item.effect?.sync_cells);
        if (sync) {
            const positions = sync.effect.sync_cells.cells;
            if (Array.isArray(positions) && positions.length > 0 && grid.length > 0) {
                const symbol = grid[positions[0]];
                positions.forEach(pos => grid[pos] = symbol);
                animateInventoryItem(sync.id); // [NEW] Анимация
            }
        }

        // --- СЕКРЕТНЫЙ СИМВОЛ: ПИРАТСКИЙ ФЛАГ ---
        // После генерации обычной сетки, для каждой горизонтальной линии пробуем вставить флаг
        const pirateSymbol = { id: 'pirate', value: 0, weight: 0, graphic: GRAPHICS.pirate };
        const pirateMaxCount = 3;
        let pirateChance = 0.02 + Math.min(totalLuck * 0.005, 0.5 - 0.02); // 2% базово +0.5% за каждую удачу, максимум 50%
        if (pirateChance > 0.5) pirateChance = 0.5;
        let piratesPlaced = 0;
        if (state.run < 3) {
            // Пиратские флаги не появляются до 3-го цикла
            console.log('[DEBUG] Пиратский флаг: цикл < 3, не вставляем флаг');
        } else if (state.pirateFlagCooldown && state.pirateFlagCooldown > 0) {
            state.pirateFlagCooldown--;
            console.log('[DEBUG] Пиратский флаг: кулдаун, не вставляем флаг');
        } else {
            for (const line of PAYLINES.filter(l => l.scannable && l.type === 'Горизонтальная')) {
                for (const pos of line.positions) {
                    if (piratesPlaced >= pirateMaxCount) break;
                    if (Math.random() < pirateChance) {
                        grid[pos] = pirateSymbol;
                        piratesPlaced++;
                    }
                }
            }
            if (piratesPlaced > 0) {
                state.pirateFlagCooldown = 1;
            }
            console.log(`[DEBUG] Пиратский флаг: вставлено за спин = ${piratesPlaced}`);
        }

        // --- ЭФФЕКТ: slot_machine_heart ---
        if (hasItem('slot_machine_heart')) {
            // Выбираем случайную ячейку для джекпота
            state.jackpotCellIndex = Math.floor(Math.random() * (CONFIG.ROWS * CONFIG.COLS));
            // Для визуализации можно добавить анимацию/подсветку (опционально)
        } else {
            state.jackpotCellIndex = undefined;
        }

        return grid;
    }

    function showTotalWinPopup(amount) {
        const popup = document.createElement('div');
        popup.className = 'total-win-popup';
        popup.innerHTML = `
            <div class="win-title">ОБЩИЙ ВЫИГРЫШ</div>
            <div class="win-amount">+${formatNumberWithComma(amount)}💰</div>
        `;
        document.body.appendChild(popup);

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

        setTimeout(() => {
            popup.classList.add('show');
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
        
        // [NEW] Логика для Wild Clover
        const wildSymbolItem = state.inventory.find(item => item.effect?.wild_symbol);
        const wildSymbolId = wildSymbolItem ? wildSymbolItem.effect.wild_symbol : null;
        if (wildSymbolId) {
            animateInventoryItem(wildSymbolItem.id);
        }

        // --- 0. ПРЕДВАРИТЕЛЬНЫЕ ЭФФЕКТЫ ---
        state.tempLuck = 0; // Сбрасываем временную удачу от предметов
        state.inventory.forEach(item => {
            if (item.effect?.temporary_luck_on_spin) {
                const symbolId = item.effect.temporary_luck_on_spin;
                const count = grid.filter(s => s.id === symbolId).length;
                if (count > 0) {
                    state.tempLuck += count;
                    addLog(`${item.name}: +${count} к временной удаче.`, 'win');
                    animateInventoryItem(item.id); // [NEW] Анимация
                }
            }
        });

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
        const lineWinTickets = {};
        state.inventory.forEach(item => {
            if (item.effect?.on_line_win_bonus) {
                const eff = item.effect.on_line_win_bonus;
                if (eff.coins) lineWinBonuses[eff.length] = (lineWinBonuses[eff.length] || 0) + eff.coins;
                if (eff.tickets) lineWinTickets[eff.length] = (lineWinTickets[eff.length] || 0) + eff.tickets;
            }
        });

        activePaylines.forEach(line => {
            const symbolsOnLine = line.positions.map(pos => grid[pos]);
            
            const processWin = (firstSymbol, winLength, lineMultiplier, winningPositionsOnLine) => {
                 let win = 0;
                 
                 // --- ПАССИВКА: Огранщик алмазов ---
                if (hasPassive('diamond_cutter') && firstSymbol.id === 'diamond') {
                    lineMultiplier += winLength;
                }
                // --- ПАССИВКА: Почти получилось ---
                if (hasPassive('almost_there') && winLength === 4) {
                    lineMultiplier += 1;
                }
                
                let symbolValue = firstSymbol.value;
                if (hasPassive('seven_symphony') && firstSymbol.id === 'seven') {
                    symbolValue = Math.floor(symbolValue * 1.5);
                }
                
                let itemMultiplier = symbolMultipliers[firstSymbol.id] || 1;
                if (hasPassive('golden_touch') && firstSymbol.id === 'lemon' && hasItem('golden_lemon')) {
                    itemMultiplier += 1;
                }
                symbolValue = Math.floor(symbolValue * itemMultiplier);

                win = winLength * symbolValue * lineMultiplier;
                
                if (lineLengthBonuses[winLength]) {
                    let bonus = lineLengthBonuses[winLength];
                    if (hasPassive('sticky_fingers_plus') && winLength === 3 && hasItem('sticky_fingers')) {
                        bonus += 1;
                    }
                    win += bonus;
                }
                if (lineWinBonuses[winLength]) {
                    let bonus = lineWinBonuses[winLength];
                    bonus = applyCoinDoubler(bonus);
                    win += bonus;
                }

                // [NEW] Логика предмета 'central_focus'
                if (hasItem('central_focus') && winningPositionsOnLine.some(pos => pos % 5 === 2)) {
                    const bonus = ALL_ITEMS.find(i => i.id === 'central_focus').effect.on_line_win_bonus.coins;
                    win += applyCoinDoubler(bonus);
                    animateInventoryItem('central_focus');
                }
                
                // --- ПАССИВКА: Звонарь ---
                if (hasPassive('bell_ringer') && firstSymbol.id === 'bell') {
                    const bellCount = grid.filter(s => s && s.id === 'bell').length;
                    win += bellCount;
                }
                // --- ПАССИВКА: Процветание ---
                if (hasPassive('prosperity_clover') && firstSymbol.id === 'clover') {
                    const coinCount = grid.filter(s => s && s.id === 'coins').length;
                    win += (coinCount * 2);
                }
                
                if (lineWinTickets[winLength]) {
                    state.tickets += lineWinTickets[winLength];
                    addLog(`Талоны: +${lineWinTickets[winLength]}🎟️ за линию x${winLength}.`, 'win');
                }
                // --- ПАССИВКА: Геолог ---
                if (hasPassive('geologist') && line.type === 'Небо/Земля') {
                    state.tickets += 3;
                    addLog(`Геолог: +3🎟️ за линию "${line.name}"!`, 'win');
                }

                const symbolWinBonusItem = state.inventory.find(item => item.effect?.symbol_win_bonus?.symbol === firstSymbol.id);
                if(symbolWinBonusItem){
                    let bonus = symbolWinBonusItem.effect.symbol_win_bonus.bonus;
                    win += bonus;
                    animateInventoryItem(symbolWinBonusItem.id); // [NEW] Анимация
                }
                
                const symbolWinTicketItem = state.inventory.find(item => item.effect?.symbol_win_bonus_ticket?.symbol === firstSymbol.id);
                if(symbolWinTicketItem){
                    let ticketBonus = symbolWinTicketItem.effect.symbol_win_bonus_ticket.tickets;
                    state.tickets += ticketBonus;
                    addLog(`${symbolWinTicketItem.name}: +${ticketBonus}🎟️ за линию ${GRAPHICS[firstSymbol.id]}.`, 'win');
                    animateInventoryItem(symbolWinTicketItem.id);
                }


                if (hasPassive('lucky_bomb') && firstSymbol.id === 'cherry' && hasItem('cherry_bomb')) {
                    state.tickets += 1;
                    addLog(`Счастливая бомба: +1🎟️ за линию вишен!`, 'win');
                }
                
                return win;
            };

            // [REFACTOR] Улучшенная логика для поддержки Wild-символов
            if (line.scannable) {
                const lengthMultipliers = { 3: 1, 4: 2, 5: 3 };
                let i = 0;
                while (i < symbolsOnLine.length) {
                    let currentSymbol = symbolsOnLine[i];
                    // Если первый символ - wild, ищем следующий не-wild символ для определения типа линии
                    if (wildSymbolId && currentSymbol.id === wildSymbolId) {
                        const nextNonWild = symbolsOnLine.slice(i + 1).find(s => s.id !== wildSymbolId);
                        if (nextNonWild) {
                            currentSymbol = nextNonWild;
                        } else { // Вся линия состоит из wild'ов
                            i++; continue;
                        }
                    }

                    let comboLength = 0;
                    let comboPositions = [];
                    for (let j = i; j < symbolsOnLine.length; j++) {
                        if (symbolsOnLine[j].id === currentSymbol.id || (wildSymbolId && symbolsOnLine[j].id === wildSymbolId)) {
                            comboLength++;
                            comboPositions.push(line.positions[j]);
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

                        let win = processWin(currentSymbol, comboLength, lineMultiplier, comboPositions);
                        
                        winningLinesInfo.push({ name: `${line.name} (x${comboLength})`, symbol: currentSymbol.id, win, positions: comboPositions });
                        totalWinnings += win;
                        comboPositions.forEach(pos => allWinningPositions.add(pos));
                        
                        i += comboLength;
                    } else {
                        i++;
                    }
                }
            } 
            else { // Для несканируемых линий
                const firstSymbol = symbolsOnLine[0];
                let lineSymbol = firstSymbol;
                 // Если первый символ - wild, определяем тип по следующему не-wild
                if (wildSymbolId && firstSymbol.id === wildSymbolId) {
                    const nextNonWild = symbolsOnLine.find(s => s.id !== wildSymbolId);
                    if (nextNonWild) lineSymbol = nextNonWild;
                }

                if (symbolsOnLine.every(s => s.id === lineSymbol.id || (wildSymbolId && s.id === wildSymbolId))) {
                    let lineMultiplier = line.multiplier;
                    const typeBonus = state.inventory.filter(item => item.effect?.line_type_multiplier_bonus).reduce((acc, item) => item.effect.line_type_multiplier_bonus.types.some(type => line.type === type) ? acc + item.effect.line_type_multiplier_bonus.bonus : acc, 0);
                    lineMultiplier += typeBonus;

                    const lengthBonus = state.inventory.filter(item => item.effect?.line_length_multiplier_bonus).reduce((acc, item) => (item.effect.line_length_multiplier_bonus.length === line.positions.length) ? acc * item.effect.line_length_multiplier_bonus.multiplier : acc, 1);
                    lineMultiplier *= lengthBonus;

                    let win = processWin(lineSymbol, line.positions.length, lineMultiplier, line.positions);
                    
                    totalWinnings += win;
                    winningLinesInfo.push({ name: line.name, symbol: lineSymbol.id, win, positions: line.positions });
                    line.positions.forEach(pos => allWinningPositions.add(pos));
                }
            }
        });

        // --- 2. ПРОВЕРКА СПЕЦИАЛЬНЫХ ПАТТЕРНОВ ---
        const symbolCounts = grid.reduce((acc, s) => { acc[s.id] = (acc[s.id] || 0) + 1; return acc; }, {});
        const [topSymbolId, topCount] = Object.entries(symbolCounts).sort((a,b) => b[1] - a[1])[0] || [null, 0];

        if (topCount === 15) {
            state.consecutiveJackpots = (state.consecutiveJackpots || 0) + 1;
            if (state.consecutiveJackpots >= 2) {
                state.pirateFlagSuperChance = true;
                
            }
            const jackpotWin = SYMBOLS.find(s => s.id === topSymbolId).value * 10 * topCount;
            totalWinnings += jackpotWin;
            addLog(`💥 ДЖЕКПОТ!!! 💥 (${topSymbolId} x15): +${formatNumberWithComma(jackpotWin)}💰`, 'win');
            for(let i=0; i<15; i++) allWinningPositions.add(i);
            
            setTimeout(() => {
                const jackpotOverlay = document.createElement('div');
                jackpotOverlay.className = 'jackpot-overlay';
                jackpotOverlay.innerHTML = `
                    <div class="jackpot-content">
                        <div class="jackpot-title">ДЖЕКПОТ!!!</div>
                        <div class="jackpot-amount">+${formatNumberWithComma(jackpotWin)}💰</div>
                    </div>
                `;
                document.body.appendChild(jackpotOverlay);
                
                for (let i = 0; i < 50; i++) {
                    const particle = document.createElement('div');
                    particle.className = 'jackpot-particle';
                    particle.style.setProperty('--angle', `${Math.random() * 360}deg`);
                    particle.style.setProperty('--delay', `${Math.random() * 0.5}s`);
                    jackpotOverlay.appendChild(particle);
                }
                
                setTimeout(() => {
                    jackpotOverlay.classList.add('fade-out');
                    setTimeout(() => jackpotOverlay.remove(), 1000);
                }, 4000);
            }, 1000);
        } else if (topCount >= 12 && topCount < 15) {
            const eyeWin = SYMBOLS.find(s => s.id === topSymbolId).value * 8 * topCount;
            totalWinnings += eyeWin;
            addLog(`👁️ ГЛАЗ! 👁️ (${topSymbolId} x${topCount}): +${formatNumberWithComma(eyeWin)}💰`, 'win');
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

        state.lastWinningLines = winningLinesInfo;

        if (winningLinesInfo.length > 1) {
            let comboMultiplier = 1;
            if (hasItem('combo_counter')) {
                comboMultiplier = state.inventory.find(item => item.id === 'combo_counter')?.effect?.combo_bonus_multiplier || 1.5;
                animateInventoryItem('combo_counter');
            }
            let baseComboRate = 0.25;
            if (hasPassive('combo_king')) {
                baseComboRate = 0.40;
            }
            const comboBonus = Math.floor(totalWinnings * ((1 + (winningLinesInfo.length - 1) * baseComboRate - 1) * comboMultiplier));
            totalWinnings += comboBonus;
            addLog(`🔥 КОМБО x${winningLinesInfo.length}! Бонус: +${formatNumberWithComma(comboBonus)}💰`, 'win');

            // --- ПАССИВКА: Цепная реакция ---
            if (hasPassive('chain_reaction')) {
                let ticketBonus = 0;
                for(let i = 0; i < winningLinesInfo.length; i++) {
                    if (Math.random() < 0.10) {
                        ticketBonus++;
                    }
                }
                if (ticketBonus > 0) {
                    state.tickets += ticketBonus;
                    addLog(`Цепная реакция: +${ticketBonus}🎟️ за комбо!`, 'win');
                }
            }
        }
        
        // --- PASSIVE BONUSES ---
        if (state.activePassives.length > 0) {
            if (hasPassive('clover_bonus') && totalWinnings > 0) {
                const cloverCount = grid.filter(s => s.id === 'clover').length;
                if (cloverCount > 0) {
                    const bonus = cloverCount;
                    totalWinnings += bonus;
                    addLog(`Клеверный бонус: +${formatNumberWithComma(bonus)}💰 за клеверы.`, 'win');
                }
            }
            if (hasPassive('wilder_clover') && hasItem('wild_clover')) {
                const cloverCount = grid.filter(s => s.id === 'clover').length;
                if (cloverCount > 0) {
                    totalWinnings += cloverCount;
                    addLog(`Дичайший клевер: +${cloverCount}💰 за каждый клевер на поле.`, 'win');
                }
            }

            if (hasPassive('cherry_luck')) {
                const cherryCount = grid.filter(s => s.id === 'cherry').length;
                if (cherryCount > 0) {
                    state.cherryLuckBonus = (state.cherryLuckBonus || 0) + cherryCount;
                }
            }
        }


        // [NEW] Бонусы от предметов, которые срабатывают после основного подсчета
        let postSpinBonuses = 0;
        state.inventory.forEach(item => {
            if (item.on_spin_bonus) {
                const bonus = item.on_spin_bonus(state.grid, totalWinnings, state);
                if (bonus > 0) {
                    postSpinBonuses += bonus;
                    addLog(`${item.name}: +${formatNumberWithComma(bonus)}💰`, 'win');
                    animateInventoryItem(item.id);
                }
            }
        });
        totalWinnings += postSpinBonuses;

        // [NEW] Бонусы от новых предметов (фруктовый салат и т.д.)
        if (hasItem('fruit_salad')) {
            let bonus = applyFruitSaladBonus(grid);
            if (bonus > 0) {
                totalWinnings += applyCoinDoubler(bonus);
                addLog(`Фруктовый салат: +${applyCoinDoubler(bonus)}💰`, 'win');
                animateInventoryItem('fruit_salad');
            }
        }
        if (hasItem('sweet_spin')) {
            let bonus = applySweetSpinBonus(grid);
            if (bonus > 0) {
                totalWinnings += applyCoinDoubler(bonus);
                addLog(`Сладкий прокрут: +${applyCoinDoubler(bonus)}💰`, 'win');
                animateInventoryItem('sweet_spin');
            }
        }
        if (hasItem('clover_field')) {
            let bonus = applyCloverFieldBonus(grid);
            if (bonus > 0) {
                totalWinnings += applyCoinDoubler(bonus);
                addLog(`Клеверное поле: +${applyCoinDoubler(bonus)}💰`, 'win');
                animateInventoryItem('clover_field');
            }
        }
        if (hasItem('bookends')) {
            let bonus = applyBookendsBonus(grid);
            if (bonus > 0) {
                totalWinnings += applyCoinDoubler(bonus);
                addLog(`Книжные подпорки: +${applyCoinDoubler(bonus)}💰`, 'win');
                animateInventoryItem('bookends');
            }
        }
        if (hasItem('minimalist') && totalWinnings > 0) {
            let bonus = Math.max(0, getMaxInventorySize() - state.inventory.length);
             if (bonus > 0) {
                totalWinnings += applyCoinDoubler(bonus);
                addLog(`Минималист: +${applyCoinDoubler(bonus)}💰 за пустые слоты.`, 'win');
                animateInventoryItem('minimalist');
            }
        }
        
        // --- Общие множители выигрыша ---
        // [NEW] Логика 'oddly_lucky'
        if (hasItem('oddly_lucky') && state.turn % 2 !== 0 && totalWinnings > 0) {
             const multiplier = ALL_ITEMS.find(i => i.id === 'oddly_lucky').effect.odd_round_multiplier;
             const bonus = Math.floor(totalWinnings * (multiplier - 1));
             totalWinnings += bonus;
             addLog(`Странная удача: +${Math.round((multiplier - 1) * 100)}% бонус! (+${formatNumberWithComma(bonus)}💰)`, 'win');
             animateInventoryItem('oddly_lucky');
        }

        // [NEW] Логика временного множителя выигрыша от luck_chance предметов
        if (state.tempWinMultiplier && state.tempWinMultiplier > 1 && totalWinnings > 0) {
            const bonus = Math.floor(totalWinnings * (state.tempWinMultiplier - 1));
            totalWinnings += bonus;
            addLog(`Временный множитель x${state.tempWinMultiplier}: +${formatNumberWithComma(bonus)}💰`, 'win');
            state.tempWinMultiplier = 1; // Сбрасываем после использования
        }

        const finalMultiplierItem = state.inventory.find(item => item.effect?.winMultiplier);
        if (finalMultiplierItem && totalWinnings > 0) {
            const finalMultiplier = finalMultiplierItem.effect.winMultiplier;
            const bonus = Math.floor(totalWinnings * (finalMultiplier - 1));
            totalWinnings += bonus;
            addLog(`${finalMultiplierItem.name}: +${Math.round((finalMultiplier - 1) * 100)}% бонус! (+${formatNumberWithComma(bonus)}💰)`, 'win');
            animateInventoryItem(finalMultiplierItem.id);
        }

        // [FIX] Логика 'last_chance'
        if (hasItem('last_chance') && state.spinsLeft === 0) { // Проверяем после декремента
            const lastChanceMultiplier = state.inventory.find(item => item.id === 'last_chance')?.effect?.on_last_spin_bonus?.multiplier || 3;
            if (totalWinnings > 0) {
                const bonus = totalWinnings * (lastChanceMultiplier - 1);
                totalWinnings += bonus;
                addLog(`Последний Шанс: x${lastChanceMultiplier} к выигрышу! (+${formatNumberWithComma(bonus)}💰)`, 'win');
                animateInventoryItem('last_chance');
            }
        }

        // [NEW] Логика 'Эхо-Камень'
        if (hasItem('echo_stone') && state.echoStoneMultiplier > 1 && totalWinnings > 0) {
            const multiplier = state.echoStoneMultiplier;
            const bonus = Math.floor(totalWinnings * (multiplier - 1));
            totalWinnings += bonus;
            addLog(`Эхо-Камень: Множитель x${multiplier}! (+${formatNumberWithComma(bonus)}💰)`, 'win');
            animateInventoryItem('echo_stone');
        }

        totalWinnings = Math.floor(totalWinnings);
        
        // --- Анимация выигрыша ---
        if (winningLinesInfo.length > 0) {
            const jackpotDelay = topCount === 15 ? 5500 : 0;
            setTimeout(() => {
                highlightWinningCells(Array.from(allWinningPositions), totalWinnings, winningLinesInfo.length > 1, winningLinesInfo);
                 if (winningLinesInfo.length > 1) {
                    const sequenceTime = allWinningPositions.size * 150 + 2500;
                    setTimeout(() => showTotalWinPopup(totalWinnings), sequenceTime);
                } else if (totalWinnings >= 50) {
                    setTimeout(() => showTotalWinPopup(totalWinnings), 2000);
                }
            }, jackpotDelay);
        }


        if (totalWinnings > 0) {
            state.coins += totalWinnings;
            state.flags.consecutiveLosses = 0; // Сброс счетчика проигрышей
            state.winStreak = (state.winStreak || 0) + 1; // [NEW] Увеличиваем серию побед

            // [NEW] Логика 'hot_streak'
            if (hasItem('hot_streak') && state.winStreak > 1) {
                const bonus = ALL_ITEMS.find(i => i.id === 'hot_streak').effect.on_win_streak_bonus;
                const finalBonus = applyCoinDoubler(bonus);
                state.coins += finalBonus;
                addLog(`На волне успеха (x${state.winStreak}): +${finalBonus}💰`, 'win');
                animateInventoryItem('hot_streak');
            }
            
        } else { 
            addLog('Ничего не выпало.');
            state.winStreak = 0; // [NEW] Сброс серии побед
            // --- ПАССИВКА: Обучение на ошибках ---
            if (hasPassive('learning_from_mistakes')) {
                state.flags.consecutiveLosses++;
                if (state.flags.consecutiveLosses >= 5) {
                    state.permanentLuckBonus++;
                    addLog(`Обучение на ошибках: +1 к перманентной удаче!`, 'win');
                    state.flags.consecutiveLosses = 0;
                }
            }

            if (hasItem('scrap_metal')) {
                let lossBonus = getItemEffectValue('on_loss_bonus', 0);
                if (hasPassive('piggy_bank_pro')) {
                    lossBonus *= 2;
                }
                state.piggyBank += lossBonus;
                addLog(`Копилка: +${formatNumberWithComma(lossBonus)}💰. Всего: ${formatNumberWithComma(state.piggyBank)}💰`);
                animateInventoryItem('scrap_metal'); // [NEW] Анимация
            }
        }

        // --- 2.1. ПРОВЕРКА СЕКРЕТНОГО СИМВОЛА: ПИРАТСКИЙ ФЛАГ ---
        for (const line of PAYLINES.filter(l => l.scannable && l.type === 'Горизонтальная')) {
            const symbolsOnLine = line.positions.map(pos => grid[pos]);
            let pirateStreak = 0;
            let pirateCells = [];
            for (let i = 0; i < symbolsOnLine.length; i++) {
                if (symbolsOnLine[i].id === 'pirate') {
                    pirateStreak++;
                    pirateCells.push(line.positions[i]);
                    // Если подряд 3
                    if (pirateStreak === 3) {
                        const lost = Math.floor(state.coins * 0.6);
                        if (lost > 0) {
                            state.coins -= lost;
                            addLog('Проклятье! Вы потеряли часть монет.', 'loss');
                        }
                        highlightCurseCells(pirateCells.slice(-3), 3, lost);
                        pirateStreak = 0;
                        pirateCells = [];
                    }
                } else {
                    if (pirateStreak === 1) highlightCurseCells([line.positions[i-1]], 1, 0);
                    if (pirateStreak === 2) highlightCurseCells([line.positions[i-2], line.positions[i-1]], 2, 0);
                    pirateStreak = 0;
                    pirateCells = [];
                }
            }
            // Если линия заканчивается на 1 или 2 подряд
            if (pirateStreak === 1) highlightCurseCells([line.positions[symbolsOnLine.length-1]], 1, 0);
            if (pirateStreak === 2) highlightCurseCells([line.positions[symbolsOnLine.length-2], line.positions[symbolsOnLine.length-1]], 2, 0);
        }

        // --- ЭФФЕКТ: slot_machine_heart ---
        if (hasItem('slot_machine_heart') && typeof state.jackpotCellIndex === 'number') {
            const jackpotSymbol = ALL_ITEMS.find(i => i.id === 'slot_machine_heart').effect.jackpot_cell.symbol;
            const jackpotMultiplier = ALL_ITEMS.find(i => i.id === 'slot_machine_heart').effect.jackpot_cell.multiplier;
            if (state.grid[state.jackpotCellIndex]?.id === jackpotSymbol && totalWinnings > 0) {
                totalWinnings *= jackpotMultiplier;
                addLog(`Сердце автомата: В джекпот-ячейке выпал 7️⃣! Выигрыш умножен на 100!`, 'win');
                animateInventoryItem('slot_machine_heart');
            }
        }
        // --- ЭФФЕКТ: luck_battery ---
        if (hasItem('luck_battery')) {
            state.luckBatteryCharge = state.luckBatteryCharge || 0;
            if (totalWinnings === 0) {
                state.luckBatteryCharge++;
                addLog(`Батарея удачи: +1 заряд (текущий: ${state.luckBatteryCharge})`, 'win');
                animateInventoryItem('luck_battery');
            } else if (state.luckBatteryCharge > 0) {
                const multiplier = 1 + state.luckBatteryCharge;
                const bonus = totalWinnings * (multiplier - 1);
                totalWinnings *= multiplier;
                addLog(`Батарея удачи: заряд x${multiplier}! (+${formatNumberWithComma(bonus)}💰)`, 'win');
                animateInventoryItem('luck_battery');
                state.luckBatteryCharge = 0;
            }
        }
    }

    function highlightWinningCells(positions, winAmount, isCombo = false, winningLines = []) {
        const cells = ui.slotMachine.querySelectorAll('.slot-cell');
        let highlightClass = 'highlight';
        
        if (winAmount > 50) highlightClass = 'highlight-huge';
        else if (winAmount > 20) highlightClass = 'highlight-big';

        const isJackpot = positions.length === 15;

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
            
            const sequenceTime = positions.length * 150;
            const holdTime = 2500;

            positions.forEach((pos, index) => {
                setTimeout(() => {
                    const cell = cells[pos];
                    if (cell) {
                        cell.classList.add('sequential-highlight');
                        if (isJackpot) cell.classList.add('jackpot');
                        
                        if (comboLevel >= 3) {
                            for (let i = 0; i < 3; i++) {
                                const particle = document.createElement('div');
                                particle.className = 'particle' + (isJackpot ? ' jackpot' : '');
                                cell.appendChild(particle);
                                setTimeout(() => particle.remove(), 500);
                            }
                        }

                        if (comboLevel >= 4) {
                            const coinCount = isJackpot ? (comboLevel === 5 ? 12 : 8) : (comboLevel === 5 ? 8 : 5);
                            const cellRect = cell.getBoundingClientRect();
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
                                    const angle = (-70 + Math.random() * 140) * (Math.PI / 180);
                                    const radius = 80 + Math.random() * 40;
                                    const dx = Math.sin(angle) * radius;
                                    const dy = -Math.cos(angle) * radius;
                                    coin.animate([
                                        { transform: 'translate(0,0) scale(1)', opacity: 1 },
                                        { transform: `translate(${dx}px,${dy}px) scale(1.1)`, opacity: 1 }
                                    ], {
                                        duration: 350,
                                        easing: 'cubic-bezier(0.5,0,0.7,1)'
                                    });
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

                        setTimeout(() => {
                            cell.classList.remove('sequential-highlight');
                            cell.classList.add(`combo-${comboLevel}`, 'sequential');
                            if (isJackpot) cell.classList.add('jackpot');
                            
                            const symbol = cell.querySelector('.symbol');
                            if (symbol) {
                                symbol.classList.add('winning');
                                if (isJackpot) symbol.classList.add('jackpot');
                            }
                        }, 500);
                    }
                }, index * 150);
            });

            setTimeout(() => {
                const comboText = document.createElement('div');
                comboText.className = 'combo-text';
                comboText.textContent = `КОМБО x${winningLines.length}!`;
                document.body.appendChild(comboText);
                
                setTimeout(() => comboText.classList.add('show'), 100);
                
                setTimeout(() => {
                    comboText.classList.remove('show');
                    comboText.classList.add('fade-out');
                    setTimeout(() => comboText.remove(), 500);
                }, 1500);
            }, sequenceTime);

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
            }, sequenceTime + holdTime);

        } else {
            positions.forEach(pos => cells[pos]?.classList.add(highlightClass));
            
            setTimeout(() => {
                cells.forEach(cell => {
                    cell.classList.remove('highlight', 'highlight-big', 'highlight-huge');
                });
            }, 2000);
        }
    }

    function highlightCurseCells(pirateCells, pirateCount, lostAmount) {
        const cells = ui.slotMachine.querySelectorAll('.slot-cell');
        pirateCells.forEach((pos, idx) => {
            let className = 'pirate-1';
            if (pirateCount === 2) className = 'pirate-2';
            if (pirateCount >= 3) className = 'pirate-3';
            cells[pos]?.classList.add(className);
        });
        if (pirateCount >= 3 && lostAmount > 0) {
            // Попап
            const popup = document.createElement('div');
            popup.className = 'curse-loss-popup';
            popup.innerHTML = `<div class="curse-title">ПРОКЛЯТЬЕ!</div><div class="curse-hint">Вы потеряли часть монет.</div>`;
            document.body.appendChild(popup);
            setTimeout(() => {
                popup.classList.add('show');
                setTimeout(() => {
                    popup.classList.remove('show');
                    popup.classList.add('fade-out');
                    setTimeout(() => popup.remove(), 1000);
                }, 1800);
            }, 100);
        }
        setTimeout(() => {
            pirateCells.forEach(pos => {
                cells[pos]?.classList.remove('pirate-1', 'pirate-2', 'pirate-3');
            });
        }, 2200);
    }

    function populateShop() {
        state.shop = [];
        const availableItems = [...ALL_ITEMS].filter(item => !hasItem(item.id));
        const commons = availableItems.filter(i => i.rarity === 'common');
        const rares = availableItems.filter(i => i.rarity === 'rare');
        const legendaries = availableItems.filter(i => i.rarity === 'legendary');
        for (let i = 0; i < 5; i++) {
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
                const item = pool[randomIndex];
                // Сброс uses для breakable предметов
                if (item.effect && item.effect.luck_chance && item.effect.luck_chance.breakable) {
                    item.uses = item.effect.luck_chance.max_uses || 1;
                }
                
                // [NEW] Инициализация uses для breakable предметов без luck_chance
                if (item.effect && item.effect.breakable && !item.effect.luck_chance) {
                    item.uses = item.effect.max_uses || 10;
                }
                state.shop.push(item);
                const idx = availableItems.findIndex(x => x.id === item.id);
                if (idx !== -1) availableItems.splice(idx, 1);
                if (pool === commons) commons.splice(commons.indexOf(item), 1);
                if (pool === rares) rares.splice(rares.indexOf(item), 1);
                if (pool === legendaries) legendaries.splice(legendaries.indexOf(item), 1);
            }
        }
    }
    
    function animateSpinsCounter(oldValue, newValue) {
        const counter = ui.spinsLeft;
        const counterRect = counter.getBoundingClientRect();
        const counterWrapper = document.createElement('div');
        counterWrapper.className = 'spins-counter';
        counterWrapper.style.height = `${counterRect.height}px`;
        
        const oldSpan = document.createElement('span');
        oldSpan.className = 'old-value';
        oldSpan.textContent = oldValue;
        
        const newSpan = document.createElement('span');
        newSpan.className = 'new-value';
        newSpan.textContent = newValue;
        
        counterWrapper.appendChild(oldSpan);
        counterWrapper.appendChild(newSpan);
        
        counter.textContent = '';
        counter.appendChild(counterWrapper);
        
        setTimeout(() => {
            counter.textContent = newValue;
        }, 400);
    }

    function showLuckChancePopups(triggeredItems) {
        if (!triggeredItems || triggeredItems.length === 0) return;
        let idx = 0;
        function showNext() {
            const item = triggeredItems[idx];
            const popup = document.createElement('div');
            popup.className = 'doubloon-popup';
            popup.innerHTML = `
                <div class="doubloon-star">
                    <svg viewBox="0 0 100 100" width="50" height="50" class="doubloon-svg">
                        <polygon points="50,8 61,38 94,38 67,58 77,90 50,70 23,90 33,58 6,38 39,38" fill="gold" stroke="#fffbe6" stroke-width="2"/>
                    </svg>
                    <span class="doubloon-text">${item.name}</span>
                </div>
            `;
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
                animateInventoryItem(item.id); // [NEW] Анимация для усилителя
            }
        });

        let luckBonus = 0;
        let itemsToRemove = [];
        let triggeredItems = [];
        state.inventory.forEach((item, idx) => {
            if (item.effect && item.effect.luck_chance) {
                const eff = item.effect.luck_chance;
                let chance = eff.chance * chanceMultiplier;
                if (hasPassive('gamblers_delight') && item.id === 'doubloon') {
                    chance *= 2;
                }
                if (chance > 1) chance = 1;

                if (Math.random() < chance) {
                    animateInventoryItem(item.id); // [NEW] Анимация для сработавшего предмета
                    if (eff.luck) {
                        luckBonus += eff.luck;
                        addLog(`${item.name}: +${eff.luck} к удаче (шанс ${(eff.chance*100).toFixed(1)}% x${chanceMultiplier.toFixed(1)} = ${(chance*100).toFixed(1)}%)!`, 'win');
                    }
                    if (eff.coins) {
                        state.coins += eff.coins;
                        addLog(`${item.name}: +${eff.coins}💰 (шанс ${(eff.chance*100).toFixed(1)}% x${chanceMultiplier.toFixed(1)} = ${(chance*100).toFixed(1)}%)!`, 'win');
                    }
                    if (eff.tickets) {
                        state.tickets += eff.tickets;
                        addLog(`${item.name}: +${eff.tickets}🎟️ (шанс ${(eff.chance*100).toFixed(1)}% x${chanceMultiplier.toFixed(1)} = ${(chance*100).toFixed(1)}%)!`, 'win');
                    }
                    if (eff.free_spins) {
                        state.spinsLeft += eff.free_spins;
                        addLog(`${item.name}: +${eff.free_spins} прокрут(ов) (шанс ${(eff.chance*100).toFixed(1)}% x${chanceMultiplier.toFixed(1)} = ${(chance*100).toFixed(1)}%)!`, 'win');
                    }
                    if (eff.interest_bonus) {
                        state.baseInterestRate += eff.interest_bonus;
                        addLog(`${item.name}: +${(eff.interest_bonus*100).toFixed(0)}% к процентной ставке (шанс ${(eff.chance*100).toFixed(1)}% x${chanceMultiplier.toFixed(1)} = ${(chance*100).toFixed(1)}%)!`, 'win');
                    }
                    if (eff.win_multiplier) {
                        // Временно увеличиваем множитель выигрыша для этого прокрута
                        if (!state.tempWinMultiplier) state.tempWinMultiplier = 1;
                        state.tempWinMultiplier *= eff.win_multiplier;
                        addLog(`${item.name}: x${eff.win_multiplier} к выигрышу (шанс ${(eff.chance*100).toFixed(1)}% x${chanceMultiplier.toFixed(1)} = ${(chance*100).toFixed(1)}%)!`, 'win');
                    }
                    if (item.id === 'doubloon') {
                        state.spinsLeft += 1;
                        addLog(`${item.name}: +1 прокрут! (шанс ${(eff.chance*100).toFixed(1)}% x${chanceMultiplier.toFixed(1)} = ${(chance*100).toFixed(1)}%)`, 'win');
                    }
                    triggeredItems.push(item); // Все предметы удачи используют универсальный поп-ап
                    if (eff.breakable) {
                        if (item.uses === undefined) item.uses = eff.max_uses || 1;
                        item.uses--;
                        if (item.uses <= 0) {
                            addLog(`${item.name} сломался!`, 'loss');
                            itemsToRemove.push(idx);
                        }
                    }
                } else {
                    // --- ПАССИВКА: Предвкушение ---
                    if (hasPassive('anticipation')) {
                        state.coins += 1;
                        addLog(`Предвкушение: +1💰 за несработавший шанс "${item.name}".`, 'win');
                    }
                }
            }
        });
        for (let i = itemsToRemove.length - 1; i >= 0; i--) {
            state.inventory.splice(itemsToRemove[i], 1);
        }
        if (luckBonus > 0) {
            state.tempLuck = (state.tempLuck || 0) + luckBonus;
        }
        if (triggeredItems.length > 0) {
            showLuckChancePopups(triggeredItems);
        }
    }

    async function spin() {
        if (state.spinsLeft <= 0 || state.gameover || state.isSpinning) return;
        
        // [NEW] Reset Echo Stone state for the new spin
        state.activatedItemsThisSpin = new Set();
        state.echoStoneMultiplier = 1;
        updateEchoStoneDisplay();

        state.isSpinning = true;
        ui.lever.classList.add('pulled');

        state.roundSpinsMade = (state.roundSpinsMade || 0) + 1; // [NEW] Счетчик спинов за раунд
        state.totalSpinsMade = (state.totalSpinsMade || 0) + 1; // [NEW] Общий счетчик спинов

        let freeSpin = false;
        if (hasItem('lucky_penny') && !state.firstSpinUsed) {
            freeSpin = true;
            state.firstSpinUsed = true;
            addLog('Счастливая монетка: первый прокрут бесплатный!', 'win');
            animateInventoryItem('lucky_penny'); // [NEW] Анимация
        }

        processLuckChanceItems(state);

        const oldSpinsLeft = state.spinsLeft;
        if (!freeSpin) {
            state.spinsLeft--;
        }

        // [NEW] Логика 'hourglass'
        if(hasItem('hourglass') && state.totalSpinsMade > 0 && state.totalSpinsMade % 10 === 0) {
            const bonus = ALL_ITEMS.find(i => i.id === 'hourglass').effect.on_spin_count_bonus.spins;
            state.spinsLeft += bonus;
            addLog(`Песочные Часы: +${bonus} прокрут за каждые 10 спинов.`, 'win');
            animateInventoryItem('hourglass');
        }

        // [NEW] Логика 'early_bird_spins'
        if(hasItem('early_bird_spins') && state.roundSpinsMade <= 3) {
            // Флаг будет проверен в calculateWinnings
            addLog(`Ранняя пташка: этот прокрут получит +1 к множителю выигрышей!`, 'win');
            animateInventoryItem('early_bird_spins');
        }

        animateSpinsCounter(oldSpinsLeft, state.spinsLeft);

        // [FIX] Убрали немедленный вызов updateUI(), который прерывал анимации.
        // Обновление UI теперь происходит в конце спина с задержкой.

        state.grid = generateGrid();
        await runSpinAnimation();
        calculateWinnings();

        // [FIX] Добавляем задержку перед сбросом состояния и обновлением UI,
        // чтобы все анимации от предметов (включая Копилку, бонусы и т.д.) успели проиграться.
        setTimeout(() => {
            state.tempLuck = 0;
            state.isSpinning = false;
            ui.lever.classList.remove('pulled');
            
            // [NEW] Логика для breakable предметов без luck_chance
            let itemsToRemove = [];
            state.inventory.forEach((item, idx) => {
                if (item.effect?.breakable && !item.effect?.luck_chance) {
                    if (item.uses === undefined) item.uses = item.effect.max_uses || 10;
                    item.uses--;
                    if (item.uses <= 0) {
                        addLog(`${item.name} сломался!`, 'loss');
                        itemsToRemove.push(idx);
                    }
                }
            });
            
            // Удаляем сломанные предметы
            for (let i = itemsToRemove.length - 1; i >= 0; i--) {
                state.inventory.splice(itemsToRemove[i], 1);
            }
            
            updateUI(); // Полное обновление UI происходит здесь, после завершения анимаций.
        }, 900); // Анимация длится 800ms, берем с запасом.
    }

    function updateSpinCosts() {
        const run = state.run;
        const bank = state.bankBalance;
        const purchases = state.purchasesThisRound || 0;
        const debt = state.targetDebt;

        // 1. Базовый множитель от цикла (оставляем 1.5)
        const cycleMultiplier = run === 1 ? 1 : Math.pow(1.9, run - 1);

        // 2. ПРОГРЕССИВНЫЙ "Налог на богатство"
        let wealthTax = 0;
        if (run > 1) { // Налог на богатство только со 2-го цикла
            if (bank > 100000) {
                // Очень богатые игроки платят огромный налог
                wealthTax = Math.floor(bank / 80);
            } else if (bank > 20000) {
                // Богатые игроки
                wealthTax = Math.floor(bank / 120);
            } else if (bank > 5000) {
                // Средний класс
                wealthTax = Math.floor(bank / 180);
            } else if (bank > 1000) {
                // Начинающие инвесторы
                wealthTax = Math.floor(bank / 250);
            }
        }
        // Если в банке меньше 1000, налог почти нулевой.

        // 3. Налог от долга в цикле (1/6 от долга)
        const debtTax = run === 1 ? 0 : Math.floor(debt / 6); // Налог от долга только со 2-го цикла

        // 4. Усиленная инфляция внутри раунда
        // Цена растет на 25% от базовой за каждую покупку
        const inflationRate = 0.25;

        // --- РАСЧЕТ ИТОГОВОЙ СТОИМОСТИ ---

        // Пакет 1 (7 прокрутов)
        let baseCost1 = Math.floor(CONFIG.SPIN_PACKAGE_1.base_cost * cycleMultiplier);
        let inflationCost1 = Math.floor(baseCost1 * purchases * inflationRate);
        let finalCost1 = baseCost1 + wealthTax + debtTax + inflationCost1;

        if (hasPassive('bulk_buyer')) {
            // Скидка теперь применяется только к базовой стоимости, а не к налогам
            // Это делает пассивку слабее против налога
            baseCost1 = Math.max(1, baseCost1 - 2);
            finalCost1 = baseCost1 + wealthTax + debtTax + inflationCost1; // Пересчитываем
        }
        CONFIG.SPIN_PACKAGE_1.cost = finalCost1;

        // Пакет 2 (3 прокрута)
        let baseCost2 = Math.floor(CONFIG.SPIN_PACKAGE_2.base_cost * cycleMultiplier);
        let inflationCost2 = Math.floor(baseCost2 * purchases * inflationRate);
        CONFIG.SPIN_PACKAGE_2.cost = baseCost2 + wealthTax + debtTax + inflationCost2;

        // Обновляем UI модального окна, если оно открыто
        if (!ui.spinPurchaseModal.classList.contains('hidden')) {
            ui.purchaseModalCoins.textContent = `${formatNumberWithComma(state.coins)}💰`;
            ui.btnBuySpins7.textContent = `7 прокрутов + 1🎟️ (${formatNumberWithComma(CONFIG.SPIN_PACKAGE_1.cost)}💰)`;
            ui.btnBuySpins3.textContent = `3 прокрута + 2🎟️ (${formatNumberWithComma(CONFIG.SPIN_PACKAGE_2.cost)}💰)`;
            ui.btnBuySpins7.disabled = state.coins < CONFIG.SPIN_PACKAGE_1.cost;
            ui.btnBuySpins3.disabled = state.coins < CONFIG.SPIN_PACKAGE_2.cost;
        }
    }

    // Функция для ПОЛНОГО СБРОСА и начала новой игры с 1-го цикла
    function initGame() {
        window.SYMBOLS = JSON.parse(JSON.stringify(ORIGINAL_SYMBOLS)); // Сброс шансов
        state = {
            run: 1,
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
            activePassives: [],
            cherryLuckBonus: 0,
            permanentLuckBonus: 0,
            passiveInterestBonus: 0, 
            flags: {
                consecutiveLosses: 0,
                firstDepositThisRound: true,
                firstPurchaseThisRound: true,
                firstRerollUsed: false,
                isFirstSpinOfRound: true,
            }, 
            pirateCount: 0, // Счётчик выпавших пиратских символов
            pirateFlagCooldown: 0, // Кулдаун на выпадение пиратского флага
            consecutiveJackpots: 0, // Счётчик подряд джекпотов
            pirateFlagSuperChance: false, // Флаг супер-шанса на флаг
            winStreak: 0,
            roundSpinsMade: 0,
            totalSpinsMade: 0,
            activatedItemsThisSpin: new Set(),
            echoStoneMultiplier: 1,
            purchasesThisRound: 0, // <-- НОВОЕ СВОЙСТВО
        };
        lastKnownTickets = state.tickets;
        lastKnownCoins = state.coins;
        
        ui.startScreen.classList.add('hidden');
        ui.gameOverScreen.classList.add('hidden');
        ui.logPanel.innerHTML = '';
        
        addLog(`Начался Цикл Долга #${state.run}. Цель: ${state.targetDebt}💰 за 3 дня.`);
        
        // Применяем разовые пассивки в начале игры
        if (state.activePassives && state.activePassives.length > 0) {
            state.activePassives.forEach(passive => {
                if (passive.type === 'one_time' && typeof passive.effect === 'function') {
                    passive.effect(state);
                    addLog(`Применена разовая пассивка: ${passive.name}.`, 'win');
                }
            });
        }
        
        state.grid = generateGrid();

        updateInterestRate();
        populateShop();
        renderGrid(true); 
        startTurn();
        
        // Обновляем данные для статистики
        updateWeightedSymbols();
    }

    // Функция для перехода на СЛЕДУЮЩИЙ ЦИКЛ
    function startNewCycle(bonusCoins = 0, bonusTickets = 0) {
        // [NEW] Применение эффекта 'magnifying_glass' в начале цикла
        if(hasItem('magnifying_glass')) {
            const effect = ALL_ITEMS.find(i => i.id === 'magnifying_glass').effect.base_value_increase;
            addLog(`Лупа увеличивает базовую ценность ${effect.symbols.join(' и ')} на ${effect.amount}.`, 'win');
            animateInventoryItem('magnifying_glass');
        }

        const lastPassiveIds = state.activePassives.map(p => p.id);
        
        state.run++;
        state.turn = 1;
        
        // --- ПАССИВКА: Прощение долга ---
        if (state.flags.nextDebtReduced) {
            const oldDebt = state.targetDebt;
            state.targetDebt = Math.floor(state.targetDebt * 0.9);
            addLog(`Прощение долга: ваш следующий долг снижен с ${formatNumberWithComma(oldDebt)} до ${formatNumberWithComma(state.targetDebt)}!`, 'win');
            state.flags.nextDebtReduced = false; // Используем флаг
        }
        
        // Расчет нового долга
        if (state.run === 2) state.targetDebt = 111;
        else if (state.run === 3) state.targetDebt = 666;
        else if (state.run === 4) state.targetDebt = 3333;
        else if (state.run === 5) state.targetDebt = 8888;
        else state.targetDebt = Math.min(Math.floor(state.targetDebt * 2.5 + 10000), 88888888);

        // [REMOVED] Старая логика расчета стоимости. Теперь она в updateSpinCosts()
        // CONFIG.SPIN_PACKAGE_1.cost = CONFIG.SPIN_PACKAGE_1.base_cost + (state.run - 1) * 10;
        // CONFIG.SPIN_PACKAGE_2.cost = CONFIG.SPIN_PACKAGE_2.base_cost + (state.run - 1) * 10;
        // if(hasPassive('bulk_buyer')) CONFIG.SPIN_PACKAGE_1.cost = Math.max(1, CONFIG.SPIN_PACKAGE_1.cost - 2);


        // Перенос и сброс состояния
        state.bankBalance += state.coins;
        state.coins = bonusCoins;
        state.tickets += (5 + state.run - 1) + bonusTickets; // (run-1) потому что run уже инкрементирован
        state.spinsLeft = 0;
        state.piggyBank = 0;
        state.firstSpinUsed = false;
        state.tempLuck = 0;
        state.cherryLuckBonus = 0;
        
        // [FIX] Обновляем lastKnownCoins и lastKnownTickets для корректной работы анимации
        lastKnownCoins = state.coins;
        lastKnownTickets = state.tickets;
        
        // --- ПАССИВКА: Опытный ветеран ---
        if (hasPassive('seasoned_veteran') && state.run >= 2) {
            const commonItems = ALL_ITEMS.filter(i => i.rarity === 'common' && !hasItem(i.id));
            if (commonItems.length > 0) {
                const randomItem = commonItems[Math.floor(Math.random() * commonItems.length)];
                state.inventory.push(randomItem);
                addLog(`Опытный ветеран: вы получили случайный амулет "${randomItem.name}"!`, 'win');
            }
        }
        
        // Применяем разовые пассивки для нового цикла
        if (state.activePassives && state.activePassives.length > 0) {
            state.activePassives.forEach(passive => {
                if (passive.type === 'one_time' && typeof passive.effect === 'function') {
                    passive.effect(state);
                    addLog(`Применена разовая пассивка: ${passive.name}.`, 'win');
                }
            });
        }
        
        state.pirateCount = 0; // Сброс счётчика пиратских символов
        state.winStreak = 0;
        state.roundSpinsMade = 0;
        state.flags.firstDepositThisRound = true;
        state.purchasesThisRound = 0; // <-- СБРОС СВОЙСТВА

        updateInterestRate();
        addLog(`Начался Цикл Долга #${state.run}. Цель: ${formatNumberWithComma(state.targetDebt)}💰.`);
        if(bonusCoins > 0 || bonusTickets > 0) addLog(`Бонус за быстроту: +${formatNumberWithComma(bonusCoins)}💰 и +${formatNumberWithComma(bonusTickets)}🎟️`, 'win');
        populateShop();
        
        if (state.run >= 2) {
            showPassiveChoiceModal(lastPassiveIds);
        } else {
            startTurn();
        }
        state.pirateFlagCooldown = 0;
        state.consecutiveJackpots = 0;
        state.pirateFlagSuperChance = false;
    }


    function startTurn() {
        updateSpinCosts(); // Обновляем стоимость в начале каждого раунда

        state.tempLuck = 0;
        state.firstSpinUsed = false;
        state.roundSpinsMade = 0;
        state.purchasesThisRound = 0; // Сброс счетчика покупок в начале раунда
        // --- СБРОС ФЛАГОВ ДЛЯ ПАССИВОК НА 1 РАУНД ---
        if (state.activePassives.length > 0) {
            if (hasPassive('bankers_friend')) state.flags.firstDepositThisRound = true;
            if (hasPassive('shopaholic')) state.flags.firstPurchaseThisRound = true;
            if (hasPassive('reroll_master')) state.flags.firstRerollUsed = false;
            if (hasPassive('beginners_luck_passive')) state.flags.isFirstSpinOfRound = true;
            if (hasPassive('lucky_start')) {
                state.tempLuck += 3;
                addLog(`Удачный старт: +3 к временной удаче на этот раунд.`, 'win');
            }
        }
        
        // --- ПАССИВКА: Ликвидатор талонов ---
        if (hasPassive('ticket_liquidator') && state.tickets > 0) {
            const amountToConvert = parseInt(prompt(`Ликвидатор талонов: сколько талонов (до 5) вы хотите обменять на монеты (1к1)? У вас ${state.tickets}🎟️.`, "0"), 10);
            if (!isNaN(amountToConvert) && amountToConvert > 0) {
                const finalAmount = Math.min(amountToConvert, 5, state.tickets);
                if (finalAmount > 0) {
                    state.tickets -= finalAmount;
                    state.coins += finalAmount;
                    addLog(`Ликвидатор талонов: обменяно ${finalAmount}🎟️ на ${finalAmount}💰.`, 'win');
                }
            }
        }

        // --- ПАССИВКА: Техническое обслуживание ---
        if (hasPassive('maintenance')) {
            let repairedCount = 0;
            state.inventory.forEach(item => {
                if (item.effect?.luck_chance?.breakable && item.uses < item.effect.luck_chance.max_uses) {
                    if (Math.random() < 0.25) {
                        item.uses++;
                        repairedCount++;
                        addLog(`Техобслуживание: амулет "${item.name}" восстановлен на 1 использование.`, 'win');
                    }
                }
            });
        }


        if (hasItem('morning_coffee')) {
            const bonus = getItemEffectValue('on_round_start_coins', 0);
            if (bonus > 0) {
                state.coins += bonus;
                addLog(`Утренний кофе: +${formatNumberWithComma(bonus)}💰.`, 'win');
                animateInventoryItem('morning_coffee');
            }
        }

        state.freeRerolls = 0;
        if(hasItem('coupon_book')) {
            const rerolls = getItemEffectValue('free_reroll_per_round', 0);
            if (rerolls > 0) {
                state.freeRerolls += rerolls;
                addLog(`Книжка с купонами: ${rerolls} бесплатный реролл магазина.`, 'win');
                animateInventoryItem('coupon_book');
            }
        }
        
        if(hasItem('timepiece')) {
            let timepieceBonus = getItemEffectValue('on_round_start_spins', 0);
            if (hasPassive('watchmaker_precision') && Math.random() < 0.5) {
                timepieceBonus += 1;
                addLog(`Точность часовщика: +1 дополнительный прокрут!`, 'win');
            }
            if (timepieceBonus > 0) {
                state.spinsLeft += timepieceBonus;
                addLog(`Карманные часы: +${timepieceBonus} прокрут(ов) в начале раунда.`, 'win');
                animateInventoryItem('timepiece');
            }
        }

        if (state.turn > 1 || state.run > 1) {
            const interest = Math.floor(state.bankBalance * state.baseInterestRate);
            if (interest > 0) {
                state.coins += interest;
                addLog(`Банковский кэшбек: +${formatNumberWithComma(interest)}💰.`, 'win');
            }
        }
        updateInterestRate();
        
        // Обновляем магазин амулетов в начале каждого раунда
        populateShop();
        
        ui.purchaseModalTitle.textContent = `Раунд ${state.turn}. Время закупаться.`;
        ui.purchaseModalCoins.textContent = `${formatNumberWithComma(state.coins)}💰`;
        if (ui.purchaseModalDebt) ui.purchaseModalDebt.textContent = `${formatNumberWithComma(state.targetDebt)}💰`;

        let package1Cost = CONFIG.SPIN_PACKAGE_1.cost;
        if(hasPassive('bulk_buyer')) {
            package1Cost = Math.max(1, package1Cost - 2);
        }
        ui.btnBuySpins7.textContent = `7 прокрутов + 1🎟️ (${package1Cost}💰)`;
        ui.btnBuySpins3.textContent = `3 прокрута + 2🎟️ (${CONFIG.SPIN_PACKAGE_2.cost}💰)`;
        
        let singleSpinCost = 3;
        if (hasPassive('frugal_spinner')) {
            singleSpinCost = 2;
        }
        ui.btnBuySpin1.textContent = `1 прокрут (${singleSpinCost}💰)`;
        ui.btnBuySpin1.disabled = state.coins < singleSpinCost || state.coins >= CONFIG.SPIN_PACKAGE_2.cost;


        ui.btnBuySpins7.disabled = state.coins < package1Cost;
        ui.btnBuySpins3.disabled = state.coins < CONFIG.SPIN_PACKAGE_2.cost;
        
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
            let cost = 3;
            if (hasPassive('frugal_spinner')) {
                cost = 2;
            }
            if (state.coins >= cost) {
                state.coins -= cost;
                state.spinsLeft += 1;
                state.purchasesThisRound++; // <-- УВЕЛИЧИВАЕМ СЧЕТЧИК
                addLog(`Куплен 1 прокрут за ${cost}💰 (без талонов).`, 'win');
            } else {
                addLog('Недостаточно наличных.', 'loss');
            }
            ui.spinPurchaseModal.classList.add('hidden');
            updateUI();
            return;
        }
        if (pkg) {
            let finalCost = pkg.cost;
            // Убираем проверку bulk_buyer отсюда, так как она теперь в updateSpinCosts

            if (state.coins >= finalCost) {
                state.coins -= finalCost;
                state.spinsLeft += pkg.spins;
                state.tickets += pkg.tickets;
                state.purchasesThisRound++; // <-- УВЕЛИЧИВАЕМ СЧЕТЧИК
                addLog(`Куплено: ${pkg.spins} прокрутов и ${pkg.tickets} талон(а/ов).`);
                
                // ВАЖНО: После покупки нужно обновить отображение цен в модальном окне
                updateSpinCosts(); // Вызываем пересчет
                // Обновляем текст на кнопках в открытом модальном окне
                ui.btnBuySpins7.textContent = `7 прокрутов + 1🎟️ (${CONFIG.SPIN_PACKAGE_1.cost}💰)`;
                ui.btnBuySpins3.textContent = `3 прокрута + 2🎟️ (${CONFIG.SPIN_PACKAGE_2.cost}💰)`;
                ui.btnBuySpins7.disabled = state.coins < CONFIG.SPIN_PACKAGE_1.cost;
                ui.btnBuySpins3.disabled = state.coins < CONFIG.SPIN_PACKAGE_2.cost;
            } else { addLog(`Недостаточно наличных.`, 'loss'); }
        }
        ui.spinPurchaseModal.classList.add('hidden');
        updateUI();
    }

    function endTurn() {
        if (state.isSpinning) return;
        ui.eorTitle.textContent = `Конец Раунда ${state.turn}`;
        ui.eorCoins.textContent = `${formatNumberWithComma(state.coins)}💰`;
        ui.eorBank.textContent = `${formatNumberWithComma(state.bankBalance)}💰`;
        ui.endOfRoundModal.classList.remove('hidden');
    }

    function confirmEndTurn() {
        // [NEW] Логика 'frugal_mindset'
        if (hasItem('frugal_mindset') && state.spinsLeft > 0) {
            const bonus = state.spinsLeft * ALL_ITEMS.find(i => i.id === 'frugal_mindset').effect.on_round_end_bonus.per_spin_left;
            const finalBonus = applyCoinDoubler(bonus);
            state.coins += finalBonus;
            addLog(`Экономное мышление: +${finalBonus}💰 за ${state.spinsLeft} оставшихся прокрутов.`, 'win');
            animateInventoryItem('frugal_mindset');
        }

        // --- ПАССИВКА: Просчитанный риск ---
        if (hasPassive('calculated_risk') && state.spinsLeft === 0) {
            state.coins += 5;
            addLog('Просчитанный риск: +5💰 за окончание раунда с 0 прокрутов.', 'win');
        }
        if (hasItem('scrap_metal') && state.piggyBank > 0) {
            addLog(`💥 Копилка разбита! Вы получили +${formatNumberWithComma(state.piggyBank)}💰.`, 'win');
            state.coins += state.piggyBank;
            state.piggyBank = 0;
            animateInventoryItem('scrap_metal');
        }

        ui.endOfRoundModal.classList.add('hidden');
        addLog(`--- Раунд ${state.turn} окончен ---`);
        state.turn++;
        
        // [FIX] Добавляем задержку, чтобы анимация копилки (и других эффектов конца раунда) успела проиграться
        // перед тем, как startTurn() вызовет updateUI() и перерисует инвентарь.
        setTimeout(() => {
            if (state.turn > 3) {
                judgementDay();
            } else {
                startTurn();
            }
        }, 900); // Анимация длится 800ms
    }

    function advanceToNextCycle(bonusCoins = 0, bonusTickets = 0) {
        ui.judgementModal.classList.remove('hidden');
        ui.judgementTitle.textContent = "ДОЛГ ВЫПЛАЧЕН";
        ui.judgementTitle.classList.remove('failure');

        const totalMoney = state.coins + state.bankBalance;
        const standardTickets = 5 + state.run;
        let bonusText = '';
        if(bonusCoins > 0 || bonusTickets > 0) {
            bonusText = `Бонус за быстроту: <span style="color:var(--money-color)">+${formatNumberWithComma(bonusCoins)}💰</span> и <span style="color:var(--ticket-color)">+${formatNumberWithComma(bonusTickets)}🎟️</span>.<br>`;
        }
        ui.judgementText.innerHTML = `Вы выжили. Весь баланс <span style="color:var(--money-color)">${formatNumberWithComma(totalMoney)}💰</span> переведен в банк.<br>
                                     Стандартная награда: <span style="color:var(--ticket-color)">${formatNumberWithComma(standardTickets)}🎟️</span>.<br>
                                     ${bonusText}`;

        ui.judgementContinue.onclick = () => {
            ui.judgementModal.classList.add('hidden');
            startNewCycle(bonusCoins, bonusTickets);
        };
    }

    function judgementDay() {
        const totalMoney = state.coins + state.bankBalance;
        addLog(`СУДНЫЙ ДЕНЬ. Ваша сумма: ${formatNumberWithComma(totalMoney)}💰. Требуется: ${formatNumberWithComma(state.targetDebt)}💰.`);
        
        if (totalMoney >= state.targetDebt) {
            advanceToNextCycle();
        } else {
            gameOver();
        }
    }

    function payDebtEarly() {
        if (state.turn >= 3) return;
        const totalMoney = state.coins + state.bankBalance;
        if (totalMoney < state.targetDebt) return;

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
        
        if (hasPassive('early_bird')) {
            const oldCoins = bonusCoins;
            const oldTickets = bonusTickets;
            bonusCoins = Math.floor(bonusCoins * 1.5);
            bonusTickets = Math.floor(bonusTickets * 1.5);
            addLog(`Ранняя пташка: бонусы увеличены! (+${formatNumberWithComma(bonusCoins - oldCoins)}💰, +${formatNumberWithComma(bonusTickets - oldTickets)}🎟️)`, 'win');
        }
        
        advanceToNextCycle(bonusCoins, bonusTickets);
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
        
        // [NEW] Логика 'small_investment'
        if(hasItem('small_investment') && state.flags.firstDepositThisRound) {
            const bonus = ALL_ITEMS.find(i => i.id === 'small_investment').effect.on_first_deposit_bonus;
            state.tickets += bonus.tickets;
            addLog(`Малая инвестиция: +${bonus.tickets}🎟️ за первый вклад в раунде.`, 'win');
            animateInventoryItem('small_investment');
            state.flags.firstDepositThisRound = false;
        }

        let finalAmount = amount;
        let bonusApplied = false;
        if (hasPassive('bankers_friend') && state.flags.firstDepositThisRound) {
            finalAmount = Math.floor(amount * 1.10);
            state.flags.firstDepositThisRound = false; // Использовать флаг
            bonusApplied = true;
        }

        state.coins -= amount;
        state.bankBalance += finalAmount;

        // --- ПАССИВКА: Крупный инвестор ---
        if (hasPassive('major_investor') && amount >= 100) {
            state.tickets += 1;
            addLog('Крупный инвестор: +1🎟️ за крупный вклад!', 'win');
        }
        
        if (bonusApplied) {
            addLog(`Внесено: ${formatNumberWithComma(amount)}💰. Друг Банкира добавил 10%, зачислено: ${formatNumberWithComma(finalAmount)}💰.`, 'win');
        } else {
            addLog(`Внесено в банк: ${formatNumberWithComma(amount)}💰.`);
        }

        if (isFromEOR) {
            ui.eorCoins.textContent = `${formatNumberWithComma(state.coins)}💰`;
            ui.eorBank.textContent = `${formatNumberWithComma(state.bankBalance)}💰`;
        }
        updateUI();
    }

    function rerollShop() {
        let cost = CONFIG.REROLL_COST;
        let bonusApplied = false;
        if (hasPassive('reroll_master') && !state.flags.firstRerollUsed) {
            cost = Math.max(0, cost - 1);
            bonusApplied = true;
        }

        if (state.freeRerolls && state.freeRerolls > 0) {
            state.freeRerolls--;
            populateShop();
            addLog('Бесплатный реролл магазина!', 'win');
            if(hasItem('coupon_book')) animateInventoryItem('coupon_book'); // [NEW] Анимация
            if (bonusApplied) state.flags.firstRerollUsed = true;
            if (hasItem('resellers_ticket')) {
                state.tickets += 1;
                addLog('Билет перекупщика: +1🎟️ за реролл!', 'win');
                animateInventoryItem('resellers_ticket'); // [NEW] Анимация
            }
            updateUI();
            return;
        }

        if (state.tickets >= cost) {
            state.tickets -= cost;
            populateShop();
            if (bonusApplied) {
                addLog(`Магазин обновлен со скидкой за ${cost}🎟️.`);
                state.flags.firstRerollUsed = true;
            } else {
                addLog(`Магазин обновлен за ${cost}🎟️.`);
            }
            if (hasItem('resellers_ticket')) {
                state.tickets += 1;
                addLog('Билет перекупщика: +1🎟️ за реролл!', 'win');
                animateInventoryItem('resellers_ticket'); // [NEW] Анимация
            }
            updateUI();
        } else { addLog('Недостаточно талонов.', 'loss'); }
    }

    function buyItem(itemId) {
        if (state.inventory.length >= getMaxInventorySize()) {
            addLog(`В инвентаре максимум ${getMaxInventorySize()} амулетов!`, 'loss');
            return;
        }
        const item = state.shop.find(i => i.id === itemId);
        
        let cost = item.cost;
        let bonusApplied = false;
        if (hasPassive('shopaholic') && state.flags.firstPurchaseThisRound) {
            cost = Math.max(1, item.cost - 2);
            state.flags.firstPurchaseThisRound = false;
            bonusApplied = true;
        }
        // --- ПАССИВКА: Специалист по бартеру ---
        if (hasPassive('barterer') && item.cost >= 5) {
            cost = Math.max(1, cost - 1);
            bonusApplied = true;
        }

        if (!item || state.tickets < cost) return addLog('Недостаточно талонов.', 'loss');
        
        // Сброс uses для breakable предметов при покупке
        if (item.effect && item.effect.luck_chance && item.effect.luck_chance.breakable) {
            item.uses = item.effect.luck_chance.max_uses || 1;
        }
        
        // [NEW] Инициализация uses для breakable предметов без luck_chance
        if (item.effect && item.effect.breakable && !item.effect.luck_chance) {
            item.uses = item.effect.max_uses || 10;
        }

        state.tickets -= cost;
        state.inventory.push(item);
        state.shop = state.shop.filter(i => i.id !== itemId);
        
        if (bonusApplied) {
             addLog(`Куплен амулет: ${item.name} со скидкой за ${cost}🎟️!`, 'win');
        } else {
             addLog(`Куплен амулет: ${item.name}`, 'win');
        }

        updateMimicTarget();
        
        // --- [NEW] Немедленное применение эффектов, которые должны работать сразу ---
        // Бесплатные рероллы
        let newFreeRerolls = getItemEffectValue('free_reroll_per_round', 0);
        if (newFreeRerolls > 0) {
            state.freeRerolls = newFreeRerolls;
            addLog(`Бесплатный реролл магазина теперь доступен в этом раунде!`, 'win');
            animateInventoryItem(item.id);
        }
        // +Спины в раунд (например, часы)
        let newSpins = getItemEffectValue('on_round_start_spins', 0);
        if (newSpins > 0) {
            state.spinsLeft += newSpins;
            addLog(`+${newSpins} прокрут(ов) сразу после покупки!`, 'win');
            animateInventoryItem(item.id);
        }
        // +Монеты в раунд (например, кофе)
        let newCoins = getItemEffectValue('on_round_start_coins', 0);
        if (newCoins > 0) {
            state.coins += newCoins;
            addLog(`+${newCoins}💰 сразу после покупки!`, 'win');
            animateInventoryItem(item.id);
        }
        // Можно добавить аналогично для других эффектов, если потребуется

        if (ui.planningModal.classList.contains('hidden')) {
            updateUI();
        } else {
            ui.planningTickets.textContent = state.tickets;
            renderPlanningShop();
            renderPlanningInventory();
            updateUI();
        }
    }
    
    function formatNumberWithComma(num) {
        if (typeof num !== 'number') return num;
        return num.toLocaleString('en-US');
    }
    
    function updateUI() {
        if (!state || Object.keys(state).length === 0) return;
        ui.statRun.textContent = state.run;
        ui.statTurn.textContent = `${state.turn} / 3`;
        ui.statDebt.textContent = `${formatNumberWithComma(state.targetDebt)}💰`;
        if (ui.statDebtStart) ui.statDebtStart.textContent = `${formatNumberWithComma(state.targetDebt)}💰`;
        
        // [FIX] Сначала обновляем HTML, чтобы получить правильные координаты для анимации
        ui.statCoins.innerHTML = `<span>${formatNumberWithComma(state.coins)}💰</span>`;
        
        // Анимация монет
        if (ui.statCoins && typeof lastKnownCoins !== 'undefined' && lastKnownCoins !== state.coins) {
            const change = state.coins - lastKnownCoins;
            console.log(`[DEBUG] Анимация монет: ${lastKnownCoins} -> ${state.coins}, изменение: ${change}`);
            showCoinChangePopup(change);
        }
        lastKnownCoins = state.coins;
        
        ui.bankBalance.textContent = `${formatNumberWithComma(state.bankBalance)}💰`;
        
        // [FIX] Сначала обновляем HTML, чтобы получить правильные координаты для анимации
        ui.statTickets.innerHTML = `<span>${formatNumberWithComma(state.tickets)}🎟️</span>`;
        
        // Анимация талонов
        if (ui.statTickets && typeof lastKnownTickets !== 'undefined' && lastKnownTickets !== state.tickets) {
            const change = state.tickets - lastKnownTickets;
            console.log(`[DEBUG] Анимация талонов: ${lastKnownTickets} -> ${state.tickets}, изменение: ${change}`);
            showTicketChangePopup(change);
        }
        lastKnownTickets = state.tickets;
        
        // Обновляем счетчик прокрутов, только если не идет анимация
        if (!ui.spinsLeft.querySelector('.spins-counter')) {
            ui.spinsLeft.textContent = state.spinsLeft;
        }
        
        const baseLuck = getItemEffectValue('luck', 0) + (state.permanentLuckBonus || 0);
        const debtLuck = getItemEffectValue('per_run_bonus.luck', 0, 'sum') * state.run;

        // [NEW] Расчет бонуса от "Коллекционера талонов"
        let ticketLuck = 0;
        if (hasItem('ticket_hoarder')) {
            const effect = ALL_ITEMS.find(i => i.id === 'ticket_hoarder').effect.per_ticket_luck;
            ticketLuck = Math.floor(state.tickets / effect.per) * effect.luck;
        }

        // [FIX] Добавляем расчет бонуса от пассивки "Гордость барахольщика"
        let hoarderLuck = 0;
        if (hasPassive('hoarders_pride')) {
            hoarderLuck = Math.max(0, getMaxInventorySize() - state.inventory.length);
        }

        let luckText = `${baseLuck}`;
        if (debtLuck > 0) luckText += ` (+${formatNumberWithComma(debtLuck)} от долга)`;
        if (ticketLuck > 0) luckText += ` (+${ticketLuck} от талонов)`;
        if (state.tempLuck > 0) luckText += ` (+${formatNumberWithComma(state.tempLuck)})`;
        if (state.cherryLuckBonus > 0) luckText += ` (+${state.cherryLuckBonus} Вишнёвая удача)`;
        if (hoarderLuck > 0) luckText += ` (+${hoarderLuck} за слоты)`;
        // --- ЭФФЕКТ: luck_battery ---
        if (hasItem('luck_battery')) {
            state.luckBatteryCharge = state.luckBatteryCharge || 0;
            if (state.luckBatteryCharge > 0) {
                luckText += ` (+${state.luckBatteryCharge} батарея удачи)`;
            }
        }
        // --- ЭФФЕКТ: Звонкая удача ---
        if (hasItem('ringing_luck') && Array.isArray(state.grid)) {
            const bellCount = state.grid.filter(s => s && s.id === 'bell').length;
            if (bellCount > 0) {
                luckText += ` (+${bellCount} от Звонкая удача)`;
            }
        }
        ui.statLuck.textContent = luckText;
        
        let cherryLuckInfo = document.getElementById('cherry-luck-info');
        if (cherryLuckInfo) cherryLuckInfo.remove();
        ui.atmInterestRate.textContent = (state.baseInterestRate * 100).toFixed(0);
        
        let bonus = state.inventory.reduce((acc, item) => acc + (item.effect?.interest_rate_bonus || 0), 0);
        let bonusText = '';
        if (bonus > 0) bonusText = ` <span style="color:var(--highlight-color); font-size:12px;">(+${(bonus*100).toFixed(0)}% от предметов)</span>`;
        let percent = state.baseInterestRate;
        let bank = state.bankBalance;
        let profit = Math.floor(bank * percent);
        let profitText = `<div style='font-size:13px; margin-top:4px;'>След. процент: <b style='color:var(--money-color)'>+${formatNumberWithComma(profit)}💰</b> (${(percent*100).toFixed(0)}%${bonusText})</div>`;
        let infoBlock = document.getElementById('interest-info-block');
        if (!infoBlock) {
            infoBlock = document.createElement('div');
            infoBlock.id = 'interest-info-block';
            ui.atmInterestRate.parentElement.parentElement.appendChild(infoBlock);
        }
        infoBlock.innerHTML = profitText;
        
        if (state.turn >= 3) {
            ui.earlyPayoffSection.style.display = 'none';
        } else {
            ui.earlyPayoffSection.style.display = 'block';
            const totalMoney = state.coins + state.bankBalance;
            const canAfford = totalMoney >= state.targetDebt;
            ui.btnPayDebtEarly.disabled = !canAfford;

            let bonusInfo = '';
            if (state.turn === 1) {
                const bCoins = Math.floor(state.targetDebt * 0.25);
                const bTickets = 5 + state.run;
                bonusInfo = `Награда за раунд 1: <b style="color:var(--money-color)">+${formatNumberWithComma(bCoins)}💰</b> и <b style="color:var(--ticket-color)">+${formatNumberWithComma(bTickets)}🎟️</b>`;
            } else if (state.turn === 2) {
                const bCoins = Math.floor(state.targetDebt * 0.10);
                const bTickets = 2 + state.run;
                bonusInfo = `Награда за раунд 2: <b style="color:var(--money-color)">+${formatNumberWithComma(bCoins)}💰</b> и <b style="color:var(--ticket-color)">+${formatNumberWithComma(bTickets)}🎟️</b>`;
            }
            ui.earlyPayoffBonusInfo.innerHTML = bonusInfo;
        }

        ui.btnEndTurn.disabled = state.isSpinning || state.spinsLeft > 0;
        let rerollCost = CONFIG.REROLL_COST;
        if (hasPassive('reroll_master') && !state.flags.firstRerollUsed) {
            rerollCost = Math.max(0, rerollCost - 1);
        }
        // [FIX] КОРРЕКТНОЕ ОТОБРАЖЕНИЕ БЕСПЛАТНЫХ РЕРОЛЛОВ
        if (state.freeRerolls > 0) {
            ui.btnRerollShop.textContent = `Reroll (Бесплатно: ${state.freeRerolls})`;
        } else {
            ui.btnRerollShop.textContent = `Reroll (${rerollCost}🎟️)`;
        }
        renderInventory(); 
        renderShop();
        
        // Обновляем данные для статистики
        updateWeightedSymbols();
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
                if (!symbol) { 
                    console.error("Attempted to render an undefined symbol. Grid:", finalGrid, "Weighted Symbols:", weightedSymbols);
                    return; 
                }
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

    function createItemElement(item, purchaseCallback) {
        const itemDiv = document.createElement('div');
        itemDiv.className = `item rarity-${item.rarity}`;
        
        const activatableEffects = [
            'on_spin_bonus', 'on_round_start_coins', 'on_round_start_spins', 'on_loss_bonus',
            'on_reroll_bonus', 'on_spin_luck_bonus', 'temporary_luck_on_spin',
            'symbol_win_bonus', 'on_win_streak_bonus', 'on_first_deposit_bonus',
            'on_spin_count_bonus', 'luck_chance', 'on_spin_sacrifice', 'guarantee_symbol', 
            'sync_cells', 'on_last_spin_bonus', 'on_round_end_bonus', 'per_empty_slot_bonus',
            'winMultiplier', 'odd_round_multiplier'
        ];
        let isActivatable = typeof item.on_spin_bonus === 'function';
        if (!isActivatable && item.effect) {
            isActivatable = activatableEffects.some(key => item.effect.hasOwnProperty(key));
        }
        if (isActivatable) {
            itemDiv.classList.add('animated-item');
        }

        let currentCost = item.cost;
        let oldCost = null;
        // Скидка от предметов с эффектом shop_discount
        let shopDiscount = 0;
        state.inventory.forEach(invItem => {
            if (invItem.effect?.shop_discount) {
                shopDiscount += invItem.effect.shop_discount;
            }
        });
        if (shopDiscount > 0) {
            currentCost = Math.max(1, currentCost - shopDiscount);
        }
        // Скидка от пассивки "Специалист по бартеру"
        if (purchaseCallback && hasPassive('barterer') && item.cost >= 5) {
            currentCost = Math.max(1, currentCost - 1);
        }
        // Скидка от пассивки "Шопоголик" (только на первую покупку в раунде)
        if (purchaseCallback && hasPassive('shopaholic') && state.flags.firstPurchaseThisRound) {
            currentCost = Math.max(1, currentCost - 2);
        }
        // Если цена изменилась, запомним старую для зачёркивания
        if (currentCost < item.cost) {
            oldCost = item.cost;
        }

        if (purchaseCallback) {
            itemDiv.onclick = () => purchaseCallback(item.id);
            if (state.tickets < currentCost || state.inventory.length >= getMaxInventorySize()) {
                itemDiv.style.opacity = '0.5';
                itemDiv.style.cursor = 'not-allowed';
            }
        } else {
            itemDiv.style.cursor = 'pointer';
            itemDiv.onclick = () => showAmuletPopup(item);
        }

        const thumbnailDiv = document.createElement('div');
        thumbnailDiv.className = 'item-thumbnail';
        const thumbnailValue = item.thumbnail || '?';
        if (thumbnailValue.endsWith('.png') || thumbnailValue.endsWith('.jpg') || thumbnailValue.endsWith('.gif')) {
            thumbnailDiv.innerHTML = `<img src="img/${thumbnailValue}" alt="${item.name}" style="width:100%; height:100%; object-fit:cover;">`;
        } else {
            thumbnailDiv.textContent = thumbnailValue;
        }

        const infoDiv = document.createElement('div');
        infoDiv.className = 'item-info';
        
        const headerDiv = document.createElement('div');
        headerDiv.className = 'item-header';
        
        const nameSpan = document.createElement('span');
        nameSpan.className = 'item-name';
        nameSpan.textContent = item.name;
        
        headerDiv.appendChild(nameSpan);

        if (purchaseCallback && item.cost) {
            const costSpan = document.createElement('span');
            costSpan.className = 'item-cost';
            costSpan.textContent = `${currentCost}🎟️`;
            if (oldCost && currentCost < oldCost) {
                costSpan.innerHTML += ` <s style="opacity:0.6">${oldCost}🎟️</s>`;
            }
            headerDiv.appendChild(costSpan);
        }
        
        const descP = document.createElement('p');
        descP.className = 'item-desc';
        descP.innerHTML = item.desc;
        
        infoDiv.appendChild(headerDiv);
        infoDiv.appendChild(descP);

        if (item.effect?.luck_chance?.breakable) {
            const maxUses = item.effect.luck_chance.max_uses || item.uses || 10;
            const usesSpan = document.createElement('span');
            usesSpan.style.cssText = 'color:#ffab40; font-size:11px; margin-top: auto;';
            usesSpan.textContent = `(Исп: ${item.uses !== undefined ? item.uses : maxUses}/${maxUses})`;
            infoDiv.appendChild(usesSpan);
        }

        // [NEW] Отображение для breakable предметов без luck_chance
        if (item.effect?.breakable && !item.effect?.luck_chance) {
            const maxUses = item.effect.max_uses || item.uses || 10;
            const usesSpan = document.createElement('span');
            usesSpan.style.cssText = 'color:#ffab40; font-size:11px; margin-top: auto;';
            usesSpan.textContent = `(Исп: ${item.uses !== undefined ? item.uses : maxUses}/${maxUses})`;
            infoDiv.appendChild(usesSpan);
        }

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

        itemDiv.appendChild(thumbnailDiv);
        itemDiv.appendChild(infoDiv);

        itemDiv.dataset.itemId = item.id;

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
        amuletPopup.querySelector('.amulet-popup-close').onclick = () => amuletPopup.remove();
        amuletPopup.onclick = (e) => { if (e.target === amuletPopup) amuletPopup.remove(); };
        amuletPopup.querySelector('.amulet-popup-remove').onclick = () => {
            removeAmulet(item.id);
            amuletPopup.remove();
        };
    }
    function removeAmulet(itemId) {
        const idx = state.inventory.findIndex(i => i.id === itemId);
        if (idx !== -1) {
            const [removed] = state.inventory.splice(idx, 1);
            if (!ALL_ITEMS.some(i => i.id === removed.id)) {
                ALL_ITEMS.push(removed);
            }
            let refund = 0;
            if (removed.rarity === 'rare') refund = 2;
            if (removed.rarity === 'legendary') refund = 3;
            if (refund > 0) {
                state.tickets += refund;
                addLog(`Вы получили обратно ${refund} 🎟️ за выкинутый амулет (${removed.rarity === 'rare' ? 'редкий' : 'легендарный'}).`, 'win');
            }
            addLog(`Амулет "${removed.name}" выкинут и снова может появиться в магазине.`, 'loss');
            updateMimicTarget();

            // [FIX] Принудительно обновляем UI режима планирования, если он активен
            if (ui.planningModal && !ui.planningModal.classList.contains('hidden')) {
                ui.planningTickets.textContent = state.tickets;
                renderPlanningInventory();
                renderPlanningShop();
            }

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
        counter.textContent = `Амулеты: ${state.inventory.length} / ${getMaxInventorySize()}`;
        if (state.inventory.length >= getMaxInventorySize()) {
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
        if (ui.btnPlanningReroll) {
            let rerollCost = CONFIG.REROLL_COST;
            if (hasPassive('reroll_master') && !state.flags.firstRerollUsed) {
                rerollCost = Math.max(0, rerollCost - 1);
            }
            if (state.freeRerolls > 0) {
                ui.btnPlanningReroll.textContent = `Reroll (Бесплатно: ${state.freeRerolls})`;
            } else {
                ui.btnPlanningReroll.textContent = `Reroll (${rerollCost}🎟️)`;
            }
        }
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
        counter.textContent = `Амулеты: ${state.inventory.length} / ${getMaxInventorySize()}`;
        if (state.inventory.length >= getMaxInventorySize()) {
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
        if (state.freeRerolls && state.freeRerolls > 0) {
            state.freeRerolls--;
            populateShop();
            addLog('Бесплатный реролл магазина!', 'win');
            if (hasItem('coupon_book')) animateInventoryItem('coupon_book');
            if (hasItem('resellers_ticket')) {
                state.tickets += 1;
                addLog('Билет перекупщика: +1🎟️ за реролл!', 'win');
                animateInventoryItem('resellers_ticket');
            }
        } else if (state.tickets >= CONFIG.REROLL_COST) {
            state.tickets -= CONFIG.REROLL_COST;
            populateShop();
            addLog(`Магазин обновлен за ${CONFIG.REROLL_COST}🎟️.`);
            if (hasItem('resellers_ticket')) {
                state.tickets += 1;
                addLog('Билет перекупщика: +1🎟️ за реролл!', 'win');
                animateInventoryItem('resellers_ticket');
            }
        } else {
            addLog('Недостаточно талонов.', 'loss');
            return;
        }

        ui.planningTickets.textContent = state.tickets;
        renderPlanningShop();
        updateUI();
    }
    
    function getMinInterestRate() {
        let min = 0.03;
        const bonus = state.inventory.reduce((acc, item) => acc + (item.effect?.interest_rate_bonus || 0), 0);
        const floor = state.inventory.reduce((acc, item) => acc + (item.effect?.min_interest_rate_floor || 0), 0);
        
        let passiveMin = 0;
        if (hasPassive('vault_insurance_passive')) {
             passiveMin = Math.max(passiveMin, 0.10);
        }
        if (hasPassive('financial_literacy')) {
            passiveMin = Math.max(passiveMin, 0.05);
        }

        return min + bonus + floor + passiveMin;
    }

    function updateInterestRate() {
        let base = 0.30 + (state.passiveInterestBonus || 0);
        base -= (state.run - 1) * 0.03;
        base -= (state.turn - 1) * 0.10;
        
        let minRate = getMinInterestRate();
        
        if (base < minRate) base = minRate;
        state.baseInterestRate = base;
    }

    function updateMimicTarget() {
        const mimicItem = state.inventory.find(item => item.id === 'mimic_chest');
        if (mimicItem) {
            const candidates = state.inventory.filter(item => item.id !== 'mimic_chest' && !item.effect?.mimic); // Не копируем другой мимик
            if (candidates.length > 0) {
                const target = candidates[Math.floor(Math.random() * candidates.length)];
                // [FIX] Улучшенная логика мимика: копируем весь объект эффекта
                mimicItem.effect = { ...ALL_ITEMS.find(i => i.id === 'mimic_chest').effect, ...target.effect };
                mimicItem.effect.mimic.target = target.id; // Сохраняем ID для отображения
            } else {
                mimicItem.effect = { ...ALL_ITEMS.find(i => i.id === 'mimic_chest').effect }; // Сброс к базовому эффекту
            }
            animateInventoryItem('mimic_chest');
        }
    }

    ui.btnStartGame.onclick = initGame;
    ui.btnRestartGame.onclick = initGame;
    ui.lever.onclick = spin;
    ui.btnEndTurn.onclick = endTurn;
    ui.btnConfirmEndTurn.onclick = confirmEndTurn;
    ui.btnBuySpins7.onclick = () => buySpins(CONFIG.SPIN_PACKAGE_1);
    ui.btnBuySpins3.onclick = () => buySpins(CONFIG.SPIN_PACKAGE_2);
    ui.btnBuySpin1.onclick = () => buySpins('single');
    ui.btnBuyNothing.onclick = () => buySpins(null);
    ui.btnRerollShop.onclick = rerollShop;
    ui.btnPlanning.onclick = openPlanningMode;
    ui.btnPlanningReroll.onclick = rerollPlanningShop;
    ui.btnFinishPlanning.onclick = closePlanningMode;
    ui.btnPayDebtEarly.onclick = payDebtEarly;

    ui.startScreen.classList.remove('hidden');

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
        updateWeightedSymbols(); // <--- Гарантируем синхронизацию
        addLog('Dev: Шансы символов обновлены.', 'win');
    };
    devApplyLuck.onclick = () => {
        const val = parseInt(devLuckInput.value, 10);
        if (!isNaN(val)) {
            state.tempLuck = val;
            addLog(`Dev: Временная удача установлена: ${val}`, 'win');
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

    function updateStartDebt() {
        const el = document.getElementById('start-debt-value');
        if (el && state && state.targetDebt) el.textContent = formatNumberWithComma(state.targetDebt);
    }
    const tutorialPages = [
        {
            title: '🎯 Цель игры',
            text: 'Ваша задача — выплатить постоянно растущий долг. У вас есть 3 дня (раунда) в каждом цикле, чтобы заработать как можно больше денег. Конечная цель — достичь 88,888,888💰.'
        },
        {
            title: '🎰 Прокруты и раунды',
            text: 'В начале каждого дня вы покупаете прокруты. Каждый прокрут вращает барабаны и даёт вам комбинации символов, которые приносят монеты. Неиспользованные прокруты сгорают в конце дня.'
        },
        {
            title: '💎 Амулеты и талоны',
            text: 'Талоны (🎟️), полученные при покупке прокрутов, можно потратить в магазине на амулеты. Амулеты — это мощные пассивные улучшения, которые действуют постоянно и могут кардинально изменить ход игры.'
        },
        {
            title: '🏦 Наличные и Банк',
            text: 'Ваши наличные (💰) в безопасности и не сгорают в конце дня. Однако, чтобы деньги работали на вас, их можно вносить в банк. В начале следующего дня банк начисляет проценты на вклад. Это ключ к быстрому росту капитала!'
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
    const btnShowTutorial = document.getElementById('btn-show-tutorial');
    if (btnShowTutorial) btnShowTutorial.onclick = openTutorial;
    const tutorialPrev = document.getElementById('tutorial-prev');
    const tutorialNext = document.getElementById('tutorial-next');
    const tutorialClose = document.getElementById('tutorial-close');
    if (tutorialPrev) tutorialPrev.onclick = () => { if (tutorialIndex > 0) { tutorialIndex--; showTutorialPage(tutorialIndex); } };
    if (tutorialNext) tutorialNext.onclick = () => { if (tutorialIndex < tutorialPages.length-1) { tutorialIndex++; showTutorialPage(tutorialIndex); } };
    if (tutorialClose) tutorialClose.onclick = closeTutorial;
    
    const origInitGame = initGame;
    window.initGame = function() {
        origInitGame.apply(this, arguments);
        updateStartDebt();
    };

    function getDepositAmountAll() {
        return state.coins;
    }
    function getDepositAmountExcept7() {
        let cost = CONFIG.SPIN_PACKAGE_1.cost;
        if (hasPassive('bulk_buyer')) {
            cost = Math.max(1, cost - 2);
        }
        return Math.max(0, state.coins - cost);
    }
    function getDepositAmountExcept3() {
        return Math.max(0, state.coins - CONFIG.SPIN_PACKAGE_2.cost);
    }
    function getDepositAmountHalf() {
        return Math.floor(state.coins / 2);
    }

    if (ui.btnDepositAll) ui.btnDepositAll.onclick = () => deposit(getDepositAmountAll(), false);
    if (ui.btnDepositExcept7) ui.btnDepositExcept7.onclick = () => deposit(getDepositAmountExcept7(), false);
    if (ui.btnDepositExcept3) ui.btnDepositExcept3.onclick = () => deposit(getDepositAmountExcept3(), false);
    if (ui.btnDepositHalf) ui.btnDepositHalf.onclick = () => deposit(getDepositAmountHalf(), false);
    if (ui.btnEorDepositAll) ui.btnEorDepositAll.onclick = () => deposit(getDepositAmountAll(), true);
    if (ui.btnEorDepositExcept7) ui.btnEorDepositExcept7.onclick = () => deposit(getDepositAmountExcept7(), true);
    if (ui.btnEorDepositExcept3) ui.btnEorDepositExcept3.onclick = () => deposit(getDepositAmountExcept3(), true);
    if (ui.btnEorDepositHalf) ui.btnEorDepositHalf.onclick = () => deposit(getDepositAmountHalf(), true);

    const depositBtn = document.getElementById('btn-deposit');
    const depositDropdown = document.getElementById('deposit-dropdown');
    const eorDepositBtn = document.getElementById('btn-eor-deposit');
    const eorDepositDropdown = document.getElementById('eor-deposit-dropdown');

    function handleDepositDropdownClick(type, isFromEOR) {
        let amount = 0;
        if (type === 'all') amount = state.coins;
        else if (type === 'except-7') amount = getDepositAmountExcept7();
        else if (type === 'except-3') amount = getDepositAmountExcept3();
        else if (type === 'half') amount = getDepositAmountHalf();
        deposit(amount, isFromEOR);
        if (depositDropdown) depositDropdown.classList.add('hidden');
        if (eorDepositDropdown) eorDepositDropdown.classList.add('hidden');
    }

    if (depositBtn && depositDropdown) {
        depositBtn.onclick = (e) => {
            e.stopPropagation();
            depositDropdown.classList.toggle('hidden');
        };
        depositDropdown.querySelectorAll('.deposit-option').forEach(opt => {
            opt.onclick = (e) => {
                handleDepositDropdownClick(opt.dataset.type, false);
            };
        });
    }
    if (eorDepositBtn && eorDepositDropdown) {
        eorDepositBtn.onclick = (e) => {
            e.stopPropagation();
            eorDepositDropdown.classList.toggle('hidden');
        };
        eorDepositDropdown.querySelectorAll('.deposit-option').forEach(opt => {
            opt.onclick = (e) => {
                handleDepositDropdownClick(opt.dataset.type, true);
            };
        });
    }
    window.addEventListener('click', () => {
        if (depositDropdown) depositDropdown.classList.add('hidden');
        if (eorDepositDropdown) eorDepositDropdown.classList.add('hidden');
    });

    function addLog(message, type = 'normal') {
        if (typeof message === 'string' && (message.startsWith('[DEBUG]') || message.startsWith('[Квантовая Запутанность]') || message.startsWith('Dev:'))) return;
        if (typeof message === 'string') {
            message = message.replace(/\b(\d+)(?=(\d{3})+(?!\d)\b)/g, (match) => match.replace(/,/g, ''));
            message = message.replace(/\b(\d{1,3})(?=(\d{3})+(?!\d)\b)/g, '$1,');
        }
        const logEntry = document.createElement('p');
        logEntry.innerHTML = `> ${message}`;
        if (type === 'win') logEntry.style.color = 'var(--highlight-color)';
        if (type === 'loss') logEntry.style.color = 'var(--danger-color)';
        ui.logPanel.insertBefore(logEntry, ui.logPanel.firstChild);
        if (ui.logPanel.children.length > 50) ui.logPanel.removeChild(ui.logPanel.lastChild);
    }

    // --- ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ: Максимальный размер инвентаря ---
    function getMaxInventorySize() {
        let base = 9;
        if (hasPassive('inventory_plus_one')) base += 1;
        return base;
    }

    // === БОНУСЫ ОТ НОВЫХ ПРЕДМЕТОВ ===
    function applyFruitSaladBonus(grid) {
      // Фруктовый салат: +1💰 за каждую пару соседних (не по диагонали) 🍋 и 🍒
      let bonus = 0;
      const width = 5, height = 3;
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = y * width + x;
          const symbol = grid[idx]?.id;
          // Вправо
          if (x < width - 1) {
            const rightSymbol = grid[idx + 1]?.id;
            if ((symbol === 'lemon' && rightSymbol === 'cherry') || (symbol === 'cherry' && rightSymbol === 'lemon')) {
              bonus += 1;
            }
          }
          // Вниз
          if (y < height - 1) {
            const downSymbol = grid[idx + width]?.id;
            if ((symbol === 'lemon' && downSymbol === 'cherry') || (symbol === 'cherry' && downSymbol === 'lemon')) {
              bonus += 1;
            }
          }
        }
      }
      return bonus;
    }

    function applySweetSpinBonus(grid) {
      // Сладкий прокрут: если на поле нет Лимонов 🍋, +3💰
      return grid.some(s => s.id === 'lemon') ? 0 : 3;
    }

    function applyCloverFieldBonus(grid) {
      // Клеверное поле: если на поле 5+ Клеверов 🍀, +5💰
      const cloverCount = grid.filter(s => s.id === 'clover').length;
      return cloverCount >= 5 ? 5 : 0;
    }

    function applyBookendsBonus(grid) {
      // Книжные подпорки: если символы в левом верхнем и правом нижнем углах совпадают, +4💰
      return (grid[0]?.id && grid[0]?.id === grid[14]?.id) ? 4 : 0;
    }

    // === ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ: Проверка удвоителя ===
    function applyCoinDoubler(bonus) {
      // Перемножаем все множители среди предметов
      const multiplier = state.inventory.reduce((acc, item) => {
        if (item.effect?.double_flat_coin_bonus) {
          // Если число — используем, если true — считаем как 2 (старые предметы)
          return acc * (typeof item.effect.double_flat_coin_bonus === 'number' ? item.effect.double_flat_coin_bonus : 2);
        }
        return acc;
      }, 1);
        if (multiplier > 1) {
            const item = state.inventory.find(i => i.effect?.double_flat_coin_bonus);
            if(item) animateInventoryItem(item.id);
        }
      return bonus * multiplier;
    }

    function animateInventoryItem(itemId) {
      // Ищем элемент в обоих инвентарях для надежности
      const el = document.querySelector(
        `#inventory-items [data-item-id='${itemId}'], #planning-inventory-items [data-item-id='${itemId}']`
      );

      if (el) {
        // Удаляем класс, если он уже есть, чтобы анимация могла быть перезапущена
        el.classList.remove('item-activated');
        // Этот трюк (force reflow) гарантирует, что браузер заметит удаление класса
        // перед тем, как мы добавим его снова, что позволяет перезапустить анимацию.
        void el.offsetWidth;
        
        el.classList.add('item-activated');
        
        // Устанавливаем таймер для удаления класса после завершения анимации.
        setTimeout(() => {
            if (el) { // Проверяем, существует ли еще элемент
                 el.classList.remove('item-activated');
            }
        }, 800); // Длительность должна совпадать с анимацией в CSS

        // [NEW] Echo Stone logic
        if (hasItem('echo_stone') && itemId !== 'echo_stone' && state.activatedItemsThisSpin) {
            if (!state.activatedItemsThisSpin.has(itemId)) {
                state.activatedItemsThisSpin.add(itemId);
                state.echoStoneMultiplier = 1 + state.activatedItemsThisSpin.size;
                updateEchoStoneDisplay();
            }
        }
      }
    }

    function updateEchoStoneDisplay() {
        if (!hasItem('echo_stone')) return;
        const multiplier = state.echoStoneMultiplier || 1;
        const echoStones = document.querySelectorAll("[data-item-id='echo_stone'] .echo-stone-multiplier");
        echoStones.forEach(el => {
            el.textContent = `x${multiplier}`;
            if (multiplier > 1) {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
        });
    }

    // --- новая версия applyPassive ---
    function applyPassive(passive, state) {
        if (!passive || !state) return;
        state.activePassives.push(passive);
        // Применяем эффект, если он не slot_modifier (они применяются в updateWeightedSymbols)
        if (passive.type !== 'slot_modifier' && typeof passive.effect === 'function') {
            passive.effect(state);
        }
        addLog(`Выбран пассивный бонус: ${passive.name}.`, 'win');
        window.state = state;
        updateWeightedSymbols();
        if (typeof window.populateStats === 'function') {
            window.populateStats();
        }
    }
});