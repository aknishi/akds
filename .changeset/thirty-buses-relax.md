---
"@aknishi/akds-reactkit": patch
---

Fix motion inconsistencies found by a design-motion-principles audit:

- Dialog now animates out instead of unmounting instantly, mirroring Drawer's enter/exit pattern
- AccordionItem's panel animates expand/collapse (height + fade) instead of snapping via the `hidden` attribute
- Tooltip's entrance uses a calm ease-out instead of a bouncy overshoot curve, and runs faster (320ms → 140ms)
- Combobox's listbox now animates in, matching DropdownMenu's existing entrance
- ProgressTrackerStep's check-icon pop only plays on a genuine complete transition, not on every mount of an already-complete step
- Unified the active-press scale to `0.94` across Button, IconButton, LikeButton, and ToggleButton
- Fixed a flash/pop on close for Dialog and Drawer caused by a `useEffect`-timing race (switched to `useLayoutEffect`)
