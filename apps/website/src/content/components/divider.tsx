import { Divider } from '@aknishi/akds-reactkit';
import type { ComponentEntry } from './types';

export const divider: ComponentEntry = {
  slug: 'divider',
  name: 'Divider',
  category: 'Layout',
  summary: 'A horizontal or vertical rule, with an optional centered text label.',
  sourcePath: 'packages/reactkit/src/components/Divider',
  storybookId: 'reactkit-divider--docs',
  examples: [
    {
      title: 'Variants',
      render: () => (
        <>
          <Divider variant="solid" />
          <Divider variant="dashed" />
          <Divider variant="dotted" />
        </>
      ),
      code: `<Divider variant="solid" />
<Divider variant="dashed" />
<Divider variant="dotted" />`,
    },
    {
      title: 'With label',
      render: () => <Divider label="OR" />,
      code: `<Divider label="OR" />`,
    },
  ],
  accessibilityNotes: [
    'Renders a native <hr> element, which carries an implicit separator role recognized by assistive technology.',
    'When label is set, the text is still visually and programmatically associated with the rule.',
  ],
  props: [
    { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'The orientation of the divider.' },
    { name: 'variant', type: "'solid' | 'dashed' | 'dotted'", default: "'solid'", description: 'The line style of the divider.' },
    { name: 'label', type: 'React.ReactNode', description: 'When provided, renders a text label centred on the divider.' },
  ],
  doDont: [
    { do: 'Use Divider to separate distinct sections of related content.', dont: "Don't use Divider as a substitute for spacing — use Flexbox's gap/padding props for whitespace." },
  ],
  related: ['card', 'flexbox'],
};
