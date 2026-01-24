/**
 * Модуль управления фоном игры (Dark Luxury Casino Edition v4)
 * 20 циклов с глубокими текстурами, дорогими цветами и атмосферой элитного гемблинга.
 */
(function() {
    'use strict';

    let currentCycle = 1;

    // --- КОНФИГУРАЦИЯ ТЕМ (20 УНИКАЛЬНЫХ УРОВНЕЙ) ---
    // base: основной цвет подложки (самый темный)
    // grad1: основной цветовой градиент (атмосфера)
    // grad2: текстурный слой (шум, узор, сетка)
    const THEMES = [
        {
            // Cycle 1: The Green Felt (Классическое дорогое сукно)
            min: 1, max: 1,
            name: 'royal-felt',
            base: '#051408',
            // Глубокий радиальный градиент с виньеткой
            grad1: 'radial-gradient(circle at 50% 50%, #1a4a28 0%, #081c0f 60%, #000000 100%)',
            // Текстура ткани (микро-шум)
            grad2: 'repeating-radial-gradient(circle at 50% 50%, transparent 0, transparent 2px, #00000020 3px)',
            blend: 'multiply',
            opacity: 0.6,
            animSpeed: '120s'
        },
        {
            // Cycle 2: Oxblood Leather (Темно-красная кожа)
            min: 2, max: 2,
            name: 'oxblood',
            base: '#1a0505',
            grad1: 'radial-gradient(ellipse at center, #4a0e0e 0%, #2b0505 70%, #000 100%)',
            // Текстура кожи
            grad2: 'repeating-conic-gradient(#00000033 0deg 2deg, transparent 2deg 4deg)',
            blend: 'overlay',
            opacity: 0.5,
            animSpeed: '90s'
        },
        {
            // Cycle 3: Midnight Velvet (Темно-синий бархат)
            min: 3, max: 3,
            name: 'midnight',
            base: '#020512',
            grad1: 'conic-gradient(from 180deg at 50% 50%, #050a24 0%, #0f1c4d 50%, #050a24 100%)',
            grad2: 'radial-gradient(circle, transparent 20%, #000 120%)', 
            blend: 'soft-light',
            opacity: 0.7,
            animSpeed: '60s'
        },
        {
            // Cycle 4: Obsidian & Smoke (Черный камень и дым)
            min: 4, max: 4,
            name: 'obsidian',
            base: '#080808',
            grad1: 'linear-gradient(135deg, #111 0%, #1a1a1a 50%, #050505 100%)',
            grad2: 'repeating-linear-gradient(45deg, #ffffff05 0px, #ffffff05 1px, transparent 1px, transparent 10px)',
            blend: 'screen',
            opacity: 0.3,
            animSpeed: '80s'
        },
        {
            // Cycle 5: Antique Gold (Старое золото и дерево)
            min: 5, max: 5,
            name: 'antique-gold',
            base: '#1f1a0b',
            grad1: 'radial-gradient(circle at 40% 40%, #5c4d1f 0%, #2e2608 60%, #000 100%)',
            grad2: 'repeating-radial-gradient(circle at 0 0, transparent 0, #ffd70011 20px, transparent 40px)',
            blend: 'color-dodge',
            opacity: 0.4,
            animSpeed: '50s'
        },
        {
            // Cycle 6: Carbon Fiber (Современный хай-тек)
            min: 6, max: 6,
            name: 'carbon',
            base: '#0d0d12',
            grad1: 'linear-gradient(to bottom, #16161c, #08080a)',
            grad2: 'repeating-linear-gradient(45deg, #000 0, #000 2px, #222 2px, #222 4px)',
            blend: 'overlay',
            opacity: 0.5,
            animSpeed: '200s' // Почти статика
        },
        {
            // Cycle 7: Sangria (Винный, густой)
            min: 7, max: 7,
            name: 'sangria',
            base: '#1f000a',
            grad1: 'conic-gradient(from 0deg, #1f000a 0%, #4a0018 33%, #2e000f 66%, #1f000a 100%)',
            grad2: 'radial-gradient(circle at 50% 50%, #ff004411 0%, transparent 50%)',
            blend: 'screen',
            opacity: 0.6,
            animSpeed: '45s'
        },
        {
            // Cycle 8: Ultraviolet Haze (Фиолетовая дымка)
            min: 8, max: 8,
            name: 'ultraviolet',
            base: '#11001f',
            grad1: 'radial-gradient(circle at 80% 20%, #300057 0%, #000 70%)',
            grad2: 'repeating-conic-gradient(#ffffff08 0deg 10deg, transparent 10deg 20deg)',
            blend: 'overlay',
            opacity: 0.4,
            animSpeed: '55s'
        },
        {
            // Cycle 9: Toxic Emerald (Ядовито-зеленый неон во тьме)
            min: 9, max: 9,
            name: 'toxic-emerald',
            base: '#001405',
            grad1: 'radial-gradient(circle at 50% 50%, #00330e 0%, #000 85%)',
            grad2: 'repeating-linear-gradient(90deg, transparent 0, transparent 49px, #00ff3322 50px)',
            blend: 'color-dodge',
            opacity: 0.5,
            animSpeed: '30s'
        },
        {
            // Cycle 10: The Void (Абсолютная тьма с акцентами)
            min: 10, max: 10,
            name: 'void-stare',
            base: '#000000',
            grad1: 'radial-gradient(circle, #222 0%, #000 40%)',
            grad2: 'conic-gradient(from 0deg, #111 0%, #000 25%, #111 50%, #000 75%)',
            blend: 'exclusion',
            opacity: 0.8,
            animSpeed: '25s'
        },
        {
            // Cycle 11: Amethyst Geometric (Кристаллическая решетка)
            min: 11, max: 11,
            name: 'amethyst-geo',
            base: '#14001c',
            grad1: 'conic-gradient(from 45deg, #1f002b 0%, #3d0054 50%, #1f002b 100%)',
            grad2: 'repeating-linear-gradient(60deg, transparent 0, transparent 20px, #ae00ff11 20px, #ae00ff11 21px)',
            blend: 'lighten',
            opacity: 0.4,
            animSpeed: '60s'
        },
        {
            // Cycle 12: Blueprint Darkness (Инженерный синий)
            min: 12, max: 12,
            name: 'blueprint-dark',
            base: '#000814',
            grad1: 'radial-gradient(circle at center, #001533 0%, #000 80%)',
            grad2: 'linear-gradient(0deg, transparent 98%, #0055ff22 99%), linear-gradient(90deg, transparent 98%, #0055ff22 99%)',
            blend: 'screen',
            opacity: 0.5,
            animSpeed: '100s'
        },
        {
            // Cycle 13: Burning Embers (Угли)
            min: 13, max: 13,
            name: 'embers',
            base: '#140300',
            grad1: 'radial-gradient(circle at 50% 70%, #400f00 0%, #1a0500 50%, #000 100%)',
            grad2: 'repeating-radial-gradient(circle, #ff330008 0, transparent 5px, transparent 20px)',
            blend: 'color-dodge',
            opacity: 0.6,
            animSpeed: '40s'
        },
        {
            // Cycle 14: Cyber Glitch Dark (Темный киберпанк)
            min: 14, max: 14,
            name: 'cyber-dark',
            base: '#000500',
            grad1: 'linear-gradient(90deg, #001a05 0%, #000 50%, #001a05 100%)',
            grad2: 'repeating-linear-gradient(180deg, transparent 0, transparent 3px, #00ff0011 4px)',
            blend: 'add',
            opacity: 0.3,
            animSpeed: '10s' // Быстрый сканлайн
        },
        {
            // Cycle 15: Deep Space Nebula (Космическая пыль)
            min: 15, max: 15,
            name: 'nebula',
            base: '#0a0014',
            grad1: 'radial-gradient(ellipse at top left, #290033 0%, transparent 60%), radial-gradient(ellipse at bottom right, #001a33 0%, transparent 60%)',
            grad2: 'conic-gradient(from 0deg, #ffffff05 0%, transparent 30%, #ffffff05 60%, transparent 90%)',
            blend: 'screen',
            opacity: 0.5,
            animSpeed: '70s'
        },
        {
            // Cycle 16: Midas Touch (Темное золото)
            min: 16, max: 16,
            name: 'midas',
            base: '#1c1500',
            grad1: 'conic-gradient(#2b2200 0%, #5e4b00 25%, #2b2200 50%, #000 100%)',
            grad2: 'repeating-radial-gradient(circle at 50% 50%, transparent 0, transparent 10px, #ffd70022 10px, #ffd70022 11px)',
            blend: 'overlay',
            opacity: 0.6,
            animSpeed: '35s'
        },
        {
            // Cycle 17: Event Horizon (Горизонт событий)
            min: 17, max: 17,
            name: 'horizon',
            base: '#000000',
            grad1: 'radial-gradient(circle, #000 50%, #331100 55%, #000 70%)',
            grad2: 'conic-gradient(from 0deg, #000 0%, #222 10%, #000 20%)',
            blend: 'lighten',
            opacity: 0.7,
            animSpeed: '5s' // Быстрое вращение аккреционного диска
        },
        {
            // Cycle 18: Psychedelic Dark (Темная психоделия)
            min: 18, max: 18,
            name: 'psy-dark',
            base: '#0f000f',
            grad1: 'repeating-conic-gradient(#1a001a 0deg 15deg, #001a1a 15deg 30deg)',
            grad2: 'radial-gradient(circle, transparent 20%, #000 80%)',
            blend: 'difference',
            opacity: 0.4,
            animSpeed: '30s'
        },
        {
            // Cycle 19: Digital Chaos (Шум данных)
            min: 19, max: 19,
            name: 'chaos',
            base: '#050505',
            grad1: 'repeating-linear-gradient(45deg, #111 0, #111 10px, #222 10px, #222 20px)',
            grad2: 'repeating-linear-gradient(-45deg, transparent 0, transparent 5px, #ffffff11 5px, #ffffff11 6px)',
            blend: 'hard-light',
            opacity: 0.3,
            animSpeed: '15s'
        },
        {
            // Cycle 20+: Singularity (Абсолютный финал)
            min: 20, max: 9999,
            name: 'singularity',
            base: '#000',
            // Переливающийся темный спектр
            grad1: 'conic-gradient(#100, #110, #010, #011, #001, #101, #100)',
            grad2: 'radial-gradient(circle at 50% 50%, transparent 0%, #000 60%)',
            blend: 'color-dodge',
            opacity: 0.5,
            animSpeed: '20s'
        }
    ];

    function init() {
        createBackgroundElements();
        createStyles();
        updateCycleFromState();
        setInterval(updateCycleFromState, 500);
    }

    function createBackgroundElements() {
        let bgContainer = document.getElementById('balatro-bg');
        if (!bgContainer) {
            bgContainer = document.createElement('div');
            bgContainer.id = 'balatro-bg';
            document.body.prepend(bgContainer);
        }
        let crtOverlay = document.getElementById('crt-overlay');
        if (!crtOverlay) {
            crtOverlay = document.createElement('div');
            crtOverlay.id = 'crt-overlay';
            document.body.prepend(crtOverlay);
        }
    }

    function createStyles() {
        if (document.getElementById('bg-manager-styles')) return;
        const style = document.createElement('style');
        style.id = 'bg-manager-styles';
        style.textContent = `
        :root {
            --bg-base: #050505;
            --bg-grad-1: none;
            --bg-grad-2: none;
            --bg-blend: normal;
            --bg-opacity: 0.5;
            --bg-speed: 60s;
        }
        
        body {
            background: none !important;
            background-color: transparent !important;
        }

        html {
            background-color: var(--bg-base) !important;
            transition: background-color 3s ease;
        }

        #balatro-bg {
            position: fixed;
            top: 0; left: 0;
            width: 100vw; height: 100vh;
            z-index: -10; 
            background-color: var(--bg-base);
            overflow: hidden;
            transition: background-color 3s ease;
        }

        /* СЛОЙ 1: Атмосфера и Вращение */
        #balatro-bg::before {
            content: '';
            position: absolute;
            top: -50%; left: -50%;
            width: 200%; height: 200%;
            background: var(--bg-grad-1);
            background-size: 100% 100%;
            animation: bgRotate var(--bg-speed) linear infinite;
            opacity: 1;
            pointer-events: none;
        }

        /* СЛОЙ 2: Текстура и Детали (Статичнее) */
        #balatro-bg::after {
            content: '';
            position: absolute;
            top: -50%; left: -50%;
            width: 200%; height: 200%;
            background: var(--bg-grad-2);
            mix-blend-mode: var(--bg-blend);
            opacity: var(--bg-opacity);
            /* Легкое дыхание текстуры */
            animation: bgPulse calc(var(--bg-speed) * 0.5) ease-in-out infinite alternate;
            pointer-events: none;
        }

        /* ВИНЬЕТКА (Поверх всего фона, но под игрой) */
        #balatro-bg .vignette {
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: radial-gradient(circle at center, transparent 40%, #000000 110%);
            z-index: 1;
            pointer-events: none;
        }

        /* CRT / Film Grain Overlay */
        #crt-overlay {
            position: fixed;
            top: 0; left: 0;
            width: 100vw; height: 100vh;
            z-index: -5; 
            background: 
                linear-gradient(rgba(0,0,0,0) 50%, rgba(0,0,0,0.2) 50%),
                radial-gradient(circle, transparent 90%, #000 150%);
            background-size: 100% 4px, 100% 100%;
            pointer-events: none;
            opacity: 0.3;
        }

        @keyframes bgRotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        @keyframes bgPulse {
            0% { transform: scale(1); opacity: var(--bg-opacity); }
            50% { transform: scale(1.02); opacity: calc(var(--bg-opacity) + 0.1); }
            100% { transform: scale(1); opacity: var(--bg-opacity); }
        }
        `;
        document.head.appendChild(style);
        
        // Добавляем элемент виньетки внутрь контейнера
        const bg = document.getElementById('balatro-bg');
        if (bg && !bg.querySelector('.vignette')) {
            const vig = document.createElement('div');
            vig.className = 'vignette';
            bg.appendChild(vig);
        }
    }

    function updateCycleFromState() {
        let run = 1;
        if (window.state && typeof window.state.run === 'number') {
            run = window.state.run;
        } else if (window.Game && window.Game.run) {
             run = window.Game.run;
        }

        if (run !== currentCycle) {
            currentCycle = run;
            applyTheme(currentCycle);
        }
    }

    function applyTheme(cycle) {
        const theme = THEMES.find(t => cycle >= t.min && cycle <= t.max) || THEMES[THEMES.length - 1];
        const root = document.documentElement;

        root.style.setProperty('--bg-base', theme.base);
        root.style.setProperty('--bg-grad-1', theme.grad1);
        root.style.setProperty('--bg-grad-2', theme.grad2);
        root.style.setProperty('--bg-blend', theme.blend);
        root.style.setProperty('--bg-opacity', theme.opacity);
        root.style.setProperty('--bg-speed', theme.animSpeed);
    }

    function updateBackground(cycle) {
        if (typeof cycle === 'number') {
            currentCycle = cycle;
            applyTheme(cycle);
        } else {
            updateCycleFromState();
        }
    }

    function getCurrentCycle() {
        return currentCycle;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.BackgroundManager = {
        update: updateBackground,
        getCurrentCycle: getCurrentCycle,
        init: init
    };

})();