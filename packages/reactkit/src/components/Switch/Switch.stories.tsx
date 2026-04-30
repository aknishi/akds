import type { Meta } from '@storybook/react-vite';
import { Switch } from './Switch';
import { LiveEditStory } from '../../utils/LiveEditStory';

const meta: Meta<typeof Switch> = {
  title: 'Reactkit/Switch',
  component: Switch,
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
  },
};

export default meta;

export const Default = LiveEditStory({
  component: Switch,
  code: `import { Switch } from '@aknishi/akds-reactkit';

const Example = () => <Switch label="Enable notifications" />;

export default Example;
`,
});

export const Sizes = LiveEditStory({
  component: Switch,
  code: `import { Flexbox, Switch } from '@aknishi/akds-reactkit';

const Example = () => (
  <Flexbox direction="column" gap="sm">
    <Switch label="Small" size="sm" />
    <Switch label="Medium" size="md" />
    <Switch label="Large" size="lg" />
  </Flexbox>
);

export default Example;
`,
});

export const States = LiveEditStory({
  component: Switch,
  code: `import { Flexbox, Switch } from '@aknishi/akds-reactkit';

const Example = () => (
  <Flexbox direction="column" gap="sm">
    <Switch label="Off" />
    <Switch label="On" defaultChecked />
    <Switch label="Disabled off" disabled />
    <Switch label="Disabled on" disabled defaultChecked />
  </Flexbox>
);

export default Example;
`,
});

export const Controlled = LiveEditStory({
  component: Switch,
  code: `import React from 'react';
import { Switch } from '@aknishi/akds-reactkit';

const Example = () => {
  const [enabled, setEnabled] = React.useState(false);
  return (
    <Switch
      label={enabled ? 'Dark mode on' : 'Dark mode off'}
      checked={enabled}
      onChange={e => setEnabled(e.target.checked)}
    />
  );
};

export default Example;
`,
});
