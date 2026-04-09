import type { Meta } from '@storybook/react-vite';
import { ProgressTracker } from './ProgressTracker';
import { ProgressTrackerStep } from '../ProgressTrackerStep';
import { LiveEditStory } from '../../utils/LiveEditStory';

const meta: Meta<typeof ProgressTracker> = {
  title: 'Reactkit/ProgressTracker',
  component: ProgressTracker,
  subcomponents: { ProgressTrackerStep },
  argTypes: {
    currentStep: { control: 'number' },
  },
};

export default meta;

export const Default = LiveEditStory({
  component: ProgressTracker,
  code: `import { ProgressTracker, ProgressTrackerStep } from '@aknishi/akds-reactkit';

const Example = () => (
  <ProgressTracker currentStep={2}>
    <ProgressTrackerStep status="complete" label="Select workspace" />
    <ProgressTrackerStep label="Select teams" />
    <ProgressTrackerStep label="Map users" />
  </ProgressTracker>
);

export default Example;
`,
});

export const Statuses = LiveEditStory({
  component: ProgressTracker,
  code: `import { ProgressTracker, ProgressTrackerStep } from '@aknishi/akds-reactkit';

const Example = () => (
  <ProgressTracker currentStep={4}>
    <ProgressTrackerStep status="complete" label="Complete" />
    <ProgressTrackerStep status="error" label="Error" />
    <ProgressTrackerStep status="warning" label="Warning" />
    <ProgressTrackerStep label="Active" />
    <ProgressTrackerStep label="Inactive" />
  </ProgressTracker>
);

export default Example;
`,
});

export const Interactive = LiveEditStory({
  component: ProgressTracker,
  code: `import React from 'react';
import { ProgressTracker, ProgressTrackerStep, Button } from '@aknishi/akds-reactkit';

const Example = () => {
  const [currentStep, setStep] = React.useState(1);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <ProgressTracker currentStep={currentStep}>
        <ProgressTrackerStep
          status={currentStep > 1 ? 'complete' : 'inactive'}
          label="Select workspace"
        />
        <ProgressTrackerStep
          status={currentStep > 2 ? 'error' : 'inactive'}
          label="Select teams"
        />
        <ProgressTrackerStep
          status={currentStep > 3 ? 'complete' : 'inactive'}
          label="Map users"
        />
        <ProgressTrackerStep
          status={currentStep > 4 ? 'complete' : 'inactive'}
          label="Map users"
        />
      </ProgressTracker>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button
          appearance="bordered"
          emphasis="neutral"
          size="sm"
          onClick={() => setStep(s => Math.max(1, s - 1))}
          disabled={currentStep <= 1}
        >
          Back
        </Button>
        <Button
          appearance="solid"
          emphasis="accented"
          size="sm"
          onClick={() => setStep(s => Math.min(5, s + 1))}
          disabled={currentStep >= 5}
        >
          {currentStep >= 4 ? 'Finish' : 'Next'}
        </Button>
      </div>
    </div>
  );
};

export default Example;
`,
});
