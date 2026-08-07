import React from 'react';
import clsx from 'clsx';
import './TabList.css';
import type { TabListProps } from './TabList.types';
import { TabContext } from '../Tab/TabContext';
import { makePrefixer } from '../../utils/makePrefixer';

const withBaseName = makePrefixer('akds-tab-list');

export const TabList = React.forwardRef<HTMLDivElement, TabListProps>(
  function TabList({ className, children, onKeyDown, ...rest }, ref) {
    const listRef = React.useRef<HTMLDivElement>(null);
    const { activeTab } = React.useContext(TabContext);
    const [indicatorStyle, setIndicatorStyle] = React.useState({
      transform: 'translateX(0px)',
      width: 0,
    });

    React.useImperativeHandle(ref, () => listRef.current!);

    React.useLayoutEffect(() => {
      const container = listRef.current;
      if (!container) return;

      const updateIndicator = () => {
        const activeEl = container.querySelector<HTMLElement>('.akds-tab--active');
        setIndicatorStyle(
          activeEl
            ? { transform: `translateX(${activeEl.offsetLeft}px)`, width: activeEl.offsetWidth }
            : { transform: 'translateX(0px)', width: 0 },
        );
      };

      updateIndicator();

      const observer = new ResizeObserver(updateIndicator);
      observer.observe(container);

      return () => observer.disconnect();
    }, [activeTab, children]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      const tabs = Array.from(
        listRef.current?.querySelectorAll<HTMLButtonElement>(
          '[role="tab"]:not([disabled])',
        ) ?? [],
      );
      const idx = tabs.indexOf(document.activeElement as HTMLButtonElement);

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          tabs[(idx + 1) % tabs.length]?.focus();
          tabs[(idx + 1) % tabs.length]?.click();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          tabs[(idx - 1 + tabs.length) % tabs.length]?.focus();
          tabs[(idx - 1 + tabs.length) % tabs.length]?.click();
          break;
        case 'Home':
          e.preventDefault();
          tabs[0]?.focus();
          tabs[0]?.click();
          break;
        case 'End':
          e.preventDefault();
          tabs[tabs.length - 1]?.focus();
          tabs[tabs.length - 1]?.click();
          break;
        default:
          onKeyDown?.(e);
      }
    };

    return (
      <div
        ref={listRef}
        role="tablist"
        className={clsx(withBaseName(), className)}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {children}
        <span className={withBaseName.el('indicator')} style={indicatorStyle} />
      </div>
    );
  },
);

TabList.displayName = 'TabList';
