document.addEventListener('DOMContentLoaded', () => {
    // Функция для подсчёта количества эмодзи в строке
    function countEmojis(str) {
        // Покрывает большинство emoji, в том числе составные
        const emojiRegex = /(\p{Extended_Pictographic}(?:\uFE0F|\u20E3)?)/gu;
        return (str.match(emojiRegex) || []).length;
    }

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
        btnLeaderboard: document.getElementById('btn-leaderboard'),
    };
    // Отключаем контекстное меню по правому клику мыши на всей странице
    document.addEventListener('contextmenu', event => event.preventDefault());

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
        { id: 'lemon',    value: 1, weight: 194, graphic: GRAPHICS.lemon },   // 19.4%
        { id: 'cherry',   value: 1, weight: 194, graphic: GRAPHICS.cherry },  // 19.4%
        { id: 'clover',   value: 2, weight: 149, graphic: GRAPHICS.clover },  // 14.9%
        { id: 'bell',     value: 2, weight: 149, graphic: GRAPHICS.bell },    // 14.9%
        { id: 'diamond',  value: 3, weight: 119, graphic: GRAPHICS.diamond }, // 11.9%
        { id: 'coins',    value: 3, weight: 119, graphic: GRAPHICS.coins },   // 11.9%
        { id: 'seven',    value: 6, weight: 75,  graphic: GRAPHICS.seven },   // 7.5%
    ];
    window.SYMBOLS = SYMBOLS;
    const ORIGINAL_SYMBOLS = JSON.parse(JSON.stringify(SYMBOLS)); // Для сброса шансов в новой игре

    // Экспортируем данные для поп-апа статистики
    window.symbols = SYMBOLS;
    window.symbolWeights = {};
    window.gameState = {};

    

    function updateWeightedSymbols() {
        // Теперь используем текущий массив SYMBOLS, чтобы поддерживать изменения из Dev-меню
        let currentSymbols = JSON.parse(JSON.stringify(SYMBOLS));

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

        // --- ДОБАВЛЕНО: Применяем накопленный бонус от усилителей вишни ---
        if (window.state.cherryBaseValue) {
            currentSymbols.forEach(s => {
                if (s.id === 'cherry') {
                    s.value += window.state.cherryBaseValue;
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
        { name: "Диагональ ↘", positions: [0, 6, 12], multiplier: 2, type: "Диагональная" },
        { name: "Диагональ ↙", positions: [10, 6, 2], multiplier: 2, type: "Диагональная" },
        { name: "Малая диагональ ↘", positions: [1, 7, 13], multiplier: 2, type: "Диагональная" },
        { name: "Малая диагональ ↙", positions: [11, 7, 3], multiplier: 2, type: "Диагональная" },

        { name: "Заг", positions: [0, 6, 12, 8, 4], multiplier: 4, type: "Зиг-Заг" },
        { name: "Зиг", positions: [10, 6, 2, 8, 14], multiplier: 4, type: "Зиг-Заг" },
        { name: "Ступени вниз", positions: [0, 5, 7, 9, 14], multiplier: 4, type: "Зиг-Заг" },
        { name: "Ступени вверх", positions: [10, 5, 7, 9, 4], multiplier: 4, type: "Зиг-Заг" },
        
        { name: "Небо", positions: [2, 6, 7, 8, 12], multiplier: 7, type: "Небо/Земля" },
        { name: "Земля", positions: [5, 1, 7, 13, 9], multiplier: 7, type: "Небо/Земля" },
        
        { name: "Третий Глаз", positions: [1, 6, 12, 8, 3], multiplier: 5, type: "Секретная" },
        
        { name: "Рамка", positions: [0, 1, 2, 3, 4, 5, 9, 10, 11, 12, 13, 14], multiplier: 10, type: "Специальная" },
        { name: "Крест", positions: [0, 5, 10, 11, 13, 14, 9, 4], multiplier: 10, type: "Специальная" },
    ];

    // Делаем PAYLINES глобально доступным
    window.PAYLINES = PAYLINES;

    let state = {};
    let weightedSymbols = [];
    let devDebugLuck = false;
    let lastKnownTickets = 0;
    let lastKnownCoins = 0;
    let firstSession = true; // Флаг для показа рекламы только не в первую сессию
    let lastAdShownTime = 0; // Время последнего показа рекламы

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

        // --- ПАССИВКА: Расширенный выбор ---
        let passiveCount = 3;
        if (hasPassive('expanded_choice')) {
            passiveCount = 4;
        }

        const passives = getRandomPassives(passiveCount, excludeIds);
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
        // mimic: копирует эффект другого предмета
        const mimicItem = items.find(item => item.effect?.mimic);
        if (mimicItem) {
            const targetId = mimicItem.effect.mimic.target;
            const target = ALL_ITEMS.find(i => i.id === targetId);
            if (target) items.push({...target, id: 'mimic_copy'});
        }
        // flat_bonus_enhancer: усиливает числовые бонусы от других предметов
        const enhancer = items.find(item => item.effect?.flat_bonus_enhancer);
        const enhancerValue = enhancer ? enhancer.effect.flat_bonus_enhancer : null;
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
                    // Усиливаем только если это не множитель/процент и есть flat_bonus_enhancer, и это не сам энхансер
                    if (
                        enhancerValue &&
                        typeof value === 'number' &&
                        !effectKey.toLowerCase().includes('multiplier') &&
                        !effectKey.toLowerCase().includes('percent') &&
                        !effectKey.toLowerCase().includes('interest') &&
                        (!item.effect.flat_bonus_enhancer)
                    ) {
                        const oldValue = value;
                        value = Math.ceil(value * enhancerValue);
                        if (typeof console !== 'undefined') {
                            console.log(
                                `[AURA] Бонус "${effectKey}" от предмета "${item.name}" усилен с ${oldValue} до ${value} (модификатор: x${enhancerValue})`
                            );
                        }
                    }
                    if (accumulator === 'multiply') return acc * value;
                    return acc + value;
                }
            }
            return acc;
        }, defaultValue);
    }

    function getBreakableUsesBoost() {
        return state.inventory.reduce((acc, item) => {
            if (item.modifier && item.modifier.effect && item.modifier.effect.breakable_item_uses_boost) {
                return acc + item.modifier.effect.breakable_item_uses_boost;
            }
            return acc;
        }, 0);
    }

    if (typeof window !== 'undefined') {
      window.getBreakableUsesBoost = getBreakableUsesBoost;
    }

    function generateGrid() {
        updateWeightedSymbols();
        // --- ФИЛЬТРАЦИЯ ЗАПРЕЩЁННЫХ СИМВОЛОВ ---
        const banned = (state.bannedSymbols || []).filter(b => b.spinsLeft > 0).map(b => b.symbol);
        let filteredWeightedSymbols = weightedSymbols.filter(s => !banned.includes(s.id));
        let filteredSYMBOLS = SYMBOLS.filter(s => !banned.includes(s.id));

        let tempLuck = 0;
        
        // --- ВРЕМЕННАЯ УДАЧА ОТ temporary_luck_on_spin ---
        let tempLuckFromItems = 0;
        if (Array.isArray(state.grid)) {
            state.inventory.forEach(item => {
                if (item.effect?.temporary_luck_on_spin) {
                    const symbolId = item.effect.temporary_luck_on_spin;
                    const count = state.grid.filter(s => s && s.id === symbolId).length;
                    if (count > 0) {
                        tempLuckFromItems += count;
                    }
                }
                // [NEW] conditional_luck: если на поле есть хотя бы один указанный символ, даём фиксированный бонус
                if (item.effect?.conditional_luck) {
                    const { symbol, bonus } = item.effect.conditional_luck;
                    const found = state.grid.some(s => s && s.id === symbol);
                    if (found) {
                        tempLuckFromItems += bonus;
                        addLog(`${item.name}: +${bonus} к временной удаче (условие выполнено).`, 'win');
                        animateInventoryItem(item.id);
                    }
                }
            });
        }
        // Влияет только на этот спин
        let totalTempLuck = (state.tempLuck || 0) + tempLuckFromItems;

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
                addLog(`Кровавый Ритуал: -${cost}💲, +${bonusLuck} к удаче на этот спин.`, 'win');
                animateInventoryItem('blood_ritual'); // [NEW] Анимация
            }
        }
        // [NEW] Логика предмета 'lucky_hat'
            if (hasItem('lucky_hat')) {
                const effect = ALL_ITEMS.find(i => i.id === 'lucky_hat').effect.every_n_spin_luck;
                if ((state.roundSpinsMade + 1) % effect.n === 0) {
                    tempLuck += effect.luck;
                    addLog(`Шляпа удачи: +${effect.luck} к удаче (каждый ${effect.n}-й спин).`, 'win');
                    animateInventoryItem('lucky_hat');
                }
            }
            
        
        const perRunLuck = hasItem('growing_debt') ? getItemEffectValue('per_run_bonus.luck', 0, 'sum') * state.run : 0;
        
        // [FIX] Предмет "Гордость барахольщика" теперь использует getHoarderPrideBonus
        let hoarderLuck = 0;
        if (hasItem('hoarders_pride')) {
            hoarderLuck = getHoarderPrideBonus();
        }

        // [NEW] Логика предмета 'ticket_hoarder'
            let ticketLuck = 0;
            if (hasItem('ticket_hoarder')) {
                const effect = ALL_ITEMS.find(i => i.id === 'ticket_hoarder').effect.per_ticket_luck;
                ticketLuck = Math.floor(state.tickets / effect.per) * effect.luck;
            }
        
        // ВАЖНО: используем totalTempLuck вместо state.tempLuck
        const totalLuck = (state.permanentLuckBonus || 0) + getItemEffectValue('luck', 0) + totalTempLuck + tempLuck + perRunLuck + hoarderLuck + ticketLuck + (state.cherryLuckBonus || 0);

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
            const idx = Math.floor(Math.random() * filteredSYMBOLS.length);
            chosenSymbolIds.push(filteredSYMBOLS[idx].id);
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
        let adjustedSymbols = filteredWeightedSymbols.map(symbol => {
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
            const highValueSymbols = filteredSYMBOLS.filter(s => ['diamond', 'coins', 'seven'].includes(s.id));
            if (highValueSymbols.length > 0) {
                const randomHighSymbol = highValueSymbols[Math.floor(Math.random() * highValueSymbols.length)];
                grid[7] = randomHighSymbol;
                addLog(`Центральный элемент сработал! В центре появился ${randomHighSymbol.graphic}.`, 'win');
            }
        }
        
        // --- ЭФФЕКТ: guarantee_symbol ---
        const guarantee = state.inventory.find(item => item.effect?.guarantee_symbol);
        if (guarantee) {
            const { symbol, count } = guarantee.effect.guarantee_symbol;
            if (!banned.includes(symbol)) {
                let positions = Array.from({length: grid.length}, (_, i) => i);
                for (let i = 0; i < count; i++) {
                    if (positions.length === 0) break;
                    const idx = Math.floor(Math.random() * positions.length);
                    grid[positions[idx]] = SYMBOLS.find(s => s.id === symbol);
                    positions.splice(idx, 1);
                }
                animateInventoryItem(guarantee.id);
            }
        }
        // --- ЭФФЕКТ: sync_cells ---
        const sync = state.inventory.find(item => item.effect?.sync_cells);
        if (sync) {
            const positions = sync.effect.sync_cells.cells;
            if (Array.isArray(positions) && positions.length > 0 && grid.length > 0) {
                // Только если символ не запрещён
                const symbol = grid[positions[0]];
                if (!banned.includes(symbol.id)) {
                    positions.forEach(pos => grid[pos] = symbol);
                    animateInventoryItem(sync.id);
                }
            }
        }

        // --- ЭФФЕКТ: golden_symbol_chance (Позолота) ---
        const goldenPolishItems = state.inventory.filter(item => item.effect?.golden_symbol_chance);
        goldenPolishItems.forEach(item => {
            const effect = item.effect.golden_symbol_chance;
            const targetSymbol = effect.symbol;
            const chance = effect.chance;
            const multiplier = effect.multiplier;
            
            // Проходим по всем позициям в сетке
            grid.forEach((symbol, index) => {
                if (symbol && symbol.id === targetSymbol && Math.random() < chance) {
                    // Создаем золотую версию символа
                    const goldenSymbol = {
                        ...symbol,
                        id: symbol.id,
                        value: symbol.value * multiplier,
                        isGolden: true,
                        originalValue: symbol.value
                    };
                    grid[index] = goldenSymbol;
                    
                    // Добавляем лог о превращении
                    addLog(`✨ Позолота ${symbol.graphic}: символ стал золотым! (${symbol.value} → ${goldenSymbol.value})`, 'win');
                    animateInventoryItem(item.id);
                }
            });
        });

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

        // --- ЭФФЕКТ: mirror_dimension ---
        if (hasItem('mirror_dimension')) {
            // Индексы для зеркалирования: левая часть <- правая часть
            const mirrorPairs = [
                [0, 4], [1, 3], [5, 9], [6, 8], [10, 14], [11, 13]
            ];
            mirrorPairs.forEach(([left, right]) => {
                grid[left] = { ...grid[right] };
            });
        }

        // --- ЭФФЕКТ: Космическая Сингулярность ---
        const singularityItem = state.inventory.find(item => item.id === 'cosmic_singularity');
        if (singularityItem) {
            const chance = singularityItem.effect?.singularity_chance || 0.01;
            if (Math.random() < chance) {
                const centerSymbol = grid[7];
                if (centerSymbol) {
                    for (let i = 0; i < grid.length; i++) {
                        grid[i] = { ...centerSymbol };
                    }
                    addLog('Космическая Сингулярность: все символы притянуты к центру!', 'win');
                    animateInventoryItem('cosmic_singularity');
                }
            }
        }

        return grid;
    }

    // --- ФУНКЦИЯ ДЛЯ ВИЗУАЛЬНОГО ПРЕВРАЩЕНИЯ СИМВОЛОВ В ЗОЛОТЫЕ ---
    function animateGoldenTransformation(symbolElement, symbolData) {
        if (!symbolElement || !symbolData.isGolden) return;

        // Добавляем класс для анимации превращения
        symbolElement.classList.add('turning-golden');
        
        // После завершения анимации превращения добавляем постоянный золотой эффект
        setTimeout(() => {
            symbolElement.classList.remove('turning-golden');
            symbolElement.classList.add('golden');
        }, 600);
    }

    // --- ФУНКЦИЯ ДЛЯ ОБНОВЛЕНИЯ ОТОБРАЖЕНИЯ ЗОЛОТЫХ СИМВОЛОВ ---
    function updateGoldenSymbolsDisplay() {
        const reels = ui.slotMachine.querySelectorAll('.reel');
        const finalGrid = state.grid;

        reels.forEach((reel, i) => {
            const symbols = reel.querySelectorAll('.symbol');
            const symbolData = finalGrid[i];
            
            if (symbolData && symbolData.isGolden) {
                const symbolElement = symbols[symbols.length - 1]; // Последний символ - текущий
                if (symbolElement && !symbolElement.classList.contains('golden')) {
                    animateGoldenTransformation(symbolElement, symbolData);
                }
            }
        });
    }

    function showTotalWinPopup(amount) {
        const popup = document.createElement('div');
        popup.className = 'total-win-popup';
        popup.innerHTML = `
            <div class="win-title">ОБЩИЙ ВЫИГРЫШ</div>
            <div class="win-amount">+${formatNumberWithComma(amount)}💲</div>
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
        
        // [NEW] Логика для Wild Clover и других wild-эффектов
        const wildSymbolIds = state.inventory
            .filter(item => item.effect?.wild_symbol)
            .map(item => item.effect.wild_symbol);
        if (wildSymbolIds.length > 0) {
            // Анимация для всех wild-предметов
            state.inventory.forEach(item => {
                if (item.effect?.wild_symbol) animateInventoryItem(item.id);
            });
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
            // [NEW] conditional_luck: если на поле есть хотя бы один указанный символ, даём фиксированный бонус
            if (item.effect?.conditional_luck) {
                const { symbol, bonus } = item.effect.conditional_luck;
                const found = grid.some(s => s.id === symbol);
                if (found) {
                    state.tempLuck += bonus;
                    addLog(`${item.name}: +${bonus} к временной удаче (условие выполнено).`, 'win');
                    animateInventoryItem(item.id);
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
        // --- [NEW] winMultiplier (например, Колокольчик удачи) ---
        let winMultiplier = 1;
        state.inventory.forEach(item => {
            if (item.effect?.winMultiplier) {
                // Для lucky_bell: если на поле есть bell, применяем множитель
                if (item.id === 'lucky_bell') {
                    if (grid.some(s => s.id === 'bell')) {
                        winMultiplier *= item.effect.winMultiplier;
                        animateInventoryItem('lucky_bell');
                    }
                } else {
                    // Для других предметов с winMultiplier — всегда применяем
                    winMultiplier *= item.effect.winMultiplier;
                }
            }
        });
        winMultiplier = Math.ceil(winMultiplier); // Округление вверх
        
        // Обработка множителя для всех символов
        // Суммируем обычный бонус и бонус за цикл
        const baseAllSymbolsMultiplierBoost = getItemEffectValue('all_symbols_multiplier_boost', 0, 'sum');
        const perRunAllSymbolsMultiplierBoost = state.inventory.reduce((acc, item) => {
            if (item.effect?.per_run_bonus?.all_symbols_multiplier_boost) {
                return acc + item.effect.per_run_bonus.all_symbols_multiplier_boost * state.run;
            }
            return acc;
        }, 0);
        const allSymbolsMultiplierBoostCurrent = baseAllSymbolsMultiplierBoost + perRunAllSymbolsMultiplierBoost;
        if (allSymbolsMultiplierBoostCurrent > 0) {
            // Применяем бонус ко всем символам
            ['lemon', 'cherry', 'clover', 'bell', 'diamond', 'coins', 'seven'].forEach(symbolId => {
                symbolMultipliers[symbolId] = (symbolMultipliers[symbolId] || 1) + allSymbolsMultiplierBoostCurrent;
            });
        }
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

        // --- КРИСТАЛЛ ХАОСА: выбираем линию и модификатор ---
        if (hasItem('chaos_crystal')) {
            const chaosItem = state.inventory.find(item => item.id === 'chaos_crystal');
            const effect = chaosItem.effect.chaos_line_modifier;
            const min = effect.min ?? -2;
            const max = effect.max ?? 3;
            // Выбираем случайную линию из активных
            const allLines = [...PAYLINES];
            const randomLine = allLines[Math.floor(Math.random() * allLines.length)];
            // Случайный модификатор
            const mod = Math.floor(Math.random() * (max - min + 1)) + min;
            state.chaosLineMod = { lineName: randomLine.name, mod };
            addLog(`💎 Кристалл Хаоса: линия "${randomLine.name}" получит модификатор ${mod > 0 ? '+' : ''}${mod} к множителю!`, mod >= 0 ? 'win' : 'loss');
            animateInventoryItem('chaos_crystal');
        } else {
            state.chaosLineMod = undefined;
        }

        activePaylines.forEach(line => {
            const symbolsOnLine = line.positions.map(pos => grid[pos]);
            
            // Проверка: линия полностью в левой части зеркала?
            const mirrorLeft = [0,1,5,6,10,11];
            const isMirrorLine = line.positions.every(pos => mirrorLeft.includes(pos));
            
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

                //за каждый символ в линии даётся вознаграждение
                win = symbolValue * winLength * lineMultiplier;
                
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
                // Применяем глобальный множитель выигрыша (например, Колокольчик удачи)
                if (winMultiplier > 1) {
                    win = Math.floor(win * winMultiplier);
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
                    if (wildSymbolIds.length > 0 && wildSymbolIds.includes(currentSymbol.id)) {
                        const nextNonWild = symbolsOnLine.slice(i + 1).find(s => !wildSymbolIds.includes(s.id));
                        if (nextNonWild) {
                            currentSymbol = nextNonWild;
                        } else { // Вся линия состоит из wild'ов
                            i++; continue;
                        }
                    }

                    let comboLength = 0;
                    let comboPositions = [];
                    for (let j = i; j < symbolsOnLine.length; j++) {
                        if (symbolsOnLine[j].id === currentSymbol.id || (wildSymbolIds.length > 0 && wildSymbolIds.includes(symbolsOnLine[j].id))) {
                            comboLength++;
                            comboPositions.push(line.positions[j]);
                        } else {
                            break;
                        }
                    }

                    if (comboLength >= 3) {
                        let lineMultiplier = lengthMultipliers[comboLength];
                        // Суммируем обычный бонус и бонус за цикл для line_type_multiplier_bonus
                        const typeBonus = state.inventory.reduce((acc, item) => {
                            // Обычный бонус
                            if (item.effect?.line_type_multiplier_bonus && item.effect.line_type_multiplier_bonus.types.some(type => line.type === type)) {
                                acc += item.effect.line_type_multiplier_bonus.bonus;
                            }
                            // Бонус за цикл
                            if (item.effect?.per_run_bonus?.line_type_multiplier_bonus && item.effect.per_run_bonus.line_type_multiplier_bonus.types.some(type => line.type === type)) {
                                acc += item.effect.per_run_bonus.line_type_multiplier_bonus.bonus * (window.state?.run || 1);
                            }
                            return acc;
                        }, 0);
                        lineMultiplier += typeBonus;
                        
                        const lengthBonus = state.inventory.filter(item => item.effect?.line_length_multiplier_bonus).reduce((acc, item) => (item.effect.line_length_multiplier_bonus.length === comboLength) ? acc * item.effect.line_length_multiplier_bonus.multiplier : acc, 1);
                        lineMultiplier *= lengthBonus;

                        // --- Палитра художника: бонус за разнообразие символов ---
                        const paletteItem = state.inventory.find(item => item.effect?.diverse_line_bonus);
                        if (paletteItem && comboLength >= (paletteItem.effect.diverse_line_bonus.min_length || 2)) {
                            // Собираем "реальные" символы линии (wild считаем за currentSymbol)
                            const realSymbols = symbolsOnLine.slice(i, i + comboLength).map(s => (wildSymbolIds.length > 0 && wildSymbolIds.includes(s.id)) ? currentSymbol.id : s.id);
                            const uniqueSymbols = new Set(realSymbols);
                            if (uniqueSymbols.size >= 2) {
                                lineMultiplier += paletteItem.effect.diverse_line_bonus.bonus;
                                addLog(`Палитра художника: линия из разных символов! +${paletteItem.effect.diverse_line_bonus.bonus} к множителю.`, 'win');
                                animateInventoryItem(paletteItem.id);
                            }
                        }

                        // --- diverse_line_bonus: бонус за разнообразие символов (суммируется со всех предметов) ---
                        const allDiverseBonuses = state.inventory
                            .filter(item => item.effect?.diverse_line_bonus && comboLength >= (item.effect.diverse_line_bonus.min_length || 2))
                            .map(item => item.effect.diverse_line_bonus);
                        const realSymbols = symbolsOnLine.slice(i, i + comboLength).map(s => (wildSymbolIds.length > 0 && wildSymbolIds.includes(s.id)) ? currentSymbol.id : s.id);
                        const uniqueSymbols = new Set(realSymbols);
                        allDiverseBonuses.forEach(bonusObj => {
                            if (uniqueSymbols.size >= bonusObj.min_length) {
                                lineMultiplier += bonusObj.bonus;
                                addLog(`Бонус за разнообразие: линия из ${uniqueSymbols.size} разных символов! +${bonusObj.bonus} к множителю.`, 'win');
                            }
                        });

                        // --- применяем модификатор Кристалла Хаоса к lineMultiplier ---
                        let chaosMod = 0;
                        if (state.chaosLineMod && state.chaosLineMod.lineName === line.name) {
                            chaosMod = state.chaosLineMod.mod;
                        }
                        lineMultiplier += chaosMod;

                        let win = processWin(currentSymbol, comboLength, lineMultiplier, comboPositions);
                        // --- Зеркальная линия: делим выигрыш на 2 ---
                        if (isMirrorLine) {
                            win = Math.floor(win / 2);
                        }
                        
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
                if (wildSymbolIds.length > 0 && wildSymbolIds.includes(firstSymbol.id)) {
                    const nextNonWild = symbolsOnLine.find(s => !wildSymbolIds.includes(s.id));
                    if (nextNonWild) lineSymbol = nextNonWild;
                }

                if (symbolsOnLine.every(s => s.id === lineSymbol.id || (wildSymbolIds.length > 0 && wildSymbolIds.includes(s.id)))) {
                    let lineMultiplier = line.multiplier;
                    // Суммируем обычный бонус и бонус за цикл для line_type_multiplier_bonus
                    const typeBonus = state.inventory.reduce((acc, item) => {
                        // Обычный бонус
                        if (item.effect?.line_type_multiplier_bonus && item.effect.line_type_multiplier_bonus.types.some(type => line.type === type)) {
                            acc += item.effect.line_type_multiplier_bonus.bonus;
                        }
                        // Бонус за цикл
                        if (item.effect?.per_run_bonus?.line_type_multiplier_bonus && item.effect.per_run_bonus.line_type_multiplier_bonus.types.some(type => line.type === type)) {
                            acc += item.effect.per_run_bonus.line_type_multiplier_bonus.bonus * (window.state?.run || 1);
                        }
                        return acc;
                    }, 0);
                    lineMultiplier += typeBonus;

                    const lengthBonus = state.inventory.filter(item => item.effect?.line_length_multiplier_bonus).reduce((acc, item) => (item.effect.line_length_multiplier_bonus.length === line.positions.length) ? acc * item.effect.line_length_multiplier_bonus.multiplier : acc, 1);
                    lineMultiplier *= lengthBonus;

                    // --- Палитра художника: бонус за разнообразие символов (для не-сканируемых линий) --- 
                    const paletteItem = state.inventory.find(item => item.effect?.diverse_line_bonus);
                    if (paletteItem && line.positions.length >= (paletteItem.effect.diverse_line_bonus.min_length || 2)) {
                        // Собираем "реальные" символы линии (wild считаем за lineSymbol)
                        const realSymbols = symbolsOnLine.map(s => (wildSymbolIds.length > 0 && wildSymbolIds.includes(s.id)) ? lineSymbol.id : s.id);
                        const uniqueSymbols = new Set(realSymbols);
                        if (uniqueSymbols.size >= 2) {
                            lineMultiplier += paletteItem.effect.diverse_line_bonus.bonus;
                            addLog(`Палитра художника: линия из разных символов! +${paletteItem.effect.diverse_line_bonus.bonus} к множителю.`, 'win');
                            animateInventoryItem(paletteItem.id);
                        }
                    }

                    // --- diverse_line_bonus: бонус за разнообразие символов (для не-сканируемых линий, суммируется со всех предметов) --- 
                    const allDiverseBonuses2 = state.inventory
                        .filter(item => item.effect?.diverse_line_bonus && line.positions.length >= (item.effect.diverse_line_bonus.min_length || 2))
                        .map(item => item.effect.diverse_line_bonus);
                    const realSymbols2 = symbolsOnLine.map(s => (wildSymbolIds.length > 0 && wildSymbolIds.includes(s.id)) ? lineSymbol.id : s.id);
                    const uniqueSymbols2 = new Set(realSymbols2);
                    allDiverseBonuses2.forEach(bonusObj => {
                        if (uniqueSymbols2.size >= bonusObj.min_length) {
                            lineMultiplier += bonusObj.bonus;
                            addLog(`Бонус за разнообразие: линия из ${uniqueSymbols2.size} разных символов! +${bonusObj.bonus} к множителю.`, 'win');
                        }
                    });

                    // --- применяем модификатор Кристалла Хаоса к lineMultiplier ---
                    let chaosMod = 0;
                    if (state.chaosLineMod && state.chaosLineMod.lineName === line.name) {
                        chaosMod = state.chaosLineMod.mod;
                    }
                    lineMultiplier += chaosMod;

                    let win = processWin(lineSymbol, line.positions.length, lineMultiplier, line.positions);
                    // --- Зеркальная линия: делим выигрыш на 2 ---
                    if (isMirrorLine) {
                        win = Math.floor(win / 2);
                    }
                    
                    totalWinnings += win;
                    winningLinesInfo.push({ name: line.name, symbol: lineSymbol.id, win, positions: line.positions });
                    line.positions.forEach(pos => allWinningPositions.add(pos));
                }
            }
        });

        // После подсчёта выигрыша сбрасываем модификатор
        state.chaosLineMod = undefined;

        // --- 2. ПРОВЕРКА СПЕЦИАЛЬНЫХ ПАТТЕРНОВ ---
        const symbolCounts = grid.reduce((acc, s) => { acc[s.id] = (acc[s.id] || 0) + 1; return acc; }, {});
        const [topSymbolId, topCount] = Object.entries(symbolCounts).sort((a,b) => b[1] - a[1])[0] || [null, 0];

        if (topCount === 15) {
            state.consecutiveJackpots = (state.consecutiveJackpots || 0) + 1;
            if (state.consecutiveJackpots >= 2) {
                state.pirateFlagSuperChance = true;
                
            }
            const jackpotWin = SYMBOLS.find(s => s.id === topSymbolId).value * 15 * topCount * (state.run || 1);
            totalWinnings += jackpotWin;
            addLog(`💥 ДЖЕКПОТ!!! 💥 (${topSymbolId} x15 x${state.run || 1}): +${formatNumberWithComma(jackpotWin)}💲`, 'win');
            for(let i=0; i<15; i++) allWinningPositions.add(i);
            
            setTimeout(() => {
                const jackpotOverlay = document.createElement('div');
                jackpotOverlay.className = 'jackpot-overlay';
                jackpotOverlay.innerHTML = `
                    <div class="jackpot-content">
                        <div class="jackpot-title">ДЖЕКПОТ!!!</div>
                        <div class="jackpot-amount">+${formatNumberWithComma(jackpotWin)}💲</div>
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
            const eyeWin = SYMBOLS.find(s => s.id === topSymbolId).value * 10 * topCount;
            totalWinnings += eyeWin;
            addLog(`👁️ ГЛАЗ! 👁️ (${topSymbolId} x${topCount}): +${formatNumberWithComma(eyeWin)}💲`, 'win');
            grid.forEach((s, i) => { if(s.id === topSymbolId) allWinningPositions.add(i); });
        }

        // --- 3. ПОСТ-БОНУСЫ И ЛОГИРОВАНИЕ ---
        const loggedLines = new Set();
        winningLinesInfo.forEach(info => {
             if (!loggedLines.has(info.name)) {
                addLog(`${info.name} (${GRAPHICS[info.symbol]}): +${info.win}💲`, 'win');
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
            addLog(`🔥 КОМБО x${winningLinesInfo.length}! Бонус: +${formatNumberWithComma(comboBonus)}💲`, 'win');

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
                    addLog(`Клеверный бонус: +${formatNumberWithComma(bonus)}💲 за клеверы.`, 'win');
                }
            }
            if (hasPassive('wilder_clover') && hasItem('wild_clover')) {
                const cloverCount = grid.filter(s => s.id === 'clover').length;
                if (cloverCount > 0) {
                    totalWinnings += cloverCount;
                    addLog(`Дичайший клевер: +${cloverCount}💲 за каждый клевер на поле.`, 'win');
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
        let gamblersCoin = state.inventory.find(item => item.id === 'gamblers_coin');
        if (gamblersCoin && typeof gamblersCoin.on_spin_bonus === 'function' && winningLinesInfo.length > 0) {
            // Монетка шулера заменяет выигрыш
            const result = gamblersCoin.on_spin_bonus(state.grid, totalWinnings, state);
            totalWinnings = result;
            addLog(`${gamblersCoin.name}: ${result >= 0 ? '+' : ''}${formatNumberWithComma(result)}💲`, result >= 0 ? 'win' : 'loss');
            if (result > 0) {
                animateInventoryItem(gamblersCoin.id);
            } else if (result < 0) {
                // Анимация красной обводки для проигрыша
                const el = document.querySelector(`#inventory-items [data-item-id='gamblers_coin'], #planning-inventory-items [data-item-id='gamblers_coin']`);
                if (el) {
                    el.classList.remove('item-activated');
                    void el.offsetWidth;
                    el.classList.add('item-activated-loss');
                    setTimeout(() => {
                        el.classList.remove('item-activated-loss');
                    }, 800);
                }
            }
            // Если result === 0 — не активируем анимацию вообще
        }
        // Остальные on_spin_bonus
        state.inventory.forEach(item => {
            if (item.on_spin_bonus && item.id !== 'gamblers_coin') {
                const bonus = item.on_spin_bonus(state.grid, totalWinnings, state);
                if (bonus > 0) {
                    postSpinBonuses += bonus;
                    addLog(`${item.name}: +${formatNumberWithComma(bonus)}💲`, 'win');
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
                addLog(`Фруктовый салат: +${applyCoinDoubler(bonus)}💲`, 'win');
                animateInventoryItem('fruit_salad');
            }
        }
        if (hasItem('sweet_spin')) {
            let bonus = applySweetSpinBonus(grid);
            if (bonus > 0) {
                totalWinnings += applyCoinDoubler(bonus);
                addLog(`Сладкий прокрут: +${applyCoinDoubler(bonus)}💲`, 'win');
                animateInventoryItem('sweet_spin');
            }
        }
        if (hasItem('clover_field')) {
            let bonus = applyCloverFieldBonus(grid);
            if (bonus > 0) {
                totalWinnings += applyCoinDoubler(bonus);
                addLog(`Клеверное поле: +${applyCoinDoubler(bonus)}💲`, 'win');
                animateInventoryItem('clover_field');
            }
        }
        if (hasItem('bookends')) {
            let bonus = applyBookendsBonus(grid);
            if (bonus > 0) {
                totalWinnings += applyCoinDoubler(bonus);
                addLog(`Книжные подпорки: +${applyCoinDoubler(bonus)}💲`, 'win');
                animateInventoryItem('bookends');
            }
        }
        if (hasItem('minimalist') && totalWinnings > 0) {
            let bonus = getEmptySlotBonus();
             if (bonus > 0) {
                totalWinnings += applyCoinDoubler(bonus);
                addLog(`Минималист: +${applyCoinDoubler(bonus)}💲 за пустые слоты.`, 'win');
                animateInventoryItem('minimalist');
            }
        }
        
        // --- Общие множители выигрыша ---
        // [NEW] Логика 'oddly_lucky'
        if (hasItem('oddly_lucky') && state.turn % 2 !== 0 && totalWinnings > 0) {
             const multiplier = ALL_ITEMS.find(i => i.id === 'oddly_lucky').effect.odd_round_multiplier;
             const bonus = Math.floor(totalWinnings * (multiplier - 1));
             totalWinnings += bonus;
             addLog(`Странная удача: +${Math.round((multiplier - 1) * 100)}% бонус! (+${formatNumberWithComma(bonus)}💲)`, 'win');
             animateInventoryItem('oddly_lucky');
        }

        // [NEW] Логика временного множителя выигрыша от luck_chance предметов
        if (state.tempWinMultiplier && state.tempWinMultiplier > 1 && totalWinnings > 0) {
            const bonus = Math.floor(totalWinnings * (state.tempWinMultiplier - 1));
            totalWinnings += bonus;
            addLog(`Временный множитель x${state.tempWinMultiplier}: +${formatNumberWithComma(bonus)}💲`, 'win');
            state.tempWinMultiplier = 1; // Сбрасываем после использования
        }

        const finalMultiplierItem = state.inventory.find(item => item.effect?.winMultiplier);
        if (finalMultiplierItem && totalWinnings > 0) {
            const finalMultiplier = finalMultiplierItem.effect.winMultiplier;
            const bonus = Math.floor(totalWinnings * (finalMultiplier - 1));
            totalWinnings += bonus;
            if(finalMultiplierItem.id === 'demon_contract') {
                addLog(`${finalMultiplierItem.name}: +${formatNumberWithComma(bonus)}💲`, 'win');
                animateInventoryItem(finalMultiplierItem.id);
            }
        }

        // [FIX] Логика 'last_chance'
        if (hasItem('last_chance') && state.spinsLeft === 0) { // Проверяем после декремента
            const lastChanceMultiplier = state.inventory.find(item => item.id === 'last_chance')?.effect?.on_last_spin_bonus?.multiplier || 3;
            if (totalWinnings > 0) {
                const bonus = totalWinnings * (lastChanceMultiplier - 1);
                totalWinnings += bonus;
                addLog(`Последний Шанс: x${lastChanceMultiplier} к выигрышу! (+${formatNumberWithComma(bonus)}💲)`, 'win');
                animateInventoryItem('last_chance');
            }
        }

        // [NEW] Логика 'Эхо-Камень'
        if (hasItem('echo_stone') && state.echoStoneMultiplier > 1 && totalWinnings > 0) {
            const multiplier = state.echoStoneMultiplier;
            const bonus = Math.floor(totalWinnings * (multiplier - 1));
            totalWinnings += bonus;
            addLog(`Эхо-Камень: Множитель x${multiplier}! (+${formatNumberWithComma(bonus)}💲)`, 'win');
            animateInventoryItem('echo_stone');
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

        // --- ШТРАФ ОТ МОДИФИКАТОРА "НЕ ЗАНИМАЕТ МЕСТО" ---
        const itemsWithWinPenalty = state.inventory.filter(item => 
            item.effect?.win_penalty || item.modifier?.effect?.win_penalty
        );
        if (itemsWithWinPenalty.length > 0 && totalWinnings > 0) {
            const totalPenalty = itemsWithWinPenalty.reduce((sum, item) => {
                return sum + (item.effect?.win_penalty || item.modifier?.effect?.win_penalty || 0);
            }, 0);
            if (totalPenalty > 0) {
                const penaltyAmount = Math.floor(totalWinnings * totalPenalty);
                totalWinnings -= penaltyAmount;
                addLog(`Штраф "Не занимает место": -${penaltyAmount}💲 (${(totalPenalty * 100).toFixed(0)}%)`, 'loss');
            }
        }

        totalWinnings = Math.floor(totalWinnings);
        
        // --- ЭФФЕКТ: Дар Мидаса (luck_to_double_win) ---
        const midasItem = state.inventory.find(item => item.modifier && item.modifier.effect?.luck_to_double_win);
        if (midasItem && totalWinnings > 0) {
            // Удача — целое число
            let luck = getItemEffectValue('luck', 0, 'sum');
            // Шанс: min(luck * 2.5, 100)%
            let chance = Math.min(luck * 2.5, 100);
            if (Math.random() * 100 < chance) {
                totalWinnings *= 2;
                addLog(`✨ Дар Мидаса! Удача: ${luck}, шанс: ${chance}%. Выигрыш удвоен!`, 'win');
                animateInventoryItem(midasItem.id);
            }
        }

        // --- Анимация выигрыша ---
        if (winningLinesInfo.length > 0) {
            const jackpotDelay = topCount === 15 ? 5500 : 0;
            
            if (winningLinesInfo.length > 1) {
                // Используем новую последовательную анимацию для множественных линий
                setTimeout(() => {
                    animateWinningLinesSequentially(winningLinesInfo, () => {
                        // Показываем финальный попап только после завершения всех анимаций
                        showTotalWinPopup(totalWinnings);
                    });
                }, jackpotDelay);
            } else {
                // Для одной линии используем старую анимацию
                setTimeout(() => {
                    highlightWinningCells(Array.from(allWinningPositions), totalWinnings, false, winningLinesInfo);
                    if (totalWinnings >= 50) {
                        setTimeout(() => showTotalWinPopup(totalWinnings), 2000);
                    }
                }, jackpotDelay);
            }
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
                addLog(`На волне успеха (x${state.winStreak}): +${finalBonus}💲`, 'win');
                animateInventoryItem('hot_streak');
            }
            

            // === GLASS CANNON ===
            const glassCannonIdx = state.inventory.findIndex(item => item.id === 'glass_cannon');
            if (glassCannonIdx !== -1) {
                const item = state.inventory[glassCannonIdx];
                if (Math.random() < 0.10) {
                    addLog('Стеклянная пушка треснула и рассыпалась! 💥', 'loss');
                    animateInventoryItem('glass_cannon');
                    state.inventory.splice(glassCannonIdx, 1);
                }
            }
        } else { 
            addLog('Ничего не выпало.');
            if (hasItem('scrap_metal')) {
                const lossBonus = getItemEffectValue('on_loss_bonus', 0);
                state.piggyBank += lossBonus * state.turn;
                addLog(`Копилка впитала: +${lossBonus}💲. Всего: ${state.piggyBank}💲`);
            }
            state.winStreak = 0; // [NEW] Сброс серии побед
            // --- ПАССИВКА: Обучение на ошибках ---
            if (hasPassive('learning_from_mistakes')) {
                state.flags.consecutiveLosses++;
                if (state.flags.consecutiveLosses >= 4) {
                    state.permanentLuckBonus += 2;
                    addLog(`Обучение на ошибках: +2 к перманентной удаче!`, 'win');
                    state.flags.consecutiveLosses = 0;
                }
            }
            // === DEMON CONTRACT ===
            const demonItem = state.inventory.find(item => item.id === 'demon_contract');
            if (demonItem && state.bankBalance > 0) {
                const penalty = Math.floor(state.bankBalance * 0.05);
                if (penalty > 0) {
                    state.bankBalance -= penalty;
                    addLog('😈 Контракт с Демоном: -5% от баланса в банке!', 'loss');
                    // Анимация проигрыша для демона
                    const el = document.querySelector(`#inventory-items [data-item-id='demon_contract'], #planning-inventory-items [data-item-id='demon_contract']`);
                    if (el) {
                        el.classList.remove('item-activated');
                        void el.offsetWidth;
                        el.classList.add('item-activated-loss');
                        setTimeout(() => {
                            el.classList.remove('item-activated-loss');
                        }, 800);
                    }
                }
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
                addLog(`Батарея удачи: заряд x${multiplier}! (+${formatNumberWithComma(bonus)}💲)`, 'win');
                animateInventoryItem('luck_battery');
                state.luckBatteryCharge = 0;
            }
        }

        // --- Для Камня-резонатора: запоминаем символ первого выигрышного ряда ---
        if (winningLinesInfo.length > 0) {
            state.lastWinningSymbol = winningLinesInfo[0].symbol;
        } else {
            state.lastWinningSymbol = undefined;
        }

        // --- Бонусы on_win_bonus (например, Камень-резонатор) ---
        state.inventory.forEach(item => {
          if (typeof item.on_win_bonus === 'function') {
            const bonus = item.on_win_bonus(state.grid, totalWinnings, state, winningLinesInfo);
            if (bonus > 0) {
              totalWinnings += bonus;
              addLog(`${item.name}: +${bonus}💲`, 'win');
              animateInventoryItem(item.id);
            }
          }
        });

        // --- ЛОГИКА: Симбиотический Паразит ---
        const symbioticParasite = state.inventory.find(item => item.effect?.symbiotic_luck);
        if (symbioticParasite) {
            // Инициализируем состояние паразита, если его нет
            if (state.symbioticParasiteLuck === undefined) {
                state.symbioticParasiteLuck = 0;
            }
            
            if (totalWinnings > 0) {
                // Выигрыш: +1 к удаче
                state.symbioticParasiteLuck++;
                state.luck++;
                addLog(`🦠 Симбиотический Паразит: +1 к удаче за выигрыш (накоплено: +${state.symbioticParasiteLuck})`, 'win');
                animateInventoryItem(symbioticParasite.id);
            } else {
                // Проигрыш: -1 к удаче
                state.symbioticParasiteLuck--;
                state.luck--;
                addLog(`🦠 Симбиотический Паразит: -1 к удаче за проигрыш (накоплено: +${state.symbioticParasiteLuck})`, 'loss');
                animateInventoryItem(symbioticParasite.id);
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
        
        // Проверяем, есть ли зеркальные отражения
        const hasMirrorDimension = hasItem('mirror_dimension');
        const mirrorPositions = [];
        if (hasMirrorDimension) {
            // Находим зеркальные пары в позициях
            for (let i = 0; i < positions.length; i++) {
                const pos = positions[i];
                let mirrorPos;
                if (pos < 5) {
                    mirrorPos = 10 + (pos % 5);
                } else if (pos < 10) {
                    mirrorPos = 5 + (4 - (pos % 5));
                } else {
                    mirrorPos = pos % 5;
                }
                if (positions.includes(mirrorPos) && mirrorPos !== pos) {
                    mirrorPositions.push(pos, mirrorPos);
                }
            }
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
                        
                        // Добавляем специальную подсветку для зеркальных отражений
                        if (mirrorPositions.includes(pos)) {
                            cell.classList.add('mirror-highlight');
                        }
                        
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
                                    coin.textContent = '💲';
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
                    cell.classList.remove('sequential-highlight', 'mirror-highlight');
                    const symbol = cell.querySelector('.symbol');
                    if (symbol) {
                        symbol.classList.remove('winning');
                    }
                });
                ui.slotMachine.classList.remove('combo-active');
            }, sequenceTime + holdTime);

        } else {
            positions.forEach(pos => {
                const cell = cells[pos];
                if (cell) {
                    cell.classList.add(highlightClass);
                    // Добавляем специальную подсветку для зеркальных отражений
                    if (mirrorPositions.includes(pos)) {
                        cell.classList.add('mirror-highlight');
                    }
                }
            });
            
            setTimeout(() => {
                cells.forEach(cell => {
                    cell.classList.remove('highlight', 'highlight-big', 'highlight-huge', 'mirror-highlight');
                });
            }, 2000);
        }
    }

    function animateWinningLinesSequentially(winningLinesInfo, onComplete = null) {
        if (!winningLinesInfo || winningLinesInfo.length === 0) {
            if (onComplete) onComplete();
            return;
        }
        
        const cells = ui.slotMachine.querySelectorAll('.slot-cell');
        let currentLineIndex = 0;
        
        // Рассчитываем скорость анимации в зависимости от количества линий
        const baseDelay = 100; // базовая задержка между ячейками
        const baseLineDelay = 950; // базовая задержка между линиями
        
        // Функция для расчета скорости текущей линии
        function getSpeedForLine(lineIndex) {
            // Чем дальше линия, тем быстрее анимация
            const speedMultiplier = Math.max(0.3, 1 - lineIndex * 0.12);
            return {
                cellDelay: Math.floor(baseDelay * speedMultiplier),
                lineDelay: Math.floor(baseLineDelay * speedMultiplier)
            };
        }
        
        function animateNextLine() {
            if (currentLineIndex >= winningLinesInfo.length) {
                // Все линии анимированы, теперь подсвечиваем все выигрышные слоты одновременно
                const allWinningPositions = new Set();
                winningLinesInfo.forEach(line => {
                    line.positions.forEach(pos => allWinningPositions.add(pos));
                });
                
                // Подсвечиваем все выигрышные слоты одновременно
                allWinningPositions.forEach(pos => {
                    const cell = cells[pos];
                    if (cell) {
                        cell.classList.add('line-highlight');
                        const symbol = cell.querySelector('.symbol');
                        if (symbol) {
                            symbol.classList.add('line-winning');
                        }
                    }
                });
                
                // Очищаем подсветку через некоторое время и вызываем callback
                setTimeout(() => {
                    cells.forEach(cell => {
                        cell.classList.remove('line-highlight', 'line-highlight-sequential');
                        const symbol = cell.querySelector('.symbol');
                        if (symbol) {
                            symbol.classList.remove('line-winning');
                        }
                    });
                    
                    // Вызываем callback для показа финального попапа
                    if (onComplete) {
                        setTimeout(onComplete, 500); // Небольшая задержка перед финальным попапом
                    }
                }, 2000);
                return;
            }
            
            const lineInfo = winningLinesInfo[currentLineIndex];
            const positions = lineInfo.positions;
            
            // Получаем скорость для текущей линии
            const { cellDelay, lineDelay } = getSpeedForLine(currentLineIndex);
            
            // Очищаем предыдущую подсветку
            cells.forEach(cell => {
                cell.classList.remove('line-highlight', 'line-highlight-sequential');
                const symbol = cell.querySelector('.symbol');
                if (symbol) {
                    symbol.classList.remove('line-winning');
                }
            });
            
            // Анимируем текущую линию
            positions.forEach((pos, index) => {
                setTimeout(() => {
                    const cell = cells[pos];
                    if (cell) {
                        cell.classList.add('line-highlight-sequential');
                        const symbol = cell.querySelector('.symbol');
                        if (symbol) {
                            symbol.classList.add('line-winning');
                        }
                        
                        // Добавляем эффект тряски для ячейки
                        cell.style.animation = 'lineSequentialShake 0.3s ease-out';
                        setTimeout(() => {
                            cell.style.animation = '';
                        }, 300);
                        
                        // Добавляем частицы для эффекта с случайным направлением
                        for (let i = 0; i < 3; i++) {
                            const particle = document.createElement('div');
                            particle.className = 'line-particle';
                            
                            // Случайное направление для частицы
                            const angle = Math.random() * 360;
                            const distance = 15 + Math.random() * 10;
                            const x = Math.cos(angle * Math.PI / 180) * distance;
                            const y = Math.sin(angle * Math.PI / 180) * distance;
                            
                            particle.style.setProperty('--x', x / 20);
                            particle.style.setProperty('--y', y / 20);
                            
                            cell.appendChild(particle);
                            setTimeout(() => particle.remove(), 400);
                        }
                        
                        // Добавляем эффект покачивания для символа
                        if (symbol) {
                            symbol.style.animation = 'lineSymbolWobble 0.4s ease-out';
                            setTimeout(() => {
                                symbol.style.animation = '';
                            }, 400);
                        }
                    }
                }, index * cellDelay);
            });
            
            // Показываем информацию о линии
            setTimeout(() => {
                const linePopup = document.createElement('div');
                linePopup.className = 'line-popup';
                linePopup.innerHTML = `
                    <div class="line-popup-content">
                        <div class="line-name">${lineInfo.name}</div>
                        <div class="line-win">+${formatNumberWithComma(lineInfo.win)}💲</div>
                    </div>
                `;
                // Вставляем поп-ап внутрь слот-машины
                ui.slotMachine.appendChild(linePopup);

                // Центрируем поп-ап по центру слот-машины
                linePopup.style.position = 'absolute';
                linePopup.style.left = '50%';
                linePopup.style.top = '50%';
                linePopup.style.transform = 'translate(-50%, -50%)'; // строго по центру
                linePopup.style.zIndex = 30;
                
                setTimeout(() => linePopup.classList.add('show'), 50);
                
                // Добавляем эффект тряски для попапа
                setTimeout(() => {
                    linePopup.style.animation = 'linePopupShake 0.3s ease-out';
                    setTimeout(() => {
                        linePopup.style.animation = '';
                    }, 300);
                }, 200);
                
                setTimeout(() => {
                    linePopup.classList.remove('show');
                    linePopup.classList.add('fade-out');
                    setTimeout(() => linePopup.remove(), 300);
                }, 1500);
            }, positions.length * cellDelay + 200);
            
            // Переходим к следующей линии
            setTimeout(() => {
                currentLineIndex++;
                animateNextLine();
            }, positions.length * cellDelay + lineDelay);
        }
        
        // Начинаем анимацию
        animateNextLine();
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
            popup.innerHTML = `
                <div class="curse-title">ПРОКЛЯТЬЕ!</div>
                <div class="curse-hint">Три пиратских флага! Вы потеряли ${formatNumberWithComma(lostAmount)} монет.</div>
                <div class="curse-flags">🏴‍☠️🏴‍☠️🏴‍☠️</div>
            `;
            document.body.appendChild(popup);
            setTimeout(() => {
                popup.classList.add('show');
                setTimeout(() => {
                    popup.classList.remove('show');
                    popup.classList.add('fade-out');
                    setTimeout(() => popup.remove(), 1000);
                }, 2500);
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

        if (hasItem('cherry_value_engine') && Math.random() < 0.35) {
            const alreadyInShop = state.shop.some(item => item.id === 'cherry_value_boost_token');
            if (!alreadyInShop) {
                state.shop.push(window.ALL_ITEMS.find(item => item.id === 'cherry_value_boost_token'));
            }
        }

        // --- Гарантированный редкий амулет в первом магазине 3-го цикла ---
        if (state.run === 3 && state.turn === 1 && rares.length > 0) {
            const randomIndex = Math.floor(Math.random() * rares.length);
            const rareItem = { ...rares[randomIndex] };
            rareItem.cost = Math.max(1, Math.floor(rareItem.cost / 2));
            // Сброс uses для breakable предметов
            if (rareItem.effect && rareItem.effect.luck_chance && rareItem.effect.luck_chance.breakable) {
                rareItem.uses = (rareItem.effect.luck_chance.max_uses || 1) + getBreakableUsesBoost();
            }
            if (rareItem.effect && rareItem.effect.breakable && !rareItem.effect.luck_chance) {
                rareItem.uses = (rareItem.effect.max_uses || 10) + getBreakableUsesBoost();
            }
            // [NEW] Сброс uses для wild_clover_next_spin.breakable
            if (rareItem.effect && rareItem.effect.wild_clover_next_spin && rareItem.effect.wild_clover_next_spin.breakable) {
                rareItem.uses = (rareItem.effect.wild_clover_next_spin.max_uses || 1) + getBreakableUsesBoost();
            }
            // Применяем случайный модификатор
            const modifiedRareItem = addRandomModifier(rareItem);
            if (modifiedRareItem.modifier) {
                addLog(`✨ Редкий предмет с модификатором: ${modifiedRareItem.name}`, 'win');
            }
            state.shop.push(modifiedRareItem);
            const idx = availableItems.findIndex(x => x.id === rareItem.id);
            if (idx !== -1) availableItems.splice(idx, 1);
            rares.splice(randomIndex, 1);
        }

        // --- Гарантированный легендарный амулет в первом магазине 4-го цикла (если 20+ талонов) ---
        if (state.run === 4 && state.turn === 1 && state.tickets >= 20 && legendaries.length > 0) {
            const randomIndex = Math.floor(Math.random() * legendaries.length);
            const legendaryItem = { ...legendaries[randomIndex] };
            // Сброс uses для breakable предметов
            if (legendaryItem.effect && legendaryItem.effect.luck_chance && legendaryItem.effect.luck_chance.breakable) {
                legendaryItem.uses = (legendaryItem.effect.luck_chance.max_uses || 1) + getBreakableUsesBoost();
            }
            if (legendaryItem.effect && legendaryItem.effect.breakable && !legendaryItem.effect.luck_chance) {
                legendaryItem.uses = (legendaryItem.effect.max_uses || 10) + getBreakableUsesBoost();
            }
            // [NEW] Сброс uses для wild_clover_next_spin.breakable
            if (legendaryItem.effect && legendaryItem.effect.wild_clover_next_spin && legendaryItem.effect.wild_clover_next_spin.breakable) {
                legendaryItem.uses = (legendaryItem.effect.wild_clover_next_spin.max_uses || 1) + getBreakableUsesBoost();
            }
            // Применяем случайный модификатор
            const modifiedLegendaryItem = addRandomModifier(legendaryItem);
            if (modifiedLegendaryItem.modifier) {
                addLog(`✨ Легендарный предмет с модификатором: ${modifiedLegendaryItem.name}`, 'win');
            }
            state.shop.push(modifiedLegendaryItem);
            addLog(`🏆 Легендарная удача! В магазине появился ${modifiedLegendaryItem.name} (у вас ${state.tickets}🎟️)!`, 'win');
            const idx = availableItems.findIndex(x => x.id === legendaryItem.id);
            if (idx !== -1) availableItems.splice(idx, 1);
            legendaries.splice(randomIndex, 1);
        }

        for (let i = state.shop.length; i < 5; i++) {
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
                    item.uses = (item.effect.luck_chance.max_uses || 1) + getBreakableUsesBoost();
                }
                if (item.effect && item.effect.breakable && !item.effect.luck_chance) {
                    item.uses = (item.effect.max_uses || 10) + getBreakableUsesBoost();
                }
                // [NEW] Сброс uses для wild_clover_next_spin.breakable
                if (item.effect && item.effect.wild_clover_next_spin && item.effect.wild_clover_next_spin.breakable) {
                    item.uses = (item.effect.wild_clover_next_spin.max_uses || 1) + getBreakableUsesBoost();
                }
                // Применяем случайный модификатор
                const modifiedItem = addRandomModifier(item);
                if (modifiedItem.modifier) {
                    addLog(`✨ В магазине появился модифицированный предмет: ${modifiedItem.name}`, 'win');
                }
                state.shop.push(modifiedItem);
                const idx = availableItems.findIndex(x => x.id === item.id);
                if (idx !== -1) availableItems.splice(idx, 1);
                if (pool === commons) commons.splice(commons.indexOf(item), 1);
                if (pool === rares) rares.splice(rares.indexOf(item), 1);
                if (pool === legendaries) legendaries.splice(legendaries.indexOf(item), 1);
            }
        }
        
        // --- ПРИМЕНЕНИЕ ПАССИВКИ "МАСТЕР МОДИФИКАЦИЙ" К НОВЫМ ПРЕДМЕТАМ ---
        if (hasPassive('modification_master')) {
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
                addLog(`⚡ Мастер модификаций: ${updatedCount} новых модифицированных предметов без штрафа стоимости!`, 'win');
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
            
            // Создаем основной контейнер поп-апа
            const popup = document.createElement('div');
            popup.className = 'luck-chance-popup';
            
            // Создаем содержимое поп-апа
            popup.innerHTML = `
                <div class="luck-chance-content">
                    <div class="luck-chance-icon">
                        <svg viewBox="0 0 100 100" width="80" height="80" class="luck-chance-svg">
                            <rect x="10" y="10" width="80" height="80" fill="#1a1a1a" stroke="#fffbe6" stroke-width="3"/>
                            <text x="50" y="55" text-anchor="middle" font-size="20" fill="white" font-weight="bold">${item.thumbnail}</text>
                        </svg>
                    </div>
                    <div class="luck-chance-info">
                        <div class="luck-chance-name">${item.name}</div>
                        <div class="luck-chance-effect">Активирован!</div>
                    </div>
                    <div class="luck-chance-particles"></div>
                </div>
            `;
            
            // Позиционируем поп-ап в центре экрана
            popup.style.position = 'fixed';
            popup.style.top = '50%';
            popup.style.left = '50%';
            popup.style.transform = 'translate(-50%, -50%) scale(0)';
            popup.style.zIndex = '3000';
            
            document.body.appendChild(popup);
            
            // Анимация появления
            setTimeout(() => {
                popup.style.transform = 'translate(-50%, -50%) scale(1)';
                popup.classList.add('show');
                
                // Создаем частицы
                createLuckParticles(popup.querySelector('.luck-chance-particles'));
                
                // Анимация исчезновения
                setTimeout(() => {
                    popup.classList.add('fade-out');
                    setTimeout(() => {
                        popup.remove();
                        idx++;
                        if (idx < triggeredItems.length) {
                            setTimeout(showNext, 200); // Небольшая пауза между поп-апами
                        }
                    }, 600);
                }, 2500);
            }, 100);
        }
        
        function createLuckParticles(container) {
            for (let i = 0; i < 12; i++) {
                const particle = document.createElement('div');
                particle.className = 'luck-particle';
                particle.style.setProperty('--angle', `${(i * 30)}deg`);
                particle.style.setProperty('--delay', `${i * 0.1}s`);
                container.appendChild(particle);
            }
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
                        const bonus = applyCoinDoubler(eff.coins);
                        state.coins += bonus;
                        addLog(`${item.name}: +${bonus}💲 (шанс ${(eff.chance*100).toFixed(1)}% x${chanceMultiplier.toFixed(1)} = ${(chance*100).toFixed(1)}%)!`, 'win');
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
                        if (item.uses === undefined) item.uses = (eff.max_uses || 1) + getBreakableUsesBoost();
                        item.uses--;
                        if (item.uses <= 0) {
                            addLog(`${item.name} сломался!`, 'loss');
                            // --- [NEW] Пассивка Феникс ---
                            if (hasPassive('phoenix_passive')) {
                                state.luck += 5;
                                const bonus = 10 * (state.run || 1);
                                state.coins += bonus;
                                addLog('🔥 Феникс: +5 к удаче и +' + bonus + '💲 за поломку предмета!', 'win');
                            }
                            itemsToRemove.push(idx);
                        }
                    } else {
                        // --- ПАССИВКА: Предвкушение ---
                        if (hasPassive('anticipation')) {
                            state.coins += 1;
                            addLog(`Предвкушение: +1💲 за несработавший шанс "${item.name}".`, 'win');
                        }
                    }
                }
            }
        });
        for (let i = itemsToRemove.length - 1; i >= 0; i--) {
            const removed = state.inventory[itemsToRemove[i]];
            if (removed && removed.modifier && removed.modifier.divine && typeof window.releaseDivineModifier === 'function') {
                window.releaseDivineModifier(removed.modifier.id);
            }
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

        // --- СБОЙ РЕАЛЬНОСТИ ---
        const glitchItem = state.inventory.find(item => item.effect?.reality_glitch);
        let glitchTriggered = false;
        if (glitchItem) {
            const chance = glitchItem.effect.reality_glitch.chance;
            if (Math.random() < chance) {
                glitchTriggered = true;
            }
        }

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

        // --- СБОЙ РЕАЛЬНОСТИ: сначала проигрыш, потом джекпот ---
        if (glitchTriggered) {
            // 1. Сгенерировать максимально проигрышную сетку (разные символы, нет линий)
            const allSymbols = SYMBOLS;
            let badGrid = [];
            for (let i = 0; i < CONFIG.ROWS * CONFIG.COLS; i++) {
                badGrid.push(allSymbols[i % allSymbols.length]);
            }
            state.grid = badGrid;
            await runSpinAnimation();
            calculateWinnings();
            addLog('Сбой реальности: глич... что-то не так...', 'loss');
            // 2. Через 1 секунду резко заменить на джекпот без анимации
            setTimeout(() => {
                // Выбираем случайный символ для джекпота
                const randomSymbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
                let jackpotGrid = Array(CONFIG.ROWS * CONFIG.COLS).fill(randomSymbol);
                state.grid = jackpotGrid;
                // Обновляем отображение без анимации
                updateReels();
                calculateWinnings();
                addLog(`Сбой реальности: ВСЁ ОДИНАКОВО! ДЖЕКПОТ ${randomSymbol.graphic}!!!`, 'win');
                animateInventoryItem(glitchItem.id);
                
                // Сбрасываем состояние спина и обновляем UI
                setTimeout(() => {
                    state.tempLuck = 0;
                    state.isSpinning = false;
                    ui.lever.classList.remove('pulled');
                    
                    // [NEW] Логика для breakable предметов без luck_chance
                    let itemsToRemove = [];
                    state.inventory.forEach((item, idx) => {
                        if (item.effect?.breakable && !item.effect?.luck_chance) {
                            if (item.uses === undefined) item.uses = (item.effect.max_uses || 10) + getBreakableUsesBoost();
                            item.uses--;
                            if (item.uses <= 0) {
                                addLog(`${item.name} сломался!`, 'loss');
                                
                                if (hasPassive('phoenix_passive')) {
                                    state.luck += 5;
                                    const bonus = 10 * (state.run || 1);
                                    state.coins += bonus;
                                    addLog('🔥 Феникс: +5 к удаче и +' + bonus + '💲 за поломку предмета!', 'win');
                                }
                                itemsToRemove.push(idx);
                            }
                        }
                    });
                    
                    // Удаляем сломанные предметы
                    for (let i = itemsToRemove.length - 1; i >= 0; i--) {
                        const removed = state.inventory[itemsToRemove[i]];
                        if (removed && removed.modifier && removed.modifier.divine && typeof window.releaseDivineModifier === 'function') {
                            window.releaseDivineModifier(removed.modifier.id);
                        }
                        state.inventory.splice(itemsToRemove[i], 1);
                    }
                    
                    updateUI(); // Полное обновление UI происходит здесь, после завершения анимаций.
                }, 900); // Анимация длится 800ms, берем с запасом.
            }, 1000);
            // После этого return, чтобы не делать обычный спин
            return;
        }
        // --- конец блока сбоя реальности ---

        // --- DEV РЕЖИМ: 100% ПРОИГРЫШНЫЕ ПРОКРУТЫ ---
        if (state.dev100LoseMode) {
            // Функция для проверки выигрышных линий
            function hasWinningLines(grid) {
                let activePaylines = [...PAYLINES];
                // Добавляем дополнительные линии от предметов
                state.inventory.forEach(item => {
                    if (item.effect?.add_payline) { activePaylines.push(item.effect.add_payline); }
                });
                
                // Проверяем каждую линию
                for (const line of activePaylines) {
                    if (!line.scannable) continue;
                    
                    const symbolsOnLine = line.positions.map(pos => grid[pos]);
                    let i = 0;
                    
                    while (i < symbolsOnLine.length) {
                        let currentSymbol = symbolsOnLine[i];
                        let comboLength = 0;
                        
                        for (let j = i; j < symbolsOnLine.length; j++) {
                            if (symbolsOnLine[j].id === currentSymbol.id) {
                                comboLength++;
                            } else {
                                break;
                            }
                        }
                        
                        // Если есть 3 или больше одинаковых символов подряд - это выигрыш
                        if (comboLength >= 3) {
                            return true;
                        }
                        
                        i += comboLength;
                    }
                }
                return false;
            }
            
            // Генерируем проигрышную сетку с проверкой
            let badGrid = [];
            let attempts = 0;
            const maxAttempts = 100;
            
            do {
                badGrid = [];
                const allSymbols = SYMBOLS;
                
                // Создаем массив всех символов и перемешиваем его
                let shuffledSymbols = [...allSymbols];
                for (let i = shuffledSymbols.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [shuffledSymbols[i], shuffledSymbols[j]] = [shuffledSymbols[j], shuffledSymbols[i]];
                }
                
                // Заполняем сетку перемешанными символами
                for (let i = 0; i < CONFIG.ROWS * CONFIG.COLS; i++) {
                    badGrid.push(shuffledSymbols[i % shuffledSymbols.length]);
                }
                
                // Дополнительно перемешиваем несколько позиций для большей случайности
                for (let i = 0; i < 5; i++) {
                    const pos1 = Math.floor(Math.random() * badGrid.length);
                    const pos2 = Math.floor(Math.random() * badGrid.length);
                    [badGrid[pos1], badGrid[pos2]] = [badGrid[pos2], badGrid[pos1]];
                }
                
                attempts++;
            } while (hasWinningLines(badGrid) && attempts < maxAttempts);
            
            // Если не удалось создать проигрышную сетку, используем принудительно проигрышную
            if (attempts >= maxAttempts) {
                badGrid = [];
                const symbols = SYMBOLS;
                // Создаем сетку где каждый символ отличается от соседних
                for (let i = 0; i < CONFIG.ROWS * CONFIG.COLS; i++) {
                    const prevSymbol = i > 0 ? badGrid[i - 1] : null;
                    const aboveSymbol = i >= CONFIG.COLS ? badGrid[i - CONFIG.COLS] : null;
                    
                    let availableSymbols = symbols.filter(s => 
                        (!prevSymbol || s.id !== prevSymbol.id) && 
                        (!aboveSymbol || s.id !== aboveSymbol.id)
                    );
                    
                    if (availableSymbols.length === 0) {
                        availableSymbols = symbols;
                    }
                    
                    badGrid.push(availableSymbols[Math.floor(Math.random() * availableSymbols.length)]);
                }
            }
            
            state.grid = badGrid;
            await runSpinAnimation();
            calculateWinnings();
            addLog('Dev: 100% проигрышный прокрут', 'loss');
            
            setTimeout(() => {
                state.tempLuck = 0;
                state.isSpinning = false;
                ui.lever.classList.remove('pulled');
                
                // [NEW] Логика для breakable предметов без luck_chance
                let itemsToRemove = [];
                state.inventory.forEach((item, idx) => {
                    if (item.effect?.breakable && !item.effect?.luck_chance) {
                        if (item.uses === undefined) item.uses = (item.effect.max_uses || 10) + getBreakableUsesBoost();
                        item.uses--;
                        if (item.uses <= 0) {
                            addLog(`${item.name} сломался!`, 'loss');
                            // --- [NEW] Пассивка Феникс ---
                            if (hasPassive('phoenix_passive')) {
                                state.luck += 5;
                                const bonus = 10 * (state.run || 1);
                                state.coins += bonus;
                                addLog('🔥 Феникс: +5 к удаче и +' + bonus + '💲 за поломку предмета!', 'win');
                            }
                            itemsToRemove.push(idx);
                        }
                    }
                });
                
                // Удаляем сломанные предметы
                for (let i = itemsToRemove.length - 1; i >= 0; i--) {
                    const removed = state.inventory[itemsToRemove[i]];
                    if (removed && removed.modifier && removed.modifier.divine && typeof window.releaseDivineModifier === 'function') {
                        window.releaseDivineModifier(removed.modifier.id);
                    }
                    state.inventory.splice(itemsToRemove[i], 1);
                }
                
                updateUI();
            }, 900);
            return;
        }
        // --- конец dev режима ---

        state.grid = generateGrid();
        await runSpinAnimation();
        calculateWinnings();

        // === [FIX] Сохраняем результат спина для divine_recalculation ===
        if (!state._roundSpinResults) state._roundSpinResults = [];
        let lastWin = false;
        if (typeof state.lastWinningLines !== 'undefined') {
            lastWin = Array.isArray(state.lastWinningLines) && state.lastWinningLines.length > 0;
        }
        state._roundSpinResults.push(lastWin);

        setTimeout(() => {
            state.tempLuck = 0;
            state.isSpinning = false;
            ui.lever.classList.remove('pulled');
            
            // [NEW] Логика для breakable предметов без luck_chance
            let itemsToRemove = [];
            state.inventory.forEach((item, idx) => {
                if (item.effect?.breakable && !item.effect?.luck_chance) {
                    if (item.uses === undefined) item.uses = (item.effect.max_uses || 10) + getBreakableUsesBoost();
                    item.uses--;
                    if (item.uses <= 0) {
                        addLog(`${item.name} сломался!`, 'loss');
                        // --- [NEW] Пассивка Феникс ---
                        if (hasPassive('phoenix_passive')) {
                            state.luck += 5;
                            const bonus = 10 * (state.run || 1);
                            state.coins += bonus;
                            addLog('🔥 Феникс: +5 к удаче и +' + bonus + '💲 за поломку предмета!', 'win');
                        }
                        itemsToRemove.push(idx);
                    }
                }
            });
            
            // Удаляем сломанные предметы
            for (let i = itemsToRemove.length - 1; i >= 0; i--) {
                const removed = state.inventory[itemsToRemove[i]];
                if (removed && removed.modifier && removed.modifier.divine && typeof window.releaseDivineModifier === 'function') {
                    window.releaseDivineModifier(removed.modifier.id);
                }
                state.inventory.splice(itemsToRemove[i], 1);
            }
            
            updateUI(); // Полное обновление UI происходит здесь, после завершения анимаций.
        }, 900); // Анимация длится 800ms, берем с запасом.
    }

    function updateSpinCosts() {
        const run = state.run;
        const bank = state.bankBalance;
        const debt = state.targetDebt;

        // 1. Щадящий множитель от цикла
        const cycleMultiplier = run === 1 ? 1 : Math.pow(1.4, run - 1);

        // 2. ПРОГРЕССИВНЫЙ "Налог на богатство"
        let wealthTax = 0;
        if (run > 1) {
            if (bank > 100000) {
                wealthTax = Math.floor(bank / 80);
            } else if (bank > 20000) {
                wealthTax = Math.floor(bank / 120);
            } else if (bank > 5000) {
                wealthTax = Math.floor(bank / 180);
            } else if (bank > 1000) {
                wealthTax = Math.floor(bank / 250);
            }
        }
        // Новый налог от долга (щадящий)
        const debtTax = run === 1 ? 0 : Math.floor(debt / 10);

        // --- РАСЧЕТ ИТОГОВОЙ СТОИМОСТИ ---
        // Пакет 1 (7 прокрутов)
        let baseCost1 = Math.floor(CONFIG.SPIN_PACKAGE_1.base_cost * cycleMultiplier);
        let finalCost1 = baseCost1 + wealthTax + debtTax;
        if (hasPassive('bulk_buyer')) {
            baseCost1 = Math.max(1, baseCost1 - 2);
            finalCost1 = baseCost1 + wealthTax + debtTax;
        }
        CONFIG.SPIN_PACKAGE_1.cost = finalCost1;

        // Пакет 2 (3 прокрута)
        let baseCost2 = Math.floor(CONFIG.SPIN_PACKAGE_2.base_cost * cycleMultiplier);
        let finalCost2 = baseCost2 + wealthTax + debtTax;
        if (hasPassive('bulk_buyer')) {
            baseCost2 = Math.max(1, baseCost2 - 2);
            finalCost2 = baseCost2 + wealthTax + debtTax;
        }
        CONFIG.SPIN_PACKAGE_2.cost = finalCost2;

        // Обновляем UI модального окна, если оно открыто
        if (!ui.spinPurchaseModal.classList.contains('hidden')) {
            ui.purchaseModalCoins.textContent = `${formatNumberWithComma(state.coins)}💲`;
            ui.btnBuySpins7.textContent = `7 прокрутов + 1🎟️ (${formatNumberWithComma(CONFIG.SPIN_PACKAGE_1.cost)}💲)`;
            ui.btnBuySpins3.textContent = `3 прокрута + 2🎟️ (${formatNumberWithComma(CONFIG.SPIN_PACKAGE_2.cost)}💲)`;
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
            flags: {
                sawPirateWarning: false,
                consecutiveLosses: 0,
                firstDepositThisRound: true,
                firstPurchaseThisRound: true,
                firstRerollUsed: false,
                isFirstSpinOfRound: true,
            }, 
            pirateCount: 0,
            pirateFlagCooldown: 0,
            consecutiveJackpots: 0,
            pirateFlagSuperChance: false,
            winStreak: 0,
            roundSpinsMade: 0,
            totalSpinsMade: 0,
            activatedItemsThisSpin: new Set(),
            echoStoneMultiplier: 1,
            purchasesThisRound: 0,
            dev100LoseMode: false,
            symbioticParasiteLuck: 0, // [NEW] Состояние симбиотического паразита
        };
        window.state = state;
        lastKnownTickets = state.tickets;
        lastKnownCoins = state.coins;
        
        ui.startScreen.classList.add('hidden');
        ui.gameOverScreen.classList.add('hidden');
        ui.logPanel.innerHTML = '';
        
        addLog(`Начался Цикл Долга #${state.run}. Цель: ${state.targetDebt}💲 за 3 дня.`);
        
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
        
        // [NEW] Настраиваем обработчики событий для dropdown кнопок
        setupDepositDropdownHandlers();
    }

    // Функция для перехода на СЛЕДУЮЩИЙ ЦИКЛ
    function startNewCycle(bonusCoins = 0, bonusTickets = 0, paidToBank = 0) {
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
        else if (state.run === 3) state.targetDebt = 450;
        else if (state.run === 4) state.targetDebt = 1999;
        else if (state.run === 5) state.targetDebt = 3333;
        else if (state.run === 6) state.targetDebt = 8888;
        else state.targetDebt = Math.min(Math.floor(state.targetDebt * 2.5 + 10000), 88888888);

        
        // Устанавливаем банковский счет равным сумме, потраченной на погашение долга
        // (не добавляем к существующему, а заменяем)
        if (paidToBank) {
            state.bankBalance = paidToBank;
            console.log(`[DEBUG][startNewCycle] Устанавливаем bankBalance=${paidToBank} из paidToBank`);
        } else {
            state.bankBalance = 0; // Сбрасываем банковский счет в новом цикле
            console.log(`[DEBUG][startNewCycle] Сбрасываем bankBalance=0 (paidToBank=${paidToBank})`);
        }

        

        state.tickets += (5 + state.run - 1) + bonusTickets;
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
        state.symbioticParasiteLuck = 0; // [NEW] Сброс состояния симбиотического паразита

        updateInterestRate();
        addLog(`Начался Цикл Долга #${state.run}. Цель: ${formatNumberWithComma(state.targetDebt)}💲.`);
        if(bonusCoins > 0 || bonusTickets > 0) addLog(`Бонус за быстроту: +${formatNumberWithComma(bonusCoins)}💲 и +${formatNumberWithComma(bonusTickets)}🎟️`, 'win');
        populateShop();
        
        if (state.run >= 2) {
            showPassiveChoiceModal(lastPassiveIds);
        } else {
            startTurn();
        }
        state.pirateFlagCooldown = 0;
        state.consecutiveJackpots = 0;
        state.pirateFlagSuperChance = false;

        // Показываем предупреждение о пиратском символе в начале 3-го цикла
        if (state.run === 3 && !state.flags.sawPirateWarning) {
            setTimeout(showPirateWarning, 1000);
            state.flags.sawPirateWarning = true;
        }
        console.log(`[DEBUG][startNewCycle] После переноса: bankBalance=${state.bankBalance}, coins=${state.coins}, tickets=${state.tickets}`);
        
        // [NEW] Настраиваем обработчики событий для dropdown кнопок
        setupDepositDropdownHandlers();

        // --- [NEW] Divine Recalculation Effect: начисление бонусных спинов ---
        if (state._pendingBonusSpins && state._pendingBonusSpins > 0) {
            state.spinsLeft += state._pendingBonusSpins;
            addLog(`Перерасчёт: +${state._pendingBonusSpins} бонусных прокрутов за прошлый раунд!`, 'win');
            state._pendingBonusSpins = 0;
        }
    }


    function startTurn() {
        if (typeof console !== 'undefined') {
            console.log('[DEBUG][startTurn] Инвентарь перед начислением бонусов:', state.inventory.map(i=>({id:i.id,name:i.name,effect:i.effect})));
        }
        repairDwarfsWorkshop(); // Мастерская гнома теперь срабатывает в начале раунда
        updateSpinCosts(); // Обновляем стоимость в начале каждого раунда
        state.spinsLeft = 0;
        state.tempLuck = 0;
        state.firstSpinUsed = false;
        state.roundSpinsMade = 0;
        state.purchasesThisRound = 0; // Сброс счетчика покупок в начале раунда
        state.symbioticParasiteLuck = 0; // [NEW] Сброс состояния симбиотического паразита в начале раунда
        
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
        
        // --- МИМИК: смена цели только в начале раунда ---
        if (!state.mimicLastRound || state.mimicLastRound !== state.turn) {
            updateMimicTarget();
            state.mimicLastRound = state.turn;
        }
        
        // --- ПАССИВКА: Ликвидатор талонов ---
        if (hasPassive('ticket_liquidator') && state.tickets > 0) {
            const amountToConvert = parseInt(prompt(`Ликвидатор талонов: сколько талонов (до 5) вы хотите обменять на монеты (1к1)? У вас ${state.tickets}🎟️.`, "0"), 10);
            if (!isNaN(amountToConvert) && amountToConvert > 0) {
                const finalAmount = Math.min(amountToConvert, 5, state.tickets);
                if (finalAmount > 0) {
                    state.tickets -= finalAmount;
                    state.coins += finalAmount;
                    addLog(`Ликвидатор талонов: обменяно ${finalAmount}🎟️ на ${finalAmount}💲.`, 'win');
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
                addLog(`Утренний кофе: +${formatNumberWithComma(bonus)}💲.`, 'win');
                animateInventoryItem('morning_coffee');
            }
        }
        // --- Мешочек монет ---
        if (hasItem('coin_pouch')) {
            const perItemBonus = getItemEffectValue('on_round_start_per_item_coins', 0);
            const itemCount = state.inventory.length;
            const bonus = perItemBonus * itemCount;
            if (bonus > 0) {
                state.coins += bonus;
                addLog(`Мешочек монет: +${formatNumberWithComma(bonus)}💲 (${itemCount} амулетов).`, 'win');
                animateInventoryItem('coin_pouch');
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
            if (typeof console !== 'undefined') {
                console.log('[DEBUG][startTurn] Карманные часы: начисляется', timepieceBonus, 'прокрутов');
            }
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

        // --- ОБРАБОТКА PERMANENT_SPINS ---
        let permanentSpinsBonus = getItemEffectValue('permanent_spins', 0);
        if (typeof console !== 'undefined') {
            console.log('[DEBUG][startTurn] Бесконечные спинны: начисляется', permanentSpinsBonus, 'прокрутов');
        }
        if (permanentSpinsBonus > 0) {
            state.spinsLeft += permanentSpinsBonus;
            addLog(`Бесконечные спинны: +${permanentSpinsBonus} прокрут(ов) в начале раунда.`, 'win');
            // Анимируем все предметы с permanent_spins
            state.inventory.forEach(item => {
                if (item.effect?.permanent_spins) {
                    animateInventoryItem(item.id);
                }
            });
        }

        if (state.turn > 1 || state.run > 1) {
            const interest = Math.floor(state.bankBalance * state.baseInterestRate);
            if (interest > 0) {
                state.coins += interest;
                addLog(`Банковский кэшбек: +${formatNumberWithComma(interest)}💲.`, 'win');
            }
        }
        updateInterestRate();
        
        // Обновляем магазин амулетов в начале каждого раунда
        populateShop();
        
        ui.purchaseModalTitle.textContent = `Раунд ${state.turn}. Время закупаться.`;
        ui.purchaseModalCoins.textContent = `${formatNumberWithComma(state.coins)}💲`;
        if (ui.purchaseModalDebt) ui.purchaseModalDebt.textContent = `${formatNumberWithComma(state.targetDebt)}💲`;

        let package1Cost = CONFIG.SPIN_PACKAGE_1.cost;
        if(hasPassive('bulk_buyer')) {
            package1Cost = Math.max(1, package1Cost - 2);
        }
        ui.btnBuySpins7.textContent = `7 прокрутов + 1🎟️ (${package1Cost}💲)`;
        ui.btnBuySpins3.textContent = `3 прокрута + 2🎟️ (${CONFIG.SPIN_PACKAGE_2.cost}💲)`;
        
        let singleSpinCost = 3;
        if (hasPassive('frugal_spinner')) {
            singleSpinCost = 2;
        }
        ui.btnBuySpin1.textContent = `1 прокрут (${singleSpinCost}💲)`;
        ui.btnBuySpin1.disabled = state.coins < singleSpinCost || state.coins >= CONFIG.SPIN_PACKAGE_2.cost;


        ui.btnBuySpins7.disabled = state.coins < CONFIG.SPIN_PACKAGE_1.cost;
        ui.btnBuySpins3.disabled = state.coins < CONFIG.SPIN_PACKAGE_2.cost;
        
        if (state.coins < CONFIG.SPIN_PACKAGE_2.cost) {
            ui.btnBuySpin1.style.display = '';
        } else {
            ui.btnBuySpin1.style.display = 'none';
        }
        ui.spinPurchaseModal.classList.remove('hidden');
        updateUI();

        updateMimicTarget();
        setupSpinCostTooltip(); // Добавляем настройку тултипов после открытия модального окна
        
        // [NEW] Настраиваем обработчики событий для dropdown кнопок
        setupDepositDropdownHandlers();

        // --- [NEW] Divine Recalculation Effect: начисление бонусных спинов ---
        if (state._pendingBonusSpins && state._pendingBonusSpins > 0) {
            state.spinsLeft += state._pendingBonusSpins;
            addLog(`Перерасчёт: +${state._pendingBonusSpins} бонусных прокрутов за прошлый раунд!`, 'win');
            state._pendingBonusSpins = 0;
        }
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
                state.purchasesThisRound++; // Оставляем, если нужно для других механик
                addLog(`Куплен 1 прокрут за ${cost}💲 (без талонов).`, 'win');
            } else {
                addLog('Недостаточно наличных.', 'loss');
            }
            ui.spinPurchaseModal.classList.add('hidden');
            updateUI();
            return;
        }
        if (pkg) {
            let finalCost = pkg.cost;
            // Стоимость уже считается без инфляции в updateSpinCosts
            if (state.coins >= finalCost) {
                state.coins -= finalCost;
                state.spinsLeft += pkg.spins;
                state.tickets += pkg.tickets;
                state.purchasesThisRound++; // Оставляем, если нужно для других механик
                addLog(`Куплено: ${pkg.spins} прокрутов и ${pkg.tickets} талон(а/ов).`);
                updateSpinCosts();
                ui.btnBuySpins7.textContent = `7 прокрутов + 1🎟️ (${CONFIG.SPIN_PACKAGE_1.cost}💲)`;
                ui.btnBuySpins3.textContent = `3 прокрута + 2🎟️ (${CONFIG.SPIN_PACKAGE_2.cost}💲)`;
                ui.btnBuySpins7.disabled = state.coins < CONFIG.SPIN_PACKAGE_1.cost;
                ui.btnBuySpins3.disabled = state.coins < CONFIG.SPIN_PACKAGE_2.cost;
                setupSpinCostTooltip();
            } else { addLog(`Недостаточно наличных.`, 'loss'); }
        }
        ui.spinPurchaseModal.classList.add('hidden');
        updateUI();
    }

    function endTurn() {
        if (state.isSpinning) return;
        // --- Критично: сначала проверяем флаг подтверждения ---
        if (!endTurn._confirmed && state.spinsLeft > 0) {
            if (document.getElementById('end-turn-confirm-modal')) return;
            const modal = document.createElement('div');
            modal.id = 'end-turn-confirm-modal';
            modal.className = 'modal-overlay';
            modal.style.zIndex = 9999;
            modal.innerHTML = `
                <div class=\"modal-content warning-modal\" style=\"max-width: 400px; text-align: center;\">
                    <h3>Завершить раунд сейчас?</h3>
                    <p>У вас ещё остались <b>${state.spinsLeft}</b> неиспользованных прокрутов.<br>Если вы завершите раунд сейчас, <span style='color:var(--danger-color);font-weight:bold;'>все оставшиеся прокруты сгорят</span> и вы не получите за них бонусы.<br><br>Вы уверены, что хотите завершить раунд?</p>
                    <div style=\"margin-top: 18px; display: flex; gap: 12px; justify-content: center;\">
                        <button id=\"btn-end-turn-confirm\" style=\"background: #ff6b35; color: #fff; border: none; border-radius: 6px; padding: 10px 22px; font-size: 1em; font-weight: bold; cursor: pointer;\">Да, завершить</button>
                        <button id=\"btn-end-turn-cancel\" style=\"background: #444; color: #fff; border: none; border-radius: 6px; padding: 10px 22px; font-size: 1em; font-weight: bold; cursor: pointer;\">Отмена</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            document.getElementById('btn-end-turn-cancel').onclick = () => {
                modal.remove();
            };
            document.getElementById('btn-end-turn-confirm').onclick = () => {
                modal.remove();
                endTurn._confirmed = true;
                endTurn();
            };
            return;
        }
        if (endTurn._confirmed) {
            delete endTurn._confirmed;
        }
        ui.eorTitle.textContent = `Конец Раунда ${state.turn}`;
        ui.eorCoins.textContent = `${formatNumberWithComma(state.coins)}💲`;
        ui.eorBank.textContent = `${formatNumberWithComma(state.bankBalance)}💲`;
        
        // [NEW] Специальный текст для 3-го раунда
        const eorDescription = document.querySelector('#end-of-round-modal p');
        if (state.turn === 3) {
            eorDescription.innerHTML = `
                <span style="color: #ff6666; font-weight: bold;">💀 ПОСЛЕДНИЙ ШАНС 💀</span><br>
                <span style="color: #ff8888;">День подходит к концу, и это ваш последний шанс внести деньги в банк, чтобы не проиграть.</span><br>
                <span style="color: #ffaa88; font-style: italic;">Посмотрим, справитесь ли вы с этой простой задачей! 😈</span>
            `;
        } else {
            eorDescription.textContent = 'День подходит к концу. Внесите сбережения в банк, чтобы получить проценты в следующем раунде.';
        }
        
        ui.endOfRoundModal.classList.remove('hidden');
        
        // [NEW] Настраиваем обработчики событий для dropdown кнопок при открытии модального окна
        setupDepositDropdownHandlers();
    }

    // [NEW] Функция для настройки обработчиков событий dropdown кнопок
    function setupDepositDropdownHandlers() {
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
    }

    function confirmEndTurn() {
        // [NEW] Логика 'frugal_mindset'
        if (hasItem('frugal_mindset') && state.spinsLeft > 0) {
            const bonus = state.spinsLeft * ALL_ITEMS.find(i => i.id === 'frugal_mindset').effect.on_round_end_bonus.per_spin_left;
            const finalBonus = applyCoinDoubler(bonus);
            state.coins += finalBonus;
            addLog(`Экономное мышление: +${finalBonus}💲 за ${state.spinsLeft} оставшихся прокрутов.`, 'win');
            animateInventoryItem('frugal_mindset');
        }

        // --- ПАССИВКА: Просчитанный риск ---
        if (hasPassive('calculated_risk') && state.spinsLeft === 0) {
            const bonus = 5 * (state.cycle || 1);
            state.coins += bonus;
            addLog(`Просчитанный риск: +${bonus}💲 за окончание раунда с 0 прокрутов.`, 'win');
        }
        if (hasItem('scrap_metal') && state.piggyBank > 0) {
            const piggyBankBonus = applyCoinDoubler(state.piggyBank);
            addLog(`💥 Копилка разбита! Вы получили +${formatNumberWithComma(piggyBankBonus)}💲.`, 'win');
            state.coins += piggyBankBonus;
            state.piggyBank = 0;
            animateInventoryItem('scrap_metal');
        }
        if (hasItem('piggy_bank')) {
            const piggyBankItem = ALL_ITEMS.find(i => i.id === 'piggy_bank');
            const effect = piggyBankItem.effect.end_round_savings_bonus;
            const savings = Math.floor(state.coins / effect.per) * effect.coins;
            if (savings > 0) {
                state.coins += savings;
                addLog(`Свинка-копилка: +${savings}💲 за сбережения (${Math.floor(state.coins / effect.per) * effect.per}💲).`, 'win');
                animateInventoryItem('piggy_bank');
            }
        }

        // --- ПАССИВКА: Мастерская гнома ---
        repairDwarfsWorkshop();

        // --- [NEW] Divine Recalculation Effect ---
        // Подсчёт проигрышных и выигрышных прокрутов за раунд
        const recalcItem = state.inventory.find(item => item.effect && item.effect.on_round_end_recalculation);
        if (recalcItem) {
            const spinResults = state._roundSpinResults || [];
            const winCount = spinResults.filter(Boolean).length;
            const lossCount = spinResults.length - winCount;
            const { loss_threshold, spins_bonus } = recalcItem.effect.on_round_end_recalculation;
            console.log('[DivineRecalculation]', {
                spinResults,
                winCount,
                lossCount,
                loss_threshold,
                spins_bonus,
                item: recalcItem
            });
            if (lossCount > winCount) {
                const extraLosses = lossCount - winCount;
                const bonusSpins = Math.floor(extraLosses / loss_threshold) * spins_bonus;
                if (bonusSpins > 0) {
                    state._pendingBonusSpins = (state._pendingBonusSpins || 0) + bonusSpins;
                    addLog(`${recalcItem.name}: +${bonusSpins} прокрут(ов) будут начислены в начале следующего раунда!`, 'win');
                    animateInventoryItem(recalcItem.id);
                }
            }
            state._roundSpinResults = [];
        }

        ui.endOfRoundModal.classList.add('hidden');
        addLog(`--- Раунд ${state.turn} окончен ---`);
        state.turn++;
        
        // [NEW] Проверка денег в конце 3-го раунда
        if (state.turn === 4) { // После завершения 3-го раунда
            checkMoneyForRound3();
            return; // Не продолжаем дальше, пока не проверим деньги
        }
        
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

    // [NEW] Функция проверки денег в конце 3-го раунда
    function checkMoneyForRound3() {
        const totalMoney = state.coins + state.bankBalance;
        const requiredAmount = state.targetDebt;
        
        if (totalMoney < requiredAmount) {
            // Недостаточно денег - показываем трагичный поп-ап
            showInsufficientMoneyPopup(totalMoney, requiredAmount);
        } else {
            // Есть деньги - показываем поп-ап с требованием внести нужную сумму
            showSufficientMoneyPopup(totalMoney, requiredAmount);
        }
    }

    // [NEW] Поп-ап при недостатке денег
    function showInsufficientMoneyPopup(currentMoney, requiredAmount) {
        const popup = document.createElement('div');
        popup.className = 'insufficient-money-popup';
        popup.innerHTML = `
            <div class="insufficient-money-content">
                <h2 style="color: #ff4444; text-align: center; margin-bottom: 20px; font-size: 1.5em;"> НЕДОСТАТОЧНО ДЕНЕГ! 💀</h2>
                <p style="text-align: center; font-size: 1.2em; margin-bottom: 15px; color: #ff6666;">
                    Ха-ха-ха! Посмотрите на этого беднягу! 
                </p>
                <p style="text-align: center; font-size: 1.1em; margin-bottom: 10px;">
                    У вас всего: <span style="color: #ff4444; font-weight: bold;">${formatNumberWithComma(currentMoney)}💲</span>
                </p>
                <p style="text-align: center; font-size: 1.1em; margin-bottom: 20px;">
                    А нужно: <span style="color: #ff4444; font-weight: bold;">${formatNumberWithComma(requiredAmount)}💲</span>
                </p>
                <p style="text-align: center; font-size: 1.1em; color: #ff8888; font-style: italic;">
                    Готовьтесь к смерти, неудачник! 😈
                </p>
            </div>
        `;
        
        document.body.appendChild(popup);
        
        // Показываем поп-ап
        setTimeout(() => popup.classList.add('show'), 100);
        
        // Через 5 секунд показываем убийство
        setTimeout(() => {
            popup.classList.remove('show');
            popup.classList.add('fade-out');
            setTimeout(() => {
                popup.remove();
                gameOver();
            }, 1000);
        }, 5000);
    }

    // [NEW] Поп-ап при достатке денег
    function showSufficientMoneyPopup(currentMoney, requiredAmount) {
        const popup = document.createElement('div');
        popup.className = 'sufficient-money-popup';
        popup.innerHTML = `
            <div class="sufficient-money-content">
                <h2 style="color: #44ff44; text-align: center; margin-bottom: 20px; font-size: 1.5em;"> Я ВИЖУ, ЧТО У ВАС ДОСТАТОЧНО ДЕНЕГ! 💲</h2>
                <p style="text-align: center; font-size: 1.2em; margin-bottom: 15px; color: #44ff44;">
                    Немедленно внесите нужное количество!
                </p>
                <p style="text-align: center; font-size: 1.1em; margin-bottom: 10px;">
                    У вас: <span style="color: #44ff44; font-weight: bold;">${formatNumberWithComma(currentMoney)}💲</span>
                </p>
                <p style="text-align: center; font-size: 1.1em; margin-bottom: 20px;">
                    Нужно внести: <span style="color: #44ff44; font-weight: bold;">${formatNumberWithComma(requiredAmount)}💲</span>
                </p>
                <div style="text-align: center;">
                    <button id="btn-continue-to-judgement" style="background: #44ff44; color: #000; border: none; padding: 10px 20px; border-radius: 5px; font-weight: bold; cursor: pointer; margin: 10px;">
                        Внести и продолжить
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(popup);
        
        // Показываем поп-ап
        setTimeout(() => popup.classList.add('show'), 100);
        
        // Обработчик кнопки
        document.getElementById('btn-continue-to-judgement').onclick = () => {
            popup.classList.remove('show');
            popup.classList.add('fade-out');
            setTimeout(() => {
                popup.remove();
                // Продолжаем к судному дню
                setTimeout(() => {
                    judgementDay();
                }, 900);
            }, 1000);
        };
    }

    function advanceToNextCycle(bonusCoins = 0, bonusTickets = 0, paidToBank = 0) {
        ui.judgementModal.classList.remove('hidden');
        ui.judgementTitle.textContent = "ДОЛГ ВЫПЛАЧЕН";
        ui.judgementTitle.classList.remove('failure');

        const totalMoney = state.coins + state.bankBalance;
        const standardTickets = 5 + state.run;
        let bonusText = '';
        if(bonusCoins > 0 || bonusTickets > 0) {
            bonusText = `Бонус за быстроту: <span style="color:var(--money-color)">+${formatNumberWithComma(bonusCoins)}💲</span> и <span style="color:var(--ticket-color)">+${formatNumberWithComma(bonusTickets)}🎟️</span>.<br>`;
        }
        ui.judgementText.innerHTML = `Вы выжили. Наличные: <span style="color:var(--money-color)">${formatNumberWithComma(totalMoney)}💲</span>.<br>
                                     Стандартная награда: <span style="color:var(--ticket-color)">${formatNumberWithComma(standardTickets)}🎟️</span>.<br>
                                     ${bonusText}`;

        // Обновляем результат в лидерборде при успешном завершении цикла
        if (window.leaderboardsManager) {
            window.leaderboardsManager.onGameOver(state);
        }

        ui.judgementContinue.onclick = () => {
            const now = Date.now();
            const adCooldown = 120000; // 2 минуты
            // Показываем рекламу при переходе на следующий уровень, если не первая сессия и прошло достаточно времени
            if (!firstSession && window.adsManager && window.adsManager.isReady() && (now - lastAdShownTime > adCooldown)) {
                lastAdShownTime = now;
                window.adsManager.showAdOnEvent('level_complete');
            }
            ui.judgementModal.classList.add('hidden');
            startNewCycle(bonusCoins, bonusTickets, paidToBank);
            firstSession = false; // После первого перехода считаем, что сессия не первая
        };
    }

    function judgementDay() {
        const totalMoney = state.coins + state.bankBalance;
        addLog(`СУДНЫЙ ДЕНЬ. Ваша сумма: ${formatNumberWithComma(totalMoney)}💲. Требуется: ${formatNumberWithComma(state.targetDebt)}💲.`);
        
        if (totalMoney >= state.targetDebt) {
            // При обычном переходе сохраняем текущий банковский счет
            advanceToNextCycle(0, 0, state.bankBalance);
        } else {
            gameOver();
        }
    }

    function payDebtEarly() {
        if (state.turn >= 3) return;
        // Проверяем общую сумму (наличные + банк) для досрочного погашения
        const totalMoney = state.coins + state.bankBalance;
        if (totalMoney < state.targetDebt) return;

        // --- Новый код: если остались прокруты, показываем попап с подтверждением ---
        if (state.spinsLeft > 0) {
            // Проверяем, нет ли уже такого попапа
            if (document.getElementById('early-payoff-confirm-modal')) return;
            const modal = document.createElement('div');
            modal.id = 'early-payoff-confirm-modal';
            modal.className = 'modal-overlay';
            modal.style.zIndex = 9999;
            modal.innerHTML = `
                <div class="modal-content warning-modal" style="max-width: 400px; text-align: center;">
                    <h3>Досрочная выплата долга</h3>
                    <p>У вас ещё остались <b>${state.spinsLeft}</b> неиспользованных прокрутов.<br>Если вы выплатите долг сейчас, <span style='color:var(--danger-color);font-weight:bold;'>все оставшиеся прокруты сгорят</span> и раунд завершится досрочно.<br><br>Вы уверены, что хотите продолжить?</p>
                    <div style="margin-top: 18px; display: flex; gap: 12px; justify-content: center;">
                        <button id="btn-early-payoff-confirm" style="background: #ff6b35; color: #fff; border: none; border-radius: 6px; padding: 10px 22px; font-size: 1em; font-weight: bold; cursor: pointer;">Да, выплатить</button>
                        <button id="btn-early-payoff-cancel" style="background: #444; color: #fff; border: none; border-radius: 6px; padding: 10px 22px; font-size: 1em; font-weight: bold; cursor: pointer;">Отмена</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            document.getElementById('btn-early-payoff-cancel').onclick = () => {
                modal.remove();
            };
            document.getElementById('btn-early-payoff-confirm').onclick = () => {
                modal.remove();
                // Продолжаем обычную выплату долга
                payDebtEarly._confirmed = true;
                payDebtEarly();
            };
            return;
        }
        // Если был вызван повторно после подтверждения, сбрасываем флаг
        if (payDebtEarly._confirmed) {
            delete payDebtEarly._confirmed;
        }

        let bonusCoins = 0;
        let bonusTickets = 0;

        // --- Новый скейлинг бонуса ---
        if (state.turn === 1) {
            bonusCoins = Math.floor(state.targetDebt * 0.40);
            bonusTickets = 7 + state.run;
            addLog('Досрочное погашение в 1-й раунд!', 'win');
        } else if (state.turn === 2) {
            bonusCoins = Math.floor(state.targetDebt * 0.20);
            bonusTickets = 4 + state.run;
            addLog('Досрочное погашение во 2-й раунд!', 'win');
        }
        if (hasPassive('early_bird')) {
            const oldCoins = bonusCoins;
            const oldTickets = bonusTickets;
            bonusCoins = Math.floor(bonusCoins * 1.5);
            bonusTickets = Math.floor(bonusTickets * 1.5);
            addLog(`Ранняя пташка: бонусы увеличены! (+${formatNumberWithComma(bonusCoins - oldCoins)}💲, +${formatNumberWithComma(bonusTickets - oldTickets)}🎟️)`, 'win');
        }
        
        // --- Списание долга из наличных, затем из банка при необходимости ---
        let remainingDebt = state.targetDebt;
        let paidFromCoins = 0;
        
        // Сначала списываем из наличных
        if (state.coins > 0) {
            paidFromCoins = Math.min(state.coins, remainingDebt);
            state.coins -= paidFromCoins;
            remainingDebt -= paidFromCoins;
            addLog(`Списано ${formatNumberWithComma(paidFromCoins)}💲 из наличных для погашения долга.`);
        }
        
        // Если долг не погашен, списываем из банка
        if (remainingDebt > 0) {
            state.bankBalance -= remainingDebt;
            addLog(`Списано ${formatNumberWithComma(remainingDebt)}💲 из банка для погашения долга.`);
        }

        // Прибавляем бонусы
        state.coins += bonusCoins;
        state.tickets += bonusTickets;
        addLog(`Получен бонус: +${formatNumberWithComma(bonusCoins)}💲 и +${formatNumberWithComma(bonusTickets)}🎟️!`, 'win');

        // В банк уходит вся сумма долга (из наличных + из банка)
        const totalPaidToBank = paidFromCoins + (remainingDebt > 0 ? remainingDebt : 0);
        console.log(`[DEBUG][payDebtEarly] Передаем в advanceToNextCycle: totalPaidToBank=${totalPaidToBank} (paidFromCoins=${paidFromCoins} + remainingDebt=${remainingDebt})`);
        advanceToNextCycle(bonusCoins, bonusTickets, totalPaidToBank);
    }
    
    function gameOver() {
        state.gameover = true;
        // --- СБРОС ПАССИВОК ---
        state.activePassives = [];
        ui.gameOverScreen.classList.remove('hidden');
        ui.finalRun.textContent = state.run;
        addLog("ИГРА ОКОНЧЕНА.", 'loss');
        
        // Обновляем результат в лидерборде
        if (window.leaderboardsManager) {
            window.leaderboardsManager.onGameOver(state);
        }
        
        // Показываем рекламу при окончании игры, если не первая сессия и прошло достаточно времени
        const now = Date.now();
        const adCooldown = 120000; // 2 минуты
        if (!firstSession && window.adsManager && window.adsManager.isReady() && (now - lastAdShownTime > adCooldown)) {
            setTimeout(() => {
                lastAdShownTime = Date.now();
                window.adsManager.showAdOnEvent('game_over');
            }, 1000); // Небольшая задержка перед показом рекламы
        }
        firstSession = false; // После первого gameOver считаем, что сессия не первая

        // --- АНИМАЦИЯ ПАДЕНИЯ ---
        const modal = ui.gameOverScreen.querySelector('.modal-content');
        if (modal && !modal.querySelector('#fall-anim-circle')) {
            const h2 = modal.querySelector('h2');
            const anim = document.createElement('img');
            anim.src = 'img/anim_circle.gif';
            anim.alt = 'Падение в яму';
            anim.id = 'fall-anim-circle';
            anim.style.cssText = 'display:block;margin:0 auto 18px auto;max-width:180px;width:60vw;animation:popup-in 0.7s cubic-bezier(.5,1.8,.7,1)';
            if (h2 && h2.nextSibling) {
                modal.insertBefore(anim, h2.nextSibling);
            } else {
                modal.insertBefore(anim, modal.firstChild);
            }
        }
        // Удаляем анимацию при рестарте
        ui.btnRestartGame.onclick = function() {
            const anim = ui.gameOverScreen.querySelector('#fall-anim-circle');
            if (anim) anim.remove();
            initGame();
        };
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
            addLog(`Внесено: ${formatNumberWithComma(amount)}💲. Друг Банкира добавил 10%, зачислено: ${formatNumberWithComma(finalAmount)}💲.`, 'win');
        } else {
            addLog(`Внесено в банк: ${formatNumberWithComma(amount)}💲.`);
        }

        if (isFromEOR) {
            ui.eorCoins.textContent = `${formatNumberWithComma(state.coins)}💲`;
            ui.eorBank.textContent = `${formatNumberWithComma(state.bankBalance)}💲`;
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
        // Проверяем эффективное количество использованных слотов с учетом "Иллюзионист слотов"
        const maxSize = getMaxInventorySize();
        const effectiveSlots = getEffectiveEmptySlots();
        const effectiveUsed = maxSize - effectiveSlots;
        const item = state.shop.find(i => i.id === itemId);
        // --- Особая логика для усилителя вишни ---
    if (item && item.id === 'cherry_value_boost_token') {
        let cost = item.cost;
        let bonusApplied = false;
        let discountLog = [];
        if (hasPassive('shopaholic') && state.flags.firstPurchaseThisRound) {
            cost = Math.max(1, item.cost - 2);
            state.flags.firstPurchaseThisRound = false;
            bonusApplied = true;
            discountLog.push('shopaholic -2');
        }
        if (hasPassive('barterer') && item.cost >= 5) {
            cost = Math.max(1, cost - 1);
            bonusApplied = true;
            discountLog.push('barterer -1');
        }
        if (state.tickets < cost) return addLog('Недостаточно талонов.', 'loss');
        state.tickets -= cost;
        // Применяем эффект
        if (!window.state.cherryBaseValue) window.state.cherryBaseValue = 0;
        window.state.cherryBaseValue += 1;
        if (typeof window.addLog === 'function') {
            window.addLog('🍒 Усилитель Вишни: базовая ценность вишни увеличена на 1!', 'win');
        }
        // Удаляем из магазина
        state.shop = state.shop.filter(i => i.id !== itemId);
        updateUI();
        return;
    }
        // --- Блокировка покупки предмета с модификатором Алтаря, если нет других амулетов ---
        if (item && item.modifier && item.modifier.id === 'sacrificial_altar') {
            if (!state.inventory || state.inventory.length === 0) {
                addLog('Для покупки предмета с Алтарём у вас должен быть хотя бы один другой амулет!', 'loss');
                return;
            }
        }
        // --- ИСПРАВЛЕНИЕ: разрешаем покупку "невесомых" амулетов даже при полном инвентаре ---
        if (
            effectiveUsed >= maxSize &&
            !(item && (item.effect?.ignore_slot_for_empty_bonus || item.modifier?.effect?.ignore_slot_for_empty_bonus))
        ) {
            addLog(`В инвентаре максимум ${maxSize} амулетов!`, 'loss');
            return;
        }


        let cost = item.cost;
        let bonusApplied = false;
        let discountLog = [];
        if (hasPassive('shopaholic') && state.flags.firstPurchaseThisRound) {
            cost = Math.max(1, item.cost - 2);
            state.flags.firstPurchaseThisRound = false;
            bonusApplied = true;
            discountLog.push('shopaholic -2');
        }
        // --- ПАССИВКА: Специалист по бартеру ---
        if (hasPassive('barterer') && item.cost >= 5) {
            cost = Math.max(1, cost - 1);
            bonusApplied = true;
            discountLog.push('barterer -1');
        }

        if (!item || state.tickets < cost) return addLog('Недостаточно талонов.', 'loss');
        
        // Сброс uses для breakable предметов при покупке
        if (item.effect && item.effect.luck_chance && item.effect.luck_chance.breakable) {
            item.uses = (item.effect.luck_chance.max_uses || 1) + getBreakableUsesBoost();
        }
        if (item.effect && item.effect.breakable && !item.effect.luck_chance) {
            item.uses = (item.effect.max_uses || 10) + getBreakableUsesBoost();
        }
        // [NEW] Сброс uses для wild_clover_next_spin.breakable при покупке
        if (item.effect && item.effect.wild_clover_next_spin && item.effect.wild_clover_next_spin.breakable) {
            item.uses = (item.effect.wild_clover_next_spin.max_uses || 1) + getBreakableUsesBoost();
        }

        state.tickets -= cost;
        state.inventory.push(item);
        state.shop = state.shop.filter(i => i.id !== itemId);
        
        if (bonusApplied) {
             addLog(`Куплен амулет: ${item.name} со скидкой за ${cost}🎟️!`, 'win');
        } else {
             addLog(`Куплен амулет: ${item.name}`, 'win');
        }
        if (discountLog.length > 0) {
            console.log(`[DEBUG][buyItem] Скидки применены: ${discountLog.join(', ')}. Итоговая цена: ${cost}`);
        }
        console.log(`[DEBUG][buyItem] Куплен ${item.name} за ${cost}🎟️. Осталось tickets: ${state.tickets}`);

        // Исправлено: только если куплен mimic_chest и у него нет цели, выбираем цель
        if (item.id === 'mimic_chest') {
            updateMimicTarget();
        }
        
        // --- [NEW] Специальное сообщение для "Иллюзионист слотов" ---
        if (item.id === 'slot_illusionist') {
            addLog(`🎩 Иллюзионист слотов активирован! Предметы с бонусами за пустые слоты больше не занимают место в инвентаре.`, 'win');
        }
        
        // --- [NEW] Специальное сообщение для модификатора "Не занимает место" ---
        if (item.modifier && item.modifier.id === 'no_slot_usage') {
            addLog(`📦 Модификатор "Не занимает место" активирован! Все выигрыши уменьшены на 10%.`, 'win');
        }
        
        // --- [NEW] Немедленное применение эффектов, которые должны работать сразу ---
        // Бесплатные рероллы
        let newFreeRerolls = getItemEffectValue('free_reroll_per_round', 0);
        if (newFreeRerolls > 0) {
            state.freeRerolls = newFreeRerolls;
            addLog(`Бесплатный реролл магазина теперь доступен в этом раунде!`, 'win');
            animateInventoryItem(item.id);
        }
        // +Спины в раунд (например, часы)
        if (item.effect && item.effect.on_round_start_spins) {
            let newSpins = item.effect.on_round_start_spins;
            state.spinsLeft += newSpins;
            addLog(`+${newSpins} прокрут(ов) сразу после покупки!`, 'win');
            animateInventoryItem(item.id);
        }
        // +Монеты в раунд (например, кофе)
        let newCoins = getItemEffectValue('on_round_start_coins', 0);
        if (newCoins > 0) {
            state.coins += newCoins;
            addLog(`+${newCoins}💲 сразу после покупки!`, 'win');
            animateInventoryItem(item.id);
        }
        // +Постоянные спинны (например, бесконечные спинны)
        if (item && item.effect && item.effect.permanent_spins) {
            state.spinsLeft += item.effect.permanent_spins;
            addLog(`+${item.effect.permanent_spins} прокрут(ов) сразу после покупки!`, 'win');
            animateInventoryItem(item.id);
        }
        // Можно добавить аналогично для других эффектов, если потребуется

        // --- Механика жертвы для модификатора Алтаря ---
        if (item.modifier && item.modifier.id === 'sacrificial_altar') {
            const candidates = state.inventory.filter(i => i !== item);
            if (candidates.length > 0) {
                const idx = Math.floor(Math.random() * candidates.length);
                const victim = candidates[idx];
                removeAmulet(victim.id);
                addLog(`Алтарь: амулет "${victim.name}" был принесён в жертву!`, 'loss');
            }
        }

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
        ui.statDebt.textContent = `${formatNumberWithComma(state.targetDebt)}💲`;
        if (ui.statDebtStart) ui.statDebtStart.textContent = `${formatNumberWithComma(state.targetDebt)}💲`;
        
        // [FIX] Сначала обновляем HTML, чтобы получить правильные координаты для анимации
        ui.statCoins.innerHTML = `<span>${formatNumberWithComma(state.coins)}💲</span>`;
        
        // Анимация монет
        if (ui.statCoins && typeof lastKnownCoins !== 'undefined' && lastKnownCoins !== state.coins) {
            const change = state.coins - lastKnownCoins;
            console.log(`[DEBUG] Анимация монет: ${lastKnownCoins} -> ${state.coins}, изменение: ${change}`);
            showCoinChangePopup(change);
        }
        lastKnownCoins = state.coins;
        
        ui.bankBalance.textContent = `${formatNumberWithComma(state.bankBalance)}💲`;
        
        // [FIX] Сначала обновляем HTML, чтобы получить правильные координаты для анимации
        // ui.statTickets.innerHTML = `<span>${formatNumberWithComma(state.tickets)}🎟️</span>`;
        const shopTickets = document.querySelector('.shop-tickets-info #stat-tickets');
        if (shopTickets) {
            shopTickets.innerHTML = `<span>${formatNumberWithComma(state.tickets)}🎟️</span>`;
        }
        // Анимация талонов (теперь только для магазина)
        if (shopTickets && typeof lastKnownTickets !== 'undefined' && lastKnownTickets !== state.tickets) {
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

        // [FIX] Добавляем расчет бонуса от "Гордость барахольщика"
        let hoarderLuck = getHoarderPrideBonus();

        // --- Универсальный подсчёт временной удачи от всех temporary_luck_on_spin ---
        let tempLuckFromItems = 0;
        let tempLuckDetails = [];
        if (Array.isArray(state.grid)) {
            state.inventory.forEach(item => {
                if (item.effect?.temporary_luck_on_spin) {
                    const symbolId = item.effect.temporary_luck_on_spin;
                    const count = state.grid.filter(s => s && s.id === symbolId).length;
                    if (count > 0) {
                        tempLuckFromItems += count;
                        tempLuckDetails.push({ name: item.name, count });
                    }
                }
                // [NEW] conditional_luck: если на поле есть хотя бы один указанный символ, даём фиксированный бонус
                if (item.effect?.conditional_luck) {
                    const { symbol, bonus } = item.effect.conditional_luck;
                    const found = state.grid.some(s => s && s.id === symbol);
                    if (found) {
                        tempLuckFromItems += bonus;
                        addLog(`${item.name}: +${bonus} к временной удаче (условие выполнено).`, 'win');
                        animateInventoryItem(item.id);
                    }
                }
            });
        }
        // ... существующий код ...
        let luckText = `${baseLuck}`;
        if (debtLuck > 0) luckText += ` (+${formatNumberWithComma(debtLuck)} от долга)`;
        if (ticketLuck > 0) luckText += ` (+${ticketLuck} от талонов)`;
        if (state.tempLuck > 0) luckText += ` (+${formatNumberWithComma(state.tempLuck)})`;
        if (state.cherryLuckBonus > 0) luckText += ` (+${state.cherryLuckBonus} Вишнёвая удача)`;
        if (hoarderLuck > 0) luckText += ` (+${hoarderLuck} за слоты)`;
        if (hasItem('luck_battery')) {
            state.luckBatteryCharge = state.luckBatteryCharge || 0;
            if (state.luckBatteryCharge > 0) {
                luckText += ` (+${state.luckBatteryCharge} батарея удачи)`;
            }
        }
        // --- Универсальная строка для временной удачи от всех temporary_luck_on_spin ---
        if (tempLuckFromItems > 0) {
            luckText += ` (+${tempLuckFromItems} временных бонусов)`;
        }
        // [NEW] Показываем бонус от Шляпы удачи, если он сработал
        if (hasItem('lucky_hat')) {
            const effect = ALL_ITEMS.find(i => i.id === 'lucky_hat').effect.every_n_spin_luck;
            if ((state.roundSpinsMade + 1) % effect.n === 0) {
                luckText += ` (+${effect.luck} Шляпа удачи)`;
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
        let profitText = `<div style='font-size:13px; margin-top:4px;'>След. процент: <b style='color:var(--money-color)'>+${formatNumberWithComma(profit)}💲</b> (${(percent*100).toFixed(0)}%${bonusText})</div>`;
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
                const bCoins = Math.floor(state.targetDebt * 0.40);
                const bTickets = 7 + state.run;
                bonusInfo = `Награда за раунд 1: <b style="color:var(--money-color)">+${formatNumberWithComma(bCoins)}💲</b> и <b style="color:var(--ticket-color)">+${formatNumberWithComma(bTickets)}🎟️</b>`;
            } else if (state.turn === 2) {
                const bCoins = Math.floor(state.targetDebt * 0.20);
                const bTickets = 4 + state.run;
                bonusInfo = `Награда за раунд 2: <b style="color:var(--money-color)">+${formatNumberWithComma(bCoins)}💲</b> и <b style="color:var(--ticket-color)">+${formatNumberWithComma(bTickets)}🎟️</b>`;
            }
            ui.earlyPayoffBonusInfo.innerHTML = bonusInfo;
        }

        //ui.btnEndTurn.disabled = state.isSpinning || state.spinsLeft > 0;

        let rerollCost = CONFIG.REROLL_COST;
        if (hasPassive('reroll_master') && !state.flags.firstRerollUsed) {
            rerollCost = Math.max(0, rerollCost - 1);
        }
        // [FIX] КОРРЕКТНОЕ ОТОБРАЖЕНИЕ БЕСПЛАТНЫХ РЕРОЛЛОВ
        if (state.freeRerolls > 0) {
            ui.btnRerollShop.textContent = `Обновить агазин (Бесплатно: ${state.freeRerolls})`;
        } else {
            ui.btnRerollShop.textContent = `Обновить магазин (${rerollCost}🎟️)`;
        }
        renderInventory(); 
        renderShop();
        
        // Обновляем данные для статистики
        updateWeightedSymbols();

        // --- ПОДСВЕТКА ДЖЕКПОТ-ЯЧЕЙКИ (СЕРДЦЕ АВТОМАТА) ---
        const cells = ui.slotMachine.querySelectorAll('.slot-cell');
        cells.forEach(cell => cell.classList.remove('jackpot-cell-heart'));
        if (hasItem('slot_machine_heart') && typeof state.jackpotCellIndex === 'number') {
            const jackpotCell = cells[state.jackpotCellIndex];
            if (jackpotCell) jackpotCell.classList.add('jackpot-cell-heart');
        }
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
                
                // Добавляем золотой класс если символ золотой
                if (symbol.isGolden) {
                    symbolDiv.classList.add('golden');
                }
                
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
        
        // Обновляем отображение золотых символов после завершения анимации
        updateGoldenSymbolsDisplay();
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
            // --- ИСПРАВЛЕНИЕ: разрешаем покупку "невесомых" амулетов даже при полном инвентаре ---
            const maxSize = getMaxInventorySize();
            const effectiveSlots = getEffectiveEmptySlots();
            const effectiveUsed = maxSize - effectiveSlots;
            const isNoSlot = item.effect?.ignore_slot_for_empty_bonus || item.modifier?.effect?.ignore_slot_for_empty_bonus;
            if (state.tickets < currentCost || (effectiveUsed >= maxSize && !isNoSlot)) {
                itemDiv.style.opacity = '0.5';
                itemDiv.style.cursor = 'not-allowed';
            }
        } else {
            itemDiv.style.cursor = 'pointer';
            itemDiv.onclick = () => showAmuletPopup(item);
        }

        // --- [NEW] Добавляем всплывающие подсказки для предметов в магазине ---
        if (purchaseCallback) {
            let tooltip = null;
            let tooltipTimeout = null;
            
            // Функция для скрытия tooltip
            const hideTooltip = () => {
                if (tooltipTimeout) {
                    clearTimeout(tooltipTimeout);
                    tooltipTimeout = null;
                }
                if (tooltip) {
                    tooltip.classList.remove('show');
                    setTimeout(() => {
                        if (tooltip && tooltip.parentNode) {
                            tooltip.parentNode.removeChild(tooltip);
                        }
                        tooltip = null;
                    }, 200);
                }
            };
            
            itemDiv.addEventListener('mouseenter', (e) => {
                // Скрываем все существующие тултипы перед созданием нового
                hideAllTooltips();
                
                // Создаем tooltip только если его еще нет
                if (!tooltip) {
                    try {
                        tooltip = createItemTooltip(item, currentCost, oldCost);
                        if (tooltip) {
                            document.body.appendChild(tooltip);
                        }
                    } catch (error) {
                        console.error('Ошибка создания тултипа:', error);
                        tooltip = null;
                        return;
                    }
                }
                
                // Показываем tooltip с небольшой задержкой
                tooltipTimeout = setTimeout(() => {
                    if (tooltip && tooltip.parentNode) {
                        tooltip.classList.add('show');
                    }
                }, 300);
                
                // Позиционируем tooltip
                if (tooltip) {
                    positionTooltip(tooltip, e);
                }
            });
            
            itemDiv.addEventListener('mouseleave', hideTooltip);
            
            // Скрываем tooltip при клике на предмет
            const originalOnClick = itemDiv.onclick;
            itemDiv.onclick = (e) => {
                hideTooltip();
                if (originalOnClick) {
                    originalOnClick.call(itemDiv, e);
                }
            };
            
            // Добавляем обработчик для скрытия тултипа при скролле или изменении размера окна
            const hideOnScrollOrResize = () => {
                if (tooltip && tooltip.parentNode) {
                    hideTooltip();
                }
            };
            
            window.addEventListener('scroll', hideOnScrollOrResize, { passive: true });
            window.addEventListener('resize', hideOnScrollOrResize, { passive: true });
            
            // Очищаем обработчики при удалении элемента
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList' && !document.contains(itemDiv)) {
                        hideTooltip();
                        window.removeEventListener('scroll', hideOnScrollOrResize);
                        window.removeEventListener('resize', hideOnScrollOrResize);
                        observer.disconnect();
                    }
                });
            });
            
            observer.observe(document.body, { childList: true, subtree: true });
        }

        const thumbnailDiv = document.createElement('div');
        thumbnailDiv.className = 'item-thumbnail';
        const thumbnailValue = item.thumbnail || '?';
        if (thumbnailValue.endsWith('.png') || thumbnailValue.endsWith('.jpg') || thumbnailValue.endsWith('.gif')) {
            thumbnailDiv.innerHTML = `<img src="img/${thumbnailValue}" alt="${item.name}" style="width:100%; height:100%; object-fit:cover;">`;
        } else {
            thumbnailDiv.textContent = thumbnailValue;
            // Если в эмодзи больше одного, добавляем класс для каскадного отображения
            if (countEmojis(thumbnailValue.trim()) > 1) {
                thumbnailDiv.classList.add('multiple-emoji');
            }
        }
        
        

        const infoDiv = document.createElement('div');
        infoDiv.className = 'item-info';
        
        const headerDiv = document.createElement('div');
        headerDiv.className = 'item-header';
        
        const nameSpan = document.createElement('span');
        nameSpan.className = 'item-name';
        nameSpan.textContent = item.name;
        
        const descP = document.createElement('p');
        descP.className = 'item-desc';
        descP.innerHTML = item.desc;
        
        // Теперь — добавляем классы!
        if (item.modifier) {
            if (item.modifier.divine) {
                thumbnailDiv.classList.add('divine-modifier');
                nameSpan.classList.add('divine-modifier');
                
            } else {
                thumbnailDiv.classList.add('modified');
                nameSpan.classList.add('modified');
                if (item.isPenalty) {
                    thumbnailDiv.classList.add('modifier-bad');
                    nameSpan.classList.add('modifier-bad');
                }
            }
        }
        
        headerDiv.appendChild(nameSpan);

        if (purchaseCallback && item.cost) {
            const costSpan = document.createElement('span');
            costSpan.className = 'item-cost';
            costSpan.textContent = `${currentCost}🎟️`;
            if (oldCost && currentCost < oldCost) {
                costSpan.innerHTML += ` <s style="opacity:0.6">${oldCost}🎟️`;
            }
            headerDiv.appendChild(costSpan);
        }
        
        infoDiv.appendChild(headerDiv);
        infoDiv.appendChild(descP);

        // Универсальное отображение всех бонусов per_run_bonus
        if (item.effect?.per_run_bonus) {
            const run = window.state?.run || 1;
            const bonusLines = [];
            for (const [key, value] of Object.entries(item.effect.per_run_bonus)) {
                if (typeof value === 'number') {
                    bonusLines.push(`<span style='color:#2196f3;'>Сейчас: +${value * run}</span>`);
                } else if (typeof value === 'object' && value !== null) {
                    if (typeof value.bonus === 'number') {
                        bonusLines.push(`<span style='color:#2196f3;'>Сейчас: +${value.bonus * run}</span>`);
                    } else {
                        bonusLines.push(`<span style='color:#aaa;'>${JSON.stringify(value)}</span>`);
                    }
                }
            }
            if (bonusLines.length > 0) {
                const bonusDiv = document.createElement('div');
                bonusDiv.className = 'item-bonus-inline';
                bonusDiv.style.cssText = 'font-size:12px; margin-top:2px;';
                bonusDiv.innerHTML = bonusLines.join('<br>');
                infoDiv.appendChild(bonusDiv);
            }
        }

        // Универсальное отображение uses/max_uses для всех breakable предметов
        let showUses = false;
        let uses = null;
        let maxUses = null;
        if (typeof item.uses !== 'undefined' && (item.effect?.max_uses || item.effect?.luck_chance?.max_uses)) {
            showUses = true;
            uses = item.uses;
            maxUses = item.effect.max_uses || item.effect.luck_chance?.max_uses;
        } else if (item.effect?.luck_chance?.breakable) {
            showUses = true;
            uses = item.uses !== undefined ? item.uses : (item.effect.luck_chance.max_uses || 10);
            maxUses = item.effect.luck_chance.max_uses || 10;
        } else if (item.effect?.breakable && item.effect?.max_uses) {
            showUses = true;
            uses = item.uses !== undefined ? item.uses : item.effect.max_uses;
            maxUses = item.effect.max_uses;
        }
        if (showUses && maxUses) {
            const usesSpan = document.createElement('span');
            usesSpan.style.cssText = 'color:#ffab40; font-size:11px; margin-top: auto;';
            usesSpan.textContent = `(Исп: ${uses}/${maxUses})`;
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

        // Отображение модификатора
        if (item.modifier) {
            const modifierDiv = document.createElement('div');
            if (item.modifier.divine) {
                modifierDiv.style.cssText = 'color:#ffd700; font-size:11px; margin-top: auto; font-weight: bold; border-top: 1px solid #ffd700; padding-top: 4px;';
                modifierDiv.innerHTML = `🔱 ${item.modifier.name}`;
            } else {
                modifierDiv.style.cssText = 'color:#4caf50; font-size:11px; margin-top: auto; font-weight: bold; border-top: 1px solid #4caf50; padding-top: 4px;';
                modifierDiv.innerHTML = `✨ ${item.modifier.name}`;
            }
            infoDiv.appendChild(modifierDiv);
        }

        if(item.id === 'scrap_metal') {
            const piggyDiv = document.createElement('div');
            piggyDiv.className = 'piggybank-amount';
            piggyDiv.style.cssText = 'color:#ffab40; font-size:13px; margin-top:2px; font-weight:bold;';
            piggyDiv.textContent = `Всего: ${formatNumberWithComma(state.piggyBank)}💲`;
            infoDiv.appendChild(piggyDiv);
        }

        itemDiv.appendChild(thumbnailDiv);
        itemDiv.appendChild(infoDiv);

        itemDiv.dataset.itemId = item.id;

        return itemDiv;
    }

    function renderShop() {
        // Скрываем все тултипы перед обновлением магазина
        hideAllTooltips();
        
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
        
        let modifierHTML = '';
        if (item.modifier) {
            const isPenalty = item.isPenalty || false;
            const modifierIcon = isPenalty ? '💀' : (item.modifier.divine ? '🔱' : '✨');
            const modifierColor = isPenalty ? '#e53935' : '#4caf50';
            const modifierBgColor = isPenalty ? 'rgba(229, 57, 53, 0.1)' : 'rgba(76, 175, 80, 0.1)';
            const modifierBorderColor = isPenalty ? '#e53935' : '#4caf50';
            
            modifierHTML = `<div style="color:${modifierColor}; font-weight: bold; margin-top: 10px; padding: 8px; background: ${modifierBgColor}; border-radius: 4px; border-left: 3px solid ${modifierBorderColor};">
                ${modifierIcon} Модификатор: ${item.modifier.name}<br>
                <span style="font-weight: normal; font-size: 0.9em;">${item.modifier.desc}</span>
            </div>`;
        }
        
        // Добавляем класс для переливающегося названия модифицированного предмета
        const titleClass = item.modifier
            ? (item.modifier.divine
                ? 'amulet-popup-title divine-modifier'
                : `amulet-popup-title modified${item.isPenalty ? ' modifier-bad' : ''}`)
            : 'amulet-popup-title';
        amuletPopup.innerHTML = `
            <div class="amulet-popup-card">
                <div class="amulet-popup-thumbnail">${thumbnailHTML}</div>
                <div class="${titleClass}">${item.name}</div>
                <div class="amulet-popup-desc">${item.desc}</div>
                ${modifierHTML}
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

        if(item.id === 'scrap_metal') {
            const piggyHTML = `<div style='color:#ffab40; font-size:1.1em; margin:8px 0 0 0; font-weight:bold;'>Всего: ${formatNumberWithComma(state.piggyBank)}💲</div>`;
            amuletPopup.querySelector('.amulet-popup-card').insertAdjacentHTML('beforeend', piggyHTML);
        }
    }
    function removeAmulet(itemId) {
        const idx = state.inventory.findIndex(i => i.id === itemId);
        if (idx !== -1) {
            const [removed] = state.inventory.splice(idx, 1);
            // --- Возврат divine-модификатора в пул ---
            if (removed.modifier && removed.modifier.divine && typeof window.releaseDivineModifier === 'function') {
                window.releaseDivineModifier(removed.modifier.id);
            }
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
            // updateMimicTarget(); // УБРАНО!

            // [FIX] Принудительно обновляем UI режима планирования, если он активен
            if (ui.planningModal && !ui.planningModal.classList.contains('hidden')) {
                ui.planningTickets.textContent = state.tickets;
                renderPlanningInventory();
                renderPlanningShop();
            }

            updateUI();
        } else {
            if (typeof console !== 'undefined') {
                console.warn('[DEBUG][removeAmulet] Попытка удалить несуществующий предмет:', itemId, 'Инвентарь:', state.inventory.map(i=>i.id));
            }
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
        
        // Показываем эффективное количество слотов с учетом "Иллюзионист слотов"
        const maxSize = getMaxInventorySize();
        const effectiveSlots = getEffectiveEmptySlots();
        const effectiveUsed = maxSize - effectiveSlots;
        
        // Подсчитываем модифицированные предметы
        const modifiedCount = state.inventory.filter(item => item.modifier && !item.removed).length;
        
        // --- Новый код для тултипа опасности ---
        // Очищаем счетчик
        counter.innerHTML = '';
        let baseText = `Амулеты: ${effectiveUsed} / ${maxSize}`;
        if (modifiedCount > 0) {
            baseText += ' | ';
        }
        counter.appendChild(document.createTextNode(baseText));
        
        if (modifiedCount >= 4) {
            // Оборачиваем "Модифицированные: N ⚠️" в отдельный span
            const dangerSpan = document.createElement('span');
            dangerSpan.className = 'danger-tooltip-label';
            dangerSpan.style.cursor = 'pointer';
            dangerSpan.style.marginLeft = '2px';
            dangerSpan.innerHTML = `Модифицированные: ${modifiedCount} <span class="danger-tooltip-icon">⚠️</span>`;
            counter.appendChild(dangerSpan);
            counter.style.color = 'var(--danger-color)';
            counter.style.fontWeight = 'bold';
            counter.style.textShadow = '0 0 6px var(--danger-color)';

            // Тултип как у предметов, но с пояснением
            dangerSpan.addEventListener('mouseenter', function (e) {
                hideAllTooltips();
                const tooltip = document.createElement('div');
                tooltip.className = 'item-tooltip';
                tooltip.innerHTML = `
                    <div class=\"item-tooltip-title modifier-bad\" style=\"font-size:1.1em;\">⚠️ Слишком много модифицированных предметов</div>
                    <div class=\"item-tooltip-desc\">Если у вас 4 или больше модифицированных амулета, активируется штрафная система: новые модификаторы будут чаще негативными, а стоимость предметов может увеличиваться. Старайтесь не набирать слишком много модифицированных предметов одновременно!</div>
                `;
                document.body.appendChild(tooltip);
                positionTooltip(tooltip, e);
                setTimeout(() => tooltip.classList.add('show'), 10);
                dangerSpan._tooltip = tooltip;
            });
            dangerSpan.addEventListener('mousemove', function (e) {
                if (dangerSpan._tooltip) positionTooltip(dangerSpan._tooltip, e);
            });
            dangerSpan.addEventListener('mouseleave', function () {
                hideAllTooltips();
                dangerSpan._tooltip = null;
            });
        } else if (modifiedCount > 0) {
            // Для 1-3 модифицированных — просто текст
            const modSpan = document.createElement('span');
            modSpan.textContent = `Модифицированные: ${modifiedCount}`;
            if (modifiedCount >= 3) {
                modSpan.style.color = '#ffaa00';
                modSpan.style.fontWeight = 'bold';
            }
            counter.appendChild(modSpan);
        }
        
        if (effectiveUsed >= maxSize) {
            counter.style.color = 'var(--danger-color)';
            counter.style.fontWeight = 'bold';
            counter.style.textShadow = '0 0 6px var(--danger-color)';
        } else if (modifiedCount < 3) {
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
        // Скрываем все тултипы перед обновлением планируемого магазина
        hideAllTooltips();
        
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
        
        // Показываем эффективное количество слотов с учетом "Иллюзионист слотов"
        const maxSize = getMaxInventorySize();
        const effectiveSlots = getEffectiveEmptySlots();
        const effectiveUsed = maxSize - effectiveSlots;
        
        counter.textContent = `Амулеты: ${effectiveUsed} / ${maxSize}`;
        if (effectiveUsed >= maxSize) {
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

    // --- Улучшенная функция: обновляет цель сундука-мимика ---
    /**
     * Обновляет цель копирования для сундука-мимика.
     * Мимик не работает корректно с предметами, у которых:
     *  - уникальные функции с привязкой к id/uses (например, предметы с on_spin_bonus, требующие уникального контекста)
     *  - сложная логика uses (например, breakable с побочными эффектами)
     *  - предметы, которые сами являются мимиками
     *
     * UI описания предмета теперь обновляется сразу после смены цели (например, при покупке/удалении).
     */
    function updateMimicTarget() {
        const mimicItem = state.inventory.find(item => item.id === 'mimic_chest');
        if (mimicItem) {
            // Кандидаты — все предметы, кроме других мимиков и предметов без эффекта
            const candidates = state.inventory.filter(item => item.id !== 'mimic_chest' && !item.effect?.mimic && item.effect);
            let prevTarget = mimicItem.effect?.mimic?.target;
            if (candidates.length > 0) {
                const target = candidates[Math.floor(Math.random() * candidates.length)];
                // Копируем весь объект эффекта поверх базового эффекта мимика
                mimicItem.effect = { ...ALL_ITEMS.find(i => i.id === 'mimic_chest').effect, ...target.effect };
                mimicItem.effect.mimic = { target: target.id };
                // Если у цели есть uses и она breakable — копируем uses
                if (target.effect.breakable && typeof target.uses !== 'undefined') {
                    mimicItem.uses = target.uses;
                } else {
                    delete mimicItem.uses;
                }
                if (prevTarget !== target.id) {
                    addLog(`Сундук-Мимик теперь копирует: ${target.name}`, 'win');
                }
            } else {
                // Нет кандидатов — сбрасываем к базовому эффекту
                mimicItem.effect = { ...ALL_ITEMS.find(i => i.id === 'mimic_chest').effect };
                mimicItem.effect.mimic = { target: undefined };
                delete mimicItem.uses;
                if (prevTarget !== undefined) {
                    addLog('Сундук-Мимик сбросил цель копирования.', 'loss');
                }
            }
            // Обновляем UI описания предмета сразу
            if (typeof renderInventory === 'function') renderInventory();
            if (typeof renderPlanningInventory === 'function') renderPlanningInventory();
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
    
    // Обработчик для кнопки видеорекламы с вознаграждением
    const watchAdBtn = document.getElementById('watch-ad-for-spins');
    if (watchAdBtn) {
        watchAdBtn.onclick = async () => {
            if (window.adsManager && window.adsManager.isReady()) {
                watchAdBtn.disabled = true;
                watchAdBtn.textContent = '📺 Смотрим рекламу...';
                
                try {
                    const wasRewarded = await window.adsManager.showRewardedVideo();
                    if (wasRewarded) {
                        // Выдаем награду за просмотр рекламы
                        state.spinsLeft += 3;
                        addLog('📺 Реклама просмотрена! Получено 3 прокрута.', 'win');
                        ui.spinPurchaseModal.classList.add('hidden');
                        updateUI();
                    } else {
                        addLog('📺 Реклама не была просмотрена полностью.', 'loss');
                    }
                } catch (error) {
                    console.error('[Ads] Ошибка при показе видеорекламы:', error);
                    addLog('📺 Ошибка при показе рекламы.', 'loss');
                } finally {
                    watchAdBtn.disabled = false;
                    watchAdBtn.textContent = '📺 Смотреть рекламу за 3 прокрута';
                }
            } else {
                addLog('📺 Реклама недоступна.', 'loss');
            }
        };
    }
    
    ui.btnRerollShop.onclick = rerollShop;
    ui.btnPlanning.onclick = openPlanningMode;
    ui.btnPlanningReroll.onclick = rerollPlanningShop;
    ui.btnFinishPlanning.onclick = closePlanningMode;
    ui.btnPayDebtEarly.onclick = payDebtEarly;
    ui.btnLeaderboard.onclick = () => {
        if (window.leaderboardsManager) {
            window.leaderboardsManager.showLeaderboardModal();
        }
    };

    ui.startScreen.classList.remove('hidden');

    const devBtn = document.getElementById('dev-menu-btn');
    const devModal = document.getElementById('dev-menu-modal');
    const devAddCoins = document.getElementById('dev-add-coins');
    const devAddTickets = document.getElementById('dev-add-tickets');
    const devSetInterest = document.getElementById('dev-set-interest');
    const devGiveItem = document.getElementById('dev-give-item');
    const devClose = document.getElementById('dev-close-menu');
    const devItemSelect = document.getElementById('dev-item-select');
    const devPassiveSelect = document.getElementById('dev-passive-select');
    const devGivePassive = document.getElementById('dev-give-passive');
    const devPassivesList = document.getElementById('dev-passives-list');
    const devSymbolChances = document.getElementById('dev-symbol-chances');
    const devApplyChances = document.getElementById('dev-apply-chances');
    const devApplyLuck = document.getElementById('dev-apply-luck');
    const devLuckInput = document.getElementById('dev-luck-input');
    const dev100LoseMode = document.getElementById('dev-100-lose-mode');

    // Проверяем существование кнопки dev-menu-btn перед установкой обработчика
    if (devBtn) {
        devBtn.onclick = () => { 
            devModal.classList.remove('hidden');
            devItemSelect.innerHTML = '';
            ALL_ITEMS.forEach(item => {
                const opt = document.createElement('option');
                opt.value = item.id;
                
                // Определяем цвет редкости
                let rarityColor = '#aaa'; // common
                if (item.rarity === 'rare') rarityColor = '#536dfe';
                else if (item.rarity === 'legendary') rarityColor = '#ffab40';
                
                // Создаем HTML с иконкой и цветовой индикацией
                opt.innerHTML = `<span style="color: ${rarityColor};">${item.thumbnail}</span> ${item.name} <span style="color: ${rarityColor}; font-size: 0.9em;">(${item.rarity})</span>`;
                opt.style.color = rarityColor;
                opt.style.fontWeight = 'bold';
                
                devItemSelect.appendChild(opt);
            });
            
            // Заполняем список пассивок
            devPassiveSelect.innerHTML = '';
            ALL_PASSIVES.forEach(passive => {
                const opt = document.createElement('option');
                opt.value = passive.id;
                
                // Определяем цвет типа пассивки
                let typeColor = '#aaa'; // по умолчанию
                if (passive.type === 'one_time') typeColor = '#ff6b6b';
                else if (passive.type === 'slot_modifier') typeColor = '#4ecdc4';
                else if (passive.type === 'item_mod') typeColor = '#45b7d1';
                
                // Создаем HTML с эмодзи и цветовой индикацией
                opt.innerHTML = `<span style="color: ${typeColor};">${passive.emoji}</span> ${passive.name} <span style="color: ${typeColor}; font-size: 0.9em;">(${passive.type})</span>`;
                opt.style.color = typeColor;
                opt.style.fontWeight = 'bold';
                
                devPassiveSelect.appendChild(opt);
            });
            
            // Показываем активные пассивки
            updateDevPassivesList();
            
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
            dev100LoseMode.checked = state.dev100LoseMode || false;
            
            // Добавляем кнопки для отладки лидерборда, если их ещё нет
            const devMenuContent = devModal.querySelector('.dev-menu-two-columns');
            if (devMenuContent && !devMenuContent.querySelector('.dev-leaderboard-section')) {
                const lbSection = document.createElement('div');
                lbSection.className = 'dev-section dev-leaderboard-section';
                lbSection.innerHTML = '<h3>Лидерборд (отладка)</h3>';
                const btnShowOnline = document.createElement('button');
                btnShowOnline.textContent = 'Показать онлайн лидерборд';
                btnShowOnline.className = 'dev-button';
                btnShowOnline.onclick = () => {
                    if (window.leaderboardsManager) window.leaderboardsManager.showLeaderboardModal();
                };
                const btnShowLocal = document.createElement('button');
                btnShowLocal.textContent = 'Показать локальный лидерборд';
                btnShowLocal.className = 'dev-button';
                btnShowLocal.onclick = () => {
                    if (window.leaderboardsManager) window.leaderboardsManager.showLocalLeaderboardModal();
                };
                const btnClearLocal = document.createElement('button');
                btnClearLocal.textContent = 'Очистить локальный лидерборд';
                btnClearLocal.className = 'dev-button';
                btnClearLocal.onclick = () => {
                    localStorage.removeItem('localLeaderboard');
                    addLog('Локальный лидерборд очищен.', 'win');
                };
                lbSection.appendChild(btnShowOnline);
                lbSection.appendChild(btnShowLocal);
                lbSection.appendChild(btnClearLocal);
                devMenuContent.appendChild(lbSection);
            }
            
        };
        if (devClose) {
            devClose.onclick = () => { devModal.classList.add('hidden'); };
        }
    }
    
    function updateDevPassivesList() {
        if (!devPassivesList) return;
        
        devPassivesList.innerHTML = '';
        if (!state.activePassives || state.activePassives.length === 0) {
            devPassivesList.innerHTML = '<span style="color: #666; font-style: italic;">Нет активных пассивок</span>';
            return;
        }
        
        state.activePassives.forEach(passive => {
            const passiveEl = document.createElement('div');
            passiveEl.style.marginBottom = '4px';
            passiveEl.style.padding = '4px';
            passiveEl.style.backgroundColor = 'var(--cell-bg)';
            passiveEl.style.borderRadius = '3px';
            passiveEl.style.border = '1px solid var(--border-color)';
            
            let typeColor = '#aaa';
            if (passive.type === 'one_time') typeColor = '#ff6b6b';
            else if (passive.type === 'slot_modifier') typeColor = '#4ecdc4';
            else if (passive.type === 'item_mod') typeColor = '#45b7d1';
            
            passiveEl.innerHTML = `<span style="color: ${typeColor};">${passive.emoji}</span> <strong>${passive.name}</strong> <span style="color: ${typeColor}; font-size: 0.8em;">(${passive.type})</span>`;
            devPassivesList.appendChild(passiveEl);
        });
    }
    
    if (devClose) {
        devClose.onclick = () => { devModal.classList.add('hidden'); };
    }
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
    devGivePassive.onclick = () => {
        const id = devPassiveSelect.value;
        if (!state.activePassives.some(p => p.id === id)) {
            const passive = ALL_PASSIVES.find(p => p.id === id);
            applyPassive(passive, state);
            addLog(`Dev: Добавлена пассивка: ${passive.name}`, 'win');
            updateDevPassivesList();
            updateUI();
        } else {
            addLog('Dev: Эта пассивка уже активна.', 'loss');
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

    dev100LoseMode.onchange = () => {
        state.dev100LoseMode = dev100LoseMode.checked;
        if (state.dev100LoseMode) {
            addLog('Dev: Включен режим 100% проигрышных прокрутов', 'loss');
        } else {
            addLog('Dev: Отключен режим 100% проигрышных прокрутов', 'win');
        }
    };

    window.showDoubloonPopup = function() {
        const popup = document.createElement('div');
        popup.className = 'doubloon-popup';
        popup.innerHTML = `
            <div class="doubloon-star">
                <svg viewBox="0 0 100 100" width="50" height="50" class="doubloon-svg">
                    <rect x="10" y="10" width="80" height="80" fill="#1a1a1a" stroke="#fffbe6" stroke-width="3"/>
                    <text x="50" y="55" text-anchor="middle" font-size="16" fill="white" font-weight="bold">${item.thumbnail}</text>
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
    
    const origInitGame = initGame;
    window.initGame = function() {
        origInitGame.apply(this, arguments);
        updateStartDebt();
    }

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
        // Фильтруем отладочные сообщения
        if (typeof message === 'string' && (message.startsWith('[DEBUG]') || message.startsWith('[Квантовая Запутанность]') || message.startsWith('Dev:'))) return;
        
        // Форматируем числа с разделителями
        if (typeof message === 'string') {
            message = message.replace(/\b(\d+)(?=(\d{3})+(?!\d)\b)/g, (match) => match.replace(/,/g, ''));
            message = message.replace(/\b(\d{1,3})(?=(\d{3})+(?!\d)\b)/g, '$1,');
        }
        
        // Создаем элемент лога
        const logEntry = document.createElement('p');
        logEntry.className = `log-entry log-${type}`;
        
        // Добавляем временную метку
        const now = new Date();
        const timeString = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        
        // Форматируем сообщение в зависимости от типа
        let formattedMessage = message;
        let icon = '';
        
        if (type === 'win') {
            icon = '🎉';
            logEntry.style.color = 'var(--highlight-color)';
        } else if (type === 'loss') {
            icon = '💀';
            logEntry.style.color = 'var(--danger-color)';
        } else if (type === 'info') {
            icon = 'ℹ️';
            logEntry.style.color = 'var(--text-color)';
        } else if (type === 'money') {
            icon = '💰';
            logEntry.style.color = 'var(--money-color)';
        } else if (type === 'luck') {
            icon = '🍀';
            logEntry.style.color = 'var(--luck-color)';
        } else if (type === 'spin') {
            icon = '🎰';
            logEntry.style.color = 'var(--text-color)';
        } else if (type === 'item') {
            icon = '🎁';
            logEntry.style.color = 'var(--highlight-color)';
        } else if (type === 'passive') {
            icon = '⚡';
            logEntry.style.color = 'var(--luck-color)';
        } else {
            icon = '>';
            logEntry.style.color = 'var(--text-color)';
        }
        
        formattedMessage = icon ? `${icon} ${message}` : message;
        
        logEntry.innerHTML = `<span class="log-time">${timeString}</span> ${formattedMessage}`;
        
        // Добавляем в начало панели
        ui.logPanel.insertBefore(logEntry, ui.logPanel.firstChild);
        
        // Ограничиваем количество записей
        if (ui.logPanel.children.length > 100) {
            ui.logPanel.removeChild(ui.logPanel.lastChild);
        }
        
        // Автоматически прокручиваем к новому сообщению
        ui.logPanel.scrollTop = 0;
        
        // Добавляем анимацию появления
        logEntry.style.opacity = '0';
        logEntry.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            logEntry.style.transition = 'all 0.3s ease';
            logEntry.style.opacity = '1';
            logEntry.style.transform = 'translateY(0)';
        }, 10);
    }

    // Функция для очистки лога
    function clearLog() {
        if (ui.logPanel) {
            ui.logPanel.innerHTML = '';
            addLog('Лог очищен', 'info');
        }
    }

    // Делаем функцию доступной глобально
    window.clearLog = clearLog;

    /*
    // Функция для экспорта лога в файл
    function exportLog() {
        if (!ui.logPanel) return;
        
        const logEntries = Array.from(ui.logPanel.children).map(entry => {
            const time = entry.querySelector('.log-time')?.textContent || '';
            const message = entry.textContent.replace(time, '').trim();
            return `[${time}] ${message}`;
        }).reverse(); // Разворачиваем в хронологическом порядке
        
        const logText = logEntries.join('\n');
        const blob = new Blob([logText], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `game-log-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        addLog('Лог экспортирован в файл', 'info');
    }
    */

    // Делаем функцию экспорта доступной глобально
    //window.exportLog = exportLog;

    // Функция для поиска по логу
    function searchLog(query) {
        if (!ui.logPanel || !query) return;
        
        const entries = Array.from(ui.logPanel.children);
        let foundCount = 0;
        
        entries.forEach(entry => {
            const text = entry.textContent.toLowerCase();
            const matches = text.includes(query.toLowerCase());
            
            if (matches) {
                entry.style.backgroundColor = 'rgba(255, 215, 0, 0.2)';
                entry.style.borderLeftColor = 'var(--highlight-color)';
                foundCount++;
            } else {
                // Восстанавливаем оригинальные стили
                const type = entry.className.match(/log-(\w+)/)?.[1] || 'normal';
                if (type === 'win') {
                    entry.style.backgroundColor = 'rgba(255, 215, 0, 0.1)';
                    entry.style.borderLeftColor = 'var(--highlight-color)';
                } else if (type === 'loss') {
                    entry.style.backgroundColor = 'rgba(220, 53, 69, 0.1)';
                    entry.style.borderLeftColor = 'var(--danger-color)';
                } else if (type === 'money') {
                    entry.style.backgroundColor = 'rgba(40, 167, 69, 0.1)';
                    entry.style.borderLeftColor = 'var(--money-color)';
                } else if (type === 'luck') {
                    entry.style.backgroundColor = 'rgba(102, 16, 242, 0.1)';
                    entry.style.borderLeftColor = 'var(--luck-color)';
                } else if (type === 'info') {
                    entry.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                    entry.style.borderLeftColor = 'var(--text-color)';
                } else if (type === 'spin') {
                    entry.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                    entry.style.borderLeftColor = 'var(--text-color)';
                } else if (type === 'item') {
                    entry.style.backgroundColor = 'rgba(255, 215, 0, 0.08)';
                    entry.style.borderLeftColor = 'var(--highlight-color)';
                } else if (type === 'passive') {
                    entry.style.backgroundColor = 'rgba(102, 16, 242, 0.08)';
                    entry.style.borderLeftColor = 'var(--luck-color)';
                } else {
                    entry.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
                    entry.style.borderLeftColor = 'transparent';
                }
            }
        });
        
        if (foundCount > 0) {
            addLog(`Найдено ${foundCount} записей по запросу "${query}"`, 'info');
        } else {
            addLog(`По запросу "${query}" ничего не найдено`, 'info');
        }
    }

    // Делаем функцию поиска доступной глобально
    window.searchLog = searchLog;

    // Функция для сброса поиска
    function resetLogSearch() {
        if (!ui.logPanel) return;
        
        const entries = Array.from(ui.logPanel.children);
        
        entries.forEach(entry => {
            const type = entry.className.match(/log-(\w+)/)?.[1] || 'normal';
            if (type === 'win') {
                entry.style.backgroundColor = 'rgba(255, 215, 0, 0.1)';
                entry.style.borderLeftColor = 'var(--highlight-color)';
            } else if (type === 'loss') {
                entry.style.backgroundColor = 'rgba(220, 53, 69, 0.1)';
                entry.style.borderLeftColor = 'var(--danger-color)';
            } else if (type === 'money') {
                entry.style.backgroundColor = 'rgba(40, 167, 69, 0.1)';
                entry.style.borderLeftColor = 'var(--money-color)';
            } else if (type === 'luck') {
                entry.style.backgroundColor = 'rgba(102, 16, 242, 0.1)';
                entry.style.borderLeftColor = 'var(--luck-color)';
            } else if (type === 'info') {
                entry.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                entry.style.borderLeftColor = 'var(--text-color)';
            } else if (type === 'spin') {
                entry.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                entry.style.borderLeftColor = 'var(--text-color)';
            } else if (type === 'item') {
                entry.style.backgroundColor = 'rgba(255, 215, 0, 0.08)';
                entry.style.borderLeftColor = 'var(--highlight-color)';
            } else if (type === 'passive') {
                entry.style.backgroundColor = 'rgba(102, 16, 242, 0.08)';
                entry.style.borderLeftColor = 'var(--luck-color)';
            } else {
                entry.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
                entry.style.borderLeftColor = 'transparent';
            }
        });
        
        addLog('Поиск сброшен', 'info');
    }

    // Делаем функцию сброса поиска доступной глобально
    window.resetLogSearch = resetLogSearch;

    // --- ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ: Максимальный размер инвентаря ---
    function getMaxInventorySize() {
        let base = 9;
        if (hasPassive('inventory_plus_one')) base += 1;
        return base;
    }

    // --- ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ: Расчет эффективных пустых слотов ---
    function getEffectiveEmptySlots() {
        const maxSize = getMaxInventorySize();
        const currentSize = state.inventory.length;
        
        // Если есть "Иллюзионист слотов", предметы с бонусами за пустые слоты не занимают место
        if (hasItem('slot_illusionist')) {
            const itemsWithEmptySlotBonus = state.inventory.filter(item => 
                item.effect?.per_empty_slot_bonus || item.effect?.per_empty_slot_luck || item.effect?.ignore_slot_for_empty_bonus
            );
            // Сам "Иллюзионист слотов" также не занимает место согласно описанию
            const effectiveUsedSlots = currentSize - itemsWithEmptySlotBonus.length;
            return Math.max(0, maxSize - effectiveUsedSlots);
        }
        
        // Проверяем предметы с модификатором ignore_slot_for_empty_bonus
        const itemsWithNoSlotUsage = state.inventory.filter(item => 
            item.effect?.ignore_slot_for_empty_bonus || item.modifier?.effect?.ignore_slot_for_empty_bonus
        );
        const effectiveUsedSlots = currentSize - itemsWithNoSlotUsage.length;
        
        return Math.max(0, maxSize - effectiveUsedSlots);
    }

    // Новая функция для расчета бонуса от "Гордость барахольщика"
    function getHoarderPrideBonus() {
        if (!hasItem('hoarders_pride')) return 0;
        
        const maxSize = getMaxInventorySize();
        const currentSize = state.inventory.length;
        
        // Если есть "Иллюзионист слотов", считаем только реальные пустые слоты
        // (не те, которые освобождает сам "Иллюзионист")
        if (hasItem('slot_illusionist')) {
            // Исключаем все предметы с бонусами за пустые слоты, кроме самого "Иллюзионист слотов"
            const itemsWithEmptySlotBonus = state.inventory.filter(item => 
                (item.effect?.per_empty_slot_bonus || item.effect?.per_empty_slot_luck) && item.id !== 'slot_illusionist'
            );
            const effectiveUsedSlots = currentSize - itemsWithEmptySlotBonus.length;
            return Math.max(0, maxSize - effectiveUsedSlots);
        }
        
        // Если "Иллюзионист слотов" нет, используем обычную логику
        const itemsWithNoSlotUsage = state.inventory.filter(item => 
            item.effect?.ignore_slot_for_empty_bonus || item.modifier?.effect?.ignore_slot_for_empty_bonus
        );
        const effectiveUsedSlots = currentSize - itemsWithNoSlotUsage.length;
        
        return Math.max(0, maxSize - effectiveUsedSlots);
    }

    // Функция для расчета бонуса от предметов с per_empty_slot_bonus (как "Минималист")
    function getEmptySlotBonus() {
        const maxSize = getMaxInventorySize();
        const currentSize = state.inventory.length;
        
        // Если есть "Иллюзионист слотов", считаем только реальные пустые слоты
        if (hasItem('slot_illusionist')) {
            // Исключаем все предметы с бонусами за пустые слоты, кроме самого "Иллюзионист слотов"
            const itemsWithEmptySlotBonus = state.inventory.filter(item => 
                (item.effect?.per_empty_slot_bonus || item.effect?.per_empty_slot_luck) && item.id !== 'slot_illusionist'
            );
            const effectiveUsedSlots = currentSize - itemsWithEmptySlotBonus.length;
            return Math.max(0, maxSize - effectiveUsedSlots);
        }
        
        // Если "Иллюзионист слотов" нет, используем обычную логику
        const itemsWithNoSlotUsage = state.inventory.filter(item => 
            item.effect?.ignore_slot_for_empty_bonus || item.modifier?.effect?.ignore_slot_for_empty_bonus
        );
        const effectiveUsedSlots = currentSize - itemsWithNoSlotUsage.length;
        
        return Math.max(0, maxSize - effectiveUsedSlots);
    }

    // === БОНУСЫ ОТ НОВЫХ ПРЕДМЕТОВ ===
    function applyFruitSaladBonus(grid) {
      // Фруктовый салат: +1💲 за каждую пару соседних (не по диагонали) 🍋 и 🍒
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
      // Сладкий прокрут: если на поле нет Лимонов 🍋, +3💲
      return grid.some(s => s.id === 'lemon') ? 0 : 3;
    }

    function applyCloverFieldBonus(grid) {
      // Клеверное поле: если на поле 5+ Клеверов 🍀, +5💲
      const cloverCount = grid.filter(s => s.id === 'clover').length;
      return cloverCount >= 5 ? 5 : 0;
    }

    function applyBookendsBonus(grid) {
      // Книжные подпорки: если символы в левом верхнем и правом нижнем углах совпадают, +4💲
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
        // Если уже есть анимация проигрыша, не добавляем обычную анимацию
        if (el.classList.contains('item-activated-loss')) return;
        // Удаляем класс, если он уже есть, чтобы анимация заметила удаление
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

    function showPirateWarning() {
        const warningModal = document.createElement('div');
        warningModal.className = 'modal-overlay';
        warningModal.innerHTML = `
            <div class="modal-content warning-modal">
                <h3>⚠️ Предупреждение ⚠️</h3>
                <p>В тени удачи таится опасность... Говорят, что иногда на барабанах появляется зловещий символ 🏴‍☠️</p>
                <p style="color: #ff4444; font-style: italic;">Шансы малы, но цена высока...</p>
                <button class="btn-warning-ok">Понятно</button>
            </div>
        `;
        document.body.appendChild(warningModal);
        
        const btnOk = warningModal.querySelector('.btn-warning-ok');
        btnOk.onclick = () => {
            warningModal.remove();
        };
    }

    // === ПОДРОБНЫЙ ТУЛТИП ДЛЯ КНОПОК ПОКУПКИ ПРОКРУТОВ ===
    function getSpinCostBreakdown(pkgNum) {
        const run = state.run;
        const bank = state.bankBalance;
        const debt = state.targetDebt;
        const cycleMultiplier = run === 1 ? 1 : Math.pow(1.9, run - 1);
        let wealthTax = 0;
        if (run > 1) {
            if (bank > 100000) wealthTax = Math.floor(bank / 80);
            else if (bank > 20000) wealthTax = Math.floor(bank / 120);
            else if (bank > 5000) wealthTax = Math.floor(bank / 180);
            else if (bank > 1000) wealthTax = Math.floor(bank / 250);
        }
        const debtTax = run === 1 ? 0 : Math.floor(debt / 6);
        let baseCost, finalCost;
        if (pkgNum === 1) {
            baseCost = Math.floor(CONFIG.SPIN_PACKAGE_1.base_cost * cycleMultiplier);
            if (hasPassive('bulk_buyer')) baseCost = Math.max(1, baseCost - 2);
            finalCost = baseCost + wealthTax + debtTax;
        } else {
            baseCost = Math.floor(CONFIG.SPIN_PACKAGE_2.base_cost * cycleMultiplier);
            finalCost = baseCost + wealthTax + debtTax;
        }
        let lines = [];
        lines.push(`<b>Базовая стоимость:</b> ${baseCost}💲`);
        lines.push(`<b>Множитель цикла (x${cycleMultiplier.toFixed(2)}):</b> ${baseCost !== CONFIG.SPIN_PACKAGE_1.base_cost && baseCost !== CONFIG.SPIN_PACKAGE_2.base_cost ? `+${baseCost - (pkgNum === 1 ? CONFIG.SPIN_PACKAGE_1.base_cost : CONFIG.SPIN_PACKAGE_2.base_cost)}💲` : '+0💲'}`);
        lines.push(`<b>Налог на богатство:</b> +${wealthTax}💲`);
        lines.push(`<b>Налог от долга:</b> +${debtTax}💲`);
        lines.push(`<b>Итого:</b> <span style='color:var(--money-color)'>${finalCost}💲</span>`);
        return lines.join('<br>');
    }

    function setupSpinCostTooltip() {
        const btn7 = document.getElementById('buy-spins-7');
        const btn3 = document.getElementById('buy-spins-3');
        const tooltip = document.getElementById('spin-cost-tooltip');
        if (!btn7 || !btn3 || !tooltip) return;

        let currentButton = null;
        let isTooltipVisible = false;

        function showTooltip(btn, pkgNum) {
            currentButton = btn;
            tooltip.innerHTML = getSpinCostBreakdown(pkgNum);
            
            // Получаем координаты кнопки
            const rect = btn.getBoundingClientRect();
            const scrollY = window.scrollY || window.pageYOffset;
            const scrollX = window.scrollX || window.pageXOffset;
            
            // Позиционируем тултип справа от кнопки
            let top = rect.top + scrollY;
            let left = rect.right + 12 + scrollX;
            
            tooltip.style.maxWidth = '320px';
            tooltip.style.display = 'block';
            tooltip.style.left = left + 'px';
            tooltip.style.top = top + 'px';
            
            // Проверяем границы экрана после установки display: block
            const tooltipRect = tooltip.getBoundingClientRect();
            
            // Проверка на выход за правый край
            if (tooltipRect.right > window.innerWidth) {
                left = rect.left - tooltipRect.width - 12 + scrollX;
                tooltip.style.left = left + 'px';
            }
            
            // Проверка на выход за нижний край
            if (tooltipRect.bottom > window.innerHeight) {
                top = rect.top + scrollY - tooltipRect.height + rect.height;
                tooltip.style.top = top + 'px';
            }
            
            // Делаем тултип видимым после позиционирования
            requestAnimationFrame(() => {
                tooltip.style.opacity = '1';
            });
            
            isTooltipVisible = true;
        }

        function hideTooltip() {
            if (!isTooltipVisible) return;
            tooltip.style.opacity = '0';
            currentButton = null;
            isTooltipVisible = false;
            setTimeout(() => {
                if (!isTooltipVisible) { // Проверяем, не показался ли тултип снова
                    tooltip.style.display = 'none';
                }
            }, 150);
        }

        function handleMouseMove(e, btn, pkgNum) {
            const rect = btn.getBoundingClientRect();
            if (e.clientX >= rect.left && e.clientX <= rect.right &&
                e.clientY >= rect.top && e.clientY <= rect.bottom) {
                showTooltip(btn, pkgNum); // Всегда обновляем тултип
            } else if (currentButton === btn) {
                hideTooltip();
            }
        }

        // Добавляем обработчики событий
        btn7.addEventListener('mouseenter', () => showTooltip(btn7, 1));
        btn7.addEventListener('mousemove', (e) => handleMouseMove(e, btn7, 1));
        btn7.addEventListener('mouseleave', hideTooltip);

        btn3.addEventListener('mouseenter', () => showTooltip(btn3, 2));
        btn3.addEventListener('mousemove', (e) => handleMouseMove(e, btn3, 2));
        btn3.addEventListener('mouseleave', hideTooltip);
    }
    document.addEventListener('DOMContentLoaded', setupSpinCostTooltip);

    // === ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ: Чинит случайный сломанный breakable-предмет ===
    function repairRandomBrokenItem() {
        // Ищем все breakable-предметы, у которых uses < max_uses
        const repairable = state.inventory.filter(item => {
            if (item.effect?.luck_chance?.breakable) {
                return item.uses < ((item.effect.luck_chance.max_uses || 1) + getBreakableUsesBoost());
            }
            if (item.effect?.breakable && !item.effect?.luck_chance) {
                return item.uses < ((item.effect.max_uses || 10) + getBreakableUsesBoost());
            }
            return false;
        });
        if (repairable.length > 0) {
            const toRepair = repairable[Math.floor(Math.random() * repairable.length)];
            if (toRepair.effect?.luck_chance?.breakable) {
                toRepair.uses = (toRepair.effect.luck_chance.max_uses || 1) + getBreakableUsesBoost();
            } else if (toRepair.effect?.breakable && !toRepair.effect?.luck_chance) {
                toRepair.uses = (toRepair.effect.max_uses || 10) + getBreakableUsesBoost();
            }
            addLog(`🧰 Набор инструментов мастера: полностью починил '${toRepair.name}'!`, 'win');
            animateInventoryItem('master_toolkit');
        }
    }

            // --- [NEW] Набор инструментов мастера ---
            if (hasItem('master_toolkit')) {
                repairRandomBrokenItem();
            }

    function addPrismButton() {
        if (!hasItem('probability_prism')) return;
        let btn = document.getElementById('btn-ban-symbol');
        if (!btn) {
            btn = document.createElement('button');
            btn.id = 'btn-ban-symbol';
            btn.textContent = '🔮 Запретить символ';
            btn.style.margin = '6px 0 0 0';
            btn.style.background = 'var(--highlight-color)';
            btn.style.color = '#222';
            btn.style.fontWeight = 'bold';
            btn.style.fontSize = '13px';
            btn.style.padding = '4px 10px';
            btn.style.borderRadius = '5px';
            btn.onclick = openBanSymbolModal;
            ui.inventoryItems.parentElement.insertBefore(btn, ui.inventoryItems);
        }
        // Кнопка активна только если нет активного бана в этом раунде
        btn.disabled = !!(state.bannedSymbols && state.bannedSymbols.some(b => b.justSet));
    }

    function removePrismButton() {
        const btn = document.getElementById('btn-ban-symbol');
        if (btn) btn.remove();
    }

    // === МОДАЛЬНОЕ ОКНО ВЫБОРА СИМВОЛА ===
    function openBanSymbolModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `<div class="modal-content" style="max-width:400px;">
            <h2>🔮 Призма вероятности</h2>
            <p>Выберите символ, который не будет выпадать в течение 3 прокрутов:</p>
            <div id="ban-symbol-list" style="display:flex; flex-wrap:wrap; gap:10px; justify-content:center;"></div>
            <button id="ban-cancel" style="margin-top:15px;">Отмена</button>
        </div>`;
        document.body.appendChild(modal);
        const list = modal.querySelector('#ban-symbol-list');
        SYMBOLS.forEach(s => {
            const btn = document.createElement('button');
            btn.textContent = s.graphic + ' ' + s.id;
            btn.style.padding = '8px 12px';
            btn.style.fontSize = '1.2em';
            btn.onclick = () => {
                if (!state.bannedSymbols) state.bannedSymbols = [];
                state.bannedSymbols.push({ symbol: s.id, spinsLeft: 3, justSet: true });
                addLog(`🔮 Призма: символ ${s.graphic} (${s.id}) запрещён на 3 прокрута!`, 'win');
                // --- DEBUG LOG ---
                addLog(`[DEBUG] bannedSymbols: ` + JSON.stringify(state.bannedSymbols), 'normal');
                animateInventoryItem('probability_prism');
                modal.remove();
                removePrismButton(); // Убираем кнопку после применения
                updateUI();
            };
            list.appendChild(btn);
        });
        modal.querySelector('#ban-cancel').onclick = () => modal.remove();
        modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
    }

    // === ФИЛЬТРАЦИЯ СИМВОЛОВ В generateGrid ===
    const origGenerateGrid = generateGrid;
    generateGrid = function() {
        // Убираем запрещённые символы
        let banned = (state.bannedSymbols || []).filter(b => b.spinsLeft > 0).map(b => b.symbol);
        if (banned.length > 0) {
            weightedSymbols = weightedSymbols.filter(s => !banned.includes(s.id));
        }
        return origGenerateGrid.apply(this, arguments);
    }

    // === УМЕНЬШАЕМ СЧЁТЧИК ПОСЛЕ КАЖДОГО СПИНА ===
    const origSpin = spin;
    spin = async function() {
        await origSpin.apply(this, arguments);
        if (state.bannedSymbols && state.bannedSymbols.length > 0) {
            state.bannedSymbols.forEach(b => { if (!b.justSet) b.spinsLeft--; b.justSet = false; });
            state.bannedSymbols = state.bannedSymbols.filter(b => b.spinsLeft > 0);
            updateUI();
        }
    }

    // === СБРОС КНОПКИ В НАЧАЛЕ РАУНДА ===
    const origStartTurn = startTurn;
    startTurn = function() {
        // Сброс флагов justSet у bannedSymbols
        if (state.bannedSymbols && state.bannedSymbols.length > 0) {
            state.bannedSymbols.forEach(b => { b.justSet = false; });
        }
        origStartTurn.apply(this, arguments);
        if (hasItem('probability_prism')) addPrismButton(); else removePrismButton();
    }

    // === ВОССТАНОВЛЕНИЕ МАСТЕРСКОЙ ГНОМА ===
    function repairDwarfsWorkshop() {
        if (hasItem('dwarfs_workshop')) {
            const effect = ALL_ITEMS.find(i => i.id === 'dwarfs_workshop').effect.on_round_end_repair;
            if (effect.all) {
                let repaired = 0;
                state.inventory.forEach(item => {
                    if (item.effect?.luck_chance?.breakable) {
                        if (item.uses < ((item.effect.luck_chance.max_uses || 1) + getBreakableUsesBoost())) {
                            item.uses = Math.min((item.uses || 0) + effect.count, (item.effect.luck_chance.max_uses || 1) + getBreakableUsesBoost());
                            repaired++;
                        }
                    } else if (item.effect?.breakable && !item.effect?.luck_chance) {
                        if (item.uses < ((item.effect.max_uses || 10) + getBreakableUsesBoost())) {
                            item.uses = Math.min((item.uses || 0) + effect.count, (item.effect.max_uses || 10) + getBreakableUsesBoost());
                            repaired++;
                        }
                    }
                });
                if (repaired > 0) {
                    addLog(`⚒️ Мастерская гнома: восстановлено +1 использование у ${repaired} амулетов!`, 'win');
                    animateInventoryItem('dwarfs_workshop');
                }
            }
        }
    }

    // --- ФУНКЦИЯ ДЛЯ ПОЛУЧЕНИЯ АКТУАЛЬНЫХ ЗНАЧЕНИЙ СИМВОЛОВ ---
    function getSymbolCurrentValues() {
        // Создаём копию символов с базовыми значениями
        let currentSymbols = JSON.parse(JSON.stringify(SYMBOLS));
        
        // Применяем увеличение базовой ценности от Лупы
        if (hasItem('magnifying_glass')) {
            const effect = ALL_ITEMS.find(i => i.id === 'magnifying_glass').effect.base_value_increase;
            currentSymbols.forEach(s => {
                if (effect.symbols.includes(s.id)) {
                    s.value += effect.amount;
                }
            });
        }
        
        // --- ДОБАВЛЕНО: Применяем накопленный бонус от усилителей вишни ---
        if (window.state.cherryBaseValue) {
            currentSymbols.forEach(s => {
                if (s.id === 'cherry') {
                    s.value += window.state.cherryBaseValue;
                }
            });
        }
        
        // Применяем множители от предметов
        const symbolMultipliers = {};
        state.inventory.forEach(item => {
            if (item.effect?.symbol_value_multiplier) {
                const eff = item.effect.symbol_value_multiplier;
                symbolMultipliers[eff.symbol] = (symbolMultipliers[eff.symbol] || 1) * eff.multiplier;
            }
        });
        
        // Обработка множителя для всех символов
        // Суммируем обычный бонус и бонус за цикл
        const baseAllSymbolsMultiplierBoost = getItemEffectValue('all_symbols_multiplier_boost', 0, 'sum');
        const perRunAllSymbolsMultiplierBoost = state.inventory.reduce((acc, item) => {
            if (item.effect?.per_run_bonus?.all_symbols_multiplier_boost) {
                return acc + item.effect.per_run_bonus.all_symbols_multiplier_boost * state.run;
            }
            return acc;
        }, 0);
        const allSymbolsMultiplierBoostCurrent = baseAllSymbolsMultiplierBoost + perRunAllSymbolsMultiplierBoost;
        if (allSymbolsMultiplierBoostCurrent > 0) {
            // Применяем бонус ко всем символам
            ['lemon', 'cherry', 'clover', 'bell', 'diamond', 'coins', 'seven'].forEach(symbolId => {
                symbolMultipliers[symbolId] = (symbolMultipliers[symbolId] || 1) + allSymbolsMultiplierBoostCurrent;
            });
        }
        
        // Применяем множители к значениям
        currentSymbols.forEach(symbol => {
            if (symbolMultipliers[symbol.id]) {
                symbol.value = Math.floor(symbol.value * symbolMultipliers[symbol.id]);
            }
        });
        
        return currentSymbols;
    }

    // Экспортируем функцию для использования в статистике
    window.getSymbolCurrentValues = getSymbolCurrentValues;

    // --- [NEW] Функция создания всплывающей подсказки ---
    function createItemTooltip(item, currentCost, oldCost) {
        const tooltip = document.createElement('div');
        tooltip.className = 'item-tooltip';
        
        const thumbnailValue = item.thumbnail || '?';
        let thumbnailHTML = '';
        if (thumbnailValue.endsWith('.png') || thumbnailValue.endsWith('.jpg') || thumbnailValue.endsWith('.gif')) {
            thumbnailHTML = `<img src="img/${thumbnailValue}" alt="${item.name}" style="width:100%; height:100%; object-fit:cover;">`;
        } else {
            thumbnailHTML = thumbnailValue;
        }
        
        let costHTML = '';
        if (item.cost) {
            costHTML = `${currentCost}🎟️`;
            if (oldCost && currentCost < oldCost) {
                costHTML += ` <s style="opacity:0.6">${oldCost}🎟️`;
            }
        }
        
        let modifierHTML = '';
        if (item.modifier) {
            const isPenalty = item.isPenalty || false;
            const modifierIcon = isPenalty ? '💀' : (item.modifier.divine ? '🔱' : '✨');
            const modifierClass = isPenalty ? 'item-tooltip-modifier penalty' : 'item-tooltip-modifier';
            
            modifierHTML = `
                <div class="${modifierClass}">
                    <div class="item-tooltip-modifier-title">${modifierIcon} ${item.modifier.name}</div>
                    <div class="item-tooltip-modifier-desc">${item.modifier.desc}</div>
                </div>
            `;
        }
        
        let usesHTML = '';
        let showUses = false;
        let uses = null;
        let maxUses = null;
        if (typeof item.uses !== 'undefined' && (item.effect?.max_uses || item.effect?.luck_chance?.max_uses)) {
            showUses = true;
            uses = item.uses;
            maxUses = item.effect.max_uses || item.effect.luck_chance?.max_uses;
        } else if (item.effect?.luck_chance?.breakable) {
            showUses = true;
            uses = item.uses !== undefined ? item.uses : (item.effect.luck_chance.max_uses || 10);
            maxUses = item.effect.luck_chance.max_uses || 10;
        } else if (item.effect?.breakable && item.effect?.max_uses) {
            showUses = true;
            uses = item.uses !== undefined ? item.uses : item.effect.max_uses;
            maxUses = item.effect.max_uses;
        }
        if (showUses && maxUses) {
            usesHTML = `<div class="item-tooltip-uses">Использований: ${uses}/${maxUses}</div>`;
        }
        
        let mimicHTML = '';
        if (item.id === 'mimic_chest') {
            let mimicInfoText = '';
            if (item.effect?.mimic?.target) {
                const target = ALL_ITEMS.find(i => i.id === item.effect.mimic.target);
                mimicInfoText = target ? `Копирует: <b>${target.name}</b>` : `Цель не найдена`;
            } else {
                mimicInfoText = `<i>Нет цели для копирования</i>`;
            }
            mimicHTML = `<div class="item-tooltip-mimic">${mimicInfoText}</div>`;
        }
        
        // Определяем класс для названия
        let titleClass = 'item-tooltip-title';
        if (item.modifier) {
            if (item.modifier.divine) {
                titleClass += ' divine-modifier';
            } else {
                titleClass += ' modified';
                if (item.isPenalty) titleClass += ' modifier-bad';
            }
        }
        
        let piggyHTML = '';
        if(item.id === 'scrap_metal') {
            piggyHTML = `<div style='color:#ffab40; font-size:13px; margin-top:2px; font-weight:bold;'>Всего: ${formatNumberWithComma(state.piggyBank)}💲</div>`;
        }
        
        tooltip.innerHTML = `
            <div class="item-tooltip-header">
                <div class="item-tooltip-thumbnail">${thumbnailHTML}</div>
                <div class="${titleClass}">${item.name}</div>
                ${costHTML ? `<div class="item-tooltip-cost">${costHTML}</div>` : ''}
            </div>
            <div class="item-tooltip-desc">${item.desc}</div>
            ${modifierHTML}
            ${usesHTML}
            ${mimicHTML}
            ${piggyHTML}
        `;
        
        return tooltip;
    }
    
    // --- [NEW] Функция позиционирования tooltip ---
    function positionTooltip(tooltip, event) {
        if (!tooltip || !tooltip.parentNode) return;
        
        // Получаем координаты с учетом скролла страницы
        const mouseX = event.clientX + window.scrollX;
        const mouseY = event.clientY + window.scrollY;
        
        // Проверяем, что тултип видим и имеет размеры
        const rect = tooltip.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) {
            // Если тултип еще не отрендерен, используем примерные размеры
            tooltip.style.visibility = 'hidden';
            tooltip.style.display = 'block';
            const tempRect = tooltip.getBoundingClientRect();
            tooltip.style.visibility = '';
            tooltip.style.display = '';
            
            if (tempRect.width === 0 || tempRect.height === 0) {
                // Если все еще нет размеров, используем фиксированные значения
                const vw = window.innerWidth;
                const vh = window.innerHeight;
                
                let tooltipLeft = mouseX + 15;
                let tooltipTop = mouseY - 10;
                
                // Проверяем, не выходит ли tooltip за правый край экрана
                if (tooltipLeft + 320 > vw - 20) {
                    tooltipLeft = mouseX - 320 - 15;
                }
                
                // Проверяем, не выходит ли tooltip за левый край экрана
                if (tooltipLeft < 20) {
                    tooltipLeft = 20;
                }
                
                // Проверяем, не выходит ли tooltip за нижний край экрана
                if (tooltipTop + 200 > vh - 20) {
                    tooltipTop = mouseY - 200 - 10;
                }
                
                // Проверяем, не выходит ли tooltip за верхний край экрана
                if (tooltipTop < 20) {
                    tooltipTop = 20;
                }
                
                tooltip.style.left = tooltipLeft + 'px';
                tooltip.style.top = tooltipTop + 'px';
                return;
            }
        }
        
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        let left = mouseX + 15;
        let top = mouseY - 10;
        
        // Проверяем, не выходит ли tooltip за правый край экрана
        if (left + rect.width > viewportWidth - 20) {
            left = mouseX - rect.width - 15;
        }
        
        // Проверяем, не выходит ли tooltip за левый край экрана
        if (left < 20) {
            left = 20;
        }
        
        // Проверяем, не выходит ли tooltip за нижний край экрана
        if (top + rect.height > viewportHeight - 20) {
            top = mouseY - rect.height - 10;
        }
        
        // Проверяем, не выходит ли tooltip за верхний край экрана
        if (top < 20) {
            top = 20;
        }
        
        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
    }

    // --- [NEW] Глобальная функция для принудительного скрытия всех тултипов ---
    function hideAllTooltips() {
        const tooltips = document.querySelectorAll('.item-tooltip');
        tooltips.forEach(tooltip => {
            if (tooltip.parentNode) {
                tooltip.classList.remove('show');
                setTimeout(() => {
                    if (tooltip && tooltip.parentNode) {
                        tooltip.parentNode.removeChild(tooltip);
                    }
                }, 200);
            }
        });
    }

    // Экспортируем функцию для использования в консоли браузера
    window.hideAllTooltips = hideAllTooltips;

    // --- [NEW] Глобальный обработчик для скрытия тултипов при клике вне их области ---
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.item-tooltip') && !e.target.closest('.item')) {
            hideAllTooltips();
        }
    });

    // --- [NEW] Обработчик для скрытия тултипов при нажатии Escape ---
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hideAllTooltips();
        }
    });

    // --- [NEW] Глобальный обработчик движения мыши для обновления позиции тултипов ---
    document.addEventListener('mousemove', (e) => {
        const tooltips = document.querySelectorAll('.item-tooltip.show');
        tooltips.forEach(tooltip => {
            if (tooltip.parentNode) {
                positionTooltip(tooltip, e);
            }
        });
    });
});
// === ДИСКЛЕЙМЕР (ОБНОВЛЕННАЯ ВЕРСИЯ) ===
document.addEventListener('DOMContentLoaded', function () {
    const disclaimerModal = document.getElementById('disclaimer-modal');
    const disclaimerAgree = document.getElementById('disclaimer-agree');
    const disclaimerRisks = document.getElementById('disclaimer-risks');
    const disclaimerContinue = document.getElementById('disclaimer-continue');
    const showLicenseLink = document.getElementById('show-license-link');

    // --- НОВОЕ: Проверка, был ли уже принят дисклеймер ---
    if (localStorage.getItem('disclaimerAccepted') === 'true') {
        if (disclaimerModal) disclaimerModal.style.display = 'none';
        return;
    } else {
        if (disclaimerModal) disclaimerModal.style.display = 'flex';
    }

    // Текст Лицензионного соглашения (EULA)
    const licenseText = `
        <h2 style='color:#ff6b35; text-align:center;'>Лицензионное соглашение (EULA)</h2>
        <p><strong>Дата последнего обновления: 14 июля 2025 г.</strong></p>
        <p>Настоящее Лицензионное соглашение (далее – «Соглашение») является юридическим документом, заключаемым между вами (далее – «Пользователь») и создателем игры «Цикл Долга» (далее – «Правообладатель»).</p>
        
        <h3 style='color:#ff9a3c; margin-top:20px;'>1. Предмет Соглашения</h3>
        <p>1.1. Правообладатель предоставляет Пользователю неисключительное, непередаваемое право на использование игры (далее – «Продукт») исключительно в личных, некоммерческих, развлекательных целях.</p>
        <p>1.2. Продукт является симуляцией и не представляет собой азартную игру, казино, лотерею или иную деятельность, основанную на риске и предполагающую получение реального материального выигрыша.</p>

        <h3 style='color:#ff9a3c; margin-top:20px;'>2. Возрастные ограничения и ответственность</h3>
        <p>2.1. Используя Продукт, вы подтверждаете, что вам исполнилось 18 лет, и вы обладаете полной дееспособностью для заключения данного Соглашения.</p>
        <p>2.2. Пользователь несет полную и исключительную ответственность за все действия, совершаемые в Продукте, а также за любые возможные последствия, возникшие в результате его использования. Правообладатель не несет ответственности за потраченное Пользователем время.</p>
        <p>2.3. Правообладатель не дает никаких гарантий, явных или подразумеваемых, относительно точности, надежности или полноты игрового процесса. Продукт предоставляется по принципу "КАК ЕСТЬ" ("AS IS").</p>

        <h3 style='color:#ff9a3c; margin-top:20px;'>3. Игровые ценности</h3>
        <p>3.1. Вся внутриигровая валюта, предметы, бонусы и прочие элементы (далее – «Виртуальные ценности») не имеют реальной денежной стоимости. Они являются частью игрового процесса и не могут быть обменены на реальные деньги, товары или услуги.</p>
        <p>3.2. Любые транзакции с Виртуальными ценностями являются окончательными и не подлежат возврату или компенсации.</p>
        <p>3.3. Пользователь признает, что любые накопленные Виртуальные ценности могут быть изменены, удалены или утеряны в результате сбоев, обновлений или по любой другой причине, и Правообладатель не несет ответственности за такие потери.</p>

        <h3 style='color:#ff9a3c; margin-top:20px;'>4. Интеллектуальная собственность</h3>
        <p>4.1. Все права на Продукт, включая код, графику, звуковое сопровождение и тексты, принадлежат Правообладателю. Любое несанкционированное копирование, распространение или модификация Продукта запрещены.</p>
        
        <h3 style='color:#ff9a3c; margin-top:20px;'>5. Ограничение ответственности</h3>
        <p>5.1. Ни при каких обстоятельствах Правообладатель не несет ответственности за прямой, косвенный, случайный или последующий ущерб (включая, но не ограничиваясь, упущенную выгоду, потерю данных или моральный вред), возникший в результате использования или невозможности использования Продукта.</p>

        <h3 style='color:#ff9a3c; margin-top:20px;'>6. Заключительные положения</h3>
        <p>6.1. Продолжая использовать Продукт, вы подтверждаете, что полностью прочитали, поняли и безоговорочно согласны с условиями настоящего Соглашения.</p>
        <p>6.2. Если вы не согласны с каким-либо из условий, вы должны немедленно прекратить использование Продукта.</p>

        <button id='close-license-modal' style='margin-top:24px;background:#ff6b35;color:#fff;border:none;border-radius:6px;padding:10px 24px;font-size:1.1em;font-weight:bold;cursor:pointer;width:100%;'>Я прочел и согласен</button>
    `;

    // Создаём модальное окно для лицензионного соглашения
    let licenseModal = document.createElement('div');
    licenseModal.id = 'license-modal';
    licenseModal.style = 'position:fixed;z-index:10000;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.93);display:none;align-items:center;justify-content:center;overflow-y:auto;padding:20px 0;';
    licenseModal.innerHTML = `
        <div style='background:#1f1f1f;color:#e0e0e0;max-width:800px;width:95vw;max-height:90vh;padding:32px 35px;border-radius:12px;box-shadow:0 4px 32px #000a; margin: 40px auto; overflow-y:auto; display:flex; flex-direction:column;'>
            ${licenseText}
        </div>
    `;
    document.body.appendChild(licenseModal);

    // Функция для проверки состояния чекбоксов
    function checkDisclaimerState() {
        const isAgreed = disclaimerAgree.checked && disclaimerRisks.checked;
        disclaimerContinue.disabled = !isAgreed;
        disclaimerContinue.style.opacity = isAgreed ? '1' : '0.6';
        disclaimerContinue.style.cursor = isAgreed ? 'pointer' : 'not-allowed';
    }

    // Обработчики событий
    showLicenseLink.addEventListener('click', function (e) {
        e.preventDefault();
        licenseModal.style.display = 'flex';
    });

    licenseModal.addEventListener('click', function (e) {
        if (e.target.id === 'license-modal' || e.target.id === 'close-license-modal') {
            licenseModal.style.display = 'none';
        }
    });

    document.getElementById('close-license-modal').addEventListener('click', function () {
        licenseModal.style.display = 'none';
    });

    disclaimerAgree.addEventListener('change', checkDisclaimerState);
    disclaimerRisks.addEventListener('change', checkDisclaimerState);

    disclaimerContinue.addEventListener('click', function () {
        if (!disclaimerContinue.disabled) {
            disclaimerModal.style.display = 'none';
            // --- НОВОЕ: Сохраняем флаг принятия дисклеймера ---
            localStorage.setItem('disclaimerAccepted', 'true');
        }
    });
});