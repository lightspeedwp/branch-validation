# Branch Validation WordPress Skill

## Project Overview

A comprehensive Claude Code skill for validating branch names and providing workflow guidance for WordPress block theme and plugin development.

**Repository:** https://github.com/lightspeedwp/branch-validation  
**Primary Language:** Markdown (documentation), JavaScript (validation), PHP (block patterns)  
**Team:** LightSpeed WP  

## Key Directories

```
/docs/                    # User documentation
/skills/                  # Sub-skills (7 specialized contexts)
/references/              # Reference materials and canonical mapping
/prompts/                 # LLM prompts for validation
/scripts/                 # Validation scripts (Node.js)
/assets/                  # Templates and examples
/tests/                   # Test suites (BATS)
```

## Getting Started

1. **Read first:** [docs/ONBOARDING.md](../docs/ONBOARDING.md) (15-minute quickstart)
2. **Main skill:** [SKILL.md](../SKILL.md) (skill definition)
3. **Documentation index:** [docs/INDEX.md](../docs/INDEX.md) (navigation)

## Branch Validation Rules

### Pattern
```
{type}/block-{component}-{feature}
```

### Example Branches
```
feat/block-hero-parallax           # Feature branch
fix/block-button-color-contrast    # Bug fix
a11y/block-form-keyboard-nav       # Accessibility
test/block-carousel-e2e            # Testing
release/block-v2-0-0               # Release
security/block-html-xss            # Security fix
```

### Validation Script
```bash
node scripts/validate-branch-name.js --branch feat/block-hero-parallax
```

## Key Decisions & Patterns

### WordPress Block Focus
- All branches must reference block components
- Pattern: `feat/block-{blockname}-{feature}`
- Validated against 15+ approved branch types
- Enforces WordPress Coding Standards

### Skill Architecture
- Main skill for general guidance
- 7 sub-skills for specialized contexts:
  - Themes, plugins, architecture, security, accessibility, testing, release
- Integration with LightSpeed WP canonical strategy
- Automated validation via Lefthook git hooks

### Documentation Organization
- Root: README.md, SKILL.md, AGENTS.md, CLAUDE.md, CHANGELOG.md
- docs/: User documentation, guides, checklists
- skills/: Sub-skill definitions
- references/: Canonical strategy mapping, integration docs

## Testing

### Test Types
- **Jest:** Unit tests for validation logic
- **BATS:** Shell script integration tests
- **Manual:** Branch validation against patterns

### Running Tests
```bash
npm run test                 # Run Jest tests
npm run test:bats          # Run BATS tests
npm run validate           # Full validation suite
```

## Commit Message Format

```
{type}(block-{name}): {description}

- Detail 1
- Detail 2

Closes #{issue}
```

**Example:**
```
feat(block-hero): add parallax effect

- Implement parallax using Intersection Observer
- Add prefers-reduced-motion support
- Include E2E tests for parallax interaction

Closes #456
```

## Contributing

1. Read [docs/CONTRIBUTING.md](../docs/CONTRIBUTING.md)
2. Follow branch naming patterns
3. Update CHANGELOG.md
4. Include tests and documentation
5. Create PR with descriptive title
6. Ensure all CI checks pass

## Resources

**Canonical Strategy:**
- [LightSpeed WP .github](https://github.com/lightspeedwp/.github)
- [Branch Validation Strategy](https://github.com/lightspeedwp/.github/blob/develop/docs/BRANCHING_STRATEGY.md)
- [Canonical Files](../references/LIGHTSPEED_INTEGRATION.md)

**WordPress:**
- [Block Editor Handbook](https://developer.wordpress.org/block-editor/)
- [WordPress Coding Standards](https://developer.wordpress.org/coding-standards/)

**Accessibility:**
- [WCAG 2.2 Standards](https://www.w3.org/WAI/WCAG22/quickref/)

## Common Commands

```bash
# Validate a branch name
node scripts/validate-branch-name.js feat/block-hero-parallax

# Install Lefthook for git hooks
npm install lefthook --save-dev
npx lefthook install

# Run all tests
npm run test
npm run test:bats

# Update dependencies
npm install

# Build validation script
npm run build
```

## Quick Links

- **Main Skill:** [SKILL.md](../SKILL.md)
- **Sub-Skills:** [skills/](../skills/)
- **Documentation:** [docs/](../docs/)
- **Integration Guide:** [references/LIGHTSPEED_INTEGRATION.md](../references/LIGHTSPEED_INTEGRATION.md)
- **Getting Started:** [docs/ONBOARDING.md](../docs/ONBOARDING.md)

---

**Last Updated:** 2026-10-31  
**Status:** Production Ready  
**Version:** 1.0.0+
