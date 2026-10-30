# References Directory

Reference materials and documentation for branch-validation-wordpress ecosystem.

## Reference Documents

### Integration & Strategy
- **LIGHTSPEED_INTEGRATION.md** — Bridges canonical LightSpeed WP strategy with WordPress block conventions
  - Org-wide branching strategy mapping
  - Label routing
  - CI/CD integration patterns
  - Release process coordination

### WordPress Block Development
- **wordpress-block-api.md** — WordPress Block Editor API reference
- **wordpress-coding-standards.md** — WordPress coding standards for blocks
- **wordpress-version-support.md** — WordPress version compatibility matrix

### Testing & Quality
- **testing-patterns.md** — Test patterns for different block types
- **accessibility-standards.md** — WCAG 2.2 AAA compliance reference
- **performance-budgets.md** — Core Web Vitals and bundle size targets

### Tools & Configuration
- **lefthook-configuration.md** — Git hooks setup and troubleshooting
- **github-actions-ci.md** — GitHub Actions workflow examples
- **npm-scripts-reference.md** — npm script documentation

## Document Organization

```
references/
├── README.md (this file)
├── LIGHTSPEED_INTEGRATION.md
├── wordpress-block-api.md
├── wordpress-coding-standards.md
├── testing-patterns.md
├── accessibility-standards.md
├── performance-budgets.md
├── lefthook-configuration.md
├── github-actions-ci.md
└── npm-scripts-reference.md
```

## Usage

Reference documents are used for:
- **Team onboarding** — New developers learn standards
- **Decision making** — Choosing approaches and patterns
- **Troubleshooting** — Finding solutions to common problems
- **Validation** — Checking compliance with standards
- **Documentation** — Building on established patterns

### Linking to References

From other documents:
```markdown
See [LIGHTSPEED_INTEGRATION.md](references/LIGHTSPEED_INTEGRATION.md) for org strategy mapping.
```

## LightSpeed Integration

The `LIGHTSPEED_INTEGRATION.md` document is key to understanding:
- How WordPress block validation maps to org-wide strategy
- Branch type mapping and examples
- Label routing and automation
- CI/CD validation patterns
- Release process coordination

## WordPress Standards

Reference materials cover:
- **Block API** — Latest WordPress block editor APIs
- **Coding Standards** — WordPress PHP, JavaScript standards
- **Version Support** — WordPress 5.0+, minimum PHP version
- **Compatibility** — Browser and device support

## Testing & Quality References

Include:
- **Jest patterns** — Unit test examples by block type
- **Playwright patterns** — E2E test examples
- **Accessibility** — WCAG 2.2 AAA checklist and tools
- **Performance** — Core Web Vitals targets, bundle size budgets

## Tools Documentation

Explains setup and usage of:
- **Lefthook** — Git hooks automation
- **GitHub Actions** — CI/CD workflows
- **npm scripts** — Build and test commands
- **Validation scripts** — Branch validation and testing

## Contributing

When adding new reference documents:

1. **Use clear filenames** — Describe the content
2. **Include headers** — Organize with markdown headings
3. **Use examples** — Show real WordPress block examples
4. **Link references** — Connect to related docs
5. **Update this README** — Add new docs to the list
6. **Keep current** — Update when WordPress/standards change

## Quick References

### Branch Validation
→ See [LIGHTSPEED_INTEGRATION.md](LIGHTSPEED_INTEGRATION.md)

### WordPress Block API
→ See [wordpress-block-api.md](wordpress-block-api.md)

### Testing Patterns
→ See [testing-patterns.md](testing-patterns.md)

### Accessibility Compliance
→ See [accessibility-standards.md](accessibility-standards.md)

### Git Hooks Setup
→ See [lefthook-configuration.md](lefthook-configuration.md)

### GitHub Actions
→ See [github-actions-ci.md](github-actions-ci.md)

---

See also:
- [../SKILL.md](../SKILL.md) — Main skill documentation
- [../docs/](../docs/) — Full user documentation
- [../prompts/](../prompts/) — LLM prompts
- [../scripts/](../scripts/) — Validation scripts
