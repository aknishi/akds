import React from 'react';
import { BrowserRouter } from 'react-router';
import { MotionConfig } from 'framer-motion';
import { ThemeProvider, ToastProvider } from '@aknishi/akds-reactkit';
import type { Theme } from '@aknishi/akds-reactkit';
import { AppRouter } from './router';

const THEME_STORAGE_KEY = 'akds-website-theme';

// No stored value means "follow the OS" ('system'). Only an explicit override
// is persisted, so the site keeps tracking OS changes until the user pins one.
function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'system';
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return stored === 'dark' || stored === 'light' ? stored : 'system';
  } catch {
    return 'system';
  }
}

export default function App() {
  const [theme, setTheme] = React.useState<Theme>(getStoredTheme);

  const handleThemeChange = (nextTheme: Theme) => {
    setTheme(nextTheme);
    try {
      if (nextTheme === 'system') window.localStorage.removeItem(THEME_STORAGE_KEY);
      else window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {
      // Storage blocked: the theme still applies for this visit.
    }
  };

  // Keep other open tabs in sync with a change made here.
  React.useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === THEME_STORAGE_KEY) setTheme(getStoredTheme());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return (
    <ThemeProvider theme={theme} onThemeChange={handleThemeChange}>
      <ToastProvider>
        <MotionConfig reducedMotion="user">
          <BrowserRouter>
            <AppRouter />
          </BrowserRouter>
        </MotionConfig>
      </ToastProvider>
    </ThemeProvider>
  );
}
