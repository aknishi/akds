export interface TabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** The value that identifies this tab. Must match the corresponding TabPanel's value. */
  value: string;
  /** When true, prevents interaction with this tab. */
  disabled?: boolean;
  /** Content rendered inside the tab button. Required — overrides the optional inherited type. */
  children: React.ReactNode;
}
