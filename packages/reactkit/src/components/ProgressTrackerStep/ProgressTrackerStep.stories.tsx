import type { Meta } from '@storybook/react-vite';
import { ProgressTrackerStep } from './ProgressTrackerStep';
import { LiveEditStory } from '../../utils/LiveEditStory';

const meta: Meta<typeof ProgressTrackerStep> = {
  title: 'Components/ProgressTrackerStep',
  component: ProgressTrackerStep,
  tags: ['autodocs'],
  argTypes: {
    status: { control: 'select', options: ['complete', 'inactive', 'error', 'warning'] },
    active: { control: 'boolean' },
  },
};

export default meta;

export const Default = LiveEditStory({
  component: ProgressTrackerStep,
  code: `import { ProgressTracker, ProgressTrackerStep } from '@aknishi/akds-reactkit';

const Example = () => (
  <ProgressTracker currentStep={2}>
    <ProgressTrackerStep status="complete" label="Step 1" />
    <ProgressTrackerStep label="Step 2" />
    <ProgressTrackerStep label="Step 3" />
  </ProgressTracker>
);

export default Example;
`,
});

export const Statuses = LiveEditStory({
  component: ProgressTrackerStep,
  code: `import { ProgressTracker, ProgressTrackerStep } from '@aknishi/akds-reactkit';

const Example = () => (
  <ProgressTracker currentStep={-1}>
    <ProgressTrackerStep status="complete" label="Complete" />
    <ProgressTrackerStep status="inactive" label="Inactive" />
    <ProgressTrackerStep status="error" label="Error" />
    <ProgressTrackerStep status="warning" label="Warning" />
  </ProgressTracker>
);

export default Example;
`,
});
