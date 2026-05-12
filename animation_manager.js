/**
 * ============================================
 * ANIMATION MANAGER SYSTEM v1.1
 * ============================================
 * Центральная система управления анимациями
 * Предотвращает конфликты, управляет очередями и синхронизирует эффекты
 * 
 * Основные исправления:
 * 1. Очистка всех анимаций перед новым спином
 * 2. Синхронизация SVG линий и подсветки ячеек
 * 3. Предотвращение наложения эффектов
 * 4. Правильная последовательность анимаций
 */

// === ГЛОБАЛЬНОЕ СОСТОЯНИЕ АНИМАЦИЙ ===
window.AnimationManager = {
    queue: [],
    isAnimating: false,
    currentAnimations: new Set(),
    animationTimeouts: [],
    
    // Очистка всех таймаутов
    clearTimeouts() {
        this.animationTimeouts.forEach(timeout => clearTimeout(timeout));
        this.animationTimeouts = [];
    },
    
    // Безопасное создание таймаута
    setTimeout(callback, delay) {
        const timeoutId = setTimeout(() => {
            callback();
            const idx = this.animationTimeouts.indexOf(timeoutId);
            if (idx > -1) this.animationTimeouts.splice(idx, 1);
        }, delay);
        this.animationTimeouts.push(timeoutId);
        return timeoutId;
    },
    
    // Очистка всех активных анимаций
    clearAllAnimations() {
        // Очищаем все таймауты
        this.clearTimeouts();
        
        // Очищаем SVG
        const svg = document.getElementById('payline-overlay');
        if (svg) svg.innerHTML = '';
        
        // Очищаем все классы с ячеек
        const cells = document.querySelectorAll('.slot-cell');
        cells.forEach(cell => {
            cell.classList.remove(
                'highlight', 'highlight-big', 'highlight-huge',
                'combo-1', 'combo-2', 'combo-3', 'combo-4', 'combo-5',
                'sequential', 'sequential-highlight', 'mirror-highlight',
                'line-highlight', 'line-highlight-sequential', 'jackpot',
                'pirate-1', 'pirate-2', 'pirate-3'
            );
            
            const symbol = cell.querySelector('.symbol');
            if (symbol) {
                symbol.classList.remove('winning', 'jackpot', 'line-winning');
                symbol.style.animation = '';
                symbol.style.animationDelay = '';
            }
        });
        
        // Удаляем плавающие тексты
        document.querySelectorAll('.floating-win-text').forEach(el => el.remove());
        
        // Удаляем частицы
        document.querySelectorAll('.particle, .flying-coin, .confetti, .line-particle').forEach(el => el.remove());
        
        // Удаляем комбо текст
        document.querySelectorAll('.combo-text').forEach(el => el.remove());
        
        // Сбрасываем флаги
        this.isAnimating = false;
        this.currentAnimations.clear();
        
        // Сбрасываем классы с игрового автомата
        const slotMachine = document.getElementById('slot-machine');
        if (slotMachine) {
            slotMachine.classList.remove('combo-active', 'jackpot');
        }
    },
    
    // Добавление анимации в очередь
    addToQueue(animationFn) {
        this.queue.push(animationFn);
        this.processQueue();
    },
    
    // Обработка очереди
    async processQueue() {
        if (this.isAnimating || this.queue.length === 0) return;
        
        this.isAnimating = true;
        
        while (this.queue.length > 0) {
            const animation = this.queue.shift();
            try {
                await animation();
            } catch (error) {
                console.error('Animation error:', error);
            }
        }
        
        this.isAnimating = false;
    }
};

// === УСОВЕРШЕНСТВОВАННАЯ ФУНКЦИЯ highlightWinningCells ===
function highlightWinningCellsOptimized(positions, winAmount, isCombo = false, winningLines = []) {
    // Проверка доступности window.ui
    if (!window.ui || !window.ui.slotMachine) {
        console.warn('[Animation Manager] window.ui не доступен, используем fallback');
        return;
    }
    
    const cells = window.ui.slotMachine.querySelectorAll('.slot-cell');
    const svg = document.getElementById('payline-overlay');

    // Сначала очищаем все предыдущие анимации
    AnimationManager.clearAllAnimations();

    let highlightClass = 'highlight';
    if (winAmount > 50) highlightClass = 'highlight-huge';
    else if (winAmount > 20) highlightClass = 'highlight-big';

    const isJackpot = positions.length === 15;

    let comboLevel = 0;
    if (isCombo) {
        if (winningLines.length >= 9) comboLevel = 5;
        else if (winningLines.length >= 7) comboLevel = 4;
        else if (winningLines.length >= 5) comboLevel = 3;
        else if (winningLines.length >= 3) comboLevel = 2;
        else comboLevel = 1;
    }

    // Проверяем зеркальные отражения
    const hasMirrorDimension = typeof hasItem === 'function' && hasItem('mirror_dimension');
    const mirrorPositions = [];
    if (hasMirrorDimension) {
        for (let i = 0; i < positions.length; i++) {
            const pos = positions[i];
            let mirrorPos;
            if (pos < 5) mirrorPos = 10 + (pos % 5);
            else if (pos < 10) mirrorPos = 5 + (4 - (pos % 5));
            else mirrorPos = pos % 5;

            if (positions.includes(mirrorPos) && mirrorPos !== pos) {
                mirrorPositions.push(pos, mirrorPos);
            }
        }
    }

    return new Promise((resolve) => {
        if (comboLevel > 0) {
            // === КОМБО АНИМАЦИЯ ===
            window.ui.slotMachine.classList.add('combo-active');
            if (isJackpot) window.ui.slotMachine.classList.add('jackpot');

            const sequenceTime = positions.length * 150;
            const holdTime = 2500;

            // Последовательная подсветка ячеек
            positions.forEach((pos, index) => {
                AnimationManager.setTimeout(() => {
                    const cell = cells[pos];
                    if (!cell) return;

                    cell.classList.add('sequential-highlight');
                    if (isJackpot) cell.classList.add('jackpot');
                    if (mirrorPositions.includes(pos)) cell.classList.add('mirror-highlight');

                    // Частицы для больших комбо
                    if (comboLevel >= 3) {
                        for (let i = 0; i < 3; i++) {
                            const particle = document.createElement('div');
                            particle.className = 'particle' + (isJackpot ? ' jackpot' : '');
                            cell.appendChild(particle);
                            AnimationManager.setTimeout(() => particle.remove(), 500);
                        }
                    }

                    // Летающие монеты
                    if (comboLevel >= 4) {
                        const coinCount = isJackpot ? (comboLevel === 5 ? 12 : 8) : (comboLevel === 5 ? 8 : 5);
                        const cellRect = cell.getBoundingClientRect();
                        const cellCenterX = cellRect.left + cellRect.width / 2;
                        const cellCenterY = cellRect.top + cellRect.height / 2;

                        for (let i = 0; i < coinCount; i++) {
                            AnimationManager.setTimeout(() => {
                                const coin = document.createElement('div');
                                coin.className = 'flying-coin' + (isJackpot ? ' jackpot' : '');
                                coin.textContent = '💲';
                                coin.style.cssText = `
                                    position: fixed;
                                    left: ${cellCenterX - 16}px;
                                    top: ${cellCenterY - 16}px;
                                    width: 32px;
                                    height: 32px;
                                    font-size: 2em;
                                    pointer-events: none;
                                    z-index: 9999;
                                `;
                                document.body.appendChild(coin);

                                const angle = (-70 + Math.random() * 140) * (Math.PI / 180);
                                const radius = 80 + Math.random() * 40;
                                const dx = Math.sin(angle) * radius;
                                const dy = -Math.cos(angle) * radius;

                                coin.animate([
                                    { transform: 'translate(0,0) scale(1)', opacity: 1 },
                                    { transform: `translate(${dx}px,${dy}px) scale(1.1)`, opacity: 1 }
                                ], { duration: 350, easing: 'cubic-bezier(0.5,0,0.7,1)' });

                                AnimationManager.setTimeout(() => {
                                    coin.animate([
                                        { transform: `translate(${dx}px,${dy}px) scale(1.1)`, opacity: 1 },
                                        { transform: `translate(${dx}px,${dy+180+Math.random()*40}px) scale(0.9)`, opacity: 0 }
                                    ], { duration: 600, easing: 'cubic-bezier(0.3,0.7,0.7,1)' });
                                    AnimationManager.setTimeout(() => coin.remove(), 600);
                                }, 350);
                            }, i * 100);
                        }
                    }

                    // Финальная подсветка
                    AnimationManager.setTimeout(() => {
                        cell.classList.remove('sequential-highlight');
                        cell.classList.add(`combo-${comboLevel}`, 'sequential');
                        if (isJackpot) cell.classList.add('jackpot');

                        const symbol = cell.querySelector('.symbol');
                        if (symbol) {
                            symbol.classList.add('winning');
                            if (isJackpot) symbol.classList.add('jackpot');
                        }
                    }, 500);
                }, index * 150);
            });

            // Текст комбо
            AnimationManager.setTimeout(() => {
                const comboText = document.createElement('div');
                comboText.className = 'combo-text';
                comboText.textContent = `КОМБО x${winningLines.length}!`;
                document.body.appendChild(comboText);

                AnimationManager.setTimeout(() => comboText.classList.add('show'), 100);
                AnimationManager.setTimeout(() => {
                    comboText.classList.remove('show');
                    comboText.classList.add('fade-out');
                    AnimationManager.setTimeout(() => comboText.remove(), 500);
                }, 1500);
            }, sequenceTime);

            // Очистка после комбо
            AnimationManager.setTimeout(() => {
                cells.forEach(cell => {
                    cell.classList.remove(
                        'highlight', 'highlight-big', 'highlight-huge',
                        'combo-1', 'combo-2', 'combo-3', 'combo-4', 'combo-5', 'sequential',
                        'sequential-highlight', 'mirror-highlight'
                    );
                    const symbol = cell.querySelector('.symbol');
                    if (symbol) symbol.classList.remove('winning');
                });
                ui.slotMachine.classList.remove('combo-active');
                resolve();
            }, sequenceTime + holdTime);

        } else {
            // === ОБЫЧНАЯ АНИМАЦИЯ (без комбо) ===
            positions.forEach((pos, index) => {
                AnimationManager.setTimeout(() => {
                    const cell = cells[pos];
                    if (!cell) return;

                    cell.classList.add(highlightClass);
                    if (mirrorPositions.includes(pos)) {
                        cell.classList.add('mirror-highlight');
                    }

                    // Анимация частиц для первой ячейки
                    if (index === 0 && winAmount > 0 && typeof flyResource === 'function') {
                        flyResource(cell, '#stat-coins', 'coin', 1);
                    }
                }, index * 150);
            });

            // Очистка после обычной анимации
            AnimationManager.setTimeout(() => {
                cells.forEach(cell => {
                    cell.classList.remove('highlight', 'highlight-big', 'highlight-huge', 'mirror-highlight');
                });
                resolve();
            }, 2000);
        }
    });
}

// === УСОВЕРШЕНСТВОВАННАЯ ФУНКЦИЯ animateWinningLinesSequentially ===
function animateWinningLinesSequentiallyOptimized(winningLinesInfo, onComplete = null) {
    // Проверка доступности window.ui
    if (!window.ui || !window.ui.slotMachine) {
        console.warn('[Animation Manager] window.ui не доступен, используем fallback');
        if (onComplete) onComplete();
        return;
    }
    
    if (!winningLinesInfo || winningLinesInfo.length === 0) {
        if (onComplete) onComplete();
        return;
    }

    const svg = document.getElementById('payline-overlay');
    if (svg) svg.innerHTML = '';

    const cells = window.ui.slotMachine.querySelectorAll('.slot-cell');
    let currentLineIndex = 0;

    // Очищаем все предыдущие анимации перед запуском
    AnimationManager.clearAllAnimations();

    return new Promise((resolve) => {
        function animateNextLine() {
            if (currentLineIndex >= winningLinesInfo.length) {
                // Финальная часть
                if (svg) svg.innerHTML = '';

                if (onComplete) {
                    AnimationManager.setTimeout(() => {
                        onComplete();
                        resolve();
                    }, 150);
                } else {
                    resolve();
                }

                // Автоматическая очистка через 3 секунды
                AnimationManager.setTimeout(() => {
                    if (!window.state.isSpinning) {
                        cells.forEach(c => c.classList.remove(
                            'line-highlight-sequential', 'line-highlight',
                            'mirror-highlight', 'jackpot', 'combo-5'
                        ));
                        const winningSymbols = document.querySelectorAll('.symbol.line-winning, .symbol.winning');
                        winningSymbols.forEach(s => s.classList.remove('line-winning', 'winning'));
                        if (svg) svg.innerHTML = '';
                    }
                }, 3000);

                return;
            }

            const lineInfo = winningLinesInfo[currentLineIndex];
            const positions = lineInfo.positions;

            // 1. Очистка перед новой линией
            cells.forEach(c => c.classList.remove('line-highlight-sequential', 'line-highlight'));
            if (svg) svg.innerHTML = '';

            // 2. Рисуем линию
            drawPaylineSVG(positions, 'var(--money-color)');

            // 3. Показываем текст выигрыша
            showFloatingText(`+${formatNumberWithComma(lineInfo.win)}💲`, positions);

            // 4. Подсветка ячеек
            positions.forEach(pos => {
                const cell = cells[pos];
                if (!cell) return;

                cell.classList.add('line-highlight-sequential');

                const symbol = cell.querySelector('.symbol');
                if (symbol) {
                    // Перезапуск анимации
                    symbol.style.animation = 'none';
                    symbol.offsetHeight; // trigger reflow
                    symbol.style.animation = 'lineSymbolWin 0.4s ease-in-out';
                    symbol.classList.add('line-winning');
                }
            });

            // Ускоренный перебор линий
            const delay = Math.max(300, 750 - (currentLineIndex * 50));

            AnimationManager.setTimeout(() => {
                currentLineIndex++;
                animateNextLine();
            }, delay);
        }

        animateNextLine();
    });
}

// === ФУНКЦИЯ ДЛЯ ЗАПУСКА АНИМАЦИИ СПИНА ===
async function runOptimizedSpinAnimation() {
    // Проверка доступности window.ui
    if (!window.ui || !window.ui.slotMachine) {
        console.warn('[Animation Manager] window.ui не доступен, используем стандартную анимацию');
        return;
    }
    
    const cells = window.ui.slotMachine.querySelectorAll('.slot-cell');
    const reels = window.ui.slotMachine.querySelectorAll('.reel');

    // Очищаем все предыдущие анимации
    AnimationManager.clearAllAnimations();

    return new Promise((resolve) => {
        // Анимация вращения
        reels.forEach((reel, index) => {
            const duration = 1000 + (index * 100);
            reel.style.transition = `transform ${duration}ms cubic-bezier(0.25, 0.1, 0.25, 1)`;
            reel.style.transform = 'translateY(-95%)';
        });

        // После завершения анимации
        const maxDuration = 1000 + (reels.length - 1) * 100;
        AnimationManager.setTimeout(() => {
            // Сброс позиции и установка финального символа
            reels.forEach((reel, index) => {
                reel.style.transition = 'none';
                reel.style.transform = 'translateY(0)';
            });

            // Небольшая задержка перед разрешением
            AnimationManager.setTimeout(resolve, 50);
        }, maxDuration);
    });
}

// === ЭКСПОРТ ФУНКЦИЙ ===
window.AnimationManager = window.AnimationManager || {};
window.highlightWinningCellsOptimized = highlightWinningCellsOptimized;
window.animateWinningLinesSequentiallyOptimized = animateWinningLinesSequentiallyOptimized;
window.runOptimizedSpinAnimation = runOptimizedSpinAnimation;

// Проверка доступности вспомогательных функций
if (typeof drawPaylineSVG !== 'function' || typeof showFloatingText !== 'function') {
    console.warn('[Animation Manager] Предупреждение: некоторые вспомогательные функции не найдены. Убедитесь, что animation_manager.js загружен после skript.js');
}

console.log('[Animation Manager] Система инициализирована');
console.log('[Animation Manager] drawPaylineSVG:', typeof drawPaylineSVG === 'function' ? 'OK' : 'NOT FOUND');
console.log('[Animation Manager] showFloatingText:', typeof showFloatingText === 'function' ? 'OK' : 'NOT FOUND');
console.log('[Animation Manager] formatNumberWithComma:', typeof formatNumberWithComma === 'function' ? 'OK' : 'NOT FOUND');
console.log('[Animation Manager] hasItem:', typeof hasItem === 'function' ? 'OK' : 'NOT FOUND');
