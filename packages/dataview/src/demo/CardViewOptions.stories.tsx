import type { Meta } from '@storybook/react-vite';
import { CardViewOptions } from './CardViewOptions';
import source from './CardViewOptions.tsx?raw';
import { LiveEditStory, exampleCode } from './LiveEditStory';

const meta: Meta<typeof CardViewOptions> = {
  title: 'Dataview/Card View',
  component: CardViewOptions,
};

export default meta;

export const Default = LiveEditStory({ code: exampleCode(source, 'CardViewOptions') });
