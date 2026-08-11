import { Flexbox, Tag } from '@aknishi/akds-reactkit';
import type { ComponentEntry } from './types';

export const flexbox: ComponentEntry = {
  slug: 'flexbox',
  name: 'Flexbox',
  category: 'Layout',
  summary: 'A flex-container layout primitive with design-token-aware gap, padding, and margin shorthand props.',
  sourcePath: 'packages/reactkit/src/components/Flexbox',
  examples: [
    {
      title: 'Gap & wrap',
      render: () => (
        <Flexbox gap="sm" wrap>
          <Tag>One</Tag>
          <Tag>Two</Tag>
          <Tag>Three</Tag>
        </Flexbox>
      ),
      code: `<Flexbox gap="sm" wrap>
  <Tag>One</Tag>
  <Tag>Two</Tag>
  <Tag>Three</Tag>
</Flexbox>`,
    },
    {
      title: 'Direction & alignment',
      render: () => (
        <Flexbox direction="column" align="flex-start" gap="xs">
          <Tag variant="info">Row 1</Tag>
          <Tag variant="info">Row 2</Tag>
        </Flexbox>
      ),
      code: `<Flexbox direction="column" align="flex-start" gap="xs">
  <Tag variant="info">Row 1</Tag>
  <Tag variant="info">Row 2</Tag>
</Flexbox>`,
    },
  ],
  accessibilityNotes: [
    'Flexbox is a layout-only primitive — it renders a plain <div> by default (as is polymorphic) and carries no semantics of its own.',
    'When the children form a meaningful group (e.g. a toolbar), use as to render a semantic element like nav or set an appropriate role.',
  ],
  props: [
    { name: 'gap', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | string", description: 'Maps to gap. Accepts a spacing token or any CSS length.' },
    { name: 'direction', type: 'CSSProperties["flexDirection"]', description: 'Maps to flex-direction.' },
    { name: 'justify', type: 'CSSProperties["justifyContent"]', description: 'Maps to justify-content.' },
    { name: 'align', type: 'CSSProperties["alignItems"]', description: 'Maps to align-items.' },
    { name: 'wrap', type: 'boolean', default: 'false', description: 'Sets flex-wrap: wrap when true.' },
    { name: 'padding / px / py / pt / pr / pb / pl', type: "'xs'-'2xl' | string", description: 'Padding shorthand props, each accepting a spacing token or CSS value.' },
    { name: 'margin / mx / my / mt / mr / mb / ml', type: "'xs'-'2xl' | string", description: 'Margin shorthand props, each accepting a spacing token or CSS value.' },
    { name: 'as', type: 'React.ElementType', default: "'div'", description: 'The HTML element to render as.' },
  ],
  doDont: [
    { do: 'Use the token shorthand props (gap="md") over inline style for spacing.', dont: "Don't reach for CSS Grid needs here — Flexbox only wraps flex layout, not grid." },
  ],
  related: ['card', 'divider'],
};
