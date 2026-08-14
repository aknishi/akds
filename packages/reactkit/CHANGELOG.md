# @aknishi/akds-reactkit

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
