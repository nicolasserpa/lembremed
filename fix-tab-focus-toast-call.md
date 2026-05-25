# Plan: Fix Keyboard Tab Focus on Hidden Floating Simulator Overlays

## Goal
Fix the scrolling / navigation bug where keyboard Tab focus lands on interactive elements inside hidden floating overlays (the Medication Reminder Toast and the Medication Bottom Sheet), causing the viewport to scroll vertically and cut off the top of the mockup.

## Tasks
- [ ] Task 1: Add `visibility: hidden` and transition support to `.med-reminder-toast` in `css/styles.css`.
- [ ] Task 2: Add `visibility: visible` to `.med-reminder-toast.active` in `css/styles.css`.
- [ ] Task 3: Add `visibility: hidden` and transition support to `.bottom-sheet-overlay` in `css/styles.css`.
- [ ] Task 4: Add `visibility: visible` to `.bottom-sheet-overlay.active` in `css/styles.css`.
- [ ] Task 5: Run validation checklists to verify all styles and logic compile flawlessly.
- [ ] Task 6: Test manual keyboard navigation (Tab flow) through all screens to ensure zero unwanted scrolls.

## Done When
- [ ] Keyboard Tab navigation flows seamlessly through active screen contents without focusing off-screen/hidden overlays.
- [ ] Views do not scroll or shift layout when tabbing.
- [ ] Medication Reminder Toast and Bottom Sheet remain fully functional and transition smoothly when activated.
