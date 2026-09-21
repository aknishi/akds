import React from 'react';
import { LikeButton } from '@aknishi/akds-reactkit';
import type { ComponentEntry } from './types';
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion';
import { useAutoRestartInterval } from '../../lib/useAutoRestartInterval';
import { AUTO_LOOP_INTERVAL_MS, AUTO_LOOP_STAGGER_MS } from './autoLoopTiming';

function LikeButtonExample() {
  const [liked, setLiked] = React.useState(false);
  return <LikeButton liked={liked} onClick={() => setLiked((prev) => !prev)} aria-label="Like this post" />;
}

// Dispatches a real bubbling click every cycle so LikeButton's own internal click
// handler runs (the only way to fire its particle burst — there's no prop-driven
// trigger for it). That native event has to bubble all the way to React's root
// listener to be seen at all, which means it also reaches the wrapping NavLink,
// since ComponentCard's `inert` wrapper only blocks real hit-testing, not a script's
// own dispatchEvent. Two separate things need suppressing, not just one:
//   - stopPropagation alone doesn't stop the <a>'s native "navigate on click"
//     behavior — that's the browser's own default action for the event, entirely
//     outside React's synthetic dispatch, so it fires regardless of whether any
//     React handler up the tree ever runs.
//   - preventDefault stops that native navigation, and — because it runs inside
//     LikeButton's own handleClick, which React calls before NavLink's onClick in
//     its synthetic bubble order — React Router's Link also skips its own
//     navigate() call, since it explicitly checks `!event.defaultPrevented` first.
// So preventDefault alone is sufficient; stopPropagation is added on top just to
// keep the event from reaching any other ancestor handlers at all.
function LikeButtonAutoLoopPreview() {
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  useAutoRestartInterval(
    () => buttonRef.current?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })),
    AUTO_LOOP_INTERVAL_MS,
    !prefersReducedMotion,
    2 * AUTO_LOOP_STAGGER_MS,
  );
  return (
    <LikeButton
      ref={buttonRef}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      aria-label="Like this post"
    />
  );
}

export const likeButton: ComponentEntry = {
  slug: 'like-button',
  name: 'Like button',
  category: 'Actions',
  summary: 'A toggleable "like" button with a celebratory particle-burst animation on activation.',
  sourcePath: 'packages/reactkit/src/components/LikeButton',
  storybookId: 'reactkit-buttons-likebutton--docs',
  preview: <LikeButtonAutoLoopPreview />,
  examples: [
    {
      title: 'Default',
      render: () => <LikeButton aria-label="Like this post" />,
      code: `<LikeButton aria-label="Like this post" />`,
    },
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
    {
      title: 'Disabled',
      render: () => <LikeButton disabled focusableWhenDisabled aria-label="Like this post" />,
      code: `<LikeButton disabled focusableWhenDisabled aria-label="Like this post" />`,
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
    { do: 'Use Like button for lightweight, reversible reactions.', dont: "Don't use Like button for destructive or non-reversible actions — the celebratory animation implies a positive, low-stakes toggle." },
  ],
  related: ['button'],
};
