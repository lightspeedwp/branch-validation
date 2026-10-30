# Scripts Directory

Executable validation and automation scripts for branch-validation-wordpress skill.

## Scripts

### Branch Validation
- **validate-branch-name.js** — Validates branch names against WordPress block conventions
  - Pattern: `{type}/block-{name}-{feature}`
  - Usage: `node scripts/validate-branch-name.js [--branch <name>]`
  - Exit codes: 0 (valid), 1 (invalid), 2 (error)

### Configuration & Setup
- **setup-hooks.sh** — Installs git hooks using Lefthook
  - Installs pre-commit, pre-push, commit-msg hooks
  - Configures branch validation automation
  - Usage: `bash scripts/setup-hooks.sh`

- **sync-canonical.sh** — Syncs canonical files from lightspeedwp/.github
  - Updates branch-types.yml, branch-labels.yml
  - Creates CANONICAL_FILES.md reference
  - Usage: `bash scripts/sync-canonical.sh`

### Testing
- **validate-all.sh** — Runs complete validation suite
  - Linting, formatting, tests, branch validation
  - Usage: `bash scripts/validate-all.sh`

- **test-coverage.sh** — Checks Jest coverage >85%
  - Validates coverage thresholds
  - Generates coverage reports
  - Usage: `bash scripts/test-coverage.sh`

## Usage

### Running Scripts

```bash
# Validate branch name
node scripts/validate-branch-name.js --branch feat/block-hero-parallax

# Setup hooks
npm run setup:hooks

# Sync canonical files
npm run sync:canonical

# Run full validation
npm run validate

# Check test coverage
npm run test:coverage
```

### Installation

Scripts require:
- Node.js 16+ (for JavaScript scripts)
- Bash 4+ (for shell scripts)
- npm or yarn (for npm scripts)

Install dependencies:
```bash
npm install
```

## Development

When adding new scripts:

1. Place in this directory
2. Add executable permission: `chmod +x script-name.sh`
3. Include header comment with purpose
4. Add usage instructions to this README
5. Add npm script to package.json
6. Include in CI/CD workflows

## Hook Scripts

Branch validation is automated via Lefthook:

```yaml
# lefthook.yml
pre-push:
  validate-branch:
    run: node scripts/validate-branch-name.js --branch "$(git rev-parse --abbrev-ref HEAD)"
```

See [lefthook.yml](../lefthook.yml) for complete hook configuration.

## Testing Scripts

Jest and Playwright tests use helper scripts:

- Unit tests: `npm run test`
- E2E tests: `npm run test:e2e`
- A11y tests: `npm run test:a11y`
- Coverage: `npm run test -- --coverage`

## Troubleshooting

### Branch validation fails
```bash
# Debug branch name
git rev-parse --abbrev-ref HEAD

# Validate format
node scripts/validate-branch-name.js --branch "your-branch-name"
```

### Hooks not running
```bash
# Reinstall hooks
npx lefthook install

# Check hook status
npx lefthook list
```

### Tests failing
```bash
# Run with verbose output
npm run test -- --verbose

# Run specific test
npm run test -- blocks/carousel/
```

---

See also:
- [../lefthook.yml](../lefthook.yml) — Git hooks configuration
- [../package.json](../package.json) — npm scripts
- [../SKILL.md](../SKILL.md) — Main skill documentation
