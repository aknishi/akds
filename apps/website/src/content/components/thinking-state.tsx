import { ThinkingState, Text } from '@aknishi/akds-reactkit';
import type { ComponentEntry } from './types';

export const thinkingState: ComponentEntry = {
  slug: 'thinking-state',
  name: 'Thinking state',
  category: 'AI',
  summary: 'Indicates that an AI is reasoning before producing a response, with an optional expandable reasoning trace.',
  sourcePath: 'packages/reactkit/src/components/ThinkingState',
  storybookId: 'reactkit-ai-thinkingstate--docs',
  preview: <ThinkingState />,
  examples: [
    {
      title: 'Default',
      render: () => (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
          <ThinkingState />
        </div>
      ),
      code: `<ThinkingState />`,
    },
    {
      title: 'Custom label',
      render: () => (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
          <ThinkingState label="Reasoning through your request" />
        </div>
      ),
      code: `<ThinkingState label="Reasoning through your request" />`,
    },
    {
      title: 'Cycling labels',
      description: 'Pass labels instead of label to automatically cycle through a sequence of statuses — each change wipes left to right like a terminal cursor overwriting the previous text.',
      render: () => (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
          <ThinkingState
            labels={[
              'Thinking',
              'Analyzing your request',
              'Considering available options',
              'Finding relevant information',
              'Forming a response',
            ]}
            labelInterval={3000}
          />
        </div>
      ),
      code: `<ThinkingState
  labels={[
    'Thinking',
    'Analyzing your request',
    'Considering available options',
    'Finding relevant information',
    'Forming a response',
  ]}
  labelInterval={3000}
/>`,
    },
    {
      title: 'With reasoning',
      description: 'Passing children turns it into a disclosure the user can expand to reveal the reasoning trace.',
      render: () => (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
          <ThinkingState label="Thought for 4s" active={false} defaultExpanded>
            <Text styleAs="caption">
              The user is asking about the difference between controlled and uncontrolled components, so I should
              explain both patterns with a short example of each.
            </Text>
          </ThinkingState>
        </div>
      ),
      code: `<ThinkingState label="Thought for 4s" active={false} defaultExpanded>
  <Text styleAs="caption">
    The user is asking about the difference between controlled and uncontrolled
    components, so I should explain both patterns with a short example of each.
  </Text>
</ThinkingState>`,
    },
    {
      title: 'Finished',
      description: 'Set active to false once reasoning has finished to hide the loading spinner and stop the shimmer/cycling, while keeping the trace available to expand.',
      render: () => (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
          <ThinkingState label="Thought for 2s" active={false}>
            <Text styleAs="caption">Reasoning trace goes here once expanded.</Text>
          </ThinkingState>
        </div>
      ),
      code: `<ThinkingState label="Thought for 2s" active={false}>
  <Text styleAs="caption">Reasoning trace goes here once expanded.</Text>
</ThinkingState>`,
    },
  ],
  accessibilityNotes: [
    'Without children, renders role="status" with aria-live="polite" so the "thinking" state is announced.',
    'With children, renders as a disclosure: a real <button> with aria-expanded and aria-controls, and the reasoning panel as role="region" labelled by that button.',
    'Respects prefers-reduced-motion — the shimmer, loading spinner, and wipe transitions are all disabled, replaced with a static, clearly-visible state.',
  ],
  props: [
    { name: 'label', type: 'React.ReactNode', default: "'Thinking'", description: 'Text shown next to the loading spinner. Ignored when labels is set.' },
    { name: 'labels', type: 'React.ReactNode[]', description: 'A sequence of labels to cycle through automatically. Advances one step every labelInterval ms while active, and holds on the last item rather than looping back to the first. Overrides label.' },
    { name: 'labelInterval', type: 'number', default: '3000', description: 'Milliseconds between each label in labels.' },
    { name: 'active', type: 'boolean', default: 'true', description: 'When true, plays the loading spinner/shimmer animation and advances labels. Set to false once reasoning has finished.' },
    { name: 'children', type: 'React.ReactNode', description: 'Reasoning content revealed when expanded. Omit to render a non-expandable indicator with no disclosure trigger.' },
    { name: 'expanded', type: 'boolean', description: 'Controls whether the reasoning panel is expanded. Uncontrolled by default.' },
    { name: 'defaultExpanded', type: 'boolean', default: 'false', description: 'Initial expanded state when uncontrolled.' },
    { name: 'onExpandedChange', type: '(expanded: boolean) => void', description: 'Called with the next expanded value when the trigger is clicked.' },
    { name: 'backgroundColor', type: 'string', default: "'var(--akds-color-surface-sunken)'", description: "Background color used behind the wipe transition's cover and post-cursor gap. Override this when the component sits on a backdrop that token doesn't match." },
  ],
  doDont: [
    { do: 'Use active={false} as soon as reasoning finishes, so the loading affordance disappears once it is no longer accurate.', dont: "Don't leave active at its default true after the response has arrived — the spinner and shimmer will keep implying work is still happening." },
  ],
  related: ['generation-loader', 'streaming-text', 'ai-button'],
};
