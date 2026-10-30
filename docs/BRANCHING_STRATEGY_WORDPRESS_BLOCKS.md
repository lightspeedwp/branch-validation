# WordPress Block Development Branching Strategy

## Overview

This document extends the core branch-validation strategy for WordPress block theme and plugin development, providing specific guidance for block-centric workflows.

## Block Feature Development Branches

### New Block Implementation

```
feat/block-{blockname}-{feature}
```

**When to use:**
- Creating a new custom Gutenberg block
- Adding a significant new block feature or variant
- Implementing block pattern categories
- Building block templates or template parts

**Examples:**
- `feat/block-hero-parallax` — New hero block with parallax effect
- `feat/block-testimonial-carousel` — Testimonial block with carousel interaction
- `feat/block-pricing-table` — Pricing block with comparison features

**Requirements:**
- Block structure in `src/blocks/{blockname}/`
- `block.json` with proper metadata
- `edit.js` or `edit.php` for block editor interface
- `save.js` or `render.php` for frontend rendering
- `style.scss` for editor and frontend styles
- `index.js` or `index.php` for block registration

### Block Accessibility (A11y)

```
a11y/block-{blockname}-{feature}
```

**When to use:**
- WCAG 2.2 AAA compliance work
- Screen reader enhancements
- Keyboard navigation improvements
- ARIA attribute additions

**Examples:**
- `a11y/block-gallery-focus-management`
- `a11y/block-form-input-labels`

**Requirements:**
- Run accessibility audit tools: axe, Lighthouse
- Test with screen readers (NVDA, JAWS, VoiceOver)
- Keyboard navigation testing (Tab, Enter, Escape, Arrow keys)
- Update block documentation with a11y notes

### Block Performance Optimization

```
perf/block-{blockname}-{optimization}
```

**When to use:**
- Reducing render time in editor or frontend
- Optimizing block size or dependencies
- Implementing lazy loading or code splitting
- Improving block save performance

**Examples:**
- `perf/block-slider-lazy-load-images`
- `perf/block-animation-reduce-repaints`

### Block Patterns and Variations

```
feat/block-patterns-{category}
```

**When to use:**
- Creating new pattern categories
- Building pattern variations
- Expanding pattern library
- Pattern documentation

**Examples:**
- `feat/block-patterns-landing-pages`
- `feat/block-patterns-product-showcase`

## Bug Fix Branches

### Block Rendering Issues

```
fix/block-{blockname}-{issue}
```

**Common block issues:**
- Block fails to save properly
- Block markup doesn't validate
- Block displays incorrectly in editor
- Block doesn't render on frontend
- Block migration broken

**Examples:**
- `fix/block-button-color-contrast`
- `fix/block-list-nesting-save`

### Block Security Fixes

```
security/block-{blockname}-{vulnerability}
```

**Security concerns in blocks:**
- Unescaped output (XSS)
- Unsanitized input (injection)
- Missing permission checks
- Unsafe innerHTML usage

**Examples:**
- `security/block-html-xss-sanitization`
- `security/block-custom-html-escaping`

## Testing & Infrastructure Branches

### Block Testing

```
test/block-{blockname}-{testtype}
```

**Test types:**
- `unit` — Jest tests for block utilities
- `integration` — PHPUnit tests for server-rendered blocks
- `e2e` — Playwright tests for editor/frontend interaction
- `a11y` — Accessibility testing (axe-core, Pa11y)
- `visual` — Visual regression tests

**Examples:**
- `test/block-carousel-e2e-interaction`
- `test/block-form-validation-unit`

**Requirements:**
- Unit tests: Jest, >85% coverage
- E2E tests: Playwright, all interactive paths
- A11y tests: axe-core or Pa11y
- Visual tests: Percy or Pixelmatch

### Block CI/CD Improvements

```
ci/block-{tool}-{improvement}
```

**CI concerns:**
- Block testing automation
- Block linting (PHPStan, ESLint)
- Bundle size monitoring
- Visual diff checks
- Performance budgets

**Examples:**
- `ci/block-e2e-testing-setup`
- `ci/block-bundle-size-monitoring`

## Release Branches

### Block Version Release

```
release/block-v{version}
```

**Version format:** Semantic versioning (MAJOR.MINOR.PATCH)

**Workflow:**
1. Update `block.json` version
2. Update `package.json` version (if plugin)
3. Update `style.css` Version header (if theme)
4. Update `CHANGELOG.md` with features/fixes
5. Tag release: `git tag block-v1-0-0`

**Examples:**
- `release/block-v2-0-0` — Major block release
- `release/block-hero-v1-5-0` — Block variant release

### Block Hotfixes

```
hotfix/block-{blockname}-critical
```

**When to use:**
- Critical bug preventing block use
- Security vulnerability in production
- Regression in latest release

**Workflow:**
1. Create branch from `main`
2. Fix issue (minimal change)
3. Bump patch version
4. Tag: `git tag block-v1-0-1`
5. Back-merge to `develop`

## Block Development Workflow

### Creating a New Block

1. **Create feature branch:**
   ```bash
   git checkout -b feat/block-hero-parallax
   ```

2. **Generate block scaffold:**
   ```bash
   npm run scaffold block hero
   ```

3. **Implement block files:**
   - `src/blocks/hero/block.json` — Block metadata
   - `src/blocks/hero/edit.js` — Editor component
   - `src/blocks/hero/save.js` — Frontend rendering
   - `src/blocks/hero/style.scss` — Styling
   - `src/blocks/hero/index.js` — Registration

4. **Write tests:**
   ```bash
   # Unit tests
   npm run test src/blocks/hero/
   
   # E2E tests
   npm run test:e2e hero
   
   # A11y audit
   npm run test:a11y
   ```

5. **Commit and push:**
   ```bash
   git commit -m "feat(block-hero): add parallax scroll effect
   
   - Implement IntersectionObserver for parallax
   - Add prefers-reduced-motion support
   - Include E2E tests for interaction
   - Update CHANGELOG.md
   
   Closes #123"
   ```

6. **Open PR:**
   - Link related issues
   - Include screenshot of block
   - Document new block attributes
   - Note any browser compatibility concerns

### Testing Checklist

**Editor Testing:**
- [ ] Block appears in inserter
- [ ] Block can be added to page
- [ ] All attributes editable
- [ ] Undo/redo work
- [ ] Block can be deleted

**Frontend Testing:**
- [ ] Block renders correctly
- [ ] Styles apply properly
- [ ] Responsive on mobile/tablet/desktop
- [ ] Interactive elements work
- [ ] No console errors

**Accessibility Testing:**
- [ ] Keyboard navigation works
- [ ] Screen reader announces block name
- [ ] ARIA labels present where needed
- [ ] Color contrast meets WCAG AA
- [ ] Focus indicators visible

**Performance:**
- [ ] Bundle size acceptable
- [ ] Edit performance good
- [ ] Frontend render time acceptable
- [ ] No unnecessary re-renders

## Block Versioning Strategy

### Version Format

```
MAJOR.MINOR.PATCH
```

- **MAJOR:** Breaking changes (incompatible with existing saves)
- **MINOR:** New features (backward compatible)
- **PATCH:** Bug fixes (no breaking changes)

### Deprecation Policy

When making breaking changes:

1. Introduce deprecated block version
2. Implement migration in `deprecated` field
3. Keep old version working for 2 releases
4. Document migration path
5. Bump MAJOR version

Example:
```javascript
{
  "version": "2.0.0",
  "deprecated": [
    {
      "version": "1.0.0",
      "migrate": "migrate_v1_to_v2"
    }
  ]
}
```

## CI/CD Pipeline for Blocks

### Automated Checks

**On every push:**
- ESLint validation (JavaScript)
- PHPStan validation (PHP)
- WPCS validation (WordPress Coding Standards)
- Jest unit tests (>85% coverage)
- Prettier formatting check

**On PR creation:**
- Full E2E test suite
- Accessibility audit (axe-core)
- Visual regression testing
- Bundle size check (with budget)
- Performance profiling

**Before merge:**
- All checks must pass
- 1+ approval required
- CHANGELOG.md updated
- Commit messages follow convention

## Common Block Patterns

### Display Blocks

Simple blocks that show content without interaction.

**Branch type:** `feat/block-{name}-display`
**Testing:** Visual + A11y only
**Example:** Hero banner, testimonial card

### Container Blocks

Blocks that hold other blocks (columns, tabs, accordion).

**Branch type:** `feat/block-{name}-container`
**Testing:** E2E (nesting, reordering) + A11y
**Example:** Hero section, tabs, accordion

### Interactive Blocks

Blocks with dynamic frontend behavior.

**Branch type:** `feat/block-{name}-interactive`
**Testing:** Full suite (Unit + E2E + A11y + Visual)
**Example:** Carousel, form, image gallery

## Troubleshooting Common Blocks Issues

### Block won't save
- Check: `save.js` returns same markup as editor
- Check: All block attributes serialized correctly
- Check: No unsupported HTML in save markup

### Block appears broken in editor
- Check: `edit.js` component renders without error
- Check: Block attributes properly declared in `block.json`
- Check: No console JavaScript errors
- Check: CSS not conflicting with editor styles

### Block doesn't display on frontend
- Check: `render.php` or `save.js` exists and renders
- Check: Block is registered in theme/plugin
- Check: No PHP fatal errors in `render.php`
- Check: CSS file is enqueued properly

### Accessibility issues
- Check: Headings use correct hierarchy (h2, h3, not h1)
- Check: Images have alt text
- Check: Buttons/links have readable text
- Check: Form inputs have associated labels
- Check: Color contrast meets WCAG AA (4.5:1)

## Resources

- [WordPress Block Editor Handbook](https://developer.wordpress.org/block-editor/)
- [Block.json Reference](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/)
- [Deprecated Blocks](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-deprecation/)
- [WordPress Accessibility Guidelines](https://www.a11y-101.com/design/accessible-wordpress)
- [WCAG 2.2 AAA Standards](https://www.w3.org/WAI/WCAG22/quickref/)
