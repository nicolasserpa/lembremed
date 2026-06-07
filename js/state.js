
// Onboarding custom slides data
const onboardingSlides = {
  patient: [
    {
      bg: "var(--color-primary)",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" fill="var(--color-primary)" stroke="var(--color-white)" stroke-width="1.5"/>
        <path d="M6 9h2.5l1.5-3 2 6 1.5-4 1.5 2H18" stroke="var(--color-white)" stroke-width="2.5"/>
      </svg>`,
      text: "Cuidar da sua rotina de remédios é cuidar da sua saúde."
    },
    {
      bg: "linear-gradient(135deg, #10B981, #059669)",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="var(--color-white)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
      </svg>`,
      text: "Receba lembretes na hora certa para nunca esquecer seus medicamentos."
    },
    {
      bg: "linear-gradient(135deg, #F59E0B, #D97706)",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="var(--color-white)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>`,
      text: "Conecte-se com cuidadores para um acompanhamento mais seguro e completo."
    }
  ],
  caregiver: [
    {
      bg: "var(--color-primary)",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="var(--color-white)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>`,
      text: "Acompanhar a rotina dos seus familiares ficou muito mais simples."
    },
    {
      bg: "linear-gradient(135deg, #10B981, #059669)",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="var(--color-white)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>`,
      text: "Receba alertas em tempo real se seu familiar atrasar a medicação."
    },
    {
      bg: "linear-gradient(135deg, #F59E0B, #D97706)",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="var(--color-white)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <line x1="9" y1="3" x2="9" y2="21"/>
        <line x1="15" y1="3" x2="15" y2="21"/>
        <line x1="3" y1="9" x2="21" y2="9"/>
        <line x1="3" y1="15" x2="21" y2="15"/>
      </svg>`,
      text: "Gerencie múltiplos pacientes em um único painel e garanta o cuidado completo."
    }
  ]
};

// Helper to display consistent patient age
function formatAgeText(age) {
  if (!age || age.toString().trim() === '' || age.toString().toLowerCase().includes('não informada')) {
    return 'Idade não informada';
  }
  const cleanAge = age.toString().replace(/\D/g, '');
  if (!cleanAge) {
    if (age.toString().includes('anos')) return age;
    return age;
  }
  return `${cleanAge} anos`;
}

// Navigation elements
const sidebarButtons = document.querySelectorAll('.screen-btn');
const appScreens = document.querySelectorAll('.app-screen');

// ==========================================================================
// APP STATE & INTERACTIVE DEMO (PITCH MODE)
// ==========================================================================
// DEMO MODE ONLY: Clear all storage on refresh so it's plug-and-play every time
// ==========================================================================
localStorage.clear();
sessionStorage.clear();

const appState = {
  mode: 'pitch',
  user: {
    name: '',
    role: '' // 'patient' ou 'caregiver'
  },
  patients: {}
};

// Alias dinâmico para retrocompatibilidade
let patientsProfileData = appState.patients;

// [AVISO DE ALTERAÇÃO - HIGIENE DE CÓDIGO]
// - O que existia antes: Limpeza dos campos de cadastro incluindo 'reg-phone'.
// - O que mudou: Limpeza do campo 'reg-phone' removida por completo, e adicionada a limpeza do novo campo de idade 'reg-age'.
function clearPitchData() {
  appState.user = { name: '', role: '', age: '' };
  appState.patients = {};
  patientsProfileData = appState.patients;
  
  const nameInput = document.getElementById('reg-name');
  const genderSelect = document.getElementById('reg-gender');
  const ageInput = document.getElementById('reg-age');
  if(nameInput) nameInput.value = '';
  if(genderSelect) genderSelect.value = '';
  if(ageInput) ageInput.value = '';
  
  const searchInputMock = document.getElementById('search-med-input');
  if (searchInputMock) searchInputMock.value = '';
  const dropdownResultsMock = document.querySelector('.dropdown-results');
  if (dropdownResultsMock) dropdownResultsMock.style.display = 'none';
  
  activePatientId = null;
  
  if (typeof initAgendaData === 'function') {
    initAgendaData();
  }
  if (typeof renderAgenda === 'function') {
    renderAgenda();
  }
}

// (Pitch Mode will be initialized at the end of the script to avoid Temporal Dead Zone issues)

let activePatientId = null;
let previousScreen = 'screen-7';

function renderPatientProfile(patientId) {
  activePatientId = patientId;
  const patient = patientsProfileData[patientId];
  if (!patient) return;

  // Demographics
  const avatar = document.getElementById('profile-avatar');
  const name = document.getElementById('profile-name');
  const age = document.getElementById('profile-age');
  const statusBadge = document.getElementById('profile-status-badge');

  if (avatar) avatar.textContent = patient.avatar;
  if (name) name.textContent = patient.name;
  if (age) age.textContent = formatAgeText(patient.age);

  if (statusBadge) {
    statusBadge.textContent = patient.status;
    if (patient.statusClass === 'taken') {
      statusBadge.className = 'patient-status-badge taken';
      statusBadge.style.backgroundColor = 'var(--color-success-bg)';
      statusBadge.style.color = 'var(--color-success-text)';
    } else if (patient.statusClass === 'atrasado') {
      statusBadge.className = 'patient-status-badge atrasado';
      statusBadge.style.backgroundColor = 'var(--color-danger-bg)';
      statusBadge.style.color = 'var(--color-danger-text)';
    } else {
      statusBadge.className = 'patient-status-badge pending';
      statusBadge.style.backgroundColor = '#E2E8F0';
      statusBadge.style.color = 'var(--color-text-muted)';
    }
  }

  // Adherence SVG Progress Ring
  const adherenceLabel = document.getElementById('profile-adherence-label');
  const adherenceCircle = document.getElementById('profile-adherence-circle');
  const adherencePercentage = document.getElementById('profile-adherence-percentage');

  if (adherenceLabel) {
    adherenceLabel.textContent = `${patient.adherence}% das doses tomadas`;
  }
  if (adherencePercentage) {
    adherencePercentage.textContent = `${patient.adherence}%`;
  }
  if (adherenceCircle) {
    adherenceCircle.setAttribute('stroke-dasharray', `${patient.adherence}, 100`);
  }

  // Active Medications
  const medsList = document.getElementById('profile-meds-list');
  if (medsList) {
    medsList.innerHTML = '';
    patient.meds.forEach(med => {
      const item = document.createElement('div');
      item.className = 'profile-med-item';
      
      let statusText = '';
      let statusStyle = '';
      if (med.status === 'tomado') {
        statusText = 'Tomado';
        statusStyle = 'color: var(--color-success-text); font-weight: 700;';
      } else if (med.status === 'atrasado') {
        statusText = 'Atrasado';
        statusStyle = 'color: var(--color-danger-text); font-weight: 700;';
      } else {
        statusText = 'Pendente';
        statusStyle = 'color: var(--color-text-muted); font-weight: 700;';
      }

      item.innerHTML = `
        <div style="text-align: left;">
          <h4 style="font-size: 14px; font-weight: 700; color: var(--color-text-dark);">${Components.escapeHTML(med.name)}</h4>
          <p style="font-size: 11px; color: var(--color-text-muted); margin-top: 1px;">${Components.escapeHTML(med.dose)}</p>
        </div>
        <span style="font-size: 12px; ${statusStyle}">${Components.escapeHTML(statusText)}</span>
      `;
      medsList.appendChild(item);
    });
  }

  // Recent History / Alerts
  const alertsList = document.getElementById('profile-alerts-list');
  if (alertsList) {
    alertsList.innerHTML = '';
    patient.alerts.forEach(alert => {
      const item = document.createElement('div');
      item.className = `alert-item ${alert.type}`;
      item.style.cursor = 'default';
      item.style.transform = 'none';
      item.style.boxShadow = 'none';
      
      let iconHtml = '';
      if (alert.type === 'warning') {
        iconHtml = `
          <svg class="alert-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        `;
      } else if (alert.type === 'danger') {
        iconHtml = `
          <svg class="alert-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <octagon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        `;
      } else if (alert.type === 'success') {
        iconHtml = `
          <svg class="alert-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        `;
      } else {
        iconHtml = `
          <svg class="alert-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
        `;
      }

      let prefixText = '';
      if (alert.type === 'warning') prefixText = 'Atenção';
      else if (alert.type === 'danger') prefixText = 'Crítico';
      else if (alert.type === 'success') prefixText = 'Confirmado';
      else prefixText = 'Info';

      item.innerHTML = `
        <div class="alert-icon ${alert.class}">
          <svg class="icon" viewBox="0 0 24 24"><use href="#icon-bell"/></svg>
        </div>
        <div class="alert-info">
          <h4>${Components.escapeHTML(alert.title)}</h4>
          <p>${Components.escapeHTML(alert.text)}</p>
        </div>
        <span class="alert-time">${Components.escapeHTML(alert.time)}</span>
      `;
      alertsList.appendChild(item);
    });
  }

  // Caregiver Notes Feed
  renderNotesFeed();
}

function renderNotesFeed() {
  const patient = patientsProfileData[activePatientId];
  if (!patient) return;

  const notesFeed = document.getElementById('profile-notes-feed');
  if (notesFeed) {
    notesFeed.innerHTML = '';
    if (patient.notes.length === 0) {
      notesFeed.innerHTML = `
        <div style="font-size: 12px; color: var(--color-text-light); text-align: center; padding: 12px;">
          Nenhuma anotação registrada ainda.
        </div>
      `;
    } else {
      patient.notes.forEach(note => {
        const noteCard = document.createElement('div');
        noteCard.className = 'note-item';
        noteCard.innerHTML = `
          <div class="note-header">
            <h4>${Components.escapeHTML(note.title)}</h4>
            <span class="note-date">${Components.escapeHTML(note.date)}</span>
          </div>
          <p class="note-content">${Components.escapeHTML(note.content)}</p>
          <div class="note-footer">
            <span class="note-author">Por ${Components.escapeHTML(note.author)}</span>
            <button class="btn-delete-note" aria-label="Apagar nota" data-id="${Components.escapeHTML(note.id)}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"/>
              </svg>
            </button>
          </div>
        `;
        notesFeed.appendChild(noteCard);
      });
    }
    // Auto-scroll to bottom of notes feed
    notesFeed.scrollTop = notesFeed.scrollHeight;
  }
}

function prepareScreen8ForPatient(patientId) {
  const patient = patientsProfileData[patientId];
  if (!patient) return;
  const s8Avatar = document.querySelector('#screen-8 .patient-profile-avatar');
  const s8Name = document.querySelector('#screen-8 .patient-profile-details h4');
  const s8AgeMeta = document.querySelector('#screen-8 .patient-profile-details p');
  if (s8Avatar) s8Avatar.textContent = patient.avatar;
  if (s8Name) s8Name.textContent = patient.name;
  if (s8AgeMeta) s8AgeMeta.textContent = formatAgeText(patient.age);

  // Render corresponding checklist
  const checklistContainer = document.getElementById('patient-meds-checklist');
  if (checklistContainer) {
    checklistContainer.innerHTML = '';
    patient.meds.forEach(med => {
      const row = document.createElement('div');
      const isTaken = med.status === 'tomado';
      const isPending = med.status === 'pendente';
      const statusText = isTaken ? 'Tomado' : (isPending ? 'Pendente' : 'Atrasado');
      row.className = `med-row ${isTaken ? 'taken' : ''}`;
      row.setAttribute('data-med-id', med.name.toLowerCase().split(' ')[0]);
      
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
          <span class="med-time">${Components.escapeHTML(med.time || '08:00')}</span>
          <span class="med-status-indicator ${isTaken ? 'taken' : 'pending'}">${isTaken ? 'Tomado' : 'Pendente'}</span>
        </div>
      `;
      
      row.setAttribute('tabindex', '0');
      row.setAttribute('role', 'checkbox');
      row.setAttribute('aria-checked', isTaken ? 'true' : 'false');
      row.setAttribute('aria-label', `Medicamento ${med.name}, dose ${med.dose}, às ${med.time || '08:00'}, status ${isTaken ? 'Tomado' : 'Pendente'}`);

      row.addEventListener('click', () => {
        const nowTaken = !row.classList.contains('taken');
        row.setAttribute('aria-checked', nowTaken ? 'true' : 'false');
        if (nowTaken) {
          row.classList.add('taken');
          med.status = 'tomado';
          row.querySelector('.med-status-indicator').textContent = 'Tomado';
          row.querySelector('.med-status-indicator').className = 'med-status-indicator taken';
          announceToScreenReader(`Medicamento ${med.name} marcado como tomado`);
        } else {
          row.classList.remove('taken');
          med.status = 'pendente';
          row.querySelector('.med-status-indicator').textContent = 'Pendente';
          row.querySelector('.med-status-indicator').className = 'med-status-indicator pending';
          announceToScreenReader(`Medicamento ${med.name} desmarcado`);
        }
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
}

