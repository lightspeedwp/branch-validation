---
name: branch-validation
description: Validates branch names against repository naming conventions and branch strategy patterns. Use this skill whenever you're about to create a git branch, rename an existing branch, or need to verify branch naming compliance. Catches common issues like uppercase letters, underscores, invalid type prefixes, and forbidden prefixes (claude/, copilot/, openai/) before they cause CI routing, PR template, and label automation failures.
compatibility: git, Node.js (for validation scripts)
---

# Branch Validation Skill

Ensures branch names follow your repository's branching strategy, preventing CI failures, PR template mismatches, and label automation breakage.

## Branch Naming Pattern

All branches must follow this pattern:

```
{type}/{scope}-{title}
```

Where:
- **type**: A predefined category (see Valid Types below)
- **scope**: The feature, component, or area of change (lowercase, hyphens between words)
- **title**: A short description of the change (lowercase, hyphens between words)

### Example Valid Branches

- `feat/user-auth-login` — Add user login feature
- `fix/header-spacing-mobile` — Fix mobile header spacing
- `docs/api-authentication` — Document API authentication
- `refactor/database-connection-pool` — Refactor database connection
- `security/dependency-audit` — Security dependency audit

## Valid Types

Approximately 40 approved types exist. Common ones include:

- `feat` — New feature
- `fix` — Bug fix
- `hotfix` — Urgent production fix
- `release` — Release branch (use semver: `release/v1.2.0`)
- `refactor` — Code refactoring
- `docs` — Documentation
- `test` — Test additions or fixes
- `ci` — CI/CD configuration
- `security` — Security fixes
- `epic` — Large multi-part feature
- `perf` — Performance improvements
- `chore` — Maintenance tasks
- `revert` — Revert previous commit
- `build` — Build system changes
- `style` — Code style changes

For the complete list, consult `.agents/roles/branches-agent.md` or `CONTRIBUTING.md` in the repository.

## Naming Rules

**Required:**
- Use lowercase letters, numbers, and hyphens only
- Separate words with hyphens (no underscores, spaces, or camelCase)
- Include both scope and title
- Match the exact pattern `{type}/{scope}-{title}`

**Forbidden Prefixes:**
- `claude/` — Reserved for AI-generated branches
- `copilot/` — Reserved for AI-generated branches
- `openai/` — Reserved for AI-generated branches

**Exemptions:**
- `dependabot/*` — Automated dependency updates (skip naming checks)
- `renovate/*` — Automated dependency updates (skip naming checks)
- Release branches may use semantic versions: `release/v1.2.0`, `release/2024-10-30`

## Validating Your Branch

### Check Before Creating

Before creating or renaming a branch, validate the name:

```bash
npm run validate:branch-name --branch "feat/user-auth-login"
```

Or using Node.js directly:

```bash
node scripts/validate-branch-name.js --branch "feat/user-auth-login"
```

### Exit Codes

- `0` — Branch name is valid
- `1` — Branch name is invalid (naming rule violation)
- `2` — Script execution error

### Automatic Git Hooks

The repository uses Lefthook to run branch validation automatically:
- **Pre-commit**: Checks the current branch name before committing
- **Pre-push**: Validates branch name before pushing to remote

These hooks cannot be bypassed with `--no-verify` or `LEFTHOOK=0`. Do not manually delete or overwrite `.git/hooks/pre-push`.

## Common Fixes

### Uppercase Letters

❌ `Fix/HeaderSpacing` or `feat/UserAuth`  
✅ `fix/header-spacing` or `feat/user-auth`

**Fix**: Lowercase all letters:
```bash
git branch -m fix/header-spacing
```

### Underscores Instead of Hyphens

❌ `feat/user_auth_login` or `fix/mobile_nav_bug`  
✅ `feat/user-auth-login` or `fix/mobile-nav-bug`

**Fix**: Replace underscores with hyphens:
```bash
git branch -m feat/user-auth-login
```

### Invalid Type

❌ `feature/user-login` or `bugfix/header-spacing`  
✅ `feat/user-login` or `fix/header-spacing`

**Fix**: Use an approved type (see Valid Types). For pushed branches, follow your repository's rename procedure or open a new branch with the correct name.

### Numeric-Only Title

❌ `feat/123` or `fix/456-789`  
✅ `feat/login-page` or `fix/cart-total-calculation`

**Fix**: Add a descriptive title describing the change.

### Missing Scope

❌ `feat/login` (too short, unclear scope)  
✅ `feat/user-auth-login` (clear scope: user-auth, title: login)

**Fix**: Split into scope and title.

## Renaming a Published Branch

If you've already pushed a branch with an incorrect name:

1. **Locally**: Rename it  
   ```bash
   git branch -m old-name new-name
   ```

2. **On remote**: Follow your repository's procedure (usually delete and re-push):
   ```bash
   git push origin :old-name new-name
   git push -u origin new-name
   ```

3. **Update any open PRs**: GitHub/GitLab may auto-detect the rename, or you may need to close and reopen the PR pointing to the new branch.

## When NOT to Create a Branch

Protected base branches (e.g., `main`, `develop`, `master`) and detached HEAD states are not task branches. Unrelated valid branches that don't follow the pattern still exist in the repository and should not be deleted or renamed without team consensus.

## Integration with Workflow

This skill integrates with:
- **CI/CD routing** — The branch type (`feat/`, `fix/`, etc.) routes CI pipelines and deployment targets
- **PR templates** — Branch type determines which PR template is used
- **Automated labeling** — Labels are assigned based on branch type
- **Git hooks** — Pre-commit and pre-push validation (cannot be bypassed)

## References

For more details, consult:
- `.agents/roles/branches-agent.md` — Detailed branching agent guidelines
- `CONTRIBUTING.md` — Full contribution guidelines
- `scripts/validate-branch-name.js` — Validation script source
- `.github/` — Organization-wide branching documentation

## Agent Rules

When using this skill with Claude Code or Copilot:

1. **Validate before creating** — Always validate a branch name against the pattern before creating or renaming
2. **Wait for approval** — If a name needs proposing, get user approval before proceeding
3. **Don't create automation branches** — Avoid auto-creating `codex/` or session branches
4. **Recheck before commits** — Always revalidate branch naming before committing or pushing
5. **Preserve work** — Stop and validate before making edits if the branch name is uncertain
6. **Honor exemptions** — `dependabot/` and `renovate/` branches are always valid; protected base branches are never task branches
