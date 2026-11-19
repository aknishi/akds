import { makeLiveEditStory } from 'storybook-addon-code-editor';
import React from 'react';
import * as ReactKit from '@aknishi/akds-reactkit';
import * as AkdsIcons from '@aknishi/akds-icons';
import * as ReactVirtual from '@tanstack/react-virtual';
import * as DataView from '../index';
import * as columns from './columns';
import * as data from './data';
import * as api from './api';

/**
 * The same live code editor as reactkit's stories. Each example's imports
 * resolve to these modules by name, so example files run in the editor
 * unchanged, including their relative imports of the demo helpers.
 */
export function LiveEditStory({ code, parameters }: { code: string; parameters?: Record<string, unknown> }) {
  const story = { parameters };
  makeLiveEditStory(story, {
    code,
    modifyEditor(monaco: any) {
      monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: true,
      });
      monaco.editor.setTheme('vs-dark');
    },
    availableImports: {
      react: React,
      '@aknishi/akds-reactkit': ReactKit,
      '@aknishi/akds-icons': AkdsIcons,
      '@aknishi/akds-dataview': DataView,
      '@tanstack/react-virtual': ReactVirtual,
      './columns': columns,
      './data': data,
      './api': api,
    },
  });
  return story;
}

/**
 * Turns an example file (imported with `?raw`) into editor code: imports of
 * the package use its published name, and the example becomes the default
 * export the editor renders. The first import of a shared demo helper gets a
 * comment pointing to where its source is shown, since the editor can't.
 */
export function exampleCode(raw: string, componentName: string) {
  const code = raw
    .replace(/from '(\.\.\/)+index'/g, "from '@aknishi/akds-dataview'")
    .replace(/^import .* from '\.\/[^']+';$/m, (line) => `// Shared demo helpers: see "Example fixtures" on the Dataview/DataView docs page.\n${line}`);
  return `${code.trimEnd()}\n\nexport default ${componentName};\n`;
}
