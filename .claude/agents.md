# Custom Agents for Branch Validation WordPress Skill

Specialized agents for working on this repository.

## Available Agents

### branch-validation-reviewer
**Purpose:** Review changes to branch validation logic and documentation

**When to use:**
- Reviewing PRs for this skill
- Validating branch naming pattern changes
- Checking documentation accuracy
- Testing branch validation examples

**Tools:** Read, Grep, Bash  
**Focus:** Branch patterns, validation rules, documentation

---

### wordpress-block-specialist
**Purpose:** Provide expertise on WordPress block development patterns

**When to use:**
- Planning new block-specific guidance
- Adding block development patterns
- Reviewing block examples
- Improving block documentation

**Tools:** Read, Grep, Bash, WebSearch  
**Focus:** WordPress block API, patterns, development workflows

---

### skill-documentation-expert
**Purpose:** Improve and maintain skill documentation

**When to use:**
- Reorganizing documentation structure
- Improving documentation clarity
- Adding new documentation sections
- Updating examples and guides

**Tools:** Read, Edit, Write, Bash  
**Focus:** Documentation quality, navigation, completeness

---

### canonical-strategy-auditor
**Purpose:** Ensure integration with LightSpeed WP canonical strategy

**When to use:**
- Verifying canonical strategy alignment
- Updating org-wide integration
- Checking branch type compliance
- Reviewing label routing

**Tools:** Read, Grep, WebFetch, Bash  
**Focus:** Canonical files, org-wide strategy, compliance

---

## Agent Capabilities Matrix

| Agent | Read | Edit | Bash | WebSearch | WebFetch | Purpose |
|-------|------|------|------|-----------|----------|---------|
| branch-validation-reviewer | ✅ | — | ✅ | — | — | Validation logic |
| wordpress-block-specialist | ✅ | — | ✅ | ✅ | — | Block patterns |
| skill-documentation-expert | ✅ | ✅ | ✅ | — | — | Documentation |
| canonical-strategy-auditor | ✅ | — | ✅ | ✅ | ✅ | Org alignment |

---

## Using Agents in This Repository

### For Skill Improvements
Use `skill-documentation-expert` to:
- Add or improve documentation
- Reorganize guides
- Update examples
- Enhance README files

### For Block Development Content
Use `wordpress-block-specialist` to:
- Add new block patterns
- Review block examples
- Improve block guides
- Validate WordPress compatibility

### For Validation Logic
Use `branch-validation-reviewer` to:
- Review validation script changes
- Test branch pattern updates
- Verify validation rules
- Check documentation examples

### For Canonical Integration
Use `canonical-strategy-auditor` to:
- Verify org-wide alignment
- Check canonical file references
- Validate branch type mappings
- Review integration documentation

---

## Quick Commands

```bash
# Validate a branch name using the script
node scripts/validate-branch-name.js feat/block-hero-parallax

# Run all tests
npm run test
npm run test:bats

# Check linting
npm run lint

# Format code
npm run format
```

---

**For complex architectural decisions or release coordination, use the WordPress Block Branching Agent from the main skill.**
