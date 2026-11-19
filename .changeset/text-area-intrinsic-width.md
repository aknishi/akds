---
"@aknishi/akds-reactkit": patch
---

Fix `TextArea` collapsing to a sliver when its container doesn't stretch it, such as a centered flex container. It again has a natural width of about 20 characters, while still filling a sized parent.
