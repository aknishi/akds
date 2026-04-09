import type { Meta } from '@storybook/react-vite';
import { Button } from './Button';
import { LiveEditStory } from '../../utils/LiveEditStory';

const meta: Meta<typeof Button> = {
  title: 'Reactkit/Button',
  component: Button,
  argTypes: {
    appearance: { control: 'select', options: ['solid', 'transparent', 'bordered'] },
    emphasis: { control: 'select', options: ['accented', 'neutral', 'success', 'destructive'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    focusableWhenDisabled: { control: 'boolean' },
  },
};

export default meta;

export const Default = LiveEditStory({
  component: Button,
  code: `import { Button } from '@aknishi/akds-reactkit';

const ButtonExample = () => (
  <Button>Button</Button>
);

export default ButtonExample;
`
})

export const Appearance = LiveEditStory({
  component: Button,
  code: `import { Flexbox, Button } from '@aknishi/akds-reactkit';

const ButtonExample = () => (
  <Flexbox gap="sm" align="center">
    <Button appearance="solid">Solid</Button>
    <Button appearance="transparent">Transparent</Button>
    <Button appearance="bordered">Bordered</Button>
  </Flexbox>
);

export default ButtonExample;
`
})

export const Emphasis = LiveEditStory({
  component: Button,
  code: `import { Flexbox, Button } from '@aknishi/akds-reactkit';

const ButtonExample = () => (
  <Flexbox gap="sm" align="center">
    <Button appearance="solid" emphasis="accented">Accented</Button>
    <Button appearance="solid" emphasis="neutral">Neutral</Button>
    <Button appearance="solid" emphasis="success">Success</Button>
    <Button appearance="solid" emphasis="destructive">Destructive</Button>
  </Flexbox>
);

export default ButtonExample;
`
})

export const Disabled = LiveEditStory({
  component: Button,
  code: `import { Button } from '@aknishi/akds-reactkit';

const ButtonExample = () => <Button disabled>Button</Button>;

export default ButtonExample;
`
})

export const Loading = LiveEditStory({
  component: Button,
  code: `import { Button } from '@aknishi/akds-reactkit';

const ButtonExample = () => <Button loading>Saving</Button>;

export default ButtonExample;
`
})

export const Sizes = LiveEditStory({
  component: Button,
  code: `import { Flexbox, Button } from '@aknishi/akds-reactkit';

const ButtonExample = () => (
  <Flexbox gap="sm" align="center">
    <Button size="sm">Small</Button>
    <Button size="md">Medium</Button>
    <Button size="lg">Large</Button>
  </Flexbox>
);

export default ButtonExample;
`
})
