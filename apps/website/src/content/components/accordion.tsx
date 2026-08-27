import { Accordion, AccordionItem, Text } from '@aknishi/akds-reactkit';
import type { ComponentEntry } from './types';

export const accordion: ComponentEntry = {
  slug: 'accordion',
  name: 'Accordion',
  category: 'Navigation & Disclosure',
  summary: 'A collapsible group container, composed of AccordionItem children that share expand/collapse state.',
  sourcePath: 'packages/reactkit/src/components/Accordion',
  storybookId: 'reactkit-accordion--docs',
  preview: (
    <Accordion defaultExpanded="shipping">
      <AccordionItem value="shipping" title="Shipping">
        <Text styleAs="caption">Ships in 2 days</Text>
      </AccordionItem>
    </Accordion>
  ),
  examples: [
    {
      title: 'Single expand',
      render: () => (
        <div style={{ minWidth: '300px' }}>
          <Accordion defaultExpanded="shipping">
            <AccordionItem value="shipping" title="Shipping">
              <Text styleAs="body">Orders ship within 2 business days.</Text>
            </AccordionItem>
            <AccordionItem value="returns" title="Returns">
              <Text styleAs="body">Returns are accepted within 30 days.</Text>
            </AccordionItem>
          </Accordion>
        </div>
      ),
      code: `<Accordion defaultExpanded="shipping">
  <AccordionItem value="shipping" title="Shipping">
    <Text styleAs="body">Orders ship within 2 business days.</Text>
  </AccordionItem>
  <AccordionItem value="returns" title="Returns">
    <Text styleAs="body">Returns are accepted within 30 days.</Text>
  </AccordionItem>
</Accordion>`,
    },
    {
      title: 'Multiple expand',
      render: () => (
        <div style={{ minWidth: '300px' }}>
          <Accordion multiple defaultExpanded={['a', 'b']}>
            <AccordionItem value="a" title="Section A">
              <Text styleAs="body">Content A.</Text>
            </AccordionItem>
            <AccordionItem value="b" title="Section B">
              <Text styleAs="body">Content B.</Text>
            </AccordionItem>
          </Accordion>
        </div>
      ),
      code: `<Accordion multiple defaultExpanded={['a', 'b']}>
  <AccordionItem value="a" title="Section A">...</AccordionItem>
  <AccordionItem value="b" title="Section B">...</AccordionItem>
</Accordion>`,
    },
  ],
  accessibilityNotes: [
    'Each AccordionItem trigger is a real <button> with aria-expanded reflecting its state, following the WAI-ARIA Accordion pattern.',
    'Panel content is only removed from the accessibility tree (not just visually hidden) when collapsed, so screen reader users don\'t tab into hidden content.',
  ],
  props: [
    { name: 'expanded', type: 'string | string[]', description: 'The currently expanded item value(s). Makes the component controlled.' },
    { name: 'defaultExpanded', type: 'string | string[]', description: 'Initial expanded item(s) for the uncontrolled case.' },
    { name: 'multiple', type: 'boolean', default: 'false', description: 'When true, multiple items can be expanded at once.' },
    { name: 'value', type: 'string', description: 'The value identifying an AccordionItem. Required on AccordionItem.' },
    { name: 'title', type: 'React.ReactNode', description: 'The heading text rendered in the AccordionItem trigger. Required.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Prevents expanding or collapsing an individual AccordionItem.' },
  ],
  doDont: [
    { do: 'Use Accordion to progressively disclose long, optional content.', dont: "Don't nest critical, always-needed content inside a collapsed AccordionItem by default." },
  ],
  related: ['tabs', 'progress-tracker'],
};
