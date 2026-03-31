import { primitiveColors as P } from './primitives';

export const semanticColors = {
  background: {
    primary: {
      default:  { light: P.blue[600],    dark: P.blue[500] },
      hover:    { light: P.blue[700],    dark: P.blue[400] },
      active:   { light: P.blue[800],    dark: P.blue[300] },
      disabled: { light: P.neutral[200], dark: P.neutral[700] },
    },
    secondary: {
      default:  { light: P.neutral[100], dark: P.neutral[800] },
      hover:    { light: P.neutral[200], dark: P.neutral[700] },
      active:   { light: P.neutral[300], dark: P.neutral[600] },
      disabled: { light: P.neutral[100], dark: P.neutral[800] },
    },
    error: {
      default: { light: P.red[600],    dark: P.red[500] },
      hover:   { light: P.red[700],    dark: P.red[400] },
    },
    warning: {
      default: { light: P.yellow[500], dark: P.yellow[400] },
      hover:   { light: P.yellow[600], dark: P.yellow[300] },
    },
    success: {
      default: { light: P.green[600],  dark: P.green[500] },
      hover:   { light: P.green[700],  dark: P.green[400] },
    },
    info: {
      default: { light: P.blue[500],   dark: P.blue[400] },
      hover:   { light: P.blue[600],   dark: P.blue[300] },
    },
    neutral: {
      default: { light: P.neutral[100], dark: P.neutral[800] },
      hover:   { light: P.neutral[200], dark: P.neutral[700] },
      subtle:  { light: P.neutral[50],  dark: P.neutral[900] },
    },
  },
  surface: {
    default: { light: P.white,        dark: P.neutral[900] },
    raised:  { light: P.white,        dark: P.neutral[800] },
    overlay: { light: P.white,        dark: P.neutral[800] },
    sunken:  { light: P.neutral[50],  dark: P.neutral[950] },
  },
  text: {
    primary:     { default: { light: P.neutral[900], dark: P.neutral[50]  }, disabled: { light: P.neutral[400], dark: P.neutral[600] } },
    secondary:   { default: { light: P.neutral[600], dark: P.neutral[400] }, disabled: { light: P.neutral[300], dark: P.neutral[700] } },
    error:       { default: { light: P.red[600],     dark: P.red[400]     } },
    warning:     { default: { light: P.yellow[700],  dark: P.yellow[400]  } },
    success:     { default: { light: P.green[700],   dark: P.green[400]   } },
    info:        { default: { light: P.blue[600],    dark: P.blue[400]    } },
    'on-primary':   { default: { light: P.white, dark: P.white } },
    'on-secondary': { default: { light: P.neutral[900], dark: P.neutral[50] } },
    placeholder: { default: { light: P.neutral[400], dark: P.neutral[500] } },
  },
  border: {
    default: {
      default: { light: P.neutral[200], dark: P.neutral[700] },
      hover:   { light: P.neutral[400], dark: P.neutral[500] },
      focus:   { light: P.blue[500],    dark: P.blue[400]    },
    },
    error:   { default: { light: P.red[500],   dark: P.red[400]   } },
    success: { default: { light: P.green[500], dark: P.green[400] } },
    primary: {
      default: { light: P.blue[600], dark: P.blue[500] },
      hover:   { light: P.blue[700], dark: P.blue[400] },
    },
  },
  icon: {
    primary:     { default: { light: P.neutral[900], dark: P.neutral[50]  }, disabled: { light: P.neutral[400], dark: P.neutral[600] } },
    secondary:   { default: { light: P.neutral[500], dark: P.neutral[400] } },
    'on-primary': { default: { light: P.white, dark: P.white } },
  },
  interaction: {
    hover: {
      overlay: { light: 'rgba(0,0,0,0.06)', dark: 'rgba(255,255,255,0.08)' },
    },
    pressed: {
      overlay: { light: 'rgba(0,0,0,0.10)', dark: 'rgba(255,255,255,0.14)' },
    },
  },
} as const;
