/**
 * Returns a function that builds prefixed class names.
 *
 * @example
 * const withBaseName = makePrefixer('akds-button');
 * withBaseName()           // 'akds-button'
 * withBaseName('primary')  // 'akds-button-primary'
 */
export function makePrefixer(prefix: string) {
  return (suffix?: string) => (suffix ? `${prefix}--${suffix}` : prefix);
}
