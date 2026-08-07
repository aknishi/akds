export interface LikeButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * When true, a disabled button remains focusable so screen readers can
   * discover it. Sets `aria-disabled` instead of the native `disabled`
   * attribute, which would remove it from the tab order entirely.
   */
  focusableWhenDisabled?: boolean;
  /**
   * For a controlled state. When true it will render in the pressed state.
   */
  liked?: boolean;
}
