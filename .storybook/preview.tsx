import React from 'react';
import type { Preview } from '@storybook/react-vite';
import { useDarkMode } from 'storybook-dark-mode';
import { ThemeProvider } from '@aknishi/akds-reactkit';
import { DocsContainer } from '@storybook/addon-docs/blocks';

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

function ThemedDocsContainer({ children, context }: { children: React.ReactNode; context: any }) {
  const isDark = useDarkMode();

  return (
    <DocsContainer context={context}>
      <ThemeProvider theme={isDark ? 'dark' : 'light'}>
        <style>{`
          body, .sbdocs-wrapper {
            background: ${isDark ? '#000' : '#fff'} !important;
          }
          h1, h2, h3, h4, h5, h6, p, li, strong, em {
            color: var(--akds-color-text-primary-default) !important;
          }
          td, th {
            color: var(--akds-color-text-primary-default) !important;
            border-color: var(--akds-color-border-default-default) !important;
            background: transparent !important;
          }
          tr:nth-child(even) td {
            background: var(--akds-color-surface-sunken) !important;
          }
          table {
            border-color: var(--akds-color-border-default-default) !important;
          }
          hr {
            border-color: var(--akds-color-border-default-default) !important;
          }
          code {
            color: var(--akds-color-text-secondary-default) !important;
          }
        `}</style>
        {children}
      </ThemeProvider>
    </DocsContainer>
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
  docs: {
    container: ThemedDocsContainer,
  },
  options: {
    storySort: {
      order: ['Getting Started', 'ThemeProvider', 'Tokens', ['Changelog', 'Tokens'], 'Reactkit', 'Icons', 'create-akds-app'],
    },
  },
};
