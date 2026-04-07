import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Text } from '../../../components/Text/Text';

expect.extend(toHaveNoViolations);

describe('Text', () => {
  it('renders children in the document', () => {
    render(<Text>Hello world</Text>);
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });

  it('applies base class and default styleAs class', () => {
    render(<Text>Body</Text>);
    const el = screen.getByText('Body');
    expect(el).toHaveClass('akds-text');
    expect(el).toHaveClass('akds-text--body');
  });

  it('renders as <p> by default for body styleAs', () => {
    render(<Text styleAs="body">Paragraph</Text>);
    expect(screen.getByText('Paragraph').tagName).toBe('P');
  });

  it('renders as the correct semantic element for each styleAs', () => {
    const cases: Array<[Parameters<typeof Text>[0]['styleAs'], string]> = [
      ['h1', 'H1'],
      ['h2', 'H2'],
      ['h3', 'H3'],
      ['h4', 'H4'],
      ['h5', 'H5'],
      ['h6', 'H6'],
      ['body', 'P'],
      ['label', 'SPAN'],
      ['caption', 'SPAN'],
    ];

    for (const [styleAs, tag] of cases) {
      const { unmount } = render(<Text styleAs={styleAs}>{styleAs}</Text>);
      expect(screen.getByText(styleAs!).tagName).toBe(tag);
      unmount();
    }
  });

  it('applies the correct modifier class for each styleAs', () => {
    const styleValues: Array<NonNullable<Parameters<typeof Text>[0]['styleAs']>> = [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'body', 'label', 'caption',
    ];

    for (const styleAs of styleValues) {
      const { unmount } = render(<Text styleAs={styleAs}>{styleAs}</Text>);
      expect(screen.getByText(styleAs)).toHaveClass(`akds-text--${styleAs}`);
      unmount();
    }
  });

  it('overrides the element when as prop is provided', () => {
    render(<Text styleAs="h1" as="span">Heading as span</Text>);
    expect(screen.getByText('Heading as span').tagName).toBe('SPAN');
    expect(screen.getByText('Heading as span')).toHaveClass('akds-text--h1');
  });

  it('passes through className and extra HTML attributes', () => {
    render(<Text className="custom" data-testid="text-el">Content</Text>);
    const el = screen.getByTestId('text-el');
    expect(el).toHaveClass('custom');
    expect(el).toHaveClass('akds-text');
  });

  it('forwards ref to the underlying element', () => {
    const ref = React.createRef<HTMLElement>();
    render(<Text ref={ref}>Ref test</Text>);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe('P');
  });

  describe('axe accessibility', () => {
    it('has no violations with default body style', async () => {
      const { container } = render(<Text>Body text</Text>);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations with heading styles', async () => {
      const { container } = render(<Text styleAs="h1">Heading</Text>);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations with as prop override', async () => {
      const { container } = render(<Text styleAs="h2" as="span">Span heading</Text>);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
