import React from 'react';
import clsx from 'clsx';
import './Carousel.css';
import type { CarouselProps } from './Carousel.types';
import { makePrefixer } from '../../utils';
import { RippleBase } from '../RippleBase';
import type { RippleBaseHandle } from '../RippleBase';
import { ChevronLeftIcon, ChevronRightIcon } from '@aknishi/akds-icons';

const withBaseName = makePrefixer('akds-carousel');

export const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  function Carousel(
    {
      children,
      slidesPerPage,
      autoScroll = true,
      autoScrollInterval = 3000,
      autoScrollDirection = 'forward',
      loop = false,
      hideButtons = false,
      className,
      onMouseEnter,
      onMouseLeave,
      onFocus,
      onBlur,
      onKeyDown,
      'aria-label': ariaLabel = 'Carousel',
      ...rest
    },
    ref,
  ) {
    const slides = React.useMemo(() => React.Children.toArray(children), [children]);
    const N = slides.length;

    // For seamless continuous loop, two copies are sufficient.
    // When the offset reaches one full set width we wrap back to 0 — the
    // positions are visually identical so the reset is invisible.
    const displayedSlides = React.useMemo(
      () => (loop && N > 0 ? [...slides, ...slides, ...slides] : slides),
      [slides, loop, N],
    );

    // DOM refs
    const rootRef = React.useRef<HTMLDivElement>(null);
    const trackRef = React.useRef<HTMLDivElement>(null);
    const prevRippleRef = React.useRef<RippleBaseHandle>(null);
    const nextRippleRef = React.useRef<RippleBaseHandle>(null);

    // Scroll position — pixel offset that is the single source of truth.
    // Updated directly in rAF; never stored in React state to avoid re-render
    // overhead at 60 fps.
    const currentOffsetRef = React.useRef(0);
    const rafRef = React.useRef(0);
    const lastTimestampRef = React.useRef(0);

    // Layout measurements (updated by updateLayout, read in rAF/navigate)
    const slideStepRef = React.useRef(0);   // slide width + gap
    const oneSetWidthRef = React.useRef(0); // total width of N slides (loop wrap point)
    const maxOffsetRef = React.useRef(0);   // clamp ceiling for non-loop mode
    const speedRef = React.useRef(0);       // px / ms derived from slideStep / interval
    const btnInsetRef = React.useRef(0);    // buttonWidth + gap — extra offset for first forward nav

    // Stable refs for props read inside rAF (avoids stale closures)
    const isPausedRef = React.useRef(false);
    const loopRef = React.useRef(loop);
    const autoScrollDirectionRef = React.useRef(autoScrollDirection);
    React.useEffect(() => { loopRef.current = loop; }, [loop]);
    React.useEffect(() => { autoScrollDirectionRef.current = autoScrollDirection; }, [autoScrollDirection]);

    // React state — drives only UI re-renders (button disabled states)
    const currentSlideIndexRef = React.useRef(0);
    const [canPrev, setCanPrev] = React.useState(loop);
    const [canNext, setCanNext] = React.useState(N > 1 || loop);
    const canPrevRef = React.useRef(loop);
    const canNextRef = React.useRef(N > 1 || loop);

    // ── DOM helpers ─────────────────────────────────────────────────────────

    function applyTransform(offset: number) {
      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(${-offset}px)`;
      }
    }

    // Keep offset in the middle copy [w, 2w) so both copies 1 and 3 serve as
    // off-screen buffers, preventing empty space on either side of the viewport.
    function wrapOffset(offset: number): number {
      const w = oneSetWidthRef.current;
      if (w === 0) return offset;
      return w + ((offset - w) % w + w) % w;
    }

    function updateBoundaryState(offset: number) {
      if (loopRef.current) return;
      const newCanPrev = offset > 0;
      const newCanNext = offset < maxOffsetRef.current;
      if (newCanPrev !== canPrevRef.current) {
        canPrevRef.current = newCanPrev;
        setCanPrev(newCanPrev);
      }
      if (newCanNext !== canNextRef.current) {
        canNextRef.current = newCanNext;
        setCanNext(newCanNext);
      }
    }

    // ── Layout ───────────────────────────────────────────────────────────────

    function updateLayout() {
      const root = rootRef.current;
      const track = trackRef.current;
      if (!root || !track) return;

      const vw = root.getBoundingClientRect().width;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;

      // buttonWidth (--akds-spacing-500) + slide gap (--akds-spacing-200)
      const cs = getComputedStyle(root);
      const btnWidth = parseFloat(cs.getPropertyValue('--akds-spacing-500').trim()) || 40;
      btnInsetRef.current = btnWidth + gap;

      if (slidesPerPage && slidesPerPage > 0) {
        const sw = (vw - gap * (slidesPerPage - 1)) / slidesPerPage;
        root.style.setProperty('--akds-carousel-slide-width', `${sw}px`);
        slideStepRef.current = sw + gap;
      } else {
        const firstSlide = track.children[0] as HTMLElement | undefined;
        slideStepRef.current = firstSlide
          ? firstSlide.getBoundingClientRect().width + gap
          : 0;
      }

      const step = slideStepRef.current;
      oneSetWidthRef.current = step * N;
      // Stop when the last slide's right edge aligns with the viewport right edge:
      // offset = (step × N − gap) − vw  =  totalTrackWidth − viewportWidth
      maxOffsetRef.current = Math.max(0, step * N - gap - vw);
      speedRef.current = step > 0 && autoScrollInterval > 0 ? step / autoScrollInterval : 0;
    }

    React.useLayoutEffect(() => {
      const root = rootRef.current;
      if (!root) return;

      const ro = new ResizeObserver(() => {
        updateLayout();
        const wrapped = loopRef.current
          ? wrapOffset(currentOffsetRef.current)
          : Math.max(0, Math.min(currentOffsetRef.current, maxOffsetRef.current));
        currentOffsetRef.current = wrapped;
        applyTransform(wrapped);
        updateBoundaryState(wrapped);
      });

      ro.observe(root);
      updateLayout();
      const initOffset = loopRef.current ? oneSetWidthRef.current : 0;
      currentOffsetRef.current = initOffset;
      applyTransform(initOffset);
      updateBoundaryState(initOffset);

      return () => ro.disconnect();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slidesPerPage]);

    // Reset position when slide set or loop mode changes
    React.useLayoutEffect(() => {
      updateLayout();
      const startOffset = loop && N > 0 ? oneSetWidthRef.current : 0;
      currentOffsetRef.current = startOffset;
      currentSlideIndexRef.current = 0;
      applyTransform(startOffset);
      setCanPrev(loop);
      setCanNext(N > 1 || loop);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [N, loop]);

    React.useEffect(() => {
      const step = slideStepRef.current;
      speedRef.current = step > 0 && autoScrollInterval > 0 ? step / autoScrollInterval : 0;
    }, [autoScrollInterval]);

    // ── Continuous scroll (rAF) ──────────────────────────────────────────────

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    React.useEffect(() => {
      if (!autoScroll || N === 0 || prefersReducedMotion) return;

      function tick(timestamp: number) {
        if (!lastTimestampRef.current) lastTimestampRef.current = timestamp;
        // Cap delta to ~2 frames so a tab-switch doesn't cause a large jump
        const delta = Math.min(timestamp - lastTimestampRef.current, 64);
        lastTimestampRef.current = timestamp;

        if (!isPausedRef.current && speedRef.current > 0) {
          const direction = autoScrollDirectionRef.current === 'backward' ? -1 : 1;
          let next = currentOffsetRef.current + speedRef.current * delta * direction;

          next = loopRef.current
            ? wrapOffset(next)
            : Math.max(0, Math.min(next, maxOffsetRef.current));

          currentOffsetRef.current = next;
          applyTransform(next);
          updateBoundaryState(next);

          const step = slideStepRef.current;
          if (step > 0 && N > 0) {
            currentSlideIndexRef.current = Math.floor(next / step) % N;
          }
        }

        rafRef.current = requestAnimationFrame(tick);
      }

      lastTimestampRef.current = 0;
      rafRef.current = requestAnimationFrame(tick);

      return () => {
        cancelAnimationFrame(rafRef.current);
        lastTimestampRef.current = 0;
      };
    }, [autoScroll, N, prefersReducedMotion]);

    // ── Manual navigation ────────────────────────────────────────────────────

    function navigate(direction: 1 | -1) {
      if (N === 0 || slideStepRef.current === 0) return;

      const step = slideStepRef.current;
      // Reduce the step when navigating away from either boundary so the newly
      // visible slide clears the appearing button by exactly one gap width.
      const effectiveStep =
        (direction === 1 && !canPrevRef.current) ||
        (direction === -1 && !canNextRef.current)
          ? step - btnInsetRef.current
          : step;
      let next = currentOffsetRef.current + direction * effectiveStep;

      next = loopRef.current
        ? wrapOffset(next)
        : Math.max(0, Math.min(next, maxOffsetRef.current));

      // Pause the rAF loop while the transition plays, then resume
      const wasAlreadyPaused = isPausedRef.current;
      isPausedRef.current = true;

      currentOffsetRef.current = next;

      if (trackRef.current) {
        trackRef.current.classList.add(withBaseName.el('track') + '--animated');
        applyTransform(next);

        const onEnd = (e: TransitionEvent) => {
          if (e.propertyName !== 'transform') return;
          trackRef.current?.classList.remove(withBaseName.el('track') + '--animated');
          trackRef.current?.removeEventListener('transitionend', onEnd);
          if (!wasAlreadyPaused) {
            lastTimestampRef.current = 0; // reset so delta doesn't spike on resume
            isPausedRef.current = false;
          }
        };
        trackRef.current.addEventListener('transitionend', onEnd);
      }

      currentSlideIndexRef.current = Math.max(0, Math.floor(next / step) % Math.max(1, N));
      updateBoundaryState(next);
    }

    // ── Event handlers ───────────────────────────────────────────────────────

    function handleMouseEnter(e: React.MouseEvent<HTMLDivElement>) {
      isPausedRef.current = true;
      onMouseEnter?.(e);
    }

    function handleMouseLeave(e: React.MouseEvent<HTMLDivElement>) {
      isPausedRef.current = false;
      lastTimestampRef.current = 0;
      onMouseLeave?.(e);
    }

    function handleFocus(e: React.FocusEvent<HTMLDivElement>) {
      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
        isPausedRef.current = true;
      }
      onFocus?.(e);
    }

    function handleBlur(e: React.FocusEvent<HTMLDivElement>) {
      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
        isPausedRef.current = false;
        lastTimestampRef.current = 0;
      }
      onBlur?.(e);
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
      if (e.target === e.currentTarget) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          navigate(-1);
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          navigate(1);
        }
      }
      onKeyDown?.(e);
    }

    function handlePrevPointerDown(e: React.PointerEvent<HTMLButtonElement>) {
      prevRippleRef.current?.trigger(e);
    }

    function handleNextPointerDown(e: React.PointerEvent<HTMLButtonElement>) {
      nextRippleRef.current?.trigger(e);
    }

    // ── Render ───────────────────────────────────────────────────────────────

    const slideStyle = slidesPerPage ? { width: 'var(--akds-carousel-slide-width)' } : undefined;

    const mergedRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        (rootRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      },
      [ref],
    );

    return (
      <div
        ref={mergedRef}
        className={clsx(
          withBaseName(),
          { [withBaseName('paged')]: !!slidesPerPage },
          className,
        )}
        role="region"
        aria-roledescription="carousel"
        aria-label={ariaLabel}
        tabIndex={0}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {/* No style.transform here — the rAF loop sets it directly on the DOM
            element so React re-renders do not interfere with the running animation */}
        <div ref={trackRef} className={withBaseName.el('track')}>
          {displayedSlides.map((slide, i) => (
            <div
              key={i}
              className={withBaseName.el('slide')}
              role="group"
              aria-roledescription="slide"
              aria-label={`${(i % N) + 1} of ${N}`}
              style={slideStyle}
            >
              {slide}
            </div>
          ))}
        </div>

        {!hideButtons && N > 0 && (
          <>
            <button
              type="button"
              className={clsx(
                withBaseName.el('nav-button'),
                withBaseName.el('nav-button') + '--prev',
                { [withBaseName.el('nav-button') + '--disabled']: !canPrev },
              )}
              onClick={(e) => { if (!canPrev) { e.preventDefault(); return; } navigate(-1); }}
              onPointerDown={handlePrevPointerDown}
              aria-label="Previous slide"
              aria-disabled={!canPrev || undefined}
            >
              <ChevronLeftIcon aria-hidden="true" />
              <RippleBase ref={prevRippleRef} disabled={!canPrev} />
            </button>
            <button
              type="button"
              className={clsx(
                withBaseName.el('nav-button'),
                withBaseName.el('nav-button') + '--next',
                { [withBaseName.el('nav-button') + '--disabled']: !canNext },
              )}
              onClick={(e) => { if (!canNext) { e.preventDefault(); return; } navigate(1); }}
              onPointerDown={handleNextPointerDown}
              aria-label="Next slide"
              aria-disabled={!canNext || undefined}
            >
              <ChevronRightIcon aria-hidden="true" />
              <RippleBase ref={nextRippleRef} disabled={!canNext} />
            </button>
          </>
        )}
      </div>
    );
  },
);

Carousel.displayName = 'Carousel';
