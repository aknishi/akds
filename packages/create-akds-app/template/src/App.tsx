import React from 'react';
import { BrowserRouter } from 'react-router';
import { ThemeProvider } from '@aknishi/akds-reactkit';
import './App.css';
import type { Theme } from '@aknishi/akds-reactkit';
import { AppRouter } from './router';

export default function App() {
  const [theme, setTheme] = React.useState<Theme>('light');

  return (
    <ThemeProvider theme={theme} onThemeChange={setTheme}>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </ThemeProvider>
  );
}
