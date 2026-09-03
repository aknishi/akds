import { IconButton } from '@aknishi/akds-reactkit';
import { DeleteIcon, EditIcon, SettingsIcon } from '@aknishi/akds-icons';
import type { ComponentEntry } from './types';

export const iconButton: ComponentEntry = {
  slug: 'icon-button',
  name: 'Icon button',
  category: 'Actions',
  summary: 'An icon-only button — same appearance/emphasis system as Button, but requires an aria-label.',
  sourcePath: 'packages/reactkit/src/components/IconButton',
  storybookId: 'reactkit-buttons-iconbutton--docs',
  preview: (
    <IconButton appearance="solid" emphasis="accented" aria-label="Settings">
      <SettingsIcon />
    </IconButton>
  ),
  examples: [
    {
      title: 'Appearances',
      render: () => (
        <>
          <IconButton appearance="solid" emphasis="accented" aria-label="Settings">
            <SettingsIcon />
          </IconButton>
          <IconButton appearance="bordered" emphasis="neutral" aria-label="Edit">
            <EditIcon />
          </IconButton>
          <IconButton appearance="transparent" emphasis="destructive" aria-label="Delete">
            <DeleteIcon />
          </IconButton>
        </>
      ),
      code: `<IconButton appearance="solid" emphasis="accented" aria-label="Settings">
  <SettingsIcon />
</IconButton>
<IconButton appearance="bordered" emphasis="neutral" aria-label="Edit">
  <EditIcon />
</IconButton>
<IconButton appearance="transparent" emphasis="destructive" aria-label="Delete">
  <DeleteIcon />
</IconButton>`,
    },
  ],
  accessibilityNotes: [
    "aria-label is a required prop, not optional — TypeScript enforces it at compile time, since the button has no visible text for screen readers to announce.",
    'Supports the same focusableWhenDisabled pattern as Button (aria-disabled instead of the native disabled attribute).',
  ],
  props: [
    { name: 'appearance', type: "'solid' | 'transparent' | 'bordered'", default: "'solid'", description: 'Visual style of the button.' },
    { name: 'emphasis', type: "'accented' | 'neutral' | 'success' | 'destructive'", default: "'neutral'", description: 'Conveys the intent of the action.' },
    { name: 'loading', type: 'boolean', default: 'false', description: 'Replaces the icon with a Spinner and disables interaction.' },
    { name: 'focusableWhenDisabled', type: 'boolean', default: 'false', description: 'Keeps a disabled button focusable via aria-disabled.' },
    { name: "aria-label", type: 'string', description: "Accessible label describing the button's action. Required." },
    { name: 'children', type: 'React.ReactNode', description: 'A single icon rendered inside the button. Required.' },
  ],
  doDont: [
    { do: 'Always write a specific aria-label ("Delete comment", not "Delete").', dont: "Don't reuse a generic label across icon buttons with different actions on the same page." },
  ],
  related: ['button', 'tooltip'],
};
