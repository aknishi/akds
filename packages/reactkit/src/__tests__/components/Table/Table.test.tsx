import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Table } from '../../../components/Table/Table';
import { Thead } from '../../../components/Thead/Thead';
import { Tbody } from '../../../components/Tbody/Tbody';
import { Tfoot } from '../../../components/Tfoot/Tfoot';
import { Tr } from '../../../components/Tr/Tr';
import { Th } from '../../../components/Th/Th';
import { Td } from '../../../components/Td/Td';

expect.extend(toHaveNoViolations);

describe('Table', () => {
  it('renders a table element with the correct role', () => {
    render(
      <Table>
        <Tbody>
          <Tr>
            <Td>Cell</Td>
          </Tr>
        </Tbody>
      </Table>,
    );
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('applies base class', () => {
    render(
      <Table data-testid="table">
        <Tbody>
          <Tr>
            <Td>Cell</Td>
          </Tr>
        </Tbody>
      </Table>,
    );
    expect(screen.getByTestId('table')).toHaveClass('akds-table');
  });

  it('applies wrapperClassName to the outer wrapper', () => {
    render(
      <Table wrapperClassName="custom-wrapper" data-testid="table">
        <Tbody>
          <Tr>
            <Td>Cell</Td>
          </Tr>
        </Tbody>
      </Table>,
    );
    const wrapper = screen.getByTestId('table').parentElement;
    expect(wrapper).toHaveClass('akds-table__wrapper');
    expect(wrapper).toHaveClass('custom-wrapper');
  });

  it('passes through className and HTML attributes to the table element', () => {
    render(
      <Table className="custom" data-testid="table">
        <Tbody>
          <Tr>
            <Td>Cell</Td>
          </Tr>
        </Tbody>
      </Table>,
    );
    const el = screen.getByTestId('table');
    expect(el).toHaveClass('custom');
    expect(el).toHaveClass('akds-table');
  });

  it('forwards ref to the table element', () => {
    const ref = React.createRef<HTMLTableElement>();
    render(
      <Table ref={ref}>
        <Tbody>
          <Tr>
            <Td>Cell</Td>
          </Tr>
        </Tbody>
      </Table>,
    );
    expect(ref.current?.tagName).toBe('TABLE');
  });

  describe('Thead / Tbody / Tfoot', () => {
    it('renders each with its base class', () => {
      render(
        <Table>
          <Thead data-testid="thead">
            <Tr>
              <Th>Header</Th>
            </Tr>
          </Thead>
          <Tbody data-testid="tbody">
            <Tr>
              <Td>Cell</Td>
            </Tr>
          </Tbody>
          <Tfoot data-testid="tfoot">
            <Tr>
              <Td>Footer</Td>
            </Tr>
          </Tfoot>
        </Table>,
      );
      expect(screen.getByTestId('thead')).toHaveClass('akds-thead');
      expect(screen.getByTestId('tbody')).toHaveClass('akds-tbody');
      expect(screen.getByTestId('tfoot')).toHaveClass('akds-tfoot');
    });

    it('does not apply striped class by default', () => {
      render(
        <Table>
          <Tbody data-testid="tbody">
            <Tr>
              <Td>Cell</Td>
            </Tr>
          </Tbody>
        </Table>,
      );
      expect(screen.getByTestId('tbody')).not.toHaveClass('akds-tbody--striped');
    });

    it('applies striped class when striped prop is true', () => {
      render(
        <Table>
          <Tbody striped data-testid="tbody">
            <Tr>
              <Td>Cell</Td>
            </Tr>
          </Tbody>
        </Table>,
      );
      expect(screen.getByTestId('tbody')).toHaveClass('akds-tbody--striped');
    });
  });

  describe('Tr', () => {
    it('applies base class and forwards ref', () => {
      const ref = React.createRef<HTMLTableRowElement>();
      render(
        <Table>
          <Tbody>
            <Tr ref={ref} data-testid="row">
              <Td>Cell</Td>
            </Tr>
          </Tbody>
        </Table>,
      );
      expect(screen.getByTestId('row')).toHaveClass('akds-tr');
      expect(ref.current?.tagName).toBe('TR');
    });
  });

  describe('Th', () => {
    it('renders as a columnheader with scope', () => {
      render(
        <Table>
          <Thead>
            <Tr>
              <Th scope="col">Name</Th>
            </Tr>
          </Thead>
        </Table>,
      );
      const th = screen.getByRole('columnheader', { name: 'Name' });
      expect(th).toHaveAttribute('scope', 'col');
    });

    it('applies base class', () => {
      render(
        <Table>
          <Thead>
            <Tr>
              <Th data-testid="th">Name</Th>
            </Tr>
          </Thead>
        </Table>,
      );
      expect(screen.getByTestId('th')).toHaveClass('akds-th');
    });

    it('applies alignment modifier classes', () => {
      const { rerender } = render(
        <Table>
          <Thead>
            <Tr>
              <Th data-testid="th" align="center">Name</Th>
            </Tr>
          </Thead>
        </Table>,
      );
      expect(screen.getByTestId('th')).toHaveClass('akds-th--center');

      rerender(
        <Table>
          <Thead>
            <Tr>
              <Th data-testid="th" align="right">Name</Th>
            </Tr>
          </Thead>
        </Table>,
      );
      expect(screen.getByTestId('th')).toHaveClass('akds-th--right');
    });

    it('forwards ref to the th element', () => {
      const ref = React.createRef<HTMLTableCellElement>();
      render(
        <Table>
          <Thead>
            <Tr>
              <Th ref={ref}>Name</Th>
            </Tr>
          </Thead>
        </Table>,
      );
      expect(ref.current?.tagName).toBe('TH');
    });

    describe('resizable', () => {
      it('does not render a resize handle by default', () => {
        render(
          <Table>
            <Thead>
              <Tr>
                <Th>Name</Th>
              </Tr>
            </Thead>
          </Table>,
        );
        expect(screen.queryByRole('separator')).not.toBeInTheDocument();
      });

      it('renders a resize handle and applies the resizable class when resizable is true', () => {
        render(
          <Table>
            <Thead>
              <Tr>
                <Th resizable data-testid="th">Name</Th>
              </Tr>
            </Thead>
          </Table>,
        );
        expect(screen.getByTestId('th')).toHaveClass('akds-th--resizable');
        const handle = screen.getByRole('separator', { name: 'Resize column' });
        expect(handle).toHaveAttribute('aria-orientation', 'vertical');
        expect(handle).toHaveAttribute('tabindex', '0');
      });

      it('applies defaultWidth as the initial style width (uncontrolled)', () => {
        render(
          <Table>
            <Thead>
              <Tr>
                <Th resizable defaultWidth={200} data-testid="th">Name</Th>
              </Tr>
            </Thead>
          </Table>,
        );
        expect(screen.getByTestId('th')).toHaveStyle({ width: '200px' });
      });

      it('updates width via drag when uncontrolled and calls onWidthChange', () => {
        const onWidthChange = vi.fn();
        render(
          <Table>
            <Thead>
              <Tr>
                <Th resizable defaultWidth={200} onWidthChange={onWidthChange} data-testid="th">Name</Th>
              </Tr>
            </Thead>
          </Table>,
        );
        const handle = screen.getByRole('separator');
        fireEvent.pointerDown(handle, { clientX: 100, pointerId: 1 });
        fireEvent.pointerMove(handle, { clientX: 130, pointerId: 1 });
        fireEvent.pointerUp(handle, { clientX: 130, pointerId: 1 });

        expect(onWidthChange).toHaveBeenCalledWith(230);
        expect(screen.getByTestId('th')).toHaveStyle({ width: '230px' });
      });

      it('does not go below the minimum column width when dragged narrower', () => {
        const onWidthChange = vi.fn();
        render(
          <Table>
            <Thead>
              <Tr>
                <Th resizable defaultWidth={60} onWidthChange={onWidthChange} data-testid="th">Name</Th>
              </Tr>
            </Thead>
          </Table>,
        );
        const handle = screen.getByRole('separator');
        fireEvent.pointerDown(handle, { clientX: 100, pointerId: 1 });
        fireEvent.pointerMove(handle, { clientX: -500, pointerId: 1 });

        expect(onWidthChange).toHaveBeenCalledWith(48);
        expect(screen.getByTestId('th')).toHaveStyle({ width: '48px' });
      });

      it('does not update its own width when controlled, but still calls onWidthChange', () => {
        const onWidthChange = vi.fn();
        render(
          <Table>
            <Thead>
              <Tr>
                <Th resizable width={200} onWidthChange={onWidthChange} data-testid="th">Name</Th>
              </Tr>
            </Thead>
          </Table>,
        );
        const handle = screen.getByRole('separator');
        fireEvent.pointerDown(handle, { clientX: 100, pointerId: 1 });
        fireEvent.pointerMove(handle, { clientX: 150, pointerId: 1 });

        expect(onWidthChange).toHaveBeenCalledWith(250);
        expect(screen.getByTestId('th')).toHaveStyle({ width: '200px' });
      });

      it('reflects an updated controlled width prop', () => {
        const { rerender } = render(
          <Table>
            <Thead>
              <Tr>
                <Th resizable width={200} onWidthChange={() => {}} data-testid="th">Name</Th>
              </Tr>
            </Thead>
          </Table>,
        );
        rerender(
          <Table>
            <Thead>
              <Tr>
                <Th resizable width={320} onWidthChange={() => {}} data-testid="th">Name</Th>
              </Tr>
            </Thead>
          </Table>,
        );
        expect(screen.getByTestId('th')).toHaveStyle({ width: '320px' });
      });

      it('resizes via the arrow keys when the handle is focused', () => {
        const onWidthChange = vi.fn();
        render(
          <Table>
            <Thead>
              <Tr>
                <Th resizable defaultWidth={200} onWidthChange={onWidthChange} data-testid="th">Name</Th>
              </Tr>
            </Thead>
          </Table>,
        );
        const handle = screen.getByRole('separator');
        fireEvent.keyDown(handle, { key: 'ArrowRight' });
        expect(onWidthChange).toHaveBeenLastCalledWith(210);
        expect(screen.getByTestId('th')).toHaveStyle({ width: '210px' });

        fireEvent.keyDown(handle, { key: 'ArrowLeft' });
        expect(onWidthChange).toHaveBeenLastCalledWith(200);
        expect(screen.getByTestId('th')).toHaveStyle({ width: '200px' });
      });
    });
  });

  describe('Td', () => {
    it('renders as a cell', () => {
      render(
        <Table>
          <Tbody>
            <Tr>
              <Td>Value</Td>
            </Tr>
          </Tbody>
        </Table>,
      );
      expect(screen.getByRole('cell', { name: 'Value' })).toBeInTheDocument();
    });

    it('applies base class', () => {
      render(
        <Table>
          <Tbody>
            <Tr>
              <Td data-testid="td">Value</Td>
            </Tr>
          </Tbody>
        </Table>,
      );
      expect(screen.getByTestId('td')).toHaveClass('akds-td');
    });

    it('applies alignment modifier classes', () => {
      const { rerender } = render(
        <Table>
          <Tbody>
            <Tr>
              <Td data-testid="td" align="center">Value</Td>
            </Tr>
          </Tbody>
        </Table>,
      );
      expect(screen.getByTestId('td')).toHaveClass('akds-td--center');

      rerender(
        <Table>
          <Tbody>
            <Tr>
              <Td data-testid="td" align="right">Value</Td>
            </Tr>
          </Tbody>
        </Table>,
      );
      expect(screen.getByTestId('td')).toHaveClass('akds-td--right');
    });

    it('forwards ref to the td element', () => {
      const ref = React.createRef<HTMLTableCellElement>();
      render(
        <Table>
          <Tbody>
            <Tr>
              <Td ref={ref}>Value</Td>
            </Tr>
          </Tbody>
        </Table>,
      );
      expect(ref.current?.tagName).toBe('TD');
    });
  });

  describe('axe accessibility', () => {
    it('has no violations with a full table structure', async () => {
      const { container } = render(
        <Table>
          <Thead>
            <Tr>
              <Th scope="col">Name</Th>
              <Th scope="col">Value</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>Widget</Td>
              <Td>42</Td>
            </Tr>
          </Tbody>
        </Table>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations with a footer row', async () => {
      const { container } = render(
        <Table>
          <Thead>
            <Tr>
              <Th scope="col">Item</Th>
              <Th scope="col">Price</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>Widget</Td>
              <Td>$9.00</Td>
            </Tr>
          </Tbody>
          <Tfoot>
            <Tr>
              <Th scope="row">Total</Th>
              <Td>$9.00</Td>
            </Tr>
          </Tfoot>
        </Table>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations with resizable columns', async () => {
      const { container } = render(
        <Table>
          <Thead>
            <Tr>
              <Th scope="col" resizable defaultWidth={160}>Name</Th>
              <Th scope="col" resizable defaultWidth={160}>Value</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>Widget</Td>
              <Td>42</Td>
            </Tr>
          </Tbody>
        </Table>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
