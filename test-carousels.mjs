import { chromium } from 'playwright'
import AxeBuilder from '@axe-core/playwright'

// Carousels with both vanilla and React versions
const dualVersionCarousels = ['embla', 'flicking', 'swiper', 'splide', 'keen']

// Vanilla-only carousels
const vanillaOnlyCarousels = ['siema', 'flickity', 'tiny', 'glide']

// React-only carousels
const reactOnlyCarousels = ['react-slick', 'react-responsive']

const BASE_URL = 'http://localhost:4321'

async function testCarouselVersion(page, id, version) {
  const consoleErrors = []
  const consoleWarnings = []

  const consoleHandler = (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text())
    } else if (msg.type() === 'warning') {
      consoleWarnings.push(msg.text())
    }
  }

  const errorHandler = (err) => {
    consoleErrors.push(err.message)
  }

  page.on('console', consoleHandler)
  page.on('pageerror', errorHandler)

  try {
    // Navigate to carousel page
    const url =
      version === 'react' ? `${BASE_URL}/carousel/${id}#react` : `${BASE_URL}/carousel/${id}`
    await page.goto(url, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1000)

    // For dual-version carousels, click the appropriate toggle
    if (version === 'react' && dualVersionCarousels.includes(id)) {
      const reactBtn = await page.$('#react-btn')
      if (reactBtn) {
        await reactBtn.click()
        await page.waitForTimeout(1500) // Wait for React component to hydrate
      }
    }

    // Check if carousel section exists
    const hasSection = (await page.$('.carousel-section')) !== null

    // Check which container is visible
    const containerSelector = version === 'react' ? '#react-container' : '#vanilla-container'
    const container = await page.$(containerSelector)
    const isContainerVisible = container
      ? await container.evaluate((el) => !el.classList.contains('hidden'))
      : version === 'react'
        ? reactOnlyCarousels.includes(id)
        : true

    // Run axe accessibility tests on the visible container
    let axeResults = { violations: [] }
    try {
      axeResults = await new AxeBuilder({ page }).include('.carousel-section').analyze()
    } catch (axeErr) {
      console.log(`   axe error for ${id} (${version}): ${axeErr.message}`)
    }

    // Test keyboard navigation
    let keyboardWorks = false
    try {
      // Find prev/next buttons in the visible container
      const prevBtn = await page.$(`${containerSelector} button:has-text("Previous")`)
      const nextBtn = await page.$(`${containerSelector} button:has-text("Next")`)

      if (prevBtn || nextBtn) {
        const btn = nextBtn || prevBtn
        await btn.focus()
        await page.keyboard.press('Enter')
        await page.waitForTimeout(500)
        keyboardWorks = true
      }
    } catch {
      // Keyboard test failed
    }

    return {
      id,
      version,
      success: hasSection && isContainerVisible && consoleErrors.length === 0,
      hasSection,
      isContainerVisible,
      consoleErrors: [...consoleErrors],
      consoleWarnings: [...consoleWarnings],
      axeViolations: axeResults.violations,
      keyboardWorks,
    }
  } catch (err) {
    return {
      id,
      version,
      success: false,
      hasSection: false,
      isContainerVisible: false,
      consoleErrors: [err.message],
      consoleWarnings: [],
      axeViolations: [],
      keyboardWorks: false,
    }
  } finally {
    page.removeListener('console', consoleHandler)
    page.removeListener('pageerror', errorHandler)
  }
}

async function testCarousels() {
  const browser = await chromium.launch()
  const results = []

  // Test vanilla-only carousels
  for (const id of vanillaOnlyCarousels) {
    const context = await browser.newContext()
    const page = await context.newPage()
    const result = await testCarouselVersion(page, id, 'vanilla')
    results.push(result)
    await context.close()
  }

  // Test dual-version carousels (both vanilla and React)
  for (const id of dualVersionCarousels) {
    // Test vanilla version
    const vanillaContext = await browser.newContext()
    const vanillaPage = await vanillaContext.newPage()
    const vanillaResult = await testCarouselVersion(vanillaPage, id, 'vanilla')
    results.push(vanillaResult)
    await vanillaContext.close()

    // Test React version
    const reactContext = await browser.newContext()
    const reactPage = await reactContext.newPage()
    const reactResult = await testCarouselVersion(reactPage, id, 'react')
    results.push(reactResult)
    await reactContext.close()
  }

  // Test React-only carousels
  for (const id of reactOnlyCarousels) {
    const context = await browser.newContext()
    const page = await context.newPage()
    const result = await testCarouselVersion(page, id, 'react')
    results.push(result)
    await context.close()
  }

  await browser.close()

  // Print results
  console.log('\n╔══════════════════════════════════════════════════════════════╗')
  console.log('║           CAROUSEL ACCESSIBILITY TEST RESULTS                ║')
  console.log('╚══════════════════════════════════════════════════════════════╝\n')

  // Group results by carousel
  const groupedResults = {}
  for (const r of results) {
    if (!groupedResults[r.id]) {
      groupedResults[r.id] = []
    }
    groupedResults[r.id].push(r)
  }

  for (const [id, versions] of Object.entries(groupedResults)) {
    console.log(`\n📦 ${id}`)
    console.log('─'.repeat(60))

    for (const r of versions) {
      const loadStatus = r.success ? '✅' : '❌'
      const a11yStatus = r.axeViolations.length === 0 ? '✅' : `⚠️  ${r.axeViolations.length} issues`
      const kbStatus = r.keyboardWorks ? '✅' : '❓'

      console.log(`  ${r.version.toUpperCase()}:`)
      console.log(`    ${loadStatus} Load: ${r.success ? 'OK' : 'FAILED'}`)
      console.log(`    ${a11yStatus} A11y`)
      console.log(`    ${kbStatus} Keyboard`)

      if (r.consoleErrors.length > 0) {
        console.log('    Console Errors:')
        r.consoleErrors.slice(0, 3).forEach((e) => console.log(`      - ${e.slice(0, 100)}`))
        if (r.consoleErrors.length > 3) {
          console.log(`      ... and ${r.consoleErrors.length - 3} more`)
        }
      }

      if (r.axeViolations.length > 0) {
        console.log('    A11y Violations:')
        r.axeViolations.forEach((v) => {
          console.log(`      - [${v.impact}] ${v.id}: ${v.help}`)
          v.nodes.slice(0, 2).forEach((n) => {
            console.log(`        Target: ${n.target[0]}`)
          })
        })
      }
    }
  }

  // Summary
  const totalTests = results.length
  const passed = results.filter((r) => r.success).length
  const a11yClean = results.filter((r) => r.axeViolations.length === 0).length
  const kbWorks = results.filter((r) => r.keyboardWorks).length

  console.log('\n═══════════════════════════════════════════════════════════════')
  console.log(`Total Tests: ${totalTests}`)
  console.log(`  Vanilla: ${vanillaOnlyCarousels.length + dualVersionCarousels.length}`)
  console.log(`  React: ${reactOnlyCarousels.length + dualVersionCarousels.length}`)
  console.log('')
  console.log(`Loaded Successfully: ${passed}/${totalTests}`)
  console.log(`No A11y Issues: ${a11yClean}/${totalTests}`)
  console.log(`Keyboard Navigation: ${kbWorks}/${totalTests}`)
  console.log('═══════════════════════════════════════════════════════════════\n')

  // Exit with error code if any failures
  if (passed < totalTests) {
    process.exit(1)
  }
}

testCarousels().catch((err) => {
  console.error('Test failed:', err)
  process.exit(1)
})
