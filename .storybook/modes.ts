// Chromatic modes: each story is snapshotted once per mode, with these
// globals applied. Baselines are keyed by mode name — renaming a mode
// starts a fresh baseline, so keep these names stable.
export const allModes = {
  light: { theme: 'light' },
  dark: { theme: 'dark' },
} as const;
