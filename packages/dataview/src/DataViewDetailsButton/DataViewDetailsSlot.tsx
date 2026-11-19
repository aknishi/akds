import React from 'react';
import clsx from 'clsx';
import './DataViewDetailsButton.css';
import type { Row } from '@tanstack/react-table';
import { IGNORE_CLICK_ATTRIBUTE } from '../headless/rowClick';
import type { RowClickOptions } from '../headless/rowClickOptions';
import { DataViewDetailsButton } from './DataViewDetailsButton';
import { makePrefixer } from '../utils';

const withBaseName = makePrefixer('akds-dataview-details');

export interface DataViewDetailsSlotProps<TData> {
  row: Row<TData>;
  rowLabel: string;
  options: RowClickOptions<TData>;
}

/**
 * Where a row's or card's details control sits: the team's `renderButton`,
 * or the default DataViewDetailsButton. The slot, not the control, handles
 * what must work whatever is rendered: fading in on hover (while staying in
 * the tab order), and keeping clicks on it from also counting as a row
 * click. Internal — not exported.
 */
export function DataViewDetailsSlot<TData>({ row, rowLabel, options }: DataViewDetailsSlotProps<TData>) {
  const { renderButton, revealButtonOnHover = true } = options;
  const onClick = (event: React.MouseEvent<HTMLElement>) => options.onClick(row, event);

  return (
    <span
      className={clsx(withBaseName(), { [withBaseName('reveal')]: revealButtonOnHover })}
      {...{ [IGNORE_CLICK_ATTRIBUTE]: '' }}
    >
      {renderButton
        ? renderButton({ row, rowLabel, onClick })
        : <DataViewDetailsButton rowLabel={rowLabel} onClick={onClick} />}
    </span>
  );
}
