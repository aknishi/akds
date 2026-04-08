import React from 'react';
import clsx from 'clsx';
import './ProgressTrackerStep.css';
import type { ProgressTrackerStepProps } from './ProgressTrackerStep.types';
import { ProgressTrackerStepContext } from './ProgressTrackerStepContext';
import { makePrefixer } from '../../utils';

const withBaseName = makePrefixer('akds-progress-tracker-step');

export const ProgressTrackerStep = React.forwardRef<HTMLLIElement, ProgressTrackerStepProps>(
  function ProgressTrackerStep(
    {
      label,
      status = 'inactive',
      active = false,
      _stepIndex = 0,
      className,
      ...rest
    },
    ref,
  ) {
    const ctx = React.useContext(ProgressTrackerStepContext);
    const isActive = active || _stepIndex === ctx.activeIndex;
    const resolvedStatus = isActive ? 'active' : status;

    const showCheck = resolvedStatus === 'complete';
    const showError = resolvedStatus === 'error';
    const showWarning = resolvedStatus === 'warning';
    const showDot = resolvedStatus === 'active';

    return (
      <li
        ref={ref}
        className={clsx(withBaseName(), withBaseName(resolvedStatus), className)}
        aria-current={isActive ? 'step' : undefined}
        {...rest}
      >
        <span className="akds-progress-tracker-step__label">{label}</span>
        {showError && (
          <div className="akds-progress-tracker-step__alert-node" aria-hidden="true">
            <svg
              className="akds-progress-tracker-step__alert-icon"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                fill="currentColor"
                d="m13.299 3.148 8.634 14.954a1.5 1.5 0 0 1-1.299 2.25H3.366a1.5 1.5 0 0 1-1.299-2.25l8.634-14.954c.577-1 2.02-1 2.598 0M12 15a1 1 0 1 0 0 2 1 1 0 0 0 0-2m0-7a1 1 0 0 0-.993.883L11 9v4a1 1 0 0 0 1.993.117L13 13V9a1 1 0 0 0-1-1"
              />
            </svg>
          </div>
        )}
        {showWarning && (
          <div className="akds-progress-tracker-step__alert-node" aria-hidden="true">
            <svg
              className="akds-progress-tracker-step__alert-icon"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                fill="currentColor"
                d="m13.299 3.148 8.634 14.954a1.5 1.5 0 0 1-1.299 2.25H3.366a1.5 1.5 0 0 1-1.299-2.25l8.634-14.954c.577-1 2.02-1 2.598 0M12 4.898 4.232 18.352h15.536zM12 15a1 1 0 1 1 0 2 1 1 0 0 1 0-2m0-7a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0V9a1 1 0 0 1 1-1"
              />
            </svg>
          </div>
        )}
        {!showError && !showWarning && (
          <div className="akds-progress-tracker-step__circle" aria-hidden="true">
            {showCheck && (
              <svg
                className="akds-progress-tracker-step__check-icon"
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden="true"
              >
                <polyline
                  points="1.5,6 4.5,9 10.5,3"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            {showDot && <div className="akds-progress-tracker-step__dot" />}
          </div>
        )}
      </li>
    );
  },
);

ProgressTrackerStep.displayName = 'ProgressTrackerStep';
