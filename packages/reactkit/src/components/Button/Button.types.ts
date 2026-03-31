export type ButtonAppearance = 'solid' | 'transparent' | 'bordered';
export type ButtonSentiment = 'accented' | 'neutral' | 'success' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  appearance?: ButtonAppearance;
  sentiment?: ButtonSentiment;
  size?: ButtonSize;
  loading?: boolean;
  children: React.ReactNode;
}
