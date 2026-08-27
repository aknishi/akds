---
"@aknishi/akds-reactkit": patch
---

Fix Accordion not filling its container width when placed inside a flex or grid layout — it now sets `width: 100%` explicitly instead of relying on default block sizing, which flex/grid items don't inherit.
