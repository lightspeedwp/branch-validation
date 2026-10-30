# WordPress Block Branch Validation Prompt

## Input Specification

**Format:** Plain text branch name or structured input

### Input Examples

```
feat/block-hero-parallax
fix/block-carousel-mobile-layout
release/block-v2-0-0
a11y/block-testimonial-keyboard
test/block-form-validation-e2e
```

### Optional Context

```json
{
  "branch": "feat/block-hero-parallax",
  "blockType": "interactive",
  "theme": false,
  "plugin": true,
  "hasBreakingChanges": false
}
```

## Output Specification

### Valid Branch Response

```json
{
  "valid": true,
  "branch": "feat/block-hero-parallax",
  "type": "feat",
  "category": "Block Feature Development",
  "scope": "block-hero",
  "title": "parallax",
  "pattern": "feat/block-{blockname}-{feature}",
  "guidance": {
    "description": "New block or block feature implementation",
    "blockType": "interactive",
    "requirements": [
      "block.json with proper metadata",
      "edit.js with editor interface",
      "save.js with frontend rendering",
      "style.scss for styling",
      "Jest tests with >85% coverage",
      "Playwright E2E tests",
      "Accessibility testing (WCAG 2.2 AAA)"
    ],
    "testing": {
      "unit": "Jest - block utilities and logic",
      "e2e": "Playwright - editor and frontend interaction",
      "a11y": "axe-core - accessibility compliance",
      "visual": "Percy or Pixelmatch - visual regression"
    }
  },
  "suggestions": {
    "blockName": "hero",
    "featureName": "parallax",
    "relatedDocs": [
      "docs/BRANCHING_STRATEGY_WORDPRESS_BLOCKS.md",
      "docs/WORDPRESS_BLOCK_THEME_GUIDE.md"
    ]
  }
}
```

### Invalid Branch Response

```json
{
  "valid": false,
  "branch": "feature/block-hero-parallax",
  "error": "Invalid type: 'feature' is not an approved type",
  "suggestion": "feat/block-hero-parallax",
  "reason": "Branch types must be one of: feat, fix, a11y, perf, test, ci, refactor, docs, release, hotfix, security",
  "guidance": {
    "pattern": "feat/block-{blockname}-{feature}",
    "examples": [
      "feat/block-hero-parallax",
      "feat/block-testimonial-carousel",
      "feat/block-pricing-table"
    ]
  }
}
```

## Block-Specific Validation Rules

### Block Type Detection

When scope contains `block-{name}`, validate:

1. **Block Name Format**
   - Must be lowercase
   - May contain hyphens
   - Should be component name (hero, carousel, form)

2. **Feature Type Inference**
   ```
   feat/block-* → New block or feature
   fix/block-* → Block bug fix
   a11y/block-* → Accessibility improvement
   perf/block-* → Performance optimization
   test/block-* → Block testing
   ci/block-* → Block CI/CD
   release/block-v* → Block release
   ```

3. **WordPress Block Conventions**
   - Block pattern: `feat/block-{blockname}-{feature}`
   - Pattern branches: `feat/block-patterns-{category}`
   - Core block mods: `feat/block-core-{blockname}-{feature}`

### Test Type Validation

For `test/` branches:

```
test/block-{name}-unit           → Jest unit tests
test/block-{name}-e2e            → Playwright E2E
test/block-{name}-a11y           → Accessibility tests
test/block-{name}-visual         → Visual regression
test/block-{name}-performance    → Performance tests
test/block-{name}-integration    → PHPUnit integration
```

### Release Validation

For `release/` branches:

- Format: `release/block-v{MAJOR}-{MINOR}-{PATCH}`
- Examples: `release/block-v1-0-0`, `release/block-v2-1-3`
- Must follow semantic versioning

For hotfix:

- Format: `hotfix/block-{blockname}-{urgency}`
- Must branch from `main`
- Patch version bump only

## WordPress Block Context

### When to Use This Prompt

- Validating branch names for block themes
- Validating branch names for block plugins
- Checking block development workflow branches
- Planning block releases and versions
- Understanding block testing requirements

### Block Development Workflow

```
1. Create feature branch: feat/block-name-feature
2. Develop block in feat branch
3. Write tests (unit, E2E, a11y)
4. Submit PR with block in branch name
5. CI runs block-specific checks
6. Merge to develop
7. Create release branch: release/block-vX-Y-Z
8. Bump version in block.json/package.json
9. Update CHANGELOG.md
10. Merge to main, tag release
```

### Related Documentation

- [WordPress Block Development Branching Strategy](../docs/BRANCHING_STRATEGY_WORDPRESS_BLOCKS.md)
- [WordPress Block Theme Guide](../docs/WORDPRESS_BLOCK_THEME_GUIDE.md)
- [WordPress Block Plugin Guide](../docs/WORDPRESS_BLOCK_PLUGIN_GUIDE.md)

## Validation Examples

### Example 1: Valid Feature Branch

```
Input: feat/block-hero-parallax

Valid: ✅
Type: feat (Feature Development)
Pattern: feat/block-{blockname}-{feature}
Guidance:
- Create block directory: src/blocks/hero/
- Implement block.json, edit.js, save.js
- Add CSS for styling
- Write Jest unit tests
- Add Playwright E2E tests
- Include accessibility testing
```

### Example 2: Valid Test Branch

```
Input: test/block-carousel-e2e-interaction

Valid: ✅
Type: test (Testing & Infrastructure)
Pattern: test/block-{blockname}-{testtype}
Guidance:
- Create Playwright test file
- Test block insertion in editor
- Test carousel interaction (arrows, dots)
- Test responsive behavior
- Verify frontend rendering
```

### Example 3: Invalid Branch

```
Input: feature/hero-new-block

Valid: ❌
Error: Invalid type "feature" (use "feat")
Error: Missing "block-" prefix in scope
Suggestion: feat/block-hero-new

Guidance:
- Block branches should follow: feat/block-{name}-{feature}
- Type must be approved type (feat, fix, etc.)
- Scope must start with "block-"
```

### Example 4: Release Branch

```
Input: release/block-v2-0-0

Valid: ✅
Type: release (Version Release)
Pattern: release/block-v{major}-{minor}-{patch}
Guidance:
- Update block version in all files
- Update CHANGELOG.md
- Create comprehensive testing plan
- Tag commit with block-v2-0-0
- Document migration if breaking changes
```

## Error Messages & Fixes

### Error: Invalid Block Type

```
Error: feature/block-carousel
Fix:   feat/block-carousel

Type must be approved WordPress type:
feat, fix, a11y, perf, test, ci, refactor, docs, release, hotfix, security
```

### Error: Missing Block Prefix

```
Error: feat/carousel-new-feature
Fix:   feat/block-carousel-new-feature

Block branches must use: feat/block-{blockname}-{feature}
```

### Error: Invalid Version Format

```
Error: release/block-v2.0.0
Fix:   release/block-v2-0-0

Version format: v{MAJOR}-{MINOR}-{PATCH} (use hyphens, not dots)
```

## When to Reach Out to Agent

Use the **WordPress Block Branching Agent** when:

- Coordinating multiple block releases
- Planning complex architectural changes
- Dealing with version compatibility
- Setting up block-specific CI/CD
- Troubleshooting non-standard block scenarios
- Need ongoing strategic guidance

Use the **skill** when:

- Quick branch name validation
- Understanding branch conventions
- Single lookup/reference questions
- Standard documentation needs
