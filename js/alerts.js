// ==========================================================================
// NEW FEATURES IMPLEMENTATION
// ==========================================================================

// 1. ADD PATIENT ROUTING AND LOGIC
const btnAddPatientNav = document.getElementById('btn-add-patient-nav');
const btnAddPatientBack = document.getElementById('btn-add-patient-back');
const btnSavePatient = document.getElementById('btn-save-patient');

if (btnAddPatientNav) {
  btnAddPatientNav.addEventListener('click', () => showScreen('screen-add-patient'));
}
if (btnAddPatientBack) {
  btnAddPatientBack.addEventListener('click', () => showScreen('screen-7'));
}
if (btnSavePatient) {
  btnSavePatient.addEventListener('click', () => {
    const nameInput = document.getElementById('add-patient-name');
    const errorMsg = document.getElementById('add-patient-name-error');
    const nameVal = nameInput.value.trim();

    if (!nameVal) {
      nameInput.classList.add('error-state');
      errorMsg.style.display = 'block';
      return;
    }
    nameInput.classList.remove('error-state');
    errorMsg.style.display = 'none';

    const ageInput = document.getElementById('add-patient-age');
    const ageErrorMsg = document.getElementById('add-patient-age-error');
    const ageRawVal = ageInput.value.trim();

    let ageValText = 'Idade não informada';
    if (ageRawVal) {
      const cleanAgeStr = ageRawVal.replace(/\D/g, '');
      const parsedAge = cleanAgeStr ? parseInt(cleanAgeStr, 10) : NaN;

      if (isNaN(parsedAge) || parsedAge < 0 || parsedAge > 130) {
        ageInput.classList.add('error-state');
        if (ageErrorMsg) ageErrorMsg.style.display = 'block';
        ageInput.focus();
        return;
      }
      ageValText = `${parsedAge} anos`;
    }

    if (ageErrorMsg) ageErrorMsg.style.display = 'none';
    ageInput.classList.remove('error-state');

    const mockId = 'patient_' + Date.now();

    appState.patients[mockId] = {
      avatar: nameVal.substring(0, 2).toUpperCase(),
      name: nameVal,
      age: ageValText,
      status: 'Em Dia',
      statusClass: 'taken',
      adherence: 100,
      meds: [],
      alerts: [],
      notes: []
    };

    // Limpa os campos
    nameInput.value = '';
    document.getElementById('add-patient-age').value = '';
    document.getElementById('add-patient-phone').value = '';

    renderCaregiverDashboard();
    showScreen('screen-7');
  });
}

// 2. SETTINGS BUTTONS (CAREGIVER & PATIENT)
const cgAccountBtn = document.getElementById('btn-cg-account');
const cgNotifBtn = document.getElementById('btn-cg-notifications');
const cgAboutBtn = document.getElementById('btn-cg-about');
const cgLogoutBtn = document.getElementById('btn-cg-logout');

const patAboutBtn = document.getElementById('btn-patient-about');
const patLogoutBtn = document.getElementById('btn-patient-logout');
const aboutModal = document.getElementById('about-modal');
const btnAboutClose = document.getElementById('btn-about-close');

if (cgNotifBtn) {
  cgNotifBtn.addEventListener('click', () => {
    const statusText = document.getElementById('cg-notif-status');
    if (statusText.textContent === 'Ativadas') {
      statusText.textContent = 'Desativadas';
      statusText.style.color = 'var(--color-text-muted)';
    } else {
      statusText.textContent = 'Ativadas';
      statusText.style.color = 'var(--color-success-text)';
    }
  });
}

const openAbout = () => { if(aboutModal) aboutModal.classList.add('active'); };
const closeAbout = () => { if(aboutModal) aboutModal.classList.remove('active'); };

if (cgAboutBtn) cgAboutBtn.addEventListener('click', openAbout);
if (patAboutBtn) patAboutBtn.addEventListener('click', openAbout);
if (btnAboutClose) btnAboutClose.addEventListener('click', closeAbout);

const performLogout = () => {
  // Reset to screen-1
  const btnResetSimulator = document.getElementById('btn-reset-simulator');
  if (btnResetSimulator) btnResetSimulator.click();
  else showScreen('screen-1');
};

if (cgLogoutBtn) cgLogoutBtn.addEventListener('click', performLogout);
if (patLogoutBtn) patLogoutBtn.addEventListener('click', performLogout);


// 3. ONBOARDING CAROUSEL (Handled dynamically inside initOnboardingCarousel)


// 4. PATIENT ALERTS DYNAMIC RENDERING
// [AVISO DE ALTERAÇÃO - UX & FEEDBACK EM TEMPO REAL]
// - Previous state: Static useless success alert display and alerts only for pending medications.
// - What changed: Removed the static useless success alert. Added full support for displaying dynamic alerts from 'patient.alerts' list (like caregiver link alert).
// - What was added: Touch 'x' dismiss button next to each dynamic alert to allow patient to discard unwanted notifications instantly.
function renderPatientAlerts() {
  const feed = document.getElementById('patient-alerts-feed');
  if (!feed) return;

  const pk = activePatientId || Object.keys(appState.patients).find(k => k !== '__sync');
  const patient = pk ? (appState.patients[pk] || patientsProfileData[pk]) : null;
  feed.innerHTML = '';

  if (!patient) {
    feed.innerHTML = `
      <div class="empty-state" style="text-align: center; padding: 32px 16px; color: var(--color-text-light);">
        <p>Você não tem alertas pendentes.</p>
      </div>
    `;
    return;
  }

  let hasAlerts = false;

  // 1. Pending Medications Alerts (Critical/System)
  const pendingMeds = patient.meds.filter(m => m.status === 'pendente' || m.status === 'atrasado');
  if (pendingMeds.length > 0) {
    hasAlerts = true;
    const item = document.createElement('div');
    item.className = 'alert-item danger';
    item.style.cursor = 'default';
    item.style.transform = 'none';
    item.style.boxShadow = 'none';
    item.innerHTML = `
      <div class="alert-item-content">
        <svg class="alert-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <octagon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <div class="alert-item-text">
          <strong>Atenção:</strong> Você tem ${pendingMeds.length} medicamento(s) pendente(s) hoje.
        </div>
      </div>
    `;
    feed.appendChild(item);
  }

  // 2. Dynamic Alerts (Dismissable Notifications with 'x' button)
  if (patient.alerts && patient.alerts.length > 0) {
    patient.alerts.forEach(alert => {
      hasAlerts = true;
      const item = document.createElement('div');
      item.className = `alert-item ${alert.class || 'info'}`;
      item.style.position = 'relative';
      item.style.display = 'flex';
      item.style.justifyContent = 'space-between';
      item.style.alignItems = 'center';

      let iconHtml = `
        <svg class="alert-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="16" x2="12" y2="12"/>
          <line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
      `;
      if (alert.class === 'success') {
        iconHtml = `
          <svg class="alert-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        `;
      }

      item.innerHTML = `
        <div class="alert-item-content" style="flex: 1; display: flex; align-items: center;">
          ${iconHtml}
          <div class="alert-item-text" style="font-size: 13px; line-height: 1.4; color: var(--color-text-dark);">
            <strong>${alert.title}:</strong> ${alert.text}
            <span style="display: block; font-size: 10px; opacity: 0.5; margin-top: 3px;">${alert.time || ''}</span>
          </div>
        </div>
        <button class="dismiss-patient-alert-btn" data-id="${alert.id}" aria-label="Remover notificação" style="background: none; border: none; color: var(--color-text-muted); cursor: pointer; font-size: 18px; font-weight: 700; padding: 4px 8px; line-height: 1; transition: color 0.2s ease;">&times;</button>
      `;

      const btnDismiss = item.querySelector('.dismiss-patient-alert-btn');
      if (btnDismiss) {
        btnDismiss.addEventListener('click', (e) => {
          e.stopPropagation();
          patient.alerts = patient.alerts.filter(a => a.id !== alert.id);
          renderPatientAlerts();
        });
      }

      feed.appendChild(item);
    });
  }

  if (!hasAlerts) {
    feed.innerHTML = `
      <div class="empty-state" style="text-align: center; padding: 32px 16px; color: var(--color-text-light);">
        <p>Você não tem alertas no momento.</p>
      </div>
    `;
  }
}

let onboardingInterval = null;
function initOnboardingCarousel(role) {
  const carousel = document.getElementById('onboarding-carousel');
  const dotsContainer = document.getElementById('onboarding-dots');
  const btnFlow3 = document.getElementById('btn-flow-3');
  if (!carousel || !dotsContainer) return;

  if (btnFlow3) {
    btnFlow3.textContent = "Próximo";
  }

  // Clear any previous interval
  if (onboardingInterval) {
    clearInterval(onboardingInterval);
    onboardingInterval = null;
  }

  const slidesData = onboardingSlides[role] || onboardingSlides.patient;

  // Generate slides HTML
  let slidesHtml = '';
  slidesData.forEach((slide, idx) => {
    const activeClass = idx === 0 ? 'active' : '';
    const styleBg = slide.bg.startsWith('var') ? `background-color: ${slide.bg};` : `background: ${slide.bg};`;
    slidesHtml += `
      <div class="onboarding-slide ${activeClass}" data-slide="${idx}">
        <div class="heart-badge-circle" style="${styleBg}">
          ${slide.icon}
        </div>
        <p class="onboarding-text">${slide.text}</p>
      </div>
    `;
  });
  carousel.innerHTML = slidesHtml;

  // Generate dots HTML
  let dotsHtml = '';
  slidesData.forEach((_, idx) => {
    const activeClass = idx === 0 ? 'active' : '';
    dotsHtml += `<span class="dot ${activeClass}" data-index="${idx}" role="button" aria-label="Ver slide ${idx + 1}" style="cursor: pointer;"></span>`;
  });
  dotsContainer.innerHTML = dotsHtml;

  let currentSlide = 0;
  const slides = carousel.querySelectorAll('.onboarding-slide');
  const dots = dotsContainer.querySelectorAll('.dot');

  function goToSlide(idx) {
    if (idx < 0 || idx >= slides.length) return;
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');

    currentSlide = idx;

    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');

    if (btnFlow3) {
      if (currentSlide === slides.length - 1) {
        btnFlow3.textContent = "Começar";
      } else {
        btnFlow3.textContent = "Próximo";
      }
    }
  }

  // Setup dot click listeners
  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const idx = parseInt(e.target.getAttribute('data-index'));
      goToSlide(idx);
      resetInterval();
    });
  });

  // Setup clean click listener for the flow button using live DOM elements
  if (btnFlow3) {
    const newBtn = btnFlow3.cloneNode(true);
    btnFlow3.parentNode.replaceChild(newBtn, btnFlow3);

    newBtn.addEventListener('click', () => {
      if (currentSlide < slides.length - 1) {
        goToSlide(currentSlide + 1);
        resetInterval();
      } else {
        if (role === 'caregiver') {
          showScreen('screen-7');
        } else {
          showScreen('screen-patient-home');
        }
      }
    });
  }

  function resetInterval() {
    if (onboardingInterval) clearInterval(onboardingInterval);
    onboardingInterval = setInterval(() => {
      let next = (currentSlide + 1) % slides.length;
      goToSlide(next);
    }, 4000);
  }

  resetInterval();
}

// Intercept showScreen to trigger logic
const originalShowScreen = window.showScreen || showScreen;
window.showScreen = showScreen = function(id) {
  originalShowScreen(id);
  if (id === 'screen-patient-alerts') {
    renderPatientAlerts();
  }
  if (id === 'screen-patient-home') {
    triggerSimulatedMedReminder();
  }
  if (id === 'screen-3') {
    initOnboardingCarousel(appState.user.role || 'patient');
  }
};


// 5. MEDICATION REMINDER TOAST
let lastTriggeredTime = '';
function triggerSimulatedMedReminder() {
  const toast = document.getElementById('med-reminder-toast');
  if (!toast) return;

  // Only show if there is a pending med
  const pk = activePatientId || Object.keys(appState.patients).find(k => k !== '__sync');
  const patient = pk ? appState.patients[pk] : null;
  if (!patient || !patient.meds) return;

  // Pega a hora atual do sistema em formato HH:MM
  const now = new Date();
  let hh = now.getHours();
  let mm = now.getMinutes();
  hh = hh < 10 ? '0' + hh : '' + hh;
  mm = mm < 10 ? '0' + mm : '' + mm;
  const currentTimeStr = `${hh}:${mm}`;

  // Avoid firing again in the same minute
  if (lastTriggeredTime === currentTimeStr) return;

  // Find a registered medication whose time matches the current time and hasn't been taken
  const matchingMed = patient.meds.find(m => m.time === currentTimeStr && m.status !== 'tomado');
  if (matchingMed) {
    document.getElementById('med-reminder-body').textContent = `${matchingMed.name} — ${matchingMed.dose}`;

    setTimeout(() => {
      toast.classList.add('active');
      if (typeof announceToScreenReader === 'function') {
          announceToScreenReader("Aviso: Hora do medicamento " + matchingMed.name);
      }
    }, 500);

    lastTriggeredTime = currentTimeStr;
  }
}

const btnDismissReminder = document.getElementById('btn-dismiss-reminder');
if (btnDismissReminder) {
  btnDismissReminder.addEventListener('click', () => {
    document.getElementById('med-reminder-toast').classList.remove('active');
  });
}


// 6. BOTTOM SHEET - EDIT/REMOVE MEDICATION
const medBottomSheet = document.getElementById('med-bottom-sheet');
const btnCloseBottomSheet = document.getElementById('btn-close-bottom-sheet');
const btnRemoveMed = document.getElementById('btn-remove-med');
let selectedMedForEdit = null;

function attachMedClickListener() {
  const patientMedsContainer = document.getElementById('patient-meds-list-container');
  if (!patientMedsContainer) return;

  // Override render function
  const originalRenderPatientMedsList = window.renderPatientMedsList || renderPatientMedsList;
  window.renderPatientMedsList = renderPatientMedsList = function() {
    originalRenderPatientMedsList();

    const cards = patientMedsContainer.querySelectorAll('.profile-med-item');
    cards.forEach((card, index) => {
      card.style.cursor = 'pointer';
      card.addEventListener('click', () => {
        const pk = activePatientId || Object.keys(appState.patients).find(k => k !== '__sync');
        const patient = pk ? patientsProfileData[pk] : null;
        if (patient && patient.meds[index]) {
          selectedMedForEdit = { index, med: patient.meds[index] };
          document.getElementById('bottom-sheet-med-name').textContent = patient.meds[index].name;
          document.getElementById('bottom-sheet-med-dose').textContent = `${patient.meds[index].dose} • ${patient.meds[index].time}`;
          if (medBottomSheet) medBottomSheet.classList.add('active');
        }
      });
    });
  };
  renderPatientMedsList();
}

if (btnCloseBottomSheet) {
  btnCloseBottomSheet.addEventListener('click', () => {
    if (medBottomSheet) medBottomSheet.classList.remove('active');
  });
}

if (btnRemoveMed) {
  btnRemoveMed.addEventListener('click', () => {
    if (selectedMedForEdit !== null) {
      const pk = activePatientId || Object.keys(appState.patients).find(k => k !== '__sync');
      const patient = pk ? patientsProfileData[pk] : null;
      if (!patient) return;
      patient.meds.splice(selectedMedForEdit.index, 1);

      if (pk && appState.patients[pk] && appState.patients[pk].meds) {
        appState.patients[pk].meds.splice(selectedMedForEdit.index, 1);
      }

      const todayDate = selectedDate || new Date().toISOString().split('T')[0];
      if (agendaData[todayDate] && agendaData[todayDate].meds) {
        const nameToRem = selectedMedForEdit.med.name;
        agendaData[todayDate].meds = agendaData[todayDate].meds.filter(m => m.name !== nameToRem);
      }

      renderPatientMedsList();
      renderPatientHomeChecklist();
      renderAgenda();
      if (medBottomSheet) medBottomSheet.classList.remove('active');

      if (typeof announceToScreenReader === 'function') {
          announceToScreenReader("Medicamento removido com sucesso.");
      }
    }
  });
}

// 7. CAREGIVER ALERTS - SWIPE TO DISMISS
const caregiverAlerts = document.querySelectorAll('#screen-9 .alert-item');
caregiverAlerts.forEach(alert => {
  const chevronDiv = alert.querySelector('.alert-item-chevron');
  if (chevronDiv) {
    chevronDiv.innerHTML = `
      <button class="dismiss-alert-btn" aria-label="Descartar alerta" style="background:none; border:none; color: var(--color-text-light); cursor:pointer; padding:4px;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    `;

    const btn = chevronDiv.querySelector('.dismiss-alert-btn');
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      alert.style.opacity = '0';
      alert.style.transform = 'translateX(20px)';
      setTimeout(() => alert.style.display = 'none', 300);
    });
  }
});

setTimeout(attachMedClickListener, 500);

// ==========================================================================