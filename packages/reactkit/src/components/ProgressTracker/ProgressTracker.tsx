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

    const fillWidth =
      totalSteps > 1
        ? `${(Math.max(0, Math.min(activeIndex, totalSteps - 1)) / (totalSteps - 1)) * 100}%`
        : '0%';

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
              '--pt-fill-width': fillWidth,
            } as React.CSSProperties
          }
          {...rest}
        >
          <div className="akds-progress-tracker__track-container" aria-hidden="true">
            <div className="akds-progress-tracker__track" />
            <div className="akds-progress-tracker__fill" />
          </div>
          <ol className="akds-progress-tracker__steps">{styledChildren}</ol>
        </div>
      </ProgressTrackerStepContext.Provider>
    );
  },
);

ProgressTracker.displayName = 'ProgressTracker';
