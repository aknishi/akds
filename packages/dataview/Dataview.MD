# @aknishi/akds-dataview: build spec

## Context

I'm adding a new package, `@aknishi/akds-dataview`, to my existing AKDS monorepo. It's a "v2" DataView: one data source rendered as a **table view** or a **card view**, built on TanStack Table, using **React context** to connect the views, cards, and fields. It will be demoed live for 2–3 minutes in a design systems interview, through Storybook.

Priorities, in order:

1. **Behavior that's easy to see:** the table switches to cards at a breakpoint; two different card layouts built from the same card component; selection with a bulk-action bar.
2. **Correct accessibility,** because I will be asked about it.
3. **Readable code that follows this repo's existing conventions.** I need to explain it line by line.

Do **not** add features beyond this spec. If something seems missing, wrong, or conflicts with existing AKDS code, ask me before changing the design.

## How to work

1. Read this spec, then explore the repo: `packages/reactkit`, `packages/tokens`, `packages/icons`, `.storybook/`, and root config. **Propose a short plan** (files and order of work) and wait for my approval before writing code.
2. Build in the steps under "Build order." After each step, run the relevant checks (typecheck, tests, Storybook) and tell me what to look at.
3. **Smoke-test before calling a step done:** open the story, click, select, resize, and run the tests.
4. Comments only where they explain *why* a design decision was made.

## Repo conventions to follow

Match the existing packages, especially `packages/reactkit`:

- **TypeScript**, strict mode, same `tsconfig` settings (including `exactOptionalPropertyTypes` and `noUncheckedIndexedAccess`).
- **Folder per component:** `Component.tsx`, `Component.types.ts`, `Component.css`, `Component.stories.tsx`, `Component.mdx` (where useful), `index.ts`.
- **Class names via `makePrefixer`** with BEM-style names, for example `akds-dataview-card`, `akds-dataview-card__body`. Copy the helper pattern rather than importing reactkit internals.
- **`React.forwardRef` and `displayName`** on public components, `clsx` for class names.
- **Build with tsup** (copy `packages/reactkit/tsup.config.ts`), **test with Vitest** (copy `vitest.config.ts`, including the coverage thresholds).
- **Stories are picked up automatically** by the root Storybook (`../packages/**/*.stories.@(ts|tsx)`).
- **Add a changeset** for each package that changes.

## Package setup

```
packages/dataview/
  package.json
  tsconfig.json
  tsup.config.ts
  vitest.config.ts
  src/
    index.ts                 # Pre-wired API (what teams import)
    headless/                # UI-agnostic layer: subpath export "./headless"
      context.ts
      useDataViewCore.ts
      index.ts
    useDataView/
    TableView/
    CardView/
    DataViewCard/
    DataViewField/
    Search/
    BulkActions/
    utils/makePrefixer.ts
    demo/                    # Story-only demo data and layouts (not exported)
      data.ts
      columns.tsx
      OrdersDemo.stories.tsx
    test/setup.ts
```

`package.json`:

- `name`: `@aknishi/akds-dataview`
- `peerDependencies`: `react`, `react-dom` (same ranges as reactkit)
- `dependencies`: `@aknishi/akds-reactkit`, `@aknishi/akds-tokens`, `@aknishi/akds-icons`, `@tanstack/react-table` (v8), `clsx`
- `exports`: `"."` for the pre-wired API and `"./headless"` for the headless layer

**Boundary rule:** nothing in `src/headless/` may import from `@aknishi/akds-reactkit`, `@aknishi/akds-tokens`, `@aknishi/akds-icons`, or any CSS. The repo has no ESLint setup, so enforce this with a small Vitest test that reads every file in `src/headless/` and fails if any of those imports appear. This boundary is an interview talking point.

## Use existing AKDS components and tokens

**Never rebuild something AKDS already has.** Use:

| Need | Use |
|---|---|
| Table markup | `Table`, `Thead`, `Tbody`, `Tr`, `Th`, `Td` from reactkit |
| Selection checkboxes | `Checkbox` (supports `label` and `indeterminate`) |
| Card frame | `Card`, `CardHeader`, `CardContent` |
| Card title | `Text` with `styleAs="h3"` and `as="h3"` |
| Status badge | `Tag` with `variant` (`info`, `success`, `warning`, `default`) |
| Search field | `TextInput` with `label` and `startAdornment={<SearchIcon aria-hidden="true" />}` |
| Row, card, and bulk actions | The new reactkit `ActionsMenu` (see below), with `MenuItem` children |
| Clear selection | `Button` |
| Layout toggle in the demo | `ToggleGroup` and `ToggleButton` |
| "Show more" in Team B's card | `Accordion` and `AccordionItem` |
| Spacing and layout | `Flexbox`, or CSS using tokens |

Styling uses **only `--akds-*` CSS custom properties** from `@aknishi/akds-tokens`, for example `--akds-color-surface-raised`, `--akds-color-border-neutral-default`, `--akds-color-text-secondary-default`, `--akds-spacing-layout-sm`, `--akds-radius-md`, and `--akds-outline-focus`. No hardcoded colors, sizes, or spacing. Because the tokens already support light and dark themes, everything should work in both themes automatically. Verify this with Storybook's dark mode toggle.

### Gaps found in reactkit (fix these first, as small reactkit changes)

1. **No visually hidden utility.** Add a `VisuallyHidden` component to reactkit, using the standard visually hidden CSS pattern, with a test, a story, and a changeset (minor bump). DataView needs it for hidden labels.
2. **`Checkbox` labeling:** its `label` prop renders visible text, and other props go to the wrapping `<label>`. For selection checkboxes, pass `label={<VisuallyHidden>Select {name}</VisuallyHidden>}` so each checkbox has an accessible name without visible text. Confirm with me before changing Checkbox itself.
3. **`Th` has no sorting support.** Add it to reactkit's `Th` as described in "Reactkit change: sortable `Th`" below, with tests, a story, docs, and a changeset (minor bump).

### Reactkit change: sortable `Th`

New props on `ThProps` (controlled, so `Th` stays presentational and works with or without TanStack):

```ts
export type ThSortDirection = 'ascending' | 'descending';

export interface ThProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  // ...existing props
  /** Makes the whole header activatable to sort the column. */
  sortable?: boolean;
  /** Current sort direction. Omit (or undefined) when this column is not sorted. */
  sortDirection?: ThSortDirection;
  /** Called when the header is activated. Receives the click event (TanStack uses it for shift-click multi-sort). */
  onSort?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}
```

Implementation requirements:

- **The whole header is clickable, but through a real `<button>`, not an `onClick` on the `<th>`.** When `sortable`, render the children inside a `<button type="button">` that fills the entire cell (`width: 100%`, inheriting the cell's padding so the click area matches the visual cell). A `<th>` with a click handler is not keyboard accessible and isn't announced as interactive; a button gets Enter and Space handling, focus, and the correct role for free.
- **`aria-sort` goes on the `<th>`, and only on the currently sorted column.** Set `aria-sort="ascending"` or `"descending"` when `sortDirection` is set. Omit the attribute on unsorted columns; the ARIA spec recommends applying `aria-sort` to only one header at a time.
- **Indicator icon:** `ArrowUpIcon` for ascending and `ArrowDownIcon` for descending, from `@aknishi/akds-icons`, always with `aria-hidden="true"`, because `aria-sort` already conveys the state. For sortable but unsorted columns, show the up arrow at reduced opacity only on hover and focus, so sighted users can discover that the column is sortable without visual noise.
- **Alignment:** respect the existing `align` prop. For right-aligned (numeric) columns, the button content is right-aligned too, with the icon after the text.
- **Focus:** a visible focus outline on the button using `--akds-outline-focus`, inset so it isn't clipped by the table.
- **Resizing still works.** The resize handle stays outside the button, so dragging or using arrow keys on it never triggers sorting. Test a column that is both `sortable` and `resizable`.
- When `sortable` is false, `Th` renders exactly as it does today (no button, no behavior change for existing consumers).

Usage:

```tsx
<Th sortable sortDirection="ascending" onSort={handleSort}>Total</Th>
```

Tests: renders a button only when `sortable`; `aria-sort` is present only when `sortDirection` is set; clicking (and pressing Enter or Space on) the button calls `onSort`; the icon is `aria-hidden`; a sortable and resizable header still resizes without sorting.

Docs: add a "Sortable headers" section and story to the existing Table docs, noting that `Th` only renders the sort UI and the consumer owns the sorting logic.

4. **No reusable "more actions" menu.** Add an `ActionsMenu` pattern component to reactkit, described next. DataView uses it for row actions, card actions, and bulk actions.

### Reactkit change: `ActionsMenu`

A common pattern: an icon button with a vertical ellipsis that opens a menu of actions. It composes existing reactkit pieces (`IconButton`, `MoreVertIcon`, `Menu`, `MenuItem`) and adds the behavior they don't provide on their own.

```tsx
<ActionsMenu label="Actions for Hanako Sato">
  <MenuItem onClick={() => viewOrder(order)}>View details</MenuItem>
  <MenuItem onClick={() => cancelOrder(order)}>Cancel order</MenuItem>
</ActionsMenu>
```

Props:

```ts
export interface ActionsMenuProps {
  /** Accessible name for the trigger. Required, and should be specific, e.g. "Actions for Hanako Sato". */
  label: string;
  /** MenuItem children. */
  children: React.ReactNode;
  placement?: MenuPlacement;       // default 'bottom-right'
  disabled?: boolean;
  /** Keep the trigger focusable when disabled, so screen-reader users can find it. Passed to IconButton. */
  focusableWhenDisabled?: boolean;
  onOpenChange?: (open: boolean) => void;
}
```

Behavior requirements (I checked the current `Menu`: it already sets `aria-expanded` and `aria-controls` on the trigger, focuses the first item on open, and handles arrow keys, Home, End, Escape, Tab, and outside clicks):

- **Trigger:** `IconButton` with `appearance="transparent"`, `MoreVertIcon` marked `aria-hidden="true"`, `aria-label={label}`, and **`aria-haspopup="menu"`** (Menu doesn't set this today).
- **Close on selection:** clicking or pressing Enter on an enabled `MenuItem` runs its `onClick` and then closes the menu. Implement this with one click handler on the `Menu` that checks whether the event came from an enabled `[role="menuitem"]`, so `MenuItem`'s API stays unchanged.
- **Return focus to the trigger** after Escape or after selecting an item (Menu doesn't do this today). Don't move focus on Tab or outside click; the user is already going somewhere else.
- **Uncontrolled by default,** with `onOpenChange` for consumers who need to know.
- Unique accessible names matter: in a table with 40 rows, 40 buttons all named "More actions" are useless to a screen-reader user. Document this in the component's docs with a do and don't example.

Tests: the trigger has `aria-haspopup="menu"` and `aria-expanded` toggles; selecting an item calls its `onClick`, closes the menu, and returns focus to the trigger; Escape closes and returns focus; a disabled item doesn't close the menu; `disabled` with `focusableWhenDisabled` keeps the trigger in the tab order.

Docs and story: an `ActionsMenu.mdx` page and stories (default, disabled, inside a table row).

## The team-facing API (what a product team writes)

The demo story must use **exactly this API**.

### Column definitions, with shared cell renderers

```tsx
// src/demo/columns.tsx
import type { ColumnDef } from '@tanstack/react-table';
import { Tag } from '@aknishi/akds-reactkit';
import type { Order } from './data';

const statusVariant = {
  Processing: 'info',
  Shipped: 'success',
  Delayed: 'warning',
  Delivered: 'default',
} as const;

export const columns: ColumnDef<Order, any>[] = [
  { accessorKey: 'id', header: 'Order' },
  { accessorKey: 'customer', header: 'Customer', enableSorting: true },
  {
    accessorKey: 'status',
    header: 'Status',
    // Defined once: identical in the table and in every card layout
    cell: ({ getValue }) => {
      const status = getValue<Order['status']>();
      return <Tag variant={statusVariant[status]} size="sm">{status}</Tag>;
    },
  },
  {
    accessorKey: 'total',
    header: 'Total',
    enableSorting: true,
    cell: ({ getValue }) => `$${getValue<number>().toFixed(2)}`,
  },
  { accessorKey: 'date', header: 'Date', enableSorting: true },
];
```

### The demo screen

```tsx
// src/demo/OrdersDemo.stories.tsx (the screen component, simplified)
import { useBreakpointUp } from '@aknishi/akds-reactkit';
import { useDataView, DataViewCard, DataViewField } from '../index';

function OrdersDemo() {
  const orders = useMemo(() => generateOrders(40), []);
  const isWide = useBreakpointUp('md');
  const [cardLayout, setCardLayout] = useState<'teamA' | 'teamB'>('teamA');

  const { tableSource, TableView, CardView, Search, BulkActions } = useDataView({
    data: orders,
    columns,
    getRowId: (row) => row.id,
  });

  return (
    <Flexbox direction="column" gap="md">
      <Search column="customer" label="Search customers" />
      <BulkActions
        actions={[
          { label: 'Export', onSelect: (rows) => console.log('export', rows) },
          { label: 'Copy', onSelect: (rows) => console.log('copy', rows) },
        ]}
      />

      {isWide ? (
        <TableView selectable rowActions={(row) => <OrderActions order={row.original} />} />
      ) : (
        <CardView selectable cardActions={(row) => <OrderActions order={row.original} />}>
          {(row) => (cardLayout === 'teamA' ? <TeamACard row={row} /> : <TeamBCard row={row} />)}
        </CardView>
      )}
    </Flexbox>
  );
}
```

`OrderActions` uses the new reactkit `ActionsMenu`:

```tsx
function OrderActions({ order }: { order: Order }) {
  return (
    <ActionsMenu label={`Actions for ${order.customer}`}>
      <MenuItem onClick={() => console.log('view', order.id)}>View details</MenuItem>
      <MenuItem onClick={() => console.log('cancel', order.id)}>Cancel order</MenuItem>
    </ActionsMenu>
  );
}
```

### Actions can be any component

`rowActions` and `cardActions` are render functions that return any React content: an `ActionsMenu`, a single button, or a pair of buttons. The `ActionsMenu` above is just one example. An approval queue, for instance, would pass two buttons:

```tsx
function ApprovalActions({ order }: { order: Order }) {
  return (
    <>
      <Button size="sm" appearance="bordered" emphasis="success" onClick={() => approve(order)}>
        Approve<VisuallyHidden> order for {order.customer}</VisuallyHidden>
      </Button>
      <Button size="sm" appearance="bordered" emphasis="destructive" onClick={() => reject(order)}>
        Reject<VisuallyHidden> order for {order.customer}</VisuallyHidden>
      </Button>
    </>
  );
}

<TableView rowActions={(row) => <ApprovalActions order={row.original} />} />
<CardView cardActions={(row) => <ApprovalActions order={row.original} />} cardActionsPlacement="footer">
  {(row) => <TeamACard row={row} />}
</CardView>
```

What DataView owns, so teams don't each solve it:

- **Layout of whatever is passed in:** DataView wraps the actions in a flex container with token spacing between items, aligned to the end and with no wrapping. Teams pass bare buttons; spacing and alignment stay consistent everywhere.
- **Placement in cards:** compact actions (an `ActionsMenu` or a single icon button) belong in the card header, which is the default. Text buttons like Approve and Reject don't fit well next to a title on a narrow screen, so `CardView` accepts `cardActionsPlacement: 'header' | 'footer'`. With `'footer'`, `DataViewCard` renders the actions in a `CardFooter`. Either way the position is fixed by the system, not chosen per card.

What teams own, documented with examples in `DataView.mdx`:

- **Unique accessible names.** Forty buttons all named "Approve" are ambiguous to a screen-reader user. Append row context with `VisuallyHidden`, as above, so the visible label stays at the start of the accessible name (this also satisfies WCAG 2.5.3, Label in Name).
- **Destructive styling** for actions like Reject (`emphasis="destructive"`).
- **What happens after an action,** for example when an approved row leaves the list. Focus should move somewhere sensible, such as the next row's first action, rather than being lost. The demo doesn't implement this; it's a discussion point.

### Two teams' card layouts, same card component

These show that the flexible body supports very different layouts while the fixed frame stays identical.

```tsx
// Team A: simple summary
function TeamACard({ row }: { row: Row<Order> }) {
  return (
    <DataViewCard title={row.getValue<string>('customer')}>
      <DataViewField column="status" />
      <DataViewField column="total" />
    </DataViewCard>
  );
}

// Team B: different body layout, with an expandable "Show more" area
function TeamBCard({ row }: { row: Row<Order> }) {
  return (
    <DataViewCard title={row.getValue<string>('customer')}>
      <Flexbox justify="space-between" align="center">
        <DataViewField column="status" />
        <Text styleAs="caption">{row.original.items} items</Text>
      </Flexbox>
      <Accordion>
        <AccordionItem value="details" title="Show more">
          <Text>Carrier: {row.original.carrier}</Text>
          <Text>Notes: {row.original.notes}</Text>
        </AccordionItem>
      </Accordion>
    </DataViewCard>
  );
}
```

Add a `ToggleGroup` at the top of the story ("Team A layout" / "Team B layout") so I can switch layouts live. Show it only in card view.

## Internals

### 1. Contexts (`headless/context.ts`)

```ts
export const DataViewContext = createContext<DataViewContextValue | null>(null);
export const RowContext = createContext<RowContextValue | null>(null);

export function useDataViewInstance() {
  const ctx = useContext(DataViewContext);
  if (!ctx) {
    throw new Error('This component must be used inside a view returned by useDataView.');
  }
  return ctx; // { table, state }
}

export function useDataViewRow() {
  const ctx = useContext(RowContext);
  if (!ctx) {
    throw new Error('DataViewCard and DataViewField must be used inside CardView.');
  }
  return ctx; // { row, selectable, cardActions, cardActionsPlacement }
}
```

The clear error messages are intentional: they're part of the developer experience I'll talk about.

### 2. `useDataViewCore` (headless) and `useDataView` (pre-wired)

- `useDataViewCore` (headless) creates the table with `useReactTable`, using `getCoreRowModel`, `getSortedRowModel`, `getFilteredRowModel`, and `enableRowSelection: true`. It returns the table instance.
- `useDataView` (pre-wired) calls `useDataViewCore` and returns `{ tableSource, TableView, CardView, Search, BulkActions }`.
- The returned components **must keep a stable identity across renders.** Create them inside `useMemo` keyed on the table instance, and give each a `displayName`.
- Each bound component wraps its base component in `DataViewContext.Provider`. The context value is `{ table, state }`, with `state = table.getState()`, memoized on `state`. Include `state` so memoized consumers re-render when sorting, filtering, or selection changes, because the `table` object itself stays the same.

```tsx
const views = useMemo(() => {
  const bind = <P extends object>(Component: React.ComponentType<P>, name: string) => {
    function Bound(props: P) {
      const state = table.getState();
      const value = useMemo(() => ({ table, state }), [state]);
      return (
        <DataViewContext.Provider value={value}>
          <Component {...props} />
        </DataViewContext.Provider>
      );
    }
    Bound.displayName = name;
    return Bound;
  };
  return {
    TableView: bind(BaseTableView, 'TableView'),
    CardView: bind(BaseCardView, 'CardView'),
    Search: bind(BaseSearch, 'Search'),
    BulkActions: bind(BaseBulkActions, 'BulkActions'),
  };
}, [table]);
```

Make the public types generic over the row data type (`TData`), so `row.original` is typed as `Order` in the demo.

### 3. `TableView`

- Composes reactkit's `Table`, `Thead`, `Tbody`, `Tr`, `Th`, `Td`.
- Sorting uses the new sortable `Th`:

```tsx
const sorted = header.column.getIsSorted(); // 'asc' | 'desc' | false
<Th
  sortable={header.column.getCanSort()}
  sortDirection={sorted === 'asc' ? 'ascending' : sorted === 'desc' ? 'descending' : undefined}
  onSort={header.column.getToggleSortingHandler()}
>
  {flexRender(header.column.columnDef.header, header.getContext())}
</Th>
```

- **Announce sort changes.** Screen readers don't reliably announce an `aria-sort` change after activating the header, so `TableView` includes a polite live region (`role="status"`, always in the DOM, visually hidden) that announces, for example, "Sorted by Total, ascending." or "Sorting removed." `Th` can't do this itself because it doesn't know the column's name in plain text; DataView does.
- If `selectable`: a first column with a "select all" `Checkbox` in the header (with `indeterminate` when some rows are selected) and a `Checkbox` per row, each with a visually hidden label such as "Select Hanako Sato."
- If `rowActions` is passed: a last column rendering `rowActions(row)` inside DataView's actions container (flex, token gap, end-aligned, no wrap), with a visually hidden header "Actions." `rowActions` accepts any `ReactNode`, not only `ActionsMenu`.
- Cells render with `flexRender(cell.column.columnDef.cell, cell.getContext())`.

### 4. `CardView`

- `children` is a **render function**, `(row: Row<TData>) => ReactNode`, not a component type. This avoids remounting cards on every render.
- Renders a `<ul>` of `<li>` elements, using a CSS grid of cards with token spacing.
- Accepts `cardActionsPlacement?: 'header' | 'footer'` (default `'header'`).
- Each `<li>` wraps its card in `RowContext.Provider` with `{ row, selectable, cardActions, cardActionsPlacement }`, keyed by `row.id`.

### 5. `DataViewCard`: fixed frame plus flexible body

Composes reactkit's `Card`, `CardHeader`, and `CardContent`. Teams supply only `title` and `children`.

- The fixed frame is in `CardHeader`: checkbox, then title, then actions. DOM order is fixed, so screen readers read it in that order.
- The title is `Text` with `styleAs="h3"` and an id from `useId()`.
- If `selectable`: a `Checkbox` using `row.getIsSelected()` and `row.getToggleSelectedHandler()`, labeled with visually hidden text that includes the title, for example "Select Hanako Sato."
- If `cardActions`: renders `cardActions(row)` in the same actions container used by the table, either at the end of the header (`'header'`) or in a `CardFooter` (`'footer'`). The DOM order stays fixed: checkbox, title, header actions, body, footer actions.
- `children` render in `CardContent`: the flexible region, with no layout imposed beyond token spacing.

### 6. `DataViewField`

Renders a column's `cell` renderer for the current row, so a field looks identical in the table and in cards:

```ts
const { row } = useDataViewRow();
const cell = row.getAllCells().find((c) => c.column.id === column);
return cell ? flexRender(cell.column.columnDef.cell, cell.getContext()) : null;
```

Prefix the output with a `VisuallyHidden` column label, for example "Status:", so screen-reader users get context in cards, which have no column headers.

### 7. `Search`

- Uses reactkit's `TextInput` with the `label` prop and a `SearchIcon` adornment.
- Filters the given column via `table.getColumn(column)?.setFilterValue(value)`. Clearing the input clears the filter.

### 8. `BulkActions`

Bulk actions are an `ActionsMenu`, plus a small selection summary that DataView owns:

- **Always rendered, never inserted or removed,** so selecting rows causes no layout shift above the table. When nothing is selected, the `ActionsMenu` is `disabled` with `focusableWhenDisabled`, labeled "Bulk actions, select rows to enable," so screen-reader users can still find it and understand why it's unavailable.
- When rows are selected: visible text "N selected," the `ActionsMenu` enabled with label "Bulk actions for N selected rows," and a "Clear selection" `Button`.
- `actions` is an array of `{ label, onSelect }`. `BulkActions` renders one `MenuItem` per action, and each `onSelect` receives the selected rows' original data.
- A `role="status"` live region (`aria-live="polite"`), always in the DOM and visually hidden, announces selection changes, for example: "3 rows selected. Bulk actions available." Debounce it by about 300 ms so selecting several rows quickly produces one announcement.

### 9. `useMediaQuery`

Lives in reactkit (`@aknishi/akds-reactkit`), not in this package: it isn't specific to data views. Uses `window.matchMedia`, subscribes to changes, and removes its listener on unmount.

## Demo data

`src/demo/data.ts` exports an `Order` type and `generateOrders(count)`, returning deterministic, realistic data (use a seeded random so the demo looks identical every run):

```ts
export interface Order {
  id: string;          // 'ORD-1024'
  customer: string;    // 'Hanako Sato'
  status: 'Processing' | 'Shipped' | 'Delayed' | 'Delivered';
  total: number;       // 128.5
  date: string;        // '2026-09-14'
  items: number;
  carrier: string;
  notes: string;
}
```

## Stories and docs

- `OrdersDemo.stories.tsx`: the full demo described above. This is what I'll present.
- `ApprovalQueue.stories.tsx`: the same orders filtered to "Processing," with Approve and Reject buttons as `rowActions` in the table and as footer `cardActions` in cards. This shows that the actions column accepts any component.
- Smaller focused stories: `TableView` with selection, `CardView` with each team layout, and `DataViewCard` alone.
- For the demo stories, add Chromatic viewport modes (a narrow mobile width and a desktop width) in addition to the existing `light` and `dark` modes in `.storybook/modes.ts`. Apply the new modes **only to DataView stories** via story parameters, so existing baselines don't change.
- A `DataView.mdx` docs page: what it is, the fixed-versus-flexible card regions, the API examples above, and accessibility notes.
- `packages/reactkit/src/Datagrid.mdx` currently describes a planned `@aknishi/akds-datagrid` package. **Ask me** whether to update it to point to `@aknishi/akds-dataview` before changing it.

## Tests (Vitest + React Testing Library)

1. `DataViewCard` renders a checkbox only when `CardView` is `selectable`, and the checkbox's accessible name includes the card title.
2. Using `DataViewCard` outside `CardView` throws the helpful error.
3. `DataViewField column="status"` renders the same tag text as the table cell for that row.
4. Selecting a row updates the `BulkActions` count, enables its `ActionsMenu`, and updates the live region text (use fake timers for the debounce). Choosing a bulk action passes the selected rows' data to `onSelect`.
5. Sorting a column via `TableView` updates `aria-sort` on that header only, and the live region announces the new sort.
6. `rowActions` renders arbitrary content: with the approval actions, each row has two buttons whose accessible names include the customer name, and with `cardActionsPlacement="footer"` the card renders them after the body.
7. The headless boundary test: no file in `src/headless/` imports reactkit, tokens, icons, or CSS.

Meet the same per-file coverage thresholds as reactkit.

## Out of scope

Do not build: list view, pagination, load more, grouping, column resizing beyond what `Th` already supports, virtualization, server data, or reactkit changes other than `VisuallyHidden`, sortable `Th`, and `ActionsMenu`. If one of these comes up in the interview, I'll discuss it rather than demo it.

## Build order

1. Reactkit: add `VisuallyHidden`, sortable `Th`, and `ActionsMenu` (tests, stories, docs, one changeset with a minor bump for reactkit).
2. Package scaffold for `packages/dataview` (configs, exports, empty entry points), and confirm Turbo builds it.
3. Headless context, `useDataViewCore`, and the boundary test.
4. `useDataView` and `TableView` (sorting and selection).
5. `CardView`, `DataViewCard`, `DataViewField`, and the breakpoint switch (using reactkit's `useBreakpointUp`).
6. Demo data, columns, Team A and Team B layouts, the layout toggle, and the approval queue story.
7. `Search` and `BulkActions` with the live region.
8. Remaining tests, stories, Chromatic modes, the `DataView.mdx` docs page, and changesets.
9. Final accessibility pass: keyboard-only walkthrough, focus visibility, the Storybook a11y addon panel showing no violations, and both light and dark themes.

## Definition of done

- `npm run build`, `npm run typecheck`, and the dataview tests pass from the repo root.
- `npm run storybook` shows the demo with no console errors or warnings.
- Keyboard only: I can sort (Enter or Space on a header), select, open "Show more," use row and card actions menus (with focus returning to the trigger), and trigger bulk actions, with a visible focus indicator throughout.
- Resizing below 768 px switches to cards, and back.
- The status tag looks identical in the table and in both card layouts.
- The approval queue story shows Approve and Reject buttons in the table's actions column and in card footers, with consistent spacing.
- Light and dark themes both look correct with no hardcoded colors.
- The Storybook a11y panel reports no violations on the demo story.