import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { useUserInvalid } from '../../utils/useUserInvalid';

function Field() {
  const ref = React.useRef<HTMLInputElement>(null);
  const { userInvalid, validationMessage, onBlur, onChange, onInvalid } = useUserInvalid(ref);
  return (
    <form>
      <input
        ref={ref}
        aria-label="Email"
        required
        aria-invalid={userInvalid}
        onBlur={onBlur}
        onChange={onChange}
        onInvalid={onInvalid}
      />
      <span data-testid="message">{validationMessage}</span>
      <button type="reset">Reset</button>
    </form>
  );
}

const field = () => screen.getByRole<HTMLInputElement>('textbox', { name: 'Email' });

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe('useUserInvalid (fallback without :user-invalid)', () => {
  it('stays valid while pristine, even when blurred empty', () => {
    render(<Field />);
    fireEvent.blur(field());
    expect(field()).toHaveAttribute('aria-invalid', 'false');
  });

  it('does not flag while the user is still typing, only after they leave the field', () => {
    render(<Field />);
    fireEvent.change(field(), { target: { value: 'a' } });
    fireEvent.change(field(), { target: { value: '' } });
    expect(field()).toHaveAttribute('aria-invalid', 'false');
    fireEvent.blur(field());
    expect(field()).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByTestId('message').textContent).not.toBe('');
  });

  it('clears as soon as the value is fixed after the first blur', () => {
    render(<Field />);
    fireEvent.change(field(), { target: { value: 'a' } });
    fireEvent.change(field(), { target: { value: '' } });
    fireEvent.blur(field());
    expect(field()).toHaveAttribute('aria-invalid', 'true');
    fireEvent.change(field(), { target: { value: 'me@example.com' } });
    expect(field()).toHaveAttribute('aria-invalid', 'false');
    expect(screen.getByTestId('message')).toBeEmptyDOMElement();
  });

  it('flags an untouched field on a failed submit (invalid event)', () => {
    render(<Field />);
    fireEvent.invalid(field());
    expect(field()).toHaveAttribute('aria-invalid', 'true');
  });

  it('clears after a form reset', () => {
    vi.useFakeTimers();
    render(<Field />);
    fireEvent.invalid(field());
    expect(field()).toHaveAttribute('aria-invalid', 'true');
    fireEvent.reset(field().form!);
    act(() => { vi.runAllTimers(); });
    expect(field()).toHaveAttribute('aria-invalid', 'false');
  });

  it('removes the reset listener on unmount', () => {
    const { unmount } = render(<Field />);
    const form = field().form!;
    const remove = vi.spyOn(form, 'removeEventListener');
    unmount();
    expect(remove).toHaveBeenCalledWith('reset', expect.any(Function));
  });
});

describe('useUserInvalid (native :user-invalid)', () => {
  it('mirrors the :user-invalid match on blur', () => {
    render(<Field />);
    const input = field();
    // Stubbed after querying: Testing Library's role queries use CSS too.
    vi.stubGlobal('CSS', { supports: (q: string) => q === 'selector(:user-invalid)' });
    const matches = vi.spyOn(input, 'matches').mockImplementation((s: string) => s === ':user-invalid');
    fireEvent.blur(input);
    expect(matches).toHaveBeenCalledWith(':user-invalid');
    expect(input).toHaveAttribute('aria-invalid', 'true');

    matches.mockReturnValue(false);
    fireEvent.change(input, { target: { value: 'x' } });
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });
});
