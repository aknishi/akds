import React from 'react';
import type { Preview } from '@storybook/react-vite';
import { useDarkMode } from 'storybook-dark-mode';
import { themes } from 'storybook/theming';
import { ThemeProvider } from '@aknishi/akds-reactkit';
import { DocsContainer } from '@storybook/addon-docs/blocks';
import isChromatic from 'chromatic/isChromatic';
import { allModes } from './modes';

const docsDarkTheme = {
  ...themes.dark,
  brandTitle: 'AKDS Storybook',
  brandUrl: 'https://akds-storybook.com',
  brandImage: '/AKLogo-lockup-dark.svg',
  brandTarget: '_self',
  // Matches --akds-color-surface-sunken's dark-mode value. Storybook's
  // manager UI (which reads this theme object) runs in a separate bundle
  // from the preview iframe where the token CSS is loaded, so this has to
  // be the literal value rather than var(--akds-color-surface-sunken).
  appContentBg: '#0A0A0A',
  appPreviewBg: '#0A0A0A',
};

const docsLightTheme = {
  ...themes.normal,
  brandTitle: 'AKDS Storybook',
  brandUrl: 'https://akds-storybook.com',
  brandImage: '/AKLogo-lockup.svg',
  brandTarget: '_self',
};

// `theme` global set by Chromatic modes (see modes.ts). Chromatic renders
// stories without the Storybook manager, so the storybook-dark-mode toggle
// never reaches it — when the global is unset, fall back to that toggle.
function ThemeWrapper({ children, theme }: { children: React.ReactNode; theme?: 'light' | 'dark' }) {
  const isManagerDark = useDarkMode();
  const isDark = theme ? theme === 'dark' : isManagerDark;

  return (
    <ThemeProvider theme={isDark ? 'dark' : 'light'}>
      <div
        style={{
          padding: '2rem',
          background: isDark ? 'var(--akds-color-surface-sunken)' : '#fafafa',
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
            background: var(--akds-color-surface-sunken) !important;
          }
          div:has(> [data-radix-scroll-area-viewport]) {
            background: var(--akds-color-surface-sunken) !important;
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
  (Story, context) => (
    <ThemeWrapper theme={context.globals.theme}>
      <Story />
    </ThemeWrapper>
  ),
];

export const globalTypes: Preview['globalTypes'] = {
  theme: {
    description: 'Forces the story theme. Unset uses the dark-mode toolbar toggle.',
  },
};

// Fonts load lazily — only once text using them renders — so
// document.fonts.ready alone can resolve before they've been requested.
// Load the token font families explicitly so Chromatic never captures
// the fallback font.
const fontLoader = async () => {
  if (!document.fonts) return {};
  await Promise.all(
    ['300', '400', '500', '600', '700', '800'].map((weight) =>
      document.fonts.load(`${weight} 1em "DM Sans"`),
    ),
  );
  await document.fonts.load('400 1em "JetBrains Mono"');
  return {};
};

export const loaders: Preview['loaders'] = isChromatic() ? [fontLoader] : [];

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
  chromatic: {
    modes: {
      light: allModes.light,
      dark: allModes.dark,
    },
  },
  options: {
    storySort: {
      order: ['Overview', 'Getting Started', 'ThemeProvider', 'Tokens', ['Changelog', 'Tokens'], 'Reactkit', 'Icons', 'create-akds-app'],
    },
  },
};
