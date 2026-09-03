# @aknishi/akds-reactkit

## 1.5.0

### Minor Changes

- 20b0280: Add Alert component
- ccbc99b: AIButton - New component with custom animation styles for triggering generation of AI content.
- 84638da: Add new TextArea component
- 1db5a22: New Toast component.
  Separate component index page Feedback and Overlay sections in the website.
- dc0a2e6: Add basic Table components

### Patch Changes

- Updated dependencies [6a913c7]
- Updated dependencies [c5e53c1]
- Updated dependencies [6a913c7]
- Updated dependencies [02fbb08]
  - @aknishi/akds-tokens@2.1.0

## 1.4.0

### Minor Changes

- 6ba5637: Add controlled usage to Tooltip via new optional `open`/`onOpenChange` props. When omitted, Tooltip behaves exactly as before (hover/focus manage visibility internally); when `open` is provided, visibility is fully controlled by the consumer and hover/focus/blur report requested changes through `onOpenChange` instead of toggling directly.

### Patch Changes

- 6ba5637: Fix insufficient contrast on standalone ToggleButton's pressed state in dark mode. The tinted fill background was pinned to a fixed light primitive color that never adapted for dark mode, while its text color did — producing near-white text on a near-white background for all four color variants (neutral, primary, success, error). The background is now derived from the same theme-aware text color via `color-mix()`, so it stays a correctly-contrasted tint in both themes.
- 6ba5637: Fix Accordion not filling its container width when placed inside a flex or grid layout — it now sets `width: 100%` explicitly instead of relying on default block sizing, which flex/grid items don't inherit.
- 2ef4fa6: Fix motion inconsistencies found by a design-motion-principles audit:

  - Dialog now animates out instead of unmounting instantly, mirroring Drawer's enter/exit pattern
  - AccordionItem's panel animates expand/collapse (height + fade) instead of snapping via the `hidden` attribute
  - Tooltip's entrance uses a calm ease-out instead of a bouncy overshoot curve, and runs faster (320ms → 140ms)
  - Combobox's listbox now animates in, matching DropdownMenu's existing entrance
  - ProgressTrackerStep's check-icon pop only plays on a genuine complete transition, not on every mount of an already-complete step
  - Unified the active-press scale to `0.94` across Button, IconButton, LikeButton, and ToggleButton
  - Fixed a flash/pop on close for Dialog and Drawer caused by a `useEffect`-timing race (switched to `useLayoutEffect`)

## 1.3.1

### Patch Changes

- 26883a4: ProgressTracker - Fix icon colors for error and warning step states
- 26883a4: CardContent now defaults its children to body text typography, so plain text no longer needs to be wrapped in a Text component
- 26883a4: Fix Combobox multiselect menu not opening on focus when an option is already selected, add left/right arrow key navigation between chips, make the entire control — including the chevron — clickable with a pointer cursor to open the menu, and populate + select the input text with the current selection on focus in single-select mode so it can be quickly edited or erased
- 26883a4: Refactor chevron down icons for Accordion, DropdownMenu, and Combobox
- Updated dependencies [26883a4]
  - @aknishi/akds-icons@1.3.0

## 1.3.0

### Minor Changes

- b896785: Toggle - New ToggleButton and ToggleGroup components
- 0fd4581: Text - Add color with semantic color values
- e95add0: Flexbox - Extend gap and spacing properties to accept numbers that resolve to spacing tokens

### Patch Changes

- ec71798: Flexbox - Resolve issue with spacing propagating to Flexbox children
- e95add0: Divider - Fix vertical divider to always have parent height even when it isn't explicit
- Updated dependencies [0d17e56]
- Updated dependencies [511d6e5]
- Updated dependencies [0495add]
- Updated dependencies [6eb09fe]
- Updated dependencies [a2b7320]
  - @aknishi/akds-icons@1.2.0

## 1.2.0

### Minor Changes

- 9881410: Add Combobox, update DropdownMenu label spacing
- be914fe: Add Tabs, refactor ripple effect to a be more sublte.
- 118a362: Refactor Dialog and Drawer icon buttons with new IconButton component
- 53a9711: Refactor components with updated spacing and color tokens.
- 22635b7: Add IconButton and LikeButton components
- 8c6a15c: Add Carousel
- 0f70c17: ProgressTrackerStep - Add particle burst micro animation to progress step with celebrateOnComplete prop
- aaefc23: Add Accordion + AccordionItem components

### Patch Changes

- Updated dependencies [2dbfb06]
- Updated dependencies [2dbfb06]
  - @aknishi/akds-icons@1.1.0
  - @aknishi/akds-tokens@2.0.0

## 1.1.0

### Minor Changes

- Add Switch, Tag, Divider, and Avatar components

## 1.0.2

### Patch Changes

- Enable tree-shaking via ESM code splitting and per-component subpath exports

## 1.0.1

### Patch Changes

- Handle removal of animations for perfer-reduce-motion users as per ADA

## 1.0.0

### Major Changes

- Initial public release
