// ==========================================================================
// SCREEN 6 DATABASE & ACCESS-FIRST LOGIC
// ==========================================================================
const BASELINE_AGENDA_DATA = {
  '2026-05-15': {
    dateLabel: 'Sexta-feira, 15 de Maio',
    meds: [
      { name: 'Losartana Potássica', dose: '50mg • 1 Comprimido', time: '08:00', status: 'tomado' },
      { name: 'Dipirona Sódica', dose: '500mg • 1 Comprimido', time: '12:00', status: 'tomado' },
      { name: 'Insulina NPH', dose: '10 UI • Injeção subcutânea', time: '18:00', status: 'tomado' }
    ]
  },
  '2026-05-16': {
    dateLabel: 'Sábado, 16 de Maio',
    meds: [
      { name: 'Losartana Potássica', dose: '50mg • 1 Comprimido', time: '08:00', status: 'tomado' },
      { name: 'Multivitamínico', dose: '1 Comprimido', time: '10:00', status: 'tomado' },
      { name: 'Dipirona Sódica', dose: '500mg • 1 Comprimido', time: '12:00', status: 'tomado' }
    ]
  },
  '2026-05-17': {
    dateLabel: 'Domingo, 17 de Maio',
    meds: [
      { name: 'Losartana Potássica', dose: '50mg • 1 Comprimido', time: '08:00', status: 'tomado' },
      { name: 'Dipirona Sódica', dose: '500mg • 1 Comprimido', time: '12:00', status: 'atrasado' },
      { name: 'Insulina NPH', dose: '10 UI • Injeção subcutânea', time: '18:00', status: 'atrasado' }
    ]
  },
  '2026-05-18': {
    dateLabel: 'Segunda-feira, 18 de Maio',
    meds: [
      { name: 'Losartana Potássica', dose: '50mg • 1 Comprimido', time: '08:00', status: 'tomado' },
      { name: 'Dipirona Sódica', dose: '500mg • 1 Comprimido', time: '12:00', status: 'tomado' },
      { name: 'Insulina NPH', dose: '10 UI • Injeção subcutânea', time: '18:00', status: 'tomado' }
    ]
  },
  '2026-05-19': {
    dateLabel: 'Terça-feira, 19 de Maio',
    meds: [
      { name: 'Losartana Potássica', dose: '50mg • 1 Comprimido', time: '08:00', status: 'tomado' },
      { name: 'Dipirona Sódica', dose: '500mg • 1 Comprimido', time: '12:00', status: 'tomado' },
      { name: 'Metformina 850mg', dose: '1 Comprimido', time: '20:00', status: 'tomado' }
    ]
  },
  '2026-05-20': {
    dateLabel: 'Quarta-feira, 20 de Maio',
    meds: [
      { name: 'Losartana Potássica', dose: '50mg • 1 Comprimido', time: '08:00', status: 'tomado' },
      { name: 'Dipirona Sódica', dose: '500mg • 1 Comprimido', time: '12:00', status: 'tomado' },
      { name: 'Insulina NPH', dose: '10 UI • Injeção subcutânea', time: '18:00', status: 'pendente' }
    ]
  },
  '2026-05-21': {
    dateLabel: 'Hoje, 21 de Maio',
    meds: [
      { name: 'Losartana Potássica', dose: '50mg • 1 Comprimido', time: '08:00', status: 'tomado' },
      { name: 'Dipirona Sódica', dose: '500mg • 1 Comprimido', time: '12:00', status: 'pendente' },
      { name: 'Insulina NPH', dose: '10 UI • Injeção subcutânea', time: '18:00', status: 'pendente' },
      { name: 'Paracetamol', dose: '750mg • 1 Comprimido', time: '22:00', status: 'pendente' }
    ]
  }
};

let agendaData = {};
let selectedDate = '';

function initAgendaData() {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 (Dom) to 6 (Sáb)

  // Start from Sunday of the current week
  const sunday = new Date(now);
  sunday.setDate(now.getDate() - dayOfWeek);
  sunday.setHours(0, 0, 0, 0);

  agendaData = {};

  for (let i = 0; i < 7; i++) {
    const date = new Date(sunday);
    date.setDate(sunday.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];

    let dateLabel = date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
    // Capitalize first letter
    dateLabel = dateLabel.charAt(0).toUpperCase() + dateLabel.slice(1);

    if (dateStr === now.toISOString().split('T')[0]) {
      dateLabel = `Hoje, ${date.getDate()} de ${date.toLocaleDateString('pt-BR', { month: 'long' })}`;
      selectedDate = dateStr;
    }

    agendaData[dateStr] = {
      dateLabel: dateLabel,
      meds: []
    };
  }

  // Populate with baseline data if not in pitch mode, matching by day of week if exact date doesn't match
  if (appState.mode !== 'pitch') {
    Object.keys(BASELINE_AGENDA_DATA).forEach(baseDateStr => {
      const baseDate = new Date(baseDateStr + 'T00:00:00');
      const baseDayOfWeek = baseDate.getDay();

      const targetDateStr = Object.keys(agendaData).find(d => new Date(d + 'T00:00:00').getDay() === baseDayOfWeek);
      if (targetDateStr) {
        agendaData[targetDateStr].meds = JSON.parse(JSON.stringify(BASELINE_AGENDA_DATA[baseDateStr].meds));
      }
    });
  }
}

function renderAgenda() {
  const data = agendaData[selectedDate];
  const medListContainer = document.getElementById('agenda-med-list');
  const selectedDayLabel = document.getElementById('agenda-selected-day-label');
  const selectedDayStatus = document.getElementById('agenda-selected-day-status');

  // Always update calendar strip UI & Weekly Adherence at the start so selection class is visually updated immediately
  updateCalendarStrip();
  updateWeeklyAdherence();

  if (!data) {
    if (selectedDayLabel) {
      selectedDayLabel.textContent = 'Sem agendamentos';
    }
    if (selectedDayStatus) {
      selectedDayStatus.textContent = '0 de 0 tomados';
    }
    if (medListContainer) {
       medListContainer.innerHTML = `
        <div class="empty-state" style="text-align: center; padding: 32px 16px; color: var(--color-text-light);">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 12px; opacity: 0.5;">
            <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" fill="none"/>
            <path d="m8.5 15.5 7-7"/>
          </svg>
          <p>Você ainda não tem medicamentos agendados para este dia.</p>
        </div>
       `;
    }
    return;
  }

  // 1. Update Selected Day label
  if (selectedDayLabel) {
    selectedDayLabel.textContent = data.dateLabel;
  }

  // 2. Count meds status
  const totalMeds = data.meds.length;
  const takenMeds = data.meds.filter(m => m.status === 'tomado').length;

  if (selectedDayStatus) {
    selectedDayStatus.textContent = `${takenMeds} de ${totalMeds} tomados`;
  }

  // 3. Render medication list
  if (medListContainer) {
    medListContainer.innerHTML = '';

    if (data.meds.length === 0) {
      medListContainer.innerHTML = `
        <div class="empty-state" style="text-align: center; padding: 32px 16px; color: var(--color-text-light);">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 12px; opacity: 0.5;">
            <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" fill="none"/>
            <path d="m8.5 15.5 7-7"/>
          </svg>
          <p>Você ainda não tem medicamentos agendados para este dia.</p>
        </div>
      `;
      return;
    }

    data.meds.forEach((med, index) => {
      const card = document.createElement('div');

      const todayStr = new Date().toISOString().split('T')[0];
      let displayStatus = med.status;
      if (med.status === 'pendente' && selectedDate === todayStr && window.AgendaLogic.isTimePassed(med.time)) {
        displayStatus = 'atrasado';
      }

      card.className = `agenda-med-card status-${displayStatus}`;
      card.setAttribute('data-med-index', index);
      card.setAttribute('tabindex', '0'); // Accessibility
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `Medicamento ${med.name}, dose ${med.dose}, às ${med.time}, status ${displayStatus}`);

      let badgeHtml = '';
      if (displayStatus === 'tomado') {
        badgeHtml = `
          <div class="agenda-status-badge tomado">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Tomado
          </div>
        `;
      } else if (displayStatus === 'atrasado') {
        badgeHtml = `
          <div class="agenda-status-badge atrasado">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            Atrasado
          </div>
        `;
      } else {
        badgeHtml = `
          <div class="agenda-status-badge pendente">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            Pendente
          </div>
        `;
      }

      card.innerHTML = `
        <div class="agenda-med-time">${Components.escapeHTML(med.time)}</div>
        <div class="agenda-med-info">
          <h4>${Components.escapeHTML(med.name)}</h4>
          <p>${Components.escapeHTML(med.dose)}</p>
        </div>
        ${badgeHtml}
      `;

      // Status toggle click handler
      card.addEventListener('click', () => {
        toggleMedStatus(selectedDate, index);
      });

      // Accessibility
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleMedStatus(selectedDate, index);
        }
      });

      medListContainer.appendChild(card);
    });
  }
}

function toggleMedStatus(date, index) {
  const med = agendaData[date].meds[index];

  // Restriction: Prevent marking future medications as taken
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const isFutureDate = date > todayStr;
  const isFutureTimeToday = date === todayStr && !window.AgendaLogic.isTimePassed(med.time);

  if (med.status !== 'tomado' && (isFutureDate || isFutureTimeToday)) {
    alert(`Você ainda não pode tomar este medicamento. O horário agendado é ${med.time}${isFutureDate ? ' em um dia futuro' : ''}.`);
    return;
  }

  if (med.status === 'tomado') {
    med.status = 'pendente';
    announceToScreenReader(`Medicamento ${med.name} desmarcado`);

    const pk = Object.keys(appState.patients).find(k => k !== '__sync');
    if (pk && appState.patients[pk]) {
      if (!appState.patients[pk].history) appState.patients[pk].history = [];
      appState.patients[pk].history.push({
        type: 'unmarked',
        medName: med.name,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        isoTimestamp: new Date().toISOString()
      });
    }
  } else {
    med.status = 'tomado';

    const pk = Object.keys(appState.patients).find(k => k !== '__sync');
    if (pk && appState.patients[pk]) {
      if (!appState.patients[pk].history) appState.patients[pk].history = [];
      appState.patients[pk].history.push({
        type: 'taken',
        medName: med.name,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        isoTimestamp: new Date().toISOString()
      });
    }
    announceToScreenReader(`Medicamento ${med.name} marcado como tomado`);
    if (typeof checkAndDismissToast === 'function') {
      checkAndDismissToast(med.name);
    }
  }

  // Bidirectional sync with patient home checklist if today
  const currentPatientKey = Object.keys(appState.patients).find(k => k !== '__sync');
  if (date === todayStr && currentPatientKey) {
    const patMeds = patientsProfileData[currentPatientKey] && patientsProfileData[currentPatientKey].meds;
    if (patMeds) {
      const patMed = patMeds.find(m => m.name.toLowerCase() === med.name.toLowerCase());
      if (patMed) patMed.status = med.status;
    }
    renderPatientHomeChecklist();
    publishPatientSyncData();
  }

  renderAgenda();
}

function updateCalendarStrip() {
  const strip = document.getElementById('agenda-calendar-strip');
  if (!strip) return;

  const dates = Object.keys(agendaData).sort();
  const dayNamesShort = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  // If the strip is empty, populate it
  if (strip.children.length === 0) {
    dates.forEach(dateStr => {
      const date = new Date(dateStr + 'T00:00:00');
      const day = document.createElement('div');
      day.className = 'calendar-day';
      day.setAttribute('data-date', dateStr);
      day.innerHTML = `
        <span class="day-name">${dayNamesShort[date.getDay()]}</span>
        <span class="day-num">${date.getDate()}</span>
        <div class="day-status-icon"></div>
      `;
      strip.appendChild(day);
    });
    setupCalendarClickListeners();
  }

  const calendarDays = document.querySelectorAll('.calendar-day');
  const todayStr = new Date().toISOString().split('T')[0];

  calendarDays.forEach(dayElement => {
    const dateStr = dayElement.getAttribute('data-date');

    if (dateStr === selectedDate) {
      dayElement.classList.add('selected');
      dayElement.setAttribute('aria-selected', 'true');
    } else {
      dayElement.classList.remove('selected');
      dayElement.setAttribute('aria-selected', 'false');
    }

    const dayData = agendaData[dateStr];
    const iconWrapper = dayElement.querySelector('.day-status-icon');
    if (iconWrapper) {
      if (dayData && dayData.meds && dayData.meds.length > 0) {
        const total = dayData.meds.length;
        const taken = dayData.meds.filter(m => m.status === 'tomado').length;
        let delayed = dayData.meds.filter(m => m.status === 'atrasado').length;

        if (dateStr === todayStr) {
          const pastMedsNotTaken = dayData.meds.filter(m => m.status === 'pendente' && window.AgendaLogic.isTimePassed(m.time)).length;
          delayed += pastMedsNotTaken;
        }

        // Clear custom styles
        iconWrapper.style.backgroundColor = '';
        iconWrapper.style.border = '';
        iconWrapper.style.boxShadow = '';

        iconWrapper.className = 'day-status-icon';

        if (taken === total) {
          iconWrapper.classList.add('taken');
          iconWrapper.textContent = '✓';
          iconWrapper.title = 'Completo';
        } else if (delayed > 0) {
          iconWrapper.classList.add('missed');
          iconWrapper.textContent = '✗';
          iconWrapper.title = 'Atrasado';
        } else {
          iconWrapper.classList.add('pending');
          iconWrapper.textContent = '◷';
          iconWrapper.title = 'Pendente';
        }
      } else {
        // No medications or empty day (for pitch simulation)
        iconWrapper.className = 'day-status-icon';
        iconWrapper.style.backgroundColor = 'transparent';
        iconWrapper.style.border = '1px dashed var(--color-text-light)';
        iconWrapper.style.boxShadow = 'none';
        iconWrapper.textContent = '·';
        iconWrapper.title = 'Sem medicamentos';
      }
    }
  });
}

function updateWeeklyAdherence() {
  const calendarDays = document.querySelectorAll('.calendar-day');
  let completedDaysCount = 0;
  let totalMedsAllDays = 0;
  let takenMedsAllDays = 0;

  calendarDays.forEach(dayElement => {
    const dateStr = dayElement.getAttribute('data-date');
    const dayData = agendaData[dateStr];
    if (dayData && dayData.meds && dayData.meds.length > 0) {
      const total = dayData.meds.length;
      const taken = dayData.meds.filter(m => m.status === 'tomado').length;

      totalMedsAllDays += total;
      takenMedsAllDays += taken;

      if (taken === total) {
        completedDaysCount++;
      }
    }
  });

  const summaryText = document.getElementById('agenda-adherence-summary');
  if (summaryText) {
    summaryText.textContent = `${completedDaysCount} de 7 dias completos`;
  }

  const percentage = totalMedsAllDays > 0 ? Math.round((takenMedsAllDays / totalMedsAllDays) * 100) : 0;

  const percentageText = document.getElementById('agenda-adherence-percentage');
  if (percentageText) {
    percentageText.textContent = `${percentage}%`;
  }

  const circlePath = document.getElementById('agenda-adherence-circle');
  if (circlePath) {
    circlePath.setAttribute('stroke-dasharray', `${percentage}, 100`);
  }
}

function setupCalendarClickListeners() {
  const calendarDays = document.querySelectorAll('.calendar-day');
  calendarDays.forEach(dayElement => {
    dayElement.setAttribute('tabindex', '0'); // Accessibility
    dayElement.setAttribute('role', 'button'); // Accessibility

    const dayName = dayElement.querySelector('.day-name')?.textContent || '';
    const dayNum = dayElement.querySelector('.day-num')?.textContent || '';
    dayElement.setAttribute('aria-label', `Selecionar ${dayName}, dia ${dayNum}`);

    const dateStr = dayElement.getAttribute('data-date');
    dayElement.setAttribute('aria-selected', dateStr === selectedDate ? 'true' : 'false');

    const selectHandler = (e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      const dateStr = dayElement.getAttribute('data-date');
      selectedDate = dateStr;
      renderAgenda();
    };

    dayElement.addEventListener('click', selectHandler);
    dayElement.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectHandler(e);
      }
    });
  });
}

// 1. Unified Router function with RBAC Guard
function showScreen(screenId) {
  // --- RBAC ROUTE GUARD ---
  const role = appState?.user?.role;
  const isPatient = role === 'patient';
  const isCaregiver = role === 'caregiver';

  // Define allowed screens per role
  const publicScreens = ['screen-1', 'screen-2', 'screen-3'];
  const patientScreens = ['screen-patient-home', 'screen-patient-meds', 'screen-patient-alerts', 'screen-patient-settings', 'screen-4', 'screen-5', 'screen-6'];
  const caregiverScreens = ['screen-7', 'screen-add-patient', 'screen-8', 'screen-9', 'screen-10', 'screen-11', 'screen-4', 'screen-5', 'screen-6'];

  let allowed = true;
  if (isPatient && !patientScreens.includes(screenId) && !publicScreens.includes(screenId)) {
    allowed = false;
  } else if (isCaregiver && !caregiverScreens.includes(screenId) && !publicScreens.includes(screenId)) {
    allowed = false;
  } else if (!isPatient && !isCaregiver && !publicScreens.includes(screenId)) {
    allowed = false;
  }

  if (!allowed) {
    console.warn(`[RBAC] Access denied for role '${role}' to screen '${screenId}'. Redirecting to Home.`);
    const fallbackScreen = isPatient ? 'screen-patient-home' : (isCaregiver ? 'screen-7' : 'screen-1');
    if (fallbackScreen !== screenId) {
        return showScreen(fallbackScreen); // Redirect
    }
  }
  // --- END RBAC ROUTE GUARD ---

  // Hide all screens
  appScreens.forEach(screen => {
    screen.classList.remove('active');
  });

  // Show target screen
  const targetScreen = document.getElementById(screenId);
  if (targetScreen) {
    targetScreen.classList.add('active');
  }

  // Update sidebar buttons active state
  sidebarButtons.forEach(btn => {
    const target = btn.getAttribute('data-target');
    if (target === screenId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Automatically hang up simulated calls when switching screens
  hangupCall();

  // Custom behaviors when entering specific screens
  if (screenId === 'screen-6') {
    renderAgenda();
  }
  if (screenId === 'screen-7') {
    renderCaregiverDashboard();
  }
  if (screenId === 'screen-patient-home') {
    renderPatientHomeChecklist();
  }
  if (screenId === 'screen-patient-meds') {
    renderPatientMedsList();
  }
  updateActiveTabsForScreen(screenId);
}

// Sidebar button event listeners
sidebarButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-target');
    showScreen(target);
  });
});

// ==========================================================================
// ROLE SWITCHER & SIDEBAR FILTER LOGIC
// ==========================================================================
const roleSwitcherTabs = document.querySelectorAll('#role-switcher .role-switcher-tab');
const sidebarScreenListBtns = document.querySelectorAll('#sidebar-screen-list .screen-btn');

function setSidebarSwitcherRole(role, preventRedirect = false) {
  roleSwitcherTabs.forEach(t => {
    if (t.getAttribute('data-role') === role) {
      t.classList.add('active');
    } else {
      t.classList.remove('active');
    }
  });

  sidebarScreenListBtns.forEach(btn => {
    const btnRole = btn.getAttribute('data-role');
    if (role === 'all') {
      btn.classList.remove('hidden-by-role');
    } else {
      if (btnRole === role || btnRole === 'shared') {
        btn.classList.remove('hidden-by-role');
      } else {
        btn.classList.add('hidden-by-role');
      }
    }
  });

  if (!preventRedirect) {
    if (role === 'patient') {
      showScreen('screen-patient-home');
    } else if (role === 'caregiver') {
      showScreen('screen-7');
    } else {
      showScreen('screen-1');
    }
  }
}

roleSwitcherTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const selectedRole = tab.getAttribute('data-role');
    setSidebarSwitcherRole(selectedRole);
  });
});

// Initialize Calendar Accessibility (fixing unused function warning)
setupCalendarClickListeners();
