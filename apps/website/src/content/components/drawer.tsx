import React from 'react';
import { Button, Drawer, Flexbox, IconButton, Text } from '@aknishi/akds-reactkit';
import type { DrawerSide } from '@aknishi/akds-reactkit';
import { CloseIcon } from '@aknishi/akds-icons';
import type { ComponentEntry } from './types';

function DrawerExample() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button appearance="bordered" emphasis="neutral" onClick={() => setOpen(true)}>
        Open drawer
      </Button>
      <Drawer open={open} onClose={() => setOpen(false)} side="right" title="Filters">
        <Text styleAs="body">Drawer content, e.g. a filter form.</Text>
      </Drawer>
    </>
  );
}

function DrawerSidesExample() {
  // side and open are separate state, for the same reason as Dialog's Sizes
  // example: keeping them separate avoids the drawer's side snapping back to
  // a default value while it's mid-close animation.
  const [side, setSide] = React.useState<DrawerSide>('right');
  const [open, setOpen] = React.useState(false);

  const openFromSide = (nextSide: DrawerSide) => {
    setSide(nextSide);
    setOpen(true);
  };

  return (
    <>
      <Flexbox gap="sm">
        <Button appearance="bordered" emphasis="neutral" onClick={() => openFromSide('left')}>
          Left
        </Button>
        <Button appearance="bordered" emphasis="neutral" onClick={() => openFromSide('right')}>
          Right
        </Button>
        <Button appearance="bordered" emphasis="neutral" onClick={() => openFromSide('top')}>
          Top
        </Button>
        <Button appearance="bordered" emphasis="neutral" onClick={() => openFromSide('bottom')}>
          Bottom
        </Button>
      </Flexbox>
      <Drawer open={open} onClose={() => setOpen(false)} title="Drawer" side={side}>
        <Text styleAs="body">Sliding in from the {side}.</Text>
      </Drawer>
    </>
  );
}

export const drawer: ComponentEntry = {
  slug: 'drawer',
  name: 'Drawer',
  category: 'Overlay',
  summary: 'A panel that slides in from an edge of the screen — used for filters, navigation, and secondary content.',
  sourcePath: 'packages/reactkit/src/components/Drawer',
  storybookId: 'reactkit-drawer--docs',
  preview: (
    // Drawer only ever renders through a portal to document.body (there's no
    // standalone element to mount inline), so — like Toast's preview — this is
    // a static, non-interactive replica built from the component's own
    // akds-drawer* CSS classes rather than a generic trigger-button preview,
    // so the card shows what a drawer actually looks like. The real panel is
    // position: fixed and pinned to a viewport edge, so that's neutralized
    // here to let it sit inline in the card instead.
    <div
      className="akds-drawer akds-drawer--right akds-drawer--sm"
      style={{ position: 'static', width: '100%', maxWidth: 220 }}
    >
      <div className="akds-drawer__header">
        <h2 className="akds-drawer__title">Filters</h2>
        <IconButton
          className="akds-drawer__close"
          appearance="transparent"
          emphasis="neutral"
          aria-label="Close drawer"
        >
          <CloseIcon />
        </IconButton>
      </div>
      <div className="akds-drawer__body">
        <Text styleAs="body">Drawer content, e.g. a filter form.</Text>
      </div>
    </div>
  ),
  examples: [
    {
      title: 'Basic',
      render: () => <DrawerExample />,
      code: `function Example() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button appearance="bordered" emphasis="neutral" onClick={() => setOpen(true)}>
        Open drawer
      </Button>
      <Drawer open={open} onClose={() => setOpen(false)} side="right" title="Filters">
        <Text styleAs="body">Drawer content, e.g. a filter form.</Text>
      </Drawer>
    </>
  );
}`,
    },
    {
      title: 'Sides',
      description: 'side controls which edge of the viewport the drawer slides in from.',
      render: () => <DrawerSidesExample />,
      code: `function Example() {
  const [side, setSide] = React.useState('right');
  const [open, setOpen] = React.useState(false);

  const openFromSide = (nextSide) => {
    setSide(nextSide);
    setOpen(true);
  };

  return (
    <>
      <Flexbox gap="sm">
        <Button appearance="bordered" emphasis="neutral" onClick={() => openFromSide('left')}>Left</Button>
        <Button appearance="bordered" emphasis="neutral" onClick={() => openFromSide('right')}>Right</Button>
        <Button appearance="bordered" emphasis="neutral" onClick={() => openFromSide('top')}>Top</Button>
        <Button appearance="bordered" emphasis="neutral" onClick={() => openFromSide('bottom')}>Bottom</Button>
      </Flexbox>
      <Drawer open={open} onClose={() => setOpen(false)} title="Drawer" side={side}>
        <Text styleAs="body">Sliding in from the {side}.</Text>
      </Drawer>
    </>
  );
}`,
    },
  ],
  accessibilityNotes: [
    'title doubles as the drawer\'s accessible name (aria-label) and its visible heading.',
    'Escape and backdrop click close the drawer via onClose, unless disableBackdropClose is set.',
    'This site\'s own mobile navigation uses Drawer (side="left") to present the same sidebar content on small viewports.',
  ],
  props: [
    { name: 'open', type: 'boolean', description: 'Controls whether the drawer is visible. Required.' },
    { name: 'onClose', type: '() => void', description: 'Called when the drawer requests to close. Required.' },
    { name: 'side', type: "'left' | 'right' | 'top' | 'bottom'", default: "'left'", description: 'The side from which the drawer slides in.' },
    { name: 'size', type: "'sm' | 'md' | 'lg' | 'full'", default: "'md'", description: 'Width (left/right) or height (top/bottom) of the panel.' },
    { name: 'title', type: 'React.ReactNode', description: 'Title rendered in the drawer header. Also used as aria-label.' },
    { name: 'disableBackdropClose', type: 'boolean', default: 'false', description: 'When true, clicking the backdrop does not close the drawer.' },
    { name: 'children', type: 'React.ReactNode', description: 'Content rendered inside the drawer body. Required.' },
  ],
  doDont: [
    { do: 'Use Drawer for secondary content that relates to the current page (filters, details).', dont: "Don't use Drawer for a primary, blocking confirmation — use Dialog instead." },
  ],
  related: ['dialog'],
};
