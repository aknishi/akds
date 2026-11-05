import type { Meta } from '@storybook/react-vite';
import { StatesDefault } from './StatesDefault';
import defaultSource from './StatesDefault.tsx?raw';
import customSource from './StatesCustom.tsx?raw';
import { LiveEditStory, exampleCode } from './LiveEditStory';

const meta: Meta<typeof StatesDefault> = {
  title: 'Dataview/In-Progress/Loading, Error, and Empty States',
  component: StatesDefault,
};

export default meta;

export const DefaultStates = LiveEditStory({ code: exampleCode(defaultSource, 'StatesDefault') });

export const CustomStates = LiveEditStory({ code: exampleCode(customSource, 'StatesCustom') });
