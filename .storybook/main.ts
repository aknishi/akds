import { fileURLToPath } from 'url';
import type { StorybookConfig } from '@storybook/react-vite';
import { getCodeEditorStaticDirs } from 'storybook-addon-code-editor/getStaticDirs';

const __filename = fileURLToPath(import.meta.url);

const config: StorybookConfig = {
  staticDirs: ['public', ...getCodeEditorStaticDirs(__filename)],
  stories: ['../packages/**/*.stories.@(ts|tsx)'],
  addons: [
    'storybook-addon-code-editor',
    '@storybook/addon-a11y',
    'storybook-dark-mode',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
};

export default config;
