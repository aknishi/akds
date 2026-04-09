import { StoryState, makeLiveEditStory } from 'storybook-addon-code-editor';
import React from 'react';
import * as IconsKit from '.';
import * as Reactkit from '@aknishi/akds-reactkit';

export interface LiveEditStoryState extends StoryState {
  component?:
    | typeof React.Component
    | React.FC<any>
    | JSX.Element
    | React.ForwardRefExoticComponent<any>;
}

export function LiveEditStory({ component, availableImports, ...rest }: LiveEditStoryState) {
  const EditableLiveTSStory = {};
  makeLiveEditStory(EditableLiveTSStory, {
    modifyEditor(monaco: any) {
      monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: true,
      });
      monaco.editor.setTheme('vs-dark');
    },
    ...rest,
    availableImports: {
      'react': React,
      '@aknishi/akds-icons': IconsKit,
      '@aknishi/akds-reactkit': Reactkit,
      ...availableImports,
    },
  });
  return EditableLiveTSStory;
}
