---
"@aknishi/akds-reactkit": minor
---

New form features:

- **TextInput / TextArea** — native constraint validation (`required`, `pattern`, `type="email"`, …) now gets error styling, but only after the user has interacted with the field (`:user-invalid`, with a JS fallback for older browsers). The browser's validation message is shown and linked via `aria-describedby`. **Behavior change:** `aria-invalid="false"` is now always rendered until the field is invalid (the `error` prop still forces `true`).
- **TextArea** — new `autoGrow` (default `true`) and `maxRows` props. **Behavior change:** `resizable={false}` now only hides the resize handle and no longer disables auto-grow; use `autoGrow={false}` for a fixed height.
- **Combobox** — new `name` prop renders hidden inputs so the value submits with a form (one per value when `multiple`), and `required` now participates in native form validation.
