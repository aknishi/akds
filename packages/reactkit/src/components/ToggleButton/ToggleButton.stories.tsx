import type { Meta } from '@storybook/react-vite';
import { ToggleButton } from './ToggleButton';
import { LiveEditStory } from '../../utils/LiveEditStory';

const meta: Meta<typeof ToggleButton> = {
  title: 'Reactkit/Toggle/ToggleButton',
  component: ToggleButton,
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    color: { control: 'select', options: ['primary', 'success', 'error', 'neutral'] },
    pressed: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;

export const Default = LiveEditStory({
  component: ToggleButton,
  code: `import { ToggleButton } from '@aknishi/akds-reactkit';

const Example = () => <ToggleButton>Bold</ToggleButton>;

export default Example;
`,
});

export const Pressed = LiveEditStory({
  component: ToggleButton,
  code: `import React from 'react';
import { Flexbox, ToggleButton } from '@aknishi/akds-reactkit';

const Example = () => {
  const [bold, setBold] = React.useState(false);
  const [italic, setItalic] = React.useState(true);
  return (
    <Flexbox gap="sm" align="center">
      <ToggleButton pressed={bold} onPressedChange={setBold}>Bold</ToggleButton>
      <ToggleButton pressed={italic} onPressedChange={setItalic}>Italic</ToggleButton>
    </Flexbox>
  );
};

export default Example;
`,
});

export const Sizes = LiveEditStory({
  component: ToggleButton,
  code: `import { Flexbox, ToggleButton } from '@aknishi/akds-reactkit';

const Example = () => (
  <Flexbox gap="sm" align="center">
    <ToggleButton size="sm" defaultPressed>Small</ToggleButton>
    <ToggleButton size="md" defaultPressed>Medium</ToggleButton>
    <ToggleButton size="lg" defaultPressed>Large</ToggleButton>
  </Flexbox>
);

export default Example;
`,
});

export const Colors = LiveEditStory({
  component: ToggleButton,
  code: `import { Flexbox, ToggleButton } from '@aknishi/akds-reactkit';

const Example = () => (
  <Flexbox gap="sm" align="center">
    <ToggleButton color="neutral" defaultPressed>Neutral</ToggleButton>
    <ToggleButton color="primary" defaultPressed>Primary</ToggleButton>
    <ToggleButton color="success" defaultPressed>Success</ToggleButton>
    <ToggleButton color="error" defaultPressed>Error</ToggleButton>
  </Flexbox>
);

export default Example;
`,
});

export const Disabled = LiveEditStory({
  component: ToggleButton,
  code: `import { Flexbox, ToggleButton } from '@aknishi/akds-reactkit';

const Example = () => (
  <Flexbox gap="sm" align="center">
    <ToggleButton disabled>Bold</ToggleButton>
    <ToggleButton disabled defaultPressed>Italic</ToggleButton>
  </Flexbox>
);

export default Example;
`,
});
