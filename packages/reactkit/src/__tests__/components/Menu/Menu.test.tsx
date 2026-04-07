import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Menu } from '../../../components/Menu/Menu';
import { Option } from '../../../components/Option/Option';

expect.extend(toHaveNoViolations);

describe('Menu', () => {
  it('does not render when open is false', () => {
    render(
      <Menu open={false}>
        <Option>Item</Option>
      </Menu>,
    );
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('renders when open is true', () => {
    render(
      <Menu open>
        <Option>Item</Option>
      </Menu>,
    );
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('applies base class', () => {
    render(
      <Menu open>
        <Option>Item</Option>
      </Menu>,
    );
    expect(screen.getByRole('menu')).toHaveClass('akds-menu');
  });

  it('renders all child Options as menuitems', () => {
    render(
      <Menu open>
        <Option>Cut</Option>
        <Option>Copy</Option>
        <Option>Paste</Option>
      </Menu>,
    );
    expect(screen.getAllByRole('menuitem')).toHaveLength(3);
  });

  it('forwards ref to the ul element', () => {
    const ref = React.createRef<HTMLUListElement>();
    render(
      <Menu open ref={ref}>
        <Option>Item</Option>
      </Menu>,
    );
    expect(ref.current).toBeInstanceOf(HTMLUListElement);
  });

  it('forwards className', () => {
    render(
      <Menu open className="custom-menu">
        <Option>Item</Option>
      </Menu>,
    );
    expect(screen.getByRole('menu')).toHaveClass('custom-menu');
  });

  it('calls onOpenChange(false) when Escape key is pressed', async () => {
    const onOpenChange = vi.fn();
    render(
      <Menu open onOpenChange={onOpenChange}>
        <Option>Cut</Option>
      </Menu>,
    );
    screen.getByRole('menuitem', { name: 'Cut' }).focus();
    await userEvent.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('does NOT auto-close when an Option is clicked (consumer manages close via onClick)', async () => {
    const onOpenChange = vi.fn();
    render(
      <Menu open onOpenChange={onOpenChange}>
        <Option>Cut</Option>
      </Menu>,
    );
    await userEvent.click(screen.getByRole('menuitem', { name: 'Cut' }));
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  describe('axe accessibility', () => {
    it('has no violations', async () => {
      const { container } = render(
        <Menu open>
          <Option>Cut</Option>
          <Option>Copy</Option>
          <Option disabled>Paste</Option>
        </Menu>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
