/** One slot in the rendered page list: a page number or a gap marker. */
export type PaginationItem = number | 'start-ellipsis' | 'end-ellipsis';

export interface PaginationProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> {
  /** Total number of pages. Values below 1 are treated as 1. */
  count: number;
  /** The current page (1-based). Pass with `onPageChange` to control the component. */
  page?: number;
  /** The page shown on first render when uncontrolled (1-based). */
  defaultPage?: number;
  /** Called with the new page number when the user picks a page or presses previous/next. */
  onPageChange?: (page: number) => void;
  /**
   * Number of page buttons shown on each side of the current page before an
   * ellipsis. The first and last pages are always shown.
   */
  siblingCount?: number;
  /** When true, disables every button in the component. */
  disabled?: boolean;
  /**
   * Builds the accessible name for each page button. Defaults to
   * `Page ${page}`. Override for localization.
   */
  getPageLabel?: (page: number) => string;
  /** Accessible name for the previous-page button. */
  previousLabel?: string;
  /** Accessible name for the next-page button. */
  nextLabel?: string;
  /**
   * Accessible name for the navigation landmark. Overrides the inherited
   * optional type with a default of "Pagination" — change it when a page has
   * more than one Pagination so each landmark is distinguishable.
   */
  'aria-label'?: string;
}
