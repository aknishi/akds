import React from 'react';
import '@aknishi/akds-tokens/css';
import type { ThemeProviderProps } from './ThemeProvider.types';
import { ThemeContext } from './ThemeContext';
import type { Theme, ResolvedTheme } from './ThemeContext';

const DARK_QUERY = '(prefers-color-scheme: dark)';

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return 'light';
  return window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light';
}

/** Tracks the OS color scheme, including changes while the page is open. */
function useSystemTheme(): ResolvedTheme {
  const [systemTheme, setSystemTheme] = React.useState<ResolvedTheme>(getSystemTheme);
  React.useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mql = window.matchMedia(DARK_QUERY);
    const onChange = () => setSystemTheme(mql.matches ? 'dark' : 'light');
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);
  return systemTheme;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  defaultTheme = 'system',
  theme: themeProp,
  onThemeChange,
  target,
  children,
}) => {
  const isControlled = themeProp !== undefined;
  const [internalTheme, setInternalTheme] = React.useState<Theme>(defaultTheme);
  const theme = isControlled ? themeProp : internalTheme;
  const systemTheme = useSystemTheme();
  const resolvedTheme: ResolvedTheme = theme === 'system' ? systemTheme : theme;

  const setTheme = React.useCallback(
    (next: Theme) => {
      if (!isControlled) {
        setInternalTheme(next);
      }
      onThemeChange?.(next);
    },
    [isControlled, onThemeChange],
  );

  // 'system' removes the attribute so the tokens' prefers-color-scheme rules
  // and `color-scheme: light dark` apply; CSS keeps working even if this
  // effect never runs (SSR, JS disabled).
  React.useEffect(() => {
    if (target === null) return;
    const el = target ?? document.documentElement;
    if (theme === 'system') el.removeAttribute('data-theme');
    else el.setAttribute('data-theme', theme);
  }, [theme, target]);

  const ctx = React.useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme],
  );

  return (
    <ThemeContext.Provider value={ctx}>
      {children}
    </ThemeContext.Provider>
  );
};

ThemeProvider.displayName = 'ThemeProvider';
