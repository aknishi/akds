export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type IconColor = 'default' | 'error' | 'warning' | 'success' | 'info';

export const SIZE_MAP: Record<IconSize, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

export const SEMANTIC_ICON_COLORS: readonly IconColor[] = ['default', 'error', 'warning', 'success', 'info'];
