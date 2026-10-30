# Implementation Guide

How to use the branch-validation skill and canonical files in your repository.

## Quick Start

### For Claude Code Users

The skill is automatically available in Claude Code. Use it when creating or validating branches:

```
I need to create a branch for adding user authentication
```

The skill will suggest a valid branch name like:
```
feat/user-auth-flow
```

### For Repository Setup

Add validation to your repository:

```bash
# Install dependencies
npm install

# Set up git hooks
npx husky install

# The pre-push hook will validate branch names automatically
```

## Integration Patterns

### Pattern 1: Claude Code + Git Hooks

**Best for:** Single developer or small teams using Claude Code

The skill validates branch names in Claude Code before creation. Git hooks catch any issues at commit/push time.

**Setup:**
1. Use the `branch-validation` skill in Claude Code
2. Configure Lefthook in your repo for pre-push validation
3. No additional CI setup needed

### Pattern 2: CI/CD Validation

**Best for:** Teams, automated systems, or repos without Claude Code

Validate branch names in CI before PR creation.

**GitHub Actions Example:**

```yaml
name: Validate Branch Name
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Validate branch name
        run: |
          BRANCH="${{ github.head_ref }}"
          
          # Check against canonical types
          TYPES=$(grep "^  [a-z]" .github/branch-types.yml | sed 's/:.*//' | tr '\n' '|' | sed 's/|$//')
          
          if [[ ! $BRANCH =~ ^($TYPES)/[a-z0-9]+-[a-z0-9-]+$ ]]; then
            echo "❌ Invalid branch name: $BRANCH"
            echo "Pattern: {type}/{scope}-{title}"
            echo "Valid types: $TYPES"
            exit 1
          fi
          
          echo "✅ Valid branch name: $BRANCH"
```

### Pattern 3: Pre-Commit Hooks (Lefthook)

**Best for:** Local validation before commit

**lefthook.yml:**

```yaml
pre-push:
  commands:
    validate-branch:
      glob: ""
      run: |
        BRANCH=$(git rev-parse --abbrev-ref HEAD)
        
        # Skip protected branches
        if [[ "$BRANCH" =~ ^(main|develop|master)$ ]]; then
          exit 0
        fi
        
        # Skip exempted branches
        if [[ "$BRANCH" =~ ^(dependabot|renovate)/ ]]; then
          exit 0
        fi
        
        # Validate format
        if [[ ! $BRANCH =~ ^[a-z]+/[a-z0-9]+-[a-z0-9-]+$ ]]; then
          echo "❌ Invalid branch name: $BRANCH"
          exit 1
        fi
        
        echo "✅ Branch name is valid"
```

### Pattern 4: NPM Script Validation

**Best for:** Development workflow integration

**package.json:**

```json
{
  "scripts": {
    "validate:branch": "node scripts/validate-branch-name.js",
    "create-branch": "npm run validate:branch && git checkout -b"
  }
}
```

**scripts/validate-branch-name.js:**

```javascript
#!/usr/bin/env node

const TYPES = ['feat', 'fix', 'hotfix', 'release', 'refactor', /* ... all 38 types */];
const branch = process.argv[2] || process.env.BRANCH;

if (!branch) {
  console.error('Usage: validate-branch <branch-name>');
  process.exit(2);
}

// Skip exemptions
if (/^(dependabot|renovate)\//.test(branch)) {
  console.log('✅ Valid branch (exempted)');
  process.exit(0);
}

// Validate pattern
const pattern = new RegExp(`^(${TYPES.join('|')})/[a-z0-9]+-[a-z0-9-]+$`);
if (pattern.test(branch)) {
  console.log(`✅ Valid branch: ${branch}`);
  process.exit(0);
} else {
  console.error(`❌ Invalid branch: ${branch}`);
  console.error(`Pattern: {type}/{scope}-{title}`);
  console.error(`Valid types: ${TYPES.join(', ')}`);
  process.exit(1);
}
```

## Referencing Canonical Files

Your repository can reference the canonical files directly from `.github` or maintain local copies.

### Option A: Reference from .github (Recommended)

Reference the canonical files directly in your repository configuration:

```yaml
# .github/workflows/validate-branch.yml
- name: Validate branch
  run: |
    BRANCH=${{ github.head_ref }}
    TYPES=$(grep "^  [a-z]" .github/branch-types.yml | sed 's/:.*//')
    # ... validate against canonical types
```

**Pros:**
- Always up-to-date
- Single source of truth
- No duplication

**Cons:**
- Depends on .github repository access

### Option B: Sync Local Copies

Keep local reference copies synchronized:

```bash
# In your repo
mkdir -p .github-refs
curl -s https://raw.githubusercontent.com/lightspeedwp/.github/develop/.github/branch-types.yml \
  -o .github-refs/branch-types.yml

# Use in scripts
TYPES=$(grep "^  [a-z]" .github-refs/branch-types.yml | sed 's/:.*//')
```

**Pros:**
- No external dependencies
- Fast CI/CD
- Works offline

**Cons:**
- Requires periodic syncing
- May drift from canonical

## Label Application

When a PR is created from a validated branch, labels are automatically applied:

**Example: `feat/user-auth-login`**

```yaml
Type Labels:
  - type:feature

Area Labels (inferred from scope keywords):
  - area:security (matches "auth" keyword)

Priority Labels:
  - priority:normal (default for feature)
```

**Example: `security/csrf-token-fix`**

```yaml
Type Labels:
  - type:security
  - priority:critical (always critical for security/)

Area Labels:
  - area:security (matches "csrf" keyword)

Priority Labels:
  - priority:critical (already applied via type)
```

### Area Keyword Mapping

See [references/branch-labels.yml](../references/branch-labels.yml) for the complete mapping of scope keywords to area labels.

## PR Template Routing

Based on the branch type, the appropriate PR template is auto-selected:

| Branch Type | PR Template |
|---|---|
| `feat/`, `proto/`, `perf/`, `research/`, `api/`, `seo/` | `pr_feature.md` |
| `fix/`, `revert/` | `pr_bug.md` |
| `hotfix/` | `pr_hotfix.md` |
| `release/` | `pr_release.md` |
| `refactor/`, `schema/`, `migrate/` | `pr_refactor.md` |
| `task/` | `pr_task.md` |
| `docs/`, `doc/`, `i18n/`, `content/` | `pr_docs.md` |
| `test/`, `qa/`, `uat/` | `pr_test.md` |
| `ci/`, `build/`, `ops/`, `telemetry/` | `pr_ci.md` |
| `deps/` | `pr_dep_update.md` |
| `security/` | `pr_security.md` |
| `design/`, `ds/`, `ux/` | `pr_design.md` |
| `a11y/` | `pr_a11y.md` |
| `audit/` | `pr_audit.md` |
| `codex/`, `aiops/`, `automation/` | `pr_aiops.md` |
| `epic/` | `pr_epic.md` |
| `chore/`, `config/` | `pr_chore.md` |
| Unrecognized | `pr_feature.md` + warning |

## Troubleshooting

### Branch Name Validation Fails in CI

**Problem:** `❌ Invalid branch: feat/user_auth`

**Solution:** 
- Use hyphens, not underscores: `feat/user-auth`
- Use lowercase only: `feat/auth` not `feat/Auth`
- Ensure scope and title are present: `feat/auth-login` not `feat/auth`

### PR Template Not Applying

**Problem:** PR created from valid branch but wrong template shows

**Solution:**
1. Verify branch type matches a canonical type
2. Check that branch type is recognized in `branch-types.yml`
3. Ensure PR template files exist in `.github/PULL_REQUEST_TEMPLATE/`

### Labels Not Applying

**Problem:** Expected labels missing from PR

**Solution:**
1. Check branch type in `branch-labels.yml`
2. Verify area keywords match scope
3. Ensure labels exist in `.github/labels.yml`

## Questions?

- See [README.md](../README.md) for overview
- Check [BRANCHING_STRATEGY.md](https://github.com/lightspeedwp/.github/blob/develop/docs/BRANCHING_STRATEGY.md) for detailed rules
- Review [branch-types.yml](../references/branch-types.yml) for type definitions
- Ask in your team's documentation or contribution guidelines
