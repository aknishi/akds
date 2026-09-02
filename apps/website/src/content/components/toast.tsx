import { Button, Flexbox, IconButton, useToast } from '@aknishi/akds-reactkit';
import { CheckCircleFilledIcon, CloseIcon } from '@aknishi/akds-icons';
import type { ComponentEntry } from './types';

function EmphasisExample() {
  const { show } = useToast();
  return (
    <Flexbox gap="sm" wrap>
      <Button emphasis="accented" onClick={() => show({ emphasis: 'accented', message: 'A new version is available.' })}>
        Accented
      </Button>
      <Button emphasis="neutral" onClick={() => show({ emphasis: 'neutral', message: 'Link copied to clipboard.' })}>
        Neutral
      </Button>
      <Button emphasis="success" onClick={() => show({ emphasis: 'success', message: 'Payment was successfully received.' })}>
        Success
      </Button>
      <Button emphasis="destructive" onClick={() => show({ emphasis: 'destructive', message: 'Failed to upload file.' })}>
        Destructive
      </Button>
    </Flexbox>
  );
}

function DurationExample() {
  const { show } = useToast();
  return (
    <Flexbox gap="sm" wrap>
      <Button appearance="bordered" emphasis="neutral" onClick={() => show({ message: 'Dismisses after 2 seconds.', duration: 2000 })}>
        Custom duration
      </Button>
      <Button appearance="bordered" emphasis="neutral" onClick={() => show({ message: 'Stays until you close it.', autoDismiss: false })}>
        No auto-dismiss
      </Button>
    </Flexbox>
  );
}

export const toast: ComponentEntry = {
  slug: 'toast',
  name: 'Toast',
  category: 'Feedback',
  summary: 'A transient notification that stacks in a corner of the viewport, triggered imperatively from anywhere in the app.',
  sourcePath: 'packages/reactkit/src/components/Toast',
  storybookId: 'reactkit-toast--docs',
  preview: (
    // Toast only ever renders through a portal (there's no standalone <Toast>
    // element to mount statically), so the preview is a non-interactive replica
    // built from the component's own stable CSS classes rather than the trigger
    // button shown for Dialog/Drawer — this reads as "what a toast looks like"
    // the way Tooltip's forced-open preview does. min-width is overridden
    // since the card's preview slot (~230px) is narrower than a real toast's
    // 320px minimum.
    <div className="akds-toast akds-toast--success" style={{ minWidth: 0, maxWidth: '100%' }}>
      <span className="akds-toast__icon" aria-hidden="true">
        <CheckCircleFilledIcon />
      </span>
      <div className="akds-toast__message">Changes saved.</div>
      <IconButton className="akds-toast__close" appearance="transparent" emphasis="neutral" aria-label="Dismiss notification">
        <CloseIcon size="sm" />
      </IconButton>
    </div>
  ),
  examples: [
    {
      title: 'Emphasis',
      description: "Mount ToastProvider once near your app's root, then call useToast() from anywhere inside it.",
      render: () => <EmphasisExample />,
      code: `import { ToastProvider, useToast, Button } from '@aknishi/akds-reactkit';

function Example() {
  const { show } = useToast();
  return (
    <Button onClick={() => show({ emphasis: 'success', message: 'Payment was successfully received.' })}>
      Show toast
    </Button>
  );
}

// Mount once near your app's root:
export default function App() {
  return (
    <ToastProvider>
      <Example />
    </ToastProvider>
  );
}`,
    },
    {
      title: 'Duration',
      description: "Toasts auto-dismiss after 7 seconds by default. duration customizes the timing, and autoDismiss: false keeps a toast open until it's closed manually.",
      render: () => <DurationExample />,
      code: `<Button onClick={() => show({ message: 'Dismisses after 2 seconds.', duration: 2000 })}>
  Custom duration
</Button>
<Button onClick={() => show({ message: 'Stays until you close it.', autoDismiss: false })}>
  No auto-dismiss
</Button>`,
    },
  ],
  accessibilityNotes: [
    "Each toast auto-dismisses after 7 seconds by default (or a custom duration); autoDismiss: false keeps it open until the user closes it manually with the X button.",
    'Toasts use role="status"/aria-live="polite" for most emphases, and role="alert"/aria-live="assertive" for destructive ones — but changing aria-live on an already-mounted node is unreliably respected across screen readers (notably VoiceOver), and a freshly-created node with aria-live already attached often isn\'t announced at all since the region never registered an empty state to diff against. ToastProvider works around both issues with two permanent, visually hidden live regions (one polite, one assertive) that mount once and never change politeness; each toast\'s message is routed into the matching region, cleared first so a repeated identical message still gets re-announced.',
    "Hovering or focusing a toast pauses its auto-dismiss timer so it can't disappear mid-read; leaving or blurring resumes the remaining time.",
  ],
  props: [
    { name: 'message', type: 'React.ReactNode', description: 'Content rendered inside the toast, passed to show(). Required.' },
    { name: 'emphasis', type: "'accented' | 'neutral' | 'success' | 'destructive'", default: "'neutral'", description: 'Conveys the intent of the toast.' },
    { name: 'placement', type: "'bottom-left' | 'bottom-center' | 'bottom-right'", default: "'bottom-right'", description: 'Corner of the viewport the toast stacks in. Also settable as a ToastProvider default.' },
    { name: 'autoDismiss', type: 'boolean', default: 'true', description: 'When false, the toast stays open until closed manually. Also settable as a ToastProvider default.' },
    { name: 'duration', type: 'number', default: '7000', description: 'Milliseconds before auto-dismissing. Ignored when autoDismiss is false. Also settable as a ToastProvider default.' },
    { name: 'icon', type: 'React.ReactNode', description: 'Overrides the default icon shown for emphasis. Pass null to render no icon.' },
  ],
  doDont: [
    { do: 'Use Toast for lightweight, transient confirmations — saved, copied, sent.', dont: "Don't use Toast for information the user must act on — use Dialog instead, since a toast can be missed or auto-dismiss." },
  ],
  related: ['button', 'dialog'],
};
