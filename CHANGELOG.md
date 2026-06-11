# Changelog - LembreMed Visual Prototype

All notable changes and design iterations for the LembreMed interactive prototype are documented in this file.

---

## [Unreleased]

### Changed
- **Project Structure Flattening**: Removed the redundant `src/` directory. Core assets (`assets/`, `css/`, `js/`) are now properly hosted at the project root level.
- **Removed Phone Data Logic**: Eliminated phone number input fields, masking, and validation logic from registration and patient management flows (simulated UI calling functionality remains unchanged).

### Removed
- **Empty Files Cleanup**: Deleted empty unused files (`js/timePicker.js`, `js/medSearch.js`).

---

## [1.4.0] - 2026-05-21

### Added

- **Role-Based Experience Reorganization**: Fully separated the prototype into two isolated and targeted user flows without splitting the codebase:
  - **Patient Experience**: Screens 12 (Início/Checklist), 6 (Paciente Agenda), 13 (Meus Remédios), 14 (Meus Alertas), and 15 (Paciente Ajustes).
  - **Caregiver Experience**: Screens 7 (Painel do Cuidador), 11 (Perfil do Paciente), 8 (Agenda do Paciente), 9 (Central de Alertas), and 10 (Configurações).
- **Modo do Simulador Sidebar Switcher**: A segmented control (`Geral` / `Paciente` / `Cuidador`) in the sidebar control panel to filter screen access and redirect device viewports dynamically.
- **Bidirectional Ingestion Sync**: Checking/unchecking today's doses on Screen 12 (Início) immediately reflects on Screen 6 (Agenda) calendar checklist and recalculates weekly statistics.
- **High Contrast Mode**: Accessible glide-switch toggle inside Screen 15 (Ajustes) applying high-contrast body styling variables.
- **Dedicated Bottom Navigations**: Isolated bottom tabs per role (**Início/Agenda/Remédios/Alertas/Ajustes** for Patient vs **Pacientes/Agenda/Alertas/Config** for Caregiver).
- **Contextual Dialing Overlay**: Adapts system recipient labels depending on whether patient-to-caregiver or caregiver-to-patient call is initiated.

---

## [1.3.0] - 2026-05-20

### Added

- **New Detailed Patient Profile Screen (Screen 11)**: Includes Demographics, SVG Circular Adherence Ring, Medication Checklist, History alerts, Caregiver notes bubble log, and simulated voice calling.
- **Interactive Alerts Feed (Screen 9)**: Bold, underlined, accessible patient names with custom keyboard support (`tabindex="0"`, Enter/Space) and custom hover chevrons routing directly to Screen 11.
- **Interactive Notes Logger**: Caregivers can submit a note dynamically, appending it to the clinical history bubble feed.

---

## [1.2.0] - 2026-05-19

### Added

- **Interactive Agenda Screen (Screen 6)**: Implemented 7-day horizontal calendar strip indicating completion (`✓`), pending (`◷`), and missed (`✗`) doses.
- **Weekly Adherence Metric Card**: Integrated circular SVG progress ring updating adherence metrics dynamically as checklists change.

---

## [1.1.0] - 2026-05-18

### Added

- **Baseline Navigation Correction**: Split the caregiver navigation logic. Introduced a dedicated **Configurações (Screen 10)** settings view, separating it completely from patient agendas.

---

## [1.0.0] - 2026-05-17

### Added

- **Pixel-Perfect Figma Replication**: Translated visual screens into modular HTML/CSS/JS, establishing the foundation layout, Outfit typography scale, color tokens, and custom SVG assets.
