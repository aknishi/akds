const INPUT_KEYS = new Set(['id', 'required', 'form', 'autoFocus']);

/**
 * Splits props spread on a wrapping `<label>` into those that belong on the
 * inner `<input>` (ARIA attributes, `id`, `required`, `form`, `autoFocus`) and
 * those that stay on the label (className, style, data-*, event handlers).
 */
export function splitInputProps<T extends Record<string, unknown>>(
  props: T,
): { inputProps: Record<string, unknown>; labelProps: Record<string, unknown> } {
  const inputProps: Record<string, unknown> = {};
  const labelProps: Record<string, unknown> = {};
  for (const key of Object.keys(props)) {
    if (key.startsWith('aria-') || INPUT_KEYS.has(key)) {
      inputProps[key] = props[key];
    } else {
      labelProps[key] = props[key];
    }
  }
  return { inputProps, labelProps };
}
