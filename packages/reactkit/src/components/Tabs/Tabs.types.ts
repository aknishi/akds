export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** The value of the currently active tab. Makes the component controlled. */
  activeTab?: string;
  /** Initial active tab for the uncontrolled case. */
  defaultActiveTab?: string;
  /** Called when the active tab changes. */
  onChange?: (value: string) => void;
  /** Content rendered inside — typically a TabList and one or more TabPanels. */
  children?: React.ReactNode;
}
