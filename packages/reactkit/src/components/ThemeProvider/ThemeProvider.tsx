import React from 'react';
import '@aknishi/akds-tokens/css';
import type { ThemeProviderProps } from './ThemeProvider.types';
import { ThemeContext } from './ThemeContext';
import type { Theme } from './ThemeContext';

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  defaultTheme = 'light',
  theme: themeProp,
  onThemeChange,
  target,
  children,
}) => {
  const isControlled = themeProp !== undefined;
  const [internalTheme, setInternalTheme] = React.useState<Theme>(defaultTheme);
  const theme = isControlled ? themeProp : internalTheme;

  const setTheme = React.useCallback(
    (next: Theme) => {
      if (!isControlled) {
        setInternalTheme(next);
      }
      onThemeChange?.(next);
    },
    [isControlled, onThemeChange],
  );

  React.useEffect(() => {
    if (target === null) return;
    const el = target ?? document.documentElement;
    el.setAttribute('data-theme', theme);
  }, [theme, target]);

  const ctx = React.useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  return (
    <ThemeContext.Provider value={ctx}>
      {children}
    </ThemeContext.Provider>
  );
};

ThemeProvider.displayName = 'ThemeProvider';
