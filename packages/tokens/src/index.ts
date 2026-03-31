export { primitiveColors } from './primitives.js';
export { semanticColors } from './semantic.js';
export { spacing } from './spacing.js';
export { typography } from './typography.js';
export { breakpoints } from './breakpoints.js';
export type { Breakpoint } from './breakpoints.js';
export { elevation } from './elevation.js';
export type { ElevationLevel } from './elevation.js';

// CSS variable references — use these in components
export const cssVars = {
  color: {
    background: {
      primary:    { default: 'var(--akds-color-background-primary-default)',    hover: 'var(--akds-color-background-primary-hover)',    active: 'var(--akds-color-background-primary-active)',    disabled: 'var(--akds-color-background-primary-disabled)'   },
      secondary:  { default: 'var(--akds-color-background-secondary-default)',  hover: 'var(--akds-color-background-secondary-hover)',  active: 'var(--akds-color-background-secondary-active)',  disabled: 'var(--akds-color-background-secondary-disabled)' },
      error:      { default: 'var(--akds-color-background-error-default)',      hover: 'var(--akds-color-background-error-hover)'      },
      warning:    { default: 'var(--akds-color-background-warning-default)',    hover: 'var(--akds-color-background-warning-hover)'    },
      success:    { default: 'var(--akds-color-background-success-default)',    hover: 'var(--akds-color-background-success-hover)'    },
      info:       { default: 'var(--akds-color-background-info-default)',       hover: 'var(--akds-color-background-info-hover)'       },
      neutral:    { default: 'var(--akds-color-background-neutral-default)',    hover: 'var(--akds-color-background-neutral-hover)',    subtle: 'var(--akds-color-background-neutral-subtle)'   },
    },
    surface:    { default: 'var(--akds-color-surface-default)', raised: 'var(--akds-color-surface-raised)', overlay: 'var(--akds-color-surface-overlay)', sunken: 'var(--akds-color-surface-sunken)' },
    text: {
      primary:      { default: 'var(--akds-color-text-primary-default)',      disabled: 'var(--akds-color-text-primary-disabled)'      },
      secondary:    { default: 'var(--akds-color-text-secondary-default)',    disabled: 'var(--akds-color-text-secondary-disabled)'    },
      error:        { default: 'var(--akds-color-text-error-default)'        },
      warning:      { default: 'var(--akds-color-text-warning-default)'      },
      success:      { default: 'var(--akds-color-text-success-default)'      },
      info:         { default: 'var(--akds-color-text-info-default)'         },
      onPrimary:    { default: 'var(--akds-color-text-on-primary-default)'   },
      onSecondary:  { default: 'var(--akds-color-text-on-secondary-default)' },
      placeholder:  { default: 'var(--akds-color-text-placeholder-default)'  },
    },
    border: {
      default: { default: 'var(--akds-color-border-default-default)', hover: 'var(--akds-color-border-default-hover)', focus: 'var(--akds-color-border-default-focus)' },
      error:   { default: 'var(--akds-color-border-error-default)'   },
      success: { default: 'var(--akds-color-border-success-default)' },
      primary: { default: 'var(--akds-color-border-primary-default)', hover: 'var(--akds-color-border-primary-hover)' },
    },
    icon: {
      primary:    { default: 'var(--akds-color-icon-primary-default)',    disabled: 'var(--akds-color-icon-primary-disabled)'    },
      secondary:  { default: 'var(--akds-color-icon-secondary-default)'  },
      onPrimary:  { default: 'var(--akds-color-icon-on-primary-default)' },
    },
  },
  spacing: {
    scale:  { '05': 'var(--akds-spacing-scale-05)', '01': 'var(--akds-spacing-scale-01)', '02': 'var(--akds-spacing-scale-02)', '03': 'var(--akds-spacing-scale-03)', '04': 'var(--akds-spacing-scale-04)', '06': 'var(--akds-spacing-scale-06)', '08': 'var(--akds-spacing-scale-08)', '10': 'var(--akds-spacing-scale-10)', '12': 'var(--akds-spacing-scale-12)', '16': 'var(--akds-spacing-scale-16)', '20': 'var(--akds-spacing-scale-20)' },
    layout: { xs: 'var(--akds-spacing-layout-xs)', sm: 'var(--akds-spacing-layout-sm)', md: 'var(--akds-spacing-layout-md)', lg: 'var(--akds-spacing-layout-lg)', xl: 'var(--akds-spacing-layout-xl)', '2xl': 'var(--akds-spacing-layout-2xl)' },
  },
  radius: { none: 'var(--akds-radius-none)', xs: 'var(--akds-radius-xs)', sm: 'var(--akds-radius-sm)', md: 'var(--akds-radius-md)', lg: 'var(--akds-radius-lg)', xl: 'var(--akds-radius-xl)', '2xl': 'var(--akds-radius-2xl)', full: 'var(--akds-radius-full)' },
  fontSize: { '2xs': 'var(--akds-font-size-2xs)', xs: 'var(--akds-font-size-xs)', sm: 'var(--akds-font-size-sm)', md: 'var(--akds-font-size-md)', lg: 'var(--akds-font-size-lg)', xl: 'var(--akds-font-size-xl)', '2xl': 'var(--akds-font-size-2xl)', '3xl': 'var(--akds-font-size-3xl)', '4xl': 'var(--akds-font-size-4xl)', '5xl': 'var(--akds-font-size-5xl)', '6xl': 'var(--akds-font-size-6xl)' },
  elevation: { none: 'var(--akds-elevation-none)', xs: 'var(--akds-elevation-xs)', sm: 'var(--akds-elevation-sm)', md: 'var(--akds-elevation-md)', lg: 'var(--akds-elevation-lg)', xl: 'var(--akds-elevation-xl)', '2xl': 'var(--akds-elevation-2xl)' },
  interaction: {
    hover:    { overlay: 'var(--akds-color-interaction-hover-overlay)'    },
    pressed:  { overlay: 'var(--akds-color-interaction-pressed-overlay)'  },
  },
} as const;
