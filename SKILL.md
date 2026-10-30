---
name: branch-validation-wordpress
description: Branch naming, testing strategy, and release guidance for WordPress block development. Use this to validate branch names for block themes or plugins, determine which branch type to use (feat, fix, perf, a11y, test, release, hotfix), understand testing requirements by block type, plan releases, coordinate multi-block updates, or onboard teams to the branching strategy. Make sure to use this skill whenever a developer asks about WordPress block branching, names a new branch for a block, needs release coordination guidance, or wants to understand block testing/versioning patterns.
compatibility: git, Node.js (for validation scripts), WordPress 5.0+
---

# Branch Validation for WordPress Block Development

Comprehensive branch naming validation, strategy guidance, and workflow coordination for WordPress block themes and block plugins.

## Purpose

This skill ensures your WordPress block project maintains consistent branch naming, follows LightSpeed WP's org-wide strategy, and properly coordinates development workflows for both block themes and block plugins.

## When to Use This Skill

**Branch Creation & Naming**
- Creating a new branch for a WordPress block theme or plugin feature
- Renaming an existing branch
- Validating branch names before pushing to remote
- Understanding which branch type to use for your work

**WordPress Block Development**
- Adding new blocks to a theme or plugin
- Implementing block variations and patterns
- Fixing block-related bugs (rendering, performance, accessibility)
- Testing block functionality across WordPress versions
- Managing block versions and compatibility

**Release & Version Management**
- Planning a block theme or plugin release
- Versioning blocks independently or with the theme/plugin
- Understanding semantic versioning for block components
- Creating release branches for block updates

**Automation & CI/CD**
- Setting up automated validation in CI/CD pipelines
- Configuring block-specific testing strategies
- Managing changelog entries for block changes
- Automating block deployment workflows

**Team Strategy & Governance**
- Onboarding new team members to the branching strategy
- Reviewing block development workflow
- Understanding automation governance
- Learning support procedures and troubleshooting

## Branch Types for WordPress Block Development

### Block Feature Development (6 types)

**`feat/block-{component}-{feature}`** — New block or block feature
- New custom block type
- New block variation
- New reusable pattern
- Block template parts

Examples:
- `feat/block-hero-section-parallax`
- `feat/block-testimonial-carousel`
- `feat/block-pricing-table`

**`feat/block-{component}-accessibility`** — Block accessibility improvements
- WCAG 2.2 AAA compliance
- Screen reader enhancements
- Keyboard navigation
- ARIA labels and descriptions

Examples:
- `feat/block-gallery-a11y-focus-management`
- `feat/block-form-input-a11y-labels`

**`perf/block-{component}-{optimization}`** — Block performance
- Block render performance
- Block save/edit performance
- Reduced block size/dependencies
- Optimized block assets

Examples:
- `perf/block-slider-lazy-loading`
- `perf/block-animation-reduce-repaints`

**`feat/block-patterns-{category}`** — Block pattern collections
- New pattern category
- Pattern library expansion
- Pattern documentation

Examples:
- `feat/block-patterns-landing-pages`
- `feat/block-patterns-product-showcase`

**`research/block-{topic}`** — Block research & exploration
- Proof of concept for new block type
- Technology research for block enhancement
- Block API exploration
- Browser compatibility research

Examples:
- `research/block-interactivity-api`
- `research/block-view-transitions`

### Block Bug Fixes (3 types)

**`fix/block-{component}-{issue}`** — Block bug fix
- Block rendering bug
- Block edit mode issue
- Block save/migration issue
- Block validation error

Examples:
- `fix/block-button-color-contrast-wcag`
- `fix/block-list-nesting-save-error`

**`security/block-{component}-{vulnerability}`** — Block security fix
- XSS vulnerability in block
- Sanitization issue
- Permission bypass
- Script injection prevention

Examples:
- `security/block-html-xss-sanitization`
- `security/block-custom-html-escaping`

**`a11y/block-{component}-{issue}`** — Block accessibility bug fix
- WCAG violation fix
- Screen reader issue
- Keyboard navigation fix
- Focus management bug

Examples:
- `a11y/block-image-alt-text-validation`
- `a11y/block-accordion-keyboard-navigation`

### Infrastructure & Testing (4 types)

**`test/block-{component}-{test-type}`** — Block testing
- E2E tests for block
- Unit tests for block logic
- Visual regression tests
- Accessibility tests (a11y)

Examples:
- `test/block-gallery-e2e-carousel`
- `test/block-form-validation-unit`

**`ci/block-{tool}-{improvement}`** — CI/CD for blocks
- Block testing automation
- Block linting setup
- Block bundle size checks
- Block visual diff checks

Examples:
- `ci/block-e2e-testing-setup`
- `ci/block-bundle-size-monitoring`

**`refactor/block-{component}-{improvement}`** — Block refactoring
- Block code organization
- Block component structure
- Block API modernization
- Reduce block complexity

Examples:
- `refactor/block-tabs-component-composition`
- `refactor/block-form-hook-extraction`

**`docs/block-{component}-{documentation}`** — Block documentation
- Block usage documentation
- Block API documentation
- Block pattern documentation
- Block developer guide

Examples:
- `docs/block-carousel-usage-guide`
- `docs/block-api-migration-guide`

### Release & Versioning (2 types)

**`release/block-v{version}`** — Block version release
- Block feature release
- Block version bump
- Block changelog update

Examples:
- `release/block-v2-0-0`
- `release/block-hero-v1-5-0`

**`hotfix/block-{component}-{urgency}`** — Urgent block fix
- Critical block bug in production
- Security hotfix for block
- Regression blocking users

Examples:
- `hotfix/block-image-responsive-regression`
- `hotfix/block-form-submission-critical`

## WordPress Block Considerations

### Block Feature Development
- All block code must follow WordPress Coding Standards
- Blocks must include PHPUnit tests (if server-rendered)
- JavaScript/JSX must have Jest tests (85%+ coverage)
- E2E tests required for interactive blocks (Playwright)
- Accessibility (WCAG 2.2 AAA) is mandatory

### Block Type Patterns

**Custom Blocks:**
```
feat/block-{blockname}-{feature}
```

**Core Block Modifications:**
```
feat/block-core-{blockname}-{feature}
```

**Block Patterns:**
```
feat/block-patterns-{category}
```

**Block Variations:**
```
feat/block-{blockname}-variation-{type}
```

### Version Pinning

Blocks should specify minimum WordPress version:
```
"version": "1.2.0",
"requires": "6.0",
"requires_php": "7.4"
```

### Testing Requirements by Block Type

**Interactive Blocks:** E2E + Unit + A11y + Visual tests
**Display Blocks:** Visual + A11y tests minimum
**Container Blocks:** E2E + A11y + Nesting tests
**Pattern Blocks:** Template + A11y tests

## Branch Naming Examples

### ✅ Valid WordPress Block Branches

```
feat/block-hero-parallax-scroll
feat/block-testimonial-carousel
fix/block-button-color-wcag
perf/block-gallery-lazy-loading
a11y/block-form-keyboard-nav
test/block-slider-e2e-carousel
docs/block-api-migration-guide
release/block-v2-0-0
hotfix/block-image-responsive-regression
feat/block-patterns-landing-pages
```

### ❌ Invalid Branches

```
feat/add-new-block              # Too vague, missing component
feature/button-block            # Wrong type (use feat)
fix_button_block_color          # Underscores, not hyphens
HOTFIX/BLOCK-IMAGE-CRITICAL     # Uppercase not allowed
block/hero/parallax             # Wrong delimiter (use hyphens)
```

## Commit Message Format

Follow the standard format with block context:

```
feat(block-hero): add parallax scroll effect

- Implement parallax effect using Intersection Observer
- Add accessibility support with prefers-reduced-motion
- Include E2E tests for parallax behavior
- Update CHANGELOG.md

Closes #123
```

## CI/CD Integration

### GitHub Actions Workflow

Branches automatically trigger:
- WordPress Coding Standards checks (PHP)
- ESLint for JavaScript/JSX
- Jest tests (JavaScript, >85% coverage)
- PHPUnit tests (PHP, if applicable)
- Playwright E2E tests (interactive blocks)
- WCAG 2.2 AAA accessibility audit
- Bundle size monitoring

### Branch Protection Rules

- `develop` and `main`: Require passing CI, 1 approval
- Block feature branches: Auto-label with `area:blocks`
- Block hotfix branches: Auto-labeled `priority:critical`

## Release Process

### Minor/Feature Release

1. Create `release/block-v{version}` from `develop`
2. Update version in `block.json`, `package.json`
3. Update `CHANGELOG.md` with new features
4. CI runs full test suite
5. Merge to `main` with tag `block-v{version}`
6. Deploy to WordPress.org (if plugin)

### Hotfix Process

1. Create `hotfix/block-{issue}` from `main`
2. Fix the issue (minimal change)
3. Bump patch version
4. Update `CHANGELOG.md`
5. Merge to `main`, tag as `block-v{patch}`
6. Back-merge to `develop`

## Quick Reference: Branch Naming Checklist

✅ Use lowercase letters and hyphens only  
✅ Start with a valid type: `feat`, `fix`, `perf`, `a11y`, `security`, `test`, `ci`, `refactor`, `docs`, `release`, `hotfix`  
✅ Include `block-` prefix for all block-related work  
✅ Follow format: `{type}/block-{component}-{description}`  
✅ Validate before pushing: `node scripts/validate-branch-name.js your-branch-name`

## Common Workflows

### Adding a New Block

```
1. Create: git checkout -b feat/block-{name}-{feature}
2. Develop: Add block code + tests (Jest 85%+ coverage, Playwright E2E, WCAG 2.2 AAA)
3. Commit: feat(block-{name}): add {feature}
4. Push: git push -u origin feat/block-{name}-{feature}
5. PR: Automatically labeled, runs full CI suite and accessibility audit
```

### Fixing a Block Bug

```
1. Create: git checkout -b fix/block-{name}-{issue}
2. Fix: Make minimal, focused change only
3. Test: Add regression tests
4. Commit: fix(block-{name}): {description}
5. PR: Auto-labeled type:bug, area:blocks
```

### Releasing a Block

```
1. Create: git checkout -b release/block-v{major}-{minor}-{patch}
2. Prepare: Update version in block.json, package.json, and CHANGELOG.md
3. Test: Full CI suite runs automatically
4. Merge: Squash to main, create tag block-v{version}
5. Deploy: Automatic to WordPress.org (if plugin) or theme directory
```

## Documentation

**For full details on:**
- Block theme development → Load `branch-validation-wordpress-themes` sub-skill
- Block plugin development → Load `branch-validation-wordpress-plugins` sub-skill
- Testing strategies (Jest, Playwright, accessibility) → Load `branch-validation-wordpress-testing` sub-skill
- Release management and versioning → Load `branch-validation-wordpress-release` sub-skill

See the main skill repository for complete guides: https://github.com/lightspeedwp/branch-validation
