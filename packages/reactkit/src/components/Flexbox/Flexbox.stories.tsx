import type { Meta } from '@storybook/react';
import { Flexbox } from './Flexbox';
import { LiveEditStory } from '../../utils/LiveEditStory';

const meta: Meta<typeof Flexbox> = {
  title: 'Components/Flexbox',
  component: Flexbox,
  tags: ['autodocs'],
  argTypes: {
    justify: {
      control: 'select',
      options: ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'],
    },
    align: {
      control: 'select',
      options: ['stretch', 'flex-start', 'flex-end', 'center', 'baseline'],
    },
    direction: {
      control: 'select',
      options: ['row', 'row-reverse', 'column', 'column-reverse'],
    },
    wrap: { control: 'boolean' },
    gap: { control: 'text' },
  },
};

export default meta;

export const Default = LiveEditStory({
  component: Flexbox,
  code: `import { Flexbox, Text } from '@akds/reactkit';

const Box = ({ label }) => (
  <div style={{
    width: 64, height: 64,
    background: 'var(--akds-color-background-primary-default)',
    borderRadius: 'var(--akds-radius-sm)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  }}>
    <Text styleAs="caption" style={{ color: 'var(--akds-color-text-on-primary-default)' }}>{label}</Text>
  </div>
);

const FlexboxExample = () => (
  <Flexbox gap="md" align="center" padding="md" style={{ border: '1px dashed var(--akds-color-border-default-default)', borderRadius: 'var(--akds-radius-md)' }}>
    <Box label="1" />
    <Box label="2" />
    <Box label="3" />
  </Flexbox>
);

export default FlexboxExample;
`,
});

export const Direction = LiveEditStory({
  component: Flexbox,
  code: `import { Flexbox, Text } from '@akds/reactkit';

const Box = ({ label }) => (
  <div style={{
    width: 64, height: 40,
    background: 'var(--akds-color-background-secondary-default)',
    borderRadius: 'var(--akds-radius-sm)',
    border: '1px solid var(--akds-color-border-default-default)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  }}>
    <Text styleAs="caption">{label}</Text>
  </div>
);

const FlexboxExample = () => (
  <Flexbox gap="xl" direction="row" align="flex-start">
    <Flexbox direction="column" gap="sm" align="center">
      <Text styleAs="label">column</Text>
      <Box label="1" />
      <Box label="2" />
      <Box label="3" />
    </Flexbox>
    <Flexbox direction="column" gap="sm" align="center">
      <Text styleAs="label">column-reverse</Text>
      <Box label="1" />
      <Box label="2" />
      <Box label="3" />
    </Flexbox>
    <Flexbox direction="column" gap="sm" align="center">
      <Text styleAs="label">row</Text>
      <Flexbox direction="row" gap="sm">
        <Box label="1" />
        <Box label="2" />
        <Box label="3" />
      </Flexbox>
    </Flexbox>
    <Flexbox direction="column" gap="sm" align="center">
      <Text styleAs="label">row-reverse</Text>
      <Flexbox direction="row-reverse" gap="sm">
        <Box label="1" />
        <Box label="2" />
        <Box label="3" />
      </Flexbox>
    </Flexbox>
  </Flexbox>
);

export default FlexboxExample;
`,
});

export const JustifyContent = LiveEditStory({
  component: Flexbox,
  code: `import { Flexbox, Text } from '@akds/reactkit';

const Box = () => (
  <div style={{
    width: 40, height: 40,
    background: 'var(--akds-color-background-primary-default)',
    borderRadius: 'var(--akds-radius-sm)',
  }} />
);

const Row = ({ justify, label }) => (
  <Flexbox direction="column" gap="xs">
    <Text styleAs="caption">{label}</Text>
    <Flexbox justify={justify} py="sm" px="md" gap="sm" style={{ border: '1px dashed var(--akds-color-border-default-default)', borderRadius: 'var(--akds-radius-sm)' }}>
      <Box /><Box /><Box />
    </Flexbox>
  </Flexbox>
);

const FlexboxExample = () => (
  <Flexbox direction="column" gap="md">
    <Row justify="flex-start"    label="flex-start" />
    <Row justify="center"        label="center" />
    <Row justify="flex-end"      label="flex-end" />
    <Row justify="space-between" label="space-between" />
    <Row justify="space-around"  label="space-around" />
    <Row justify="space-evenly"  label="space-evenly" />
  </Flexbox>
);

export default FlexboxExample;
`,
});

export const AlignItems = LiveEditStory({
  component: Flexbox,
  code: `import { Flexbox, Text } from '@akds/reactkit';

const Box = ({ height }) => (
  <div style={{
    width: 40, height,
    background: 'var(--akds-color-background-primary-default)',
    borderRadius: 'var(--akds-radius-sm)',
  }} />
);

const Row = ({ align, label }) => (
  <Flexbox direction="column" gap="xs">
    <Text styleAs="caption">{label}</Text>
    <Flexbox align={align} gap="sm" style={{ height: 80, border: '1px dashed var(--akds-color-border-default-default)', borderRadius: 'var(--akds-radius-sm)', padding: '0 12px' }}>
      <Box height={32} /><Box height={48} /><Box height={24} />
    </Flexbox>
  </Flexbox>
);

const FlexboxExample = () => (
  <Flexbox direction="column" gap="md">
    <Row align="flex-start" label="flex-start" />
    <Row align="center"     label="center" />
    <Row align="flex-end"   label="flex-end" />
    <Row align="stretch"    label="stretch" />
  </Flexbox>
);

export default FlexboxExample;
`,
});

export const Wrap = LiveEditStory({
  component: Flexbox,
  code: `import { Flexbox, Text } from '@akds/reactkit';

const Box = ({ n }) => (
  <div style={{
    width: 56, height: 56,
    background: 'var(--akds-color-background-primary-default)',
    borderRadius: 'var(--akds-radius-sm)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  }}>
    <Text styleAs="caption" style={{ color: 'var(--akds-color-text-on-primary-default)' }}>{n}</Text>
  </div>
);

const FlexboxExample = () => (
  <Flexbox wrap gap="sm" style={{ maxWidth: 280, border: '1px dashed var(--akds-color-border-default-default)', borderRadius: 'var(--akds-radius-md)', padding: '12px' }}>
    {Array.from({ length: 9 }, (_, i) => <Box key={i} n={i + 1} />)}
  </Flexbox>
);

export default FlexboxExample;
`,
});

export const Gap = LiveEditStory({
  component: Flexbox,
  code: `import { Flexbox, Text } from '@akds/reactkit';

const Box = () => (
  <div style={{
    width: 40, height: 32,
    background: 'var(--akds-color-background-primary-default)',
    borderRadius: 'var(--akds-radius-xs)',
  }} />
);

const tokens = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];

const FlexboxExample = () => (
  <Flexbox direction="column" gap="md">
    {tokens.map(size => (
      <Flexbox key={size} align="center" gap="md">
        <Text styleAs="caption" style={{ width: 28 }}>{size}</Text>
        <Flexbox align="center" gap={size} style={{ flex: 1, border: '1px dashed var(--akds-color-border-default-default)', borderRadius: 'var(--akds-radius-sm)', padding: '8px' }}>
          <Box /><Box /><Box />
        </Flexbox>
      </Flexbox>
    ))}
    <Flexbox align="center" gap="md">
      <Text styleAs="caption" style={{ width: 28 }}>px</Text>
      <Flexbox align="center" gap="24px" style={{ flex: 1, border: '1px dashed var(--akds-color-border-default-default)', borderRadius: 'var(--akds-radius-sm)', padding: '8px' }}>
        <Box /><Box /><Box />
      </Flexbox>
    </Flexbox>
  </Flexbox>
);

export default FlexboxExample;
`,
});

export const Spacing = LiveEditStory({
  component: Flexbox,
  code: `import { Flexbox, Text } from '@akds/reactkit';

const Outline = ({ children, label }) => (
  <Flexbox direction="column" gap="xs">
    <Text styleAs="caption">{label}</Text>
    <div style={{ border: '1px dashed var(--akds-color-border-default-default)', borderRadius: 'var(--akds-radius-sm)', display: 'inline-flex' }}>
      {children}
    </div>
  </Flexbox>
);

const Inner = () => (
  <div style={{
    background: 'var(--akds-color-background-primary-default)',
    borderRadius: 'var(--akds-radius-sm)',
    width: 80, height: 40,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  }}>
    <Text styleAs="caption" style={{ color: 'var(--akds-color-text-on-primary-default)' }}>content</Text>
  </div>
);

const FlexboxExample = () => (
  <Flexbox direction="column" gap="lg">
    <Outline label='padding="md"'>
      <Flexbox padding="md"><Inner /></Flexbox>
    </Outline>
    <Outline label='px="lg" py="sm"'>
      <Flexbox px="lg" py="sm"><Inner /></Flexbox>
    </Outline>
    <Outline label='pt="lg" pb="xs" pl="xl" pr="sm"'>
      <Flexbox pt="lg" pb="xs" pl="xl" pr="sm"><Inner /></Flexbox>
    </Outline>
    <Outline label='margin="md" (note outer gap)'>
      <Flexbox margin="md"><Inner /></Flexbox>
    </Outline>
    <Outline label='mx="xl" my="sm"'>
      <Flexbox mx="xl" my="sm"><Inner /></Flexbox>
    </Outline>
  </Flexbox>
);

export default FlexboxExample;
`,
});
