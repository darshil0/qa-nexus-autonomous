## Purpose

- Goal: Give AI coding agents the minimal, actionable knowledge to be immediately productive in this repository — architecture, workflows, conventions, and merge guidance.

## Quick Start (project-specific)

- Primary language & build: TypeScript + React + Vite. See `package.json` and `vite.config.ts`.
- Dev entrypoint: `index.tsx` / `App.tsx` in the project root.
- Important docs: `AGENT.MD` (agent specs), `Walkthrough.MD` (UI flow), and `metadata.json` (agent metadata).

## How to run (exact commands)

Run the app locally (project uses Vite):

```bash
npm install
npm run dev
```

Environment: set `API_KEY` (Gemini) before starting — the app expects `process.env.API_KEY` for `@google/genai` usage.

## Big-picture architecture (what to inspect first)

- Orchestrator / UI: `index.tsx` and `App.tsx` coordinate the multi-agent pipeline.
- Agents & AI glue: `services/geminiService.ts` contains the three agent functions (`reviewRequirements`, `generateTestCases`, `executeTests`) and shows how the code calls `@google/genai` with strongly-typed JSON `responseSchema`.
- Types and contracts: check `types.ts` and `constants.ts` for model names and instruction bases (`AGENT_MODELS`, `SYSTEM_INSTRUCTION_BASE`).
- Metadata & manifest: `metadata.json` contains agent profiles and is authoritative for agent names/descriptions.

## Project-specific conventions and patterns

- Agents always call `ai.models.generateContent` with an explicit `responseSchema` and `responseMimeType: "application/json"`. Preserve this pattern when adding or changing agent prompts — downstream code parses `response.text` with `JSON.parse` and expects stable shapes.
- Simulated integration helpers live in `services/geminiService.ts` (e.g., `fetchJiraRequirement`, `createGithubIssue`) — these are used in lieu of real backend calls and should be updated conservatively.
- UI is Vite + React (ES modules). Keep imports as ESM and respect the `type: "module"` in `package.json`.

## Integration points to watch

- Gemini API: uses `@google/genai`; ensure `API_KEY` and model names inside `constants.ts` match live config.
- Jira / GitHub: the repo uses simulated sync functions; real integrations (if added) should follow the same input/output shapes (see `AGENT.MD` for expected external metadata fields).

## Files to reference when making changes

- `AGENT.MD` — authoritative description of the three agents and their responsibilities.
- `services/geminiService.ts` — core AI call patterns, response schema examples, and simulated external services.
- `Walkthrough.MD` — UI workflows and how users trigger the pipeline.
- `package.json` — scripts (`dev`, `build`, `preview`) and dependencies.
- `metadata.json`, `types.ts`, `constants.ts` — agent configs, types, and constants.

## Tests & CI

- No test runner or CI workflows were found in the repo root. Do not add assumptions about test frameworks; if you add tests, document the exact `npm` script and update this file.

## Merging guidance

- Preserve `AGENT.MD` examples and any sample JSON schemas when editing agent prompts.
- When updating AI call shapes (responseSchema), also update `types.ts` and `metadata.json` to keep runtime parsing deterministic.

## Example: agent `responseSchema` pattern

Refer to `services/geminiService.ts` for full examples of the pattern used when calling the Gemini API: [services/geminiService.ts](services/geminiService.ts)

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
