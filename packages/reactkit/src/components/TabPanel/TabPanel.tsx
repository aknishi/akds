import React from 'react';
import clsx from 'clsx';
import './TabPanel.css';
import type { TabPanelProps } from './TabPanel.types';
import { TabContext } from '../Tab/TabContext';
import { makePrefixer } from '../../utils/makePrefixer';

const withBaseName = makePrefixer('akds-tab-panel');

export const TabPanel = React.forwardRef<HTMLDivElement, TabPanelProps>(
  function TabPanel({ value, className, children, ...rest }, ref) {
    const { activeTab, getId } = React.useContext(TabContext);
    const isActive = activeTab === value;

    // Inactive panels stay in the DOM (empty and hidden) so each tab's
    // aria-controls always references an existing element, while content
    // still mounts only when its tab is selected.
    return (
      <div
        ref={ref}
        role="tabpanel"
        id={getId('panel', value)}
        aria-labelledby={getId('tab', value)}
        tabIndex={isActive ? 0 : undefined}
        hidden={!isActive}
        className={clsx(withBaseName(), className)}
        {...rest}
      >
        {isActive ? children : null}
      </div>
    );
  },
);

TabPanel.displayName = 'TabPanel';
