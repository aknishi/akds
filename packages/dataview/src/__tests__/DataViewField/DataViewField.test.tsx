import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { DataViewField } from '../../DataViewField/DataViewField';
import { DataViewCard } from '../../DataViewCard/DataViewCard';
import { useDataView } from '../../useDataView/useDataView';
import { CardHarness } from '../fixtures/CardHarness';
import { testColumns, testOrders } from '../fixtures/orders';

describe('DataViewField', () => {
  it('renders the same tag text as the table cell for that row', () => {
    function Both() {
      const { TableView, CardView } = useDataView({ data: testOrders, columns: testColumns, getRowId: (row) => row.id });
      return (
        <>
          <TableView />
          <CardView>
            {(row) => (
              <DataViewCard title={row.getValue<string>('customer')}>
                <DataViewField column="status" />
              </DataViewCard>
            )}
          </CardView>
        </>
      );
    }
    render(<Both />);
    const tableRow = screen.getByRole('rowheader', { name: 'Kenji Ito' }).closest('tr')!;
    const tableTag = tableRow.querySelector('.akds-tag')!;
    const cardTag = screen.getByRole('group', { name: 'Kenji Ito' }).querySelector('.akds-tag')!;
    expect(cardTag.textContent).toBe('Shipped');
    expect(cardTag.textContent).toBe(tableTag.textContent);
    expect(cardTag.className).toBe(tableTag.className);
  });

  it('prefixes the value with a visually hidden column label', () => {
    render(<CardHarness />);
    const field = screen.getByRole('group', { name: 'Hanako Sato' }).querySelector('.akds-dataview-field')!;
    const label = within(field as HTMLElement).getByText('Status:');
    expect(label).toHaveClass('akds-visually-hidden');
    expect(field.textContent).toBe('Status: Processing');
  });

  it('uses meta.ariaLabel when the header is not a string', () => {
    render(<CardHarness />);
    expect(screen.getAllByText('Order total:')[0]).toHaveClass('akds-visually-hidden');
  });

  it('renders nothing for an unknown column', () => {
    render(
      <CardHarness>
        {(row) => (
          <DataViewCard title={row.original.customer}>
            <DataViewField column="missing" data-testid="missing" />
          </DataViewCard>
        )}
      </CardHarness>,
    );
    expect(screen.queryByTestId('missing')).not.toBeInTheDocument();
  });

  it('forwards HTML attributes and ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <CardHarness>
        {(row) =>
          row.id === 'ORD-1' ? (
            <DataViewCard title={row.original.customer}>
              <DataViewField ref={ref} column="status" data-testid="field" className="custom" />
            </DataViewCard>
          ) : null
        }
      </CardHarness>,
    );
    expect(screen.getByTestId('field')).toBe(ref.current);
    expect(ref.current).toHaveClass('akds-dataview-field', 'custom');
  });

  it('throws a helpful error outside CardView', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const onWindowError = (e: ErrorEvent) => e.preventDefault();
    window.addEventListener('error', onWindowError);
    expect(() => render(<DataViewField column="status" />)).toThrow(
      'DataViewCard and DataViewField must be used inside CardView.',
    );
    window.removeEventListener('error', onWindowError);
    consoleSpy.mockRestore();
  });
});
