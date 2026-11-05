import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ActionsMenu } from '../../../components/ActionsMenu/ActionsMenu';
import { MenuItem } from '../../../components/MenuItem/MenuItem';
import { Button } from '../../../components/Button/Button';

expect.extend(toHaveNoViolations);

function renderMenu(props: Partial<React.ComponentProps<typeof ActionsMenu>> = {}) {
  const onView = vi.fn();
  const onCancel = vi.fn();
  const utils = render(
    <ActionsMenu label="Actions for Hanako Sato" {...props}>
      <MenuItem onClick={onView}>View details</MenuItem>
      <MenuItem disabled onClick={onCancel}>Cancel order</MenuItem>
    </ActionsMenu>,
  );
  const trigger = screen.getByRole('button', { name: 'Actions for Hanako Sato' });
  return { ...utils, trigger, onView, onCancel };
}

describe('ActionsMenu', () => {
  it('renders a trigger button named by label', () => {
    const { trigger } = renderMenu();
    expect(trigger).toBeInTheDocument();
  });

  it('applies the base class to the trigger', () => {
    const { trigger } = renderMenu({ className: 'custom' });
    expect(trigger).toHaveClass('akds-actions-menu', 'akds-icon-button--transparent', 'custom');
  });

  it('sets aria-haspopup="menu" and toggles aria-expanded', async () => {
    const user = userEvent.setup();
    const { trigger } = renderMenu();
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('menu')).toBeInTheDocument();

    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('hides the icon from assistive technology', () => {
    const { trigger } = renderMenu();
    expect(trigger.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('runs the item onClick, closes the menu, and returns focus to the trigger on selection', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const { trigger, onView } = renderMenu({ onOpenChange });

    await user.click(trigger);
    await user.click(screen.getByRole('menuitem', { name: 'View details' }));

    expect(onView).toHaveBeenCalledTimes(1);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(trigger).toHaveFocus();
  });

  it('selects an item with Enter', async () => {
    const user = userEvent.setup();
    const { trigger, onView } = renderMenu();

    trigger.focus();
    await user.keyboard('{Enter}');
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'View details' })).toHaveFocus());
    await user.keyboard('{Enter}');

    expect(onView).toHaveBeenCalledTimes(1);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveFocus();
  });

  it('closes on Escape, returns focus, and reports the change once', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const { trigger } = renderMenu({ onOpenChange });

    await user.click(trigger);
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'View details' })).toHaveFocus());
    await user.keyboard('{Escape}');

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveFocus();
    expect(onOpenChange.mock.calls).toEqual([[true], [false]]);
  });

  it('does not return focus to the trigger on Tab', async () => {
    const user = userEvent.setup();
    const { trigger } = renderMenu();

    await user.click(trigger);
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'View details' })).toHaveFocus());
    await user.keyboard('{Tab}');

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).not.toHaveFocus();
  });

  it('does not return focus to the trigger on outside click', async () => {
    const user = userEvent.setup();
    const { trigger } = renderMenu();

    await user.click(trigger);
    await user.click(document.body);

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).not.toHaveFocus();
  });

  it('keeps the menu open when a disabled item is clicked', async () => {
    const user = userEvent.setup();
    const { trigger, onCancel } = renderMenu();

    await user.click(trigger);
    await user.click(screen.getByRole('menuitem', { name: 'Cancel order' }));

    expect(onCancel).not.toHaveBeenCalled();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('keeps the menu open when the menu padding is clicked', async () => {
    const user = userEvent.setup();
    const { trigger } = renderMenu();

    await user.click(trigger);
    await user.click(screen.getByRole('menu'));

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('does not open when disabled', async () => {
    const user = userEvent.setup();
    const { trigger } = renderMenu({ disabled: true });

    expect(trigger).toBeDisabled();
    await user.click(trigger);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('stays in the tab order but does not open when disabled with focusableWhenDisabled', async () => {
    const user = userEvent.setup();
    const { trigger } = renderMenu({ disabled: true, focusableWhenDisabled: true });

    expect(trigger).not.toBeDisabled();
    expect(trigger).toHaveAttribute('aria-disabled', 'true');
    await user.tab();
    expect(trigger).toHaveFocus();

    await user.keyboard('{Enter}');
    await user.click(trigger);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('calls a passed onClick on the trigger', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { trigger } = renderMenu({ onClick });

    await user.click(trigger);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('forwards HTML attributes to the trigger', () => {
    const { trigger } = renderMenu({ 'data-testid': 'trigger' } as Partial<React.ComponentProps<typeof ActionsMenu>>);
    expect(trigger).toHaveAttribute('data-testid', 'trigger');
  });

  it('forwards ref to the trigger button', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(
      <ActionsMenu ref={ref} label="Actions">
        <MenuItem>View</MenuItem>
      </ActionsMenu>,
    );
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('supports a function ref', () => {
    let node: HTMLButtonElement | null = null;
    render(
      <ActionsMenu ref={(el) => { node = el; }} label="Actions">
        <MenuItem>View</MenuItem>
      </ActionsMenu>,
    );
    expect(node).toBeInstanceOf(HTMLButtonElement);
  });

  describe('custom trigger', () => {
    const renderWithTrigger = (props: { disabled?: boolean; onTriggerClick?: () => void } = {}) => {
      const onView = vi.fn();
      render(
        <ActionsMenu
          disabled={props.disabled ?? false}
          focusableWhenDisabled
          trigger={(
            <Button size="sm" appearance="bordered" className="team-class" onClick={props.onTriggerClick}>
              Bulk actions
            </Button>
          )}
        >
          <MenuItem onClick={onView}>Export</MenuItem>
        </ActionsMenu>,
      );
      return { trigger: screen.getByRole('button', { name: 'Bulk actions' }), onView };
    };

    it('uses the given button, named by its visible text', () => {
      const { trigger } = renderWithTrigger();
      expect(trigger).toHaveClass('akds-button', 'akds-actions-menu', 'team-class');
      expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
      expect(trigger).not.toHaveAttribute('aria-label');
    });

    it('opens the menu, still runs its own onClick, and returns focus after Escape', async () => {
      const user = userEvent.setup();
      const onTriggerClick = vi.fn();
      const { trigger } = renderWithTrigger({ onTriggerClick });

      await user.click(trigger);
      expect(onTriggerClick).toHaveBeenCalledTimes(1);
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
      await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Export' })).toHaveFocus());

      await user.keyboard('{Escape}');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(trigger).toHaveFocus();
    });

    it('closes and returns focus after selecting an item', async () => {
      const user = userEvent.setup();
      const { trigger, onView } = renderWithTrigger();
      await user.click(trigger);
      await user.click(screen.getByRole('menuitem', { name: 'Export' }));
      expect(onView).toHaveBeenCalledTimes(1);
      expect(trigger).toHaveFocus();
    });

    it('passes the disabled state to the trigger', async () => {
      const user = userEvent.setup();
      const { trigger } = renderWithTrigger({ disabled: true });
      expect(trigger).toHaveAttribute('aria-disabled', 'true');
      await user.click(trigger);
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('uses label as the accessible name when given', () => {
      render(
        <ActionsMenu label="Actions for Hanako Sato" trigger={<Button>More</Button>}>
          <MenuItem>Export</MenuItem>
        </ActionsMenu>,
      );
      expect(screen.getByRole('button', { name: 'Actions for Hanako Sato' })).toBeInTheDocument();
    });

    it('requires label without a custom trigger (checked by the type checker)', () => {
      // @ts-expect-error -- the default icon trigger has no visible text, so it needs a label
      const element = <ActionsMenu><MenuItem>Export</MenuItem></ActionsMenu>;
      expect(element).toBeTruthy();
    });
  });

  describe('axe accessibility', () => {
    it('has no violations in default state', async () => {
      const { container } = renderMenu();
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations when open', async () => {
      const user = userEvent.setup();
      const { trigger } = renderMenu();
      await user.click(trigger);
      // The menu is portalled, so scan the whole body. "region" is a
      // page-level rule that a test document can't satisfy.
      expect(await axe(document.body, { rules: { region: { enabled: false } } })).toHaveNoViolations();
    });

    it('has no violations when disabled', async () => {
      const { container } = renderMenu({ disabled: true });
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations with a custom trigger', async () => {
      const { container } = render(
        <ActionsMenu trigger={<Button appearance="bordered">Bulk actions</Button>}>
          <MenuItem>Export</MenuItem>
        </ActionsMenu>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations when disabled with focusableWhenDisabled', async () => {
      const { container } = renderMenu({ disabled: true, focusableWhenDisabled: true });
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
