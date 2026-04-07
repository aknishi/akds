import type { Meta } from '@storybook/react';
import { Button } from './Button';
import { LiveEditStory } from '../../utils/LiveEditStory';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    appearance: { control: 'select', options: ['solid', 'transparent', 'bordered'] },
    sentiment: { control: 'select', options: ['accented', 'neutral', 'success', 'destructive'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    focusableWhenDisabled: { control: 'boolean' },
  },
};

export default meta;

export const Default = LiveEditStory({
  component: Button,
  code: `import { Button } from '@akds/reactkit';
    
const ButtonExample = () => (
  <Button>Button</Button>
);

export default ButtonExample;
`
})

export const Appearance = LiveEditStory({
  component: Button,
  code: `import { Button } from '@akds/reactkit';
    
const ButtonExample = () => (
  <div>
    <Button appearance="solid">Solid</Button>
    <Button appearance="transparent">Transparent</Button>
    <Button appearance="bordered">Bordered</Button>
  </div>
);

export default ButtonExample;
`
})

export const Sentiment = LiveEditStory({
  component: Button,
  code: `import { Button } from '@akds/reactkit';
    
const ButtonExample = () => (
  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
    <Button appearance="solid" sentiment="accented">Accented</Button>
    <Button appearance="solid" sentiment="neutral">Neutral</Button>
    <Button appearance="solid" sentiment="success">Success</Button>
    <Button appearance="solid" sentiment="destructive">Destructive</Button>
  </div>
);

export default ButtonExample;
`
})

export const Disabled = LiveEditStory({
  component: Button,
  code: `import { Button } from '@akds/reactkit';

const ButtonExample = () => <Button disabled>Button</Button>;

export default ButtonExample;
`
})

export const Loading = LiveEditStory({
  component: Button,
  code: `import { Button } from '@akds/reactkit';

const ButtonExample = () => <Button loading>Saving</Button>;

export default ButtonExample;
`
})

export const Sizes = LiveEditStory({
  component: Button,
  code: `import { Button } from '@akds/reactkit';

const ButtonExample = () => (
  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
    <Button size="sm">Small</Button>
    <Button size="md">Medium</Button>
    <Button size="lg">Large</Button>
  </div>
);

export default ButtonExample;
`
})

