import React from 'react';
import { Button, Flexbox, Menu, MenuItem } from '@aknishi/akds-reactkit';
import { BlockIcon, RedoIcon, UndoIcon } from '@aknishi/akds-icons';
import type { ComponentEntry } from './types';

function AnchoredMenuExample() {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  return (
    <div style={{ minHeight: '160px' }}>
      <Button ref={triggerRef} appearance="bordered" emphasis="neutral" onClick={() => setOpen((o) => !o)}>
        Open menu
      </Button>
      <Menu open={open} onOpenChange={setOpen} triggerRef={triggerRef}>
        <MenuItem>Cut</MenuItem>
        <MenuItem>Copy</MenuItem>
        <MenuItem>Paste</MenuItem>
        <MenuItem disabled>Delete</MenuItem>
      </Menu>
    </div>
  );
}

function MenuPlacementExample() {
  const [openTopLeft, setOpenTopLeft] = React.useState(false);
  const [openTopRight, setOpenTopRight] = React.useState(false);
  const [openBottomLeft, setOpenBottomLeft] = React.useState(false);
  const [openBottomRight, setOpenBottomRight] = React.useState(false);
  const topLeftRef = React.useRef<HTMLButtonElement>(null);
  const topRightRef = React.useRef<HTMLButtonElement>(null);
  const bottomLeftRef = React.useRef<HTMLButtonElement>(null);
  const bottomRightRef = React.useRef<HTMLButtonElement>(null);

  return (
    <Flexbox direction="column" gap="lg" style={{ minHeight: '220px' }}>
      <Flexbox gap="lg">
        <Button
          ref={bottomLeftRef}
          appearance="bordered"
          emphasis="neutral"
          onClick={() => setOpenBottomLeft((o) => !o)}
        >
          bottom-left
        </Button>
        <Button
          ref={bottomRightRef}
          appearance="bordered"
          emphasis="neutral"
          onClick={() => setOpenBottomRight((o) => !o)}
        >
          bottom-right
        </Button>
      </Flexbox>
      <Flexbox gap="lg">
        <Button ref={topLeftRef} appearance="bordered" emphasis="neutral" onClick={() => setOpenTopLeft((o) => !o)}>
          top-left
        </Button>
        <Button
          ref={topRightRef}
          appearance="bordered"
          emphasis="neutral"
          onClick={() => setOpenTopRight((o) => !o)}
        >
          top-right
        </Button>
      </Flexbox>

      <Menu open={openBottomLeft} onOpenChange={setOpenBottomLeft} triggerRef={bottomLeftRef} placement="bottom-left">
        <MenuItem>Cut</MenuItem>
        <MenuItem>Copy</MenuItem>
        <MenuItem>Paste</MenuItem>
      </Menu>
      <Menu
        open={openBottomRight}
        onOpenChange={setOpenBottomRight}
        triggerRef={bottomRightRef}
        placement="bottom-right"
      >
        <MenuItem>Cut</MenuItem>
        <MenuItem>Copy</MenuItem>
        <MenuItem>Paste</MenuItem>
      </Menu>
      <Menu open={openTopLeft} onOpenChange={setOpenTopLeft} triggerRef={topLeftRef} placement="top-left">
        <MenuItem>Cut</MenuItem>
        <MenuItem>Copy</MenuItem>
        <MenuItem>Paste</MenuItem>
      </Menu>
      <Menu open={openTopRight} onOpenChange={setOpenTopRight} triggerRef={topRightRef} placement="top-right">
        <MenuItem>Cut</MenuItem>
        <MenuItem>Copy</MenuItem>
        <MenuItem>Paste</MenuItem>
      </Menu>
    </Flexbox>
  );
}

export const menu: ComponentEntry = {
  slug: 'menu',
  name: 'Menu',
  category: 'Navigation & Disclosure',
  summary: 'A floating list of actions (MenuItem children), positioned relative to a trigger with automatic flip.',
  sourcePath: 'packages/reactkit/src/components/Menu',
  storybookId: 'reactkit-menu--docs',
  preview: (
    <Menu open>
      <MenuItem>Cut</MenuItem>
      <MenuItem>Copy</MenuItem>
      <MenuItem>Paste</MenuItem>
    </Menu>
  ),
  examples: [
    {
      title: 'Basic',
      description: 'Rendered open here for documentation — in real usage, open/onOpenChange are wired to a trigger button.',
      render: () => (
        <Menu open>
          <MenuItem>Cut</MenuItem>
          <MenuItem>Copy</MenuItem>
          <MenuItem>Paste</MenuItem>
          <MenuItem disabled>Delete</MenuItem>
        </Menu>
      ),
      code: `<Menu open>
  <MenuItem>Cut</MenuItem>
  <MenuItem>Copy</MenuItem>
  <MenuItem>Paste</MenuItem>
  <MenuItem disabled>Delete</MenuItem>
</Menu>`,
    },
    {
      title: 'Anchored',
      description: 'Set triggerRef to a trigger element so the menu renders in a portal, positioned relative to it.',
      render: () => <AnchoredMenuExample />,
      code: `function Example() {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef(null);
  return (
    <>
      <Button ref={triggerRef} appearance="bordered" emphasis="neutral" onClick={() => setOpen(o => !o)}>
        Open menu
      </Button>
      <Menu open={open} onOpenChange={setOpen} triggerRef={triggerRef}>
        <MenuItem>Cut</MenuItem>
        <MenuItem>Copy</MenuItem>
        <MenuItem>Paste</MenuItem>
        <MenuItem disabled>Delete</MenuItem>
      </Menu>
    </>
  );
}`,
    },
    {
      title: 'Placement',
      description: 'placement sets the preferred corner relative to the trigger, flipping automatically when there is not enough space.',
      render: () => <MenuPlacementExample />,
      code: `function Example() {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef(null);
  return (
    <>
      <Button ref={triggerRef} onClick={() => setOpen(o => !o)}>bottom-left</Button>
      <Menu open={open} onOpenChange={setOpen} triggerRef={triggerRef} placement="bottom-left">
        <MenuItem>Cut</MenuItem>
        <MenuItem>Copy</MenuItem>
        <MenuItem>Paste</MenuItem>
      </Menu>
    </>
  );
  // Repeat with placement="bottom-right", "top-left", and "top-right" for the other corners.
}`,
    },
    {
      title: 'With icons',
      render: () => (
        <Menu open style={{ width: '220px' }}>
          <MenuItem trailingElement={<span>⌘Z</span>}>
            <UndoIcon size="sm" /> Undo
          </MenuItem>
          <MenuItem trailingElement={<span>⌘⇧Z</span>}>
            <RedoIcon size="sm" /> Redo
          </MenuItem>
          <MenuItem disabled>
            <BlockIcon size="sm" /> Restricted action
          </MenuItem>
        </Menu>
      ),
      code: `<Menu open style={{ width: '220px' }}>
  <MenuItem trailingElement={<span>⌘Z</span>}>
    <UndoIcon size="sm" /> Undo
  </MenuItem>
  <MenuItem trailingElement={<span>⌘⇧Z</span>}>
    <RedoIcon size="sm" /> Redo
  </MenuItem>
  <MenuItem disabled>
    <BlockIcon size="sm" /> Restricted action
  </MenuItem>
</Menu>`,
    },
  ],
  accessibilityNotes: [
    'Menu renders role="menu" on a <ul>; each MenuItem is role="menuitem" — following the WAI-ARIA Menu pattern.',
    'Arrow keys move focus between items; Escape closes the menu and returns focus to the trigger (when wired up by the consumer).',
    'When triggerRef is provided, the menu renders in a portal with fixed positioning and flips vertically to stay in the viewport.',
  ],
  props: [
    { name: 'open', type: 'boolean', description: 'Whether the menu panel is visible. Always controlled.' },
    { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when the menu requests a change in open state.' },
    { name: 'placement', type: "'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'", default: "'bottom-left'", description: 'Preferred placement relative to the trigger.' },
    { name: 'triggerRef', type: 'React.RefObject<HTMLElement>', description: 'Ref to the trigger element. When set, the menu renders in a portal with fixed positioning.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Prevents interaction and applies disabled styling to a MenuItem.' },
    { name: 'trailingElement', type: 'React.ReactNode', description: 'Element rendered after a MenuItem label, pinned to the right (shortcut hint, badge, etc.).' },
    { name: 'children', type: 'React.ReactNode', description: 'Option (or MenuItem) elements. Required.' },
  ],
  doDont: [
    { do: 'Use Menu for a short list of actions triggered from a button or icon.', dont: "Don't use Menu for navigation between pages — use TopNav/Sidebar links instead." },
  ],
  related: ['dropdown-menu', 'accordion'],
};
