import { join, dirname, resolve } from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import type { StorybookConfig } from '@storybook/react-vite';
import { getCodeEditorStaticDirs } from 'storybook-addon-code-editor/getStaticDirs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

function getAbsolutepath(value: string) {
  return dirname(require.resolve(join(value, 'package.json')));
}

const config: StorybookConfig = {
  staticDirs: ['public', ...getCodeEditorStaticDirs(__filename)],
  stories: [
    '../packages/**/*.mdx',
    '../packages/**/*.stories.@(ts|tsx)',
  ],
  addons: [
    {
      name: getAbsolutepath('@storybook/addon-docs'),
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            providerImportSource: require.resolve('@storybook/addon-docs/mdx-react-shim'),
          },
        }
      }
    },
    'storybook-addon-code-editor',
    getAbsolutepath('@storybook/addon-a11y'),
    getAbsolutepath('storybook-dark-mode'),
  ],
  framework: {
    name: getAbsolutepath('@storybook/react-vite'),
    options: {},
  },
  core: {
    disableTelemetry: true
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      tsconfigPath: resolve(__dirname, '../packages/reactkit/tsconfig.json'),
      include: [
        'packages/reactkit/src/components/**/*.tsx',
        'packages/icons/src/components/**/*.tsx',
      ],
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => {
        // Drop inherited HTML attributes from the props table — only show component-specific props
        if (prop.parent) {
          return !prop.parent.fileName.includes('node_modules');
        }
        return true;
      },
    },
  }
};

export default config;
