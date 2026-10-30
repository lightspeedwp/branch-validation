# WordPress Block Theme Development Guide

## Overview

Block themes are WordPress themes built entirely with Gutenberg blocks and templates, offering maximum flexibility and visual consistency. This guide covers branching strategy, development workflow, and best practices for block theme projects.

## Block Theme Structure

```
theme-name/
├── theme.json                    # Global settings and styles
├── functions.php                 # Theme setup and hooks
├── style.css                     # Theme header (Version here!)
├── blocks/                       # Custom blocks for theme
│   ├── hero/
│   ├── testimonial/
│   └── pricing/
├── parts/                        # Reusable template parts
│   ├── header.html
│   ├── footer.html
│   └── sidebar.html
├── patterns/                     # Block patterns
│   ├── landing-page.php
│   └── hero-with-cta.php
├── templates/                    # Page templates
│   ├── index.html
│   ├── single.html
│   ├── archive.html
│   └── 404.html
├── templates/parts/              # Template part definitions
├── src/                          # Development source
│   ├── scripts/
│   ├── styles/
│   └── blocks/
└── build/                        # Compiled assets
```

## Branch Types for Block Themes

### Theme Feature Development

**Branch pattern:** `feat/theme-{feature}`

**Common features:**
- New custom block for theme
- New template layout
- Pattern library expansion
- Theme customization options
- Color/typography system

**Examples:**
```
feat/theme-hero-block-variations
feat/theme-testimonials-section
feat/theme-color-palette-system
feat/theme-homepage-template
```

### Block Theme Specific Branches

**For major theme improvements:**

```
feat/theme-blocks-{component}     # Custom block addition
feat/theme-templates-{page}       # New page template
feat/theme-patterns-{category}    # Pattern library
feat/theme-customize-{feature}    # Customizer improvements
```

**Examples:**
```
feat/theme-blocks-hero-parallax
feat/theme-templates-case-study
feat/theme-patterns-portfolio-gallery
feat/theme-customize-fonts-panel
```

### Theme.json Modifications

**Branch pattern:** `refactor/theme-config-{change}`

Theme.json is critical for block theme functionality. Changes here deserve their own branch.

**Examples:**
```
refactor/theme-config-spacing-scale
refactor/theme-config-color-palette
refactor/theme-config-typography
```

### Theme Bug Fixes

**Branch pattern:** `fix/theme-{issue}`

**Common issues:**
- Block not rendering in theme
- Template syntax errors
- Style conflicts in theme
- Responsive layout issues
- Custom block bugs

**Examples:**
```
fix/theme-mobile-menu-layout
fix/theme-footer-alignment
fix/theme-block-rendering
```

### Theme Accessibility

**Branch pattern:** `a11y/theme-{feature}`

**Block theme a11y concerns:**
- Skip link functionality
- Navigation keyboard navigation
- Color contrast in templates
- Focus management
- ARIA labels on custom blocks

**Examples:**
```
a11y/theme-navigation-keyboard
a11y/theme-color-contrast-improvements
a11y/theme-skip-links
```

### Theme Testing

**Branch pattern:** `test/theme-{testtype}`

**Test types:**
- `template` — Template rendering and layout
- `responsive` — Responsive design on breakpoints
- `cross-browser` — Browser compatibility
- `a11y` — Accessibility compliance
- `performance` — Load time and Core Web Vitals

**Examples:**
```
test/theme-template-rendering
test/theme-responsive-layouts
test/theme-a11y-wcag
test/theme-performance-optimization
```

## Development Workflow: Adding a Custom Block to Theme

### Step 1: Create Feature Branch

```bash
git checkout -b feat/theme-blocks-testimonial

# Or if it's a significant feature:
git checkout -b feat/theme-testimonials-section
```

### Step 2: Create Block Structure

```bash
# Create block directory
mkdir -p blocks/testimonial

# Create block files
touch blocks/testimonial/block.json
touch blocks/testimonial/edit.js
touch blocks/testimonial/save.js
touch blocks/testimonial/style.scss
touch blocks/testimonial/index.js
```

### Step 3: Define Block Metadata

**blocks/testimonial/block.json:**
```json
{
  "apiVersion": 3,
  "name": "theme-name/testimonial",
  "title": "Testimonial",
  "category": "theme-blocks",
  "description": "Display customer testimonials",
  "icon": "admin-comments",
  "supports": {
    "html": false,
    "color": { "text": true, "background": true },
    "spacing": { "padding": true, "margin": true }
  },
  "attributes": {
    "text": { "type": "string", "source": "html", "selector": ".testimonial-text" },
    "author": { "type": "string", "default": "" },
    "role": { "type": "string", "default": "" }
  }
}
```

### Step 4: Implement Block Editor

**blocks/testimonial/edit.js:**
```javascript
import { useBlockProps, RichText } from '@wordpress/block-editor';
import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
  const { text, author, role } = attributes;
  const blockProps = useBlockProps();

  return (
    <div {...blockProps}>
      <RichText
        value={text}
        onChange={(value) => setAttributes({ text: value })}
        placeholder="Add testimonial text..."
        multiline="p"
      />
      <input
        type="text"
        value={author}
        onChange={(e) => setAttributes({ author: e.target.value })}
        placeholder="Author name"
      />
    </div>
  );
}
```

### Step 5: Implement Block Frontend

**blocks/testimonial/save.js:**
```javascript
import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function save({ attributes }) {
  const { text, author, role } = attributes;

  return (
    <div {...useBlockProps.save()}>
      <blockquote className="testimonial-text">
        <RichText.Content value={text} />
      </blockquote>
      <p className="testimonial-author">{author}</p>
      {role && <p className="testimonial-role">{role}</p>}
    </div>
  );
}
```

### Step 6: Add Styling

**blocks/testimonial/style.scss:**
```scss
.wp-block-theme-name-testimonial {
  border-left: 4px solid var(--wp--preset--color--primary);
  padding: var(--wp--preset--spacing--medium);
  margin: var(--wp--preset--spacing--large) 0;
  background: var(--wp--preset--color--light);

  .testimonial-text {
    font-style: italic;
    font-size: 1.1em;
    margin-bottom: var(--wp--preset--spacing--small);
  }

  .testimonial-author {
    font-weight: bold;
    margin: 0;
  }

  .testimonial-role {
    font-size: 0.9em;
    color: var(--wp--preset--color--secondary);
    margin: 0;
  }
}
```

### Step 7: Register Block

**blocks/testimonial/index.js:**
```javascript
import { registerBlockType } from '@wordpress/blocks';
import metadata from './block.json';
import Edit from './edit';
import save from './save';

registerBlockType(metadata.name, {
  ...metadata,
  edit: Edit,
  save,
});
```

### Step 8: Enqueue in Theme

**functions.php:**
```php
function my_theme_register_blocks() {
  wp_register_script(
    'my-theme-testimonial-block',
    get_template_directory_uri() . '/blocks/testimonial/index.js',
    array( 'wp-blocks', 'wp-element', 'wp-editor' ),
    filemtime( get_template_directory() . '/blocks/testimonial/index.js' )
  );

  register_block_type(
    'theme-name/testimonial',
    array(
      'editor_script'  => 'my-theme-testimonial-block',
      'style'          => 'my-theme-block-styles',
    )
  );
}
add_action( 'init', 'my_theme_register_blocks' );
```

### Step 9: Write Tests

```bash
# Unit tests for block utilities
npm run test blocks/testimonial

# E2E tests for block in editor
npm run test:e2e blocks/testimonial

# Accessibility audit
npm run test:a11y
```

### Step 10: Create Template Using Block

**templates/testimonials.html:**
```html
<!-- wp:template {"slug":"testimonials"} -->
<div class="wp-site-blocks">
  <!-- wp:template-part {"slug":"header"} /-->
  
  <main class="wp-block-group">
    <!-- wp:heading {"level": 1} -->
    <h1>Customer Testimonials</h1>
    <!-- /wp:heading -->
    
    <!-- wp:theme-name/testimonial -->
    <div class="wp-block-theme-name-testimonial">
      <blockquote>Great service!</blockquote>
      <p class="testimonial-author">Jane Doe</p>
    </div>
    <!-- /wp:theme-name/testimonial -->
  </main>
  
  <!-- wp:template-part {"slug":"footer"} /-->
</div>
<!-- /wp:template -->
```

### Step 11: Commit and Push

```bash
git add blocks/testimonial/ functions.php templates/
git commit -m "feat(theme-blocks): add testimonial custom block

- Create reusable testimonial block with author/role
- Include editor and frontend rendering
- Add comprehensive styling with theme tokens
- Add unit and E2E tests
- Create testimonials template using block
- Update CHANGELOG.md

Closes #456"

git push -u origin feat/theme-blocks-testimonial
```

## Theme.json Best Practices

### Organization

```json
{
  "version": 2,
  "settings": {
    "color": { "palette": [...] },
    "typography": { "fontFamilies": [...] },
    "spacing": { "spacingScale": {...} }
  },
  "styles": {
    "color": { "background": "#fff", "text": "#333" },
    "typography": { "fontFamily": "...", "fontSize": "..." },
    "blocks": {
      "core/heading": {...},
      "theme-name/testimonial": {...}
    }
  }
}
```

### Custom Block Styles

```json
{
  "version": 2,
  "styles": {
    "blocks": {
      "theme-name/testimonial": {
        "color": {
          "text": "var(--wp--preset--color--primary)",
          "background": "var(--wp--preset--color--light)"
        },
        "spacing": {
          "padding": "var(--wp--preset--spacing--medium)"
        },
        "typography": {
          "fontSize": "var(--wp--preset--font-size--large)"
        }
      }
    }
  }
}
```

## Template Development

### Creating Page Templates

**templates/single-case-study.html:**
```html
<!-- wp:template {"slug":"single-case-study","postTypes":["post"]} -->
<div class="wp-site-blocks">
  <!-- wp:template-part {"slug":"header"} /-->
  
  <main class="wp-block-group has-primary-background-color">
    <!-- wp:post-title /-->
    <!-- wp:post-content /-->
    <!-- wp:theme-name/case-study-meta /-->
  </main>
  
  <!-- wp:template-part {"slug":"footer"} /-->
</div>
<!-- /wp:template -->
```

### Conditional Block Rendering

```html
<!-- wp:group {"metadata":{"name":"Sidebar"}} -->
<aside>
  <!-- wp:query {"query":{"perPage":3,"pages":0,"offset":0}} -->
  <div class="wp-block-query">
    <!-- wp:post-template /-->
  </div>
  <!-- /wp:query -->
</aside>
<!-- /wp:group -->
```

## Block Theme Performance Tips

1. **Minimize custom blocks** — Use core blocks when possible
2. **Optimize theme.json** — Only define colors/fonts you use
3. **Lazy-load block scripts** — Use `wp_set_script_translations()`
4. **Cache block output** — Use transients for heavy blocks
5. **Minify CSS/JS** — Use build tools (wp-scripts, webpack)

## Testing Block Theme

### Template Rendering
- [ ] All templates render without errors
- [ ] Pages display correct templates
- [ ] Custom post type templates work

### Responsive Design
- [ ] Mobile layout correct
- [ ] Tablet layout correct
- [ ] Desktop layout correct
- [ ] Touch targets are 48x48px minimum

### Block Compatibility
- [ ] All custom blocks appear in inserter
- [ ] Core blocks work as expected
- [ ] Third-party blocks compatible
- [ ] Block patterns available

### Accessibility
- [ ] WCAG 2.2 AAA compliant
- [ ] Screen readers work
- [ ] Keyboard navigation complete
- [ ] Color contrast meets standards

### Performance
- [ ] LCP < 2.5 seconds
- [ ] INP < 200 milliseconds
- [ ] CLS < 0.1
- [ ] No console errors

## Release Checklist for Block Themes

- [ ] Update `style.css` Version header
- [ ] Update `theme.json` theme version
- [ ] Update `CHANGELOG.md`
- [ ] Run linter: `npm run lint`
- [ ] Run tests: `npm run test`
- [ ] Test responsive design
- [ ] Accessibility audit
- [ ] Performance check
- [ ] Create git tag: `git tag v1.0.0`
- [ ] Merge to main
- [ ] Update WordPress.org (if applicable)

## Resources

- [WordPress Block Theme Documentation](https://developer.wordpress.org/themes/block-themes/)
- [Theme.json Reference](https://developer.wordpress.org/themes/global-settings-and-styles/theme-json/)
- [Block Pattern Handbook](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-patterns/)
- [WordPress CLI Theme Commands](https://developer.wordpress.org/cli/commands/theme/)
- [Web Vitals Guide](https://web.dev/vitals/)
