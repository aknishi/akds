import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { useDataViewField } from '../../DataViewField/useDataViewField';
import { DataViewCard } from '../../DataViewCard/DataViewCard';
import { CardHarness } from '../fixtures/CardHarness';

expect.extend(toHaveNoViolations);

// A team-built field: the hook gives the parts, the team owns the markup.
function DescriptionField({ column }: { column: string }) {
  const field = useDataViewField(column);
  if (!field) return <span data-testid={`missing-${column}`} />;
  return (
    <div>
      <dt>{field.label}</dt>
      <dd>{field.value}</dd>
    </div>
  );
}

function DescriptionCards() {
  return (
    <CardHarness>
      {(row) => (
        <DataViewCard title={row.original.customer}>
          <dl>
            <DescriptionField column="status" />
            <DescriptionField column="total" />
          </dl>
        </DataViewCard>
      )}
    </CardHarness>
  );
}

describe('useDataViewField', () => {
  it('returns the column label from a string header', () => {
    render(<DescriptionCards />);
    const card = screen.getByRole('article', { name: 'Hanako Sato' });
    expect(within(card).getByText('Status').tagName).toBe('DT');
  });

  it('returns meta.ariaLabel when the header is not a string', () => {
    render(<DescriptionCards />);
    const card = screen.getByRole('article', { name: 'Hanako Sato' });
    expect(within(card).getByText('Order total').tagName).toBe('DT');
  });

  it('returns the column cell rendered for the row', () => {
    render(<DescriptionCards />);
    const card = screen.getByRole('article', { name: 'Hanako Sato' });
    const values = card.querySelectorAll('dd');
    expect(values[0]!.querySelector('.akds-tag')!.textContent).toBe('Processing');
  });

  it('adds no markup of its own', () => {
    render(<DescriptionCards />);
    const card = screen.getByRole('article', { name: 'Hanako Sato' });
    const list = card.querySelector('dl')!;
    for (const child of Array.from(list.children)) {
      expect(child.tagName).toBe('DIV');
      expect(Array.from(child.children).map((el) => el.tagName)).toEqual(['DT', 'DD']);
    }
    expect(card.querySelector('.akds-visually-hidden.akds-dataview-field')).toBeNull();
  });

  it('returns null for an unknown column', () => {
    render(
      <CardHarness>
        {(row) => (
          <DataViewCard title={row.original.customer}>
            <DescriptionField column="missing" />
          </DataViewCard>
        )}
      </CardHarness>,
    );
    expect(screen.getAllByTestId('missing-missing').length).toBeGreaterThan(0);
  });

  it('throws a helpful error outside CardView', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const onWindowError = (e: ErrorEvent) => e.preventDefault();
    window.addEventListener('error', onWindowError);
    expect(() => render(<DescriptionField column="status" />)).toThrow(
      'DataViewCard and DataViewField must be used inside CardView.',
    );
    window.removeEventListener('error', onWindowError);
    consoleSpy.mockRestore();
  });

  describe('axe accessibility', () => {
    it('has no violations in a description list layout', async () => {
      const { container } = render(<DescriptionCards />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
