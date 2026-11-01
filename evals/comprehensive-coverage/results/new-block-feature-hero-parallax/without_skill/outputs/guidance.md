# Hero Block with Parallax Background - Development Guidance

## Branch Naming Convention

**Recommended branch name:** `feature/hero-block-parallax`

Alternatively, consider:
- `feat/hero-parallax-background`
- `feature/blocks/hero-parallax`

**Guidelines:**
- Use `feature/` or `feat/` prefix for new features
- Use lowercase with hyphens to separate words
- Keep names descriptive but concise (40-50 characters max)
- Avoid special characters and multiple consecutive hyphens

---

## Testing Strategy

### Unit Testing
- **Component logic:** Test parallax effect calculations, offset calculations, edge cases
- **Props/attributes:** Validate accepted parameters (parallax speed, background image, overlay color, etc.)
- **Fallbacks:** Ensure graceful degradation when JavaScript is disabled

### Integration Testing
- **Block registration:** Verify block appears in block inserter
- **Editor rendering:** Test block loads correctly in WordPress block editor
- **Frontend rendering:** Validate block renders correctly on the frontend
- **Interaction:** Test parallax scrolling behavior on desktop and mobile viewports

### Visual Regression Testing
- **Desktop:** 1920px, 1366px viewports
- **Tablet:** 768px viewport
- **Mobile:** 375px viewport
- **Parallax effect:** Verify scroll behavior at different speeds

### Performance Testing
- **Bundle size:** Confirm JavaScript payload is reasonable
- **Render performance:** Check for layout thrashing or excessive repaints during scroll
- **Mobile performance:** Test parallax effect doesn't cause jank on lower-end devices

### Accessibility Testing
- **Keyboard navigation:** Ensure block and inner content are keyboard accessible
- **Screen readers:** Test announcements for background imagery
- **Color contrast:** Verify text overlays meet WCAG AA standards
- **Motion:** Consider users with prefers-reduced-motion enabled

---

## Key Considerations

### Technical
- **Browser compatibility:** Determine which browsers must support parallax (CSS-only vs JavaScript fallback)
- **Parallax implementation:** Decide between CSS (transform, background-attachment) or JavaScript (Intersection Observer, scroll event)
- **Performance:** Parallax effects can impact performance—optimize scroll listeners and use requestAnimationFrame if using JavaScript
- **Mobile support:** Parallax on mobile is problematic for performance and UX; consider disabling or using CSS-based alternatives

### Development
- **Dependencies:** Check if parallax library is needed or if native CSS/JS suffices
- **Block attributes:** Define schema for parallax speed, background image, text overlay, button actions
- **Responsive behavior:** Plan how block adapts to smaller screens (may disable parallax below breakpoint)
- **Editing experience:** Ensure block editor preview reflects frontend parallax behavior

### Quality Assurance
- **Cross-browser testing:** Test in Chrome, Firefox, Safari, Edge
- **Viewport testing:** Verify at minimum 5-7 common viewport sizes
- **Content variations:** Test with different image sizes, text lengths, overlay colors
- **Interaction states:** Test hover, focus, and active states for any interactive elements

### Code Review Checklist
- Block follows WordPress block API standards (block.json, edit.js, save.js)
- Code is well-commented, especially parallax calculation logic
- No unused dependencies or dead code
- Follows project's coding standards and linting rules
- Changelog entry added documenting new feature
- README or documentation updated if applicable

### Pre-Push Validation
- Local tests pass (`npm run test` or equivalent)
- Linting passes (`npm run lint` or equivalent)
- Build succeeds without errors or warnings
- No console errors when adding/rendering block in editor
- Parallax effect works as intended on desktop and degrades gracefully on mobile

---

## Recommended Git Workflow

1. Create feature branch from `develop` or current development branch
2. Commit frequently with clear commit messages
3. Push to remote regularly (avoid large single commits)
4. Create PR when ready for review
5. Address review feedback in follow-up commits
6. Merge PR once approved and CI passes
