---
"@aknishi/akds-reactkit": patch
---

Overlays now use native top-layer platform features instead of hand-built positioning, focus traps, and z-index stacking:

- **Dialog / Drawer** — rendered as a native `<dialog>` opened with `showModal()`. The browser now provides the backdrop (`::backdrop`), inert page, focus containment, Escape / back-gesture handling, and focus return to the trigger on close (previously focus was not returned). Backdrop click uses `closedby="any"` with a pointer-based fallback for Safari. The `body { overflow: hidden }` scroll lock is replaced by `overscroll-behavior: contain` on the dialog and backdrop, so the page scrollbar no longer disappears. Enter/exit animations use `@starting-style` and discrete transitions, with a `data-closing` exit for browsers without `overlay` support; reduced motion gets a short fade. Escape and backdrop clicks still go through `onClose`, so `open` remains the source of truth.
- **Menu / DropdownMenu / Combobox** — popups are now popovers in the top layer (`popover="auto"` for Menu and DropdownMenu, `popover="manual"` for Combobox so focus stays in the input), anchored with CSS anchor positioning and flipping on both axes. They are no longer clipped by overflow containers or dialogs. Fallbacks: script positioning when anchor positioning is unsupported, and the previous portal or absolute positioning when the Popover API is unsupported. Menu now returns focus to the trigger on Escape and on item activation, and only moves focus into the menu on keyboard opens (pointer opens leave focus on the trigger).
- **Tooltip** — `popover="hint"` in the top layer with anchor positioning and flipping (script fallback). Now meets WCAG 1.4.13: the pointer can move onto the tooltip without it closing, and Escape dismisses it. Any `aria-describedby` already on the trigger is merged instead of overwritten.
- **Toast** — the viewport is a `popover="manual"` in the top layer. Dismissing a focused toast moves focus to the next toast (or back to where focus was before) instead of dropping it to `<body>`. Toasts no longer overflow a 320px-wide viewport. Announcements use `document.ariaNotify()` where available, falling back to the existing live regions; toast cards are no longer live regions themselves, which removes duplicate announcements.
- Nested popups (Combobox, DropdownMenu, Tooltip) consume Escape while open, so pressing Escape inside a Dialog closes the popup first and the dialog only on the next press.

**Breaking changes for TypeScript users and custom CSS:**

- `Dialog` and `Drawer` refs now point to an `HTMLDialogElement` instead of an `HTMLDivElement`.
- The `.akds-dialog-backdrop` and `.akds-drawer-backdrop` wrapper elements are gone; style `.akds-dialog::backdrop` or `.akds-drawer::backdrop` instead.
- The internal `.akds-dialog--closing`, `.akds-drawer--closing`, and `.akds-menu--closing` classes are removed.
- Menu with `triggerRef` renders in place rather than in a portal (it still overlays everything via the top layer).
- Individual toast cards no longer carry `role="status"` or `role="alert"`.
