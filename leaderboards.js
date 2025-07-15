/**
 * Модуль для работы с лидербордами Yandex Games
 * Интеграция с игрой "Цикл Долга"
 */

class LeaderboardsManager {
    constructor() {
        this.ysdk = null;
        this.isInitialized = false;
        this.leaderboardName = 'leaderboard';
        this.currentScore = 0;
        this.lastUpdateTime = 0;
        this.updateCooldown = 1000; // 1 секунда между обновлениями
        
        // Кэш для данных лидерборда
        this.cachedEntries = null;
        this.cachedPlayerEntry = null;
        this.lastCacheTime = 0;
        this.cacheTimeout = 30000; // 30 секунд кэширования
    }

    /**
     * Инициализация лидербордов
     * @param {Object} ysdk - Объект Yandex SDK
     */
    async initialize(ysdk) {
        console.log('[Leaderboards] Попытка инициализации...');
        console.log('[Leaderboards] Yandex SDK:', ysdk);
        console.log('[Leaderboards] Тип SDK:', typeof ysdk);
        console.log('[Leaderboards] SDK методы:', Object.keys(ysdk || {}));
        
        if (!ysdk) {
            console.warn('[Leaderboards] Yandex SDK не найден');
            return false;
        }

        this.ysdk = ysdk;
        
        try {
            console.log('[Leaderboards] Проверяем доступность методов...');
            
            // Проверяем наличие объекта leaderboards
            if (!this.ysdk.leaderboards) {
                console.warn('[Leaderboards] Объект leaderboards не найден в SDK');
                console.log('[Leaderboards] Доступные методы SDK:', Object.keys(this.ysdk));
                return false;
            }
            
            console.log('[Leaderboards] Методы leaderboards:', Object.keys(this.ysdk.leaderboards));
            
            // Проверяем доступность методов лидерборда
            const isAvailable = await this.ysdk.isAvailableMethod('leaderboards.setScore');
            console.log('[Leaderboards] Метод setScore доступен:', isAvailable);
            
            if (!isAvailable) {
                console.warn('[Leaderboards] Методы лидерборда недоступны');
                console.log('[Leaderboards] Доступные методы:', await this.ysdk.getAvailableMethods());
                return false;
            }

            console.log('[Leaderboards] Получаем описание лидерборда:', this.leaderboardName);
            // Получаем описание лидерборда
            const description = await this.ysdk.leaderboards.getDescription(this.leaderboardName);
            console.log('[Leaderboards] Лидерборд инициализирован:', description);
            
            this.isInitialized = true;
            console.log('[Leaderboards] Инициализация завершена успешно');
            return true;
        } catch (error) {
            console.error('[Leaderboards] Ошибка инициализации:', error);
            console.error('[Leaderboards] Код ошибки:', error.code);
            console.error('[Leaderboards] Сообщение ошибки:', error.message);
            console.error('[Leaderboards] Стек ошибки:', error.stack);
            
            // Попробуем получить больше информации об ошибке
            if (this.ysdk && typeof this.ysdk.getAvailableMethods === 'function') {
                try {
                    const methods = await this.ysdk.getAvailableMethods();
                    console.log('[Leaderboards] Доступные методы SDK:', methods);
                } catch (methodError) {
                    console.error('[Leaderboards] Не удалось получить доступные методы:', methodError);
                }
            }
            
            return false;
        }
    }

    /**
     * Установка нового результата игрока
     * @param {number} score - Результат (количество циклов)
     * @param {string} extraData - Дополнительные данные
     */
    async setScore(score, extraData = '') {
        if (!this.isInitialized || !this.ysdk) {
            console.warn('[Leaderboards] Лидерборды не инициализированы');
            return false;
        }

        // Проверяем кулдаун
        const now = Date.now();
        if (now - this.lastUpdateTime < this.updateCooldown) {
            console.warn('[Leaderboards] Слишком частые обновления, пропускаем');
            return false;
        }

        try {
            await this.ysdk.leaderboards.setScore(this.leaderboardName, score, extraData);
            this.currentScore = score;
            this.lastUpdateTime = now;
            
            // Сбрасываем кэш
            this.cachedEntries = null;
            this.cachedPlayerEntry = null;
            
            console.log(`[Leaderboards] Результат обновлен: ${score}`);
            return true;
        } catch (error) {
            console.error('[Leaderboards] Ошибка установки результата:', error);
            return false;
        }
    }

    /**
     * Получение результата текущего игрока
     */
    async getPlayerEntry() {
        if (!this.isInitialized || !this.ysdk) {
            return null;
        }

        // Проверяем кэш
        if (this.cachedPlayerEntry && Date.now() - this.lastCacheTime < this.cacheTimeout) {
            return this.cachedPlayerEntry;
        }

        try {
            const entry = await this.ysdk.leaderboards.getPlayerEntry(this.leaderboardName);
            this.cachedPlayerEntry = entry;
            this.lastCacheTime = Date.now();
            return entry;
        } catch (error) {
            if (error.code === 'LEADERBOARD_PLAYER_NOT_PRESENT') {
                console.log('[Leaderboards] Игрок не найден в лидерборде');
                return null;
            }
            console.error('[Leaderboards] Ошибка получения результата игрока:', error);
            return null;
        }
    }

    /**
     * Получение топ-10 игроков
     * @param {number} quantityTop - Количество топ игроков (по умолчанию 10)
     * @param {boolean} includeUser - Включить текущего пользователя
     * @param {number} quantityAround - Количество записей вокруг пользователя
     */
    async getTopEntries(quantityTop = 10, includeUser = true, quantityAround = 3) {
        if (!this.isInitialized || !this.ysdk) {
            return null;
        }

        // Проверяем кэш
        if (this.cachedEntries && Date.now() - this.lastCacheTime < this.cacheTimeout) {
            return this.cachedEntries;
        }

        try {
            const entries = await this.ysdk.leaderboards.getEntries(this.leaderboardName, {
                quantityTop,
                includeUser,
                quantityAround
            });
            
            this.cachedEntries = entries;
            this.lastCacheTime = Date.now();
            return entries;
        } catch (error) {
            console.error('[Leaderboards] Ошибка получения топ игроков:', error);
            return null;
        }
    }

    /**
     * Обновление результата на основе состояния игры
     * @param {Object} gameState - Состояние игры
     */
    async updateGameScore(gameState) {
        if (!gameState || !gameState.run) {
            return false;
        }

        const score = gameState.run;
        const extraData = this.generateExtraData(gameState);
        
        return await this.setScore(score, extraData);
    }

    /**
     * Генерация дополнительных данных для лидерборда
     * @param {Object} gameState - Состояние игры
     */
    generateExtraData(gameState) {
        const data = {
            run: gameState.run || 1,
            totalCoins: gameState.totalCoins || 0,
            totalTickets: gameState.totalTickets || 0,
            items: gameState.inventory?.length || 0,
            passives: gameState.activePassives?.length || 0
        };
        
        return JSON.stringify(data);
    }

    /**
     * Парсинг дополнительных данных
     * @param {string} extraData - Строка с дополнительными данными
     */
    parseExtraData(extraData) {
        try {
            return JSON.parse(extraData);
        } catch (error) {
            return null;
        }
    }

    /**
     * Создание элемента лидерборда для отображения
     * @param {Object} entry - Запись лидерборда
     * @param {number} index - Индекс в списке
     */
    createLeaderboardEntry(entry, index) {
        const entryElement = document.createElement('div');
        entryElement.className = 'leaderboard-entry';
        entryElement.style.cssText = `
            display: grid;
            grid-template-columns: 60px 1fr 80px;
            gap: 16px;
            padding: 16px 20px;
            margin-bottom: 10px;
            background: var(--bg-color);
            border-radius: 10px;
            border: 1px solid var(--border-color);
            align-items: center;
            font-size: 1.08em;
        `;
        
        const rank = entry.rank;
        const player = entry.player;
        const score = entry.score;
        const extraData = this.parseExtraData(entry.extraData);
        
        // Определяем класс для позиции
        let rankClass = 'rank-normal';
        let rankStyle = 'font-weight: bold; color: var(--text-color);';
        if (rank === 1) {
            rankClass = 'rank-gold';
            rankStyle = 'font-weight: bold; color: #FFD700; text-shadow: 0 0 5px #FFD700;';
        } else if (rank === 2) {
            rankClass = 'rank-silver';
            rankStyle = 'font-weight: bold; color: #C0C0C0; text-shadow: 0 0 5px #C0C0C0;';
        } else if (rank === 3) {
            rankClass = 'rank-bronze';
            rankStyle = 'font-weight: bold; color: #CD7F32; text-shadow: 0 0 5px #CD7F32;';
        }
        
        // Ранг
        const rankDiv = document.createElement('div');
        rankDiv.className = `entry-rank ${rankClass}`;
        rankDiv.style.cssText = rankStyle;
        rankDiv.textContent = rank;
        
        // Информация об игроке
        const playerInfoDiv = document.createElement('div');
        playerInfoDiv.className = 'entry-info';
        playerInfoDiv.style.cssText = 'display: flex; align-items: center; gap: 10px;';
        
        // Аватар
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'entry-avatar';
        avatarDiv.style.cssText = `
            width: 32px;
            height: 32px;
            border-radius: 50%;
            overflow: hidden;
            background: var(--bg-color-darker);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            color: var(--text-color-darker);
        `;
        
        const avatarImg = document.createElement('img');
        avatarImg.src = player.getAvatarSrc('small');
        avatarImg.alt = 'Аватар';
        avatarImg.style.cssText = 'width: 100%; height: 100%; object-fit: cover;';
        avatarImg.onerror = () => {
            avatarImg.style.display = 'none';
            avatarDiv.textContent = player.publicName ? player.publicName.charAt(0).toUpperCase() : '?';
        };
        avatarDiv.appendChild(avatarImg);
        
        // Имя и детали
        const detailsDiv = document.createElement('div');
        detailsDiv.style.cssText = 'flex: 1; min-width: 0;';
        
        const nameDiv = document.createElement('div');
        nameDiv.className = 'entry-name';
        nameDiv.style.cssText = 'font-weight: bold; color: var(--text-color); margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;';
        nameDiv.textContent = player.publicName || 'Пользователь скрыт';
        
        const detailsTextDiv = document.createElement('div');
        detailsTextDiv.className = 'entry-details';
        detailsTextDiv.style.cssText = 'font-size: 12px; color: var(--text-color-darker);';
        detailsTextDiv.textContent = extraData ? `Цикл ${extraData.run} • ${extraData.items} амулетов` : `Цикл ${score}`;
        
        detailsDiv.appendChild(nameDiv);
        detailsDiv.appendChild(detailsTextDiv);
        
        playerInfoDiv.appendChild(avatarDiv);
        playerInfoDiv.appendChild(detailsDiv);
        
        // Счет
        const scoreDiv = document.createElement('div');
        scoreDiv.className = 'entry-score';
        scoreDiv.style.cssText = 'font-weight: bold; color: var(--money-color); text-align: right;';
        scoreDiv.textContent = score;
        
        entryElement.appendChild(rankDiv);
        entryElement.appendChild(playerInfoDiv);
        entryElement.appendChild(scoreDiv);
        
        // Удаляем hover-эффект:
        // entryElement.onmouseenter = () => { ... }
        // entryElement.onmouseleave = () => { ... }
        
        return entryElement;
    }

    /**
     * Отображение модального окна с лидербордом
     */
    async showLeaderboardModal() {
        if (!this.isInitialized) {
            console.warn('[Leaderboards] Попытка показать лидерборд без инициализации');
            this.showLocalLeaderboardModal();
            return;
        }

        console.log('[Leaderboards] Загружаем данные лидерборда...');
        const entries = await this.getTopEntries(10, true, 3);
        if (!entries) {
            console.error('[Leaderboards] Не удалось загрузить данные лидерборда');
            this.showLocalLeaderboardModal();
            return;
        }

        console.log('[Leaderboards] Данные загружены, создаем модальное окно...');
        this.createLeaderboardModal(entries);
    }

    /**
     * Создание модального окна лидерборда
     * @param {Object} entries - Данные лидерборда
     */
    async createLeaderboardModal(entries) {
        // Удаляем существующее модальное окно
        const existingModal = document.getElementById('leaderboard-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = 'leaderboard-modal';
        modal.className = 'modal-overlay';
        
        const content = document.createElement('div');
        content.className = 'modal-content leaderboard-content';
        content.style.maxWidth = '770px';
        content.style.width = '96vw';
        
        // Создаем заголовок с кнопкой закрытия по центру
        const titleContainer = document.createElement('div');
        titleContainer.className = 'leaderboard-title-container';
        titleContainer.style.cssText = 'position: relative; text-align: center; margin-bottom: 20px;';
        
        const title = document.createElement('h2');
        title.textContent = '🏆 Таблица лидеров';
        title.style.cssText = 'margin: 0; display: inline-block;';
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'modal-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.style.cssText = `
            position: absolute;
            top: 50%;
            right: 0;
            transform: translateY(-50%);
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: var(--text-color-darker);
            padding: 5px 10px;
            border-radius: 5px;
            transition: background-color 0.2s;
            z-index: 10;
        `;
        closeBtn.onmouseover = () => {
            closeBtn.style.backgroundColor = 'rgba(0,0,0,0.1)';
        };
        closeBtn.onmouseout = () => {
            closeBtn.style.backgroundColor = 'transparent';
        };
        closeBtn.onclick = () => modal.remove();
        
        titleContainer.appendChild(title);
        titleContainer.appendChild(closeBtn);
        
        const header = document.createElement('div');
        header.className = 'leaderboard-header';
        header.style.cssText = `
            display: grid;
            grid-template-columns: 60px 1fr 80px;
            gap: 10px;
            padding: 10px 15px;
            background: var(--bg-color-darker);
            border-radius: 8px;
            margin-bottom: 10px;
            font-weight: bold;
            color: var(--text-color);
        `;
        header.innerHTML = `
            <div class="header-rank">Место</div>
            <div class="header-player">Игрок</div>
            <div class="header-score">Циклы</div>
        `;
        
        const entriesContainer = document.createElement('div');
        entriesContainer.className = 'leaderboard-entries';
        entriesContainer.style.cssText = 'max-height: 650px; overflow-y: auto;';
        
        // Добавляем записи
        entries.entries.forEach((entry, index) => {
            const entryElement = this.createLeaderboardEntry(entry, index);
            entriesContainer.appendChild(entryElement);
        });
        
        // Показываем позицию пользователя, если он не в топе
        if (entries.userRank > 0 && !entries.entries.find(e => e.rank === entries.userRank)) {
            const playerEntry = await this.getPlayerEntry();
            if (playerEntry) {
                const separator = document.createElement('div');
                separator.className = 'leaderboard-separator';
                separator.textContent = '...';
                separator.style.cssText = 'text-align: center; padding: 10px; color: var(--text-color-darker); font-weight: bold;';
                entriesContainer.appendChild(separator);
                
                const playerElement = this.createLeaderboardEntry(playerEntry, -1);
                playerElement.classList.add('current-player');
                playerElement.style.cssText = 'background: rgba(255, 215, 0, 0.1); border: 2px solid gold;';
                entriesContainer.appendChild(playerElement);
            }
        }
        
        content.appendChild(titleContainer);
        content.appendChild(header);
        content.appendChild(entriesContainer);
        
        modal.appendChild(content);
        document.body.appendChild(modal);
        
        // Закрытие по клику вне модального окна
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    /**
     * Сохраняет результат игрока в localStorage
     * @param {Object} gameState - Состояние игры
     */
    saveLocalScore(gameState) {
        if (!gameState || !gameState.run) return;
        const entry = {
            run: gameState.run,
            totalCoins: gameState.totalCoins || 0,
            totalTickets: gameState.totalTickets || 0,
            items: gameState.inventory?.length || 0,
            passives: gameState.activePassives?.length || 0,
            date: Date.now(),
            name: (window.ysdk && window.ysdk.player && window.ysdk.player.getName && window.ysdk.player.getName()) || 'Игрок',
        };
        let local = [];
        try {
            local = JSON.parse(localStorage.getItem('localLeaderboard') || '[]');
        } catch {}
        local.push(entry);
        // Сохраняем только топ-20
        local = local.sort((a, b) => b.run - a.run).slice(0, 20);
        localStorage.setItem('localLeaderboard', JSON.stringify(local));
    }

    /**
     * Получает топ-10 локальных результатов
     */
    getLocalLeaderboard() {
        let local = [];
        try {
            local = JSON.parse(localStorage.getItem('localLeaderboard') || '[]');
        } catch {}
        return local.sort((a, b) => b.run - a.run).slice(0, 10);
    }

    /**
     * Показывает локальный лидерборд в модальном окне
     */
    showLocalLeaderboardModal() {
        // Удаляем существующее модальное окно
        const existingModal = document.getElementById('leaderboard-modal');
        if (existingModal) existingModal.remove();

        const modal = document.createElement('div');
        modal.id = 'leaderboard-modal';
        modal.className = 'modal-overlay';

        const content = document.createElement('div');
        content.className = 'modal-content leaderboard-content';

        const titleContainer = document.createElement('div');
        titleContainer.className = 'leaderboard-title-container';
        titleContainer.style.cssText = 'position: relative; text-align: center; margin-bottom: 20px;';

        const title = document.createElement('h2');
        title.textContent = 'Лидеры ямы';
        title.style.cssText = 'margin: 0; display: inline-block;';

        const closeBtn = document.createElement('button');
        closeBtn.className = 'modal-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.style.cssText = `
            position: absolute;
            top: 50%;
            right: 0;
            transform: translateY(-50%);
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: var(--text-color-darker);
            padding: 5px 10px;
            border-radius: 5px;
            transition: background-color 0.2s;
            z-index: 10;
        `;
        closeBtn.onmouseover = () => {
            closeBtn.style.backgroundColor = 'rgba(0,0,0,0.1)';
        };
        closeBtn.onmouseout = () => {
            closeBtn.style.backgroundColor = 'transparent';
        };
        closeBtn.onclick = () => modal.remove();

        titleContainer.appendChild(title);
        titleContainer.appendChild(closeBtn);

        const header = document.createElement('div');
        header.className = 'leaderboard-header';
        header.style.cssText = `
            display: grid;
            grid-template-columns: 60px 1fr 80px;
            gap: 10px;
            padding: 10px 15px;
            background: var(--bg-color-darker);
            border-radius: 8px;
            margin-bottom: 10px;
            font-weight: bold;
            color: var(--text-color);
        `;
        header.innerHTML = `
            <div class="header-rank">Место</div>
            <div class="header-player">Игрок</div>
            <div class="header-score">Циклы</div>
        `;

        const entriesContainer = document.createElement('div');
        entriesContainer.className = 'leaderboard-entries';
        entriesContainer.style.cssText = 'max-height: 650px; overflow-y: auto;';

        const local = this.getLocalLeaderboard();
        if (local.length === 0) {
            const empty = document.createElement('div');
            empty.style.cssText = 'text-align:center; color:var(--text-color-darker); padding:40px;';
            empty.textContent = 'Нет локальных результатов. Сыграйте партию!';
            entriesContainer.appendChild(empty);
        } else {
            local.forEach((entry, idx) => {
                // --- Новый стиль: как у createLeaderboardEntry ---
                const entryElement = document.createElement('div');
                entryElement.className = 'leaderboard-entry';
                entryElement.style.cssText = `
                    display: grid;
                    grid-template-columns: 60px 1fr 80px;
                    gap: 16px;
                    padding: 16px 20px;
                    margin-bottom: 10px;
                    background: var(--bg-color);
                    border-radius: 10px;
                    border: 1px solid var(--border-color);
                    align-items: center;
                    font-size: 1.08em;
                `;
                // Ранг
                const rankDiv = document.createElement('div');
                rankDiv.className = 'entry-rank';
                rankDiv.style.cssText = 'font-weight: bold; color: var(--text-color); text-align:center; font-size:1.1em;';
                rankDiv.textContent = idx + 1;
                // Информация об игроке (имя + детали + аватар)
                const playerInfoDiv = document.createElement('div');
                playerInfoDiv.className = 'entry-info';
                playerInfoDiv.style.cssText = 'display: flex; align-items: center; gap: 10px;';
                // Аватар (заглушка)
                const avatarDiv = document.createElement('div');
                avatarDiv.className = 'entry-avatar';
                avatarDiv.style.cssText = `
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    overflow: hidden;
                    background: var(--bg-color-darker);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    color: var(--text-color-darker);
                `;
                avatarDiv.textContent = entry.name ? entry.name.charAt(0).toUpperCase() : '?';
                // Имя и детали
                const detailsDiv = document.createElement('div');
                detailsDiv.style.cssText = 'flex: 1; min-width: 0;';
                const nameDiv = document.createElement('div');
                nameDiv.className = 'entry-name';
                nameDiv.style.cssText = 'font-weight: bold; color: var(--text-color); margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;';
                nameDiv.textContent = entry.name || 'Игрок';
                const detailsTextDiv = document.createElement('div');
                detailsTextDiv.className = 'entry-details';
                detailsTextDiv.style.cssText = 'font-size: 12px; color: var(--text-color-darker);';
                detailsTextDiv.textContent = `Цикл ${entry.run} • ${entry.items} амулетов`;
                detailsDiv.appendChild(nameDiv);
                detailsDiv.appendChild(detailsTextDiv);
                playerInfoDiv.appendChild(avatarDiv);
                playerInfoDiv.appendChild(detailsDiv);
                // Счет
                const scoreDiv = document.createElement('div');
                scoreDiv.className = 'entry-score';
                scoreDiv.style.cssText = 'font-weight: bold; color: var(--money-color); text-align: right; font-size:1.1em;';
                scoreDiv.textContent = entry.run;
                entryElement.appendChild(rankDiv);
                entryElement.appendChild(playerInfoDiv);
                entryElement.appendChild(scoreDiv);
                entriesContainer.appendChild(entryElement);
            });
        }

        content.appendChild(titleContainer);
        content.appendChild(header);
        content.appendChild(entriesContainer);
        modal.appendChild(content);
        document.body.appendChild(modal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }

    /**
     * Показ сообщения о недоступности
     */
    showNotAvailableMessage(message = 'Таблица лидеров недоступна. Убедитесь, что вы авторизованы в Yandex Games.') {
        this.showLocalLeaderboardModal();
    }

    /**
     * Показ сообщения об ошибке
     */
    showErrorMessage(message = 'Ошибка загрузки таблицы лидеров. Попробуйте позже.') {
        this.showLocalLeaderboardModal();
    }

    /**
     * Автоматическое обновление результата при завершении игры
     * @param {Object} gameState - Состояние игры
     */
    async onGameOver(gameState) {
        this.saveLocalScore(gameState);
        if (!this.isInitialized) return;
        console.log('[Leaderboards] Игра завершена, обновляем результат...');
        await this.updateGameScore(gameState);
    }

    /**
     * Сброс кэша
     */
    clearCache() {
        this.cachedEntries = null;
        this.cachedPlayerEntry = null;
        this.lastCacheTime = 0;
    }
}

// Создаем глобальный экземпляр
window.leaderboardsManager = new LeaderboardsManager();

// Экспортируем для использования в других модулях
export default window.leaderboardsManager; 

// === ОТЛАДОЧНАЯ ФУНКЦИЯ: Заполнить локальный лидерборд тестовыми данными ===
window.fillLocalLeaderboardWithTestData = function() {
    const names = [
        'Артём', 'Влад', 'Ирина', 'Сергей', 'Оля', 'Денис', 'Мария', 'Павел', 'Екатерина', 'Алексей',
        'Даша', 'Кирилл', 'Саша', 'Алина', 'Максим', 'Таня', 'Игорь', 'Юля', 'Виктор', 'Лена',
        'Глеб', 'Вера', 'Роман', 'Настя', 'Миша', 'Полина', 'Виталий', 'Света', 'Егор', 'Анна',
        'Валера', 'Женя', 'Ксюша', 'Дима', 'Лиза', 'Вова', 'Соня', 'Гриша', 'Никита', 'Зоя',
        'Руслан', 'Надя', 'Петя', 'Валя', 'Лёша', 'Рита', 'Яна', 'Тимур', 'Олег', 'Галя'
    ];
    const testEntries = [];
    for (let i = 0; i < 50; i++) {
        testEntries.push({
            run: Math.floor(Math.random() * 20) + 1,
            totalCoins: Math.floor(Math.random() * 10000),
            totalTickets: Math.floor(Math.random() * 100),
            items: Math.floor(Math.random() * 10),
            passives: Math.floor(Math.random() * 5),
            date: Date.now() - Math.floor(Math.random() * 100000000),
            name: names[i % names.length] + (i > names.length ? ' #' + (i+1-names.length) : '')
        });
    }
    // Сортируем по run и сохраняем только топ-20 (как в saveLocalScore)
    const sorted = testEntries.sort((a, b) => b.run - a.run).slice(0, 20);
    localStorage.setItem('localLeaderboard', JSON.stringify(sorted));
}; 