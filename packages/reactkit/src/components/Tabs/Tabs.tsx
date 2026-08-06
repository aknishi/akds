import React from 'react';
import clsx from 'clsx';
import './Tabs.css';
import type { TabsProps } from './Tabs.types';
import { TabContext } from '../Tab/TabContext';
import { makePrefixer } from '../../utils/makePrefixer';

const withBaseName = makePrefixer('akds-tabs');

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  function Tabs(
    {
      activeTab,
      defaultActiveTab = '',
      onChange,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const isControlled = activeTab !== undefined;
    const [internalActive, setInternalActive] = React.useState(defaultActiveTab);
    const resolvedActive = isControlled ? activeTab! : internalActive;

    const handleTabChange = React.useCallback(
      (value: string) => {
        if (!isControlled) setInternalActive(value);
        onChange?.(value);
      },
      [isControlled, onChange],
    );

    const ctx = React.useMemo(
      () => ({ activeTab: resolvedActive, onTabChange: handleTabChange }),
      [resolvedActive, handleTabChange],
    );

    return (
      <TabContext.Provider value={ctx}>
        <div ref={ref} className={clsx(withBaseName(), className)} {...rest}>
          {children}
        </div>
      </TabContext.Provider>
    );
  },
);

Tabs.displayName = 'Tabs';
