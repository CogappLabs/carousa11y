# Context

Glossary of domain terms for Carousa11y. Definitions only, no implementation detail.

## Terms

### Library
One of the carousel packages under comparison (e.g. Embla, Swiper, Glide). The set is **11 libraries**, each with at least one real implementation on the site. A library is only listed if it has a working implementation; reference-only packages that are named but not implemented are called **Excluded libraries**.

### Excluded library
A carousel package named for reference but deliberately not implemented or tested (e.g. the jQuery-dependent Slick, Owl, accessible-slick). Listed so readers know they were considered, never scored as if covered.

### Score
The accessibility percentage shown per library. Its source of truth is **isitaccessible.dev** (external, scored per npm package, version-agnostic on their side). The local audit scripts do **not** produce this percentage; they are Verification, not the Score. Scores are **re-fetched live** from isitaccessible.dev at each update pass for every library, not carried forward from prior docs.

### Verification
The output of the local audit scripts (axe-core pass/fail plus manual W3C/WCAG checks) run against the running site. Supplementary evidence that supports or challenges the Score. Never the Score itself.

### Canonical research doc
`src/pages/research.mdx` — the single long-form cross-library document; it renders on the site. The former root `CAROUSEL-A11Y-COMPARISON.md` was collapsed into it and deleted. Per-library detail lives in the per-carousel MDX files under `src/content/carousels/`, not in the canonical doc.

### Implementation variant
A library is exposed as **vanilla** and/or **react**. Some libraries have both, some one. The variant set per library is recorded in `src/carousels.json`.
