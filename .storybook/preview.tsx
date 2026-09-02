import React from 'react';
import type { Preview } from '@storybook/react-vite';
import { useDarkMode } from 'storybook-dark-mode';
import { themes } from 'storybook/theming';
import { ThemeProvider } from '@aknishi/akds-reactkit';
import { DocsContainer } from '@storybook/addon-docs/blocks';

const docsDarkTheme = {
  ...themes.dark,
  brandTitle: 'AKDS Storybook',
  brandUrl: 'https://akds-storybook.com',
  brandImage: '/AKLogo-lockup-dark.svg',
  brandTarget: '_self',
  appContentBg: 'rgb(30, 30, 30)',
  appPreviewBg: 'rgb(30, 30, 30)',
};

const docsLightTheme = {
  ...themes.normal,
  brandTitle: 'AKDS Storybook',
  brandUrl: 'https://akds-storybook.com',
  brandImage: '/AKLogo-lockup.svg',
  brandTarget: '_self',
};

function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const isDark = useDarkMode();

  return (
    <ThemeProvider theme={isDark ? 'dark' : 'light'}>
      <div
        style={{
          padding: '2rem',
          background: isDark ? 'rgb(30, 30, 30)' : '#fafafa',
          minHeight: '100%',
          boxSizing: 'border-box',
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
    <DocsContainer context={context} theme={isDark ? docsDarkTheme : docsLightTheme}>
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
          tr:nth-child(even) td:not([class*="akds-"]) {
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
          ${isDark ? `
          .docblock-source, .docblock-source pre {
            background: rgb(30, 30, 30) !important;
          }
          div:has(> [data-radix-scroll-area-viewport]) {
            background: rgb(30, 30, 30) !important;
          }
          code:not([class*="akds-"]) {
            background: rgba(255, 255, 255, 0.08) !important;
          }
          ` : ''}
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
    dark: docsDarkTheme,
    light: docsLightTheme,
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
