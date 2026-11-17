import type { Meta } from '@storybook/react-vite';
import { ServerSideDemo } from './ServerSideDemo';
import source from './ServerSideDemo.tsx?raw';
import { LiveEditStory, exampleCode } from './LiveEditStory';

const meta: Meta<typeof ServerSideDemo> = {
  title: 'Dataview/Server-side data',
  component: ServerSideDemo,
};

export default meta;

// The story's name matches the title, so the sidebar shows one entry rather
// than a folder with a single "Default" story in it.
export const Default = Object.assign(LiveEditStory({ code: exampleCode(source, 'ServerSideDemo') }), {
  name: 'Server-side data',
});
