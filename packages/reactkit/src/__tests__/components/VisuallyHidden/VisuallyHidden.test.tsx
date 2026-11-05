import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { VisuallyHidden } from '../../../components/VisuallyHidden/VisuallyHidden';
import { Checkbox } from '../../../components/Checkbox/Checkbox';

expect.extend(toHaveNoViolations);

describe('VisuallyHidden', () => {
  it('renders its children as text in the document', () => {
    render(<VisuallyHidden>Hidden label</VisuallyHidden>);
    expect(screen.getByText('Hidden label')).toBeInTheDocument();
  });

  it('applies the base class', () => {
    render(<VisuallyHidden>Hidden label</VisuallyHidden>);
    expect(screen.getByText('Hidden label')).toHaveClass('akds-visually-hidden');
  });

  it('merges a custom className', () => {
    render(<VisuallyHidden className="custom">Hidden label</VisuallyHidden>);
    expect(screen.getByText('Hidden label')).toHaveClass('akds-visually-hidden', 'custom');
  });

  it('contributes to the accessible name of its parent', () => {
    render(<button type="button">Approve<VisuallyHidden> order for Hanako Sato</VisuallyHidden></button>);
    // jsdom's name computation drops the space before the hidden text, which
    // browsers keep, so the space is optional here.
    expect(screen.getByRole('button', { name: /^Approve\s?order for Hanako Sato$/ })).toBeInTheDocument();
  });

  it('labels a checkbox without visible text', () => {
    render(<Checkbox label={<VisuallyHidden>Select Hanako Sato</VisuallyHidden>} />);
    expect(screen.getByRole('checkbox', { name: 'Select Hanako Sato' })).toBeInTheDocument();
  });

  it('forwards HTML attributes', () => {
    render(<VisuallyHidden data-testid="vh" id="vh-id">Hidden label</VisuallyHidden>);
    expect(screen.getByTestId('vh')).toHaveAttribute('id', 'vh-id');
  });

  it('forwards ref to the span element', () => {
    const ref = React.createRef<HTMLSpanElement>();
    render(<VisuallyHidden ref={ref}>Hidden label</VisuallyHidden>);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  describe('axe accessibility', () => {
    it('has no violations in default state', async () => {
      const { container } = render(<VisuallyHidden>Hidden label</VisuallyHidden>);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations as a checkbox label', async () => {
      const { container } = render(<Checkbox label={<VisuallyHidden>Select Hanako Sato</VisuallyHidden>} />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
