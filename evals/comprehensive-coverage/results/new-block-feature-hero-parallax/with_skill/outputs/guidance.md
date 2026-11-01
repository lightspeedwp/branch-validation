# Hero Block with Parallax Background — Branch Guidance

## Recommended Branch Name

```
feat/block-hero-parallax-scroll
```

**Pattern:** `feat/block-{component}-{feature}`

This follows LightSpeed WP's WordPress block development convention and clearly signals:
- **Type:** Feature development for a new block capability
- **Component:** Hero block
- **Feature:** Parallax scroll effect

## Testing Strategy

### Required Tests (Mandatory)

**1. Jest Unit Tests (JavaScript/JSX)**
- Target: ≥85% code coverage
- Test block registration and attributes
- Test parallax calculation logic
- Test scroll event handler behavior
- Test accessibility props and ARIA attributes

**2. Playwright E2E Tests**
- Test block insertion in editor
- Test parallax effect rendering in frontend
- Test parallax behavior across viewport sizes (mobile, tablet, desktop)
- Test parallax with reduced motion preference (prefers-reduced-motion)
- Test block save/edit roundtrip integrity

**3. Accessibility Compliance (WCAG 2.2 AAA)**
- Verify semantic HTML structure
- Test keyboard navigation (no tab traps)
- Test screen reader announcements
- Validate color contrast ratios
- Ensure prefers-reduced-motion disables parallax animation
- Test focus management and visible focus indicators

**4. Visual Regression Tests**
- Capture baseline screenshots at key breakpoints
- Test parallax visual state at different scroll positions
- Validate responsive layout across devices
- Monitor background image rendering quality

### Recommended Test Types by Priority

**High Priority:**
- E2E tests for parallax scroll functionality
- WCAG 2.2 AAA accessibility audit
- Jest unit tests for scroll calculations
- Playwright tests for viewport responsiveness

**Medium Priority:**
- Visual regression snapshots
- Cross-browser testing (Chrome, Firefox, Safari)
- Mobile device testing (iOS Safari, Android Chrome)

**Nice to Have:**
- Performance profiling (frame rate, jank detection)
- Long scroll performance stress tests

## Key Considerations Before Pushing

### Development Checklist

- [ ] Block follows WordPress Coding Standards for PHP/JavaScript
- [ ] All dependencies declared in `block.json` (e.g., Intersection Observer polyfill for older browsers)
- [ ] Parallax effect uses performant techniques (GPU-accelerated transforms, not `left`/`top`)
- [ ] Scroll event handler is throttled/debounced to prevent jank
- [ ] Background image is responsive and optimized for all viewport sizes

### Accessibility Requirements

- [ ] Parallax effect disabled when `prefers-reduced-motion` is set
- [ ] Fallback static background for browsers without Intersection Observer
- [ ] All interactive elements within hero block have accessible names
- [ ] Color contrast meets WCAG AA minimum (4.5:1 for text)
- [ ] No keyboard traps; tabbing flows naturally

### Testing Requirements

- [ ] Jest coverage ≥85% for parallax logic
- [ ] Playwright E2E tests pass on all target browsers
- [ ] WCAG 2.2 AAA accessibility audit passes (use WAVE or Axe DevTools)
- [ ] Visual regression tests approved for key breakpoints
- [ ] Performance profiling shows smooth 60 FPS parallax on target devices

### Documentation

- [ ] Add block usage docs (how to configure parallax offset, speed)
- [ ] Document browser compatibility and polyfill requirements
- [ ] Add example patterns showing common hero layouts
- [ ] Update CHANGELOG.md with new feature entry

### CI/CD Integration

This branch will automatically trigger:
- WordPress Coding Standards linting (PHP)
- ESLint for JavaScript/JSX validation
- Jest test suite (must pass, coverage ≥85%)
- Playwright E2E tests (all tests must pass)
- WCAG 2.2 AAA accessibility audit
- Bundle size monitoring (flag if significant increase)

### Commit Message Format

```
feat(block-hero): add parallax scroll effect

- Implement parallax using Intersection Observer API
- Add throttled scroll event handler for performance
- Include prefers-reduced-motion media query support
- Add fallback for non-supporting browsers
- Include E2E and unit tests (85%+ coverage)
- Add WCAG 2.2 AAA accessibility compliance
- Update CHANGELOG.md

Closes #<issue-number>
```

### Performance Guidelines

- Parallax calculations must use GPU-accelerated CSS transforms (`transform: translateY()`)
- Scroll event handler must be throttled (recommended: 60 FPS, debounce to 16ms intervals)
- Background image must be lazy-loaded below the fold
- Reduce paint/reflow by avoiding DOM manipulation on scroll
- Test performance on mid-range devices (not just high-end desktops)

### Browser Compatibility

- Target: WordPress minimum supported browsers (currently Chrome/Firefox/Safari/Edge latest 2 versions)
- Provide fallback static background for browsers without Intersection Observer
- Test on iOS Safari and Android Chrome (mobile parallax behavior differs)
- Consider `position: fixed` vs `background-attachment: fixed` trade-offs

## Pre-Push Checklist

- [ ] Branch name follows convention: `feat/block-hero-parallax-scroll`
- [ ] All tests pass locally (Jest, Playwright, accessibility audit)
- [ ] Code follows WordPress Coding Standards
- [ ] CHANGELOG.md entry added
- [ ] Commit message is descriptive and references issue number
- [ ] No console errors or warnings in browser DevTools
- [ ] Performance profiling shows acceptable frame rates (60 FPS target)
- [ ] Accessibility audit passes WCAG 2.2 AAA
- [ ] PR template will auto-populate on GitHub with block-related fields

## Additional Resources

- WordPress Block Editor Handbook: https://developer.wordpress.org/block-editor/
- Intersection Observer API: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
- WCAG 2.2 Guidelines: https://www.w3.org/WAI/WCAG22/quickref/
- WordPress Coding Standards: https://developer.wordpress.org/coding-standards/
- Lighthouse Performance Audit: https://developers.google.com/web/tools/lighthouse
