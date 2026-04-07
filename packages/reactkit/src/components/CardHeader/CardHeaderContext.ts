import React from 'react';

export interface CardHeaderContextValue {
  /** When true, the card has no border and dividers are hidden. */
  borderless: boolean;
}

export const CardHeaderContext = React.createContext<CardHeaderContextValue>({
  borderless: false,
});
