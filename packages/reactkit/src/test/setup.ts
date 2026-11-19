import '@testing-library/jest-dom';

/*
 * Minimal HTMLDialogElement modal behavior for jsdom, which implements the
 * element but not showModal()/close() or Escape → `cancel`. Mirrors the
 * native contract the components rely on: showModal() sets [open] and focuses
 * the first focusable descendant (or [autofocus]); Escape fires a cancelable
 * `cancel` on the topmost modal and closes it unless prevented; close() fires
 * `close` and returns focus to the element focused before opening.
 */
if (typeof HTMLDialogElement !== 'undefined' && !HTMLDialogElement.prototype.showModal) {
  const FOCUSABLE =
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const modalStack: HTMLDialogElement[] = [];
  const returnFocus = new WeakMap<HTMLDialogElement, Element | null>();

  HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
    if (this.open) return;
    returnFocus.set(this, document.activeElement);
    this.setAttribute('open', '');
    modalStack.push(this);
    const target =
      this.querySelector<HTMLElement>('[autofocus]') ?? this.querySelector<HTMLElement>(FOCUSABLE);
    target?.focus();
  };

  HTMLDialogElement.prototype.show = function show(this: HTMLDialogElement) {
    this.setAttribute('open', '');
  };

  HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
    if (!this.open) return;
    this.removeAttribute('open');
    const i = modalStack.indexOf(this);
    if (i !== -1) modalStack.splice(i, 1);
    const prev = returnFocus.get(this);
    if (prev instanceof HTMLElement && prev.isConnected) prev.focus();
    this.dispatchEvent(new Event('close'));
  };

  // `:modal` matches a dialog opened with showModal() (not show()).
  const originalMatches = Element.prototype.matches;
  Element.prototype.matches = function matches(this: Element, selector: string) {
    if (selector === ':modal') return modalStack.includes(this as HTMLDialogElement) && this.isConnected;
    return originalMatches.call(this, selector);
  };

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || e.defaultPrevented) return;
    // Ignore dialogs that were unmounted while open.
    const top = [...modalStack].reverse().find((d) => d.isConnected);
    if (!top) return;
    if (top.dispatchEvent(new Event('cancel', { cancelable: true }))) top.close();
  });
}
