---
"@aknishi/akds-reactkit": minor
---

Add controlled usage to Tooltip via new optional `open`/`onOpenChange` props. When omitted, Tooltip behaves exactly as before (hover/focus manage visibility internally); when `open` is provided, visibility is fully controlled by the consumer and hover/focus/blur report requested changes through `onOpenChange` instead of toggling directly.
