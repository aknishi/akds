import { primitiveColors, semanticColors, spacing, typography, elevation, breakpoints } from '@aknishi/akds-tokens';
import type { TokenRow } from '../../components/docs/TokenTable';

function camelToKebab(value: string) {
  return value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

function walkSemanticColors(node: unknown, path: string[], rows: TokenRow[]) {
  if (node && typeof node === 'object' && 'light' in (node as Record<string, unknown>)) {
    const { light } = node as { light: string };
    rows.push({
      name: path.join('.'),
      cssVar: `--akds-color-${path.map(camelToKebab).join('-')}`,
      value: light,
    });
    return;
  }
  for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
    walkSemanticColors(value, [...path, key], rows);
  }
}

export function getSemanticColorRows(): TokenRow[] {
  const rows: TokenRow[] = [];
  walkSemanticColors(semanticColors, [], rows);
  return rows;
}

export function getPrimitiveColorRows(): TokenRow[] {
  const rows: TokenRow[] = [];
  for (const [scale, value] of Object.entries(primitiveColors)) {
    if (typeof value === 'string') {
      rows.push({ name: scale, cssVar: `--akds-primitive-color-${scale}`, value });
      continue;
    }
    for (const [step, hex] of Object.entries(value)) {
      rows.push({ name: `${scale}.${step}`, cssVar: `--akds-primitive-color-${scale}-${step}`, value: hex });
    }
  }
  return rows;
}

export function getSpacingScaleRows(): TokenRow[] {
  return Object.entries(spacing.spacing.scale).map(([key, value]) => ({
    name: `scale.${key}`,
    cssVar: `--akds-spacing-${key}`,
    value: `${value}px`,
  }));
}

export function getSpacingLayoutRows(): TokenRow[] {
  return Object.entries(spacing.spacing.layout).map(([key, value]) => ({
    name: `layout.${key}`,
    cssVar: `--akds-spacing-layout-${key}`,
    value: `${value}px`,
  }));
}

export function getRadiusRows(): TokenRow[] {
  return Object.entries(spacing.radius).map(([key, value]) => ({
    name: key,
    cssVar: `--akds-radius-${key}`,
    value: value === 9999 ? `${value}px (full)` : `${value}px`,
  }));
}

export function getSizeRows(): TokenRow[] {
  return [
    ...Object.entries(spacing.size.icon).map(([key, value]) => ({
      name: `icon.${key}`,
      cssVar: `--akds-size-icon-${key}`,
      value: `${value}px`,
    })),
    ...Object.entries(spacing.size.component).map(([key, value]) => ({
      name: `component.${key}`,
      cssVar: `--akds-size-component-${key}`,
      value: `${value}px`,
    })),
  ];
}

export function getFontFamilyRows(): TokenRow[] {
  return Object.entries(typography.fontFamily).map(([key, value]) => ({
    name: key,
    cssVar: `--akds-font-family-${key}`,
    value,
  }));
}

export function getFontSizeRows(): TokenRow[] {
  return Object.entries(typography.fontSize).map(([key, value]) => ({
    name: key,
    cssVar: `--akds-font-size-${key}`,
    value: `${value}px`,
  }));
}

export function getFontWeightRows(): TokenRow[] {
  return Object.entries(typography.fontWeight).map(([key, value]) => ({
    name: key,
    cssVar: `--akds-font-weight-${key}`,
    value: String(value),
  }));
}

export function getLineHeightRows(): TokenRow[] {
  return Object.entries(typography.lineHeight).map(([key, value]) => ({
    name: key,
    cssVar: `--akds-font-line-height-${key}`,
    value: String(value),
  }));
}

export function getLetterSpacingRows(): TokenRow[] {
  return Object.entries(typography.letterSpacing).map(([key, value]) => ({
    name: key,
    cssVar: `--akds-font-letter-spacing-${key}`,
    value,
  }));
}

export function getElevationRows(): TokenRow[] {
  return Object.entries(elevation).map(([key, value]) => ({
    name: key,
    cssVar: `--akds-elevation-${key}`,
    value,
  }));
}

export function getBreakpointRows(): TokenRow[] {
  return Object.entries(breakpoints).map(([key, value]) => ({
    name: key,
    cssVar: `--akds-breakpoint-${key}`,
    value: `${value}px`,
  }));
}
