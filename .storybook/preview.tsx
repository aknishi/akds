import React from 'react';
import type { Preview } from '@storybook/react-vite';
import { useDarkMode } from 'storybook-dark-mode';
import { themes } from 'storybook/theming';
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
          minHeight: 'unset',
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
          h1:not([class*="akds-"]), h2:not([class*="akds-"]), h3:not([class*="akds-"]),
          h4:not([class*="akds-"]), h5:not([class*="akds-"]), h6:not([class*="akds-"]),
          p:not([class*="akds-"]), li:not([class*="akds-"]), strong:not([class*="akds-"]),
          em:not([class*="akds-"]) {
            color: var(--akds-color-text-primary-default) !important;
          }
          td:not([class*="akds-"]), th:not([class*="akds-"]) {
            color: var(--akds-color-text-primary-default) !important;
            border-color: var(--akds-color-border-neutral-default) !important;
            background: transparent !important;
          }
          tr:nth-child(even) td {
            background: var(--akds-color-surface-sunken) !important;
          }
          table {
            border-color: var(--akds-color-border-neutral-default) !important;
          }
          hr {
            border-color: var(--akds-color-border-neutral-default) !important;
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
    dark: {
      ...themes.dark,
      brandTitle: 'AKDS Storybook',
      brandUrl: 'https://akds-storybook.com',
      brandImage: '/AKLogo-lockup-dark.svg',
      brandTarget: '_self',
    },
    light: {
      ...themes.normal,
      brandTitle: 'AKDS Storybook',
      brandUrl: 'https://akds-storybook.com',
      brandImage: '/AKLogo-lockup.svg',
      brandTarget: '_self',
    },
  },
  controls: { disable: true },
  actions: { disable: true },
  interactions: { disable: true },
  docs: {
    container: ThemedDocsContainer,
  },
  options: {
    storySort: {
      order: ['Overview', 'Getting Started', 'ThemeProvider', 'Tokens', ['Changelog', 'Tokens'], 'Reactkit', 'Icons', 'create-akds-app'],
    },
  },
};
