import React from 'react';
import clsx from 'clsx';
import './Pagination.css';
import type { PaginationProps } from './Pagination.types';
import { Pagination as PageButtons } from '@aknishi/akds-reactkit';
import { useDataViewInstance } from '../headless';
import { useAnnounce } from '../headless/announcer';
import { makePrefixer } from '../utils';

const withBaseName = makePrefixer('akds-dataview-pagination');

/**
 * Moves between pages of the rows shown by TableView and CardView. Needs
 * `pageSize` or `serverSide` in useDataView; without them every row is
 * already shown, so there's nothing to page through and it renders nothing.
 */
export function Pagination<TData>({
  'aria-label': ariaLabel = 'Pagination',
  siblingCount = 1,
  className,
  ...rest
}: PaginationProps) {
  const { table, state } = useDataViewInstance<TData>();
  const announce = useAnnounce();

  // Rows after search and filters, before paging. Server-side, the
  // server's rowCount.
  const totalCount = table.getRowCount();
  const paged = Boolean(table.options.getPaginationRowModel) || table.options.manualPagination === true;
  // With no rows the view shows its empty, loading, or error state instead.
  // Server-side it stays while a page loads or fails (the server still has
  // rows), so a focused page button isn't removed under the user.
  if (!paged || totalCount === 0) return null;

  const { pageIndex, pageSize } = state.pagination;
  const pageCount = table.getPageCount();
  const range = (index: number) => {
    const first = index * pageSize + 1;
    const last = Math.min((index + 1) * pageSize, totalCount);
    return `${first}–${last} of ${totalCount}`;
  };

  // Focus stays on the page button, and screen readers don't reliably
  // announce the new rows or the moved aria-current, so the new page is
  // announced here. Set from the click rather than an effect so the reset
  // to page 1 after a sort or search isn't announced on top of theirs.
  const handlePageChange = (page: number) => {
    table.setPageIndex(page - 1);
    announce(`Page ${page} of ${pageCount}, showing rows ${range(page - 1)}.`);
  };

  return (
    <div className={clsx(withBaseName(), className)} {...rest}>
      <span className={withBaseName.el('summary')}>{range(pageIndex)}</span>
      <PageButtons
        aria-label={ariaLabel}
        count={pageCount}
        page={pageIndex + 1}
        onPageChange={handlePageChange}
        siblingCount={siblingCount}
      />
    </div>
  );
}

Pagination.displayName = 'Pagination';
