# Contributing to Branch Validation Skill

Guide for team members to improve, maintain, and extend the branch validation skill documentation and examples.

## Documentation Quality Standards

### For All Documentation Files

- ✅ **Clear Purpose** — File explains its purpose in the first paragraph
- ✅ **Quick Reference** — Includes summary table or cheat sheet
- ✅ **Real Examples** — Uses actual block names (hero, carousel, form, etc.)
- ✅ **WordPress Focus** — Every example uses block context
- ✅ **Actionable** — Tells readers what to do, not just concepts
- ✅ **Tested** — Examples are verified to work
- ✅ **Indexed** — Linked from README.md and navigation docs

### WordPress Block Examples

Every code example should:

✅ Use realistic block names from actual WordPress projects
```
✅ feat/block-hero-parallax
✅ fix/block-carousel-mobile
❌ feat/component-foo
❌ fix/button-thing
```

✅ Include full context (theme or plugin)
```
✅ Theme block: src/blocks/hero/block.json
✅ Plugin block: blocks/hero/block.json
❌ Just "Create block"
```

✅ Show test files alongside code
```
✅ block.json + edit.js + save.js + style.scss + jest tests + e2e tests
❌ Just the JSX component
```

✅ Document accessibility requirements
```
✅ "Must include WCAG 2.2 AAA keyboard support"
❌ No mention of a11y
```

## Adding New Examples

### When to Add an Example

Add a new example when:
- A common block type isn't covered (e.g., "I'm building a video block")
- A new workflow isn't documented (e.g., "I'm creating block patterns")
- An existing example is confusing or outdated

### How to Add an Example

1. **Identify the gap** — What's missing?
2. **Create the example** — Use a real block name from your team
3. **Test locally** — Verify the branch pattern and workflow work
4. **Add to docs** — Choose appropriate file from:
   - `BRANCHING_STRATEGY_WORDPRESS_BLOCKS.md` — Branching pattern
   - `WORDPRESS_BLOCK_THEME_GUIDE.md` — Theme-specific workflow
   - `WORDPRESS_BLOCK_PLUGIN_GUIDE.md` — Plugin-specific workflow
   - `ONBOARDING.md` — Quick reference for teams

5. **Include context** — Add description of:
   - What block is being built
   - Why this branch type
   - Testing approach
   - Common pitfalls

6. **Link from README** — Update README.md if adding major content

### Example Template

```markdown
### Creating a {Block Type} Block

**When to use:** [Describe scenario]

**Branch name:**
\`\`\`
feat/block-{name}-{feature}
\`\`\`

**Example:**
\`\`\`
feat/block-hero-parallax
\`\`\`

**Workflow:**
1. Create branch
2. Implement block
3. Write tests
4. Commit and push

**Testing requirements:**
- Unit tests: Jest
- E2E tests: Playwright
- Accessibility: WCAG 2.2 AAA

**Common pitfalls:**
- [Common mistake 1]
- [Common mistake 2]
```

## Updating Documentation

### Regular Maintenance

**Monthly:**
- [ ] Review error patterns from team PRs
- [ ] Update examples if branch naming changes
- [ ] Check external links in references

**Quarterly:**
- [ ] Review for WordPress version updates
- [ ] Update testing tools if versions change
- [ ] Check accessibility standards for updates

**Annually:**
- [ ] Audit entire documentation for completeness
- [ ] Update version number
- [ ] Review against new WordPress features

### When to Update

**Immediately:**
- Breaking changes to branch naming
- New approved branch types
- Security issues in examples
- Broken external links
- Incorrect information

**Within a sprint:**
- Missing block type examples
- Confusing explanations
- Workflow changes
- Tool upgrades

### How to Update

1. **Edit the file**
   ```bash
   # In branch-validation-wordpress/
   nano docs/BRANCHING_STRATEGY_WORDPRESS_BLOCKS.md
   ```

2. **Test your changes**
   - Verify examples work
   - Check links
   - Review for clarity

3. **Commit with reference**
   ```bash
   git commit -m "docs: update carousel block examples

   - Add lazy-loading performance pattern
   - Include Playwright E2E test example
   - Document mobile swipe interaction testing"
   ```

4. **Note in CHANGELOG.md**
   ```markdown
   ## Unreleased

   ### Changed
   - Updated carousel block examples with performance patterns
   - Added lazy-loading E2E tests
   ```

## Documentation Structure Review

### Files That Need Annual Review

| File | Purpose | Last Review | Assigned To |
|------|---------|------------|------------|
| SKILL.md | Branch types definition | — | — |
| ONBOARDING.md | Team onboarding | — | — |
| BRANCHING_STRATEGY_WORDPRESS_BLOCKS.md | Block branching guide | — | — |
| WORDPRESS_BLOCK_THEME_GUIDE.md | Theme development | — | — |
| WORDPRESS_BLOCK_PLUGIN_GUIDE.md | Plugin development | — | — |
| README.md | Main documentation | — | — |

**Owners:** Add your name next to a file to take ownership of keeping it current.

## Quality Checklist Template

Use this checklist when reviewing or updating documentation:

```markdown
## Documentation Quality Checklist

### Content
- [ ] Purpose is clear in first paragraph
- [ ] Examples use real WordPress block names
- [ ] Examples are theme/plugin contextualized
- [ ] Code examples are tested
- [ ] Testing requirements documented
- [ ] Accessibility (WCAG 2.2 AAA) mentioned
- [ ] Links are functional
- [ ] External references are current

### Organization
- [ ] File is indexed in README.md
- [ ] Headings follow hierarchy
- [ ] Quick reference section included
- [ ] Table of contents present (if >1000 words)
- [ ] Related docs linked

### WordPress Focus
- [ ] Block type is clear
- [ ] Theme/plugin context is explicit
- [ ] block.json shown where relevant
- [ ] Test approach specified
- [ ] Common WordPress errors addressed

### Team Accessibility
- [ ] Beginner-friendly
- [ ] Quick lookup possible
- [ ] Real-world scenario covered
- [ ] Steps are actionable
- [ ] Troubleshooting section present
```

## Common Issues & Fixes

### Issue: Example Uses Generic Block Names

❌ **Bad:**
```
feat/block-component-feature
feat/my-block-thing
```

✅ **Fix:**
```
feat/block-hero-parallax
feat/block-carousel-swipe
```

→ Use specific block names from WordPress ecosystem

### Issue: Missing Test Examples

❌ **Bad:**
```
"Write tests for your block"
```

✅ **Fix:**
```
// Jest unit test
test('renders hero with parallax', () => {
  // Test code
});

// Playwright E2E test
await page.fill('[data-testid="speed-input"]', '50');
await expect(hero).toHaveAttribute('data-parallax-speed', '50');
```

→ Include actual test code

### Issue: Accessibility Not Mentioned

❌ **Bad:**
```
"Create a carousel block with swipe support"
```

✅ **Fix:**
```
"Create a carousel block with swipe support
- Must support keyboard arrows (→ ← for prev/next)
- Must announce current slide to screen readers
- Must include focus management
- Must meet WCAG 2.2 AAA color contrast
"
```

→ Always document a11y requirements

### Issue: No Theme/Plugin Context

❌ **Bad:**
```
"Create the block structure:
- block.json
- edit.js
- save.js
"
```

✅ **Fix:**
```
"For block themes (WordPress theme development):
  src/blocks/hero/block.json
  src/blocks/hero/edit.js
  ...

For block plugins (standalone plugin):
  blocks/hero/block.json
  blocks/hero/edit.js
  ..."
```

→ Always specify theme vs plugin context

## Feedback & Improvement Process

### Reporting Documentation Issues

Found a problem? Report it by creating an issue with:

1. **What's wrong**
   - Unclear section
   - Broken example
   - Missing information
   - Outdated reference

2. **Where it is**
   - File path
   - Section heading
   - Line/paragraph

3. **What should happen**
   - Suggested fix or improvement
   - Real example
   - Reference if needed

### Suggesting Documentation Improvements

Have an idea? Suggest it with:

1. **What's the improvement?**
   - New example to add
   - Workflow to document
   - Topic to cover

2. **Why is it needed?**
   - How would it help the team?
   - What gap does it fill?
   - Who would use it?

3. **What does it look like?**
   - Draft example
   - Outline for new section
   - Reference materials

## Documentation Review Checklist

Before merging documentation changes:

**Content Review:**
- [ ] Examples are correct
- [ ] WordPress-specific (not generic)
- [ ] Tests work
- [ ] Links function
- [ ] Instructions are clear

**Quality Review:**
- [ ] Follows structure
- [ ] Matches team style
- [ ] Proper heading hierarchy
- [ ] Consistent terminology
- [ ] Related docs linked

**WordPress Focus:**
- [ ] Block type clear
- [ ] Theme or plugin context specified
- [ ] Testing documented
- [ ] Accessibility addressed
- [ ] Real examples used

**Team Value:**
- [ ] Solves actual need
- [ ] Improves onboarding
- [ ] Reduces questions
- [ ] Actionable

## Terminology Standards

Use consistent terminology across all documentation:

| Prefer This | Not This | Context |
|------------|----------|---------|
| Block | Component, element | WordPress blocks |
| Block theme | FSE theme | Full Site Editing |
| Block plugin | Widget plugin | Plugin type |
| Interactive block | Dynamic block | Requires user interaction |
| Display block | Static block | Content only |
| Container block | Wrapper block | Holds other blocks |
| WCAG 2.2 AAA | WCAG A, WCAG AA | Accessibility standard |
| Playwright | Selenium, Cypress | E2E testing tool |
| Jest | Mocha, Jasmine | Unit testing tool |
| block.json | config.json | Block metadata file |
| save.js | template.js | Frontend render |
| edit.js | editor.js | Editor interface |
| Style | CSS, Styles | Block styling |

## Style Guide

### Writing for WordPress Block Developers

**Be specific:**
- ✅ "In your interactive carousel block"
- ❌ "In your component"

**Use block names:**
- ✅ "feat/block-hero-parallax"
- ❌ "feat/my-feature"

**Include context:**
- ✅ "For theme blocks (in src/blocks/)"
- ❌ "Create the block"

**Show full examples:**
- ✅ "block.json, edit.js, save.js, style.scss, tests"
- ❌ "Create block files"

**Document testing:**
- ✅ "Jest unit tests (>85% coverage), Playwright E2E tests, a11y audit"
- ❌ "Write tests"

### Code Example Format

```markdown
### [Clear Heading]

**Branch:**
\`\`\`
feat/block-hero-parallax
\`\`\`

**Workflow:**
1. Step one
2. Step two

**Code example:**
\`\`\`javascript
// Your code here
\`\`\`

**Testing:**
\`\`\`bash
npm run test blocks/hero/
npm run test:e2e blocks/hero/
\`\`\`

**Commit message:**
\`\`\`
feat(block-hero): add parallax effect

- Implementation detail
- Testing detail
\`\`\`
```

## Version Bumping

When to update SKILL.md version:

- **Patch (1.0.1)** — Documentation typo, example fix, clarification
- **Minor (1.1.0)** — New block type added, new workflow documented, major example added
- **Major (2.0.0)** — Breaking change to branch naming, new approval required, major restructure

## Getting Help

**Questions about contributing?**
- Check this file
- Ask a teammate who's contributed
- Check git history for examples
- Invoke the agent for strategy questions

**Not sure if change is needed?**
- Ask the team in your PR
- Start with small improvements
- Build up to larger changes

## Thanks!

Thanks for helping improve this skill! Your contributions make WordPress block development easier for the entire team.

---

**Last Updated:** 2026-10-30  
**Questions?** Check ONBOARDING.md or ask a teammate!
