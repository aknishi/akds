import React from 'react';

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The header content — typically an icon and a title. */
  children: React.ReactNode;
}
