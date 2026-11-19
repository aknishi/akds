---
"@aknishi/akds-reactkit": patch
---

Follow-up fixes:

- **Toast** — toasts shown while a modal Dialog or Drawer is open now appear above it and stay clickable. The provider's toast container moves into the open modal dialog (and back out when it closes); previously toasts sat under the dialog's backdrop in the inert page. The live regions move with it, so announcements still reach screen readers. Toast markup now renders inside a `.akds-toast__host` element (`display: contents`) appended to `<body>`.
- **Toast** — showing another toast no longer restarts the auto-dismiss countdown of toasts already on screen.
- **Dialog / Drawer** — in browsers without `closedby` (Safari), the backdrop-click fallback now only counts presses on the backdrop itself, not on content drawn outside the dialog box.
- **DropdownMenu** — the `name` prop now works: the selection is submitted with a surrounding form through hidden inputs (one per value when `multiple`), and nothing is submitted while disabled. The trigger's display text now includes options wrapped in fragments and options whose label contains elements.
- **Switch** — the input also carries the native `switch` attribute (native switch semantics and iOS haptics where supported); `role="switch"` stays for other browsers.
