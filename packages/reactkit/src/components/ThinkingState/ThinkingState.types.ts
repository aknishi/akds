export interface ThinkingStateProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Text shown next to the icon. Defaults to `'Thinking'`. Ignored when `labels` is set. */
  label?: React.ReactNode;
  /**
   * A sequence of labels to cycle through automatically, e.g.
   * `['Thinking', 'Analyzing your request', 'Forming a response']`. Advances
   * one step every `labelInterval` ms while `active`, and holds on the last
   * item rather than looping back to the first. Overrides `label`.
   */
  labels?: React.ReactNode[];
  /** Milliseconds between each label in `labels`. Defaults to `3000` — kept at a minimum of a few seconds so the shine animation has time to play before the label changes. */
  labelInterval?: number;
  /** When true, plays the thinking pulse/shimmer animation and advances `labels`. Set to false once reasoning has finished. Defaults to `true`. */
  active?: boolean;
  /** Reasoning content revealed when expanded. Omit to render a non-expandable indicator with no disclosure trigger. */
  children?: React.ReactNode;
  /** Controls whether the reasoning panel is expanded. Uncontrolled by default. */
  expanded?: boolean;
  /** Initial expanded state when uncontrolled. Defaults to `false`. */
  defaultExpanded?: boolean;
  /** Called with the next expanded value when the trigger is clicked. */
  onExpandedChange?: (expanded: boolean) => void;
  /**
   * Background color used behind the wipe transition's cover and post-cursor
   * gap, as any CSS color value. Defaults to `var(--akds-color-surface-sunken)`.
   * Override this when the component sits on a backdrop that token doesn't
   * match (e.g. a custom-colored card or panel) — otherwise the transition
   * briefly shows a visible seam against the real background.
   */
  backgroundColor?: string;
}
