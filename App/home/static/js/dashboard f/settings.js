// static/js/settings.js
export function initSettings() {
    const saveSettingsBtn = document.getElementById('save-settings');
    const settingsNameInput = document.getElementById('settings-name');
    const usernameDisplay = document.getElementById('username-display');

    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', () => {
            const newName = settingsNameInput.value.trim();
            if (newName !== "") {
                usernameDisplay.textContent = newName;
                alert('Настройки успешно сохранены!');
            }
        });
    }
}