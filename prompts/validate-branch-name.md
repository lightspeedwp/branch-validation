# Validate Branch Name

Validate a proposed git branch name against LightSpeed WP's org-wide branching strategy before creating the branch.

## Input

- **Branch name** (required): The proposed branch name to validate
- **Repository path** (optional): Path to the git repository (defaults to current directory)

## Output

- ✅ **Valid**: Branch name follows the pattern and rules
- ❌ **Invalid**: Specific rule violation (e.g., uppercase letters, invalid type)
- ⚠️ **Warning**: Branch type not recognized (will route to default template)

## Examples

### Valid Branches

✅ `feat/user-auth-login` — Feature branch with clear scope and title
✅ `fix/cart-total-calculation` — Bug fix with context
✅ `security/csrf-token-validation` — Security fix (always critical priority)
✅ `docs/api-authentication` — Documentation update
✅ `release/v1.2.0` — Release with semantic version
✅ `dependabot/npm-lodash-update` — Automated dependency update (exempted)

### Invalid Branches

❌ `Feat/UserAuth` — Uppercase letters not allowed
❌ `feat/user_auth` — Underscores should be hyphens
❌ `feature/login` — Invalid type (use `feat` not `feature`)
❌ `feat/auth` — Too short, needs more descriptive scope
❌ `claude/test-feature` — Forbidden prefix (reserved for AI)
❌ `fix/bug` — Scope too vague; add context

## Validation Rules

### Pattern
```
{type}/{scope}-{title}
```

- **type**: One of 38 approved types (feat, fix, hotfix, release, etc.)
- **scope**: 1-2 words describing the area (lowercase, hyphens)
- **title**: 1-2 words describing the change (lowercase, hyphens, present tense)

### Character Rules
- Lowercase letters and numbers only
- Hyphens to separate words
- No underscores, spaces, dots, or special characters

### Forbidden Prefixes
- `claude/` — Reserved for AI-generated branches
- `copilot/` — Reserved for AI-generated branches
- `openai/` — Reserved for AI-generated branches

### Exemptions
- `dependabot/*` — Automated dependency updates
- `renovate/*` — Automated dependency updates

## 38 Approved Types

**Categories:**
- **Feature**: feat, proto, perf, research, api, seo
- **Bug Fix**: fix, hotfix, revert
- **Release**: release
- **Code Organization**: refactor, schema, migrate
- **Maintenance**: task, chore, config
- **Documentation**: docs, doc, i18n, content
- **Testing**: test, qa, uat
- **CI/CD**: ci, build, ops, telemetry
- **Dependencies**: deps
- **Security**: security
- **Design**: design, ds, ux, a11y
- **Audit**: audit
- **AI/Automation**: codex, aiops, automation
- **Epics**: epic

## Output Format

```
✅ Valid Branch Name
Branch: feat/user-auth-login
Type: feat (Feature) → pr_feature.md
Labels: type:feature, area:security (inferred from "auth" keyword)
Status: Ready to create
```

Or for invalid:

```
❌ Invalid Branch Name
Branch: Feat/UserAuth
Issues:
  - Uppercase letters not allowed (use lowercase)
  - Scope too short ("User" should be expanded, e.g., "user-auth")
  - Title too short ("Auth" needs more context, e.g., "auth-login")

Suggestions:
  - feat/user-auth-login
  - feat/user-registration
  - feat/login-page
```

## When to Use

Use this prompt when:
- Creating a new branch and want to validate the name first
- Renaming an existing branch
- Reviewing branch naming in PRs or code review
- Setting up validation in CI/CD workflows
- Teaching team members the branching strategy

## Integration

This skill integrates with:
- **Git Hooks**: Pre-push validation via Lefthook
- **CI/CD**: GitHub Actions or other workflow validation
- **Claude Code**: Automatic triggering when creating branches
- **IDE Extensions**: VS Code, JetBrains integration via Claude
