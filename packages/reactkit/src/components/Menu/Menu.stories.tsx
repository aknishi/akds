import type { Meta } from '@storybook/react';
import { Menu } from './Menu';
import { LiveEditStory } from '../../utils/LiveEditStory';

const meta: Meta<typeof Menu> = {
  title: 'Components/Menu',
  component: Menu,
  tags: ['autodocs'],
  argTypes: {
    open: { control: 'boolean' },
  },
};

export default meta;

export const Default = LiveEditStory({
  component: Menu,
  code: `import { Menu, MenuItem } from '@aknishi/akds-reactkit';

const MenuExample = () => (
  <Menu open>
    <MenuItem trailingElement={<span>⌘X</span>}>Cut</MenuItem>
    <MenuItem trailingElement={<span>⌘C</span>}>Copy</MenuItem>
    <MenuItem trailingElement={<span>⌘V</span>}>Paste</MenuItem>
    <MenuItem disabled>Delete</MenuItem>
  </Menu>
);

export default MenuExample;
`,
});

export const WithIcons = LiveEditStory({
  component: Menu,
  code: `import { Menu, MenuItem } from '@aknishi/akds-reactkit';

const MenuExample = () => (
  <Menu open>
    <MenuItem trailingElement={<span>⌘Z</span>}>↩ Undo</MenuItem>
    <MenuItem trailingElement={<span>⌘⇧Z</span>}>↪ Redo</MenuItem>
    <MenuItem disabled>🚫 Restricted action</MenuItem>
  </Menu>
);

export default MenuExample;
`,
});
