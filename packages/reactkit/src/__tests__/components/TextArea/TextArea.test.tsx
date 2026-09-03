import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { TextArea } from '../../../components/TextArea/TextArea';

expect.extend(toHaveNoViolations);

describe('TextArea', () => {
  // 1. Renders with correct role and accessible name
  it('renders with correct role and accessible name via label', () => {
    render(<TextArea label="Description" />);
    expect(screen.getByRole('textbox', { name: 'Description' })).toBeInTheDocument();
  });

  it('renders with accessible name via aria-label when no label provided', () => {
    render(<TextArea aria-label="Comments" />);
    expect(screen.getByRole('textbox', { name: 'Comments' })).toBeInTheDocument();
  });

  it('renders a native textarea element', () => {
    render(<TextArea label="Description" />);
    expect(screen.getByRole('textbox').tagName).toBe('TEXTAREA');
  });

  // 2. Default classes
  it('applies the base class and no state modifier classes by default', () => {
    const { container } = render(<TextArea label="Description" />);
    expect(container.firstChild).toHaveClass('akds-text-area');
    expect(container.firstChild).not.toHaveClass('akds-text-area--disabled');
    expect(container.firstChild).not.toHaveClass('akds-text-area--error');
    expect(container.firstChild).not.toHaveClass('akds-text-area--no-resize');
  });

  // 3. minRows
  it('applies minRows as the rows attribute', () => {
    render(<TextArea label="Bio" minRows={6} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '6');
  });

  it('defaults minRows to 3', () => {
    render(<TextArea label="Bio" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '3');
  });

  // 4. resizable
  it('does not apply the no-resize class when resizable', () => {
    const { container } = render(<TextArea label="Notes" resizable />);
    expect(container.firstChild).not.toHaveClass('akds-text-area--no-resize');
  });

  it('applies the no-resize class when resizable is false', () => {
    const { container } = render(<TextArea label="Notes" resizable={false} />);
    expect(container.firstChild).toHaveClass('akds-text-area--no-resize');
  });

  // 5. Label floating
  it('applies floating class to label when textarea is focused', async () => {
    render(<TextArea label="Name" />);
    const textarea = screen.getByRole('textbox');
    const label = screen.getByText('Name');

    expect(label).not.toHaveClass('akds-text-area__label--floating');
    await userEvent.click(textarea);
    expect(label).toHaveClass('akds-text-area__label--floating');
  });

  it('applies floating class to label when textarea has a defaultValue', () => {
    render(<TextArea label="Name" defaultValue="Hello" />);
    expect(screen.getByText('Name')).toHaveClass('akds-text-area__label--floating');
  });

  it('applies floating class to label when textarea has a controlled value', () => {
    render(<TextArea label="Name" value="Hello" onChange={() => {}} />);
    expect(screen.getByText('Name')).toHaveClass('akds-text-area__label--floating');
  });

  it('applies floating class after typing a value', async () => {
    render(<TextArea label="Name" />);
    await userEvent.type(screen.getByRole('textbox'), 'A');
    expect(screen.getByText('Name')).toHaveClass('akds-text-area__label--floating');
  });

  it('label is at rest when not focused and has no value', () => {
    render(<TextArea label="Name" />);
    expect(screen.getByText('Name')).not.toHaveClass('akds-text-area__label--floating');
  });

  it('label returns to rest when blurred without a value', async () => {
    render(<TextArea label="Name" />);
    const textarea = screen.getByRole('textbox');

    await userEvent.click(textarea);
    expect(screen.getByText('Name')).toHaveClass('akds-text-area__label--floating');
    await userEvent.tab();
    expect(screen.getByText('Name')).not.toHaveClass('akds-text-area__label--floating');
  });

  // 6. helperText renders
  it('renders helper text below the textarea', () => {
    render(<TextArea label="Feedback" helperText="Tell us what you think" />);
    expect(screen.getByText('Tell us what you think')).toBeInTheDocument();
    expect(screen.getByText('Tell us what you think')).toHaveClass('akds-text-area__helper-text');
  });

  it('does not render helper text element when helperText is not provided', () => {
    render(<TextArea label="Name" />);
    expect(document.querySelector('.akds-text-area__helper-text')).not.toBeInTheDocument();
  });

  it('associates helper text with textarea via aria-describedby', () => {
    render(<TextArea label="Feedback" helperText="Tell us what you think" />);
    const textarea = screen.getByRole('textbox');
    const helperId = textarea.getAttribute('aria-describedby');
    expect(helperId).toBeTruthy();
    const helperEl = document.getElementById(helperId!);
    expect(helperEl).toHaveTextContent('Tell us what you think');
  });

  // 7. onChange fires
  it('calls onChange when user types', async () => {
    const onChange = vi.fn();
    render(<TextArea label="Name" onChange={onChange} />);
    await userEvent.type(screen.getByRole('textbox'), 'Hi');
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  // 8. error state
  it('applies error class to the outer wrapper when error', () => {
    const { container } = render(<TextArea label="Name" error />);
    expect(container.firstChild).toHaveClass('akds-text-area--error');
  });

  it('sets aria-invalid when error', () => {
    render(<TextArea label="Name" error />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  // 9. disabled state
  it('applies disabled attribute to the inner textarea when disabled', () => {
    render(<TextArea label="Name" disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('applies disabled class to the outer wrapper when disabled', () => {
    const { container } = render(<TextArea label="Name" disabled />);
    expect(container.firstChild).toHaveClass('akds-text-area--disabled');
  });

  it('does not call onChange when disabled', async () => {
    const onChange = vi.fn();
    render(<TextArea label="Name" disabled onChange={onChange} />);
    await userEvent.type(screen.getByRole('textbox'), 'Hi');
    expect(onChange).not.toHaveBeenCalled();
  });

  // 10. Controlled/uncontrolled value
  it('reflects a controlled value in the textarea', () => {
    render(<TextArea label="Name" value="Hello" onChange={() => {}} />);
    expect(screen.getByRole('textbox')).toHaveValue('Hello');
  });

  it('reflects a defaultValue in the textarea for uncontrolled usage', () => {
    render(<TextArea label="Name" defaultValue="Hello" />);
    expect(screen.getByRole('textbox')).toHaveValue('Hello');
  });

  // 11. HTML attribute passthrough
  it('forwards data-testid to the inner textarea', () => {
    render(<TextArea data-testid="text-area" label="Name" />);
    expect(screen.getByTestId('text-area')).toBeInstanceOf(HTMLTextAreaElement);
  });

  it('forwards data-* attributes to the inner textarea', () => {
    render(<TextArea label="Name" data-custom="value" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('data-custom', 'value');
  });

  it('forwards aria-* attributes to the inner textarea', () => {
    render(<TextArea label="Name" aria-describedby="hint" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-describedby');
  });

  it('forwards textareaRef to the inner textarea element', () => {
    const textareaRef = React.createRef<HTMLTextAreaElement>();
    render(<TextArea label="Name" textareaRef={textareaRef} />);
    expect(textareaRef.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  // 12. Ref forwarding to outer div
  it('forwards ref to the outer div element', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<TextArea ref={ref} label="Name" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveClass('akds-text-area');
  });

  // 13. axe accessibility
  describe('axe accessibility', () => {
    it('has no violations in default state', async () => {
      const { container } = render(<TextArea label="Description" />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations when disabled', async () => {
      const { container } = render(<TextArea label="Description" disabled />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations when in error state', async () => {
      const { container } = render(
        <TextArea label="Comment" defaultValue="Too short" helperText="Must be longer" error />,
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations when not resizable', async () => {
      const { container } = render(<TextArea label="Notes" resizable={false} />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations with aria-label (no visible label)', async () => {
      const { container } = render(<TextArea aria-label="Comments" />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations with helperText', async () => {
      const { container } = render(
        <TextArea label="Feedback" helperText="Tell us what you think" />,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
