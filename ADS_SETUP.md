# Настройка рекламы Яндекс Игр

Этот документ содержит инструкции по настройке и использованию рекламы в игре "Цикл Долга".

## 📋 Что добавлено

### 1. Модуль управления рекламой (`ads.js`)
- **Стики-баннер справа** - автоматически показывается при запуске игры
- **Полноэкранная реклама** - показывается при окончании игры и переходе на следующий уровень
- **Видеореклама с вознаграждением** - альтернативный способ получения прокрутов

### 2. Адаптивный интерфейс
- CSS стили для корректного отображения с рекламой справа
- Адаптация под мобильные устройства
- Элементы отладки для разработки

### 3. Интеграция в игру
- Автоматический показ стики-баннера при запуске
- Реклама при окончании игры
- Реклама при переходе на следующий уровень
- Кнопка видеорекламы в модальном окне покупки прокрутов

## 🚀 Настройка в Консоли разработчика Яндекс Игр

### Шаг 1: Включение рекламы
1. Откройте [Консоль разработчика Яндекс Игр](https://yandex.ru/dev/games/)
2. Выберите вашу игру
3. Перейдите на вкладку **"Реклама"**

### Шаг 2: Настройка Sticky-баннера
В блоке **"Sticky-баннеры"** настройте отображение:

#### Для мобильных устройств:
- **Sticky-баннер в портретной ориентации** → выберите **"Внизу"** или **"Вверху"**
- **Sticky-баннер в альбомной ориентации** → выберите **"Внизу"**, **"Вверху"** или **"Справа"**

#### Для компьютеров:
- Включите опцию **"Sticky-баннер на десктопе"** → баннер будет показываться справа

### Шаг 3: Настройка API для показа sticky-баннера
1. Включите опцию **"Использовать API для показа sticky-баннера"**
2. Это позволит управлять моментом показа баннера через код

### Шаг 4: Настройка полноэкранной рекламы
- Включите **"Полноэкранная реклама"**
- Настройте частоту показа (рекомендуется: при окончании игры, переходе на уровень)

### Шаг 5: Настройка видеорекламы с вознаграждением
- Включите **"Видеореклама с вознаграждением"**
- Настройте награды для пользователей

## ⚙️ Настройки в коде

### Основные настройки рекламы
В файле `index.html` в секции инициализации рекламы можно изменить настройки:

```javascript
adsManager.updateSettings({
    stickyBannerEnabled: true,        // Включить стики-баннер
    stickyBannerPosition: 'right',    // Позиция: 'right', 'top', 'bottom'
    fullscreenAdEnabled: true,        // Включить полноэкранную рекламу
    rewardedVideoEnabled: true,       // Включить видеорекламу
    autoShowStickyBanner: true,       // Автоматически показывать стики-баннер
    showAdsOnGameStart: false,        // Показывать рекламу при старте игры
    showAdsOnLevelComplete: true,     // Показывать при переходе на уровень
    showAdsOnGameOver: true           // Показывать при окончании игры
});
```

### Настройка наград за видеорекламу
В файле `index.html` в callback `onRewardedVideoReward`:

```javascript
adsManager.on('onRewardedVideoReward', () => {
    // Выдаем награду игроку
    if (window.state) {
        window.state.coins += 100;     // +100 монет
        window.state.tickets += 5;     // +5 талонов
        if (window.updateUI) {
            window.updateUI();
        }
    }
});
```

## 🎮 Использование в игре

### Стики-баннер
- Показывается автоматически при запуске игры
- Располагается справа на десктопе
- Адаптируется под мобильные устройства

### Полноэкранная реклама
- **При окончании игры** - показывается через 1 секунду после game over
- **При переходе на уровень** - показывается при нажатии "Продолжить" в модальном окне успеха

### Видеореклама с вознаграждением
- Доступна в модальном окне покупки прокрутов
- Кнопка "📺 Смотреть рекламу за 3 прокрута"
- При полном просмотре игрок получает 3 дополнительных прокрута

## 🛠️ Отладка

### Элементы отладки (только для разработки)
При запуске на `localhost` или `127.0.0.1` автоматически добавляются:

1. **Панель отладки** (правый верхний угол):
   - Статус инициализации рекламы
   - Статус стики-баннера
   - Доступность SDK

2. **Кнопки управления** (правый нижний угол):
   - Стики-баннер (показать/скрыть)
   - Полноэкранная реклама
   - Видеореклама с наградой

### Логи в консоли
Все события рекламы логируются в консоль браузера:
```
[AdsManager] Инициализация менеджера рекламы...
[AdsManager] SDK готов, инициализируем рекламу...
[AdsManager] Стики-баннер успешно показан
[AdsManager] Полноэкранная реклама открыта
[AdsManager] Видеореклама просмотрена, награда выдана
```

## 📱 Адаптивность

### Десктоп (>1200px)
- Стики-баннер справа
- Игра адаптируется под уменьшенную ширину
- Элементы отладки скрыты

### Планшет (768px - 1200px)
- Стики-баннер может быть снизу или сверху
- Интерфейс адаптируется под размер экрана

### Мобильные (<768px)
- Переход на одну колонку
- UI панель перемещается под основной контент
- Стики-баннер снизу или сверху

## ⚠️ Важные замечания

### Рекомендации по размещению рекламы
1. **Не показывайте рекламу во время игрового процесса** - это может привести к случайным кликам
2. **Используйте естественные паузы** - окончание игры, переходы между уровнями
3. **Видеореклама с вознаграждением** - не ограничена по частоте, но должна быть добровольной

### Избегайте рекламного фрода
- Не вызывайте рекламу в случайные моменты
- Не используйте `setInterval` для автоматического показа
- Показывайте рекламу только по запросу пользователя или в естественных паузах

### Тестирование
1. Тестируйте на разных устройствах и ориентациях
2. Проверяйте работу рекламы в разных браузерах
3. Убедитесь, что интерфейс корректно адаптируется под рекламу

## 🔧 Дополнительные возможности

### Глобальные функции
```javascript
// Показать видеорекламу с вознаграждением
window.showRewardedVideo();

// Показать полноэкранную рекламу
window.showFullscreenAd();

// Переключить стики-баннер
window.toggleStickyBanner();
```

### События рекламы
```javascript
adsManager.on('onStickyBannerShow', () => {
    // Стики-баннер показан
});

adsManager.on('onFullscreenAdClose', (wasShown) => {
    // Полноэкранная реклама закрыта
});

adsManager.on('onRewardedVideoReward', () => {
    // Видеореклама просмотрена, выдаем награду
});
```

## 📞 Поддержка

При возникновении проблем с рекламой:
1. Проверьте настройки в Консоли разработчика
2. Убедитесь, что SDK Яндекс Игр корректно загружается
3. Проверьте логи в консоли браузера
4. Обратитесь в службу поддержки Яндекс Игр

---

**Удачной монетизации! 🎮💰** 