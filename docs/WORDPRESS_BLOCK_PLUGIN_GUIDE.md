# WordPress Block Plugin Development Guide

## Overview

Block plugins extend WordPress functionality by providing custom Gutenberg blocks, patterns, and block variations. This guide covers branching strategy, development workflow, and best practices for block plugin projects.

## Block Plugin Structure

```
block-plugin-name/
├── plugin.php                    # Main plugin file (Version here!)
├── readme.txt                    # Plugin readme (Stable tag here!)
├── package.json                  # NPM dependencies
├── blocks/                       # Custom blocks
│   ├── accordion/
│   ├── carousel/
│   ├── pricing-table/
│   └── index.php                 # Block registration
├── patterns/                     # Block patterns
│   └── index.php
├── src/                          # Development source
│   ├── js/
│   ├── css/
│   └── blocks/
├── build/                        # Compiled assets
├── tests/                        # PHPUnit tests
│   ├── test-blocks.php
│   └── test-plugin.php
├── .github/
│   └── workflows/
│       ├── test.yml
│       └── deploy.yml
└── .wp-env.json                  # Local environment config
```

## Branch Types for Block Plugins

### Plugin Feature Development

**Branch pattern:** `feat/plugin-{feature}`

**Common features:**
- New custom block
- New block pattern
- New block variation
- Plugin settings/options
- Block extension/integration

**Examples:**
```
feat/plugin-accordion-block
feat/plugin-carousel-variations
feat/plugin-pricing-table
feat/plugin-settings-panel
```

### Block Plugin Specific Branches

**For plugin-wide improvements:**

```
feat/plugin-blocks-{component}    # New block addition
feat/plugin-patterns-{category}   # Pattern collection
feat/plugin-settings-{feature}    # Plugin configuration
feat/plugin-api-{feature}         # REST API integration
```

**Examples:**
```
feat/plugin-blocks-advanced-gallery
feat/plugin-patterns-testimonials
feat/plugin-settings-color-picker
feat/plugin-api-block-registration
```

### Plugin Configuration Branches

**Branch pattern:** `refactor/plugin-{config}`

Plugin configuration (settings, capabilities, registration) deserves its own branch.

**Examples:**
```
refactor/plugin-capabilities
refactor/plugin-admin-ui
refactor/plugin-registration
refactor/plugin-hooks
```

### Plugin Bug Fixes

**Branch pattern:** `fix/plugin-{issue}`

**Common issues:**
- Block not registered
- Admin script not loading
- Settings not saving
- Block conflicts with other plugins
- PHP fatal errors

**Examples:**
```
fix/plugin-block-registration
fix/plugin-settings-persistence
fix/plugin-js-conflict
```

### Plugin Security

**Branch pattern:** `security/plugin-{vulnerability}`

**Security concerns:**
- Nonce verification missing
- Capability checks
- Sanitization/escaping
- SQL injection (if using queries)
- XSS vulnerabilities

**Examples:**
```
security/plugin-nonce-verification
security/plugin-capability-checks
security/plugin-output-escaping
```

### Plugin Testing

**Branch pattern:** `test/plugin-{testtype}`

**Test types:**
- `unit` — PHPUnit tests for PHP functions
- `integration` — Block registration and integration
- `e2e` — Editor/frontend interaction (Playwright)
- `compatibility` — WordPress version compatibility
- `performance` — Block performance

**Examples:**
```
test/plugin-blocks-unit
test/plugin-blocks-e2e
test/plugin-wp-compat
test/plugin-performance
```

### Plugin Documentation

**Branch pattern:** `docs/plugin-{section}`

**Documentation areas:**
- Block usage guides
- API documentation
- Settings guide
- Developer guide
- Migration guides

**Examples:**
```
docs/plugin-block-usage-guide
docs/plugin-api-reference
docs/plugin-developer-guide
```

## Development Workflow: Creating a Block Plugin

### Step 1: Initialize Plugin Structure

```bash
mkdir block-plugin-name
cd block-plugin-name

# Initialize git
git init
git branch -M main

# Create basic structure
mkdir -p blocks/my-block/{editor,frontend}
mkdir -p patterns
mkdir -p src/{js,css}
mkdir -p tests
mkdir -p .github/workflows

# Create main plugin file
touch plugin.php
touch readme.txt
touch package.json
touch .wp-env.json
```

### Step 2: Create Plugin Header

**plugin.php:**
```php
<?php
/**
 * Plugin Name: Block Plugin Name
 * Plugin URI: https://example.com
 * Description: Collection of useful Gutenberg blocks
 * Version: 1.0.0
 * Author: Your Name
 * Author URI: https://example.com
 * License: GPL-2.0-or-later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: block-plugin-name
 * Domain Path: /languages
 *
 * @package BlockPluginName
 */

defined( 'ABSPATH' ) || exit;

// Define plugin constants
define( 'BLOCK_PLUGIN_NAME_VERSION', '1.0.0' );
define( 'BLOCK_PLUGIN_NAME_DIR', plugin_dir_path( __FILE__ ) );
define( 'BLOCK_PLUGIN_NAME_URL', plugin_dir_url( __FILE__ ) );

// Load plugin functionality
require_once BLOCK_PLUGIN_NAME_DIR . 'blocks/index.php';

/**
 * Initialize plugin on WordPress hook
 */
function block_plugin_name_init() {
  load_plugin_textdomain( 'block-plugin-name' );
  do_action( 'block_plugin_name_loaded' );
}
add_action( 'plugins_loaded', 'block_plugin_name_init' );
```

### Step 3: Create Plugin Package Configuration

**package.json:**
```json
{
  "name": "block-plugin-name",
  "version": "1.0.0",
  "description": "Collection of useful Gutenberg blocks",
  "main": "plugin.php",
  "scripts": {
    "build": "wp-scripts build",
    "dev": "wp-scripts start",
    "format": "wp-scripts format",
    "lint": "wp-scripts lint-js",
    "test:unit": "wp-scripts test-unit-js",
    "test:e2e": "wp-scripts test-e2e",
    "test": "npm run test:unit && npm run test:e2e"
  },
  "devDependencies": {
    "@wordpress/scripts": "^26.0.0",
    "@wordpress/blocks": "^12.0.0",
    "@wordpress/block-editor": "^12.0.0",
    "@wordpress/element": "^5.0.0",
    "@wordpress/i18n": "^4.0.0"
  },
  "engines": {
    "node": ">=16.0.0",
    "npm": ">=8.0.0"
  }
}
```

### Step 4: Register Blocks

**blocks/index.php:**
```php
<?php
/**
 * Block registration and initialization
 */

defined( 'ABSPATH' ) || exit;

/**
 * Register plugin blocks
 */
function block_plugin_name_register_blocks() {
  $blocks = array(
    'accordion',
    'carousel',
    'pricing-table',
  );

  foreach ( $blocks as $block ) {
    $block_json = BLOCK_PLUGIN_NAME_DIR . "blocks/{$block}/block.json";
    
    if ( file_exists( $block_json ) ) {
      register_block_type( $block_json );
    }
  }

  // Enqueue scripts and styles
  wp_enqueue_script(
    'block-plugin-name-editor',
    BLOCK_PLUGIN_NAME_URL . 'build/index.js',
    array( 'wp-blocks', 'wp-element', 'wp-editor', 'wp-i18n' ),
    BLOCK_PLUGIN_NAME_VERSION,
    true
  );

  wp_enqueue_style(
    'block-plugin-name-style',
    BLOCK_PLUGIN_NAME_URL . 'build/style-index.css',
    array(),
    BLOCK_PLUGIN_NAME_VERSION
  );
}
add_action( 'init', 'block_plugin_name_register_blocks' );
```

### Step 5: Create First Block

**blocks/accordion/block.json:**
```json
{
  "apiVersion": 3,
  "name": "block-plugin-name/accordion",
  "title": "Accordion",
  "category": "common",
  "description": "Collapsible accordion block",
  "icon": "menu",
  "supports": {
    "html": false,
    "color": {
      "text": true,
      "background": true
    },
    "spacing": {
      "padding": true,
      "margin": true
    }
  },
  "textdomain": "block-plugin-name",
  "attributes": {
    "items": {
      "type": "array",
      "default": [
        { "title": "Item 1", "content": "Content 1" }
      ]
    },
    "allowMultiple": {
      "type": "boolean",
      "default": false
    }
  },
  "editorScript": "file:./index.js",
  "editorStyle": "file:./editor.css",
  "style": "file:./style.css"
}
```

**blocks/accordion/index.js:**
```javascript
import { registerBlockType } from '@wordpress/blocks';
import { __ } = from '@wordpress/i18n';
import Edit from './edit';
import save from './save';
import metadata from './block.json';

registerBlockType(metadata.name, {
  ...metadata,
  edit: Edit,
  save,
});
```

**blocks/accordion/edit.js:**
```javascript
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';
import { plus } from '@wordpress/icons';

export default function Edit({ attributes, setAttributes }) {
  const { items, allowMultiple } = attributes;
  const blockProps = useBlockProps();

  return (
    <div {...blockProps}>
      {/* Accordion items */}
      {items.map((item, index) => (
        <div key={index} className="accordion-item">
          <input
            type="text"
            value={item.title}
            onChange={(e) => {
              const newItems = [...items];
              newItems[index].title = e.target.value;
              setAttributes({ items: newItems });
            }}
            placeholder="Accordion title"
          />
        </div>
      ))}
      
      <Button
        isPrimary
        icon={plus}
        onClick={() => {
          setAttributes({
            items: [...items, { title: '', content: '' }],
          });
        }}
      >
        Add Item
      </Button>
    </div>
  );
}
```

### Step 6: Create Plugin Tests

**tests/test-blocks.php:**
```php
<?php
/**
 * Block registration tests
 */

class Test_Block_Registration extends WP_UnitTestCase {
  /**
   * Test that accordion block is registered
   */
  public function test_accordion_block_registered() {
    $registry = WP_Block_Type_Registry::get_instance();
    $this->assertTrue( 
      $registry->is_registered( 'block-plugin-name/accordion' ) 
    );
  }

  /**
   * Test block has required attributes
   */
  public function test_accordion_attributes() {
    $registry = WP_Block_Type_Registry::get_instance();
    $block = $registry->get_registered( 'block-plugin-name/accordion' );
    
    $this->assertArrayHasKey( 'items', $block->attributes );
    $this->assertArrayHasKey( 'allowMultiple', $block->attributes );
  }
}
```

### Step 7: Create Branch and Commit

```bash
# Create feature branch
git checkout -b feat/plugin-accordion-block

# Stage all files
git add .

# Create initial commit
git commit -m "feat(plugin): add accordion block with settings

- Create accordion block with collapsible items
- Support multiple/single open mode
- Add block.json configuration
- Implement editor component with item management
- Add frontend save component
- Include frontend and editor styles
- Add PHPUnit tests for registration

Closes #123"

git push -u origin feat/plugin-accordion-block
```

## Plugin Testing Strategy

### Unit Tests (PHPUnit)

Test PHP functions and block registration:

```bash
npm run test:unit
```

**Coverage areas:**
- Block registration
- Validation functions
- Sanitization functions
- Plugin hooks

### E2E Tests (Playwright)

Test block interaction in editor:

```bash
npm run test:e2e
```

**Coverage areas:**
- Block insertion
- Block attribute changes
- Block save/publish
- Block frontend rendering

### Manual Testing

```bash
# Start local environment
npm run dev

# Open WordPress admin
open http://localhost:8888/wp-admin
```

**Checklist:**
- [ ] Block appears in inserter
- [ ] Block can be inserted
- [ ] All attributes work
- [ ] Block saves correctly
- [ ] Renders on frontend
- [ ] No console errors
- [ ] No PHP errors in logs

## Plugin Release Process

### Version Bump

Update version numbers in:
1. `plugin.php` — Plugin header
2. `package.json` — NPM version
3. `readme.txt` — Stable tag (match version)

```bash
# Example: bumping from 1.0.0 to 1.1.0
npm version minor
```

### Update Changelog

Add entry to `changelog.md` or `readme.txt`:

```markdown
## 1.1.0 - 2024-03-15

### Added
- New accordion block
- Block pattern examples
- Plugin settings panel

### Fixed
- Carousel responsive issue
- Block compatibility with classic editor
```

### Create Release

```bash
# Tag release
git tag v1.1.0

# Push tag
git push origin v1.1.0
```

### WordPress.org Deployment

If plugin is on WordPress.org:

```bash
# Commit changes to SVN repository
# trunk/ → main development
# tags/v1.1.0 → release tag
# branches/stable → stable branch
```

## Plugin Best Practices

### Security

- ✅ Always verify nonces
- ✅ Check user capabilities
- ✅ Sanitize all input
- ✅ Escape all output
- ✅ Use prepared statements
- ✅ Validate block attributes

### Performance

- ✅ Load scripts only where needed
- ✅ Lazy-load heavy blocks
- ✅ Use transients for expensive operations
- ✅ Minimize inline scripts
- ✅ Optimize images in patterns

### Compatibility

- ✅ Test with core blocks
- ✅ Check other popular plugins
- ✅ Support multiple WordPress versions
- ✅ Test on different themes
- ✅ Document requirements

### Accessibility

- ✅ WCAG 2.2 AAA compliant
- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ Color contrast
- ✅ Focus management

## Common Issues & Solutions

### Block Not Appearing

**Troubleshoot:**
- Check `block.json` exists and is valid JSON
- Verify block registered in `blocks/index.php`
- Check script enqueued correctly
- No PHP errors in debug log
- Clear browser cache

### Block Save Fails

**Troubleshoot:**
- Ensure `save()` returns valid block markup
- Check for React/JSX syntax errors
- Verify block attributes in JSON
- Check console for JavaScript errors

### Style Not Loading

**Troubleshoot:**
- Verify CSS file path in `block.json`
- Check file built (`npm run build`)
- Clear WordPress cache
- Check CSS file for syntax errors

### WordPress.org Rejection

**Common issues:**
- Missing readme.txt
- Minimum required WordPress version not met
- Code doesn't follow WordPress standards
- Security issues (no nonce verification)
- License not GPL-compatible

## Resources

- [WordPress Plugin Handbook](https://developer.wordpress.org/plugins/)
- [Block API Documentation](https://developer.wordpress.org/block-editor/reference-guides/block-api/)
- [WordPress PHP Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/wordpress-php-coding-standards/)
- [WordPress Plugin Security](https://developer.wordpress.org/plugins/security/)
- [WordPress Plugin Review Guidelines](https://developer.wordpress.org/plugins/wordpress-org/plugin-review-guidelines/)
