document.addEventListener('DOMContentLoaded', () => {
  
  // Navigation elements
  const sidebarButtons = document.querySelectorAll('.screen-btn');
  const appScreens = document.querySelectorAll('.app-screen');
  
  // ==========================================================================
  // PATIENT PROFILE DATA & ROUTING STATE (SCREEN 11)
  // ==========================================================================
  const patientsProfileData = {
    'cleusa': {
      avatar: 'MC',
      name: 'Maria Cleusa',
      age: '78 anos • Histórico estável',
      status: 'Em Dia',
      statusClass: 'taken',
      adherence: 94,
      meds: [
        { name: 'Losartana Potássica', dose: '50mg • 1 comprimido', time: '08:00', status: 'tomado' },
        { name: 'Dipirona Sódica', dose: '500mg • 1 comprimido', time: '12:00', status: 'pendente' },
        { name: 'Insulina NPH', dose: '10 UI • Injeção subcutânea', time: '18:00', status: 'pendente' },
        { name: 'Metformina 850mg', dose: '1 comprimido', time: '22:00', status: 'pendente' }
      ],
      alerts: [
        { type: 'warning', text: 'Não confirmou o uso do Losartana das 08:00.' },
        { type: 'success', text: 'Consulta com cardiologista agendada com sucesso para 25/05.' }
      ],
      notes: [
        { author: 'Você (Cuidador)', time: 'Ontem', text: 'Dona Maria apresentou excelente disposição. Alimentou-se muito bem.' },
        { author: 'Você (Cuidador)', time: '2 dias atrás', text: 'Todos os medicamentos administrados perfeitamente nos horários corretos.' }
      ]
    },
    'pedro': {
      avatar: 'PF',
      name: 'Pedro Francisco',
      age: '82 anos • Histórico instável',
      status: 'Atrasado',
      statusClass: 'atrasado',
      adherence: 72,
      meds: [
        { name: 'Metformina 850mg', dose: '1 comprimido', time: '20:00', status: 'tomado' },
        { name: 'Anlodipino 5mg', dose: '1 comprimido', time: '08:00', status: 'atrasado' },
        { name: 'Atenolol 25mg', dose: '1 comprimido', time: '08:00', status: 'atrasado' }
      ],
      alerts: [
        { type: 'danger', text: 'Está com 2 medicamentos atrasados.' },
        { type: 'info', text: 'Próxima receita médica vence em 02 dias.' }
      ],
      notes: [
        { author: 'Você (Cuidador)', time: 'Ontem', text: 'Pedro queixou-se de leve dor de cabeça à tarde. Administrado Dipirona conforme SOS.' }
      ]
    }
  };

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
    if (age) age.textContent = patient.age;

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
    if (s8AgeMeta) s8AgeMeta.textContent = patient.age;

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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <rect x="3" y="11" width="10" height="10" rx="5" transform="rotate(-45 3 11)"/>
                <line x1="8" y1="16" x2="16" y2="8" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
          `;
        } else {
          iconHtml = `
            <div class="med-icon orange">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <rect x="3" y="11" width="10" height="10" rx="5" transform="rotate(-45 3 11)"/>
                <line x1="8" y1="16" x2="16" y2="8" stroke="currentColor" stroke-width="2"/>
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
          } else {
            row.classList.remove('taken');
            med.status = 'pendente';
            row.querySelector('.med-status-indicator').textContent = 'Pendente';
            row.querySelector('.med-status-indicator').className = 'med-status-indicator pending';
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
    agendaData = JSON.parse(JSON.stringify(BASELINE_AGENDA_DATA));
  }

  function renderAgenda() {
    const data = agendaData[selectedDate];
    if (!data) return;

    // 1. Update Selected Day label
    const selectedDayLabel = document.getElementById('agenda-selected-day-label');
    if (selectedDayLabel) {
      selectedDayLabel.textContent = data.dateLabel;
    }

    // 2. Count meds status
    const totalMeds = data.meds.length;
    const takenMeds = data.meds.filter(m => m.status === 'tomado').length;
    const selectedDayStatus = document.getElementById('agenda-selected-day-status');
    if (selectedDayStatus) {
      selectedDayStatus.textContent = `${takenMeds} de ${totalMeds} tomados`;
    }

    // 3. Render medication list
    const medListContainer = document.getElementById('agenda-med-list');
    if (medListContainer) {
      medListContainer.innerHTML = '';
      
      data.meds.forEach((med, index) => {
        const card = document.createElement('div');
        card.className = `agenda-med-card status-${med.status}`;
        card.setAttribute('data-med-index', index);
        card.setAttribute('tabindex', '0'); // Accessibility
        
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

    // 4. Update the calendar strip UI
    updateCalendarStrip();

    // 5. Update Weekly Adherence card
    updateWeeklyAdherence();
  }

  function toggleMedStatus(date, index) {
    const med = agendaData[date].meds[index];
    if (med.status === 'tomado') {
      med.status = 'pendente';
    } else {
      med.status = 'tomado';
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
      } else {
        dayElement.classList.remove('selected');
      }
      
      const dayData = agendaData[dateStr];
      if (dayData) {
        const iconWrapper = dayElement.querySelector('.day-status-icon');
        if (iconWrapper) {
          const total = dayData.meds.length;
          const taken = dayData.meds.filter(m => m.status === 'tomado').length;
          const delayed = dayData.meds.filter(m => m.status === 'atrasado').length;
          
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
        }
      }
    });
  }

  function updateWeeklyAdherence() {
    const dates = Object.keys(agendaData);
    let completedDaysCount = 0;
    let totalMedsAllDays = 0;
    let takenMedsAllDays = 0;
    
    dates.forEach(d => {
      const dayMeds = agendaData[d].meds;
      const total = dayMeds.length;
      const taken = dayMeds.filter(m => m.status === 'tomado').length;
      
      totalMedsAllDays += total;
      takenMedsAllDays += taken;
      
      if (taken === total) {
        completedDaysCount++;
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
      
      const selectHandler = () => {
        const dateStr = dayElement.getAttribute('data-date');
        selectedDate = dateStr;
        renderAgenda();
      };
      
      dayElement.addEventListener('click', selectHandler);
      dayElement.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectHandler();
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
  // DYNAMIC PATIENT RENDERING LOGIC (SCREENS 12 & 13)
  // ==========================================================================
  function renderPatientHomeChecklist() {
    const patient = patientsProfileData['cleusa']; // Maria Cleusa is our patient
    if (!patient) return;
    
    const checklistContainer = document.getElementById('patient-home-checklist');
    if (!checklistContainer) return;
    
    checklistContainer.innerHTML = '';
    
    const total = patient.meds.length;
    const taken = patient.meds.filter(m => m.status === 'tomado').length;
    
    const countText = document.getElementById('patient-home-summary-count');
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
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <rect x="3" y="11" width="10" height="10" rx="5" transform="rotate(-45 3 11)"/>
              <line x1="8" y1="16" x2="16" y2="8" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
        `;
      } else {
        iconHtml = `
          <div class="med-icon orange">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <rect x="3" y="11" width="10" height="10" rx="5" transform="rotate(-45 3 11)"/>
              <line x1="8" y1="16" x2="16" y2="8" stroke="currentColor" stroke-width="2"/>
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
      card.style.border = '1px solid var(--color-border)';
      card.style.borderRadius = 'var(--radius-md)';
      card.style.padding = '14px 16px';
      card.style.backgroundColor = 'var(--color-white)';
      card.style.display = 'flex';
      card.style.justifyContent = 'space-between';
      card.style.alignItems = 'center';
      card.style.marginBottom = '12px';
      
      card.innerHTML = `
        <div style="text-align: left; display: flex; align-items: center; gap: 12px;">
          <div class="med-icon" style="background-color: var(--color-bg-secondary); color: var(--color-primary); width: 36px; height: 36px; border-radius: var(--radius-pill); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <rect x="3" y="11" width="10" height="10" rx="5" transform="rotate(-45 3 11)"/>
              <line x1="8" y1="16" x2="16" y2="8" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <div>
            <h4 style="font-size: 14px; font-weight: 700; color: var(--color-text-dark);">${med.name}</h4>
            <p style="font-size: 11px; color: var(--color-text-muted); margin-top: 2px;">${med.dose} • Diário</p>
          </div>
        </div>
        <span style="font-size: 13px; font-weight: 700; color: var(--color-primary);">${med.time}</span>
      `;
      container.appendChild(card);
    });
  }

  // ==========================================================================
  // ONBOARDING FLOW ROUTING UPDATES
  // ==========================================================================
  
  // Phone field masking logic (Cadastro Inicial - Screen 1)
  const phoneInput = document.getElementById('reg-phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
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
    });
  }

  // Screen 1 -> Screen 2 (Cadastro -> Role Selection)
  document.getElementById('btn-flow-1').addEventListener('click', () => {
    const name = document.getElementById('reg-name').value.trim();
    if (!name) {
      document.getElementById('reg-name').value = 'Maria Cleusa'; // Seed with default patient if empty
    }
    showScreen('screen-2');
  });

  // Screen 2 -> Screen 3 (Role Selection -> Onboarding Intro)
  document.getElementById('btn-flow-2').addEventListener('click', () => {
    const selectedCard = document.querySelector('.role-card.selected');
    if (selectedCard) {
      const role = selectedCard.getAttribute('data-role') === 'cuidador' ? 'caregiver' : 'patient';
      setSidebarSwitcherRole(role, true); // Sync sidebar role selector, but prevent redirecting yet
    }
    showScreen('screen-3');
  });

  // Screen 3 -> Home View (Onboarding Intro -> Screen 12 Patient OR Screen 7 Caregiver)
  document.getElementById('btn-flow-3').addEventListener('click', () => {
    const selectedCard = document.querySelector('.role-card.selected');
    const isCaregiver = selectedCard && selectedCard.getAttribute('data-role') === 'cuidador';
    if (isCaregiver) {
      showScreen('screen-7');
    } else {
      showScreen('screen-patient-home');
    }
  });

  // Screen 4 click search-med card -> Screen 5 (Add Med -> Search Med)
  document.getElementById('btn-card-search-med').addEventListener('click', () => {
    showScreen('screen-5');
  });

  // Screen 5 -> Screen 6 (Search Med -> Compliance Agenda)
  document.getElementById('btn-flow-5').addEventListener('click', () => {
    showScreen('screen-6');
  });

  // 3. Screen 2: Role selection toggle
  const roleCards = document.querySelectorAll('.role-card');
  roleCards.forEach(card => {
    card.addEventListener('click', () => {
      roleCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      
      const selectedRole = card.getAttribute('data-role');
      if (selectedRole === 'cuidador') {
        document.getElementById('btn-flow-3').setAttribute('data-next-flow', 'caregiver');
      } else {
        document.getElementById('btn-flow-3').removeAttribute('data-next-flow');
      }
    });
  });

  // 4. Screen 5: Medicine search dropdown interactive selection
  const searchDropdownItems = document.querySelectorAll('.dropdown-item');
  const searchInput = document.getElementById('search-med-input');
  
  searchDropdownItems.forEach(item => {
    item.addEventListener('click', () => {
      searchDropdownItems.forEach(i => i.classList.remove('selected'));
      item.classList.add('selected');
      
      const medName = item.getAttribute('data-med');
      searchInput.value = medName;
    });
  });

  // 5. Screen 7: Caregiver Dashboard Patient Card interactions
  document.getElementById('btn-patient-cleusa').addEventListener('click', () => {
    previousScreen = 'screen-7';
    renderPatientProfile('cleusa');
    showScreen('screen-11');
  });
  
  document.getElementById('btn-patient-pedro').addEventListener('click', () => {
    previousScreen = 'screen-7';
    renderPatientProfile('pedro');
    showScreen('screen-11');
  });

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
    if (patientId === 'caregiver' || patientId === 'marcos') {
      if (toastAvatar) toastAvatar.textContent = 'MC';
      if (toastTitle) toastTitle.textContent = `Chamando Marcos (Cuidador)...`;
      if (toastSubtitle) toastSubtitle.textContent = `Ligando para contato de emergência`;
    } else {
      const patient = patientsProfileData[patientId];
      if (!patient) return;
      if (toastAvatar) toastAvatar.textContent = patient.avatar;
      if (toastTitle) toastTitle.textContent = `Chamando ${patient.name}...`;
      if (toastSubtitle) toastSubtitle.textContent = `Ligando para contato principal`;
    }
    
    if (toastCall) {
      toastCall.classList.add('active');
    }
  }

  function hangupCall() {
    if (toastCall) {
      toastCall.classList.remove('active');
    }
  }

  const callContactProfile = document.getElementById('btn-profile-call-contact');
  if (callContactProfile) {
    callContactProfile.addEventListener('click', () => {
      startSimulatedCall(activePatientId);
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
      startSimulatedCall('caregiver');
    });
  }
  
  const btnPatientSettingsCall = document.getElementById('btn-patient-settings-call');
  if (btnPatientSettingsCall) {
    btnPatientSettingsCall.addEventListener('click', () => {
      startSimulatedCall('caregiver');
    });
  }

  // Patient Medications Add Routing
  const btnPatientAddMed = document.getElementById('btn-patient-add-med');
  if (btnPatientAddMed) {
    btnPatientAddMed.addEventListener('click', () => {
      showScreen('screen-4');
    });
  }

  // High Contrast Accessibility Mode Switcher (Screen 15 Settings)
  const contrastToggle = document.querySelector('#screen-patient-settings .setting-item');
  if (contrastToggle) {
    contrastToggle.addEventListener('click', () => {
      const pill = contrastToggle.querySelector('div[style*="position: relative"]');
      const thumb = pill.querySelector('div');
      const isHighContrast = document.body.classList.toggle('high-contrast');
      if (isHighContrast) {
        pill.style.backgroundColor = 'var(--color-primary)';
        thumb.style.left = '22px';
      } else {
        pill.style.backgroundColor = 'var(--color-border)';
        thumb.style.left = '2px';
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
  document.getElementById('btn-reset-simulator').addEventListener('click', () => {
    // Reset forms
    document.getElementById('reg-name').value = '';
    document.getElementById('reg-gender').value = '';
    document.getElementById('reg-phone').value = '';
    document.getElementById('search-med-input').value = 'Dipirona';
    
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

    // Reset Upgraded Screen 6 state & patient checklist
    patientsProfileData['cleusa'].meds.forEach(med => {
      med.status = med.name.toLowerCase().includes('losartana') ? 'tomado' : 'pendente';
    });
    patientsProfileData['pedro'].meds.forEach(med => {
      med.status = med.name.toLowerCase().includes('metformina') ? 'tomado' : 'atrasado';
    });

    initAgendaData();
    selectedDate = '2026-05-21';
    renderAgenda();
    renderPatientHomeChecklist();
    renderPatientMedsList();
    
    // Disable high contrast on body
    document.body.classList.remove('high-contrast');
    const pill = contrastToggle.querySelector('div[style*="position: relative"]');
    const thumb = pill.querySelector('div');
    if (pill && thumb) {
      pill.style.backgroundColor = 'var(--color-border)';
      thumb.style.left = '2px';
    }

    // Route back to Screen 1
    showScreen('screen-1');
  });

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
  
});
