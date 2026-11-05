import React, { useCallback, useEffect, useRef, useState } from 'react';
// Teams install @tanstack/react-virtual themselves; DataView doesn't bundle it.
import { useVirtualizer } from '@tanstack/react-virtual';
import { ActionsMenu, Button, Flexbox, MenuItem, Switch, Text, useBreakpointUp, useMediaQuery, VisuallyHidden } from '@aknishi/akds-reactkit';
import { CopyIcon, DownloadIcon } from '@aknishi/akds-icons';
import { DataViewScrollArea, useDataView } from '../index';
import type { BulkAction, BulkActionsVariant } from '../index';
import { columns } from './columns';
import { fetchOrdersPage } from './api';
import type { Order } from './data';

// Bulk actions get the original data of every selected row.
const bulkActions: (BulkAction<Order> & { icon: React.ReactNode })[] = [
  { label: 'Export', icon: <DownloadIcon size="sm" />, onSelect: (rows) => console.log('export', rows) },
  { label: 'Copy', icon: <CopyIcon size="sm" />, onSelect: (rows) => console.log('copy', rows) },
];

// Row actions render in each row's actions cell. Name the menu after the row
// so every row's menu button is distinct to screen readers.
function OrderActions({ order }: { order: Order }) {
  return (
    <ActionsMenu label={`Actions for ${order.customer}`}>
      <MenuItem onClick={() => console.log('view', order.id)}>View details</MenuItem>
      <MenuItem onClick={() => console.log('cancel', order.id)}>Cancel order</MenuItem>
    </ActionsMenu>
  );
}

// Switches BulkActions by screen size: the given variant when there's room,
// a labelled menu on small screens, and the icon menu on the smallest. 600px
// isn't a breakpoint token, it's where the labelled menu button stops fitting
// beside the selection controls.
function useBulkActionsVariant(wide: 'button' | 'icon-button' = 'button'): BulkActionsVariant {
  const isWide = useBreakpointUp('md');
  const isNarrow = useMediaQuery('(max-width: 599px)');
  if (isWide) return wide;
  return isNarrow ? 'icon-menu' : 'menu';
}

const PAGE_SIZE = 50;
const ROW_HEIGHT_ESTIMATE = 53;
// After this many automatic fetches, the user loads more with a button.
const AUTO_FETCH_LIMIT = 2;

export function VirtualizedDemo() {
  // Icon buttons on wide screens in this example, to show that variant.
  const bulkActionsVariant = useBulkActionsVariant('icon-button');
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagesLoaded, setPagesLoaded] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Makes every request fail, to show the error states.
  const [simulateError, setSimulateError] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  // A ref, not state, so two scroll events in a row can't start two fetches.
  const fetchingRef = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { TableView, BulkActions, tableSource } = useDataView({
    data: orders,
    columns,
    getRowId: (row) => row.id,
  });
  const rows = tableSource.getRowModel().rows;

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT_ESTIMATE,
    overscan: 10,
  });

  const fetchNextPage = useCallback(async () => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    setIsFetching(true);
    try {
      const page = await fetchOrdersPage(pagesLoaded, PAGE_SIZE, { fail: simulateError });
      setOrders((prev) => [...prev, ...page.orders]);
      setPagesLoaded((prev) => prev + 1);
      setHasMore(page.hasMore);
      setError(null);
      const total = orders.length + page.orders.length;
      setAnnouncement(pagesLoaded === 0 ? `${total} orders loaded.` : `${page.orders.length} more orders loaded. ${total} orders in total.`);
    } catch {
      // Both error messages are in role="alert" regions, so they announce
      // themselves; no extra announcement needed.
      setError(pagesLoaded === 0 ? 'Couldn’t load orders.' : 'Couldn’t load more orders.');
    } finally {
      // Always reset, or a failed request would leave the demo loading forever.
      setIsFetching(false);
      fetchingRef.current = false;
    }
  }, [pagesLoaded, orders.length, simulateError]);

  // First page on mount. Deliberately runs once, so fetchNextPage isn't a dependency.
  useEffect(() => {
    void fetchNextPage();
  }, []);

  // The first page doesn't count as an automatic fetch.
  // No automatic retries after an error: scrolling would keep firing failed requests.
  const canAutoFetch = hasMore && !error && pagesLoaded > 0 && pagesLoaded <= AUTO_FETCH_LIMIT;
  const virtualItems = virtualizer.getVirtualItems();
  const lastVisibleIndex = virtualItems[virtualItems.length - 1]?.index;

  useEffect(() => {
    if (canAutoFetch && lastVisibleIndex !== undefined && lastVisibleIndex >= rows.length - 1) {
      void fetchNextPage();
    }
  }, [canAutoFetch, lastVisibleIndex, rows.length, fetchNextPage]);

  return (
    <Flexbox direction="column" gap="sm">
      <Text>
        Showing {orders.length} orders. Scrolling to the end loads more automatically {AUTO_FETCH_LIMIT} times, then
        a button appears.
      </Text>
      <Switch
        label="Simulate network errors"
        checked={simulateError}
        onChange={(e) => setSimulateError(e.target.checked)}
      />
      <BulkActions variant={bulkActionsVariant} actions={bulkActions} />
      {/* The team sets the height, which decides how many rows are visible. */}
      <DataViewScrollArea ref={scrollRef} style={{ height: '480px' }}>
        {/* Each page adds rows after the ones shown, so this is loadingMore:
            the table shows "Loading more…" after the last row, or its loading
            state while there are no rows yet. */}
        <TableView
          selectable
          loadingMore={isFetching}
          // Only shown while there are no rows; a failed "load more" is
          // shown in the footer below instead.
          error={error}
          onRetry={() => void fetchNextPage()}
          virtualizer={virtualizer}
          rowActions={(row) => <OrderActions order={row.original} />}
        />
        <Flexbox justify="center" align="center" gap="sm" padding="md">
          {!isFetching && error && orders.length > 0 && (
            <Flexbox role="alert" align="center" gap="sm">
              <Text styleAs="caption">{error}</Text>
              <Button size="sm" appearance="bordered" onClick={() => void fetchNextPage()}>
                Try again
              </Button>
            </Flexbox>
          )}
          {!isFetching && !error && hasMore && !canAutoFetch && pagesLoaded > 0 && (
            <Button appearance="bordered" onClick={() => void fetchNextPage()}>
              Load more orders
            </Button>
          )}
          {!hasMore && <Text styleAs="caption">All orders loaded.</Text>}
        </Flexbox>
      </DataViewScrollArea>
      <VisuallyHidden role="status">{announcement}</VisuallyHidden>
    </Flexbox>
  );
}
