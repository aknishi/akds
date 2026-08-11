import { Button } from '@aknishi/akds-reactkit';
import type { ComponentEntry } from './types';

export const rippleBase: ComponentEntry = {
  slug: 'ripple-base',
  name: 'RippleBase',
  category: 'Primitives',
  isPrimitive: true,
  summary: 'A headless, imperative ripple layer that powers the press feedback on every button-like akds component.',
  sourcePath: 'packages/reactkit/src/components/RippleBase',
  examples: [
    {
      title: 'In practice',
      description: "Every akds Button already includes RippleBase internally — press this button to see it.",
      render: () => (
        <Button appearance="solid" emphasis="accented">
          Press me
        </Button>
      ),
      code: `const rippleRef = React.useRef<RippleBaseHandle>(null);

<button
  onPointerDown={(e) => rippleRef.current?.trigger(e)}
>
  Label
  <RippleBase ref={rippleRef} disabled={isDisabled} />
</button>`,
    },
  ],
  accessibilityNotes: [
    'Renders with aria-hidden="true" and pointer-events: none — it never affects semantics or event handling.',
    'Host components skip triggering RippleBase entirely when prefers-reduced-motion is set, rather than just shortening the animation.',
  ],
  props: [
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Whether ripples should be suppressed (e.g. when the host is disabled).' },
    { name: 'onDark', type: 'boolean', default: 'false', description: 'Whether the ripple base sits on a dark/filled background.' },
    { name: 'color', type: 'string', description: 'Custom ripple color. Defaults to the semantic pressed-overlay token (or its on-dark equivalent).' },
  ],
  related: [],
};
