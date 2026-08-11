/**
 * @aknishi/akds-icons has no menu/hamburger glyph — this is a one-off,
 * site-local SVG rather than a gap to backfill into the shared icon set.
 */
export function HamburgerIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M3 5.5H17M3 10H17M3 14.5H17"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
      />
    </svg>
  );
}
