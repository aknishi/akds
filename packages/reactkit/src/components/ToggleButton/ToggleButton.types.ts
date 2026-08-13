export type ToggleButtonSize = 'sm' | 'md' | 'lg';
export type ToggleButtonColor = 'primary' | 'success' | 'error' | 'neutral';

export interface ToggleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Identifies this button when used inside a ToggleGroup. Required for grouped usage. */
  value?: string;
  /** The pressed state when used standalone (controlled). Has no effect inside a ToggleGroup. */
  pressed?: boolean;
  /** The initial pressed state when used standalone (uncontrolled). Has no effect inside a ToggleGroup. */
  defaultPressed?: boolean;
  /** Called with the next pressed state when used standalone. Has no effect inside a ToggleGroup. */
  onPressedChange?: (pressed: boolean) => void;
  /** When true, prevents interaction and applies disabled styling. */
  disabled?: boolean;
  /** Sets the size of the button. Overridden by the parent ToggleGroup's size when grouped. */
  size?: ToggleButtonSize;
  /** Sets the active-state color when used standalone. Has no effect inside a ToggleGroup. */
  color?: ToggleButtonColor;
  /** Content rendered inside the button. Required — overrides the optional inherited type. */
  children: React.ReactNode;
}
