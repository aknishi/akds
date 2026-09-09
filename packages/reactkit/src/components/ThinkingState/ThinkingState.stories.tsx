import type { Meta } from '@storybook/react-vite';
import { ThinkingState } from './ThinkingState';
import { LiveEditStory } from '../../utils/LiveEditStory';

const meta: Meta<typeof ThinkingState> = {
  title: 'Reactkit/AI/ThinkingState',
  component: ThinkingState,
  argTypes: {
    label: { control: 'text' },
    labelInterval: { control: 'number' },
    active: { control: 'boolean' },
    expanded: { control: 'boolean' },
    defaultExpanded: { control: 'boolean' },
    backgroundColor: { control: 'color' },
  },
};

export default meta;

export const Default = LiveEditStory({
  component: ThinkingState,
  code: `import { ThinkingState } from '@aknishi/akds-reactkit';

const Example = () => <ThinkingState />;

export default Example;
`,
});

export const CustomLabel = LiveEditStory({
  component: ThinkingState,
  code: `import { ThinkingState } from '@aknishi/akds-reactkit';

const Example = () => <ThinkingState label="Reasoning through your request" />;

export default Example;
`,
});

export const WithReasoning = LiveEditStory({
  component: ThinkingState,
  code: `import { ThinkingState, Text } from '@aknishi/akds-reactkit';

const Example = () => (
  <ThinkingState label="Thought for 4s" active={false} defaultExpanded>
    <Text styleAs="caption">
      The user is asking about the difference between controlled and uncontrolled
      components, so I should explain both patterns with a short example of each.
    </Text>
  </ThinkingState>
);

export default Example;
`,
});

export const CyclingLabels = LiveEditStory({
  component: ThinkingState,
  code: `import { ThinkingState } from '@aknishi/akds-reactkit';

const Example = () => (
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
);

export default Example;
`,
});

export const Finished = LiveEditStory({
  component: ThinkingState,
  code: `import { ThinkingState, Text } from '@aknishi/akds-reactkit';

const Example = () => (
  <ThinkingState label="Thought for 2s" active={false}>
    <Text styleAs="caption">Reasoning trace goes here once expanded.</Text>
  </ThinkingState>
);

export default Example;
`,
});
