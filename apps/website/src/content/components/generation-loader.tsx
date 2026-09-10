import { Flexbox, GenerationLoader } from '@aknishi/akds-reactkit';
import type { ComponentEntry } from './types';

export const generationLoader: ComponentEntry = {
  slug: 'generation-loader',
  name: 'Generation loader',
  category: 'AI',
  summary: 'A compact loading indicator for AI content generation — three animated dots, with an optional label.',
  sourcePath: 'packages/reactkit/src/components/GenerationLoader',
  storybookId: 'reactkit-ai-generationloader--docs',
  preview: <GenerationLoader label="Generating" />,
  examples: [
    {
      title: 'Default',
      description: 'A dots-only indicator, with a "Generating" accessible name by default.',
      render: () => <GenerationLoader />,
      code: `<GenerationLoader />`,
    },
    {
      title: 'With label',
      render: () => <GenerationLoader label="Generating response" />,
      code: `<GenerationLoader label="Generating response" />`,
    },
    {
      title: 'Sizes',
      render: () => (
        <Flexbox gap="lg" align="center">
          <GenerationLoader size="sm" label="Small" />
          <GenerationLoader size="md" label="Medium" />
          <GenerationLoader size="lg" label="Large" />
        </Flexbox>
      ),
      code: `<Flexbox gap="lg" align="center">
  <GenerationLoader size="sm" label="Small" />
  <GenerationLoader size="md" label="Medium" />
  <GenerationLoader size="lg" label="Large" />
</Flexbox>`,
    },
  ],
  accessibilityNotes: [
    'Renders with role="status" and aria-live="polite" so assistive technology is notified while content is loading.',
    'Falls back to an aria-label of "Generating" when no visible label is set, so it always has an accessible name.',
  ],
  props: [
    { name: 'label', type: 'React.ReactNode', description: 'Text shown alongside the animated dots, e.g. "Generating response". Omit for a dots-only indicator.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Sets the size of the dots and label text.' },
  ],
  doDont: [
    { do: 'Use Generation loader inline, next to or below content that is being generated.', dont: "Don't use it as a full-page loading state — use Spinner for that instead." },
  ],
  related: ['spinner', 'thinking-state', 'streaming-text'],
};
