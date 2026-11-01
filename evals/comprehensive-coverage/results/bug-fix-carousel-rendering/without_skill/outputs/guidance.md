# Bug Fix Guidance: Carousel Block Mobile Rendering Issue

## Overview
This document provides strategic guidance for fixing a carousel block rendering issue on mobile devices. The issue has been identified in the `save.js` function and requires a systematic approach to branching, testing, and regression validation.

---

## 1. Branch Naming & Strategy

### Recommended Branch Naming Convention
```
bugfix/carousel-mobile-rendering
```

### Naming Components Breakdown
- **Prefix**: `bugfix/` (indicates this is a bug fix, not a feature or refactor)
- **Issue Scope**: `carousel` (which block/component is affected)
- **Problem Description**: `mobile-rendering` (what is broken)

### Alternative Acceptable Patterns
- `fix/carousel-mobile-images`
- `bugfix/carousel-responsive-images`
- `bug/carousel-mobile-layout`

### Branch Lifecycle
1. **Create branch from**: `develop` (or `main` if no develop branch exists)
2. **Base command**: `git checkout -b bugfix/carousel-mobile-rendering develop`
3. **Keep aligned with base branch**: Pull latest changes weekly if the fix takes time
4. **Single responsibility**: Keep this branch focused only on the carousel mobile issue
5. **Branch longevity**: Aim to merge within 1-2 weeks to reduce merge conflict risk

### Do's and Don'ts
- **DO** name branches descriptively for other developers
- **DO** use lowercase with hyphens (not camelCase or underscores)
- **DO** include the component name for easy tracking
- **DON'T** use vague names like `fix/bug` or `hotfix/issue`
- **DON'T** combine multiple unrelated fixes in one branch

---

## 2. Testing Approach

### Unit Testing (save.js Function Level)

#### What to Test
- Verify the `save.js` function produces correct HTML output for carousel images on mobile
- Test that image attributes (src, alt, srcset, sizes) are correctly rendered
- Verify responsive image markup is properly formed
- Test edge cases: missing images, invalid data, empty carousel

#### Testing Strategy
```javascript
// Example Jest test structure
describe('Carousel Block - save.js Mobile Rendering', () => {
  
  test('should render images with correct mobile viewport attributes', () => {
    const attributes = {
      images: [
        { id: 1, url: 'image1.jpg', alt: 'First slide' },
        { id: 2, url: 'image2.jpg', alt: 'Second slide' }
      ],
      autoplay: true,
      transitionSpeed: 300
    };
    
    const result = save(attributes);
    
    expect(result).toContain('srcset');
    expect(result).toContain('sizes="(max-width: 768px) 100vw');
  });

  test('should not render broken image markup on mobile', () => {
    // Verify no double-loading, correct lazy loading
  });

  test('should handle edge case: single image', () => {
    // Test with minimal data
  });
});
```

### Editor Testing (Edit.js)

#### Focus Areas
- Carousel preview in block editor on different screen sizes
- Image upload and selection flow
- Attribute updates reflect correctly in save output
- Block toolbar controls work on mobile viewport in editor

#### Manual Testing Checklist
- [ ] Upload/select images in block editor
- [ ] Verify preview updates after each image
- [ ] Test reordering images (drag/drop)
- [ ] Check carousel navigation buttons render
- [ ] Test on mobile breakpoint in editor inspector

### Frontend Rendering Testing

#### Critical Paths
1. **Desktop view** (1920px, 1440px)
2. **Tablet view** (1024px, 768px)
3. **Mobile view** (480px, 375px, 320px)
4. **Edge devices** (iPad mini 768px, iPhone SE 375px)

#### What to Verify
- Images display without overflow/cutoff on mobile
- Carousel controls (prev/next buttons) are usable on small screens
- Touch gestures work (swipe to navigate)
- Images don't create layout shift (CLS < 0.1)
- Loading states are visible on slow network (test with DevTools throttling)

### Integration Testing

#### Test the Full Flow
1. Create/edit carousel block with multiple images
2. Publish post/page containing carousel
3. View on mobile device or mobile viewport
4. Verify images load, display, and carousel functions

---

## 3. Regression Testing

### What is Regression Testing?
Testing that previously working functionality still works after your bug fix. The carousel fix could inadvertently break:
- Desktop rendering (if you optimized for mobile)
- Single-image carousels
- Carousels with custom CSS classes
- Touch/keyboard navigation
- Performance on low-bandwidth networks

### Regression Test Strategy

#### A. Automated Regression Tests
```javascript
// Create regression tests that verify pre-existing functionality
describe('Carousel Block - Regression Tests', () => {
  
  test('should maintain desktop rendering after mobile fix', () => {
    // Test that desktop view still looks correct
  });

  test('should not break keyboard navigation', () => {
    // Arrow keys, Tab, Enter should still work
  });

  test('should maintain swipe gesture compatibility', () => {
    // Touch events should still trigger transitions
  });

  test('should not break lazy loading on desktop', () => {
    // Images off-screen should still lazy-load
  });

  test('should not increase bundle size', () => {
    // Verify save.js output is efficient
  });
});
```

#### B. Manual Regression Test Matrix

| Test Case | Desktop | Tablet | Mobile | Pass? |
|-----------|---------|--------|--------|-------|
| Display 1 image | X | X | X | |
| Display 3+ images | X | X | X | |
| Navigate forward | X | X | X | |
| Navigate backward | X | X | X | |
| Autoplay carousel | X | X | X | |
| Touch swipe (mobile) | - | X | X | |
| Keyboard nav (arrow keys) | X | X | X | |
| Images load correctly | X | X | X | |
| Alt text renders | X | X | X | |
| Custom CSS classes work | X | X | X | |
| With lazy loading enabled | X | X | X | |
| Without lazy loading | X | X | X | |
| On slow network (3G) | X | X | X | |
| Block settings preserved | X | X | X | |
| Migration from old version | X | X | X | |

#### C. Performance Regression
- Measure Largest Contentful Paint (LCP) before and after fix
- Verify no layout shift (CLS) introduced
- Check First Input Delay (FID) on mobile
- Benchmark: should not increase render time > 10%

#### D. Browser/Device Compatibility
Test across:
- **Browsers**: Chrome, Safari, Firefox, Edge
- **Mobile devices**: iPhone (iOS 14+), Android devices (Chrome/Samsung)
- **Screen readers**: NVDA, JAWS (if accessibility-related)

### Regression Prevention Checklist
- [ ] Run full test suite (not just carousel tests)
- [ ] Test on multiple browsers before submitting PR
- [ ] Compare before/after screenshots (desktop, tablet, mobile)
- [ ] Check Lighthouse score (should not decrease)
- [ ] Review similar blocks (slider, gallery) to ensure consistency
- [ ] Get design review: does it match design system?
- [ ] Performance review: DevTools audit passes

### Post-Merge Regression Monitoring
1. **Deploy to staging** and monitor for errors
2. **Monitor production** for reported issues in first 24-48 hours
3. **Track user feedback**: check support tickets mentioning carousel
4. **Rollback plan**: know how to revert if critical issue surfaces

---

## 4. Recommended Workflow Summary

### Development Workflow
```bash
# Step 1: Create and check out feature branch
git checkout -b bugfix/carousel-mobile-rendering develop

# Step 2: Make fixes to save.js
# - Fix rendering logic
# - Add necessary attributes for mobile
# - Test locally

# Step 3: Write/update tests
npm run test -- carousel.test.js

# Step 4: Run full test suite (regression check)
npm run test

# Step 5: Run linting and build
npm run lint
npm run build

# Step 6: Manual testing on real devices/emulators
# - Test mobile viewport
# - Test desktop
# - Test touch/keyboard interaction

# Step 7: Commit with clear message
git commit -m "Fix carousel image rendering on mobile"

# Step 8: Push and create PR
git push origin bugfix/carousel-mobile-rendering
```

### PR Description Template
```markdown
## Summary
Fix carousel block images not rendering correctly on mobile viewports.

## Issue
Images overflow container on mobile, preventing interaction with carousel controls.

## Root Cause
save.js was not applying responsive sizing attributes (srcset, sizes) for mobile breakpoints.

## Solution
- Added mobile-specific responsive image markup
- Applied proper size constraints for small viewports
- Optimized image loading strategy for mobile

## Testing
- [x] Unit tests added for mobile rendering
- [x] Manual testing on iPhone SE, Android tablet
- [x] Regression tests pass (desktop, keyboard nav, swipe)
- [x] Lighthouse score maintained
- [x] Touch interactions verified

## Checklist
- [x] Tests pass locally
- [x] No console errors
- [x] Accessibility maintained
- [x] Documentation updated if needed
```

---

## 5. Key Takeaways

1. **Branch Strategy**: Use `bugfix/carousel-mobile-rendering` to keep work focused
2. **Unit Testing**: Test save.js output for mobile markup correctness
3. **Integration Testing**: Verify entire carousel works on actual mobile devices
4. **Regression Testing**: Ensure desktop, keyboard nav, swipe gestures still work
5. **Performance**: Monitor Core Web Vitals don't regress
6. **Deployment**: Validate on staging before production, have rollback ready

---

## References

- **Responsive Images**: Use `srcset` and `sizes` for mobile-optimized loading
- **Testing**: Jest for unit tests, Playwright for e2e carousel interaction
- **Performance**: Lighthouse audit to catch regressions
- **Accessibility**: ARIA labels on navigation, keyboard nav support
- **Git Workflow**: Feature branches from stable base, focused commits, clear PRs
