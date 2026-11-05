export interface Order {
  id: string;
  customer: string;
  status: 'Processing' | 'Shipped' | 'Delayed' | 'Delivered';
  total: number;
  /** 0 when shipping is free. */
  shippingCost: number;
  trackingId: string;
  date: string;
  items: number;
  carrier: string;
  notes: string;
}

const FIRST_NAMES = ['Hanako', 'Kenji', 'Maria', 'Liam', 'Aisha', 'Noah', 'Yuki', 'Sofia', 'Mateo', 'Chloe', 'Ravi', 'Emma', 'Daniel', 'Mei', 'Omar', 'Grace'];
const LAST_NAMES = ['Sato', 'Ito', 'Garcia', 'Chen', 'Okafor', 'Müller', 'Tanaka', 'Rossi', 'Silva', 'Martin', 'Patel', 'Kim', 'Nguyen', 'Johansson', 'Haddad', 'Walsh'];
export const ORDER_STATUSES: Order['status'][] = ['Processing', 'Shipped', 'Delayed', 'Delivered'];
const CARRIERS = ['DHL', 'USPS', 'UPS'];
const NOTES = [
  'Leave at the front desk.',
  'Gift wrap requested.',
  'Customer asked for a call before delivery.',
  'Fragile — ceramic items.',
  'Deliver after 6 pm.',
  'No notes.',
];

// Seeded PRNG (mulberry32) so the demo looks identical on every run.
function createRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SHIPPING_RATES = [4.99, 7.99, 12.99];

export function generateOrders(count: number): Order[] {
  const random = createRandom(1024);
  // A separate sequence for fields added later, so adding them didn't change
  // the existing fields of any order.
  const extraRandom = createRandom(2048);
  const pick = <T,>(list: readonly T[]): T => list[Math.floor(random() * list.length)] as T;
  const start = Date.UTC(2026, 6, 1);

  return Array.from({ length: count }, (_, index) => {
    const day = new Date(start + Math.floor(random() * 90) * 86_400_000);
    const order = {
      id: `ORD-${1024 + index}`,
      customer: index === 0 ? 'Hanako Sato' : `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`,
      status: pick(ORDER_STATUSES),
      total: Math.round((15 + random() * 485) * 2) / 2,
      date: day.toISOString().slice(0, 10),
      items: 1 + Math.floor(random() * 8),
      carrier: pick(CARRIERS),
      notes: pick(NOTES),
    };
    return {
      ...order,
      // Free shipping on orders of $250 or more
      shippingCost: order.total >= 250 ? 0 : SHIPPING_RATES[Math.floor(extraRandom() * SHIPPING_RATES.length)] as number,
      trackingId: `TRK${String(Math.floor(extraRandom() * 1e10)).padStart(10, '0')}`,
    };
  });
}
