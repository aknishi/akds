export type SpinnerSize = 'sm' | 'md' | 'lg';

export interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
  /**
   * Accessible label announced by screen readers (e.g. "Loading results").
   * Omit when the spinner is decorative, such as inside a button that already
   * sets `aria-busy`; it is then hidden from assistive tech.
   */
  label?: string;
}
