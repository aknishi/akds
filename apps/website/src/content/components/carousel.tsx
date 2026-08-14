import { Button, Card, CardContent, CardFooter, CardHeader, Carousel, Text } from '@aknishi/akds-reactkit';
import './carousel.css';
import type { ComponentEntry } from './types';

function CarouselSlide({ label, fixedWidth }: { label: string; fixedWidth?: boolean }) {
  const className = fixedWidth ? 'carousel-entry-slide carousel-entry-slide--fixed-width' : 'carousel-entry-slide';
  return (
    <div className={className}>
      <Text styleAs="label">{label}</Text>
    </div>
  );
}

export const carousel: ComponentEntry = {
  slug: 'carousel',
  name: 'Carousel',
  category: 'Data Display & Content',
  summary: 'An auto-scrolling, loopable slide container for showcasing a sequence of content.',
  sourcePath: 'packages/reactkit/src/components/Carousel',
  storybookId: 'reactkit-carousel--docs',
  examples: [
    {
      title: 'Default',
      render: () => (
        <Carousel>
          <CarouselSlide label="Slide 1" fixedWidth />
          <CarouselSlide label="Slide 2" fixedWidth />
          <CarouselSlide label="Slide 3" fixedWidth />
          <CarouselSlide label="Slide 4" fixedWidth />
          <CarouselSlide label="Slide 5" fixedWidth />
        </Carousel>
      ),
      code: `<Carousel>
  <Slide style={{ width: 200 }}>Slide 1</Slide>
  <Slide style={{ width: 200 }}>Slide 2</Slide>
  <Slide style={{ width: 200 }}>Slide 3</Slide>
  <Slide style={{ width: 200 }}>Slide 4</Slide>
  <Slide style={{ width: 200 }}>Slide 5</Slide>
</Carousel>`,
    },
    {
      title: 'Slides per page',
      render: () => (
        <Carousel slidesPerPage={3} autoScroll={false}>
          <CarouselSlide label="1" />
          <CarouselSlide label="2" />
          <CarouselSlide label="3" />
          <CarouselSlide label="4" />
          <CarouselSlide label="5" />
          <CarouselSlide label="6" />
        </Carousel>
      ),
      code: `<Carousel slidesPerPage={3} autoScroll={false}>
  <Slide>1</Slide>
  <Slide>2</Slide>
  <Slide>3</Slide>
  <Slide>4</Slide>
  <Slide>5</Slide>
  <Slide>6</Slide>
</Carousel>`,
    },
    {
      title: 'Auto-scroll with loop',
      render: () => (
        <Carousel slidesPerPage={2} loop autoScrollDirection="forward">
          <CarouselSlide label="Slide 1" />
          <CarouselSlide label="Slide 2" />
          <CarouselSlide label="Slide 3" />
          <CarouselSlide label="Slide 4" />
        </Carousel>
      ),
      code: `<Carousel slidesPerPage={2} loop autoScrollDirection="forward">
  <Slide>Slide 1</Slide>
  <Slide>Slide 2</Slide>
  <Slide>Slide 3</Slide>
  <Slide>Slide 4</Slide>
</Carousel>`,
    },
    {
      title: 'Manual scroll',
      render: () => (
        <Carousel autoScroll={false}>
          <CarouselSlide label="Slide 1" fixedWidth />
          <CarouselSlide label="Slide 2" fixedWidth />
          <CarouselSlide label="Slide 3" fixedWidth />
          <CarouselSlide label="Slide 4" fixedWidth />
          <CarouselSlide label="Slide 5" fixedWidth />
        </Carousel>
      ),
      code: `<Carousel autoScroll={false}>
  <Slide style={{ width: 200 }}>Slide 1</Slide>
  <Slide style={{ width: 200 }}>Slide 2</Slide>
  <Slide style={{ width: 200 }}>Slide 3</Slide>
  <Slide style={{ width: 200 }}>Slide 4</Slide>
  <Slide style={{ width: 200 }}>Slide 5</Slide>
</Carousel>`,
    },
    {
      title: 'Interactive content',
      render: () => (
        <Carousel autoScroll={false}>
          <Card className="carousel-entry-card">
            <CardHeader>Card One</CardHeader>
            <CardContent>Interactive content inside carousel slides.</CardContent>
            <CardFooter>
              <Button size="sm" appearance="bordered" emphasis="neutral">
                Learn more
              </Button>
            </CardFooter>
          </Card>
          <Card className="carousel-entry-card">
            <CardHeader>Card Two</CardHeader>
            <CardContent>Each slide can contain any React component.</CardContent>
            <CardFooter>
              <Button size="sm" appearance="bordered" emphasis="neutral">
                Get started
              </Button>
            </CardFooter>
          </Card>
          <Card className="carousel-entry-card">
            <CardHeader>Card Three</CardHeader>
            <CardContent>Buttons and inputs work normally inside slides.</CardContent>
            <CardFooter>
              <Button size="sm" appearance="bordered" emphasis="neutral">
                View details
              </Button>
            </CardFooter>
          </Card>
          <Card className="carousel-entry-card">
            <CardHeader>Card Four</CardHeader>
            <CardContent>Hover the carousel to pause auto-scroll.</CardContent>
            <CardFooter>
              <Button size="sm" appearance="bordered" emphasis="neutral">
                Explore
              </Button>
            </CardFooter>
          </Card>
        </Carousel>
      ),
      code: `<Carousel autoScroll={false}>
  <Card style={{ width: 280 }}>
    <CardHeader>Card One</CardHeader>
    <CardContent>Interactive content inside carousel slides.</CardContent>
    <CardFooter>
      <Button size="sm" appearance="bordered" emphasis="neutral">Learn more</Button>
    </CardFooter>
  </Card>
  <Card style={{ width: 280 }}>
    <CardHeader>Card Two</CardHeader>
    <CardContent>Each slide can contain any React component.</CardContent>
    <CardFooter>
      <Button size="sm" appearance="bordered" emphasis="neutral">Get started</Button>
    </CardFooter>
  </Card>
  <Card style={{ width: 280 }}>
    <CardHeader>Card Three</CardHeader>
    <CardContent>Buttons and inputs work normally inside slides.</CardContent>
    <CardFooter>
      <Button size="sm" appearance="bordered" emphasis="neutral">View details</Button>
    </CardFooter>
  </Card>
  <Card style={{ width: 280 }}>
    <CardHeader>Card Four</CardHeader>
    <CardContent>Hover the carousel to pause auto-scroll.</CardContent>
    <CardFooter>
      <Button size="sm" appearance="bordered" emphasis="neutral">Explore</Button>
    </CardFooter>
  </Card>
</Carousel>`,
    },
  ],
  accessibilityNotes: [
    'Previous/next navigation buttons are real, labeled <button> elements — not decorative divs.',
    'Auto-scroll pauses on hover and keyboard focus, and respects prefers-reduced-motion by disabling automatic movement entirely.',
  ],
  props: [
    { name: 'children', type: 'React.ReactNode', description: 'Each direct child is treated as a slide. Required.' },
    { name: 'slidesPerPage', type: 'number', description: 'Number of slides visible simultaneously. Slides resize to fill the container width.' },
    { name: 'autoScroll', type: 'boolean', default: 'true', description: 'Enables continuous auto-scrolling.' },
    { name: 'autoScrollInterval', type: 'number', default: '3000', description: 'Milliseconds between auto-scroll steps.' },
    { name: 'autoScrollDirection', type: "'forward' | 'backward'", default: "'forward'", description: 'Direction of auto-scroll travel.' },
    { name: 'loop', type: 'boolean', default: 'false', description: 'Wraps from the last slide back to the first for seamless infinite looping.' },
    { name: 'hideButtons', type: 'boolean', default: 'false', description: 'Hides the previous/next navigation buttons (remain in the DOM).' },
  ],
  doDont: [
    { do: 'Use Carousel for a small set of promotional or summary items.', dont: "Don't put critical, non-repeating content only inside a Carousel slide — not all users will scroll through every slide." },
  ],
  related: ['card'],
};
