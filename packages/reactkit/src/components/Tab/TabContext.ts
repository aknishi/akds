import React from 'react';

export interface TabContextValue {
  activeTab: string;
  onTabChange: (value: string) => void;
  /** Returns the DOM id for a tab or its panel, used to link them via ARIA. */
  getId: (kind: 'tab' | 'panel', value: string) => string | undefined;
}

export const TabContext = React.createContext<TabContextValue>({
  activeTab: '',
  onTabChange: () => {},
  getId: () => undefined,
});
