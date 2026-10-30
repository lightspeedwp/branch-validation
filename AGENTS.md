# Agents Guide

Claude agents that work with the branch-validation skill and repository.

## Branch Validation Agent

**Role:** `branch-validation`  
**Location:** `~/.claude/agents/branch-validation.agent.md`

### Purpose

Validates branch names against LightSpeed WP's org-wide branching strategy and guides developers through the naming process.

### Capabilities

- ✅ Branch name validation against pattern `{type}/{scope}-{title}`
- ✅ Branch type recommendation and selection
- ✅ Label routing and PR template selection explanation
- ✅ CI/CD integration guidance (GitHub Actions, Lefthook, NPM scripts)
- ✅ Naming error detection and correction
- ✅ Branching strategy education and best practices

### When to Use

Invoke when:
- Validating a branch name before creation
- Selecting the right type for a change
- Setting up branch validation in CI/CD
- Troubleshooting validation failures
- Understanding label routing or template selection
- Integrating the strategy in a new repository

### Example Invocations

```
"Is this branch name valid? feat/user-auth-login"
"I'm creating a branch for a security fix, what type should I use?"
"How do I set up branch validation in GitHub Actions?"
"What labels will this branch get? security/csrf-token-validation"
```

### Knowledge

The agent knows:
- All 38 approved branch types
- Naming rules and validation patterns
- Label routing and auto-application
- PR template selection
- CI/CD integration patterns
- Common naming errors and fixes

### Limitations

The agent:
- ❌ Does NOT merge branches or modify git history
- ❌ Does NOT override validation rules
- ❌ Does NOT commit code
- ❌ Does NOT delete or force-push branches
- ❌ Does NOT make policy decisions (escalates to team leads)

## How Agents Integrate with Skills

### Skill vs Agent

**Skill (`branch-validation`)**
- Auto-triggers in Claude Code when creating/renaming branches
- Integrated into the chat flow
- Available globally across projects

**Agent (`branch-validation` role)**
- Invoked explicitly when you need detailed guidance
- Provides educational context and integration help
- Works across projects and contexts

### Example Workflow

1. **User wants to create a branch**
   ```
   "I'm implementing user authentication"
   ```

2. **Skill provides quick validation**
   - Suggests: `feat/user-auth-login`
   - Shows it's valid
   - Branch created

3. **User wants to understand the strategy better**
   ```
   "Tell me more about branch validation"
   ```

4. **Agent provides comprehensive guidance**
   - Explains all 38 types
   - Shows label routing
   - Provides CI/CD setup examples

## Configuration & Maintenance

### Keeping Agents in Sync

The agent reads from:
- `references/branch-types.yml` — Type definitions
- `references/branch-labels.yml` — Label mapping
- `docs/IMPLEMENTATION.md` — Integration patterns

When canonical files change:
1. Run `./scripts/sync-canonical.sh`
2. Update agent role if needed (rare)
3. Commit changes

### Adding New Types

If a new branch type is approved:

1. Add to `.github/branch-types.yml` in lightspeedwp/.github
2. Run sync: `./scripts/sync-canonical.sh`
3. Update `SKILL.md` in this repo
4. Update agent role if documentation needed
5. Commit and push

## Agent Role Definition

The full agent role is defined in `branch-validation.agent.md`:

```yaml
---
name: Branch Validation Agent
role: branch-validation
description: Validates branch names against LightSpeed WP's org-wide branching strategy
capabilities:
  - branch-name-validation
  - type-selection
  - naming-pattern-guidance
  - ci-integration-advice
  - error-correction
model: claude-opus-5-5
---
```

## Related Skills

This agent works alongside:
- **branch-validation skill** — Auto-validation during branch operations
- **labeling skill** — Label management and issue automation
- **pr-creation skill** — PR template routing and automation

## Documentation

For more information, see:
- [README.md](./README.md) — Project overview
- [SKILL.md](./SKILL.md) — Skill documentation
- [docs/IMPLEMENTATION.md](./docs/IMPLEMENTATION.md) — CI/CD integration
- [docs/CANONICAL_STRUCTURE.md](./docs/CANONICAL_STRUCTURE.md) — File structure
- [CONTRIBUTING.md](#) — Repo-specific guidelines (per-repository)

## Support

For questions about agents:
- Check the agent role file: `~/.claude/agents/branch-validation.agent.md`
- See the BRANCHING_STRATEGY.md in lightspeedwp/.github
- Review docs/ folder for implementation patterns

For policy questions:
- Consult BRANCHING_STRATEGY.md (source of truth)
- Check with your team lead
- Review CONTRIBUTING.md in your repository
