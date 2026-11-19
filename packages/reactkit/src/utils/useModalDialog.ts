import React from 'react';

interface UseModalDialogOptions {
  /** Controlled open state. */
  open: boolean;
  /** Called when the user asks to close (Escape, back gesture, backdrop click). */
  onClose: () => void;
  /** When true, clicking the backdrop requests close. */
  lightDismiss: boolean;
  /**
   * Plays the exit and resolves when the dialog can be closed. Runs after
   * `data-closing` is set. Defaults to waiting for the dialog's own and its
   * ::backdrop's CSS transitions.
   */
  exit?: (dialog: HTMLDialogElement) => Promise<void>;
}

const supportsClosedBy = () =>
  typeof HTMLDialogElement !== 'undefined' && 'closedBy' in HTMLDialogElement.prototype;

// Pointer-position test (not event.target): the <dialog> is also the target
// for clicks on its own padding, so a target check would close on those.
function isOutside(e: PointerEvent, el: HTMLElement) {
  const r = el.getBoundingClientRect();
  return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
}

/**
 * Default exit: the caller has set `data-closing` (the open-state CSS is
 * scoped to `:not([data-closing])`), so resolve once the dialog's own and
 * its ::backdrop's transitions finish. Works the same in browsers without
 * `overlay` / discrete `display` transition support (Firefox, Safari).
 * Descendant animations are ignored so e.g. a spinner inside the dialog can't
 * hold the close open.
 */
async function playExit(dialog: HTMLDialogElement) {
  if (typeof dialog.getAnimations !== 'function') return;
  const animations = dialog
    .getAnimations({ subtree: true })
    .filter((a) => (a.effect as KeyframeEffect | null)?.target === dialog);
  if (animations.length === 0) return;
  await Promise.race([
    Promise.allSettled(animations.map((a) => a.finished)),
    new Promise((r) => setTimeout(r, 1000)),
  ]);
}

/**
 * Drives a native modal `<dialog>` from a controlled `open` prop: opens it with
 * `showModal()` (top layer, inert page, focus containment, focus return),
 * routes Escape / light dismiss through `onClose` so the parent stays the
 * source of truth, and keeps the element mounted until the exit transition
 * finishes.
 */
export function useModalDialog({ open, onClose, lightDismiss, exit }: UseModalDialogOptions) {
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const [mounted, setMounted] = React.useState(open);
  if (open && !mounted) setMounted(true);

  const openRef = React.useRef(open);
  const onCloseRef = React.useRef(onClose);
  const exitRef = React.useRef(exit);
  React.useLayoutEffect(() => {
    openRef.current = open;
    onCloseRef.current = onClose;
    exitRef.current = exit;
  });

  // Open / animate-close in response to the `open` prop.
  React.useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      dialog.removeAttribute('data-closing');
      if (!dialog.open) dialog.showModal();
      return;
    }

    if (!dialog.open) {
      setMounted(false);
      return;
    }

    let cancelled = false;
    dialog.setAttribute('data-closing', '');
    (exitRef.current ?? playExit)(dialog).then(() => {
      // Reopened mid-exit: the open branch above already restored it.
      if (cancelled || !dialog.hasAttribute('data-closing')) return;
      dialog.removeAttribute('data-closing');
      dialog.close();
      setMounted(false);
    });
    return () => {
      cancelled = true;
    };
  }, [open, mounted]);

  // Native close requests and light dismiss.
  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    // Escape / back gesture / closedby="any" fire `cancel`. Prevent the
    // instant native close and ask the parent instead, so the exit animates.
    // Browsers may make repeated cancels non-cancelable; then the dialog
    // closes natively and the `close` handler below syncs the parent.
    const handleCancel = (e: Event) => {
      if (!e.cancelable) return;
      e.preventDefault();
      onCloseRef.current();
    };

    // The dialog closed without us (e.g. a `<form method="dialog">` inside
    // it, or a non-cancelable Escape) while the parent still thinks it's open.
    const handleClose = () => {
      if (openRef.current) onCloseRef.current();
    };

    dialog.addEventListener('cancel', handleCancel);
    dialog.addEventListener('close', handleClose);

    // Light-dismiss fallback for browsers without `closedby` (Safari).
    // Require press and release outside so a text-selection drag that ends
    // on the backdrop doesn't dismiss.
    let pressedOutside = false;
    // Backdrop presses target the <dialog> itself; a press on a descendant
    // drawn outside its box (e.g. a toast moved into the dialog) is not one.
    const handlePointerDown = (e: PointerEvent) => {
      pressedOutside = e.target === dialog && isOutside(e, dialog);
    };
    const handlePointerUp = (e: PointerEvent) => {
      if (pressedOutside && isOutside(e, dialog)) onCloseRef.current();
      pressedOutside = false;
    };
    const needsFallback = lightDismiss && !supportsClosedBy();
    if (needsFallback) {
      dialog.addEventListener('pointerdown', handlePointerDown);
      dialog.addEventListener('pointerup', handlePointerUp);
    }

    return () => {
      dialog.removeEventListener('cancel', handleCancel);
      dialog.removeEventListener('close', handleClose);
      if (needsFallback) {
        dialog.removeEventListener('pointerdown', handlePointerDown);
        dialog.removeEventListener('pointerup', handlePointerUp);
      }
    };
  }, [mounted, lightDismiss]);

  return {
    dialogRef,
    mounted,
    /** Spread onto the `<dialog>`; React 18 has no typing for `closedby`. */
    dialogProps: { closedby: lightDismiss ? 'any' : 'closerequest' } as Record<string, string>,
  };
}
