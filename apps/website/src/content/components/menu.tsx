import { Menu, MenuItem } from '@aknishi/akds-reactkit';
import type { ComponentEntry } from './types';

export const menu: ComponentEntry = {
  slug: 'menu',
  name: 'Menu',
  category: 'Navigation & Disclosure',
  summary: 'A floating list of actions (MenuItem children), positioned relative to a trigger with automatic flip.',
  sourcePath: 'packages/reactkit/src/components/Menu',
  storybookId: 'reactkit-menu--docs',
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
    { name: 'children', type: 'React.ReactNode', description: 'Option (or MenuItem) elements. Required.' },
  ],
  doDont: [
    { do: 'Use Menu for a short list of actions triggered from a button or icon.', dont: "Don't use Menu for navigation between pages — use TopNav/Sidebar links instead." },
  ],
  related: ['dropdown-menu', 'accordion'],
};
