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
  // Resolve workspace packages to their source, not dist. Otherwise a story can load
  // the same component twice (dist via a package import, src via a relative import or
  // LiveEditStory's availableImports): two stylesheets and two React contexts, and a
  // stale dist wins or loses depending on which stylesheet is injected last.
  async viteFinal(config) {
    const pkg = (name: string, entry = 'src/index.ts') => resolve(__dirname, '../packages', name, entry);
    const aliases = [
      { find: /^@aknishi\/akds-reactkit$/, replacement: pkg('reactkit') },
      { find: /^@aknishi\/akds-icons$/, replacement: pkg('icons') },
      { find: /^@aknishi\/akds-dataview$/, replacement: pkg('dataview') },
      { find: /^@aknishi\/akds-dataview\/headless$/, replacement: pkg('dataview', 'src/headless/index.ts') },
    ];
    const existing = config.resolve?.alias ?? [];
    config.resolve = {
      ...config.resolve,
      alias: Array.isArray(existing)
        ? [...aliases, ...existing]
        : [...aliases, ...Object.entries(existing).map(([find, replacement]) => ({ find, replacement }))],
    };
    return config;
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      tsconfigPath: resolve(__dirname, '../packages/reactkit/tsconfig.json'),
      include: [
        'packages/reactkit/src/components/**/*.tsx',
        'packages/icons/src/components/**/*.tsx',
        'packages/dataview/src/**/*.tsx',
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
