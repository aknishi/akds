import type { Meta } from '@storybook/react-vite';
import { Alert } from './Alert';
import { AlertTitle } from '../AlertTitle';
import { LiveEditStory } from '../../utils/LiveEditStory';

const meta: Meta<typeof Alert> = {
  title: 'Reactkit/Alert',
  component: Alert,
  subcomponents: { AlertTitle },
  argTypes: {
    emphasis: { control: 'select', options: ['info', 'success', 'warning', 'error'] },
    variant: { control: 'select', options: ['default', 'filled'] },
  },
};

export default meta;

export const Default = LiveEditStory({
  component: Alert,
  code: `import { Alert } from '@aknishi/akds-reactkit';

const AlertExample = () => (
  <Alert>
    A new version of the app is available. Refresh to update.
  </Alert>
);

export default AlertExample;
`,
});

export const Emphasis = LiveEditStory({
  component: Alert,
  code: `import { Alert } from '@aknishi/akds-reactkit';

const AlertExample = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
    <Alert emphasis="info">A new version of the app is available.</Alert>
    <Alert emphasis="success">Your changes were saved successfully.</Alert>
    <Alert emphasis="warning">Your storage is almost full.</Alert>
    <Alert emphasis="error">Failed to save changes. Please try again.</Alert>
  </div>
);

export default AlertExample;
`,
});

export const Filled = LiveEditStory({
  component: Alert,
  code: `import { Alert } from '@aknishi/akds-reactkit';

const AlertExample = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
    <Alert variant="filled" emphasis="info">A new version of the app is available.</Alert>
    <Alert variant="filled" emphasis="success">Your changes were saved successfully.</Alert>
    <Alert variant="filled" emphasis="warning">Your storage is almost full.</Alert>
    <Alert variant="filled" emphasis="error">Failed to save changes. Please try again.</Alert>
  </div>
);

export default AlertExample;
`,
});

export const WithTitle = LiveEditStory({
  component: Alert,
  code: `import { Alert, AlertTitle } from '@aknishi/akds-reactkit';

const AlertExample = () => (
  <Alert emphasis="warning">
    <AlertTitle>Storage almost full</AlertTitle>
    You have used 95% of your available storage. Free up space or upgrade your plan to avoid interruptions.
  </Alert>
);

export default AlertExample;
`,
});

export const CustomIcon = LiveEditStory({
  component: Alert,
  code: `import { Alert } from '@aknishi/akds-reactkit';
import { StarFilledIcon } from '@aknishi/akds-icons';

const AlertExample = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
    <Alert emphasis="success" icon={<StarFilledIcon size="md" />}>
      You've unlocked a new achievement.
    </Alert>
    <Alert emphasis="info" icon={false}>
      No icon is rendered for this alert.
    </Alert>
  </div>
);

export default AlertExample;
`,
});

export const WithAction = LiveEditStory({
  component: Alert,
  code: `import React from 'react';
import { Alert, IconButton, Button, Menu, MenuItem } from '@aknishi/akds-reactkit';
import { CloseIcon, MoreVertIcon } from '@aknishi/akds-icons';

const AlertExample = () => {
  const [visible, setVisible] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {visible && (
        <Alert
          emphasis="warning"
          action={
            <IconButton
              appearance="transparent"
              emphasis="neutral"
              aria-label="Dismiss"
              onClick={() => setVisible(false)}
            >
              <CloseIcon size="sm" />
            </IconButton>
          }
        >
          Your session will expire in 5 minutes.
        </Alert>
      )}

      <div style={{ position: 'relative' }}>
        <Alert
          emphasis="info"
          action={
            <IconButton
              ref={triggerRef}
              appearance="transparent"
              emphasis="neutral"
              aria-label="More options"
              onClick={() => setOpen(o => !o)}
            >
              <MoreVertIcon size="sm" />
            </IconButton>
          }
        >
          A new version of the app is available.
        </Alert>
        <Menu open={open} onOpenChange={setOpen} triggerRef={triggerRef}>
          <MenuItem onClick={() => setOpen(false)}>Refresh now</MenuItem>
          <MenuItem onClick={() => setOpen(false)}>Remind me later</MenuItem>
        </Menu>
      </div>

      <Alert
        emphasis="error"
        action={
          <Button appearance="bordered" emphasis="neutral" size="sm">
            Retry
          </Button>
        }
      >
        Failed to save changes.
      </Alert>
    </div>
  );
};

export default AlertExample;
`,
});
