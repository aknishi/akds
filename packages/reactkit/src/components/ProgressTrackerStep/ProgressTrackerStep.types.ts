export type ProgressTrackerStepStatus = 'complete' | 'inactive' | 'error' | 'warning';

export interface ProgressTrackerStepProps extends Omit<React.LiHTMLAttributes<HTMLLIElement>, 'children'> {
  /** Visible text label shown above the step circle. */
  label: string;
  /** Semantic status of this step. Ignored when the step is active. */
  status?: ProgressTrackerStepStatus;
  /** When true, renders the step in active (in-progress) styling, overriding status. */
  active?: boolean;
  /**
   * @internal Injected by ProgressTracker via React.cloneElement — do not set manually.
   * Zero-based position of this step within the tracker.
   */
  _stepIndex?: number;
}
