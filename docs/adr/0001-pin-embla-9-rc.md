# 1. Pin Embla to the 9.x release-candidate channel

Date: 2026-06-07

## Status

Accepted

## Context

Embla scores 100% on the site, earned through `embla-carousel-accessibility` — a dedicated plugin providing ARIA roles, labels, and a live region. That plugin only exists on the Embla **9.x** line.

Embla 9 is **not yet released**. npm dist-tags:

- `latest` → `8.6.0` (stable, no accessibility plugin)
- `next` → `9.0.0-rc02` (release candidate, has the plugin)

A naive "update to latest" (`npm update`, dependabot, or a human reading `npm outdated`) resolves Embla to `8.6.0`, which is a **downgrade** from our `9.0.0-rc01`. That removes the accessibility plugin and breaks the build (`emblaApi.snapList is not a function` and the v8/v9 API renames documented in `src/content/carousels/embla.mdx`).

The three Embla packages are version-locked to each other. The plugin's `peerDependencies` pin Embla to the **exact** rc, not a range:

- `embla-carousel-accessibility@9.0.0-rc01` peers `embla-carousel: 9.0.0-rc01`
- `embla-carousel-accessibility@9.0.0-rc02` peers `embla-carousel: 9.0.0-rc02`

So the rc cannot be bumped piecemeal; all three move together or the peer dependency mismatches.

## Decision

Pin Embla to the `9.x` release-candidate (`next`) channel:

- `embla-carousel`, `embla-carousel-react`, `embla-carousel-accessibility` are all kept on the **same** rc version and bumped in lockstep (currently `9.0.0-rc02`).
- We deliberately do **not** track the npm `latest` tag for Embla, because `latest` (8.6.0) is older than our rc and lacks the plugin. For Embla, "update to latest" means the `next` tag.
- Other dependencies follow true latest as normal.

## Consequences

- `npm update` / dependabot must be prevented from pulling Embla down to 8.6.0. Versions are written to track the rc explicitly.
- Each rc-to-rc bump (rc02 → rc03 → …) must update all three packages together and be re-verified with the audit scripts.
- When Embla 9 ships stable, revisit: drop the exact pins to a normal `^9` range and remove this special case from the bump process.
- A future reader who wonders "why is this pinned to a prerelease when 8.6.0 is latest?" has the answer here.
