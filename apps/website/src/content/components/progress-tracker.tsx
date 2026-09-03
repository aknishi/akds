import React from 'react';
import { Button, Flexbox, ProgressTracker, ProgressTrackerStep } from '@aknishi/akds-reactkit';
import type { ComponentEntry } from './types';

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
  preview: (
    <ProgressTracker currentStep={2}>
      <ProgressTrackerStep label="Account" status="complete" />
      <ProgressTrackerStep label="Shipping" active />
      <ProgressTrackerStep label="Payment" status="inactive" />
    </ProgressTracker>
  ),
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
