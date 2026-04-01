import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { TextInput } from '../../../components/TextInput/TextInput';

expect.extend(toHaveNoViolations);

describe('TextInput', () => {
  // 1. Renders with correct role and accessible name
  it('renders with correct role and accessible name via label', () => {
    render(<TextInput label="Email" />);
    expect(screen.getByRole('textbox', { name: 'Email' })).toBeInTheDocument();
  });

  it('renders with accessible name via aria-label when no label provided', () => {
    render(<TextInput aria-label="Search field" />);
    expect(screen.getByRole('textbox', { name: 'Search field' })).toBeInTheDocument();
  });

  // 2. Label floats when input is focused
  it('applies floating class to label when input is focused', async () => {
    render(<TextInput label="Name" />);
    const input = screen.getByRole('textbox');
    const label = screen.getByText('Name');

    expect(label).not.toHaveClass('akds-text-input__label--floating');
    await userEvent.click(input);
    expect(label).toHaveClass('akds-text-input__label--floating');
  });

  // 3. Label floats when input has a value
  it('applies floating class to label when input has a defaultValue', () => {
    render(<TextInput label="Name" defaultValue="John" />);
    expect(screen.getByText('Name')).toHaveClass('akds-text-input__label--floating');
  });

  it('applies floating class to label when input has a controlled value', () => {
    render(<TextInput label="Email" value="user@example.com" onChange={() => {}} />);
    expect(screen.getByText('Email')).toHaveClass('akds-text-input__label--floating');
  });

  it('applies floating class after typing a value', async () => {
    render(<TextInput label="Name" />);
    await userEvent.type(screen.getByRole('textbox'), 'A');
    expect(screen.getByText('Name')).toHaveClass('akds-text-input__label--floating');
  });

  // 4. Label is at rest when no focus and no value
  it('label is at rest when not focused and has no value', () => {
    render(<TextInput label="Name" />);
    expect(screen.getByText('Name')).not.toHaveClass('akds-text-input__label--floating');
  });

  it('label returns to rest when blurred without a value', async () => {
    render(<TextInput label="Name" />);
    const input = screen.getByRole('textbox');

    await userEvent.click(input);
    expect(screen.getByText('Name')).toHaveClass('akds-text-input__label--floating');
    await userEvent.tab();
    expect(screen.getByText('Name')).not.toHaveClass('akds-text-input__label--floating');
  });

  it('label stays floating after typing and blurring', async () => {
    render(<TextInput label="Name" />);
    const input = screen.getByRole('textbox');

    await userEvent.type(input, 'Hello');
    await userEvent.tab();
    expect(screen.getByText('Name')).toHaveClass('akds-text-input__label--floating');
  });

  // 5. startAdornment renders
  it('renders startAdornment inside the adornment wrapper', () => {
    render(<TextInput label="Price" startAdornment={<span data-testid="adornment">$</span>} />);
    const adornment = screen.getByTestId('adornment');
    expect(adornment).toBeInTheDocument();
    expect(adornment.closest('.akds-text-input__start-adornment')).toBeInTheDocument();
  });

  it('does not render start adornment wrapper when no startAdornment provided', () => {
    render(<TextInput label="Name" />);
    expect(document.querySelector('.akds-text-input__start-adornment')).not.toBeInTheDocument();
  });

  // 6. helperText renders
  it('renders helper text below the input', () => {
    render(<TextInput label="Email" helperText="Enter a valid email address" />);
    expect(screen.getByText('Enter a valid email address')).toBeInTheDocument();
    expect(screen.getByText('Enter a valid email address')).toHaveClass('akds-text-input__helper-text');
  });

  it('does not render helper text element when helperText is not provided', () => {
    render(<TextInput label="Name" />);
    expect(document.querySelector('.akds-text-input__helper-text')).not.toBeInTheDocument();
  });

  it('associates helper text with input via aria-describedby', () => {
    render(<TextInput label="Email" helperText="Enter a valid email address" />);
    const input = screen.getByRole('textbox');
    const helperId = input.getAttribute('aria-describedby');
    expect(helperId).toBeTruthy();
    const helperEl = document.getElementById(helperId!);
    expect(helperEl).toHaveTextContent('Enter a valid email address');
  });

  // 7. onChange fires
  it('calls onChange when user types', async () => {
    const onChange = vi.fn();
    render(<TextInput label="Name" onChange={onChange} />);
    await userEvent.type(screen.getByRole('textbox'), 'Hi');
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  // 8. disabled state
  it('applies disabled attribute to the inner input when disabled', () => {
    render(<TextInput label="Name" disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('applies disabled class to the outer wrapper when disabled', () => {
    render(<TextInput label="Name" disabled data-testid="wrapper" />);
    expect(screen.getByTestId('wrapper')).toHaveClass('akds-text-input--disabled');
  });

  it('does not call onChange when disabled', async () => {
    const onChange = vi.fn();
    render(<TextInput label="Name" disabled onChange={onChange} />);
    await userEvent.type(screen.getByRole('textbox'), 'Hi');
    expect(onChange).not.toHaveBeenCalled();
  });

  // 9. HTML passthrough
  it('forwards data-testid to the outer div', () => {
    render(<TextInput data-testid="text-input-root" label="Name" />);
    const root = screen.getByTestId('text-input-root');
    expect(root).toHaveClass('akds-text-input');
  });

  it('forwards additional HTML attributes to the outer div', () => {
    render(<TextInput label="Name" data-custom="value" aria-label="Name field" />);
    const input = screen.getByRole('textbox');
    expect(input).not.toHaveAttribute('aria-label');
  });

  // 10. Ref forwarding to outer div
  it('forwards ref to the outer div element', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<TextInput ref={ref} label="Name" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveClass('akds-text-input');
  });

  // 11. axe accessibility
  describe('axe accessibility', () => {
    it('has no violations in default state', async () => {
      const { container } = render(<TextInput label="Email address" />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations when disabled', async () => {
      const { container } = render(<TextInput label="Email address" disabled />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations with aria-label (no visible label)', async () => {
      const { container } = render(<TextInput aria-label="Search" />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations with startAdornment and helperText', async () => {
      const { container } = render(
        <TextInput
          label="Price"
          startAdornment={<span aria-hidden="true">$</span>}
          helperText="Enter amount in USD"
        />,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
