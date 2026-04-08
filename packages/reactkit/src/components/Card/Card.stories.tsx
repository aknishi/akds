import type { Meta } from '@storybook/react-vite';
import { Card } from './Card';
import { CardHeader } from '../CardHeader';
import { CardContent } from '../CardContent';
import { CardFooter } from '../CardFooter';
import { LiveEditStory } from '../../utils/LiveEditStory';

const meta: Meta<typeof Card> = {
  title: 'Core/Card',
  component: Card,
  subcomponents: { CardHeader, CardContent, CardFooter },
  argTypes: {
    borderless: { control: 'boolean' },
  },
};

export default meta;

export const Default = LiveEditStory({
  component: Card,
  code: `import { Card, CardHeader, CardContent, CardFooter, Text, Button, Flexbox } from '@aknishi/akds-reactkit';

const CardExample = () => (
  <Card style={{ width: 360 }}>
    <CardHeader>
      Card Title
    </CardHeader>
    <CardContent>
      <Text styleAs="body">
        This is the main body content of the card. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </Text>
    </CardContent>
    <CardFooter>
      <Flexbox justify="flex-end" gap={'sm'} style={{ width: '100%' }}>
        <Button appearance="bordered" emphasis="neutral">Cancel</Button>
        <Button appearance="solid" emphasis="accented">Confirm</Button>
      </Flexbox>
    </CardFooter>
  </Card>
);

export default CardExample;
`,
});

export const Borderless = LiveEditStory({
  component: Card,
  code: `import { Card, CardHeader, CardContent, CardFooter, Text, Button, Flexbox } from '@aknishi/akds-reactkit';

const CardExample = () => (
  <Card borderless style={{ width: 360 }}>
    <CardHeader>
      Borderless card
    </CardHeader>
    <CardContent>
      <Text styleAs="body">No border and no dividers — clean and minimal.</Text>
    </CardContent>
    <CardFooter>
      <Flexbox justify="flex-end" gap={'sm'} style={{ width: '100%' }}>
        <Button appearance="transparent" emphasis="accented">Learn more</Button>
      </Flexbox>
    </CardFooter>
  </Card>
);

export default CardExample;
`,
});

export const ContentOnly = LiveEditStory({
  component: Card,
  code: `import { Card, CardContent, Text } from '@aknishi/akds-reactkit';

const CardExample = () => (
  <Card style={{ width: 360 }}>
    <CardContent>
      <Text styleAs="body">A card with only content — header and footer are optional.</Text>
    </CardContent>
  </Card>
);

export default CardExample;
`,
});
