---
"@aknishi/akds-reactkit": patch
---

Form control accessibility fixes:

- **TextInput / TextArea** — a consumer `aria-describedby` is now merged with the helper/error text ids instead of replacing them.
- **TextInput / TextArea** — error messages are prefixed with an error icon announced as "Error", so errors aren't conveyed by color alone.
- **TextArea** — auto-grow now uses CSS `field-sizing: content` (no re-render per keystroke), falling back to the previous mirror technique where unsupported.
- **Option / DropdownMenu / Combobox** — only one option is in the Tab order at a time (roving tabindex) instead of every option being a Tab stop. **Behavior change:** Space now selects on key release (Enter still selects on key press), matching native buttons, and a Space press that opened the menu no longer also selects an option.
- **RadioGroup** — logs a development-only warning when the group has no accessible name (`legend`, `aria-label`, or `aria-labelledby`).
- **ToggleButton / Combobox / DropdownMenu** — removed redundant `aria-disabled` alongside native `disabled`.
