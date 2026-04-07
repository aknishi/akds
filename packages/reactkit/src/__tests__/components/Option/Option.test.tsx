import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Option } from '../../../components/Option/Option';
import { OptionContext } from '../../../components/Option/OptionContext';
import type { OptionContextValue } from '../../../components/Option/OptionContext';

expect.extend(toHaveNoViolations);

function renderInMenu(ui: React.ReactElement, ctxOverrides?: Partial<OptionContextValue>) {
  const ctx: OptionContextValue = {
    variant: 'menu',
    isSelected: () => false,
    onSelect: vi.fn(),
    multiple: false,
    parentDisabled: false,
    ...ctxOverrides,
  };
  return render(
    <OptionContext.Provider value={ctx}>
      <ul role="menu">{ui}</ul>
    </OptionContext.Provider>,
  );
}

function renderInListbox(ui: React.ReactElement, ctxOverrides?: Partial<OptionContextValue>) {
  const ctx: OptionContextValue = {
    variant: 'listbox',
    isSelected: () => false,
    onSelect: vi.fn(),
    multiple: false,
    parentDisabled: false,
    ...ctxOverrides,
  };
  return render(
    <OptionContext.Provider value={ctx}>
      <ul role="listbox" aria-label="Options">{ui}</ul>
    </OptionContext.Provider>,
  );
}

describe('Option', () => {
  describe('menu variant', () => {
    it('renders as menuitem in menu context', () => {
      renderInMenu(<Option>Cut</Option>);
      expect(screen.getByRole('menuitem', { name: 'Cut' })).toBeInTheDocument();
    });

    it('renders as menuitem with value prop', () => {
      renderInMenu(<Option value="cut">Cut</Option>);
      expect(screen.getByRole('menuitem', { name: 'Cut' })).toBeInTheDocument();
    });

    it('calls onClick when clicked in menu context', async () => {
      const onClick = vi.fn();
      renderInMenu(<Option onClick={onClick}>Cut</Option>);
      await userEvent.click(screen.getByRole('menuitem', { name: 'Cut' }));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('does NOT call ctx.onSelect when clicked in menu context (consumer uses onClick)', async () => {
      const onSelect = vi.fn();
      renderInMenu(<Option>Cut</Option>, { onSelect });
      await userEvent.click(screen.getByRole('menuitem', { name: 'Cut' }));
      expect(onSelect).not.toHaveBeenCalled();
    });

    it('does not call onClick when disabled in menu context', async () => {
      const onClick = vi.fn();
      renderInMenu(<Option disabled onClick={onClick}>Cut</Option>);
      await userEvent.click(screen.getByRole('menuitem', { name: 'Cut' }));
      expect(onClick).not.toHaveBeenCalled();
    });

    it('applies disabled class in menu context', () => {
      renderInMenu(<Option disabled>Cut</Option>);
      expect(screen.getByRole('menuitem', { name: 'Cut' })).toHaveClass('akds-option--disabled');
    });

    it('renders icon passed as children in menu context', () => {
      renderInMenu(<Option><span data-testid="icon">X</span> Cut</Option>);
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('renders trailingElement in menu context', () => {
      renderInMenu(<Option trailingElement={<span data-testid="shortcut">Ctrl+X</span>}>Cut</Option>);
      expect(screen.getByTestId('shortcut')).toBeInTheDocument();
    });

    it('disables option when parentDisabled is true', () => {
      renderInMenu(<Option>Cut</Option>, { parentDisabled: true });
      expect(screen.getByRole('menuitem', { name: 'Cut' })).toBeDisabled();
    });

    it('forwards ref to button in menu context', () => {
      const ref = React.createRef<HTMLElement>();
      renderInMenu(<Option ref={ref}>Cut</Option>);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe('listbox variant', () => {
    it('renders as option in listbox context', () => {
      renderInListbox(<Option value="apple">Apple</Option>);
      expect(screen.getByRole('option', { name: 'Apple' })).toBeInTheDocument();
    });

    it('calls ctx.onSelect when clicked in listbox context', async () => {
      const onSelect = vi.fn();
      renderInListbox(<Option value="apple">Apple</Option>, { onSelect });
      await userEvent.click(screen.getByRole('option', { name: 'Apple' }));
      expect(onSelect).toHaveBeenCalledWith('apple');
    });

    it('does not call ctx.onSelect when disabled in listbox context', async () => {
      const onSelect = vi.fn();
      renderInListbox(<Option value="apple" disabled>Apple</Option>, { onSelect });
      await userEvent.click(screen.getByRole('option', { name: 'Apple' }));
      expect(onSelect).not.toHaveBeenCalled();
    });

    it('calls ctx.onSelect on Enter key press in listbox context', async () => {
      const onSelect = vi.fn();
      renderInListbox(<Option value="apple">Apple</Option>, { onSelect });
      screen.getByRole('option', { name: 'Apple' }).focus();
      await userEvent.keyboard('{Enter}');
      expect(onSelect).toHaveBeenCalledWith('apple');
    });

    it('calls ctx.onSelect on Space key press in listbox context', async () => {
      const onSelect = vi.fn();
      renderInListbox(<Option value="apple">Apple</Option>, { onSelect });
      screen.getByRole('option', { name: 'Apple' }).focus();
      await userEvent.keyboard(' ');
      expect(onSelect).toHaveBeenCalledWith('apple');
    });

    it('does not call ctx.onSelect when disabled on keydown', async () => {
      const onSelect = vi.fn();
      renderInListbox(<Option value="apple" disabled>Apple</Option>, { onSelect });
      screen.getByRole('option', { name: 'Apple' }).focus();
      await userEvent.keyboard('{Enter}');
      expect(onSelect).not.toHaveBeenCalled();
    });

    it('applies selected class when isSelected returns true', () => {
      renderInListbox(<Option value="apple">Apple</Option>, { isSelected: v => v === 'apple' });
      expect(screen.getByRole('option', { name: 'Apple' })).toHaveClass('akds-option--selected');
    });

    it('sets aria-selected="true" when selected', () => {
      renderInListbox(<Option value="apple">Apple</Option>, { isSelected: v => v === 'apple' });
      expect(screen.getByRole('option', { name: 'Apple' })).toHaveAttribute('aria-selected', 'true');
    });

    it('sets aria-selected="false" when not selected', () => {
      renderInListbox(<Option value="apple">Apple</Option>);
      expect(screen.getByRole('option', { name: 'Apple' })).toHaveAttribute('aria-selected', 'false');
    });

    it('renders multi-select checkbox when multiple=true', () => {
      const { container } = renderInListbox(<Option value="apple">Apple</Option>, { multiple: true });
      expect(container.querySelector('.akds-option__checkbox-box')).toBeInTheDocument();
    });

    it('marks checkbox as checked when selected in multiple mode', () => {
      const { container } = renderInListbox(
        <Option value="apple">Apple</Option>,
        { multiple: true, isSelected: v => v === 'apple' },
      );
      expect(container.querySelector('.akds-option__checkbox-box--checked')).toBeInTheDocument();
    });

    it('renders trailing checkmark when selected in single-select mode', () => {
      const { container } = renderInListbox(
        <Option value="apple">Apple</Option>,
        { isSelected: v => v === 'apple' },
      );
      expect(container.querySelector('.akds-option__checkmark')).toBeInTheDocument();
    });

    it('does not render trailing checkmark when not selected', () => {
      const { container } = renderInListbox(<Option value="apple">Apple</Option>);
      expect(container.querySelector('.akds-option__checkmark')).not.toBeInTheDocument();
    });

    it('does not show trailingElement in listbox context', () => {
      renderInListbox(
        <Option value="apple" trailingElement={<span data-testid="trailing">hint</span>}>Apple</Option>,
      );
      expect(screen.queryByTestId('trailing')).not.toBeInTheDocument();
    });

    it('renders icon passed as children in listbox context', () => {
      renderInListbox(
        <Option value="apple"><span data-testid="leading">icon</span> Apple</Option>,
      );
      expect(screen.getByTestId('leading')).toBeInTheDocument();
    });

    it('applies disabled class when parentDisabled is true', () => {
      renderInListbox(<Option value="apple">Apple</Option>, { parentDisabled: true });
      expect(screen.getByRole('option', { name: 'Apple' })).toHaveClass('akds-option--disabled');
    });

    it('forwards ref to li in listbox context', () => {
      const ref = React.createRef<HTMLElement>();
      renderInListbox(<Option value="apple" ref={ref}>Apple</Option>);
      expect(ref.current).toBeInstanceOf(HTMLLIElement);
    });
  });

  describe('default context (no provider)', () => {
    it('renders as menuitem using context defaults', () => {
      render(
        <ul role="menu">
          <Option value="cut">Cut</Option>
        </ul>,
      );
      expect(screen.getByRole('menuitem', { name: 'Cut' })).toBeInTheDocument();
    });
  });

  describe('axe accessibility', () => {
    it('has no violations in menu context', async () => {
      const { container } = renderInMenu(
        <>
          <Option>Cut</Option>
          <Option>Copy</Option>
        </>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations in listbox context', async () => {
      const { container } = renderInListbox(
        <>
          <Option value="apple">Apple</Option>
          <Option value="banana">Banana</Option>
        </>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations when selected in listbox context', async () => {
      const { container } = renderInListbox(
        <>
          <Option value="apple">Apple</Option>
          <Option value="banana">Banana</Option>
        </>,
        { isSelected: v => v === 'apple' },
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations when disabled in menu context', async () => {
      const { container } = renderInMenu(<Option disabled>Cut</Option>);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
