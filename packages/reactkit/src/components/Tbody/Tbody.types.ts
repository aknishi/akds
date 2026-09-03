import React from 'react';

export interface TbodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  /** When true, applies alternating row background colors (zebra striping). Off by default. */
  striped?: boolean;
  /** Body content — typically one or more Tr elements containing Td cells. */
  children: React.ReactNode;
}
