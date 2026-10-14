document.addEventListener('DOMContentLoaded', () => {
    // 1. Логика прелоадера с минимальной задержкой 2 секунды
    const startTime = Date.now();
    let progress = 0;
    const percentEl = document.getElementById('loader-percent');
    const barEl = document.getElementById('loader-bar');
    const statusEl = document.getElementById('loader-status');

    const statuses = [
        "Инициализация ядра...",
        "Загрузка стилей и локализации...",
        "Подключение к защищенной сессии...",
        "Система готова!"
    ];

    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 8) + 3;
        if (progress > 95) progress = 95;
        
        if (percentEl) percentEl.innerText = progress + '%';
        if (barEl) barEl.style.width = progress + '%';

        if (progress > 30 && progress < 65) {
            statusEl.innerText = statuses[1];
        } else if (progress >= 65) {
            statusEl.innerText = statuses[2];
        }
    }, 80);

    window.addEventListener('load', () => {
        const elapsedTime = Date.now() - startTime;
        const minDuration = 2000; // Минимум 2 секунды
        const remainingTime = Math.max(0, minDuration - elapsedTime);

        setTimeout(() => {
            clearInterval(interval);
            if (percentEl) percentEl.innerText = '100%';
            if (barEl) barEl.style.width = '100%';
            if (statusEl) statusEl.innerText = statuses[3];

            setTimeout(() => {
                const preloader = document.getElementById('preloader');
                if (preloader) {
                    preloader.style.opacity = '0';
                    preloader.style.visibility = 'hidden';
                    setTimeout(() => {
                        preloader.style.display = 'none';
                    }, 700);
                }
            }, 400);
        }, remainingTime);
    });

    // 2. Логика кастомного выпадающего меню языков
    const dropdownButton = document.getElementById('langDropdownButton');
    const dropdownMenu = document.getElementById('langDropdownMenu');
    const langArrow = document.getElementById('langArrow');

    if (dropdownButton && dropdownMenu) {
        dropdownButton.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownMenu.classList.toggle('hidden');
            langArrow.classList.toggle('rotate-180');
        });

        window.addEventListener('click', () => {
            if (!dropdownMenu.classList.contains('hidden')) {
                dropdownMenu.classList.add('hidden');
                langArrow.classList.remove('rotate-180');
            }
        });
    }

    // 3. Переключение видимости пароля (глазок)
    const togglePassword = document.getElementById('togglePassword');
    const passwordField = document.getElementById('passwordField');

    if (togglePassword && passwordField) {
        togglePassword.addEventListener('click', () => {
            const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordField.setAttribute('type', type);
        });
    }

    // 4. Плавный курсор с инерцией (шлейфом)
    const cursor = document.getElementById('cursorDot');
    if (cursor) {
        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;
        const speed = 0.2; // Коэффициент инерции

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCursor() {
            cursorX += (mouseX - cursorX) * speed;
            cursorY += (mouseY - cursorY) * speed;
            cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Увеличение курсора при наведении на кликабельные элементы
        document.querySelectorAll('a, button, input, [role="button"]').forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.style.width = '24px';
                cursor.style.height = '24px';
                cursor.style.backgroundColor = 'rgba(99, 102, 241, 0.4)';
            });
            element.addEventListener('mouseleave', () => {
                cursor.style.width = '12px';
                cursor.style.height = '12px';
                cursor.style.backgroundColor = '#6366f1';
            });
        });
    }
});

// Словари переводов для интерфейса
const translations = {
    ru: {
        page_title: "MyStat - Авторизация",
        welcome_title: "Добро пожаловать",
        login_title: "Логин",
        email_placeholder: "E-mail или Логин*",
        password_placeholder: "Пароль*",
        forgot_password: "Забыли пароль?",
        submit_button: "Логин"
    },
    en: {
        page_title: "MyStat - Authorization",
        welcome_title: "Welcome",
        login_title: "Login",
        email_placeholder: "E-mail or Login*",
        password_placeholder: "Password*",
        forgot_password: "Forgot password?",
        submit_button: "Login"
    },
    uz: {
        page_title: "MyStat - Avtorizatsiya",
        welcome_title: "Xush kelibsiz",
        login_title: "Kirish",
        email_placeholder: "E-mail yoki Login*",
        password_placeholder: "Parol*",
        forgot_password: "Parolni unutdingizmi?",
        submit_button: "Kirish"
    }
};

// Функция применения переводов на страницу
function applyTranslations(lang) {
    const dict = translations[lang];
    if (!dict) return;

    // Переводим текстовые элементы
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) {
            el.innerText = dict[key];
        }
    });

    // Переводим плейсхолдеры в инпутах
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (dict[key]) {
            el.setAttribute('placeholder', dict[key]);
        }
    });
}

// Глобальная функция смены языка (вызывается из HTML)
function setLanguage(langCode, langName) {
    const langTextEl = document.getElementById('currentLangText');
    if (langTextEl) langTextEl.innerText = langName;

    document.querySelectorAll('.lang-check').forEach(el => {
        if (el.getAttribute('data-lang') === langCode) {
            el.classList.remove('hidden');
        } else {
            el.classList.add('hidden');
        }
    });

    const dropdownMenu = document.getElementById('langDropdownMenu');
    const langArrow = document.getElementById('langArrow');
    if (dropdownMenu) dropdownMenu.classList.add('hidden');
    if (langArrow) langArrow.classList.remove('rotate-180');

    // Запускаем обновление текстов на странице
    applyTranslations(langCode);

    // Синхронизация со скрытым селектором для работы вашего словаря переводов
    const hiddenSelect = document.getElementById('hiddenLangSelect');
    if (hiddenSelect) {
        hiddenSelect.value = langCode;
        hiddenSelect.dispatchEvent(new Event('change'));
    }
}