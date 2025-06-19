const ALL_ITEMS = [
    // --- ОБЫЧНЫЕ (Common) ---
    { id: 'lucky_clover', name: 'Счастливый клевер', desc: '+1 к удаче.', cost: 2, rarity: 'common', effect: { luck: 1 } },
    { id: 'scrap_metal', name: 'Копилка', desc: 'Каждый проигрышный спин добавляет 1💰 в Копилку. Разбивается в конце раунда.', cost: 4, rarity: 'common', effect: { on_loss_bonus: 1 } },
    { id: 'timepiece', name: 'Карманные часы', desc: 'Дает +1 прокрут в начале каждого раунда.', cost: 3, rarity: 'common', effect: { on_round_start_spins: 1 } },
    { id: 'resellers_ticket', name: 'Билет перекупщика', desc: 'Каждый раз, когда вы обновляете магазин, вы получаете 1🎟️ обратно.', cost: 5, rarity: 'common', effect: { on_reroll_bonus: { tickets: 1 } } },
    { id: 'growing_debt', name: 'Растущий Долг', desc: 'Дает +1 к Удаче за каждый пройденный Цикл Долга.\nБонус складывается: на 2-м цикле +2, на 3-м +3 и т.д.', cost: 5, rarity: 'common', effect: { per_run_bonus: { luck: 1 } } },
    { id: 'lucky_penny', name: 'Счастливая монетка', desc: 'Первый прокрут в каждом раунде всегда бесплатный.', cost: 3, rarity: 'common', effect: { first_spin_free: true } },
    { id: 'morning_coffee', name: 'Утренний Кофе', desc: 'Дает +3💰 в начале каждого раунда.', cost: 4, rarity: 'common', effect: { on_round_start_coins: 3 } },
    { id: 'coupon_book', name: 'Книжка с купонами', desc: 'Первая перекрутка магазина в каждом раунде бесплатна.', cost: 5, rarity: 'common', effect: { free_reroll_per_round: 1 } },
    { id: 'sticky_fingers', name: 'Липкие Пальцы', desc: '+1💰 за каждую выигрышную линию из 3 символов.', cost: 5, rarity: 'common', effect: { line_length_win_bonus: { length: 3, bonus: 1 } } },
    { id: 'broken_mirror', name: 'Треснувшее Зеркало', desc: 'Увеличивает множитель Диагональных линий на +1.', cost: 4, rarity: 'common', effect: { line_type_multiplier_bonus: { types: ["Диагональная"], bonus: 1 } } },
    { id: 'dusty_map', name: 'Пыльная Карта', desc: 'Увеличивает множитель Зиг-Заг линий на +2.', cost: 2, rarity: 'common', effect: { line_type_multiplier_bonus: { types: ["Зиг-Заг"], bonus: 2 } } },
    { id: 'lack_cat', name: 'Счастивый котик', desc: 'Если есть линия из 5+ символов, увеличивает выигрыш на процентную ставку банка.', cost: 1, rarity: 'common',
      on_spin_bonus: (grid, winAmount, state) => {
        // Проверяем, есть ли выигрышная линия из 5 и более символов
        if (!state || !state.lastWinningLines) return 0;
        const hasFive = state.lastWinningLines.some(line => line.positions.length >= 5);
        if (hasFive && winAmount > 0) {
          // Бонус равен winAmount * процентная ставка банка
          return Math.floor(winAmount * state.baseInterestRate);
        }
        return 0;
      }
    },
    { id: 'doubloon', name: 'Дублон', desc: 'С шансом 10% при каждом прокруте даёт +1 прокрут.', cost: 2, rarity: 'common',
      on_spin_bonus: (grid, winAmount, state) => {
        if (Math.random() < 0.1) {
          if (typeof showDoubloonPopup === 'function') showDoubloonPopup();
          if (state) state.spinsLeft += 1;
          return 0;
        }
        return 0;
      }
    },
    { id: 'silver_bell', name: 'Серебряный Колокольчик', desc: 'Символы Колокольчика 🔔 приносят в 1.5 раза больше 💰.', cost: 4, rarity: 'common', effect: { symbol_value_multiplier: { symbol: 'bell', multiplier: 1.5 } } },
    { id: 'vertical_boost', name: 'Вертикальный Бустер', desc: 'Вертикальные линии получают +2 к множителю.', cost: 4, rarity: 'common', effect: { line_type_multiplier_bonus: { types: ["Вертикальная"], bonus: 2 } } },
    { id: 'lucky_five', name: 'Пятёрка Удачи', desc: '5-символьные линии дополнительно дают +2💰.', cost: 3, rarity: 'common', effect: { on_line_win_bonus: { length: 5, coins: 2 } } },

    // --- РЕДКИЕ (Rare) ---
    { id: 'golden_ticket', name: 'Золотой билет', desc: '+2 к удаче.', cost: 5, rarity: 'rare', effect: { luck: 2 } },
    { id: 'architect_blueprint', name: 'Чертеж архитектора', desc: 'Горизонтальные и вертикальные линии получают +1 к множителю.', cost: 8, rarity: 'rare', effect: { line_type_multiplier_bonus: { types: ["Горизонтальная", "Вертикальная"], bonus: 1 } } },
    { id: 'cherry_bomb', name: 'Вишневая бомба', desc: 'Линии из Вишен 🍒 дополнительно дают +10💰.', cost: 7, rarity: 'rare', effect: { symbol_win_bonus: { symbol: 'cherry', bonus: 10 } } },
    { id: 'combo_counter', name: 'Множитель Комбо', desc: 'Бонус от КОМБО-выигрышей увеличивается на 50%.', cost: 8, rarity: 'rare', effect: { combo_bonus_multiplier: 1.5 } },
    { id: 'last_chance', name: 'Последний Шанс', desc: 'Последний прокрут в раунде получает множитель выигрыша x3.', cost: 6, rarity: 'rare', effect: { on_last_spin_bonus: { multiplier: 3 } } },
    { id: 'blood_ritual', name: 'Кровавый Ритуал', desc: 'Потратьте 2💰 в начале прокрута, чтобы получить +5 к Удаче (если >10💰).', cost: 7, rarity: 'rare', effect: { on_spin_sacrifice: { cost: 2, condition_coin: 10, bonus: { luck: 5 } } } },
    { id: 'twins_mirror', name: 'Зеркало Близнецов', desc: 'Горизонтальные линии выплат работают в обе стороны.', cost: 8, rarity: 'rare', effect: { pay_both_ways: true } },
    { id: 'ticket_printer', name: 'Принтер Талонов', desc: '5-символьные линии дополнительно дают +1🎟️.', cost: 7, rarity: 'rare', effect: { on_line_win_bonus: { length: 5, tickets: 1 } } },
    { id: 'shiny_bell', name: 'Блестящий Колокольчик', desc: 'Символы Колокольчика 🔔 приносят в 2 раза больше 💰.', cost: 6, rarity: 'rare', effect: { symbol_value_multiplier: { symbol: 'bell', multiplier: 2 } } },
    { id: 'telescope', name: 'Телескоп', desc: 'Увеличивает множитель линий "Небо/Земля" на +4.', cost: 7, rarity: 'rare', effect: { line_type_multiplier_bonus: { types: ["Небо/Земля"], bonus: 4 } } },
    { id: 'hourglass', name: 'Песочные Часы', desc: 'Дает +1 прокрут за каждые 10 прокрутов, которые вы делаете.', cost: 9, rarity: 'rare', effect: { on_spin_count_bonus: { count: 10, spins: 1 } } },
    { id: 'lucky_cherry', name: 'Везучая Вишня', desc: 'Символы Вишни 🍒 приносят в 2 раза больше 💰.', cost: 6, rarity: 'rare', effect: { symbol_value_multiplier: { symbol: 'cherry', multiplier: 2 } } },
    { id: 'zigzag_map', name: 'Карта Зигзага', desc: 'Зиг-Заг линии получают +3 к множителю.', cost: 5, rarity: 'rare', effect: { line_type_multiplier_bonus: { types: ["Зиг-Заг"], bonus: 3 } } },
    { id: 'ticket_machine', name: 'Машина Талонов', desc: '4-символьные линии дополнительно дают +1🎟️.', cost: 6, rarity: 'rare', effect: { on_line_win_bonus: { length: 4, tickets: 1 } } },

    // --- ЛЕГЕНДАРНЫЕ (Legendary) ---
    { id: 'lemon_zest', name: 'Цедра лимона', desc: 'Лимоны 🍋 считаются как Клеверы 🍀 для комбинаций.', cost: 9, rarity: 'legendary', effect: { substitute: { from: 'lemon', to: 'clover' } } },
    { id: 'money_magnet', name: 'Денежный магнит', desc: 'Символы 💰 дают +3💰 за каждый на поле.', cost: 6, rarity: 'legendary', on_spin_bonus: (grid) => grid.filter(s => s.id === 'coins').length * 3 },
    { id: 'fortune_charm', name: 'Амулет фортуны', desc: 'Увеличивает ВСЕ денежные выигрыши на 25%.', cost: 10, rarity: 'legendary', effect: { winMultiplier: 1.25 } },
    { id: 'double_down', name: 'Стеклянный Глаз', desc: 'Удваивает множитель для всех 5-символьных линий.', cost: 9, rarity: 'legendary', effect: { line_length_multiplier_bonus: { length: 5, multiplier: 2 } } },
    { id: 'sevens_pact', name: 'Пакт Семёрок', desc: 'Каждая 7️⃣ на поле увеличивает Удачу на 1 на этот прокрут.', cost: 12, rarity: 'legendary', effect: { temporary_luck_on_spin: 'seven' } },
    { id: 'all_seeing_eye', name: 'Всевидящее Око', desc: 'Открывает новую линию "Третий Глаз" (x5).', cost: 11, rarity: 'legendary', effect: { add_payline: { name: 'Третий Глаз', positions: [1, 6, 12, 8, 3], multiplier: 5, type: "Секретная" } } },
    { id: 'wild_clover', name: 'Дикий Клевер', desc: 'Символы Клевера 🍀 теперь являются "дикими" (заменяют любой символ).', cost: 15, rarity: 'legendary', effect: { wild_symbol: 'clover' } },
    { id: 'failure_filter', name: 'Фильтр Неудач', desc: 'Символы Лимона 🍋 полностью убираются из барабанов.', cost: 14, rarity: 'legendary', effect: { remove_symbol: 'lemon' } },
    { id: 'vault_key', name: 'Ключ от хранилища', desc: 'Базовая процентная ставка в банке увеличивается на 15%.', cost: 10, rarity: 'legendary', effect: { interest_rate_bonus: 0.15 } },
    { id: 'mimic_chest', name: 'Сундук-Мимик', desc: 'Копирует эффект случайного амулета в инвентаре каждый раунд.', cost: 13, rarity: 'legendary', effect: { mimic: true } },
    { id: 'seven_magnet', name: 'Магнит Семёрок', desc: 'Каждый прокрут гарантированно будет иметь как минимум одну 7️⃣ на поле.', cost: 16, rarity: 'legendary', effect: { guarantee_symbol: { symbol: 'seven', count: 1 } } },
    { id: 'rainbow_clover', name: 'Радужный Клевер', desc: 'Если на поле нет выигрышных линий, но есть все 7 видов символов, вы получаете +100💰.', cost: 12, rarity: 'legendary', on_spin_bonus: (grid, winAmount) => {
        if (winAmount > 0) return 0;
        const uniqueSymbols = new Set(grid.map(s => s.id));
        return uniqueSymbols.size === 7 ? 100 : 0;
    }},
    { id: 'quantum_entanglement', name: 'Квантовая Запутанность', desc: 'Символы в верхней левой и нижней правой ячейках всегда одинаковы.', cost: 11, rarity: 'legendary', effect: { sync_cells: { cells: [0, 14] } } },
    { id: 'bank_insurance', name: 'Банковская Страховка', desc: 'Процентная ставка в банке никогда не опускается ниже 20%.', cost: 10, rarity: 'legendary', effect: { min_interest_rate_floor: 0.20 } },
    { id: 'golden_lemon', name: 'Золотой Лимон', desc: 'Символы Лимона 🍋 приносят в 3 раза больше 💰.', cost: 10, rarity: 'legendary', effect: { symbol_value_multiplier: { symbol: 'lemon', multiplier: 3 } } },
    { id: 'lucky_seven_bonus', name: 'Бонус Семёрки', desc: '7-символьные линии дополнительно дают +7💰.', cost: 12, rarity: 'legendary', effect: { on_line_win_bonus: { length: 7, coins: 7 } } },
];