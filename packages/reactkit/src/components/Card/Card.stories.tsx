import type { Meta } from '@storybook/react';
import { Card } from './Card';
import { LiveEditStory } from '../../utils/LiveEditStory';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    borderless: { control: 'boolean' },
  },
};

export default meta;

export const Default = LiveEditStory({
  component: Card,
  code: `import { Card, CardHeader, CardContent, CardFooter, Text, Button } from '@aknishi/akds-reactkit';

const CardExample = () => (
  <Card style={{ width: 360 }}>
    <CardHeader>
      <Text styleAs="h6">Card title</Text>
    </CardHeader>
    <CardContent>
      <Text styleAs="body">This is the main body content of the card.</Text>
    </CardContent>
    <CardFooter>
      <Button appearance="solid" sentiment="accented">Confirm</Button>
      <Button appearance="bordered" sentiment="neutral">Cancel</Button>
    </CardFooter>
  </Card>
);

export default CardExample;
`,
});

export const Borderless = LiveEditStory({
  component: Card,
  code: `import { Card, CardHeader, CardContent, CardFooter, Text, Button } from '@aknishi/akds-reactkit';

const CardExample = () => (
  <Card borderless style={{ width: 360 }}>
    <CardHeader>
      <Text styleAs="h6">Borderless card</Text>
    </CardHeader>
    <CardContent>
      <Text styleAs="body">No border and no dividers — clean and minimal.</Text>
    </CardContent>
    <CardFooter>
      <Button appearance="transparent" sentiment="accented">Learn more</Button>
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
