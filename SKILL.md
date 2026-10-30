---
name: branch-validation
description: Validates branch names against LightSpeed WP's org-wide branching strategy and naming conventions. Use this whenever you're about to create a git branch, rename an existing branch, or need to verify branch naming compliance. Catches common issues like uppercase letters, underscores, invalid type prefixes, and forbidden prefixes (claude/, copilot/, openai/) before they cause CI routing, PR template, and label automation failures. The single source of truth is https://github.com/lightspeedwp/.github/blob/develop/docs/BRANCHING_STRATEGY.md.
compatibility: git
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

## Valid Types (38 Total)

All 38 approved branch types are listed below, organized by category and PR template routing. The authoritative list is at [.github/branch-types.yml](https://github.com/lightspeedwp/.github/blob/develop/.github/branch-types.yml).

### Feature & Development (6 types)
- **`feat`** — New feature → `pr_feature.md` + `type:feature`
- **`proto`** — Prototype / experimental feature → `pr_feature.md` + `type:feature`
- **`perf`** — Performance improvements → `pr_feature.md` + `type:feature`
- **`research`** — Research & investigation → `pr_feature.md` + `type:feature`
- **`api`** — API endpoint changes → `pr_feature.md` + `type:feature`
- **`seo`** — SEO improvements → `pr_feature.md` + `type:feature`

### Bug Fixes & Reverts (3 types)
- **`fix`** — Bug fix → `pr_bug.md` + `type:bug`
- **`hotfix`** — Urgent production fix → `pr_hotfix.md` + `type:release` + `priority:critical`
- **`revert`** — Revert previous commit → `pr_bug.md` + `type:bug`

### Release Management (1 type)
- **`release`** — Release branch (use semver: `release/v1.2.0`) → `pr_release.md` + `type:release`

### Code Organization (3 types)
- **`refactor`** — Code refactoring → `pr_refactor.md` + `type:refactor`
- **`schema`** — Database schema changes → `pr_refactor.md` + `type:refactor`
- **`migrate`** — Database migrations → `pr_refactor.md` + `type:refactor`

### Maintenance & Tasks (3 types)
- **`task`** — General task → `pr_task.md` + `type:task`
- **`chore`** — Maintenance & housekeeping → `pr_chore.md` + `type:chore`
- **`config`** — Configuration changes → `pr_chore.md` + `type:chore`

### Documentation (4 types)
- **`docs`** — Documentation → `pr_docs.md` + `type:docs`
- **`doc`** — Documentation (variant) → `pr_docs.md` + `type:docs`
- **`i18n`** — Internationalization & translation → `pr_docs.md` + `type:docs`
- **`content`** — Content updates → `pr_docs.md` + `type:docs`

### Testing & Quality (3 types)
- **`test`** — Test additions/fixes → `pr_test.md` + `type:test`
- **`qa`** — QA & quality assurance → `pr_test.md` + `type:test`
- **`uat`** — User acceptance testing → `pr_test.md` + `type:test`

### CI/CD & Build (4 types)
- **`ci`** — CI/CD configuration → `pr_ci.md` + `type:ci`
- **`build`** — Build system changes → `pr_ci.md` + `type:ci`
- **`ops`** — Operations & infrastructure → `pr_ci.md` + `type:ci`
- **`telemetry`** — Telemetry & observability → `pr_ci.md` + `type:ci`

### Dependencies (1 type)
- **`deps`** — Dependency updates → `pr_dep_update.md` + `type:dependency`

### Security (1 type)
- **`security`** — Security fixes → `pr_security.md` + `type:security` + `priority:critical`

### Design & UX (4 types)
- **`design`** — UI/UX design → `pr_design.md` + `type:design`
- **`ds`** — Design system changes → `pr_design.md` + `type:design`
- **`ux`** — User experience → `pr_design.md` + `type:design`
- **`a11y`** — Accessibility (WCAG) → `pr_a11y.md` + `type:a11y` + `priority:important`

### Audit & Compliance (1 type)
- **`audit`** — Audit & compliance review → `pr_audit.md` + `type:audit`

### AI & Automation (3 types)
- **`codex`** — Code generation & AI → `pr_aiops.md` + `type:aiops`
- **`aiops`** — AI operations → `pr_aiops.md` + `type:aiops`
- **`automation`** — Workflow automation → `pr_aiops.md` + `type:aiops`

### Epics (1 type)
- **`epic`** — Large multi-part feature → `pr_epic.md` + `type:epic`

**Fallback:** Unrecognized branch types route to `pr_feature.md` + `type:feature` and log a warning in CI.

## Naming Rules

**Required:**
- Use lowercase letters, numbers, and hyphens only
- Separate words with hyphens (no underscores, spaces, or camelCase)
- Include both scope and title
- Match the exact pattern `{type}/{scope}-{title}`
- Use 2-4 descriptive words in present tense (e.g., `feat/user-registration-flow`)

**Forbidden Prefixes:**
- `claude/` — Reserved for AI-generated branches (CI rejection)
- `copilot/` — Reserved for AI-generated branches (CI rejection)
- `openai/` — Reserved for AI-generated branches (CI rejection)

**Exemptions:**
- `dependabot/*` — Automated dependency updates (skip naming validation)
- `renovate/*` — Automated dependency updates (skip naming validation)
- Release branches may use semantic versions: `release/v1.2.0`, `release/2024-10-30`

## Scope Keywords & Area Labels

Branch scope keywords trigger automatic area label detection. The CI routing uses these keywords to apply relevant area labels to PRs:

**Common Area Keywords:**
- **`api`** → `area:integration` (API endpoints, REST, GraphQL)
- **`auth`** → `area:security` (authentication, OAuth, JWT, credentials)
- **`database`** / **`db`** → `area:infrastructure` (schema, migration, query)
- **`docs`** / **`readme`** → `area:documentation`
- **`frontend`** / **`ui`** / **`component`** / **`react`** / **`html`** / **`css`** → `area:scripts`
- **`backend`** / **`server`** / **`service`** / **`middleware`** → `area:core`
- **`test`** / **`spec`** / **`e2e`** / **`mock`** → `area:testing`
- **`ci`** / **`workflow`** / **`github-actions`** / **`lint`** / **`build`** → `area:ci`
- **`perf`** / **`performance`** / **`optimization`** / **`caching`** → `area:performance`
- **`security`** / **`vulnerability`** / **`xss`** / **`csrf`** / **`injection`** → `area:security`

**Example Scope Usage:**

Branch `fix/auth-csrf-token-validation` with keywords "auth" and "csrf" triggers:
- Base label from type: `type:bug`
- Area labels (inferred): `area:security` (matches "auth" and "csrf" keywords)
- Priority: `priority:normal` (default for `fix/`)

Branch `security/api-input-sanitization` with keyword "api":
- Base label from type: `type:security`
- Area labels (inferred): `area:integration` + `area:security` (matches both keywords)
- Priority: `priority:critical` (security always critical)

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

## Branching Best Practices

Follow these guidelines to keep your workflow smooth:

**Branch Lifecycle:**
1. Keep branches short-lived (aim for 1-3 days)
2. Keep PRs small and focused
3. Open PRs early, even if work is in progress (mark as draft)
4. Delete branches after merge (never force-push to shared branches)
5. Always rebase your branch on the latest base branch before merging

**Protected Base Branches:**
- `main` must always be deployable
- `develop` (if used) is integration branch
- Require PR approval before merging (1+ approvals, 2+ for critical repos)
- Require passing CI checks (lint, tests, build)
- Require branch to be up-to-date before merge
- Require linear history (squash merge strategy)

**Merge Strategy:**
- Use **squash merge only** (one commit per PR)
- Disable merge commits and rebase merges
- Never force-push to `main` or `develop`
- Administrators cannot bypass branch protection

**Release & Hotfix Flow:**
- **Release**: Create `release/vX.Y.Z`, bump versions, update changelog, run full CI, QA on staging, merge to `main`, tag, deploy
- **Hotfix**: Branch from `main` as `hotfix/<slug>`, make minimal fix, open PR to `main`, tag, back-merge to `develop` if used

## When NOT to Create a Branch

Protected base branches (e.g., `main`, `develop`, `master`) and detached HEAD states are not task branches. Unrelated valid branches that don't follow the pattern still exist in the repository and should not be deleted or renamed without team consensus.

## Integration with Workflow

This skill integrates with:
- **CI/CD routing** — The branch type (`feat/`, `fix/`, etc.) routes CI pipelines and deployment targets
- **PR templates** — Branch type determines which PR template is used
- **Automated labeling** — Labels are assigned based on branch type
- **Git hooks** — Pre-commit and pre-push validation (cannot be bypassed)

## Label Mapping & CI Integration

Branch types automatically route to:
- **PR Templates**: Determined by branch type (see Valid Types)
- **Type Labels**: Automatic label application based on branch type
- **Area Labels**: Inferred from branch scope keywords and file changes
- **Priority Labels**: `hotfix/` and `security/` get `priority:critical`; `a11y/` gets `priority:important`

The canonical label mapping is at [.github/branch-labels.yml](https://github.com/lightspeedwp/.github/blob/develop/.github/branch-labels.yml).

### Example: Branch Routing

`fix/cart-total-calculation` routes to:
- PR Template: `pr_bug.md`
- Type Label: `type:bug`
- Area Labels: Inferred from scope `cart` + file changes (may include `area:core`, `area:scripts`)
- Priority: `priority:normal` (default)

`security/csrf-token-validation` routes to:
- PR Template: `pr_security.md`
- Type Label: `type:security`
- Area Labels: `area:security` (inferred from scope)
- Priority: `priority:critical` (security always critical)

## References

**Single Source of Truth:**
- [BRANCHING_STRATEGY.md](https://github.com/lightspeedwp/.github/blob/develop/docs/BRANCHING_STRATEGY.md) — Org-wide branching strategy, rules, and guidelines

**Canonical Configuration Files:**
- [.github/branch-types.yml](https://github.com/lightspeedwp/.github/blob/develop/.github/branch-types.yml) — All 38 types and PR template routing
- [.github/branch-labels.yml](https://github.com/lightspeedwp/.github/blob/develop/.github/branch-labels.yml) — Label mapping and area keywords
- [.github/labels.yml](https://github.com/lightspeedwp/.github/blob/develop/.github/labels.yml) — Canonical label definitions
- [.github/PULL_REQUEST_TEMPLATE/](https://github.com/lightspeedwp/.github/tree/develop/.github/PULL_REQUEST_TEMPLATE) — PR templates by type
- [.github/ISSUE_TEMPLATE/](https://github.com/lightspeedwp/.github/tree/develop/.github/ISSUE_TEMPLATE) — Issue templates

**Repository-Specific Configuration:**
- `CONTRIBUTING.md` — Repo-specific contribution guidelines
- `scripts/validate-branch-name.js` — Local validation script

## Agent Rules

When using this skill with Claude Code or Copilot:

1. **Validate before creating** — Always validate a branch name against the pattern before creating or renaming
2. **Wait for approval** — If a name needs proposing, get user approval before proceeding
3. **Don't create automation branches** — Avoid auto-creating `codex/` or session branches unless explicitly requested
4. **Recheck before commits** — Always revalidate branch naming before committing or pushing
5. **Preserve work** — Stop and validate before making edits if the branch name is uncertain
6. **Honor exemptions** — `dependabot/` and `renovate/` branches are always valid; protected base branches are never task branches
7. **Reference canonical files** — When in doubt, check `.github/branch-types.yml` for the authoritative list
