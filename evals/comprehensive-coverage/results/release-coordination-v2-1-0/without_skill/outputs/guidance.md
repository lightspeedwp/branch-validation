# Release Coordination Guide: v2.1.0
## Three New Gutenberg Blocks Release

---

## Executive Summary

This release introduces three new Gutenberg blocks: **Testimonial Slider**, **Pricing Table**, and **Image Gallery**. Releasing multiple blocks simultaneously requires careful coordination across versioning, documentation, testing, and changelog management.

---

## 1. Release Coordination Strategy

### 1.1 Pre-Release Phase (Week Before Release)

**Code Freeze**
- Lock the release branch (`release/v2.1.0`) 5 business days before the target release date
- All feature commits must land before freeze
- Only critical bug fixes post-freeze via separate hotfix PRs

**Block Validation Checklist**
```
Testimonial Slider:
  [ ] Editor loads without console errors
  [ ] Slider controls (prev/next) function correctly
  [ ] Keyboard navigation works (arrow keys, Tab)
  [ ] Mobile responsive tested
  [ ] Autoplay timeout tested
  [ ] Empty state displays correctly
  [ ] WCAG 2.2 AA compliance verified

Pricing Table:
  [ ] Column/row add/remove functions work
  [ ] Cell editing enables/disables correctly
  [ ] Highlight row feature toggles
  [ ] Currency symbol settings persist
  [ ] Mobile layout stacks properly
  [ ] Strikethrough price renders on frontend
  [ ] Empty table state displays correctly
  [ ] WCAG 2.2 AA compliance verified

Image Gallery:
  [ ] Upload/media library integration works
  [ ] Drag-and-drop reordering functions
  [ ] Lightbox displays correctly
  [ ] Lazy loading functional
  [ ] Alt text editor accessible
  [ ] Grid layout columns adjustable
  [ ] Mobile gallery touch navigation works
  [ ] WCAG 2.2 AA compliance verified
```

### 1.2 Branch Strategy

**Recommended Git Flow:**
```
main (production)
  ↑
develop
  ├── feature/testimonial-slider → PR #XX (merged)
  ├── feature/pricing-table → PR #XX (merged)
  ├── feature/image-gallery → PR #XX (merged)
  └── release/v2.1.0 (created from develop)
      ├── Bump version files
      ├── Update CHANGELOG
      └── PR → main (tagged on merge)
```

**Branch Naming Convention:**
```
release/v2.1.0              # Release coordination branch
hotfix/v2.1.0-block-name    # Critical fixes after release
```

### 1.3 Communication Plan

**Stakeholders to Notify:**
- Product/Project Manager
- QA Team (integration testing)
- Support Team (documentation/FAQs)
- Marketing (launch announcement)

**Timeline Communications:**
1. **Monday Week Before**: "Code freeze starting Friday"
2. **Friday Code Freeze**: "Freeze in effect, testing begins"
3. **Wednesday Before Release**: "Release candidate available for final testing"
4. **Day Before Release**: "Final checks, deploy window confirmed"
5. **Release Day**: "v2.1.0 is live — testing results, known issues (if any)"

---

## 2. Version Bumping Strategy

### 2.1 Semantic Versioning Rules

For v2.1.0:
```
Current Version: 2.0.x (e.g., 2.0.5)
New Version: 2.1.0

MAJOR (first digit)  = Breaking changes to API/functionality
MINOR (second digit) = New features, backward compatible
PATCH (third digit)  = Bug fixes only

2.1.0 = New features (blocks), no breaking changes ✓
```

### 2.2 Files to Update

**WordPress Plugin/Theme:**

1. **`plugin.php` or `style.css` (header comment)**
   ```php
   // plugin.php
   /**
    * Plugin Name: My Block Plugin
    * Plugin URI: https://example.com
    * Description: Custom Gutenberg blocks
    * Version: 2.1.0
    * Author: Your Name
    * ...
    */
   ```

2. **`style.css` (for themes)**
   ```css
   /*
   Theme Name: My Block Theme
   Version: 2.1.0
   */
   ```

3. **`package.json`**
   ```json
   {
     "name": "my-block-plugin",
     "version": "2.1.0",
     "description": "Gutenberg blocks for testimonials, pricing, and galleries"
   }
   ```

4. **`readme.txt` (WordPress.org)**
   ```
   Stable tag: 2.1.0
   
   == Changelog ==
   = 2.1.0 =
   * Added Testimonial Slider block
   * Added Pricing Table block
   * Added Image Gallery block
   ```

### 2.3 Versioning Checklist

```bash
# 1. Create release branch
git checkout -b release/v2.1.0 develop

# 2. Update version in all files
# Edit: plugin.php, style.css, package.json, readme.txt

# 3. Commit version bump
git add -A
git commit -m "Bump version to 2.1.0 for block release"

# 4. Create release PR
gh pr create --title "Release v2.1.0: Three new blocks" \
  --body "Testimonial Slider, Pricing Table, Image Gallery blocks"

# 5. After merge and CI passes
git tag -a v2.1.0 -m "Release v2.1.0 - Three new blocks"
git push origin v2.1.0
```

### 2.4 NPM/Build Version Consistency

If using build tools:
```json
// package.json
{
  "version": "2.1.0",
  "scripts": {
    "build": "wp-scripts build",
    "build:release": "wp-scripts build --mode production"
  },
  "devDependencies": {
    "@wordpress/scripts": "^27.0.0"
  }
}
```

---

## 3. CHANGELOG Management

### 3.1 Format: Keep a Changelog (v1.1.0)

**Location:** `CHANGELOG.md` (root of repository)

**Required Structure:**
```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.1.0] - 2024-11-15

### Added
- **Testimonial Slider Block**: New block displaying customer testimonials with auto-play
- **Pricing Table Block**: Flexible pricing comparison table with row highlighting
- **Image Gallery Block**: Responsive gallery with lightbox and lazy loading
- Support for block settings panels in all three blocks
- Mobile-first responsive design for all new blocks

### Changed
- Updated block editor toolbar styling for consistency
- Improved block registration performance

### Fixed
- Block preview rendering on older browsers
- CSS specificity conflicts with some themes

### Security
- Added sanitization to all user inputs in new blocks
- Verified WCAG 2.2 AA compliance

## [2.0.5] - 2024-10-01

### Fixed
- Theme compatibility issue with block spacing
- Minor CSS adjustments

## [2.0.4] - 2024-09-15

...
```

### 3.2 Changelog Update Workflow

**Step 1: Create Changelog Entry**

During development, maintainers add to `[Unreleased]` section:
```markdown
## [Unreleased]

### Added
- Testimonial Slider Block
- Pricing Table Block  
- Image Gallery Block
```

**Step 2: Before Release, Create Dated Section**

Move `[Unreleased]` content to a new version section with today's date:
```markdown
## [Unreleased]

### Added
- (Future features go here)

## [2.1.0] - 2024-11-15

### Added
- Testimonial Slider Block
- Pricing Table Block
- Image Gallery Block
```

**Step 3: Create Changelog Commit**

```bash
git add CHANGELOG.md
git commit -m "Update CHANGELOG for v2.1.0 release"
```

### 3.3 Block-Specific Changelog Entries

For each block, document:
```markdown
### Added

- **Testimonial Slider Block**
  - Auto-play with configurable interval (2-10 seconds)
  - Previous/Next navigation controls
  - Slide indicators
  - Full keyboard navigation
  - Mobile touch support
  - Inspector panel for layout options

- **Pricing Table Block**
  - Dynamic row/column management
  - Row highlighting toggle
  - Currency symbol configuration
  - Strikethrough pricing support
  - Responsive table layout
  - Cell editing controls

- **Image Gallery Block**
  - Drag-and-drop reordering
  - Media library integration
  - Lightbox with keyboard navigation
  - Lazy loading optimization
  - Alt text management
  - Configurable grid columns (1-6)
```

### 3.4 Validation Checklist

```
Before Release:
  [ ] CHANGELOG.md dated correctly
  [ ] All three blocks documented
  [ ] Added/Changed/Fixed/Security sections used appropriately
  [ ] No spelling errors
  [ ] Format valid (markdown syntax correct)
  [ ] Links work (if any)
  [ ] Previous version links preserved
```

**Test CHANGELOG Readability:**
```bash
# Render markdown locally
pandoc CHANGELOG.md -o CHANGELOG.html

# Or check on GitHub release notes
```

### 3.5 WordPress.org readme.txt Changelog

Also update `readme.txt` for WordPress.org:
```txt
== Changelog ==

= 2.1.0 =
* Added Testimonial Slider block
* Added Pricing Table block
* Added Image Gallery block
* Improved block performance and compatibility

= 2.0.5 =
* Fixed theme spacing compatibility

= 2.0.4 =
* Various improvements
```

---

## 4. Release Day Checklist

### Pre-Release (1 hour before)

```
Code & Versioning:
  [ ] All version files updated (plugin.php, package.json, readme.txt)
  [ ] CHANGELOG.md updated with correct date
  [ ] Version tags created (git tag v2.1.0)
  [ ] CI/CD pipeline passing (all tests green)

Testing:
  [ ] All three blocks load without errors in editor
  [ ] Front-end rendering works for all blocks
  [ ] Blocks save/reload data correctly
  [ ] Mobile responsive layouts verified
  [ ] WCAG 2.2 AA compliance confirmed
  [ ] Browser compatibility checked (Chrome, Firefox, Safari, Edge)

Documentation:
  [ ] README.md updated with new block descriptions
  [ ] Feature documentation written (if needed)
  [ ] Known issues documented (if any)
  [ ] Support FAQ prepared
```

### Release Execution

```
GitHub Release:
  [ ] Create GitHub Release for tag v2.1.0
  [ ] Copy CHANGELOG.md content into release notes
  [ ] Attach build artifacts (if applicable)
  [ ] Publish release
  
WordPress.org (if plugin/theme is public):
  [ ] Upload updated plugin/theme
  [ ] Update stable tag in readme.txt
  [ ] Verify plugin appears in WordPress directory
  
Internal:
  [ ] Notify team in Slack/Discord
  [ ] Update product roadmap (v2.1.0 completed)
  [ ] Generate release announcement
```

### Post-Release (Next Day)

```
Monitoring:
  [ ] Monitor support channels for issues
  [ ] Track error logs for critical bugs
  [ ] Monitor plugin/theme review ratings
  
Follow-up:
  [ ] Document any hotfixes needed
  [ ] Plan v2.1.1 (if patches required)
  [ ] Collect user feedback
  [ ] Update internal documentation
```

---

## 5. Coordination Timeline

### Sprint Planning (2 Weeks Before Release)

| Activity | Owner | Duration |
|----------|-------|----------|
| Final feature review meeting | PM + Dev Lead | 30 min |
| Create release/v2.1.0 branch | Engineer | 5 min |
| Assign QA testing tasks | QA Lead | 15 min |

### Code Freeze Week (1 Week Before)

| Day | Activity | Owner |
|-----|----------|-------|
| **Mon** | Code freeze announced | PM |
| **Tue-Thu** | Intensive QA testing | QA Team |
| **Fri** | Blocker bug fixes only | Engineers |

### Release Week

| Day | Activity | Owner | Status |
|-----|----------|-------|--------|
| **Mon** | Release candidate ready | Dev Lead | GO |
| **Tue-Wed** | Final UAT testing | QA + PM | GO |
| **Thu** | Security review pass | Security | GO |
| **Fri** | Release at 10 AM | Engineer | LIVE |

### Post-Release

| Day | Activity | Owner |
|-----|----------|-------|
| **Release Day** | Monitor systems | DevOps |
| **+1 Day** | Hotfix assessment | Dev Lead |
| **+3 Days** | Release retrospective | Team |

---

## 6. Common Pitfalls & How to Avoid Them

### Issue: Version Number Mismatch

**Problem**: Version in plugin.php ≠ package.json ≠ git tag

**Prevention**:
```bash
# Create a script to verify version consistency
cat plugin.php | grep "Version:" > v1.txt
cat package.json | grep "version" > v2.txt
cat readme.txt | grep "Stable tag" > v3.txt

# All should show 2.1.0
```

### Issue: Incomplete CHANGELOG

**Problem**: Some blocks missing from CHANGELOG, unclear feature descriptions

**Prevention**:
- Assign one person to maintain CHANGELOG throughout sprint
- Review CHANGELOG in final PR review
- Use a CHANGELOG template in your PR template

### Issue: Forgotten Block Testing

**Problem**: One block untested, ships with bugs

**Prevention**:
- Mandatory QA checklist per block
- Automated tests (Playwright) for critical paths
- Manual accessibility testing (WCAG 2.2 AA)

### Issue: Release Date Slips

**Problem**: Hotfixes delay launch, communication breaks down

**Prevention**:
- Hard code freeze date (no exceptions)
- Use feature flags for incomplete work
- Communicate slip dates 24 hours early

---

## 7. Rollback Plan

If critical issues found after release:

```bash
# 1. Create hotfix branch
git checkout -b hotfix/v2.1.0-critical-fix main

# 2. Apply fix (minimal change)
# Edit only the affected file

# 3. Bump patch version
# Change version from 2.1.0 to 2.1.1

# 4. Update CHANGELOG
# Add new [2.1.0.1] or [2.1.1] section

# 5. Merge hotfix
git push origin hotfix/v2.1.0-critical-fix
gh pr create --title "Hotfix: v2.1.1 - Critical block bug"

# 6. Tag and release
git tag -a v2.1.1 -m "Hotfix: v2.1.1"
git push origin v2.1.1
```

---

## 8. Success Metrics

After release, track:

```
Installation Metrics:
- Download count (first week, first month)
- Active installations
- Uninstall rate

Quality Metrics:
- GitHub issues opened (blockers vs. feature requests)
- Support ticket volume
- WordPress.org rating trend

Block Adoption:
- % of sites using Testimonial Slider
- % of sites using Pricing Table
- % of sites using Image Gallery

Performance:
- Block load time
- Editor performance impact
- Frontend page load impact
```

---

## 9. Documentation Artifacts

Create these before release:

1. **User Guide**: How to use each block
   - Location: `docs/blocks/testimonial-slider.md`
   - Include screenshots and setup examples

2. **Release Notes**: What changed
   - Location: `docs/releases/v2.1.0.md`
   - Link to GitHub Release

3. **Migration Guide**: For users upgrading from v2.0
   - Location: `docs/upgrading.md`
   - "No breaking changes" section

4. **FAQ**: Common questions
   - "How do I customize block colors?"
   - "Can I use blocks in Classic Editor?" (Answer: No)

---

## 10. Tool Recommendations

**Version Management:**
- npm version patch/minor/major (auto-updates package.json)
- GitHub Releases (automated tag releases)

**CHANGELOG Automation:**
- Commit Lint (enforce conventional commits)
- Release-it or Semantic Release (auto-generate CHANGELOG)

**Testing:**
- Jest (unit tests)
- Playwright (block editor tests)
- Accessibility Insights (WCAG compliance)

**Communication:**
- Slack bot (announce release status)
- GitHub Project board (track release progress)

---

## Summary

**Version Bumping**: 2.0.x → 2.1.0 (semantic versioning)
- Update 4-5 files: plugin.php, package.json, style.css, readme.txt

**CHANGELOG**: Keep a Changelog format in CHANGELOG.md
- Dated section [2.1.0] - YYYY-MM-DD
- Added/Changed/Fixed/Security sections
- Block-specific descriptions

**Coordination**: 2-week sprint + 1-week release window
- Code freeze 1 week before
- Hard testing phase mid-week
- Release Friday with rollback plan ready

**Success**: Deploy v2.1.0 with three fully tested, documented, supported blocks.
