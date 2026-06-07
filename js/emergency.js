// ==========================================================================
// TASK 4: REAL-TIME CROSS-TAB SYNC VIA LOCALSTORAGE
// ==========================================================================

const SYNC_KEY = 'lembremed_sync_patients';

// Publish current patient data to localStorage so other tabs can read it
function publishPatientSyncData() {
  const patientKey = activePatientId || Object.keys(appState.patients).find(k => k !== '__sync');
  if (!patientKey || !appState.patients[patientKey]) return;
  const patient = appState.patients[patientKey];
  if (!patient.lmCode) return;

  let syncData = {};
  try {
    syncData = JSON.parse(localStorage.getItem(SYNC_KEY) || '{}');
  } catch (e) {
    console.warn('Recovered from malformed sync data in localStorage');
  }
  syncData[patient.lmCode] = {
    lmCode: patient.lmCode,
    name: patient.name,
    avatar: patient.avatar,
    age: patient.age,
    meds: patient.meds,
    alerts: patient.alerts,
    notes: patient.notes,
    adherence: patient.adherence,
    status: patient.status,
    statusClass: patient.statusClass,
    updatedAt: Date.now()
  };
  localStorage.setItem(SYNC_KEY, JSON.stringify(syncData));
}

// [AVISO DE ALTERAÇÃO - SINCRONIZAÇÃO E MÁSCARAS DE VÍNCULO]
// - Previous state: The 'storage' event on patient side only showed the empty emergency card, and the code input used a simple regex requiring manual dash typing.
// - What changed: Now the caregiver saves their name in localStorage and the patient reads this name in real time, updating the card and adding a warm link notification to the alerts feed.
// - What was added: A smart typing mask on the code input, formatting entries like '4526' or 'lm4526' automatically to 'LM-4526'.
window.addEventListener('storage', (e) => {
  if (e.key === SYNC_KEY && e.newValue && appState.user.role === 'caregiver') {
    const syncData = JSON.parse(e.newValue || '{}');
    let updated = false;

    Object.entries(syncData).forEach(([lmCode, patientData]) => {
      const matchKey = Object.keys(appState.patients).find(k => appState.patients[k].lmCode === lmCode);
      if (!matchKey) return;

      appState.patients[matchKey] = { ...appState.patients[matchKey], ...patientData };
      patientsProfileData[matchKey] = appState.patients[matchKey];
      updated = true;
    });

    if (updated) {
      renderCaregiverDashboard();
      const screen11 = document.getElementById('screen-11');
      if (screen11 && screen11.classList.contains('active') && activePatientId) {
        renderPatientProfile(activePatientId);
      }
    }
  }

  if (appState.user.role === 'patient') {
    const patientKey = Object.keys(appState.patients).find(k => k !== '__sync');
    if (patientKey) {
      const patientLmCode = appState.patients[patientKey].lmCode;
      if (patientLmCode && e.key === 'lembremed_linked_' + patientLmCode) {
        const caregiverContactCard = document.getElementById('caregiver-contact-card');
        if (caregiverContactCard) {
          caregiverContactCard.style.display = 'block';
        }

        const cgName = e.newValue || 'Contato de Emergência';
        const cgNameEl = document.getElementById('caregiver-contact-name');
        if (cgNameEl) {
          cgNameEl.textContent = cgName;
        }

        appState.patients[patientKey].caregiverName = cgName;

        // Add real-time link notification in the feed
        if (!appState.patients[patientKey].alerts) {
          appState.patients[patientKey].alerts = [];
        }

        const alertExists = appState.patients[patientKey].alerts.some(a => a.type === 'caregiver_linked');
        if (!alertExists) {
          appState.patients[patientKey].alerts.push({
            id: 'cg_link_' + Date.now(),
            type: 'caregiver_linked',
            title: 'Novo Cuidador Vinculado',
            text: `O cuidador <strong>${cgName}</strong> vinculou você ao perfil dele. Agora vocês compartilham o histórico em tempo real para um cuidado mais seguro!`,
            time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            isoTimestamp: new Date().toISOString(),
            class: 'success'
          });

          const activeScreen = document.querySelector('.app-screen.active');
          if (activeScreen && activeScreen.id === 'screen-patient-alerts') {
            renderPatientAlerts();
          }
        }
      }
    }
  }
});

// Link patient by LM code (Caregiver side)
const btnLinkByCode = document.getElementById('btn-link-patient-by-code');
const linkCodeInput = document.getElementById('link-patient-code');
const linkErrorEl = document.getElementById('link-patient-error');
const linkSuccessEl = document.getElementById('link-patient-success');

if (btnLinkByCode && linkCodeInput) {
  // Smart Mask for code input (format LM-XXXX)
  linkCodeInput.addEventListener('input', () => {
    let val = linkCodeInput.value.toUpperCase();
    let digits = val.replace(/[^A-Z0-9]/g, '');
    if (digits.startsWith('LM')) {
      digits = digits.substring(2);
    }
    digits = digits.replace(/[^0-9]/g, '').substring(0, 4);

    if (digits.length > 0) {
      linkCodeInput.value = 'LM-' + digits;
    } else {
      linkCodeInput.value = '';
    }
  });

  btnLinkByCode.addEventListener('click', () => {
    const code = linkCodeInput.value.trim().toUpperCase();
    if (linkErrorEl) linkErrorEl.style.display = 'none';
    if (linkSuccessEl) linkSuccessEl.style.display = 'none';

    if (!code.match(/^LM-\d{4}$/)) {
      if (linkErrorEl) {
        linkErrorEl.textContent = 'Formato inválido. Use: LM-1234';
        linkErrorEl.style.display = 'block';
      }
      return;
    }

    let syncData = {};
    try {
      syncData = JSON.parse(localStorage.getItem(SYNC_KEY) || '{}');
    } catch (e) {
      console.warn('Recovered from malformed sync data in localStorage');
    }
    const patientData = syncData[code];

    if (!patientData) {
      if (linkErrorEl) {
        linkErrorEl.textContent = 'Código não encontrado. O paciente precisa estar conectado no outro dispositivo/aba.';
        linkErrorEl.style.display = 'block';
      }
      return;
    }

    const alreadyLinked = Object.values(appState.patients).some(p => p.lmCode === code);
    if (alreadyLinked) {
      if (linkSuccessEl) {
        linkSuccessEl.textContent = `${patientData.name} já está vinculado!`;
        linkSuccessEl.style.display = 'block';
      }
      return;
    }

    const newKey = 'linked_' + code.replace('LM-', '');
    appState.patients[newKey] = {
      ...patientData,
      lmCode: code
    };
    patientsProfileData = appState.patients;

    // Notifica o paciente salvando o nome real do cuidador no localStorage em vez de apenas um timestamp
    localStorage.setItem('lembremed_linked_' + code, appState.user.name || 'Cuidador');

    if (linkCodeInput) linkCodeInput.value = '';
    if (linkSuccessEl) {
      linkSuccessEl.textContent = `✓ ${patientData.name} vinculado com sucesso em tempo real!`;
      linkSuccessEl.style.display = 'block';
    }

    renderCaregiverDashboard();

    // Navigate to caregiver dashboard after a short delay
    setTimeout(() => showScreen('screen-7'), 1500);
  });
}

// Expose publishPatientSyncData globally for use in other handlers
window.publishPatientSyncData = publishPatientSyncData;

// Default initialization in Pitch Mode (Moved here to avoid Temporal Dead Zone errors)
clearPitchData();

// ==========================================================================