import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { CloseIcon } from '../components/CloseIcon';

describe('Icon color', () => {
  it('applies only the base class and no custom color style by default', () => {
    const { container } = render(<CloseIcon />);
    const svg = container.querySelector('svg')!;
    expect(svg).toHaveClass('akds-icon');
    expect(svg).not.toHaveClass('akds-icon--custom');
    expect(svg.style.getPropertyValue('--akds-icon-custom-color')).toBe('');
  });

  it.each(['error', 'warning', 'success', 'info'] as const)(
    'applies the akds-icon--%s modifier class for the semantic color and sets no custom color style',
    color => {
      const { container } = render(<CloseIcon color={color} />);
      const svg = container.querySelector('svg')!;
      expect(svg).toHaveClass('akds-icon');
      expect(svg).toHaveClass(`akds-icon--${color}`);
      expect(svg).not.toHaveClass('akds-icon--custom');
      expect(svg.style.getPropertyValue('--akds-icon-custom-color')).toBe('');
    },
  );

  it('applies the akds-icon--custom class and sets the CSS variable for a hex color', () => {
    const { container } = render(<CloseIcon color="#ff6600" />);
    const svg = container.querySelector('svg')!;
    expect(svg).toHaveClass('akds-icon');
    expect(svg).toHaveClass('akds-icon--custom');
    expect(svg).not.toHaveClass('akds-icon--error');
    expect(svg.style.getPropertyValue('--akds-icon-custom-color')).toBe('#ff6600');
  });

  it('applies the akds-icon--custom class for an rgb() color', () => {
    const { container } = render(<CloseIcon color="rgb(255, 0, 0)" />);
    const svg = container.querySelector('svg')!;
    expect(svg).toHaveClass('akds-icon--custom');
    expect(svg.style.getPropertyValue('--akds-icon-custom-color')).toBe('rgb(255, 0, 0)');
  });

  it('applies the akds-icon--custom class for a CSS variable color', () => {
    const { container } = render(<CloseIcon color="var(--brand-color)" />);
    const svg = container.querySelector('svg')!;
    expect(svg).toHaveClass('akds-icon--custom');
    expect(svg.style.getPropertyValue('--akds-icon-custom-color')).toBe('var(--brand-color)');
  });

  it('merges a custom color with a consumer-provided style prop', () => {
    const { container } = render(<CloseIcon color="#ff6600" style={{ opacity: 0.5 }} />);
    const svg = container.querySelector('svg')!;
    expect(svg.style.getPropertyValue('--akds-icon-custom-color')).toBe('#ff6600');
    expect(svg.style.opacity).toBe('0.5');
  });

  it('merges a consumer-provided className with the generated classes', () => {
    const { container } = render(<CloseIcon color="error" className="my-class" />);
    const svg = container.querySelector('svg')!;
    expect(svg).toHaveClass('akds-icon', 'akds-icon--error', 'my-class');
  });

  it('forwards the ref to the underlying svg element', () => {
    const ref = React.createRef<SVGSVGElement>();
    render(<CloseIcon ref={ref} />);
    expect(ref.current).toBeInstanceOf(SVGSVGElement);
  });
});
