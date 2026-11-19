/**
 * Logs a console warning outside production builds. The literal
 * `process.env.NODE_ENV` lets bundlers replace and strip it; the `typeof`
 * guard keeps unbundled browser ESM from throwing.
 */
export function devWarning(message: string): void {
  if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
    console.warn(`[akds] ${message}`);
  }
}
