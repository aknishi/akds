import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { DropdownMenu } from '../../../components/DropdownMenu/DropdownMenu';
import { Option } from '../../../components/Option/Option';

expect.extend(toHaveNoViolations);

function setup(props: Partial<React.ComponentProps<typeof DropdownMenu>> = {}) {
  return render(
    <DropdownMenu label="Fruit" {...props}>
      {(props as { children?: React.ReactNode }).children ?? (
        <>
          <Option value="apple">Apple</Option>
          <Option value="banana">Banana</Option>
          <Option value="cherry" disabled>Cherry</Option>
        </>
      )}
    </DropdownMenu>,
  );
}

describe('DropdownMenu', () => {
  it('renders with correct accessible trigger', () => {
    setup();
    expect(screen.getByRole('button', { name: 'Fruit' })).toBeInTheDocument();
  });

  it('applies base class', () => {
    const { container } = setup();
    expect(container.firstChild).toHaveClass('akds-dropdown-menu');
  });

  it('does not show listbox on initial render', () => {
    setup();
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('opens listbox when trigger is clicked', async () => {
    setup();
    await userEvent.click(screen.getByRole('button', { name: 'Fruit' }));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(3);
  });

  it('closes listbox when trigger is clicked again', async () => {
    setup();
    await userEvent.click(screen.getByRole('button', { name: 'Fruit' }));
    await userEvent.click(screen.getByRole('button', { name: 'Fruit' }));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('closes listbox on Escape', async () => {
    setup();
    await userEvent.click(screen.getByRole('button', { name: 'Fruit' }));
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('closes listbox when clicking outside', async () => {
    const { container } = setup();
    await userEvent.click(screen.getByRole('button', { name: 'Fruit' }));
    await userEvent.click(container.ownerDocument.body);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('sets aria-expanded on trigger', async () => {
    setup();
    expect(screen.getByRole('button', { name: 'Fruit' })).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(screen.getByRole('button', { name: 'Fruit' }));
    expect(screen.getByRole('button', { name: 'Fruit' })).toHaveAttribute('aria-expanded', 'true');
  });

  it('sets aria-haspopup="listbox" on trigger', () => {
    setup();
    expect(screen.getByRole('button', { name: 'Fruit' })).toHaveAttribute('aria-haspopup', 'listbox');
  });

  it('marks disabled options with aria-disabled', async () => {
    setup();
    await userEvent.click(screen.getByRole('button', { name: 'Fruit' }));
    expect(screen.getByRole('option', { name: 'Cherry' })).toHaveAttribute('aria-disabled', 'true');
  });

  describe('uncontrolled open', () => {
    it('opens when trigger clicked', async () => {
      setup();
      await userEvent.click(screen.getByRole('button', { name: 'Fruit' }));
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('closes when option selected (single)', async () => {
      setup();
      await userEvent.click(screen.getByRole('button', { name: 'Fruit' }));
      await userEvent.click(screen.getByRole('option', { name: 'Apple' }));
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  describe('controlled open', () => {
    it('respects open prop when true', () => {
      setup({ open: true });
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('respects open prop when false', () => {
      setup({ open: false });
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('calls onOpenChange when trigger is clicked', async () => {
      const onOpenChange = vi.fn();
      setup({ open: false, onOpenChange });
      await userEvent.click(screen.getByRole('button', { name: 'Fruit' }));
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });
  });

  describe('single select', () => {
    it('selects an option and closes the listbox', async () => {
      setup();
      await userEvent.click(screen.getByRole('button', { name: 'Fruit' }));
      await userEvent.click(screen.getByRole('option', { name: 'Apple' }));
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('marks selected option with aria-selected="true"', async () => {
      setup({ selected: 'banana' });
      await userEvent.click(screen.getByRole('button', { name: 'Fruit' }));
      expect(screen.getByRole('option', { name: 'Banana' })).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByRole('option', { name: 'Apple' })).toHaveAttribute('aria-selected', 'false');
    });

    it('calls onChange with the selected string value', async () => {
      const onChange = vi.fn();
      setup({ onChange });
      await userEvent.click(screen.getByRole('button', { name: 'Fruit' }));
      await userEvent.click(screen.getByRole('option', { name: 'Apple' }));
      expect(onChange).toHaveBeenCalledWith('apple');
    });

    it('does not call onChange when a disabled option is clicked', async () => {
      const onChange = vi.fn();
      setup({ onChange });
      await userEvent.click(screen.getByRole('button', { name: 'Fruit' }));
      await userEvent.click(screen.getByRole('option', { name: 'Cherry' }));
      expect(onChange).not.toHaveBeenCalled();
    });

    it('respects controlled selected value', async () => {
      setup({ selected: 'banana', onChange: () => {} });
      await userEvent.click(screen.getByRole('button', { name: 'Fruit' }));
      expect(screen.getByRole('option', { name: 'Banana' })).toHaveAttribute('aria-selected', 'true');
    });

    it('updates when controlled selected value changes', async () => {
      const { rerender } = render(
        <DropdownMenu label="Fruit" selected="apple" onChange={() => {}}>
          <Option value="apple">Apple</Option>
          <Option value="banana">Banana</Option>
          <Option value="cherry" disabled>Cherry</Option>
        </DropdownMenu>,
      );
      await userEvent.click(screen.getByRole('button', { name: 'Fruit' }));
      expect(screen.getByRole('option', { name: 'Apple' })).toHaveAttribute('aria-selected', 'true');

      rerender(
        <DropdownMenu label="Fruit" selected="banana" onChange={() => {}}>
          <Option value="apple">Apple</Option>
          <Option value="banana">Banana</Option>
          <Option value="cherry" disabled>Cherry</Option>
        </DropdownMenu>,
      );
      expect(screen.getByRole('option', { name: 'Banana' })).toHaveAttribute('aria-selected', 'true');
    });
  });

  describe('multi select', () => {
    it('keeps listbox open after selecting an option', async () => {
      setup({ multiple: true });
      await userEvent.click(screen.getByRole('button', { name: 'Fruit' }));
      await userEvent.click(screen.getByRole('option', { name: 'Apple' }));
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('calls onChange with an array', async () => {
      const onChange = vi.fn();
      setup({ multiple: true, onChange });
      await userEvent.click(screen.getByRole('button', { name: 'Fruit' }));
      await userEvent.click(screen.getByRole('option', { name: 'Apple' }));
      expect(onChange).toHaveBeenCalledWith(['apple']);
    });

    it('toggles an already-selected option off', async () => {
      const onChange = vi.fn();
      setup({ multiple: true, selected: ['apple'], onChange });
      await userEvent.click(screen.getByRole('button', { name: 'Fruit' }));
      await userEvent.click(screen.getByRole('option', { name: 'Apple' }));
      expect(onChange).toHaveBeenCalledWith([]);
    });

    it('marks the listbox as aria-multiselectable', async () => {
      setup({ multiple: true });
      await userEvent.click(screen.getByRole('button', { name: 'Fruit' }));
      expect(screen.getByRole('listbox')).toHaveAttribute('aria-multiselectable', 'true');
    });

    it('respects controlled selected array', async () => {
      setup({ multiple: true, selected: ['apple', 'banana'], onChange: () => {} });
      await userEvent.click(screen.getByRole('button', { name: 'Fruit' }));
      expect(screen.getByRole('option', { name: 'Apple' })).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByRole('option', { name: 'Banana' })).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByRole('option', { name: 'Cherry' })).toHaveAttribute('aria-selected', 'false');
    });

    it('renders a decorative checkbox for each option', async () => {
      const { container } = setup({ multiple: true });
      await userEvent.click(screen.getByRole('button', { name: 'Fruit' }));
      const checkboxes = container.querySelectorAll('.akds-option__checkbox-box');
      expect(checkboxes.length).toBe(3);
    });

    it('marks the checkbox as checked for selected options', async () => {
      const { container } = setup({ multiple: true, selected: ['apple'] });
      await userEvent.click(screen.getByRole('button', { name: 'Fruit' }));
      const checked = container.querySelectorAll('.akds-option__checkbox-box--checked');
      expect(checked.length).toBe(1);
    });
  });

  describe('floating label', () => {
    it('label does not float initially', () => {
      const { container } = setup();
      expect(container.querySelector('.akds-dropdown-menu__label')).not.toHaveClass(
        'akds-dropdown-menu__label--floating',
      );
    });

    it('label floats when trigger is focused (open)', async () => {
      const { container } = setup();
      await userEvent.click(screen.getByRole('button', { name: 'Fruit' }));
      expect(container.querySelector('.akds-dropdown-menu__label')).toHaveClass(
        'akds-dropdown-menu__label--floating',
      );
    });

    it('label floats when a value is selected', async () => {
      function Controlled() {
        const [selected, setSelected] = React.useState<string | undefined>(undefined);
        return (
          <DropdownMenu label="Fruit" selected={selected} onChange={v => setSelected(v as string)}>
            <Option value="apple">Apple</Option>
            <Option value="banana">Banana</Option>
            <Option value="cherry" disabled>Cherry</Option>
          </DropdownMenu>
        );
      }
      const { container } = render(<Controlled />);
      await userEvent.click(screen.getByRole('button', { name: 'Fruit' }));
      await userEvent.click(screen.getByRole('option', { name: 'Apple' }));
      expect(container.querySelector('.akds-dropdown-menu__label')).toHaveClass(
        'akds-dropdown-menu__label--floating',
      );
    });

    it('label floats when selected prop is provided', () => {
      const { container } = setup({ selected: 'banana' });
      expect(container.querySelector('.akds-dropdown-menu__label')).toHaveClass(
        'akds-dropdown-menu__label--floating',
      );
    });
  });

  describe('disabled state', () => {
    it('applies disabled class to the container', () => {
      const { container } = setup({ disabled: true });
      expect(container.firstChild).toHaveClass('akds-dropdown-menu--disabled');
    });

    it('disables the trigger button', () => {
      setup({ disabled: true });
      expect(screen.getByRole('button', { name: 'Fruit' })).toBeDisabled();
    });

    it('does not open when disabled', async () => {
      setup({ disabled: true });
      await userEvent.click(screen.getByRole('button', { name: 'Fruit' }));
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  it('renders helper text', () => {
    setup({ helperText: 'Pick one' });
    expect(screen.getByText('Pick one')).toBeInTheDocument();
  });

  it('associates helper text with trigger via aria-describedby', () => {
    setup({ helperText: 'Pick one' });
    const trigger = screen.getByRole('button', { name: 'Fruit' });
    const helperId = trigger.getAttribute('aria-describedby');
    expect(helperId).toBeTruthy();
    expect(document.getElementById(helperId!)).toHaveTextContent('Pick one');
  });

  it('forwards HTML attributes to the container div', () => {
    setup({ 'data-testid': 'my-select' });
    expect(screen.getByTestId('my-select')).toBeInTheDocument();
  });

  it('forwards ref to the container element', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <DropdownMenu ref={ref}>
        <Option value="apple">Apple</Option>
      </DropdownMenu>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  describe('axe accessibility', () => {
    it('has no violations when closed', async () => {
      const { container } = setup();
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations when open (single)', async () => {
      const { container } = setup();
      await userEvent.click(screen.getByRole('button', { name: 'Fruit' }));
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations when open (multi)', async () => {
      const { container } = setup({ multiple: true, selected: ['apple'] });
      await userEvent.click(screen.getByRole('button', { name: 'Fruit' }));
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations when disabled', async () => {
      const { container } = setup({ disabled: true });
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations with aria-label when no label prop', async () => {
      const { container } = render(
        <DropdownMenu aria-label="Select a fruit">
          <Option value="apple">Apple</Option>
          <Option value="banana">Banana</Option>
        </DropdownMenu>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations with helper text', async () => {
      const { container } = setup({ helperText: 'Choose one fruit' });
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
