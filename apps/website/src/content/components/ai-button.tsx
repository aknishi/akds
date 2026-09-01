import React from 'react';
import { AIButton } from '@aknishi/akds-reactkit';
import type { ComponentEntry } from './types';

function AIButtonControlledExample() {
  const [loading, setLoading] = React.useState(false);

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 4000);
  };

  return (
    <AIButton loading={loading} onClick={handleClick}>
      Generate
    </AIButton>
  );
}

export const aiButton: ComponentEntry = {
  slug: 'ai-button',
  name: 'AIButton',
  category: 'Actions',
  summary: 'Triggers generation of AI content, such as images or text, with an animated generating state.',
  sourcePath: 'packages/reactkit/src/components/AIButton',
  storybookId: 'reactkit-buttons-aibutton--docs',
  preview: <AIButton loading>Generate</AIButton>,
  examples: [
    {
      title: 'Default',
      render: () => <AIButton>Generate</AIButton>,
      code: `<AIButton>Generate</AIButton>`,
    },
    {
      title: 'Disabled',
      render: () => <AIButton disabled>Generate</AIButton>,
      code: `<AIButton disabled>Generate</AIButton>`,
    },
    {
      title: 'Loading',
      description: 'Uncontrolled by default — the button enters its own loading state on click and stays there.',
      render: () => <AIButton loading>Generate</AIButton>,
      code: `<AIButton loading>Generate</AIButton>`,
    },
    {
      title: 'Controlled',
      description: 'Pass loading explicitly to control when the generating state clears.',
      render: () => <AIButtonControlledExample />,
      code: `function Example() {
  const [loading, setLoading] = React.useState(false);

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 4000);
  };

  return (
    <AIButton loading={loading} onClick={handleClick}>
      Generate
    </AIButton>
  );
}`,
    },
  ],
  accessibilityNotes: [
    'Renders a native <button type="button"> — full keyboard and screen reader support out of the box.',
    'loading sets aria-busy and disables interaction while keeping the label swap purely visual.',
    'focusableWhenDisabled keeps a disabled button in the tab order (via aria-disabled) instead of removing it from the tab order entirely.',
    'The generating animation is deliberately not tied to :focus, so tabbing to or clicking the button does not itself trigger it.',
  ],
  props: [
    { name: 'loading', type: 'boolean', description: 'Replaces the label with loadingLabel and disables interaction. Uncontrolled by default — pass this prop to control when it clears.' },
    { name: 'loadingLabel', type: 'React.ReactNode', default: "'Generating'", description: 'Content shown in place of children while loading is true.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Prevents interaction and applies disabled styling.' },
    { name: 'focusableWhenDisabled', type: 'boolean', default: 'false', description: 'Keeps a disabled button focusable via aria-disabled instead of the native disabled attribute.' },
    { name: 'children', type: 'React.ReactNode', description: 'The button label, e.g. "Generate". Required.' },
  ],
  doDont: [
    { do: 'Use AIButton for actions that trigger AI generation (text, images, summaries).', dont: "Don't use AIButton for ordinary async actions — use Button's loading prop instead so generation reads as visually distinct." },
    { do: 'Pass a controlled loading value when you need to clear the state on a specific event (e.g. a stream finishing).', dont: "Don't leave the uncontrolled default in place if generation can fail — the button will stay in its loading state indefinitely." },
  ],
  related: ['button', 'icon-button', 'like-button'],
};
