---
"@aknishi/akds-reactkit": minor
---

`IconButton` can render a link: pass `href` (and optionally `target`) and it renders an `<a>` with the same styles and ripple, so navigation keeps middle-click, ⌘/Ctrl-click, and "Copy link". With `target="_blank"`, `rel` defaults to `"noopener noreferrer"`. The ref is an `HTMLAnchorElement` in this form; without `href`, IconButton is unchanged. New `IconButtonLinkProps` type.
