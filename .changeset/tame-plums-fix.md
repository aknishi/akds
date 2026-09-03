---
"@aknishi/akds-reactkit": patch
---

Fix component styles being stripped from production builds. `tsup.config.ts` uses `injectStyle: true`, which bundles all CSS into content-hashed JS chunks with no `.css` files ever emitted, but `package.json` declared `sideEffects: ["**/*.css"]` — a glob that matched nothing in the actual output. Consumers doing a production tree-shaking build (Rollup/Vite) could silently drop a component's injected styles (reproduced with Menu/Option). `sideEffects` is now `true` so bundlers never prune the style-injecting chunks.
