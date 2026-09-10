export interface StreamingTextProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The full text content to reveal progressively, one character at a time. */
  text: string;
  /** Milliseconds between each revealed character. Defaults to `30`. */
  speed?: number;
  /** When true, shows a blinking cursor while the text is still streaming. Defaults to `true`. */
  cursor?: boolean;
  /** Called once the full text has been revealed. */
  onComplete?: () => void;
}
