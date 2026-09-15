import React from 'react';
import clsx from 'clsx';
import './ProgressTracker.css';
import type { ProgressTrackerProps } from './ProgressTracker.types';
import { ProgressTrackerStepContext } from '../ProgressTrackerStep/ProgressTrackerStepContext';
import { makePrefixer } from '../../utils';

const withBaseName = makePrefixer('akds-progress-tracker');

export const ProgressTracker = React.forwardRef<HTMLDivElement, ProgressTrackerProps>(
  function ProgressTracker(
    {
      currentStep = 1,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const activeIndex = currentStep - 1;
    const totalSteps = React.Children.count(children);

    const fillScale =
      totalSteps > 1
        ? Math.max(0, Math.min(activeIndex, totalSteps - 1)) / (totalSteps - 1)
        : 0;

    const ctx = React.useMemo(
      () => ({ activeIndex, totalSteps }),
      [activeIndex, totalSteps],
    );

    const styledChildren = React.Children.map(children, (child, index) => {
      if (!React.isValidElement(child)) return child;
      return React.cloneElement(child as React.ReactElement<{ _stepIndex?: number }>, {
        _stepIndex: index,
      });
    });

    return (
      <ProgressTrackerStepContext.Provider value={ctx}>
        <div
          ref={ref}
          className={clsx(withBaseName(), className)}
          style={
            {
              '--pt-step-count': totalSteps,
              '--pt-fill-scale': fillScale,
            } as React.CSSProperties
          }
          {...rest}
        >
          <div className={withBaseName.el('track-container')} aria-hidden="true">
            <div className={withBaseName.el('track')} />
            <div className={withBaseName.el('fill')} />
          </div>
          <ol className={withBaseName.el('steps')}>{styledChildren}</ol>
        </div>
      </ProgressTrackerStepContext.Provider>
    );
  },
);

ProgressTracker.displayName = 'ProgressTracker';
