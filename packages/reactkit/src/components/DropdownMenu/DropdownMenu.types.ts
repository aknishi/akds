import React from 'react';

export interface DropdownMenuProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Floating label shown above the selected value. */
  label?: string;
  /** Placeholder text shown when nothing is selected. */
  placeholder?: string;
  /** Controls the open state externally. If omitted, open state is managed internally. */
  open?: boolean;
  /** Called when the open state should change. */
  onOpenChange?: (open: boolean) => void;
  /** The currently selected value — always controlled. String for single, string[] for multi. */
  selected?: string | string[] | undefined;
  /** Called with the new value whenever the selection changes. */
  onChange?: (value: string | string[]) => void;
  /** When true, multiple options can be selected simultaneously. */
  multiple?: boolean;
  /** When true, prevents interaction and applies disabled styling. */
  disabled?: boolean;
  /** Helper text rendered below the control. */
  helperText?: string;
  /** Name attribute for form association. */
  name?: string;
  /** When true, stretches the component to fill its parent container. */
  fullWidth?: boolean;
  /** Option elements. */
  children: React.ReactNode;
  /** Accessible name when no label prop is provided. */
  'aria-label'?: string;
}
