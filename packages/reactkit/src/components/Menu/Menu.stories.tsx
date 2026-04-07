import type { Meta } from '@storybook/react-vite';
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

export const Anchored = LiveEditStory({
  component: Menu,
  code: `import React from 'react';
import { Menu, MenuItem, Button } from '@aknishi/akds-reactkit';

const MenuExample = () => {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef(null);

  return (
    <>
      <Button ref={triggerRef} onClick={() => setOpen(o => !o)}>
        Open menu
      </Button>
      <Menu
        open={open}
        onOpenChange={setOpen}
        triggerRef={triggerRef}
      >
        <MenuItem>Cut</MenuItem>
        <MenuItem>Copy</MenuItem>
        <MenuItem>Paste</MenuItem>
        <MenuItem disabled>Delete</MenuItem>
      </Menu>
    </>
  );
};

export default MenuExample;
`,
});

export const Placement = LiveEditStory({
  component: Menu,
  code: `import React from 'react';
import { Menu, MenuItem, Button, Flexbox } from '@aknishi/akds-reactkit';

const MenuExample = () => {
  const [open, setOpen] = React.useState(false);
  const triggerRef1 = React.useRef(null);
  const triggerRef2 = React.useRef(null);
  const triggerRef3 = React.useRef(null);
  const triggerRef4 = React.useRef(null);

  return (
    <div>
      <Flexbox direction="column" justify="space-between" align="start" style={{height: "calc(100vh - 64px)"}}>
        <Flexbox direction="row" justify="space-between" style={{width: '100%'}}>
          <Button ref={triggerRef1}>
            bottom-left
          </Button>
          <Button ref={triggerRef2}>
            bottom-right
          </Button>
        </Flexbox>
        <Flexbox direction="row" justify="space-between"  style={{width: '100%'}}>
          <Button ref={triggerRef3}>
            top-left
          </Button>
          <Button ref={triggerRef4}>
            top-right
          </Button>
        </Flexbox>
      </Flexbox>

      <Menu
        open
        onOpenChange={setOpen}
        triggerRef={triggerRef1}
        placement="bottom-left"
      >
        <MenuItem>Cut</MenuItem>
        <MenuItem>Copy</MenuItem>
        <MenuItem>Paste</MenuItem>
        <MenuItem disabled>Delete</MenuItem>
      </Menu>
      
      <Menu
        open
        onOpenChange={setOpen}
        triggerRef={triggerRef2}
        placement="bottom-right"
      >
        <MenuItem>Cut</MenuItem>
        <MenuItem>Copy</MenuItem>
        <MenuItem>Paste</MenuItem>
        <MenuItem disabled>Delete</MenuItem>
      </Menu>

      <Menu
        open
        onOpenChange={setOpen}
        triggerRef={triggerRef3}
        placement="top-left"
      >
        <MenuItem>Cut</MenuItem>
        <MenuItem>Copy</MenuItem>
        <MenuItem>Paste</MenuItem>
        <MenuItem disabled>Delete</MenuItem>
      </Menu>
      
      <Menu
        open
        onOpenChange={setOpen}
        triggerRef={triggerRef4}
        placement="top-right"
      >
        <MenuItem>Cut</MenuItem>
        <MenuItem>Copy</MenuItem>
        <MenuItem>Paste</MenuItem>
        <MenuItem disabled>Delete</MenuItem>
      </Menu>
      
    </div>
  );
};

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
