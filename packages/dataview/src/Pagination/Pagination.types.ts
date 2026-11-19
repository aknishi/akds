export interface PaginationProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'aria-label'> {
  /**
   * Names the pagination landmark, e.g. "Orders pages". Defaults to
   * "Pagination". Give each a distinct name when a page has more than one.
   */
  'aria-label'?: string;
  /** Number of page buttons shown on each side of the current page before an ellipsis. */
  siblingCount?: number;
}
