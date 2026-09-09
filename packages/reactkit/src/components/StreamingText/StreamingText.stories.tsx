import type { Meta } from '@storybook/react-vite';
import { StreamingText } from './StreamingText';
import { LiveEditStory } from '../../utils/LiveEditStory';

const meta: Meta<typeof StreamingText> = {
  title: 'Reactkit/AI/StreamingText',
  component: StreamingText,
  argTypes: {
    text: { control: 'text' },
    speed: { control: 'number' },
    cursor: { control: 'boolean' },
  },
};

export default meta;

export const Default = LiveEditStory({
  component: StreamingText,
  code: `import React from 'react';
import { StreamingText, Button } from '@aknishi/akds-reactkit';

const text = "Here's a summary of the changes in this pull request. The main update replaces the icon-based loader with a custom animated spinner, and the cycling labels now wipe left to right instead of fading all at once.";

const Example = () => {
  const [key, setKey] = React.useState(0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start' }}>
      <div style={{ maxWidth: '360px' }}>
        <StreamingText key={key} text={text} />
      </div>
      <Button size="sm" onClick={() => setKey(k => k + 1)}>
        Restart
      </Button>
    </div>
  );
};

export default Example;
`,
});

export const Speed = LiveEditStory({
  component: StreamingText,
  code: `import React from 'react';
import { StreamingText, Button } from '@aknishi/akds-reactkit';

const text = "This paragraph streams in much faster than the default speed. Even at this pace, each character still animates in individually rather than the whole block appearing at once.";

const Example = () => {
  const [key, setKey] = React.useState(0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start' }}>
      <div style={{ maxWidth: '360px' }}>
        <StreamingText key={key} text={text} speed={8} />
      </div>
      <Button size="sm" onClick={() => setKey(k => k + 1)}>
        Restart
      </Button>
    </div>
  );
};

export default Example;
`,
});

export const NoCursor = LiveEditStory({
  component: StreamingText,
  code: `import React from 'react';
import { StreamingText, Button } from '@aknishi/akds-reactkit';

const text = "No blinking cursor while this paragraph streams in. This works well when the surrounding layout already has its own loading indicator elsewhere on the page.";

const Example = () => {
  const [key, setKey] = React.useState(0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start' }}>
      <div style={{ maxWidth: '360px' }}>
        <StreamingText key={key} text={text} cursor={false} />
      </div>
      <Button size="sm" onClick={() => setKey(k => k + 1)}>
        Restart
      </Button>
    </div>
  );
};

export default Example;
`,
});

export const MultiMessage = LiveEditStory({
  component: StreamingText,
  code: `import React from 'react';
import { StreamingText, Button } from '@aknishi/akds-reactkit';

const messages = [
  "Let me look into that for you.",
  "Here's what I found after checking the logs.",
];

const Example = () => {
  const [index, setIndex] = React.useState(0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start' }}>
      <StreamingText key={index} text={messages[index]} />
      <Button size="sm" onClick={() => setIndex(i => (i + 1) % messages.length)}>
        Next message
      </Button>
    </div>
  );
};

export default Example;
`,
});
