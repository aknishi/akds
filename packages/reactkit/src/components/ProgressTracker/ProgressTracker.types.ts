export interface ProgressTrackerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 1-based index of the currently active step. Set to 0 or a negative number
   * to have no active step.
   */
  currentStep?: number;
  /** The ProgressTrackerStep children that make up the steps. */
  children: React.ReactNode;
}
