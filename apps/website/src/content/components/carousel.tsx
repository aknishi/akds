import { Carousel, Text } from '@aknishi/akds-reactkit';
import './carousel.css';
import type { ComponentEntry } from './types';

function CarouselSlide({ label }: { label: string }) {
  return (
    <div className="carousel-entry-slide">
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
  examples: [
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
