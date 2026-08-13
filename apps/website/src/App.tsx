import React from 'react';
import { BrowserRouter } from 'react-router';
import { MotionConfig } from 'framer-motion';
import { ThemeProvider } from '@aknishi/akds-reactkit';
import type { Theme } from '@aknishi/akds-reactkit';
import { AppRouter } from './router';

export default function App() {
  const [theme, setTheme] = React.useState<Theme>('light');

  return (
    <ThemeProvider theme={theme} onThemeChange={setTheme}>
      <MotionConfig reducedMotion="user">
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </MotionConfig>
    </ThemeProvider>
  );
}
