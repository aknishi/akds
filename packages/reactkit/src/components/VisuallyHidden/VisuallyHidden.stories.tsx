import type { Meta } from '@storybook/react-vite';
import { VisuallyHidden } from './VisuallyHidden';
import { LiveEditStory } from '../../utils/LiveEditStory';

const meta: Meta<typeof VisuallyHidden> = {
  title: 'Reactkit/VisuallyHidden',
  component: VisuallyHidden,
};

export default meta;

export const Default = LiveEditStory({
  component: VisuallyHidden,
  code: `import { VisuallyHidden, Text } from '@aknishi/akds-reactkit';

const Example = () => (
  <Text>
    This sentence is visible.
    <VisuallyHidden> This one is only announced by screen readers.</VisuallyHidden>
  </Text>
);

export default Example;
`,
});

export const UniqueButtonNames = LiveEditStory({
  component: VisuallyHidden,
  code: `import { VisuallyHidden, Button, Flexbox } from '@aknishi/akds-reactkit';

const Example = () => (
  <Flexbox gap="sm">
    <Button size="sm" appearance="bordered">
      Approve<VisuallyHidden> order for Hanako Sato</VisuallyHidden>
    </Button>
    <Button size="sm" appearance="bordered">
      Approve<VisuallyHidden> order for Kenji Ito</VisuallyHidden>
    </Button>
  </Flexbox>
);

export default Example;
`,
});

export const HiddenCheckboxLabel = LiveEditStory({
  component: VisuallyHidden,
  code: `import { VisuallyHidden, Checkbox } from '@aknishi/akds-reactkit';

const Example = () => (
  <Checkbox label={<VisuallyHidden>Select Hanako Sato</VisuallyHidden>} />
);

export default Example;
`,
});
