# 2. No top-level Vite dependency; Vite stays on Astro's 7.x

Date: 2026-06-07

## Status

Accepted

## Context

During the dependency-bump pass we moved everything to latest, including Vite 8. Vite 8 switched its bundler to Rolldown (rolldown 1.0.3). The build then failed:

```
[@tailwindcss/vite:generate:build] Missing field `tsconfigPaths` on BindingViteResolvePluginConfig.resolveOptions
```

`@tailwindcss/vite@4.3.0` (the latest, and only current 4.x) resolves CSS imports through Vite's `createIdResolver`/`createResolver`. Under Vite 8 those delegate to Rolldown's resolve plugin, which requires a `tsconfigPaths` field that Vite 8's resolver does not populate. It is a Vite-8/Rolldown internal mismatch surfaced via the Tailwind plugin, not fixable in our config and with no newer Tailwind plugin to upgrade to.

Astro 6.4.4 peers `vite@^7.3.2` and installs Vite 7.3.5 itself. Vite was never a feature we use directly; it arrives transitively through Astro. The top-level `vite` entry only forced an unsupported version into the tree.

## Decision

Do not declare `vite` as a direct dependency. Let Astro pull in the Vite it supports (currently 7.x). Removed the top-level pin and ran `npm dedupe` so the whole tree resolves to the single Astro-provided Vite.

## Consequences

- `npm outdated` will report Vite as upgradable (8.x available) but there is no top-level entry to bump, and adding one re-breaks the build. Do not re-add `vite` to `package.json`.
- Vite advances when Astro advances. Revisit only when Astro ships a release that supports Vite 8 / Rolldown and `@tailwindcss/vite` follows.
- A future reader who wonders "why is Vite 7 when 8 is out, and why isn't it in package.json?" has the answer here.
