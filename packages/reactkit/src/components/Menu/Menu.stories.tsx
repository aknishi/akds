import type { Meta } from '@storybook/react-vite';
import { Menu } from './Menu';
import { MenuItem } from '../MenuItem';
import { LiveEditStory } from '../../utils/LiveEditStory';

const meta: Meta<typeof Menu> = {
  title: 'Reactkit/Menu',
  component: Menu,
  subcomponents: { MenuItem },
  argTypes: {
    open: { control: 'boolean' },
  },
};

export default meta;

export const Default = LiveEditStory({
  component: Menu,
  code: `import { Menu, MenuItem } from '@aknishi/akds-reactkit';

const MenuExample = () => (
  <Menu open style={{width: "200px"}}>
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
    <div style={{height: "200px"}}>
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
    </div>
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
  const [open1, setOpen1] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [open3, setOpen3] = React.useState(false);
  const [open4, setOpen4] = React.useState(false);
  const triggerRef1 = React.useRef(null);
  const triggerRef2 = React.useRef(null);
  const triggerRef3 = React.useRef(null);
  const triggerRef4 = React.useRef(null);

  return (
    <div>
      <Flexbox direction="column" justify="space-between" align="start" style={{height: "500px"}}>
        <Flexbox direction="row" justify="space-between" style={{width: '100%'}}>
          <Button ref={triggerRef1} onClick={() => setOpen1(o => !o)}>
            bottom-left
          </Button>
          <Button ref={triggerRef2} onClick={() => setOpen2(o => !o)}>
            bottom-right
          </Button>
        </Flexbox>
        <Flexbox direction="row" justify="space-between" style={{width: '100%'}}>
          <Button ref={triggerRef3} onClick={() => setOpen3(o => !o)}>
            top-left
          </Button>
          <Button ref={triggerRef4} onClick={() => setOpen4(o => !o)}>
            top-right
          </Button>
        </Flexbox>
      </Flexbox>

      <Menu open={open1} onOpenChange={setOpen1} triggerRef={triggerRef1} placement="bottom-left">
        <MenuItem>Cut</MenuItem>
        <MenuItem>Copy</MenuItem>
        <MenuItem>Paste</MenuItem>
        <MenuItem disabled>Delete</MenuItem>
      </Menu>

      <Menu open={open2} onOpenChange={setOpen2} triggerRef={triggerRef2} placement="bottom-right">
        <MenuItem>Cut</MenuItem>
        <MenuItem>Copy</MenuItem>
        <MenuItem>Paste</MenuItem>
        <MenuItem disabled>Delete</MenuItem>
      </Menu>

      <Menu open={open3} onOpenChange={setOpen3} triggerRef={triggerRef3} placement="top-left">
        <MenuItem>Cut</MenuItem>
        <MenuItem>Copy</MenuItem>
        <MenuItem>Paste</MenuItem>
        <MenuItem disabled>Delete</MenuItem>
      </Menu>

      <Menu open={open4} onOpenChange={setOpen4} triggerRef={triggerRef4} placement="top-right">
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

const MenuExample = () => {

  const UndoIcon = () => <span aria-hidden style={{height:"16px", width:"16px"}}>↩</span>;
  const RedoIcon = () => <span aria-hidden style={{height:"16px", width:"16px"}}>↪</span>;
  const RestrictedIcon = () => <span aria-hidden>🚫</span>;

  return (
    <Menu open style={{width: "200px"}}>
      <MenuItem trailingElement={<span>⌘Z</span>}><UndoIcon/> Undo</MenuItem>
      <MenuItem trailingElement={<span>⌘⇧Z</span>}><RedoIcon /> Redo</MenuItem>
      <MenuItem disabled><RestrictedIcon /> Restricted action</MenuItem>
    </Menu>
  )
};

export default MenuExample;
`,
});
