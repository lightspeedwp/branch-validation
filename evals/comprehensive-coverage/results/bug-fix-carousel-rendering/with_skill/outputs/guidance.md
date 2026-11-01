# Carousel Block Mobile Rendering Bug Fix — Branch Validation Guidance

## Issue Summary
The carousel block is not rendering images correctly on mobile. The issue has been identified in the `save.js` function, which controls how the block is serialized in the editor and rendered on the frontend.

---

## 1. Branch Type & Naming

### Recommended Branch Type
**`fix/block-carousel-mobile-rendering`**

This follows the WordPress block bug fix pattern from ls-branch-validation:
- **Type:** `fix` (bug fix, not feature)
- **Component:** `carousel` (the specific block)
- **Issue:** `mobile-rendering` (clear, specific description of the problem)

### Alternative Names (if more specific)
- `fix/block-carousel-image-responsive-layout` — if the issue is CSS/layout related
- `fix/block-carousel-save-mobile-markup` — if the issue is specific to the save.js serialization
- `fix/block-carousel-image-srcset-mobile` — if it's about responsive image attributes

### Command to Create Branch
```bash
git checkout develop
git pull origin develop
git checkout -b fix/block-carousel-mobile-rendering
```

### Validation Before Push
```bash
# Validate the branch name follows conventions
node scripts/validate-branch-name.js fix/block-carousel-mobile-rendering
```

---

## 2. Testing Approach (Including Regression Tests)

Since the carousel is an **interactive block** that affects rendering, it requires comprehensive testing:

### A. Unit Tests (Jest) — Test save.js Logic

**File:** `tests/blocks/carousel/save.test.js`

```javascript
describe('Carousel save.js', () => {
  describe('Mobile rendering', () => {
    it('should render image with proper responsive attributes on mobile', () => {
      const attributes = {
        images: [
          { id: 1, url: 'image1.jpg', alt: 'Alt text 1' }
        ],
        enableImageSrcset: true
      };
      
      const rendered = save({ attributes });
      const wrapper = render(rendered);
      
      // Assert srcset attribute exists
      expect(wrapper.find('img').prop('srcset')).toBeDefined();
      
      // Assert sizes attribute for responsive images
      expect(wrapper.find('img').prop('sizes')).toBeDefined();
    });

    it('should preserve image alt text in save output', () => {
      const attributes = {
        images: [
          { id: 1, url: 'image1.jpg', alt: 'Carousel image' }
        ]
      };
      
      const rendered = save({ attributes });
      expect(rendered).toContain('alt="Carousel image"');
    });

    it('should wrap images with proper container markup for mobile layout', () => {
      const attributes = {
        images: [{ id: 1, url: 'image1.jpg', alt: '' }]
      };
      
      const rendered = save({ attributes });
      expect(rendered.props.className).toContain('wp-block-carousel');
    });
  });

  // Regression tests
  describe('Regression tests', () => {
    it('should not break desktop rendering after mobile fix', () => {
      const attributes = {
        images: [{ id: 1, url: 'image1.jpg', alt: '' }]
      };
      
      const rendered = save({ attributes });
      expect(rendered).toBeDefined();
      expect(rendered.props.className).toBeTruthy();
    });

    it('should maintain backward compatibility with existing carousel blocks', () => {
      // Test with old attribute structure
      const legacyAttributes = {
        images: [{ url: 'image1.jpg' }], // Missing id, alt
        slidesToShow: 1
      };
      
      const rendered = save({ attributes: legacyAttributes });
      expect(rendered).not.toThrow();
    });

    it('should handle empty image list gracefully', () => {
      const attributes = { images: [] };
      const rendered = save({ attributes });
      expect(rendered).toBeDefined();
    });
  });
});
```

**Coverage Target:** >85% of save.js logic

### B. E2E Tests (Playwright) — Test Block Behavior

**File:** `tests/blocks/carousel/carousel.e2e.js`

```javascript
describe('Carousel Block — Mobile Rendering', () => {
  beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8888');
  });

  test('should render carousel images correctly on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });
    
    // Navigate to page with carousel
    await page.goto('http://localhost:8888/carousel-test/');
    
    // Verify images are visible
    const images = page.locator('img[data-carousel-image]');
    const count = await images.count();
    expect(count).toBeGreaterThan(0);
    
    // Verify images are in viewport (not hidden by overflow)
    for (let i = 0; i < count; i++) {
      const isVisible = await images.nth(i).isVisible();
      expect(isVisible).toBe(true);
    }
  });

  test('should not crop or distort images on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('http://localhost:8888/carousel-test/');
    
    const firstImage = page.locator('img[data-carousel-image]').first();
    const boundingBox = await firstImage.boundingBox();
    
    // Image should have proper aspect ratio (not distorted)
    expect(boundingBox.width / boundingBox.height).toBeCloseTo(
      firstImage.evaluate(el => el.naturalWidth / el.naturalHeight),
      1
    );
  });

  test('carousel should be fully contained within mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('http://localhost:8888/carousel-test/');
    
    const carousel = page.locator('[data-block-name="carousel"]');
    const boundingBox = await carousel.boundingBox();
    
    // Carousel width should not exceed viewport
    expect(boundingBox.width).toBeLessThanOrEqual(375);
    
    // No horizontal scroll should be needed
    const scrollWidth = await page.evaluate(
      () => document.documentElement.scrollWidth
    );
    expect(scrollWidth).toBeLessThanOrEqual(375);
  });

  test('should maintain carousel functionality on mobile (swipe/click)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('http://localhost:8888/carousel-test/');
    
    const nextButton = page.locator('[data-carousel-next]');
    const firstImage = page.locator('img[data-carousel-image]').first();
    
    const firstImageSrc = await firstImage.getAttribute('src');
    
    // Click next button
    await nextButton.click();
    await page.waitForTimeout(500); // Allow animation
    
    const secondImageSrc = await firstImage.getAttribute('src');
    
    // Image should have changed
    expect(firstImageSrc).not.toBe(secondImageSrc);
  });

  // Regression tests
  test('should still work on desktop after mobile fix', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('http://localhost:8888/carousel-test/');
    
    const images = page.locator('img[data-carousel-image]');
    const count = await images.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should work on tablet sizes', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('http://localhost:8888/carousel-test/');
    
    const carousel = page.locator('[data-block-name="carousel"]');
    expect(await carousel.isVisible()).toBe(true);
  });
});
```

### C. Visual Regression Tests

Use Playwright's screenshot comparison to detect visual changes:

```javascript
test('carousel mobile layout matches golden image', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('http://localhost:8888/carousel-test/');
  
  const carousel = page.locator('[data-block-name="carousel"]');
  
  // First run: creates baseline
  // Subsequent runs: compares against baseline
  await expect(carousel).toHaveScreenshot('carousel-mobile-375w.png', {
    mask: [page.locator('[data-dynamic-content]')] // Mask timestamps, etc.
  });
});
```

### D. Accessibility Tests (WCAG 2.2 AAA)

**File:** `tests/blocks/carousel/carousel.a11y.test.js`

```javascript
describe('Carousel — Accessibility (WCAG 2.2 AAA)', () => {
  test('images should have descriptive alt text', async ({ page }) => {
    await page.goto('http://localhost:8888/carousel-test/');
    
    const images = page.locator('img[data-carousel-image]');
    
    for (let i = 0; i < await images.count(); i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt).toBeTruthy();
      expect(alt.length).toBeGreaterThan(3); // Not just "image"
    }
  });

  test('carousel controls should be keyboard accessible', async ({ page }) => {
    await page.goto('http://localhost:8888/carousel-test/');
    
    const carousel = page.locator('[data-block-name="carousel"]');
    const firstButton = carousel.locator('button').first();
    
    // Tab to button
    await page.keyboard.press('Tab');
    
    // Verify button is focused
    const focused = await page.evaluate(() => document.activeElement.tagName);
    expect(focused).toBe('BUTTON');
  });

  test('should respect prefers-reduced-motion for animations', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('http://localhost:8888/carousel-test/');
    
    const carousel = page.locator('[data-block-name="carousel"]');
    const computedStyle = await carousel.evaluate(
      el => window.getComputedStyle(el).transitionDuration
    );
    
    // Animation should be disabled or minimal
    expect(computedStyle).toMatch(/0s|0ms/);
  });
});
```

### E. Regression Test Suite Summary

Create `/tests/blocks/carousel/regression-tests.md`:

```markdown
# Carousel Block Regression Test Checklist

## Before This Fix
- [ ] Desktop carousel renders correctly (1920x1080)
- [ ] Tablet carousel renders correctly (768x1024)
- [ ] Image alt text is preserved
- [ ] Carousel controls are clickable
- [ ] Carousel animations work on desktop
- [ ] ARIA labels are present
- [ ] prefers-reduced-motion is respected

## Specific to Mobile Fix
- [ ] Mobile carousel images render (375x812)
- [ ] Images are not cropped or distorted
- [ ] Carousel fits within viewport (no horizontal scroll)
- [ ] Touch/swipe controls work
- [ ] Images have proper responsive attributes (srcset, sizes)
- [ ] Image loading performance is acceptable (LCP < 2.5s)

## After This Fix (Regression Protection)
- [ ] Desktop rendering unchanged
- [ ] Tablet rendering unchanged
- [ ] Old carousel blocks still work (backward compatibility)
- [ ] Empty carousels don't crash
- [ ] Single-image carousels work
- [ ] Multi-image carousels scroll correctly
```

---

## 3. Validation Steps

### Step 1: Local Testing (Before Push)
```bash
# Run unit tests for save.js
npm run test:unit -- carousel.test.js

# Run E2E tests with multiple viewports
npm run test:e2e -- carousel.e2e.js

# Check for accessibility issues
npm run test:a11y -- carousel.a11y.test.js

# Run all carousel tests
npm run test -- carousel --coverage

# Check code quality
npm run lint -- src/blocks/carousel/save.js
```

### Step 2: CI/CD Validation (Automatic on Push)

When you push `fix/block-carousel-mobile-rendering`, GitHub Actions automatically runs:

1. **ESLint** — Code style & best practices
   - WordPress Coding Standards (PHP)
   - ESLint rules (JavaScript)
   - Prettier formatting

2. **Jest Tests** — Unit tests for save.js
   - Target: >85% code coverage
   - All save.js functions tested
   - Regression tests included

3. **Playwright E2E Tests** — Block behavior across viewports
   - Desktop (1920x1080)
   - Tablet (768x1024)
   - Mobile (375x812)
   - Visual regression comparison

4. **Accessibility Audit** — WCAG 2.2 AAA compliance
   - axe-core automated checks
   - ARIA attributes
   - Color contrast
   - Keyboard navigation

5. **Bundle Size Check** — Performance monitoring
   - Warns if block JS/CSS grows >5%
   - Compares against develop branch

6. **WP Coding Standards** — WordPress best practices
   - PHPUnit tests (if server-rendered)
   - PHP sanitization & escaping
   - Nonce handling (if applicable)

### Step 3: Code Review Checklist

When creating the PR for `fix/block-carousel-mobile-rendering`, verify:

- [ ] **Branch name follows convention:** `fix/block-carousel-mobile-rendering` ✓
- [ ] **Commit message is clear:** `fix(block-carousel): correct mobile image rendering in save.js`
- [ ] **Only save.js changes included** (minimal, focused fix)
- [ ] **Regression tests added** (test both mobile fix + desktop compatibility)
- [ ] **CHANGELOG.md updated:** Added entry under "Bug Fixes" for carousel mobile rendering
- [ ] **No console errors or warnings** on mobile, tablet, desktop
- [ ] **Screenshots provided** showing mobile rendering before/after
- [ ] **CI/CD passes all checks:** ✓ ESLint, ✓ Jest, ✓ E2E, ✓ A11y, ✓ Bundle size
- [ ] **At least 1 approval** from team member
- [ ] **Linked to issue ticket** (if applicable)

### Step 4: Deployment Validation

After merge to `develop`:

```bash
# Pull latest develop
git checkout develop
git pull origin develop

# Verify carousel block renders correctly on staging
npm run start:staging

# Test on actual mobile device (BrowserStack or personal)
# Verify: images load, no distortion, responsive, fast
```

---

## 4. Additional Considerations

### Save.js-Specific Issues

Since the bug is in `save.js`, the issue likely involves:

**Possible Root Causes:**
1. **Incorrect responsive image markup** — Missing `srcset` or `sizes` attributes
2. **CSS container queries** — Not accounting for mobile viewport
3. **Image wrapper markup** — Incorrect container structure for mobile layouts
4. **Attribute serialization** — Missing data attributes needed for JavaScript mobile handling
5. **Mobile-only CSS** — Media queries in `style.css` not being applied correctly

**What to Check in save.js:**

```javascript
// BEFORE (potentially broken on mobile)
<img src={imageUrl} alt={altText} />

// AFTER (with responsive attributes)
<img 
  src={imageUrl} 
  srcSet={srcSet}
  sizes={sizes}
  alt={altText}
  loading="lazy"
  decoding="async"
/>
```

### Performance Considerations

- **Images must use lazy loading** on mobile (reduce initial LCP)
- **Optimize image sizes** for mobile-first approach
- **Reduce script payload** for carousel interactions
- **Test on real mobile network** (throttle to 4G)

### Browser/Device Testing

Test on:
- [ ] iPhone 12/13/14/15 (Safari)
- [ ] Samsung Galaxy S21+ (Chrome)
- [ ] Pixel 6/7 (Chrome)
- [ ] iPad (tablet size)
- [ ] Android tablet
- [ ] iOS Safari (all supported versions)

---

## 5. Commit Message Template

```
fix(block-carousel): correct mobile image rendering in save.js

- Fix responsive image attributes (srcset/sizes) for mobile viewports
- Correct container markup structure for mobile layouts
- Ensure images don't get cropped on small screens
- Maintain backward compatibility with existing carousels

Testing:
- Added unit tests for save.js responsive output (Jest, 88% coverage)
- Added E2E tests for mobile viewports (Playwright, 375w, 768w, 1920w)
- Added accessibility tests (WCAG 2.2 AAA) for keyboard nav, alt text
- Added regression tests for desktop/tablet/empty carousels
- All CI checks pass: ESLint, Jest, E2E, A11y, Bundle size

Closes #issue-number
```

---

## 6. Next Steps

1. **Verify branch name:** `fix/block-carousel-mobile-rendering` ✓
2. **Write regression tests first** (test-driven approach)
3. **Fix the save.js issue** (minimal, focused change)
4. **Run local test suite** before pushing
5. **Create PR with detailed description** and screenshots
6. **Monitor CI/CD pipeline** for all checks to pass
7. **Address any code review feedback**
8. **Merge and monitor staging deployment**

---

## Summary

| Aspect | Guidance |
|--------|----------|
| **Branch Type** | `fix/block-carousel-mobile-rendering` |
| **Test Types** | Unit (Jest), E2E (Playwright), Visual, A11y, Regression |
| **Coverage Target** | >85% code coverage for save.js |
| **Test Viewports** | Mobile (375w), Tablet (768w), Desktop (1920w) |
| **CI/CD Checks** | ESLint, Jest, Playwright E2E, axe-core A11y, Bundle size |
| **Regression Focus** | Desktop/tablet unaffected, backward compatibility, empty state |
| **Documentation** | Update CHANGELOG.md with bug fix entry |
| **Review Checklist** | Branch name, tests, CI pass, a11y, screenshots, approval |

---

**Generated by:** ls-branch-validation skill  
**Date:** 2026-11-01  
**Issue Type:** Block Bug Fix (Mobile Rendering)  
**WordPress Component:** Carousel Block (save.js)
