# Gallery Block Performance Optimization: Lazy Loading & Intersection Observer

## Branch Name Recommendation

### Primary Branch

```
perf/block-gallery-lazy-loading
```

**Rationale:**
- **Type**: `perf/` — Indicates performance optimization work
- **Component**: `block-gallery` — Clearly identifies the gallery block
- **Feature**: `lazy-loading` — Describes the specific optimization (Intersection Observer-based)
- **Format**: Follows LightSpeed WP conventions: lowercase, hyphens, no underscores

### Alternative Names (If Needed)

```
perf/block-gallery-intersection-observer        # More technical, if desired
perf/block-gallery-image-lazy-load             # Emphasizes image optimization
perf/block-gallery-render-optimization        # Broader scope if refactoring render logic
```

**Use alternative only if:** 
- You're also refactoring core render logic beyond lazy loading
- Your performance gains come primarily from other optimizations (e.g., image srcset generation)

---

## Performance Benchmarking Strategy

### Phase 1: Baseline Measurements (Pre-Implementation)

Run these benchmarks **before** modifying code:

#### 1.1 Load Time Metrics

```bash
# Measure Time to Interactive (TTI) and First Contentful Paint (FCP)
# Using Lighthouse via npm package
npm install --save-dev lighthouse

# Create: scripts/benchmark-gallery.js
lighthouse "http://localhost:3000/gallery-page" \
  --output-path=reports/baseline.json \
  --output=json \
  --chrome-flags="--headless --disable-gpu"
```

**Capture:**
- Largest Contentful Paint (LCP): < 2.5s target
- First Input Delay (FID): < 100ms target
- Cumulative Layout Shift (CLS): < 0.1 target
- Total blocking time (TBT)
- JavaScript execution time

#### 1.2 Image Load Waterfall

```javascript
// Create: scripts/measure-image-load.js
// Measure when each image begins/completes loading

const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.initiatorType === 'img') {
      console.log(`Image: ${entry.name}`);
      console.log(`  Duration: ${entry.duration}ms`);
      console.log(`  Transfer Size: ${entry.transferSize} bytes`);
    }
  }
});

observer.observe({ entryTypes: ['resource'] });
```

**Metrics to capture:**
- Time to first image load
- Time to last image load
- Number of concurrent image requests
- Total image download time
- Memory consumption during load

#### 1.3 Gallery Block Render Performance

```javascript
// Create: scripts/measure-render.js
// Measure edit/save performance during gallery load

performance.mark('gallery-render-start');
// Load gallery block...
performance.mark('gallery-render-end');
performance.measure(
  'gallery-render',
  'gallery-render-start',
  'gallery-render-end'
);

const measure = performance.getEntriesByName('gallery-render')[0];
console.log(`Render time: ${measure.duration}ms`);
console.log(`Memory: ${performance.memory?.usedJSHeapSize / 1e6}MB`);
```

**Document:**
- Block edit mode render time (with 50 images)
- Block save performance
- DOM node count
- Memory usage

#### 1.4 Stored Baseline Report

```markdown
# Baseline Benchmark Report
Date: 2026-11-01
Gallery Images: 50+

## Page Metrics
- Lighthouse Score: XX/100
- LCP: XXms
- FCP: XXms
- CLS: X.XX
- TTI: XXms

## Image Loading
- First image load: XXms
- All images loaded: XXms
- Total image size: XXMb
- Concurrent requests: X

## Block Performance
- Edit mode render: XXms
- Save performance: XXms
- DOM nodes: X,XXX
- Memory: XXMb
```

---

### Phase 2: Implementation Measurements (During Development)

Use React Profiler to track component performance:

```javascript
// Create: scripts/measure-intersection-observer.js
import React, { Profiler } from 'react';

const GalleryWithProfiler = () => (
  <Profiler id="gallery-lazy-load" onRender={onRenderCallback}>
    <GalleryBlock />
  </Profiler>
);

function onRenderCallback(id, phase, actualDuration, baseDuration, startTime, commitTime) {
  console.log(`
    Gallery Block (${phase}):
    - Render time: ${actualDuration}ms
    - Base duration: ${baseDuration}ms
    - Started at: ${startTime}ms
    - Committed at: ${commitTime}ms
  `);
}
```

Track during implementation:
- Render time with lazy loading enabled/disabled
- Intersection Observer callback frequency
- Number of DOM reflows triggered by image loads
- Memory growth as images load

---

### Phase 3: Post-Implementation Comparison

```bash
# Run same Lighthouse audit after implementation
lighthouse "http://localhost:3000/gallery-page" \
  --output-path=reports/optimized.json

# Generate comparison report
node scripts/compare-benchmarks.js reports/baseline.json reports/optimized.json
```

**Compare:**
- LCP improvement (target: -30% minimum)
- FCP improvement (target: -20% minimum)
- TTI improvement (target: -25% minimum)
- Image load time reduction
- Memory efficiency
- JavaScript execution time reduction

#### Comparison Report Template

```markdown
# Performance Improvement Report
Branch: perf/block-gallery-lazy-loading

## Results Summary
| Metric | Baseline | Optimized | Improvement |
|--------|----------|-----------|-------------|
| LCP    | XXXms    | XXXms     | -XX%        |
| FCP    | XXXms    | XXXms     | -XX%        |
| TTI    | XXXms    | XXXms     | -XX%        |
| First Image Load | XXXms | XXXms | -XX% |
| Total Image Load | XXXms | XXXms | -XX% |

## Intersection Observer Metrics
- Observer active time: X ms
- Images observed: 50+
- Load events triggered: X
- Unload/re-observe: X times
- Memory overhead: + X MB

## Browser Compatibility
- Chrome 51+: ✅
- Firefox 55+: ✅
- Safari 12.1+: ✅
- IE 11: Polyfill required
```

---

### Phase 4: Long-Term Monitoring

Create a performance budget:

```javascript
// Create: lighthouse-budget.json
{
  "resourceBudgets": [
    {
      "resourceType": "image",
      "budget": 5242880  // 5MB total images
    },
    {
      "resourceType": "script",
      "budget": 204800   // 200KB JS
    }
  ],
  "timingBudgets": [
    {
      "metric": "first-contentful-paint",
      "budget": 1600
    },
    {
      "metric": "interactive",
      "budget": 3600
    }
  ]
}
```

---

## Testing Approach

### Testing Strategy by Category

#### 1. Unit Tests (Jest) — 85%+ Coverage Required

```javascript
// Create: __tests__/useIntersectionObserver.test.js
import { renderHook, act } from '@testing-library/react-hooks';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

describe('useIntersectionObserver', () => {
  it('should observe element and call callback when visible', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => 
      useIntersectionObserver(callback, { threshold: 0.1 })
    );

    // Mock IntersectionObserver
    const mockObserve = jest.fn();
    const mockUnobserve = jest.fn();
    
    global.IntersectionObserver = jest.fn(() => ({
      observe: mockObserve,
      unobserve: mockUnobserve,
      disconnect: jest.fn(),
    }));

    act(() => {
      const element = document.createElement('img');
      result.current.observe(element);
    });

    expect(mockObserve).toHaveBeenCalled();
  });

  it('should handle lazy loading state transitions', () => {
    const { result } = renderHook(() => useIntersectionObserver());
    
    expect(result.current.isLoaded).toBe(false);
    
    act(() => {
      result.current.handleIntersection(true);
    });
    
    expect(result.current.isLoaded).toBe(true);
  });

  it('should cleanup observers on unmount', () => {
    const mockDisconnect = jest.fn();
    global.IntersectionObserver = jest.fn(() => ({
      disconnect: mockDisconnect,
    }));

    const { unmount } = renderHook(() => useIntersectionObserver());
    
    unmount();
    
    expect(mockDisconnect).toHaveBeenCalled();
  });
});
```

**Unit Test Coverage Checklist:**
- ✅ Intersection Observer initialization
- ✅ Threshold triggers and callbacks
- ✅ Lazy load state management
- ✅ Image src/srcset swapping
- ✅ Error handling (failed image loads)
- ✅ Cleanup on unmount
- ✅ Performance: no memory leaks
- ✅ Polyfill detection and fallback

---

#### 2. Visual Regression Tests (Playwright)

```javascript
// Create: e2e/gallery-lazy-loading.spec.js
import { test, expect } from '@playwright/test';

test.describe('Gallery Block - Lazy Loading', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/gallery-page');
    await page.waitForLoadState('networkidle');
  });

  test('should render gallery with placeholder images initially', async ({ page }) => {
    const gallery = page.locator('[data-wp-block="gallery"]');
    const images = gallery.locator('img[data-src]');
    
    // Initially, data-src should contain actual image URL
    // src should be placeholder (low-quality or small preview)
    const firstImage = images.first();
    const src = await firstImage.getAttribute('src');
    const dataSrc = await firstImage.getAttribute('data-src');
    
    expect(src).toMatch(/placeholder|blur|thumb/i);
    expect(dataSrc).toContain('image');
  });

  test('should lazy load images as they enter viewport', async ({ page }) => {
    const gallery = page.locator('[data-wp-block="gallery"]');
    const images = gallery.locator('img[data-src]');
    
    // Scroll to middle of gallery
    await images.nth(25).scrollIntoViewIfNeeded();
    await page.waitForTimeout(300); // Wait for Intersection Observer
    
    // Image should now have src loaded
    const middleImage = images.nth(25);
    const src = await middleImage.getAttribute('src');
    const dataSrc = await middleImage.getAttribute('data-src');
    
    expect(src).toBe(dataSrc);
  });

  test('should handle rapid scrolling without loading duplicate images', async ({ page }) => {
    let imageLoadCount = 0;
    page.on('response', response => {
      if (response.url().includes('/image') && response.status() === 200) {
        imageLoadCount++;
      }
    });
    
    const gallery = page.locator('[data-wp-block="gallery"]');
    
    // Rapid scroll
    await gallery.evaluate(el => {
      el.scrollIntoView({ behavior: 'instant' });
    });
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.evaluate(() => window.scrollBy(0, -400));
    await page.evaluate(() => window.scrollBy(0, 600));
    
    await page.waitForTimeout(1000);
    
    // Should not load duplicate images
    expect(imageLoadCount).toBeLessThan(60); // 50 images + buffer
  });

  test('should load all images by end of scroll', async ({ page }) => {
    const gallery = page.locator('[data-wp-block="gallery"]');
    const images = gallery.locator('img[data-src]');
    
    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    
    // All images should be loaded
    const loadedImages = await images.evaluate(elements => {
      return elements.filter(img => img.src === img.getAttribute('data-src')).length;
    });
    
    const totalImages = await images.count();
    expect(loadedImages).toBe(totalImages);
  });

  test('should maintain image aspect ratio during lazy load', async ({ page }) => {
    await page.goto('http://localhost:3000/gallery-page');
    await page.waitForLoadState('networkidle');
    
    const gallery = page.locator('[data-wp-block="gallery"]');
    const images = gallery.locator('img[data-src]');
    
    const beforeHeight = await images.first().boundingBox();
    
    // Scroll image into view to load it
    await images.nth(0).scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    
    const afterHeight = await images.first().boundingBox();
    
    // Height should remain consistent (no layout shift)
    expect(Math.abs(beforeHeight.height - afterHeight.height)).toBeLessThan(5);
  });

  test('should handle failed image loads gracefully', async ({ page }) => {
    // Simulate network error on one image
    await page.route('**/image-*.jpg', route => {
      if (route.request().url().includes('image-25')) {
        route.abort();
      } else {
        route.continue();
      }
    });
    
    const gallery = page.locator('[data-wp-block="gallery"]');
    const images = gallery.locator('img[data-src]');
    
    // Scroll to load images
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    
    // Gallery should still render; failed image should show fallback
    const failedImage = images.nth(25);
    const altText = await failedImage.getAttribute('alt');
    expect(altText).toBeTruthy();
  });

  test('visual: gallery layout should not shift during lazy load', async ({ page }) => {
    const gallery = page.locator('[data-wp-block="gallery"]');
    
    // Take screenshot before scroll
    await expect(gallery).toHaveScreenshot('gallery-initial.png');
    
    // Scroll and load images
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(1000);
    
    // Visual layout should be identical
    await expect(gallery).toHaveScreenshot('gallery-after-scroll.png', {
      maxDiffPixels: 50, // Allow minimal pixel differences
    });
  });
});
```

---

#### 3. Accessibility Tests (WCAG 2.2 AAA)

```javascript
// Create: e2e/gallery-a11y.spec.js
import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test.describe('Gallery Block - Accessibility (WCAG 2.2 AAA)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/gallery-page');
    await injectAxe(page);
  });

  test('should have no accessibility violations', async ({ page }) => {
    await checkA11y(page, '[data-wp-block="gallery"]', {
      standards: 'wcag22aa',
    });
  });

  test('should provide alt text for all images', async ({ page }) => {
    const images = page.locator('[data-wp-block="gallery"] img');
    
    for (let i = 0; i < await images.count(); i++) {
      const altText = await images.nth(i).getAttribute('alt');
      expect(altText).toBeTruthy();
      expect(altText.length).toBeGreaterThan(0);
    }
  });

  test('should support keyboard navigation', async ({ page }) => {
    const gallery = page.locator('[data-wp-block="gallery"]');
    const firstImage = gallery.locator('img').first();
    
    // Tab to first image
    await page.keyboard.press('Tab');
    
    // Should be keyboard accessible
    const isFocused = await firstImage.evaluate(el => 
      el === document.activeElement || el.tabIndex >= 0
    );
    expect(isFocused).toBe(true);
  });

  test('should respect prefers-reduced-motion', async ({ page }) => {
    // Emulate reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    
    const gallery = page.locator('[data-wp-block="gallery"]');
    const images = gallery.locator('img');
    
    // Scroll to trigger lazy load
    await images.nth(25).scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    
    // Images should load without animations
    const hasTransition = await images.nth(25).evaluate(el => {
      return window.getComputedStyle(el).transition !== 'none';
    });
    
    expect(hasTransition).toBe(false);
  });

  test('should announce image load progress to screen readers', async ({ page }) => {
    const ariaLive = page.locator('[aria-live="polite"]');
    
    // Scroll gallery
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(300);
    
    // Should have live region update
    const liveText = await ariaLive.innerText();
    expect(liveText).toMatch(/loaded|loading|image/i);
  });
});
```

---

#### 4. Performance Tests (Lighthouse)

```javascript
// Create: e2e/gallery-performance.spec.js
import { test, expect } from '@playwright/test';

test.describe('Gallery Block - Performance (Core Web Vitals)', () => {
  test('should meet Core Web Vitals thresholds', async ({ page }) => {
    await page.goto('http://localhost:3000/gallery-page');
    
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      const paint = performance.getEntriesByType('paint');
      
      return {
        // LCP: 2.5s target
        lcp: performance.getEntriesByType('largest-contentful-paint').pop()?.renderTime,
        // FCP: 1.8s target
        fcp: paint.find(p => p.name === 'first-contentful-paint')?.startTime,
        // CLS: 0.1 target
        cls: performance.getEntriesByType('layout-shift')
          .reduce((sum, shift) => sum + shift.value, 0),
      };
    });
    
    expect(metrics.lcp).toBeLessThan(2500); // milliseconds
    expect(metrics.fcp).toBeLessThan(1800);
    expect(metrics.cls).toBeLessThan(0.1);
  });

  test('should not cause excessive layout shifts', async ({ page }) => {
    let layoutShifts = 0;
    
    page.on('console', msg => {
      if (msg.type() === 'warn' && msg.text().includes('layout-shift')) {
        layoutShifts++;
      }
    });
    
    // Scroll gallery
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    
    await page.waitForTimeout(1000);
    
    // Lazy loading shouldn't cause excessive shifts (< 0.1 total)
    const cls = await page.evaluate(() => {
      return performance.getEntriesByType('layout-shift')
        .reduce((sum, shift) => sum + shift.value, 0);
    });
    
    expect(cls).toBeLessThan(0.1);
  });

  test('should load images efficiently (respects image hints)', async ({ page }) => {
    const requests = [];
    
    page.on('request', request => {
      if (request.resourceType() === 'image') {
        requests.push({
          url: request.url(),
          priority: request.method(),
        });
      }
    });
    
    await page.goto('http://localhost:3000/gallery-page');
    await page.waitForLoadState('networkidle');
    
    // Should not load all images immediately
    const initialRequests = requests.length;
    expect(initialRequests).toBeLessThan(15); // Should load < 15 images initially
  });
});
```

---

### Testing Checklist

#### Pre-Implementation
- [ ] Baseline Lighthouse audit recorded
- [ ] Image load waterfall captured
- [ ] Block render performance measured
- [ ] Memory baseline documented

#### Unit Tests
- [ ] Intersection Observer hook tests (Jest)
- [ ] Lazy load state transitions
- [ ] Image src/srcset swapping
- [ ] Error handling for failed loads
- [ ] Memory leak prevention
- [ ] Polyfill detection
- [ ] Coverage: 85%+

#### Integration Tests (Playwright)
- [ ] Placeholder images render initially
- [ ] Images lazy load on scroll
- [ ] No duplicate image loads on rapid scroll
- [ ] All images loaded by end of scroll
- [ ] Image aspect ratio maintained
- [ ] Failed images handled gracefully
- [ ] No visual layout shift (CLS < 0.1)

#### Accessibility Tests (WCAG 2.2 AAA)
- [ ] No Axe violations
- [ ] All images have alt text
- [ ] Keyboard navigation works
- [ ] Prefers-reduced-motion respected
- [ ] Screen reader announcements
- [ ] ARIA labels correct
- [ ] Focus management

#### Performance Tests
- [ ] LCP < 2.5s
- [ ] FCP < 1.8s
- [ ] CLS < 0.1
- [ ] No excessive layout shifts
- [ ] Intersection Observer overhead minimal
- [ ] Memory growth < 10% with 50+ images

#### Browser Compatibility
- [ ] Chrome 51+ (native Intersection Observer)
- [ ] Firefox 55+
- [ ] Safari 12.1+
- [ ] Edge 16+
- [ ] IE 11 with polyfill

---

## Implementation Checklist

### Code Quality
- [ ] WordPress Coding Standards pass (PHP)
- [ ] ESLint passes (JavaScript/JSX)
- [ ] Prettier formatting applied
- [ ] No console errors/warnings
- [ ] No TypeScript errors

### Testing
- [ ] Jest unit tests: 85%+ coverage
- [ ] Playwright E2E tests passing
- [ ] Accessibility audit passing (WCAG 2.2 AAA)
- [ ] Performance benchmarks documented
- [ ] Browser compatibility verified

### Documentation
- [ ] Code comments for Intersection Observer logic
- [ ] JSDoc for exported functions
- [ ] README updated with lazy-loading docs
- [ ] CHANGELOG.md entry added
- [ ] Performance improvements documented

### Performance
- [ ] Baseline → Optimized comparison complete
- [ ] LCP improvement: -30% minimum
- [ ] No layout shift regression
- [ ] Memory overhead < 10%

### CI/CD
- [ ] GitHub Actions workflow passes
- [ ] Bundle size check passes
- [ ] No lint errors
- [ ] All tests green

---

## CI/CD Automation for This Branch

When you push this branch, GitHub Actions should automatically:

```yaml
# .github/workflows/block-gallery-performance.yml
name: Gallery Block Performance Tests

on:
  push:
    branches: [perf/block-gallery-*]
  pull_request:
    branches: [develop, main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run lint

  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:unit -- --coverage
      - uses: codecov/codecov-action@v3

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - run: npm run test:e2e

  a11y-audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:a11y

  performance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - run: npm run benchmark
      - uses: actions/upload-artifact@v3
        with:
          name: lighthouse-reports
          path: reports/
```

---

## Summary

| Aspect | Recommendation |
|--------|-----------------|
| **Branch Name** | `perf/block-gallery-lazy-loading` |
| **Benchmarking** | Lighthouse + custom Intersection Observer metrics |
| **Target Metrics** | LCP -30%, FCP -20%, TTI -25% |
| **Unit Tests** | Jest, 85%+ coverage |
| **E2E Tests** | Playwright (scroll, load, layout shift) |
| **Accessibility** | WCAG 2.2 AAA with Axe |
| **Performance Tests** | Core Web Vitals monitoring |
| **Browser Support** | Chrome 51+, Firefox 55+, Safari 12.1+, IE 11 (polyfill) |
| **Estimated PR Review Time** | 2-3 days with performance validation |

---

## Next Steps

1. **Create branch**: `git checkout -b perf/block-gallery-lazy-loading`
2. **Run baseline**: `npm run benchmark`
3. **Implement lazy loading** with Intersection Observer
4. **Write tests** (unit + E2E + a11y)
5. **Compare performance**: `npm run benchmark:compare`
6. **Create PR** with performance report
7. **Merge** after CI passes and peer review complete

---

**Questions?** Refer to:
- WordPress block API: https://developer.wordpress.org/block-editor/reference-guides/
- Intersection Observer: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
- WCAG 2.2 AAA: https://www.w3.org/WAI/WCAG22/quickref/
- LightSpeed WP standards: See linked repository
