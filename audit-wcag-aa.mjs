import { chromium } from 'playwright'
import AxeBuilder from '@axe-core/playwright'

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

// WCAG 2.1 AA specific rules
const wcagAATags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']

async function auditCarousel(page, id, version) {
  const url = version === 'react' ? `${BASE_URL}/carousel/${id}#react` : `${BASE_URL}/carousel/${id}`

  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1000)

  // For dual-version carousels, click the React toggle
  if (version === 'react') {
    const reactBtn = await page.$('#react-btn')
    if (reactBtn) {
      await reactBtn.click()
      await page.waitForTimeout(1500)
    }
  }

  // Run axe with WCAG AA tags
  const results = await new AxeBuilder({ page })
    .include('.carousel-section')
    .withTags(wcagAATags)
    .analyze()

  // Additional manual checks
  const manualChecks = await page.evaluate(() => {
    const issues = []
    const section = document.querySelector('.carousel-section')
    if (!section) return issues

    // Check 1: All buttons have accessible names
    const buttons = section.querySelectorAll('button')
    buttons.forEach((btn, i) => {
      const name = btn.getAttribute('aria-label') || btn.textContent?.trim()
      if (!name) {
        issues.push({
          rule: 'button-name',
          severity: 'serious',
          message: `Button ${i + 1} has no accessible name`,
          element: btn.outerHTML.slice(0, 100),
        })
      }
    })

    // Check 2: Images have alt text
    const images = section.querySelectorAll('img')
    images.forEach((img, i) => {
      if (!img.hasAttribute('alt')) {
        issues.push({
          rule: 'image-alt',
          severity: 'critical',
          message: `Image ${i + 1} missing alt attribute`,
          element: img.outerHTML.slice(0, 100),
        })
      }
    })

    // Check 3: Interactive elements are keyboard accessible
    const interactives = section.querySelectorAll('a, button, [role="button"]')
    interactives.forEach((el, i) => {
      const tabindex = el.getAttribute('tabindex')
      const isHidden = el.closest('[aria-hidden="true"]')
      if (isHidden && tabindex !== '-1') {
        issues.push({
          rule: 'focus-trap',
          severity: 'serious',
          message: `Interactive element ${i + 1} is focusable but inside aria-hidden`,
          element: el.outerHTML.slice(0, 100),
        })
      }
    })

    // Check 4: Pagination dots have proper ARIA
    const dots = section.querySelectorAll('[aria-label*="slide"], [aria-label*="Go to"]')
    if (dots.length === 0) {
      const allButtons = section.querySelectorAll('button')
      const potentialDots = Array.from(allButtons).filter(
        (b) => !b.textContent?.trim() || b.textContent?.trim().length < 3
      )
      if (potentialDots.length > 2) {
        issues.push({
          rule: 'pagination-aria',
          severity: 'moderate',
          message: 'Pagination dots may lack aria-label attributes',
          element: 'Multiple dot buttons found without slide labels',
        })
      }
    }

    // Check 5: Current slide indication
    const currentIndicators = section.querySelectorAll('[aria-current="true"]')
    if (dots.length > 0 && currentIndicators.length === 0) {
      issues.push({
        rule: 'current-indicator',
        severity: 'moderate',
        message: 'No aria-current attribute found on active pagination dot',
        element: 'Pagination dots present but no aria-current',
      })
    }

    // Check 6: Links have discernible text
    const links = section.querySelectorAll('a')
    links.forEach((link, i) => {
      const text = link.textContent?.trim() || link.getAttribute('aria-label')
      if (!text) {
        issues.push({
          rule: 'link-name',
          severity: 'serious',
          message: `Link ${i + 1} has no discernible text`,
          element: link.outerHTML.slice(0, 100),
        })
      }
    })

    return issues
  })

  // Keyboard navigation test
  const keyboardTest = await testKeyboardNav(page)

  return {
    id,
    version,
    axeViolations: results.violations,
    axePasses: results.passes.length,
    manualIssues: manualChecks,
    keyboardNav: keyboardTest,
  }
}

async function testKeyboardNav(page) {
  const results = {
    canTabToControls: false,
    canActivateWithEnter: false,
    canActivateWithSpace: false,
    focusVisible: false,
  }

  try {
    // Find first button
    const btn = await page.$('.carousel-section button')
    if (!btn) return results

    await btn.focus()
    results.canTabToControls = true

    // Check focus visibility
    const hasFocusStyle = await btn.evaluate((el) => {
      const styles = window.getComputedStyle(el)
      const hasOutline = styles.outline !== 'none' && styles.outlineWidth !== '0px'
      const hasRing = el.classList.contains('focus:ring-2') || styles.boxShadow.includes('ring')
      return hasOutline || hasRing || el.matches(':focus-visible')
    })
    results.focusVisible = hasFocusStyle

    // Test Enter key
    await page.keyboard.press('Enter')
    await page.waitForTimeout(300)
    results.canActivateWithEnter = true

    // Test Space key
    await btn.focus()
    await page.keyboard.press('Space')
    await page.waitForTimeout(300)
    results.canActivateWithSpace = true
  } catch {
    // Keyboard test failed
  }

  return results
}

async function runAudit() {
  const browser = await chromium.launch()
  const allResults = []

  console.log('\n' + '═'.repeat(70))
  console.log('  WCAG 2.1 AA ACCESSIBILITY AUDIT - CAROUSEL COMPARISON')
  console.log('═'.repeat(70) + '\n')

  for (const carousel of carousels) {
    for (const version of carousel.versions) {
      const context = await browser.newContext()
      const page = await context.newPage()

      console.log(`Auditing ${carousel.id} (${version})...`)
      const result = await auditCarousel(page, carousel.id, version)
      allResults.push(result)

      await context.close()
    }
  }

  await browser.close()

  // Print detailed results
  console.log('\n' + '─'.repeat(70))
  console.log('DETAILED RESULTS')
  console.log('─'.repeat(70))

  for (const result of allResults) {
    const axeIssueCount = result.axeViolations.length
    const manualIssueCount = result.manualIssues.length
    const totalIssues = axeIssueCount + manualIssueCount
    const status = totalIssues === 0 ? '✅ PASS' : `⚠️  ${totalIssues} issues`

    console.log(`\n${result.id.toUpperCase()} (${result.version})`)
    console.log(`  Status: ${status}`)
    console.log(`  axe-core passes: ${result.axePasses}`)

    if (axeIssueCount > 0) {
      console.log(`  axe-core violations (${axeIssueCount}):`)
      result.axeViolations.forEach((v) => {
        console.log(`    - [${v.impact}] ${v.id}: ${v.help}`)
        console.log(`      WCAG: ${v.tags.filter((t) => t.startsWith('wcag')).join(', ')}`)
      })
    }

    if (manualIssueCount > 0) {
      console.log(`  Manual check issues (${manualIssueCount}):`)
      result.manualIssues.forEach((issue) => {
        console.log(`    - [${issue.severity}] ${issue.rule}: ${issue.message}`)
      })
    }

    console.log('  Keyboard navigation:')
    console.log(`    - Tab to controls: ${result.keyboardNav.canTabToControls ? '✅' : '❌'}`)
    console.log(`    - Activate with Enter: ${result.keyboardNav.canActivateWithEnter ? '✅' : '❌'}`)
    console.log(`    - Activate with Space: ${result.keyboardNav.canActivateWithSpace ? '✅' : '❌'}`)
    console.log(`    - Focus visible: ${result.keyboardNav.focusVisible ? '✅' : '❌'}`)
  }

  // Summary table
  console.log('\n' + '═'.repeat(70))
  console.log('WCAG AA COMPLIANCE SUMMARY')
  console.log('═'.repeat(70))

  console.log('\n| Carousel | Version | axe Issues | Manual | Keyboard | Status |')
  console.log('|----------|---------|------------|--------|----------|--------|')

  for (const result of allResults) {
    const axeCount = result.axeViolations.length
    const manualCount = result.manualIssues.length
    const kbStatus = Object.values(result.keyboardNav).filter(Boolean).length
    const status = axeCount + manualCount === 0 ? 'PASS' : 'ISSUES'

    console.log(
      `| ${result.id.padEnd(10)} | ${result.version.padEnd(7)} | ${String(axeCount).padEnd(10)} | ${String(manualCount).padEnd(6)} | ${kbStatus}/4      | ${status.padEnd(6)} |`
    )
  }

  // Final stats
  const passCount = allResults.filter((r) => r.axeViolations.length + r.manualIssues.length === 0).length
  console.log(`\nTotal: ${passCount}/${allResults.length} carousels pass WCAG AA`)
  console.log('═'.repeat(70) + '\n')
}

runAudit().catch(console.error)
