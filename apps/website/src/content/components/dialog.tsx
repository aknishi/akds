import React from 'react';
import { Button, Dialog, IconButton, Text } from '@aknishi/akds-reactkit';
import { CloseIcon } from '@aknishi/akds-icons';
import type { ComponentEntry } from './types';

function BasicDialogExample() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button appearance="solid" emphasis="accented" onClick={() => setOpen(true)}>
        Open dialog
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Delete item">
        <Text styleAs="body">This action can't be undone. Are you sure you want to continue?</Text>
      </Dialog>
    </>
  );
}

function SizedDialogExample() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button appearance="bordered" emphasis="neutral" onClick={() => setOpen(true)}>
        Open large dialog
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Settings" size="lg">
        <Text styleAs="body">A larger dialog for more complex content.</Text>
      </Dialog>
    </>
  );
}

export const dialog: ComponentEntry = {
  slug: 'dialog',
  name: 'Dialog',
  category: 'Overlay',
  summary: 'A modal dialog for focused tasks and confirmations, rendered above a backdrop.',
  sourcePath: 'packages/reactkit/src/components/Dialog',
  storybookId: 'reactkit-dialog--docs',
  preview: (
    // Dialog only ever renders through a portal to document.body (there's no
    // standalone element to mount inline), so — like Toast's preview — this is
    // a static, non-interactive replica built from the component's own
    // akds-dialog* CSS classes rather than a generic trigger-button preview,
    // so the card shows what a dialog actually looks like. Only the backdrop
    // (not rendered here) is position: fixed — the panel itself is already
    // position: relative, so no position override is needed to sit inline.
    <div className="akds-dialog akds-dialog--sm" style={{ width: '100%', maxWidth: 240 }}>
      <div className="akds-dialog__header">
        <h2 className="akds-dialog__title">Delete item</h2>
        <IconButton
          className="akds-dialog__close"
          appearance="transparent"
          emphasis="neutral"
          aria-label="Close dialog"
        >
          <CloseIcon />
        </IconButton>
      </div>
      <div className="akds-dialog__body">
        <Text styleAs="body">This action can't be undone.</Text>
      </div>
    </div>
  ),
  examples: [
    {
      title: 'Basic',
      render: () => <BasicDialogExample />,
      code: `function Example() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button appearance="solid" emphasis="accented" onClick={() => setOpen(true)}>
        Open dialog
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Delete item">
        <Text styleAs="body">This action can't be undone. Are you sure you want to continue?</Text>
      </Dialog>
    </>
  );
}`,
    },
    {
      title: 'Sizes',
      description: 'sm, md, lg, and full control the maximum width of the dialog panel.',
      render: () => <SizedDialogExample />,
      code: `<Dialog open={open} onClose={() => setOpen(false)} title="Settings" size="lg">
  <Text styleAs="body">A larger dialog for more complex content.</Text>
</Dialog>`,
    },
  ],
  accessibilityNotes: [
    'title is used as the dialog\'s accessible name (aria-label) as well as the visible heading.',
    'Pressing Escape or clicking the backdrop closes the dialog by calling onClose, unless disableBackdropClose is set.',
    'Focus should be managed by the caller: move focus into the dialog on open and return it to the trigger on close for the smoothest keyboard experience.',
  ],
  props: [
    { name: 'open', type: 'boolean', description: 'Controls whether the dialog is visible. Required.' },
    { name: 'onClose', type: '() => void', description: 'Called when the dialog requests to close. Required.' },
    { name: 'title', type: 'React.ReactNode', description: 'Title rendered in the header. Also used as aria-label.' },
    { name: 'size', type: "'sm' | 'md' | 'lg' | 'full'", default: "'md'", description: 'Maximum width of the dialog panel.' },
    { name: 'disableBackdropClose', type: 'boolean', default: 'false', description: 'When true, clicking the backdrop does not close the dialog.' },
    { name: 'children', type: 'React.ReactNode', description: 'Content rendered inside the dialog body. Required.' },
  ],
  doDont: [
    { do: 'Use Dialog for focused, blocking tasks like confirmations.', dont: "Don't stack multiple dialogs — prefer a single flow at a time." },
    { do: 'Keep dialog content concise and scannable.', dont: "Don't use Dialog as a substitute for a full page when content is long." },
  ],
  related: ['drawer', 'button'],
};
