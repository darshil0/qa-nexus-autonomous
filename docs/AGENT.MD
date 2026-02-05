## Purpose

Give AI coding agents the minimal, actionable knowledge to be immediately productive in this multi-agent QA automation platform. This guide covers architecture, workflows, conventions, integration patterns, and development best practices.

## Project Overview

**QA Nexus Autonomous** is a TypeScript + React + Vite application that orchestrates three specialized Google Gemini AI agents to autonomously transform product requirements into validated test suites with execution reports.

- **Total Lines of Code**: ~1,000 (production code + metadata)
- **Main Component**: `src/App.tsx` (338 lines)
- **Key Service**: `src/services/geminiService.ts` (multi-agent orchestration)
- **Build Tool**: Vite with HMR on port 3000
- **AI Engine**: Google Gemini API with strongly-typed JSON schemas

## Quick Start (project-specific)

### Prerequisites
- Node.js 18+ and npm
- Google Gemini API key

### Installation & Commands

```bash
# Clone and install
git clone https://github.com/darshil0/qa-nexus-autonomous
cd qa-nexus-autonomous
npm install

# Set environment variable (required)
export API_KEY=your_google_gemini_api_key

# Run development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Important Files & Documentation
- **Agent Specs**: This file (`docs/AGENT.MD`)
- **UI Workflows**: `docs/Walkthrough.MD`
- **Agent Metadata**: `src/metadata.json` (profiles, descriptions, models)
- **Implementation Guide**: `docs/README_DOCUMENTATION.md` (navigation hub)
- **Architecture Overview**: `README.md`

### Environment Setup
The app requires `API_KEY` environment variable pointing to your Google Gemini API key:
- The code expects: `process.env.API_KEY`
- Vite config defines: `define: { 'process.env.API_KEY': JSON.stringify(env.API_KEY) }`
- Runtime usage: `new GoogleGenerativeAI(process.env.API_KEY!)`

## Big-picture architecture (what to inspect first)

### Project Structure
```
src/
├── App.tsx                  # Orchestrator (338 lines, 5-tab UI)
├── index.tsx                # React entry point (mounts App to #root)
├── types.ts                 # TypeScript interfaces (WorkflowState, TestCase, etc.)
├── constants.ts             # Agent models & system instructions
├── metadata.json            # Agent profiles & metadata
├── services/
│   └── geminiService.ts     # AI orchestration (3 agent functions + simulated integrations)
└── components/              # (Future component extraction)
```

### Three-Agent Pipeline

```
Raw Requirements
        ↓
[AGENT 1: Requirements Reviewer]
  Model: gemini-3-pro-preview
  Task: Validate specs, identify ambiguities
  Output: ValidatedSpec[] with acceptance criteria & risks
        ↓
[AGENT 2: Test Case Writer]
  Model: gemini-3-pro-preview
  Task: Generate comprehensive test scenarios
  Output: TestCase[] with traceability to requirements
        ↓
[AGENT 3: Test Executor]
  Model: gemini-3-flash-preview
  Task: Simulate execution, report results
  Output: ExecutionResult[] with pass/fail status & defects
        ↓
[ORCHESTRATOR: App.tsx]
  - Manages workflow state (5 tabs)
  - Displays agent outputs progressively
  - Handles async operations with loading states
  - Integrates with Jira/GitHub (simulated)
        ↓
Final QA Report
```

### Core Components

#### 1. **Orchestrator** (`src/App.tsx`)
- **Purpose**: Central React component managing entire workflow
- **State Management**: React useState for WorkflowState
- **UI Structure**: 5-tab interface
  - Tab 1: Orchestrator (pipeline status, thinking log)
  - Tab 2: Agent 1 output (validated specs)
  - Tab 3: Agent 2 output (test cases)
  - Tab 4: Agent 3 output (execution results)
  - Tab 5: Reports (dashboard, charts)
- **Key Functions**:
  - `runWorkflow()`: Triggers the multi-agent pipeline
  - `handleJiraFetch()`: Simulates Jira integration
  - Status tracking via `WorkflowStatus` enum

#### 2. **Agent 1: Requirements Reviewer** (`reviewRequirements()`)
- **Model**: `gemini-3-pro-preview`
- **Goal**: Transform raw requirements into validated specifications
- **Process**:
  1. Parse requirements text
  2. Check for ambiguities and contradictions
  3. Identify risks and priority levels
  4. Generate structured output
- **Output Structure**: `ValidatedSpec` objects with:
  - `requirementId`: Unique identifier
  - `title` & `description`: Cleansed text
  - `acceptanceCriteria`: Array of criteria
  - `riskClassification`: HIGH/MEDIUM/LOW
  - `ambiguities`: Array of flag strings
  - `externalSource`: Jira/GitHub reference (optional)

#### 3. **Agent 2: Test Case Writer** (`generateTestCases()`)
- **Model**: `gemini-3-pro-preview`
- **Goal**: Generate comprehensive, traceable test scenarios
- **Process**:
  1. Analyze validated requirements
  2. Design edge cases and happy paths
  3. Link tests to requirements
  4. Include pre/post conditions
- **Output Structure**: `TestCase` objects with:
  - `id`: Unique identifier
  - `specId`: Requirement reference
  - `title` & `description`: Test scenario
  - `steps`: Array of test action strings
  - `expectedOutcome`: Expected behavior
  - `priority`: CRITICAL/HIGH/MEDIUM/LOW

#### 4. **Agent 3: Test Executor** (`executeTests()`)
- **Model**: `gemini-3-flash-preview` (faster, lower cost)
- **Goal**: Simulate test execution and report results
- **Process**:
  1. Simulate each test scenario
  2. Generate pass/fail results
  3. Document defects or issues
  4. Calculate coverage metrics
- **Output Structure**: `ExecutionResult` objects with:
  - `testCaseId`: Reference to test case
  - `status`: PASS/FAIL string
  - `output`: Execution log
  - `defects`: Array of discovered issues
  - `timestamp`: Execution time

#### 5. **Services Layer** (`src/services/geminiService.ts`)
- **Gemini API Integration**:
  - Initializes `GoogleGenerativeAI` with `process.env.API_KEY`
  - Each agent function calls `ai.models.generateContent()`
  - Uses strongly-typed `responseSchema` for deterministic JSON
  - Response parsing: `JSON.parse(response.text || '...')` with error handling

- **Simulated Integrations**:
  - `fetchJiraRequirement()`: Mock Jira API call
  - `createGithubIssue()`: Mock GitHub API call
  - Both return mock data for demo purposes

## Agent Specifications (Detailed)

### Agent 1: Requirements Reviewer

**System Instruction Base**:
Guides the agent to validate and cleanse requirements using "system instruction base" pattern (see `constants.ts`).

**Responsibility**:
- Parse user-provided requirements or Jira tickets
- Identify structured information (user stories, acceptance criteria)
- Flag ambiguous statements
- Classify risk levels
- Output deterministic JSON with ValidatedSpec structure

**Example Input**:
```
"As a user, I want to login with my credentials so I can access my account"
```

**Expected Output** (JSON):
```json
{
  "specs": [
    {
      "requirementId": "spec_001",
      "title": "User Login",
      "description": "Authenticate user with email and password",
      "acceptanceCriteria": [
        "Valid credentials should return user session",
        "Invalid credentials should show error message",
        "Account lockout after 5 failed attempts"
      ],
      "riskClassification": "HIGH",
      "priority": "CRITICAL",
      "ambiguities": [
        "Password reset flow not specified",
        "Session timeout duration not defined"
      ],
      "externalSource": "JIRA",
      "externalKey": "AUTH-101"
    }
  ]
}
```

### Agent 2: Test Case Writer

**System Instruction Base**:
Generates comprehensive test scenarios that are:
- Traceable to specific requirements
- Cover happy paths and edge cases
- Include clear steps and expected outcomes
- Follow BDD (Behavior-Driven Development) patterns

**Responsibility**:
- Accept validated requirements
- Generate test scenarios for each acceptance criterion
- Include positive and negative test cases
- Output deterministic JSON with TestCase structure

**Example Input** (from Agent 1 output):
```json
{
  "requirementId": "spec_001",
  "acceptanceCriteria": ["Valid credentials should return user session"]
}
```

**Expected Output** (JSON):
```json
{
  "testCases": [
    {
      "id": "tc_001",
      "specId": "spec_001",
      "title": "Login with valid credentials",
      "description": "User login successful with correct email and password",
      "steps": [
        "Navigate to login page",
        "Enter valid email: user@example.com",
        "Enter valid password: SecurePass123",
        "Click Login button"
      ],
      "expectedOutcome": "User redirected to dashboard with active session",
      "priority": "CRITICAL"
    },
    {
      "id": "tc_002",
      "specId": "spec_001",
      "title": "Login with invalid credentials",
      "description": "User login fails with incorrect password",
      "steps": [
        "Navigate to login page",
        "Enter valid email: user@example.com",
        "Enter incorrect password: WrongPass",
        "Click Login button"
      ],
      "expectedOutcome": "Error message displays: 'Invalid credentials'",
      "priority": "HIGH"
    }
  ]
}
```

### Agent 3: Test Executor

**System Instruction Base**:
Simulates test execution based on requirements and test cases.

**Responsibility**:
- Simulate test execution for each test case
- Generate pass/fail results with realistic outcomes
- Report defects and issues
- Output deterministic JSON with ExecutionResult structure

**Example Input** (test cases from Agent 2):
```json
[
  {
    "id": "tc_001",
    "title": "Login with valid credentials",
    "steps": ["Navigate...", "Enter...", etc]
  }
]
```

**Expected Output** (JSON):
```json
{
  "results": [
    {
      "testCaseId": "tc_001",
      "status": "PASS",
      "output": "User successfully authenticated. Session created with token: abc123...",
      "defects": [],
      "timestamp": "2024-02-04T12:34:56Z"
    },
    {
      "testCaseId": "tc_002",
      "status": "PASS",
      "output": "Error displayed correctly as expected.",
      "defects": [],
      "timestamp": "2024-02-04T12:35:20Z"
    }
  ]
}
```

## Project-specific conventions and patterns

### Core Patterns

#### 1. **Agent Function Pattern**
All agent functions follow this structure:
```typescript
export async function agentName(input: InputType): Promise<OutputType> {
  // 1. Prepare system instruction
  const systemInstruction = SYSTEM_INSTRUCTION_BASE + 
    `\n[AGENT NAME] responsibilities and output format...`;
  
  // 2. Call Gemini API with responseSchema
  const response = await ai.models.generateContent({
    model: AGENT_MODELS.AGENT_NAME,
    contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
    config: {
      systemInstruction,
      thinkingConfig: { maxThinkingLength: 5000 },
      responseMimeType: 'application/json',
      responseSchema: { /* strongly-typed schema */ }
    }
  });
  
  // 3. Parse and return typed result
  const result = JSON.parse(response.text || '{}');
  return result as OutputType;
}
```

**Key Points**:
- ✅ Always include `responseMimeType: 'application/json'`
- ✅ Always define `responseSchema` with `Type.OBJECT`, `Type.ARRAY`, etc.
- ✅ Match schema structure to `types.ts` interfaces
- ✅ Parse response.text with error handling
- ✅ Return strongly-typed result

#### 2. **State Management Pattern** (in `App.tsx`)
```typescript
// Define state interface
interface WorkflowState {
  status: WorkflowStatus;
  rawRequirements: string;
  validatedSpecs: ValidatedSpec[];
  testCases: TestCase[];
  results: ExecutionResult[];
  thinkingProcess: string;
  jiraIntegration: JiraIntegration;
}

// Use React setState for updates
setState(p => ({ 
  ...p, 
  status: WorkflowStatus.AGENT1_REVIEWING,
  thinkingProcess: '[AGENT 1] Reviewing specs...'
}));
```

#### 3. **Async Operation Pattern** (with loading states)
```typescript
try {
  setState(p => ({ ...p, status: WorkflowStatus.AGENT1_REVIEWING }));
  const { specs } = await reviewRequirements(rawRequirements);
  setState(p => ({ ...p, validatedSpecs: specs }));
} catch (err) {
  setState(p => ({ ...p, thinkingProcess: `Error: ${err}` }));
}
```

### Response Schema Pattern (Critical!)

Every agent uses a deterministic response schema. **Preserve this pattern** when modifying agents:

```typescript
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
          // ... all fields defined with Type
        },
        required: ['requirementId', 'title', /* ... */]
      }
    },
    thinking: { type: Type.STRING }  // Optional: capture agent reasoning
  },
  required: ['specs']
}
```

**Why?**
- Downstream code calls `JSON.parse(response.text)` and expects stable JSON
- TypeScript interfaces in `types.ts` rely on this shape
- Breaking the schema breaks runtime parsing

### Simulated Integration Pattern

Integration helpers in `services/geminiService.ts`:
```typescript
export async function fetchJiraRequirement(issueKey: string): Promise<JiraRequirement> {
  // Mock response - replace with real API call if needed
  return {
    key: issueKey,
    summary: 'Mock requirement',
    description: '...',
    acceptanceCriteria: [/* ... */]
  };
}
```

**Notes**:
- These are mock implementations for demo purposes
- Keep input/output shapes stable
- When replacing with real APIs, maintain the same interface
- Test both mock and real implementations

### UI Component Patterns (Recent Enhancement)

All interactive elements now include:
- ✅ Focus states: `focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2`
- ✅ Loading spinners: `<Loader2 className="animate-spin" />`
- ✅ Help text: `aria-describedby="help-id"`
- ✅ ARIA attributes: `aria-label`, `aria-busy`
- ✅ Theme colors: `bg-indigo-600 hover:bg-indigo-700`

Example button:
```tsx
<button
  onClick={runWorkflow}
  disabled={isLoading}
  aria-busy={isLoading}
  aria-label="Launch multi-agent QA pipeline"
  className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold
    hover:bg-indigo-700 disabled:bg-slate-300
    focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2
    transition-all flex items-center gap-2"
>
  {isLoading ? (
    <><Loader2 className="animate-spin" /> Running...</>
  ) : (
    <>Launch Pipeline</>
  )}
</button>
```

## Integration points to watch

### Gemini API Integration
- **Initialization**: `new GoogleGenerativeAI(process.env.API_KEY!)`
- **Models Used**:
  - `gemini-3-pro-preview`: Agents 1 & 2 (complex analysis)
  - `gemini-3-flash-preview`: Agent 3 (execution simulation)
- **See**: `constants.ts` for `AGENT_MODELS`
- **Common Issues**:
  - ❌ API_KEY not set → RuntimeError
  - ❌ Model name mismatch → API 404
  - ❌ Schema mismatch → Parsing error
- **Debugging**:
  ```bash
  echo $API_KEY  # Verify key is set
  npm run dev   # Check console for errors
  ```

### Jira Integration (Simulated)
- **Function**: `fetchJiraRequirement(issueKey)`
- **Returns**: Mock JiraRequirement object
- **To Implement Real API**:
  1. Replace mock response with Jira REST API call
  2. Maintain same input/output shape
  3. Update error handling for network failures
  4. Add rate limiting if needed

### GitHub Integration (Simulated)
- **Function**: `createGithubIssue(defect)`
- **Returns**: Mock GitHub issue object
- **To Implement Real API**:
  1. Use Octokit or GitHub GraphQL SDK
  2. Create issues from test defects
  3. Link back to test results
  4. Handle authentication securely

## Files to reference when making changes

### Core Files
- **`src/App.tsx`** — Main orchestrator (338 lines, state management, UI)
- **`src/services/geminiService.ts`** — Agent functions & API patterns
- **`src/types.ts`** — TypeScript interfaces for all data structures
- **`src/constants.ts`** — Agent models, system instructions, constants
- **`src/metadata.json`** — Agent profiles (names, descriptions)

### Documentation
- **`docs/AGENT.MD`** — This file (you are here)
- **`docs/Walkthrough.MD`** — UI workflows & user flows
- **`docs/README_DOCUMENTATION.md`** — Documentation index
- **`PROJECT_STRUCTURE.md`** — Project organization

### Configuration
- **`vite.config.ts`** — Build tool config, path aliases
- **`tsconfig.json`** — TypeScript compiler options
- **`package.json`** — Dependencies, npm scripts
- **`index.html`** — HTML entry point

### Recent Enhancements
- **`docs/BEFORE_AFTER_COMPARISON.md`** — Visual improvements
- **`docs/IMPLEMENTATION_SUMMARY.md`** — UI enhancement details
- **`.github/copilot-instructions.md`** — AI development guidelines

## Testing & Validation

### Manual Testing Workflow

1. **Start Dev Server**
   ```bash
   npm install
   npm run dev
   # Visit http://localhost:3000
   ```

2. **Keyboard Navigation Test**
   - Press Tab through form elements
   - Verify blue focus rings appear (indigo-600)
   - Test accessibility: ✅ WCAG 2.1 AA compliant

3. **Agent Pipeline Test**
   ```
   Requirements input
   ↓ Click "Launch Pipeline"
   ↓ Watch loading spinners
   ↓ Check Agent outputs in 5 tabs
   ↓ Verify JSON parsing in console
   ```

4. **API Integration Test**
   ```bash
   # Check API_KEY is set
   echo $API_KEY
   
   # Watch browser console for:
   # - No "undefined API_KEY" errors
   # - Agents respond with valid JSON
   # - No parsing exceptions
   ```

5. **Build & Preview**
   ```bash
   npm run build      # Should complete without errors
   npm run preview    # Verify production build works
   ```

### Debugging Tips

| Issue | Solution |
|-------|----------|
| API Key not recognized | `export API_KEY=your_key` then restart `npm run dev` |
| Agent returns error | Check browser console for responseSchema mismatch |
| UI not updating | Check state management in App.tsx (setState calls) |
| Focus ring not visible | Ensure Tailwind CSS is loading (check page source) |
| Port 3000 in use | `npm run dev -- --port 3001` |

### TypeScript Validation

All code is TypeScript strict mode:
```bash
# Check for TS errors
npx tsc --noEmit

# Should output: 0 errors found
```

## Security & Production Considerations

### Environment Variables
```bash
# ✅ Safe: Set via environment
export API_KEY=your_key

# ❌ Unsafe: Commit to repository
# Never add .env files to Git
# Never log API_KEY to console
```

### API Key Handling
- Vite `define` plugin securely injects API_KEY at build time
- Not exposed in source code, only in built output
- Should use service workers or backend proxy for production deployments

### Rate Limiting
- Gemini API has rate limits (varies by account)
- Current implementation: basic error handling
- Production: Add exponential backoff retry logic

### Data Privacy
- Simulated Jira/GitHub: Mock data only
- Real integrations should implement token rotation
- Never log full requirement/test data
- Consider data retention policies

## Merging guidance

### Before Submitting a PR

1. **Preserve Agent Schemas**
   - Do not modify `responseSchema` without updating `types.ts`
   - Test that `JSON.parse()` works on new schema
   - Update this file with new schema examples

2. **Update Documentation**
   - If changing agent behavior, update `docs/AGENT.MD`
   - If changing UI flow, update `docs/Walkthrough.MD`
   - If changing architecture, update `README.md`

3. **Test All Three Agents**
   - Agent 1 must output valid ValidatedSpec[]
   - Agent 2 must output valid TestCase[]
   - Agent 3 must output valid ExecutionResult[]
   - Each must parse successfully with `JSON.parse()`

4. **Verify TypeScript**
   ```bash
   npx tsc --noEmit  # Must pass with 0 errors
   ```

5. **Test Accessibility**
   - Tab through all form elements
   - Verify focus indicators visible
   - Test with screen reader (NVDA/VoiceOver)
   - Check: `aria-label`, `aria-describedby`, `aria-busy`

### Commit Message Format

```
<type>: <description>

<optional detailed explanation>

Refs: <agent/file affected>
```

Examples:
```
feat: add validation to Agent 1 output schema
  - Enhanced ambiguity detection
  - Updated responseSchema for new fields
  Refs: services/geminiService.ts, types.ts

fix: correct focus ring on Launch Pipeline button
  - Added focus:ring-indigo-600
  - Verified WCAG 2.1 AA compliance
  Refs: App.tsx

docs: update AGENT.MD with new Agent 2 schema
  - Added TestCase examples
  - Documented edge case handling
  Refs: docs/AGENT.MD, types.ts
```

### Breaking Changes

If your change breaks the agent API:
1. Update all three files simultaneously:
   - `services/geminiService.ts` (schema)
   - `types.ts` (interface)
   - This file `docs/AGENT.MD` (documentation)
2. Test all downstream parsing code
3. Update example JSON in documentation
4. Increment semantic version

## Key Takeaways

### Do's ✅
- ✅ Keep response schemas in sync with types.ts
- ✅ Always use `responseMimeType: 'application/json'`
- ✅ Test agents independently before integration
- ✅ Document schema changes in AGENT.MD
- ✅ Use TypeScript strict mode
- ✅ Check accessibility fixes with focus indicators
- ✅ Preserve error handling patterns
- ✅ Test both happy path and edge cases

### Don'ts ❌
- ❌ Modify schema without updating types.ts
- ❌ Remove or move files without updating imports
- ❌ Hardcode API keys or secrets
- ❌ Break backward compatibility silently
- ❌ Skip TypeScript validation
- ❌ Remove ARIA attributes from form elements
- ❌ Change response shapes mid-stream
- ❌ Ignore error boundaries in async operations

## Additional Resources

- Google Gemini API: [https://ai.google.dev](https://ai.google.dev)
- React Docs: [https://react.dev](https://react.dev)
- TypeScript Handbook: [https://www.typescriptlang.org/docs](https://www.typescriptlang.org/docs)
- Vite Documentation: [https://vitejs.dev](https://vitejs.dev)
- Tailwind CSS: [https://tailwindcss.com](https://tailwindcss.com)

---

## Response Schema Examples (Reference)

### Complete Agent 1 Schema (Requirements Reviewer)

```typescript
// Defined in: src/services/geminiService.ts
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
          acceptanceCriteria: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING } 
          },
          riskClassification: { type: Type.STRING },
          priority: { type: Type.STRING },
          ambiguities: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING } 
          },
          externalSource: { type: Type.STRING },
          externalKey: { type: Type.STRING },
        },
        required: [
          'requirementId',
          'title',
          'description',
          'acceptanceCriteria',
          'riskClassification',
          'priority',
          'ambiguities'
        ]
      }
    },
    thinking: { type: Type.STRING }
  },
  required: ['specs']
}
```

**Key Validations**:
- All RequiredFields must be present
- acceptanceCriteria must be non-empty array
- riskClassification ∈ {HIGH, MEDIUM, LOW}
- priority ∈ {CRITICAL, HIGH, MEDIUM, LOW}

### Complete Agent 2 Schema (Test Case Writer)

```typescript
// Defined in: src/services/geminiService.ts
responseSchema: {
  type: Type.OBJECT,
  properties: {
    testCases: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          specId: { type: Type.STRING },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          steps: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING } 
          },
          expectedOutcome: { type: Type.STRING },
          priority: { type: Type.STRING },
        },
        required: [
          'id',
          'specId',
          'title',
          'description',
          'steps',
          'expectedOutcome',
          'priority'
        ]
      }
    },
    thinking: { type: Type.STRING }
  },
  required: ['testCases']
}
```

**Key Validations**:
- steps array must contain 3+ action strings
- specId must match a requirement from Agent 1
- expectedOutcome must be specific and measurable
- priority consistent with source requirement priority

### Complete Agent 3 Schema (Test Executor)

```typescript
// Defined in: src/services/geminiService.ts
responseSchema: {
  type: Type.OBJECT,
  properties: {
    results: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          testCaseId: { type: Type.STRING },
          status: { type: Type.STRING },
          output: { type: Type.STRING },
          defects: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING } 
          },
          timestamp: { type: Type.STRING },
        },
        required: [
          'testCaseId',
          'status',
          'output',
          'defects',
          'timestamp'
        ]
      }
    },
    summary: {
      type: Type.OBJECT,
      properties: {
        totalTests: { type: Type.NUMBER },
        passed: { type: Type.NUMBER },
        failed: { type: Type.NUMBER },
        coverage: { type: Type.NUMBER },
      },
      required: ['totalTests', 'passed', 'failed']
    },
    thinking: { type: Type.STRING }
  },
  required: ['results', 'summary']
}
```

**Key Validations**:
- status ∈ {PASS, FAIL}
- timestamp ISO 8601 format
- defects array (empty for PASS, populated for FAIL)
- summary.passed + summary.failed = summary.totalTests
- coverage percentage 0-100

## Type Definitions (Reference)

These are the TypeScript interfaces that must match response schemas:

```typescript
// From src/types.ts
enum WorkflowStatus {
  IDLE = 'IDLE',
  AGENT1_REVIEWING = 'AGENT1_REVIEWING',
  AGENT2_WRITING = 'AGENT2_WRITING',
  AGENT3_EXECUTING = 'AGENT3_EXECUTING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR',
}

interface ValidatedSpec {
  requirementId: string;
  title: string;
  description: string;
  acceptanceCriteria: string[];
  riskClassification: 'HIGH' | 'MEDIUM' | 'LOW';
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  ambiguities: string[];
  externalSource?: string;
  externalKey?: string;
}

interface TestCase {
  id: string;
  specId: string;
  title: string;
  description: string;
  steps: string[];
  expectedOutcome: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}

interface ExecutionResult {
  testCaseId: string;
  status: 'PASS' | 'FAIL';
  output: string;
  defects: string[];
  timestamp: string;
}

interface WorkflowState {
  status: WorkflowStatus;
  rawRequirements: string;
  validatedSpecs: ValidatedSpec[];
  testCases: TestCase[];
  results: ExecutionResult[];
  thinkingProcess: string;
  jiraIntegration: JiraIntegration;
}
```

**Important**:
When modifying any agent's response schema:
1. Update the TypeScript interface in `types.ts`
2. Update the `responseSchema` in `services/geminiService.ts`
3. Test JSON parsing works with new schema
4. Update this file with new schema examples
5. Update tests to validate new fields
