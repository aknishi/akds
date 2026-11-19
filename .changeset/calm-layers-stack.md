---
"@aknishi/akds-tokens": minor
---

Add z-index tokens for the stacking order of page-level layers: `--akds-z-index-base` (0), `--akds-z-index-sticky` (100), `--akds-z-index-modal` (300), `--akds-z-index-popover` (400), `--akds-z-index-toast` (500), and `--akds-z-index-tooltip` (600). Also exported from JS as `zIndex` and `cssVars.zIndex`. A new "Z-index" docs page explains the layers and when a component should keep its stacking local with `isolation: isolate`.
