# Gallery Block Performance Optimization: Lazy Loading Implementation Guide

## Branch Naming Convention

### Recommended Branch Name
```
feature/gallery-lazy-loading-intersection-observer
```

**Alternative formats** (per LightSpeed conventions):
- `feature/perf-gallery-lazy-load-50plus-images`
- `perf/gallery-intersection-observer`
- `feat/gallery-lazy-load-io`

**Rationale:**
- Prefix: `feature/` or `perf/` indicates enhancement/performance work
- Scope: `gallery` clearly identifies the affected component
- Descriptor: `lazy-loading` or `lazy-load` is the specific optimization
- Implementation detail: `-intersection-observer` optional but helpful for code review

---

## Performance Benchmarks

### Baseline Metrics to Capture (Before Optimization)

| Metric | Target Measurement | Tool |
|--------|-------------------|------|
| **LCP (Largest Contentful Paint)** | Time to render largest visible element | Lighthouse, WebPageTest |
| **FCP (First Contentful Paint)** | Time to first pixel rendered | Chrome DevTools, Lighthouse |
| **Initial Bundle Size** | JS + CSS for block | Webpack Bundle Analyzer, Chrome DevTools |
| **Initial DOM Nodes** | Count of image elements in tree | Chrome DevTools → Elements panel |
| **Memory Usage** | Heap size with 50+ images loaded | Chrome DevTools → Memory |
| **Network Requests** | Count and total bytes for images | Network tab |
| **Time to Interactive (TTI)** | When gallery is fully usable | Lighthouse |

### Optimized Metrics (Post-Implementation Targets)

**Expected Improvements:**
- LCP: **40-60% faster** (fewer initial images parsed)
- FCP: **30-50% faster** (smaller initial paint payload)
- Initial Memory: **50-70% reduction** (images loaded on demand)
- Network Requests: **70-85% fewer on load** (lazy images deferred)
- TTI: **35-55% improvement** (faster page interactivity)

### Measurement Approach

**1. Lighthouse Audit**
```bash
# Before optimization
lighthouse https://localhost:3000/gallery-50-images --view

# After optimization
lighthouse https://localhost:3000/gallery-50-images --view

# Compare reports in CLI output
```

**2. WebPageTest**
- Use WPT Free for real-world network simulation
- Test with "4G Mobile" and "Cable" profiles
- Capture video to identify rendering bottlenecks

**3. Custom Performance Script**
```javascript
// Log intersection observer performance
const startTime = performance.now();
const imageElements = document.querySelectorAll('img[data-lazy]');
let loadedCount = 0;

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      loadedCount++;
      console.log(`Image loaded: ${loadedCount}/${imageElements.length}`);
      
      if (loadedCount === imageElements.length) {
        const endTime = performance.now();
        console.log(`All images loaded in ${(endTime - startTime).toFixed(2)}ms`);
        console.log(`Memory: ${(performance.memory.usedJSHeapSize / 1048576).toFixed(2)} MB`);
      }
    }
  });
});
```

---

## Testing Approach

### 1. Unit Tests

**Test File:** `tests/gallery-lazy-load.test.js`

```javascript
describe('Gallery Lazy Loading', () => {
  describe('Intersection Observer Setup', () => {
    test('should initialize observer on mount', () => {
      // Assert observer is created and not null
    });

    test('should attach observer to all lazy-load images', () => {
      // Assert all [data-lazy] images are observed
    });

    test('should handle missing IntersectionObserver gracefully', () => {
      // Test fallback behavior for unsupported browsers
    });
  });

  describe('Image Loading', () => {
    test('should load image when visible', () => {
      // Mock intersection, verify src attribute updated
    });

    test('should remove observer after image loads', () => {
      // Assert observer.unobserve() called
    });

    test('should set loaded state/class', () => {
      // Verify .is-loaded class applied
    });
  });

  describe('Error Handling', () => {
    test('should handle 404 images gracefully', () => {
      // Verify error callback triggered
    });

    test('should show placeholder during load', () => {
      // Verify placeholder visible until load complete
    });

    test('should handle slow network images', () => {
      // Mock slow image load, verify timeout handled
    });
  });

  describe('Performance', () => {
    test('should not block thread during initialization', () => {
      // Monitor execution time < 50ms for 50 images
    });

    test('should batch observer callbacks', () => {
      // Verify multiple images processed together
    });
  });
});
```

### 2. Integration Tests

**Test File:** `tests/gallery-integration.test.js`

```javascript
describe('Gallery Block with 50+ Images', () => {
  beforeEach(() => {
    // Load test page with 50 images
    cy.visit('/wp-admin/block-editor.php?post=123');
  });

  test('should render without initial image downloads', () => {
    cy.window().then((win) => {
      const initialRequests = win.performance.getEntriesByType('resource')
        .filter(r => r.name.includes('.jpg') || r.name.includes('.png'));
      expect(initialRequests.length).toBeLessThan(5); // Only above-fold
    });
  });

  test('should load images on scroll', () => {
    cy.scrollTo('bottom');
    cy.window().then((win) => {
      const allImageRequests = win.performance.getEntriesByType('resource')
        .filter(r => r.name.includes('.jpg') || r.name.includes('.png'));
      expect(allImageRequests.length).toBeGreaterThan(40); // Most images loaded
    });
  });

  test('should handle viewport resize', () => {
    cy.viewport(768, 1024); // Tablet
    cy.scrollTo('bottom');
    // Verify images load correctly at new viewport
    cy.get('img.is-loaded').should('have.length.greaterThan', 30);
  });
});
```

### 3. Visual Regression Tests

**Test File:** `tests/gallery-visual.test.js`

```javascript
describe('Gallery Visual Regression', () => {
  test('should match baseline above-fold gallery', () => {
    cy.visit('/gallery-50-images');
    cy.percySnapshot('gallery-initial-view');
  });

  test('should match gallery after scroll load', () => {
    cy.visit('/gallery-50-images');
    cy.scrollTo('bottom');
    cy.percySnapshot('gallery-after-scroll');
  });

  test('should match loading placeholder state', () => {
    cy.visit('/gallery-50-images');
    cy.get('img[data-lazy]').first().then(($img) => {
      expect($img).to.have.class('gallery-image--loading');
    });
  });
});
```

### 4. Performance Testing (Playwright)

**Test File:** `tests/gallery-perf.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test('Gallery with 50+ images performance', async ({ page }) => {
  // Start performance monitoring
  const startMemory = await page.evaluate(() => 
    performance.memory?.usedJSHeapSize
  );

  const startTime = Date.now();
  await page.goto('http://localhost:3000/gallery-50-images');

  // Measure initial render
  const firstPaint = await page.evaluate(() => {
    const paintEntries = performance.getEntriesByType('paint');
    return paintEntries.find(p => p.name === 'first-contentful-paint')?.startTime;
  });

  // Measure DOM ready
  const domReady = await page.evaluate(() => {
    const navigationTiming = performance.getEntriesByType('navigation')[0];
    return navigationTiming.domContentLoadedEventEnd - navigationTiming.fetchStart;
  });

  // Verify performance targets
  expect(firstPaint).toBeLessThan(1500); // FCP < 1.5s
  expect(domReady).toBeLessThan(2000);   // DOM ready < 2s

  // Measure memory usage
  const endMemory = await page.evaluate(() => 
    performance.memory?.usedJSHeapSize
  );
  const memoryIncrease = (endMemory - startMemory) / 1024 / 1024;

  expect(memoryIncrease).toBeLessThan(15); // Memory increase < 15MB

  // Test scroll loading
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1000);

  const loadedImages = await page.locator('img.is-loaded').count();
  expect(loadedImages).toBeGreaterThan(30);
});
```

### 5. Accessibility Tests

**Test File:** `tests/gallery-a11y.test.js`

```javascript
describe('Gallery Lazy Loading A11y', () => {
  test('should maintain alt text on lazy-loaded images', () => {
    // Verify alt attributes preserved after lazy load
    cy.get('img[data-lazy]').each(($img) => {
      expect($img).to.have.attr('alt');
      expect($img.attr('alt')).not.to.be.empty;
    });
  });

  test('should provide accessible loading indicator', () => {
    // Verify aria-busy state on loading images
    cy.get('img[data-lazy].is-loading').each(($img) => {
      expect($img).to.have.attr('aria-busy', 'true');
    });
  });

  test('should keyboard-accessible scroll through gallery', () => {
    cy.visit('/gallery-50-images');
    cy.get('body').tab(); // Start keyboard navigation
    cy.focused().should('exist');
    
    // Verify tab order maintained for lazy images
    cy.get('img[data-lazy]').should('have.attr', 'tabindex');
  });
});
```

### 6. Testing Matrix

| Browser | Versions | Viewport Sizes | Priority |
|---------|----------|----------------|----------|
| Chrome | 120+ | 375px, 768px, 1920px | High |
| Firefox | 121+ | 375px, 768px, 1920px | High |
| Safari | 17+ | 375px, 768px, 1920px | High |
| Edge | 120+ | 768px, 1920px | Medium |

---

## Implementation Checklist

### Before Starting
- [ ] Create feature branch using naming convention above
- [ ] Establish baseline performance metrics (LCP, FCP, memory, network)
- [ ] Set up performance testing infrastructure

### During Development
- [ ] Implement IntersectionObserver with fallback
- [ ] Add data-lazy attribute to images
- [ ] Create placeholder/skeleton UI
- [ ] Handle error states
- [ ] Add loading state indicator

### Testing Phase
- [ ] Run unit tests (target: 90%+ coverage)
- [ ] Run integration tests with 50+ images
- [ ] Run performance benchmarks
- [ ] Visual regression tests pass
- [ ] Accessibility audit passes
- [ ] Test across all browsers/viewports

### Validation
- [ ] Performance meets targets (40-60% LCP improvement)
- [ ] All tests pass
- [ ] Zero regressions in other gallery functionality
- [ ] Documentation updated
- [ ] Ready for PR review

---

## Success Criteria

✅ **Performance:** 40%+ improvement in LCP, 50%+ reduction in initial memory
✅ **Functionality:** All 50+ images load correctly on scroll
✅ **Reliability:** 100% test coverage for lazy-load logic
✅ **Accessibility:** Full WCAG 2.1 AA compliance maintained
✅ **Compatibility:** Works in all supported browsers with graceful degradation
