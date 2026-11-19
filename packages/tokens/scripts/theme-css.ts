/**
 * Shared theme-block assembly for the token CSS generators.
 *
 * Theme model (follows the modern-web-guidance `dark-mode`,
 * `dark-mode-toggle` and `component-specific-light-dark-theme` guides):
 *
 * - `:root` declares `color-scheme: light dark` so native UI (scrollbars, form
 *   controls, canvas) follows the OS by default. The base value must stay
 *   `light dark`; explicit overrides come from `[data-theme]`.
 * - `[data-theme="light"]` / `[data-theme="dark"]` pin both the semantic
 *   tokens and `color-scheme`, on the root or on any subtree (ThemeProvider's
 *   `target`), so a light subtree inside an OS-dark page really is light.
 * - Without `data-theme`, `prefers-color-scheme: dark` swaps the root tokens.
 * - Tokens that reference other tokens (e.g. `--akds-outline-focus`) resolve
 *   where they are declared, so they are redeclared in every theme block;
 *   otherwise a subtree would inherit the root's already-resolved value.
 * - A themed subtree gets its own background and text color: setting
 *   `color-scheme` on an element without a background risks mixing light and
 *   dark color pairs.
 */
export function assembleThemeCss({
  lightLines,
  darkLines,
  derivedLines,
}: {
  /** Semantic color declarations for light mode (also emitted on :root). */
  lightLines: string[];
  /** Semantic color declarations for dark mode. */
  darkLines: string[];
  /** Declarations that reference other tokens and must be re-resolved per theme. */
  derivedLines: string[];
}): string {
  if (!darkLines.length) return '';
  const light = [...lightLines, ...derivedLines];
  const dark = [...darkLines, ...derivedLines];
  const indent = (lines: string[]) => lines.map((l) => '  ' + l).join('\n');

  return (
    `\n/* ─── Light mode — explicit attribute (root or subtree) ─────────── */\n` +
    `[data-theme="light"] {\n  color-scheme: light;\n${light.join('\n')}\n}\n` +
    `\n/* ─── Dark mode — explicit attribute (root or subtree) ──────────── */\n` +
    `[data-theme="dark"] {\n  color-scheme: dark;\n${dark.join('\n')}\n}\n` +
    `\n/* ─── Dark mode — OS preference (respects explicit light override) */\n` +
    `@media (prefers-color-scheme: dark) {\n` +
    `  :root:not([data-theme="light"]) {\n` +
    `${indent(dark)}\n` +
    `  }\n}\n` +
    `\n/* ─── Themed subtrees get their own surface ─────────────────────── */\n` +
    `[data-theme]:not(:root) {\n` +
    `  background-color: var(--akds-color-surface-default);\n` +
    `  color: var(--akds-color-text-primary-default);\n` +
    `}\n`
  );
}

/** Opening declaration for the :root block. */
export const ROOT_COLOR_SCHEME_LINE = '  color-scheme: light dark;';
