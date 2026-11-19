---
"@aknishi/akds-reactkit": minor
---

- **ThemeProvider** — new `'system'` theme, now the **default** (was `'light'`). In `'system'` the provider removes `data-theme`, so the page follows the OS color scheme, including live OS changes. `useTheme()` now also returns `resolvedTheme` (`'light' | 'dark'`, the scheme actually rendered). New exported type `ResolvedTheme`. **Behavior change:** apps that render `<ThemeProvider>` without `defaultTheme`/`theme` were forced to light; they now follow the OS. Pass `defaultTheme="light"` to keep the old behavior.
