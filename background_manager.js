/**
 * Модуль управления фоном игры в зависимости от цикла
 * Использует CSS-классы и градиенты для создания визуальных эффектов
 */

(function() {
    'use strict';

    const CYCLE_CLASSES = {
        1: 'cycle-casino',      // Обычное казино
        2: 'cycle-casino',      // По умолчанию казино
        3: 'cycle-basement',    // Темный подвал
        default: 'cycle-casino'
    };

    let currentCycle = 1;
    let bodyEl = null;
    let gameContainerEl = null;

    /**
     * Инициализация модуля
     */
    function init() {
        bodyEl = document.body;
        gameContainerEl = document.querySelector('.game-container');
        
        if (!bodyEl) {
            console.warn('[BackgroundManager] body не найден');
            return;
        }

        // Добавляем стили
        ensureStyles();

        // Получаем текущий цикл из состояния игры
        updateCycleFromState();

        // Слушаем изменения состояния игры
        observeStateChanges();
    }

    /**
     * Добавление CSS-стилей для разных циклов
     */
    function ensureStyles() {
        if (document.getElementById('background-manager-styles')) return;

        const style = document.createElement('style');
        style.id = 'background-manager-styles';
        style.textContent = `
            /* === ЦИКЛ 1: ОБЫЧНОЕ КАЗИНО === */
            body.cycle-casino {
                background-color: #1a0f0a !important;
                background-image: linear-gradient(135deg, 
                    #1a0f0a 0%,
                    #2d1810 25%,
                    #1a0f0a 50%,
                    #2d1810 75%,
                    #1a0f0a 100%
                ) !important;
                background-size: 400% 400% !important;
                animation: casinoGradientShift 15s ease infinite;
                position: relative;
                overflow-x: hidden;
            }

            body.cycle-casino::before {
                content: '';
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-image: 
                    radial-gradient(circle at 20% 30%, rgba(255, 215, 0, 0.08) 0%, transparent 50%),
                    radial-gradient(circle at 80% 70%, rgba(255, 140, 0, 0.06) 0%, transparent 50%),
                    radial-gradient(circle at 50% 50%, rgba(184, 134, 11, 0.04) 0%, transparent 60%);
                pointer-events: none;
                z-index: 0;
            }

            body.cycle-casino::after {
                content: '';
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-image: 
                    repeating-linear-gradient(
                        0deg,
                        transparent,
                        transparent 2px,
                        rgba(139, 69, 19, 0.03) 2px,
                        rgba(139, 69, 19, 0.03) 4px
                    ),
                    repeating-linear-gradient(
                        90deg,
                        transparent,
                        transparent 2px,
                        rgba(139, 69, 19, 0.03) 2px,
                        rgba(139, 69, 19, 0.03) 4px
                    );
                pointer-events: none;
                z-index: 0;
            }

            @keyframes casinoGradientShift {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }

            /* === ЦИКЛ 3: ТЕМНЫЙ ПОДВАЛ === */
            body.cycle-basement {
                background-color: #0a0a0a !important;
                background-image: linear-gradient(180deg,
                    #0a0a0a 0%,
                    #0f0f0f 20%,
                    #050505 40%,
                    #0a0a0a 60%,
                    #080808 80%,
                    #0a0a0a 100%
                ) !important;
                background-size: 100% 300% !important;
                animation: basementBreathing 20s ease-in-out infinite;
                position: relative;
                overflow-x: hidden;
            }

            body.cycle-basement::before {
                content: '';
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-image: 
                    radial-gradient(ellipse at 10% 20%, rgba(20, 20, 30, 0.4) 0%, transparent 40%),
                    radial-gradient(ellipse at 90% 80%, rgba(10, 10, 20, 0.5) 0%, transparent 50%),
                    radial-gradient(ellipse at 50% 50%, rgba(5, 5, 15, 0.3) 0%, transparent 60%);
                pointer-events: none;
                z-index: 0;
                animation: basementShadows 25s ease-in-out infinite;
            }

            body.cycle-basement::after {
                content: '';
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-image: 
                    repeating-linear-gradient(
                        0deg,
                        transparent,
                        transparent 3px,
                        rgba(30, 30, 40, 0.15) 3px,
                        rgba(30, 30, 40, 0.15) 6px
                    ),
                    repeating-linear-gradient(
                        90deg,
                        transparent,
                        transparent 3px,
                        rgba(30, 30, 40, 0.15) 3px,
                        rgba(30, 30, 40, 0.15) 6px
                    );
                pointer-events: none;
                z-index: 0;
                opacity: 0.6;
            }

            @keyframes basementBreathing {
                0%, 100% { background-position: 0% 0%; }
                50% { background-position: 0% 100%; }
            }

            @keyframes basementShadows {
                0%, 100% { 
                    opacity: 0.8;
                    transform: scale(1);
                }
                50% { 
                    opacity: 1;
                    transform: scale(1.1);
                }
            }

            /* Дополнительные эффекты для подвала */
            body.cycle-basement .game-container {
                position: relative;
                z-index: 1;
            }

            body.cycle-basement .game-container::before {
                content: '';
                position: absolute;
                top: -20px;
                left: -20px;
                right: -20px;
                bottom: -20px;
                background: radial-gradient(
                    ellipse at center,
                    rgba(15, 15, 25, 0.3) 0%,
                    transparent 70%
                );
                pointer-events: none;
                z-index: -1;
                animation: basementGlow 15s ease-in-out infinite;
            }

            @keyframes basementGlow {
                0%, 100% { opacity: 0.3; }
                50% { opacity: 0.5; }
            }

            /* Плавный переход между циклами */
            body {
                transition: background 1.5s ease-in-out;
            }

            body::before,
            body::after {
                transition: opacity 1.5s ease-in-out, transform 1.5s ease-in-out;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Получение текущего цикла из состояния игры
     */
    function updateCycleFromState() {
        if (window.state && window.state.run) {
            const newCycle = window.state.run;
            if (newCycle !== currentCycle) {
                currentCycle = newCycle;
                applyCycleClass(newCycle);
            }
        } else {
            // Если состояние еще не загружено, применяем класс по умолчанию
            applyCycleClass(1);
        }
    }

    /**
     * Применение CSS-класса для указанного цикла
     */
    function applyCycleClass(cycle) {
        if (!bodyEl) return;

        // Определяем класс для цикла
        let cycleClass = CYCLE_CLASSES[cycle];
        if (!cycleClass) {
            // Для циклов больше 3 используем подвал
            if (cycle >= 3) {
                cycleClass = CYCLE_CLASSES[3];
            } else {
                cycleClass = CYCLE_CLASSES.default;
            }
        }

        // Проверяем, не применен ли уже этот класс
        if (bodyEl.classList.contains(cycleClass)) {
            return; // Класс уже применен, ничего не делаем
        }

        // Удаляем все классы циклов
        Object.values(CYCLE_CLASSES).forEach(className => {
            bodyEl.classList.remove(className);
        });

        // Добавляем класс для текущего цикла
        bodyEl.classList.add(cycleClass);

        console.log(`[BackgroundManager] Применен фон для цикла ${cycle}: ${cycleClass}`);
    }

    /**
     * Наблюдение за изменениями состояния игры
     */
    function observeStateChanges() {
        // Вариант 1: Периодическая проверка (простой и надежный)
        // Используем более частую проверку для быстрой реакции
        setInterval(() => {
            updateCycleFromState();
        }, 200); // Проверяем каждые 200мс для более быстрой реакции

        // Вариант 2: Слушаем кастомные события (если они есть)
        window.addEventListener('state-updated', () => {
            updateCycleFromState();
        });

        // Вариант 3: Перехватываем изменения через Proxy (если state еще не был создан как Proxy)
        // Этот вариант может конфликтовать с другими модулями, поэтому используем с осторожностью
        // Оставляем только периодическую проверку и события
    }

    /**
     * Публичный API для ручного обновления фона
     */
    function updateBackground(cycle) {
        if (typeof cycle === 'number' && cycle > 0) {
            currentCycle = cycle;
            applyCycleClass(cycle);
        } else {
            updateCycleFromState();
        }
    }

    /**
     * Получение текущего цикла
     */
    function getCurrentCycle() {
        return currentCycle;
    }

    // Инициализация при загрузке DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Экспорт API
    window.BackgroundManager = {
        update: updateBackground,
        getCurrentCycle: getCurrentCycle,
        init: init
    };

})();

