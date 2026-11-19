/**
 * Returns a function that builds prefixed BEM class names. Copied from
 * reactkit rather than imported, so this package doesn't depend on
 * reactkit internals.
 *
 * @example
 * const withBaseName = makePrefixer('akds-dataview-card');
 * withBaseName()              // 'akds-dataview-card'
 * withBaseName('selected')    // 'akds-dataview-card--selected'
 * withBaseName.el('body')     // 'akds-dataview-card__body'
 */
export function makePrefixer(prefix: string) {
  function withBaseName(modifier?: string) {
    return modifier ? `${prefix}--${modifier}` : prefix;
  }
  withBaseName.el = (element: string) => `${prefix}__${element}`;
  return withBaseName;
}
