# @aknishi/akds-reactkit

## 1.7.0

### Minor Changes

- 4616f5f: New accessibility props:

  - **Checkbox / Radio / Switch** — new `required` and `autoFocus` props, forwarded to the inner `<input>`.
  - **Spinner** — new optional `label` prop; when set, the spinner is exposed as a labelled `progressbar`. Without it, it remains decorative (`aria-hidden`).

- 4616f5f: - **ThemeProvider** — new `'system'` theme, now the **default** (was `'light'`). In `'system'` the provider removes `data-theme`, so the page follows the OS color scheme, including live OS changes. `useTheme()` now also returns `resolvedTheme` (`'light' | 'dark'`, the scheme actually rendered). New exported type `ResolvedTheme`. **Behavior change:** apps that render `<ThemeProvider>` without `defaultTheme`/`theme` were forced to light; they now follow the OS. Pass `defaultTheme="light"` to keep the old behavior.
- 4616f5f: - **Drawer** — new `aria-label` prop to name drawers that have no `title`.
- 4616f5f: New form features:

  - **TextInput / TextArea** — native constraint validation (`required`, `pattern`, `type="email"`, …) now gets error styling, but only after the user has interacted with the field (`:user-invalid`, with a JS fallback for older browsers). The browser's validation message is shown and linked via `aria-describedby`. **Behavior change:** `aria-invalid="false"` is now always rendered until the field is invalid (the `error` prop still forces `true`).
  - **TextArea** — new `autoGrow` (default `true`) and `maxRows` props. **Behavior change:** `resizable={false}` now only hides the resize handle and no longer disables auto-grow; use `autoGrow={false}` for a fixed height.
  - **Combobox** — new `name` prop renders hidden inputs so the value submits with a form (one per value when `multiple`), and `required` now participates in native form validation.

- 4616f5f: - **Drawer** — swipe to dismiss on all four sides. The panel sits in a native scroll-snap scroller with an "open" and a "closed" stop, so the swipe has native momentum and the backdrop dims with the finger (scroll-driven animation, with a script fallback). Swiping away, Escape, the close button and backdrop taps all call `onClose`; if the parent keeps `open` true, the drawer snaps back. `disableBackdropClose` turns off backdrop taps only. With reduced motion, opening and closing are instant.

### Patch Changes

- 4616f5f: Accessibility fixes across form controls, buttons, tabs, and the carousel:

  - **Checkbox / Radio / Switch** — `aria-*`, `id`, `required`, `form`, and `autoFocus` are now forwarded to the inner `<input>` instead of the wrapping `<label>`, so `aria-describedby`, `aria-invalid`, and `required` actually reach the form control. `className`, `style`, `data-*`, and event handlers still land on the label. Removed the redundant `aria-disabled` (native `disabled` already conveys it).
  - **Button / IconButton / AIButton** — while `loading`, the button now uses `aria-disabled` instead of native `disabled`, so the button the user just activated keeps keyboard focus. Clicks are still blocked and the disabled class is still applied. **Behavior change:** a loading button no longer matches `:disabled` and `toBeDisabled()`; an explicit `disabled` prop still sets native `disabled`.
  - **AIButton** — only the active label (default or `loadingLabel`) is exposed to assistive tech (the inactive one is `aria-hidden`, but both stay rendered so the button width doesn't jump), and string labels are exposed as a whole via `aria-label` rather than letter-by-letter. The sparkle icon is now `aria-hidden`. Added `prefers-reduced-motion` handling: the per-letter scale/blur burst, infinite letter pulse, and icon flicker are disabled; the label crossfade remains.
  - **LikeButton** — now exposes its state via `aria-pressed` and has a default accessible name of `"Like"` (override with `aria-label`).
  - **Combobox** — Enter no longer selects an option while an IME composition (e.g. Japanese, Chinese, Korean input) is in progress.
  - **Tabs** — each `Tab` and `TabPanel` are now linked via `id` / `aria-controls` / `aria-labelledby`. Inactive panels remain in the DOM as empty, `hidden` elements (content still only mounts when its tab is active).
  - **Carousel** — in `loop` mode, the off-screen duplicate slide sets are now `aria-hidden` and `inert`, so each slide is announced once and focus never lands in a copy.
  - **Spinner** — under `prefers-reduced-motion`, it now spins slowly instead of stopping entirely, so it still reads as loading.

- 4616f5f: Native UI now matches the theme, and themed subtrees, OS dark mode and Windows High Contrast render correctly:

  - **tokens** — `:root` declares `color-scheme: light dark`, and `[data-theme="light"]` / `[data-theme="dark"]` set `color-scheme: light` / `dark`. Scrollbars, native form controls, and the page canvas now match the active theme instead of staying light in dark mode.
  - **tokens** — added a `[data-theme="light"]` token block. A light-themed subtree inside an OS-dark (or `data-theme="dark"`) page previously inherited the dark tokens; it now renders light. Composite tokens that reference other tokens (`--akds-outline-focus`) are redeclared in each theme block, so focus rings use the right color inside themed subtrees.
  - **tokens** — a themed subtree (any non-root `[data-theme]` element) now gets `background-color: var(--akds-color-surface-default)` and `color: var(--akds-color-text-primary-default)`, so text and background always come from the same scheme.
  - **AIButton** — dark-mode styling for its glow, bevels, loading, and hover states now also applies when dark mode comes from the OS preference (previously only the base colors switched, leaving a half-dark button), and a light-themed subtree keeps the light treatment. Also fixed a malformed `transition` on the glow layer that was being discarded.
  - **Forced colors (Windows High Contrast)** — Button, IconButton, ToggleButton, ToggleGroup, Tabs, Checkbox, Radio, Switch, and listbox options now keep visible boundaries and checked/selected/pressed states. These were drawn with `box-shadow` or background fills, which forced colors removes; they now use outlines and system colors (`Highlight`, `ButtonText`, `CanvasText`, `GrayText`).

- 4616f5f: Overlays now use native top-layer platform features instead of hand-built positioning, focus traps, and z-index stacking:

  - **Dialog / Drawer** — rendered as a native `<dialog>` opened with `showModal()`. The browser now provides the backdrop (`::backdrop`), inert page, focus containment, Escape / back-gesture handling, and focus return to the trigger on close (previously focus was not returned). Backdrop click uses `closedby="any"` with a pointer-based fallback for Safari. The `body { overflow: hidden }` scroll lock is replaced by `overscroll-behavior: contain` on the dialog and backdrop, so the page scrollbar no longer disappears. Enter/exit animations use `@starting-style` and discrete transitions, with a `data-closing` exit for browsers without `overlay` support; reduced motion gets a short fade. Escape and backdrop clicks still go through `onClose`, so `open` remains the source of truth.
  - **Menu / DropdownMenu / Combobox** — popups are now popovers in the top layer (`popover="auto"` for Menu and DropdownMenu, `popover="manual"` for Combobox so focus stays in the input), anchored with CSS anchor positioning and flipping on both axes. They are no longer clipped by overflow containers or dialogs. Fallbacks: script positioning when anchor positioning is unsupported, and the previous portal or absolute positioning when the Popover API is unsupported. Menu now returns focus to the trigger on Escape and on item activation, and only moves focus into the menu on keyboard opens (pointer opens leave focus on the trigger).
  - **Tooltip** — `popover="hint"` in the top layer with anchor positioning and flipping (script fallback). Now meets WCAG 1.4.13: the pointer can move onto the tooltip without it closing, and Escape dismisses it. Any `aria-describedby` already on the trigger is merged instead of overwritten.
  - **Toast** — the viewport is a `popover="manual"` in the top layer. Dismissing a focused toast moves focus to the next toast (or back to where focus was before) instead of dropping it to `<body>`. Toasts no longer overflow a 320px-wide viewport. Announcements use `document.ariaNotify()` where available, falling back to the existing live regions; toast cards are no longer live regions themselves, which removes duplicate announcements.
  - Nested popups (Combobox, DropdownMenu, Tooltip) consume Escape while open, so pressing Escape inside a Dialog closes the popup first and the dialog only on the next press.

  **Breaking changes for TypeScript users and custom CSS:**

  - `Dialog` and `Drawer` refs now point to an `HTMLDialogElement` instead of an `HTMLDivElement`.
  - The `.akds-dialog-backdrop` and `.akds-drawer-backdrop` wrapper elements are gone; style `.akds-dialog::backdrop` or `.akds-drawer::backdrop` instead.
  - The internal `.akds-dialog--closing`, `.akds-drawer--closing`, and `.akds-menu--closing` classes are removed.
  - Menu with `triggerRef` renders in place rather than in a portal (it still overlays everything via the top layer).
  - Individual toast cards no longer carry `role="status"` or `role="alert"`.

- 4616f5f: Form control accessibility fixes:

  - **TextInput / TextArea** — a consumer `aria-describedby` is now merged with the helper/error text ids instead of replacing them.
  - **TextInput / TextArea** — error messages are prefixed with an error icon announced as "Error", so errors aren't conveyed by color alone.
  - **TextArea** — auto-grow now uses CSS `field-sizing: content` (no re-render per keystroke), falling back to the previous mirror technique where unsupported.
  - **Option / DropdownMenu / Combobox** — only one option is in the Tab order at a time (roving tabindex) instead of every option being a Tab stop. **Behavior change:** Space now selects on key release (Enter still selects on key press), matching native buttons, and a Space press that opened the menu no longer also selects an option.
  - **RadioGroup** — logs a development-only warning when the group has no accessible name (`legend`, `aria-label`, or `aria-labelledby`).
  - **ToggleButton / Combobox / DropdownMenu** — removed redundant `aria-disabled` alongside native `disabled`.

- 4616f5f: Follow-up fixes:

  - **Toast** — toasts shown while a modal Dialog or Drawer is open now appear above it and stay clickable. The provider's toast container moves into the open modal dialog (and back out when it closes); previously toasts sat under the dialog's backdrop in the inert page. The live regions move with it, so announcements still reach screen readers. Toast markup now renders inside a `.akds-toast__host` element (`display: contents`) appended to `<body>`.
  - **Toast** — showing another toast no longer restarts the auto-dismiss countdown of toasts already on screen.
  - **Dialog / Drawer** — in browsers without `closedby` (Safari), the backdrop-click fallback now only counts presses on the backdrop itself, not on content drawn outside the dialog box.
  - **DropdownMenu** — the `name` prop now works: the selection is submitted with a surrounding form through hidden inputs (one per value when `multiple`), and nothing is submitted while disabled. The trigger's display text now includes options wrapped in fragments and options whose label contains elements.
  - **Switch** — the input also carries the native `switch` attribute (native switch semantics and iOS haptics where supported); `role="switch"` stays for other browsers.

- Updated dependencies [4616f5f]
  - @aknishi/akds-tokens@2.1.2

## 1.6.2

### Patch Changes

- 3608ceb: Address several non-text contrast failures:

  - Solid success/destructive Button and IconButton, and the blue/green/red Avatar variants, now use the theme-invariant `-strong` background tokens (matching Alert's existing pattern) instead of `-default`, which failed as low as 2.3:1 with white text/icons.
  - Solid/filled accented Button, IconButton, and the blue Avatar variant now use `--akds-color-background-primary-strong` instead of `-default` — dark mode was only 3.7:1 with white text.
  - TextInput, TextArea, Combobox, ToggleButton, Checkbox, Radio, and Switch now switch their control boundary to `--akds-color-border-neutral-strong` on hover, for a clearer affordance. The resting-state border is still `-default` (`#E2E2E2` light / `#404040` dark, ~1.3:1 / ~1.7:1), which remains under the 3:1 contrast minimum for UI components — kept this way intentionally for the current visual style. Decorative borders (Divider, Card, Table, Dialog, Menu, etc.) are unchanged.
  - Removed a dead `width` transition on the Switch thumb — nothing ever animated that property, and it was an unnecessary layout-thrash risk.
  - Alert's filled success/warning/error, and the new success/destructive variants of Button, IconButton, and Avatar above, now reference the new `--akds-color-text-on-success-default` / `-on-error-default` / `-on-warning-default` tokens instead of reusing `text-on-primary-default`. No visual change (all resolve to `#FFFFFF` today) — this just points each at the token that actually describes it.

- Updated dependencies [3608ceb]
- Updated dependencies [3608ceb]
  - @aknishi/akds-tokens@2.1.1

## 1.6.1

### Patch Changes

- ProgressTracker - Fix step circles becoming misaligned when one step's label wraps to multiple lines while others stay on one line. The steps list now uses a CSS grid (labels in row 1, circles in row 2) instead of independent flex columns, so every circle's row height is driven by the tallest circle across all steps, not by that step's own label height. Also switch the fill bar's progress animation from `width` to `transform: scaleX`, so it runs on the compositor instead of triggering layout on every frame.
- Refactor BEM child element class names to use `withBaseName.el()` in Avatar, Dialog, Divider, Drawer, DropdownMenu, Option, ProgressTracker, ProgressTrackerStep, Switch, Tag, and Tooltip. Internal only — class names on the DOM are unchanged.
- ProgressTracker - Cap the fill-bar and check-icon animations to the design system's motion timing rules, and export the missing `ProgressTrackerStepContextValue` type from the package root.

## 1.6.0

### Minor Changes

- b117412: Add AI related components StreamingText, ThinkingState, GenerationLoader

## 1.5.1

### Patch Changes

- 7a57298: Fix component styles being stripped from production builds. `tsup.config.ts` uses `injectStyle: true`, which bundles all CSS into content-hashed JS chunks with no `.css` files ever emitted, but `package.json` declared `sideEffects: ["**/*.css"]` — a glob that matched nothing in the actual output. Consumers doing a production tree-shaking build (Rollup/Vite) could silently drop a component's injected styles (reproduced with Menu/Option). `sideEffects` is now `true` so bundlers never prune the style-injecting chunks.
- 7a57298: Fix Checkbox and Radio custom styling never applying. Both components built their child element class names with `withBaseName('input')` (the BEM _modifier_ form, producing `akds-checkbox--input`) instead of `withBaseName.el('input')` (the BEM _child element_ form the CSS actually targets, `akds-checkbox__input`) — so the hidden-input, indicator, icon, and dot rules never matched anything, leaving the native browser checkbox/radio visible at a fixed size regardless of the `size` prop. `RadioGroup`'s `legend` had the same mismatch. Fixed the class names, and while fixing it, sized the indicators up one step per `size` variant and rounded the Checkbox's corners slightly more (`--akds-radius-sm` instead of `--akds-radius-xs`) since the correct styling had never actually shipped.

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
