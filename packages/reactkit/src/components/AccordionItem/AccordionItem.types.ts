export interface AccordionItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** The value that identifies this item. Used by Accordion to track which items are expanded. */
  value: string;
  /** The heading text rendered in the trigger button. */
  title: React.ReactNode;
  /** When true, prevents expanding or collapsing this item. */
  disabled?: boolean;
  /** Content shown when the item is expanded. */
  children?: React.ReactNode;
}
