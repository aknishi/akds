import type { Meta } from '@storybook/react-vite';
import { ToastProvider } from './Toast';
import { LiveEditStory } from '../../utils/LiveEditStory';

const meta: Meta<typeof ToastProvider> = {
  title: 'Reactkit/Toast',
  component: ToastProvider,
  argTypes: {
    placement: { control: 'select', options: ['bottom-left', 'bottom-center', 'bottom-right'] },
    autoDismiss: { control: 'boolean' },
    duration: { control: 'number' },
  },
};

export default meta;

export const Default = LiveEditStory({
  component: ToastProvider,
  code: `import { ToastProvider, useToast, Button } from '@aknishi/akds-reactkit';

const ToastExample = () => {
  const { show } = useToast();
  return (
    <Button onClick={() => show({ message: 'Your changes have been saved.' })}>
      Show toast
    </Button>
  );
};

const Example = () => (
  <ToastProvider>
    <ToastExample />
  </ToastProvider>
);

export default Example;
`,
});

export const Emphasis = LiveEditStory({
  component: ToastProvider,
  code: `import { ToastProvider, useToast, Button, Flexbox } from '@aknishi/akds-reactkit';

const ToastExample = () => {
  const { show } = useToast();
  return (
    <Flexbox gap="sm">
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
};

const Example = () => (
  <ToastProvider>
    <ToastExample />
  </ToastProvider>
);

export default Example;
`,
});

export const Placement = LiveEditStory({
  component: ToastProvider,
  code: `import { ToastProvider, useToast, Button, Flexbox } from '@aknishi/akds-reactkit';

const ToastExample = () => {
  const { show } = useToast();
  let count = 0;
  const next = (placement) => () => {
    count += 1;
    show({ placement, message: \`Notification #\${count}\` });
  };
  return (
    <Flexbox gap="sm">
      <Button onClick={next('bottom-left')}>Bottom left</Button>
      <Button onClick={next('bottom-center')}>Bottom center</Button>
      <Button onClick={next('bottom-right')}>Bottom right</Button>
    </Flexbox>
  );
};

const Example = () => (
  <ToastProvider>
    <ToastExample />
  </ToastProvider>
);

export default Example;
`,
});

export const Duration = LiveEditStory({
  component: ToastProvider,
  code: `import { ToastProvider, useToast, Button, Flexbox } from '@aknishi/akds-reactkit';

const ToastExample = () => {
  const { show } = useToast();
  return (
    <Flexbox gap="sm">
      <Button onClick={() => show({ message: 'Dismisses after 2 seconds.', duration: 2000 })}>
        Custom duration
      </Button>
      <Button onClick={() => show({ message: 'Stays until you close it.', autoDismiss: false })}>
        No auto-dismiss
      </Button>
    </Flexbox>
  );
};

const Example = () => (
  <ToastProvider>
    <ToastExample />
  </ToastProvider>
);

export default Example;
`,
});
