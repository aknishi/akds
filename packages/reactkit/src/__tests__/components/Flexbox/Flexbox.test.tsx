import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Flexbox } from '../../../components/Flexbox/Flexbox';

expect.extend(toHaveNoViolations);

describe('Flexbox', () => {
  it('renders children in the document', () => {
    render(<Flexbox><span>Child</span></Flexbox>);
    expect(screen.getByText('Child')).toBeInTheDocument();
  });

  it('applies base class', () => {
    render(<Flexbox data-testid="flex">Content</Flexbox>);
    expect(screen.getByTestId('flex')).toHaveClass('akds-flexbox');
  });

  it('renders as div by default', () => {
    render(<Flexbox data-testid="flex">Content</Flexbox>);
    expect(screen.getByTestId('flex').tagName).toBe('DIV');
  });

  it('renders as a different element when as prop is provided', () => {
    render(<Flexbox as="section" data-testid="flex">Content</Flexbox>);
    expect(screen.getByTestId('flex').tagName).toBe('SECTION');
  });

  it('sets justify-content via CSS custom property', () => {
    render(<Flexbox justify="center" data-testid="flex">Content</Flexbox>);
    const style = screen.getByTestId('flex').style;
    expect(style.getPropertyValue('--akds-flexbox-justify')).toBe('center');
  });

  it('sets align-items via CSS custom property', () => {
    render(<Flexbox align="flex-end" data-testid="flex">Content</Flexbox>);
    expect(screen.getByTestId('flex').style.getPropertyValue('--akds-flexbox-align')).toBe('flex-end');
  });

  it('sets flex-direction via CSS custom property', () => {
    render(<Flexbox direction="column" data-testid="flex">Content</Flexbox>);
    expect(screen.getByTestId('flex').style.getPropertyValue('--akds-flexbox-direction')).toBe('column');
  });

  it('sets flex-wrap to wrap when wrap is true', () => {
    render(<Flexbox wrap data-testid="flex">Content</Flexbox>);
    expect(screen.getByTestId('flex').style.getPropertyValue('--akds-flexbox-wrap')).toBe('wrap');
  });

  it('sets flex-wrap to nowrap when wrap is false', () => {
    render(<Flexbox wrap={false} data-testid="flex">Content</Flexbox>);
    expect(screen.getByTestId('flex').style.getPropertyValue('--akds-flexbox-wrap')).toBe('nowrap');
  });

  it('does not set flex-wrap CSS var when wrap is omitted', () => {
    render(<Flexbox data-testid="flex">Content</Flexbox>);
    expect(screen.getByTestId('flex').style.getPropertyValue('--akds-flexbox-wrap')).toBe('');
  });

  it.each([
    ['xs', 'var(--akds-spacing-layout-xs)'],
    ['sm', 'var(--akds-spacing-layout-sm)'],
    ['md', 'var(--akds-spacing-layout-md)'],
    ['lg', 'var(--akds-spacing-layout-lg)'],
    ['xl', 'var(--akds-spacing-layout-xl)'],
    ['2xl', 'var(--akds-spacing-layout-2xl)'],
  ])('resolves gap token "%s" to the correct CSS variable', (token, expected) => {
    render(<Flexbox gap={token} data-testid="flex">Content</Flexbox>);
    expect(screen.getByTestId('flex').style.getPropertyValue('--akds-flexbox-gap')).toBe(expected);
  });

  it('passes through a raw CSS gap value', () => {
    render(<Flexbox gap="12px" data-testid="flex">Content</Flexbox>);
    expect(screen.getByTestId('flex').style.getPropertyValue('--akds-flexbox-gap')).toBe('12px');
  });

  describe('padding props', () => {
    it('sets padding shorthand via CSS custom property', () => {
      render(<Flexbox padding="md" data-testid="flex">Content</Flexbox>);
      expect(screen.getByTestId('flex').style.getPropertyValue('--akds-flexbox-padding')).toBe('var(--akds-spacing-layout-md)');
    });

    it('sets pt via CSS custom property', () => {
      render(<Flexbox pt="sm" data-testid="flex">Content</Flexbox>);
      expect(screen.getByTestId('flex').style.getPropertyValue('--akds-flexbox-pt')).toBe('var(--akds-spacing-layout-sm)');
    });

    it('sets pr via CSS custom property', () => {
      render(<Flexbox pr="lg" data-testid="flex">Content</Flexbox>);
      expect(screen.getByTestId('flex').style.getPropertyValue('--akds-flexbox-pr')).toBe('var(--akds-spacing-layout-lg)');
    });

    it('sets pb via CSS custom property', () => {
      render(<Flexbox pb="xs" data-testid="flex">Content</Flexbox>);
      expect(screen.getByTestId('flex').style.getPropertyValue('--akds-flexbox-pb')).toBe('var(--akds-spacing-layout-xs)');
    });

    it('sets pl via CSS custom property', () => {
      render(<Flexbox pl="xl" data-testid="flex">Content</Flexbox>);
      expect(screen.getByTestId('flex').style.getPropertyValue('--akds-flexbox-pl')).toBe('var(--akds-spacing-layout-xl)');
    });

    it('sets px via CSS custom property', () => {
      render(<Flexbox px="md" data-testid="flex">Content</Flexbox>);
      expect(screen.getByTestId('flex').style.getPropertyValue('--akds-flexbox-px')).toBe('var(--akds-spacing-layout-md)');
    });

    it('sets py via CSS custom property', () => {
      render(<Flexbox py="sm" data-testid="flex">Content</Flexbox>);
      expect(screen.getByTestId('flex').style.getPropertyValue('--akds-flexbox-py')).toBe('var(--akds-spacing-layout-sm)');
    });

    it('accepts raw CSS values for padding props', () => {
      render(<Flexbox padding="16px" pt="8px" data-testid="flex">Content</Flexbox>);
      const el = screen.getByTestId('flex');
      expect(el.style.getPropertyValue('--akds-flexbox-padding')).toBe('16px');
      expect(el.style.getPropertyValue('--akds-flexbox-pt')).toBe('8px');
    });
  });

  describe('margin props', () => {
    it('sets margin shorthand via CSS custom property', () => {
      render(<Flexbox margin="md" data-testid="flex">Content</Flexbox>);
      expect(screen.getByTestId('flex').style.getPropertyValue('--akds-flexbox-margin')).toBe('var(--akds-spacing-layout-md)');
    });

    it('sets mt via CSS custom property', () => {
      render(<Flexbox mt="sm" data-testid="flex">Content</Flexbox>);
      expect(screen.getByTestId('flex').style.getPropertyValue('--akds-flexbox-mt')).toBe('var(--akds-spacing-layout-sm)');
    });

    it('sets mr via CSS custom property', () => {
      render(<Flexbox mr="lg" data-testid="flex">Content</Flexbox>);
      expect(screen.getByTestId('flex').style.getPropertyValue('--akds-flexbox-mr')).toBe('var(--akds-spacing-layout-lg)');
    });

    it('sets mb via CSS custom property', () => {
      render(<Flexbox mb="xs" data-testid="flex">Content</Flexbox>);
      expect(screen.getByTestId('flex').style.getPropertyValue('--akds-flexbox-mb')).toBe('var(--akds-spacing-layout-xs)');
    });

    it('sets ml via CSS custom property', () => {
      render(<Flexbox ml="xl" data-testid="flex">Content</Flexbox>);
      expect(screen.getByTestId('flex').style.getPropertyValue('--akds-flexbox-ml')).toBe('var(--akds-spacing-layout-xl)');
    });

    it('sets mx via CSS custom property', () => {
      render(<Flexbox mx="md" data-testid="flex">Content</Flexbox>);
      expect(screen.getByTestId('flex').style.getPropertyValue('--akds-flexbox-mx')).toBe('var(--akds-spacing-layout-md)');
    });

    it('sets my via CSS custom property', () => {
      render(<Flexbox my="sm" data-testid="flex">Content</Flexbox>);
      expect(screen.getByTestId('flex').style.getPropertyValue('--akds-flexbox-my')).toBe('var(--akds-spacing-layout-sm)');
    });

    it('accepts raw CSS values for margin props including auto', () => {
      render(<Flexbox margin="auto" mt="8px" data-testid="flex">Content</Flexbox>);
      const el = screen.getByTestId('flex');
      expect(el.style.getPropertyValue('--akds-flexbox-margin')).toBe('auto');
      expect(el.style.getPropertyValue('--akds-flexbox-mt')).toBe('8px');
    });
  });

  it('merges consumer style prop without overriding CSS vars', () => {
    render(<Flexbox gap="sm" style={{ color: 'red' }} data-testid="flex">Content</Flexbox>);
    const el = screen.getByTestId('flex');
    expect(el.style.getPropertyValue('--akds-flexbox-gap')).toBe('var(--akds-spacing-layout-sm)');
    expect(el.style.color).toBe('red');
  });

  it('passes through className and HTML attributes', () => {
    render(<Flexbox className="custom" data-testid="flex">Content</Flexbox>);
    const el = screen.getByTestId('flex');
    expect(el).toHaveClass('custom');
    expect(el).toHaveClass('akds-flexbox');
  });

  it('forwards ref to the root element', () => {
    const ref = React.createRef<HTMLElement>();
    render(<Flexbox ref={ref}>Ref</Flexbox>);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe('DIV');
  });

  describe('axe accessibility', () => {
    it('has no violations in default state', async () => {
      const { container } = render(<Flexbox><span>Item</span></Flexbox>);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
