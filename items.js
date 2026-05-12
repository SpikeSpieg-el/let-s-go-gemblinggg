const ALL_ITEMS = [
  // --- БЛОК ПРЕДМЕТОВ СВЯЗАННЫХ С ВИШНЕЙ ---
  { id: 'fruit_salad', name: 'Фруктовый салат', desc: 'Каждая пара соседних (не по диагонали) 🍋 и 🍒 на поле даёт +1💲.', cost: 2, rarity: 'common', thumbnail: '🥗', on_spin_bonus: (grid) => { /* Логика в skript.js */ } },
  { id: 'cherry_bomb', name: 'Вишневая бомба', desc: 'Линии из вишен 🍒 приносят дополнительно +10💲.', cost: 7, rarity: 'rare', thumbnail: '💣', effect: { symbol_win_bonus: { symbol: 'cherry', bonus: 10 } } },
  { id: 'lucky_cherry', name: 'Везучая Вишня', desc: 'Символы 🍒 приносят в 2 раза больше 💲.', cost: 6, rarity: 'rare', thumbnail: '🍒', effect: { symbol_value_multiplier: { symbol: 'cherry', multiplier: 2 } } },
  { id: 'cherry_catalyst', name: 'Катализатор Вишни', desc: 'Символы 🍒 приносят в 2 раза больше 💲. Линии из вишен 🍒 дополнительно приносят +15💲.', cost: 8, rarity: 'rare', thumbnail: '🍒', effect: { symbol_value_multiplier: { symbol: 'cherry', multiplier: 2 }, symbol_win_bonus: { symbol: 'cherry', bonus: 15 } } },
  { id: 'gardening_shears', name: 'Садовые Ножницы', desc: 'Увеличивает базовую ценность Вишен 🍒 на 2.', cost: 6, rarity: 'rare', thumbnail: '✂️', effect: { base_value_increase: { symbols: ['cherry'], amount: 2 } } },
  { id: 'wild_cherry', name: 'Дикая вишня', desc: 'Символы 🍒 становятся дикими (заменяют любой символ при подсчёте).', cost: 14, rarity: 'legendary', thumbnail: '🃏🍒', effect: { wild_symbol: 'cherry' } },
  { id: 'royal_cherry_upgrade', name: 'Королевская селекция', desc: 'Улучшает вишни 🍒 до королевского сорта. Увеличивает их базовую ценность на 3, а выигрышные линии из вишен дополнительно приносят +25💲.', cost: 13, rarity: 'legendary', thumbnail: '👑🍒', effect: { base_value_increase: { symbols: ['cherry'], amount: 3 }, symbol_win_bonus: { symbol: 'cherry', bonus: 25 } } },
  { id: 'magnifying_glass', name: 'Лупа', desc: 'Увеличивает базовую ценность Клеверов 🍀 и Вишен 🍒 на 1.', cost: 5, rarity: 'common', thumbnail: '🔎', effect: { base_value_increase: { symbols: ['clover', 'cherry'], amount: 1 } } },
  { id: 'cherry_value_engine', name: 'Двигатель Вишни', desc: 'Пока этот предмет в инвентаре, в магазине появляются усилители 🍒. Усилители дают +1 к номиналу 🍒 и не занимают слот.', cost: 8, rarity: 'rare', thumbnail: '🍒⚙️' },
  { id: 'cherry_value_boost_token', name: 'Усилитель Вишни (+1)', desc: 'При покупке увеличивает базовую ценность 🍒 на 1. Не занимает место в инвентаре. Можно купить несколько раз.', cost: 4, rarity: 'special', thumbnail: '🍒✨', effect: { base_value_increase: { symbols: ['cherry'], amount: 1 }, ignore_slot_for_empty_bonus: true, is_cherry_boost_token: true } },
  // --- КОНЕЦ БЛОКА ВИШНИ ---

  // --- ОБЫЧНЫЕ (Common) ---
  { id: 'lucky_clover', name: 'Счастливый клевер', desc: 'Даёт +1 к удаче.', cost: 1, rarity: 'common', thumbnail: 'клевер_удачи.png', effect: { luck: 1 } },
  { id: 'scrap_metal', name: 'Копилка', desc: 'Каждый проигрышный прокрут приносит в копилку +1💲 x на текущий раунд. Бонус от копилки начисляеться в конце раунда.', cost: 3, rarity: 'common', thumbnail: 'свинка_монеты.png', effect: { on_loss_bonus: 1 } },
  { id: 'timepiece', name: 'Карманные часы', desc: 'Даёт +1 прокрут в начале каждого раунда.', cost: 2, rarity: 'common', thumbnail: 'карманные_часы.png', effect: { on_round_start_spins: 1 } },
  { id: 'resellers_ticket', name: 'Билет перекупщика', desc: 'За каждый реролл магазина возвращает +1🎟️.', cost: 5, rarity: 'common', thumbnail: '🔄', effect: { on_reroll_bonus: { tickets: 1 } } },
  { id: 'growing_debt', name: 'Растущий Долг', desc: 'Даёт +1 к удаче за каждый цикл.', cost: 5, rarity: 'common', thumbnail: '📈', effect: { per_run_bonus: { luck: 1 } } },
  { id: 'lucky_penny', name: 'Счастливая монетка', desc: 'Первый прокрут в каждом раунде бесплатен.', cost: 1, rarity: 'common', thumbnail: '🪙', effect: { first_spin_free: true } },
  { id: 'morning_coffee', name: 'Утренний кофе', desc: 'В начале каждого раунда даёт +3💲.', cost: 4, rarity: 'common', thumbnail: '☕', effect: { on_round_start_coins: 3 } },
  { id: 'coupon_book', name: 'Книжка с купонами', desc: 'Первый реролл магазина в каждом раунде бесплатен.', cost: 3, rarity: 'common', thumbnail: '✂️', effect: { free_reroll_per_round: 1 } },
  { id: 'sticky_fingers', name: 'Липкие пальцы', desc: 'Линии из 3 символов приносят дополнительно +1💲.', cost: 2, rarity: 'common', thumbnail: '🤏', effect: { line_length_win_bonus: { length: 3, bonus: 1 } } },
  { id: 'broken_mirror', name: 'Треснувшее зеркало', desc: 'Диагональные линии получают +1 к множителю.', cost: 2, rarity: 'common', thumbnail: '↘️', effect: { line_type_multiplier_bonus: { types: ["Диагональная"], bonus: 1 } } },
  { id: 'dusty_map', name: 'Пыльная карта', desc: 'Зиг-Заг линии получают +2 к множителю.', cost: 3, rarity: 'common', thumbnail: '🗺️', effect: { line_type_multiplier_bonus: { types: ["Зиг-Заг"], bonus: 2 } } },
  { id: 'lack_cat', name: 'Кот Удачи', desc: 'Если есть выигрышная линия из 5+ символов, выигрыш увеличивается на текущую ставку банка.', cost: 1, rarity: 'common', thumbnail: '🐱',
    on_spin_bonus: (grid, winAmount, state) => {
      if (!state || !state.lastWinningLines) return 0;
      const hasFive = state.lastWinningLines.some(line => line.positions.length >= 5);
      if (hasFive && winAmount > 0) {
        return Math.floor(winAmount * state.baseInterestRate);
      }
      return 0;
    }
  },
  { id: 'doubloon', name: 'Дублон', desc: 'С шансом 10% каждый прокрут даёт +1 дополнительный прокрут.', cost: 2, rarity: 'rare', thumbnail: '🏴',
    effect: { luck_chance: { chance: 0.1 } } },
  { id: 'silver_bell', name: 'Серебряный колокольчик', desc: 'Символы 🔔 приносят в 1.5 раза больше 💲.', cost: 4, rarity: 'common', thumbnail: '🔔', effect: { symbol_value_multiplier: { symbol: 'bell', multiplier: 1.5 } } },
  { id: 'vertical_boost', name: 'Вертикальный бустер', desc: 'Вертикальные линии получают +2 к множителю.', cost: 4, rarity: 'common', thumbnail: '🚦', effect: { line_type_multiplier_bonus: { types: ["Вертикальная"], bonus: 2 } } },
  { id: 'lucky_five', name: 'Пятёрка удачи', desc: 'Линии из 5 символов приносят дополнительно +20💲.', cost: 3, rarity: 'common', thumbnail: '🖐️', effect: { on_line_win_bonus: { length: 5, coins: 20 } } },

  
  { id: 'central_focus', name: 'Центральный фокус', desc: 'Выигрышные линии, проходящие через центральную колонку, приносят дополнительно +2💲.', cost: 3, rarity: 'common', thumbnail: '🎯', effect: { on_line_win_bonus: { in_column: 2, coins: 2 } } },
  { id: 'desperate_measures', name: 'Отчаянные меры', desc: 'Даёт +2 к удаче, если у вас меньше 10💲 в начале прокрута.', cost: 2, rarity: 'common', thumbnail: '🙏', effect: { on_spin_luck_bonus: { condition_coin_less: 10, bonus: 2 } } },
  { id: 'straight_path', name: 'Прямой путь', desc: 'Горизонтальные линии получают +1 к множителю.', cost: 3, rarity: 'common', thumbnail: '➖', effect: { line_type_multiplier_bonus: { types: ["Горизонтальная"], bonus: 1 } } },
  { id: 'ringing_luck', name: 'Звонкая удача', desc: 'Каждый символ 🔔 на поле даёт +1 к удаче на этот прокрут.', cost: 4, rarity: 'common', thumbnail: '🛎️', effect: { temporary_luck_on_spin: 'bell' } },
  
  { id: 'hot_streak', name: 'На волне успеха', desc: 'Каждый выигрышный прокрут подряд (после первого) даёт дополнительно +2💲.', cost: 4, rarity: 'common', thumbnail: '☄️', effect: { on_win_streak_bonus: 2 } },
  { id: 'sweet_spin', name: 'Сладкий прокрут', desc: 'Если на поле нет лимонов 🍋, вы получаете +3💲.', cost: 3, rarity: 'common', thumbnail: '🍬', on_spin_bonus: (grid) => { /* Логика в skript.js */ } },
  { id: 'small_investment', name: 'Малая инвестиция', desc: 'Впервые внося деньги в банк в каждом раунде, вы получаете +1🎟️.', cost: 4, rarity: 'common', thumbnail: '🏦', effect: { on_first_deposit_bonus: { tickets: 1 } } },
  { id: 'shiny_rock', name: 'Блестящий камень', desc: 'Символы 💎 приносят в 1.5 раза больше 💲.', cost: 4, rarity: 'common', thumbnail: '💎', effect: { symbol_value_multiplier: { symbol: 'diamond', multiplier: 1.5 } } },
  { id: 'barter_skills', name: 'Навык бартера', desc: 'Все амулеты в магазине стоят на 1🎟️ дешевле (минимум 1🎟️).', cost: 5, rarity: 'common', thumbnail: '🤝', effect: { shop_discount: 1 } },
  { id: 'clover_field', name: 'Клеверное поле', desc: 'Если на поле 5 или больше клеверов 🍀, вы получаете +5💲.', cost: 3, rarity: 'common', thumbnail: '🌿', on_spin_bonus: (grid) => { /* Логика в skript.js */ } },
  { id: 'almost_perfect', name: 'Почти идеально', desc: 'Линии из 4 символов приносят дополнительно +10💲.', cost: 3, rarity: 'common', thumbnail: '👍', effect: { on_line_win_bonus: { length: 4, coins: 10 } } },
  { id: 'sour_profit', name: 'Кислая прибыль', desc: 'Выигрышные линии из лимонов 🍋 приносят дополнительно +1🎟️.', cost: 4, rarity: 'common', thumbnail: '🍋', effect: { symbol_win_bonus_ticket: { symbol: 'lemon', tickets: 1 } } },
  { id: 'bookends', name: 'Книжные подпорки', desc: 'Если символы в левом верхнем и правом нижнем углах совпадают, вы получаете +4💲.', cost: 2, rarity: 'common', thumbnail: '📚', on_spin_bonus: (grid) => { /* Логика в skript.js */ } },
  
  { id: 'minimalist', name: 'Минималист', desc: 'Даёт +1💲 за каждый пустой слот для амулета (бонус применяется после выигрыша).', cost: 3, rarity: 'common', thumbnail: '📦', effect: { per_empty_slot_bonus: 1 } },
  {
    id: 'hoarders_pride',
    name: 'Гордость барахольщика',
    desc: 'Даёт +1 к удаче за каждый пустой слот для амулета.',
    cost: 3,
    rarity: 'common',
    thumbnail: '📦',
    effect: { per_empty_slot_luck: 1 }
  },
  {
    id: 'slot_illusionist',
    name: 'Иллюзионист слотов',
    desc: 'Все предметы, дающие бонус за пустой слот, не занимают место в инвентаре (включая этот предмет).',
    cost: 7,
    rarity: 'rare',
    thumbnail: '🎩',
    effect: { ignore_slot_for_empty_bonus: true }
  },

  { id: 'early_bird_spins', name: 'Ранняя пташка', desc: 'Ваши первые 3 прокрута в каждом раунде получают +1 к множителю на все выигрыши.', cost: 4, rarity: 'common', thumbnail: '🐦', effect: { first_spins_bonus: { count: 3, multiplier_add: 1 } } },
  { id: 'ticket_hoarder', name: 'Коллекционер талонов', desc: 'Дает +1 к удаче за каждые 5🎟️, которые у вас есть.', cost: 2, rarity: 'common', thumbnail: '🧐', effect: { per_ticket_luck: { per: 5, luck: 1 } } },
  { id: 'oddly_lucky', name: 'Странная удача', desc: 'В нечетные раунды (1-й и 3-й) все денежные выигрыши увеличены на 20%.', cost: 4, rarity: 'common', thumbnail: '🌗', effect: { odd_round_multiplier: 1.2 } },

  // --- РЕДКИЕ (Rare) ---
  { id: 'golden_ticket', name: 'Золотой билет', desc: 'Даёт +2 к удаче.', cost: 5, rarity: 'rare', thumbnail: '🎟️', effect: { luck: 2 } },
  { id: 'architect_blueprint', name: 'Чертеж архитектора', desc: 'Горизонтальные и вертикальные линии получают +1 к множителю.', cost: 8, rarity: 'rare', thumbnail: '📐', effect: { line_type_multiplier_bonus: { types: ["Горизонтальная", "Вертикальная"], bonus: 1 } } },
  { id: 'combo_counter', name: 'Множитель Комбо', desc: 'Бонус от комбо-выигрышей увеличивается на 50%.', cost: 8, rarity: 'rare', thumbnail: '🔥', effect: { combo_bonus_multiplier: 1.5 } },
  { id: 'last_chance', name: 'Последний Шанс', desc: 'Последний прокрут в раунде получает множитель выигрыша x3.', cost: 6, rarity: 'rare', thumbnail: '🚨', effect: { on_last_spin_bonus: { multiplier: 3 } } },
  { id: 'blood_ritual', name: 'Кровавый Ритуал', desc: 'В начале прокрута, если у вас больше 10💲, тратите 2💲 и получаете +5 к удаче.', cost: 7, rarity: 'rare', thumbnail: '🩸', effect: { on_spin_sacrifice: { cost: 2, condition_coin: 10, bonus: { luck: 5 } } } },
  { id: 'twins_mirror', name: 'Зеркало Близнецов', desc: 'Горизонтальные линии выплат работают в обе стороны.', cost: 8, rarity: 'rare', thumbnail: '↔️', effect: { pay_both_ways: true } },
  { id: 'ticket_printer', name: 'Принтер Талонов', desc: 'Линии из 5 символов приносят дополнительно +1🎟️.', cost: 7, rarity: 'rare', thumbnail: '📠', effect: { on_line_win_bonus: { length: 5, tickets: 1 } } },
  { id: 'shiny_bell', name: 'Блестящий Колокольчик', desc: 'Символы 🔔 приносят в 2 раза больше 💲.', cost: 6, rarity: 'rare', thumbnail: '✨', effect: { symbol_value_multiplier: { symbol: 'bell', multiplier: 2 } } },
  { id: 'telescope', name: 'Телескоп', desc: 'Линии "Небо/Земля" получают +4 к множителю.', cost: 7, rarity: 'rare', thumbnail: '🔭', effect: { line_type_multiplier_bonus: { types: ["Небо/Земля"], bonus: 4 } } },
  { id: 'hourglass', name: 'Песочные Часы', desc: 'За каждые 10 прокрутов даёт +1 дополнительный прокрут.', cost: 9, rarity: 'rare', thumbnail: '⏳', effect: { on_spin_count_bonus: { count: 10, spins: 1 } } },
  { id: 'zigzag_map', name: 'Карта Зигзага', desc: 'Зиг-Заг линии получают +3 к множителю.', cost: 5, rarity: 'rare', thumbnail: '📍', effect: { line_type_multiplier_bonus: { types: ["Зиг-Заг"], bonus: 3 } } },
  { id: 'ticket_machine', name: 'Машина Талонов', desc: 'Линии из 4 символов приносят дополнительно +1🎟️.', cost: 6, rarity: 'rare', thumbnail: '🎰', effect: { on_line_win_bonus: { length: 4, tickets: 1 } } },
  { id: 'golden_Xdoubler', name: 'Золотой X2', desc: 'X2 все бонусы монет, которые начисляются напрямую предметами.', cost: 4, rarity: 'rare', thumbnail: '💸', effect: { double_flat_coin_bonus: 2 } },
  { id: 'golden_Xtripler', name: 'Золотой X3', desc: 'X3 все бонусы монет, которые начисляются напрямую предметами.', cost: 8, rarity: 'rare', thumbnail: '💎', effect: { double_flat_coin_bonus: 3 } },
  
  // --- ПРЕДМЕТЫ ПОЗОЛОТА ДЛЯ КАЖДОГО СИМВОЛА ---
  { id: 'golden_lemon_polish', name: 'Позолота лимона', desc: 'С шансом 20% каждый прокрут превращает символ 🍋 в золотой (его номинал умножается на 3).', cost: 6, rarity: 'rare', thumbnail: '🍋✨', effect: { golden_symbol_chance: { symbol: 'lemon', chance: 0.20, multiplier: 3 } } },
  { id: 'golden_cherry_polish', name: 'Позолота вишни', desc: 'С шансом 20% каждый прокрут превращает символ 🍒 в золотой (его номинал умножается на 3).', cost: 6, rarity: 'rare', thumbnail: '🍒✨', effect: { golden_symbol_chance: { symbol: 'cherry', chance: 0.20, multiplier: 3 } } },
  { id: 'golden_clover_polish', name: 'Позолота клевера', desc: 'С шансом 20% каждый прокрут превращает символ 🍀 в золотой (его номинал умножается на 3).', cost: 6, rarity: 'rare', thumbnail: '🍀✨', effect: { golden_symbol_chance: { symbol: 'clover', chance: 0.20, multiplier: 3 } } },
  { id: 'golden_bell_polish', name: 'Позолота колокольчика', desc: 'С шансом 20% каждый прокрут превращает символ 🔔 в золотой (его номинал умножается на 3).', cost: 6, rarity: 'rare', thumbnail: '🔔✨', effect: { golden_symbol_chance: { symbol: 'bell', chance: 0.20, multiplier: 3 } } },
  { id: 'golden_diamond_polish', name: 'Позолота алмаза', desc: 'С шансом 20% каждый прокрут превращает символ 💎 в золотой (его номинал умножается на 3).', cost: 6, rarity: 'rare', thumbnail: '💎✨', effect: { golden_symbol_chance: { symbol: 'diamond', chance: 0.20, multiplier: 3 } } },
  { id: 'golden_coins_polish', name: 'Позолота монет', desc: 'С шансом 20% каждый прокрут превращает символ 💰 в золотой (его номинал умножается на 3).', cost: 6, rarity: 'rare', thumbnail: '💰✨', effect: { golden_symbol_chance: { symbol: 'coins', chance: 0.20, multiplier: 3 } } },
  { id: 'golden_seven_polish', name: 'Позолота семёрки', desc: 'С шансом 20% каждый прокрут превращает символ 7️⃣ в золотой (его номинал умножается на 3).', cost: 6, rarity: 'rare', thumbnail: '7️✨', effect: { golden_symbol_chance: { symbol: 'seven', chance: 0.20, multiplier: 3 } } },

  

  // --- ЛЕГЕНДАРНЫЕ (Legendary) ---
  { id: 'lemon_zest', name: 'Цедра лимона', desc: 'Лимоны 🍋 считаются как клеверы 🍀 для комбинаций.', cost: 9, rarity: 'legendary', thumbnail: 'image3.png', effect: { substitute: { from: 'lemon', to: 'clover' } } },
  { id: 'money_magnet', name: 'Денежный магнит', desc: 'Каждый символ 💲 на поле даёт +3💲.', cost: 6, rarity: 'legendary', thumbnail: '🧲',
    on_spin_bonus: (grid, winAmount, state) => {
        let bonus = 0;
        const coinSymbols = grid.filter(s => s && s.id === 'coins').length;
        if (coinSymbols > 0) {
            bonus += coinSymbols * 3;
        }
        // Пассивка "Магнитная личность"
        if (state.activePassives && state.activePassives.some(p => p.id === 'magnetic_personality')) {
            const diamondSymbols = grid.filter(s => s && s.id === 'diamond').length;
            if (diamondSymbols > 0) {
                bonus += diamondSymbols * 1;
            }
        }
        return bonus;
    }
  },
  { id: 'fortune_charm', name: 'Амулет фортуны', desc: 'Увеличивает все денежные выигрыши на 25%.', cost: 10, rarity: 'legendary', thumbnail: '🎭', effect: { winMultiplier: 1.25 } },
  { id: 'double_down', name: 'Стеклянный Глаз', desc: 'Линии из 5 символов получают множитель x2.', cost: 9, rarity: 'legendary', thumbnail: '👁️', effect: { line_length_multiplier_bonus: { length: 5, multiplier: 2 } } },
  { id: 'sevens_pact', name: 'Пакт Семёрок', desc: 'Каждая 7️⃣ на поле даёт +1 к удаче на этот прокрут.', cost: 9, rarity: 'legendary', thumbnail: '7️⃣', effect: { temporary_luck_on_spin: 'seven' } },
  { id: 'all_seeing_eye', name: 'Всевидящее Око', desc: 'Открывает новую линию "Третий Глаз" (x5).', cost: 11, rarity: 'legendary', thumbnail: '👁️', effect: { add_payline: { name: 'Третий Глаз', positions: [1, 6, 12, 8, 3], multiplier: 5, type: "Секретная" } } },
  { id: 'wild_clover', name: 'Дикий Клевер', desc: 'Символы 🍀 становятся дикими (заменяют любой символ при подсчёте).', cost: 15, rarity: 'legendary', thumbnail: '🃏', effect: { wild_symbol: 'clover' } },
  { id: 'failure_filter', name: 'Фильтр Неудач', desc: 'Символы 🍋 полностью убираются из барабанов.', cost: 14, rarity: 'legendary', thumbnail: '🗑️', effect: { remove_symbol: 'lemon' } },
  { id: 'vault_key', name: 'Ключ от хранилища', desc: 'Базовая процентная ставка в банке увеличивается на 15%.', cost: 10, rarity: 'legendary', thumbnail: '🔑', effect: { interest_rate_bonus: 0.15 } },
  { id: 'mimic_chest', name: 'Сундук-Мимик', desc: 'В начале каждого раунда копирует эффект случайного амулета в инвентаре.', cost: 13, rarity: 'legendary', thumbnail: '❓', effect: { mimic: true } },
  { id: 'seven_magnet', name: 'Магнит Семёрок', desc: 'Каждый прокрут гарантированно содержит хотя бы одну 7️⃣ на поле.', cost: 16, rarity: 'legendary', thumbnail: '🧲', effect: { guarantee_symbol: { symbol: 'seven', count: 1 } } },
  { id: 'rainbow_clover', name: 'Радужный Клевер', desc: 'Если нет выигрышных линий, но есть все 7 видов символов, вы получаете +100💲 за каждый цикл.', cost: 12, rarity: 'legendary', thumbnail: '🌈', on_spin_bonus: (grid, winAmount, state) => {
      if (winAmount > 0) return 0;
      const uniqueSymbols = new Set(grid.map(s => s.id));
      return uniqueSymbols.size === 7 ? 100 * (state?.run || 1) : 0;
  }},
  { id: 'quantum_entanglement', name: 'Квантовая Запутанность', desc: 'Символы в верхней левой и нижней правой ячейках всегда одинаковы.', cost: 11, rarity: 'legendary', thumbnail: '⚛️', effect: { sync_cells: { cells: [0, 14] } } },
  { id: 'bank_insurance', name: 'Банковская Страховка', desc: 'Процентная ставка в банке не опускается ниже 20%.', cost: 10, rarity: 'legendary', thumbnail: '🛡️', effect: { min_interest_rate_floor: 0.20 } },
  { id: 'golden_lemon', name: 'Золотой Лимон', desc: 'Символы 🍋 приносят в 3 раза больше 💲.', cost: 10, rarity: 'legendary', thumbnail: 'image1.png', effect: { symbol_value_multiplier: { symbol: 'lemon', multiplier: 3 } } },
  { id: 'lucky_seven_bonus', name: 'Бонус Семёрки', desc: 'Выигрышные линии из 7️⃣ приносят дополнительно +7💲.', cost: 12, rarity: 'legendary', thumbnail: '7️⃣🌟', effect: { symbol_win_bonus: { symbol: 'seven', bonus: 7 } } },

  { id: 'reality_glitch', name: 'Сбой реальности', desc: 'Каждый прокрут есть 1% шанс что случится "глич": получите выигрыш как будто выпали все одинаковые символы.', cost: 25, rarity: 'legendary', thumbnail: '📺', effect: {   reality_glitch: { chance: 0.01 } }},
  { 
    id: 'slot_machine_heart', 
    name: 'Сердце автомата', 
    desc: 'Превращает одну случайную ячейку в "джекпот". Если в ней выпадет выйгрышная 7️⃣, умножение x100.', 
    cost: 35, 
    rarity: 'legendary', 
    thumbnail: '💖', 
    effect: { 
      jackpot_cell: { symbol: 'seven', multiplier: 100 } 
    } 
  },
  { 
    id: 'luck_battery', 
    name: 'Батарея удачи', 
    desc: 'Накапливает +1 удачу за каждый неудачный прокрут (без выигрыша). При выигрыше тратит всю накопленную удачу для увеличения выигрыша.', 
    cost: 19, 
    rarity: 'legendary', 
    thumbnail: '🔋', 
    effect: { 
      luck_accumulator: true 
    } 
  },
  // --- НОВЫЕ ПРЕДМЕТЫ УДАЧИ ---
  { id: 'lucky_charm_5', name: 'Клевер Судьбы', desc: '+5 к удаче с шансом 10% при каждом прокруте. После 10 срабатываний ломается', cost: 2, rarity: 'common', uses: 10, thumbnail: 'image.png', effect: { luck_chance: { luck: 5, chance: 0.10, breakable: true, max_uses: 10 } } },
  { id: 'lucky_charm_3', name: 'Талисман Фортуны', desc: '+3 к удаче с шансом 20% при каждом прокруте. После 8 срабатываний ломается', cost: 1, rarity: 'common', uses: 8, thumbnail: '🔮', effect: { luck_chance: { luck: 3, chance: 0.20, breakable: true, max_uses: 8 } } },
  { id: 'lucky_charm_7', name: 'Звезда Везения', desc: '+7 к удаче с шансом 18% при каждом прокруте.', cost: 10, rarity: 'rare', thumbnail: '⭐', effect: { luck_chance: { luck: 7, chance: 0.18, breakable: false } } },
  { id: 'lucky_charm_99', name: 'Слеза Богини Удачи', desc: '+99 к удаче с шансом 2% при каждом прокруте.', cost: 20, rarity: 'legendary', thumbnail: 'image4.png', effect: { luck_chance: { luck: 99, chance: 0.02 } } },
  // --- ПРЕДМЕТЫ ДЛЯ УВЕЛИЧЕНИЯ ШАНСА ---
  { id: 'luck_boost_2x', name: 'Кубок Азарта', desc: 'Увеличивает шанс срабатывания всех предметов удачи.', cost: 5, rarity: 'rare', thumbnail: '🏆', effect: { luck_chance_multiplier: 1.3 } },
  { id: 'luck_boost_3x', name: 'Зеркало Судьбы', desc: 'Удваивает шанс срабатывания всех предметов удачи.', cost: 7, rarity: 'legendary', thumbnail: '🪞', effect: { luck_chance_multiplier: 2 } },
  { id: 'golden_Xfour', name: 'Золотой X4', desc: 'X4 все бонусы монет, которые начисляются напрямую предметами (например, +2💲, дополнительно дают +10💲 и т.д.).', cost: 12, rarity: 'legendary', thumbnail: '💸', effect: { double_flat_coin_bonus: 4 } },
  { id: 'echo_stone', name: 'Эхо-Камень', desc: 'Увеличивает множитель выигрыша на +1 за каждый ДРУГОЙ амулет, сработавший в этом прокруте. Множитель сбрасывается каждый ход.', cost: 18, rarity: 'legendary', thumbnail: '💫', effect: { is_echo_stone: true } },
  
  // --- НОВЫЕ ПРЕДМЕТЫ LUCK_CHANCE (без эффекта удачи) ---
  { id: 'coin_rain', name: 'Монетный дождь', desc: 'С шансом 15% каждый прокрут даёт +15💲.', cost: 3, rarity: 'common', thumbnail: '🌧️', effect: { luck_chance: { coins: 15, chance: 0.15 } } },
  { id: 'ticket_shower', name: 'Ливень талонов', desc: 'С шансом 8% каждый прокрут даёт +2🎟️.', cost: 4, rarity: 'common', thumbnail: '🎫', effect: { luck_chance: { tickets: 2, chance: 0.08 } } },
  { id: 'free_spin_charm', name: 'Талисман бесплатного прокрута', desc: 'С шансом 12% даёт +1 бесплатный прокрут. Ломаеться после 8 использований', cost: 5, rarity: 'rare', thumbnail: '🎰', effect: { luck_chance: { free_spins: 1, chance: 0.12, breakable: true, max_uses: 8 } } },
  { id: 'bank_bonus', name: 'Банковская премия', desc: 'С шансом 5% увеличивает процентную ставку банка на 5% на этот раунд.', cost: 6, rarity: 'rare', thumbnail: '🏦', effect: { luck_chance: { interest_bonus: 0.05, chance: 0.05 } } },
  { id: 'multiplier_surge', name: 'Всплеск множителя', desc: 'С шансом 3% все выигрыши в этом прокруте умножаются на 2.', cost: 8, rarity: 'legendary', thumbnail: '⚡', effect: { luck_chance: { win_multiplier: 2, chance: 0.03 } } },
  
  
  // --- НОВЫЕ ПРЕДМЕТЫ BREAKABLE ---
  { id: 'lucky_dice', name: 'Счастливые кости', desc: 'С шансом 25% каждый прокрут даёт +20💲. Ломается после 20 срабатываний.', cost: 3, rarity: 'rare', thumbnail: '🎲', effect: { luck_chance: { coins: 20, chance: 0.25, breakable: true, max_uses: 20 } } },
  { id: 'glass_heart', name: 'Стеклянное сердце', desc: 'Даёт +3 к удаче. Ломается после 10 прокрутов.', cost: 0, rarity: 'common', thumbnail: '💔', effect: { luck: 3, breakable: true, max_uses: 10 } },
  { id: 'crystal_ball', name: 'Хрустальный шар', desc: 'Даёт +2 к удаче. Ломается после 15 прокрутов.', cost: 1, rarity: 'rare', thumbnail: '🔮', effect: { luck: 2, breakable: true, max_uses: 15 } },
  { id: 'time_capsule', name: 'Капсула времени', desc: 'Даёт +4 к удаче. Ломается после 8 прокрутов.', cost: 1, rarity: 'rare', thumbnail: '⏰', effect: { luck: 4, breakable: true, max_uses: 8 } },
  { id: 'phoenix_feather', name: 'Перо феникса', desc: 'Даёт +5 к удаче. Ломается после 12 прокрутов.', cost: 3, rarity: 'legendary', thumbnail: '🔥', effect: { luck: 5, breakable: true, max_uses: 12 } },
  
  // --- НОВЫЕ РЕДКИЕ BREAKABLE ПРЕДМЕТЫ ---
  { id: 'golden_compass', name: 'Золотой компас', desc: 'Диагональные линии получают +3 к множителю. Ломается после 10 прокрутов.', cost: 2, rarity: 'rare', thumbnail: '🧭', effect: { line_type_multiplier_bonus: { types: ["Диагональная"], bonus: 3 }, breakable: true, max_uses: 10 } },
  { id: 'fortune_cookie', name: 'Печенье с предсказанием', desc: 'С шансом 30% каждый прокрут даёт +25💲. Ломается после 12 срабатываний.', cost: 3, rarity: 'rare', thumbnail: '🥠', effect: { luck_chance: { coins: 25, chance: 0.30, breakable: true, max_uses: 12 } } },
  { id: 'lucky_rabbit_foot', name: 'Лапка кролика', desc: 'Даёт +6 к удаче. Ломается после 6 прокрутов.', cost: 2, rarity: 'rare', thumbnail: '🐰', effect: { luck: 6, breakable: true, max_uses: 6 } },
  { id: 'magic_mirror', name: 'Волшебное зеркало', desc: 'Все выигрыши с линий из 4+ символов умножаются на 2. Ломается после 8 прокрутов.', cost: 4, rarity: 'rare', thumbnail: '🟩', effect: { line_length_multiplier_bonus: { min_length: 4, multiplier: 2 }, breakable: true, max_uses: 8 } },
  { id: 'treasure_map', name: 'Карта сокровищ', desc: 'С шансом 15% каждый прокрут даёт +3🎟️. Ломается после 15 срабатываний.', cost: 3, rarity: 'rare', thumbnail: '🗺️', effect: { luck_chance: { tickets: 3, chance: 0.15, breakable: true, max_uses: 15 } } },
  
  { id: 'master_toolkit', name: 'Набор инструментов мастера', desc: 'В конце каждого раунда полностью востанавливает использования у случайного предмета.', cost: 15, rarity: 'legendary', thumbnail: '🧰', effect: { repair_random_broken: true } },
  { id: 'probability_prism', name: 'Призма вероятности', desc: 'Раз в раунд позволяет запретить выпадение одного выбранного символа на следующие 3 прокрута.', cost: 18, rarity: 'legendary', thumbnail: '🔮', effect: { ban_symbol_3spins: true } },
  // --- НОВЫЕ ПРЕДМЕТЫ ПО ЗАПРОСУ ---
  {
    id: 'demon_contract',
    name: 'Контракт с Демоном',
    desc: 'Все выигрыши умножаются на 2, но каждый проигрышный прокрут отнимает 5% от баланса в банке.',
    cost: 30,
    rarity: 'legendary',
    thumbnail: '😈',
    effect: { demon_contract: true, winMultiplier: 2 }
  },
  {
    id: 'glass_cannon',
    name: 'Стеклянная пушка',
    desc: 'Все множители линий увеличены на +5. Каждый выигрыш имеет 10% шанс немедленно сломать этот предмет (максимум 10 использований).',
    cost: 7,
    rarity: 'rare',
    thumbnail: '💥',
    effect: { line_type_multiplier_bonus: { types: ["Горизонтальная", "Вертикальная", "Диагональная", "Зиг-Заг", "Небо/Земля", "Секретная"], bonus: 5 }, breakable: true, max_uses: 10, glass_cannon: { break_chance: 0.10 } }
  },
  { 
    id: 'acidic_battery', 
    name: 'Кислотная батарея', 
    desc: 'Каждый лимон 🍋 на поле даёт +1 к удаче на этот прокрут.', 
    cost: 8, 
    rarity: 'rare', 
    thumbnail: '🔋',
    effect: { temporary_luck_on_spin: 'lemon' }
  },
  { 
    id: 'line_calibrator', 
    name: 'Калибровщик линий', 
    desc: 'Горизонтальные линии получают +3 к множителю. Ломается после 15 прокрутов.', 
    cost: 6, 
    rarity: 'rare', 
    thumbnail: '📏',
    effect: { line_type_multiplier_bonus: { types: ["Горизонтальная"], bonus: 3 }, breakable: true, max_uses: 15 }
  },
  { 
    id: 'gamblers_coin', 
    name: 'Монетка шулера', 
    desc: 'Каждый денежный выигрыш с шансом 50% удваивается, а с шансом 50% теряется полностью.', 
    cost: 6, 
    rarity: 'rare', 
    thumbnail: '🪙', 
    on_spin_bonus: (grid, winAmount, state) => {
        if (winAmount <= 0) return 0;
        if (Math.random() < 0.5) {
            state?.addLog?.('Монетка шулера: Орёл! Выигрыш удвоен.', 'win');
            return winAmount;
        } else {
            state?.addLog?.('Монетка шулера: Решка! Вы потеряли этот выигрыш.', 'loss');
            return -winAmount;
        }
    }
  },
  { 
    id: 'resonator_stone', 
    name: 'Камень-резонатор', 
    desc: 'Если выигрышный символ совпадает с символом прошлого выигрышного прокрута, вы получаете +15💲 за каждый цикл.', 
    cost: 7, 
    rarity: 'rare', 
    thumbnail: '🗿',
    on_win_bonus: (grid, winAmount, state, winningLines) => {
      const currentWinningSymbol = winningLines?.[0]?.symbol;
      if (currentWinningSymbol && state.lastWinningSymbol === currentWinningSymbol) {
        return 15 * (state.run || 1);
      }
      return 0;
    }
  },
  { 
    id: 'dwarfs_workshop', 
    name: 'Мастерская гнома', 
    desc: 'В начале раунда восстанавливает 1 использование у всех ломающихся амулетов.', 
    cost: 8, 
    rarity: 'rare', 
    thumbnail: '⚒️',
    effect: { on_round_end_repair: { all: true, count: 1 } }
  },
  { 
    id: 'artists_palette', 
    name: 'Палитра художника', 
    desc: 'Выигрышные линии, состоящие из 2+ РАЗНЫХ символов (благодаря "диким"), получают +2 к множителю.', 
    cost: 7, 
    rarity: 'rare', 
    thumbnail: '🎨',
    effect: { diverse_line_bonus: { min_length: 2, bonus: 2 } }
  },
  { 
    id: 'rainbow_palette',
    name: 'Радужная палитра',
    desc: 'Выигрышные линии из 3+ разных символов получают +3 к множителю.',
    cost: 18,
    rarity: 'legendary',
    thumbnail: '🌈',
    effect: { diverse_line_bonus: { min_length: 3, bonus: 3 } }
  },
  {
    id: 'wild_clover_charm',
    name: 'Талисман дикого клевера',
    desc: 'С шансом 35% следующий прокрут превращает все клеверы 🍀 в дикие. Ломается после 3 срабатываний.',
    cost: 2,
    rarity: 'common',
    thumbnail: '🍀',
    effect: { wild_clover_next_spin: { chance: 0.35, breakable: true, max_uses: 3 } }
  },
  {
    id: 'infinite_spins',
    name: 'Бесконечные спинны',
    desc: 'Пока предмет в инвентаре, даёт +4 прокрута.',
    cost: 25,
    rarity: 'rare',
    thumbnail: '♾️',
    effect: { permanent_spins: 4 }
  },
  { id: 'growing_power', name: 'Растущая Сила', desc: 'Все символы получают +1 к множителю за каждый цикл.', cost: 10, rarity: 'rare', thumbnail: '📊', effect: { per_run_bonus: { all_symbols_multiplier_boost: 1 } } },
  { id: 'line_master', name: 'Мастер Линий', desc: 'Все линии получают +1 к множителю за каждый цикл.', cost: 10, rarity: 'rare', thumbnail: '📏', effect: { per_run_bonus: {line_type_multiplier_bonus: { types: ["Горизонтальная", "Вертикальная", "Диагональная", "Зиг-Заг", "Небо/Земля", "Секретная"], bonus: 1 } } }},
  
  // --- НОВЫЕ ПРЕДМЕТЫ ---
  { 
    id: 'chaos_crystal', 
    name: 'Кристалл Хаоса', 
    desc: 'Каждый прокрут случайным образом меняет множитель одной случайной линии от -2 до +3.', 
    cost: 12, 
    rarity: 'rare', 
    thumbnail: '💎', 
    effect: { chaos_line_modifier: { min: -2, max: 3 } }
  },
  { 
    id: 'symbiotic_parasite', 
    name: 'Симбиотический Паразит', 
    desc: 'Каждый выигрыш даёт +1 к удаче, но каждый проигрыш отнимает -1 удачу. Эффект накапливается.', 
    cost: 8, 
    rarity: 'rare', 
    thumbnail: '🦠', 
    effect: { symbiotic_luck: true }
  },
  { 
    id: 'mirror_dimension', 
    name: 'Зеркальное Измерение', 
    desc: 'Создаёт "отражение" каждого символа на противоположной стороне поля. Отражения дают половину выигрыша.', 
    cost: 20, 
    rarity: 'legendary', 
    thumbnail: '🪞', 
    effect: { mirror_dimension: true }
  },
  { 
    id: 'luck_fertilizer', 
    name: 'Удобрение Удачи', 
    desc: 'Каждый клевер 🍀 на поле даёт +1 к удаче (на этот прокрут) и +1💲 за каждый цикл.', 
    cost: 7, 
    rarity: 'rare', 
    thumbnail: '🌱', 
    on_spin_bonus: (grid, winAmount, state) => {
      const cloverCount = grid.filter(s => s && s.id === 'clover').length;
      return cloverCount * (state?.run || 1);
    },
    effect: { temporary_luck_on_spin: 'clover' }
  },
  { id: 'lucky_leaf', name: 'Счастливый лист', desc: 'Даёт +1 к удаче на этот прокрут, если на поле есть хотя бы один 🍀.', cost: 1, rarity: 'common', thumbnail: '🍂', effect: { conditional_luck: { symbol: 'clover', bonus: 1 } } },
  { id: 'piggy_bank', name: 'Свинка-копилка', desc: 'В конце раунда, только при нажатии «Закончить ход», даёт +2💲 за каждые 10💲, на счету.', cost: 6, rarity: 'rare', thumbnail: '🐷', effect: { end_round_savings_bonus: { per: 10, coins: 2 } } },
  { id: 'lucky_hat', name: 'Шляпа удачи', desc: 'Каждый третий прокрут даёт +2 к удаче.', cost: 2, rarity: 'common', thumbnail: '🎩', effect: { every_n_spin_luck: { n: 3, luck: 2 } } },
  { id: 'coin_pouch', name: 'Мешочек монет', desc: 'В начале каждого раунда даёт +1💲 за каждый амулет в инвентаре.', cost: 4, rarity: 'common', thumbnail: '👝', effect: { on_round_start_per_item_coins: 1 } },
  { id: 'lucky_bell', name: 'Колокольчик удачи', desc: 'Если на поле есть хотя бы один колокольчик, все выигрыши увеличиваются на 10%.', cost: 2, rarity: 'common', thumbnail: '🔔', effect: { winMultiplier: 1.1 } },
  { id: 'lucky_feather', name: 'Пёрышко удачи', desc: 'В начале каждого раунда даёт +1 к удаче, если у вас меньше 5 амулетов.', cost: 2, rarity: 'common', thumbnail: '🪶', effect: { on_round_start_luck_if_few_items: { max_items: 5, luck: 1 } } },
  
]

// --- СИСТЕМА СЛУЧАЙНЫХ МОДИФИКАТОРОВ ---
const ITEM_MODIFIERS = [
  {
    id: 'slot_boost',
    name: 'Кузнец',
    desc: 'Древний кузнец усиливает символы. +1 к множителю всех символов.',
    effect: { all_symbols_multiplier_boost: 1 }
  },
  {
    id: 'no_slot_usage',
    name: 'Тень Бога',
    desc: 'Божество скрывает предмет от взора. Не занимает место, но выигрыши -10%.',
    effect: { ignore_slot_for_empty_bonus: true, win_penalty: 0.1 }
  },
  {
    id: 'luck_boost',
    name: 'Благословение',
    desc: 'Архаический дух дарит удачу. +1 к удаче.',
    effect: { luck: 1 }
  },
  {
    id: 'line_modifier',
    name: 'Руна',
    desc: 'Древняя руна создателя реальности. +1 к множителям всех линий.',
    effect: { line_type_multiplier_bonus: { types: ["Горизонтальная", "Вертикальная", "Диагональная", "Зиг-Заг", "Небо/Земля", "Секретная"], bonus: 1 } }
  },
  {
    id: 'combo_boost',
    name: 'Эхо',
    desc: 'Отголосок древней силы. +10% к комбо-бонусу.',
    effect: { combo_bonus_multiplier: 1.1 }
  },
  {
    id: 'bank_boost',
    name: 'Печать',
    desc: 'Мистическая печать бога процентов. +2% к ставке банка.',
    effect: { interest_rate_bonus: 0.02 }
  },
  {
    id: 'midas_touch',
    name: 'Дар',
    desc: 'Каждый выигрышный прокрут с шансом, в зависимости от удачи, выигрыш x 2.',
    effect: { luck_to_double_win: true },
    divine: true
  },
  {
    id: 'divine_recalculation',
    name: 'Перерасчет',
    desc: 'В конце раунда: +1 прокрут за каждые 2 проигрыша сверх числа выигрышей.',
    effect: { on_round_end_recalculation: { loss_threshold: 2, spins_bonus: 1 } },
    divine: true
  },
  {
    id: 'sacrificial_altar',
    name: 'Алтарь',
    desc: 'При покупке, случайный другой ваш амулет уничтожается (миним 1 амулет должен быть в инвенторе). Все выигрыши увеличиваются на 25%.',
    effect: { on_purchase_sacrifice_item: true, winMultiplier: 1.25 },
    divine: true
  },
  {
    id: 'chronosphere',
    name: 'Хроносфера',
    desc: 'Все ломающиеся предметы  в магазине получают +10 к максимальному числу использований.',
    effect: { breakable_item_uses_boost: 10 },
    divine: true
  },
  {
    id: 'cosmic_singularity',
    name: 'Сингулярность',
    desc: 'В начале каждого прокрута все символы на поле с шансом превращаются в тот символ, который находится в центральной ячейке.',
    // шанс 10% на превращение
    effect: { singularity_chance: 0.10 },
    divine: true
  },
  {
    id: 'divine_craft_aura',
    name: 'Аура',
    desc: 'Увеличивает все числовые бонусы от ДРУГИХ предметов на 25% (округление вверх). Не влияет на множители или проценты.',
    effect: { flat_bonus_enhancer: 1.25 },
    divine: true
  }
];

// Штрафные модификаторы
const PENALTY_MODIFIERS = [
  {
    id: 'cursed_slot',
    name: 'Двойник',
    desc: 'Дух требует двойную плату. Занимает 2 слота.',
    effect: { slot_penalty: 1 }
  },
  {
    id: 'bad_luck',
    name: 'Медуза',
    desc: 'Окаменевший взгляд отнимает удачу. -1 к удаче.',
    effect: { luck: -1 }
  },
  {
    id: 'line_weakness',
    name: 'Разлом',
    desc: 'Трещина в реальности ослабляет линии. -1 к множителям линий.',
    effect: { line_type_multiplier_bonus: { types: ["Горизонтальная", "Вертикальная", "Диагональная", "Зиг-Заг", "Небо/Земля", "Секретная"], bonus: -1 } }
  },
  {
    id: 'combo_penalty',
    name: 'Плач',
    desc: 'Древняя песнь скорби. -10% к комбо-бонусу.',
    effect: { combo_bonus_multiplier: 0.9 }
  },
  {
    id: 'bank_penalty',
    name: 'Ржавчина',
    desc: 'Время разъедает проценты. -2% к ставке банка.',
    effect: { interest_rate_bonus: -0.02 }
  },
  {
    id: 'win_penalty',
    name: 'Жертва',
    desc: 'Древние силы требуют дань. Все выигрыши -15%.',
    effect: { win_penalty: 0.15 }
  }
];

// === Глобальный пул выданных divine-модификаторов ===
if (typeof window !== 'undefined') {
  if (!window.givenDivineModifiers) window.givenDivineModifiers = [];
}

// Функция для освобождения divine-модификатора (возврат в пул)
function releaseDivineModifier(modifierId) {
  if (typeof window !== 'undefined' && window.givenDivineModifiers) {
    const idx = window.givenDivineModifiers.indexOf(modifierId);
    if (idx !== -1) window.givenDivineModifiers.splice(idx, 1);
  }
}

// Функция для подсчета модифицированных предметов у игрока
function countModifiedItems() {
  if (typeof window === 'undefined' || !window.state || !window.state.inventory) {
    return 0;
  }
  // Считаем только активные предметы с модификаторами (не удаленные)
  return window.state.inventory.filter(item => item.modifier && !item.removed).length;
}

// Функция для добавления случайного модификатора к предмету
function addRandomModifier(item) {
  // Увеличиваем шанс для редких и легендарных предметов
  let chance = 0.1; // 10% для обычных
  if (item.rarity === 'rare') chance = 0.15; // 15% для редких
  if (item.rarity === 'legendary') chance = 0.25; // 25% для легендарных
  
  if (Math.random() < chance) {
    const modifiedItem = { ...item };
    const modifiedItemsCount = countModifiedItems();
    
    let modifier;
    let isPenalty = false;
    
    // Получаем список уже выданных divine-модификаторов
    let ownedDivineIds = [];
    if (typeof window !== 'undefined' && window.state && window.state.inventory) {
      ownedDivineIds = window.state.inventory
        .filter(i => i.modifier && i.modifier.divine)
        .map(i => i.modifier.id);
    }
    // Добавляем те, что были выданы, но сейчас не в инвентаре (глобальный пул)
    if (typeof window !== 'undefined' && window.givenDivineModifiers) {
      ownedDivineIds = Array.from(new Set([...ownedDivineIds, ...window.givenDivineModifiers]));
    }
    
    // Если у игрока 4+ модифицированных предметов, применяем штрафную систему
    if (modifiedItemsCount >= 4) {
      // Уменьшаем шанс хороших модификаторов в 2 раза
      const goodModifierChance = 0.33; // 33% шанс хорошего модификатора
      
      if (Math.random() < goodModifierChance) {
        // Для divine-модификаторов шанс выпадения 3%, для остальных — как раньше
        let divineMods = ITEM_MODIFIERS.filter(m => m.divine && !ownedDivineIds.includes(m.id));
        const nonDivineMods = ITEM_MODIFIERS.filter(m => !m.divine);
        let roll = Math.random();
        if (roll < 0.03 && divineMods.length > 0) {
          modifier = divineMods[Math.floor(Math.random() * divineMods.length)];
        } else {
          modifier = nonDivineMods[Math.floor(Math.random() * nonDivineMods.length)];
        }
        if (typeof window.addLog === 'function') {
          window.addLog(`🎲 Штрафная система: выпал хороший модификатор для ${item.name}`, 'win');
        }
      } else {
        modifier = PENALTY_MODIFIERS[Math.floor(Math.random() * PENALTY_MODIFIERS.length)];
        isPenalty = true;
        if (typeof window.addLog === 'function') {
          window.addLog(`💀 Штрафная система: выпал плохой модификатор для ${item.name}`, 'loss');
        }
      }
    } else {
      // Обычная логика без штрафов
      // Для divine-модификаторов шанс выпадения 3%, для остальных — как раньше
      let divineMods = ITEM_MODIFIERS.filter(m => m.divine && !ownedDivineIds.includes(m.id));
      const nonDivineMods = ITEM_MODIFIERS.filter(m => !m.divine);
      let roll = Math.random();
      if (roll < 0.03 && divineMods.length > 0) {
        modifier = divineMods[Math.floor(Math.random() * divineMods.length)];
      } else {
        modifier = nonDivineMods[Math.floor(Math.random() * nonDivineMods.length)];
      }
    }
    
    // --- Если выдан divine, добавляем в глобальный пул ---
    if (modifier && modifier.divine && typeof window !== 'undefined' && window.givenDivineModifiers) {
      window.givenDivineModifiers.push(modifier.id);
    }
    
    // Корректно добавляем эмодзи к имени
    let cleanName = modifiedItem.name.replace(/[✨💀🔱]/g, '').trim();
    if (isPenalty) {
      modifiedItem.name = `${cleanName} 💀`;
    } else if (modifier.divine) {
      
      if (!/🔱/.test(cleanName)) {
        modifiedItem.name = `${cleanName} 🔱`;
      } else {
        modifiedItem.name = cleanName;
      }
    } else {
      
      modifiedItem.name = `${cleanName} ✨`;
    }
    
    // Объединяем эффекты
    if (!modifiedItem.effect) modifiedItem.effect = {};
    modifiedItem.effect = { ...modifiedItem.effect, ...modifier.effect };
    
    // Добавляем информацию о модификаторе
    modifiedItem.modifier = modifier;
    modifiedItem.isPenalty = isPenalty;
    
    // Проверяем наличие пассивки "Мастер модификаций"
    let shouldIncreaseCost = true;
    if (typeof window !== 'undefined' && window.state && window.state.activePassives) {
      const hasModificationMaster = window.state.activePassives.some(p => p.id === 'modification_master');
      if (hasModificationMaster) {
        shouldIncreaseCost = false;
        // Добавляем сообщение в лог о том, что пассивка сработала
        if (typeof window.addLog === 'function') {
          window.addLog(`⚡ Мастер модификаций: ${modifiedItem.name} не получил штраф стоимости!`, 'win');
        }
      }
    }
    
    // Увеличиваем стоимость для модифицированных предметов только если пассивка не активна
    if (shouldIncreaseCost) {
      let costMultiplier = 1.2;
      if (isPenalty) costMultiplier = 0.8;
      if (modifier.divine) costMultiplier = 3;
      modifiedItem.cost = Math.ceil(modifiedItem.cost * costMultiplier);
    }
    
    // Добавляем сообщение в лог о штрафной системе
    if (modifiedItemsCount >= 4 && typeof window.addLog === 'function') {
      window.addLog(`⚠️ Штрафная система модификаторов активна! (${modifiedItemsCount}/4+ предметов)`, 'warning');
    }
    
    // Добавляем обновление uses у всех breakable-предметов, если модификатор Хроносфера
    if (modifier && modifier.effect && modifier.effect.breakable_item_uses_boost && typeof window !== 'undefined' && window.state && window.state.inventory) {
      window.state.inventory.forEach(invItem => {
        if (invItem.effect?.luck_chance?.breakable) {
          const maxUses = (invItem.effect.luck_chance.max_uses || 1) + window.getBreakableUsesBoost();
          if (typeof invItem.uses === 'undefined' || invItem.uses > maxUses) invItem.uses = maxUses;
        } else if (invItem.effect?.breakable && !invItem.effect?.luck_chance) {
          const maxUses = (invItem.effect.max_uses || 10) + window.getBreakableUsesBoost();
          if (typeof invItem.uses === 'undefined' || invItem.uses > maxUses) invItem.uses = maxUses;
        } else if (invItem.effect?.wild_clover_next_spin?.breakable) {
          const maxUses = (invItem.effect.wild_clover_next_spin.max_uses || 1) + window.getBreakableUsesBoost();
          if (typeof invItem.uses === 'undefined' || invItem.uses > maxUses) invItem.uses = maxUses;
        }
      });
      if (typeof window.updateUI === 'function') window.updateUI();
    }
    
    return modifiedItem;
  }
  return item;
}

// Экспортируем функции в глобальную область видимости
if (typeof window !== 'undefined') {
  window.addRandomModifier = addRandomModifier;
  window.countModifiedItems = countModifiedItems;
  window.ALL_ITEMS = ALL_ITEMS;
  window.ITEM_MODIFIERS = ITEM_MODIFIERS;
  window.PENALTY_MODIFIERS = PENALTY_MODIFIERS;
  window.releaseDivineModifier = releaseDivineModifier;
  // [NEW] Экспортируем getBreakableUsesBoost для использования в addRandomModifier
  if (typeof getBreakableUsesBoost === 'function') {
    window.getBreakableUsesBoost = getBreakableUsesBoost;
  }
}