import React from 'react';
import clsx from 'clsx';
import { VisuallyHidden } from '@aknishi/akds-reactkit';
import type { DataViewFieldProps } from './DataViewField.types';
import { useDataViewField } from './useDataViewField';
import { makePrefixer } from '../utils';

const withBaseName = makePrefixer('akds-dataview-field');

/** Renders a column's cell renderer for the current card's row, so a field looks identical in the table and in cards. */
export const DataViewField = React.forwardRef<HTMLDivElement, DataViewFieldProps>(
  function DataViewField(
    {
      column,
      className,
      ...rest
    },
    ref,
  ) {
    const field = useDataViewField(column);
    if (!field) return null;

    return (
      <div ref={ref} className={clsx(withBaseName(), className)} {...rest}>
        {/* Cards have no column headers, so the label gives screen-reader users the context. */}
        <VisuallyHidden>{field.label}: </VisuallyHidden>
        {field.value}
      </div>
    );
  },
);

DataViewField.displayName = 'DataViewField';
