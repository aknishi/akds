export type ButtonAppearance = 'solid' | 'transparent' | 'bordered';
export type ButtonSentiment = 'accented' | 'neutral' | 'success' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Controls the visual style of the button. */
  appearance?: ButtonAppearance;
  /** Conveys the intent or meaning of the action. */
  sentiment?: ButtonSentiment;
  /** Sets the size of the button. */
  size?: ButtonSize;
  /** When true, replaces button content with a spinner and disables interaction. */
  loading?: boolean;
  /**
   * When true, a disabled button remains focusable so screen readers can
   * discover it. Sets `aria-disabled` instead of the native `disabled`
   * attribute, which would remove it from the tab order entirely.
   */
  focusableWhenDisabled?: boolean;
  /** Content rendered inside the button. Required — overrides the optional inherited type. */
  children: React.ReactNode;
}
