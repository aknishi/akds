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
  name: 'Text area',
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
      title: 'Fixed height',
      render: () => (
        <TextArea
          label="Notes"
          minRows={3}
          autoGrow={false}
          resizable={false}
          defaultValue="This textarea has a fixed height. Once the content grows past the visible rows, it scrolls vertically instead of expanding or being manually resized."
        />
      ),
      code: `<TextArea
  label="Notes"
  minRows={3}
  autoGrow={false}
  resizable={false}
  defaultValue="This textarea has a fixed height. Once the content grows past the visible rows, it scrolls vertically instead of expanding or being manually resized."
/>`,
    },
    {
      title: 'Disabled',
      render: () => <TextArea label="Read only" disabled defaultValue="Cannot be edited" />,
      code: `<TextArea label="Read only" disabled defaultValue="Cannot be edited" />`,
    },
  ],
  accessibilityNotes: [
    'The floating label is a real <label> associated with the textarea via htmlFor/id — always announced by screen readers.',
    'With error set, helperText becomes the error message: it is prefixed with an error icon named "Error" (so the state is not conveyed by color alone), linked via aria-describedby, and aria-invalid="true" is set.',
    'Native constraints (required, minLength…) pass through via ...rest. A failing field gets the same error styling via :user-invalid — only after the user edits and leaves it, or on a failed submit — plus aria-invalid="true" and the browser validation message below the helper text. Until then aria-invalid is "false".',
    'A consumer aria-describedby is merged with the helper and error message ids rather than replacing them.',
    'Auto-grow uses CSS field-sizing: content where supported, with a mirrored-grid fallback elsewhere.',
  ],
  props: [
    { name: 'label', type: 'string', description: 'The floating label text.' },
    { name: 'helperText', type: 'string', description: 'Helper text rendered below the textarea.' },
    { name: 'minRows', type: 'number', default: '3', description: 'Minimum number of visible text rows. Also the fixed row count when autoGrow is false.' },
    { name: 'maxRows', type: 'number', description: 'Maximum rows the textarea grows to before scrolling. Unset means no limit.' },
    { name: 'autoGrow', type: 'boolean', default: 'true', description: 'When true, the textarea grows to fit its content. When false, height stays fixed to minRows and overflowing content scrolls vertically.' },
    { name: 'resizable', type: 'boolean', default: 'true', description: 'Shows the resize handle so the textarea can be dragged taller. When false, only the handle is hidden — auto-grow still applies.' },
    { name: 'error', type: 'boolean', default: 'false', description: 'Applies error styling to the border and helper text.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Prevents interaction and applies disabled styling.' },
    { name: 'wrapperClassName', type: 'string', description: 'className applied to the outer wrapper <div>.' },
    { name: 'textareaRef', type: 'React.Ref<HTMLTextAreaElement>', description: 'Ref forwarded to the internal <textarea> element.' },
  ],
  doDont: [
    { do: 'Always provide a label — it doubles as the accessible name.', dont: "Don't use placeholder text as a substitute for a label." },
    { do: 'Pair error with helperText explaining what to fix.', dont: "Don't set error without any accompanying message." },
    { do: 'Use autoGrow={false} and resizable={false} only for fields with a genuine content cap (e.g. a tweet-length comment).', dont: "Don't disable resizing on open-ended fields like a bio or description." },
  ],
  related: ['text-input'],
};
