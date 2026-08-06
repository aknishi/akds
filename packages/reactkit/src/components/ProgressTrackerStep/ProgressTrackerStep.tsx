import React from 'react';
import clsx from 'clsx';
import './ProgressTrackerStep.css';
import type { ProgressTrackerStepProps } from './ProgressTrackerStep.types';
import { ProgressTrackerStepContext } from './ProgressTrackerStepContext';
import { ParticleBurst } from '../ParticleBurst';
import type { ParticleBurstHandle } from '../ParticleBurst';
import { CheckCircleFilledIcon, WarningFilledIcon, WarningIcon } from '@aknishi/akds-icons';
import { makePrefixer } from '../../utils';

const withBaseName = makePrefixer('akds-progress-tracker-step');

export const ProgressTrackerStep = React.forwardRef<HTMLLIElement, ProgressTrackerStepProps>(
  function ProgressTrackerStep(
    {
      label,
      status = 'inactive',
      active = false,
      celebrateOnComplete = false,
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

    const particleBurstRef = React.useRef<ParticleBurstHandle>(null);
    const prevStatusRef = React.useRef(resolvedStatus);
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    React.useEffect(() => {
      if (celebrateOnComplete && resolvedStatus === 'complete' && prevStatusRef.current !== 'complete') {
        particleBurstRef.current?.trigger();
      }
      prevStatusRef.current = resolvedStatus;
    }, [celebrateOnComplete, resolvedStatus]);

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
            {showCheck && celebrateOnComplete && !prefersReducedMotion && (
              <ParticleBurst
                ref={particleBurstRef}
                color="var(--akds-color-background-success-default)"
                spacingFromCenter="10px"
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
