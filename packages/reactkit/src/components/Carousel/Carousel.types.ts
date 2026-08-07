export type CarouselScrollDirection = 'forward' | 'backward';

export interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Each direct child is treated as a slide. Required. */
  children: React.ReactNode;
  /**
   * Number of slides visible simultaneously. When set, slides resize with the
   * container width so the carousel is always exactly full-width. When omitted,
   * slides use their natural size and the track clips at the container boundary.
   */
  slidesPerPage?: number;
  /** Enables continuous auto-scrolling. Defaults to `true`. */
  autoScroll?: boolean;
  /** Milliseconds between auto-scroll steps. Defaults to `3000`. */
  autoScrollInterval?: number;
  /** Direction of auto-scroll travel. Defaults to `'forward'`. */
  autoScrollDirection?: CarouselScrollDirection;
  /**
   * When `true`, wraps from the last slide back to the first (and vice versa
   * for `'backward'` direction). Enables seamless infinite looping.
   * Defaults to `false`.
   */
  loop?: boolean;
  /**
   * When `true`, hides the previous and next navigation buttons.
   * The buttons remain in the DOM but are not rendered.
   * Defaults to `false`.
   */
  hideButtons?: boolean;
}
