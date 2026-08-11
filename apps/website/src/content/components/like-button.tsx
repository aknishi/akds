import React from 'react';
import { LikeButton } from '@aknishi/akds-reactkit';
import type { ComponentEntry } from './types';

function LikeButtonExample() {
  const [liked, setLiked] = React.useState(false);
  return <LikeButton liked={liked} onClick={() => setLiked((prev) => !prev)} aria-label="Like this post" />;
}

export const likeButton: ComponentEntry = {
  slug: 'like-button',
  name: 'LikeButton',
  category: 'Actions',
  summary: 'A toggleable "like" button with a celebratory particle-burst animation on activation.',
  sourcePath: 'packages/reactkit/src/components/LikeButton',
  examples: [
    {
      title: 'Controlled',
      render: () => <LikeButtonExample />,
      code: `function Example() {
  const [liked, setLiked] = React.useState(false);
  return (
    <LikeButton
      liked={liked}
      onClick={() => setLiked((prev) => !prev)}
      aria-label="Like this post"
    />
  );
}`,
    },
  ],
  accessibilityNotes: [
    'liked is a controlled boolean — pair it with aria-pressed semantics by providing a clear aria-label describing the toggle action.',
    'The particle-burst effect is decorative (aria-hidden) and automatically suppressed under prefers-reduced-motion.',
  ],
  props: [
    { name: 'liked', type: 'boolean', description: 'Controlled pressed state — when true, renders in the liked state.' },
    { name: 'focusableWhenDisabled', type: 'boolean', default: 'false', description: 'Keeps a disabled button focusable via aria-disabled.' },
  ],
  doDont: [
    { do: 'Use LikeButton for lightweight, reversible reactions.', dont: "Don't use LikeButton for destructive or non-reversible actions — the celebratory animation implies a positive, low-stakes toggle." },
  ],
  related: ['button', 'particle-burst'],
};
