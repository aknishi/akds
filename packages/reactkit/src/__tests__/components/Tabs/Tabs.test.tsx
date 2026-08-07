import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Tabs } from '../../../components/Tabs/Tabs';
import { TabList } from '../../../components/TabList/TabList';
import { Tab } from '../../../components/Tab/Tab';
import { TabPanel } from '../../../components/TabPanel/TabPanel';

expect.extend(toHaveNoViolations);

class MockResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

// jsdom does not implement ResizeObserver — TabList instantiates one on mount.
vi.stubGlobal('ResizeObserver', MockResizeObserver);

function TabsFixture({ defaultActiveTab = 'a', onChange }: { defaultActiveTab?: string; onChange?: (v: string) => void }) {
  return (
    <Tabs defaultActiveTab={defaultActiveTab} {...(onChange !== undefined && { onChange })}>
      <TabList>
        <Tab value="a">Tab A</Tab>
        <Tab value="b">Tab B</Tab>
        <Tab value="c" disabled>Tab C</Tab>
      </TabList>
      <TabPanel value="a">Panel A</TabPanel>
      <TabPanel value="b">Panel B</TabPanel>
      <TabPanel value="c">Panel C</TabPanel>
    </Tabs>
  );
}

describe('Tabs', () => {
  it('renders tab buttons and the active panel', () => {
    render(<TabsFixture />);
    expect(screen.getByRole('tab', { name: 'Tab A' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Tab B' })).toBeInTheDocument();
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel A');
  });

  it('applies default classes', () => {
    render(<TabsFixture />);
    expect(screen.getByRole('tablist').closest('.akds-tabs')).toBeInTheDocument();
    expect(screen.getByRole('tablist')).toHaveClass('akds-tab-list');
    expect(screen.getByRole('tab', { name: 'Tab A' })).toHaveClass('akds-tab');
  });

  it('active tab has aria-selected=true', () => {
    render(<TabsFixture defaultActiveTab="a" />);
    expect(screen.getByRole('tab', { name: 'Tab A' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Tab B' })).toHaveAttribute('aria-selected', 'false');
  });

  it('active tab gets --active modifier class', () => {
    render(<TabsFixture defaultActiveTab="a" />);
    expect(screen.getByRole('tab', { name: 'Tab A' })).toHaveClass('akds-tab--active');
    expect(screen.getByRole('tab', { name: 'Tab B' })).not.toHaveClass('akds-tab--active');
  });

  it('switches panel on tab click', async () => {
    render(<TabsFixture />);
    await userEvent.click(screen.getByRole('tab', { name: 'Tab B' }));
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel B');
  });

  it('calls onChange with the clicked tab value', async () => {
    const onChange = vi.fn();
    render(<TabsFixture onChange={onChange} />);
    await userEvent.click(screen.getByRole('tab', { name: 'Tab B' }));
    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('disabled tab cannot be clicked', async () => {
    render(<TabsFixture defaultActiveTab="a" />);
    await userEvent.click(screen.getByRole('tab', { name: 'Tab C' }));
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel A');
  });

  it('disabled tab has disabled attribute and --disabled class', () => {
    render(<TabsFixture />);
    const tabC = screen.getByRole('tab', { name: 'Tab C' });
    expect(tabC).toBeDisabled();
    expect(tabC).toHaveClass('akds-tab--disabled');
  });

  it('controlled: respects activeTab prop', () => {
    const { rerender } = render(
      <Tabs activeTab="a">
        <TabList>
          <Tab value="a">A</Tab>
          <Tab value="b">B</Tab>
        </TabList>
        <TabPanel value="a">Panel A</TabPanel>
        <TabPanel value="b">Panel B</TabPanel>
      </Tabs>,
    );
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel A');
    rerender(
      <Tabs activeTab="b">
        <TabList>
          <Tab value="a">A</Tab>
          <Tab value="b">B</Tab>
        </TabList>
        <TabPanel value="a">Panel A</TabPanel>
        <TabPanel value="b">Panel B</TabPanel>
      </Tabs>,
    );
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel B');
  });

  it('forwards ref to root div', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Tabs ref={ref} defaultActiveTab="a"><TabList><Tab value="a">A</Tab></TabList><TabPanel value="a">P</TabPanel></Tabs>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('forwards data attributes', () => {
    render(<TabsFixture />);
    render(
      <Tabs data-testid="tabs-root" defaultActiveTab="a">
        <TabList><Tab value="a">A</Tab></TabList>
        <TabPanel value="a">P</TabPanel>
      </Tabs>,
    );
    expect(screen.getByTestId('tabs-root')).toBeInTheDocument();
  });

  describe('axe accessibility', () => {
    it('has no violations in default state', async () => {
      const { container } = render(<TabsFixture defaultActiveTab="a" />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations with a disabled tab', async () => {
      const { container } = render(<TabsFixture defaultActiveTab="a" />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});

function MiddleDisabledFixture() {
  return (
    <Tabs defaultActiveTab="a">
      <TabList>
        <Tab value="a">Tab A</Tab>
        <Tab value="b" disabled>Tab B</Tab>
        <Tab value="c">Tab C</Tab>
      </TabList>
      <TabPanel value="a">Panel A</TabPanel>
      <TabPanel value="b">Panel B</TabPanel>
      <TabPanel value="c">Panel C</TabPanel>
    </Tabs>
  );
}

describe('TabList', () => {
  it('renders as a tablist', () => {
    render(<TabsFixture />);
    expect(screen.getByRole('tablist')).toBeInTheDocument();
  });

  it('applies default class', () => {
    render(<TabsFixture />);
    expect(screen.getByRole('tablist')).toHaveClass('akds-tab-list');
  });

  it('merges a custom className with the default class', () => {
    render(
      <Tabs defaultActiveTab="a">
        <TabList className="custom-list">
          <Tab value="a">Tab A</Tab>
        </TabList>
        <TabPanel value="a">Panel A</TabPanel>
      </Tabs>,
    );
    const tablist = screen.getByRole('tablist');
    expect(tablist).toHaveClass('akds-tab-list');
    expect(tablist).toHaveClass('custom-list');
  });

  it('renders the active-tab indicator element', () => {
    render(<TabsFixture />);
    expect(screen.getByRole('tablist').querySelector('.akds-tab-list__indicator')).toBeInTheDocument();
  });

  it('forwards ref to the tablist div', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <Tabs defaultActiveTab="a">
        <TabList ref={ref}>
          <Tab value="a">Tab A</Tab>
        </TabList>
        <TabPanel value="a">Panel A</TabPanel>
      </Tabs>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toBe(screen.getByRole('tablist'));
  });

  it('forwards data attributes', () => {
    render(
      <Tabs defaultActiveTab="a">
        <TabList data-testid="tab-list-root">
          <Tab value="a">Tab A</Tab>
        </TabList>
        <TabPanel value="a">Panel A</TabPanel>
      </Tabs>,
    );
    expect(screen.getByTestId('tab-list-root')).toBeInTheDocument();
  });

  it('ArrowRight moves focus to and activates the next tab', async () => {
    const onChange = vi.fn();
    render(<TabsFixture onChange={onChange} />);
    screen.getByRole('tab', { name: 'Tab A' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Tab B' })).toHaveFocus();
    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('ArrowRight wraps from the last enabled tab to the first', async () => {
    render(<TabsFixture defaultActiveTab="b" />);
    screen.getByRole('tab', { name: 'Tab B' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Tab A' })).toHaveFocus();
  });

  it('ArrowLeft moves focus to and activates the previous tab', async () => {
    const onChange = vi.fn();
    render(<TabsFixture defaultActiveTab="b" onChange={onChange} />);
    screen.getByRole('tab', { name: 'Tab B' }).focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(screen.getByRole('tab', { name: 'Tab A' })).toHaveFocus();
    expect(onChange).toHaveBeenCalledWith('a');
  });

  it('ArrowLeft wraps from the first tab to the last enabled tab', async () => {
    render(<TabsFixture />);
    screen.getByRole('tab', { name: 'Tab A' }).focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(screen.getByRole('tab', { name: 'Tab B' })).toHaveFocus();
  });

  it('Home moves focus to and activates the first tab', async () => {
    render(<TabsFixture defaultActiveTab="b" />);
    screen.getByRole('tab', { name: 'Tab B' }).focus();
    await userEvent.keyboard('{Home}');
    expect(screen.getByRole('tab', { name: 'Tab A' })).toHaveFocus();
    expect(screen.getByRole('tab', { name: 'Tab A' })).toHaveAttribute('aria-selected', 'true');
  });

  it('End moves focus to and activates the last enabled tab', async () => {
    render(<TabsFixture defaultActiveTab="a" />);
    screen.getByRole('tab', { name: 'Tab A' }).focus();
    await userEvent.keyboard('{End}');
    expect(screen.getByRole('tab', { name: 'Tab B' })).toHaveFocus();
    expect(screen.getByRole('tab', { name: 'Tab B' })).toHaveAttribute('aria-selected', 'true');
  });

  it('skips disabled tabs when navigating with arrow keys', async () => {
    render(<MiddleDisabledFixture />);
    screen.getByRole('tab', { name: 'Tab A' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Tab C' })).toHaveFocus();
  });

  it('forwards unhandled key events to the onKeyDown prop', async () => {
    const onKeyDown = vi.fn();
    render(
      <Tabs defaultActiveTab="a">
        <TabList onKeyDown={onKeyDown}>
          <Tab value="a">Tab A</Tab>
          <Tab value="b">Tab B</Tab>
        </TabList>
        <TabPanel value="a">Panel A</TabPanel>
        <TabPanel value="b">Panel B</TabPanel>
      </Tabs>,
    );
    screen.getByRole('tab', { name: 'Tab A' }).focus();
    await userEvent.keyboard('x');
    expect(onKeyDown).toHaveBeenCalled();
  });

  describe('axe accessibility', () => {
    it('has no violations in default state', async () => {
      const { container } = render(<TabsFixture defaultActiveTab="a" />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations with a disabled tab in the middle', async () => {
      const { container } = render(<MiddleDisabledFixture />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
