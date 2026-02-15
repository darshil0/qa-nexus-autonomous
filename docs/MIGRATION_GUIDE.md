# QA Nexus Autonomous - Migration Guide

This guide details the steps required to migrate between significant versions of the QA Nexus Autonomous platform.

## Migrating from 2.0.0 to 2.0.1 (Legacy)

Version 2.0.1 standardized all configuration file naming conventions.

### Step 1: Rename Configuration Files

Ensure all configuration files use proper dots (`.`) instead of underscores (`_`) or hyphens:

| Original Name | Correct Name |
|---------------|--------------|
| `_env` | `.env` |
| `_eslintrc.cjs` | `.eslintrc.cjs` |
| `_gitignore` | `.gitignore` |
| `postcss_config.js` | `postcss.config.js` |
| `tailwind_config.js` | `tailwind.config.js` |
| `tsconfig_node.json` | `tsconfig.node.json` |
| `vite_config.ts` | `vite.config.ts` |
| `vitest_config.ts` | `vitest.config.ts` |

### Step 2: Verify Build Tools

After renaming, verify that the tooling correctly identifies the configurations:

```bash
# Verify linting
npm run lint

# Verify type checking
npm run typecheck

# Verify development server
npm run dev
```

## Migrating to 3.0.1

Version 3.0.1 (following 3.0.0) introduced a major architectural shift to Agentic Skills and the Model Context Protocol (MCP), along with critical bug fixes in metrics tracking and model consistency.

### New Directory Structure

The project now follows a strictly modular structure:
- `src/constants/index.ts` replaces `src/constants.ts`
- `src/types/index.ts` replaces `src/types.ts`
- `src/assets/styles/index.css` replaces `src/index.css`
- `src/main.tsx` is the primary entry point.

### Action Required

If you are upgrading from v2.x:
1. Ensure your imports use the `@/` alias (e.g., `import { ... } from '@/types'`).
2. Update your `.env` to include `VITE_GEMINI_API_KEY` if you were using a different variable name.
3. Run `npm install` to update to the latest dependencies including Vite 7 and Google GenAI v1.40.0.
