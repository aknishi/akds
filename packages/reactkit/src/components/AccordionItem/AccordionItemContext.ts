import React from 'react';

export interface AccordionItemContextValue {
  isExpanded: (value: string) => boolean;
  onToggle: (value: string) => void;
}

export const AccordionItemContext = React.createContext<AccordionItemContextValue>({
  isExpanded: () => false,
  onToggle: () => {},
});
