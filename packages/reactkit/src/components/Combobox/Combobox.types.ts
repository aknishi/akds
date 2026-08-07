export interface ComboboxOption {
  /** The value submitted or passed to onChange. */
  value: string;
  /** The display label shown in the list and input. */
  label: string;
  /** When true, the option cannot be selected. */
  disabled?: boolean;
}

export interface ComboboxProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Array of selectable options. */
  options: ComboboxOption[];
  /** The currently selected value(s). String for single mode, string[] for multiple. Makes the component controlled. */
  value?: string | string[];
  /** Initial selected value(s) for the uncontrolled case. */
  defaultValue?: string | string[];
  /** Called when the selection changes. */
  onChange?: (value: string | string[]) => void;
  /** Floating label text rendered inside the control. */
  label?: string;
  /** Placeholder shown when no value is selected and the input is empty. */
  placeholder?: string;
  /** Helper text rendered below the control. */
  helperText?: string;
  /** When true, multiple options can be selected. */
  multiple?: boolean;
  /** When true, prevents interaction and applies disabled styling. */
  disabled?: boolean;
  /** When true, the control expands to fill its container's width. */
  fullWidth?: boolean;
  /** Accessible label applied to the combobox input when no visible label is provided. */
  'aria-label'?: string;
}
