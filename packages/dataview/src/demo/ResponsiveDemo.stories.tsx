import type { Meta } from '@storybook/react-vite';
import { ResponsiveDemo } from './ResponsiveDemo';
import source from './ResponsiveDemo.tsx?raw';
import { LiveEditStory, exampleCode } from './LiveEditStory';

const meta: Meta<typeof ResponsiveDemo> = {
  title: 'Dataview/Full responsive demo',
  component: ResponsiveDemo,
};

export default meta;

// The story's name matches the title, so the sidebar shows one entry rather
// than a folder with a single "Default" story in it.
export const Default = Object.assign(LiveEditStory({ code: exampleCode(source, 'ResponsiveDemo') }), {
  name: 'Full responsive demo',
});
