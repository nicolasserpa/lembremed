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

// Screen 1 -> Screen 2 (Registration -> Role Selection)
// [CHANGE NOTICE - UX & ACCURATE REGISTRATION]
// - Previous state: Validation only for 'reg-name' field and unnecessary phone number cleanup/masking 'reg-phone'.
// - What changed: Removed 'reg-phone' field from the form and validation logic.
// - What was added: Mandatory validation for patient age ('reg-age') to record the actual age and eliminate the missing age state.
const btnFlow1 = document.getElementById('btn-flow-1');
if (btnFlow1) {
  btnFlow1.addEventListener('click', () => {
    const nameInput = document.getElementById('reg-name');
    const ageInput = document.getElementById('reg-age');
    const nameValue = nameInput.value.trim();
    const ageValue = ageInput ? ageInput.value.trim() : '';
    const errorMsg = document.getElementById('name-error-msg');
    const ageErrorMsg = document.getElementById('age-error-msg');

    let hasError = false;

    if (!nameValue) {
      nameInput.classList.add('error-state');
      nameInput.setAttribute('aria-invalid', 'true');
      if (errorMsg) errorMsg.classList.remove('d-none');
      hasError = true;
    } else {
      nameInput.classList.remove('error-state');
      nameInput.removeAttribute('aria-invalid');
      if (errorMsg) errorMsg.classList.add('d-none');
    }

    const parsedAge = parseInt(ageValue, 10);
    if (!ageValue || isNaN(parsedAge) || parsedAge < 0 || parsedAge > 120) {
      if (ageInput) {
        ageInput.classList.add('error-state');
        ageInput.setAttribute('aria-invalid', 'true');
      }
      if (ageErrorMsg) ageErrorMsg.classList.remove('d-none');
      hasError = true;
    } else {
      if (ageInput) {
        ageInput.classList.remove('error-state');
        ageInput.removeAttribute('aria-invalid');
      }
      if (ageErrorMsg) ageErrorMsg.classList.add('d-none');
    }

    if (hasError) {
      if (!nameValue) nameInput.focus();
      else if (ageInput) ageInput.focus();
      return;
    }

    // Save to user state
    appState.user.name = nameValue;
    appState.user.age = parsedAge;

    showScreen('screen-2');
  });
}

// Onboarding input field Enter key listeners to trigger continuation
const regInputs = ['reg-name', 'reg-age'];
regInputs.forEach(id => {
  const input = document.getElementById(id);
  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const btnFlow1 = document.getElementById('btn-flow-1');
        if (btnFlow1) {
          e.preventDefault();
          btnFlow1.click();
        }
      }
    });
  }
});

// Screen 2 -> Screen 3 (Role Selection -> Onboarding Intro)
const btnFlow2 = document.getElementById('btn-flow-2');
if (btnFlow2) {
  btnFlow2.addEventListener('click', () => {
    const selectedCard = document.querySelector('.role-card.selected');
    if (selectedCard) {
      const role = selectedCard.getAttribute('data-role') === 'cuidador' ? 'caregiver' : 'patient';

      // Save to state
      appState.user.role = role;

      // Initialize patient profile dynamically on login
      if (role === 'patient') {
        const userName = appState.user.name || 'Paciente';
        // Generate or retrieve a persistent unique LM code
        let lmCode = localStorage.getItem('lembremed_patient_code');
        if (!lmCode) {
          const digits = Math.floor(1000 + Math.random() * 9000);
          lmCode = `LM-${digits}`;
          localStorage.setItem('lembremed_patient_code', lmCode);
        }
        appState.user.lmCode = lmCode;

        const patientKey = 'patient_' + lmCode.replace('LM-', '');
        appState.patients[patientKey] = {
          avatar: userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'PA',
          name: userName,
          age: appState.user.age || 'Idade não informada',
          lmCode: lmCode,
          status: 'Em Dia',
          statusClass: 'taken',
          adherence: 100,
          meds: [],
          alerts: [],
          notes: []
        };
        activePatientId = patientKey;

        // If previously linked by the caregiver locally, restore name and add alert
        const linkedCg = localStorage.getItem('lembremed_linked_' + lmCode);
        if (linkedCg) {
          appState.patients[patientKey].caregiverName = linkedCg;

          const caregiverContactCard = document.getElementById('caregiver-contact-card');
          if (caregiverContactCard) {
            caregiverContactCard.style.display = 'block';
          }

          const cgNameEl = document.getElementById('caregiver-contact-name');
          if (cgNameEl) {
            cgNameEl.textContent = linkedCg;
          }

          appState.patients[patientKey].alerts.push({
            id: 'cg_link_' + Date.now(),
            type: 'caregiver_linked',
            title: 'Novo Cuidador Vinculado',
            text: `O cuidador <strong>${linkedCg}</strong> vinculou você ao perfil dele. Agora vocês compartilham o histórico em tempo real para um cuidado mais seguro!`,
            time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            class: 'success'
          });
        }

        // Show patient code card in settings
        const codeCard = document.getElementById('patient-sync-code-card');
        const codeDisplay = document.getElementById('patient-lm-code');
        if (codeCard && codeDisplay) {
          codeCard.style.display = 'block';
          codeDisplay.textContent = lmCode;
        }

        // Publish initial patient data for cross-tab sync
        publishPatientSyncData();
      } else {
        appState.patients = {};
        patientsProfileData = appState.patients;
        activePatientId = null;
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
    if (appState.user.role === 'caregiver') {
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
for (let i = 0; i < 60; i++) {
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

    // Duplicate 3 times for iOS infinite circular loop effect
    for (let set = 0; set < 3; set++) {
      pickerHours.forEach(h => {
        const item = document.createElement('div');
        const isActive = (set === 1 && h === '12');
        item.className = 'ios-picker-item' + (isActive ? ' active' : '');
        item.textContent = h;
        hoursColumn.appendChild(item);
      });
    }

    const bottomBuffer = document.createElement('div');
    bottomBuffer.style.height = '60px';
    hoursColumn.appendChild(bottomBuffer);

    // Inertial scroll and infinite loop
    setupIosPickerColumn(hoursColumn, pickerHours, (val) => {
      selectedHour = val;
    });

    // Initial scroll to the middle (Set 1) at value '12' (index 24 + 12 = 36)
    setTimeout(() => {
      hoursColumn.scrollTop = 36 * 30;
      hoursColumn.targetScrollTop = 36 * 30;
    }, 100);
  }

  if (minutesColumn && minutesColumn.children.length === 0) {
    const topBuffer = document.createElement('div');
    topBuffer.style.height = '60px';
    minutesColumn.appendChild(topBuffer);

    // Duplicate 3 times for iOS infinite circular loop effect
    for (let set = 0; set < 3; set++) {
      pickerMinutes.forEach(m => {
        const item = document.createElement('div');
        const isActive = (set === 1 && m === '00');
        item.className = 'ios-picker-item' + (isActive ? ' active' : '');
        item.textContent = m;
        minutesColumn.appendChild(item);
      });
    }

    const bottomBuffer = document.createElement('div');
    bottomBuffer.style.height = '60px';
    minutesColumn.appendChild(bottomBuffer);

    // Inertial scroll and infinite loop
    setupIosPickerColumn(minutesColumn, pickerMinutes, (val) => {
      selectedMinute = val;
    });

    // Initial scroll to the middle (Set 1) at value '00' (index 60 + 0 = 60)
    setTimeout(() => {
      minutesColumn.scrollTop = 60 * 30;
      minutesColumn.targetScrollTop = 60 * 30;
    }, 100);
  }
}

function setupIosPickerColumn(columnEl, itemsArray, onValueChange) {
  const N = itemsArray.length;
  const itemHeight = 30;
  const setHeight = N * itemHeight;

  // Captures and accumulates mouse scroll event in an inertial and dampened way (iOS physics)
  columnEl.targetScrollTop = columnEl.scrollTop;

  columnEl.addEventListener('wheel', (e) => {
    e.preventDefault();
    const direction = Math.sign(e.deltaY);

    // If out of sync for any reason, synchronize
    if (Math.abs(columnEl.targetScrollTop - columnEl.scrollTop) > 60) {
      columnEl.targetScrollTop = Math.round(columnEl.scrollTop / itemHeight) * itemHeight;
    }

    // Shifts exactly 1 item (30px) in the direction of the scroll tick
    columnEl.targetScrollTop += direction * itemHeight;

    columnEl.scrollTo({
      top: columnEl.targetScrollTop,
      behavior: 'smooth'
    });
  }, { passive: false });

  columnEl.addEventListener('scroll', () => {
    let currentScroll = columnEl.scrollTop;

    // Silent wrap-around for infinite circular effect
    if (currentScroll < setHeight) {
      columnEl.scrollTop += setHeight;
      if (columnEl.targetScrollTop !== undefined) {
        columnEl.targetScrollTop += setHeight;
      }
      currentScroll = columnEl.scrollTop;
    } else if (currentScroll >= 2 * setHeight) {
      columnEl.scrollTop -= setHeight;
      if (columnEl.targetScrollTop !== undefined) {
        columnEl.targetScrollTop -= setHeight;
      }
      currentScroll = columnEl.scrollTop;
    }

    const index = Math.round(currentScroll / itemHeight);
    const items = columnEl.querySelectorAll('.ios-picker-item');
    items.forEach((item, i) => {
      if (i === index) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    const actualIndex = index % N;
    if (itemsArray[actualIndex] !== undefined) {
      onValueChange(itemsArray[actualIndex]);
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
      timesPhase.classList.add('d-none');
      searchPhase.classList.remove('d-none');
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

    const selectedWeekdays = getSelectedWeekdays();

    // Register all chosen times to all selected weekdays in agendaData
    Object.keys(agendaData).forEach(dateStr => {
      const dateObj = new Date(dateStr + 'T00:00:00');
      const dayOfWeek = dateObj.getDay();

      if (selectedWeekdays.includes(dayOfWeek)) {
        addedTimes.forEach(timeStr => {
          // Check if already exists to avoid duplicates if adding same med twice
          const exists = agendaData[dateStr].meds.some(m => m.name === medName && m.time === timeStr);
          if (!exists) {
            agendaData[dateStr].meds.push({
              name: medName,
              dose: dose,
              time: timeStr,
              status: 'pendente'
            });
          }
        });
        agendaData[dateStr].meds.sort((a, b) => a.time.localeCompare(b.time));
      }
    });

    // Sync with patient profile if applicable (assuming patient's meds list shows "all active meds")
    const pk = activePatientId || Object.keys(appState.patients).find(k => k !== '__sync');
    if (pk && appState.patients[pk]) {
      addedTimes.forEach(timeStr => {
        const exists = appState.patients[pk].meds.some(m => m.name === medName && m.time === timeStr);
        if (!exists) {
          appState.patients[pk].meds.push({
            name: medName,
            dose: dose,
            time: timeStr,
            status: 'pendente',
            weekdays: selectedWeekdays
          });
        }
      });
      appState.patients[pk].meds.sort((a, b) => a.time.localeCompare(b.time));
    }

    publishPatientSyncData();

    // Reset search and times states
    addedTimes = [];
    const searchPhase = document.getElementById('med-search-phase');
    const timesPhase = document.getElementById('med-times-phase');
    if (searchPhase && timesPhase) {
      timesPhase.classList.add('d-none');
      searchPhase.classList.remove('d-none');
    }
    if (searchInput) searchInput.value = '';

    renderAgenda();
    renderPatientHomeChecklist(); // Sync patient dashboard
    if (appState.user.role === 'caregiver') {
      prepareScreen8ForPatient(activePatientId);
      showScreen('screen-8');
    } else {
      showScreen('screen-6');
    }
  });
}

// 4b. Weekday Selector logic
const weekdayChips = document.querySelectorAll('.weekday-chip');
weekdayChips.forEach(chip => {
  chip.addEventListener('click', () => {
    chip.classList.toggle('selected');
  });
});

function getSelectedWeekdays() {
  const selected = [];
  document.querySelectorAll('.weekday-chip.selected').forEach(chip => {
    selected.push(parseInt(chip.getAttribute('data-day'), 10));
  });
  return selected;
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
        searchPhase.classList.add('d-none');
        timesPhase.classList.remove('d-none');
        timesPhase.style.display = 'flex'; // Ensure flex layout if d-none was removed

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
      dropdownResults.classList.add('d-none');
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
      dropdownResults.classList.add('d-none');
      dropdownResults.style.display = 'none';
    } else {
      dropdownResults.classList.remove('d-none');
      dropdownResults.style.display = 'block';
    }
  };

  searchInput.addEventListener('input', filterResults);

  searchDropdownItems.forEach(item => {
    // Inject accessibility attributes dynamically
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'option');

    const selectItem = () => {
      searchDropdownItems.forEach(i => i.classList.remove('selected'));
      item.classList.add('selected');

      const medName = item.getAttribute('data-med');
      searchInput.value = medName;
      dropdownResults.classList.add('d-none');
      dropdownResults.style.display = 'none';
    };

    item.addEventListener('click', (e) => {
      e.stopPropagation();
      selectItem();
    });

    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        selectItem();
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !dropdownResults.contains(e.target)) {
      dropdownResults.classList.add('d-none');
      dropdownResults.style.display = 'none';
    }
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

// Screen 4 header back button integration
// Handles contextual routing based on active role (caregiver -> screen-8, patient -> screen-patient-meds)
const btnScreen4Back = document.getElementById('btn-screen-4-back');
if (btnScreen4Back) {
  btnScreen4Back.addEventListener('click', () => {
    if (appState.user.role === 'caregiver') {
      showScreen('screen-8');
    } else {
      showScreen('screen-patient-meds');
    }
  });
}

// Screen 5 header back button integration
// Directs back to screen-4
const btnScreen5Back = document.getElementById('btn-screen-5-back');
if (btnScreen5Back) {
  btnScreen5Back.addEventListener('click', () => {
    showScreen('screen-4');
  });
}
