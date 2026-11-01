# WCAG 2.2 AAA Form Accessibility Remediation

## Branch Type Recommendation

**Recommended Branch Type:** `feature/form-wcag-accessibility` or `fix/form-accessibility-wcag`

**Rationale:**
- This is a **quality and compliance improvement**, not a new capability—so `fix/` is appropriate if the form currently exists and is broken
- If adding comprehensive accessibility to a previously inaccessible form, `feature/` signals a deliberate feature upgrade
- Use `fix/` if the form exists and violates WCAG 2.2 AAA
- Use `feature/` if adding accessibility retrofitting to previously unaccessible component
- Branch scope: Isolate to the form block component, not the entire plugin/theme

**Example branch names:**
- `fix/form-block-wcag-2-2-aaa-compliance`
- `feature/accessible-form-block-keyboard-navigation`

---

## General Branch Guidance

### Scope
- **Target:** Single form block component (or modular subset of forms if monolithic)
- **Out of scope:** Other blocks or unrelated accessibility issues
- **Acceptance:** All WCAG 2.2 AAA criteria met; no regression in lower compliance levels

### Testing Environments
- Local development + staging (at minimum)
- Real keyboard navigation testing (not just tab key)
- Multiple screen readers: NVDA (Windows), JAWS (Windows), VoiceOver (macOS/iOS)
- Assistive tech: Dragon NaturallySpeaking, Switch Control

### Code Review Checklist
- [ ] No new HTML divs misused as interactive elements
- [ ] Semantic HTML (form, fieldset, legend, label, input, select, textarea, button)
- [ ] aria-* attributes only where semantic HTML insufficient
- [ ] No ARIA conflicts with native HTML roles
- [ ] Keyboard trap detection (focus must never get stuck)
- [ ] Form submission without JavaScript fallback present
- [ ] Error messages linked to form fields via aria-describedby

---

## WCAG 2.2 AAA Form Accessibility Testing Checklist

### 1. Keyboard Navigation (WCAG 2.1.1, 2.1.3, 2.4.3)
- [ ] **Tab order is logical and visible** — focus indicator clearly visible at ≥3:1 contrast
- [ ] All form inputs receive focus via Tab key
- [ ] Focus order matches visual/reading order (left-to-right, top-to-bottom)
- [ ] No keyboard traps — user can tab away from any element
- [ ] Form can be submitted via keyboard (Enter on button, not just mouse click)
- [ ] Autocomplete/datalist dropdown navigable with arrow keys (WCAG 2.1.2)
- [ ] Required: Focus visible indicator ≥2px width/height or outline ≥2px width

**Test steps:**
1. Unplug mouse; use only keyboard to complete form
2. Tab through each input; verify visual focus indicator
3. Shift+Tab backwards through form; verify reverse order
4. In multi-select/radio groups, test arrow keys navigate options
5. Test Escape key dismisses autocomplete or modal

---

### 2. Labels & Field Identification (WCAG 1.3.1, 3.3.2, 4.1.2)
- [ ] Every form control has associated `<label>` element
- [ ] `<label for="id">` matches input's `id` attribute (not wrapped)
- [ ] Labels visible and positioned to left (LTR) or right of control, or above
- [ ] Hidden labels (if any) use `aria-label` or `aria-labelledby`, not `display:none`
- [ ] Fieldsets with legends group related controls (radio buttons, checkboxes)
- [ ] `<legend>` is first child of `<fieldset>` and not visually hidden
- [ ] All labels meaningful and descriptive (not "Field 1", "Field 2")

**Bad Example:**
```html
<input type="text" placeholder="Email"> <!-- No label -->
```

**Good Example:**
```html
<label for="email">Email Address:</label>
<input type="email" id="email" required>
```

---

### 3. Error Identification & Recovery (WCAG 3.3.1, 3.3.3, 3.3.4, 3.3.5)
- [ ] Form errors are announced to screen readers (role=alert or aria-live=assertive)
- [ ] Error messages linked to inputs via `aria-describedby`
- [ ] Required fields marked with **text** AND indicator (e.g., "Required" or "*")
- [ ] At least one required field indicator visible to all users (not just screen readers)
- [ ] Error messages suggest correction, not just "error"
- [ ] User can correct error and resubmit without re-entering valid fields
- [ ] Form is submitted only on explicit user action (button click), not auto-submit

**Bad Example:**
```html
<input type="text" id="phone" aria-describedby="error">
<span id="error">Error!</span> <!-- Too vague, not descriptive -->
```

**Good Example:**
```html
<input type="tel" id="phone" aria-describedby="phone-help error-msg" required>
<span id="phone-help">Format: (123) 456-7890</span>
<span id="error-msg" role="alert" aria-live="assertive"></span> <!-- Updated dynamically -->
```

---

### 4. Instructions & Help Text (WCAG 2.4.6, 3.3.5)
- [ ] Form instructions are clear and placed before the form or near related fields
- [ ] Help text (`aria-describedby`) explains format requirements (date, phone, etc.)
- [ ] Example values provided for complex inputs (e.g., "MM/DD/YYYY")
- [ ] Abbreviations expanded on first use (e.g., "Phone Number (required)")
- [ ] Legal/compliance text in plain language, linked not just visual

**Accessible Help Text:**
```html
<label for="dob">Date of Birth:</label>
<input type="date" id="dob" aria-describedby="dob-format">
<span id="dob-format">Format: MM/DD/YYYY</span>
```

---

### 5. Visual Design & Contrast (WCAG 1.4.3, 1.4.11, 1.4.13)
- [ ] Input borders ≥2px at ≥3:1 contrast against background
- [ ] Focus indicator ≥2px at ≥3:1 contrast (4.5:1 preferred AAA)
- [ ] Text labels ≥4.5:1 contrast (AAA)
- [ ] Required/optional indicators ≥3:1 contrast and not color-only
- [ ] Placeholder text ≥4.5:1 contrast or removed (many browsers fail this)
- [ ] Error message text ≥4.5:1 contrast, not red-only
- [ ] Form spacing ≥24px between sections (scannable, not cramped)

---

### 6. Form Submission & Confirmation (WCAG 3.3.4, 4.1.3)
- [ ] Submission button has accessible name and clear purpose ("Submit", "Send", "Save")
- [ ] Form submission announced to screen reader (success message in alert region)
- [ ] On error: form stays on page, errors listed, focus moved to first error or error summary
- [ ] On success: confirmation page or message with next steps
- [ ] Submit button disabled only during processing, re-enabled if submission fails
- [ ] Form data persisted if submission fails (user doesn't lose input)

---

### 7. Screen Reader Testing (WCAG 4.1.2, 4.1.3)
**Test with NVDA (Windows) or VoiceOver (Mac):**
- [ ] Form announces as `<form>` or landmark role
- [ ] Each input announced with label, type, value, state
- [ ] Required state announced ("required" or "asterisk required")
- [ ] Help text (`aria-describedby`) read after label
- [ ] Error messages announced on submission
- [ ] Button purpose clear without visual context
- [ ] Fieldsets announced (legend read as group name for radios/checkboxes)
- [ ] Autocomplete suggestions announced and navigable

**Command-line screen reader testing:**
```bash
# NVDA (Windows) - test with keyboard:
# Alt+N to start, Alt+H help, Insert+Down arrow navigate

# VoiceOver (Mac) - test with keyboard:
# VO = Control+Option
# VO+Right arrow navigate, VO+Space interact, VO+U to open rotor
```

---

### 8. Mobile & Touch Accessibility (WCAG 2.1.1, 2.5.5, 2.5.8)
- [ ] Form inputs are ≥44px × 44px touch target (AAA: ≥44×44)
- [ ] Labels/help text visible on mobile (not hidden in popover)
- [ ] Form can be completed in portrait mode (no horizontal scroll)
- [ ] Mobile keyboard input type matches field (tel, email, number, date)
- [ ] No hover-only interactions (not accessible on touch)
- [ ] Autocomplete suggestions keyboard-accessible on mobile

---

### 9. Internationalization & RTL (WCAG 1.4.10, 2.4.3)
- [ ] Form direction set via `<html dir="ltr|rtl">` or `lang` attribute
- [ ] Tab order follows text direction (LTR: left-to-right, RTL: right-to-left)
- [ ] Labels and inputs flex-positioned (not absolutely positioned for RTL)
- [ ] Required marker position adjusts for RTL (`*` on right side for RTL)
- [ ] Autocomplete/dropdown adjusts for RTL

---

### 10. Form Validation & Submission Flow (WCAG 3.3.1, 3.3.4, 4.1.3)
- [ ] Client-side validation announces errors accessibly
- [ ] Server-side validation also present (no client-only validation)
- [ ] Form re-announces all errors on page reload after submission
- [ ] Success confirmation has clear, persistent message (not toast that disappears)
- [ ] User can print/save completed form with all values
- [ ] Session timeout warnings given with sufficient time to extend (AAA)

---

## Accessibility Considerations & Common Pitfalls

### 1. **Placeholder ≠ Label**
- Placeholder disappears when user types—screen readers may not read it again
- **Always use `<label>` elements, not just placeholders**

### 2. **Fieldsets for Groups**
- Radio buttons and checkboxes must be grouped with `<fieldset>` + `<legend>`
- Legend helps screen reader users understand the group purpose

### 3. **aria-label Overrides Visible Text**
- If you use `aria-label`, screen reader users hear it instead of visible label
- Keep them in sync or just use `<label>` (simpler, less error-prone)

### 4. **Color as Only Indicator**
- Red input border for error is not enough; also use text, icon, or attribute
- Required fields can't be indicated by color alone

### 5. **Focus Visible ≠ Browser Default**
- Browsers' default focus styles vary; always define `outline` or `box-shadow`
- At least 2px wide/tall and ≥3:1 contrast

### 6. **Autocomplete Attribute**
- Use HTML5 `autocomplete` attributes to help assistive tech (e.g., `autocomplete="email"`)
- Also helps password managers and mobile keyboards

### 7. **Submit Button Outside Form**
- If submit button is outside `<form>`, it won't work without JavaScript
- Always nest button inside form or use `form="id"` attribute

### 8. **No JavaScript Fallback**
- Forms should work without JavaScript (progressive enhancement)
- Client-side validation is nice; server-side is required

---

## Recommended Test Tools

1. **Automated Scanners** (first pass):
   - Axe DevTools (Chrome/Firefox)
   - WAVE (Chrome/Firefox extension)
   - Lighthouse (Chrome DevTools)

2. **Manual Testing**:
   - Keyboard only (unplug mouse)
   - Screen readers: NVDA (Windows), JAWS (trial), VoiceOver (Mac)
   - Color contrast: Stark (Figma), Color Oracle (simulator), WebAIM contrast checker

3. **Browser DevTools**:
   - Chrome DevTools > Accessibility tree (Ctrl+Shift+I > right panel)
   - Firefox Inspector > Accessibility panel
   - Safari Developer Tools (Web Inspector)

4. **Real Device Testing**:
   - iPhone + VoiceOver (Settings > Accessibility > VoiceOver)
   - Android + TalkBack (Settings > Accessibility > TalkBack)

---

## Definition of Done

All of the following must be true:
- [ ] Form navigable entirely via keyboard
- [ ] All inputs have visible, associated labels
- [ ] Error messages announced and linked to fields
- [ ] Required fields marked visually and to screen readers
- [ ] Focus indicator visible at ≥3:1 contrast
- [ ] Tested with screen reader (NVDA or VoiceOver)
- [ ] No new WCAG 2.2 AAA violations in automated scan
- [ ] Mobile touch targets ≥44×44px
- [ ] Form submission works without JavaScript
- [ ] Confirmation message accessible and persistent

---

## Additional Resources

- [WCAG 2.2 Form Controls Spec](https://www.w3.org/WAI/WCAG22/Understanding/form-input-type.html)
- [WebAIM: Web Form Accessibility](https://webaim.org/articles/form/)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)
- [MDN: ARIA Forms Best Practices](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/forms)
- [Deque University: Forms](https://dequeuniversity.com/)
