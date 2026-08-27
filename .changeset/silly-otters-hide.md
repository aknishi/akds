---
"@aknishi/akds-reactkit": patch
---

Fix insufficient contrast on standalone ToggleButton's pressed state in dark mode. The tinted fill background was pinned to a fixed light primitive color that never adapted for dark mode, while its text color did — producing near-white text on a near-white background for all four color variants (neutral, primary, success, error). The background is now derived from the same theme-aware text color via `color-mix()`, so it stays a correctly-contrasted tint in both themes.
