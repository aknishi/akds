import type { Meta } from '@storybook/react-vite';
import { Avatar } from './Avatar';
import { LiveEditStory } from '../../utils/LiveEditStory';

const meta: Meta<typeof Avatar> = {
  title: 'Reactkit/Avatar',
  component: Avatar,
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg', 'xl'] },
    color: { control: 'select', options: ['blue', 'green', 'purple', 'orange', 'red'] },
  },
};

export default meta;

export const Image = LiveEditStory({
  component: Avatar,
  code: `import { Avatar } from '@aknishi/akds-reactkit';

const Example = () => (
  <Avatar src="https://i.pravatar.cc/150?img=3" alt="Jane Smith" />
);

export default Example;
`,
});

export const Initials = LiveEditStory({
  component: Avatar,
  code: `import { Flexbox, Avatar } from '@aknishi/akds-reactkit';

const Example = () => (
  <Flexbox gap="sm" align="center">
    <Avatar name="Adrian Kawanishi" />
    <Avatar name="Jane Smith" />
    <Avatar name="Carlos Rivera" />
    <Avatar name="Priya Patel" />
    <Avatar name="Marcus Johnson" />
  </Flexbox>
);

export default Example;
`,
});

export const Icon = LiveEditStory({
  component: Avatar,
  code: `import { Avatar } from '@aknishi/akds-reactkit';
import { ApartmentIcon } from '@aknishi/akds-icons';

const Example = () => <Avatar icon={<ApartmentIcon />} aria-label="Apartment" />;

export default Example;
`,
});

export const FallbackIcon = LiveEditStory({
  component: Avatar,
  code: `import { Avatar } from '@aknishi/akds-reactkit';

const Example = () => <Avatar aria-label="Unknown user" />;

export default Example;
`,
});

export const Sizes = LiveEditStory({
  component: Avatar,
  code: `import { Flexbox, Avatar } from '@aknishi/akds-reactkit';

const Example = () => (
  <Flexbox gap="sm" align="center">
    <Avatar name="Adrian Kawanishi" size="sm" />
    <Avatar name="Adrian Kawanishi" size="md" />
    <Avatar name="Adrian Kawanishi" size="lg" />
    <Avatar name="Adrian Kawanishi" size="xl" />
  </Flexbox>
);

export default Example;
`,
});

export const Colors = LiveEditStory({
  component: Avatar,
  code: `import { Flexbox, Avatar } from '@aknishi/akds-reactkit';

const Example = () => (
  <Flexbox gap="sm" align="center">
    <Avatar name="Blue" color="blue" />
    <Avatar name="Green" color="green" />
    <Avatar name="Purple" color="purple" />
    <Avatar name="Orange" color="orange" />
    <Avatar name="Red" color="red" />
  </Flexbox>
);

export default Example;
`,
});
