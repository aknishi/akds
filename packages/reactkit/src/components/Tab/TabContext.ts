import React from 'react';

export interface TabContextValue {
  activeTab: string;
  onTabChange: (value: string) => void;
}

export const TabContext = React.createContext<TabContextValue>({
  activeTab: '',
  onTabChange: () => {},
});
