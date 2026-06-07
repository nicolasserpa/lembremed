// ==========================================================================
// DYNAMIC PATIENT RENDERING LOGIC (SCREENS 7, 12 & 13)
// ==========================================================================

function renderCaregiverDashboard() {
  const listContainer = document.getElementById('caregiver-patients-list');
  const countEl = document.getElementById('caregiver-patients-count');

  if (!listContainer) return;
  listContainer.innerHTML = '';

  const patientsEntries = Object.entries(appState.patients);
  if (countEl) countEl.textContent = `${patientsEntries.length} paciente${patientsEntries.length !== 1 ? 's' : ''}`;

  if (patientsEntries.length === 0) {
    listContainer.innerHTML = `
      <div class="empty-state" style="text-align: center; padding: 32px 16px; color: var(--color-text-light);">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 12px; opacity: 0.5;">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
        </svg>
        <p>Você ainda não gerencia nenhum paciente.</p>
      </div>
    `;
    return;
  }

  patientsEntries.forEach(([patientId, patient]) => {
    // Dynamic status calculation based on current meds
    let isTaken = true;
    let anyDelayed = false;

    if (patient.meds && patient.meds.length > 0) {
      const takenCount = patient.meds.filter(m => m.status === 'tomado').length;
      const delayedCount = patient.meds.filter(m => m.status === 'pendente' && window.AgendaLogic.isTimePassed(m.time)).length;
      const explicitDelayedCount = patient.meds.filter(m => m.status === 'atrasado').length;

      isTaken = takenCount === patient.meds.length;
      anyDelayed = delayedCount > 0 || explicitDelayedCount > 0;
    }

    const statusClass = isTaken ? 'taken' : (anyDelayed ? 'atrasado' : 'pending');
    const statusText = isTaken ? 'Em dia' : (anyDelayed ? 'Atraso' : 'Pendente');


    const card = document.createElement('div');
    card.className = 'patient-card';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Paciente ${patient.name}, status ${statusText}`);
    card.innerHTML = `
      <div class="patient-avatar">${Components.escapeHTML(patient.avatar)}</div>
      <div class="patient-info">
        <h4>${Components.escapeHTML(patient.name)}</h4>
        <p>${Components.escapeHTML(formatAgeText(patient.age))}</p>
      </div>
      <span class="patient-status-badge ${statusClass}">${Components.escapeHTML(statusText)}</span>
    `;

    card.addEventListener('click', () => {
      previousScreen = 'screen-7';
      renderPatientProfile(patientId);
      showScreen('screen-11');
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        previousScreen = 'screen-7';
        renderPatientProfile(patientId);
        showScreen('screen-11');
      }
    });

    listContainer.appendChild(card);
  });
}

const btnAddPatientMock = document.getElementById('btn-add-patient-mock');
if (btnAddPatientMock) {
  btnAddPatientMock.addEventListener('click', () => {
    const mockId = 'patient_' + Date.now();
    appState.patients[mockId] = {
      avatar: 'NP',
      name: 'Novo Paciente',
      age: '65 anos • Recém adicionado',
      status: 'Em Dia',
      statusClass: 'taken',
      adherence: 100,
      meds: [],
      alerts: [],
      notes: []
    };
    renderCaregiverDashboard();
  });
}
function renderPatientHomeChecklist() {
  const greetingEl = document.getElementById('patient-home-greeting');
  if (greetingEl) {
    const userName = appState.user.name || 'Bem-vindo(a)';
    // Extract first name for greeting
    const firstName = userName.split(' ')[0];
    greetingEl.textContent = `Olá, ${firstName}!`;
  }

  // Use the first patient key found (created on login) or null for empty state
  const patientKey = Object.keys(appState.patients).find(k => k !== '__sync') || null;
  const patient = patientKey ? appState.patients[patientKey] : null;
  const checklistContainer = document.getElementById('patient-home-checklist');
  const countText = document.getElementById('patient-home-summary-count');

  if (!checklistContainer) return;
  checklistContainer.innerHTML = '';

  if (!patient || !patient.meds || patient.meds.length === 0) {
    if (countText) countText.textContent = '0 de 0';
    checklistContainer.innerHTML = `
      <div class="empty-state" style="text-align: center; padding: 32px 16px; color: var(--color-text-light);">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 12px; opacity: 0.5;">
          <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" fill="none"/>
          <path d="m8.5 15.5 7-7"/>
        </svg>
        <p>Você ainda não tem medicamentos agendados para hoje.</p>
      </div>
    `;
    return;
  }

  const total = patient.meds.length;
  const taken = patient.meds.filter(m => m.status === 'tomado').length;

  if (countText) {
    countText.textContent = `${taken} de ${total}`;
  }

  patient.meds.forEach((med, index) => {
    const row = document.createElement('div');
    const isTaken = med.status === 'tomado';
    const isPast = window.AgendaLogic.isTimePassed(med.time);
    const isDelayed = !isTaken && isPast;

    row.className = `med-row ${isTaken ? 'taken' : (isDelayed ? 'atrasado' : 'pendente')}`;

    let iconHtml = '';
    if (med.name.toLowerCase().includes('insulina')) {
      iconHtml = `
        <div class="med-icon blue">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m18 2 4 4M17 7l3-3M19 9l1.5-1.5M14 4 9.3 8.7a4.9 4.9 0 0 0 0 6.9l.4.4a4.9 4.9 0 0 0 6.9 0L20 11.3M9.3 8.7 5.7 5.1M16.3 15.7l-3.6-3.6M6 14l-4 4v4h4l4-4M13 7l-2.5 2.5"/>
          </svg>
        </div>
      `;
    } else if (med.name.toLowerCase().includes('losartana')) {
      iconHtml = `
        <div class="med-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" fill="none"/>
            <path d="m8.5 15.5 7-7"/>
          </svg>
        </div>
      `;
    } else {
      iconHtml = `
        <div class="med-icon orange">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" fill="none"/>
            <path d="m8.5 15.5 7-7"/>
          </svg>
        </div>
      `;
    }

    row.innerHTML = `
      ${iconHtml}
      <div class="med-info">
        <h4>${Components.escapeHTML(med.name)}</h4>
        <p>${Components.escapeHTML(med.dose.split(' • ')[0] || med.dose)} • Uso oral</p>
      </div>
      <div class="med-time-status">
        <span class="med-time">${Components.escapeHTML(med.time)}</span>
        <span class="med-status-indicator ${isTaken ? 'taken' : (isDelayed ? 'atrasado' : 'pending')}">${isTaken ? 'Tomado' : (isDelayed ? 'Atrasado' : 'Pendente')}</span>
      </div>
    `;

    row.setAttribute('tabindex', '0');
    row.setAttribute('role', 'checkbox');
    row.setAttribute('aria-checked', isTaken ? 'true' : 'false');
    row.setAttribute('aria-label', `Medicamento ${med.name}, dose ${med.dose}, às ${med.time}, status ${isTaken ? 'Tomado' : 'Pendente'}`);

    row.addEventListener('click', () => {
      const isTakenNow = med.status === 'tomado';
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];
      // Note: renderPatientHomeChecklist currently assumes it is displaying medications for "today".
      // We block marking as taken only if it is a future time TODAY.
      const isFutureTimeToday = !window.AgendaLogic.isTimePassed(med.time);

      // Restriction: Prevent marking future medications as taken
      if (!isTakenNow && isFutureTimeToday) {
        alert(`Você ainda não pode tomar este medicamento. O horário agendado é ${med.time}.`);
        return;
      }

      const nowTaken = !isTakenNow;
      med.status = nowTaken ? 'tomado' : 'pendente';

      const pk = Object.keys(appState.patients).find(k => k !== '__sync');
      if (pk && appState.patients[pk]) {
        if (!appState.patients[pk].history) appState.patients[pk].history = [];
        appState.patients[pk].history.push({
          type: nowTaken ? 'taken' : 'unmarked',
          medName: med.name,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          isoTimestamp: new Date().toISOString()
        });
      }
      row.setAttribute('aria-checked', nowTaken ? 'true' : 'false');

      if (med.status === 'tomado' && typeof checkAndDismissToast === 'function') {
        checkAndDismissToast(med.name);
      }

      // Sync with Screen 6 Agenda Data if the selected day is today
      const agendaToday = agendaData[todayStr];
      if (agendaToday) {
        const agendaMed = agendaToday.meds.find(m => m.name.toLowerCase() === med.name.toLowerCase());
        if (agendaMed) agendaMed.status = med.status;
      }

      // Publish sync data to localStorage for real-time cross-tab update
      publishPatientSyncData();

      // Update UI
      renderPatientHomeChecklist();
      renderAgenda(); // Sync screen 6
    });

    row.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        row.click();
      }
    });

    checklistContainer.appendChild(row);
  });
}

function renderPatientMedsList() {
  const patientKey = Object.keys(appState.patients).find(k => k !== '__sync') || null;
  const patient = patientKey ? patientsProfileData[patientKey] : null;
  if (!patient) return;

  const container = document.getElementById('patient-meds-list-container');
  if (!container) return;

  container.innerHTML = '';

  patient.meds.forEach(med => {
    const card = document.createElement('div');
    card.className = 'profile-med-item';

    // Accessibility
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Medicamento ${med.name}, dose ${med.dose}, horário diário às ${med.time}`);

    card.innerHTML = `
      <div class="profile-med-item-left">
        <div class="profile-med-item-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" fill="none"/>
            <path d="m8.5 15.5 7-7"/>
          </svg>
        </div>
        <div class="profile-med-item-info">
          <h4>${Components.escapeHTML(med.name)}</h4>
          <p>${Components.escapeHTML(med.dose)} • Diário</p>
        </div>
      </div>
      <span class="profile-med-item-time">${Components.escapeHTML(med.time)}</span>
    `;
    container.appendChild(card);
  });
}

// Caregiver add medication button router integration
// Directs caregiver to screen-4 (Add medication hub) when clicked
const btnCaregiverAddMed = document.getElementById('btn-caregiver-add-med');
if (btnCaregiverAddMed) {
  btnCaregiverAddMed.addEventListener('click', () => {
    showScreen('screen-4');
  });
}
