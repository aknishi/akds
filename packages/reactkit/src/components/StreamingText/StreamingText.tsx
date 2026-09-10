import React from 'react';
import clsx from 'clsx';
import './StreamingText.css';
import type { StreamingTextProps } from './StreamingText.types';
import { makePrefixer } from '../../utils';

const withBaseName = makePrefixer('akds-streaming-text');

// Groups a run of characters into alternating word/whitespace clusters, each
// tagged with its starting absolute index (for stable React keys as more
// characters get revealed over time). Rendering each word cluster inside its
// own no-wrap wrapper is what actually prevents a word from splitting across
// lines — with every character as its own inline-block span (needed for the
// per-character reveal animation), adjacent spans get their own line-break
// opportunity by default regardless of word-break/overflow-wrap, since those
// properties only govern breaking within a single text run, not between
// separate elements.
function groupCharsIntoWords(chars: string[]) {
  const groups: { start: number; chars: string[]; isWhitespace: boolean }[] = [];
  chars.forEach((char, index) => {
    const isWhitespace = /\s/.test(char);
    const last = groups[groups.length - 1];
    if (last && last.isWhitespace === isWhitespace) {
      last.chars.push(char);
    } else {
      groups.push({ start: index, chars: [char], isWhitespace });
    }
  });
  return groups;
}

export const StreamingText = React.forwardRef<HTMLDivElement, StreamingTextProps>(
  function StreamingText(
    {
      text,
      speed = 30,
      cursor = true,
      onComplete,
      className,
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const chars = React.useMemo(() => Array.from(text), [text]);
    const [revealedCount, setRevealedCount] = React.useState(
      prefersReducedMotion ? chars.length : 0,
    );

    // A new `text` value means a new message started streaming — restart the reveal.
    React.useEffect(() => {
      setRevealedCount(prefersReducedMotion ? chars.length : 0);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [text]);

    // A single interval (rather than a timeout rescheduled from an effect on
    // every `revealedCount` change) keeps ticking on its own clock instead of
    // waiting for a React render to fire in between each character.
    React.useEffect(() => {
      if (prefersReducedMotion || chars.length === 0) return;
      const interval = window.setInterval(() => {
        setRevealedCount(count => {
          if (count >= chars.length - 1) {
            window.clearInterval(interval);
            return chars.length;
          }
          return count + 1;
        });
      }, speed);
      return () => window.clearInterval(interval);
    }, [chars, speed, prefersReducedMotion]);

    const isComplete = revealedCount >= chars.length;

    const onCompleteRef = React.useRef(onComplete);
    onCompleteRef.current = onComplete;
    const wasCompleteRef = React.useRef(isComplete);
    React.useEffect(() => {
      if (isComplete && !wasCompleteRef.current) {
        onCompleteRef.current?.();
      }
      wasCompleteRef.current = isComplete;
    }, [isComplete]);

    return (
      <div ref={ref} className={clsx(withBaseName(), className)} {...rest}>
        <span aria-hidden="true">
          {groupCharsIntoWords(chars.slice(0, revealedCount)).map(group => {
            const charSpans = group.chars.map((char, i) => (
              <span
                key={group.start + i}
                className={clsx(withBaseName.el('char'), {
                  // A whitespace char doesn't need the translateY entrance
                  // (there's no glyph to move) — dropping inline-block for
                  // it specifically lets a trailing space at a line-wrap
                  // point collapse away normally, instead of rendering as a
                  // visible leading space at the start of the next line.
                  [withBaseName.el('char') + '--space']: group.isWhitespace,
                })}
              >
                {char}
              </span>
            ));
            return group.isWhitespace ? (
              <React.Fragment key={group.start}>{charSpans}</React.Fragment>
            ) : (
              <span key={group.start} className={withBaseName.el('word')}>
                {charSpans}
              </span>
            );
          })}
          {cursor && !isComplete && <span className={withBaseName.el('cursor')} />}
        </span>
        {/* Screen readers get the finished message once, rather than a
            per-character stream of live-region announcements. */}
        <span
          className={withBaseName.el('sr-only')}
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {isComplete ? text : ''}
        </span>
      </div>
    );
  },
);

StreamingText.displayName = 'StreamingText';
