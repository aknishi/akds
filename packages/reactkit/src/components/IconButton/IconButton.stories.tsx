import type { Meta } from '@storybook/react-vite';
import { IconButton } from './IconButton';
import { LiveEditStory } from '../../utils/LiveEditStory';

const meta: Meta<typeof IconButton> = {
  title: 'Reactkit/IconButton',
  component: IconButton,
  argTypes: {
    appearance: { control: 'select', options: ['solid', 'transparent', 'bordered'] },
    emphasis: { control: 'select', options: ['accented', 'neutral', 'success', 'destructive'] },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    focusableWhenDisabled: { control: 'boolean' },
  },
};

export default meta;

export const Default = LiveEditStory({
  component: IconButton,
  code: `import { IconButton } from '@aknishi/akds-reactkit';
import { CloseIcon } from '@aknishi/akds-icons';

const IconButtonExample = () => (
  <IconButton aria-label="Close">
    <CloseIcon />
  </IconButton>
);

export default IconButtonExample;
`
})

export const Appearance = LiveEditStory({
  component: IconButton,
  code: `import { Flexbox, IconButton } from '@aknishi/akds-reactkit';
import { EditIcon } from '@aknishi/akds-icons';

const IconButtonExample = () => (
  <Flexbox gap="sm" align="center">
    <IconButton appearance="solid" aria-label="Edit">
      <EditIcon />
    </IconButton>
    <IconButton appearance="transparent" aria-label="Edit">
      <EditIcon />
    </IconButton>
    <IconButton appearance="bordered" aria-label="Edit">
      <EditIcon />
    </IconButton>
  </Flexbox>
);

export default IconButtonExample;
`
})

export const Emphasis = LiveEditStory({
  component: IconButton,
  code: `import { Flexbox, IconButton } from '@aknishi/akds-reactkit';
import { DeleteIcon } from '@aknishi/akds-icons';

const IconButtonExample = () => (
  <Flexbox gap="sm" align="center">
    <IconButton appearance="solid" emphasis="accented" aria-label="Delete">
      <DeleteIcon />
    </IconButton>
    <IconButton appearance="solid" emphasis="neutral" aria-label="Delete">
      <DeleteIcon />
    </IconButton>
    <IconButton appearance="solid" emphasis="success" aria-label="Delete">
      <DeleteIcon />
    </IconButton>
    <IconButton appearance="solid" emphasis="destructive" aria-label="Delete">
      <DeleteIcon />
    </IconButton>
  </Flexbox>
);

export default IconButtonExample;
`
})

export const Disabled = LiveEditStory({
  component: IconButton,
  code: `import { IconButton } from '@aknishi/akds-reactkit';
import { SettingsIcon } from '@aknishi/akds-icons';

const IconButtonExample = () => (
  <IconButton disabled aria-label="Settings">
    <SettingsIcon />
  </IconButton>
);

export default IconButtonExample;
`
})

export const Loading = LiveEditStory({
  component: IconButton,
  code: `import { IconButton } from '@aknishi/akds-reactkit';
import { SaveIcon } from '@aknishi/akds-icons';

const IconButtonExample = () => (
  <IconButton loading aria-label="Saving">
    <SaveIcon />
  </IconButton>
);

export default IconButtonExample;
`
})
