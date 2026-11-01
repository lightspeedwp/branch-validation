# Deprecating Button Block v1.x → v2.x: Complete Migration Strategy

## Executive Summary

This guide provides a structured approach to deprecating the old button block (v1.x) in favor of a new button block (v2.x) while maintaining backwards compatibility and providing users with a smooth migration path.

---

## 1. Versioning Strategy

### 1.1 Semantic Versioning Framework

```
Button Block v1.x  → v2.x migration phases:

v1.5.0 (Last v1 release)
  ↓
v2.0.0 (v2 launches, v1 deprecated)
  ↓
v2.1.0 - v2.5.0 (v1 coexists with v2)
  ↓
v3.0.0 (v1 support removed)
```

### 1.2 Version Bumping Strategy

- **v2.0.0**: Major version bump when releasing v2. This signals breaking changes but indicates v1 still works.
- **v2.x.y**: Minor/patch bumps while both versions coexist (typically 2-4 releases).
- **v3.0.0**: Major version when v1 support is fully removed (typically 6-12 months after v2.0.0).

### 1.3 Release Frequency

- **Deprecation announcement**: With v1.5.0 (before v2 launches)
- **v2.0.0 release**: 2-4 weeks after announcement
- **Support window**: v2.0.0 through v2.5.0 = 3-6 months minimum
- **v1 EOL**: Publicly announced 2 months before removal

---

## 2. Backwards Compatibility Approach

### 2.1 Core Principle: Keep Old Blocks Rendering

Old v1 button blocks in post content must continue to render without errors.

#### Implementation Strategy:

**2.1.1 Dual Block Registration**

Register both blocks in your plugin/theme:

```javascript
// Block v2 (new)
registerBlockType( 'namespace/button-v2', {
  apiVersion: 3,
  title: 'Button',
  category: 'common',
  icon: 'button',
  attributes: { /* v2 attributes */ },
  edit: ButtonEditV2,
  save: ButtonSaveV2,
} );

// Block v1 (legacy)
registerBlockType( 'namespace/button', {
  apiVersion: 3,
  title: 'Button (Deprecated)',
  category: 'common',
  icon: 'button',
  attributes: { /* v1 attributes */ },
  edit: ButtonEditV1,
  save: ButtonSaveV1,
  deprecated: [ /* v1 deprecation notices */ ],
} );
```

**2.1.2 PHP Render Fallback**

Ensure v1 blocks render on the frontend via render_callback or save.php:

```php
<?php
register_block_type( 'namespace/button', array(
    'render_callback' => 'namespace_render_button_v1',
) );

function namespace_render_button_v1( $attributes ) {
    // Render v1 button with v1 markup/styles
    $class = isset( $attributes['className'] ) ? $attributes['className'] : '';
    $url   = isset( $attributes['url'] ) ? $attributes['url'] : '#';
    $text  = isset( $attributes['text'] ) ? $attributes['text'] : 'Button';
    
    return sprintf(
        '<a href="%s" class="wp-block-button__link %s">%s</a>',
        esc_url( $url ),
        esc_attr( $class ),
        esc_html( $text )
    );
}
```

**2.1.3 CSS Backwards Compatibility**

Maintain v1 button styles in your stylesheet indefinitely:

```scss
// v1 button styles (keep permanently)
.wp-block-button-v1 {
    &__link {
        display: inline-block;
        padding: 12px 24px;
        background: #0073aa;
        color: #fff;
        text-decoration: none;
        border-radius: 4px;
        
        &:hover {
            background: #005a87;
        }
    }
}

// v2 button styles (new)
.wp-block-button-v2 {
    &__link {
        display: inline-flex;
        align-items: center;
        padding: 8px 16px;
        background: var(--wp--preset--color--primary);
        color: var(--wp--preset--color--on-primary);
        text-decoration: none;
        border-radius: var(--wp--preset--spacing--border-radius);
        
        &:hover {
            opacity: 0.8;
        }
    }
}
```

### 2.2 Handling Block Conversion

Allow users to convert v1 blocks to v2 blocks with data transformation.

**2.2.1 Block Transform (Client-Side)**

```javascript
const v2Block = {
    apiVersion: 3,
    title: 'Button',
    category: 'common',
    attributes: { /* v2 attributes */ },
    edit: ButtonEditV2,
    save: ButtonSaveV2,
    transforms: {
        from: [
            {
                type: 'block',
                blocks: [ 'namespace/button' ], // v1 block
                transform: ( attributes ) => {
                    // Map v1 attributes to v2 attributes
                    return createBlock( 'namespace/button-v2', {
                        text: attributes.text || '',
                        url: attributes.url || '',
                        backgroundColor: 'primary', // v2 preset
                        textColor: 'on-primary',
                        className: attributes.className || '',
                    } );
                },
            },
        ],
    },
};
```

**2.2.2 Migration Utility (Server-Side)**

Provide a function to migrate v1 block HTML in post content:

```php
<?php
function namespace_migrate_button_blocks_v1_to_v2( $post_id ) {
    $post = get_post( $post_id );
    
    if ( ! $post || $post->post_status === 'trash' ) {
        return false;
    }
    
    $blocks = parse_blocks( $post->post_content );
    $migrated = false;
    
    foreach ( $blocks as $block ) {
        if ( $block['blockName'] === 'namespace/button' ) {
            // Transform v1 to v2
            $block['blockName'] = 'namespace/button-v2';
            $block['attrs'] = array(
                'text' => $block['attrs']['text'] ?? '',
                'url' => $block['attrs']['url'] ?? '',
                'backgroundColor' => 'primary',
                'textColor' => 'on-primary',
            );
            $migrated = true;
        }
    }
    
    if ( $migrated ) {
        wp_update_post( array(
            'ID' => $post_id,
            'post_content' => serialize_blocks( $blocks ),
        ) );
    }
    
    return $migrated;
}
```

---

## 3. Migration Guide for Users

### 3.1 Communication Timeline

#### Phase 1: Announcement (Month 1-2)

**In v1.5.0 release notes:**

```markdown
## Deprecation Notice: Button Block v1.x

The Button block (v1.x) is being deprecated in favor of a new, more powerful Button block (v2.0).

**What's Changing?**
- The old Button block will receive no new features or updates
- v1 blocks will continue to work on existing posts/pages
- v2 offers improved styling options, animation support, and design token integration

**Timeline:**
- v1.5.0 (now): Deprecation announcement
- v2.0.0 (2 weeks): v2 launches, v1 still available
- v2.0.0 - v2.5.0 (3 months): Both versions coexist
- v3.0.0 (6 months): v1 removed, migration required

**Action Required?**
Not immediately. Your existing v1 blocks will continue to work. We recommend gradually migrating to v2 for new content.
```

#### Phase 2: v2 Launch (Month 2-3)

**In v2.0.0 release notes:**

```markdown
## Welcome to Button Block v2.0

A complete redesign of the Button block with:
- Design token integration (colors, spacing, typography)
- Hover and active state controls
- Icon support
- Animation and transition options
- Improved responsive behavior

### Upgrading Your Existing Buttons

**Automatic Migration Option:**
Run the migration tool from the Blocks menu:
1. Go to Dashboard → Block Migrations
2. Select "Button Block v1 → v2"
3. Click "Migrate All" or review individual blocks first
4. A backup of your content will be created automatically

**Manual Upgrade:**
1. Open a post/page with a v1 button
2. Click on the button block
3. Click the "Upgrade to v2" button in the toolbar
4. Configure new v2 options as desired

### What Happens to My Old Buttons?

Your v1 buttons will continue to work without any changes. They will:
- Render correctly on the frontend
- Display with v1 styling (unchanged)
- Not show v2 options in the editor

You can upgrade them at any time without data loss.
```

### 3.2 User-Facing Deprecation Notices

#### 3.2.1 In the Editor

```javascript
{
    blockName: 'namespace/button',
    attributes: { /* v1 attrs */ },
    deprecated: [
        {
            attributes: { /* v1 attribute schema */ },
            supports: { /* v1 supports */ },
            save: ButtonSaveV1,
            migrate: ( attributes ) => {
                // Auto-migrate attributes
                return {
                    text: attributes.text,
                    url: attributes.url,
                    backgroundColor: 'primary',
                    textColor: 'on-primary',
                };
            },
            isEligible: ( attributes, innerBlocks ) => {
                // Show upgrade notice for ALL v1 blocks
                return true;
            },
        },
    ],
}
```

Display a deprecation notice in the block toolbar:

```javascript
export function ButtonEditV1() {
    return (
        <>
            <BlockControls>
                <ToolbarGroup>
                    <Button
                        label="Upgrade to v2"
                        onClick={ upgradeToV2 }
                        isDestructive
                    >
                        Upgrade
                    </Button>
                </ToolbarGroup>
            </BlockControls>
            
            <Notice status="warning" isDismissible={ false }>
                <strong>Note:</strong> This Button block is deprecated. 
                <a href="#upgrade"> Upgrade to v2 for new features.</a>
            </Notice>
            
            {/* v1 block controls */ }
        </>
    );
}
```

#### 3.2.2 Admin Notice

Add a dismissible admin notice on the post/page editor:

```php
<?php
add_action( 'admin_notices', 'namespace_button_deprecation_notice' );

function namespace_button_deprecation_notice() {
    global $pagenow, $post;
    
    if ( $pagenow !== 'post.php' ) {
        return;
    }
    
    // Check if post contains v1 button blocks
    $blocks = parse_blocks( $post->post_content );
    $has_v1_button = false;
    
    foreach ( $blocks as $block ) {
        if ( $block['blockName'] === 'namespace/button' ) {
            $has_v1_button = true;
            break;
        }
    }
    
    if ( ! $has_v1_button || get_user_meta( get_current_user_id(), 'button_v1_notice_dismissed' ) ) {
        return;
    }
    
    ?>
    <div class="notice notice-warning is-dismissible">
        <p>
            <strong>Button Block v1 Detected:</strong>
            This post/page contains Button blocks that will be deprecated soon.
            <a href="<?php echo admin_url( 'admin.php?page=block-migrations' ); ?>">
                Migrate to v2 now
            </a> to get new features.
        </p>
    </div>
    <?php
}
```

### 3.3 Detailed Migration Guide (User Documentation)

Create a help doc at `/docs/migration/button-block-v1-to-v2.md`:

```markdown
# Migrating Button Blocks from v1 to v2

## Overview

The new Button block v2 offers:
- Design token integration (colors, spacing, typography)
- Hover state controls
- Icon support
- Animation options
- Better responsive behavior

Your v1 buttons will continue to work, but we recommend upgrading to v2 for new content.

## Option 1: Automatic Migration (Recommended)

1. Go to **Dashboard → Block Migrations**
2. Click **"Upgrade Button Blocks"**
3. Review the list of posts/pages affected
4. Click **"Migrate All"** to upgrade all at once
   - A backup will be created automatically
5. Test your site to ensure buttons render correctly

### Batch Migration for Large Sites

For sites with 100+ button blocks:

```bash
wp cli button-migrate --all --backup
```

## Option 2: Manual Upgrade (Per Post)

1. Open the post/page in the editor
2. Click on any v1 button (it will show a deprecation notice)
3. Click **"Upgrade to Button v2"** in the block toolbar
4. Configure v2 options:
   - **Color**: Choose from design tokens (Primary, Secondary, etc.)
   - **Size**: Small, Medium, Large
   - **Hover Effect**: Fade, Scale, Lift, None
   - **Icon**: Add optional icon
5. Click **Save**

## Option 3: Manual Markup Edit

If you need to manually edit the HTML:

### v1 Button Block
```html
<!-- wp:namespace/button {"text":"Click Me","url":"https://example.com"} -->
<a href="https://example.com" class="wp-block-button__link">Click Me</a>
<!-- /wp:namespace/button -->
```

### v2 Button Block
```html
<!-- wp:namespace/button-v2 {"text":"Click Me","url":"https://example.com","backgroundColor":"primary","textColor":"on-primary"} -->
<a href="https://example.com" class="wp-block-button-v2__link has-background has-primary-background-color has-on-primary-text-color">Click Me</a>
<!-- /wp:namespace/button-v2 -->
```

## Compatibility Notes

### Styling

- **v1 buttons** maintain their original styling
- **v2 buttons** use design tokens and will look different
- Both can coexist on the same page
- CSS is applied separately, no conflicts

### Performance

- **v1 blocks**: No impact, rendering unchanged
- **v2 blocks**: Slightly larger block editor bundle (+2-5KB gzipped)
- **Frontend**: No difference in performance

### SEO

- Both v1 and v2 buttons render semantic HTML `<a>` tags
- No SEO impact from migration
- Alt text and link text are preserved

## Troubleshooting

### Migration Fails or Doesn't Complete

1. Check available disk space
2. Ensure no plugins are conflicting
3. Try migrating one post at a time
4. Contact support if still failing

### Buttons Don't Look Right After Upgrade

1. Clear browser cache (Ctrl+Shift+Delete)
2. Regenerate CSS if using a page builder
3. Check that design tokens are configured in theme
4. Review custom CSS that might override v2 styles

### Can I Rollback?

Yes. Restore from the backup created during migration:

1. Go to Dashboard → Backups
2. Find the backup dated when you migrated
3. Click Restore
4. All v2 buttons will revert to v1

## Support

Questions? Contact us:
- Email: support@example.com
- Documentation: https://docs.example.com/button-block-v2
- Community: https://community.example.com
```

---

## 4. Technical Implementation Details

### 4.1 Plugin Structure

```
plugin-name/
├── src/
│   ├── blocks/
│   │   ├── button-v1/
│   │   │   ├── index.js
│   │   │   ├── edit.js
│   │   │   ├── save.js
│   │   │   ├── style.scss
│   │   │   └── block.json
│   │   ├── button-v2/
│   │   │   ├── index.js
│   │   │   ├── edit.js
│   │   │   ├── save.js
│   │   │   ├── style.scss
│   │   │   └── block.json
│   └── utils/
│       └── migration.js
├── inc/
│   ├── migrations/
│   │   ├── class-button-block-migration.php
│   │   └── class-button-deprecation-notice.php
│   └── blocks/
│       └── button.php
├── docs/
│   ├── migration/
│   │   └── button-block-v1-to-v2.md
│   └── developer/
│       └── block-versioning.md
└── plugin.php
```

### 4.2 Block Registration

**button-v1/block.json:**
```json
{
    "$schema": "https://schemas.wp.org/wp/6.3/block.json",
    "apiVersion": 3,
    "name": "namespace/button",
    "title": "Button (v1 - Deprecated)",
    "category": "common",
    "icon": "button",
    "description": "Display a button. This version is deprecated; use Button v2.",
    "deprecated": true,
    "attributes": {
        "text": { "type": "string", "default": "Button" },
        "url": { "type": "string", "default": "" },
        "className": { "type": "string" }
    },
    "supports": {
        "html": false,
        "color": false,
        "spacing": { "margin": true, "padding": false }
    },
    "textdomain": "namespace"
}
```

**button-v2/block.json:**
```json
{
    "$schema": "https://schemas.wp.org/wp/6.3/block.json",
    "apiVersion": 3,
    "name": "namespace/button-v2",
    "title": "Button",
    "category": "common",
    "icon": "button",
    "description": "Display a customizable button with design tokens.",
    "attributes": {
        "text": { "type": "string", "default": "Button" },
        "url": { "type": "string", "default": "" },
        "backgroundColor": { "type": "string", "default": "primary" },
        "textColor": { "type": "string", "default": "on-primary" },
        "size": { "type": "string", "enum": ["small", "medium", "large"], "default": "medium" },
        "hoverEffect": { "type": "string", "enum": ["fade", "scale", "lift", "none"], "default": "fade" },
        "icon": { "type": "string", "default": "" },
        "className": { "type": "string" }
    },
    "supports": {
        "color": true,
        "spacing": { "margin": true, "padding": true },
        "typography": true
    },
    "textdomain": "namespace"
}
```

### 4.3 Migration CLI Command

Add WP-CLI support for bulk migration:

```php
<?php
// inc/migrations/class-button-cli-command.php

class Button_Migration_CLI extends WP_CLI_Command {
    /**
     * Migrate all v1 button blocks to v2.
     *
     * @param array $args Positional arguments.
     * @param array $assoc_args Associative arguments.
     */
    public function all( $args, $assoc_args ) {
        $backup = $assoc_args['backup'] ?? true;
        $dry_run = $assoc_args['dry-run'] ?? false;
        
        // Create backup
        if ( $backup && ! $dry_run ) {
            WP_CLI::log( 'Creating database backup...' );
            // Backup logic
        }
        
        // Get all posts with v1 buttons
        $posts = get_posts( array(
            'post_type' => array( 'post', 'page' ),
            's' => 'wp:namespace/button',
            'numberposts' => -1,
        ) );
        
        WP_CLI::log( "Found " . count( $posts ) . " posts with v1 buttons." );
        
        $progress = \WP_CLI\Utils\make_progress_bar( 'Migrating blocks', count( $posts ) );
        
        foreach ( $posts as $post ) {
            if ( ! $dry_run ) {
                namespace_migrate_button_blocks_v1_to_v2( $post->ID );
            }
            $progress->tick();
        }
        
        $progress->finish();
        WP_CLI::success( "Migration complete!" );
    }
}

WP_CLI::add_command( 'button-migrate', 'Button_Migration_CLI' );
```

---

## 5. Testing Strategy

### 5.1 Backwards Compatibility Tests

**Test v1 blocks render on frontend:**
```javascript
describe( 'Button v1 Block', () => {
    it( 'should render v1 block correctly', () => {
        const { container } = render(
            <ButtonSaveV1 attributes={ { text: 'Click', url: '#' } } />
        );
        expect( container.querySelector( '.wp-block-button__link' ) ).toBeInTheDocument();
    } );
    
    it( 'should maintain v1 CSS classes', () => {
        const { container } = render(
            <ButtonSaveV1 attributes={ { 
                text: 'Click',
                url: '#',
                className: 'custom-class'
            } } />
        );
        expect( container.querySelector( '.custom-class' ) ).toBeInTheDocument();
    } );
} );
```

### 5.2 Migration Tests

**Test block transformation:**
```php
<?php
class Button_Migration_Test extends WP_UnitTestCase {
    public function test_v1_to_v2_migration() {
        $post_id = self::factory()->post->create( array(
            'post_content' => '<!-- wp:namespace/button {"text":"Click","url":"#"} -->...',
        ) );
        
        namespace_migrate_button_blocks_v1_to_v2( $post_id );
        
        $post = get_post( $post_id );
        $this->assertStringContainsString( 'namespace/button-v2', $post->post_content );
    }
}
```

### 5.3 User Acceptance Tests

- [ ] v1 blocks render without errors
- [ ] v1 blocks display with original styling
- [ ] v2 blocks display with new styling
- [ ] Automatic migration completes successfully
- [ ] Manual upgrade in editor works
- [ ] Deprecation notices appear to users
- [ ] Rollback from backup restores v1 blocks
- [ ] Both block types can coexist on same page

---

## 6. Communication Templates

### 6.1 Blog Post Template

```markdown
# Button Block v2 is Here: What You Need to Know

We're excited to announce Button Block v2, a completely redesigned button system with design tokens, animations, and better customization.

**What's changing?**
- New Button block v2 with modern features
- Button block v1 is deprecated but continues to work

**Do I need to do anything?**
No, not immediately. Your existing buttons will continue to work. We recommend upgrading to v2 when you update your posts and pages.

**How do I upgrade?**
[Link to migration guide]

**Timeline:**
- Today: v2.0.0 launches
- [Date]: Automatic migration available
- [Date]: v1 support ends

Questions? Check our [FAQ](link) or [contact support](link).
```

### 6.2 Email to Users

Subject: **Your Button Blocks Are Being Updated (No Action Required)**

```
Hi [User],

We're launching a new Button block with exciting new features. The good news: your existing buttons will keep working exactly as they do now.

Old buttons won't change unless you choose to upgrade them.

When you're ready to upgrade:
1. A migration tool will be available in your dashboard
2. We'll walk you through the new features
3. You can update one button or all at once

Learn more: [migration guide link]

Thanks,
The Team
```

---

## 7. Success Metrics

Track these metrics during the deprecation period:

| Metric | Target | Notes |
|--------|--------|-------|
| v1 block usage | <10% after 3 months | Indicates adoption of v2 |
| Migration rate | >70% within 6 months | Success threshold |
| Support tickets | <5/week | Indicates smooth transition |
| Error rate | 0% on v1 blocks | Backwards compatibility |
| Editor warning dismissal | >50% within 1 month | User awareness |

---

## 8. Rollback Plan

If critical issues arise:

1. **Week 1**: Pause v2 promotion, investigate issue
2. **Week 1-2**: Provide hotfix or determine if issue is in v1 or v2
3. **Week 2**: If v2 issue cannot be fixed:
   - Mark v2 as experimental
   - Promote users to keep using v1
   - Provide rollback instructions
4. **Week 3+**: Address v2 issues in maintenance releases

Rollback is straightforward because v1 blocks are always available.

---

## Conclusion

A successful block deprecation requires:

✅ **Clear communication** about timelines and actions  
✅ **Backwards compatibility** that keeps old content working  
✅ **Easy migration tools** for users to upgrade when ready  
✅ **Comprehensive documentation** at every step  
✅ **Support during transition** to assist users  
✅ **Gradual timeline** with realistic phases  

This strategy balances user needs with modernization goals, ensuring a smooth transition from v1 to v2 without disrupting existing content.
