import { vi } from 'vitest';

/**
 * jsdom has no Popover API. This installs a minimal stand-in so the native
 * top-layer path can be exercised: show/hide track state, `:popover-open`
 * matching reflects it, and `toggle` events can be fired by tests.
 * Real positioning / top-layer rendering can't be verified in jsdom.
 */
export function stubPopoverApi(options: { anchorPositioning?: boolean } = {}) {
  const proto = HTMLElement.prototype as unknown as Record<string, unknown>;
  const shown = new WeakSet<Element>();
  const originalMatches = Element.prototype.matches;
  const originalCSS = (globalThis as { CSS?: unknown }).CSS;

  Object.defineProperty(proto, 'popover', {
    configurable: true,
    get(this: HTMLElement) { return this.getAttribute('popover'); },
    set(this: HTMLElement, v: string) { this.setAttribute('popover', v); },
  });
  const showPopover = vi.fn(function (this: HTMLElement) { shown.add(this); });
  const hidePopover = vi.fn(function (this: HTMLElement) { shown.delete(this); });
  proto.showPopover = showPopover;
  proto.hidePopover = hidePopover;
  Element.prototype.matches = function (this: Element, selector: string) {
    if (selector === ':popover-open') return shown.has(this);
    return originalMatches.call(this, selector);
  };
  if (options.anchorPositioning) {
    (globalThis as { CSS?: unknown }).CSS = {
      supports: (prop: string) => prop === 'position-area',
    };
  }

  /** Simulates the browser closing the popover (light dismiss / Escape). */
  const nativeClose = (el: HTMLElement) => {
    el.dispatchEvent(Object.assign(new Event('beforetoggle'), { newState: 'closed' }));
    shown.delete(el);
    el.dispatchEvent(Object.assign(new Event('toggle'), { newState: 'closed' }));
  };

  const restore = () => {
    delete proto.popover;
    delete proto.showPopover;
    delete proto.hidePopover;
    Element.prototype.matches = originalMatches;
    (globalThis as { CSS?: unknown }).CSS = originalCSS;
  };

  return { showPopover, hidePopover, nativeClose, isShown: (el: Element) => shown.has(el), restore };
}
