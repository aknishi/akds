import type React from 'react';

export type ComponentCategory =
  | 'AI'
  | 'Inputs'
  | 'Actions'
  | 'Layout'
  | 'Navigation & Disclosure'
  | 'Feedback'
  | 'Overlay'
  | 'Data Display & Content'
  | 'System'
  | 'Primitives';

export const CATEGORY_ORDER: ComponentCategory[] = [
  'AI',
  'Inputs',
  'Actions',
  'Layout',
  'Navigation & Disclosure',
  'Feedback',
  'Overlay',
  'Data Display & Content',
  'System',
  'Primitives',
];

export interface PropRow {
  name: string;
  type: string;
  default?: string;
  description: string;
}

export interface ComponentExample {
  title: string;
  description?: string;
  render: () => React.ReactNode;
  code: string;
}

export interface DoDontPair {
  do: string;
  dont: string;
}

export interface ComponentEntry {
  slug: string;
  name: string;
  category: ComponentCategory;
  summary: string;
  /** Small, non-interactive visual shown in the component's index/landing card. */
  preview: React.ReactNode;
  /** Reduces the index/landing card's preview padding — for a preview whose content needs the extra width more than the card's usual breathing room. */
  compactPreview?: boolean;
  isPrimitive?: boolean;
  sourcePath: string;
  storybookId: string;
  examples: ComponentExample[];
  accessibilityNotes: string[];
  props: PropRow[];
  doDont?: DoDontPair[];
  related?: string[];
}
