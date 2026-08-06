export interface TabPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The value that identifies this panel. Must match the corresponding Tab's value. */
  value: string;
  /** Content rendered inside the panel. */
  children?: React.ReactNode;
}
