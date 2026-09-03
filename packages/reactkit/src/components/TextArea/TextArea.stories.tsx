import type { Meta } from '@storybook/react-vite';
import { TextArea } from './TextArea';
import { LiveEditStory } from '../../utils/LiveEditStory';

const meta: Meta<typeof TextArea> = {
  title: 'Reactkit/TextArea',
  component: TextArea,
  argTypes: {
    disabled: { control: 'boolean' },
    error: { control: 'boolean' },
    label: { control: 'text' },
    helperText: { control: 'text' },
    minRows: { control: 'number' },
    resizable: { control: 'boolean' },
    textareaRef: { control: false },
  },
};

export default meta;

export const Default = LiveEditStory({
  component: TextArea,
  code: `import { TextArea } from '@aknishi/akds-reactkit';

const TextAreaExample = () => <TextArea label="Description" />;

export default TextAreaExample;
`,
});

export const WithHelperText = LiveEditStory({
  component: TextArea,
  code: `import { TextArea } from '@aknishi/akds-reactkit';

const TextAreaExample = () => (
  <TextArea label="Feedback" helperText="Tell us what you think" />
);

export default TextAreaExample;
`,
});

export const WithCharacterCount = LiveEditStory({
  component: TextArea,
  code: `import React from 'react';
import { TextArea } from '@aknishi/akds-reactkit';

const MAX_LENGTH = 280;

const TextAreaExample = () => {
  const [value, setValue] = React.useState('');

  return (
    <TextArea
      label="Bio"
      maxLength={MAX_LENGTH}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      helperText={\`\${value.length}/\${MAX_LENGTH} characters\`}
    />
  );
};

export default TextAreaExample;
`,
});

export const MinRows = LiveEditStory({
  component: TextArea,
  code: `import { TextArea } from '@aknishi/akds-reactkit';

const TextAreaExample = () => (
  <TextArea label="Bio" minRows={6} />
);

export default TextAreaExample;
`,
});

export const NotResizable = LiveEditStory({
  component: TextArea,
  code: `import { TextArea } from '@aknishi/akds-reactkit';

const TextAreaExample = () => (
  <TextArea
    label="Notes"
    minRows={4}
    resizable={false}
    defaultValue="This textarea has a fixed height. Once the content grows past the visible rows, it scrolls vertically instead of expanding or being manually resized."
  />
);

export default TextAreaExample;
`,
});

export const Error = LiveEditStory({
  component: TextArea,
  code: `import { TextArea } from '@aknishi/akds-reactkit';

const TextAreaExample = () => (
  <TextArea label="Comment" defaultValue="Too short" helperText="Comment must be at least 20 characters" error />
);

export default TextAreaExample;
`,
});

export const Disabled = LiveEditStory({
  component: TextArea,
  code: `import { TextArea } from '@aknishi/akds-reactkit';

const TextAreaExample = () => <TextArea label="Read only" disabled defaultValue="Cannot be edited" />;

export default TextAreaExample;
`,
});
