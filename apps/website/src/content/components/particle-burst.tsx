import React from 'react';
import { Button, ParticleBurst } from '@aknishi/akds-reactkit';
import type { ParticleBurstHandle } from '@aknishi/akds-reactkit';
import type { ComponentEntry } from './types';

function ParticleBurstExample() {
  const burstRef = React.useRef<ParticleBurstHandle>(null);
  return (
    <Button appearance="solid" emphasis="accented" onClick={() => burstRef.current?.trigger()}>
      Trigger burst
      <ParticleBurst ref={burstRef} color="var(--akds-color-background-primary-default)" spacingFromCenter="24px" />
    </Button>
  );
}

export const particleBurst: ComponentEntry = {
  slug: 'particle-burst',
  name: 'ParticleBurst',
  category: 'Primitives',
  isPrimitive: true,
  summary: 'A headless, imperative particle-explosion effect layer used to celebrate an action (LikeButton, ProgressTrackerStep).',
  sourcePath: 'packages/reactkit/src/components/ParticleBurst',
  examples: [
    {
      title: 'Imperative trigger',
      render: () => <ParticleBurstExample />,
      code: `const burstRef = React.useRef<ParticleBurstHandle>(null);

<button onClick={() => burstRef.current?.trigger()}>
  Label
  <ParticleBurst
    ref={burstRef}
    color="var(--akds-color-background-primary-default)"
    spacingFromCenter="24px"
  />
</button>`,
    },
  ],
  accessibilityNotes: [
    'Renders with aria-hidden="true" and pointer-events: none — purely decorative, never affects semantics or interaction.',
    'Consumers (like LikeButton) are responsible for checking prefers-reduced-motion before calling trigger().',
  ],
  props: [
    { name: 'color', type: 'string', description: 'Color of the particles. Accepts any valid CSS color, including design tokens. Required.' },
    { name: 'spacingFromCenter', type: 'string', description: 'Distance each particle starts from the center before animating outward. Required.' },
    { name: 'particleCount', type: 'number', description: 'Number of particles spawned per burst.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Suppresses particle bursts.' },
  ],
  related: [],
};
