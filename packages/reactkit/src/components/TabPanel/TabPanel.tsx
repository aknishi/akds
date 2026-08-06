import React from 'react';
import clsx from 'clsx';
import './TabPanel.css';
import type { TabPanelProps } from './TabPanel.types';
import { TabContext } from '../Tab/TabContext';
import { makePrefixer } from '../../utils/makePrefixer';

const withBaseName = makePrefixer('akds-tab-panel');

export const TabPanel = React.forwardRef<HTMLDivElement, TabPanelProps>(
  function TabPanel({ value, className, children, ...rest }, ref) {
    const { activeTab } = React.useContext(TabContext);
    const isActive = activeTab === value;

    if (!isActive) return null;

    return (
      <div
        ref={ref}
        role="tabpanel"
        tabIndex={0}
        className={clsx(withBaseName(), className)}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

TabPanel.displayName = 'TabPanel';
