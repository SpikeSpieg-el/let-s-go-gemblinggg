# Анализ и Таблица Билдов

Ваша игра позволяет формировать несколько мощных стратегий (билдов), основанных на синергии амулетов и пассивных бонусов.

| Название Билда | Описание | Ключевые Амулеты | Усиливающие Амулеты | Полезные Пассивки |
|---|---|---|---|---|
| **"Банкир-Рантье"** | Максимизация дохода от процентов банка. Цель — как можно быстрее накопить большую сумму в банке и жить на проценты, минимально рискуя. | Vault Key, Bank Insurance | Small Investment, Morning Coffee (для стартового капитала на депозит), Frugal Mindset (чтобы больше денег оставалось для вклада) | Banker's Friend, Interest Spike, Financial Literacy, Major Investor, Calculated Risk |
| **"Госпожа Удача"** | Ставка на максимальное значение удачи. Цель — сделать дорогие символы (💎, 💰, 7️⃣) настолько частыми, чтобы каждый спин был выигрышным. | Lucky Charm (все варианты), Golden Ticket, Growing Debt, Luck Boost (x2, x3) | Echo Stone (срабатывает от luck_chance предметов), Sevens' Pact, Ticket Hoarder | Beginners' Luck, Hoarder's Pride, Learning from Mistakes, Anticipation (компенсирует несработавшие шансы) |
| **"Король Комбо"** | Построение билда вокруг получения множества выигрышных линий за один спин и умножения комбо-бонуса. | Combo Counter, Twins' Mirror, Echo Stone | All-Seeing Eye, Architect's Blueprint, Dusty Map, Telescope (любые предметы, добавляющие линии или множители типов линий) | Combo King, Chain Reaction, Almost There |
| **"Лимонный Тиран"** | Превращение самого слабого символа (🍋) в самый сильный и прибыльный. | Golden Lemon, Lemon Zest | Failure Filter (удалить 🍒, чтобы 🍋 стал единственным слабым символом), Wild Clover (клеверы становятся дикими, помогая собирать линии лимонов), Sour Profit | Golden Touch, Lemon More, Prosperity Clover (т.к. 🍋 становятся 🍀) |
| **"Машина Плоских Бонусов"** | Фокус на предметах, дающих фиксированный бонус (+N💰), и его многократном умножении. | Golden XDoubler, Golden XTripler, Golden XFour | Sticky Fingers, Cherry Bomb, Coin Rain, Minimalist, Hot Streak, Lack Cat (все, что дает плоский бонус) | Sticky Fingers Plus, Bell Ringer (также дает плоский бонус), Prosperity Clover |
| **"Вечный Двигатель"** | Генерация как можно большего количества бесплатных или очень дешевых прокрутов. | Doubloon, Hourglass, Timepiece, Lucky Penny | Luck Boost (x2, x3) (усиливает Дублон), Last Chance (каждый "последний" прокрут перед получением нового будет иметь x3 множитель) | Watchmaker's Precision, Frugal Spinner, Gambler's Delight |





Новые предметы для "Скрытых Билдов"
Вот 4 новых легендарных предмета. Каждый из них задуман как "ключевой камень" для билда, который становится невероятно сильным в связке с 2-3 другими предметами или пассивками.
Инструкция по добавлению:
Скопируйте код этих четырех предметов и вставьте его в массив ALL_ITEMS в вашем файле items.js. Лучше всего вставить их в секцию // --- ЛЕГЕНДАРНЫЕ (Legendary) ---.
Скопируйте и вставьте фрагменты кода для skript.js в указанные функции в этом файле.
1. Предмет: Вишнёвый Ликёр (Билд "Вишнёвый Взрыв")
Этот билд превращает самый обычный символ — вишню — в основной источник дохода, который не зависит от выигрышных линий.
Generated javascript
// Вставить в items.js
{
  id: 'cherry_liqueur',
  name: 'Вишнёвый Ликёр',
  desc: 'В конце выигрышного прокрута вы дополнительно получаете +1💰 за каждую Вишню 🍒 на поле. Этот бонус может быть удвоен.',
  cost: 14,
  rarity: 'legendary',
  thumbnail: '🍷',
  on_spin_bonus: (grid, winAmount, state) => {
      if (winAmount > 0) {
          const cherryCount = grid.filter(s => s.id === 'cherry').length;
          return cherryCount > 0 ? cherryCount : 0;
      }
      return 0;
  }
},
Use code with caution.
JavaScript
Скрытый билд:
Вишнёвый Ликёр 🍷: Даёт монеты за каждую вишню на поле при любом выигрыше.
Вишневая бомба 💣: Линии из вишен дают +10💰.
Везучая Вишня 🍒: Символы вишни приносят в 2 раза больше монет в линиях.
Пассивка "Вишнёвая удача": Вишни выпадают на 20% чаще.
(Ультимативная связка) Золотой X2/X3/X4 💸: Умножает бонус от Ликёра, превращая его в +2/+3/+4💰 за каждую вишню на поле.
Логика для skript.js:
В файле skript.js, в функции calculateWinnings, найдите блок с проверками бонусов от предметов (например, applyFruitSaladBonus) и добавьте этот код:
Generated javascript
// В функции calculateWinnings, после других проверок бонусов
if (hasItem('cherry_liqueur')) {
    const item = ALL_ITEMS.find(i => i.id === 'cherry_liqueur');
    let bonus = item.on_spin_bonus(grid, totalWinnings, state);
    if (bonus > 0) {
        bonus = applyCoinDoubler(bonus); // Применяем удвоитель!
        totalWinnings += bonus;
        addLog(`Вишнёвый Ликёр: +${formatNumberWithComma(bonus)}💰 за вишни на поле.`, 'win');
        animateInventoryItem('cherry_liqueur');
    }
}
Use code with caution.
JavaScript
2. Предмет: Договор с КракенОм (Билд "Поражение - это Победа")
Этот билд полностью меняет назначение Копилки. Вместо того чтобы спасать от полного провала, она становится машиной по генерации талонов для следующего, более сильного раунда.
Generated javascript
// Вставить в items.js
{
  id: 'kraken_pact',
  name: 'Договор с КракенОм',
  desc: 'В конце раунда ваша Копилка не разбивается на монеты. Вместо этого вы получаете 1🎟️ за каждые 10💰 в ней. Копилка обнуляется.',
  cost: 13,
  rarity: 'legendary',
  thumbnail: '🐙',
  effect: { converts_piggy_bank: true }
},
Use code with caution.
JavaScript
Скрытый билд:
Договор с КракенОм 🐙: Конвертирует накопленные в Копилке деньги в талоны.
Копилка 🐷: Основной предмет, который накапливает деньги с проигрышных спинов.
Пассивка "Профессиональная копилка": Удваивает доход Копилки.
Результат: Игрок может намеренно проигрывать весь раунд, накопить огромную сумму в Копилке, а в конце раунда получить 10-20-30+ талонов, чтобы на старте следующего раунда скупить весь магазин и стать невероятно сильным.
Логика для skript.js:
В файле skript.js, в функции confirmEndTurn, найдите блок, где разбивается копилка. Замените его на этот код:
Generated javascript
// В функции confirmEndTurn, перед state.turn++
if (state.piggyBank > 0) {
    if (hasItem('kraken_pact')) {
        const ticketsGained = Math.floor(state.piggyBank / 10);
        if (ticketsGained > 0) {
            state.tickets += ticketsGained;
            addLog(`Договор с КракенОм: Копилка (${formatNumberWithComma(state.piggyBank)}💰) обращена в +${ticketsGained}🎟️!`, 'win');
            animateInventoryItem('kraken_pact');
        }
        animateInventoryItem('scrap_metal');
    } else {
        addLog(`💥 Копилка разбита! Вы получили +${formatNumberWithComma(state.piggyBank)}💰.`, 'win');
        state.coins += state.piggyBank;
        animateInventoryItem('scrap_metal');
    }
    state.piggyBank = 0;
}
Use code with caution.
JavaScript
3. Предмет: Камень Предвкушения (Билд "Альфа-Спин")
Этот билд фокусирует всю мощь раунда в одном-единственном, первом прокруте, делая его потенциально самым прибыльным действием в игре.
Generated javascript
// Вставить в items.js
{
  id: 'anticipation_stone',
  name: 'Камень Предвкушения',
  desc: 'Выигрыш от ПЕРВОГО прокрута в раунде умножается на количество прокрутов, которые вы КУПИЛИ в начале раунда.',
  cost: 15,
  rarity: 'legendary',
  thumbnail: '⏳',
  effect: { first_spin_multiplier: true }
},
Use code with caution.
JavaScript
Скрытый билд:
Камень Предвкушения ⏳: Ключевой множитель.
Счастливая монетка 🪙: Делает первый прокрут бесплатным.
Пассивка "Удача новичка": Дает +10 к удаче на первый прокрут.
Механика: Игрок покупает самый дорогой пакет на 7 спинов. state.spinsPurchasedThisRound становится равен 7. Затем он делает свой первый спин. Камень Предвкушения умножает выигрыш на 7. А Счастливая монетка делает этот спин бесплатным, то есть у игрока так и остается 7 спинов. Он может получить огромный выигрыш и не потратить ни одного прокрута.
Логика для skript.js:
В объект state в функции initGame добавьте новое свойство:
Generated javascript
// В объекте state в initGame
spinsPurchasedThisRound: 0,
Use code with caution.
JavaScript
В функции startTurn сбрасывайте это значение:
Generated javascript
// В функции startTurn, в самом начале
state.spinsPurchasedThisRound = 0;
Use code with caution.
JavaScript
В функции buySpins отслеживайте, сколько спинов куплено:
Generated javascript
// В функции buySpins, внутри if (pkg) {...}
if (pkg) {
    // ... ваш существующий код ...
    state.spinsPurchasedThisRound = pkg.spins; // Добавить эту строку
    // ...
}
Use code with caution.
JavaScript
В функции calculateWinnings добавьте логику множителя:
Generated javascript
// В функции calculateWinnings, ПЕРЕД применением общих множителей (winMultiplier)
if (hasItem('anticipation_stone') && state.roundSpinsMade === 1 && state.spinsPurchasedThisRound > 0 && totalWinnings > 0) {
    const multiplier = state.spinsPurchasedThisRound;
    const bonus = totalWinnings * (multiplier - 1);
    totalWinnings += bonus;
    addLog(`Камень Предвкушения: x${multiplier} к первому спину! (+${formatNumberWithComma(bonus)}💰)`, 'win');
    animateInventoryItem('anticipation_stone');
}
Use code with caution.
JavaScript
4. Предмет: Корона Монарха (Билд "Охотник за Джекпотами")
Этот билд превращает джекпот из просто большого выигрыша в событие, которое может обеспечить победу в цикле за счет огромного притока талонов.
Generated javascript
// Вставить в items.js
{
  id: 'monarch_crown',
  name: 'Корона Монарха',
  desc: 'Если вы собираете полное поле (15) одинаковых символов (Джекпот), вы дополнительно получаете +25🎟️.',
  cost: 16,
  rarity: 'legendary',
  thumbnail: '👑',
  effect: { jackpot_ticket_bonus: 25 }
},
Use code with caution.
JavaScript
Скрытый билд:
Корона Монарха 👑: Главная награда за джекпот.
Фильтр Неудач 🗑️: Удаляет лимоны, резко повышая шанс собрать поле из другого символа.
Магнит Семёрок 🧲: Гарантирует одну 7, что немного повышает шанс на джекпот из семёрок.
Квантовая Запутанность ⚛️: Синхронизирует 2 ячейки, что также является небольшим, но постоянным бонусом к шансу на джекпот.
Любые предметы и пассивки на Удачу.
Логика для skript.js:
В файле skript.js, в функции calculateWinnings, найдите блок проверки джекпота (if (topCount === 15)). Добавьте туда проверку на наличие Короны.
Generated javascript
// В функции calculateWinnings
if (topCount === 15) {
    // ... ваш существующий код для джекпота (расчет jackpotWin, лог, анимация) ...

    // ДОБАВИТЬ ЭТОТ БЛОК:
    if (hasItem('monarch_crown')) {
        const ticketBonus = ALL_ITEMS.find(i => i.id === 'monarch_crown').effect.jackpot_ticket_bonus;
        state.tickets += ticketBonus;
        addLog(`Корона Монарха: +${ticketBonus}🎟️ за Джекпот!`, 'win');
        animateInventoryItem('monarch_crown');
    }

    // ... ваш существующий код для джекпота (setTimeout с оверлеем) ...
} // ...