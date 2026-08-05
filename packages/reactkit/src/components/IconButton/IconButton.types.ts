export type IconButtonAppearance = 'solid' | 'transparent' | 'bordered';
export type IconButtonEmphasis = 'accented' | 'neutral' | 'success' | 'destructive';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Controls the visual style of the button. */
  appearance?: IconButtonAppearance;
  /** Conveys the intent or meaning of the action. */
  emphasis?: IconButtonEmphasis;
  /** When true, replaces the icon with a spinner and disables interaction. */
  loading?: boolean;
  /**
   * When true, a disabled button remains focusable so screen readers can
   * discover it. Sets `aria-disabled` instead of the native `disabled`
   * attribute, which would remove it from the tab order entirely.
   */
  focusableWhenDisabled?: boolean;
  /** A single icon rendered inside the button. Required — overrides the optional inherited type. */
  children: React.ReactNode;
  /**
   * Accessible label describing the button's action, e.g. "Delete item".
   * Required because the button renders only an icon with no visible text —
   * screen readers announce this label in its place. Overrides the optional
   * inherited type.
   */
  'aria-label': string;
}
