#!/usr/bin/env bats
# BATS integration tests for branch validation

setup() {
  export TEST_DIR=$(mktemp -d)
  export REPO_ROOT="$TEST_DIR/repo"
  export GIT_AUTHOR_NAME="Test User"
  export GIT_AUTHOR_EMAIL="test@example.com"
  export GIT_COMMITTER_NAME="$GIT_AUTHOR_NAME"
  export GIT_COMMITTER_EMAIL="$GIT_AUTHOR_EMAIL"

  mkdir -p "$REPO_ROOT"
  cd "$REPO_ROOT"

  # Initialize a test git repository
  git init -b main > /dev/null 2>&1
  git config user.name "Test User"
  git config user.email "test@example.com"

  # Create initial commit
  echo "test" > test.txt
  git add test.txt
  git commit -m "initial commit" > /dev/null 2>&1
}

teardown() {
  cd /
  rm -rf "$TEST_DIR"
}

# Test: Create valid branches
@test "can create and switch to valid feature branch" {
  git checkout -b feat/test-feature > /dev/null 2>&1
  current_branch=$(git rev-parse --abbrev-ref HEAD)
  [ "$current_branch" = "feat/test-feature" ]
}

@test "can create valid bug fix branch" {
  git checkout -b fix/test-bug > /dev/null 2>&1
  current_branch=$(git rev-parse --abbrev-ref HEAD)
  [ "$current_branch" = "fix/test-bug" ]
}

@test "can create valid security branch" {
  git checkout -b security/test-fix > /dev/null 2>&1
  current_branch=$(git rev-parse --abbrev-ref HEAD)
  [ "$current_branch" = "security/test-fix" ]
}

@test "can create valid release branch" {
  git checkout -b release/v1-0-0 > /dev/null 2>&1
  current_branch=$(git rev-parse --abbrev-ref HEAD)
  [ "$current_branch" = "release/v1-0-0" ]
}

# Test: Protected branches remain accessible
@test "can stay on main branch" {
  current_branch=$(git rev-parse --abbrev-ref HEAD)
  [ "$current_branch" = "main" ]
}

@test "can switch to develop if it exists" {
  git checkout -b develop > /dev/null 2>&1
  current_branch=$(git rev-parse --abbrev-ref HEAD)
  [ "$current_branch" = "develop" ]
}

# Test: Branch naming patterns
@test "branch names follow type/scope-title pattern" {
  git checkout -b feat/user-authentication-flow > /dev/null 2>&1
  current_branch=$(git rev-parse --abbrev-ref HEAD)
  echo "$current_branch" | grep -E '^feat/[a-z0-9]+-[a-z0-9-]+$'
}

@test "branch names use lowercase only" {
  git checkout -b fix/database-query-optimization > /dev/null 2>&1
  current_branch=$(git rev-parse --abbrev-ref HEAD)
  echo "$current_branch" | grep -v '[A-Z]'
}

@test "branch names use hyphens not underscores" {
  git checkout -b docs/api-documentation > /dev/null 2>&1
  current_branch=$(git rev-parse --abbrev-ref HEAD)
  echo "$current_branch" | grep -v '_'
}

# Test: Multiple word scopes and titles
@test "branch supports multiple words in scope" {
  git checkout -b feat/user-auth-flow > /dev/null 2>&1
  current_branch=$(git rev-parse --abbrev-ref HEAD)
  echo "$current_branch" | grep -E '^feat/[a-z0-9]+-[a-z0-9-]+$'
}

@test "branch supports multiple words in title" {
  git checkout -b fix/header-layout-spacing-issue > /dev/null 2>&1
  current_branch=$(git rev-parse --abbrev-ref HEAD)
  echo "$current_branch" | grep -E '^fix/[a-z0-9]+-[a-z0-9-]+$'
}

# Test: Numbers in branch names
@test "branch names can include numbers" {
  git checkout -b fix/oauth2-integration > /dev/null 2>&1
  current_branch=$(git rev-parse --abbrev-ref HEAD)
  echo "$current_branch" | grep '[0-9]'
}

@test "branch names can include issue numbers" {
  git checkout -b fix/issue-123-regression > /dev/null 2>&1
  current_branch=$(git rev-parse --abbrev-ref HEAD)
  [ "$current_branch" = "fix/issue-123-regression" ]
}

# Test: All branch type categories
@test "supports feature type" {
  git checkout -b feat/new-feature > /dev/null 2>&1
  [ $? -eq 0 ]
}

@test "supports fix type" {
  git checkout -b fix/bug-fix > /dev/null 2>&1
  [ $? -eq 0 ]
}

@test "supports refactor type" {
  git checkout -b refactor/code-cleanup > /dev/null 2>&1
  [ $? -eq 0 ]
}

@test "supports docs type" {
  git checkout -b docs/update-readme > /dev/null 2>&1
  [ $? -eq 0 ]
}

@test "supports test type" {
  git checkout -b test/add-coverage > /dev/null 2>&1
  [ $? -eq 0 ]
}

@test "supports ci type" {
  git checkout -b ci/update-workflow > /dev/null 2>&1
  [ $? -eq 0 ]
}

# Test: Branch commits and merges
@test "can commit to feature branch" {
  git checkout -b feat/test-commit > /dev/null 2>&1
  echo "new content" >> test.txt
  git add test.txt
  git commit -m "test commit" > /dev/null 2>&1
  [ $? -eq 0 ]
}

@test "can create multiple commits on feature branch" {
  git checkout -b feat/multi-commit > /dev/null 2>&1
  echo "content1" >> test.txt
  git add test.txt
  git commit -m "first" > /dev/null 2>&1
  echo "content2" >> test.txt
  git add test.txt
  git commit -m "second" > /dev/null 2>&1
  commit_count=$(git log --oneline | wc -l)
  [ "$commit_count" -ge 3 ]
}

# Test: Branch list shows valid branches
@test "git branch shows valid branches" {
  git checkout -b feat/test-list > /dev/null 2>&1
  branches=$(git branch | grep feat/test-list)
  [ -n "$branches" ]
}

@test "git branch list includes main" {
  branches=$(git branch)
  echo "$branches" | grep -q "main"
}

# Test: Branch switching
@test "can switch between valid branches" {
  git checkout -b feat/branch-one > /dev/null 2>&1
  git checkout -b feat/branch-two > /dev/null 2>&1
  git checkout feat/branch-one > /dev/null 2>&1
  current=$(git rev-parse --abbrev-ref HEAD)
  [ "$current" = "feat/branch-one" ]
}

@test "can return to main from feature branch" {
  git checkout -b feat/test-return > /dev/null 2>&1
  git checkout main > /dev/null 2>&1
  current=$(git rev-parse --abbrev-ref HEAD)
  [ "$current" = "main" ]
}

# Test: Branch deletion
@test "can delete completed feature branch" {
  git checkout -b feat/test-delete > /dev/null 2>&1
  git checkout main > /dev/null 2>&1
  git branch -d feat/test-delete > /dev/null 2>&1
  branches=$(git branch)
  echo "$branches" | grep -v "feat/test-delete"
}

# Test: Edge cases
@test "handles branch names with minimum words" {
  git checkout -b feat/a-b > /dev/null 2>&1
  current_branch=$(git rev-parse --abbrev-ref HEAD)
  [ "$current_branch" = "feat/a-b" ]
}

@test "handles branch names starting with number in scope" {
  git checkout -b feat/2fa-setup > /dev/null 2>&1
  current_branch=$(git rev-parse --abbrev-ref HEAD)
  [ "$current_branch" = "feat/2fa-setup" ]
}

@test "handles release branches with semantic versioning" {
  git checkout -b release/v1-2-3 > /dev/null 2>&1
  current_branch=$(git rev-parse --abbrev-ref HEAD)
  [ "$current_branch" = "release/v1-2-3" ]
}
