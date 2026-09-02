export interface NavLinkItem {
  label: string;
  to: string;
}

export interface NavParentItem {
  label: string;
  children: NavLinkItem[];
}

export type NavItem = NavLinkItem | NavParentItem;

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export function isNavParentItem(item: NavItem): item is NavParentItem {
  return 'children' in item;
}

export const navConfig: NavGroup[] = [
  {
    label: 'Getting Started',
    items: [{ label: 'Getting Started', to: '/getting-started' }],
  },
  {
    label: 'Foundations',
    items: [
      {
        label: 'Tokens',
        children: [
          { label: 'Token Architecture', to: '/tokens' },
          { label: 'All Tokens', to: '/tokens/all' },
        ],
      },
      { label: 'Icons', to: '/icons' },
      { label: 'Design Guidelines', to: '/guidelines/design' },
      { label: 'Accessibility Guidelines', to: '/guidelines/accessibility' },
    ],
  },
  {
    label: 'Packages',
    items: [{ label: 'Packages', to: '/packages' }],
  },
];
