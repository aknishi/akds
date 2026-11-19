import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import { useModalDialog } from '../../utils/useModalDialog';

function Harness({ initialOpen = true, onAnimations }: {
  initialOpen?: boolean;
  onAnimations?: (dialog: HTMLDialogElement) => void;
}) {
  const [open, setOpen] = React.useState(initialOpen);
  const { dialogRef, mounted, dialogProps } = useModalDialog({ open, onClose: () => setOpen(false), lightDismiss: true });
  React.useLayoutEffect(() => {
    if (dialogRef.current) onAnimations?.(dialogRef.current);
  });
  return (
    <>
      <button onClick={() => setOpen(o => !o)}>Toggle</button>
      {mounted && (
        <dialog ref={dialogRef} {...dialogProps} aria-label="Test dialog">
          <button>Inside</button>
        </dialog>
      )}
    </>
  );
}

describe('useModalDialog', () => {
  it('waits for the dialog\'s own animations before closing, ignoring descendants\'', async () => {
    let resolveOwn!: () => void;
    const own = new Promise<void>(r => { resolveOwn = r; });
    const descendant = new Promise<void>(() => {});
    render(
      <Harness
        onAnimations={(dialog) => {
          dialog.getAnimations = () => [
            { effect: { target: dialog }, finished: own },
            { effect: { target: dialog.firstElementChild }, finished: descendant },
          ] as unknown as Animation[];
        }}
      />,
    );
    const dialog = screen.getByRole('dialog', { hidden: true }) as HTMLDialogElement;
    act(() => { screen.getByText('Toggle').click(); });
    // Exit is playing: still mounted, marked closing.
    expect(dialog).toHaveAttribute('data-closing');
    expect(dialog.open).toBe(true);

    await act(async () => { resolveOwn(); });
    await waitFor(() => expect(screen.queryByRole('dialog', { hidden: true })).not.toBeInTheDocument());
  });

  it('unmounts without an exit when the dialog was already closed natively', async () => {
    const { container } = render(<Harness />);
    const dialog = container.querySelector('dialog')!;
    // e.g. <form method="dialog">: the browser closes it, `close` fires, the
    // owner sets open=false, and there is nothing left to animate.
    act(() => { dialog.close(); });
    await waitFor(() => expect(container.querySelector('dialog')).toBeNull());
  });

  it('falls back to closedby="closerequest" when light dismiss is off', () => {
    function NoLight() {
      const { dialogProps } = useModalDialog({ open: false, onClose: vi.fn(), lightDismiss: false });
      return <span data-testid="closedby">{dialogProps.closedby}</span>;
    }
    render(<NoLight />);
    expect(screen.getByTestId('closedby')).toHaveTextContent('closerequest');
  });
});
