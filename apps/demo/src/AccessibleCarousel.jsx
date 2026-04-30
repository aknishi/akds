import { useState, useRef, useCallback, useId } from "react";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const ITEMS = [
  { id: 1, title: "Stranger Things", genre: "Sci-Fi • Horror", color: "#1a1a2e" },
  { id: 2, title: "The Crown", genre: "Drama • History", color: "#0f2027" },
  { id: 3, title: "Squid Game", genre: "Thriller • Drama", color: "#1a0a0a" },
  { id: 4, title: "Wednesday", genre: "Comedy • Horror", color: "#0d0d0d" },
  { id: 5, title: "Ozark", genre: "Crime • Thriller", color: "#0a1628" },
  { id: 6, title: "Dark", genre: "Sci-Fi • Mystery", color: "#1c1c1c" },
  { id: 7, title: "Money Heist", genre: "Crime • Drama", color: "#1a0a00" },
  { id: 8, title: "Narcos", genre: "Crime • Biography", color: "#0a1a0a" },
];

// ─── CAROUSEL CARD ────────────────────────────────────────────────────────────
function CarouselCard({ item, isActive, index, totalItems }) {
  return (
    <div
      role="group"
      aria-roledescription="slide"
      aria-label={`${item.title}, ${index + 1} of ${totalItems}`}
      style={{
        background: `linear-gradient(135deg, ${item.color} 0%, #0a0a0a 100%)`,
      }}
      className={`carousel-card ${isActive ? "is-active" : ""}`}
    >
      <div className="card-inner">
        <div className="card-badge">N</div>
        <div className="card-meta">{item.genre}</div>
        <h3 className="card-title">{item.title}</h3>
        <button
          className="card-cta"
          tabIndex={isActive ? 0 : -1}
          aria-label={`Watch ${item.title}`}
        >
          ▶ Play
        </button>
      </div>
    </div>
  );
}

// ─── ACCESSIBLE CAROUSEL ─────────────────────────────────────────────────────
export default function AccessibleCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const carouselId = useId();
  const trackRef = useRef(null);
  const prevBtnRef = useRef(null);
  const nextBtnRef = useRef(null);

  const VISIBLE_COUNT = 3; // items visible at once
  const total = ITEMS.length;
  const maxIndex = total - VISIBLE_COUNT;

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < maxIndex;

  const navigate = useCallback(
    (direction) => {
      if (isAnimating) return;
      if (direction === "prev" && !canGoPrev) return;
      if (direction === "next" && !canGoNext) return;

      setIsAnimating(true);
      setCurrentIndex((prev) =>
        direction === "next"
          ? Math.min(prev + 1, maxIndex)
          : Math.max(prev - 1, 0)
      );

      // Unblock animation after transition completes
      setTimeout(() => setIsAnimating(false), 350);
    },
    [isAnimating, canGoPrev, canGoNext, maxIndex]
  );

  // ── KEYBOARD HANDLER ───────────────────────────────────────────────────────
  // The carousel region itself handles left/right arrow keys.
  // This is the pattern screen readers + keyboard users expect.
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        navigate("prev");
        prevBtnRef.current?.focus();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        navigate("next");
        nextBtnRef.current?.focus();
      }
    },
    [navigate]
  );

  const translateX = -(currentIndex * (100 / VISIBLE_COUNT));

  return (
    <>
      <style>{styles}</style>

      <section
        className="carousel-root"
        aria-label="Featured Shows"
        aria-roledescription="carousel"
        onKeyDown={handleKeyDown}
      >
        {/* ── HEADER ── */}
        <div className="carousel-header">
          <h2 className="carousel-heading">Trending Now</h2>
          <div className="carousel-controls" role="group" aria-label="Carousel navigation">
            <button
              ref={prevBtnRef}
              className="nav-btn"
              onClick={() => navigate("prev")}
              disabled={!canGoPrev}
              aria-label="Previous shows"
              aria-controls={carouselId}
            >
              ‹
            </button>
            {/* ── DOT INDICATORS ── */}
            <div role="tablist" aria-label="Slide indicators" className="dot-list">
              {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={i === currentIndex}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`dot ${i === currentIndex ? "dot--active" : ""}`}
                  onClick={() => setCurrentIndex(i)}
                />
              ))}
            </div>
            <button
              ref={nextBtnRef}
              className="nav-btn"
              onClick={() => navigate("next")}
              disabled={!canGoNext}
              aria-label="Next shows"
              aria-controls={carouselId}
            >
              ›
            </button>
          </div>
        </div>

        {/* ── TRACK ── */}
        {/*
          aria-live="polite" announces slide changes to screen readers.
          We use polite (not assertive) to avoid interrupting ongoing announcements.
          atomic=false so it reads only the newly visible content.
        */}
        <div className="carousel-viewport" aria-live="polite" aria-atomic="false">
          <div
            id={carouselId}
            ref={trackRef}
            className={`carousel-track ${isAnimating ? "is-animating" : ""}`}
            style={{ transform: `translateX(${translateX}%)` }}
          >
            {ITEMS.map((item, i) => (
              <CarouselCard
                key={item.id}
                item={item}
                index={i}
                totalItems={total}
                isActive={i >= currentIndex && i < currentIndex + VISIBLE_COUNT}
              />
            ))}
          </div>
        </div>

        {/* ── SCREEN READER STATUS ── */}
        {/*
          Visually hidden live region that announces position changes.
          This is supplementary — the aria-live on the viewport handles content,
          this handles "where you are" context.
        */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          Showing items {currentIndex + 1} to{" "}
          {Math.min(currentIndex + VISIBLE_COUNT, total)} of {total}
        </div>
      </section>
    </>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .carousel-root {
    background: #000;
    padding: 40px 48px;
    font-family: 'DM Sans', sans-serif;
    color: #fff;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  /* ── HEADER ── */
  .carousel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
  }

  .carousel-heading {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(1.5rem, 4vw, 2.5rem);
    letter-spacing: 0.05em;
    color: #e50914;
  }

  /* ── CONTROLS ── */
  .carousel-controls {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .nav-btn {
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.15);
    color: #fff;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    font-size: 1.4rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s, transform 0.15s;
    line-height: 1;
  }

  .nav-btn:hover:not(:disabled) {
    background: rgba(255,255,255,0.18);
    transform: scale(1.08);
  }

  .nav-btn:focus-visible {
    outline: 2px solid #e50914;
    outline-offset: 3px;
  }

  .nav-btn:disabled {
    opacity: 0.25;
    cursor: not-allowed;
  }

  /* ── DOT INDICATORS ── */
  .dot-list {
    display: flex;
    gap: 6px;
    align-items: center;
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    border: none;
    background: rgba(255,255,255,0.25);
    cursor: pointer;
    transition: background 0.2s, transform 0.2s;
    padding: 0;
  }

  .dot--active {
    background: #e50914;
    transform: scale(1.3);
  }

  .dot:focus-visible {
    outline: 2px solid #fff;
    outline-offset: 3px;
  }

  /* ── VIEWPORT & TRACK ── */
  .carousel-viewport {
    overflow: hidden;
    border-radius: 8px;
  }

  .carousel-track {
    display: flex;
    transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    gap: 0;
  }

  /* Respect reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .carousel-track {
      transition: none;
    }
  }

  /* ── CARDS ── */
  .carousel-card {
    min-width: calc(100% / 3);
    aspect-ratio: 16/9;
    padding: 2px;
    flex-shrink: 0;
    position: relative;
    overflow: hidden;
  }

  .card-inner {
    height: 100%;
    padding: 24px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%);
    border-radius: 6px;
    border: 1px solid rgba(255,255,255,0.04);
    transition: transform 0.25s ease, border-color 0.2s;
  }

  .carousel-card.is-active .card-inner:hover {
    transform: scale(1.02);
    border-color: rgba(255,255,255,0.12);
  }

  .card-badge {
    position: absolute;
    top: 16px;
    left: 16px;
    background: #e50914;
    color: white;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.1rem;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 3px;
  }

  .card-meta {
    font-size: 0.7rem;
    color: rgba(255,255,255,0.5);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 6px;
    font-weight: 300;
  }

  .card-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(1.1rem, 2.5vw, 1.6rem);
    letter-spacing: 0.03em;
    line-height: 1.1;
    margin-bottom: 12px;
  }

  .card-cta {
    align-self: flex-start;
    background: #e50914;
    color: #fff;
    border: none;
    padding: 6px 16px;
    border-radius: 3px;
    font-size: 0.78rem;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
    letter-spacing: 0.04em;
  }

  .card-cta:hover {
    background: #f40612;
  }

  .card-cta:focus-visible {
    outline: 2px solid #fff;
    outline-offset: 3px;
  }

  /* ── RESPONSIVE BREAKPOINTS ── */
  @media (max-width: 900px) {
    .carousel-card { min-width: calc(100% / 2); }
    .carousel-root { padding: 32px 24px; }
  }

  @media (max-width: 600px) {
    .carousel-card { min-width: 100%; }
    .carousel-root { padding: 24px 16px; }
  }

  /* ── SCREEN READER ONLY ── */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0,0,0,0);
    white-space: nowrap;
    border: 0;
  }
`;
