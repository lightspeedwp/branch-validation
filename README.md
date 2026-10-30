# Branch Validation Skill

A Claude Code skill for validating branch names against LightSpeed WP's org-wide branching strategy.

## Purpose

This skill ensures all branches follow the established naming convention and strategy, preventing CI routing failures, PR template mismatches, and automated labeling breakage before they occur.

## How It Works

The skill validates branch names against the pattern **`{type}/{scope}-{title}`** where:
- **type** is one of 38 approved branch types
- **scope** describes the area of change
- **title** is a short description

**Example valid branches:**
- `feat/user-auth-login` — New user login feature
- `fix/cart-total-calculation` — Fix cart calculation bug
- `security/csrf-token-validation` — Security CSRF token fix
- `docs/api-authentication` — API authentication documentation

## Single Source of Truth

This repository **references and inherits** from the canonical configuration in `.github`:

```
lightspeedwp/.github (canonical)
├── docs/BRANCHING_STRATEGY.md        ← Master strategy document
├── .github/branch-types.yml          ← Authoritative branch type definitions
├── .github/branch-labels.yml         ← Label mapping & area keywords
├── .github/labels.yml                ← Canonical label definitions
├── .github/PULL_REQUEST_TEMPLATE/    ← PR templates by type
└── .github/ISSUE_TEMPLATE/           ← Issue templates

lightspeedwp/branch-validation (this repo)
├── SKILL.md                          ← Claude Code skill (references .github)
├── references/                       ← Local reference copies & sync
│   ├── BRANCHING_STRATEGY.md
│   ├── branch-types.yml
│   ├── branch-labels.yml
│   └── CANONICAL_FILES.md            ← Sync instructions
└── docs/                             ← Additional documentation
    └── IMPLEMENTATION.md             ← How to use in your repo
```

## Using This Skill in Claude Code

The skill is available globally in Claude Code. It triggers whenever you:
- Create a new git branch
- Rename an existing branch
- Need to verify branch naming compliance

**Usage:**
```
I'm creating a new branch for user authentication
```
→ The skill validates your proposed branch name before creation

## Branch Type Categories (38 Types)

**Feature & Development (6)**
- `feat`, `proto`, `perf`, `research`, `api`, `seo`

**Bug Fixes & Reverts (3)**
- `fix`, `hotfix`, `revert`

**Release Management (1)**
- `release` (semantic versioning: `release/v1.2.0`)

**Code Organization (3)**
- `refactor`, `schema`, `migrate`

**Maintenance & Tasks (3)**
- `task`, `chore`, `config`

**Documentation (4)**
- `docs`, `doc`, `i18n`, `content`

**Testing & Quality (3)**
- `test`, `qa`, `uat`

**CI/CD & Build (4)**
- `ci`, `build`, `ops`, `telemetry`

**Dependencies (1)**
- `deps`

**Security (1)**
- `security` (auto-labeled `priority:critical`)

**Design & UX (4)**
- `design`, `ds`, `ux`, `a11y`

**Audit & Compliance (1)**
- `audit`

**AI & Automation (3)**
- `codex`, `aiops`, `automation`

**Epics (1)**
- `epic`

## Naming Rules

✅ **Do:**
- Use lowercase letters, numbers, and hyphens
- Separate words with hyphens
- Use 2-4 descriptive words in present tense
- Examples: `feat/user-auth-flow`, `fix/mobile-nav-spacing`

❌ **Don't:**
- Use uppercase letters: `Feat/UserAuth`
- Use underscores: `feat/user_auth`
- Use spaces or special characters: `feat/user auth`
- Use single-word scopes: `feat/auth` (add more detail)
- Use forbidden prefixes: `claude/`, `copilot/`, `openai/`

## Exemptions

These branches are always allowed, even if they don't match the pattern:

- `dependabot/*` — Automated dependency updates
- `renovate/*` — Automated dependency updates

## Canonical Files & Sync

This repository maintains reference copies of canonical files from [lightspeedwp/.github](https://github.com/lightspeedwp/.github):

### Current References

- **BRANCHING_STRATEGY.md** — Master strategy document (source of truth)
- **branch-types.yml** — All 38 types and their properties
- **branch-labels.yml** — Type-to-label mapping and area keywords

### Syncing Updates

To pull the latest canonical files:

```bash
cd branch-validation
./scripts/sync-canonical.sh
```

This updates the `references/` directory. Review changes and commit:

```bash
git add references/
git commit -m "chore: sync canonical files from .github"
git push
```

### Configuration Files

The skill reads canonical configuration from `.github`:

#### `.github/branch-types.yml`

Defines all 38 branch types and their properties:

```yaml
feat:
  template: pr_feature.md
  labels:
    - type:feature
  examples:
    - feat/user-registration-flow
    - feat/dark-mode-support

security:
  template: pr_security.md
  labels:
    - type:security
    - priority:critical
  examples:
    - security/csrf-token-validation
```

#### `.github/branch-labels.yml`

Maps branch types to labels and area keywords:

```yaml
feat:
  default_labels:
    - type:feature
  area_keywords:
    - api
    - ui
    - component
    - backend
    - frontend

security:
  default_labels:
    - type:security
    - priority:critical
  area_keywords:
    - security
    - auth
    - vulnerability
    - xss
    - csrf
```

### Area Keywords

Area keywords automatically trigger area label detection:

- `api` → `area:integration`
- `auth` / `security` → `area:security`
- `database` / `db` → `area:infrastructure`
- `frontend` / `ui` / `component` → `area:scripts`
- `backend` / `server` / `middleware` → `area:core`
- `test` / `e2e` / `spec` → `area:testing`
- `ci` / `workflow` → `area:ci`
- `perf` / `performance` → `area:performance`

## Release & Hotfix Flow

### Release Branches

```bash
git checkout -b release/v1.2.0
# Update version numbers
# Update CHANGELOG.md
# Push, open PR, review, merge
git tag v1.2.0
git push origin v1.2.0
```

### Hotfix Branches

```bash
git checkout main
git checkout -b hotfix/csrf-validation
# Make minimal fix
# Push, open PR to main, merge
git tag v1.2.1
git push origin v1.2.1
# Back-merge to develop if used
```

## Common Errors & Fixes

### ❌ Uppercase Letters
`Feat/UserAuth` → ✅ `feat/user-auth`

### ❌ Underscores
`feat/user_auth_login` → ✅ `feat/user-auth-login`

### ❌ Invalid Type
`feature/login` → ✅ `feat/user-login`

### ❌ Missing Scope
`feat/login` → ✅ `feat/user-auth-login`

### ❌ Forbidden Prefix
`claude/test-feature` → ✅ `feat/test-feature`

## Renaming a Branch

If you've already pushed a branch with an incorrect name:

```bash
# Rename locally
git branch -m old-name new-name

# Rename on remote
git push origin :old-name new-name
git push -u origin new-name

# Update any PRs (may need to close/reopen)
```

## For Repository Maintainers

Repositories using this branching strategy should reference the canonical files directly. See `docs/IMPLEMENTATION.md` for integration patterns:

- Git hook setup (Lefthook)
- CI/CD validation workflows
- PR template routing
- Auto-labeling configuration

## References

**Official Canonical Files:**
- [Branching Strategy](https://github.com/lightspeedwp/.github/blob/develop/docs/BRANCHING_STRATEGY.md)
- [Branch Types](https://github.com/lightspeedwp/.github/blob/develop/.github/branch-types.yml)
- [Branch Labels](https://github.com/lightspeedwp/.github/blob/develop/.github/branch-labels.yml)
- [Labels Canonical](https://github.com/lightspeedwp/.github/blob/develop/.github/labels.yml)
- [PR Templates](https://github.com/lightspeedwp/.github/tree/develop/.github/PULL_REQUEST_TEMPLATE)
- [Issue Templates](https://github.com/lightspeedwp/.github/tree/develop/.github/ISSUE_TEMPLATE)

## Questions?

- Check [BRANCHING_STRATEGY.md](https://github.com/lightspeedwp/.github/blob/develop/docs/BRANCHING_STRATEGY.md) for detailed rules
- Review `CONTRIBUTING.md` in your repository for repo-specific guidelines
- Reference `.github/branch-types.yml` for the complete type list