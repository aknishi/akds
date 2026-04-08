import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ProgressTracker } from '../../../components/ProgressTracker/ProgressTracker';
import { ProgressTrackerStep } from '../../../components/ProgressTrackerStep/ProgressTrackerStep';

expect.extend(toHaveNoViolations);

function renderTracker(currentStep = 1) {
  return render(
    <ProgressTracker currentStep={currentStep}>
      <ProgressTrackerStep label="Step 1" status="complete" />
      <ProgressTrackerStep label="Step 2" />
      <ProgressTrackerStep label="Step 3" />
    </ProgressTracker>,
  );
}

describe('ProgressTracker', () => {
  it('renders all step labels', () => {
    renderTracker();
    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.getByText('Step 2')).toBeInTheDocument();
    expect(screen.getByText('Step 3')).toBeInTheDocument();
  });

  it('applies base class to the container', () => {
    const { container } = renderTracker();
    expect(container.querySelector('.akds-progress-tracker')).toBeInTheDocument();
  });

  it('renders the track and fill elements', () => {
    const { container } = renderTracker();
    expect(container.querySelector('.akds-progress-tracker__track')).toBeInTheDocument();
    expect(container.querySelector('.akds-progress-tracker__fill')).toBeInTheDocument();
  });

  it('sets --pt-fill-width CSS variable based on currentStep', () => {
    const { container } = renderTracker(2);
    const el = container.querySelector('.akds-progress-tracker') as HTMLElement;
    expect(el.style.getPropertyValue('--pt-fill-width')).toBe('50%');
  });

  it('sets --pt-fill-width to 0% when currentStep is 1', () => {
    const { container } = renderTracker(1);
    const el = container.querySelector('.akds-progress-tracker') as HTMLElement;
    expect(el.style.getPropertyValue('--pt-fill-width')).toBe('0%');
  });

  it('sets --pt-fill-width to 100% when currentStep is the last step', () => {
    const { container } = renderTracker(3);
    const el = container.querySelector('.akds-progress-tracker') as HTMLElement;
    expect(el.style.getPropertyValue('--pt-fill-width')).toBe('100%');
  });

  it('sets --pt-step-count on the container', () => {
    const { container } = renderTracker();
    const el = container.querySelector('.akds-progress-tracker') as HTMLElement;
    expect(el.style.getPropertyValue('--pt-step-count')).toBe('3');
  });

  it('marks the active step with aria-current="step"', () => {
    renderTracker(2);
    const steps = screen.getAllByRole('listitem');
    expect(steps[1]).toHaveAttribute('aria-current', 'step');
  });

  it('does not set aria-current on inactive steps', () => {
    renderTracker(2);
    const steps = screen.getAllByRole('listitem');
    expect(steps[0]).not.toHaveAttribute('aria-current');
    expect(steps[2]).not.toHaveAttribute('aria-current');
  });

  it('forwards ref to the outer div', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <ProgressTracker ref={ref} currentStep={1}>
        <ProgressTrackerStep label="Step 1" />
      </ProgressTracker>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('forwards className to the outer div', () => {
    const { container } = render(
      <ProgressTracker className="custom" currentStep={1}>
        <ProgressTrackerStep label="Step 1" />
      </ProgressTracker>,
    );
    expect(container.querySelector('.akds-progress-tracker')).toHaveClass('custom');
  });

  it('passes through data attributes', () => {
    const { container } = render(
      <ProgressTracker data-testid="pt" currentStep={1}>
        <ProgressTrackerStep label="Step 1" />
      </ProgressTracker>,
    );
    expect(container.querySelector('[data-testid="pt"]')).toBeInTheDocument();
  });
});

describe('ProgressTrackerStep', () => {
  it('applies base class', () => {
    renderTracker();
    const steps = screen.getAllByRole('listitem');
    steps.forEach(s => expect(s).toHaveClass('akds-progress-tracker-step'));
  });

  it('applies complete modifier class', () => {
    renderTracker(2);
    const steps = screen.getAllByRole('listitem');
    expect(steps[0]).toHaveClass('akds-progress-tracker-step--complete');
  });

  it('applies active modifier class for the current step', () => {
    renderTracker(2);
    const steps = screen.getAllByRole('listitem');
    expect(steps[1]).toHaveClass('akds-progress-tracker-step--active');
  });

  it('applies inactive modifier class for steps with no status', () => {
    renderTracker(1);
    const steps = screen.getAllByRole('listitem');
    expect(steps[1]).toHaveClass('akds-progress-tracker-step--inactive');
    expect(steps[2]).toHaveClass('akds-progress-tracker-step--inactive');
  });

  it('active prop overrides status to show active styling', () => {
    const { container } = render(
      <ProgressTracker currentStep={-1}>
        <ProgressTrackerStep label="Step 1" status="complete" active />
      </ProgressTracker>,
    );
    const step = container.querySelector('.akds-progress-tracker-step');
    expect(step).toHaveClass('akds-progress-tracker-step--active');
    expect(step).not.toHaveClass('akds-progress-tracker-step--complete');
  });

  it('renders error modifier class', () => {
    const { container } = render(
      <ProgressTracker currentStep={-1}>
        <ProgressTrackerStep label="Step 1" status="error" />
      </ProgressTracker>,
    );
    expect(container.querySelector('.akds-progress-tracker-step--error')).toBeInTheDocument();
  });

  it('renders warning modifier class', () => {
    const { container } = render(
      <ProgressTracker currentStep={-1}>
        <ProgressTrackerStep label="Step 1" status="warning" />
      </ProgressTracker>,
    );
    expect(container.querySelector('.akds-progress-tracker-step--warning')).toBeInTheDocument();
  });

  it('renders check icon for complete steps', () => {
    const { container } = render(
      <ProgressTracker currentStep={-1}>
        <ProgressTrackerStep label="Step 1" status="complete" />
      </ProgressTracker>,
    );
    expect(container.querySelector('.akds-progress-tracker-step__check-icon')).toBeInTheDocument();
  });

  it('renders warning icon for error steps', () => {
    const { container } = render(
      <ProgressTracker currentStep={-1}>
        <ProgressTrackerStep label="Step 1" status="error" />
      </ProgressTracker>,
    );
    expect(container.querySelector('.akds-progress-tracker-step__alert-icon')).toBeInTheDocument();
  });

  it('renders warning icon for warning steps', () => {
    const { container } = render(
      <ProgressTracker currentStep={-1}>
        <ProgressTrackerStep label="Step 1" status="warning" />
      </ProgressTracker>,
    );
    expect(container.querySelector('.akds-progress-tracker-step__alert-icon')).toBeInTheDocument();
  });

  it('renders dot for the active step', () => {
    const { container } = renderTracker(2);
    expect(container.querySelector('.akds-progress-tracker-step__dot')).toBeInTheDocument();
  });

  it('does not render check icon on an active step even if status is complete', () => {
    const { container } = render(
      <ProgressTracker currentStep={1}>
        <ProgressTrackerStep label="Step 1" status="complete" />
        <ProgressTrackerStep label="Step 2" />
      </ProgressTracker>,
    );
    // step 0 is active (currentStep=1 → activeIndex=0), status "complete" is overridden
    const steps = container.querySelectorAll('.akds-progress-tracker-step');
    expect(steps[0]).toHaveClass('akds-progress-tracker-step--active');
    expect(steps[0].querySelector('.akds-progress-tracker-step__check-icon')).not.toBeInTheDocument();
  });

  it('forwards ref to the li element', () => {
    const ref = React.createRef<HTMLLIElement>();
    render(
      <ProgressTracker currentStep={1}>
        <ProgressTrackerStep ref={ref} label="Step 1" />
      </ProgressTracker>,
    );
    expect(ref.current).toBeInstanceOf(HTMLLIElement);
  });

  it('passes through className', () => {
    const { container } = render(
      <ProgressTracker currentStep={1}>
        <ProgressTrackerStep label="Step 1" className="custom-step" />
      </ProgressTracker>,
    );
    expect(container.querySelector('.custom-step')).toBeInTheDocument();
  });
});

describe('axe accessibility', () => {
  it('has no violations in default state', async () => {
    const { container } = renderTracker(1);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no violations with active step in the middle', async () => {
    const { container } = renderTracker(2);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no violations with error and warning steps', async () => {
    const { container } = render(
      <ProgressTracker currentStep={3}>
        <ProgressTrackerStep label="Step 1" status="complete" />
        <ProgressTrackerStep label="Step 2" status="error" />
        <ProgressTrackerStep label="Step 3" status="warning" />
      </ProgressTracker>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no violations with all steps complete', async () => {
    const { container } = render(
      <ProgressTracker currentStep={-1}>
        <ProgressTrackerStep label="Step 1" status="complete" />
        <ProgressTrackerStep label="Step 2" status="complete" />
        <ProgressTrackerStep label="Step 3" status="complete" />
      </ProgressTracker>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
