# LightSpeed WP Canonical Strategy Integration

## Overview

This reference document bridges the canonical LightSpeed WP branching strategy (from `lightspeedwp/.github`) with the WordPress block-specific branch validation skill.

## Canonical Strategy (LightSpeed Org-Wide)

**Source:** https://github.com/lightspeedwp/.github

### Branch Naming Pattern

```
{type}/{scope}-{short-title}
```

**Examples:**
- `feat/user-authentication-system`
- `fix/login-timeout-issue`
- `hotfix/critical-security-patch`

### Validation Rules

**Format Requirements:**
- Lowercase letters only
- Hyphens for word separation (no underscores, dots, or spaces)
- 50 characters maximum
- Matches: `^{type}/{scope}-{title}$`

**Allowed Types (30+):**
```
Feature Development: feat, proto, perf, research, api, seo
Bug Fixes: fix, hotfix, revert
Release: release
Code Organization: refactor, schema, migrate
Tasks: task, chore, config
Documentation: docs, doc, i18n, content
Testing: test, qa, uat
CI/CD: ci, build, ops, telemetry
Dependencies: deps
Security: security
Design: design, ds, ux, a11y
Audit: audit
AI/Automation: codex, aiops, automation
Epics: epic
```

**Forbidden Prefixes:**
- `claude/` — AI assistant tool
- `copilot/` — Microsoft tool
- `openai/` — AI provider tool

## WordPress Block-Specific Mapping

### Block Feature Branches

**Canonical Pattern:** `feat/{scope}-{title}`

**WordPress Block Adaptation:** `feat/block-{blockname}-{feature}`

**Examples:**
```
feat/block-hero-parallax          → New hero block feature
feat/block-carousel-variations    → Block variations
feat/block-patterns-landing-pages → Pattern library
```

### Block Bug Fixes

**Canonical Pattern:** `fix/{scope}-{issue}`

**WordPress Block Adaptation:** `fix/block-{blockname}-{issue}`

**Examples:**
```
fix/block-button-color-contrast
fix/block-list-nesting-save-error
```

### Block Security

**Canonical Pattern:** `security/{scope}-{vulnerability}`

**WordPress Block Adaptation:** `security/block-{blockname}-{vulnerability}`

**Examples:**
```
security/block-html-xss-sanitization
security/block-custom-html-escaping
```

### Block Accessibility

**Canonical Pattern:** `a11y/{scope}-{improvement}`

**WordPress Block Adaptation:** `a11y/block-{blockname}-{feature}`

**Examples:**
```
a11y/block-gallery-focus-management
a11y/block-form-keyboard-navigation
```

### Block Performance

**Canonical Pattern:** `perf/{scope}-{optimization}`

**WordPress Block Adaptation:** `perf/block-{blockname}-{optimization}`

**Examples:**
```
perf/block-slider-lazy-loading
perf/block-animation-reduce-repaints
```

### Block Testing

**Canonical Pattern:** `test/{scope}-{testtype}`

**WordPress Block Adaptation:** `test/block-{blockname}-{testtype}`

**Test Types:**
- `unit` — Jest unit tests
- `e2e` — Playwright E2E tests
- `a11y` — Accessibility tests
- `visual` — Visual regression tests
- `integration` — PHPUnit integration tests

**Examples:**
```
test/block-gallery-e2e-carousel
test/block-form-validation-unit
test/block-hero-a11y-wcag
```

### Block CI/CD

**Canonical Pattern:** `ci/{scope}-{improvement}`

**WordPress Block Adaptation:** `ci/block-{tool}-{improvement}`

**Examples:**
```
ci/block-e2e-testing-setup
ci/block-bundle-size-monitoring
ci/block-performance-profiling
```

### Block Release

**Canonical Pattern:** `release/v{version}`

**WordPress Block Adaptation:** `release/block-v{MAJOR}-{MINOR}-{PATCH}`

**Examples:**
```
release/block-v1-0-0
release/block-hero-v2-0-0
release/block-v1-2-3
```

### Block Hotfix

**Canonical Pattern:** `hotfix/{scope}-{urgency}`

**WordPress Block Adaptation:** `hotfix/block-{blockname}-{urgency}`

**Notes:**
- Must branch from `main`
- For critical production bugs only
- Patch version bump
- Back-merge to `develop`

**Examples:**
```
hotfix/block-image-responsive-regression
hotfix/block-form-submission-critical
```

## Review Priority Mapping

### LightSpeed Canonical Priority Tiers

**Critical (Highest):**
- `hotfix/*` — Production-blocking fixes
- `security/*` — Security vulnerabilities
- `release/*` — Release management

**High:**
- `feat/*` — Feature development
- `fix/*` — Bug fixes
- `refactor/*` — Code refactoring
- `perf/*` — Performance optimization
- `ci/*` — CI/CD changes

**Medium:**
- `task/*`, `design/*`, `a11y/*`, `docs/*`, `test/*`, `ops/*`

### WordPress Block Review Focus

**For Block Branches:**

- **`feat/block-*`** — Feature completeness, block compatibility, test coverage
- **`fix/block-*`** — Root cause, regression tests, block interactions
- **`a11y/block-*`** — WCAG 2.2 AAA compliance, screen reader, keyboard
- **`perf/block-*`** — Benchmarks, load time, Core Web Vitals
- **`test/block-*`** — Test coverage (>85%), isolation, realistic scenarios
- **`ci/block-*`** — Automation safety, block-specific checks
- **`security/block-*`** — Sanitization, escaping, nonce verification
- **`release/block-*`** — Version accuracy, changelog, deprecation path
- **`hotfix/block-*`** — Minimal change, safe rollback, production-verified

## Commit Message Format

### LightSpeed Standard

```
{type}({scope}): {short-description}

{detailed-description}

{footer}
```

### WordPress Block Adaptation

```
{type}(block-{blockname}): {feature-description}

- Implementation detail 1
- Implementation detail 2
- Testing approach
- Update CHANGELOG.md

Closes #{issue-number}
```

**Example:**

```
feat(block-hero): add parallax scroll effect

- Implement parallax using Intersection Observer
- Add prefers-reduced-motion accessibility support
- Include E2E tests for parallax interaction
- Visual regression tests for Chrome/Firefox
- Update CHANGELOG.md with new block feature

Closes #456
```

## CI/CD Integration

### LightSpeed Canonical CI

1. **Pre-push Hook** — Advisory validation
2. **GitHub Actions** — Check branch name, run tests
3. **Status Checks** — Blocking (if configured)
4. **Labels** — Auto-applied based on type
5. **PR Templates** — Selected by branch type

### WordPress Block CI Extensions

**Block-Specific Checks:**

1. **WordPress Standards**
   - WPCS (WordPress Coding Standards)
   - PHP 7.4+ compatible
   - Block.json valid

2. **Testing**
   - Jest unit tests (>85% coverage)
   - Playwright E2E tests (interactive blocks)
   - PHPUnit integration tests (server-rendered)
   - Accessibility audit (axe-core)

3. **Performance**
   - Bundle size check (with budget)
   - Core Web Vitals monitoring
   - Block render time profiling

4. **Compatibility**
   - WordPress version checks
   - Core block compatibility
   - Third-party plugin compatibility

5. **Documentation**
   - Block usage documented
   - Changelog entry present
   - CHANGELOG.md updated

## Label Routing

### LightSpeed Canonical Labels

**Type Labels:**
- `type:feature` — Feature work
- `type:bug` — Bug fix
- `type:security` — Security issue
- `type:a11y` — Accessibility
- etc.

**Priority Labels:**
- `priority:critical` — Hotfix or security
- `priority:high` — Regular feature/fix
- `priority:medium` — Refactor, docs
- `priority:low` — Chore, deps

### WordPress Block Labels

**Auto-Applied for Block Branches:**
- `area:blocks` — Any `feat/block-*`, `fix/block-*`, etc.
- `type:feature` — `feat/block-*`
- `type:bug` — `fix/block-*`
- `type:security` — `security/block-*`
- `priority:high` — `feat/block-*`, `fix/block-*`
- `priority:critical` — `hotfix/block-*`, `security/block-*`

## Protection Rules

### LightSpeed Canonical Rules

**For `main` and `develop`:**
- Require PRs for all commits
- Require status checks to pass
- Require PR reviews (1-2 approvals)
- Require conversation resolution
- Require up-to-date branches
- Squash merge only
- Auto-delete head branches

### WordPress Block Plugin/Theme Rules

**For Block Branches:**
- Same as canonical
- Plus: Block-specific status checks
- Plus: WPCS and accessibility checks required

## Common Workflows

### Developing a New Block

```bash
# 1. Create feature branch following convention
git checkout -b feat/block-hero-parallax

# 2. Implement block
# - Create block structure
# - Write block code
# - Add tests
# - Add documentation

# 3. Commit with proper message
git commit -m "feat(block-hero): add parallax effect
- Implement parallax using Intersection Observer
- Add prefers-reduced-motion support
- Include E2E tests
Closes #123"

# 4. Push and create PR
git push -u origin feat/block-hero-parallax

# 5. PR auto-labeled: type:feature, area:blocks, priority:high

# 6. GitHub Actions run:
#    - Branch name validation ✅
#    - WordPress standards check
#    - Jest unit tests
#    - Playwright E2E tests
#    - Accessibility audit
#    - Bundle size check

# 7. Merge via squash merge (removes temporary branch)
```

### Releasing a Block Version

```bash
# 1. Create release branch from develop
git checkout -b release/block-v2-0-0

# 2. Update versions:
#    - block.json version
#    - package.json version
#    - style.css Version header

# 3. Update CHANGELOG.md

# 4. Commit
git commit -m "release(block): version 2.0.0
- Update block versions
- Document breaking changes
- Create migration guide"

# 5. Push and create PR

# 6. GitHub Actions:
#    - Verify version format
#    - Changelog validation
#    - Full test suite
#    - Documentation validation

# 7. Merge to main (squash)

# 8. Manual tag: git tag block-v2-0-0

# 9. Back-merge to develop
```

## Integration Checklist

- [ ] Branch follows `{type}/{scope}-{title}` pattern
- [ ] Block branches use `feat/block-*`, `fix/block-*`, etc.
- [ ] Type is from approved list (30+)
- [ ] No forbidden prefixes (claude/, copilot/, openai/)
- [ ] Commit message follows format
- [ ] CHANGELOG.md updated
- [ ] Tests included (unit, E2E, a11y)
- [ ] WordPress standards verified
- [ ] No console errors
- [ ] Accessibility compliance (WCAG 2.2 AAA)

## Resources

**Canonical Strategy (LightSpeed Org-Wide):**
- [LightSpeed WP .github Repository](https://github.com/lightspeedwp/.github)
- [BRANCHING_STRATEGY.md](https://github.com/lightspeedwp/.github/blob/develop/docs/BRANCHING_STRATEGY.md) — Org-wide branching standards
- [Branch Validation Troubleshooting](https://github.com/lightspeedwp/.github/blob/develop/docs/BRANCH_VALIDATION_TROUBLESHOOTING.md)

**Canonical Configuration Files:**
- [branch-types.yml](https://github.com/lightspeedwp/.github/blob/develop/.github/branch-types.yml) — Approved branch types
- [branch-labels.yml](https://github.com/lightspeedwp/.github/blob/develop/.github/branch-labels.yml) — Automated label routing
- [labels.yml](https://github.com/lightspeedwp/.github/blob/develop/.github/labels.yml) — Label definitions
- [changelog-rules.yml](https://github.com/lightspeedwp/.github/blob/develop/.github/changelog-rules.yml) — Changelog entry rules
- [issue-types.yml](https://github.com/lightspeedwp/.github/blob/develop/.github/issue-types.yml) — Issue type definitions
- [labeler.yml](https://github.com/lightspeedwp/.github/blob/develop/.github/labeler.yml) — PR labeling automation

**Canonical Templates:**
- [Issue Templates](https://github.com/lightspeedwp/.github/tree/develop/.github/ISSUE_TEMPLATE) — Issue creation templates
- [Pull Request Templates](https://github.com/lightspeedwp/.github/tree/develop/.github/PULL_REQUEST_TEMPLATE) — PR templates by branch type

**WordPress Block Documentation:**
- [WordPress Block Editor Handbook](https://developer.wordpress.org/block-editor/)
- [Block API Reference](https://developer.wordpress.org/block-editor/reference-guides/block-api/)
- [WordPress Coding Standards](https://developer.wordpress.org/coding-standards/)

**This Skill (WordPress Block-Specific):**
- [Branch Validation WordPress Main Skill](../SKILL.md)
- [WordPress Block Branching Strategy](../docs/BRANCHING_STRATEGY_WORDPRESS_BLOCKS.md)
- [Block Theme Development Guide](../docs/WORDPRESS_BLOCK_THEME_GUIDE.md)
- [Block Plugin Development Guide](../docs/WORDPRESS_BLOCK_PLUGIN_GUIDE.md)
