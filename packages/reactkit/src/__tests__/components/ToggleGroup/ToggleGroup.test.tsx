import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ToggleGroup } from '../../../components/ToggleGroup/ToggleGroup';
import { ToggleButton } from '../../../components/ToggleButton/ToggleButton';

expect.extend(toHaveNoViolations);

class MockResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

// jsdom does not implement ResizeObserver — ToggleGroup instantiates one on mount.
vi.stubGlobal('ResizeObserver', MockResizeObserver);

function ToggleGroupFixture({
  defaultValue = 'drinks',
  onChange,
  disabled,
}: {
  defaultValue?: string;
  onChange?: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <ToggleGroup
      defaultValue={defaultValue}
      {...(onChange !== undefined && { onChange })}
      {...(disabled !== undefined && { disabled })}
    >
      <ToggleButton value="drinks">Drinks</ToggleButton>
      <ToggleButton value="food">Food</ToggleButton>
      <ToggleButton value="dessert" disabled>Dessert</ToggleButton>
    </ToggleGroup>
  );
}

describe('ToggleGroup', () => {
  it('renders a radiogroup with radio buttons', () => {
    render(<ToggleGroupFixture />);
    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(3);
  });

  it('applies default classes', () => {
    render(<ToggleGroupFixture />);
    expect(screen.getByRole('radiogroup')).toHaveClass('akds-toggle-group');
  });

  it('renders the sliding indicator element', () => {
    render(<ToggleGroupFixture />);
    expect(screen.getByRole('radiogroup').querySelector('.akds-toggle-group__indicator')).toBeInTheDocument();
  });

  it('marks the matching ToggleButton as checked and active', () => {
    render(<ToggleGroupFixture defaultValue="food" />);
    expect(screen.getByRole('radio', { name: 'Drinks' })).toHaveAttribute('aria-checked', 'false');
    const food = screen.getByRole('radio', { name: 'Food' });
    expect(food).toHaveAttribute('aria-checked', 'true');
    expect(food).toHaveClass('akds-toggle-button--active');
    expect(food).toHaveClass('akds-toggle-button--grouped');
  });

  it('selects a button on click and calls onChange', async () => {
    const onChange = vi.fn();
    render(<ToggleGroupFixture onChange={onChange} />);
    await userEvent.click(screen.getByRole('radio', { name: 'Food' }));
    expect(onChange).toHaveBeenCalledWith('food');
    expect(screen.getByRole('radio', { name: 'Food' })).toHaveAttribute('aria-checked', 'true');
  });

  it('supports controlled usage via the value prop', () => {
    const { rerender } = render(
      <ToggleGroup value="drinks" onChange={() => {}}>
        <ToggleButton value="drinks">Drinks</ToggleButton>
        <ToggleButton value="food">Food</ToggleButton>
      </ToggleGroup>,
    );
    expect(screen.getByRole('radio', { name: 'Drinks' })).toHaveAttribute('aria-checked', 'true');

    rerender(
      <ToggleGroup value="food" onChange={() => {}}>
        <ToggleButton value="drinks">Drinks</ToggleButton>
        <ToggleButton value="food">Food</ToggleButton>
      </ToggleGroup>,
    );
    expect(screen.getByRole('radio', { name: 'Food' })).toHaveAttribute('aria-checked', 'true');
  });

  it('propagates disabled to all child ToggleButtons', () => {
    render(<ToggleGroupFixture disabled />);
    screen.getAllByRole('radio').forEach(button => expect(button).toBeDisabled());
  });

  it('an individually disabled ToggleButton cannot be selected', async () => {
    render(<ToggleGroupFixture />);
    expect(screen.getByRole('radio', { name: 'Dessert' })).toBeDisabled();
  });

  it('ArrowRight moves focus to and selects the next button', async () => {
    const onChange = vi.fn();
    render(<ToggleGroupFixture onChange={onChange} />);
    screen.getByRole('radio', { name: 'Drinks' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('radio', { name: 'Food' })).toHaveFocus();
    expect(onChange).toHaveBeenCalledWith('food');
  });

  it('ArrowRight skips disabled buttons and wraps around', async () => {
    render(<ToggleGroupFixture defaultValue="food" />);
    screen.getByRole('radio', { name: 'Food' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('radio', { name: 'Drinks' })).toHaveFocus();
  });

  it('ArrowLeft moves focus to and selects the previous button', async () => {
    const onChange = vi.fn();
    render(<ToggleGroupFixture defaultValue="food" onChange={onChange} />);
    screen.getByRole('radio', { name: 'Food' }).focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(screen.getByRole('radio', { name: 'Drinks' })).toHaveFocus();
    expect(onChange).toHaveBeenCalledWith('drinks');
  });

  it('Home moves focus to and selects the first button', async () => {
    render(<ToggleGroupFixture defaultValue="food" />);
    screen.getByRole('radio', { name: 'Food' }).focus();
    await userEvent.keyboard('{Home}');
    expect(screen.getByRole('radio', { name: 'Drinks' })).toHaveFocus();
    expect(screen.getByRole('radio', { name: 'Drinks' })).toHaveAttribute('aria-checked', 'true');
  });

  it('End moves focus to and selects the last enabled button', async () => {
    render(<ToggleGroupFixture defaultValue="drinks" />);
    screen.getByRole('radio', { name: 'Drinks' }).focus();
    await userEvent.keyboard('{End}');
    expect(screen.getByRole('radio', { name: 'Food' })).toHaveFocus();
    expect(screen.getByRole('radio', { name: 'Food' })).toHaveAttribute('aria-checked', 'true');
  });

  it('forwards ref to the root element', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <ToggleGroup ref={ref} defaultValue="drinks">
        <ToggleButton value="drinks">Drinks</ToggleButton>
      </ToggleGroup>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toBe(screen.getByRole('radiogroup'));
  });

  it('forwards data attributes', () => {
    render(
      <ToggleGroup defaultValue="drinks" data-testid="toggle-group-root">
        <ToggleButton value="drinks">Drinks</ToggleButton>
      </ToggleGroup>,
    );
    expect(screen.getByTestId('toggle-group-root')).toBeInTheDocument();
  });

  describe('axe accessibility', () => {
    it('has no violations in default state', async () => {
      const { container } = render(<ToggleGroupFixture />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations when disabled', async () => {
      const { container } = render(<ToggleGroupFixture disabled />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
