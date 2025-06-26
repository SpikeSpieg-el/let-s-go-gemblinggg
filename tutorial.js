// Логика обучения для игры

export const tutorialPages = [
    {
        title: '🎯 Цель игры',
        text: 'Ваша задача — выплатить постоянно растущий долг. У вас есть 3 дня (раунда) в каждом цикле, чтобы заработать как можно больше денег. Конечная цель — достичь 88,888,888💰.'
    },
    {
        title: '🎰 Прокруты и раунды',
        text: 'В начале каждого дня вы покупаете прокруты. Каждый прокрут вращает барабаны и даёт вам комбинации символов, которые приносят монеты. Неиспользованные прокруты сгорают в конце дня.'
    },
    {
        title: '💎 Амулеты и талоны',
        text: 'Талоны (🎟️), полученные при покупке прокрутов, можно потратить в магазине на амулеты. Амулеты — это мощные пассивные улучшения, которые действуют постоянно и могут кардинально изменить ход игры.'
    },
    {
        title: '🏦 Наличные и Банк',
        text: 'Ваши наличные (💰) в безопасности и не сгорают в конце дня. Однако, чтобы деньги работали на вас, их можно вносить в банк. В начале следующего дня банк начисляет проценты на вклад. Это ключ к быстрому росту капитала!'
    }
];

let tutorialIndex = 0;

export function showTutorialPage(idx) {
    const pages = document.getElementById('tutorial-pages');
    if (!pages) return;
    const page = tutorialPages[idx];
    pages.innerHTML = `<h3>${page.title}</h3><p>${page.text}</p><div style='text-align:center;margin-top:10px;color:#aaa;'>Страница ${idx+1} / ${tutorialPages.length}</div>`;
    document.getElementById('tutorial-prev').disabled = idx === 0;
    document.getElementById('tutorial-next').disabled = idx === tutorialPages.length-1;
}

export function openTutorial() {
    document.getElementById('tutorial-modal').classList.remove('hidden');
    showTutorialPage(tutorialIndex);
}

export function closeTutorial() {
    document.getElementById('tutorial-modal').classList.add('hidden');
}

export function setupTutorialHandlers() {
    const btnShowTutorial = document.getElementById('btn-show-tutorial');
    if (btnShowTutorial) btnShowTutorial.onclick = openTutorial;
    const tutorialPrev = document.getElementById('tutorial-prev');
    const tutorialNext = document.getElementById('tutorial-next');
    const tutorialClose = document.getElementById('tutorial-close');
    if (tutorialPrev) tutorialPrev.onclick = () => { if (tutorialIndex > 0) { tutorialIndex--; showTutorialPage(tutorialIndex); } };
    if (tutorialNext) tutorialNext.onclick = () => { if (tutorialIndex < tutorialPages.length-1) { tutorialIndex++; showTutorialPage(tutorialIndex); } };
    if (tutorialClose) tutorialClose.onclick = closeTutorial;
} 