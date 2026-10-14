import { initNavigation } from './dashboard f/navigation.js';
import { initMiniGames } from './dashboard f/minigames.js';
import { initCustomCursor } from './dashboard f/cursor.js';
import { initShop } from './dashboard f/shop.js';
import { initFeedback } from './dashboard f/feedback.js';
import { initSettings } from './dashboard f/settings.js';
import { initHomework } from './dashboard f/homework.js'; // Подключаем логику ДЗ
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');

    // Если элементов тоста нет на странице, просто выходим и не ломаем код
    if (!toast || !toastMessage) return;

    toastMessage.textContent = message;
    toast.classList.remove('hidden');

    // Автоматическое скрытие через 3 секунды
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}
document.addEventListener('DOMContentLoaded', () => {
    // Запускаем все модули интерфейса
    initNavigation();
    initHomework();     // <--- Вот здесь заработают вкладки ДЗ!
    initMiniGames();
    initCustomCursor();
    initShop();
    initFeedback();
    initSettings();
});