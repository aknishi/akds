import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

// The headless layer must stay UI-agnostic so another design system could
// render it. The repo has no ESLint, so this test enforces the boundary.
const HEADLESS_DIR = join(__dirname, '../../headless');

const FORBIDDEN = [
  /^@aknishi\/akds-reactkit(\/|$)/,
  /^@aknishi\/akds-tokens(\/|$)/,
  /^@aknishi\/akds-icons(\/|$)/,
  /\.css$/,
];

// Matches `import x from 'a'`, `import 'a'`, `export { x } from 'a'`,
// `import('a')`, and `require('a')`.
const SPECIFIER = /(?:\bfrom\s*|\bimport\s*\(?\s*|\brequire\s*\(\s*)['"]([^'"]+)['"]/g;

export function findForbiddenImports(source: string): string[] {
  return [...source.matchAll(SPECIFIER)]
    .map((match) => match[1] ?? '')
    .filter((specifier) => FORBIDDEN.some((pattern) => pattern.test(specifier)));
}

function listSourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return listSourceFiles(path);
    return /\.(ts|tsx)$/.test(name) ? [path] : [];
  });
}

describe('headless boundary', () => {
  it('finds files to check', () => {
    expect(listSourceFiles(HEADLESS_DIR).length).toBeGreaterThan(0);
  });

  it('has no imports of reactkit, tokens, icons, or CSS in src/headless', () => {
    const violations = listSourceFiles(HEADLESS_DIR).flatMap((file) =>
      findForbiddenImports(readFileSync(file, 'utf8')).map(
        (specifier) => `${relative(HEADLESS_DIR, file)} imports '${specifier}'`,
      ),
    );
    expect(violations).toEqual([]);
  });

  describe('findForbiddenImports', () => {
    it('flags every forbidden import form', () => {
      const source = [
        "import { Table } from '@aknishi/akds-reactkit';",
        "import '@aknishi/akds-tokens/css';",
        "export { SearchIcon } from '@aknishi/akds-icons';",
        "import './Card.css';",
        "const icons = await import('@aknishi/akds-icons');",
        "const kit = require('@aknishi/akds-reactkit');",
      ].join('\n');
      expect(findForbiddenImports(source)).toEqual([
        '@aknishi/akds-reactkit',
        '@aknishi/akds-tokens/css',
        '@aknishi/akds-icons',
        './Card.css',
        '@aknishi/akds-icons',
        '@aknishi/akds-reactkit',
      ]);
    });

    it('allows React, TanStack, and relative imports', () => {
      const source = [
        "import React from 'react';",
        "import { useReactTable } from '@tanstack/react-table';",
        "import type { Row } from '@tanstack/react-table';",
        "export { useDataViewCore } from './useDataViewCore.js';",
      ].join('\n');
      expect(findForbiddenImports(source)).toEqual([]);
    });

    it('does not confuse similarly named packages', () => {
      expect(findForbiddenImports("import x from '@aknishi/akds-reactkit-extras';")).toEqual([]);
    });
  });
});
