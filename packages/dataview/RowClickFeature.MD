# Add row click and card click to @aknishi/akds-dataview

## Context

This builds on the existing `@aknishi/akds-dataview` package described in `DATAVIEW_DEMO_SPEC.md`. Read that spec and the current package code first.

The feature: clicking a table row (or a card) opens details for that item, for example in a side drawer. What happens on click is not built in; application teams pass it in as a handler. Clicks in the selection and actions cells never trigger it. The hard part is accessibility. Rows and cards can already contain interactive elements (checkboxes, links, buttons, menus), and interactive elements must not be nested inside another interactive element. So the row or card itself must **not** become a button or a keyboard target. Instead:

- **Mouse users** can click anywhere on the row or card, except the selection checkbox, the actions, and other interactive elements.
- **Keyboard and screen-reader users** use a Details button inside the row or card.
- **Touch users** always see the Details button. On devices with hover, it appears on hover or when focus is anywhere within the row or card.

This pattern was reviewed and approved with an accessibility team in my previous role, and it's a talking point in my interview, so implement it exactly as described.

## How to work

1. Read this prompt and the existing code, then **propose a short plan** and wait for my approval before writing code.
2. After each step, run typecheck and tests, and tell me what to check in Storybook.
3. Smoke-test before calling anything done: hover, click, Tab through, and use the touch emulation in browser dev tools.
4. Follow the repo conventions already used in the package (TypeScript, `makePrefixer` class names, tokens only, `forwardRef` and `displayName`).

## API

The feature is **opt-in**. If the click handler isn't passed, nothing changes: no Details button, no click handling, no pointer cursor.

```tsx
<TableView
  selectable
  onRowClick={(row, event) => openDrawer(row.original)}
  rowActions={(row) => <OrderActions order={row.original} />}
/>

<CardView
  selectable
  onCardClick={(row, event) => openDrawer(row.original)}
  cardActions={(row) => <OrderActions order={row.original} />}
>
  {(row) => <TeamACard row={row} />}
</CardView>
```

Types:

```ts
type RowClickHandler<TData> = (
  row: Row<TData>,
  event: React.MouseEvent<HTMLElement>,
) => void;

// TableView
onRowClick?: RowClickHandler<TData>;

// CardView
onCardClick?: RowClickHandler<TData>;
```

### Row labels

The Details button needs a specific accessible name for each row, such as "View details for Hanako Sato." Add one option to `useDataView` that every view uses to name a row:

```ts
useDataView({
  data,
  columns,
  getRowId: (row) => row.id,
  getRowLabel: (row) => row.original.customer, // optional
});
```

- Default when `getRowLabel` isn't passed: the string value of the first data column for that row.
- Use `getRowLabel` for the Details button, and also replace any hardcoded labels in the selection checkboxes ("Select Hanako Sato"), so all row-level names come from one place.
- Expose it through `DataViewContext` so `TableView`, `CardView`, and `DataViewCard` can all read it.

## The Details button

- Built with reactkit's `IconButton` with `OpenInNewIcon` from `@aknishi/akds-icons` (marked `aria-hidden="true"`), `appearance="solid"`. No visible text.
- `aria-label`: `View details for ${getRowLabel(row)}`.
- **Wrap it in reactkit's `Tooltip`** with `content="View details"`, so sighted mouse and keyboard users can learn what the icon does, and voice-control users know what to say. The tooltip text should match the start of the `aria-label`.
- **Size:** `IconButton` has no `size` prop today. **Ask me** whether to add a `size` prop to reactkit's `IconButton` (with tests, a story, and a changeset) or to keep the default size. Whatever the size, the clickable area must stay at least 24 by 24 px (WCAG 2.5.8, Target Size).
- Clicking it, or pressing Enter or Space on it, calls the same handler (`onRowClick` or `onCardClick`) with the row and the event. **Don't call `event.stopPropagation()`.** The row's own click handler already ignores clicks on buttons (see the ignore rules below), so the handler runs exactly once.
- **Placement in the table:** inside the first data cell (the first column after the selection checkbox column), after the cell's content with some spacing after the content but left aligned to follow immediately after the content.
- **Placement in cards:** in the fixed header of `DataViewCard`, after the title and before the card actions. The fixed DOM order becomes: checkbox, title, Details button, header actions, body, footer actions.

### Visibility rules

The button must **always stay in the DOM and in the tab order.** Hide it visually with `opacity: 0` only. Never use `display: none`, `visibility: hidden`, or the `hidden` attribute, because those remove it from the tab order and from screen readers.

It becomes visible (`opacity: 1`) when:

- the pointer hovers the row or card (`:hover`),
- the button itself has keyboard focus, showing the standard AKDS focus outline (`--akds-outline-focus`), which meets WCAG 2.4.7 (Focus Visible),
- anything inside the row or card has focus (`:focus-within`), so keyboard users see it while moving through the row's other controls,
- the device has no hover capability: `@media (hover: none)` keeps it always visible on touch devices.

Use a short opacity transition, and turn it off under `@media (prefers-reduced-motion: reduce)`.

## Row and card click behavior

Attach a click handler to the `<tr>` (table) or the card's `<li>` wrapper (cards) **only when** `onRowClick` or `onCardClick` is passed.

The row or card itself must **not**:

- have `tabIndex`,
- have `role="button"` or any other interactive role,
- have a keyboard handler.

Add a short code comment explaining why: the keyboard and screen-reader equivalent is the Details button, and making the row interactive would nest interactive elements.

The click handler must **ignore** clicks that:

1. **Come from an interactive element inside the row or card.** Check `event.target.closest(...)` against: `button`, `a[href]`, `input`, `select`, `textarea`, `label`, `[role="button"]`, `[role="menuitem"]`, `[role="checkbox"]`, `[contenteditable="true"]`, and `[data-dataview-ignore-click]`. Only count matches that are inside the clicked row or card. This prevents a checkbox click, an action menu click, or an Approve button click from also opening the details.
2. **Come from the selection or actions cells.** DataView puts `data-dataview-ignore-click` on the selection cell and the actions cell (and on the equivalent card regions), so clicking the padding around a checkbox or menu also doesn't open details. Use this attribute check, **not** `event.stopPropagation()`, so other click listeners on the page keep working.
3. **Are the end of a text selection.** If `window.getSelection()?.toString()` is non-empty, do nothing, so users can still select and copy text from a row.

Teams can put `data-dataview-ignore-click` on their own custom elements for the same behavior. Document this.

Clicking a row or card must **not** toggle its selection.

Styling when the handler is passed: `cursor: pointer` on the row or card, and a hover background using an existing token (check what AKDS uses for row hover in `Table`).

## Reactkit change: return focus when the Drawer closes

reactkit's `Drawer` already moves focus into the panel when it opens, traps focus inside it, and closes on Escape, but it **doesn't return focus** to the element that opened it when it closes. Without that, a keyboard user who closes the details drawer loses their place in the table.

Add this to `Drawer`: when it opens, remember `document.activeElement`; when it closes (Escape, close button, or the `open` prop becoming false), move focus back to that element if it's still in the document. Add a test, update its docs, and include it in a reactkit changeset (minor bump). This is the standard behavior for dialogs in the ARIA Authoring Practices.

## Demo and stories

- In `OrdersDemo`, pass `onRowClick` and `onCardClick` to open a reactkit `Drawer` showing the clicked order's details. Closing it must return focus to the Details button for that row or card.
- Add focused stories: `TableView` with `onRowClick`, `CardView` with `onCardClick`, and both without the handler (to show no button appears).
- Update `DataView.mdx` with a "Row and card click" section: the API, the three ways to open details (mouse, keyboard and screen readers, touch), why the row itself isn't a keyboard target, the `data-dataview-ignore-click` attribute, and a do and don't example for `getRowLabel`.
- Add a changeset (minor bump for `@aknishi/akds-dataview`).

## Tests (Vitest + React Testing Library)

1. Without `onRowClick`, no Details buttons render and the row has no click handler behavior.
2. With `onRowClick`, each row has a Details button whose accessible name is "View details for {label}", using `getRowLabel` when passed and the first column's value by default.
3. The `<tr>` has no `tabIndex` and no `role="button"`.
4. Clicking a non-interactive part of the row calls `onRowClick` once with that row.
5. Clicking the row's checkbox, the empty space in its selection cell, its actions menu trigger, the empty space in its actions cell, or a custom element with `data-dataview-ignore-click` does **not** call `onRowClick`. Clicking the checkbox still toggles selection.
6. Clicking the Details button calls `onRowClick` exactly once.
7. Keyboard: tabbing reaches the Details button, and pressing Enter calls `onRowClick`.
8. A click while text is selected does not call `onRowClick` (mock `window.getSelection`).
9. The Details button is never hidden with `display: none`, `visibility: hidden`, or `hidden` (assert it's in the accessibility tree via `getByRole`).
10. The same behavior for `CardView` with `onCardClick`, including the Details button's position in the header (after the title, before the actions).
11. `Drawer`: after closing, focus returns to the element that was focused when it opened.

Hover, focus visibility, tooltips, and the touch media query can't be tested reliably in jsdom. List them for me as manual checks in Storybook instead.

## Out of scope

Don't add: keyboard arrow-key navigation between rows, an "active row" highlight while the drawer is open, double-click handling, or row click for `ListView`. If any of these seem necessary, ask me first.

## Definition of done

- Typecheck and all tests pass for dataview and reactkit.
- With a handler: mouse users can click anywhere on a row or card to open details; clicking a checkbox, an action menu, an action button, or the space around them doesn't.
- Keyboard: Tab reaches each Details button, it becomes visible with a focus outline and shows its tooltip, and Enter opens the details. Closing the drawer returns focus to that button.
- Touch emulation: Details buttons are always visible.
- Without a handler: the table and cards look and behave exactly as before.
- The Storybook a11y panel reports no violations on the new stories.