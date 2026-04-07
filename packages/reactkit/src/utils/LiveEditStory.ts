import { StoryState, makeLiveEditStory } from 'storybook-addon-code-editor';
import React from 'react';
import * as ReactKit from '..';

export interface LiveEditStoryState extends StoryState {
  component?: 
    | typeof React.Component
    | React.FC
    | JSX.Element
    | React.ForwardRefExoticComponent<any>;
}

function LiveEditStory({ component, availableImports, ...rest }: LiveEditStoryState) {
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
        '@akds/reactkit': ReactKit,
        ...availableImports,
      },
  });
  return EditableLiveTSStory;
}

export default LiveEditStory;