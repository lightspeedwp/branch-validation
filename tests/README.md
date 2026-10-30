# Tests Directory

BATS (Bash Automated Testing System) integration and shell script tests for branch-validation-wordpress skill.

## Test Files

### Branch Validation Tests
- **validate-branch-integration.bats** — Integration tests for branch validation
  - Valid branch creation and switching
  - Invalid branch rejection
  - Branch pattern compliance
  - All 15+ branch types verification

### Hook Configuration Tests
- **sync-canonical.bats** — Tests for canonical file synchronization
  - Script structure validation
  - Variable definition verification
  - File operation checks
  - Error handling validation

### Git Workflow Tests
- **git-workflow.bats** — End-to-end git workflow tests
  - Branch creation and naming
  - Commit message format
  - Push and pull operations
  - Merge and release workflows

## Running Tests

### Run All BATS Tests
```bash
npm run test:bats
```

### Run Specific Test File
```bash
bats tests/validate-branch-integration.bats
bats tests/sync-canonical.bats
```

### Verbose Output
```bash
npm run test:bats:verbose
```

### Watch Mode
```bash
bats tests/*.bats --watch
```

## Test Structure

BATS test format:

```bash
#!/usr/bin/env bats

setup() {
  # Setup before each test
  export TEST_BRANCH="feat/block-hero-parallax"
}

teardown() {
  # Cleanup after each test
  unset TEST_BRANCH
}

@test "validates correct branch format" {
  result=$(node scripts/validate-branch-name.js --branch "$TEST_BRANCH")
  [ $? -eq 0 ]
}

@test "rejects invalid branch format" {
  result=$(node scripts/validate-branch-name.js --branch "invalid_branch")
  [ $? -ne 0 ]
}
```

## Coverage

BATS tests cover:

### Branch Validation
- ✅ Valid branch patterns
- ✅ Invalid patterns (uppercase, underscores, wrong type)
- ✅ Protected branches (main, develop, staging)
- ✅ Exempted branches (dependabot, renovate)
- ✅ Forbidden prefixes (claude/, copilot/, openai/)
- ✅ All 15+ branch types
- ✅ Error messages
- ✅ Edge cases

### Git Workflows
- ✅ Branch creation and switching
- ✅ Multiple branch types
- ✅ Branch naming compliance
- ✅ Commit operations
- ✅ Merge workflows
- ✅ Release branches
- ✅ Hotfix branches

### Canonical Sync
- ✅ Script existence and executability
- ✅ Variable definitions
- ✅ File operations
- ✅ Error handling
- ✅ Documentation generation

## Test Execution Flow

1. **Setup** — Initialize test environment, create temp directories
2. **Test** — Execute test case and verify results
3. **Teardown** — Clean up temp files and environment

## Debugging Tests

### Run Single Test with Debug
```bash
bash -x tests/validate-branch-integration.bats
```

### View Test Output
```bash
bats tests/validate-branch-integration.bats --tap
```

### Check Individual Assertion
```bash
# Test branch validation directly
node scripts/validate-branch-name.js --branch "feat/block-hero-parallax"
echo $?  # Exit code: 0 = valid, 1 = invalid
```

## Adding New Tests

1. **Create test file** — `tests/new-feature.bats`
2. **Write test cases** — Follow BATS syntax
3. **Add setup/teardown** — Initialize environment
4. **Run tests** — Verify with `bats tests/new-feature.bats`
5. **Update npm scripts** — Add to package.json if needed
6. **Document** — Update this README

## CI/CD Integration

BATS tests run in GitHub Actions:

```yaml
- name: Run BATS tests
  run: npm run test:bats

- name: Report coverage
  run: npm run test:bats:verbose
```

## Test Coverage Goals

- ✅ 100% of branch validation logic
- ✅ All branch types tested
- ✅ All error cases covered
- ✅ Edge cases verified
- ✅ Integration workflows tested

## Troubleshooting

### BATS not found
```bash
npm install --save-dev bats
npx bats --version
```

### Test fails
```bash
# Run with debug output
bash -x tests/validate-branch-integration.bats

# Check git status in test
git status
git log --oneline | head
```

### Permission denied
```bash
chmod +x tests/*.bats
chmod +x scripts/*.sh
```

---

See also:
- [../scripts/](../scripts/) — Validation scripts
- [../package.json](../package.json) — npm test scripts
- [../lefthook.yml](../lefthook.yml) — Git hooks (which run tests)
- [BATS Documentation](https://bats-core.readthedocs.io/)
