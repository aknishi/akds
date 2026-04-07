import type { Meta } from '@storybook/react-vite';
import { Text } from './Text';
import { LiveEditStory } from '../../utils/LiveEditStory';

const meta: Meta<typeof Text> = {
  title: 'Components/Text',
  component: Text,
  tags: ['autodocs'],
  argTypes: {
    styleAs: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'body', 'label', 'caption'],
    },
    as: { control: 'text' },
  },
};

export default meta;

export const Headings = LiveEditStory({
  component: Text,
  code: `import { Flexbox, Text } from '@aknishi/akds-reactkit';

const TextExample = () => (
  <Flexbox direction="column" gap="sm">
    <Text styleAs="h1">Heading 1</Text>
    <Text styleAs="h2">Heading 2</Text>
    <Text styleAs="h3">Heading 3</Text>
    <Text styleAs="h4">Heading 4</Text>
    <Text styleAs="h5">Heading 5</Text>
    <Text styleAs="h6">Heading 6</Text>
  </Flexbox>
);

export default TextExample;
`,
});

export const BodyStyles = LiveEditStory({
  component: Text,
  code: `import { Flexbox, Text } from '@aknishi/akds-reactkit';

const TextExample = () => (
  <Flexbox direction="column" gap="sm">
    <Text styleAs="body">Body — the default text style for paragraphs.</Text>
    <Text styleAs="label">Label — used for form labels and UI labels.</Text>
    <Text styleAs="caption">Caption — supplementary text at a smaller size.</Text>
  </Flexbox>
);

export default TextExample;
`,
});

export const AsOverride = LiveEditStory({
  component: Text,
  code: `import { Flexbox, Text } from '@aknishi/akds-reactkit';

const TextExample = () => (
  <Flexbox direction="column" gap="sm">
    <Text styleAs="h3" as="span">h3 style rendered as a span</Text>
    <Text styleAs="caption" as="p">Caption style rendered as a paragraph</Text>
    <Text styleAs="label" as="label">Label style rendered as a label element</Text>
  </Flexbox>
);

export default TextExample;
`,
});
