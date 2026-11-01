# WordPress Form Block: WCAG 2.2 AAA Accessibility Guidance

**Status:** Branch Validation & Testing Strategy  
**Date:** 2026-11-01  
**Skill Used:** ls-branch-validation

---

## Branch Type Selection

### Recommended Branch Type: `feat/block-form-accessibility`

For comprehensive WCAG 2.2 AAA compliance improvements to a form block (keyboard navigation, ARIA labels, screen reader testing), use:

```bash
git checkout -b feat/block-form-accessibility
```

**Why this branch type?**
- Scope: Major accessibility feature/enhancement initiative
- Addresses multiple WCAG violations (keyboard nav, ARIA, screen reader support)
- Not a single bug fix — comprehensive accessibility overhaul
- Follows LightSpeed WP block development standards

**Alternative branch type** (if fixing specific issues):
```bash
git checkout -b a11y/block-form-keyboard-nav
git checkout -b a11y/block-form-aria-labels
git checkout -b a11y/block-form-screen-reader-support
```

Use the `a11y/` prefix if breaking work into separate focused branches per issue. For a unified effort, use `feat/block-form-accessibility`.

### Branch Naming Format

```
feat/block-form-accessibility
         ^^^^               ^
         |                 |
      component         feature descriptor
```

---

## WCAG 2.2 AAA Testing Checklist

### Pre-Development: Requirements Gathering

- [ ] Document current WCAG violations (use WAVE, Axe DevTools, NVDA)
- [ ] List all form fields and input types
- [ ] Identify custom form interactions/validations
- [ ] Note dependent fields and conditional sections
- [ ] Determine keyboard interaction requirements
- [ ] Review user personas (keyboard-only, screen reader, voice control users)

### Phase 1: Keyboard Navigation (WCAG 2.1.1, 2.1.3)

#### Implementation Checklist
- [ ] All form inputs are keyboard accessible (Tab key navigation)
- [ ] Tab order follows logical visual flow (left-to-right, top-to-bottom)
- [ ] Tab order is set explicitly via `tabindex` (not auto)
- [ ] Focus is never trapped (no infinite Tab loop)
- [ ] Can reach all interactive elements (buttons, checkboxes, radio buttons, links)
- [ ] Can submit form with keyboard alone (Enter key on buttons)
- [ ] Can cancel/reset form with keyboard (Escape key where applicable)
- [ ] Skip links work if form is embedded in page
- [ ] Focus is visible (not removed by CSS outline: none)
- [ ] Focus indicator meets color contrast requirements (3:1 minimum)

#### Testing Steps
```
1. Disable mouse/trackpad
2. Navigate form with Tab and Shift+Tab
3. Use Arrow keys for radio groups and multi-select
4. Use Space/Enter to activate buttons and checkboxes
5. Use Escape to close dialogs or cancel operations
6. Verify Enter submits form on last field
7. Document any keyboard shortcomings
```

#### Test Cases
```gherkin
Scenario: User navigates form with keyboard only
  Given a form block is displayed
  When user presses Tab key
  Then focus moves to first interactive element
  And focus order follows logical sequence
  And focus is clearly visible with 3:1 contrast

Scenario: User submits form via keyboard
  Given form has Tab-navigated to submit button
  When user presses Enter
  Then form submits successfully
  And validation messages appear if errors exist
```

### Phase 2: ARIA Labels & Attributes (WCAG 1.3.1, 2.4.6, 4.1.2)

#### Implementation Checklist

**Form Structure:**
- [ ] Form has `<form>` semantic element
- [ ] Form has accessible name (via `aria-label` or `aria-labelledby`)
- [ ] Form has `role="form"` only if not using `<form>` element
- [ ] Fieldsets group related inputs (radio buttons, checkboxes)
- [ ] Fieldsets have `<legend>` describing group purpose

**Input Labels:**
- [ ] Every input has associated `<label>` element
- [ ] Label text is descriptive and meaningful (not "Name 1", "Name 2")
- [ ] Label `for` attribute matches input `id`
- [ ] Required fields marked with `aria-required="true"` AND visual indicator
- [ ] Input purpose is programmatically determinable

**Input Instructions:**
- [ ] Inputs have `aria-describedby` pointing to help text
- [ ] Help text is visible to all users (not hidden with display:none)
- [ ] Required format examples provided (e.g., "MM/DD/YYYY")
- [ ] Validation requirements explained upfront
- [ ] Character length restrictions announced
- [ ] Placeholder text does NOT replace label text

**Form Validation & Errors:**
- [ ] Error messages announced to screen readers
- [ ] Error messages linked to inputs via `aria-describedby`
- [ ] Error container has `role="alert"`
- [ ] Error messages are visible and not hidden via CSS
- [ ] Errors use clear, plain language (avoid technical jargon)
- [ ] Validation happens on blur (not keystroke) to avoid spam announcements
- [ ] Invalid inputs have `aria-invalid="true"`

**Multi-Step/Conditional Fields:**
- [ ] Conditional fields are hidden with `aria-hidden="true"` when not applicable
- [ ] Step indicators have `aria-current="step"` on active step
- [ ] Progress announced to screen readers ("Step 2 of 5")
- [ ] Back/Next buttons clearly labeled with direction
- [ ] Current section marked with ARIA landmark or heading

**Custom Components:**
- [ ] Custom select/dropdown has `role="listbox"` or `role="combobox"`
- [ ] Date picker has `role="dialog"` and proper keyboard interaction
- [ ] Multi-select has `role="group"` or `role="listbox"`
- [ ] Toggle switches have `role="switch"` and `aria-checked`
- [ ] Spinners/number inputs use `aria-valuenow`, `aria-valuemin`, `aria-valuemax`

#### ARIA Implementation Examples

**Basic Input:**
```html
<label for="email">Email Address</label>
<input 
  type="email" 
  id="email" 
  name="email"
  aria-required="true"
  aria-describedby="email-help"
/>
<div id="email-help" class="help-text">
  We'll never share your email. Format: user@example.com
</div>
```

**Radio Button Group:**
```html
<fieldset>
  <legend>Which plan do you prefer?</legend>
  <div role="group" aria-labelledby="plans-legend">
    <label>
      <input type="radio" name="plan" value="basic" />
      Basic Plan
    </label>
    <label>
      <input type="radio" name="plan" value="pro" />
      Pro Plan
    </label>
  </div>
</fieldset>
```

**Error Message:**
```html
<input 
  type="email" 
  id="email" 
  aria-invalid="true"
  aria-describedby="email-error"
/>
<div id="email-error" role="alert" class="error">
  Please enter a valid email address (example: user@domain.com)
</div>
```

#### Testing Steps
```
1. Open form in browser DevTools Inspector
2. Verify all inputs have associated labels
3. Use Axe DevTools to scan for ARIA violations
4. Use WAVE to check for missing labels/descriptions
5. Verify aria-describedby links exist and are meaningful
6. Check error messages have aria-invalid and role="alert"
7. Test with screen reader (NVDA, JAWS, VoiceOver)
```

#### Test Cases
```gherkin
Scenario: Screen reader announces input label
  Given a form input with associated label
  When screen reader focuses on input
  Then label text is announced clearly
  And input purpose is understood

Scenario: Error message is announced
  Given a form with validation error
  When screen reader navigates to error
  Then error message is announced with "alert" role
  And invalid input is marked aria-invalid="true"
  And user understands how to fix error

Scenario: Required field is marked
  Given a required form input
  When screen reader announces input
  Then "required" is announced
  And visual indicator is present (asterisk, text, etc.)
```

### Phase 3: Screen Reader Testing (WCAG 4.1.2, 4.1.3)

#### Supported Screen Readers (Test All)

- [ ] NVDA (Windows) — Free, most common in enterprise
- [ ] JAWS (Windows) — Industry standard, paid
- [ ] VoiceOver (macOS/iOS) — Native, included
- [ ] TalkBack (Android) — Native, included
- [ ] WCAG 2.2 AAA requires testing with ≥2 screen readers

#### Screen Reader Announcement Testing

**Form Load:**
- [ ] Form is announced as a form (or landmark if using `<form>`)
- [ ] Form purpose is clear from page heading or form label
- [ ] User understands what form will do before interacting

**Field Focus:**
- [ ] Input label is announced when focused
- [ ] Input type is announced (text, email, checkbox, radio, etc.)
- [ ] Required status is announced
- [ ] Help text/instructions are announced
- [ ] Current value is announced (for pre-filled fields)

**Interaction Feedback:**
- [ ] Checkbox state change is announced (checked/unchecked)
- [ ] Radio button selection change is announced
- [ ] Dropdown option selection is announced
- [ ] Validation errors announced with alert role immediately
- [ ] Success message announced after form submission

**Custom Components:**
- [ ] Date picker announces all available dates
- [ ] Multi-select announces selection additions/removals
- [ ] Toggle switch announces on/off state clearly
- [ ] Number spinner announces increment/decrement

#### NVDA Testing Procedure (Windows)
```
1. Download & install NVDA (free, https://www.nvaccess.org/)
2. Start NVDA (Ctrl+Alt+N or from Start menu)
3. Open form page in Firefox or Chrome
4. Use NVDA key (Insert) + arrow keys to navigate
5. Use Tab to move through form
6. Press Space/Enter to interact with elements
7. Check NVDA log (Ctrl+H) for unexpected announcements
8. Document any gaps in announcements
```

#### JAWS Testing Procedure (Windows)
```
1. Start JAWS (if licensed)
2. Open form in Chrome or Edge
3. Use JAWS key (Insert) + arrow to read page
4. Use Tab and Shift+Tab for form navigation
5. Press Space/Enter to interact
6. Use Ctrl+Shift+Alt+F5 to open JAWS logfile
7. Verify all form instructions and errors are announced
```

#### VoiceOver Testing Procedure (macOS)
```
1. Enable VoiceOver: Cmd+F5
2. Open form in Safari or Chrome
3. Use VO key (Ctrl+Option) + Arrow keys to navigate
4. Use Tab for form navigation
5. Use VO + Space to interact with elements
6. Use VO + U to open rotor (navigation tool)
7. Check all form elements appear in rotor
```

#### Test Cases
```gherkin
Scenario: NVDA announces form field and instructions
  Given form is displayed and NVDA is running
  When NVDA cursor moves to form field
  Then NVDA announces: label + field type + required + help text
  And announcements are accurate and complete

Scenario: Screen reader announces validation error
  Given user enters invalid email
  When form validation triggers
  Then screen reader immediately announces error message
  And error links back to invalid field
  And field is marked aria-invalid="true"

Scenario: All form interactions work with screen reader
  Given form is displayed with NVDA active
  When user completes form using only screen reader and keyboard
  Then all fields can be filled
  And all validations are announced
  And form can be submitted
  And success/error is announced
```

### Phase 4: Color Contrast & Visual Design (WCAG 1.4.3, 1.4.11)

#### Contrast Requirements
- [ ] Normal text: 7:1 contrast ratio (AAA)
- [ ] Large text (18pt+/bold 14pt+): 4.5:1 contrast ratio (AAA)
- [ ] Focus indicators: 3:1 contrast ratio against adjacent colors
- [ ] Graphical elements: 3:1 contrast ratio (AAA)
- [ ] Error text: meets 7:1 contrast with background
- [ ] Help text: meets 7:1 contrast with background
- [ ] Placeholder text: meets 7:1 contrast (or removed in favor of labels)

#### Visual Indicators (Non-Color-Dependent)
- [ ] Required fields marked with visual indicator + text (not just color)
- [ ] Error fields marked with icon/border + text (not just red)
- [ ] Success marked with checkmark/icon + text (not just green)
- [ ] Focus indicator is visible (outline, ring, or highlight)
- [ ] Focus indicator is not removed by `:focus { outline: none; }`

#### Testing Tools
```
1. WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
2. Axe DevTools: Scan for contrast violations
3. Chrome DevTools: Inspect element, check color values
4. WAVE: Identify low contrast elements
5. Manual testing: Print form in grayscale, verify readability
```

#### Test Cases
```gherkin
Scenario: Form is readable with WCAG AAA contrast
  Given a form with text, labels, and error messages
  When contrast is measured with WebAIM tool
  Then all text meets 7:1 contrast ratio
  And focus indicator meets 3:1 contrast
  And non-text elements meet 3:1 contrast

Scenario: Form is readable when printed in grayscale
  Given a form with colored error messages
  When printed or viewed in grayscale mode
  Then error fields remain distinguishable by icon/border
  And required fields remain marked by text or icon
  And all form structure is clear without color
```

### Phase 5: Responsive & Zoom Testing (WCAG 1.3.4, 1.4.4)

#### Responsiveness
- [ ] Form layout works at 320px width (mobile)
- [ ] Form layout works at 768px width (tablet)
- [ ] Form layout works at 1920px width (desktop)
- [ ] Form inputs are at least 44px tall (touch target size, WCAG 2.5.5)
- [ ] Form inputs maintain 8px spacing between them
- [ ] Label text remains readable on mobile
- [ ] Error messages don't overflow or get cut off

#### Zoom & Text Scaling
- [ ] Form remains usable when zoomed to 200% in browser
- [ ] Text can be resized (no fixed pixel sizes that don't scale)
- [ ] Form maintains layout integrity at 200% zoom
- [ ] No horizontal scrolling required at 200% zoom (except complex tables)
- [ ] Focus indicator remains visible and properly positioned at zoom

#### Testing Steps
```
1. Test in browser DevTools mobile emulation
2. Test in actual devices (iPhone, Android, tablet)
3. Use browser zoom (Ctrl/Cmd + Plus) to 200%
4. Verify all inputs remain accessible
5. Verify no content is cut off
6. Test with browser text-only zoom
7. Test with OS-level zoom (Windows Magnifier, etc.)
```

#### Test Cases
```gherkin
Scenario: Form is mobile-responsive
  Given form displayed on mobile device (320px)
  When user interacts with form
  Then all inputs are clearly visible
  And touch targets are at least 44x44px
  And form can be completed without horizontal scroll

Scenario: Form is readable when browser zoomed to 200%
  Given form viewed in desktop browser
  When browser zoom is set to 200%
  Then all text remains readable
  And form layout doesn't break
  And no horizontal scrolling required
```

### Phase 6: Automated Testing

#### Unit Tests (Jest)
```javascript
// Test ARIA attributes exist and are correct
describe('Form Block Accessibility', () => {
  it('should have aria-required on required fields', () => {
    const emailInput = render(<FormBlock />).getByLabelText('Email');
    expect(emailInput).toHaveAttribute('aria-required', 'true');
  });

  it('should link aria-describedby to help text', () => {
    const input = render(<FormBlock />).getByLabelText('Email');
    const helpText = screen.getByText(/never share/i);
    expect(input).toHaveAttribute('aria-describedby', helpText.id);
  });

  it('should announce validation errors with role=alert', () => {
    const { getByRole } = render(<FormBlock />);
    const error = getByRole('alert');
    expect(error).toBeInTheDocument();
  });
});
```

#### E2E Tests (Playwright)
```javascript
test('keyboard navigation through form', async ({ page }) => {
  await page.goto('/form-block');
  
  // Tab through form
  await page.keyboard.press('Tab');
  await expect(page.locator('#email')).toBeFocused();
  
  await page.keyboard.press('Tab');
  await expect(page.locator('#password')).toBeFocused();
});

test('screen reader announces error message', async ({ page }) => {
  // Requires Playwright with accessibility testing plugin
  const violations = await page.locator('form').evaluate(() => {
    return axe.run(); // Requires axe-core loaded on page
  });
  
  expect(violations.violations).toHaveLength(0);
});
```

#### Accessibility Scanning (Axe, WAVE)
```bash
# Add axe-core to E2E tests
npm install --save-dev @axe-core/playwright

# In test:
import { injectAxe, checkA11y } from 'axe-playwright';

test('no accessibility violations', async ({ page }) => {
  await page.goto('/form-block');
  await injectAxe(page);
  await checkA11y(page);
});
```

#### Coverage Target
- [ ] Jest: ≥85% code coverage on form logic
- [ ] Playwright E2E: All keyboard paths tested
- [ ] Axe: 0 violations on form block in isolation
- [ ] Manual: All WCAG AAA criteria verified with screen readers

### Phase 7: Commit & PR Process

#### Commit Message Format
```
feat(block-form): add WCAG 2.2 AAA accessibility support

- Implement keyboard navigation (Tab, Arrow, Enter, Escape)
- Add aria-label, aria-describedby, aria-invalid attributes
- Add form semantic structure with fieldsets and legends
- Add error announcement with role="alert"
- Include NVDA/JAWS/VoiceOver testing and verification
- Add Jest unit tests (90%+ coverage)
- Add Playwright E2E tests for keyboard and screen reader
- Add Axe accessibility scanning to CI
- Verify 7:1 text contrast ratio (WCAG AAA)
- Verify 44x44px touch targets on mobile

Tested with:
- NVDA (Windows)
- JAWS (Windows)
- VoiceOver (macOS)
- Chrome DevTools Lighthouse
- Axe DevTools
- Manual keyboard-only testing

Closes #<issue-number>
```

#### PR Description
```markdown
## Changes
- WCAG 2.2 AAA compliance for form block
- Keyboard navigation support
- Screen reader announcements
- Proper ARIA labels and descriptions
- Improved error messaging

## Testing Checklist
- [ ] Tested with NVDA (Windows)
- [ ] Tested with JAWS (Windows)  
- [ ] Tested with VoiceOver (macOS)
- [ ] Tested keyboard-only navigation
- [ ] Verified 7:1 text contrast
- [ ] Jest tests pass (90%+ coverage)
- [ ] Playwright E2E tests pass
- [ ] Axe scan: 0 violations
- [ ] Form works on mobile (44x44px targets)
- [ ] Form usable at 200% zoom

## Screenshots/Demo
[Link to staging demo]
```

---

## WCAG 2.2 AAA Compliance Strategy

### Success Criteria Covered

| Criterion | Level | Implementation |
|-----------|-------|-----------------|
| 2.1.1 Keyboard | A | All interactive elements keyboard accessible |
| 2.1.3 Keyboard (No Exception) | AAA | Entire form operable by keyboard |
| 2.4.6 Headings and Labels | AAA | All inputs have descriptive labels |
| 4.1.2 Name, Role, Value | A | All components have proper ARIA |
| 4.1.3 Status Messages | AAA | Errors announced with role="alert" |
| 1.3.1 Info and Relationships | A | Proper semantic HTML structure |
| 1.4.3 Contrast (Minimum) | AAA | 7:1 text contrast ratio |
| 1.4.4 Resize Text | AA | Text can be zoomed to 200% |
| 2.5.5 Target Size (Enhanced) | AAA | 44x44px touch targets |

### Common Pitfalls to Avoid

❌ **Don't:** Remove focus outline with `outline: none`  
✅ **Do:** Style focus indicator with visible ring or border

❌ **Don't:** Use placeholder text instead of label  
✅ **Do:** Use `<label>` element with help text in aria-describedby

❌ **Don't:** Only use color to indicate errors  
✅ **Do:** Use icon + text + aria-invalid="true"

❌ **Don't:** Validate on keystroke (announces every character)  
✅ **Do:** Validate on blur (after user finishes input)

❌ **Don't:** Hide error messages with display:none  
✅ **Do:** Keep visible to all users, marked with role="alert"

❌ **Don't:** Forget to test with actual screen readers  
✅ **Do:** Test with NVDA, JAWS, and VoiceOver

### Resources & Tools

**Automated Testing:**
- Axe DevTools: https://www.deque.com/axe/devtools/
- WAVE Browser Extension: https://wave.webaim.org/
- Lighthouse (Chrome DevTools): Built-in, run audit
- Pa11y: CLI tool for accessibility testing

**Screen Readers:**
- NVDA (free): https://www.nvaccess.org/
- JAWS (paid): https://www.freedomscientific.com/
- VoiceOver (built-in): macOS/iOS
- TalkBack (built-in): Android

**WCAG References:**
- WCAG 2.2 Guidelines: https://www.w3.org/WAI/WCAG22/quickref/
- WebAIM: https://webaim.org/
- Deque University: https://dequeuniversity.com/
- WordPress Accessibility: https://developer.wordpress.org/plugins/accessibility/

**Form-Specific:**
- WebAIM Form Accessibility: https://webaim.org/articles/forms/
- MDN: Building accessible forms: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/forms
- ARIA Authoring Practices Guide: https://www.w3.org/WAI/ARIA/apg/patterns/

---

## Summary

**Branch Type:** `feat/block-form-accessibility`

**Testing Phases:**
1. Keyboard Navigation (Tab, Arrow, Enter, Escape)
2. ARIA Labels & Attributes (labels, descriptions, validation)
3. Screen Reader Testing (NVDA, JAWS, VoiceOver)
4. Color Contrast & Visual Design (7:1 ratio, non-color indicators)
5. Responsive & Zoom (mobile, 200% zoom, 44x44px targets)
6. Automated Testing (Jest 90%+, Playwright E2E, Axe)
7. Commit & PR Process (detailed testing evidence)

**Key Metrics:**
- Screen readers supported: 3+ (NVDA, JAWS, VoiceOver)
- Manual testing time: 2-3 hours per screen reader
- Unit test coverage: ≥90%
- E2E test coverage: All keyboard paths + form submission
- Axe violations: 0

**Timeline:**
- Phase 1-2 (Implementation): 4-6 hours
- Phase 3 (Screen reader testing): 6-8 hours  
- Phase 4-5 (Visual + responsive): 2-3 hours
- Phase 6 (Automated testing): 2-3 hours
- Phase 7 (Review & refinement): 1-2 hours

**Total estimate:** 15-23 hours for comprehensive WCAG 2.2 AAA compliance

---

*Guidance generated by ls-branch-validation skill for LightSpeed WP WordPress block development*
