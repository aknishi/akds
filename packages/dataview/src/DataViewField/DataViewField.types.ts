import type React from 'react';

export interface DataViewFieldProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** The column id whose cell renderer to show for the current row. */
  column: string;
}
