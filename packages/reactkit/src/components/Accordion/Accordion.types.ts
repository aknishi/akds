export interface AccordionProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** The currently expanded item value(s). String for single mode, string[] for multiple. Makes the component controlled. */
  expanded?: string | string[];
  /** Initial expanded item(s) for the uncontrolled case. */
  defaultExpanded?: string | string[];
  /** Called when an item is toggled. Receives a string in single mode, string[] in multiple mode. */
  onChange?: (expanded: string | string[]) => void;
  /** When true, multiple items can be expanded at the same time. */
  multiple?: boolean;
  /** Content rendered inside — typically AccordionItem components. */
  children?: React.ReactNode;
}
