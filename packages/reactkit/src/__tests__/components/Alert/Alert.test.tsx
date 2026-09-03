import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Alert } from '../../../components/Alert/Alert';
import { AlertTitle } from '../../../components/AlertTitle/AlertTitle';

expect.extend(toHaveNoViolations);

describe('Alert', () => {
  it('renders children as content', () => {
    render(<Alert>Something happened</Alert>);
    expect(screen.getByText('Something happened')).toBeInTheDocument();
  });

  it('applies base and default emphasis/variant modifier classes', () => {
    const { container } = render(<Alert>Message</Alert>);
    const alert = container.firstChild as HTMLElement;
    expect(alert).toHaveClass('akds-alert', 'akds-alert--info', 'akds-alert--default');
  });

  it('applies emphasis modifier classes', () => {
    const emphases = ['info', 'success', 'warning', 'error'] as const;
    const { rerender, container } = render(<Alert emphasis="info">Message</Alert>);
    emphases.forEach(emphasis => {
      rerender(<Alert emphasis={emphasis}>Message</Alert>);
      expect(container.firstChild).toHaveClass(`akds-alert--${emphasis}`);
    });
  });

  it('applies variant modifier classes', () => {
    const variants = ['default', 'filled'] as const;
    const { rerender, container } = render(<Alert variant="default">Message</Alert>);
    variants.forEach(variant => {
      rerender(<Alert variant={variant}>Message</Alert>);
      expect(container.firstChild).toHaveClass(`akds-alert--${variant}`);
    });
  });

  it('uses role="status" and aria-live="polite" for info, success, and warning', () => {
    const { rerender } = render(<Alert emphasis="info">Message</Alert>);
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');

    rerender(<Alert emphasis="success">Message</Alert>);
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');

    rerender(<Alert emphasis="warning">Message</Alert>);
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
  });

  it('uses role="alert" and aria-live="assertive" for error', () => {
    render(<Alert emphasis="error">Message</Alert>);
    expect(screen.getByRole('alert')).toHaveAttribute('aria-live', 'assertive');
  });

  it('renders a default icon based on emphasis', () => {
    const { container } = render(<Alert emphasis="success">Message</Alert>);
    expect(container.querySelector('.akds-alert__icon')).toBeInTheDocument();
    expect(container.querySelector('.akds-alert__icon svg')).toBeInTheDocument();
  });

  it('renders a custom icon when provided', () => {
    render(<Alert icon={<span data-testid="custom-icon" />}>Message</Alert>);
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('renders no icon when icon is false', () => {
    const { container } = render(<Alert icon={false}>Message</Alert>);
    expect(container.querySelector('.akds-alert__icon')).not.toBeInTheDocument();
  });

  it('renders no action wrapper when action is not provided', () => {
    const { container } = render(<Alert>Message</Alert>);
    expect(container.querySelector('.akds-alert__action')).not.toBeInTheDocument();
  });

  it('renders the action content when provided', () => {
    render(<Alert action={<button>Retry</button>}>Message</Alert>);
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
  });

  it('forwards data-testid via rest spread', () => {
    render(<Alert data-testid="my-alert">Message</Alert>);
    expect(screen.getByTestId('my-alert')).toBeInTheDocument();
  });

  it('forwards ref to the div element', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Alert ref={ref}>Message</Alert>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  describe('axe accessibility', () => {
    it('has no violations in default state', async () => {
      const { container } = render(<Alert>Message</Alert>);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations for each emphasis', async () => {
      const emphases = ['info', 'success', 'warning', 'error'] as const;
      for (const emphasis of emphases) {
        const { container, unmount } = render(<Alert emphasis={emphasis}>Message</Alert>);
        expect(await axe(container)).toHaveNoViolations();
        unmount();
      }
    });

    it('has no violations for the filled variant', async () => {
      const emphases = ['info', 'success', 'warning', 'error'] as const;
      for (const emphasis of emphases) {
        const { container, unmount } = render(
          <Alert emphasis={emphasis} variant="filled">Message</Alert>,
        );
        expect(await axe(container)).toHaveNoViolations();
        unmount();
      }
    });

    it('has no violations with an action', async () => {
      const { container } = render(
        <Alert action={<button aria-label="Dismiss">×</button>}>Message</Alert>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});

describe('AlertTitle', () => {
  it('renders children as text', () => {
    render(
      <Alert>
        <AlertTitle>Storage almost full</AlertTitle>
        You have used 95% of your storage.
      </Alert>,
    );
    expect(screen.getByText('Storage almost full')).toBeInTheDocument();
  });

  it('applies the base class', () => {
    const { container } = render(<AlertTitle>Title</AlertTitle>);
    expect(container.firstChild).toHaveClass('akds-alert-title');
  });

  it('forwards ref to the div element', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<AlertTitle ref={ref}>Title</AlertTitle>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('forwards data-testid via rest spread', () => {
    render(<AlertTitle data-testid="my-title">Title</AlertTitle>);
    expect(screen.getByTestId('my-title')).toBeInTheDocument();
  });

  describe('axe accessibility', () => {
    it('has no violations inside an Alert', async () => {
      const { container } = render(
        <Alert>
          <AlertTitle>Title</AlertTitle>
          Body text.
        </Alert>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
