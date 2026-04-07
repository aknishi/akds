import type { Meta } from '@storybook/react-vite';
import { MenuItem } from './MenuItem';
import { LiveEditStory } from '../../utils/LiveEditStory';

const meta: Meta<typeof MenuItem> = {
  title: 'Components/MenuItem',
  component: MenuItem,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
  },
};

export default meta;

export const Default = LiveEditStory({
  component: MenuItem,
  code: `import { Menu, MenuItem } from '@aknishi/akds-reactkit';

const MenuItemExample = () => (
  <Menu open>
    <MenuItem>Menu item</MenuItem>
  </Menu>
);

export default MenuItemExample;
`,
});

export const WithTrailingElement = LiveEditStory({
  component: MenuItem,
  code: `import { Menu, MenuItem } from '@aknishi/akds-reactkit';

const MenuItemExample = () => (
  <Menu open>
    <MenuItem trailingElement={<span>⌘X</span>}>Cut</MenuItem>
    <MenuItem trailingElement={<span>⌘C</span>}>Copy</MenuItem>
    <MenuItem trailingElement={<span>⌘V</span>}>Paste</MenuItem>
  </Menu>
);

export default MenuItemExample;
`,
});

export const Disabled = LiveEditStory({
  component: MenuItem,
  code: `import { Menu, MenuItem } from '@aknishi/akds-reactkit';

const MenuItemExample = () => (
  <Menu open>
    <MenuItem>Enabled item</MenuItem>
    <MenuItem disabled>Disabled item</MenuItem>
  </Menu>
);

export default MenuItemExample;
`,
});
