export type GenerationLoaderSize = 'sm' | 'md' | 'lg';

export interface GenerationLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Text shown alongside the animated dots, e.g. "Generating response". Omit for a dots-only indicator. */
  label?: React.ReactNode;
  /** Sets the size of the dots and label text. Defaults to `'md'`. */
  size?: GenerationLoaderSize;
}
