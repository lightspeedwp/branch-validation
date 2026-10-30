const { validateBranchName, getBranchName, APPROVED_TYPES } = require('../validate-branch-name');

describe('validateBranchName', () => {
  describe('Valid branches', () => {
    it('should accept valid feature branch', () => {
      const result = validateBranchName('feat/user-auth-login');
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
      expect(result.warnings).toHaveLength(0);
    });

    it('should accept valid bug fix branch', () => {
      const result = validateBranchName('fix/cart-total-calculation');
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should accept valid security branch', () => {
      const result = validateBranchName('security/csrf-token-validation');
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should accept valid hotfix branch', () => {
      const result = validateBranchName('hotfix/payment-processing');
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should accept valid release branch with semver', () => {
      const result = validateBranchName('release/v1-2-0');
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should accept valid docs branch', () => {
      const result = validateBranchName('docs/api-authentication');
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should accept valid refactor branch', () => {
      const result = validateBranchName('refactor/database-connection');
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should accept valid task branch', () => {
      const result = validateBranchName('task/update-dependencies');
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should accept valid design branch', () => {
      const result = validateBranchName('design/user-profile-page');
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should accept all 38 approved types', () => {
      APPROVED_TYPES.forEach(type => {
        const result = validateBranchName(`${type}/test-feature`);
        expect(result.valid).toBe(true);
        expect(result.error).toBeNull();
      });
    });

    it('should accept branches with numbers in scope', () => {
      const result = validateBranchName('feat/oauth2-integration');
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should accept branches with multiple words', () => {
      const result = validateBranchName('feat/user-auth-login-flow');
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should accept branches with numbers in title', () => {
      const result = validateBranchName('fix/issue-123-fix');
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });
  });

  describe('Protected branches', () => {
    it('should allow main branch without validation', () => {
      const result = validateBranchName('main');
      expect(result.valid).toBe(true);
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings[0]).toContain('protected');
    });

    it('should allow develop branch without validation', () => {
      const result = validateBranchName('develop');
      expect(result.valid).toBe(true);
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings[0]).toContain('protected');
    });

    it('should allow master branch without validation', () => {
      const result = validateBranchName('master');
      expect(result.valid).toBe(true);
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings[0]).toContain('protected');
    });

    it('should allow staging branch without validation', () => {
      const result = validateBranchName('staging');
      expect(result.valid).toBe(true);
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings[0]).toContain('protected');
    });

    it('should allow production branch without validation', () => {
      const result = validateBranchName('production');
      expect(result.valid).toBe(true);
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings[0]).toContain('protected');
    });
  });

  describe('Exempted branches', () => {
    it('should allow dependabot branches without validation', () => {
      const result = validateBranchName('dependabot/npm-lodash-upgrade');
      expect(result.valid).toBe(true);
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings[0]).toContain('dependabot');
    });

    it('should allow renovate branches without validation', () => {
      const result = validateBranchName('renovate/node-18-upgrade');
      expect(result.valid).toBe(true);
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings[0]).toContain('renovate');
    });
  });

  describe('Forbidden prefixes', () => {
    it('should reject claude/ prefix', () => {
      const result = validateBranchName('claude/test-feature');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('claude');
      expect(result.error).toContain('Forbidden');
    });

    it('should reject copilot/ prefix', () => {
      const result = validateBranchName('copilot/test-feature');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('copilot');
      expect(result.error).toContain('Forbidden');
    });

    it('should reject openai/ prefix', () => {
      const result = validateBranchName('openai/test-feature');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('openai');
      expect(result.error).toContain('Forbidden');
    });
  });

  describe('Invalid branches', () => {
    it('should reject uppercase in type', () => {
      const result = validateBranchName('Feat/user-auth');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Invalid type');
    });

    it('should reject uppercase in scope', () => {
      const result = validateBranchName('feat/User-Auth');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('lowercase');
    });

    it('should reject underscores instead of hyphens', () => {
      const result = validateBranchName('feat/user_auth_login');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('separated by hyphen');
    });

    it('should reject spaces in branch name', () => {
      const result = validateBranchName('feat/user auth');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('separated by hyphen');
    });

    it('should reject missing scope-title separator', () => {
      const result = validateBranchName('feat/login');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('separated by hyphen');
    });

    it('should reject missing type', () => {
      const result = validateBranchName('user-auth-login');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('type and scope');
    });

    it('should reject invalid type', () => {
      const result = validateBranchName('feature/user-auth');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Invalid type');
    });

    it('should reject empty scope', () => {
      const result = validateBranchName('feat/-login');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('lowercase with hyphens');
    });

    it('should reject special characters', () => {
      const result = validateBranchName('feat/user@auth');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('separated by hyphen');
    });

    it('should reject dots in branch name', () => {
      const result = validateBranchName('feat/user.auth.login');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('separated by hyphen');
    });
  });

  describe('Edge cases', () => {
    it('should handle null input', () => {
      const result = validateBranchName(null);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('required');
    });

    it('should handle undefined input', () => {
      const result = validateBranchName(undefined);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('required');
    });

    it('should handle non-string input', () => {
      const result = validateBranchName(123);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('string');
    });

    it('should trim whitespace', () => {
      const result = validateBranchName('  feat/user-auth-login  ');
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should handle empty string', () => {
      const result = validateBranchName('');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('required');
    });

    it('should handle only whitespace', () => {
      const result = validateBranchName('   ');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('type and scope');
    });
  });

  describe('Type coverage', () => {
    const typesByCategory = {
      'Feature & Development': ['feat', 'proto', 'perf', 'research', 'api', 'seo'],
      'Bug Fixes & Reverts': ['fix', 'hotfix', 'revert'],
      'Release Management': ['release'],
      'Code Organization': ['refactor', 'schema', 'migrate'],
      'Maintenance & Tasks': ['task', 'chore', 'config'],
      'Documentation': ['docs', 'doc', 'i18n', 'content'],
      'Testing & Quality': ['test', 'qa', 'uat'],
      'CI/CD & Build': ['ci', 'build', 'ops', 'telemetry'],
      'Dependencies': ['deps'],
      'Security': ['security'],
      'Design & UX': ['design', 'ds', 'ux', 'a11y'],
      'Audit & Compliance': ['audit'],
      'AI & Automation': ['codex', 'aiops', 'automation'],
      'Epics': ['epic'],
    };

    Object.entries(typesByCategory).forEach(([category, types]) => {
      it(`should accept all ${category} types`, () => {
        types.forEach(type => {
          const result = validateBranchName(`${type}/test-branch`);
          expect(result.valid).toBe(true);
        });
      });
    });
  });
});

describe('getBranchName', () => {
  const originalArgv = process.argv;
  const originalEnv = process.env.BRANCH;

  afterEach(() => {
    process.argv = originalArgv;
    process.env.BRANCH = originalEnv;
  });

  it('should get branch from BRANCH env var', () => {
    process.argv = ['node', 'script.js'];
    process.env.BRANCH = 'feat/test-branch';

    const result = getBranchName();
    expect(result).toBe('feat/test-branch');
  });

  it('should get branch from --branch argument', () => {
    process.argv = ['node', 'script.js', '--branch', 'fix/test-fix'];
    delete process.env.BRANCH;

    const result = getBranchName();
    expect(result).toBe('fix/test-fix');
  });
});

describe('APPROVED_TYPES', () => {
  it('should have exactly 38 types', () => {
    expect(APPROVED_TYPES).toHaveLength(38);
  });

  it('should have all types as lowercase strings', () => {
    APPROVED_TYPES.forEach(type => {
      expect(typeof type).toBe('string');
      expect(type).toBe(type.toLowerCase());
    });
  });

  it('should have no duplicates', () => {
    const unique = new Set(APPROVED_TYPES);
    expect(unique.size).toBe(APPROVED_TYPES.length);
  });
});
