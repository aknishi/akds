import { describe, it, expect } from 'vitest';
import { makePrefixer } from '../../utils/makePrefixer';

describe('makePrefixer', () => {
  const withBaseName = makePrefixer('akds-dataview-card');

  it('returns the root class with no argument', () => {
    expect(withBaseName()).toBe('akds-dataview-card');
  });

  it('builds BEM modifiers with --', () => {
    expect(withBaseName('selected')).toBe('akds-dataview-card--selected');
  });

  it('builds BEM elements with __', () => {
    expect(withBaseName.el('body')).toBe('akds-dataview-card__body');
  });
});
