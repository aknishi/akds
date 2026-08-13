import type { Meta } from '@storybook/react-vite';
import { LikeButton } from './LikeButton';
import { LiveEditStory } from '../../utils/LiveEditStory';

const meta: Meta<typeof LikeButton> = {
  title: 'Reactkit/Buttons/LikeButton',
  component: LikeButton,
  argTypes: {
    disabled: { control: 'boolean' },
    focusableWhenDisabled: { control: 'boolean' },
  },
};

export default meta;

export const Default = LiveEditStory({
  component: LikeButton,
  code: `import { LikeButton } from '@aknishi/akds-reactkit';

const LikeButtonExample = () => (
  <LikeButton />
);

export default LikeButtonExample;
`
})

export const Controlled = LiveEditStory({
  component: LikeButton,
  code: `import { LikeButton } from '@aknishi/akds-reactkit';

const LikeButtonExample = () => {
  const [isLiked, setIsLiked] = React.useState(true);

  return (
    <LikeButton liked={isLiked} onClick={() => { setIsLiked(!isLiked) }}/>
  );
};

export default LikeButtonExample;
`
})

export const Disabled = LiveEditStory({
  component: LikeButton,
  code: `import { LikeButton } from '@aknishi/akds-reactkit';

const LikeButtonExample = () => (
  <LikeButton disabled={true} focusableWhenDisabled={true} />
);

export default LikeButtonExample;
`
})