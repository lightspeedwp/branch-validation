# XSS Vulnerability Fix Guidance: Custom HTML Block Sanitization

## Issue Summary
User input in a custom HTML block is not being sanitized, creating a Cross-Site Scripting (XSS) vulnerability. This allows attackers to inject malicious scripts that execute in browsers of all site visitors.

---

## 1. Branch Type & Naming

### Recommended Branch Name
```
fix/security-html-block-xss-sanitization
```

**Branch Type Classification:**
- **Primary Type:** `fix` (bug fix addressing a security issue)
- **Severity:** `security` (embedded in branch name for visibility)
- **Category:** `html-block` (affected component)

**Branch Naming Convention:**
- Prefix: `fix/` (indicates a bug fix)
- Component: `security-` (signals security-critical)
- Issue: `html-block-xss-sanitization` (specific problem and solution area)

### Alternative Formats (if using different conventions)
- `hotfix/security-xss-custom-html-block`
- `security/xss-sanitization-html-block-fix`
- `bugfix/html-block-user-input-sanitization`

---

## 2. Security Testing Requirements

### 2.1 Input Vectors to Test
Document all ways user input enters the HTML block:

1. **Direct HTML Input**
   - User-provided HTML content
   - Content from database (if user-editable)
   - Imported from external sources

2. **Attribute Values**
   - `data-*` attributes
   - `class`, `id`, `style` attributes
   - Event handler attributes (if supported)

3. **Content from Variables/Templates**
   - Dynamic content substitution
   - Plugin/theme variable injection
   - Shortcode parameter handling

### 2.2 XSS Test Cases

**Critical Payloads to Test:**

```html
<!-- Basic script injection -->
<img src=x onerror="alert('XSS')">
<svg onload="alert('XSS')">
<iframe src="javascript:alert('XSS')">
<script>alert('XSS')</script>

<!-- Attribute-based attacks -->
<div onclick="alert('XSS')">Click me</div>
<input onfocus="alert('XSS')" autofocus>

<!-- Data URIs -->
<a href="javascript:alert('XSS')">Link</a>

<!-- Event handlers in style -->
<div style="background:url('javascript:alert(\"XSS\")')">
```

**Advanced/Context-Specific Tests:**

```html
<!-- SVG/XML injection -->
<svg><script>alert('XSS')</script></svg>

<!-- Protocol handlers -->
<a href="vbscript:alert('XSS')">Link</a>

<!-- CSS expressions (older browsers) -->
<div style="width: expression(alert('XSS'))">

<!-- Encoded/obfuscated attacks -->
<img src=x onerror="&#97;&#108;&#101;&#114;&#116;&#40;&#39;&#88;&#83;&#83;&#39;&#41;">
<img src=x onerror="alert('XSS')">
```

### 2.3 Testing Checklist

- [ ] **Unit Tests**: Verify sanitization function removes/escapes dangerous patterns
- [ ] **Integration Tests**: Confirm HTML block properly sanitizes user input end-to-end
- [ ] **Manual Testing**: Test all critical payloads in actual browser (Chrome, Firefox, Safari)
- [ ] **Database Tests**: If storing sanitized content, verify round-trip integrity
- [ ] **Regression Tests**: Ensure legitimate HTML (links, images, formatting) still works
- [ ] **Encoding Tests**: Verify both HTML entity and URL encoding work correctly
- [ ] **Content Security Policy (CSP) Tests**: If CSP enabled, confirm it prevents remaining XSS
- [ ] **Post-Sanitization Tests**: Verify attacker cannot bypass sanitization by crafting input

### 2.4 Sanitization Approach Decision

**Choose one:**

1. **Allowlist (Whitelist) Approach** - Recommended
   - Only allow specific safe HTML tags and attributes
   - Strip everything else
   - More restrictive but safer
   - Example: Allow `<p>`, `<a>`, `<strong>`, `<em>`, `<img>` only

2. **Denylist (Blacklist) Approach** - Less Secure
   - Remove known dangerous tags/attributes
   - Risk: New attack vectors discovered later
   - Only use if allowlist insufficient for business requirements

3. **HTML Sanitization Library** - Best Practice
   - Use established library (e.g., DOMPurify, HTML Purifier for PHP)
   - Maintained and tested by security community
   - Handles edge cases developers miss

4. **Escape + Filter Combo**
   - Escape HTML entities for display
   - Filter specific patterns
   - Good for read-only content

---

## 3. Validation & Verification Strategy

### 3.1 Pre-Fix Validation (Confirm Vulnerability)

```bash
# 1. Locate the vulnerable code
grep -r "custom.*html\|html.*block" src/blocks/ --include="*.php" --include="*.js"

# 2. Find where user input is output
grep -r "echo\|innerHTML\|dangerouslySetInnerHTML" src/blocks/ --include="*.php" --include="*.js"

# 3. Check for existing sanitization
grep -r "wp_kses\|sanitize_html\|DOMPurify\|htmlspecialchars" src/blocks/
```

### 3.2 Fix Implementation Validation

**For WordPress/PHP:**
```php
// BEFORE (vulnerable)
echo $user_input_html;

// AFTER (safe)
echo wp_kses_post($user_input_html); // Allows safe HTML

// Or more restrictive:
$allowed_tags = array(
    'p' => array(),
    'a' => array('href' => true),
    'strong' => array(),
    'em' => array(),
);
echo wp_kses($user_input_html, $allowed_tags);
```

**For JavaScript:**
```javascript
// BEFORE (vulnerable)
element.innerHTML = userInput;

// AFTER (safe)
import DOMPurify from 'dompurify';
element.innerHTML = DOMPurify.sanitize(userInput);

// Or simple text content:
element.textContent = userInput;
```

### 3.3 Test Execution Plan

#### Phase 1: Unit Tests
```bash
# Run existing test suite
npm test -- blocks/html-block.test.js

# Add new sanitization tests:
# - Test with all payloads from section 2.2
# - Verify legitimate HTML passes through
# - Confirm output is safe for browser rendering
```

#### Phase 2: Manual Browser Testing
1. Navigate to page with custom HTML block
2. Test each payload from section 2.2 in block editor
3. Save and view on frontend
4. Check browser console for errors or alerts
5. Verify malicious scripts do NOT execute

#### Phase 3: Security Validation
```bash
# 1. Code review checklist
- [ ] All user input identified and documented
- [ ] Sanitization function chosen and justified
- [ ] No direct output of user data without sanitization
- [ ] No eval() or similar dynamic code execution
- [ ] Error messages don't leak system information

# 2. Static analysis
npm run lint -- --security
# or
php -l blocks/html-block.php (basic syntax check)

# 3. SAST scan (if available)
# Review scan results for security warnings
```

#### Phase 4: Integration Testing
- Test with real content library
- Test content migration (if applicable)
- Test with other plugins/themes
- Verify admin interface still works
- Test content rendering on frontend

### 3.4 Validation Criteria (Definition of Done)

The fix is complete when:

- ✓ No XSS payloads execute in browser (console shows no alerts/errors)
- ✓ Unit tests pass (100% of sanitization tests pass)
- ✓ Legitimate HTML content still renders correctly
- ✓ No console warnings/errors during normal use
- ✓ All manual test cases from section 2.2 verified safe
- ✓ Code review completed and approved
- ✓ No new security warnings from static analysis
- ✓ Backwards compatibility confirmed (existing blocks still work)

### 3.5 Post-Merge Validation

After merging to main:

1. **Deploy to staging environment**
   - Run full test suite
   - Verify sanitization works with staging database
   - Test with real user workflows

2. **Security verification**
   - Run penetration testing if available
   - Check error logs for sanitization bypasses
   - Monitor for related security reports

3. **Performance check**
   - Confirm sanitization doesn't slow down block rendering
   - Check memory usage with large HTML blocks

4. **User communication**
   - Notify users if they need to resave content
   - Document breaking changes (if sanitization breaks existing blocks)
   - Provide guidance for custom HTML migration

---

## 4. Common Pitfalls to Avoid

- ❌ Using `htmlspecialchars()` alone (doesn't prevent all XSS)
- ❌ Trusting frontend validation only
- ❌ Creating custom sanitization (use proven libraries)
- ❌ Allowing all HTML tags and attributes
- ❌ Forgetting about attribute-based XSS vectors
- ❌ Not testing after refactoring
- ❌ Assuming old content is safe (sanitize on output, not storage)

---

## 5. Recommended Resources

- **WordPress:** [wp_kses() Documentation](https://developer.wordpress.org/plugins/security/securing-output/)
- **JavaScript:** [DOMPurify GitHub](https://github.com/cure53/DOMPurify)
- **General:** [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- **Testing:** [PortSwigger XSS Testing Guide](https://portswigger.net/web-security/cross-site-scripting)

---

## 6. Git Commit Guidance

**Commit message format:**
```
fix: sanitize user input in custom HTML block to prevent XSS

- Replace innerHTML assignment with sanitized content
- Use wp_kses_post() for WordPress HTML output
- Add unit tests for XSS payload verification
- Verify legitimate HTML tags still render correctly

Fixes: [ISSUE_NUMBER]
Security: Critical
```

**Commit checklist:**
- [ ] Includes both the fix and tests
- [ ] References the issue number
- [ ] Explains the sanitization approach chosen
- [ ] Notes security impact level

---

## 7. Pull Request Requirements

**Title:**
```
Security: Fix XSS vulnerability in custom HTML block sanitization
```

**Description should include:**
1. Vulnerability description (what the bug is)
2. Attack vector (how it's exploited)
3. Impact (what happens if exploited)
4. Fix approach (how you fixed it)
5. Testing performed (validation evidence)
6. Backwards compatibility (any breaking changes)

**Required approvals:**
- Security team review (or designated senior developer)
- Code review (for implementation quality)
- QA verification (test execution)

---

## Summary Checklist

- [ ] Branch created with `fix/security-*` naming
- [ ] All XSS test cases from section 2.2 documented
- [ ] Sanitization library/approach chosen and justified
- [ ] Fix implemented with comprehensive tests
- [ ] All validation criteria from section 3.4 met
- [ ] Code review completed
- [ ] PR ready for merge with security team approval
