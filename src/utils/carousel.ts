/**
 * Shared carousel utilities for consistent behavior across implementations
 */

/** CSS classes for pagination dots */
export const DOT_CLASSES = {
  base: 'w-3 h-3 rounded-full border-none p-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2',
  active: 'bg-stone-800',
  inactive: 'bg-stone-300 hover:bg-stone-400',
} as const

/**
 * Update pagination dot states (active styling and aria-current)
 */
export function updateDots(
  dots: NodeListOf<Element> | Element[],
  activeIndex: number,
): void {
  dots.forEach((dot, i) => {
    const isActive = i === activeIndex
    dot.classList.toggle(DOT_CLASSES.active, isActive)
    dot.classList.toggle('bg-stone-300', !isActive)
    dot.classList.toggle('hover:bg-stone-400', !isActive)

    if (isActive) {
      dot.setAttribute('aria-current', 'true')
    } else {
      dot.removeAttribute('aria-current')
    }
  })
}

/**
 * Create pagination dot buttons for a carousel
 */
export function createDots(
  container: Element,
  count: number,
  onClick: (index: number) => void,
): HTMLButtonElement[] {
  const dots: HTMLButtonElement[] = []

  for (let i = 0; i < count; i++) {
    const dot = document.createElement('button')
    dot.type = 'button'
    dot.className = `${DOT_CLASSES.base} ${i === 0 ? DOT_CLASSES.active : DOT_CLASSES.inactive}`
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`)
    if (i === 0) dot.setAttribute('aria-current', 'true')
    dot.addEventListener('click', () => onClick(i))
    container.appendChild(dot)
    dots.push(dot)
  }

  return dots
}

/** Selector for focusable elements */
const FOCUSABLE_SELECTOR =
  'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'

/**
 * Update tabindex on focusable elements within slides based on visibility
 * Prevents keyboard users from tabbing into hidden slides
 */
export function updateSlideFocus(
  slides: NodeListOf<Element> | Element[],
  isActiveSlide: (slide: Element, index: number) => boolean,
): void {
  slides.forEach((slide, i) => {
    const isActive = isActiveSlide(slide, i)
    const focusables = slide.querySelectorAll(FOCUSABLE_SELECTOR)
    focusables.forEach((el) => {
      el.setAttribute('tabindex', isActive ? '0' : '-1')
    })
  })
}

/**
 * Mark carousel as ready (remove loading skeleton, show content)
 */
export function setCarouselReady(container: Element | null): void {
  container?.classList.remove('carousel-loading')
  container?.classList.add('carousel-ready')
}
