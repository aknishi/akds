import React from 'react';
import { Alert, AlertTitle, Button, IconButton, Menu, MenuItem } from '@aknishi/akds-reactkit';
import { CloseIcon, MoreVertIcon } from '@aknishi/akds-icons';
import type { ComponentEntry } from './types';

function WithActionExamples() {
  const [visible, setVisible] = React.useState(true);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuTriggerRef = React.useRef<HTMLButtonElement>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
      {visible ? (
        <Alert
          emphasis="warning"
          action={
            <IconButton appearance="transparent" emphasis="neutral" aria-label="Dismiss" onClick={() => setVisible(false)}>
              <CloseIcon size="sm" />
            </IconButton>
          }
        >
          Your session will expire in 5 minutes.
        </Alert>
      ) : (
        <Button appearance="bordered" emphasis="neutral" size="sm" onClick={() => setVisible(true)}>
          Restore alert
        </Button>
      )}

      <div style={{ position: 'relative' }}>
        <Alert
          emphasis="info"
          action={
            <IconButton
              ref={menuTriggerRef}
              appearance="transparent"
              emphasis="neutral"
              aria-label="More options"
              onClick={() => setMenuOpen((o) => !o)}
            >
              <MoreVertIcon size="sm" />
            </IconButton>
          }
        >
          A new version of the app is available.
        </Alert>
        <Menu open={menuOpen} onOpenChange={setMenuOpen} triggerRef={menuTriggerRef}>
          <MenuItem onClick={() => setMenuOpen(false)}>Refresh now</MenuItem>
          <MenuItem onClick={() => setMenuOpen(false)}>Remind me later</MenuItem>
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
}

export const alert: ComponentEntry = {
  slug: 'alert',
  name: 'Alert',
  category: 'Feedback',
  summary: 'An inline status message with a severity-colored icon and text, on either a tinted or solid background.',
  sourcePath: 'packages/reactkit/src/components/Alert',
  storybookId: 'reactkit-alert--docs',
  preview: <Alert emphasis="info">A new version is available.</Alert>,
  examples: [
    {
      title: 'Emphasis',
      description: 'emphasis conveys the severity of the message and determines the status icon and color.',
      render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
          <Alert emphasis="info">A new version of the app is available.</Alert>
          <Alert emphasis="success">Your changes were saved successfully.</Alert>
          <Alert emphasis="warning">Your storage is almost full.</Alert>
          <Alert emphasis="error">Failed to save changes. Please try again.</Alert>
        </div>
      ),
      code: `<Alert emphasis="info">A new version of the app is available.</Alert>
<Alert emphasis="success">Your changes were saved successfully.</Alert>
<Alert emphasis="warning">Your storage is almost full.</Alert>
<Alert emphasis="error">Failed to save changes. Please try again.</Alert>`,
    },
    {
      title: 'Filled variant',
      description: 'variant="filled" swaps the tinted background for a solid status color with white text.',
      render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
          <Alert variant="filled" emphasis="info">A new version of the app is available.</Alert>
          <Alert variant="filled" emphasis="success">Your changes were saved successfully.</Alert>
          <Alert variant="filled" emphasis="warning">Your storage is almost full.</Alert>
          <Alert variant="filled" emphasis="error">Failed to save changes. Please try again.</Alert>
        </div>
      ),
      code: `<Alert variant="filled" emphasis="info">A new version of the app is available.</Alert>
<Alert variant="filled" emphasis="success">Your changes were saved successfully.</Alert>
<Alert variant="filled" emphasis="warning">Your storage is almost full.</Alert>
<Alert variant="filled" emphasis="error">Failed to save changes. Please try again.</Alert>`,
    },
    {
      title: 'With title',
      description: 'Compose AlertTitle with body text for a longer message that needs a heading.',
      render: () => (
        <Alert emphasis="warning">
          <AlertTitle>Storage almost full</AlertTitle>
          You have used 95% of your available storage. Free up space or upgrade your plan.
        </Alert>
      ),
      code: `<Alert emphasis="warning">
  <AlertTitle>Storage almost full</AlertTitle>
  You have used 95% of your available storage. Free up space or upgrade your plan.
</Alert>`,
    },
    {
      title: 'With action',
      description: 'action renders arbitrary content at the end of the alert — a dismiss button, a menu trigger, or any other control.',
      render: () => <WithActionExamples />,
      code: `<Alert
  emphasis="warning"
  action={
    <IconButton appearance="transparent" emphasis="neutral" aria-label="Dismiss" onClick={() => setVisible(false)}>
      <CloseIcon size="sm" />
    </IconButton>
  }
>
  Your session will expire in 5 minutes.
</Alert>

<Alert
  emphasis="info"
  action={
    <IconButton ref={menuTriggerRef} appearance="transparent" emphasis="neutral" aria-label="More options" onClick={() => setMenuOpen(o => !o)}>
      <MoreVertIcon size="sm" />
    </IconButton>
  }
>
  A new version of the app is available.
</Alert>
<Menu open={menuOpen} onOpenChange={setMenuOpen} triggerRef={menuTriggerRef}>
  <MenuItem onClick={() => setMenuOpen(false)}>Refresh now</MenuItem>
  <MenuItem onClick={() => setMenuOpen(false)}>Remind me later</MenuItem>
</Menu>

<Alert
  emphasis="error"
  action={
    <Button appearance="bordered" emphasis="neutral" size="sm">
      Retry
    </Button>
  }
>
  Failed to save changes.
</Alert>`,
    },
  ],
  accessibilityNotes: [
    'The root renders role="alert"/aria-live="assertive" for emphasis="error", and role="status"/aria-live="polite" for the other three emphases.',
    'The status icon is decorative (aria-hidden) — the emphasis color is never the only signal, since the message text itself states the status.',
    "Both variant backgrounds (tinted and filled) are verified against their paired text color to meet WCAG AA (4.5:1) contrast in both light and dark mode.",
  ],
  props: [
    { name: 'emphasis', type: "'info' | 'success' | 'warning' | 'error'", default: "'info'", description: 'Conveys the severity of the message. Determines the status icon and status color.' },
    { name: 'variant', type: "'default' | 'filled'", default: "'default'", description: 'default uses a tinted background with status-colored text; filled uses a solid status-colored background with white text.' },
    { name: 'icon', type: 'React.ReactNode', description: 'Overrides the default icon for the current emphasis. Pass false to hide the icon entirely.' },
    { name: 'action', type: 'React.ReactNode', description: 'Content rendered at the end of the alert, such as a dismiss Icon button or a menu trigger.' },
    { name: 'children', type: 'React.ReactNode', description: 'Content rendered inside the alert. Compose with AlertTitle and body text. Required.' },
  ],
  doDont: [
    { do: 'Use emphasis="error" for problems that need role="alert"\'s assertive announcement.', dont: "Don't rely on Alert alone for information the user must act on immediately — use Dialog when the app needs to block until they respond." },
  ],
  related: ['toast', 'tag'],
};
