# Plan — Fix Patient Navigation & Logout Bugs

## Goal
Investigate and resolve the two critical bugs reported in the patient mode: the inoperable "Sair" (Logout) button and the "Continuar" button on the onboarding/welcome screen requiring multiple clicks to advance.

## Tasks
- [x] Task 1: Investigate and debug the "Sair" (Logout) button handler in patient mode → Verify: Button triggers `performLogout` and redirects to `screen-1`.
- [x] Task 2: Investigate and debug the "Continuar" button click handler in the welcome flow → Verify: Transition occurs instantly on the first click.
- [x] Task 3: Apply fixes to `js/main.js` and/or `index.html` → Verify: Changes staged and tested locally.
- [x] Task 4: Run project verification checklists to ensure all checks pass without regressions → Verify: `python .agent/scripts/checklist.py .` returns success.

## Done When
- [x] Clicking "Sair" inside the patient settings instantly logs the user out and redirects to screen 1.
- [x] Clicking "Continuar" on the patient welcome/onboarding screen transitions to the next screen on the very first click.
- [x] All checklist validation checks pass successfully.
