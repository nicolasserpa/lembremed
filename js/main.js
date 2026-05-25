document.addEventListener('DOMContentLoaded', () => {
  
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

  function clearPitchData() {
    appState.user = { name: '', role: '' };
    appState.patients = {};
    patientsProfileData = appState.patients;
    
    const nameInput = document.getElementById('reg-name');
    const genderSelect = document.getElementById('reg-gender');
    const phoneInput = document.getElementById('reg-phone');
    if(nameInput) nameInput.value = '';
    if(genderSelect) genderSelect.value = '';
    if(phoneInput) phoneInput.value = '';
    
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

  // (Modo Pitch será inicializado ao final do script para evitar problemas de Temporal Dead Zone)

  let activePatientId = 'cleusa';
  let previousScreen = 'screen-9';

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
            <h4 style="font-size: 14px; font-weight: 700; color: var(--color-text-dark);">${med.name}</h4>
            <p style="font-size: 11px; color: var(--color-text-muted); margin-top: 1px;">${med.dose}</p>
          </div>
          <span style="font-size: 12px; ${statusStyle}">${statusText}</span>
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
          <div class="alert-item-content">
            ${iconHtml}
            <div class="alert-item-text">
              <strong>${prefixText}:</strong> ${alert.text}
            </div>
          </div>
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
            <div class="note-item-header">
              <span class="note-item-author">${note.author}</span>
              <span class="note-item-time">${note.time}</span>
            </div>
            <div class="note-item-body">${note.text}</div>
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
            <h4>${med.name}</h4>
            <p>${med.dose.split(' • ')[0] || med.dose} • Uso oral</p>
          </div>
          <div class="med-time-status">
            <span class="med-time">${med.time || '08:00'}</span>
            <span class="med-status-indicator ${isTaken ? 'taken' : 'pending'}">${isTaken ? 'Tomado' : 'Pendente'}</span>
          </div>
        `;
        
        row.addEventListener('click', () => {
          const nowTaken = !row.classList.contains('taken');
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
        
        checklistContainer.appendChild(row);
      });
    }
  }


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
  let selectedDate = '2026-05-21';

  function initAgendaData() {
    if (appState.mode === 'pitch') {
      agendaData = {
        '2026-05-15': { dateLabel: 'Sexta-feira, 15 de Maio', meds: [] },
        '2026-05-16': { dateLabel: 'Sábado, 16 de Maio', meds: [] },
        '2026-05-17': { dateLabel: 'Domingo, 17 de Maio', meds: [] },
        '2026-05-18': { dateLabel: 'Segunda-feira, 18 de Maio', meds: [] },
        '2026-05-19': { dateLabel: 'Terça-feira, 19 de Maio', meds: [] },
        '2026-05-20': { dateLabel: 'Quarta-feira, 20 de Maio', meds: [] },
        '2026-05-21': { dateLabel: 'Hoje, 21 de Maio', meds: [] }
      };
    } else {
      agendaData = JSON.parse(JSON.stringify(BASELINE_AGENDA_DATA));
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
        card.className = `agenda-med-card status-${med.status}`;
        card.setAttribute('data-med-index', index);
        card.setAttribute('tabindex', '0'); // Accessibility
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `Medicamento ${med.name}, dose ${med.dose}, às ${med.time}, status ${med.status}`);
        
        let badgeHtml = '';
        if (med.status === 'tomado') {
          badgeHtml = `
            <div class="agenda-status-badge tomado">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              Tomado
            </div>
          `;
        } else if (med.status === 'atrasado') {
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
          <div class="agenda-med-time">${med.time}</div>
          <div class="agenda-med-info">
            <h4>${med.name}</h4>
            <p>${med.dose}</p>
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
    if (med.status === 'tomado') {
      med.status = 'pendente';
      announceToScreenReader(`Medicamento ${med.name} desmarcado`);
    } else {
      med.status = 'tomado';
      announceToScreenReader(`Medicamento ${med.name} marcado como tomado`);
    }
    
    // Bidirectional sync with Screen 12 (Maria Cleusa) if today
    if (date === '2026-05-21') {
      const patMeds = patientsProfileData['cleusa'].meds;
      const patMed = patMeds.find(m => m.name.toLowerCase() === med.name.toLowerCase());
      if (patMed) {
        patMed.status = med.status;
      }
      renderPatientHomeChecklist();
    }
    
    renderAgenda();
  }

  function updateCalendarStrip() {
    const calendarDays = document.querySelectorAll('.calendar-day');
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
          const delayed = dayData.meds.filter(m => m.status === 'atrasado').length;
          
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

  // 1. Unified Router function
  function showScreen(screenId) {
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
      const isTaken = patient.statusClass === 'taken';
      const statusText = patient.status || (isTaken ? 'Em dia' : 'Pendente');
      
      const card = document.createElement('div');
      card.className = 'patient-card';
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `Paciente ${patient.name}, status ${statusText}`);
      card.innerHTML = `
        <div class="patient-avatar" style="${!isTaken ? 'background-color: #E2E8F0;' : ''}">${patient.avatar}</div>
        <div class="patient-info">
          <h4>${patient.name}</h4>
          <p>${formatAgeText(patient.age)}</p>
        </div>
        <span class="patient-status-badge ${patient.statusClass || 'pending'}" ${!isTaken ? 'style="background-color: var(--color-danger-bg); color: var(--color-danger-text);"' : ''}>${statusText}</span>
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
      // For pitch purposes, let's also ensure 'cleusa' exists if we want to view profile 11
      if (!appState.patients['cleusa']) {
          appState.patients['cleusa'] = appState.patients[mockId];
      }
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

    // No modo paciente, usamos o usuário logado como 'cleusa' se em modo de referência,
    // ou se em pitch e vazio, listamos nada.
    // Para simplificar no pitch, assumimos que se o modo paciente for selecionado e não houver paciente 'cleusa', criamos um mock se necessário ou deixamos vazio.
    const patient = appState.patients['cleusa']; 
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
      row.className = `med-row ${isTaken ? 'taken' : ''}`;
      
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
          <h4>${med.name}</h4>
          <p>${med.dose.split(' • ')[0] || med.dose} • Uso oral</p>
        </div>
        <div class="med-time-status">
          <span class="med-time">${med.time}</span>
          <span class="med-status-indicator ${isTaken ? 'taken' : 'pending'}">${isTaken ? 'Tomado' : 'Pendente'}</span>
        </div>
      `;
      
      row.addEventListener('click', () => {
        const nowTaken = med.status !== 'tomado';
        med.status = nowTaken ? 'tomado' : 'pendente';
        
        // Sync with Screen 6 Agenda Data if the selected day is today (2026-05-21)
        const agendaToday = agendaData['2026-05-21'];
        if (agendaToday) {
          const agendaMed = agendaToday.meds.find(m => m.name.toLowerCase() === med.name.toLowerCase());
          if (agendaMed) {
            agendaMed.status = med.status;
          }
        }
        
        // Update UI
        renderPatientHomeChecklist();
        renderAgenda(); // Sync screen 6
      });
      
      checklistContainer.appendChild(row);
    });
  }

  function renderPatientMedsList() {
    const patient = patientsProfileData['cleusa'];
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
            <h4>${med.name}</h4>
            <p>${med.dose} • Diário</p>
          </div>
        </div>
        <span class="profile-med-item-time">${med.time}</span>
      `;
      container.appendChild(card);
    });
  }

  // ==========================================================================
  // ONBOARDING FLOW ROUTING UPDATES
  // ==========================================================================
  
  // Phone field masking logic (Cadastro Inicial & Cadastro de Paciente)
  const maskPhoneInput = (e) => {
    let x = e.target.value.replace(/\D/g, '').substring(0, 11);
    let formatted = '';
    if (x.length === 0) {
      formatted = '';
    } else if (x.length <= 2) {
      formatted = `(${x}`;
    } else if (x.length <= 6) {
      formatted = `(${x.substring(0, 2)}) ${x.substring(2)}`;
    } else if (x.length <= 10) {
      formatted = `(${x.substring(0, 2)}) ${x.substring(2, 6)}-${x.substring(6)}`;
    } else {
      formatted = `(${x.substring(0, 2)}) ${x.substring(2, 7)}-${x.substring(7)}`;
    }
    e.target.value = formatted;
  };

  const regPhone = document.getElementById('reg-phone');
  if (regPhone) {
    regPhone.addEventListener('input', maskPhoneInput);
  }

  const addPatientPhone = document.getElementById('add-patient-phone');
  if (addPatientPhone) {
    addPatientPhone.addEventListener('input', maskPhoneInput);
  }

  // Screen 1 -> Screen 2 (Cadastro -> Role Selection)
  const btnFlow1 = document.getElementById('btn-flow-1');
  if (btnFlow1) {
    btnFlow1.addEventListener('click', () => {
      const nameInput = document.getElementById('reg-name');
      const nameValue = nameInput.value.trim();
      const errorMsg = document.getElementById('name-error-msg');

      if (!nameValue) {
        nameInput.classList.add('error-state');
        nameInput.setAttribute('aria-invalid', 'true');
        if (errorMsg) errorMsg.style.display = 'block';
        nameInput.focus();
      } else {
        nameInput.classList.remove('error-state');
        nameInput.removeAttribute('aria-invalid');
        if (errorMsg) errorMsg.style.display = 'none';
        
        // Salva no estado
        appState.user.name = nameValue;
        
        showScreen('screen-2');
      }
    });
  }

  // Screen 2 -> Screen 3 (Role Selection -> Onboarding Intro)
  const btnFlow2 = document.getElementById('btn-flow-2');
  if (btnFlow2) {
    btnFlow2.addEventListener('click', () => {
      const selectedCard = document.querySelector('.role-card.selected');
      if (selectedCard) {
        const role = selectedCard.getAttribute('data-role') === 'cuidador' ? 'caregiver' : 'patient';
        
        // Salva no estado
        appState.user.role = role;
        
        // Inicializa o perfil do paciente principal se o perfil escolhido for Paciente,
        // garantindo o funcionamento dinâmico perfeito de todas as visões do paciente no Pitch.
        if (role === 'patient') {
          const userName = appState.user.name || 'Paciente';
          appState.patients['cleusa'] = {
            avatar: userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'PA',
            name: userName,
            age: 'Idade não informada',
            status: 'Em Dia',
            statusClass: 'taken',
            adherence: 100,
            meds: [],
            alerts: [],
            notes: []
          };
        } else {
          appState.patients = {};
          patientsProfileData = appState.patients;
        }
        
        setSidebarSwitcherRole(role, true); // Sync sidebar role selector, but prevent redirecting yet
      }
      showScreen('screen-3');
    });
  }

  // Screen 3 -> Home View (Onboarding Intro -> Screen 12 Patient OR Screen 7 Caregiver)
  const btnFlow3 = document.getElementById('btn-flow-3');
  if (btnFlow3) {
    btnFlow3.addEventListener('click', () => {
      const selectedCard = document.querySelector('.role-card.selected');
      const isCaregiver = selectedCard && selectedCard.getAttribute('data-role') === 'cuidador';
      if (isCaregiver) {
        showScreen('screen-7');
      } else {
        showScreen('screen-patient-home');
      }
    });
  }

  // Screen 4 click search-med card -> Screen 5 (Add Med -> Search Med)
  const btnCardSearchMed = document.getElementById('btn-card-search-med');
  if (btnCardSearchMed) {
    btnCardSearchMed.addEventListener('click', () => {
      showScreen('screen-5');
    });
  }

  // 4a. iOS-style Time Picker columns and state management
  const hoursColumn = document.getElementById('picker-hours-column');
  const minutesColumn = document.getElementById('picker-minutes-column');
  
  const pickerHours = [];
  for (let i = 0; i < 24; i++) {
    pickerHours.push(i < 10 ? '0' + i : '' + i);
  }
  const pickerMinutes = [];
  for (let i = 0; i < 60; i += 5) {
    pickerMinutes.push(i < 10 ? '0' + i : '' + i);
  }

  let selectedHour = '12';
  let selectedMinute = '00';
  let addedTimes = []; // Holds selected times, e.g., ["08:00", "20:00"]

  function populatePickerColumns() {
    if (hoursColumn && hoursColumn.children.length === 0) {
      // Empty buffer items at top and bottom for snap padding
      const topBuffer = document.createElement('div');
      topBuffer.style.height = '60px';
      hoursColumn.appendChild(topBuffer);
      
      pickerHours.forEach(h => {
        const item = document.createElement('div');
        item.className = 'ios-picker-item' + (h === '12' ? ' active' : '');
        item.textContent = h;
        hoursColumn.appendChild(item);
      });
      
      const bottomBuffer = document.createElement('div');
      bottomBuffer.style.height = '60px';
      hoursColumn.appendChild(bottomBuffer);
      
      // Scroll snapping
      setupIosPickerColumn(hoursColumn, pickerHours, (val) => {
        selectedHour = val;
      });
      
      // Initial scroll to '12'
      setTimeout(() => {
        hoursColumn.scrollTop = 12 * 30;
      }, 100);
    }
    
    if (minutesColumn && minutesColumn.children.length === 0) {
      const topBuffer = document.createElement('div');
      topBuffer.style.height = '60px';
      minutesColumn.appendChild(topBuffer);
      
      pickerMinutes.forEach(m => {
        const item = document.createElement('div');
        item.className = 'ios-picker-item' + (m === '00' ? ' active' : '');
        item.textContent = m;
        minutesColumn.appendChild(item);
      });
      
      const bottomBuffer = document.createElement('div');
      bottomBuffer.style.height = '60px';
      minutesColumn.appendChild(bottomBuffer);
      
      // Scroll snapping
      setupIosPickerColumn(minutesColumn, pickerMinutes, (val) => {
        selectedMinute = val;
      });
      
      // Initial scroll to '00'
      setTimeout(() => {
        minutesColumn.scrollTop = 0;
      }, 100);
    }
  }

  function setupIosPickerColumn(columnEl, itemsArray, onValueChange) {
    columnEl.addEventListener('scroll', () => {
      const index = Math.round(columnEl.scrollTop / 30);
      const items = columnEl.querySelectorAll('.ios-picker-item');
      items.forEach((item, i) => {
        if (i === index) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
      if (itemsArray[index] !== undefined) {
        onValueChange(itemsArray[index]);
      }
    });
  }

  const btnAddSelectedTime = document.getElementById('btn-add-selected-time');
  const selectedTimesChipsList = document.getElementById('selected-times-chips-list');
  const timesEmptyState = document.getElementById('times-empty-state');

  if (btnAddSelectedTime) {
    btnAddSelectedTime.addEventListener('click', () => {
      const timeStr = `${selectedHour}:${selectedMinute}`;
      if (addedTimes.includes(timeStr)) {
        return; // Avoid duplicates
      }
      addedTimes.push(timeStr);
      addedTimes.sort(); // Sort chronological
      renderTimeChips();
    });
  }

  function renderTimeChips() {
    if (!selectedTimesChipsList) return;
    
    // Clear all except empty state
    selectedTimesChipsList.innerHTML = '';
    
    if (addedTimes.length === 0) {
      if (timesEmptyState) {
        selectedTimesChipsList.appendChild(timesEmptyState);
      } else {
        selectedTimesChipsList.innerHTML = `<div class="empty-state-text" id="times-empty-state" style="color: var(--color-text-light); font-size: 13px; padding: 4px; text-align: center; width: 100%;">Nenhum horário adicionado ainda.</div>`;
      }
      return;
    }
    
    addedTimes.forEach(timeStr => {
      const chip = document.createElement('div');
      chip.className = 'time-chip';
      chip.innerHTML = `
        <span>${timeStr}</span>
        <button type="button" aria-label="Remover horário ${timeStr}">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      `;
      
      chip.querySelector('button').addEventListener('click', () => {
        addedTimes = addedTimes.filter(t => t !== timeStr);
        renderTimeChips();
      });
      
      selectedTimesChipsList.appendChild(chip);
    });
  }

  const btnBackToSearch = document.getElementById('btn-back-to-search');
  if (btnBackToSearch) {
    btnBackToSearch.addEventListener('click', () => {
      const searchPhase = document.getElementById('med-search-phase');
      const timesPhase = document.getElementById('med-times-phase');
      if (searchPhase && timesPhase) {
        timesPhase.style.display = 'none';
        searchPhase.style.display = 'flex';
      }
    });
  }

  const btnConfirmMedTimes = document.getElementById('btn-confirm-med-times');
  if (btnConfirmMedTimes) {
    btnConfirmMedTimes.addEventListener('click', () => {
      const selectedMedItem = document.querySelector('#screen-5 .dropdown-item.selected');
      if (!selectedMedItem) return;
      
      const medName = selectedMedItem.getAttribute('data-med') || 'Novo Medicamento';
      const dose = selectedMedItem.querySelector('p') ? selectedMedItem.querySelector('p').textContent : 'Uso oral';
      
      // If user hasn't added any times, add the current picker time by default
      if (addedTimes.length === 0) {
        addedTimes.push(`${selectedHour}:${selectedMinute}`);
      }
      
      const todayDate = selectedDate || '2026-05-21';
      if (!agendaData[todayDate]) {
        agendaData[todayDate] = { dateLabel: 'Hoje, 21 de Maio', meds: [] };
      }
      
      // Register all chosen times to the agenda
      addedTimes.forEach(timeStr => {
        agendaData[todayDate].meds.push({
          name: medName,
          dose: dose,
          time: timeStr,
          status: 'pendente'
        });
        
        // Sync with patient profile (Cleusa)
        if (appState.patients && appState.patients['cleusa'] && todayDate === '2026-05-21') {
          appState.patients['cleusa'].meds.push({
            name: medName,
            dose: dose,
            time: timeStr,
            status: 'pendente'
          });
        }
      });
      
      // Sort meds chronologically by time
      agendaData[todayDate].meds.sort((a, b) => a.time.localeCompare(b.time));
      if (appState.patients && appState.patients['cleusa'] && todayDate === '2026-05-21') {
        appState.patients['cleusa'].meds.sort((a, b) => a.time.localeCompare(b.time));
      }
      
      // Reset search and times states
      addedTimes = [];
      const searchPhase = document.getElementById('med-search-phase');
      const timesPhase = document.getElementById('med-times-phase');
      if (searchPhase && timesPhase) {
        timesPhase.style.display = 'none';
        searchPhase.style.display = 'flex';
      }
      if (searchInput) searchInput.value = '';
      
      renderAgenda();
      renderPatientHomeChecklist(); // Sync patient dashboard
      showScreen('screen-6');
    });
  }

  // Screen 5 -> Switch to Times Picker phase
  const btnFlow5 = document.getElementById('btn-flow-5');
  if (btnFlow5) {
    btnFlow5.addEventListener('click', () => {
      const selectedMedItem = document.querySelector('#screen-5 .dropdown-item.selected');
      if (selectedMedItem) {
        const medName = selectedMedItem.getAttribute('data-med') || 'Novo Medicamento';
        const dose = selectedMedItem.querySelector('p') ? selectedMedItem.querySelector('p').textContent : 'Uso oral';
        
        // Show Phase 2 selected medicine info
        const previewName = document.getElementById('preview-med-name');
        const previewDose = document.getElementById('preview-med-dose');
        if (previewName) previewName.textContent = medName;
        if (previewDose) previewDose.textContent = dose;
        
        // Reset added times and display chips
        addedTimes = [];
        renderTimeChips();
        
        // Switch Phase views
        const searchPhase = document.getElementById('med-search-phase');
        const timesPhase = document.getElementById('med-times-phase');
        if (searchPhase && timesPhase) {
          searchPhase.style.display = 'none';
          timesPhase.style.display = 'flex';
          
          // Populate iOS Time picker columns dynamically
          populatePickerColumns();
        }
      }
    });
  }

  // 3. Screen 2: Role selection toggle with keyboard support and WAI-ARIA
  const roleCards = document.querySelectorAll('.role-card');
  roleCards.forEach(card => {
    const selectCard = () => {
      roleCards.forEach(c => {
        c.classList.remove('selected');
        c.setAttribute('aria-checked', 'false');
      });
      card.classList.add('selected');
      card.setAttribute('aria-checked', 'true');
      
      const selectedRole = card.getAttribute('data-role');
      if (selectedRole === 'cuidador') {
        document.getElementById('btn-flow-3').setAttribute('data-next-flow', 'caregiver');
      } else {
        document.getElementById('btn-flow-3').removeAttribute('data-next-flow');
      }
    };

    card.addEventListener('click', selectCard);
    
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectCard();
      }
    });
  });

  // 4. Screen 5: Medicine search dropdown interactive selection
  const searchDropdownItems = document.querySelectorAll('.dropdown-item');
  const searchInput = document.getElementById('search-med-input');
  const dropdownResults = document.querySelector('.dropdown-results');
  
  if (searchInput && dropdownResults) {
    const showDropdown = () => {
      filterResults();
    };
    
    searchInput.addEventListener('focus', showDropdown);
    searchInput.addEventListener('click', showDropdown);
    
    const filterResults = () => {
      const query = searchInput.value.toLowerCase().trim();
      if (query === '') {
        dropdownResults.style.display = 'none';
        return;
      }
      let visibleCount = 0;
      
      searchDropdownItems.forEach(item => {
        const medName = (item.getAttribute('data-med') || '').toLowerCase();
        if (medName.includes(query)) {
          item.style.display = 'flex';
          visibleCount++;
        } else {
          item.style.display = 'none';
        }
      });
      
      if (visibleCount === 0) {
        dropdownResults.style.display = 'none';
      } else {
        dropdownResults.style.display = 'block';
      }
    };
    
    searchInput.addEventListener('input', filterResults);
    
    searchDropdownItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        searchDropdownItems.forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');
        
        const medName = item.getAttribute('data-med');
        searchInput.value = medName;
        dropdownResults.style.display = 'none';
      });
    });
    
    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !dropdownResults.contains(e.target)) {
        dropdownResults.style.display = 'none';
      }
    });
  }

  // 5. Screen 7: Caregiver Dashboard Patient Card interactions (Safeguards for static buttons)
  const btnPatientCleusa = document.getElementById('btn-patient-cleusa');
  if (btnPatientCleusa) {
    btnPatientCleusa.addEventListener('click', () => {
      previousScreen = 'screen-7';
      renderPatientProfile('cleusa');
      showScreen('screen-11');
    });
  }
  
  const btnPatientPedro = document.getElementById('btn-patient-pedro');
  if (btnPatientPedro) {
    btnPatientPedro.addEventListener('click', () => {
      previousScreen = 'screen-7';
      renderPatientProfile('pedro');
      showScreen('screen-11');
    });
  }

  // Screen 9: Interactive alerts card clicks and inline patient links
  const alertItems = document.querySelectorAll('#screen-9 .alert-item');
  alertItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const patientId = item.getAttribute('data-patient-id');
      if (patientId) {
        previousScreen = 'screen-9';
        renderPatientProfile(patientId);
        showScreen('screen-11');
      }
    });

    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const patientId = item.getAttribute('data-patient-id');
        if (patientId) {
          previousScreen = 'screen-9';
          renderPatientProfile(patientId);
          showScreen('screen-11');
        }
      }
    });
  });

  const patientNameLinks = document.querySelectorAll('#screen-9 .clickable-patient-name');
  patientNameLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.stopPropagation(); // Avoid double click triggers
      const patientId = link.getAttribute('data-patient-id');
      if (patientId) {
        previousScreen = 'screen-9';
        renderPatientProfile(patientId);
        showScreen('screen-11');
      }
    });
  });

  // Screen 11: Patient Profile Buttons and Notes Submit
  const backBtnProfile = document.getElementById('btn-profile-back');
  if (backBtnProfile) {
    backBtnProfile.addEventListener('click', () => {
      showScreen(previousScreen);
    });
  }

  const viewAgendaProfile = document.getElementById('btn-profile-view-agenda');
  if (viewAgendaProfile) {
    viewAgendaProfile.addEventListener('click', () => {
      prepareScreen8ForPatient(activePatientId);
      showScreen('screen-8');
    });
  }

  // ==========================================================================
  // SIMULATED EMERGENCY CALL CALLING SYSTEM (BIDIRECTIONAL)
  // ==========================================================================
  const toastCall = document.getElementById('phone-toast-call');
  const toastAvatar = document.getElementById('toast-call-avatar');
  const toastTitle = document.getElementById('toast-call-title');
  const toastSubtitle = document.getElementById('toast-call-subtitle');

  function startSimulatedCall(patientId) {
    let name = '';
    if (patientId === 'caregiver' || patientId === 'marcos') {
      name = 'Marcos (Cuidador)';
      if (toastAvatar) toastAvatar.textContent = 'MC';
      if (toastTitle) toastTitle.textContent = `Chamando Marcos (Cuidador)…`;
      if (toastSubtitle) toastSubtitle.textContent = `Ligando para contato de emergência`;
    } else {
      const patient = patientsProfileData[patientId];
      if (!patient) return;
      name = patient.name;
      if (toastAvatar) toastAvatar.textContent = patient.avatar;
      if (toastTitle) toastTitle.textContent = `Chamando ${patient.name}…`;
      if (toastSubtitle) toastSubtitle.textContent = `Ligando para contato principal`;
    }
    
    if (toastCall) {
      toastCall.classList.add('active');
    }
    announceToScreenReader(`Ligação iniciada. Chamando ${name}.`);
  }

  function hangupCall() {
    if (toastCall) {
      toastCall.classList.remove('active');
    }
    announceToScreenReader("Ligação encerrada.");
  }

  let pendingCallTarget = null;
  const confirmCallModal = document.getElementById('confirm-call-modal');
  const btnConfirmCallCancel = document.getElementById('btn-confirm-call-cancel');
  const btnConfirmCallApprove = document.getElementById('btn-confirm-call-approve');

  function openConfirmCallModal(target) {
    pendingCallTarget = target;
    let name = 'Contato';
    if (target === 'caregiver' || target === 'marcos') {
      name = 'Marcos (Cuidador)';
    } else {
      const patient = patientsProfileData[target];
      if (patient) name = patient.name;
    }
    if (confirmCallModal) {
      confirmCallModal.classList.add('active');
      if (btnConfirmCallCancel) btnConfirmCallCancel.focus();
    }
    announceToScreenReader(`Confirmação de chamada. Deseja realizar uma ligação para ${name}? Pressione Ligar para confirmar ou Voltar.`);
  }

  function closeConfirmCallModal() {
    pendingCallTarget = null;
    if (confirmCallModal) {
      confirmCallModal.classList.remove('active');
    }
    announceToScreenReader("Confirmação cancelada.");
  }

  if (btnConfirmCallCancel) {
    btnConfirmCallCancel.addEventListener('click', () => {
      closeConfirmCallModal();
    });
  }

  if (btnConfirmCallApprove) {
    btnConfirmCallApprove.addEventListener('click', () => {
      if (pendingCallTarget) {
        startSimulatedCall(pendingCallTarget);
      }
      closeConfirmCallModal();
    });
  }

  const callContactProfile = document.getElementById('btn-profile-call-contact');
  if (callContactProfile) {
    callContactProfile.addEventListener('click', () => {
      openConfirmCallModal(activePatientId);
    });
  }

  const hangupCallBtn = document.getElementById('btn-hangup-call');
  if (hangupCallBtn) {
    hangupCallBtn.addEventListener('click', () => {
      hangupCall();
    });
  }

  const btnPatientEmergencyCall = document.getElementById('btn-patient-emergency-call');
  if (btnPatientEmergencyCall) {
    btnPatientEmergencyCall.addEventListener('click', () => {
      openConfirmCallModal('caregiver');
    });
  }
  
  const btnPatientSettingsCall = document.getElementById('btn-patient-settings-call');
  if (btnPatientSettingsCall) {
    btnPatientSettingsCall.addEventListener('click', () => {
      openConfirmCallModal('caregiver');
    });
  }

  // Patient Medications Add Routing
  const btnPatientAddMed = document.getElementById('btn-patient-add-med');
  if (btnPatientAddMed) {
    btnPatientAddMed.addEventListener('click', () => {
      showScreen('screen-4');
    });
  }

  // WAI-ARIA Live Announcer Helper Function
  function announceToScreenReader(message) {
    const announcer = document.getElementById('app-live-announcer');
    if (!announcer) return;
    announcer.textContent = ''; // Reset
    setTimeout(() => {
      announcer.textContent = message;
    }, 50);
  }

  // High Contrast Accessibility Mode Switcher (Screen 15 Settings)
  const contrastToggle = document.getElementById('setting-high-contrast');
  if (contrastToggle) {
    const toggleHighContrast = () => {
      const pill = contrastToggle.querySelector('div[style*="position: relative"]');
      const thumb = pill.querySelector('div');
      const phoneContainer = document.getElementById('phone-container');
      const isHighContrast = phoneContainer ? phoneContainer.classList.toggle('high-contrast') : false;
      if (isHighContrast) {
        pill.style.backgroundColor = 'var(--color-primary)';
        thumb.style.left = '22px';
        announceToScreenReader("Contraste alto ativado");
      } else {
        pill.style.backgroundColor = 'var(--color-border)';
        thumb.style.left = '2px';
        announceToScreenReader("Contraste alto desativado");
      }
    };

    contrastToggle.addEventListener('click', toggleHighContrast);
    contrastToggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleHighContrast();
      }
    });
  }

  // Font Size Accessibility Selector (Screen 15 Settings)
  const fontSizeToggle = document.getElementById('setting-font-size');
  const fontSizeStatusText = document.getElementById('font-size-status');
  if (fontSizeToggle && fontSizeStatusText) {
    const fontSizeClasses = ['font-small', 'font-medium', 'font-large', 'font-xlarge'];
    const fontSizeLabels = ['Pequeno', 'Médio', 'Grande', 'Muito Grande'];
    
    // Default size is 'Médio' (index 1)
    let activeSizeIndex = 1;
    
    const cycleFontSize = () => {
      activeSizeIndex = (activeSizeIndex + 1) % fontSizeClasses.length;
      
      // Reset classes
      fontSizeClasses.forEach(cls => document.body.classList.remove(cls));
      
      // Set new class
      const newClass = fontSizeClasses[activeSizeIndex];
      const newLabel = fontSizeLabels[activeSizeIndex];
      
      if (newClass !== 'font-medium') {
        document.body.classList.add(newClass);
      }
      
      fontSizeStatusText.textContent = newLabel;
      announceToScreenReader(`Tamanho de letra ajustado para ${newLabel}`);
    };

    fontSizeToggle.addEventListener('click', cycleFontSize);
    fontSizeToggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        cycleFontSize();
      }
    });
  }

  const noteInput = document.getElementById('profile-note-input');
  const btnSubmitNote = document.getElementById('btn-submit-note');

  function submitNewCaregiverNote() {
    if (!noteInput) return;
    const text = noteInput.value.trim();
    if (!text) return;

    const patient = patientsProfileData[activePatientId];
    if (patient) {
      patient.notes.push({
        author: 'Você (Cuidador)',
        time: 'Hoje',
        text: text
      });
      noteInput.value = '';
      renderNotesFeed();
    }
  }

  if (btnSubmitNote) {
    btnSubmitNote.addEventListener('click', submitNewCaregiverNote);
  }
  if (noteInput) {
    noteInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        submitNewCaregiverNote();
      }
    });
  }

  // 6. Screen 8: Patient Daily Medication Checklist Toggle Interaction
  const medRows = document.querySelectorAll('.med-row');
  medRows.forEach(row => {
    row.addEventListener('click', () => {
      const isTaken = row.classList.contains('taken');
      const statusText = row.querySelector('.med-status-indicator');
      
      if (isTaken) {
        row.classList.remove('taken');
        if (statusText) {
          statusText.textContent = 'Pendente';
          statusText.className = 'med-status-indicator pending';
        }
      } else {
        row.classList.add('taken');
        if (statusText) {
          statusText.textContent = 'Tomado';
          statusText.className = 'med-status-indicator taken';
        }
      }
    });
  });

  // ==========================================================================
  // BOTTOM NAVIGATION ROUTING (CAREGIVER VS PATIENT INDEPENDENT NAVS)
  // ==========================================================================

  // Bottom Navigation Tab Routing (Screens 7, 8, 9, 10, 11) - CAREGIVER
  const caregiverNavTabs = document.querySelectorAll('.bottom-nav:not(.patient-nav) .nav-tab');
  caregiverNavTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetNav = tab.getAttribute('data-nav');
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
    });
  });
  
  // Bottom Navigation Tab Routing (Screens 6, 12, 13, 14, 15) - PATIENT
  const patientNavTabs = document.querySelectorAll('.bottom-nav.patient-nav .nav-tab');
  patientNavTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetNav = tab.getAttribute('data-nav');
      if (targetNav === 'patient-home') {
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
    });
  });

  function updateActiveTabsForScreen(screenId) {
    // 1. Update caregiver bottom navs
    const cgTabs = document.querySelectorAll('.bottom-nav:not(.patient-nav) .nav-tab');
    cgTabs.forEach(t => t.classList.remove('active'));
    
    let activeCgNav = '';
    if (screenId === 'screen-7' || screenId === 'screen-11') {
      activeCgNav = 'pacientes';
    } else if (screenId === 'screen-8') {
      activeCgNav = 'agenda';
    } else if (screenId === 'screen-9') {
      activeCgNav = 'alertas';
    } else if (screenId === 'screen-10') {
      activeCgNav = 'config';
    }
    
    cgTabs.forEach(t => {
      if (t.getAttribute('data-nav') === activeCgNav) {
        t.classList.add('active');
      }
    });

    // 2. Update patient bottom navs
    const patTabs = document.querySelectorAll('.bottom-nav.patient-nav .nav-tab');
    patTabs.forEach(t => t.classList.remove('active'));
    
    let activePatNav = '';
    if (screenId === 'screen-patient-home') {
      activePatNav = 'patient-home';
    } else if (screenId === 'screen-6') {
      activePatNav = 'patient-agenda';
    } else if (screenId === 'screen-patient-meds') {
      activePatNav = 'patient-meds';
    } else if (screenId === 'screen-patient-alerts') {
      activePatNav = 'patient-alerts';
    } else if (screenId === 'screen-patient-settings') {
      activePatNav = 'patient-settings';
    }
    
    patTabs.forEach(t => {
      if (t.getAttribute('data-nav') === activePatNav) {
        t.classList.add('active');
      }
    });
  }

  // 8. Reset Simulator Function
  const btnResetSimulator = document.getElementById('btn-reset-simulator');
  if (btnResetSimulator) {
    btnResetSimulator.addEventListener('click', () => {
    // Reset forms
    document.getElementById('reg-name').value = '';
    document.getElementById('reg-gender').value = '';
    document.getElementById('reg-phone').value = '';
    
    const searchInputReset = document.getElementById('search-med-input');
    if (searchInputReset) searchInputReset.value = '';
    const dropdownResultsReset = document.querySelector('.dropdown-results');
    if (dropdownResultsReset) dropdownResultsReset.style.display = 'none';
    
    // Reset search and times states
    addedTimes = [];
    const searchPhase = document.getElementById('med-search-phase');
    const timesPhase = document.getElementById('med-times-phase');
    if (searchPhase && timesPhase) {
      timesPhase.style.display = 'none';
      searchPhase.style.display = 'flex';
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

    // Reset Upgraded Screen 6 state & patient checklist safely
    if (patientsProfileData['cleusa'] && patientsProfileData['cleusa'].meds) {
      patientsProfileData['cleusa'].meds.forEach(med => {
        med.status = med.name.toLowerCase().includes('losartana') ? 'tomado' : 'pendente';
      });
    }
    if (patientsProfileData['pedro'] && patientsProfileData['pedro'].meds) {
      patientsProfileData['pedro'].meds.forEach(med => {
        med.status = med.name.toLowerCase().includes('metformina') ? 'tomado' : 'atrasado';
      });
    }

    initAgendaData();
    selectedDate = '2026-05-21';
    renderAgenda();
    renderPatientHomeChecklist();
    renderPatientMedsList();
    
    // Disable high contrast on phone container
    const phoneContainer = document.getElementById('phone-container');
    if (phoneContainer) phoneContainer.classList.remove('high-contrast');
    const pill = contrastToggle.querySelector('div[style*="position: relative"]');
    const thumb = pill.querySelector('div');
    if (pill && thumb) {
      pill.style.backgroundColor = 'var(--color-border)';
      thumb.style.left = '2px';
    }

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
  }
  
  updatePhoneClock();
  setInterval(updatePhoneClock, 60000); // Update every minute

  // Initialize Upgraded Screen 6 Agenda logic
  initAgendaData();
  setupCalendarClickListeners();
  renderAgenda();

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
  function renderPatientAlerts() {
    const feed = document.getElementById('patient-alerts-feed');
    if (!feed) return;
    
    const patient = appState.patients['cleusa'] || patientsProfileData['cleusa'];
    feed.innerHTML = '';
    
    if (!patient || !patient.meds || patient.meds.length === 0) {
      feed.innerHTML = `
        <div class="empty-state" style="text-align: center; padding: 32px 16px; color: var(--color-text-light);">
          <p>Você não tem alertas pendentes.</p>
        </div>
      `;
      return;
    }

    let hasAlerts = false;
    
    // Check for un-taken meds
    const pendingMeds = patient.meds.filter(m => m.status === 'pendente' || m.status === 'atrasado');
    if (pendingMeds.length > 0) {
      hasAlerts = true;
      feed.innerHTML += `
        <div class="alert-item danger" style="cursor: default; transform: none; box-shadow: none;">
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
        </div>
      `;
    }

    // Static success note
    hasAlerts = true;
    feed.innerHTML += `
      <div class="alert-item success" style="cursor: default; transform: none; box-shadow: none;">
        <div class="alert-item-content">
          <svg class="alert-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          <div class="alert-item-text">
            <strong>Tudo certo:</strong> Seu perfil foi configurado corretamente.
          </div>
        </div>
      </div>
    `;
    
    if (!hasAlerts) {
      feed.innerHTML = `<div class="empty-state" style="text-align: center; padding: 32px 16px; color: var(--color-text-light);"><p>Você não tem alertas.</p></div>`;
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
  let reminderShown = false;
  function triggerSimulatedMedReminder() {
    if (reminderShown) return;
    const toast = document.getElementById('med-reminder-toast');
    if (!toast) return;
    
    // Only show if there is a pending med
    const patient = appState.patients['cleusa'];
    if (!patient || !patient.meds) return;
    
    const firstPending = patient.meds.find(m => m.status !== 'tomado');
    if (firstPending) {
      document.getElementById('med-reminder-body').textContent = `${firstPending.name} — ${firstPending.dose}`;
      
      setTimeout(() => {
        toast.classList.add('active');
        if (typeof announceToScreenReader === 'function') {
            announceToScreenReader("Aviso: Hora do medicamento " + firstPending.name);
        }
      }, 2000);
      
      reminderShown = true;
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
          const patient = patientsProfileData['cleusa'];
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
        const patient = patientsProfileData['cleusa'];
        patient.meds.splice(selectedMedForEdit.index, 1);
        
        if (appState.patients['cleusa'] && appState.patients['cleusa'].meds) {
          appState.patients['cleusa'].meds.splice(selectedMedForEdit.index, 1);
        }
        
        const todayDate = selectedDate || '2026-05-21';
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

  // Initialização padrão no Modo Pitch (Moved here to avoid Temporal Dead Zone errors)
  clearPitchData();
  
});
