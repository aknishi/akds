---
"@aknishi/akds-reactkit": patch
---

Address several non-text contrast failures:

- Solid success/destructive Button and IconButton, and the blue/green/red Avatar variants, now use the theme-invariant `-strong` background tokens (matching Alert's existing pattern) instead of `-default`, which failed as low as 2.3:1 with white text/icons.
- Solid/filled accented Button, IconButton, and the blue Avatar variant now use `--akds-color-background-primary-strong` instead of `-default` — dark mode was only 3.7:1 with white text.
- TextInput, TextArea, Combobox, ToggleButton, Checkbox, Radio, and Switch now switch their control boundary to `--akds-color-border-neutral-strong` on hover, for a clearer affordance. The resting-state border is still `-default` (`#E2E2E2` light / `#404040` dark, ~1.3:1 / ~1.7:1), which remains under the 3:1 contrast minimum for UI components — kept this way intentionally for the current visual style. Decorative borders (Divider, Card, Table, Dialog, Menu, etc.) are unchanged.
- Removed a dead `width` transition on the Switch thumb — nothing ever animated that property, and it was an unnecessary layout-thrash risk.
- Alert's filled success/warning/error, and the new success/destructive variants of Button, IconButton, and Avatar above, now reference the new `--akds-color-text-on-success-default` / `-on-error-default` / `-on-warning-default` tokens instead of reusing `text-on-primary-default`. No visual change (all resolve to `#FFFFFF` today) — this just points each at the token that actually describes it.
