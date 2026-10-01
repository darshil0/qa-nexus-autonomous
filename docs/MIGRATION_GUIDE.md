# Migration Guide

**Version**: 3.3.0  
**Last Updated**: October 1, 2026

This guide covers upgrading QA Nexus Autonomous between versions, handling breaking changes, and migrating workflows.

---

## Version 3.3.0 (Current)

### Key Changes
- Node.js requirement: 20.0.0 or higher (previously 24+)
- Stable Node setup action: actions/setup-node@v4 (previously v7)
- CI/CD pipeline: Removed silent `--if-present` flags for stricter validation
- Fixed corrupted documentation entries in Git history

### Upgrading to 3.3.0

#### From 3.2.x

1. **Update Node.js locally**
   ```bash
   node --version  # Should be v20.x.x or higher
   ```

2. **Update dependencies**
   ```bash
   npm install
   npm update
   ```

3. **No breaking API changes**
   - All workflows from 3.2.x are compatible
   - Session data is automatically migrated
   - No database schema changes needed

4. **CI/CD updates**
   - Workflows now enforce stricter validation
   - Lint, typecheck, and test failures will block merges
   - Run `npm run ci` locally before PRs

#### From 3.1.x or Earlier

1. **Full reinstall**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Migrate environment**
   ```bash
   cp .env.example .env
   # Re-enter your Gemini API key
   ```

3. **Test locally**
   ```bash
   npm run dev
   npm run ci  # Full CI validation
   ```

---

## Breaking Changes by Version

### 3.3.0
- **Node.js >= 20.0.0 required** (from 24+)
  - Broader compatibility with CI environments
  - Better LTS support
  
- **CI strictness increased**
  - `--if-present` flags removed from npm scripts
  - Missing scripts will now fail CI
  - Aligns local `npm run ci` with GitHub Actions

### 3.2.0
- Changed Gemini model endpoint format
  - Update system prompts if using custom agents
  - See [AGENT.md](../AGENT.md) for details

### 3.1.0
- Supabase schema v2 (breaking persistence changes)
  - Run migrations if using persistence
  - Clear browser local storage if needed
  - Sessions before 3.1.0 not compatible

---

## Session Migration

### Automatic Migration (3.2.x → 3.3.0)
Sessions are stored in memory and browser local storage, both compatible with 3.3.0:
```bash
npm run dev
# Sessions load automatically on app startup
# No manual action needed
```

### Manual Migration (Older Versions)
If migrating from < 3.2.0:

1. Export current sessions from the app UI
   - Settings → Export Session

2. Upgrade the app
   ```bash
   git pull
   npm install
   npm run build
   ```

3. Import sessions
   - Settings → Import Session
   - Select exported JSON file

---

## Database Migration (Supabase)

### If Using Persistence Layer

1. **Backup current data**
   ```sql
   -- In Supabase SQL editor
   SELECT * FROM sessions;  -- Check data exists
   ```

2. **Check schema version**
   - Open your Supabase project
   - Go to SQL Editor
   - Run migrations for version 3.3.0 (if any)
   - Currently: no schema changes from 3.2.x

3. **Verify after upgrade**
   ```bash
   npm run dev
   # Open app, check Settings → Session History
   # Confirm sessions load correctly
   ```

---

## Dependency Upgrades

### Major Dependency Updates in 3.3.0
- React: 19.3.0 (from 19.3.0) — no change
- TypeScript: 6.0.3 (from 6.0.3) — no change
- Vite: 8.3.2 (from 8.3.2) — no change
- ESLint: 10.11.0 (from 10.11.0) — no change

### Minor/Patch Updates
```bash
npm update
npm audit fix  # Apply security patches
```

### Recommended Audit
```bash
npm audit
# Fix any vulnerabilities
npm install
git add package-lock.json
git commit -m "chore: update dependencies and audit fixes"
```

---

## Workflow Compatibility

### QA Workflows from 3.2.x
✅ **Fully compatible** with 3.3.0
- No changes to requirement input format
- Test case generation produces same output structure
- Execution results schema unchanged

### Custom Agent Skills
If you've created custom agents:

1. **Check skill definition** (`skills/*/SKILL.md`)
   - Verify system prompt references correct Gemini model
   - Update tool references if needed

2. **Validate output schema**
   - Ensure output JSON matches expected structure
   - Test skill with `npm run dev`

3. **Run tests**
   ```bash
   npm run ci
   npm run test -- --run
   ```

---

## Configuration Migration

### From Old `.env` Format
If upgrading from versions < 3.1.0:

**Old format:**
```bash
REACT_APP_GEMINI_KEY=sk-...
REACT_APP_SUPABASE_URL=https://...
```

**New format (3.3.0):**
```bash
VITE_GEMINI_API_KEY=sk-...
VITE_SUPABASE_URL=https://...
```

**Migration steps:**
```bash
# 1. Backup old .env
cp .env .env.backup

# 2. Create new .env
cp .env.example .env

# 3. Update with new key names
# VITE_GEMINI_API_KEY=<your-key-from-backup>
# VITE_SUPABASE_URL=<your-url-from-backup>

# 4. Verify
npm run dev
```

---

## Troubleshooting Upgrades

### Issue: "Module not found" errors after upgrade

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build  # Try full build
```

### Issue: Tests fail after upgrade

**Solution:**
```bash
npm run test:coverage  # Detailed output
# Check test file expectations
npm run ci             # Full CI validation
```

### Issue: "Node version mismatch" in CI

**Solution:**
- Ensure local Node version matches CI: `node --version`
- Update GitHub Actions workflow if self-hosted
- Check `.github/workflows/ci.yml` for node-version setting

### Issue: Gemini API errors after upgrade

**Solution:**
1. Verify API key in `.env`
2. Check Gemini API availability
3. Review agent system prompts in `agenticSkills.ts`
4. Check token limits in settings

---

## Rollback Procedure

If you need to rollback to a previous version:

```bash
# 1. Check git history
git log --oneline --graph -n 20

# 2. Identify commit to rollback to
git checkout <commit-sha>

# 3. Reinstall dependencies for that version
rm -rf node_modules package-lock.json
npm install

# 4. Test the version
npm run dev
npm run ci

# 5. If successful, force-push (if needed)
git push origin -f
```

**Or revert recent commits:**
```bash
git revert HEAD~n      # Revert last n commits
git push origin main
```

---

## Support & Questions

For migration issues:
1. Check [README.md](../README.md) for setup guidance
2. Review [CONTRIBUTING.md](../CONTRIBUTING.md) for dev workflow
3. Open an issue with:
   - Current version: `npm list qa-nexus-autonomous`
   - Node version: `node --version`
   - Error logs: full stack trace
   - Steps to reproduce

---

## Release Cycle

**QA Nexus Autonomous** follows semantic versioning (MAJOR.MINOR.PATCH):

- **Major (x.0.0)**: Breaking changes, schema migrations
- **Minor (x.y.0)**: New features, backward compatible
- **Patch (x.y.z)**: Bug fixes, security updates

Check [CHANGELOG.md](../CHANGELOG.md) for detailed release notes.
