// ==========================================================================
// DEMO PITCH MODE SHORTCUTS (SECRETS)
// ==========================================================================
document.addEventListener('keydown', (e) => {
  // Block execution if focus is in an input (prevents firing while typing)
  const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName);
  if (isInput) return;

  // ALT + R: Total Reset (Uses the existing global reset button)
  if (e.altKey && e.key.toLowerCase() === 'r') {
    e.preventDefault();
    const resetBtn = document.getElementById('btn-reset-simulator');
    if (resetBtn) resetBtn.click();
  }

  // ALT + C: Clear Role (Volta para a tela de escolha de perfil e limpa a role atual)
  if (e.altKey && e.key.toLowerCase() === 'c') {
    e.preventDefault();
    appState.user.role = '';
    showScreen('screen-2');
  }

  // ALT + M: Mock Data (Fills magical registration and advances)
  if (e.altKey && e.key.toLowerCase() === 'm') {
    e.preventDefault();
    const nameInput = document.getElementById('reg-name');
    const genderSelect = document.getElementById('reg-gender');
    const ageInput = document.getElementById('reg-age');
    const btnFlow1 = document.getElementById('btn-flow-1');

    if (nameInput) nameInput.value = 'Dona Maria da Silva';
    if (genderSelect) genderSelect.value = 'feminino';
    if (ageInput) ageInput.value = '72';

    if (btnFlow1) {
      // Clear error states, if any, before advancing
      nameInput.classList.remove('error-state');
      ageInput.classList.remove('error-state');
      const nameErr = document.getElementById('name-error-msg');
      const ageErr = document.getElementById('age-error-msg');
      if (nameErr) nameErr.classList.add('d-none');
      if (ageErr) ageErr.classList.add('d-none');

      btnFlow1.click();
    }
  }
});
