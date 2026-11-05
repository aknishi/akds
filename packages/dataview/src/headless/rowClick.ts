import type React from 'react';

/**
 * Marks an element whose clicks never open a row's details. DataView puts it
 * on the selection and actions regions; teams can add it to their own
 * elements too.
 */
export const IGNORE_CLICK_ATTRIBUTE = 'data-dataview-ignore-click';

// Interactive elements handle their own clicks, so a click on one is never
// also a row click. The Details button is a button, so its own handler runs
// and the row's doesn't: the click handler runs exactly once.
const IGNORE_SELECTOR = [
  'button',
  'a[href]',
  'input',
  'select',
  'textarea',
  'label',
  '[role="button"]',
  '[role="menuitem"]',
  '[role="checkbox"]',
  '[contenteditable="true"]',
  `[${IGNORE_CLICK_ATTRIBUTE}]`,
].join(', ');

/**
 * Whether a click on a row or card should be ignored rather than open its
 * details. Checked instead of stopPropagation, so other click listeners on
 * the page keep working.
 */
export function shouldIgnoreRowClick(event: React.MouseEvent<HTMLElement>): boolean {
  const container = event.currentTarget;
  const target = event.target as Element;
  // React events bubble through portals, so a click in a menu rendered at
  // the end of the body still reaches the row. It didn't happen in the row.
  if (!container.contains(target)) return true;
  const match = target.closest(IGNORE_SELECTOR);
  if (match && container.contains(match)) return true;
  // The click that ends a text selection: let users select and copy text.
  if (window.getSelection()?.toString()) return true;
  return false;
}
