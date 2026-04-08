import React from 'react';
import type { Preview } from '@storybook/react-vite';
import { useDarkMode } from 'storybook-dark-mode';
import { ThemeProvider } from '@aknishi/akds-reactkit';

function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const isDark = useDarkMode();

  return (
    <ThemeProvider theme={isDark ? 'dark' : 'light'}>
      <div
        style={{
          padding: '2rem',
          background: isDark ? 'black' : 'white',
          minHeight: isDark ? '100vh' : 'unset',
        }}
      >
        {children}
      </div>
    </ThemeProvider>
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
  controls: { disable: true },
  actions: { disable: true },
  interactions: { disable: true },
  options: {
    storySort: {
      order: ['Getting Started', 'Foundation', 'Components'],
    },
  },
};
