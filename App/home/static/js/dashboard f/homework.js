export function initHomework() {
    const hwTabButtons = document.querySelectorAll('.hw-tab-btn');
    const hwCards = document.querySelectorAll('.hw-card');

    if (!hwTabButtons.length || !hwCards.length) return;

    hwTabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // 1. Убираем класс active у всех кнопок и добавляем нажатой
            hwTabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // 2. Получаем категорию из атрибута data-filter (checking, graded, process)
            const filter = btn.getAttribute('data-filter');

            // 3. Проходим по всем карточкам и сверяем их data-category
            hwCards.forEach(card => {
                const category = card.getAttribute('data-category');

                if (category === filter) {
                    card.style.display = 'block'; // Показываем подходящие
                } else {
                    card.style.display = 'none';  // Скрываем остальные
                }
            });
        });
    });
}