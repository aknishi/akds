import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Accordion } from '../../../components/Accordion/Accordion';
import { AccordionItem } from '../../../components/AccordionItem/AccordionItem';

expect.extend(toHaveNoViolations);

function AccordionFixture({
  defaultExpanded,
  multiple = false,
  onChange,
}: {
  defaultExpanded?: string | string[];
  multiple?: boolean;
  onChange?: (v: string | string[]) => void;
}) {
  return (
    <Accordion
      {...(defaultExpanded !== undefined && { defaultExpanded })}
      multiple={multiple}
      {...(onChange !== undefined && { onChange })}
    >
      <AccordionItem value="a" title="Section A">Content A</AccordionItem>
      <AccordionItem value="b" title="Section B">Content B</AccordionItem>
      <AccordionItem value="c" title="Section C" disabled>Content C</AccordionItem>
    </Accordion>
  );
}

describe('Accordion', () => {
  it('renders trigger buttons', () => {
    render(<AccordionFixture />);
    expect(screen.getByRole('button', { name: 'Section A' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Section B' })).toBeInTheDocument();
  });

  it('applies default classes', () => {
    const { container } = render(<AccordionFixture />);
    expect(container.firstChild as Element).toHaveClass('akds-accordion');
    expect(screen.getAllByRole('button')[0]!.closest('.akds-accordion-item')).toBeInTheDocument();
  });

  it('collapsed by default with no defaultExpanded', () => {
    render(<AccordionFixture />);
    expect(screen.getByRole('button', { name: 'Section A' })).toHaveAttribute('aria-expanded', 'false');
  });

  it('expands the defaultExpanded item', () => {
    render(<AccordionFixture defaultExpanded="a" />);
    expect(screen.getByRole('button', { name: 'Section A' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Content A')).toBeInTheDocument();
  });

  it('applies --expanded class to expanded item', () => {
    const { container } = render(<AccordionFixture defaultExpanded="a" />);
    const items = container.querySelectorAll('.akds-accordion-item');
    expect(items[0]).toHaveClass('akds-accordion-item--expanded');
    expect(items[1]).not.toHaveClass('akds-accordion-item--expanded');
  });

  it('toggles item on click', async () => {
    render(<AccordionFixture />);
    const btnA = screen.getByRole('button', { name: 'Section A' });
    await userEvent.click(btnA);
    expect(btnA).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(btnA);
    expect(btnA).toHaveAttribute('aria-expanded', 'false');
  });

  it('single mode: collapses previously expanded when another opens', async () => {
    render(<AccordionFixture defaultExpanded="a" />);
    await userEvent.click(screen.getByRole('button', { name: 'Section B' }));
    expect(screen.getByRole('button', { name: 'Section A' })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('button', { name: 'Section B' })).toHaveAttribute('aria-expanded', 'true');
  });

  it('multiple mode: allows several items expanded at once', async () => {
    render(<AccordionFixture multiple />);
    await userEvent.click(screen.getByRole('button', { name: 'Section A' }));
    await userEvent.click(screen.getByRole('button', { name: 'Section B' }));
    expect(screen.getByRole('button', { name: 'Section A' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: 'Section B' })).toHaveAttribute('aria-expanded', 'true');
  });

  it('calls onChange on toggle', async () => {
    const onChange = vi.fn();
    render(<AccordionFixture onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Section A' }));
    expect(onChange).toHaveBeenCalledWith('a');
  });

  it('disabled item cannot be toggled', async () => {
    render(<AccordionFixture />);
    const btnC = screen.getByRole('button', { name: 'Section C' });
    expect(btnC).toBeDisabled();
    await userEvent.click(btnC);
    expect(btnC).toHaveAttribute('aria-expanded', 'false');
  });

  it('disabled item has --disabled class', () => {
    const { container } = render(<AccordionFixture />);
    const items = container.querySelectorAll('.akds-accordion-item');
    expect(items[2]).toHaveClass('akds-accordion-item--disabled');
  });

  it('controlled: respects expanded prop', () => {
    const { rerender } = render(
      <Accordion expanded="a">
        <AccordionItem value="a" title="A">Content A</AccordionItem>
        <AccordionItem value="b" title="B">Content B</AccordionItem>
      </Accordion>,
    );
    expect(screen.getByRole('button', { name: 'A' })).toHaveAttribute('aria-expanded', 'true');
    rerender(
      <Accordion expanded="b">
        <AccordionItem value="a" title="A">Content A</AccordionItem>
        <AccordionItem value="b" title="B">Content B</AccordionItem>
      </Accordion>,
    );
    expect(screen.getByRole('button', { name: 'B' })).toHaveAttribute('aria-expanded', 'true');
  });

  it('AccordionItem without an Accordion parent defaults to collapsed and ignores toggle', async () => {
    render(<AccordionItem value="a" title="Standalone">Content</AccordionItem>);
    const btn = screen.getByRole('button', { name: 'Standalone' });
    expect(btn).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'false');
  });

  it('forwards ref to root div', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Accordion ref={ref}><AccordionItem value="a" title="A">C</AccordionItem></Accordion>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  describe('axe accessibility', () => {
    it('has no violations in default state', async () => {
      const { container } = render(<AccordionFixture />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations with an item expanded', async () => {
      const { container } = render(<AccordionFixture defaultExpanded="a" />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations with multiple expanded', async () => {
      const { container } = render(<AccordionFixture multiple defaultExpanded={['a', 'b']} />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations with a disabled item', async () => {
      const { container } = render(<AccordionFixture defaultExpanded="a" />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
