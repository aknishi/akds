---
"@aknishi/akds-reactkit": minor
---

- **Drawer** — swipe to dismiss on all four sides. The panel sits in a native scroll-snap scroller with an "open" and a "closed" stop, so the swipe has native momentum and the backdrop dims with the finger (scroll-driven animation, with a script fallback). Swiping away, Escape, the close button and backdrop taps all call `onClose`; if the parent keeps `open` true, the drawer snaps back. `disableBackdropClose` turns off backdrop taps only. With reduced motion, opening and closing are instant.
