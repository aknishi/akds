import { ProgressTracker, ProgressTrackerStep } from '@aknishi/akds-reactkit';
import type { ComponentEntry } from './types';

export const progressTracker: ComponentEntry = {
  slug: 'progress-tracker',
  name: 'ProgressTracker',
  category: 'Navigation & Disclosure',
  summary: 'A numbered step tracker for multi-step flows, composed of ProgressTrackerStep children.',
  sourcePath: 'packages/reactkit/src/components/ProgressTracker',
  examples: [
    {
      title: 'Basic',
      render: () => (
        <ProgressTracker currentStep={2}>
          <ProgressTrackerStep label="Account" status="complete" />
          <ProgressTrackerStep label="Shipping" status="complete" />
          <ProgressTrackerStep label="Payment" active />
          <ProgressTrackerStep label="Review" status="inactive" />
        </ProgressTracker>
      ),
      code: `<ProgressTracker currentStep={3}>
  <ProgressTrackerStep label="Account" status="complete" />
  <ProgressTrackerStep label="Shipping" status="complete" />
  <ProgressTrackerStep label="Payment" active />
  <ProgressTrackerStep label="Review" status="inactive" />
</ProgressTracker>`,
    },
    {
      title: 'Error state',
      render: () => (
        <ProgressTracker>
          <ProgressTrackerStep label="Upload" status="complete" />
          <ProgressTrackerStep label="Validate" status="error" />
          <ProgressTrackerStep label="Publish" status="inactive" />
        </ProgressTracker>
      ),
      code: `<ProgressTrackerStep label="Validate" status="error" />`,
    },
  ],
  accessibilityNotes: [
    'Each step is a list item (<li>) with a visible label above it — status is conveyed through both icon shape and text, not color alone.',
    'celebrateOnComplete plays a decorative particle-burst animation, automatically suppressed under prefers-reduced-motion.',
  ],
  props: [
    { name: 'currentStep', type: 'number', description: '1-based index of the currently active step. 0 or negative means no active step.' },
    { name: 'label', type: 'string', description: 'Visible text label shown above the step circle. Required on ProgressTrackerStep.' },
    { name: 'status', type: "'complete' | 'inactive' | 'error' | 'warning'", description: 'Semantic status of a step. Ignored when the step is active.' },
    { name: 'active', type: 'boolean', default: 'false', description: 'Renders the step in active (in-progress) styling, overriding status.' },
    { name: 'celebrateOnComplete', type: 'boolean', default: 'false', description: 'Plays a particle-burst animation when the step transitions to complete.' },
  ],
  doDont: [
    { do: 'Use ProgressTracker for linear, sequential flows like checkout or onboarding.', dont: "Don't use ProgressTracker for non-linear navigation — use Tabs instead." },
  ],
  related: ['tabs', 'accordion'],
};
