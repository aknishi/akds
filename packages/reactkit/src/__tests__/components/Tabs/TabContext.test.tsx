import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TabContext } from '../../../components/Tab/TabContext';

describe('TabContext default value', () => {
  it('is inert outside Tabs: no active tab, no-op change, no ids', () => {
    function Probe() {
      const ctx = React.useContext(TabContext);
      ctx.onTabChange('a');
      return <span data-testid="probe">{`${ctx.activeTab}|${String(ctx.getId('tab', 'a'))}`}</span>;
    }
    render(<Probe />);
    expect(screen.getByTestId('probe')).toHaveTextContent('|undefined');
  });
});
