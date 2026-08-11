import type React from 'react';

export type ComponentCategory =
  | 'Inputs'
  | 'Actions'
  | 'Layout'
  | 'Navigation & Disclosure'
  | 'Feedback & Overlay'
  | 'Data Display & Content'
  | 'System'
  | 'Primitives';

export const CATEGORY_ORDER: ComponentCategory[] = [
  'Inputs',
  'Actions',
  'Layout',
  'Navigation & Disclosure',
  'Feedback & Overlay',
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
  isPrimitive?: boolean;
  sourcePath: string;
  examples: ComponentExample[];
  accessibilityNotes: string[];
  props: PropRow[];
  doDont?: DoDontPair[];
  related?: string[];
}
