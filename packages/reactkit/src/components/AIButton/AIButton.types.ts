export type AIButtonSize = 'sm' | 'md' | 'lg';

export interface AIButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * When true, replaces the label with `loadingLabel` and disables interaction.
   * Uncontrolled by default: if omitted, the button enters its own loading
   * state on click and stays there. Pass this prop to control when it clears.
   */
  loading?: boolean;
  /** Content shown in place of `children` while `loading` is true. */
  loadingLabel?: React.ReactNode;
  /**
   * When true, a disabled button remains focusable so screen readers can
   * discover it. Sets `aria-disabled` instead of the native `disabled`
   * attribute, which would remove it from the tab order entirely.
   */
  focusableWhenDisabled?: boolean;
  /** Content rendered inside the button, e.g. "Generate". Required — overrides the optional inherited type. */
  children: React.ReactNode;
}
