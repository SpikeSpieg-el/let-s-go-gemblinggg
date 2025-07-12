/**
 * Модуль для управления рекламой Яндекс Игр
 * Включает стики-баннер, полноэкранную рекламу и видеорекламу с вознаграждением
 */

class AdsManager {
    constructor() {
        this.ysdk = null;
        this.isInitialized = false;
        this.stickyBannerShown = false;
        this.adCallbacks = {
            onStickyBannerShow: null,
            onStickyBannerHide: null,
            onFullscreenAdShow: null,
            onFullscreenAdClose: null,
            onRewardedVideoShow: null,
            onRewardedVideoReward: null,
            onRewardedVideoClose: null,
            onAdError: null
        };
        
        // Настройки рекламы
        this.settings = {
            stickyBannerEnabled: true,
            stickyBannerPosition: 'right', // 'right', 'top', 'bottom'
            fullscreenAdEnabled: true,
            rewardedVideoEnabled: true,
            autoShowStickyBanner: true,
            showAdsOnGameStart: true,
            showAdsOnLevelComplete: true,
            showAdsOnGameOver: true
        };
        
        this.init();
    }
    
    /**
     * Инициализация менеджера рекламы
     */
    init() {
        console.log('[AdsManager] Инициализация менеджера рекламы...');
        
        // Ждем готовности SDK
        if (window.ysdk) {
            this.onSDKReady(window.ysdk);
        } else {
            window.addEventListener('ysdk-ready', (event) => {
                this.onSDKReady(event.detail);
            });
            
            // Таймаут для инициализации
            setTimeout(() => {
                if (!this.isInitialized) {
                    console.warn('[AdsManager] Таймаут инициализации SDK, реклама будет отключена');
                }
            }, 10000);
        }
    }
    
    /**
     * Обработчик готовности SDK
     */
    onSDKReady(ysdk) {
        console.log('[AdsManager] SDK готов, инициализируем рекламу...');
        this.ysdk = ysdk;
        this.isInitialized = true;
        
        // Проверяем доступность рекламы
        this.checkAdAvailability();
        
        // Автоматически показываем стики-баннер при запуске
        if (this.settings.autoShowStickyBanner) {
            setTimeout(() => {
                this.showStickyBanner();
            }, 2000); // Небольшая задержка для загрузки игры
        }
    }
    
    /**
     * Проверка доступности рекламы
     */
    async checkAdAvailability() {
        if (!this.ysdk || !this.ysdk.adv) {
            console.warn('[AdsManager] SDK или модуль рекламы недоступен');
            return;
        }
        
        try {
            // Проверяем статус стики-баннера
            const bannerStatus = await this.ysdk.adv.getBannerAdvStatus();
            console.log('[AdsManager] Статус стики-баннера:', bannerStatus);
            
            if (bannerStatus.stickyAdvIsShowing) {
                this.stickyBannerShown = true;
                console.log('[AdsManager] Стики-баннер уже показывается');
            }
        } catch (error) {
            console.error('[AdsManager] Ошибка проверки статуса рекламы:', error);
        }
    }
    
    /**
     * Показать стики-баннер
     */
    async showStickyBanner() {
        if (!this.isInitialized || !this.ysdk || !this.ysdk.adv) {
            console.warn('[AdsManager] SDK не инициализирован, не могу показать стики-баннер');
            return false;
        }
        
        if (!this.settings.stickyBannerEnabled) {
            console.log('[AdsManager] Стики-баннер отключен в настройках');
            return false;
        }
        
        try {
            const result = await this.ysdk.adv.showBannerAdv();
            console.log('[AdsManager] Результат показа стики-баннера:', result);
            
            if (result.stickyAdvIsShowing) {
                this.stickyBannerShown = true;
                console.log('[AdsManager] Стики-баннер успешно показан');
                
                if (this.adCallbacks.onStickyBannerShow) {
                    this.adCallbacks.onStickyBannerShow();
                }
                
                return true;
            } else if (result.reason) {
                console.warn('[AdsManager] Стики-баннер не показан, причина:', result.reason);
                return false;
            }
        } catch (error) {
            console.error('[AdsManager] Ошибка показа стики-баннера:', error);
            
            if (this.adCallbacks.onAdError) {
                this.adCallbacks.onAdError('sticky_banner', error);
            }
            
            return false;
        }
    }
    
    /**
     * Скрыть стики-баннер
     */
    async hideStickyBanner() {
        if (!this.isInitialized || !this.ysdk || !this.ysdk.adv) {
            console.warn('[AdsManager] SDK не инициализирован, не могу скрыть стики-баннер');
            return false;
        }
        
        try {
            const result = await this.ysdk.adv.hideBannerAdv();
            console.log('[AdsManager] Результат скрытия стики-баннера:', result);
            
            if (!result.stickyAdvIsShowing) {
                this.stickyBannerShown = false;
                console.log('[AdsManager] Стики-баннер успешно скрыт');
                
                if (this.adCallbacks.onStickyBannerHide) {
                    this.adCallbacks.onStickyBannerHide();
                }
                
                return true;
            }
        } catch (error) {
            console.error('[AdsManager] Ошибка скрытия стики-баннера:', error);
            
            if (this.adCallbacks.onAdError) {
                this.adCallbacks.onAdError('sticky_banner_hide', error);
            }
            
            return false;
        }
    }
    
    /**
     * Показать полноэкранную рекламу
     */
    async showFullscreenAd() {
        if (!this.isInitialized || !this.ysdk || !this.ysdk.adv) {
            console.warn('[AdsManager] SDK не инициализирован, не могу показать полноэкранную рекламу');
            return false;
        }
        
        if (!this.settings.fullscreenAdEnabled) {
            console.log('[AdsManager] Полноэкранная реклама отключена в настройках');
            return false;
        }
        
        return new Promise((resolve) => {
            this.ysdk.adv.showFullscreenAdv({
                callbacks: {
                    onOpen: () => {
                        console.log('[AdsManager] Полноэкранная реклама открыта');
                        
                        if (this.adCallbacks.onFullscreenAdShow) {
                            this.adCallbacks.onFullscreenAdShow();
                        }
                    },
                    onClose: (wasShown) => {
                        console.log('[AdsManager] Полноэкранная реклама закрыта, была показана:', wasShown);
                        
                        if (this.adCallbacks.onFullscreenAdClose) {
                            this.adCallbacks.onFullscreenAdClose(wasShown);
                        }
                        
                        resolve(wasShown);
                    },
                    onError: (error) => {
                        console.error('[AdsManager] Ошибка полноэкранной рекламы:', error);
                        
                        if (this.adCallbacks.onAdError) {
                            this.adCallbacks.onAdError('fullscreen_ad', error);
                        }
                        
                        resolve(false);
                    }
                }
            });
        });
    }
    
    /**
     * Показать видеорекламу с вознаграждением
     */
    async showRewardedVideo() {
        if (!this.isInitialized || !this.ysdk || !this.ysdk.adv) {
            console.warn('[AdsManager] SDK не инициализирован, не могу показать видеорекламу');
            return false;
        }
        
        if (!this.settings.rewardedVideoEnabled) {
            console.log('[AdsManager] Видеореклама отключена в настройках');
            return false;
        }
        
        return new Promise((resolve) => {
            this.ysdk.adv.showRewardedVideo({
                callbacks: {
                    onOpen: () => {
                        console.log('[AdsManager] Видеореклама открыта');
                        
                        if (this.adCallbacks.onRewardedVideoShow) {
                            this.adCallbacks.onRewardedVideoShow();
                        }
                    },
                    onRewarded: () => {
                        console.log('[AdsManager] Видеореклама просмотрена, награда выдана');
                        
                        if (this.adCallbacks.onRewardedVideoReward) {
                            this.adCallbacks.onRewardedVideoReward();
                        }
                    },
                    onClose: () => {
                        console.log('[AdsManager] Видеореклама закрыта');
                        
                        if (this.adCallbacks.onRewardedVideoClose) {
                            this.adCallbacks.onRewardedVideoClose();
                        }
                        
                        resolve(true);
                    },
                    onError: (error) => {
                        console.error('[AdsManager] Ошибка видеорекламы:', error);
                        
                        if (this.adCallbacks.onAdError) {
                            this.adCallbacks.onAdError('rewarded_video', error);
                        }
                        
                        resolve(false);
                    }
                }
            });
        });
    }
    
    /**
     * Установить callback для событий рекламы
     */
    on(event, callback) {
        if (this.adCallbacks.hasOwnProperty(event)) {
            this.adCallbacks[event] = callback;
        } else {
            console.warn('[AdsManager] Неизвестное событие рекламы:', event);
        }
    }
    
    /**
     * Обновить настройки рекламы
     */
    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        console.log('[AdsManager] Настройки обновлены:', this.settings);
    }
    
    /**
     * Получить текущие настройки
     */
    getSettings() {
        return { ...this.settings };
    }
    
    /**
     * Получить статус инициализации
     */
    isReady() {
        return this.isInitialized && this.ysdk !== null;
    }
    
    /**
     * Получить статус стики-баннера
     */
    isStickyBannerShown() {
        return this.stickyBannerShown;
    }
    
    /**
     * Показать рекламу при определенных событиях игры
     */
    showAdOnEvent(eventType) {
        switch (eventType) {
            case 'game_start':
                if (this.settings.showAdsOnGameStart) {
                    this.showFullscreenAd();
                }
                break;
            case 'level_complete':
                if (this.settings.showAdsOnLevelComplete) {
                    this.showFullscreenAd();
                }
                break;
            case 'game_over':
                if (this.settings.showAdsOnGameOver) {
                    this.showFullscreenAd();
                }
                break;
            default:
                console.warn('[AdsManager] Неизвестный тип события для рекламы:', eventType);
        }
    }
    
    /**
     * Получить информацию о рекламе для отладки
     */
    getDebugInfo() {
        return {
            isInitialized: this.isInitialized,
            ysdkAvailable: this.ysdk !== null,
            stickyBannerShown: this.stickyBannerShown,
            settings: this.settings
        };
    }
}

// Создаем глобальный экземпляр менеджера рекламы
window.adsManager = new AdsManager();

// Экспортируем для использования в модулях
export default window.adsManager; 