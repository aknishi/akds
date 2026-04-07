import React, { useEffect } from 'react';
import type { Preview } from '@storybook/react-vite';
import { useDarkMode } from 'storybook-dark-mode';
import '@aknishi/akds-tokens/css';

function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const isDark = useDarkMode();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <div 
      style={{ 
        padding: '2rem', 
        background: isDark ? 'black': 'white',
        minHeight: isDark ? '100vh' : 'unset' 
      }}>
      {children}
    </div>
  );
}

export const decorators: Preview['decorators'] = [
  (Story) => (
    <ThemeWrapper>
      <Story />
    </ThemeWrapper>
  ),
];

export const parameters: Preview['parameters'] = {
  layout: 'fullscreen',
  darkMode: {
    current: 'light',
  },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /date$/i,
    },
  },
};
