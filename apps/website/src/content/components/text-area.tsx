import React from 'react';
import { TextArea } from '@aknishi/akds-reactkit';
import type { ComponentEntry } from './types';

const CHARACTER_COUNT_MAX_LENGTH = 280;

function CharacterCountExample() {
  const [value, setValue] = React.useState('');
  return (
    <TextArea
      label="Bio"
      maxLength={CHARACTER_COUNT_MAX_LENGTH}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      helperText={`${value.length}/${CHARACTER_COUNT_MAX_LENGTH} characters`}
    />
  );
}

export const textArea: ComponentEntry = {
  slug: 'text-area',
  name: 'TextArea',
  category: 'Inputs',
  summary: 'A multi-line text field with a floating label, helper text, error state, and configurable auto-grow or fixed-height behavior.',
  sourcePath: 'packages/reactkit/src/components/TextArea',
  storybookId: 'reactkit-textarea--docs',
  preview: <TextArea label="Description" />,
  examples: [
    {
      title: 'Basic',
      render: () => <TextArea label="Description" />,
      code: `<TextArea label="Description" />`,
    },
    {
      title: 'Helper text & error',
      render: () => (
        <>
          <TextArea label="Feedback" helperText="Tell us what you think" />
          <TextArea label="Comment" error defaultValue="Too short" helperText="Comment must be at least 20 characters" />
        </>
      ),
      code: `<TextArea label="Feedback" helperText="Tell us what you think" />
<TextArea label="Comment" error defaultValue="Too short" helperText="Comment must be at least 20 characters" />`,
    },
    {
      title: 'Character count',
      description: 'Derive helperText from state to show a live character count.',
      render: () => <CharacterCountExample />,
      code: `function Example() {
  const maxLength = 280;
  const [value, setValue] = React.useState('');
  return (
    <TextArea
      label="Bio"
      maxLength={maxLength}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      helperText={\`\${value.length}/\${maxLength} characters\`}
    />
  );
}`,
    },
    {
      title: 'Min rows',
      render: () => <TextArea label="Bio" minRows={6} />,
      code: `<TextArea label="Bio" minRows={6} />`,
    },
    {
      title: 'Not resizable',
      render: () => (
        <TextArea
          label="Notes"
          minRows={3}
          resizable={false}
          defaultValue="This textarea has a fixed height. Once the content grows past the visible rows, it scrolls vertically instead of expanding or being manually resized."
        />
      ),
      code: `<TextArea
  label="Notes"
  minRows={3}
  resizable={false}
  defaultValue="This textarea has a fixed height. Once the content grows past the visible rows, it scrolls vertically instead of expanding or being manually resized."
/>`,
    },
  ],
  accessibilityNotes: [
    'The floating label is a real <label> associated with the textarea via htmlFor/id — always announced by screen readers.',
    'error styling is visual only; pair it with helperText describing the problem so the association is conveyed via aria-describedby, not color alone.',
    'All native <textarea> attributes (maxLength, required, autoComplete, etc.) pass through via ...rest.',
  ],
  props: [
    { name: 'label', type: 'string', description: 'The floating label text.' },
    { name: 'helperText', type: 'string', description: 'Helper text rendered below the textarea.' },
    { name: 'minRows', type: 'number', default: '3', description: 'Minimum number of visible text rows. Also the fixed row count when resizable is false.' },
    { name: 'resizable', type: 'boolean', default: 'true', description: 'When true, the textarea grows to fit its content and can be dragged taller via the resize handle. When false, height stays fixed to minRows and overflowing content scrolls vertically instead.' },
    { name: 'error', type: 'boolean', default: 'false', description: 'Applies error styling to the border and helper text.' },
    { name: 'wrapperClassName', type: 'string', description: 'className applied to the outer wrapper <div>.' },
    { name: 'textareaRef', type: 'React.Ref<HTMLTextAreaElement>', description: 'Ref forwarded to the internal <textarea> element.' },
  ],
  doDont: [
    { do: 'Always provide a label — it doubles as the accessible name.', dont: "Don't use placeholder text as a substitute for a label." },
    { do: 'Pair error with helperText explaining what to fix.', dont: "Don't set error without any accompanying message." },
    { do: 'Use resizable={false} for fields with a genuine content cap (e.g. a tweet-length comment).', dont: "Don't disable resizing on open-ended fields like a bio or description." },
  ],
  related: ['text-input'],
};
