#!/usr/bin/env tsx
/**
 * Fetches design tokens from the Figma Variables API and regenerates source
 * files in packages/tokens/src/.
 *
 * Regenerates:
 *   src/primitives.ts, src/semantic.ts, src/spacing.ts,
 *   src/typography.ts, src/breakpoints.ts, src/css/tokens.css
 *
 * Does NOT regenerate (these are stable or not in the Variables API):
 *   src/elevation.ts   — Figma effect styles are not exposed via Variables API
 *   src/index.ts       — hand-maintained exports + cssVars map
 *
 * Usage:
 *   npm run build:tokens                  (from packages/tokens)
 *
 * Environment variables (put them in packages/tokens/.env):
 *   FIGMA_TOKEN     — required: personal access token from figma.com/settings
 *   FIGMA_FILE_KEY  — optional: defaults to the akds Figma file
 */
import 'dotenv/config';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(__dirname, '../src');

const FILE_KEY = process.env.FIGMA_FILE_KEY;
const TOKEN    = process.env.FIGMA_TOKEN;

if (!TOKEN) {
  console.error('Error: FIGMA_TOKEN is required.');
  process.exit(1);
}

// ─── Figma Variables API types ───────────────────────────────────────────────

interface FigmaRGBA  { r: number; g: number; b: number; a: number; }
interface FigmaAlias { type: 'VARIABLE_ALIAS'; id: string; }
type      FigmaValue = FigmaRGBA | FigmaAlias | number | string | boolean;

interface FigmaVariable {
  id:                   string;
  name:                 string;
  resolvedType:         'COLOR' | 'FLOAT' | 'STRING' | 'BOOLEAN';
  variableCollectionId: string;
  valuesByMode:         Record<string, FigmaValue>;
  codeSyntax?:          { WEB?: string; ANDROID?: string; iOS?: string };
}

interface FigmaCollection {
  id:            string;
  name:          string;
  modes:         Array<{ modeId: string; name: string }>;
  defaultModeId: string;
  variableIds:   string[];
}

// ─── Value helpers ───────────────────────────────────────────────────────────

const isAlias = (v: FigmaValue): v is FigmaAlias =>
  typeof v === 'object' && v !== null && (v as FigmaAlias).type === 'VARIABLE_ALIAS';

const isColor = (v: FigmaValue): v is FigmaRGBA =>
  typeof v === 'object' && v !== null && 'r' in (v as object);

function toHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b]
    .map(c => Math.round(c * 255).toString(16).padStart(2, '0').toUpperCase())
    .join('');
}

function colorToStr(c: FigmaRGBA): string {
  if (c.a < 0.9999) {
    const [r, g, b] = [c.r, c.g, c.b].map(x => Math.round(x * 255));
    return `rgba(${r},${g},${b},${c.a})`;
  }
  return toHex(c.r, c.g, c.b);
}

/** Follow VARIABLE_ALIAS chain, always using the target collection's defaultModeId. */
function resolveAlias(
  value: FigmaValue,
  vars:  Map<string, FigmaVariable>,
  cols:  Map<string, FigmaCollection>,
  depth = 0,
): Exclude<FigmaValue, FigmaAlias> {
  if (depth > 20) throw new Error(`Alias chain too deep (circular?) — stopped at depth ${depth}`);
  if (!isAlias(value)) return value as Exclude<FigmaValue, FigmaAlias>;
  const target = vars.get(value.id);
  if (!target) throw new Error(`Unresolved alias id: ${value.id}`);
  const col = cols.get(target.variableCollectionId)!;
  return resolveAlias(target.valuesByMode[col.defaultModeId], vars, cols, depth + 1);
}

/** Resolve a variable's value in a specific mode to a scalar string/number. */
function scalarForMode(
  variable: FigmaVariable,
  modeId:   string,
  vars:     Map<string, FigmaVariable>,
  cols:     Map<string, FigmaCollection>,
): string | number {
  const raw      = variable.valuesByMode[modeId];
  if (!raw) throw new Error(`No value in mode "${modeId}" for variable "${variable.name}"`);
  const resolved = resolveAlias(raw, vars, cols);
  if (isColor(resolved)) return colorToStr(resolved);
  return resolved as string | number;
}

/** Resolve using the variable's own collection's defaultModeId. */
function scalarDefault(
  variable: FigmaVariable,
  vars:     Map<string, FigmaVariable>,
  cols:     Map<string, FigmaCollection>,
): string | number {
  const col = cols.get(variable.variableCollectionId)!;
  return scalarForMode(variable, col.defaultModeId, vars, cols);
}

// ─── Nested object builder ───────────────────────────────────────────────────

function setPath(obj: Record<string, unknown>, parts: string[], value: unknown) {
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const k = parts[i];
    if (typeof cur[k] !== 'object' || cur[k] === null) cur[k] = {};
    cur = cur[k] as Record<string, unknown>;
  }
  cur[parts[parts.length - 1]] = value;
}

/** Strip a leading path segment equal to the collection name (lowercase). */
function normalizePath(varName: string, collectionName: string): string[] {
  const prefix = collectionName.toLowerCase() + '/';
  const name   = varName.toLowerCase().startsWith(prefix) ? varName.slice(prefix.length) : varName;
  return name.split('/');
}

// ─── TypeScript code serializer ──────────────────────────────────────────────

/**
 * Serialize a nested object as a TypeScript object literal.
 * - Strings are single-quoted
 * - Numbers are unquoted
 * - Keys that need quoting (hyphens, reserved words, etc.) are single-quoted
 */
function tsLiteral(v: unknown, depth = 0): string {
  if (typeof v === 'string') return `'${v.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
  if (typeof v === 'number') return String(v);
  if (typeof v !== 'object' || v === null) return JSON.stringify(v);

  const entries = Object.entries(v as Record<string, unknown>);
  if (!entries.length) return '{}';

  const pad  = '  '.repeat(depth + 1);
  const cPad = '  '.repeat(depth);

  const lines = entries.map(([k, val]) => {
    const key = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) || /^\d+$/.test(k) ? k : `'${k}'`;
    return `${pad}${key}: ${tsLiteral(val, depth + 1)},`;
  });

  return `{\n${lines.join('\n')}\n${cPad}}`;
}

const AUTO_HEADER = (extraNote = '') =>
  `// Auto-generated by scripts/fetch-tokens.ts — DO NOT EDIT MANUALLY\n` +
  `// Source of truth: Figma file ${FILE_KEY}\n` +
  `// Regenerate with: npm run build:tokens  (from packages/tokens)\n` +
  (extraNote ? `// ${extraNote}\n` : '') +
  `\n`;

// ─── Fetch ───────────────────────────────────────────────────────────────────

async function fetchVariables(): Promise<{
  vars: Map<string, FigmaVariable>;
  cols: Map<string, FigmaCollection>;
}> {
  console.log(`Fetching variables from Figma (file: ${FILE_KEY})…`);

  const res = await fetch(
    `https://api.figma.com/v1/files/${FILE_KEY}/variables/local`,
    { headers: { 'X-Figma-Token': TOKEN! } },
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Figma API ${res.status}: ${body}`);
  }

  const data = await res.json() as {
    meta: {
      variables:           Record<string, FigmaVariable>;
      variableCollections: Record<string, FigmaCollection>;
    };
  };

  return {
    vars: new Map(Object.entries(data.meta.variables)),
    cols: new Map(Object.entries(data.meta.variableCollections)),
  };
}

// ─── CSS var name helper ─────────────────────────────────────────────────────

/**
 * Get the CSS custom property name for a variable.
 * Uses codeSyntax.WEB if set in Figma (most reliable), otherwise derives from path.
 */
function cssVarName(v: FigmaVariable): string {
  if (v.codeSyntax?.WEB) {
    const m = v.codeSyntax.WEB.match(/^var\((--[^)]+)\)$/);
    if (m) return m[1];
  }
  // Fallback: prefix with --akds- and join path with hyphens
  return '--akds-' + v.name.toLowerCase().replace(/\//g, '-').replace(/[^a-z0-9-]/g, '-');
}

/** Determine the CSS value string for a given variable and scalar. */
function toCssValue(v: FigmaVariable, scalar: string | number): string {
  if (typeof scalar !== 'number') return String(scalar);
  const n = v.name.toLowerCase();
  if (n.includes('letter-spacing')) return `${scalar}em`;
  if (n.includes('line-height'))    return String(scalar);      // unitless ratio
  if (n.includes('font-weight'))    return String(scalar);      // unitless weight
  return `${scalar}px`;                                         // everything else
}

// ─── File generators ─────────────────────────────────────────────────────────

function genPrimitives(
  primitiveVars: FigmaVariable[],
  vars:          Map<string, FigmaVariable>,
  cols:          Map<string, FigmaCollection>,
): string {
  const obj: Record<string, unknown> = {};

  for (const v of primitiveVars) {
    const value = scalarDefault(v, vars, cols);
    setPath(obj, v.name.split('/'), value);
  }

  return (
    AUTO_HEADER() +
    `export const primitiveColors = ${tsLiteral(obj)} as const;\n\n` +
    `export type PrimitiveColorScale = keyof typeof primitiveColors;\n`
  );
}

function genSemantic(
  colorVars: FigmaVariable[],
  vars:      Map<string, FigmaVariable>,
  cols:      Map<string, FigmaCollection>,
): string | null {
  if (!colorVars.length) {
    console.warn('  Warning: no variables found in Color collection — skipping semantic.ts');
    return null;
  }

  const col       = cols.get(colorVars[0].variableCollectionId)!;
  const lightMode = col.modes.find(m => m.name === 'Light');
  const darkMode  = col.modes.find(m => m.name === 'Dark');

  if (!lightMode || !darkMode) {
    console.warn('  Warning: Light/Dark modes not found in Color collection — skipping semantic.ts');
    return null;
  }

  const obj: Record<string, unknown> = {};

  for (const v of colorVars) {
    // Variable names start with "color/" — strip that and split into path parts
    const parts = normalizePath(v.name, 'Color');
    const light  = scalarForMode(v, lightMode.modeId, vars, cols) as string;
    const dark   = scalarForMode(v, darkMode.modeId,  vars, cols) as string;
    setPath(obj, parts, { light, dark });
  }

  return AUTO_HEADER() + `export const semanticColors = ${tsLiteral(obj)} as const;\n`;
}

function genSpacing(
  spacingVars: FigmaVariable[],
  vars:        Map<string, FigmaVariable>,
  cols:        Map<string, FigmaCollection>,
): string {
  const obj: Record<string, unknown> = {};

  for (const v of spacingVars) {
    const value = scalarDefault(v, vars, cols);
    // Strip "spacing/" prefix from vars that have it (e.g. spacing/scale/05 → scale/05)
    // Other vars (size/icon/xs, radius/none) are kept as-is
    const parts = normalizePath(v.name, 'Spacing');
    setPath(obj, parts, value);
  }

  return AUTO_HEADER() + `export const spacing = ${tsLiteral(obj)} as const;\n`;
}

function genTypography(
  typoVars: FigmaVariable[],
  vars:     Map<string, FigmaVariable>,
  cols:     Map<string, FigmaCollection>,
): string {
  const obj: Record<string, unknown> = {};

  for (const v of typoVars) {
    const value = scalarDefault(v, vars, cols);
    // Strip "typography/" prefix if present
    const parts = normalizePath(v.name, 'Typography');
    // camelCase the first segment only (font-size → fontSize, line-height → lineHeight, etc.)
    const mapped = [
      parts[0].replace(/-([a-z])/g, (_, c: string) => c.toUpperCase()),
      ...parts.slice(1),
    ];
    setPath(obj, mapped, value);
  }

  return AUTO_HEADER() + `export const typography = ${tsLiteral(obj)} as const;\n`;
}

function genBreakpoints(
  bpVars: FigmaVariable[],
  vars:   Map<string, FigmaVariable>,
  cols:   Map<string, FigmaCollection>,
): string {
  const obj: Record<string, unknown> = {};

  for (const v of bpVars) {
    const value = scalarDefault(v, vars, cols);
    // Strip "breakpoints/" prefix (breakpoints/xs → xs)
    const parts = normalizePath(v.name, 'Breakpoints');
    setPath(obj, parts, value);
  }

  return (
    AUTO_HEADER() +
    `export const breakpoints = ${tsLiteral(obj)} as const;\n\n` +
    `export type Breakpoint = keyof typeof breakpoints;\n`
  );
}

// ─── CSS generator ───────────────────────────────────────────────────────────

// Elevation is hardcoded — Figma effect styles are not exposed via the Variables API
const ELEVATION_CSS_BLOCK = `
  /* ─── Elevation ──────────────────────────────────────────────────────── */
  --akds-elevation-none: none;
  --akds-elevation-xs:   0 1px 2px rgba(0,0,0,0.05);
  --akds-elevation-sm:   0 1px 3px rgba(0,0,0,0.10), 0 1px 2px rgba(0,0,0,0.06);
  --akds-elevation-md:   0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06);
  --akds-elevation-lg:   0 10px 15px rgba(0,0,0,0.10), 0 4px 6px rgba(0,0,0,0.05);
  --akds-elevation-xl:   0 20px 25px rgba(0,0,0,0.10), 0 10px 10px rgba(0,0,0,0.04);
  --akds-elevation-2xl:  0 25px 50px rgba(0,0,0,0.25);`;

function genCSS(
  allVars:    Map<string, FigmaVariable>,
  cols:       Map<string, FigmaCollection>,
  byColName:  Map<string, FigmaVariable[]>,
): string {
  const colorVars = byColName.get('Color') ?? [];

  // Resolve Light/Dark mode IDs for semantic colors
  let lightModeId = '';
  let darkModeId  = '';
  if (colorVars.length) {
    const col   = cols.get(colorVars[0].variableCollectionId)!;
    lightModeId = col.modes.find(m => m.name === 'Light')?.modeId ?? '';
    darkModeId  = col.modes.find(m => m.name === 'Dark')?.modeId  ?? '';
  }

  // ── :root ────────────────────────────────────────────────────────────────
  const rootLines: string[] = [];

  // Primitives
  const primVars = byColName.get('Primitives') ?? [];
  if (primVars.length) {
    rootLines.push('  /* ─── Primitives ──────────────────────────────────────────── */');
    for (const v of primVars) {
      const val = scalarDefault(v, allVars, cols);
      rootLines.push(`  ${cssVarName(v)}: ${val};`);
    }
  }

  // Spacing
  const spacingVars = byColName.get('Spacing') ?? [];
  if (spacingVars.length) {
    rootLines.push('\n  /* ─── Spacing ──────────────────────────────────────────────── */');
    for (const v of spacingVars) {
      const val     = scalarDefault(v, allVars, cols);
      const cssVal  = toCssValue(v, val);
      rootLines.push(`  ${cssVarName(v)}: ${cssVal};`);
    }
  }

  // Typography
  const typoVars = byColName.get('Typography') ?? [];
  if (typoVars.length) {
    rootLines.push('\n  /* ─── Typography ───────────────────────────────────────────── */');
    for (const v of typoVars) {
      const val    = scalarDefault(v, allVars, cols);
      const cssVal = toCssValue(v, val);
      rootLines.push(`  ${cssVarName(v)}: ${cssVal};`);
    }
  }

  // Breakpoints
  const bpVars = byColName.get('Breakpoints') ?? [];
  if (bpVars.length) {
    rootLines.push('\n  /* ─── Breakpoints ──────────────────────────────────────────── */');
    for (const v of bpVars) {
      const val = scalarDefault(v, allVars, cols);
      rootLines.push(`  ${cssVarName(v)}: ${val}px;`);
    }
  }

  // Elevation (hardcoded)
  rootLines.push(ELEVATION_CSS_BLOCK);

  // Semantic colors — Light mode
  if (colorVars.length && lightModeId) {
    rootLines.push('\n  /* ─── Semantic colors — Light mode ─────────────────────────── */');
    for (const v of colorVars) {
      const val = scalarForMode(v, lightModeId, allVars, cols);
      rootLines.push(`  ${cssVarName(v)}: ${val};`);
    }
  }

  // ── Dark mode overrides ──────────────────────────────────────────────────
  const darkLines: string[] = [];
  if (colorVars.length && darkModeId) {
    for (const v of colorVars) {
      const val = scalarForMode(v, darkModeId, allVars, cols);
      darkLines.push(`  ${cssVarName(v)}: ${val};`);
    }
  }

  // ── Assemble ─────────────────────────────────────────────────────────────
  const hdr =
    `/* Auto-generated by scripts/fetch-tokens.ts — DO NOT EDIT MANUALLY */\n` +
    `/* Source: Figma file ${FILE_KEY} — run \`npm run build:tokens\` to regenerate */\n`;

  let css = `${hdr}\n:root {\n${rootLines.join('\n')}\n}\n`;

  if (darkLines.length) {
    css +=
      `\n/* ─── Dark mode — explicit attribute ────────────────────────────── */\n` +
      `[data-theme="dark"] {\n${darkLines.join('\n')}\n}\n` +
      `\n/* ─── Dark mode — OS preference (respects explicit light override) */\n` +
      `@media (prefers-color-scheme: dark) {\n` +
      `  :root:not([data-theme="light"]) {\n` +
      `${darkLines.map(l => '  ' + l).join('\n')}\n` +
      `  }\n}\n`;
  }

  return css;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const { vars, cols } = await fetchVariables();
  console.log(`  Found ${vars.size} variables across ${cols.size} collections`);

  // Group variables by collection name for easy access
  const byColName = new Map<string, FigmaVariable[]>();
  for (const col of cols.values()) byColName.set(col.name, []);
  for (const v of vars.values()) {
    const col = cols.get(v.variableCollectionId);
    if (col) byColName.get(col.name)?.push(v);
  }

  const files: Array<{ filePath: string; content: string | null; label: string }> = [
    {
      filePath: path.join(SRC, 'primitives.ts'),
      content:  genPrimitives(byColName.get('Primitives') ?? [], vars, cols),
      label:    'src/primitives.ts',
    },
    {
      filePath: path.join(SRC, 'semantic.ts'),
      content:  genSemantic(byColName.get('Color') ?? [], vars, cols),
      label:    'src/semantic.ts',
    },
    {
      filePath: path.join(SRC, 'spacing.ts'),
      content:  genSpacing(byColName.get('Spacing') ?? [], vars, cols),
      label:    'src/spacing.ts',
    },
    {
      filePath: path.join(SRC, 'typography.ts'),
      content:  genTypography(byColName.get('Typography') ?? [], vars, cols),
      label:    'src/typography.ts',
    },
    {
      filePath: path.join(SRC, 'breakpoints.ts'),
      content:  genBreakpoints(byColName.get('Breakpoints') ?? [], vars, cols),
      label:    'src/breakpoints.ts',
    },
    {
      filePath: path.join(SRC, 'css/tokens.css'),
      content:  genCSS(vars, cols, byColName),
      label:    'src/css/tokens.css',
    },
  ];

  let skipped = 0;
  for (const { filePath, content, label } of files) {
    if (content === null) {
      console.log(`  ⚠  Skipped ${label}`);
      skipped++;
      continue;
    }
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  ✓  ${label}`);
  }

  if (skipped === 0) {
    console.log('\nAll token files updated. Run `npm run build` to rebuild the package.');
  } else {
    console.log(`\n${files.length - skipped}/${files.length} files updated (${skipped} skipped).`);
    console.log('Check warnings above for details.');
  }
}

main().catch(err => {
  console.error('\nfetch-tokens failed:', (err as Error).message ?? err);
  process.exit(1);
});
