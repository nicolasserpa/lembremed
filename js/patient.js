// ==========================================================================
// SIMULATED EMERGENCY CALL CALLING SYSTEM (BIDIRECTIONAL)
// ==========================================================================
const toastCall = document.getElementById('phone-toast-call');
const toastAvatar = document.getElementById('toast-call-avatar');
const toastTitle = document.getElementById('toast-call-title');
const toastSubtitle = document.getElementById('toast-call-subtitle');

function startSimulatedCall(patientId) {
  let name = '';
  if (patientId === 'caregiver') {
    name = 'Contato de Emergência';
    if (toastAvatar) {
      toastAvatar.textContent = '📞';
      toastAvatar.style.fontSize = '18px';
    }
    if (toastTitle) toastTitle.textContent = `Chamando Contato de Emergência…`;
    if (toastSubtitle) toastSubtitle.textContent = `Ligando para contato de emergência`;
  } else {
    const patient = patientsProfileData[patientId];
    if (!patient) return;
    name = patient.name;
    if (toastAvatar) {
      toastAvatar.textContent = patient.avatar;
      toastAvatar.style.fontSize = ''; // Reset standard size
    }
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
  if (target === 'caregiver') {
    name = 'Contato de Emergência';
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

// ==========================================================================
// ACCESSIBILITY SETTINGS — INDEPENDENT PATIENT & CAREGIVER
// ==========================================================================

// Shared helper: creates an independent contrast toggle for a given element ID + localStorage key
function createContrastToggle(toggleId, storageKey, pillId, thumbId) {
  const toggle = document.getElementById(toggleId);
  if (!toggle) return;
  const pill = pillId ? document.getElementById(pillId) : toggle.querySelector('.toggle-pill');
  const thumb = thumbId ? document.getElementById(thumbId) : (pill ? pill.querySelector('.toggle-thumb') : null);
  if (!pill || !thumb) return;

  // Restore from localStorage
  const stored = localStorage.getItem(storageKey) === 'true';
  const phoneContainer = document.getElementById('phone-container');
  if (stored) {
    if (phoneContainer) phoneContainer.classList.add('high-contrast');
    pill.style.backgroundColor = 'var(--color-primary)';
    thumb.style.left = '22px';
  }

  const toggleFn = () => {
    const isHighContrast = phoneContainer ? phoneContainer.classList.toggle('high-contrast') : false;
    localStorage.setItem(storageKey, isHighContrast);
    if (isHighContrast) {
      pill.style.backgroundColor = 'var(--color-primary)';
      thumb.style.left = '22px';
      announceToScreenReader('Contraste alto ativado');
    } else {
      pill.style.backgroundColor = 'var(--color-border)';
      thumb.style.left = '2px';
      announceToScreenReader('Contraste alto desativado');
    }
  };
  toggle.addEventListener('click', toggleFn);
  toggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleFn(); }
  });
  return () => {
    // Reset function for logout
    if (phoneContainer) phoneContainer.classList.remove('high-contrast');
    pill.style.backgroundColor = 'var(--color-border)';
    thumb.style.left = '2px';
  };
}

function createFontSizeToggle(toggleId, statusId, storageKey) {
  const toggle = document.getElementById(toggleId);
  const statusText = document.getElementById(statusId);
  if (!toggle || !statusText) return;
  const fontSizeClasses = ['font-small', 'font-medium', 'font-large', 'font-xlarge'];
  const fontSizeLabels = ['Pequeno', 'Médio', 'Grande', 'Muito Grande'];

  // Restore from localStorage
  let activeSizeIndex = parseInt(localStorage.getItem(storageKey) || '1', 10);
  fontSizeClasses.forEach(cls => document.body.classList.remove(cls));
  if (fontSizeClasses[activeSizeIndex] !== 'font-medium') {
    document.body.classList.add(fontSizeClasses[activeSizeIndex]);
  }
  statusText.textContent = fontSizeLabels[activeSizeIndex];

  const cycleFn = () => {
    activeSizeIndex = (activeSizeIndex + 1) % fontSizeClasses.length;
    fontSizeClasses.forEach(cls => document.body.classList.remove(cls));
    const newClass = fontSizeClasses[activeSizeIndex];
    const newLabel = fontSizeLabels[activeSizeIndex];
    if (newClass !== 'font-medium') document.body.classList.add(newClass);
    statusText.textContent = newLabel;
    localStorage.setItem(storageKey, activeSizeIndex);
    announceToScreenReader(`Tamanho de letra ajustado para ${newLabel}`);
  };
  toggle.addEventListener('click', cycleFn);
  toggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); cycleFn(); }
  });
}

// Patient accessibility toggles (Screen 15) — key: patient_*
const patResetContrast = createContrastToggle('setting-high-contrast', 'lembremed_patient_contrast', null, null);
createFontSizeToggle('setting-font-size', 'font-size-status', 'lembremed_patient_fontsize');

// Caregiver accessibility toggles (Screen 10) — key: caregiver_*
createContrastToggle('setting-cg-high-contrast', 'lembremed_caregiver_contrast', 'cg-contrast-toggle-pill', 'cg-contrast-toggle-thumb');
createFontSizeToggle('setting-cg-font-size', 'cg-font-size-status', 'lembremed_caregiver_fontsize');

// Keep reference to the old contrastToggle pill/thumb for the reset button (fallback)
const contrastToggle = document.getElementById('setting-high-contrast');

const noteInput = document.getElementById('profile-note-input');
const btnSubmitNote = document.getElementById('btn-submit-note');

function submitNewCaregiverNote() {
  if (!noteInput) return;
  const text = noteInput.value.trim();
  if (!text) return;

  const patient = patientsProfileData[activePatientId];
  if (patient) {
    const newNote = {
      id: 'note_' + Date.now(),
      title: 'Nota de Acompanhamento',
      date: 'Hoje, ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      content: text,
      author: 'Você (Cuidador)'
    };
    patient.notes.push(newNote);
    noteInput.value = '';
    renderNotesFeed();
    announceToScreenReader("Anotação salva com sucesso.");
  }
}

function deleteNote(noteId) {
  const patient = patientsProfileData[activePatientId];
  if (patient && patient.notes) {
    const initialLength = patient.notes.length;
    patient.notes = patient.notes.filter(n => n.id !== noteId);
    if (patient.notes.length < initialLength) {
      renderNotesFeed();
      announceToScreenReader("Anotação excluída.");
    }
  }
}

// Event delegation for note deletion
const notesFeedContainer = document.getElementById('profile-notes-feed');
if (notesFeedContainer) {
  notesFeedContainer.addEventListener('click', (e) => {
    const deleteBtn = e.target.closest('.btn-delete-note');
    if (deleteBtn) {
      const noteId = deleteBtn.getAttribute('data-id');
      deleteNote(noteId);
    }
  });
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
  // Set accessibility attributes on page load
  row.setAttribute('tabindex', '0');
  row.setAttribute('role', 'checkbox');
  row.setAttribute('aria-checked', row.classList.contains('taken') ? 'true' : 'false');

  const toggleRow = () => {
    const isTaken = row.classList.contains('taken');
    const statusText = row.querySelector('.med-status-indicator');

    if (isTaken) {
      row.classList.remove('taken');
      row.setAttribute('aria-checked', 'false');
      if (statusText) {
        statusText.textContent = 'Pendente';
        statusText.className = 'med-status-indicator pending';
      }
    } else {
      row.classList.add('taken');
      row.setAttribute('aria-checked', 'true');
      if (statusText) {
        statusText.textContent = 'Tomado';
        statusText.className = 'med-status-indicator taken';
      }
    }
  };

  row.addEventListener('click', toggleRow);
  row.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleRow();
    }
  });
});
