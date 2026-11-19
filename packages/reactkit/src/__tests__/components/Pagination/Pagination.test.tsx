import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Pagination, getPaginationItems } from '../../../components/Pagination/Pagination';

expect.extend(toHaveNoViolations);

const pageButtons = () =>
  screen.getAllByRole('button').filter(b => /^Page /.test(b.getAttribute('aria-label') ?? ''));

const visibleLabels = () =>
  Array.from(document.querySelectorAll('.akds-pagination__item')).map(li => li.textContent);

describe('Pagination', () => {
  it('renders a navigation landmark with page and arrow buttons', () => {
    render(<Pagination count={3} />);
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeInTheDocument();
    expect(pageButtons()).toHaveLength(3);
    expect(screen.getByRole('button', { name: 'Page 2' })).toHaveTextContent('2');
  });

  it('applies default classes', () => {
    render(<Pagination count={3} />);
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('akds-pagination');
    expect(nav).not.toHaveClass('akds-pagination--disabled');
    expect(screen.getByRole('list')).toHaveClass('akds-pagination__list');
    expect(screen.getByRole('button', { name: 'Page 1' })).toHaveClass(
      'akds-pagination__button',
      'akds-pagination__button--current',
    );
    expect(screen.getByRole('button', { name: 'Previous page' })).toHaveClass('akds-pagination__button--previous');
    expect(screen.getByRole('button', { name: 'Next page' })).toHaveClass('akds-pagination__button--next');
  });

  it('marks only the current page with aria-current', () => {
    render(<Pagination count={5} page={3} />);
    expect(screen.getByRole('button', { name: 'Page 3' })).toHaveAttribute('aria-current', 'page');
    pageButtons()
      .filter(b => b.getAttribute('aria-label') !== 'Page 3')
      .forEach(b => expect(b).not.toHaveAttribute('aria-current'));
  });

  describe('truncation', () => {
    it('shows every page when they fit', () => {
      render(<Pagination count={7} />);
      expect(visibleLabels()).toEqual(['', '1', '2', '3', '4', '5', '6', '7', '']);
    });

    it('truncates the end near the start', () => {
      render(<Pagination count={20} page={2} />);
      expect(visibleLabels()).toEqual(['', '1', '2', '3', '4', '5', '…', '20', '']);
    });

    it('truncates both sides in the middle', () => {
      render(<Pagination count={20} page={10} />);
      expect(visibleLabels()).toEqual(['', '1', '…', '9', '10', '11', '…', '20', '']);
    });

    it('truncates the start near the end', () => {
      render(<Pagination count={20} page={19} />);
      expect(visibleLabels()).toEqual(['', '1', '…', '16', '17', '18', '19', '20', '']);
    });

    it('keeps the same number of slots as the page moves', () => {
      for (let page = 1; page <= 20; page++) {
        expect(getPaginationItems(page, 20, 1)).toHaveLength(7);
        expect(getPaginationItems(page, 20, 2)).toHaveLength(9);
      }
    });

    it('widens the window with siblingCount', () => {
      render(<Pagination count={20} page={10} siblingCount={2} />);
      expect(visibleLabels()).toEqual(['', '1', '…', '8', '9', '10', '11', '12', '…', '20', '']);
    });

    it('hides ellipses from assistive technology', () => {
      render(<Pagination count={20} page={10} />);
      const ellipses = document.querySelectorAll('.akds-pagination__ellipsis');
      expect(ellipses).toHaveLength(2);
      ellipses.forEach(e => expect(e.closest('li')).toHaveAttribute('aria-hidden', 'true'));
    });
  });

  it('applies disabled classes and disables every button', () => {
    render(<Pagination count={5} page={2} disabled />);
    expect(screen.getByRole('navigation')).toHaveClass('akds-pagination--disabled');
    screen.getAllByRole('button').forEach(b => {
      expect(b).toBeDisabled();
      expect(b).toHaveClass('akds-pagination__button--disabled');
    });
  });

  it('keeps previous focusable but inactive on the first page', () => {
    render(<Pagination count={5} />);
    const prev = screen.getByRole('button', { name: 'Previous page' });
    expect(prev).not.toBeDisabled();
    expect(prev).toHaveAttribute('aria-disabled', 'true');
    expect(prev).toHaveClass('akds-pagination__button--disabled');
    expect(screen.getByRole('button', { name: 'Next page' })).not.toHaveAttribute('aria-disabled');
  });

  it('keeps next focusable but inactive on the last page', () => {
    render(<Pagination count={5} page={5} />);
    const next = screen.getByRole('button', { name: 'Next page' });
    expect(next).not.toBeDisabled();
    expect(next).toHaveAttribute('aria-disabled', 'true');
  });

  it('calls onPageChange with the clicked page', async () => {
    const onPageChange = vi.fn();
    render(<Pagination count={5} page={2} onPageChange={onPageChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Page 4' }));
    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it('calls onPageChange from previous and next', async () => {
    const onPageChange = vi.fn();
    render(<Pagination count={5} page={3} onPageChange={onPageChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Previous page' }));
    await userEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(onPageChange).toHaveBeenNthCalledWith(1, 2);
    expect(onPageChange).toHaveBeenNthCalledWith(2, 4);
  });

  it('does not call onPageChange for the current page or an inactive arrow', async () => {
    const onPageChange = vi.fn();
    render(<Pagination count={5} page={1} onPageChange={onPageChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Page 1' }));
    await userEvent.click(screen.getByRole('button', { name: 'Previous page' }));
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it('does not call onPageChange when disabled', async () => {
    const onPageChange = vi.fn();
    render(<Pagination count={5} page={2} disabled onPageChange={onPageChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Page 3' }));
    await userEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it('works uncontrolled from defaultPage', async () => {
    render(<Pagination count={5} defaultPage={2} />);
    expect(screen.getByRole('button', { name: 'Page 2' })).toHaveAttribute('aria-current', 'page');
    await userEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(screen.getByRole('button', { name: 'Page 3' })).toHaveAttribute('aria-current', 'page');
  });

  it('follows the page prop when controlled', async () => {
    const onPageChange = vi.fn();
    const { rerender } = render(<Pagination count={5} page={2} onPageChange={onPageChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Page 4' }));
    // Controlled: nothing changes until the parent passes the new page.
    expect(screen.getByRole('button', { name: 'Page 2' })).toHaveAttribute('aria-current', 'page');
    rerender(<Pagination count={5} page={4} onPageChange={onPageChange} />);
    expect(screen.getByRole('button', { name: 'Page 4' })).toHaveAttribute('aria-current', 'page');
  });

  it('clamps an out-of-range page and a count below 1', () => {
    const { rerender } = render(<Pagination count={5} page={9} />);
    expect(screen.getByRole('button', { name: 'Page 5' })).toHaveAttribute('aria-current', 'page');
    rerender(<Pagination count={0} />);
    expect(pageButtons()).toHaveLength(1);
    expect(screen.getByRole('button', { name: 'Previous page' })).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByRole('button', { name: 'Next page' })).toHaveAttribute('aria-disabled', 'true');
  });

  it('keeps focus on next after it becomes inactive at the last page', async () => {
    render(<Pagination count={2} />);
    const next = screen.getByRole('button', { name: 'Next page' });
    next.focus();
    await userEvent.keyboard('{Enter}');
    expect(next).toHaveAttribute('aria-disabled', 'true');
    expect(next).toHaveFocus();
  });

  it('keeps focus on a clicked page button when the list re-flows', async () => {
    render(<Pagination count={20} defaultPage={4} />);
    await userEvent.click(screen.getByRole('button', { name: 'Page 5' }));
    expect(screen.getByRole('button', { name: 'Page 5' })).toHaveFocus();
  });

  it('supports custom labels', () => {
    render(
      <Pagination
        count={3}
        aria-label="Orders pages"
        previousLabel="Vorherige Seite"
        nextLabel="Nächste Seite"
        getPageLabel={p => `Seite ${p}`}
      />,
    );
    expect(screen.getByRole('navigation', { name: 'Orders pages' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Vorherige Seite' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Nächste Seite' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Seite 2' })).toBeInTheDocument();
  });

  it('forwards additional HTML attributes', () => {
    render(<Pagination count={3} data-testid="pager" className="custom" id="p1" />);
    const nav = screen.getByTestId('pager');
    expect(nav).toHaveClass('akds-pagination', 'custom');
    expect(nav).toHaveAttribute('id', 'p1');
  });

  it('forwards ref to the nav element', () => {
    const ref = React.createRef<HTMLElement>();
    render(<Pagination ref={ref} count={3} />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current?.tagName).toBe('NAV');
  });

  describe('axe accessibility', () => {
    it('has no violations in default state', async () => {
      const { container } = render(<Pagination count={5} />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations when truncated', async () => {
      const { container } = render(<Pagination count={50} page={25} />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations on the last page', async () => {
      const { container } = render(<Pagination count={5} page={5} />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations when disabled', async () => {
      const { container } = render(<Pagination count={5} page={2} disabled />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
