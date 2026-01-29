# Accessible Carousel Library Comparison

> Research conducted 2026-01-29 using [isitaccessible.dev](https://isitaccessible.dev/) scores and official documentation.

## TL;DR Recommendation

**[Embla Carousel](https://www.embla-carousel.com/)** is the clear winner for accessibility-focused projects.

| Library | A11y Score | ⭐ Stars | Last Updated | Vanilla | React | Notes |
|---------|------------|----------|--------------|---------|-------|-------|
| **Embla Carousel** | 100% | 8.0k | Jan 2026 | Yes | Yes | **Best choice** |
| @egjs/flicking | 100% | 2.9k | Nov 2025 | Yes | Yes | Only 2 issues reported |
| react-responsive-carousel | 100% | 2.7k | Jan 2026 | No | Yes | Known ARIA issues |
| Siema | 85.7% | 3.5k | Sep 2024 | Yes | Wrap | Unmaintained |
| Swiper | 84.9% | 41.8k | Jan 2026 | Yes | Yes | Keyboard/SR issues |
| Pure React Carousel | 80% | 1.7k | Dec 2025 | No | Yes | Wrong ARIA roles |
| Flickity | 74.6% | 7.6k | May 2024 | Yes | Wrap | Aging |
| Keen Slider | 66.7% | 5.0k | Jan 2026 | Yes | Yes | Old a11y issue |
| tiny-slider | 58.5% | 5.3k | Aug 2024 | Yes | Wrap | Focus issues |
| React Slick | 57.4% | 12.0k | Aug 2025 | No | Yes | 8+ yr old issues |
| Splide | 53.8% | 5.3k | Jul 2024 | Yes | Yes | Not actually accessible |
| Glide.js | 44.4% | 7.7k | Nov 2024 | Yes | Wrap | Focus issues |

*Wrap = wrapper needed

### CSS Class Name Customization

Some libraries let you use your own class names (e.g., Tailwind utilities), while others require their fixed classes.

| Library | Customizable? | How |
|---------|---------------|-----|
| **Embla Carousel** | ✅ Yes | Class-agnostic - uses element refs, any classes work |
| **Swiper** | ✅ Yes | `slideClass`, `wrapperClass`, etc. in config |
| **Glide.js** | ✅ Yes | `classes` config object |
| **Splide** | ✅ Yes | `classes` config object |
| **tiny-slider** | ⚠️ Limited | Only animation classes (`animateIn`, `animateOut`) |
| **Flicking** | ⚠️ Limited | Only `panelClass` for virtual panels |
| **Siema** | ❌ No | Minimal by design |
| **Flickity** | ❌ No | Hardcoded classes |
| **Keen Slider** | ❌ No | Fixed `keen-slider__slide` convention |

### jQuery-Dependent Libraries (Not Included)

The following carousels require jQuery and are not included in the test app:

| Library | A11y Score | Stars | Notes |
|---------|------------|-------|-------|
| Slick Carousel | 57.6% | 28.6k | 81 open a11y issues. Very popular but problematic. |
| Owl Carousel | 27.6% | 7.9k | **Avoid.** Oldest issue 11+ years old. No keyboard nav. |
| accessible-slick | N/A | 271 | Purpose-built a11y fork of Slick. Best jQuery option. |

If you must use jQuery, **accessible-slick** is the recommended choice as it was specifically designed for accessibility.

---

## Acceptance Criteria for Accessible Carousels

Derived from W3C WAI, ARIA APG, and expert resources. Use this checklist when evaluating or building carousels.

### WCAG Success Criteria

| Criterion | Requirement |
|-----------|-------------|
| **1.3.1 Info and Relationships** | Structure is programmatically determinable |
| **1.3.2 Meaningful Sequence** | Reading order matches visual order |
| **2.1.1 Keyboard** | All functionality operable via keyboard |
| **2.2.1 Timing Adjustable** | Users can extend/disable time limits |
| **2.2.2 Pause, Stop, Hide** | Moving content can be paused/stopped |
| **2.4.3 Focus Order** | Focus order preserves meaning |
| **3.2.5 Change on Request** | Context changes only on user request |
| **4.1.2 Name, Role, Value** | All UI components have accessible name/role/value |

---

### Keyboard Navigation

- [ ] **Tab key** moves focus to/through interactive carousel elements
- [ ] **Tab does not trap** — after last focusable element, focus moves to next page element
- [ ] **Arrow keys** navigate between slides (when carousel is focused)
- [ ] **Enter/Space** activates focused controls (buttons, links)
- [ ] **Escape** stops auto-rotation (if applicable)
- [ ] **No infinite Tab loops** — user can always Tab out of carousel
- [ ] **Hidden slides are not focusable** — off-screen content removed from tab order

---

### Auto-Rotation / Autoplay

- [ ] **Pause/Play button provided** — visible, keyboard accessible
- [ ] **Rotation stops on keyboard focus** — entering carousel halts movement
- [ ] **Rotation stops on hover** — mouse over carousel pauses it
- [ ] **Rotation stops on interaction** — clicking controls halts movement
- [ ] **Explicit action to restart** — rotation doesn't auto-resume
- [ ] **No auto-rotation preferred** — static carousels are more accessible
- [ ] **If autoplay, minimum 5 seconds** — adequate time to read content

---

### Screen Reader Support

- [ ] **Carousel has accessible name** — `aria-label` or `aria-labelledby`
- [ ] **Carousel role is announced** — `aria-roledescription="carousel"`
- [ ] **Slides have accessible names** — "Slide 1 of 5" pattern
- [ ] **Slide changes are announced** — `aria-live="polite"` region
- [ ] **Live announcements disabled during auto-rotation** — prevents constant interruptions
- [ ] **Hidden slides are hidden from AT** — `aria-hidden="true"` or `inert`
- [ ] **Controls have accessible names** — "Previous slide", "Next slide", "Go to slide 3"
- [ ] **Current state is communicated** — `aria-current`, `aria-selected`, or `aria-disabled`

---

### ARIA Implementation

**Carousel Container:**
- [ ] `role="region"` or `role="group"`
- [ ] `aria-roledescription="carousel"`
- [ ] `aria-label="[Descriptive name]"`

**Individual Slides:**
- [ ] `role="group"`
- [ ] `aria-roledescription="slide"`
- [ ] `aria-label="[N] of [total]"` or similar

**Navigation Controls:**
- [ ] Previous/Next buttons have descriptive `aria-label`
- [ ] Dot/pagination buttons indicate target slide
- [ ] Current slide's control marked with `aria-disabled="true"` or `aria-current="true"`

**Rotation Control:**
- [ ] Dynamic `aria-label` reflects state ("Stop rotation" / "Start rotation")
- [ ] Positioned as first focusable element in carousel

---

### Visual & Design

- [ ] **3:1 minimum contrast ratio** for controls and indicators
- [ ] **Visible focus indicators** — clear outline on focused elements
- [ ] **Non-color focus indication** — border, outline, or shape change
- [ ] **Adequate touch target size** — minimum 44x44px
- [ ] **Current slide indicator** uses more than color alone
- [ ] **Critical content not only in images** — text alternatives provided

---

### Content & Structure

- [ ] **Semantic HTML** — use `<button>`, `<section>`, lists where appropriate
- [ ] **Logical DOM order** — controls before slides in source
- [ ] **Skip link provided** — allow users to bypass carousel
- [ ] **Maximum 5 slides** — limit cognitive load
- [ ] **Each slide has clear purpose** — meaningful content, not just decoration
- [ ] **Links and CTAs are clear** — not just "Learn more"

---

### Testing Checklist

- [ ] **Keyboard-only testing** — navigate entire carousel without mouse
- [ ] **Screen reader testing** — VoiceOver (macOS/iOS), NVDA/JAWS (Windows), TalkBack (Android)
- [ ] **Zoom testing** — 200% and 400% zoom levels
- [ ] **Reduced motion testing** — `prefers-reduced-motion` honored
- [ ] **High contrast mode testing** — Windows High Contrast Mode
- [ ] **Axe/Lighthouse audit** — automated accessibility testing
- [ ] **Manual WCAG review** — against 2.1 AA criteria

---

## Detailed Library Breakdown

### Embla Carousel (100%)

**Website:** https://www.embla-carousel.com/

**Why it wins:**
- 100% of accessibility-related GitHub issues resolved (8/8)
- Median resolution time: 12.6 days
- **Dedicated accessibility plugin** with comprehensive ARIA support
- Native support for: Vanilla JS, React, Vue, Svelte, Solid

**Accessibility Plugin Features:**
- Configurable carousel roles (`region` by default)
- `aria-label` and `aria-roledescription` for carousel container
- Slide roles with position/grouping labels
- Navigation button labeling ("Go to previous Slide")
- Dot button accessibility labels
- **ARIA live region** for announcing slide changes to screen readers
- Programmatic control via `setUpdateLiveRegion()`

**Setup:**
```javascript
import EmblaCarousel from 'embla-carousel'
import { Accessibility } from 'embla-carousel-accessibility'

const embla = EmblaCarousel(emblaNode, { loop: true }, [Accessibility()])
```

**Caveat:** The 100% score means all *reported* issues are closed—it doesn't guarantee perfect accessibility. Always test with real assistive technology.

---

### Swiper (84.9%)

**Closed:** 124/146 accessibility issues
**Median resolution:** 9.4 days

**Strengths:**
- Active maintenance
- Fast issue resolution

**Critical open issues:**
- Infinite loops when tabbing through sliders
- Broken tab key behavior with links inside slides
- `aria-live` announcements fail on touch/click events
- Redundant `aria-disabled` alongside native `disabled` attributes
- Pagination shows `NaN` in aria-labels (loop mode)
- Shadow DOM accessibility conflicts

---

### Flickity (74.6%)

**Closed:** 44/59 accessibility issues
**Median resolution:** 69 days

**Critical open issues (15):**
- `aria-hidden` incorrectly applied to visible elements
- Previous/next buttons lack accessible names
- Page dots not keyboard accessible
- Screen readers crash after clicking navigation
- Slides outside viewport remain focusable

**Note:** The accessible-carousel-boilerplates project recommends avoiding `wrapAround` and `accessibility` options.

---

### Keen Slider (66.7%)

**Closed:** 2/3 accessibility issues

**Critical issue:**
- 1 unresolved issue is **1,190 days old**: "Slider controls break if using more than 1 slide per view"

---

### Splide (53.8%)

**Website:** https://splidejs.com/
**Closed:** 28/52 accessibility issues
**Median resolution:** 148.8 days

**Despite marketing itself as accessible, has critical issues:**
- Inactive pagination items unreachable via Tab key
- `destroy()` doesn't remove `tabindex="-1"`, breaking keyboard nav
- Custom `aria-label` attributes stripped
- Incorrect `aria-orientation` values (flagged in professional audits)
- Chrome's `aria-hidden` restrictions prevent proper focus management

**Note:** The boilerplates project notes Splide could be "the most accessible package" but requires avoiding `keyboard` and `slideFocus` options.

---

### Glide.js (44.4%)

**Closed:** 4/9 accessibility issues

**Critical open issues:**
- Focus management on hidden cloned elements (633+ days old)
- Cloned item handling affects linked elements
- Breakpoint-based enable/disable issues

---

### @egjs/flicking (100%)

**Website:** https://naver.github.io/egjs-flicking/

**Closed:** 2/2 accessibility issues
**Median resolution:** 300 days

**Pros:**
- Native support for: Vanilla JS, React, Vue, Angular, Svelte
- All reported issues resolved

**Concerns:**
- Only 2 issues ever reported — limited real-world a11y testing
- Past issues included keyboard tab navigation problems

---

### react-responsive-carousel (100%)

**Closed:** 22/22 accessibility issues
**Median resolution:** 259.6 days

**Known issues (closed but indicate architectural problems):**
- `role="button"` on `<li>` elements — invalid ARIA
- Carousel root receives unwanted focus
- Missing focus styles on control arrows
- Visual elements (dots, arrows) read to screen readers without `aria-hidden`
- Invalid HTML structure during render phases

**Note:** 100% score is misleading — issues reveal poor a11y architecture.

---

### Siema (85.7%)

**Closed:** 6/7 accessibility issues
**Median resolution:** 3 days

**Pros:**
- Very lightweight (~3KB)
- Fast issue resolution when reported

**Cons:**
- **Unmaintained** — last update years ago
- Single open issue is about maintenance status (2,000+ days old)
- Limited a11y features built-in

---

### Pure React Carousel (80%)

**Closed:** 12/15 accessibility issues
**Median resolution:** 109.5 days

**Critical issues:**
- Uses `role="listbox"` and `role="option"` — **wrong semantics** for carousels
- Creates false expectations about keyboard interaction
- Nested interactive elements cause screen reader issues
- Cannot override aria-labels on DotGroup buttons

**Note:** Architectural ARIA approach needs reconsideration for WCAG compliance.

---

### tiny-slider (58.5%)

**Closed:** 24/41 accessibility issues
**Median resolution:** 80.2 days

**Critical open issues (17):**
- Arrow key navigation affects ALL sliders on page simultaneously
- aria-live announces wrong slide counts ("slide 6 of 5")
- Navigation buttons have `tabindex="-1"` — unreachable by keyboard
- ARIA attributes don't match their roles

---

### React Slick (57.4%)

**Closed:** 35/61 accessibility issues
**Median resolution:** 558.8 days

**Critical issues:**
- `aria-hidden="true"` combined with `tabindex="-1"` — breaks ARIA rules
- Focus doesn't move properly through slides
- TalkBack and VoiceOver report poor accessibility on mobile
- Oldest unresolved issue: **3,178 days** (8+ years)

---

## CSS-Only Carousels (Future)

Chrome is developing native CSS carousel features with built-in accessibility:
- Proper ARIA roles handled by browser
- Keyboard navigation built-in
- Screen reader support automatic
- `scroll-state()` container queries for managing inert content

**Status:** Experimental. Sara Soueidan's analysis notes current CSS carousels fail accessibility criteria and are unsuitable for production.

**References:**
- [Chrome DevRel: Carousels with CSS](https://developer.chrome.com/blog/carousels-with-css)
- [Sara Soueidan: CSS Carousels Accessibility](https://www.sarasoueidan.com/blog/css-carousels-accessibility/)

---

## References

### Standards & Guidelines
- [W3C WAI Carousel Tutorial](https://www.w3.org/WAI/tutorials/carousels/)
- [ARIA APG Carousel Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/)
- [Universal Design IE: Make Carousels Accessible](https://universaldesign.ie/communications-digital/web-and-mobile-accessibility/web-accessibility-techniques/developers-introduction-and-index/ensure-custom-widgets-are-accessible/make-carousels-accessible)

### Analysis & Articles
- [isitaccessible.dev](https://isitaccessible.dev/) — Package accessibility scoring
- [Smashing Magazine: Guide to Building Accessible Carousels](https://www.smashingmagazine.com/2023/02/guide-building-accessible-carousels/)
- [A11y Collective: Accessible Carousel](https://www.a11y-collective.com/blog/accessible-carousel/)
- [a11y-101: Carousels](https://a11y-101.com/development/carousels)
- [Sara Soueidan: CSS Carousels Accessibility](https://www.sarasoueidan.com/blog/css-carousels-accessibility/)

### Implementation Resources
- [Accessible Carousel Boilerplates](https://accessible360.github.io/accessible-carousel-boilerplates/)
- [Chrome DevRel: Accessible Carousel](https://developer.chrome.com/blog/accessible-carousel)

---

## Conclusion

**Use Embla Carousel** with its accessibility plugin for the best out-of-box accessibility:

- Highest accessibility score (100%)
- Dedicated, well-documented accessibility plugin
- Supports vanilla JS and React natively (no wrapper needed)
- Fast issue resolution (12.6 day median)
- Implements proper ARIA live regions for screen reader announcements

**Installation:**
```bash
# Vanilla JS
npm install embla-carousel embla-carousel-accessibility

# React
npm install embla-carousel-react embla-carousel-accessibility
```


**Always test with:**
- Keyboard navigation (Tab, Arrow keys, Enter, Escape)
- Screen readers (VoiceOver, NVDA, JAWS)
- Automated tools (axe, Lighthouse)
- Real users with disabilities when possible
