import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Divider } from '../../../components/Divider/Divider';

expect.extend(toHaveNoViolations);

describe('Divider', () => {
  it('renders a horizontal hr by default', () => {
    render(<Divider />);
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('applies base and default modifier classes', () => {
    const { container } = render(<Divider />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveClass('akds-divider', 'akds-divider--horizontal', 'akds-divider--solid');
  });

  it('applies orientation modifier classes', () => {
    const { rerender, container } = render(<Divider orientation="horizontal" />);
    expect(container.firstChild).toHaveClass('akds-divider--horizontal');
    rerender(<Divider orientation="vertical" />);
    expect(container.firstChild).toHaveClass('akds-divider--vertical');
  });

  it('applies variant modifier classes', () => {
    const variants = ['solid', 'dashed', 'dotted'] as const;
    const { rerender, container } = render(<Divider variant="solid" />);
    variants.forEach(variant => {
      rerender(<Divider variant={variant} />);
      expect(container.firstChild).toHaveClass(`akds-divider--${variant}`);
    });
  });

  it('renders a div with role separator and labeled class when label is provided', () => {
    render(<Divider label="or" />);
    const separator = screen.getByRole('separator');
    expect(separator.tagName).toBe('DIV');
    expect(separator).toHaveClass('akds-divider--labeled');
  });

  it('renders the label text when label prop is provided', () => {
    render(<Divider label="Section title" />);
    expect(screen.getByText('Section title')).toBeInTheDocument();
  });

  it('renders an hr (not div) when no label is provided', () => {
    render(<Divider />);
    expect(screen.getByRole('separator').tagName).toBe('HR');
  });

  it('forwards data-testid via rest spread on hr', () => {
    render(<Divider data-testid="my-divider" />);
    expect(screen.getByTestId('my-divider')).toBeInTheDocument();
  });

  it('forwards ref to the hr element', () => {
    const ref = React.createRef<HTMLHRElement>();
    render(<Divider ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLHRElement);
  });

  describe('axe accessibility', () => {
    it('has no violations for horizontal divider', async () => {
      const { container } = render(<Divider />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations for vertical divider', async () => {
      const { container } = render(
        <div style={{ display: 'flex' }}>
          <Divider orientation="vertical" />
        </div>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations for labeled divider', async () => {
      const { container } = render(<Divider label="or" />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
