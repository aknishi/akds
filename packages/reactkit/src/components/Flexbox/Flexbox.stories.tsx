import type { Meta } from '@storybook/react-vite';
import { Flexbox } from './Flexbox';
import { LiveEditStory } from '../../utils/LiveEditStory';

const meta: Meta<typeof Flexbox> = {
  title: 'Reactkit/Flexbox',
  component: Flexbox,
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
  code: `import { Flexbox, Text } from '@aknishi/akds-reactkit';

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
  <Flexbox gap="md" align="center" padding="md" style={{ border: '1px dashed var(--akds-color-border-neutral-default)', borderRadius: 'var(--akds-radius-md)' }}>
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
  code: `import { Flexbox, Text } from '@aknishi/akds-reactkit';

const Box = ({ label }) => (
  <div style={{
    width: 64, height: 40,
    background: 'var(--akds-color-background-secondary-default)',
    borderRadius: 'var(--akds-radius-sm)',
    border: '1px solid var(--akds-color-border-neutral-default)',
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
  code: `import { Flexbox, Text } from '@aknishi/akds-reactkit';

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
    <Flexbox justify={justify} py="sm" px="md" gap="sm" style={{ border: '1px dashed var(--akds-color-border-neutral-default)', borderRadius: 'var(--akds-radius-sm)' }}>
      <Box />
      <Box />
      <Box />
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
  code: `import { Flexbox, Text } from '@aknishi/akds-reactkit';

const Box = () => (
  <div style={{
    minHeight: 40,
    width: 40,
    background: 'var(--akds-color-background-primary-default)',
    borderRadius: 'var(--akds-radius-sm)',
  }} />
);

const Row = ({ align, label }) => (
  <Flexbox direction="column" gap="xs">
    <Text styleAs="caption">{label}</Text>
    <Flexbox align={align} gap="sm" style={{ height: 80, border: '1px dashed var(--akds-color-border-neutral-default)', borderRadius: 'var(--akds-radius-sm)', padding: '0 12px', width: '100%' }}>
      <Box /><Box /><Box />
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
  code: `import { Flexbox, Text } from '@aknishi/akds-reactkit';

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
  <Flexbox wrap gap="sm" style={{ maxWidth: 280, border: '1px dashed var(--akds-color-border-neutral-default)', borderRadius: 'var(--akds-radius-md)', padding: '12px' }}>
    {Array.from({ length: 9 }, (_, i) => <Box key={i} n={i + 1} />)}
  </Flexbox>
);

export default FlexboxExample;
`,
});

export const Gap = LiveEditStory({
  component: Flexbox,
  code: `import { Flexbox, Text, Divider } from '@aknishi/akds-reactkit';

const Box = () => (
  <div style={{
    width: 40, height: 32,
    background: 'var(--akds-color-background-primary-default)',
    borderRadius: 'var(--akds-radius-xs)',
  }} />
);

const Row = ({ label, gap }) => (
  <Flexbox align="center" gap="md">
    <Text styleAs="caption" style={{ width: 56 }}>{label}</Text>
    <Flexbox align="center" gap={gap} style={{ border: '1px dashed var(--akds-color-border-neutral-default)', borderRadius: 'var(--akds-radius-sm)', padding: '8px' }}>
      <Box /><Box /><Box />
    </Flexbox>
  </Flexbox>
);

const Column = ({ title, rows }) => (
  <Flexbox direction="column" gap="sm">
    <Text styleAs="h6" as="span">{title}</Text>
    {rows.map(row => <Row key={row.label} {...row} />)}
  </Flexbox>
);

const predefinedSizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'].map(size => ({ label: size, gap: size }));
const tokenScalingFactors = [0.25, 0.5, 1, 1.5, 2, 3].map(value => ({ label: String(value), gap: value }));
const explicitValues = ['16px', '24px', '1rem', '1.5rem', '2em'].map(value => ({ label: value, gap: value }));

const FlexboxExample = () => (
  <Flexbox justify="space-around" align="flex-start">
    <Column title="Predefined sizes" rows={predefinedSizes} />
    <Divider orientation="vertical" />
    <Column title="Token scaling factor" rows={tokenScalingFactors} />
    <Divider orientation="vertical" />
    <Column title="Explicit value" rows={explicitValues} />
  </Flexbox>
);

export default FlexboxExample;
`,
});

export const Spacing = LiveEditStory({
  component: Flexbox,
  code: `import { Flexbox, Text, Divider } from '@aknishi/akds-reactkit';

// Example components -------------------------------------------------
const Outline = ({ children, label }) => (
  <Flexbox direction="column" gap="xs">
    <Text styleAs="caption">{label}</Text>
    <div style={{ border: '1px dashed var(--akds-color-border-neutral-default)', borderRadius: 'var(--akds-radius-sm)', display: 'inline-flex' }}>
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

const Column = ({ title, rows }) => (
  <Flexbox direction="column" gap="sm">
    <Text styleAs="h6" as="span">{title}</Text>
    {rows.map(row => (
      <Outline key={row.label} label={row.label}>
        <Flexbox {...row.props}><Inner /></Flexbox>
      </Outline>
    ))}
  </Flexbox>
);

// ---------------------------------------------------------------- 

const predefinedSizes = [
  { label: 'padding="md"', props: { padding: 'md' } },
  { label: 'px="lg" py="sm"', props: { px: 'lg', py: 'sm' } },
  { label: 'pt="lg" pb="xs" pl="xl" pr="sm"', props: { pt: 'lg', pb: 'xs', pl: 'xl', pr: 'sm' } },
  { label: 'margin="md"', props: { margin: 'md' } },
  { label: 'mx="xl" my="sm"', props: { mx: 'xl', my: 'sm' } },
];

const tokenScalingFactors = [
  { label: 'padding={2}', props: { padding: 2 } },
  { label: 'px={3} py={1}', props: { px: 3, py: 1 } },
  { label: 'pt={3} pb={0.5} pl={4} pr={1}', props: { pt: 3, pb: 0.5, pl: 4, pr: 1 } },
  { label: 'margin={2}', props: { margin: 2 } },
  { label: 'mx={4} my={1}', props: { mx: 4, my: 1 } },
];

const explicitValues = [
  { label: 'padding="16px"', props: { padding: '16px' } },
  { label: 'px="1.5rem" py="0.5rem"', props: { px: '1.5rem', py: '0.5rem' } },
  { label: 'pt="2rem" pb="4px" pl="2em" pr="8px"', props: { pt: '2rem', pb: '4px', pl: '2em', pr: '8px' } },
  { label: 'margin="16px"', props: { margin: '16px' } },
  { label: 'mx="2rem" my="8px"', props: { mx: '2rem', my: '8px' } },
];

const FlexboxExample = () => (
  <Flexbox justify="space-around" align="flex-start" >
    <Column title="Predefined sizes" rows={predefinedSizes} />
    <Divider variant="solid" orientation="vertical" />
    <Column title="Token scaling factor" rows={tokenScalingFactors} />
    <Divider orientation="vertical" />
    <Column title="Explicit value" rows={explicitValues} />
  </Flexbox>
);

export default FlexboxExample;
`,
});
