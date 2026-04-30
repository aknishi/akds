import type { Meta } from '@storybook/react-vite';
import { Divider } from './Divider';
import { LiveEditStory } from '../../utils/LiveEditStory';

const meta: Meta<typeof Divider> = {
  title: 'Reactkit/Divider',
  component: Divider,
  argTypes: {
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    variant: { control: 'select', options: ['solid', 'dashed', 'dotted'] },
  },
};

export default meta;

export const Default = LiveEditStory({
  component: Divider,
  code: `import { Divider } from '@aknishi/akds-reactkit';

const Example = () => (
  <div style={{ padding: '16px 0' }}>
    <Divider />
  </div>
);

export default Example;
`,
});

export const Variants = LiveEditStory({
  component: Divider,
  code: `import { Flexbox, Divider } from '@aknishi/akds-reactkit';

const Example = () => (
  <Flexbox direction="column" gap="md">
    <Divider variant="solid" />
    <Divider variant="dashed" />
    <Divider variant="dotted" />
  </Flexbox>
);

export default Example;
`,
});

export const Labeled = LiveEditStory({
  component: Divider,
  code: `import { Flexbox, Divider } from '@aknishi/akds-reactkit';

const Example = () => (
  <Flexbox direction="column" gap="md">
    <Divider label="or" />
    <Divider label="Section title" variant="dashed" />
  </Flexbox>
);

export default Example;
`,
});

export const Vertical = LiveEditStory({
  component: Divider,
  code: `import { Divider } from '@aknishi/akds-reactkit';

const Example = () => (
  <div style={{ paddingLeft: '60px', height: '300px', display: 'flex', gap: '24px'}}>
    <Divider variant="solid" orientation="vertical"/>
    <Divider variant="dashed" orientation="vertical"/>
    <Divider variant="dotted" orientation="vertical"/>
  </div>
);

export default Example;
`,
});
