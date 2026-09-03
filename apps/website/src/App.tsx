import React from 'react';
import { BrowserRouter } from 'react-router';
import { MotionConfig } from 'framer-motion';
import { ThemeProvider, ToastProvider } from '@aknishi/akds-reactkit';
import type { Theme } from '@aknishi/akds-reactkit';
import { AppRouter } from './router';

const THEME_STORAGE_KEY = 'akds-website-theme';

function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  return stored === 'dark' ? 'dark' : 'light';
}

export default function App() {
  const [theme, setTheme] = React.useState<Theme>(getStoredTheme);

  const handleThemeChange = (nextTheme: Theme) => {
    setTheme(nextTheme);
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  };

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
