import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Tooltip } from '../../../components/Tooltip/Tooltip';

expect.extend(toHaveNoViolations);

describe('Tooltip', () => {
  it('renders the trigger child in the document', () => {
    render(
      <Tooltip content="Tooltip text">
        <button>Trigger</button>
      </Tooltip>,
    );
    expect(screen.getByRole('button', { name: 'Trigger' })).toBeInTheDocument();
  });

  it('renders the tooltip element with role="tooltip"', () => {
    render(
      <Tooltip content="Tooltip text">
        <button>Trigger</button>
      </Tooltip>,
    );
    expect(screen.getByRole('tooltip', { hidden: true })).toBeInTheDocument();
  });

  it('tooltip is not visible by default', () => {
    render(
      <Tooltip content="Hidden tip">
        <button>Trigger</button>
      </Tooltip>,
    );
    const tooltip = screen.getByRole('tooltip', { hidden: true });
    expect(tooltip).not.toHaveClass('akds-tooltip--visible');
  });

  it('shows tooltip on hover', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Hover tip">
        <button>Trigger</button>
      </Tooltip>,
    );
    await user.hover(screen.getByRole('button'));
    expect(screen.getByRole('tooltip')).toHaveClass('akds-tooltip--visible');
  });

  it('hides tooltip when mouse leaves', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Hover tip">
        <button>Trigger</button>
      </Tooltip>,
    );
    await user.hover(screen.getByRole('button'));
    await user.unhover(screen.getByRole('button'));
    expect(screen.getByRole('tooltip', { hidden: true })).not.toHaveClass('akds-tooltip--visible');
  });

  it('shows tooltip on focus', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Focus tip">
        <button>Trigger</button>
      </Tooltip>,
    );
    await user.tab();
    expect(screen.getByRole('tooltip')).toHaveClass('akds-tooltip--visible');
  });

  it('hides tooltip on blur', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Focus tip">
        <button>Trigger</button>
      </Tooltip>,
    );
    await user.tab();
    await user.tab();
    expect(screen.getByRole('tooltip', { hidden: true })).not.toHaveClass('akds-tooltip--visible');
  });

  it('links trigger to tooltip via aria-describedby', () => {
    render(
      <Tooltip content="Described tip">
        <button>Trigger</button>
      </Tooltip>,
    );
    const trigger = screen.getByRole('button');
    const tooltip = screen.getByRole('tooltip', { hidden: true });
    expect(trigger).toHaveAttribute('aria-describedby', tooltip.id);
  });

  it('applies placement class', () => {
    render(
      <Tooltip content="Right tip" placement="right">
        <button>Trigger</button>
      </Tooltip>,
    );
    expect(screen.getByRole('tooltip', { hidden: true })).toHaveClass('akds-tooltip--right');
  });

  it('defaults to top placement', () => {
    render(
      <Tooltip content="Top tip">
        <button>Trigger</button>
      </Tooltip>,
    );
    expect(screen.getByRole('tooltip', { hidden: true })).toHaveClass('akds-tooltip--top');
  });

  describe('axe accessibility', () => {
    it('has no violations in default state', async () => {
      const { container } = render(
        <Tooltip content="Accessible tip">
          <button>Trigger</button>
        </Tooltip>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations when visible', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Tooltip content="Accessible tip">
          <button>Trigger</button>
        </Tooltip>,
      );
      await user.hover(screen.getByRole('button'));
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
