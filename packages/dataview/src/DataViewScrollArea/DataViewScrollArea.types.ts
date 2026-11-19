import type React from 'react';

export interface DataViewScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Usually a virtualized TableView, plus anything that should scroll with it (e.g. a "Load more" button). */
  children: React.ReactNode;
}
