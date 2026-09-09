import React from 'react';
import clsx from 'clsx';
import './ThinkingState.css';
import type { ThinkingStateProps } from './ThinkingState.types';
import { ChevronDownIcon } from '@aknishi/akds-icons';
import { RippleBase } from '../RippleBase';
import type { RippleBaseHandle } from '../RippleBase';
import { makePrefixer } from '../../utils';

const withBaseName = makePrefixer('akds-thinking-state');

const SPINNER_BAR_INDICES = Array.from({ length: 12 }, (_, index) => index);

export const ThinkingState = React.forwardRef<HTMLDivElement, ThinkingStateProps>(
  function ThinkingState(
    {
      label = 'Thinking',
      labels,
      labelInterval = 3000,
      active = true,
      expanded,
      defaultExpanded = false,
      onExpandedChange,
      backgroundColor,
      className,
      style,
      children,
      ...rest
    },
    ref,
  ) {
    const isExpandedControlled = expanded !== undefined;
    const [uncontrolledExpanded, setUncontrolledExpanded] = React.useState(defaultExpanded);
    const isExpanded = isExpandedControlled ? expanded : uncontrolledExpanded;
    const hasPanel = children != null;

    const hasLabelSequence = labels != null && labels.length > 0;
    const [labelIndex, setLabelIndex] = React.useState(0);

    // A new `labels` sequence means a new thinking pass started — restart from the beginning.
    React.useEffect(() => {
      setLabelIndex(0);
    }, [labels]);

    // A single interval (rather than a timeout rescheduled on every
    // `labelIndex` change) keeps ticking on its own clock instead of waiting
    // for a React render to fire in between each step — see StreamingText.
    React.useEffect(() => {
      if (!hasLabelSequence || !active) return;
      const interval = window.setInterval(() => {
        setLabelIndex(index => {
          if (index >= labels!.length - 1) {
            window.clearInterval(interval);
            return index;
          }
          return index + 1;
        });
      }, labelInterval);
      return () => window.clearInterval(interval);
    }, [hasLabelSequence, active, labels, labelInterval]);

    const currentLabel = hasLabelSequence ? labels![labelIndex] : label;

    // Renders the previous label on top of the current one and wipes it away
    // left-to-right (via a shrinking clip-path), revealing the current label
    // underneath as it goes — rather than swapping the whole label at once.
    const prevLabelRef = React.useRef(currentLabel);
    const transitionIdRef = React.useRef(0);
    const [peeling, setPeeling] = React.useState<{ id: number; label: React.ReactNode } | null>(null);

    React.useEffect(() => {
      if (prevLabelRef.current !== currentLabel) {
        transitionIdRef.current += 1;
        setPeeling({ id: transitionIdRef.current, label: prevLabelRef.current });
        prevLabelRef.current = currentLabel;
      }
    }, [currentLabel]);

    const handlePeelEnd = (id: number) => {
      setPeeling(current => (current?.id === id ? null : current));
    };

    const triggerId = React.useId();
    const panelId = React.useId();
    const rippleRef = React.useRef<RippleBaseHandle>(null);

    const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
      rippleRef.current?.trigger(e);
    };

    const handleToggle = () => {
      const next = !isExpanded;
      if (!isExpandedControlled) setUncontrolledExpanded(next);
      onExpandedChange?.(next);
    };

    // Only set when passed — an unset custom property falls back to the
    // token in the CSS var() chain instead of resolving to `undefined`.
    const rootStyle = backgroundColor
      ? ({ ...style, '--akds-thinking-state-background-color': backgroundColor } as React.CSSProperties)
      : style;

    const rootClassName = clsx(
      withBaseName(),
      {
        [withBaseName('active')]: active,
        // The peel/cursor wipe already carries the motion for cycling
        // labels — the shimmer is reserved for a static label sitting still.
        [withBaseName('cycling')]: hasLabelSequence,
        [withBaseName('expandable')]: hasPanel,
        [withBaseName('expanded')]: hasPanel && isExpanded,
      },
      className,
    );

    const indicator = (
      <>
        {/* No loader once finished — `active` doubles as "still thinking". */}
        {active && (
          <span className={withBaseName.el('spinner')} aria-hidden="true">
            {SPINNER_BAR_INDICES.map(index => (
              <span
                key={index}
                className={withBaseName.el('spinner-bar')}
                style={{ '--akds-thinking-state-spinner-bar-index': index } as React.CSSProperties}
              />
            ))}
          </span>
        )}
        <span className={withBaseName.el('label-stack')}>
          <span
            className={clsx(withBaseName.el('label'), {
              // Clips the newly-revealed label to stop exactly at the
              // cursor's left edge instead of always being fully visible
              // underneath — otherwise it would peek through the gap ahead
              // of the cursor. Synchronized to the same duration/easing as
              // the peel and cursor below.
              [withBaseName.el('label') + '--revealing']: peeling != null,
            })}
          >
            {currentLabel}
          </span>
          {peeling != null && (
            <React.Fragment key={peeling.id}>
              <span
                aria-hidden="true"
                className={clsx(withBaseName.el('label'), withBaseName.el('label') + '--peeling')}
                onAnimationEnd={() => handlePeelEnd(peeling.id)}
              >
                {peeling.label}
              </span>
              {/* Tracks the wipe boundary — not a child of the peeling label
                  above, since its own clip-path would clip this away too. */}
              <span aria-hidden="true" className={withBaseName.el('label-cursor')} />
            </React.Fragment>
          )}
        </span>
      </>
    );

    if (!hasPanel) {
      return (
        <div
          ref={ref}
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className={rootClassName}
          style={rootStyle}
          {...rest}
        >
          {indicator}
        </div>
      );
    }

    return (
      <div ref={ref} className={rootClassName} style={rootStyle} {...rest}>
        <button
          id={triggerId}
          type="button"
          aria-expanded={isExpanded}
          aria-controls={panelId}
          className={withBaseName.el('trigger')}
          onClick={handleToggle}
          onPointerDown={handlePointerDown}
        >
          {indicator}
          <span className={withBaseName.el('chevron')} aria-hidden="true">
            <ChevronDownIcon size="sm" />
          </span>
          <RippleBase ref={rippleRef} />
        </button>
        <div
          id={panelId}
          role="region"
          aria-labelledby={triggerId}
          className={withBaseName.el('panel')}
        >
          <div className={withBaseName.el('panel-inner')}>{children}</div>
        </div>
      </div>
    );
  },
);

ThinkingState.displayName = 'ThinkingState';
