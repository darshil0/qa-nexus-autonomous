## Purpose

- Goal: Give AI coding agents the minimal, actionable knowledge to be immediately productive in this repository — architecture, workflows, conventions, and merge guidance.

## Quick Start (project-specific)

- Primary language & build: TypeScript + React + Vite. See `package.json` and `vite.config.ts`.
- Dev entrypoint: `src/index.tsx` / `src/App.tsx`.
- Important docs: `docs/AGENT.md` (agent specs), `docs/Walkthrough.md` (UI flow), and `src/metadata.json` (agent metadata).

## How to run (exact commands)

Run the app locally (project uses Vite):

```bash
npm install
npm run dev
```

## Environment Configuration
- Set `VITE_GEMINI_API_KEY` for the frontend.
- Set `VITE_GEMINI_API_KEY` (or `GENAI_API_KEY`) for Node-based test environments.
- Use `.env.example` as a template for local development.

## Project-specific conventions and patterns
- Agents always call `ai.models.generateContent` with an explicit `responseSchema` and `responseMimeType: "application/json"`. 
- Type-safe parsing is handled by the `parseAiResponse` helper in `geminiService.ts`.
- UI is decomposed into modular tab components in `src/components/tabs/`. Performance is managed via `useCallback` and `useMemo`.

## Tests & CI
- **Test Runner**: Vitest 4.0 is integrated. Run tests using `npm test`.
- **CI Workflows**: GitHub Actions are configured in `.github/workflows/ci.yml` and `eslint.yml`. 
- **Quality Gates**: PRs and pushes to `main` trigger type-checking (`npm run typecheck`), linting (`npm run lint`), and unit tests (`npm run test -- --run`).

## Merging guidance

- Preserve `AGENT.md` examples and any sample JSON schemas when editing agent prompts.
- When updating AI call shapes (responseSchema), also update `types.ts` and `metadata.json` to keep runtime parsing deterministic.

## Example: agent `responseSchema` pattern

Refer to `src/services/geminiService.ts` for full examples of the pattern used when calling the Gemini API: [src/services/geminiService.ts](../src/services/geminiService.ts)

Example (Agent 1 `reviewRequirements` - response schema):

```ts
responseMimeType: "application/json",
responseSchema: {
  type: Type.OBJECT,
  properties: {
    specs: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          requirementId: { type: Type.STRING },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          acceptanceCriteria: { type: Type.ARRAY, items: { type: Type.STRING } },
          riskClassification: { type: Type.STRING },
          priority: { type: Type.STRING },
          ambiguities: { type: Type.ARRAY, items: { type: Type.STRING } },
          externalSource: { type: Type.STRING },
          externalKey: { type: Type.STRING },
        },
        required: ["requirementId", "title", "description", "acceptanceCriteria", "riskClassification", "priority", "ambiguities"]
      }
    }
  },
  required: ["specs"]
}
```

Notes:
- Keep `responseMimeType: "application/json"` and a stable `responseSchema` when changing prompts — downstream code calls `JSON.parse(response.text)` and maps to `types.ts`.

