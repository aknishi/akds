import { StoryState, makeLiveEditStory } from 'storybook-addon-code-editor';
import React from 'react';
import * as ReactKit from '..';
import * as AkdsIcons from '@aknishi/akds-icons';

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
      modifyEditor (monaco : any) {
        monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
          noSemanticValidation: true,
        });
        monaco.editor.setTheme('vs-dark');
      },
      ...rest,
      availableImports: {
        'react': React,
        '@aknishi/akds-reactkit': ReactKit,
        '@aknishi/akds-icons': AkdsIcons,
        ...availableImports,
      },
  });
  return EditableLiveTSStory;
}