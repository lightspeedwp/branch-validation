# WordPress Block Development Onboarding Guide

Welcome to the team! This guide covers our WordPress block development workflow, branch naming conventions, versioning strategy, and testing requirements.

---

## Table of Contents

1. [Development Workflow Overview](#development-workflow-overview)
2. [Branch Naming Conventions](#branch-naming-conventions)
3. [Versioning Strategy](#versioning-strategy)
4. [Testing Requirements](#testing-requirements)
5. [CI/CD Pipeline](#cicd-pipeline)
6. [Release Process](#release-process)
7. [Quick Start Examples](#quick-start-examples)

---

## Development Workflow Overview

Our WordPress block development follows a structured workflow designed to maintain code quality, accessibility, and consistency across all team projects.

### Development Branches

We maintain two primary long-lived branches:

- **`develop`** — Integration branch for features and fixes (pre-release)
- **`main`** — Production-ready code, tagged with releases

### Feature Branch Strategy

All work happens on feature branches created from `develop`. When work is ready, it's merged back via pull request with:
- Automated CI/CD validation
- Required peer review (1 approval minimum)
- Passing test suite (Jest, PHPUnit, Playwright, accessibility)
- Updated CHANGELOG.md entries

### Block Component Development Cycle

```
1. Create feature branch from develop
   └─ Branch name follows our naming conventions
   
2. Develop block features
   └─ Write code following WordPress Coding Standards
   └─ Write tests (Jest/PHPUnit for logic, Playwright for E2E, accessibility)
   
3. Commit with meaningful messages
   └─ Format: feat(block-name): description
   
4. Create pull request
   └─ Automatically labeled and validated
   └─ CI/CD runs full test suite
   
5. Address feedback
   └─ Respond to code review comments
   └─ Update implementation as needed
   
6. Merge to develop
   └─ Branch is deleted
   └─ Changes ready for next release
```

---

## Branch Naming Conventions

All branches use **lowercase letters and hyphens** only. The format is:

```
{type}/block-{component}-{description}
```

### Branch Types for Block Development

#### Feature Development (6 types)

| Type | Format | Purpose | Examples |
|------|--------|---------|----------|
| **feat** | `feat/block-{component}-{feature}` | New block or block feature | `feat/block-hero-parallax-scroll`, `feat/block-testimonial-carousel` |
| **feat-a11y** | `feat/block-{component}-accessibility` | Accessibility improvements (WCAG 2.2 AAA) | `feat/block-gallery-a11y-focus-management` |
| **perf** | `perf/block-{component}-{optimization}` | Performance enhancements | `perf/block-slider-lazy-loading`, `perf/block-animation-reduce-repaints` |
| **patterns** | `feat/block-patterns-{category}` | Block pattern collections | `feat/block-patterns-landing-pages` |
| **research** | `research/block-{topic}` | POC and exploration | `research/block-interactivity-api` |

#### Bug Fixes (3 types)

| Type | Format | Purpose | Examples |
|------|--------|---------|----------|
| **fix** | `fix/block-{component}-{issue}` | General bug fixes | `fix/block-button-color-contrast-wcag` |
| **security** | `security/block-{component}-{vulnerability}` | Security fixes | `security/block-html-xss-sanitization` |
| **a11y** | `a11y/block-{component}-{issue}` | Accessibility bug fixes | `a11y/block-image-alt-text-validation` |

#### Infrastructure & Testing (4 types)

| Type | Format | Purpose | Examples |
|------|--------|---------|----------|
| **test** | `test/block-{component}-{test-type}` | Test additions/improvements | `test/block-gallery-e2e-carousel`, `test/block-form-validation-unit` |
| **ci** | `ci/block-{tool}-{improvement}` | CI/CD improvements | `ci/block-e2e-testing-setup`, `ci/block-bundle-size-monitoring` |
| **refactor** | `refactor/block-{component}-{improvement}` | Code quality refactoring | `refactor/block-tabs-component-composition` |
| **docs** | `docs/block-{component}-{documentation}` | Documentation updates | `docs/block-carousel-usage-guide` |

#### Release & Hotfixes (2 types)

| Type | Format | Purpose | Examples |
|------|--------|---------|----------|
| **release** | `release/block-v{version}` | Planned releases | `release/block-v2-0-0` |
| **hotfix** | `hotfix/block-{component}-{urgency}` | Urgent production fixes | `hotfix/block-image-responsive-regression` |

### Valid Examples ✅

```
feat/block-hero-parallax-scroll
feat/block-header-responsive-layout
feat/block-testimonial-carousel
fix/block-button-color-wcag
perf/block-gallery-lazy-loading
a11y/block-form-keyboard-nav
test/block-slider-e2e-carousel
docs/block-api-migration-guide
release/block-v2-0-0
hotfix/block-navigation-mobile-critical
```

### Invalid Examples ❌

```
feat/add-new-block              # Missing component, too vague
feature/button-block            # Wrong prefix (use 'feat')
fix_button_block_color          # Underscores instead of hyphens
HOTFIX/BLOCK-IMAGE-CRITICAL     # Uppercase not allowed
block/hero/parallax             # Wrong delimiters
```

---

## Versioning Strategy

We follow **Semantic Versioning (SemVer)** for all blocks and block-related components.

### Version Format

```
major.minor.patch
1.2.3
```

### When to Bump Each Level

| Version | When to Bump | Examples |
|---------|------------|----------|
| **MAJOR** | Breaking changes to block API or behavior | Block attribute structure change, removal of core functionality |
| **MINOR** | New features, backward compatible | New block variation, new pattern library, accessibility improvement |
| **PATCH** | Bug fixes, security fixes, no API changes | Fix rendering bug, security vulnerability patch, performance tweak |

### Block Version Configuration

Block versions are specified in `block.json`:

```json
{
  "name": "namespace/my-block",
  "version": "1.2.0",
  "requires": "6.0",
  "requires_php": "7.4",
  "title": "My Custom Block",
  "description": "Description of the block",
  "category": "common"
}
```

Also update `package.json`:

```json
{
  "name": "@namespace/my-block",
  "version": "1.2.0"
}
```

### Backward Compatibility

- **Never** remove block attributes without migration
- **Always** provide migration functions when changing attribute structure
- **Test** blocks across supported WordPress versions (minimum: 6.0)
- **Document** any version-specific behavior

### Example Versioning Scenarios

**Bug Fix (1.0.0 → 1.0.1)**
```
- Fix: Correct button color contrast to meet WCAG AA standard
- Branch: fix/block-button-color-wcag
- Changelog entry required
```

**New Feature (1.0.1 → 1.1.0)**
```
- feat: Add new testimonial carousel variation with autoplay
- Branch: feat/block-testimonial-carousel
- Backward compatible, existing testimonials still work
- Changelog entry with usage examples
```

**Breaking Change (1.1.0 → 2.0.0)**
```
- feat: Redesign block API to use new React hooks pattern
- Branch: feat/block-redesign-react-hooks
- Migration guide required in documentation
- Changelog explains breaking changes and upgrade path
```

---

## Testing Requirements

All block development requires comprehensive testing. The requirements vary by block type.

### Testing by Block Category

#### Interactive Blocks (forms, sliders, modals, etc.)
- **Jest unit tests** — 85%+ code coverage (block logic, validation)
- **Playwright E2E tests** — User interactions (submit form, slide carousel, open/close)
- **Accessibility tests** — WCAG 2.2 AAA compliance (keyboard nav, screen readers, focus management)
- **Visual regression tests** — Rendering across breakpoints

#### Display Blocks (hero, testimonial carousel, pricing table, etc.)
- **Visual tests** — Rendering across breakpoints (mobile, tablet, desktop)
- **Accessibility tests** — WCAG 2.2 AAA (color contrast, heading structure, alt text)
- **Snapshot tests** — Block markup consistency

#### Container Blocks (column, group, section, etc.)
- **E2E tests** — Nested blocks, drag-and-drop, responsive behavior
- **Accessibility tests** — WCAG 2.2 AAA focus management, keyboard navigation
- **Nesting tests** — Valid and invalid nesting scenarios
- **Performance tests** — Render time with deeply nested content

#### Pattern Blocks
- **Template tests** — Pattern displays correctly
- **Accessibility tests** — WCAG 2.2 AAA (all inner blocks)
- **Responsive tests** — Pattern layout at all breakpoints

### Test File Structure

```
blocks/
├── my-block/
│   ├── block.json
│   ├── edit.js
│   ├── save.js
│   ├── index.js
│   ├── style.scss
│   ├── __tests__/
│   │   ├── edit.test.js         # Jest unit tests
│   │   └── my-block.spec.js     # Playwright E2E tests
│   └── README.md
```

### Jest Unit Tests Example

```javascript
// __tests__/my-block.test.js
import { render, screen } from '@testing-library/react';
import MyBlock from '../edit';

describe('MyBlock', () => {
  it('renders with correct default attributes', () => {
    const { container } = render(<MyBlock attributes={{}} />);
    expect(container).toBeInTheDocument();
  });

  it('updates title when attribute changes', () => {
    const { rerender } = render(
      <MyBlock attributes={{ title: 'Original' }} />
    );
    rerender(<MyBlock attributes={{ title: 'Updated' }} />);
    expect(screen.getByText('Updated')).toBeInTheDocument();
  });
});
```

### Playwright E2E Tests Example

```javascript
// __tests__/my-block.spec.js
import { test, expect } from '@playwright/test';

test.describe('MyBlock', () => {
  test('renders block in editor', async ({ page }) => {
    await page.goto('/wp-admin/');
    // Login and navigate to editor
    await page.click('[aria-label="Add block"]');
    await page.fill('[placeholder="Search"]', 'My Block');
    await page.click('[data-block="namespace/my-block"]');
    
    const block = await page.locator('[data-type="namespace/my-block"]');
    await expect(block).toBeVisible();
  });

  test('submits form with valid data', async ({ page }) => {
    // Test interactive form submission
    await page.fill('[name="email"]', 'test@example.com');
    await page.click('[aria-label="Submit"]');
    
    const success = await page.locator('.success-message');
    await expect(success).toBeVisible();
  });
});
```

### Accessibility Testing

Use WordPress's built-in accessibility checks and `jest-axe`:

```javascript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('MyBlock meets WCAG 2.2 AAA standards', async () => {
  const { container } = render(<MyBlock attributes={{}} />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### WCAG 2.2 AAA Compliance Checklist

- [ ] All interactive elements are keyboard accessible (Tab, Enter, Escape, Arrow keys)
- [ ] Focus indicator is visible and clear
- [ ] Color is not the only way to convey information
- [ ] Text has sufficient color contrast (4.5:1 for normal, 3:1 for large)
- [ ] Form inputs have associated labels
- [ ] Alt text for images (descriptive, not redundant)
- [ ] Heading hierarchy is logical (no skipped levels)
- [ ] Screen reader text (`aria-label`, `aria-describedby`) where needed
- [ ] Respects `prefers-reduced-motion` media query
- [ ] No flashing or auto-playing content that could trigger seizures

### Running Tests

```bash
# Unit tests (Jest)
npm test

# E2E tests (Playwright)
npm run test:e2e

# With coverage reporting
npm test -- --coverage

# Watch mode (development)
npm test -- --watch

# Run specific test file
npm test -- __tests__/edit.test.js
```

### Code Coverage Requirements

- **Target:** 85%+ code coverage
- **Branches:** >80% branch coverage
- **Functions:** >85% function coverage
- **Lines:** >85% line coverage

View coverage report:

```bash
npm test -- --coverage
# Opens coverage/index.html in browser
```

---

## CI/CD Pipeline

Our GitHub Actions workflow automatically validates every push and pull request.

### Automatic Checks on Every Branch Push

✅ **WordPress Coding Standards (PHPCS)** — PHP syntax, naming conventions  
✅ **ESLint** — JavaScript/JSX code quality  
✅ **Jest Tests** — JavaScript unit tests with coverage reporting  
✅ **PHPUnit Tests** — PHP server-side tests (if applicable)  
✅ **Playwright E2E Tests** — Interactive block testing  
✅ **WCAG 2.2 AAA Audit** — Accessibility compliance check  
✅ **Bundle Size Monitor** — Warns if block JavaScript exceeds threshold  
✅ **Lint Check** — Markdown, JSON, YAML validation

### Branch Protection Rules

**For `develop` and `main` branches:**
- ✅ All status checks must pass (CI/CD pipeline)
- ✅ Require at least 1 pull request review approval
- ✅ Require up-to-date branch before merging
- ✅ Require branches to be deleted after merge

**For feature branches:**
- Auto-labeled with `area:blocks` and appropriate type label
- Hotfix branches auto-labeled `priority:critical`

### Reading CI/CD Results

In your pull request, look for:

```
✅ All checks passed
  ✅ PHPCS (WordPress Coding Standards)
  ✅ ESLint
  ✅ Jest (85.2% coverage)
  ✅ PHPUnit
  ✅ Playwright E2E
  ✅ Accessibility Audit
  ✅ Bundle Size Monitor
```

If any check fails, click on "Details" to see the error and fix it before re-pushing.

### Common CI/CD Failures and Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| ESLint errors | Code style violations | Run `npm run lint -- --fix` |
| Jest coverage < 85% | Insufficient test coverage | Add tests for uncovered code paths |
| PHPCS violations | PHP coding standard violations | Run `composer lint -- --fix` |
| Accessibility violations | WCAG issue detected | Check heading hierarchy, color contrast, labels |
| Bundle size warning | Block JS exceeds threshold | Optimize imports, remove unused dependencies |

---

## Release Process

### Creating a Release (Feature/Minor/Major)

#### Step 1: Create Release Branch from `develop`

```bash
git checkout develop
git pull origin develop
git checkout -b release/block-v2-1-0
```

#### Step 2: Update Version Files

Update version in `block.json`:
```json
{
  "version": "2.1.0"
}
```

Update version in `package.json`:
```json
{
  "version": "2.1.0"
}
```

#### Step 3: Update CHANGELOG.md

Add release notes following [Keep a Changelog](https://keepachangelog.com/) format:

```markdown
## [2.1.0] - 2024-02-15

### Added
- New carousel variation with autoplay support
- Keyboard shortcut documentation
- Playground support for block patterns

### Fixed
- Button focus outline not visible in dark mode (WCAG AA compliance)
- Slider not responding to arrow keys on mobile

### Changed
- Improved performance by 35% on low-end devices
- Updated minimum WordPress version requirement to 6.2

### Security
- Fixed XSS vulnerability in custom HTML sanitization
```

#### Step 4: Commit Release Changes

```bash
git add block.json package.json CHANGELOG.md
git commit -m "release(block): v2.1.0

- Update version to 2.1.0
- Add changelog entries
- Closes #456"

git push -u origin release/block-v2-1-0
```

#### Step 5: Create Pull Request

Open PR from `release/block-v2-1-0` to `main`. CI/CD runs full test suite.

#### Step 6: Merge and Tag

Once approved and CI passes:

```bash
git checkout main
git pull origin main
git merge --squash release/block-v2-1-0
git tag -a block-v2-1-0 -m "Release version 2.1.0"
git push origin main --tags
git branch -d release/block-v2-1-0
git push origin --delete release/block-v2-1-0
```

#### Step 7: Back-Merge to Develop

```bash
git checkout develop
git pull origin develop
git merge main
git push origin develop
```

### Hotfix Process (Urgent Production Fix)

#### Step 1: Create Hotfix Branch from `main`

```bash
git checkout main
git pull origin main
git checkout -b hotfix/block-image-responsive-regression
```

#### Step 2: Make Minimal Fix

Make only the necessary change to fix the issue. Nothing more.

#### Step 3: Bump Patch Version

Update patch version in `block.json` and `package.json`:

```json
{
  "version": "2.0.1"
}
```

#### Step 4: Update CHANGELOG.md

```markdown
## [2.0.1] - 2024-02-14

### Fixed
- Image block not responsive on tablets (regression from 2.0.0)
```

#### Step 5: Commit and Push

```bash
git add block.json package.json CHANGELOG.md
git commit -m "hotfix(block): fix image responsive regression

- Correct image width calculation for tablet breakpoints
- Closes #789"

git push -u origin hotfix/block-image-responsive-regression
```

#### Step 6: Create PR, Merge, Tag

Create PR to `main`, get approval, merge, and tag:

```bash
git checkout main
git merge --squash hotfix/block-image-responsive-regression
git tag -a block-v2-0-1 -m "Hotfix version 2.0.1"
git push origin main --tags
```

#### Step 7: Back-Merge to Develop

```bash
git checkout develop
git merge main
git push origin develop
```

---

## Quick Start Examples

### Example 1: Adding a New Block Feature

```bash
# 1. Create feature branch
git checkout -b feat/block-hero-parallax-scroll

# 2. Develop the feature
# - Write block.json with new attributes
# - Add edit.js with block editing experience
# - Add save.js with frontend rendering
# - Create __tests__/hero.test.js with Jest tests
# - Create __tests__/hero.spec.js with Playwright E2E tests
# - Test WCAG 2.2 AAA compliance

# 3. Run tests locally
npm test
npm run test:e2e
npm run test:a11y

# 4. Commit work
git add .
git commit -m "feat(block-hero): add parallax scroll effect

- Implement parallax using Intersection Observer API
- Add accessibility support with prefers-reduced-motion
- Include 89% Jest coverage with unit and integration tests
- Add Playwright E2E tests for parallax interaction
- Verify WCAG 2.2 AAA compliance
- Closes #123"

# 5. Push and create PR
git push -u origin feat/block-hero-parallax-scroll
# → Open PR on GitHub
# → CI/CD validates automatically
# → Address any feedback
# → Merge to develop
```

### Example 2: Fixing a Block Bug

```bash
# 1. Create fix branch
git checkout -b fix/block-button-color-wcag

# 2. Fix the bug (focused change only)
# - Update button style to improve color contrast
# - Add regression test

# 3. Test the fix
npm test -- __tests__/button.test.js
npm run test:a11y

# 4. Commit
git commit -m "fix(block-button): improve color contrast to WCAG AA

- Change button text color from #666 to #000
- Increases contrast ratio from 4.2:1 to 9:1
- Add regression test
- Closes #456"

git push -u origin fix/block-button-color-wcag
```

### Example 3: Releasing a Block

```bash
# 1. Create release branch
git checkout -b release/block-v1-5-0

# 2. Update versions and changelog
# - Edit block.json: "version": "1.5.0"
# - Edit package.json: "version": "1.5.0"
# - Update CHANGELOG.md with new features

# 3. Commit
git commit -m "release(block): v1.5.0

- Bump version to 1.5.0
- Update changelog with new features and fixes"

git push -u origin release/block-v1-5-0

# 4. Create PR, get approval, merge to main
git checkout main
git merge --squash release/block-v1-5-0
git tag -a block-v1-5-0 -m "Release version 1.5.0"
git push origin main --tags
git push origin --delete release/block-v1-5-0

# 5. Back-merge to develop
git checkout develop
git merge main
git push origin develop
```

---

## Key Takeaways for New Developers

1. **Branch Naming:** Always follow format `{type}/block-{component}-{description}` with lowercase and hyphens
2. **Testing:** All blocks require Jest (85%+), Playwright E2E (interactive), and WCAG 2.2 AAA compliance
3. **Versioning:** Use SemVer (major.minor.patch); update block.json and package.json
4. **CI/CD:** Automatic validation runs on every push; all checks must pass before merge
5. **Accessibility:** WCAG 2.2 AAA is non-negotiable; test keyboard navigation, screen readers, focus management
6. **Commits:** Use conventional format `type(block-name): description` with details in body
7. **Code Review:** All PRs require peer review and passing CI/CD before merging to develop

---

## Common Questions

**Q: What if I need to work on multiple blocks at once?**  
A: Create separate branches for each block. Each PR is reviewed independently.

**Q: How often should I commit?**  
A: Commit frequently (every logical change), but keep commit messages meaningful and focused.

**Q: Can I skip tests for simple fixes?**  
A: No. All changes require tests. Even small fixes need regression tests to prevent future breakage.

**Q: What if a test is flaky?**  
A: Mark it as flaky in the test file and open an issue to investigate. Don't merge with failing/flaky tests.

**Q: How do I handle backward compatibility?**  
A: Always provide block migrations when changing attributes. Never remove attributes without migration functions.

**Q: Who do I ask if I'm stuck?**  
A: Post in #blocks Slack channel or open a draft PR asking for guidance. We're here to help!

---

## Resources

- **Main Documentation:** https://github.com/lightspeedwp/branch-validation
- **WordPress Block Handbook:** https://developer.wordpress.org/block-editor/
- **Accessibility (WCAG 2.2 AAA):** https://www.w3.org/WAI/WCAG22/quickref/
- **Jest Testing:** https://jestjs.io/
- **Playwright:** https://playwright.dev/
- **Semantic Versioning:** https://semver.org/
- **Keep a Changelog:** https://keepachangelog.com/
- **WordPress Coding Standards:** https://developer.wordpress.org/coding-standards/wordpress-coding-standards/

---

## Next Steps

1. **Clone the repository** and set up your local environment
2. **Run the test suite** to verify your setup: `npm test`
3. **Create your first branch** using our naming conventions
4. **Read a block's `README.md`** to understand the project structure
5. **Pick an issue** labeled `good-first-issue` and start contributing
6. **Ask questions** — we're here to help you succeed!

Welcome aboard! 🚀
