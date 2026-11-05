import type { TextInputProps } from '@aknishi/akds-reactkit';

export interface SearchProps extends Omit<TextInputProps, 'label' | 'value' | 'defaultValue' | 'onChange' | 'startAdornment'> {
  /** Visible label for the search field, e.g. "Search orders". Required. */
  label: string;
  /**
   * Limits the search to one column id. When omitted, the search matches
   * across all columns using TanStack's global filter.
   */
  column?: string;
}
