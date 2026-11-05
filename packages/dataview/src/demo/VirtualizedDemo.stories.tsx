import type { Meta } from '@storybook/react-vite';
import { VirtualizedDemo } from './VirtualizedDemo';
import source from './VirtualizedDemo.tsx?raw';
import { LiveEditStory, exampleCode } from './LiveEditStory';

const meta: Meta<typeof VirtualizedDemo> = {
  title: 'Dataview/In-Progress/Virtualized Demo',
  component: VirtualizedDemo,
};

export default meta;

export const Default = LiveEditStory({ code: exampleCode(source, 'VirtualizedDemo') });
