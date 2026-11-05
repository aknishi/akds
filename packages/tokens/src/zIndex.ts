// Stacking order for page-level layers, lowest to highest. Popovers sit
// above modals so a menu opened inside a dialog shows; tooltips are on top
// because they can belong to anything, including a toast.
export const zIndex = {
  base: 0,
  sticky: 100,
  modal: 300,
  popover: 400,
  toast: 500,
  tooltip: 600,
} as const;

export type ZIndexLayer = keyof typeof zIndex;
