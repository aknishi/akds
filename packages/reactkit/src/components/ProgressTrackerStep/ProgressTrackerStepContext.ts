import React from 'react';

export interface ProgressTrackerStepContextValue {
  /** 0-based index of the currently active step. */
  activeIndex: number;
  /** Total number of steps in the tracker. */
  totalSteps: number;
}

export const ProgressTrackerStepContext = React.createContext<ProgressTrackerStepContextValue>({
  activeIndex: -1,
  totalSteps: 1,
});
