---
"@aknishi/akds-reactkit": minor
---

New accessibility props:

- **Checkbox / Radio / Switch** — new `required` and `autoFocus` props, forwarded to the inner `<input>`.
- **Spinner** — new optional `label` prop; when set, the spinner is exposed as a labelled `progressbar`. Without it, it remains decorative (`aria-hidden`).
