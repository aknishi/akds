export type ToggleGroupSize = 'sm' | 'md' | 'lg';

export interface ToggleGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** The currently selected value (controlled). */
  value?: string;
  /** The initially selected value (uncontrolled). */
  defaultValue?: string;
  /** Called with a button's value when the selection changes. */
  onChange?: (value: string) => void;
  /** When true, disables all child ToggleButton components. */
  disabled?: boolean;
  /** Sets the size applied to all child ToggleButton components. */
  size?: ToggleGroupSize;
  /** ToggleButton components to render inside the group. Required — overrides the optional inherited type. */
  children: React.ReactNode;
}
