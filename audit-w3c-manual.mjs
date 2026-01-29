import { chromium } from 'playwright'

/**
 * Manual W3C WAI Carousel Pattern Audit
 * Based on: https://www.w3.org/WAI/ARIA/apg/patterns/carousel/
 * And: https://www.w3.org/WAI/tutorials/carousels/
 */

const carousels = [
  { id: 'embla', versions: ['vanilla', 'react'] },
  { id: 'flicking', versions: ['vanilla', 'react'] },
  { id: 'siema', versions: ['vanilla'] },
  { id: 'swiper', versions: ['vanilla', 'react'] },
  { id: 'flickity', versions: ['vanilla'] },
  { id: 'keen', versions: ['vanilla', 'react'] },
  { id: 'tiny', versions: ['vanilla'] },
  { id: 'splide', versions: ['vanilla', 'react'] },
  { id: 'glide', versions: ['vanilla'] },
  { id: 'react-slick', versions: ['react'] },
  { id: 'react-responsive', versions: ['react'] },
]

const BASE_URL = 'http://localhost:4321'

async function auditCarousel(page, id, version) {
  const url = version === 'react' ? `${BASE_URL}/carousel/${id}#react` : `${BASE_URL}/carousel/${id}`

  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1000)

  if (version === 'react') {
    const reactBtn = await page.$('#react-btn')
    if (reactBtn) {
      await reactBtn.click()
      await page.waitForTimeout(1500)
    }
  }

  // Run comprehensive W3C checks
  const results = await page.evaluate(() => {
    const section = document.querySelector('.carousel-section')
    if (!section) return { error: 'No carousel section found' }

    const checks = {
      // STRUCTURE CHECKS
      structure: {
        hasCarouselContainer: false,
        containerRole: null,
        containerAriaLabel: null,
        containerAriaRoledescription: null,
      },

      // SLIDE CHECKS
      slides: {
        count: 0,
        hasSlideRole: false,
        hasSlideAriaRoledescription: false,
        hasSlideLabels: false,
        slideLabelPattern: null,
        hiddenSlidesAriaHidden: false,
        hiddenSlidesFocusable: [],
      },

      // NAVIGATION CHECKS
      navigation: {
        hasPrevButton: false,
        hasNextButton: false,
        prevButtonLabel: null,
        nextButtonLabel: null,
        buttonsKeyboardAccessible: false,
      },

      // PAGINATION CHECKS
      pagination: {
        hasDots: false,
        dotCount: 0,
        dotsHaveLabels: false,
        dotsHaveCurrentState: false,
        currentStateMethod: null, // aria-current, aria-selected, or class-only
      },

      // LIVE REGION CHECKS
      liveRegion: {
        hasLiveRegion: false,
        liveRegionRole: null,
        ariaLive: null,
        ariaAtomic: null,
      },

      // KEYBOARD CHECKS (structural only - actual testing done separately)
      keyboard: {
        controlsInTabOrder: false,
        slidesNotInTabOrder: true,
      },

      // FOCUS MANAGEMENT
      focus: {
        hiddenElementsNotFocusable: true,
        focusableInHiddenSlides: [],
      },
    }

    // Find carousel container
    const carouselContainers = section.querySelectorAll(
      '[role="region"], [role="group"], [aria-roledescription="carousel"], .carousel, .swiper, .splide, .glide, .keen-slider, .flickity-carousel, .siema, #tiny-slider, .embla, .flicking-viewport'
    )

    if (carouselContainers.length > 0) {
      const container = carouselContainers[0]
      checks.structure.hasCarouselContainer = true
      checks.structure.containerRole = container.getAttribute('role')
      checks.structure.containerAriaLabel = container.getAttribute('aria-label')
      checks.structure.containerAriaRoledescription = container.getAttribute('aria-roledescription')
    }

    // Find slides
    const slideSelectors = [
      '[role="group"][aria-roledescription="slide"]',
      '[role="tabpanel"]',
      '.embla__slide',
      '.swiper-slide',
      '.splide__slide',
      '.glide__slide',
      '.keen-slider__slide',
      '.flickity-slide',
      '.flicking-panel',
      '.siema-slide',
      '.tiny-slide',
      '.tns-item:not(.tns-slide-cloned)',
      '.slick-slide:not(.slick-cloned)',
      '.slide',
    ]

    let slides = []
    for (const selector of slideSelectors) {
      const found = section.querySelectorAll(selector)
      if (found.length > 0) {
        slides = Array.from(found)
        break
      }
    }

    checks.slides.count = slides.length

    if (slides.length > 0) {
      // Check slide roles
      const firstSlide = slides[0]
      checks.slides.hasSlideRole = firstSlide.getAttribute('role') === 'group' || firstSlide.getAttribute('role') === 'tabpanel'
      checks.slides.hasSlideAriaRoledescription = firstSlide.getAttribute('aria-roledescription') === 'slide'

      // Check slide labels
      const slideLabels = slides.map((s) => s.getAttribute('aria-label')).filter(Boolean)
      checks.slides.hasSlideLabels = slideLabels.length > 0
      if (slideLabels.length > 0) {
        checks.slides.slideLabelPattern = slideLabels[0]
      }

      // Check hidden slides
      const hiddenSlides = slides.filter(
        (s) =>
          s.getAttribute('aria-hidden') === 'true' ||
          s.hasAttribute('inert') ||
          s.classList.contains('is-hidden') ||
          !s.classList.contains('is-active')
      )

      checks.slides.hiddenSlidesAriaHidden = hiddenSlides.some(
        (s) => s.getAttribute('aria-hidden') === 'true' || s.hasAttribute('inert')
      )

      // Check for focusable elements in hidden slides
      hiddenSlides.forEach((slide, i) => {
        const focusables = slide.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])')
        focusables.forEach((el) => {
          if (el.getAttribute('tabindex') !== '-1') {
            checks.slides.hiddenSlidesFocusable.push({
              slideIndex: i,
              element: el.tagName,
              tabindex: el.getAttribute('tabindex'),
            })
          }
        })
      })
    }

    // Check navigation buttons - find by text content or aria-label
    const allButtons = section.querySelectorAll('button, [role="button"]')
    let prevButton = null
    let nextButton = null

    allButtons.forEach((btn) => {
      const text = btn.textContent?.toLowerCase().trim() || ''
      const label = btn.getAttribute('aria-label')?.toLowerCase() || ''
      const classList = btn.className?.toLowerCase() || ''

      if (text.includes('previous') || text.includes('prev') ||
          label.includes('previous') || label.includes('prev') ||
          classList.includes('prev') || classList.includes('left')) {
        prevButton = btn
      }
      if (text.includes('next') || label.includes('next') ||
          classList.includes('next') || classList.includes('right')) {
        nextButton = btn
      }
    })

    if (prevButton) {
      checks.navigation.hasPrevButton = true
      checks.navigation.prevButtonLabel = prevButton.getAttribute('aria-label') || prevButton.textContent?.trim()
    }
    if (nextButton) {
      checks.navigation.hasNextButton = true
      checks.navigation.nextButtonLabel = nextButton.getAttribute('aria-label') || nextButton.textContent?.trim()
    }

    // Check if buttons are keyboard accessible
    if (prevButton && nextButton) {
      const prevTabindex = prevButton.getAttribute('tabindex')
      const nextTabindex = nextButton.getAttribute('tabindex')
      checks.navigation.buttonsKeyboardAccessible = prevTabindex !== '-1' && nextTabindex !== '-1'
    }

    // Check pagination dots
    const dotContainers = section.querySelectorAll(
      '.splide__pagination, .swiper-pagination, .glide__bullets, .flickity-page-dots, [role="tablist"], .dots, .pagination'
    )
    let dots = []

    // Find dot buttons
    const dotSelectors = [
      '[aria-label*="slide" i]',
      '[aria-label*="Go to" i]',
      '.splide__pagination__page',
      '.swiper-pagination-bullet',
      '.glide__bullet',
      '.flickity-page-dot',
      '.dot',
    ]

    for (const selector of dotSelectors) {
      const found = section.querySelectorAll(selector)
      // Filter to only small buttons that look like dots (not prev/next)
      const filtered = Array.from(found).filter((el) => {
        const text = el.textContent?.trim() || ''
        return text.length < 3 || el.classList.contains('dot') || el.classList.contains('bullet')
      })
      if (filtered.length > 1) {
        dots = filtered
        break
      }
    }

    if (dots.length > 0) {
      checks.pagination.hasDots = true
      checks.pagination.dotCount = dots.length

      // Check dot labels
      const dotLabels = dots.map((d) => d.getAttribute('aria-label')).filter(Boolean)
      checks.pagination.dotsHaveLabels = dotLabels.length === dots.length

      // Check current state indication
      const hasAriaCurrent = dots.some((d) => d.getAttribute('aria-current') === 'true')
      const hasAriaSelected = dots.some((d) => d.getAttribute('aria-selected') === 'true')
      const hasActiveClass = dots.some(
        (d) => d.classList.contains('active') || d.classList.contains('is-active') || d.classList.contains('current')
      )

      checks.pagination.dotsHaveCurrentState = hasAriaCurrent || hasAriaSelected || hasActiveClass
      if (hasAriaCurrent) {
        checks.pagination.currentStateMethod = 'aria-current'
      } else if (hasAriaSelected) {
        checks.pagination.currentStateMethod = 'aria-selected'
      } else if (hasActiveClass) {
        checks.pagination.currentStateMethod = 'class-only (not accessible)'
      }
    }

    // Check live region
    const liveRegion = section.querySelector('[aria-live], [role="status"], [role="log"]')
    if (liveRegion) {
      checks.liveRegion.hasLiveRegion = true
      checks.liveRegion.liveRegionRole = liveRegion.getAttribute('role')
      checks.liveRegion.ariaLive = liveRegion.getAttribute('aria-live')
      checks.liveRegion.ariaAtomic = liveRegion.getAttribute('aria-atomic')
    }

    // Check keyboard accessibility of controls
    const allControls = section.querySelectorAll('button, [role="button"]')
    const controlsNotInTabOrder = Array.from(allControls).filter((c) => c.getAttribute('tabindex') === '-1')
    checks.keyboard.controlsInTabOrder = controlsNotInTabOrder.length === 0

    return checks
  })

  return { id, version, checks: results }
}

function scoreChecks(checks) {
  let passed = 0
  let total = 0
  const issues = []

  // Structure (W3C: carousel should have role and label)
  total++
  if (checks.structure.hasCarouselContainer) {
    passed++
  } else {
    issues.push('Missing identifiable carousel container')
  }

  total++
  if (checks.structure.containerAriaLabel) {
    passed++
  } else {
    issues.push('Missing aria-label on carousel container')
  }

  // Optional but recommended
  if (checks.structure.containerAriaRoledescription === 'carousel') {
    // Bonus point but not required
  }

  // Slides
  total++
  if (checks.slides.count > 0) {
    passed++
  } else {
    issues.push('No slides detected')
  }

  // Navigation
  total++
  if (checks.navigation.hasPrevButton && checks.navigation.hasNextButton) {
    passed++
  } else {
    issues.push('Missing prev/next navigation buttons')
  }

  total++
  if (checks.navigation.buttonsKeyboardAccessible) {
    passed++
  } else {
    issues.push('Navigation buttons not keyboard accessible (tabindex=-1)')
  }

  // Pagination
  total++
  if (checks.pagination.hasDots) {
    passed++
  } else {
    issues.push('No pagination dots')
  }

  total++
  if (checks.pagination.dotsHaveLabels) {
    passed++
  } else if (checks.pagination.hasDots) {
    issues.push('Pagination dots missing aria-labels')
  }

  total++
  if (checks.pagination.currentStateMethod === 'aria-current' || checks.pagination.currentStateMethod === 'aria-selected') {
    passed++
  } else if (checks.pagination.hasDots) {
    issues.push(`Current slide indicated by ${checks.pagination.currentStateMethod || 'nothing'} (should use aria-current)`)
  }

  // Focus management
  total++
  if (checks.slides.hiddenSlidesFocusable.length === 0) {
    passed++
  } else {
    issues.push(`${checks.slides.hiddenSlidesFocusable.length} focusable elements in hidden slides (focus trap risk)`)
  }

  // Live region (optional but good)
  // Not counting against score, just noting

  return { passed, total, percentage: Math.round((passed / total) * 100), issues }
}

async function runAudit() {
  const browser = await chromium.launch()
  const allResults = []

  console.log('\n' + '═'.repeat(80))
  console.log('  W3C WAI CAROUSEL PATTERN MANUAL AUDIT')
  console.log('  Based on: https://www.w3.org/WAI/ARIA/apg/patterns/carousel/')
  console.log('═'.repeat(80) + '\n')

  for (const carousel of carousels) {
    for (const version of carousel.versions) {
      const context = await browser.newContext()
      const page = await context.newPage()

      console.log(`Auditing ${carousel.id} (${version})...`)
      const result = await auditCarousel(page, carousel.id, version)
      const score = scoreChecks(result.checks)
      result.score = score
      allResults.push(result)

      await context.close()
    }
  }

  await browser.close()

  // Print detailed results
  console.log('\n' + '─'.repeat(80))
  console.log('DETAILED W3C COMPLIANCE RESULTS')
  console.log('─'.repeat(80))

  for (const result of allResults) {
    const { checks, score } = result
    const status = score.percentage >= 80 ? '✅' : score.percentage >= 60 ? '⚠️' : '❌'

    console.log(`\n${status} ${result.id.toUpperCase()} (${result.version}) - ${score.passed}/${score.total} (${score.percentage}%)`)

    console.log('\n  Structure:')
    console.log(`    Container: ${checks.structure.hasCarouselContainer ? '✓' : '✗'}`)
    console.log(`    aria-label: ${checks.structure.containerAriaLabel || '✗ missing'}`)
    console.log(`    aria-roledescription: ${checks.structure.containerAriaRoledescription || '(not set)'}`)

    console.log('\n  Slides:')
    console.log(`    Count: ${checks.slides.count}`)
    console.log(`    role="group": ${checks.slides.hasSlideRole ? '✓' : '✗'}`)
    console.log(`    aria-roledescription="slide": ${checks.slides.hasSlideAriaRoledescription ? '✓' : '✗'}`)
    console.log(`    Slide labels: ${checks.slides.hasSlideLabels ? checks.slides.slideLabelPattern : '✗ missing'}`)
    console.log(`    Hidden slides aria-hidden: ${checks.slides.hiddenSlidesAriaHidden ? '✓' : '✗'}`)
    if (checks.slides.hiddenSlidesFocusable.length > 0) {
      console.log(`    ⚠️  Focusable in hidden: ${checks.slides.hiddenSlidesFocusable.length} elements`)
    }

    console.log('\n  Navigation:')
    console.log(`    Previous: ${checks.navigation.hasPrevButton ? `✓ "${checks.navigation.prevButtonLabel}"` : '✗'}`)
    console.log(`    Next: ${checks.navigation.hasNextButton ? `✓ "${checks.navigation.nextButtonLabel}"` : '✗'}`)
    console.log(`    Keyboard accessible: ${checks.navigation.buttonsKeyboardAccessible ? '✓' : '✗'}`)

    console.log('\n  Pagination:')
    console.log(`    Has dots: ${checks.pagination.hasDots ? `✓ (${checks.pagination.dotCount})` : '✗'}`)
    console.log(`    Dots labeled: ${checks.pagination.dotsHaveLabels ? '✓' : '✗'}`)
    console.log(`    Current state: ${checks.pagination.currentStateMethod || '✗ none'}`)

    console.log('\n  Live Region:')
    console.log(`    Has live region: ${checks.liveRegion.hasLiveRegion ? '✓' : '✗ (recommended)'}`)
    if (checks.liveRegion.hasLiveRegion) {
      console.log(`    aria-live: ${checks.liveRegion.ariaLive}`)
    }

    if (score.issues.length > 0) {
      console.log('\n  Issues:')
      score.issues.forEach((issue) => console.log(`    • ${issue}`))
    }
  }

  // Summary table
  console.log('\n' + '═'.repeat(80))
  console.log('W3C CAROUSEL PATTERN COMPLIANCE SUMMARY')
  console.log('═'.repeat(80))

  console.log('\n| Carousel | Version | Score | Container | Slides | Nav | Dots | Live | Issues |')
  console.log('|----------|---------|-------|-----------|--------|-----|------|------|--------|')

  for (const result of allResults) {
    const { checks, score } = result
    const container = checks.structure.containerAriaLabel ? '✓' : '✗'
    const slides = checks.slides.hasSlideLabels ? '✓' : '✗'
    const nav = checks.navigation.buttonsKeyboardAccessible ? '✓' : '✗'
    const dots = checks.pagination.currentStateMethod === 'aria-current' ? '✓' : checks.pagination.hasDots ? '~' : '✗'
    const live = checks.liveRegion.hasLiveRegion ? '✓' : '-'

    console.log(
      `| ${result.id.padEnd(10)} | ${result.version.padEnd(7)} | ${String(score.percentage + '%').padEnd(5)} | ${container.padEnd(9)} | ${slides.padEnd(6)} | ${nav.padEnd(3)} | ${dots.padEnd(4)} | ${live.padEnd(4)} | ${score.issues.length.toString().padEnd(6)} |`
    )
  }

  // Legend
  console.log('\nLegend: ✓ = compliant, ✗ = missing, ~ = partial, - = optional')

  // Final stats
  const excellent = allResults.filter((r) => r.score.percentage >= 80).length
  const good = allResults.filter((r) => r.score.percentage >= 60 && r.score.percentage < 80).length
  const poor = allResults.filter((r) => r.score.percentage < 60).length

  console.log(`\nTotal: ${excellent} excellent (≥80%), ${good} good (60-79%), ${poor} needs work (<60%)`)
  console.log('═'.repeat(80) + '\n')
}

runAudit().catch(console.error)
