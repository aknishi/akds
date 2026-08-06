import type { Meta } from '@storybook/react-vite';
import { Accordion } from './Accordion';
import { LiveEditStory } from '../../utils/LiveEditStory';

const meta: Meta<typeof Accordion> = {
  title: 'Reactkit/Accordion',
  component: Accordion,
  argTypes: {
    multiple: { control: 'boolean' },
  },
};

export default meta;

export const Default = LiveEditStory({
  component: Accordion,
  code: `import { Accordion, AccordionItem } from '@aknishi/akds-reactkit';

const Example = () => (
  <Accordion defaultExpanded="item1">
    <AccordionItem value="item1" title="What is akds?">
      <p>akds is a design system built with React and TypeScript.</p>
    </AccordionItem>
    <AccordionItem value="item2" title="How do I install it?">
      <p>Run <code>npm install @aknishi/akds-reactkit</code> in your project.</p>
    </AccordionItem>
    <AccordionItem value="item3" title="Is it accessible?">
      <p>Yes — all components are built with ARIA semantics and keyboard navigation.</p>
    </AccordionItem>
  </Accordion>
);

export default Example;
`,
});

export const Multiple = LiveEditStory({
  component: Accordion,
  code: `import { Accordion, AccordionItem } from '@aknishi/akds-reactkit';

const Example = () => (
  <Accordion multiple defaultExpanded={['item1', 'item2']}>
    <AccordionItem value="item1" title="First section">
      <p>Content for the first section.</p>
    </AccordionItem>
    <AccordionItem value="item2" title="Second section">
      <p>Content for the second section.</p>
    </AccordionItem>
    <AccordionItem value="item3" title="Third section">
      <p>Content for the third section.</p>
    </AccordionItem>
  </Accordion>
);

export default Example;
`,
});

export const Controlled = LiveEditStory({
  component: Accordion,
  code: `import React from 'react';
import { Accordion, AccordionItem } from '@aknishi/akds-reactkit';

const Example = () => {
  const [expanded, setExpanded] = React.useState('');
  return (
    <Accordion expanded={expanded} onChange={(v) => setExpanded(v as string)}>
      <AccordionItem value="a" title="Section A">
        <p>Content A</p>
      </AccordionItem>
      <AccordionItem value="b" title="Section B">
        <p>Content B</p>
      </AccordionItem>
    </Accordion>
  );
};

export default Example;
`,
});

export const WithDisabled = LiveEditStory({
  component: Accordion,
  code: `import { Accordion, AccordionItem } from '@aknishi/akds-reactkit';

const Example = () => (
  <Accordion defaultExpanded="item1">
    <AccordionItem value="item1" title="Enabled item">
      <p>This item can be toggled.</p>
    </AccordionItem>
    <AccordionItem value="item2" title="Disabled item" disabled>
      <p>This item cannot be toggled.</p>
    </AccordionItem>
  </Accordion>
);

export default Example;
`,
});
