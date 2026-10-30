#!/bin/bash
# Sync canonical files from lightspeedwp/.github repository
#
# This script updates the reference copies of canonical files used by the skill.
# Run this periodically to ensure the skill stays in sync with org-wide policies.

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
REFS_DIR="$REPO_ROOT/references"

GITHUB_BRANCH="develop"
GITHUB_RAW="https://raw.githubusercontent.com/lightspeedwp/.github/$GITHUB_BRANCH"

echo "🔄 Syncing canonical files from lightspeedwp/.github ($GITHUB_BRANCH)..."

# Files to sync
declare -a FILES=(
    ".github/branch-types.yml"
    ".github/branch-labels.yml"
)

# Fetch each file
for file in "${FILES[@]}"; do
    filename=$(basename "$file")
    url="$GITHUB_RAW/$file"
    output="$REFS_DIR/$filename"

    echo "  📥 Syncing $filename..."
    if curl -s -f "$url" -o "$output"; then
        echo "     ✅ $filename synced"
    else
        echo "     ❌ Failed to sync $filename from $url"
        exit 1
    fi
done

# Create/update CANONICAL_FILES.md
cat > "$REFS_DIR/CANONICAL_FILES.md" << 'EOF'
# Canonical Files Reference

Last synced: $(date -u +'%Y-%m-%dT%H:%M:%SZ')

These files are reference copies of canonical configuration from [lightspeedwp/.github](https://github.com/lightspeedwp/.github/tree/develop/.github).

**Do not edit these files directly.** Instead:

1. Update the files in [lightspeedwp/.github](https://github.com/lightspeedwp/.github)
2. Run `./scripts/sync-canonical.sh` to pull the latest versions
3. Commit the updated reference files

## Files in This Directory

- **branch-types.yml** — All 38 branch types and their routing (PR templates, labels)
- **branch-labels.yml** — Type-to-label mapping and area keywords

## Sync Instructions

```bash
cd branch-validation
./scripts/sync-canonical.sh
git add references/
git commit -m "chore: sync canonical files from .github"
git push
```

## Reference Links

- [Canonical branch-types.yml](https://github.com/lightspeedwp/.github/blob/develop/.github/branch-types.yml)
- [Canonical branch-labels.yml](https://github.com/lightspeedwp/.github/blob/develop/.github/branch-labels.yml)
- [Branching Strategy](https://github.com/lightspeedwp/.github/blob/develop/docs/BRANCHING_STRATEGY.md)
EOF

echo ""
echo "✅ Canonical files synced successfully!"
echo ""
echo "📋 Next steps:"
echo "  1. Review changes: git diff references/"
echo "  2. Commit: git add references/ && git commit -m 'chore: sync canonical files from .github'"
echo "  3. Push: git push"
echo ""
echo "If this is the first sync or there were significant changes, you may also need to:"
echo "  - Update SKILL.md if type definitions changed"
echo "  - Review and commit other changes"
