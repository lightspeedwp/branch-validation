#!/usr/bin/env node

/**
 * Validate branch name against LightSpeed WP branching strategy
 *
 * Pattern: {type}/{scope}-{title}
 *
 * Usage:
 *   node validate-branch-name.js [--branch <name>]
 *   BRANCH=feat/user-auth node validate-branch-name.js
 */

const fs = require('fs');
const path = require('path');

/**
 * All 38 approved branch types
 */
const APPROVED_TYPES = [
  // Feature & Development (6)
  'feat', 'proto', 'perf', 'research', 'api', 'seo',
  // Bug Fixes & Reverts (3)
  'fix', 'hotfix', 'revert',
  // Release Management (1)
  'release',
  // Code Organization (3)
  'refactor', 'schema', 'migrate',
  // Maintenance & Tasks (3)
  'task', 'chore', 'config',
  // Documentation (4)
  'docs', 'doc', 'i18n', 'content',
  // Testing & Quality (3)
  'test', 'qa', 'uat',
  // CI/CD & Build (4)
  'ci', 'build', 'ops', 'telemetry',
  // Dependencies (1)
  'deps',
  // Security (1)
  'security',
  // Design & UX (4)
  'design', 'ds', 'ux', 'a11y',
  // Audit & Compliance (1)
  'audit',
  // AI & Automation (3)
  'codex', 'aiops', 'automation',
  // Epics (1)
  'epic',
];

/**
 * Protected branches that should not be validated
 */
const PROTECTED_BRANCHES = ['main', 'develop', 'master', 'staging', 'production'];

/**
 * Exempted branch prefixes (don't validate but allow)
 */
const EXEMPTED_PREFIXES = ['dependabot', 'renovate'];

/**
 * Forbidden branch prefixes (always reject)
 */
const FORBIDDEN_PREFIXES = ['claude', 'copilot', 'openai'];

/**
 * Validate a branch name
 *
 * @param {string} branch - Branch name to validate
 * @returns {object} { valid: boolean, error: string|null, warnings: string[] }
 */
function validateBranchName(branch) {
  const result = {
    valid: true,
    error: null,
    warnings: [],
  };

  if (!branch || typeof branch !== 'string') {
    result.valid = false;
    result.error = 'Branch name is required and must be a string';
    return result;
  }

  const trimmed = branch.trim();

  // Check for protected branches
  if (PROTECTED_BRANCHES.includes(trimmed)) {
    result.warnings.push(`Branch "${trimmed}" is protected and does not require validation`);
    return result;
  }

  // Check for exempted prefixes
  for (const prefix of EXEMPTED_PREFIXES) {
    if (trimmed.startsWith(`${prefix}/`)) {
      result.warnings.push(`Branch "${trimmed}" is exempted (${prefix} automation)`);
      return result;
    }
  }

  // Check for forbidden prefixes
  for (const prefix of FORBIDDEN_PREFIXES) {
    if (trimmed.startsWith(`${prefix}/`)) {
      result.valid = false;
      result.error = `Forbidden prefix "${prefix}/" detected. Reserved for AI-generated branches.`;
      return result;
    }
  }

  // Validate pattern: {type}/{scope}-{title}
  const pattern = new RegExp(`^(${APPROVED_TYPES.join('|')})/[a-z0-9]+-[a-z0-9-]+$`);

  if (!pattern.test(trimmed)) {
    result.valid = false;

    // Provide specific error message
    if (!trimmed.includes('/')) {
      result.error = 'Branch name must include a type and scope separated by slash (e.g., feat/user-auth)';
    } else {
      const [type, rest] = trimmed.split('/');

      if (!APPROVED_TYPES.includes(type)) {
        result.error = `Invalid type "${type}". Use one of: ${APPROVED_TYPES.slice(0, 5).join(', ')}, ...`;
      } else if (!rest || !rest.includes('-')) {
        result.error = 'Branch name must include scope and title separated by hyphen (e.g., user-auth-login)';
      } else if (!/^[a-z0-9]+-[a-z0-9-]+$/.test(rest)) {
        result.error = 'Scope and title must be lowercase with hyphens only (no underscores, spaces, or uppercase)';
      } else {
        result.error = 'Branch name does not match required pattern: {type}/{scope}-{title}';
      }
    }

    return result;
  }

  return result;
}

/**
 * Get branch name from arguments or environment
 *
 * @returns {string|null} Branch name or null
 */
function getBranchName() {
  // Check command line arguments
  const args = process.argv.slice(2);

  if (args.includes('--branch')) {
    const index = args.indexOf('--branch');
    if (index < args.length - 1) {
      return args[index + 1];
    }
  }

  // Check environment variable
  if (process.env.BRANCH) {
    return process.env.BRANCH;
  }

  // Try to get from git
  try {
    const { execSync } = require('child_process');
    return execSync('git rev-parse --abbrev-ref HEAD')
      .toString()
      .trim();
  } catch (e) {
    return null;
  }
}

/**
 * Main entry point
 */
function main() {
  const branch = getBranchName();

  if (!branch) {
    console.error('❌ Error: Could not determine branch name');
    console.error('Usage: node validate-branch-name.js [--branch <name>]');
    console.error('Or set BRANCH environment variable');
    process.exit(2);
  }

  const result = validateBranchName(branch);

  if (result.warnings.length > 0) {
    result.warnings.forEach(w => console.log(`⚠️  ${w}`));
  }

  if (result.valid) {
    console.log(`✅ Valid branch: ${branch}`);
    process.exit(0);
  } else {
    console.error(`❌ Invalid branch: ${branch}`);
    console.error(`Error: ${result.error}`);
    console.error('');
    console.error('Expected pattern: {type}/{scope}-{title}');
    console.error(`Valid types: ${APPROVED_TYPES.join(', ')}`);
    console.error('');
    console.error('Examples:');
    console.error('  ✅ feat/user-auth-login');
    console.error('  ✅ fix/cart-total-calculation');
    console.error('  ✅ security/csrf-token-validation');
    process.exit(1);
  }
}

// Export for testing
module.exports = { validateBranchName, getBranchName, APPROVED_TYPES };

// Run if called directly
if (require.main === module) {
  main();
}
