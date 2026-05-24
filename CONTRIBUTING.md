# Contributing to LembreMed

Welcome! LembreMed is a mobile-first, bidirectional medication reminder and adherence tracking application designed for Patients and Caregivers. 

We follow strict design, coding, and engineering standards to ensure high visual quality, mobile responsiveness, and accessibility (WAI-ARIA). Please review these guidelines before submitting any changes.

---

## 1. Commit Language and Convention

We follow the **Angular Commit Convention**. As requested, **all commit messages must be written in English**.

### Format:
```text
type(scope): subject

[optional body]

[optional footer(s)]
```

* **Types**:
  * `feat`: A new user-facing feature.
  * `fix`: A bug fix.
  * `docs`: Documentation changes (e.g., updates to README, CONTRIBUTING, Walkthroughs).
  * `style`: Styling adjustments, formatting, or missing semi-colons (no code changes).
  * `refactor`: Code changes that neither fix a bug nor add a feature.
  * `perf`: Performance improvements.
  * `test`: Adding missing or correcting existing tests.
  * `chore`: Maintenance tasks, build/CI configuration, or dependency updates.
* **Scope**: The specific component or screen affected (e.g., `meds`, `agenda`, `auth`, `accessibility`, `logo`).
* **Subject**: Short, imperative description in English (e.g., `accessibility: isolate high-contrast scope to simulated phone container`).

---

## 2. Design System and Styling Guidelines

To maintain LembreMed's premium aesthetic and interactive feel, adhere to the following layout and styling rules:

### A. Rounded Borders Consistency
* Never use raw or pixel-based border radiuses unless there is a hardware mockup restriction.
* **Cards & Panels**: Use `var(--radius-lg)` (18px) for major layout containers and cards.
* **Buttons & Chips**: Use `var(--radius-pill)` (9999px) for primary, secondary, and chip buttons.
* **Inputs & Controls**: Use `var(--radius-md)` (12px) for form inputs, textareas, and selection boxes.

### B. No JS Inline Styles
* **Rule**: Avoid setting `.style.borderRadius`, `.style.padding`, `.style.backgroundColor`, or other complex styles directly in `js/main.js`.
* **Standard**: Refactor layout styling into reusable classes in `css/styles.css` (e.g., `.profile-med-item`) and toggle them dynamically via `classList.add()`, `.remove()`, or `.toggle()`.

### C. Mobile-First & Premium Tactility
* **Hover Limitations**: Avoid desktop `:hover` scaling transforms or state-changes on phone screen elements, as hover states get "stuck" on touchscreen taps.
* **Haptic Feedback**: Implement `:active` scaling transforms (e.g., `transform: scale(0.98);`) and transition effects on all buttons and cards to mimic real device haptic feedback.
* **Tap Highlights**: Disable webkit tap highlight overlays on clickable elements via `-webkit-tap-highlight-color: transparent;`.

### D. SVG Icon Safety
* **Rule**: When adding pill or medication-related icons, **do not** use basic `<rect>` tags without explicit resets. They render as solid black circles in several mobile rendering engines.
* **Standard**: Use the custom Lucide Pill SVG path representation with an explicit `fill="none"` declared internally:
  ```html
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" fill="none"/>
    <path d="m8.5 15.5 7-7"/>
  </svg>
  ```

---

## 3. Web Architecture & Deployment

* **Root Directory Structure**: To facilitate immediate, seamless deployment on **GitHub Pages**, all primary web assets must remain at the root of the project:
  * `index.html` (Main entry point)
  * `css/styles.css` (Main styling)
  * `js/main.js` (Main application logic)
  * `assets/` (Vectores, logos, and images)
* **Testing Syntax**: Before staging and pushing any JavaScript changes, always run a local syntax check to ensure zero runtime regressions:
  ```bash
  node -c js/main.js
  ```

---

## 4. Accessibility & WAI-ARIA Standards

LembreMed prioritizes inclusion and accessibility. All new interactive additions must follow WCAG guidelines:

* **Keyboard Operability**: Make sure all custom card items or buttons are focusable by setting `tabindex="0"`.
* **Role Semantics**: Explicitly assign `role="button"` or other semantic WAI-ARIA roles to custom div-based interactive components.
* **Live Announcements**: For dynamic alerts, call transitions, or settings toggles, use the helper function `announceToScreenReader("Your message here")` to broadcast updates to screen readers through the `#app-live-announcer` live-region container.
* **Scope-Safe Accessibility**: Ensure accessibility enhancements (like high-contrast mode `.high-contrast`) are strictly scoped within `#phone-container` to avoid affecting the external presenter dashboard or sidebar.
