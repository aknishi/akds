import React from 'react';
import { StreamingText, Button } from '@aknishi/akds-reactkit';
import type { ComponentEntry } from './types';

const DEFAULT_TEXT =
  "Here's a summary of the changes in this pull request. The main update replaces the icon-based loader with a custom animated spinner, and the cycling labels now wipe left to right instead of fading all at once.";
const SPEED_TEXT =
  'This paragraph streams in much faster than the default speed. Even at this pace, each character still animates in individually rather than the whole block appearing at once.';
const NO_CURSOR_TEXT =
  "No blinking cursor while this paragraph streams in. This works well when the surrounding layout already has its own loading indicator elsewhere on the page.";

function StreamingTextRestartExample({
  text,
  speed,
  cursor,
}: {
  text: string;
  speed?: number;
  cursor?: boolean;
}) {
  const [key, setKey] = React.useState(0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start' }}>
      {/* A fixed width (not maxWidth) so the block occupies its full final
          footprint from the first frame — ComponentPreviewFrame centers its
          content, so a width that grows with the revealed text would shift
          the whole block sideways as it streams in. */}
      <div style={{ width: '360px' }}>
        <StreamingText key={key} text={text} speed={speed} cursor={cursor} />
      </div>
      <Button size="sm" onClick={() => setKey((k) => k + 1)}>
        Restart
      </Button>
    </div>
  );
}

// Auto-restarts once the stream finishes — used only for the small card
// preview (components index / landing page), which has no user-facing
// restart control, unlike the interactive examples below. onComplete fires
// from StreamingText's own internal timer, not a React effect, so the
// pending restart timeout is tracked in a ref and cleared on unmount to
// avoid scheduling a state update after the card is gone.
function StreamingTextAutoLoopPreview({ text, speed, pauseMs = 1500 }: { text: string; speed?: number; pauseMs?: number }) {
  const [key, setKey] = React.useState(0);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>();

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleComplete = React.useCallback(() => {
    timeoutRef.current = setTimeout(() => setKey((k) => k + 1), pauseMs);
  }, [pauseMs]);

  return <StreamingText key={key} text={text} speed={speed} onComplete={handleComplete} />;
}

function StreamingTextMultiMessageExample() {
  const [index, setIndex] = React.useState(0);
  const messages = ['Let me look into that for you.', "Here's what I found after checking the logs."];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start' }}>
      <div style={{ width: '360px' }}>
        <StreamingText key={index} text={messages[index]} />
      </div>
      <Button size="sm" onClick={() => setIndex((i) => (i + 1) % messages.length)}>
        Next message
      </Button>
    </div>
  );
}

export const streamingText: ComponentEntry = {
  slug: 'streaming-text',
  name: 'Streaming text',
  category: 'AI',
  summary: 'Reveals a block of text one character at a time, simulating an AI response streaming in.',
  sourcePath: 'packages/reactkit/src/components/StreamingText',
  storybookId: 'reactkit-ai-streamingtext--docs',
  // A percentage width (relative to the card's own preview area, not the
  // revealed text) rather than a fixed px value — the card preview shows up
  // at different widths on different pages, but either way the block should
  // fill a stable share of it and never grow/shift as the text streams in.
  preview: (
    <div style={{ width: '100%' }}>
      <StreamingTextAutoLoopPreview text="Watch responses arrive one character at a time, just like a real AI is typing them out." speed={80} />
    </div>
  ),
  examples: [
    {
      title: 'Default',
      description: 'Pass the full, final text — the component handles the progressive reveal. Restart the animation by remounting with a new key.',
      render: () => <StreamingTextRestartExample text={DEFAULT_TEXT} />,
      code: `function Example() {
  const [key, setKey] = React.useState(0);
  const text = "${DEFAULT_TEXT}";

  return (
    <>
      <StreamingText key={key} text={text} />
      <Button size="sm" onClick={() => setKey((k) => k + 1)}>
        Restart
      </Button>
    </>
  );
}`,
    },
    {
      title: 'Speed',
      description: 'speed sets the milliseconds between each revealed character — lower is faster.',
      render: () => <StreamingTextRestartExample text={SPEED_TEXT} speed={8} />,
      code: `<StreamingText text="${SPEED_TEXT}" speed={8} />`,
    },
    {
      title: 'No cursor',
      description: 'Set cursor to false to hide the blinking cursor while streaming.',
      render: () => <StreamingTextRestartExample text={NO_CURSOR_TEXT} cursor={false} />,
      code: `<StreamingText text="${NO_CURSOR_TEXT}" cursor={false} />`,
    },
    {
      title: 'Multiple messages',
      description: 'Remount with a new key (e.g. a message index) to stream in a different message.',
      render: () => <StreamingTextMultiMessageExample />,
      code: `function Example() {
  const [index, setIndex] = React.useState(0);
  const messages = [
    "Let me look into that for you.",
    "Here's what I found after checking the logs.",
  ];

  return (
    <>
      <StreamingText key={index} text={messages[index]} />
      <Button size="sm" onClick={() => setIndex((i) => (i + 1) % messages.length)}>
        Next message
      </Button>
    </>
  );
}`,
    },
  ],
  accessibilityNotes: [
    'The visible, incrementally-revealed text is aria-hidden — a separate visually-hidden role="status" region announces the finished message once to screen readers, rather than letting them pick up every character reveal.',
    'Respects prefers-reduced-motion: the full text renders immediately instead of animating in character by character.',
    'A word never splits across lines even when the text wraps — each word is grouped so line breaks only happen at natural word boundaries.',
  ],
  props: [
    { name: 'text', type: 'string', description: 'The full text content to reveal progressively, one character at a time. Required.' },
    { name: 'speed', type: 'number', default: '30', description: 'Milliseconds between each revealed character.' },
    { name: 'cursor', type: 'boolean', default: 'true', description: 'When true, shows a blinking cursor while the text is still streaming.' },
    { name: 'onComplete', type: '() => void', description: 'Called once the full text has been revealed.' },
  ],
  doDont: [
    { do: 'Use Streaming text for a single AI response you already have in full, to simulate it arriving live.', dont: "Don't use it to actually stream tokens as they arrive from a real API — feed each chunk into a normal text update instead, or accumulate the full response first." },
  ],
  related: ['thinking-state', 'generation-loader', 'ai-button'],
};
