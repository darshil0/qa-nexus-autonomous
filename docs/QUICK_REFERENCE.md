# ⚡ QA Nexus Quick Reference

**Version**: 2.4.0  
**Last Updated**: February 6, 2026

## 🚀 Common Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server (Port 3000) |
| `npm run build` | Build production bundle (dist/) |
| `npm run lint` | Run ESLint 9 checks |
| `npm run typecheck` | Run TypeScript validation |
| `npm test` | Execute Vitest suite |
| `npm run ci` | Full validation (Lint + Typecheck + Test) |

## 🔑 Environment Variables

Create a `.env` file in the root directory:

```env
# Required: Google Gemini API Key
VITE_GEMINI_API_KEY=your_key_here

# Optional: Supabase Integration
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
```

## 🛠️ Agents & Models

- **Agent 1 (Reviewer)**: `gemini-3-pro-preview`
- **Agent 2 (Writer)**: `gemini-3-pro-preview`
- **Agent 3 (Executor)**: `gemini-3-flash-preview`

## 📂 Key File Locations

- **Main Orchestrator**: `src/App.tsx`
- **AI Service**: `src/services/geminiService.ts`
- **Agent Config**: `src/constants.ts`
- **Type Definitions**: `src/types.ts`
- **Nav/UI Tabs**: `src/components/tabs/`
