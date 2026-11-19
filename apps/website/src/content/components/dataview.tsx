import React, { useMemo, useRef, useState } from 'react';
import {
  ActionsMenu,
  Drawer,
  DropdownMenu,
  Flexbox,
  MenuItem,
  Option,
  Table,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  ToggleButton,
  ToggleGroup,
  Tr,
  useContainerBreakpointUp,
} from '@aknishi/akds-reactkit';
import { CopyIcon, DownloadIcon } from '@aknishi/akds-icons';
import { DataViewCard, useDataView, useDataViewField } from '@aknishi/akds-dataview';
import type { BulkAction } from '@aknishi/akds-dataview';
import type { ColumnDef, Row } from '@tanstack/react-table';
import type { ComponentEntry } from './types';
import './dataview.css';

// ---------------------------------------------------------------------------
// Example data
// ---------------------------------------------------------------------------

interface Order {
  id: string;
  customer: string;
  status: 'Processing' | 'Shipped' | 'Delayed' | 'Delivered';
  total: number;
  date: string;
  items: number;
  carrier: string;
  notes: string;
}

// In the order an order moves through them, which is also how they sort.
const STATUSES: Order['status'][] = ['Processing', 'Shipped', 'Delayed', 'Delivered'];
const FIRST_NAMES = ['Hanako', 'Kenji', 'Maria', 'Liam', 'Aisha', 'Noah', 'Yuki', 'Sofia', 'Mateo', 'Chloe', 'Ravi', 'Emma'];
const LAST_NAMES = ['Sato', 'Ito', 'Garcia', 'Chen', 'Okafor', 'Müller', 'Tanaka', 'Rossi', 'Silva', 'Patel', 'Kim', 'Walsh'];
const CARRIERS = ['DHL', 'USPS', 'UPS'];
const NOTES = ['Leave at the front desk.', 'Gift wrap requested.', 'Call before delivery.', 'Fragile items.', 'No notes.'];

// Seeded, so the examples look the same on every visit.
function createRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generateOrders(count: number): Order[] {
  const random = createRandom(1024);
  const pick = <T,>(list: readonly T[]): T => list[Math.floor(random() * list.length)] as T;
  const start = Date.UTC(2026, 6, 1);
  return Array.from({ length: count }, (_, index) => ({
    id: `ORD-${1024 + index}`,
    customer: `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`,
    status: pick(STATUSES),
    total: Math.round((15 + random() * 485) * 2) / 2,
    date: new Date(start + Math.floor(random() * 90) * 86_400_000).toISOString().slice(0, 10),
    items: 1 + Math.floor(random() * 8),
    carrier: pick(CARRIERS),
    notes: pick(NOTES),
  }));
}

const statusVariant = {
  Processing: 'info',
  Shipped: 'success',
  Delayed: 'warning',
  Delivered: 'default',
} as const;

const columns: ColumnDef<Order, any>[] = [
  { accessorKey: 'id', header: 'Order' },
  { accessorKey: 'customer', header: 'Customer', enableSorting: true, meta: { rowHeader: true } },
  {
    accessorKey: 'status',
    header: 'Status',
    enableSorting: true,
    // Sorts by progress, not alphabetically.
    sortingFn: (a, b, id) => STATUSES.indexOf(a.getValue(id)) - STATUSES.indexOf(b.getValue(id)),
    cell: ({ getValue }) => {
      const status = getValue<Order['status']>();
      return <Tag variant={statusVariant[status]} size="sm">{status}</Tag>;
    },
    filterFn: (row, id, selected: Order['status'][]) => selected.includes(row.getValue(id)),
  },
  { accessorKey: 'total', header: 'Total', enableSorting: true, cell: ({ getValue }) => `$${getValue<number>().toFixed(2)}` },
  { accessorKey: 'date', header: 'Date', enableSorting: true },
];

// More columns than fit, for the pinned columns example.
const wideColumns: ColumnDef<Order, any>[] = [
  ...columns,
  { accessorKey: 'items', header: 'Items', enableSorting: true },
  { accessorKey: 'carrier', header: 'Carrier' },
  { accessorKey: 'notes', header: 'Notes' },
];

const bulkActions: (BulkAction<Order> & { icon: React.ReactNode })[] = [
  { label: 'Export', icon: <DownloadIcon size="sm" />, onSelect: () => {} },
  { label: 'Copy', icon: <CopyIcon size="sm" />, onSelect: () => {} },
];

function OrderActions({ order }: { order: Order }) {
  return (
    <ActionsMenu label={`Actions for ${order.customer}`}>
      <MenuItem onClick={() => {}}>View details</MenuItem>
      <MenuItem onClick={() => {}}>Cancel order</MenuItem>
    </ActionsMenu>
  );
}

function OrderField({ column }: { column: string }) {
  const field = useDataViewField(column);
  if (!field) return null;
  return (
    <Flexbox justify="space-between" align="baseline" gap={2}>
      <Text as="dt" styleAs="label">{field.label}</Text>
      <Text as="dd">{field.value}</Text>
    </Flexbox>
  );
}

function OrderCard({ row }: { row: Row<Order> }) {
  return (
    <DataViewCard title={row.original.customer} subtitle={row.original.id}>
      <Flexbox as="dl" direction="column" gap={1}>
        <OrderField column="status" />
        <OrderField column="total" />
        <OrderField column="date" />
      </Flexbox>
    </DataViewCard>
  );
}

// ---------------------------------------------------------------------------
// Live examples
// ---------------------------------------------------------------------------

type ViewMode = 'table' | 'cards';

function OverviewExample() {
  const orders = useMemo(() => generateOrders(24), []);
  const [view, setView] = useState<ViewMode>('table');
  const ref = useRef<HTMLDivElement>(null);
  const isWide = useContainerBreakpointUp(ref, 'md', { initialValue: true });
  const { TableView, CardView, Search, BulkActions, Pagination, tableSource } = useDataView({
    data: orders,
    columns,
    getRowId: (row) => row.id,
    pageSize: 6,
  });
  const statusColumn = tableSource.getColumn('status');
  const selectedStatuses = (statusColumn?.getFilterValue() as Order['status'][] | undefined) ?? [];

  return (
    <Flexbox ref={ref} direction="column" gap="sm" className="dataview-entry-demo">
      <ToggleGroup aria-label="View" value={view} onChange={(value) => setView(value as ViewMode)}>
        <ToggleButton value="table">Table</ToggleButton>
        <ToggleButton value="cards">Cards</ToggleButton>
      </ToggleGroup>
      <Flexbox direction={isWide ? 'row' : 'column'} gap={isWide ? 'md' : 'sm'} align={isWide ? 'flex-end' : 'stretch'}>
        <Search label="Search orders" />
        <DropdownMenu
          label="Status"
          placeholder="All statuses"
          fullWidth={!isWide}
          multiple
          selected={selectedStatuses}
          onChange={(value) => {
            const next = Array.isArray(value) ? value : [value];
            statusColumn?.setFilterValue(next.length > 0 ? next : undefined);
          }}
        >
          {STATUSES.map((status) => <Option key={status} value={status}>{status}</Option>)}
        </DropdownMenu>
      </Flexbox>
      <BulkActions variant={isWide ? 'button' : 'icon-menu'} actions={bulkActions} />
      {view === 'table' ? (
        <TableView aria-label="Orders" selectable rowActions={(row) => <OrderActions order={row.original} />} />
      ) : (
        <CardView aria-label="Orders" selectable cardActions={(row) => <OrderActions order={row.original} />}>
          {(row) => <OrderCard row={row} />}
        </CardView>
      )}
      <Pagination aria-label="Orders pages" />
    </Flexbox>
  );
}

type DemoState = 'loading' | 'refreshing' | 'error' | 'empty';

function StatesExample() {
  const orders = useMemo(() => generateOrders(4), []);
  const [state, setState] = useState<DemoState>('loading');
  const { TableView } = useDataView({
    data: state === 'refreshing' ? orders : [],
    columns,
    getRowId: (row) => row.id,
  });

  return (
    <Flexbox direction="column" gap="sm" className="dataview-entry-demo">
      <ToggleGroup aria-label="State" value={state} onChange={(value) => setState(value as DemoState)}>
        <ToggleButton value="loading">Loading</ToggleButton>
        <ToggleButton value="refreshing">Refreshing</ToggleButton>
        <ToggleButton value="error">Error</ToggleButton>
        <ToggleButton value="empty">Empty</ToggleButton>
      </ToggleGroup>
      <TableView
        aria-label="Orders"
        loading={state === 'loading' || state === 'refreshing'}
        error={state === 'error' ? 'Couldn’t load orders.' : undefined}
        onRetry={() => setState('loading')}
      />
    </Flexbox>
  );
}

function DetailsExample() {
  const orders = useMemo(() => generateOrders(5), []);
  const { TableView } = useDataView({ data: orders, columns, getRowId: (row) => row.id });
  // Kept while the drawer animates closed, so its title doesn't vanish.
  const [order, setOrder] = useState<Order | null>(null);
  const [open, setOpen] = useState(false);

  return (
    <div className="dataview-entry-demo">
      <TableView
        aria-label="Orders"
        selectable
        rowClickOptions={{
          onClick: (row) => {
            setOrder(row.original);
            setOpen(true);
          },
        }}
      />
      <Drawer open={open} onClose={() => setOpen(false)} side="right" title={order ? `${order.id}: ${order.customer}` : undefined}>
        {order && (
          <Flexbox direction="column" gap="sm">
            <Text>Status: {order.status}</Text>
            <Text>Total: ${order.total.toFixed(2)}</Text>
            <Text>Carrier: {order.carrier}</Text>
            <Text>Notes: {order.notes}</Text>
          </Flexbox>
        )}
      </Drawer>
    </div>
  );
}

function PinnedExample() {
  const orders = useMemo(() => generateOrders(5), []);
  const { TableView } = useDataView({
    data: orders,
    columns: wideColumns,
    getRowId: (row) => row.id,
    columnPinning: { left: ['id'] },
  });
  return (
    <div className="dataview-entry-demo dataview-entry-demo--narrow">
      <TableView aria-label="Orders" selectable rowActions={(row) => <OrderActions order={row.original} />} />
    </div>
  );
}

function PreviewTable() {
  const orders = useMemo(() => generateOrders(2), []);
  const { TableView } = useDataView({
    data: orders,
    // Not sortable: sort buttons would be noise in a small preview.
    columns: columns.slice(1, 3).map((column) => ({ ...column, enableSorting: false })),
    getRowId: (row) => row.id,
  });
  return <TableView aria-label="Orders preview" />;
}

// ---------------------------------------------------------------------------
// Overview sections
// ---------------------------------------------------------------------------

const included = <Tag variant="success" size="sm">Included</Tag>;
const yours = <Tag variant="default" size="sm">Your team</Tag>;

function Prose({ children }: { children: React.ReactNode }) {
  return <Flexbox direction="column" gap="sm" className="dataview-entry-prose">{children}</Flexbox>;
}

function Subheading({ children }: { children: React.ReactNode }) {
  return <Text as="h3" styleAs="h5" className="dataview-entry-subheading">{children}</Text>;
}

const overviewSection = (
  <Prose>
    <Text>
      DataView shows one set of records, such as orders, people, or files, as a table, as cards, or both. People
      can sort, search, filter, select, and page through the records, and act on one or many at once.
    </Text>
    <ul className="dataview-entry-list">
      <li>
        <Text><strong>One source, two views.</strong> The table and the cards show the same rows. Sorting, search,
        filters, selection, and the current page carry over when the view changes, for example when a window gets
        narrow.</Text>
      </li>
      <li>
        <Text><strong>Pieces you arrange.</strong> Search, bulk actions, the views, and pagination are separate
        pieces. Each product places them in its own layout, next to its own filters and buttons.</Text>
      </li>
      <li>
        <Text><strong>Behavior built in.</strong> Selection rules, loading and error states, keyboard access, and
        screen reader announcements work the same way in every product.</Text>
      </li>
    </ul>
    <Text>
      DataView is its own package, <code>@aknishi/akds-dataview</code>, built on TanStack Table. Engineers can
      find the full API and code in Storybook.
    </Text>
  </Prose>
);

const whenToUseSection = (
  <Table>
    <Thead>
      <Tr>
        <Th scope="col">If you need</Th>
        <Th scope="col">Use</Th>
      </Tr>
    </Thead>
    <Tbody>
      <Tr>
        <Td>A small, fixed set of rows that people only read, like a price list or a summary</Td>
        <Td>Basic table</Td>
      </Tr>
      <Tr>
        <Td>Records that people sort, search, filter, select, or page through</Td>
        <Td>DataView, table view</Td>
      </Tr>
      <Tr>
        <Td>The same records on a narrow screen, or records best recognised by a picture or a name, like people or products</Td>
        <Td>DataView, card view</Td>
      </Tr>
      <Tr>
        <Td>A handful of unrelated items, like dashboard tiles or settings groups</Td>
        <Td>Card</Td>
      </Tr>
    </Tbody>
  </Table>
);

const anatomyRows: { part: string; description: string; owner: React.ReactNode }[] = [
  { part: 'Search', description: 'One field that filters rows as people type, across every column or just one.', owner: included },
  { part: 'Filters', description: 'Your own controls, such as a Dropdown menu or Tabs. DataView applies their values, so both views follow them.', owner: yours },
  { part: 'Bulk actions bar', description: 'Selection count, Select all, Clear selection, and the actions your team provides.', owner: included },
  { part: 'Table view', description: 'Column headers that sort, selection checkboxes, an actions column, and pinned columns.', owner: included },
  { part: 'Card view frame', description: 'The bordered frame, a header bar with a Sort by menu and Select all, and each card\'s checkbox.', owner: included },
  { part: 'Card content', description: 'Which fields each card shows and how they\'re laid out, using DataViewCard and fields that match the table\'s cells.', owner: yours },
  { part: 'Row actions', description: 'The menu or buttons on each row or card, such as an Actions menu.', owner: yours },
  { part: 'Details button', description: 'Opens a row\'s details from the keyboard or on touch. Clicking anywhere on the row does the same.', owner: included },
  { part: 'Details panel', description: 'What opens: a Drawer, a page, or a new tab.', owner: yours },
  { part: 'Pagination', description: 'Page buttons and the visible range, such as "11–20 of 40".', owner: included },
  { part: 'Loading, error, and empty states', description: 'Default layouts with an icon, a message, and a retry button. Each can be replaced.', owner: included },
];

const anatomySection = (
  <Prose>
    <Text>Most parts are included. Your team provides the parts that depend on the product.</Text>
    <Table>
      <Thead>
        <Tr>
          <Th scope="col">Part</Th>
          <Th scope="col">What it does</Th>
          <Th scope="col">Provided by</Th>
        </Tr>
      </Thead>
      <Tbody>
        {anatomyRows.map((row) => (
          <Tr key={row.part}>
            <Th scope="row">{row.part}</Th>
            <Td>{row.description}</Td>
            <Td>{row.owner}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  </Prose>
);

const featureRows: { feature: string; table: string; cards: string; notes: string }[] = [
  { feature: 'Sorting', table: 'Column headers', cards: 'Sort by menu', notes: 'Turned on per column. One column at a time, in an order that fits the data, such as status by progress.' },
  { feature: 'Search', table: 'Yes', cards: 'Yes', notes: 'Across every column, or one column.' },
  { feature: 'Filters', table: 'Yes', cards: 'Yes', notes: 'Your team builds the controls; DataView applies them.' },
  { feature: 'Selection', table: 'Yes', cards: 'Yes', notes: 'A checkbox on each row, and one for every row shown.' },
  { feature: 'Bulk actions', table: 'Yes', cards: 'Yes', notes: 'Four styles: buttons, icon buttons, a menu, or an icon menu.' },
  { feature: 'Row actions', table: 'Last column', cards: 'Top corner or footer', notes: 'Any control, usually an Actions menu.' },
  { feature: 'Open details', table: 'Yes', cards: 'Yes', notes: 'In a drawer, on a page, or in a new tab.' },
  { feature: 'Pagination', table: 'Yes', cards: 'Yes', notes: 'Optional. Without it, every row shows.' },
  { feature: 'Data from a server', table: 'Yes', cards: 'Yes', notes: 'Your server sorts, searches, filters, and pages; selection still works across pages.' },
  { feature: 'Loading, error, and empty states', table: 'Yes', cards: 'Yes', notes: 'Also refreshing with rows shown, and loading more rows at the end.' },
  { feature: 'Pinned columns', table: 'Yes', cards: '—', notes: 'Columns that stay in place while the table scrolls sideways.' },
  { feature: 'Very long lists', table: 'Yes', cards: '—', notes: 'Renders only the rows on screen. Needs a virtualization library, added by your team.' },
];

const featuresSection = (
  <Table>
    <Thead>
      <Tr>
        <Th scope="col">Feature</Th>
        <Th scope="col">Table view</Th>
        <Th scope="col">Card view</Th>
        <Th scope="col">Notes</Th>
      </Tr>
    </Thead>
    <Tbody>
      {featureRows.map((row) => (
        <Tr key={row.feature}>
          <Th scope="row">{row.feature}</Th>
          <Td>{row.table}</Td>
          <Td>{row.cards}</Td>
          <Td>{row.notes}</Td>
        </Tr>
      ))}
    </Tbody>
  </Table>
);

const behaviorSection = (
  <Prose>
    <Subheading>Sorting</Subheading>
    <Text>
      Only columns where order means something are sortable, such as dates, amounts, and status. Clicking a header
      sorts ascending, then descending, then back to the original order. Cards have a Sort by menu with the same
      columns and a Reverse sort order button.
    </Text>

    <Subheading>Search and filters</Subheading>
    <Text>
      Results update as people type, and the number of results is read out to screen reader users. Searching,
      filtering, or sorting goes back to the first page, so people never land on an empty page.
    </Text>

    <Subheading>Selection and bulk actions</Subheading>
    <ul className="dataview-entry-list">
      <li><Text>The header checkbox selects only the rows shown. Select all in the bulk actions bar selects every row, including rows hidden by a search or on other pages. With data from a server, it isn't shown, since the browser only has the current page.</Text></li>
      <li><Text>Selection stays when people sort, search, change page, or switch views. The bar shows the count, such as "2 of 40 selected".</Text></li>
      <li><Text>Actions and Clear selection appear once something is selected. Their space is kept, so nothing shifts.</Text></li>
      <li><Text>Use buttons when there's room, and a menu or icon menu on narrow screens.</Text></li>
    </ul>

    <Subheading>Loading, error, and empty</Subheading>
    <ul className="dataview-entry-list">
      <li><Text>Only one state shows at a time: loading first, then error, then empty.</Text></li>
      <li><Text>Every state has the same minimum height and keeps the height of the rows it replaces, so content below, such as pagination, doesn't jump.</Text></li>
      <li><Text>When new data loads while rows are shown, the rows stay in place, faded, with a progress bar. People keep their place and focus.</Text></li>
      <li><Text>Errors offer a Try again button. Each state's layout can be replaced to match the product.</Text></li>
    </ul>

    <Subheading>Opening details</Subheading>
    <ul className="dataview-entry-list">
      <li><Text>Clicking anywhere on a row or card opens its details. Clicks on checkboxes, links, and menus do what they normally do instead, and selecting text doesn't open anything.</Text></li>
      <li><Text>Each row also has a details button for keyboard and touch users. It appears on hover or focus, and is always shown on touch screens.</Text></li>
      <li><Text>The button's icon and label match where details open: a drawer, a page, or a new tab.</Text></li>
    </ul>

    <Subheading>Narrow screens</Subheading>
    <Text>
      Show the table where there's room and cards where there isn't. Switch on the space DataView has rather than
      the window size, so it also adapts in sidebars and split views. Everything people have done carries over when
      the view switches.
    </Text>
  </Prose>
);

const notIncludedSection = (
  <Prose>
    <Text>These aren't available today. If your product needs one, talk to the design system team first.</Text>
    <ul className="dataview-entry-list">
      <li><Text>Resizing, reordering, hiding, or showing columns</Text></li>
      <li><Text>Sorting by more than one column at a time</Text></li>
      <li><Text>Editing values in place</Text></li>
      <li><Text>Grouped or expandable rows</Text></li>
      <li><Text>Built-in filter controls: your team builds them</Text></li>
      <li><Text>What bulk and row actions do, such as exporting: your team provides it</Text></li>
    </ul>
  </Prose>
);

// ---------------------------------------------------------------------------
// Entry
// ---------------------------------------------------------------------------

export const dataview: ComponentEntry = {
  slug: 'dataview',
  name: 'DataView',
  category: 'Data Display & Content',
  summary:
    'One set of records shown as a table, as cards, or both, with sorting, search, filters, selection, bulk actions, pagination, and loading, error, and empty states.',
  sourcePath: 'packages/dataview',
  storybookId: 'dataview-dataview--docs',
  compactPreview: true,
  preview: <PreviewTable />,
  sections: [
    { id: 'overview', title: 'Overview', content: overviewSection },
    { id: 'when-to-use', title: 'When to use', content: whenToUseSection },
    { id: 'anatomy', title: 'Anatomy', content: anatomySection },
    { id: 'features', title: 'Features', content: featuresSection },
    { id: 'behavior', title: 'Behavior', content: behaviorSection },
    { id: 'not-included', title: 'Not included', content: notIncludedSection },
  ],
  examples: [
    {
      title: 'Table and cards',
      description:
        'Search, a status filter, selection with bulk actions, row actions, and pagination. Switch views to see sorting, search, selection, and the page carry over.',
      render: () => <OverviewExample />,
    },
    {
      title: 'Loading, error, and empty states',
      description: 'Each state keeps the same height. Refreshing keeps the rows in place, faded, with a progress bar.',
      render: () => <StatesExample />,
    },
    {
      title: 'Opening details',
      description: 'Click a row, or tab to its details button, to open the order in a drawer. Closing the drawer returns focus to where it was opened from.',
      render: () => <DetailsExample />,
    },
    {
      title: 'Pinned columns',
      description: 'The Order column stays in place while the rest of the table scrolls sideways.',
      render: () => <PinnedExample />,
    },
  ],
  accessibilityNotes: [
    'Give every table a name, with a visible caption or a label read only by screen readers. The name also labels the scroll area, which keyboard users can tab to when the table is wider than its space.',
    'Sorting, search results, selection changes, and page changes are announced through one screen reader message area, so announcements don\'t talk over each other.',
    'Every row has a name, taken from a column such as the customer. Checkboxes and details buttons use it: "Select Hanako Sato", "View details for Hanako Sato".',
    'Rows aren\'t keyboard targets themselves. Keyboard and screen reader users open details with the details button, which is always in the tab order.',
    'Errors are announced as alerts. While loading, the view is marked busy, and focus stays in place when a retry swaps the state.',
    'Focused cells scroll clear of the sticky header and pinned columns. In high contrast mode, hovered rows and the progress bar use system colors, and with reduced motion the progress bar slows instead of stopping.',
  ],
  propsIntro:
    'The main options, for a sense of what can be configured. For the full API and code examples, open the Storybook docs.',
  props: [
    { name: 'data', type: 'TData[]', description: 'useDataView: the records to show, or the current page of them with serverSide.' },
    { name: 'columns', type: 'ColumnDef[]', description: 'useDataView: each column\'s header, how its value looks, and whether it sorts.' },
    { name: 'pageSize', type: 'number', description: 'useDataView: rows per page. Without it, every row shows.' },
    { name: 'serverSide', type: 'boolean', default: 'false', description: 'useDataView: your server sorts, searches, filters, and pages. DataView reports changes with onQueryChange.' },
    { name: 'columnPinning', type: '{ left?, right? }', description: 'useDataView: columns that stay in place while the table scrolls sideways.' },
    { name: 'getRowLabel', type: '(row) => string', description: 'useDataView: names each row for its checkbox and details button. Defaults to the row header column.' },
    { name: 'selectable', type: 'boolean', default: 'false', description: 'TableView, CardView: adds selection checkboxes.' },
    { name: 'rowActions, cardActions', type: '(row) => ReactNode', description: 'TableView, CardView: the actions on each row or card.' },
    { name: 'rowClickOptions', type: 'RowClickOptions', description: 'TableView, CardView: opens a row\'s details on click, and adds the details button.' },
    { name: 'loading', type: 'boolean', default: 'false', description: 'TableView, CardView: shows the loading state, or fades the rows while new ones load.' },
    { name: 'error', type: 'ReactNode | true', description: 'TableView, CardView: shows the error state. Add onRetry for a Try again button.' },
    { name: 'emptyState', type: 'ReactNode', description: 'TableView, CardView: replaces the empty state\'s layout. loadingState and errorState do the same.' },
    { name: 'caption', type: 'ReactNode', description: 'TableView: names the table. Use aria-label when there\'s no visible title.' },
    { name: 'variant', type: "'button' | 'icon-button' | 'menu' | 'icon-menu'", default: "'button'", description: 'BulkActions: how the actions show.' },
  ],
  doDont: [
    {
      do: 'Make columns sortable where order means something, such as dates, amounts, and status.',
      dont: "Don't make every column sortable. Sorting notes or IDs rarely helps and crowds the headers.",
    },
    {
      do: 'Show cards when DataView is narrow, using the space it has rather than the window size.',
      dont: "Don't squeeze a wide table onto a phone, or hide columns people need to tell rows apart.",
    },
    {
      do: 'Give every table a name, and name each row after the value people know it by, such as a customer.',
      dont: "Don't leave tables unnamed or rows labelled by an internal ID.",
    },
    {
      do: 'Open details in a Drawer when people compare several rows, and on a page for long or editable details.',
      dont: "Don't make hover the only way to reach row actions or details.",
    },
    {
      do: 'Use Basic table for small, read-only data.',
      dont: "Don't add DataView where nobody sorts, searches, or selects.",
    },
  ],
  related: ['table', 'card', 'drawer', 'dropdown-menu', 'menu', 'tabs', 'tag'],
};
