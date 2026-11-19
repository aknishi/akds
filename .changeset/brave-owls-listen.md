---
"@aknishi/akds-reactkit": patch
---

Accessibility fixes across form controls, buttons, tabs, and the carousel:

- **Checkbox / Radio / Switch** — `aria-*`, `id`, `required`, `form`, and `autoFocus` are now forwarded to the inner `<input>` instead of the wrapping `<label>`, so `aria-describedby`, `aria-invalid`, and `required` actually reach the form control. `className`, `style`, `data-*`, and event handlers still land on the label. Removed the redundant `aria-disabled` (native `disabled` already conveys it).
- **Button / IconButton / AIButton** — while `loading`, the button now uses `aria-disabled` instead of native `disabled`, so the button the user just activated keeps keyboard focus. Clicks are still blocked and the disabled class is still applied. **Behavior change:** a loading button no longer matches `:disabled` and `toBeDisabled()`; an explicit `disabled` prop still sets native `disabled`.
- **AIButton** — only the active label (default or `loadingLabel`) is exposed to assistive tech (the inactive one is `aria-hidden`, but both stay rendered so the button width doesn't jump), and string labels are exposed as a whole via `aria-label` rather than letter-by-letter. The sparkle icon is now `aria-hidden`. Added `prefers-reduced-motion` handling: the per-letter scale/blur burst, infinite letter pulse, and icon flicker are disabled; the label crossfade remains.
- **LikeButton** — now exposes its state via `aria-pressed` and has a default accessible name of `"Like"` (override with `aria-label`).
- **Combobox** — Enter no longer selects an option while an IME composition (e.g. Japanese, Chinese, Korean input) is in progress.
- **Tabs** — each `Tab` and `TabPanel` are now linked via `id` / `aria-controls` / `aria-labelledby`. Inactive panels remain in the DOM as empty, `hidden` elements (content still only mounts when its tab is active).
- **Carousel** — in `loop` mode, the off-screen duplicate slide sets are now `aria-hidden` and `inert`, so each slide is announced once and focus never lands in a copy.
- **Spinner** — under `prefers-reduced-motion`, it now spins slowly instead of stopping entirely, so it still reads as loading.
