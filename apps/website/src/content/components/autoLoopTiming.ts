// Shared cadence for component index/landing page preview cards that auto-replay
// their micro-interaction (see useAutoRestartInterval). A single constant keeps every
// card's loop in sync at 3s; AUTO_LOOP_STAGGER_MS is the per-card offset step so
// sibling cards in the same category grid don't all animate in the same instant —
// each card in a category multiplies this by its own index among that category's
// looping previews (0, 1, 2, ...).
export const AUTO_LOOP_INTERVAL_MS = 3000;
export const AUTO_LOOP_STAGGER_MS = 600;
