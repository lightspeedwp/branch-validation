# WordPress Block Development Team Onboarding Guide

Welcome to the team! This guide explains our WordPress block development workflow, branch naming conventions, versioning strategy, and testing requirements.

---

## Quick Start (First Day)

1. **Install Lefthook** (git hooks for validation)
   ```bash
   npm install lefthook --save-dev
   npx lefthook install
   ```

2. **Familiarize yourself with branch naming patterns** (see Branch Naming Conventions below)

3. **Read this guide** — takes about 15 minutes

4. **Clone our branch-validation repository** for reference:
   ```bash
   git clone https://github.com/lightspeedwp/branch-validation.git
   ```

5. **Ask a team lead** for access to theme/plugin projects you'll be working on

---

## WordPress Block Development Workflow

Our team follows a structured, scalable approach to block development that works across themes and plugins.

### Development Contexts

We support three primary development contexts, each with its own patterns and tools:

#### 1. **Theme Block Development**
Theme blocks are registered in `theme/blocks/` and integrated with WordPress theme setup and `theme.json`.

**Key characteristics:**
- Blocks live in the active theme
- Integrated with `theme.json` for design tokens and settings
- Static and dynamic blocks both supported
- Tested within the block editor and frontend

**Project structure:**
```
theme/
├── blocks/
│   ├── hero/
│   │   ├── block.json
│   │   ├── edit.js
│   │   ├── save.js
│   │   └── style.scss
│   ├── carousel/
│   ├── testimonial/
│   └── [more blocks]
├── theme.json
└── [rest of theme]
```

**To start theme block work:**
1. Create a branch: `feat/block-hero-hero-section` or `feat/block-carousel-auto-scroll`
2. Add your block to `blocks/` directory
3. Register in theme setup (usually `functions.php` or dedicated `inc/blocks.php`)
4. Update `theme.json` with any new design tokens
5. Add styles to `style.scss`

#### 2. **Plugin Block Development**
Plugin blocks are registered in `plugin/blocks/` and can be activated independently.

**Key characteristics:**
- Blocks live in a dedicated plugin
- Registered via `register_block_type()` or `block.json` metadata
- Can include server-side rendering (dynamic blocks)
- PHPUnit tests required for server logic

**Project structure:**
```
plugin/
├── blocks/
│   ├── form/
│   │   ├── block.json
│   │   ├── edit.js
│   │   ├── render.php (server-side)
│   │   ├── style.scss
│   │   └── __tests__/
│   ├── accordion/
│   └── [more blocks]
├── plugin.php (main file)
├── tests/
│   └── [PHPUnit tests]
└── [rest of plugin]
```

**To start plugin block work:**
1. Create a branch: `feat/block-form-ajax-submission` or `fix/block-accordion-keyboard-nav`
2. Add your block to `blocks/` directory
3. Ensure `register_block_type()` call in plugin setup
4. Add PHPUnit tests for any server-side logic
5. For complex logic, add separate test files

#### 3. **Testing & QA Focus**
Dedicated testing work covers Jest configuration, Playwright E2E tests, accessibility, and performance.

**To start testing work:**
1. Create a branch: `test/jest-block-hero-snapshot` or `test/a11y-wcag-carousel-keyboard`
2. Add test files to `__tests__/` or `tests/` directory
3. Update test configuration if needed
4. Ensure WCAG 2.2 AAA compliance (see Testing Requirements)

---

## Branch Naming Conventions

Our branch names follow a structured pattern to enable automation, routing, and CI/CD integration.

### Branch Name Pattern

```
{type}/{prefix}-{name}-{feature}
```

### 1. Branch Types

**Development Work:**
- `feat/` — New block or feature
- `fix/` — Bug fix in existing block
- `hotfix/` — Production-critical fix (requires special handling)
- `security/` — Security patch
- `perf/` — Performance improvement
- `a11y/` — Accessibility improvement (WCAG 2.2)

**Quality & Maintenance:**
- `test/` — Adding or improving tests
- `ci/` — CI/CD configuration or automation
- `docs/` — Documentation (README, inline comments, guides)
- `refactor/` — Code improvement without feature change
- `chore/` — Dependencies, build config, etc.

**Release Work:**
- `release/` — Release branch (e.g., `release/v2.1.0`)
- `hotfix/` — Hotfix branch (e.g., `hotfix/v2.0.1`)

### 2. Prefix

- `block-` for block-related work (most common)
- `theme-` for theme configuration/setup work
- `plugin-` for plugin infrastructure work
- Other prefixes as needed (e.g., `docs-`, `ci-`)

### 3. Block Name

Descriptive, lowercase, hyphenated:
- `hero` (hero banner block)
- `carousel` (carousel/slider block)
- `testimonial` (testimonial block)
- `form` (contact form block)
- `accordion` (accordion/collapsible block)

### 4. Feature Description

What you're building or fixing:
- `hero-section` (new hero section block)
- `auto-scroll` (auto-scroll feature for carousel)
- `keyboard-nav` (keyboard navigation fix)
- `ajax-submission` (AJAX form submission)
- `snapshot` (adding snapshot tests)

### Complete Examples

```
feat/block-hero-hero-section           # New hero section block
feat/block-carousel-auto-scroll        # Add auto-scroll to carousel
fix/block-accordion-keyboard-nav       # Fix keyboard navigation
security/block-form-xss-prevention     # Security patch for form block
perf/block-carousel-lazy-load          # Add lazy loading
a11y/block-hero-wcag-color-contrast    # Improve color contrast
test/jest-block-hero-snapshot          # Add snapshot tests
docs/block-carousel-readme             # Update carousel documentation
refactor/block-form-state-management   # Clean up form state logic
```

### Branch Naming Validation

When you push a branch, Lefthook will automatically validate your branch name. If it doesn't match the pattern, you'll see an error:

```
Error: Invalid branch name 'my-awesome-feature'
Expected pattern: {type}/{prefix}-{name}-{feature}
Examples: feat/block-hero-new-section
```

**To bypass validation during testing** (not recommended for production):
```bash
git push --no-verify
```

---

## Versioning Strategy

We use Semantic Versioning (SemVer) across all blocks and the overall plugin/theme.

### Version Format

```
MAJOR.MINOR.PATCH
1.2.3
```

### When to Bump Versions

**MAJOR** (Breaking changes)
- Remove a block
- Change block registration API
- Remove/rename required block attributes
- Change PHP function signatures (plugins)

**MINOR** (New features, backwards compatible)
- Add new block
- Add new block attribute
- Add new hook or filter
- Add new block variation

**PATCH** (Bug fixes)
- Fix block rendering bug
- Fix accessibility issue
- Fix security vulnerability
- Update dependency with minor version

### Version Location

**For Themes:**
- `theme.json` → `"version"` field
- `style.css` → `Version:` comment
- README.md → Top of file

**For Plugins:**
- `plugin.php` → Header comment `Version:`
- `readme.txt` → `Stable tag:` field
- `package.json` → `"version"` field (if using npm)

### Release Process

1. **Update version** in all locations (see Version Location above)
2. **Update CHANGELOG.md** (see below)
3. **Create release branch**: `release/v1.2.3`
4. **Create PR** to `main` branch
5. **Get code review** from team lead
6. **Merge to main**
7. **Tag the commit**: `git tag v1.2.3 && git push origin v1.2.3`
8. **Create GitHub Release** with release notes
9. **Deploy to WordPress.org** (if plugin/theme)

### CHANGELOG Format

We follow [Keep a Changelog 1.1.0](https://keepachangelog.com/1.1.0/) format:

```markdown
# Changelog

## [2.1.0] - 2026-11-01

### Added
- New carousel block with auto-scroll feature
- WCAG 2.2 AAA keyboard navigation support

### Fixed
- Accordion block keyboard navigation bug
- Form block XSS vulnerability

### Changed
- Updated block editor styling

### Deprecated
- Legacy carousel block (use new carousel instead)

### Security
- Fixed XSS vulnerability in form block

### Removed
- Old testimonial block variant

## [2.0.0] - 2026-10-15

### Breaking Changes
- Changed form block registration API (see MIGRATION.md)

### Added
- New form block with AJAX submission
```

### Multi-Block Coordination

When multiple blocks are released together:
1. Coordinate version bumps (typically all blocks in plugin/theme bump together)
2. Document each block's changes in CHANGELOG
3. Use single version number for theme/plugin, individual versions for blocks only if published separately

---

## Testing Requirements

Testing is mandatory for all blocks. Here's what's required:

### 1. JavaScript/TypeScript Testing (Jest)

**Requirements:**
- Unit tests for block logic
- Snapshot tests for block structure
- Props/attributes tests
- Event handler tests
- Minimum 80% code coverage

**Test file location:**
```
block-name/
├── __tests__/
│   ├── edit.test.js
│   ├── save.test.js
│   ├── block.test.js
│   └── [other tests]
├── block.json
├── edit.js
└── save.js
```

**Example Jest test:**
```javascript
import { render } from '@testing-library/react';
import { HeroBlock } from '../edit';

describe('Hero Block', () => {
  it('renders with correct attributes', () => {
    const props = {
      attributes: { title: 'Welcome' },
      setAttributes: jest.fn(),
    };
    const { container } = render(<HeroBlock {...props} />);
    expect(container.querySelector('h1')).toHaveTextContent('Welcome');
  });

  it('matches snapshot', () => {
    const { container } = render(<HeroBlock {...defaultProps} />);
    expect(container).toMatchSnapshot();
  });
});
```

**Run tests:**
```bash
npm test                    # Run all tests
npm test -- --coverage      # Run with coverage report
npm test -- --watch         # Watch mode during development
```

### 2. End-to-End Testing (Playwright)

**Requirements for blocks with complex interactions:**
- Editor insertion/configuration flow
- Frontend rendering
- User interactions (clicks, form submission, etc.)
- Responsive behavior

**Test file location:**
```
tests/e2e/
├── carousel.spec.js
├── form-submission.spec.js
└── [other E2E tests]
```

**Example Playwright test:**
```javascript
import { test, expect } from '@playwright/test';

test('carousel block loads and advances slides', async ({ page }) => {
  await page.goto('/wp-admin/');
  await page.locator('text=Add new post').click();
  await page.locator('[aria-label="Add block"]').click();
  await page.locator('text=Carousel').click();
  
  const carousel = page.locator('.wp-block-carousel');
  await expect(carousel).toBeVisible();
  
  await page.locator('.carousel-next').click();
  const secondSlide = carousel.locator('.slide:nth-child(2)');
  await expect(secondSlide).toHaveClass(/active/);
});
```

**Run E2E tests:**
```bash
npm run test:e2e                           # Run all E2E tests
npm run test:e2e -- --headed              # Show browser window
npm run test:e2e carousel.spec.js          # Run specific test file
```

### 3. Accessibility Testing (WCAG 2.2 AAA)

**Requirements:**
- All interactive elements keyboard accessible (Tab, Enter, Escape)
- Proper ARIA labels and roles
- Color contrast ratio ≥ 7:1 (AAA standard)
- Focus indicators visible
- Screen reader tested

**Accessibility checklist before PR:**

- [ ] All buttons/links keyboard accessible
- [ ] Escape key closes modals
- [ ] Tab order is logical
- [ ] Focus ring visible when tabbing
- [ ] ARIA labels on icon buttons
- [ ] Color contrast checked (use Lighthouse)
- [ ] Screen reader tested (NVDA, JAWS, VoiceOver)
- [ ] Form labels properly associated
- [ ] Headings in logical order (h1 → h2 → h3, etc.)

**Tools:**
- **Lighthouse** (built into Chrome DevTools)
- **axe DevTools** (browser extension)
- **WAVE** (web accessibility evaluation tool)

**Test accessibility in Playwright:**
```javascript
import { injectAxe, checkA11y } from 'axe-playwright';

test('carousel block is accessible', async ({ page }) => {
  await page.goto('/test-page-with-carousel/');
  await injectAxe(page);
  await checkA11y(page);
});
```

### 4. PHP Unit Testing (Plugins Only)

**Requirements for server-side logic:**
- Unit tests for render callbacks
- Tests for custom hooks/filters
- Database integration tests if applicable

**Test file location:**
```
plugin/
├── tests/
│   ├── bootstrap.php
│   ├── test-form-block.php
│   └── [other tests]
├── blocks/
└── plugin.php
```

**Example PHPUnit test:**
```php
<?php
class FormBlockTest extends WP_UnitTestCase {
  public function test_form_block_renders_with_required_fields() {
    $attributes = array(
      'fields' => array(
        array( 'label' => 'Name', 'required' => true ),
      ),
    );
    $output = render_block_form( $attributes );
    $this->assertStringContainsString( 'required', $output );
  }
}
```

**Run PHP tests:**
```bash
npm run test:php              # Run all PHPUnit tests
npm run test:php -- test-form-block.php  # Specific test
```

### 5. Performance Testing

**Lightweight blocks** (< 50KB):
- Check bundle size before/after
- Lighthouse performance score ≥ 90

**Monitor with:**
```bash
npm run build              # Build block
ls -lh build/index.js      # Check size
npm run test:performance   # Run Lighthouse
```

**Large/complex blocks** (≥ 50KB):
- Add progressive enhancement (lazy load non-critical features)
- Plan feature separation into multiple smaller blocks
- Document performance implications

### 6. Test Coverage Goals

- **Minimum:** 80% code coverage
- **Target:** 90%+ code coverage
- **Critical paths:** 100% coverage (form submission, security-related code)

**Check coverage:**
```bash
npm test -- --coverage
```

---

## Common Workflows

### Starting New Block Development

```bash
# 1. Create feature branch with proper naming
git checkout -b feat/block-carousel-auto-scroll

# 2. Create block file structure
mkdir -p src/blocks/carousel/{__tests__,__stories__}
touch src/blocks/carousel/{block.json,edit.js,save.js,style.scss}

# 3. Add to block.json (template):
{
  "apiVersion": 3,
  "name": "myteam/carousel",
  "title": "Carousel",
  "category": "media",
  "description": "Carousel block with auto-scroll"
}

# 4. Write edit.js with interactivity
# 5. Add tests to __tests__/ directory
# 6. Run tests before commit
npm test
npm run build
```

### Fixing a Bug in Production

```bash
# 1. Branch from current release tag
git checkout -b hotfix/v2.0.1

# 2. Identify affected block
# 3. Write failing test that reproduces bug
npm test -- test-specific-bug.test.js

# 4. Fix the bug
# 5. Verify test passes
# 6. Bump PATCH version only
# 7. Update CHANGELOG with [BUGFIX] section
# 8. Create PR to main with urgent label
```

### Adding Tests to Existing Block

```bash
# 1. Create test branch
git checkout -b test/jest-block-hero-snapshot

# 2. Create test files
touch src/blocks/hero/__tests__/{edit.test.js,save.test.js}

# 3. Write tests
npm test -- hero

# 4. Achieve target coverage (80%+)
npm test -- --coverage

# 5. Commit and push for review
```

---

## Git Hooks & Automation (Lefthook)

Lefthook runs automated checks before and after git operations. Here's what happens:

### Pre-Push

1. **Branch name validation** — Validates branch follows pattern
2. **Linting** — Runs ESLint on changed files
3. **Tests** — Runs Jest tests (must pass)
4. **Coverage** — Checks coverage threshold (80%)

### Commit Message Validation

- Must reference an issue or PR: `#123`
- Cannot be empty
- Automatically prepends branch name if not already included

### Post-Merge

- Installs dependencies if `package.json` or `composer.json` changed
- Clears build cache if needed

**Skip hooks** (rarely needed):
```bash
git push --no-verify          # Skip pre-push hooks
git commit --no-verify        # Skip pre-commit hooks
```

---

## Common Questions

### Q: What if my block doesn't fit the naming pattern?

Your push will be blocked. Examples of corrections:

| Invalid | Valid |
|---------|-------|
| `my-awesome-feature` | `feat/block-hero-new-design` |
| `feature/hero-block` | `feat/block-hero-new-section` |
| `feat/hero` | `feat/block-hero-section` |
| `feat-block-hero-new` | `feat/block-hero-new-section` |

### Q: How do I know which version to bump?

- **Changed a block attribute?** → MINOR
- **Removed a block?** → MAJOR
- **Fixed a rendering bug?** → PATCH
- **Added a new block?** → MINOR
- **Security patch?** → PATCH (always)

### Q: Do I have to use Lefthook?

Yes, for all commits to shared branches. It's installed with:
```bash
npm install lefthook --save-dev
npx lefthook install
```

### Q: My tests are failing. What do I do?

1. Run tests locally: `npm test`
2. Check error messages carefully
3. Fix the code or test
4. Re-run: `npm test`
5. Push only when all tests pass

### Q: Can I add a block to both a theme and plugin?

Generally no — choose one. If you need to share logic:
1. Create a dedicated plugin with the block
2. Include it in theme dependencies
3. Or: Create shared utility package (advanced)

### Q: How do I test accessibility?

1. **Automatic:** Playwright + axe integration
2. **Manual:** Use Lighthouse, axe DevTools, screen reader
3. **Before PR:** Use accessibility checklist above
4. **Required:** Keyboard navigation + proper ARIA labels

### Q: What's the minimum test coverage?

80% for all code. Higher (90%+) for:
- Security-related code
- Form handling
- API integrations
- Accessibility features

---

## Resources

- **Repo:** https://github.com/lightspeedwp/branch-validation
- **Slack:** #wordpress-blocks channel (ask questions here)
- **Documentation:** See docs/ folder in repo
- **Block API Docs:** https://developer.wordpress.org/block-editor/reference-guides/block-api/
- **WCAG 2.2 Guide:** https://www.w3.org/WAI/WCAG22/quickref/
- **Jest Testing:** https://jestjs.io/
- **Playwright:** https://playwright.dev/

---

## Support

- **Questions about branching?** Ask in #wordpress-blocks
- **Tests failing?** Run locally first, check error message, ping team
- **Version bump confusion?** Reference SemVer section above or ask team lead
- **Accessibility issues?** Use axe DevTools or WAVE, or ask QA team
- **Block registration issues?** Check WordPress block API docs or ask senior developer

---

**Version:** 1.0.0 | **Last Updated:** 2026-11-01 | **For Questions:** #wordpress-blocks Slack channel
