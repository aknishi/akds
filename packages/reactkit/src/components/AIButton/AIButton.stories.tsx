import type { Meta } from '@storybook/react-vite';
import { AIButton } from './AIButton';
import { LiveEditStory } from '../../utils/LiveEditStory';

const meta: Meta<typeof AIButton> = {
  title: 'Reactkit/Buttons/AIButton',
  component: AIButton,
  argTypes: {
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    loadingLabel: { control: 'text' },
    focusableWhenDisabled: { control: 'boolean' },
  },
};

export default meta;

export const Default = LiveEditStory({
  component: AIButton,
  code: `import { AIButton } from '@aknishi/akds-reactkit';

const AIButtonExample = () => (
  <AIButton>Generate</AIButton>
);

export default AIButtonExample;
`
})

export const Disabled = LiveEditStory({
  component: AIButton,
  code: `import { AIButton } from '@aknishi/akds-reactkit';

const AIButtonExample = () => <AIButton disabled>Generate</AIButton>;

export default AIButtonExample;
`
})

export const Loading = LiveEditStory({
  component: AIButton,
  code: `import { AIButton } from '@aknishi/akds-reactkit';

const AIButtonExample = () => <AIButton loading>Generate</AIButton>;

export default AIButtonExample;
`
})

export const Controlled = LiveEditStory({
  component: AIButton,
  code: `import React from 'react';
import { AIButton } from '@aknishi/akds-reactkit';

const AIButtonExample = () => {
  const [loading, setLoading] = React.useState(false);

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 4000);
  };

  return (
    <AIButton loading={loading} onClick={handleClick}>
      Generate
    </AIButton>
  );
};

export default AIButtonExample;
`
})
