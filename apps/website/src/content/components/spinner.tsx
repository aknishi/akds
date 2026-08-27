import { Spinner } from '@aknishi/akds-reactkit';
import type { ComponentEntry } from './types';

export const spinner: ComponentEntry = {
  slug: 'spinner',
  name: 'Spinner',
  category: 'Feedback & Overlay',
  summary: 'A loading indicator, used inside Button/IconButton loading states or standalone for async content.',
  sourcePath: 'packages/reactkit/src/components/Spinner',
  storybookId: 'reactkit-spinner--docs',
  preview: <Spinner size="lg" />,
  examples: [
    {
      title: 'Sizes',
      render: () => (
        <>
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
        </>
      ),
      code: `<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" />`,
    },
  ],
  accessibilityNotes: [
    'Spinner renders with aria-hidden="true" by convention — the loading state itself should be announced by the containing component (e.g. Button sets aria-busy) rather than the Spinner icon.',
  ],
  props: [
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Controls the size of the spinner.' },
    { name: 'className', type: 'string', description: 'Additional class applied to the root element.' },
  ],
  doDont: [
    { do: 'Pair Spinner with aria-busy on the containing element.', dont: "Don't use Spinner alone as the only indicator of a loading state with no accessible announcement." },
  ],
  related: ['button', 'progress-tracker'],
};
