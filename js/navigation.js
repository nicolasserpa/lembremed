// ==========================================================================
// BOTTOM NAVIGATION ROUTING & DYNAMIC RENDERING (GLOBAL CONTAINER)
// ==========================================================================

const globalNavContainer = document.getElementById('global-nav-container');

// Robust auto-scaling to fit the window accurately without overlapping OS taskbars
function adjustPhoneScale() {
  const phone = document.querySelector('.phone-device');
  if (phone) {
    const scale = Math.min(1, (window.innerHeight - 80) / 864);
    phone.style.transform = `scale(${scale})`;
  }
}
window.addEventListener('resize', adjustPhoneScale);
document.addEventListener('DOMContentLoaded', adjustPhoneScale);

// Force initial scale immediately
adjustPhoneScale();

if (globalNavContainer) {
  const handleTabNavigation = (targetNav) => {
    if (!targetNav) return;
    // Caregiver routing
    if (targetNav === 'pacientes') {
      showScreen('screen-7');
    } else if (targetNav === 'agenda') {
      prepareScreen8ForPatient(activePatientId);
      showScreen('screen-8');
    } else if (targetNav === 'alertas') {
      showScreen('screen-9');
    } else if (targetNav === 'config') {
      showScreen('screen-10');
    }
    // Patient routing
    else if (targetNav === 'patient-home') {
      showScreen('screen-patient-home');
    } else if (targetNav === 'patient-agenda') {
      showScreen('screen-6');
    } else if (targetNav === 'patient-meds') {
      showScreen('screen-patient-meds');
    } else if (targetNav === 'patient-alerts') {
      showScreen('screen-patient-alerts');
    } else if (targetNav === 'patient-settings') {
      showScreen('screen-patient-settings');
    }
  };

  globalNavContainer.addEventListener('click', (e) => {
    const tab = e.target.closest('.nav-tab');
    if (tab) {
      handleTabNavigation(tab.getAttribute('data-nav'));
    }
  });

  globalNavContainer.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const tab = e.target.closest('.nav-tab');
      if (tab) {
        e.preventDefault();
        handleTabNavigation(tab.getAttribute('data-nav'));
      }
    }
  });
}

function updateActiveTabsForScreen(screenId) {
  if (!globalNavContainer || typeof Components === 'undefined') return;

  // Determine active tab and role based on screenId
  let activeTab = '';
  let role = appState.user.role; // Default to current role

  // CAREGIVER SCREENS (require bottom nav)
  if (screenId === 'screen-7' || screenId === 'screen-11') {
    activeTab = 'pacientes';
    role = 'caregiver';
  } else if (screenId === 'screen-8') {
    activeTab = 'agenda';
    role = 'caregiver';
  } else if (screenId === 'screen-9') {
    activeTab = 'alertas';
    role = 'caregiver';
  } else if (screenId === 'screen-10') {
    activeTab = 'config';
    role = 'caregiver';
  }

  // PATIENT SCREENS (require bottom nav)
  else if (screenId === 'screen-patient-home') {
    activeTab = 'patient-home';
    role = 'patient';
  } else if (screenId === 'screen-6') {
    activeTab = 'patient-agenda';
    role = 'patient';
  } else if (screenId === 'screen-patient-meds') {
    activeTab = 'patient-meds';
    role = 'patient';
  } else if (screenId === 'screen-patient-alerts') {
    activeTab = 'patient-alerts';
    role = 'patient';
  } else if (screenId === 'screen-patient-settings') {
    activeTab = 'patient-settings';
    role = 'patient';
  }

  // If the screen corresponds to a nav tab, render the navigation
  if (activeTab) {
    globalNavContainer.innerHTML = Components.getBottomNav(role, activeTab);
    globalNavContainer.style.display = 'block';

    // Update app content padding to account for fixed global nav
    const activeScreen = document.getElementById(screenId);
    if (activeScreen) {
       // Apply bottom padding dynamically so scroll is not cut off by the fixed nav
       const content = activeScreen.querySelector('.screen-content');
       if (content) {
          content.style.paddingBottom = '80px';
       }
    }
  } else {
    // Screens like onboarding, welcome, add-patient don't have bottom navs
    globalNavContainer.innerHTML = '';
    globalNavContainer.style.display = 'none';
  }
}

// 8. Reset Simulator Function
const btnResetSimulator = document.getElementById('btn-reset-simulator');
if (btnResetSimulator) {
  btnResetSimulator.addEventListener('click', () => {
  // Reset forms
  const regName = document.getElementById('reg-name');
  if (regName) {
    regName.value = '';
    regName.classList.remove('error-state');
    regName.removeAttribute('aria-invalid');
  }
  const regGender = document.getElementById('reg-gender');
  if (regGender) regGender.value = '';
  const regAge = document.getElementById('reg-age');
  if (regAge) {
    regAge.value = '';
    regAge.classList.remove('error-state');
    regAge.removeAttribute('aria-invalid');
  }

  const nameError = document.getElementById('name-error-msg');
  if (nameError) nameError.classList.add('d-none');
  const ageError = document.getElementById('age-error-msg');
  if (ageError) ageError.classList.add('d-none');

  const searchInputReset = document.getElementById('search-med-input');
  if (searchInputReset) searchInputReset.value = '';
  const dropdownResultsReset = document.querySelector('.dropdown-results');
  if (dropdownResultsReset) dropdownResultsReset.style.display = 'none';

  // Reset search and times states
  addedTimes = [];
  const searchPhase = document.getElementById('med-search-phase');
  const timesPhase = document.getElementById('med-times-phase');
  if (searchPhase && timesPhase) {
    timesPhase.classList.add('d-none');
    timesPhase.classList.remove('d-flex');
    searchPhase.classList.remove('d-none');
    searchPhase.classList.add('d-flex');
  }

  // Reset selected roles
  roleCards.forEach(c => c.classList.remove('selected'));
  document.getElementById('role-patient').classList.add('selected');
  document.getElementById('btn-flow-3').removeAttribute('data-next-flow');

  // Reset medicine search selections
  searchDropdownItems.forEach(i => i.classList.remove('selected'));
  searchDropdownItems[0].classList.add('selected');

  // Reset active switcher role back to "all" (Geral)
  setSidebarSwitcherRole('all', true);

  // Reset med checklist items to Figma default states
  medRows.forEach(row => {
    const medId = row.getAttribute('data-med-id');
    const statusText = row.querySelector('.med-status-indicator');
    if (medId === 'losartana') {
      row.classList.add('taken');
      if (statusText) {
        statusText.textContent = 'Tomado';
        statusText.className = 'med-status-indicator taken';
      }
    } else {
      row.classList.remove('taken');
      if (statusText) {
        statusText.textContent = medId === 'insulina' ? 'Pendente' : 'Agendado';
        statusText.className = 'med-status-indicator pending';
      }
    }
  });

  // Reset patient data cleanly
  activePatientId = null;

  // Clear sync data from localStorage
  localStorage.removeItem('lembremed_patient_code');
  localStorage.removeItem('lembremed_sync_patients');

  // Hide patient code card
  const codeCard = document.getElementById('patient-sync-code-card');
  if (codeCard) codeCard.style.display = 'none';

  initAgendaData();
  selectedDate = new Date().toISOString().split('T')[0];
  renderAgenda();
  renderPatientHomeChecklist();
  renderPatientMedsList();

  // Disable high contrast and reset font size on phone container
  const phoneContainer = document.getElementById('phone-container');
  if (phoneContainer) phoneContainer.classList.remove('high-contrast');
  localStorage.removeItem('lembremed_patient_contrast');
  localStorage.removeItem('lembremed_caregiver_contrast');
  localStorage.removeItem('lembremed_patient_fontsize');
  localStorage.removeItem('lembremed_caregiver_fontsize');
  document.body.classList.remove('font-small', 'font-large', 'font-xlarge');
  // Reset patient toggle pill visually
  if (contrastToggle) {
    const pill = contrastToggle.querySelector('div[style*="position: relative"]');
    if (pill) {
      const thumb = pill.querySelector('div');
      pill.style.backgroundColor = 'var(--color-border)';
      if (thumb) thumb.style.left = '2px';
    }
  }
  // Reset caregiver toggle pill visually
  const cgPill = document.getElementById('cg-contrast-toggle-pill');
  const cgThumb = document.getElementById('cg-contrast-toggle-thumb');
  if (cgPill) cgPill.style.backgroundColor = 'var(--color-border)';
  if (cgThumb) cgThumb.style.left = '2px';
  // Reset font-size status displays
  const fsStatus = document.getElementById('font-size-status');
  if (fsStatus) fsStatus.textContent = 'Médio';
  const cgFsStatus = document.getElementById('cg-font-size-status');
  if (cgFsStatus) cgFsStatus.textContent = 'Médio';

  // Route back to Screen 1
  showScreen('screen-1');
});
}

// 9. Real-Time Status Bar Clock Ticker
function updatePhoneClock() {
  const timeDisplay = document.getElementById('phone-time');
  if (!timeDisplay) return;

  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();

  // Zero padding
  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;

  timeDisplay.textContent = `${hours}:${minutes}`;

  // Periodically check for active reminder on minute change
  const activeScreen = document.querySelector('.app-screen.active');
  if (activeScreen && activeScreen.id === 'screen-patient-home') {
    triggerSimulatedMedReminder();
  }
}

updatePhoneClock();
setInterval(updatePhoneClock, 60000); // Update every minute

// Initialize Upgraded Screen 6 Agenda logic
initAgendaData();
setupCalendarClickListeners();
renderAgenda();

// ==========================================================================