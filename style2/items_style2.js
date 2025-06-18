const ALL_ITEMS = [
    // --- ОБЫЧНЫЕ (Common / Проклятые) ---
    { id: 'lucky_clover', name: 'Обугленный клевер', desc: '+1 к удаче. Его сила исходит из пепла.', cost: 3, rarity: 'common', effect: { luck: 1 } },
    { id: 'scrap_metal', name: 'Глиняный Идол', desc: 'Впитывает эхо неудач. +1⚙️ за проигрышную попытку. Разбивается в конце дня.', cost: 4, rarity: 'common', effect: { on_loss_bonus: 1 } },
    { id: 'timepiece', name: 'Застывшие Часы', desc: 'Дает +1 Попытку в начале каждого дня.', cost: 6, rarity: 'common', effect: { on_round_start_spins: 1 } },
    { id: 'resellers_ticket', name: 'Пакт Скупщика', desc: 'Каждый раз, когда вы ищете новые товары в Лавке, вы получаете 1⛁ обратно.', cost: 4, rarity: 'common', effect: { on_reroll_bonus: { tickets: 1 } } },
    { id: 'growing_debt', name: 'Эхо Бездны', desc: 'Дает +1 к Удаче за каждый пройденный Круг.', cost: 5, rarity: 'common', effect: { per_run_bonus: { luck: 1 } } },
    { id: 'lucky_penny', name: 'Проклятая Монета', desc: 'Первая попытка в каждом дне не требует жертв.', cost: 6, rarity: 'common', effect: { first_spin_free: true } },
    { id: 'morning_coffee', name: 'Мутная Настойка', desc: 'Дает +3⚙️ в начале каждого дня.', cost: 4, rarity: 'common', effect: { on_round_start_coins: 3 } },
    { id: 'coupon_book', name: 'Забытый Купон', desc: 'Первый поиск в Лавке в каждом дне бесплатен.', cost: 5, rarity: 'common', effect: { free_reroll_per_round: 1 } },
    { id: 'sticky_fingers', name: 'Голодные Пальцы', desc: '+1⚙️ за каждую линию из 3 символов.', cost: 5, rarity: 'common', effect: { line_length_win_bonus: { length: 3, bonus: 1 } } },
    { id: 'broken_mirror', name: 'Осколок Зеркала', desc: 'Увеличивает множитель Диагональных линий на +1.', cost: 4, rarity: 'common', effect: { line_type_multiplier_bonus: { types: ["Диагональная"], bonus: 1 } } },
    { id: 'dusty_map', name: 'Запретные Схемы', desc: 'Увеличивает множитель Зиг-Заг линий на +2.', cost: 3, rarity: 'common', effect: { line_type_multiplier_bonus: { types: ["Зиг-Заг"], bonus: 2 } } },

    // --- РЕДКИЕ (Rare / Зачарованные) ---
    { id: 'golden_ticket', name: 'Позолоченный череп', desc: '+2 к удаче. Смотрит на вас пустыми глазницами.', cost: 5, rarity: 'rare', effect: { luck: 2 } },
    { id: 'money_magnet', name: 'Магнит для Душ', desc: 'Символы ⚙️ дают +3⚙️ за каждый на поле.', cost: 6, rarity: 'rare', on_spin_bonus: (grid) => grid.filter(s => s.id === 'coins').length * 3 },
    { id: 'architect_blueprint', name: 'Чертежи Храма', desc: 'Горизонтальные и вертикальные линии получают +1 к множителю.', cost: 8, rarity: 'rare', effect: { line_type_multiplier_bonus: { types: ["Горизонтальная", "Вертикальная"], bonus: 1 } } },
    { id: 'cherry_bomb', name: 'Сердце-бомба', desc: 'Линии из Капель Крови 🩸 дополнительно дают +10⚙️.', cost: 7, rarity: 'rare', effect: { symbol_win_bonus: { symbol: 'cherry', bonus: 10 } } },
    { id: 'combo_counter', name: 'Счетчик Боли', desc: 'Бонус от КОМБО-выигрышей увеличивается на 50%.', cost: 8, rarity: 'rare', effect: { combo_bonus_multiplier: 1.5 } },
    { id: 'last_chance', name: 'Жест Отчаяния', desc: 'Последняя попытка дня получает множитель выигрыша x3.', cost: 6, rarity: 'rare', effect: { on_last_spin_bonus: { multiplier: 3 } } },
    { id: 'blood_ritual', name: 'Кровавый Ритуал', desc: 'Пожертвуйте 2⚙️ в начале попытки, чтобы получить +5 к Удаче (если >10⚙️).', cost: 7, rarity: 'rare', effect: { on_spin_sacrifice: { cost: 2, condition_coin: 10, bonus: { luck: 5 } } } },
    { id: 'twins_mirror', name: 'Двойственное Зеркало', desc: 'Горизонтальные линии выплат работают в обе стороны.', cost: 8, rarity: 'rare', effect: { pay_both_ways: true } },
    { id: 'ticket_printer', name: 'Печать Душ', desc: '5-символьные линии дополнительно дают +1⛁.', cost: 7, rarity: 'rare', effect: { on_line_win_bonus: { length: 5, tickets: 1 } } },
    { id: 'shiny_bell', name: 'Погребальный Звон', desc: 'Символы Цепей ⛓️ приносят в 2 раза больше ⚙️.', cost: 6, rarity: 'rare', effect: { symbol_value_multiplier: { symbol: 'bell', multiplier: 2 } } },
    { id: 'telescope', name: 'Око Звездочета', desc: 'Увеличивает множитель линий "Небо/Земля" на +4.', cost: 7, rarity: 'rare', effect: { line_type_multiplier_bonus: { types: ["Небо/Земля"], bonus: 4 } } },
    { id: 'hourglass', name: 'Песочные Часы Души', desc: 'Дает +1 Попытку за каждые 10 совершенных попыток.', cost: 9, rarity: 'rare', effect: { on_spin_count_bonus: { count: 10, spins: 1 } } },
    
    // --- ЛЕГЕНДАРНЫЕ (Legendary / Демонические) ---
    { id: 'lemon_zest', name: 'Алхимический Трансмутатор', desc: 'Черепа 💀 считаются как Глаза 👁️ для комбинаций.', cost: 9, rarity: 'legendary', effect: { substitute: { from: 'lemon', to: 'clover' } } },
    { id: 'fortune_charm', name: 'Амулет Рока', desc: 'Увеличивает ВСЕ денежные выигрыши на 25%.', cost: 10, rarity: 'legendary', effect: { winMultiplier: 1.25 } },
    { id: 'double_down', name: 'Стеклянный Глаз', desc: 'Удваивает множитель для всех 5-символьных линий.', cost: 9, rarity: 'legendary', effect: { line_length_multiplier_bonus: { length: 5, multiplier: 2 } } },
    { id: 'sevens_pact', name: 'Контракт на Крови', desc: 'Каждая 7️⃣ на поле увеличивает Удачу на 1 на эту попытку.', cost: 12, rarity: 'legendary', effect: { temporary_luck_on_spin: 'seven' } },
    { id: 'all_seeing_eye', name: 'Всевидящее Око', desc: 'Открывает новую линию "Третий Глаз" (x5).', cost: 11, rarity: 'legendary', effect: { add_payline: { name: 'Третий Глаз', positions: [1, 6, 12, 8, 3], multiplier: 5, type: "Секретная" } } },
    { id: 'wild_clover', name: 'Проклятый Клевер', desc: 'Символы Глаза 👁️ теперь являются "дикими" (заменяют любой символ).', cost: 15, rarity: 'legendary', effect: { wild_symbol: 'clover' } },
    { id: 'failure_filter', name: 'Фильтр Душ', desc: 'Символы Черепа 💀 полностью убираются из барабанов.', cost: 14, rarity: 'legendary', effect: { remove_symbol: 'lemon' } },
    { id: 'vault_key', name: 'Ключ от Схрона', desc: 'Базовая процентная ставка в схроне увеличивается на 15%.', cost: 10, rarity: 'legendary', effect: { interest_rate_bonus: 0.15 } },
    { id: 'mimic_chest', name: 'Сундук-Мимик', desc: 'Копирует эффект случайной реликвии в инвентаре каждый день.', cost: 13, rarity: 'legendary', effect: { mimic: true } },
    { id: 'seven_magnet', name: 'Магнит Рока', desc: 'Каждая попытка гарантированно будет иметь как минимум одну 7️⃣ на поле.', cost: 16, rarity: 'legendary', effect: { guarantee_symbol: { symbol: 'seven', count: 1 } } },
    { id: 'rainbow_clover', name: 'Радужный Ужас', desc: 'Если на поле нет выигрышных линий, но есть все 7 видов символов, вы получаете +100⚙️.', cost: 12, rarity: 'legendary', on_spin_bonus: (grid, winAmount) => {
        if (winAmount > 0) return 0;
        const uniqueSymbols = new Set(grid.map(s => s.id));
        return uniqueSymbols.size === 7 ? 100 : 0;
    }},
    { id: 'quantum_entanglement', name: 'Квантовый Ужас', desc: 'Символы в верхней левой и нижней правой ячейках всегда одинаковы.', cost: 11, rarity: 'legendary', effect: { sync_cells: { cells: [0, 14] } } },
    { id: 'bank_insurance', name: 'Страховка Бездны', desc: 'Процентная ставка в схроне никогда не опускается ниже 20%.', cost: 10, rarity: 'legendary', effect: { min_interest_rate_floor: 0.20 } }
];