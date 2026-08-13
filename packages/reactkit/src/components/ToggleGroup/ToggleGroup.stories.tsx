import type { Meta } from '@storybook/react-vite';
import { ToggleGroup } from './ToggleGroup';
import { ToggleButton } from '../ToggleButton';
import { LiveEditStory } from '../../utils/LiveEditStory';

const meta: Meta<typeof ToggleGroup> = {
  title: 'Reactkit/Toggle/ToggleGroup',
  component: ToggleGroup,
  subcomponents: { ToggleButton },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
  },
};

export default meta;

export const Default = LiveEditStory({
  component: ToggleGroup,
  code: `import { ToggleGroup, ToggleButton } from '@aknishi/akds-reactkit';

const Example = () => (
  <ToggleGroup defaultValue="drinks">
    <ToggleButton value="drinks">Drinks</ToggleButton>
    <ToggleButton value="food">Food</ToggleButton>
  </ToggleGroup>
);

export default Example;
`,
});

export const Controlled = LiveEditStory({
  component: ToggleGroup,
  code: `import React from 'react';
import { ToggleGroup, ToggleButton } from '@aknishi/akds-reactkit';

const Example = () => {
  const [value, setValue] = React.useState('day');
  return (
    <ToggleGroup value={value} onChange={setValue}>
      <ToggleButton value="day">Day</ToggleButton>
      <ToggleButton value="week">Week</ToggleButton>
      <ToggleButton value="month">Month</ToggleButton>
    </ToggleGroup>
  );
};

export default Example;
`,
});

export const Sizes = LiveEditStory({
  component: ToggleGroup,
  code: `import { Flexbox, ToggleGroup, ToggleButton } from '@aknishi/akds-reactkit';

const Example = () => (
  <Flexbox direction="column" gap="md" align="start">
    <ToggleGroup size="sm" defaultValue="list">
      <ToggleButton value="list">List</ToggleButton>
      <ToggleButton value="grid">Grid</ToggleButton>
    </ToggleGroup>
    <ToggleGroup size="md" defaultValue="list">
      <ToggleButton value="list">List</ToggleButton>
      <ToggleButton value="grid">Grid</ToggleButton>
    </ToggleGroup>
    <ToggleGroup size="lg" defaultValue="list">
      <ToggleButton value="list">List</ToggleButton>
      <ToggleButton value="grid">Grid</ToggleButton>
    </ToggleGroup>
  </Flexbox>
);

export default Example;
`,
});

export const WithDisabledOption = LiveEditStory({
  component: ToggleGroup,
  code: `import { ToggleGroup, ToggleButton } from '@aknishi/akds-reactkit';
import { LocalBarIcon, LunchDiningIcon, IceCreamIcon } from '@aknishi/akds-icons';

const Example = () => (
  <ToggleGroup defaultValue="drinks">
    <ToggleButton value="drinks"><LocalBarIcon />Drinks</ToggleButton>
    <ToggleButton value="food"><LunchDiningIcon />Food</ToggleButton>
    <ToggleButton value="dessert" disabled><IceCreamIcon />Dessert</ToggleButton>
  </ToggleGroup>
);

export default Example;
`,
});

export const Disabled = LiveEditStory({
  component: ToggleGroup,
  code: `import { ToggleGroup, ToggleButton } from '@aknishi/akds-reactkit';
import { LocalBarIcon, LunchDiningIcon } from '@aknishi/akds-icons';

const Example = () => (
  <ToggleGroup defaultValue="drinks" disabled>
    <ToggleButton value="drinks"><LocalBarIcon />Drinks</ToggleButton>
    <ToggleButton value="food"><LunchDiningIcon />Food</ToggleButton>
  </ToggleGroup>
);

export default Example;
`,
});
