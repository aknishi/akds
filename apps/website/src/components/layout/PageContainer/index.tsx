import type React from 'react';

export interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return <div className={`page-container${className ? ` ${className}` : ''}`}>{children}</div>;
}
