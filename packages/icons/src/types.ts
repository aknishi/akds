export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type IconColor = 'default' | 'error' | 'warning' | 'success' | 'info';

export const SIZE_MAP: Record<IconSize, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

export const COLOR_MAP: Record<IconColor, string | undefined> = {
  default: undefined,
  error: 'var(--akds-color-icon-error-default)',
  warning: 'var(--akds-color-icon-warning-default)',
  success: 'var(--akds-color-icon-success-default)',
  info: 'var(--akds-color-icon-info-default)',
};