import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Avatar } from '@aknishi/akds-reactkit';
import { DataViewCard } from '../../DataViewCard/DataViewCard';
import { CardHarness } from '../fixtures/CardHarness';

expect.extend(toHaveNoViolations);

const card = (name: string) => screen.getByRole('article', { name });

describe('DataViewCard', () => {
  it('renders an article named by its h3 title', () => {
    render(<CardHarness />);
    const hanako = card('Hanako Sato');
    expect(hanako).toHaveClass('akds-dataview-card', 'akds-card');
    expect(within(hanako).getByRole('heading', { level: 3, name: 'Hanako Sato' })).toBeInTheDocument();
  });

  it('renders no checkbox unless CardView is selectable', () => {
    render(<CardHarness />);
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });

  it('renders a checkbox named with the card title when selectable', () => {
    render(<CardHarness selectable />);
    expect(within(card('Kenji Ito')).getByRole('checkbox', { name: 'Select Kenji Ito' })).toBeInTheDocument();
  });

  it('selects its row', async () => {
    const user = userEvent.setup();
    render(<CardHarness selectable />);
    const checkbox = screen.getByRole('checkbox', { name: 'Select Kenji Ito' });
    await user.click(checkbox.closest('label')!);
    expect(checkbox).toBeChecked();
    expect(card('Kenji Ito')).toHaveClass('akds-dataview-card--selected');
  });

  it('throws a helpful error outside CardView', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const onWindowError = (e: ErrorEvent) => e.preventDefault();
    window.addEventListener('error', onWindowError);
    expect(() => render(<DataViewCard title="Orphan">Body</DataViewCard>)).toThrow(
      'DataViewCard and DataViewField must be used inside CardView.',
    );
    window.removeEventListener('error', onWindowError);
    consoleSpy.mockRestore();
  });

  it('renders card actions in the header by default, before the body', () => {
    render(<CardHarness cardActions={(row) => <button type="button">Open {row.original.customer}</button>} />);
    const hanako = card('Hanako Sato');
    const button = within(hanako).getByRole('button', { name: 'Open Hanako Sato' });
    expect(button.closest('.akds-card-header')).not.toBeNull();
    expect(button.parentElement).toHaveClass('akds-dataview-actions');
    expect(hanako.querySelector('.akds-card-footer')).toBeNull();
  });

  it('renders card actions in a footer after the body with cardActionsPlacement="footer"', () => {
    render(
      <CardHarness
        cardActionsPlacement="footer"
        cardActions={(row) => (
          <>
            <button type="button">Approve {row.original.customer}</button>
            <button type="button">Reject {row.original.customer}</button>
          </>
        )}
      />,
    );
    const hanako = card('Hanako Sato');
    const footer = hanako.querySelector('.akds-card-footer')!;
    expect(within(footer as HTMLElement).getAllByRole('button')).toHaveLength(2);
    const body = hanako.querySelector('.akds-card-content')!;
    expect(body.compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(hanako.querySelector('.akds-card-header .akds-dataview-actions')).toBeNull();
  });

  it('keeps the frame order: checkbox, title, actions', () => {
    render(<CardHarness selectable cardActions={() => <button type="button">Act</button>} />);
    const header = card('Hanako Sato').querySelector('.akds-card-header')!;
    const order = Array.from(header.querySelectorAll('input, h3, button')).map((el) => el.tagName);
    expect(order).toEqual(['INPUT', 'H3', 'BUTTON']);
  });

  it('renders a subtitle below the title, inside the heading block', () => {
    render(
      <CardHarness>
        {(row) => <DataViewCard title={row.original.customer} subtitle={`Order ${row.id}`}>Body</DataViewCard>}
      </CardHarness>,
    );
    const hanako = card('Hanako Sato');
    const subtitle = within(hanako).getByText('Order ORD-1');
    expect(subtitle).toHaveClass('akds-dataview-card__subtitle');
    expect(subtitle.parentElement).toHaveClass('akds-dataview-card__heading');
    expect(subtitle.previousElementSibling).toBe(within(hanako).getByRole('heading', { level: 3 }));
  });

  it('renders no subtitle or avatar by default', () => {
    render(<CardHarness />);
    const hanako = card('Hanako Sato');
    expect(hanako.querySelector('.akds-dataview-card__subtitle')).toBeNull();
    expect(hanako.querySelector('.akds-dataview-card__avatar')).toBeNull();
    expect(hanako).not.toHaveClass('akds-dataview-card--with-avatar');
  });

  it('renders the avatar between the checkbox and the title', () => {
    render(
      <CardHarness selectable>
        {(row) => (
          <DataViewCard title={row.original.customer} avatar={<span data-testid={`avatar-${row.id}`} />}>
            Body
          </DataViewCard>
        )}
      </CardHarness>,
    );
    const hanako = card('Hanako Sato');
    expect(hanako).toHaveClass('akds-dataview-card--with-avatar');
    const avatar = within(hanako).getByTestId('avatar-ORD-1');
    expect(avatar.parentElement).toHaveClass('akds-dataview-card__avatar');
    const header = hanako.querySelector('.akds-card-header')!;
    const order = Array.from(header.querySelectorAll('input, [data-testid], h3')).map((el) => el.tagName);
    expect(order).toEqual(['INPUT', 'SPAN', 'H3']);
  });

  it('renders an Avatar at sm unless it sets its own size', () => {
    render(
      <CardHarness>
        {(row) => (
          <DataViewCard
            title={row.original.customer}
            avatar={
              row.id === 'ORD-1' ? <Avatar name={row.original.customer} /> : <Avatar name={row.original.customer} size="lg" />
            }
          >
            Body
          </DataViewCard>
        )}
      </CardHarness>,
    );
    expect(card('Hanako Sato').querySelector('.akds-avatar')).toHaveClass('akds-avatar--sm');
    expect(card('Kenji Ito').querySelector('.akds-avatar')).toHaveClass('akds-avatar--lg');
  });

  it('forwards HTML attributes and ref to the card root', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <CardHarness>
        {(row) =>
          row.id === 'ORD-1' ? (
            <DataViewCard ref={ref} title="Hanako Sato" data-testid="card">Body</DataViewCard>
          ) : null
        }
      </CardHarness>,
    );
    expect(screen.getByTestId('card')).toBe(ref.current);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  describe('axe accessibility', () => {
    it('has no violations in default state', async () => {
      const { container } = render(<CardHarness />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations when selectable with footer actions', async () => {
      const { container } = render(
        <CardHarness
          selectable
          cardActionsPlacement="footer"
          cardActions={(row) => <button type="button">Approve {row.original.customer}</button>}
        />,
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations with an avatar and subtitle', async () => {
      const { container } = render(
        <CardHarness selectable cardActions={(row) => <button type="button">Open {row.original.customer}</button>}>
          {(row) => (
            <DataViewCard
              title={row.original.customer}
              subtitle={row.id}
              avatar={<Avatar name={row.original.customer} />}
            >
              Body
            </DataViewCard>
          )}
        </CardHarness>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
