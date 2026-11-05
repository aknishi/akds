import type { Meta } from '@storybook/react-vite';
import { TableViewOptions } from './TableViewOptions';
import source from './TableViewOptions.tsx?raw';
import { LiveEditStory, exampleCode } from './LiveEditStory';

const meta: Meta<typeof TableViewOptions> = {
  title: 'Dataview/Table View Options',
  component: TableViewOptions,
};

export default meta;

export const Default = LiveEditStory({ code: exampleCode(source, 'TableViewOptions') });
