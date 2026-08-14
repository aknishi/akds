import type { Meta } from '@storybook/react-vite';
import { Carousel } from './Carousel';
import { LiveEditStory } from '../../utils/LiveEditStory';

const meta: Meta<typeof Carousel> = {
  title: 'Reactkit/Carousel',
  component: Carousel,
  argTypes: {
    slidesPerPage: { control: 'number' },
    autoScroll: { control: 'boolean' },
    autoScrollInterval: { control: 'number' },
    autoScrollDirection: { control: 'select', options: ['forward', 'backward'] },
    loop: { control: 'boolean' },
    hideButtons: { control: 'boolean' },
  },
};

export default meta;

export const Default = LiveEditStory({
  component: Carousel,
  code: `import { Carousel, Text } from '@aknishi/akds-reactkit';

const slide = (label) => (
  <div style={{ height: 200, width: 320, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--akds-color-background-secondary-default)', borderRadius: 'var(--akds-radius-lg)' }}>
    <Text styleAs="label">{label}</Text>
  </div>
);

const Example = () => (
  <Carousel>
    {slide('Slide 1')}
    {slide('Slide 2')}
    {slide('Slide 3')}
    {slide('Slide 4')}
    {slide('Slide 5')}
  </Carousel>
);

export default Example;
`,
});

export const SlidesPerPage = LiveEditStory({
  component: Carousel,
  code: `import { Carousel, Text } from '@aknishi/akds-reactkit';

const slide = (label) => (
  <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--akds-color-background-secondary-default)', borderRadius: 'var(--akds-radius-lg)' }}>
    <Text styleAs="label">{label}</Text>
  </div>
);

const Example = () => (
  <Carousel slidesPerPage={3} autoScroll={false}>
    {slide('1')}
    {slide('2')}
    {slide('3')}
    {slide('4')}
    {slide('5')}
    {slide('6')}
  </Carousel>
);

export default Example;
`,
});

export const Loop = LiveEditStory({
  component: Carousel,
  code: `import { Carousel, Text } from '@aknishi/akds-reactkit';

const slide = (label) => (
  <div style={{ height: 200, width: 320, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--akds-color-background-secondary-default)', borderRadius: 'var(--akds-radius-lg)' }}>
    <Text styleAs="label">{label}</Text>
  </div>
);

const Example = () => (
  <Carousel loop autoScrollInterval={2000}>
    {slide('Slide 1')}
    {slide('Slide 2')}
    {slide('Slide 3')}
    {slide('Slide 4')}
  </Carousel>
);

export default Example;
`,
});

export const ManualScroll = LiveEditStory({
  component: Carousel,
  code: `import { Carousel, Text } from '@aknishi/akds-reactkit';

const slide = (label) => (
  <div style={{ height: 200, width: 320, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--akds-color-background-secondary-default)', borderRadius: 'var(--akds-radius-lg)' }}>
    <Text styleAs="label">{label}</Text>
  </div>
);

const Example = () => (
  <Carousel autoScroll={false}>
    {slide('Slide 1')}
    {slide('Slide 2')}
    {slide('Slide 3')}
    {slide('Slide 4')}
    {slide('Slide 5')}
  </Carousel>
);

export default Example;
`,
});

export const InteractiveContent = LiveEditStory({
  component: Carousel,
  code: `import { Carousel, Card, CardHeader, CardContent, CardFooter, Button } from '@aknishi/akds-reactkit';

const Example = () => (
  <Carousel autoScroll={false}>
    <Card style={{ width: 280, height: 200 }}>
      <CardHeader>Card One</CardHeader>
      <CardContent>Interactive content inside carousel slides.</CardContent>
      <CardFooter><Button size="sm" appearance="bordered" emphasis="neutral">Learn more</Button></CardFooter>
    </Card>
    <Card style={{ width: 280, height: 200 }}>
      <CardHeader>Card Two</CardHeader>
      <CardContent>Each slide can contain any React component.</CardContent>
      <CardFooter><Button size="sm" appearance="bordered" emphasis="neutral">Get started</Button></CardFooter>
    </Card>
    <Card style={{ width: 280, height: 200 }}>
      <CardHeader>Card Three</CardHeader>
      <CardContent>Buttons and inputs work normally inside slides.</CardContent>
      <CardFooter><Button size="sm" appearance="bordered" emphasis="neutral">View details</Button></CardFooter>
    </Card>
    <Card style={{ width: 280, height: 200 }}>
      <CardHeader>Card Four</CardHeader>
      <CardContent>Hover the carousel to pause auto-scroll.</CardContent>
      <CardFooter><Button size="sm" appearance="bordered" emphasis="neutral">Explore</Button></CardFooter>
    </Card>
  </Carousel>
);

export default Example;
`,
});
