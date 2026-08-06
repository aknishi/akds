/**
 * Returns a function that builds prefixed BEM class names.
 *
 * Call the function for the root class or a BEM modifier (`--`).
 * Use `.el()` for BEM child element classes (`__`).
 *
 * @example
 * const withBaseName = makePrefixer('akds-button');
 * withBaseName()              // 'akds-button'
 * withBaseName('disabled')    // 'akds-button--disabled'
 * withBaseName.el('label')    // 'akds-button__label'
 * withBaseName.el('icon')     // 'akds-button__icon'
 */
export function makePrefixer(prefix: string) {
  function withBaseName(modifier?: string) {
    return modifier ? `${prefix}--${modifier}` : prefix;
  }
  withBaseName.el = (element: string) => `${prefix}__${element}`;
  return withBaseName;
}
