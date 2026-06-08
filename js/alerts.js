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
      notes: [],
      history: []
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
        <p>Você não tem histórico ou alertas no momento.</p>
      </div>
    `;
    return;
  }

  // Create a combined log of alerts and medication actions
  let historyLogs = [];

  // 1. Add Dynamic Alerts
  if (patient.alerts && patient.alerts.length > 0) {
    patient.alerts.forEach(alert => {
      historyLogs.push({
        id: alert.id,
        type: 'alert',
        severity: alert.class || 'info',
        title: alert.title,
        text: alert.text,
        time: alert.time || 'Recente',
        isoTimestamp: alert.isoTimestamp || new Date().toISOString(), // Fallback for old alerts
        dismissable: true
      });
    });
  }

  // 2. Add Persistent History Events
  if (patient.history && patient.history.length > 0) {
    patient.history.forEach((event, idx) => {
      if (event.type === 'registered') {
        historyLogs.push({
          id: `hist_reg_${idx}`,
          type: 'history',
          severity: 'info',
          title: 'Novo Medicamento',
          text: `Você cadastrou <strong>${event.medName}</strong> (${event.dose}) para os horários: ${event.times.join(', ')}.`,
          time: event.timestamp,
          isoTimestamp: event.isoTimestamp || new Date().toISOString()
        });
      } else if (event.type === 'taken') {
        historyLogs.push({
          id: `hist_taken_${idx}`,
          type: 'history',
          severity: 'success',
          title: 'Medicamento Tomado',
          text: `Você marcou <strong>${event.medName}</strong> como tomado.`,
          time: event.timestamp,
          isoTimestamp: event.isoTimestamp || new Date().toISOString()
        });
      } else if (event.type === 'unmarked') {
        historyLogs.push({
          id: `hist_unmarked_${idx}`,
          type: 'history',
          severity: 'warning',
          title: 'Medicamento Desmarcado',
          text: `Você desmarcou <strong>${event.medName}</strong>.`,
          time: event.timestamp,
          isoTimestamp: event.isoTimestamp || new Date().toISOString()
        });
      }
    });
  }

  // 3. Add Current Critical Alerts (Delayed meds not yet taken)
  if (patient.meds && patient.meds.length > 0) {
    const todayStr = new Date().toISOString().split('T')[0];
    patient.meds.forEach((med, idx) => {
      const isPast = window.AgendaLogic.isTimePassed(med.time);
      if (med.status !== 'tomado' && isPast) {
        historyLogs.push({
          id: `med_delayed_crit_${idx}`,
          type: 'critical',
          severity: 'danger',
          title: 'Medicamento Atrasado',
          text: `Atenção! Você ainda não tomou <strong>${med.name}</strong> das ${med.time}.`,
          time: med.time,
          isoTimestamp: `${todayStr}T${med.time}:00Z`
        });
      } else if (med.status !== 'tomado' && !isPast) {
         historyLogs.push({
          id: `med_pending_next_${idx}`,
          type: 'next',
          severity: 'warning',
          title: 'Próximo Medicamento',
          text: `Lembre-se de tomar <strong>${med.name}</strong> no horário agendado (${med.time}).`,
          time: med.time,
          isoTimestamp: `${todayStr}T${med.time}:00Z`
        });
      }
    });
  }

  // Sort logs by isoTimestamp (newest first)
  historyLogs.sort((a, b) => b.isoTimestamp.localeCompare(a.isoTimestamp));

  if (historyLogs.length === 0) {
    feed.innerHTML = `
      <div class="empty-state" style="text-align: center; padding: 32px 16px; color: var(--color-text-light);">
        <p>Nenhuma atividade registrada.</p>
      </div>
    `;
    return;
  }

  // Render Log
  const logContainer = document.createElement('div');
  logContainer.className = 'history-log-timeline';

  historyLogs.forEach(log => {
    const item = document.createElement('div');
    item.className = `log-item severity-${log.severity} log-type-${log.type}`;

    let iconHtml = '';
    if (log.severity === 'success') {
      iconHtml = `<svg class="log-icon" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
    } else if (log.severity === 'danger') {
      iconHtml = `<svg class="log-icon" viewBox="0 0 24 24"><octagon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
    } else if (log.severity === 'warning') {
      iconHtml = `<svg class="log-icon" viewBox="0 0 24 24"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
    } else {
      iconHtml = `<svg class="log-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
    }

    item.innerHTML = `
      <div class="log-time">${log.time}</div>
      <div class="log-dot"></div>
      <div class="log-content">
        <div class="log-header">
          <strong>${log.title}</strong>
          ${log.dismissable ? `<button class="log-dismiss-btn" data-id="${log.id}">&times;</button>` : ''}
        </div>
        <p>${log.text}</p>
      </div>
    `;

    if (log.dismissable) {
      const btnDismiss = item.querySelector('.log-dismiss-btn');
      btnDismiss.addEventListener('click', (e) => {
        e.stopPropagation();
        patient.alerts = patient.alerts.filter(a => a.id !== log.id);
        renderPatientAlerts();
      });
    }

    logContainer.appendChild(item);
  });

  feed.appendChild(logContainer);
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

function checkAndDismissToast(medName) {
  const toast = document.getElementById('med-reminder-toast');
  const body = document.getElementById('med-reminder-body');
  if (toast && toast.classList.contains('active') && body) {
    if (body.textContent.toLowerCase().includes(medName.toLowerCase())) {
      toast.classList.remove('active');
    }
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
const btnEditMedTime = document.getElementById('btn-edit-med-time');
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

if (btnEditMedTime) {
  btnEditMedTime.addEventListener('click', () => {
    if (selectedMedForEdit !== null) {
      if (medBottomSheet) medBottomSheet.classList.remove('active');

      // Navigate to Screen 5 Phase 2
      showScreen('screen-5');
      const searchPhase = document.getElementById('med-search-phase');
      const timesPhase = document.getElementById('med-times-phase');
      if (searchPhase && timesPhase) {
        searchPhase.classList.add('d-none');
        searchPhase.classList.remove('d-flex');
        timesPhase.classList.remove('d-none');
        timesPhase.classList.add('d-flex');
      }

      // Populate preview
      const previewName = document.getElementById('preview-med-name');
      const previewDose = document.getElementById('preview-med-dose');
      if (previewName) previewName.textContent = selectedMedForEdit.med.name;
      if (previewDose) previewDose.textContent = selectedMedForEdit.med.dose;

      // Reset times to current med time
      window.addedTimes = [selectedMedForEdit.med.time];
      if (typeof renderTimeChips === 'function') renderTimeChips();

      // Need to handle the update logic in btnConfirmMedTimes or replace it
      // For now, let's mark it as an edit session
      window.isEditingMed = true;
      window.originalMedToEdit = JSON.parse(JSON.stringify(selectedMedForEdit.med));
    }
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
// 9. GENERIC CUSTOM ALERT
window.showCustomAlert = function(title, message) {
  const modal = document.getElementById('generic-alert-modal');
  const titleEl = document.getElementById('generic-alert-modal-title');
  const descEl = document.getElementById('generic-alert-modal-desc');

  if (!modal || !titleEl || !descEl) return;

  titleEl.textContent = title;
  descEl.textContent = message;

  modal.classList.add('active');
};

const btnGenericAlertClose = document.getElementById('btn-generic-alert-close');
if (btnGenericAlertClose) {
  btnGenericAlertClose.addEventListener('click', () => {
    const modal = document.getElementById('generic-alert-modal');
    if (modal) {
      modal.classList.remove('active');
    }
  });
}
