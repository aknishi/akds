import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { MenuItem } from '../../../components/MenuItem/MenuItem';

expect.extend(toHaveNoViolations);

describe('MenuItem', () => {
  it('renders with correct role and accessible name', () => {
    render(
      <ul role="menu">
        <MenuItem>Copy</MenuItem>
      </ul>,
    );
    expect(screen.getByRole('menuitem', { name: 'Copy' })).toBeInTheDocument();
  });

  it('applies base class', () => {
    render(
      <ul role="menu">
        <MenuItem>Item</MenuItem>
      </ul>,
    );
    expect(screen.getByRole('menuitem')).toHaveClass('akds-option');
  });

  it('applies disabled class when disabled', () => {
    render(
      <ul role="menu">
        <MenuItem disabled>Item</MenuItem>
      </ul>,
    );
    expect(screen.getByRole('menuitem')).toHaveClass('akds-option--disabled');
    expect(screen.getByRole('menuitem')).toBeDisabled();
  });

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    render(
      <ul role="menu">
        <MenuItem onClick={onClick}>Item</MenuItem>
      </ul>,
    );
    await userEvent.click(screen.getByRole('menuitem'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', async () => {
    const onClick = vi.fn();
    render(
      <ul role="menu">
        <MenuItem disabled onClick={onClick}>Item</MenuItem>
      </ul>,
    );
    await userEvent.click(screen.getByRole('menuitem'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('renders children and trailingElement', () => {
    render(
      <ul role="menu">
        <MenuItem trailingElement={<span>⌘K</span>}>
          <span>icon</span> Command
        </MenuItem>
      </ul>,
    );
    expect(screen.getByText('⌘K')).toBeInTheDocument();
    expect(screen.getByText('icon')).toBeInTheDocument();
  });

  it('forwards HTML attributes', () => {
    render(
      <ul role="menu">
        <MenuItem data-testid="my-item">Item</MenuItem>
      </ul>,
    );
    expect(screen.getByRole('menuitem')).toHaveAttribute('data-testid', 'my-item');
  });

  it('forwards ref to the button element', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(
      <ul role="menu">
        <MenuItem ref={ref}>Item</MenuItem>
      </ul>,
    );
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  describe('axe accessibility', () => {
    it('has no violations in default state', async () => {
      const { container } = render(
        <ul role="menu">
          <MenuItem>Cut</MenuItem>
        </ul>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations when disabled', async () => {
      const { container } = render(
        <ul role="menu">
          <MenuItem disabled>Cut</MenuItem>
        </ul>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
