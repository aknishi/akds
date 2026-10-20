import React from 'react';
import { Button, Flexbox, ProgressTracker, ProgressTrackerStep } from '@aknishi/akds-reactkit';
import type { ComponentEntry } from './types';
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion';
import { useAutoRestartInterval } from '../../lib/useAutoRestartInterval';

const PREVIEW_TOTAL_STEPS = 3;
// Steps advance faster than the shared AUTO_LOOP_INTERVAL_MS cadence — a full
// account→shipping→payment march reads better at a quicker clip than the other
// cards' single state flip, so this preview keeps its own rhythm instead.
const PREVIEW_STEP_INTERVAL_MS = 1000;

// Advances one step per cycle (wrapping back to the start once every step —
// including the celebrateOnComplete burst — has played) for the index page's
// otherwise-static card preview.
function ProgressTrackerAutoLoopPreview() {
  const [currentStep, setCurrentStep] = React.useState(2);
  const prefersReducedMotion = usePrefersReducedMotion();
  useAutoRestartInterval(
    () => setCurrentStep((s) => (s >= PREVIEW_TOTAL_STEPS + 1 ? 1 : s + 1)),
    PREVIEW_STEP_INTERVAL_MS,
    !prefersReducedMotion,
  );
  return (
    <ProgressTracker currentStep={currentStep}>
      <ProgressTrackerStep status={currentStep > 1 ? 'complete' : 'inactive'} label="Account" />
      <ProgressTrackerStep status={currentStep > 2 ? 'complete' : 'inactive'} label="Shipping" />
      <ProgressTrackerStep status={currentStep > 3 ? 'complete' : 'inactive'} label="Payment" celebrateOnComplete />
    </ProgressTracker>
  );
}

const TOTAL_STEPS = 4;

function InteractiveProgressTrackerExample() {
  const [currentStep, setCurrentStep] = React.useState(1);
  return (
    <Flexbox direction="column" gap="lg" align="flex-start">
      <ProgressTracker currentStep={currentStep}>
        <ProgressTrackerStep status={currentStep > 1 ? 'complete' : 'inactive'} label="Account" />
        <ProgressTrackerStep status={currentStep > 2 ? 'complete' : 'inactive'} label="Shipping" />
        <ProgressTrackerStep status={currentStep > 3 ? 'complete' : 'inactive'} label="Payment" />
        <ProgressTrackerStep
          status={currentStep > 4 ? 'complete' : 'inactive'}
          label="Review"
          celebrateOnComplete
        />
      </ProgressTracker>
      <Flexbox gap="sm">
        <Button
          appearance="bordered"
          emphasis="neutral"
          size="sm"
          onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
          disabled={currentStep <= 1}
        >
          Back
        </Button>
        <Button
          appearance="solid"
          emphasis="accented"
          size="sm"
          onClick={() => setCurrentStep((s) => Math.min(TOTAL_STEPS + 1, s + 1))}
          disabled={currentStep > TOTAL_STEPS}
        >
          {currentStep >= TOTAL_STEPS ? 'Finish' : 'Next'}
        </Button>
      </Flexbox>
    </Flexbox>
  );
}

export const progressTracker: ComponentEntry = {
  slug: 'progress-tracker',
  name: 'Progress tracker',
  category: 'Navigation & Disclosure',
  summary: 'A numbered step tracker for multi-step flows, composed of ProgressTrackerStep children.',
  sourcePath: 'packages/reactkit/src/components/ProgressTracker',
  storybookId: 'reactkit-progresstracker--docs',
  preview: <ProgressTrackerAutoLoopPreview />,
  compactPreview: true,
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
    {
      title: 'Statuses',
      description: 'complete, error, warning, active (no status), and inactive shown together.',
      render: () => (
        <ProgressTracker currentStep={4}>
          <ProgressTrackerStep status="complete" label="Complete" />
          <ProgressTrackerStep status="error" label="Error" />
          <ProgressTrackerStep status="warning" label="Warning" />
          <ProgressTrackerStep label="Active" />
          <ProgressTrackerStep label="Inactive" />
        </ProgressTracker>
      ),
      code: `<ProgressTracker currentStep={4}>
  <ProgressTrackerStep status="complete" label="Complete" />
  <ProgressTrackerStep status="error" label="Error" />
  <ProgressTrackerStep status="warning" label="Warning" />
  <ProgressTrackerStep label="Active" />
  <ProgressTrackerStep label="Inactive" />
</ProgressTracker>`,
    },
    {
      title: 'Interactive',
      description: 'Step through the flow to see the fill and status transitions animate, including the celebrateOnComplete burst on the final step.',
      render: () => <InteractiveProgressTrackerExample />,
      code: `function Example() {
  const TOTAL_STEPS = 4;
  const [currentStep, setCurrentStep] = React.useState(1);
  return (
    <>
      <ProgressTracker currentStep={currentStep}>
        <ProgressTrackerStep status={currentStep > 1 ? 'complete' : 'inactive'} label="Account" />
        <ProgressTrackerStep status={currentStep > 2 ? 'complete' : 'inactive'} label="Shipping" />
        <ProgressTrackerStep status={currentStep > 3 ? 'complete' : 'inactive'} label="Payment" />
        <ProgressTrackerStep
          status={currentStep > 4 ? 'complete' : 'inactive'}
          label="Review"
          celebrateOnComplete
        />
      </ProgressTracker>
      <Button
        appearance="bordered"
        emphasis="neutral"
        size="sm"
        onClick={() => setCurrentStep(s => Math.max(1, s - 1))}
        disabled={currentStep <= 1}
      >
        Back
      </Button>
      <Button
        appearance="solid"
        emphasis="accented"
        size="sm"
        onClick={() => setCurrentStep(s => Math.min(TOTAL_STEPS + 1, s + 1))}
        disabled={currentStep > TOTAL_STEPS}
      >
        {currentStep >= TOTAL_STEPS ? 'Finish' : 'Next'}
      </Button>
    </>
  );
}`,
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
    { do: 'Use Progress tracker for linear, sequential flows like checkout or onboarding.', dont: "Don't use Progress tracker for non-linear navigation — use Tabs instead." },
  ],
  related: ['tabs', 'accordion'],
};
