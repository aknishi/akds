import { compareStatus, generateOrders } from './data';
import type { Order } from './data';

export const TOTAL_ORDERS = 500;
const ALL_ORDERS = generateOrders(TOTAL_ORDERS);
const LATENCY_MS = 800;

export interface OrdersPage {
  orders: Order[];
  hasMore: boolean;
}

/** A stand-in for a paged orders API, with network latency. `fail` simulates a network error. */
export function fetchOrdersPage(page: number, pageSize: number, { fail = false } = {}): Promise<OrdersPage> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (fail) {
        reject(new Error('Network error'));
        return;
      }
      const start = page * pageSize;
      resolve({
        orders: ALL_ORDERS.slice(start, start + pageSize),
        hasMore: start + pageSize < TOTAL_ORDERS,
      });
    }, LATENCY_MS);
  });
}

export interface OrdersQuery {
  pageIndex: number;
  pageSize: number;
  sorting: { id: string; desc: boolean }[];
  globalFilter: string | undefined;
  columnFilters: { id: string; value: unknown }[];
}

export interface OrdersResult {
  /** One page of orders, already searched, filtered, and sorted. */
  orders: Order[];
  /** How many orders match the search and filters, across all pages. */
  total: number;
}

// The columns the in-browser search looks at, so both demos find the same rows.
const SEARCHABLE: (keyof Order)[] = ['id', 'customer', 'status', 'total', 'shippingCost', 'carrier', 'trackingId', 'items', 'date'];

/**
 * A stand-in for an orders API that searches, filters, sorts, and pages on
 * the server, with network latency. `fail` simulates a network error.
 */
export function fetchOrders(query: OrdersQuery, { fail = false } = {}): Promise<OrdersResult> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (fail) {
        reject(new Error('Network error'));
        return;
      }
      const search = query.globalFilter?.trim().toLowerCase();
      const statuses = query.columnFilters.find((filter) => filter.id === 'status')?.value as Order['status'][] | undefined;
      let matches = ALL_ORDERS.filter((order) =>
        (!search || SEARCHABLE.some((key) => String(order[key]).toLowerCase().includes(search))) &&
        (!statuses || statuses.includes(order.status)));

      const [sort] = query.sorting;
      if (sort) {
        const key = sort.id as keyof Order;
        matches = [...matches].sort((a, b) => {
          // Status sorts by progress, matching the column's sortingFn.
          const order = key === 'status'
            ? compareStatus(a.status, b.status)
            : a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0;
          return sort.desc ? -order : order;
        });
      }

      const start = query.pageIndex * query.pageSize;
      resolve({ orders: matches.slice(start, start + query.pageSize), total: matches.length });
    }, LATENCY_MS);
  });
}
