import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { useDataView } from '../../useDataView/useDataView';
import type { BulkAction, BulkActionsVariant } from '../../BulkActions/BulkActions.types';
import { testColumns, testOrders } from '../fixtures/orders';
import type { TestOrder } from '../fixtures/orders';

expect.extend(toHaveNoViolations);

function Harness({
  actions,
  variant = 'menu',
}: {
  actions: (BulkAction<TestOrder> & { icon: React.ReactNode })[];
  variant?: BulkActionsVariant;
}) {
  const { BulkActions, TableView, Search } = useDataView({ data: testOrders, columns: testColumns, getRowId: (row) => row.id });
  return (
    <>
      <Search label="Search orders" />
      <BulkActions variant={variant} actions={actions} />
      <TableView selectable />
    </>
  );
}

const exportAction = () => ({ label: 'Export', icon: <svg aria-hidden="true" data-testid="export-icon" />, onSelect: vi.fn() });
const summary = () => document.querySelector('.akds-dataview-bulk-actions__summary');
// useDataView's one live region, shared by every DataView component.
const announcement = () => document.querySelector('body > [role="status"]');
const trigger = () => document.querySelector<HTMLButtonElement>('.akds-dataview-bulk-actions .akds-actions-menu')!;
const actionsGroup = () => document.querySelector('.akds-dataview-bulk-actions__actions')!;
// Looked up by class: while hidden (visibility: hidden) it has no accessible name.
const clearButton = () => document.querySelector<HTMLButtonElement>('.akds-dataview-bulk-actions__clear')!;
// Checkbox inputs have pointer-events: none; fireEvent toggles them like a label click.
const selectAllButton = () => document.querySelector<HTMLButtonElement>('.akds-dataview-bulk-actions__select-all');
const checkedNames = () =>
  screen.queryAllByRole('checkbox', { checked: true }).map((box) => box.closest('label')?.textContent);
const toggle = (name: string) => fireEvent.click(screen.getByRole('checkbox', { name }));

describe('BulkActions', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows the row count with Clear selection and the actions hidden when nothing is selected', () => {
    render(<Harness actions={[exportAction()]} />);
    expect(summary()).toHaveTextContent('3 rows');
    expect(clearButton()).toHaveClass('akds-dataview-bulk-actions__clear--hidden');
    expect(actionsGroup()).toHaveClass('akds-dataview-bulk-actions__actions--hidden');
  });

  it.each(['button', 'icon-button', 'menu', 'icon-menu'] as const)(
    'hides the actions until rows are selected (%s)',
    (variant) => {
      render(<Harness variant={variant} actions={[exportAction()]} />);
      expect(actionsGroup()).toHaveClass('akds-dataview-bulk-actions__actions--hidden');
      toggle('Select Kenji Ito');
      expect(actionsGroup()).not.toHaveClass('akds-dataview-bulk-actions__actions--hidden');
    },
  );

  it('updates the count and shows the actions and Clear selection when rows are selected', () => {
    render(<Harness actions={[exportAction()]} />);
    toggle('Select Kenji Ito');
    expect(summary()).toHaveTextContent('1 of 3 selected');
    // Named by its visible text; the selection count is in the summary beside it.
    expect(trigger()).toHaveAccessibleName('Bulk actions');
    expect(trigger()).not.toHaveAttribute('aria-disabled');
    expect(clearButton()).not.toHaveClass('akds-dataview-bulk-actions__clear--hidden');
    expect(screen.getByRole('button', { name: 'Clear selection' })).toBe(clearButton());

    toggle('Select Maria Garcia');
    expect(summary()).toHaveTextContent('2 of 3 selected');
  });

  it('counts every row, including rows hidden by a search', () => {
    render(<Harness actions={[exportAction()]} />);
    toggle('Select Kenji Ito');
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'garcia' } });
    expect(summary()).toHaveTextContent('1 of 3 selected');
  });

  it('announces selection once it pauses, not after every change', () => {
    vi.useFakeTimers();
    render(<Harness actions={[exportAction()]} />);
    expect(announcement()).toBeEmptyDOMElement();

    toggle('Select Kenji Ito');
    act(() => vi.advanceTimersByTime(100));
    toggle('Select Maria Garcia');
    act(() => vi.advanceTimersByTime(100));
    expect(announcement()).toBeEmptyDOMElement();

    act(() => vi.advanceTimersByTime(300));
    expect(announcement()).toHaveTextContent('2 rows selected. Bulk actions available above table.');

    toggle('Select Kenji Ito');
    toggle('Select Maria Garcia');
    act(() => vi.advanceTimersByTime(300));
    expect(announcement()).toHaveTextContent('Selection cleared.');
  });

  it("passes the selected rows' data to the chosen action", async () => {
    const user = userEvent.setup();
    const action = exportAction();
    render(<Harness actions={[action, { label: 'Copy', icon: null, onSelect: vi.fn() }]} />);
    toggle('Select Kenji Ito');
    toggle('Select Maria Garcia');

    await user.click(trigger());
    expect(screen.getAllByRole('menuitem').map((item) => item.textContent)).toEqual(['Export', 'Copy']);
    await user.click(screen.getByRole('menuitem', { name: 'Export' }));
    expect(action.onSelect).toHaveBeenCalledWith([testOrders[1], testOrders[2]]);
  });

  it('clears the selection and moves focus to Select all', async () => {
    const user = userEvent.setup();
    render(<Harness actions={[exportAction()]} />);
    toggle('Select Kenji Ito');

    await user.click(clearButton());
    expect(summary()).toHaveTextContent('3 rows');
    expect(screen.getByRole('checkbox', { name: 'Select Kenji Ito' })).not.toBeChecked();
    expect(selectAllButton()).toHaveFocus();
  });

  describe('button variant', () => {
    it('is the default and shows labelled buttons with their icons once rows are selected', () => {
      function Default() {
        const { BulkActions, TableView } = useDataView({ data: testOrders, columns: testColumns, getRowId: (row) => row.id });
        return (
          <>
            <BulkActions actions={[exportAction()]} />
            <TableView selectable />
          </>
        );
      }
      render(<Default />);
      expect(document.querySelector('.akds-dataview-bulk-actions')).toHaveClass('akds-dataview-bulk-actions--button');
      expect(actionsGroup()).toHaveClass('akds-dataview-bulk-actions__actions--hidden');

      toggle('Select Kenji Ito');
      expect(actionsGroup()).not.toHaveClass('akds-dataview-bulk-actions__actions--hidden');
      const button = screen.getByRole('button', { name: 'Export' });
      expect(button).toHaveClass('akds-button--bordered');
      expect(button.firstElementChild).toBe(screen.getByTestId('export-icon'));
    });

    it("passes the selected rows' data to the clicked action", async () => {
      const user = userEvent.setup();
      const action = exportAction();
      render(<Harness variant="button" actions={[action]} />);
      toggle('Select Maria Garcia');
      await user.click(screen.getByRole('button', { name: 'Export' }));
      expect(action.onSelect).toHaveBeenCalledWith([testOrders[2]]);
    });
  });

  describe('icon-button variant', () => {
    it('names each icon button with its action and the selection count', () => {
      render(<Harness variant="icon-button" actions={[exportAction()]} />);
      expect(actionsGroup()).toHaveClass('akds-dataview-bulk-actions__actions--hidden');

      toggle('Select Kenji Ito');
      expect(screen.getByRole('button', { name: 'Export 1 selected row' })).toHaveClass('akds-icon-button');
      toggle('Select Maria Garcia');
      expect(screen.getByRole('button', { name: 'Export 2 selected rows' })).toBeInTheDocument();
    });

    it('requires an icon on every action (checked by the type checker)', () => {
      function MissingIcon() {
        const { BulkActions } = useDataView({ data: testOrders, columns: testColumns });
        return (
          // @ts-expect-error -- "icon-button" needs an icon for each action
          <BulkActions variant="icon-button" actions={[{ label: 'Export', onSelect: () => {} }]} />
        );
      }
      expect(MissingIcon).toBeTypeOf('function');
    });

    it("passes the selected rows' data to the clicked action", async () => {
      const user = userEvent.setup();
      const action = exportAction();
      render(<Harness variant="icon-button" actions={[action]} />);
      toggle('Select Kenji Ito');
      await user.click(screen.getByRole('button', { name: 'Export 1 selected row' }));
      expect(action.onSelect).toHaveBeenCalledWith([testOrders[1]]);
    });
  });

  describe('icon-menu variant', () => {
    it('uses the more-actions icon button, named "Bulk actions"', async () => {
      const user = userEvent.setup();
      const action = exportAction();
      render(<Harness variant="icon-menu" actions={[action]} />);
      toggle('Select Kenji Ito');
      expect(trigger()).toHaveClass('akds-icon-button');
      expect(trigger()).toHaveAccessibleName('Bulk actions');
      await user.click(trigger());
      await user.click(screen.getByRole('menuitem', { name: 'Export' }));
      expect(action.onSelect).toHaveBeenCalledWith([testOrders[1]]);
    });
  });

  describe('menu variant', () => {
    it('uses a labelled button with a chevron as the trigger', () => {
      render(<Harness variant="menu" actions={[exportAction()]} />);
      expect(trigger()).toHaveClass('akds-button', 'akds-button--bordered');
      expect(trigger()).toHaveAttribute('aria-haspopup', 'menu');
      expect(trigger().querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    });
  });

  it('selects every row with Select all, including rows hidden by a search', async () => {
    const user = userEvent.setup();
    render(<Harness actions={[exportAction()]} />);
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'garcia' } });

    // jsdom drops the space before visually hidden text; browsers keep it.
    await user.click(screen.getByRole('button', { name: /^Select all\s?3 rows$/ }));
    expect(summary()).toHaveTextContent('3 of 3 selected');
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: '' } });
    expect(checkedNames()).toHaveLength(4);
  });

  it('removes Select all once every row is selected and moves focus to Clear selection', async () => {
    const user = userEvent.setup();
    render(<Harness actions={[exportAction()]} />);
    expect(selectAllButton()).toBeInTheDocument();

    await user.click(selectAllButton()!);
    expect(selectAllButton()).not.toBeInTheDocument();
    expect(clearButton()).toHaveFocus();

    toggle('Select Kenji Ito');
    expect(selectAllButton()).toBeInTheDocument();
  });

  it('leaves the header checkbox selecting only the rows shown', () => {
    render(<Harness actions={[exportAction()]} />);
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'garcia' } });
    fireEvent.click(screen.getByRole('checkbox', { name: 'Select all shown rows' }));
    expect(summary()).toHaveTextContent('1 of 3 selected');
  });

  it('passes HTML attributes to the container', () => {
    function WithAttributes() {
      const { BulkActions } = useDataView({ data: testOrders, columns: testColumns });
      return <BulkActions actions={[]} aria-label="Selection" className="custom" />;
    }
    const { container } = render(<WithAttributes />);
    expect(container.firstChild).toHaveClass('akds-dataview-bulk-actions', 'custom');
    expect(container.firstChild).toHaveAttribute('aria-label', 'Selection');
  });

  describe('axe accessibility', () => {
    it('has no violations with nothing selected', async () => {
      const { container } = render(<Harness actions={[exportAction()]} />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it.each(['button', 'icon-button', 'menu', 'icon-menu'] as const)('has no violations with rows selected (%s)', async (variant) => {
      const { container } = render(<Harness variant={variant} actions={[exportAction()]} />);
      toggle('Select Kenji Ito');
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
