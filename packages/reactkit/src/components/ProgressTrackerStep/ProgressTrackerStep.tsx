import React from 'react';
import clsx from 'clsx';
import './ProgressTrackerStep.css';
import type { ProgressTrackerStepProps } from './ProgressTrackerStep.types';
import { ProgressTrackerStepContext } from './ProgressTrackerStepContext';
import { CheckCircleFilledIcon, WarningFilledIcon, WarningIcon } from '@aknishi/akds-icons';
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
            <WarningFilledIcon className="akds-progress-tracker-step__alert-icon" />
          </div>
        )}
        {showWarning && (
          <div className="akds-progress-tracker-step__alert-node" aria-hidden="true">
            <WarningIcon className="akds-progress-tracker-step__alert-icon" />
          </div>
        )}
        {!showError && !showWarning && (
          <div className="akds-progress-tracker-step__circle" aria-hidden="true">
            {showCheck && (
              <CheckCircleFilledIcon
                className="akds-progress-tracker-step__check-icon"
                color="success"
              />
            )}
            {showDot && <div className="akds-progress-tracker-step__dot" />}
          </div>
        )}
      </li>
    );
  },
);

ProgressTrackerStep.displayName = 'ProgressTrackerStep';
