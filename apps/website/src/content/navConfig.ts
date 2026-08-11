export interface NavLinkItem {
  label: string;
  to: string;
}

export interface NavGroup {
  label: string;
  items: NavLinkItem[];
}

export const navConfig: NavGroup[] = [
  {
    label: 'Getting Started',
    items: [{ label: 'Getting Started', to: '/getting-started' }],
  },
  {
    label: 'Foundations',
    items: [
      { label: 'Token Architecture', to: '/tokens' },
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
