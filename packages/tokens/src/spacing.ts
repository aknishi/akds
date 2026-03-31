export const spacing = {
  scale: {
    '05': 2,  '01': 4,  '02': 8,  '03': 12, '04': 16,
    '06': 24, '08': 32, '10': 40, '12': 48, '16': 64, '20': 80,
  },
  layout: { xs: 4, sm: 8, md: 16, lg: 24, xl: 40, '2xl': 64 },
  size: {
    icon:      { xs: 12, sm: 16, md: 20, lg: 24, xl: 32 },
    component: { xs: 24, sm: 32, md: 40, lg: 48, xl: 56 },
  },
  radius: {
    none: 0, xs: 2, sm: 4, md: 8, lg: 12, xl: 16, '2xl': 24, full: 9999,
  },
} as const;
