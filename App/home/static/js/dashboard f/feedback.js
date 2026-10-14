// static/js/feedback.js
export function initFeedback() {
    const sendFeedbackBtn = document.getElementById('send-feedback');
    const feedbackInput = document.getElementById('feedback-input');
    const feedbackList = document.getElementById('feedback-list');
    const currentUserName = "Абдурафи Магруфов"; // Берем имя из профиля

    if (sendFeedbackBtn) {
        sendFeedbackBtn.addEventListener('click', () => {
            const text = feedbackInput.value.trim();
            if (text === "") {
                alert('Напишите текст предложения!');
                return;
            }

            const newCard = document.createElement('div');
            newCard.classList.add('card');
            newCard.style.marginBottom = "10px";
            newCard.innerHTML = `<p><b>${currentUserName}:</b> ${text}</p>`;

            feedbackList.prepend(newCard);
            feedbackInput.value = "";
            alert('Ваш совет успешно опубликован!');
        });
    }
}