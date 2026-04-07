import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Card } from '../../../components/Card/Card';
import { CardHeader } from '../../../components/CardHeader/CardHeader';
import { CardContent } from '../../../components/CardContent/CardContent';
import { CardFooter } from '../../../components/CardFooter/CardFooter';

expect.extend(toHaveNoViolations);

describe('Card', () => {
  it('renders children in the document', () => {
    render(<Card><CardContent>Content</CardContent></Card>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('applies base class', () => {
    render(<Card data-testid="card"><CardContent>Content</CardContent></Card>);
    expect(screen.getByTestId('card')).toHaveClass('akds-card');
  });

  it('does not apply borderless class by default', () => {
    render(<Card data-testid="card"><CardContent>Content</CardContent></Card>);
    expect(screen.getByTestId('card')).not.toHaveClass('akds-card--borderless');
  });

  it('applies borderless class when borderless prop is true', () => {
    render(<Card borderless data-testid="card"><CardContent>Content</CardContent></Card>);
    expect(screen.getByTestId('card')).toHaveClass('akds-card--borderless');
  });

  it('passes through className and HTML attributes', () => {
    render(<Card className="custom" data-testid="card"><CardContent>Content</CardContent></Card>);
    const el = screen.getByTestId('card');
    expect(el).toHaveClass('custom');
    expect(el).toHaveClass('akds-card');
  });

  it('forwards ref to the root div', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Card ref={ref}><CardContent>Ref</CardContent></Card>);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe('DIV');
  });

  describe('CardHeader', () => {
    it('applies divided class when inside a bordered Card', () => {
      render(
        <Card>
          <CardHeader data-testid="header">Title</CardHeader>
        </Card>,
      );
      expect(screen.getByTestId('header')).toHaveClass('akds-card-header--divided');
    });

    it('does not apply divided class when inside a borderless Card', () => {
      render(
        <Card borderless>
          <CardHeader data-testid="header">Title</CardHeader>
        </Card>,
      );
      expect(screen.getByTestId('header')).not.toHaveClass('akds-card-header--divided');
    });

    it('applies divided class standalone (safe default: borderless=false)', () => {
      render(<CardHeader data-testid="header">Title</CardHeader>);
      expect(screen.getByTestId('header')).toHaveClass('akds-card-header--divided');
    });
  });

  describe('CardContent', () => {
    it('applies base class', () => {
      render(<CardContent data-testid="content">Body</CardContent>);
      expect(screen.getByTestId('content')).toHaveClass('akds-card-content');
    });

    it('forwards ref', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<CardContent ref={ref}>Body</CardContent>);
      expect(ref.current?.tagName).toBe('DIV');
    });
  });

  describe('CardFooter', () => {
    it('applies divided class when inside a bordered Card', () => {
      render(
        <Card>
          <CardFooter data-testid="footer">Actions</CardFooter>
        </Card>,
      );
      expect(screen.getByTestId('footer')).toHaveClass('akds-card-footer--divided');
    });

    it('does not apply divided class when inside a borderless Card', () => {
      render(
        <Card borderless>
          <CardFooter data-testid="footer">Actions</CardFooter>
        </Card>,
      );
      expect(screen.getByTestId('footer')).not.toHaveClass('akds-card-footer--divided');
    });
  });

  describe('axe accessibility', () => {
    it('has no violations with all sub-components', async () => {
      const { container } = render(
        <Card>
          <CardHeader>Card title</CardHeader>
          <CardContent>Card body content.</CardContent>
          <CardFooter>Footer</CardFooter>
        </Card>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations in borderless mode', async () => {
      const { container } = render(
        <Card borderless>
          <CardHeader>Card title</CardHeader>
          <CardContent>Card body content.</CardContent>
          <CardFooter>Footer</CardFooter>
        </Card>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
