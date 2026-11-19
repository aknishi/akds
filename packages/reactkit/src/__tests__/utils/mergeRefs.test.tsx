import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { mergeRefs } from '../../utils/mergeRefs';

describe('mergeRefs', () => {
  it('sets object refs and calls callback refs with the node', () => {
    const objectRef = React.createRef<HTMLDivElement>();
    const callbackRef = vi.fn();
    const { container, unmount } = render(<div ref={mergeRefs(objectRef, callbackRef)} />);
    const node = container.firstChild;
    expect(objectRef.current).toBe(node);
    expect(callbackRef).toHaveBeenCalledWith(node);

    unmount();
    expect(objectRef.current).toBeNull();
    expect(callbackRef).toHaveBeenLastCalledWith(null);
  });

  it('skips undefined and null refs', () => {
    const objectRef = React.createRef<HTMLDivElement>();
    const merged = mergeRefs<HTMLDivElement>(undefined, null, objectRef);
    const node = document.createElement('div');
    expect(() => merged(node)).not.toThrow();
    expect(objectRef.current).toBe(node);
  });
});
