import { AGENT_MODELS, SYSTEM_INSTRUCTION_BASE } from "@/constants";
import { ValidatedSpec, TestCase, ExecutionResult, AISettings, OrchestrationMetrics } from "@/types";
import { getSkillDescriptions } from "@/services/agenticSkills";
import { mcpService } from "@/services/mcpService";
import { agentMemory } from "@/services/memoryService";
import { logger } from "@/utils/logger";
import { sanitizeRequirements, formatUntrustedInput } from "@/utils/sanitizeInput";

/**
 * Token Bucket Rate Limiter
 * Limits requests to 10 per 60 seconds client-side.
 */
class TokenBucket {
  private tokens: number;
  private lastRefill: number;
  private readonly maxTokens = 10;
  private readonly refillInterval = 60000; // ms (60 seconds)

  constructor() {
    this.tokens = this.maxTokens;
    this.lastRefill = Date.now();
  }

  public consume(): void {
    this.refill();
    if (this.tokens < 1) {
      throw new Error("Rate limit exceeded. Please wait before running the pipeline again.");
    }
    this.tokens -= 1;
  }

  private refill(): void {
    const now = Date.now();
    const timePassed = now - this.lastRefill;
    if (timePassed > this.refillInterval) {
      this.tokens = this.maxTokens;
      this.lastRefill = now;
    }
  }
}

const rateLimiter = new TokenBucket();

/** @internal */
export const __resetRateLimiter = () => {
  // @ts-expect-error - for testing
  rateLimiter.tokens = 10;
};

// Client override for testing environments
type MockAiClient = {
  models: {
    generateContent: (args: {
      model: string;
      contents: string;
      config?: Record<string, unknown>;
    }) => Promise<{ text?: string | (() => string); candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> }>;
  };
};

let mockAiClient: MockAiClient | undefined;

/**
 * Initialize or reset the AI client configuration.
 */
export const initAi = (_key?: string) => {
  // Key is no longer exposed to browser. Server manages GEMINI_API_KEY.
  mockAiClient = undefined;
};

export const setAiClient = (client: unknown) => {
  mockAiClient = client as MockAiClient | undefined;
};

/**
 * Call server Gemini API endpoint with bounded retries and exponential backoff/jitter.
 */
async function callGeminiApi(
  model: string,
  contents: string,
  config?: Record<string, unknown>
): Promise<string> {
  if (mockAiClient) {
    const res = await mockAiClient.models.generateContent({ model, contents, config });
    if (typeof res.text === 'function') {
      return res.text();
    }
    if (typeof res.text === 'string') {
      return res.text;
    }
    if (res.candidates?.[0]?.content?.parts?.[0]?.text) {
      return res.candidates[0].content.parts[0].text;
    }
    return '';
  }

  const maxRetries = 3;
  let attempt = 0;

  while (attempt <= maxRetries) {
    attempt++;
    try {
      const response = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-Token': 'qa-nexus-client-session'
        },
        body: JSON.stringify({ model, contents, config })
      });

      if (response.ok) {
        const json = await response.json() as { text?: string };
        return json.text || '';
      }

      // Handle non-2xx status codes
      const isTransient = [429, 502, 503, 504].includes(response.status);
      const retryAfterHeader = response.headers.get('Retry-After');
      let backoffMs = 1000 * Math.pow(2, attempt - 1) + Math.random() * 500;

      if (retryAfterHeader) {
        const seconds = parseInt(retryAfterHeader, 10);
        if (!isNaN(seconds)) {
          backoffMs = seconds * 1000;
        }
      }

      const errorText = await response.text();
      let parsedError = 'API Request Failed';
      try {
        const errJson = JSON.parse(errorText) as { error?: string };
        parsedError = errJson.error || parsedError;
      } catch {
        parsedError = `HTTP ${response.status}: ${response.statusText}`;
      }

      // Do not retry 400 (Bad Request), 401/403 (Auth), 405 (Method Not Allowed)
      if (!isTransient || attempt > maxRetries) {
        throw new Error(parsedError);
      }

      logger.warn(`Gemini API call failed (${response.status}). Retrying attempt ${attempt}/${maxRetries} in ${Math.round(backoffMs)}ms...`);
      await new Promise(r => setTimeout(r, backoffMs));

    } catch (err) {
      const isNetworkError = err instanceof TypeError || (err instanceof Error && err.name === 'FetchError');
      if (isNetworkError && attempt <= maxRetries) {
        const backoffMs = 1000 * Math.pow(2, attempt - 1) + Math.random() * 500;
        logger.warn(`Network error during Gemini API call. Retrying attempt ${attempt}/${maxRetries} in ${Math.round(backoffMs)}ms...`);
        await new Promise(r => setTimeout(r, backoffMs));
      } else {
        throw err;
      }
    }
  }

  throw new Error('Failed to communicate with Gemini server API after retries.');
}

/**
 * Safely parse JSON from Gemini's response string.
 */
function parseAiTextResponse<T>(
  text: string,
  field: string
): {
  data: T | null;
  thinking: string;
  toolCall?: { name: string; arguments: Record<string, string> }
} {
  try {
    if (!text) {
      logger.warn('No response text from AI');
      return { data: null, thinking: 'No response from AI' };
    }

    const parsed = JSON.parse(text) as {
      thought?: string;
      tool_call?: { name: string; arguments: Record<string, string> };
    } & Record<string, T>;

    const thinking = parsed.thought || "Analysis complete.";
    const toolCall = parsed.tool_call;

    return {
      data: parsed[field] ?? null,
      thinking,
      toolCall
    };
  } catch (err) {
    logger.error(`AI ${field} parsing error:`, err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    return {
      data: null,
      thinking: `Could not parse AI response: ${errorMessage}`
    };
  }
}

/**
 * Universal Agentic Loop with improved error handling and multi-pass reasoning
 */
async function runAgenticWorkflow<T>(
  agentModel: string,
  instruction: string,
  input: string,
  field: string,
  schema: Record<string, unknown>,
  settings?: AISettings
): Promise<{ data: T | null; thinking: string; metrics: OrchestrationMetrics }> {
  rateLimiter.consume();

  const startTime = Date.now();
  const skillDocs = getSkillDescriptions();
  const sessionMemory = agentMemory.getContext();

  let currentInput = `[SESSION CONTEXT]\n${sessionMemory}\n\n[CURRENT TASK]\n${input}\n\nAvailable MCP Skills:\n${skillDocs}`;
  let finalThinking = "";
  let finalData: T | null = null;
  let totalToolCalls = 0;
  let totalTokensEstimated = 0;
  const localToolUsage: Record<string, number> = {};

  const maxIterations = settings?.maxIterations ?? 3;
  const temperature = settings?.temperature ?? 0.7;
  const model = settings?.useFlashModel ? AGENT_MODELS.AGENT3 : agentModel;

  let iterations = 0;
  while (iterations < maxIterations) {
    iterations++;
    logger.info(`Running ${model} workflow (Pass ${iterations}/${maxIterations}) for field: ${field}`);

    try {
      totalTokensEstimated += (currentInput.length / 4);

      const responseText = await callGeminiApi(
        model,
        currentInput,
        {
          systemInstruction: SYSTEM_INSTRUCTION_BASE + "\n\n" + instruction + " If you use a tool, provide your 'thought' and 'tool_call'. If you have all information, provide the final result.",
          thinkingConfig: { thinkingBudget: 4000 },
          responseMimeType: "application/json",
          temperature,
          responseSchema: schema
        }
      );

      const { data, thinking, toolCall } = parseAiTextResponse<T>(responseText, field);
      finalThinking += (finalThinking ? "\n\n" : "") + `[Thought Step ${iterations}]: ${thinking}`;

      agentMemory.add('assistant', thinking);

      if (toolCall) {
        totalToolCalls++;
        localToolUsage[toolCall.name] = (localToolUsage[toolCall.name] ?? 0) + 1;
        logger.info(`Agent requested tool: ${toolCall.name}`);
        const mcpRes = await mcpService.handleRequest({
          jsonrpc: "2.0",
          method: "tools/call",
          params: toolCall,
          id: `mcp-${Date.now()}`
        });

        const observation = JSON.stringify(mcpRes.result !== undefined ? mcpRes.result : mcpRes.error);
        finalThinking += `\n[Observation]: Tool ${toolCall.name} returned ${observation}`;

        agentMemory.add('observation', `Tool ${toolCall.name} result: ${observation}`);

        currentInput += `\n\n[PREVIOUS THOUGHT]: ${thinking}\n[TOOL CALL]: ${toolCall.name}\n[OBSERVATION]: ${observation}\n\nPlease continue or provide the final result.`;
      } else {
        finalData = data;
        break;
      }
    } catch (error) {
      logger.error(`Workflow pass ${iterations} failed:`, error);
      finalThinking += `\n[Error]: ${error instanceof Error ? error.message : String(error)}`;
      break;
    }
  }

  const latencyMs = Date.now() - startTime;

  return {
    data: finalData ?? ([] as unknown as T),
    thinking: finalThinking,
    metrics: {
      totalToolCalls,
      averageLoopDepth: iterations,
      totalTokensEstimated: Math.round(totalTokensEstimated),
      latencyMs,
      toolFrequency: localToolUsage,
      activeLoops: 0
    }
  };
}

/**
 * Agent 1: Requirements Reviewer
 */
export const reviewRequirements = async (rawInput: string, settings?: AISettings): Promise<{ specs: ValidatedSpec[], thinking: string, metrics: OrchestrationMetrics }> => {
  const formattedInput = formatUntrustedInput("User Requirements Input", rawInput);

  const schema: Record<string, unknown> = {
    type: "OBJECT",
    properties: {
      thought: { type: "STRING" },
      tool_call: {
        type: "OBJECT",
        properties: {
          name: { type: "STRING" },
          arguments: { type: "OBJECT" }
        }
      },
      specs: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            requirementId: { type: "STRING" },
            title: { type: "STRING" },
            description: { type: "STRING" },
            acceptanceCriteria: { type: "ARRAY", items: { type: "STRING" } },
            riskClassification: { type: "STRING" },
            priority: { type: "STRING" },
            ambiguities: { type: "ARRAY", items: { type: "STRING" } },
            externalSource: { type: "STRING" },
            externalKey: { type: "STRING" },
          },
          required: ["requirementId", "title", "description", "acceptanceCriteria", "riskClassification", "priority", "ambiguities"]
        }
      }
    },
    required: ["specs"]
  };

  const { data, thinking, metrics } = await runAgenticWorkflow<ValidatedSpec[]>(
    AGENT_MODELS.AGENT1,
    "You are Agent 1 (Requirements Reviewer). Normalize and validate requirements. Detect Jira sources.",
    `Analyze requirements:\n${formattedInput}`,
    "specs",
    schema,
    settings
  );

  return { specs: data || [], thinking, metrics };
};

/**
 * Agent 2: Test Case Writer
 */
export const generateTestCases = async (specs: ValidatedSpec[], settings?: AISettings): Promise<{ testCases: TestCase[], thinking: string, metrics: OrchestrationMetrics }> => {
  const formattedSpecs = formatUntrustedInput("Validated Specs", JSON.stringify(specs));

  const schema: Record<string, unknown> = {
    type: "OBJECT",
    properties: {
      thought: { type: "STRING" },
      tool_call: {
        type: "OBJECT",
        properties: {
          name: { type: "STRING" },
          arguments: { type: "OBJECT" }
        }
      },
      testCases: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            id: { type: "STRING" },
            linkedRequirementIds: { type: "ARRAY", items: { type: "STRING" } },
            category: { type: "STRING" },
            preconditions: { type: "STRING" },
            steps: { type: "ARRAY", items: { type: "STRING" } },
            expectedOutcomes: { type: "STRING" },
            isAutomationCandidate: { type: "BOOLEAN" },
          },
          required: ["id", "linkedRequirementIds", "category", "preconditions", "steps", "expectedOutcomes", "isAutomationCandidate"]
        }
      }
    },
    required: ["testCases"]
  };

  const { data, thinking, metrics } = await runAgenticWorkflow<TestCase[]>(
    AGENT_MODELS.AGENT2,
    "You are Agent 2 (Test Case Writer). Generate structured test cases.",
    `Convert specs to test cases:\n${formattedSpecs}`,
    "testCases",
    schema,
    settings
  );

  return { testCases: data || [], thinking, metrics };
};

/**
 * Agent 3: Test Executor
 */
export const executeTests = async (testCases: TestCase[], settings?: AISettings): Promise<{ results: ExecutionResult[], thinking: string, metrics: OrchestrationMetrics }> => {
  const formattedCases = formatUntrustedInput("Test Cases to Execute", JSON.stringify(testCases));

  const schema: Record<string, unknown> = {
    type: "OBJECT",
    properties: {
      thought: { type: "STRING" },
      tool_call: {
        type: "OBJECT",
        properties: {
          name: { type: "STRING" },
          arguments: { type: "OBJECT" }
        }
      },
      results: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            testCaseId: { type: "STRING" },
            status: { type: "STRING" },
            logs: { type: "STRING" },
            timestamp: { type: "STRING" },
          },
          required: ["testCaseId", "status", "logs", "timestamp"]
        }
      }
    },
    required: ["results"]
  };

  const { data, thinking, metrics } = await runAgenticWorkflow<ExecutionResult[]>(
    AGENT_MODELS.AGENT3,
    "You are Agent 3 (Test Executor). Simulate execution and provide logs.",
    `Execute test cases:\n${formattedCases}`,
    "results",
    schema,
    settings
  );

  return { results: data || [], thinking, metrics };
};

/**
 * Simulated Jira Service
 */
export const fetchJiraRequirement = async (issueKey: string): Promise<string> => {
  const sanitizedKey = sanitizeRequirements(issueKey);
  logger.info(`Fetching Jira requirement: ${sanitizedKey}`);
  await new Promise(resolve => setTimeout(resolve, 800));
  const mockJiraData = {
    key: sanitizedKey,
    summary: `Feature: Biometric Authentication for ${sanitizedKey}`,
    description: "The system must allow users to authenticate using Fingerprint or FaceID on supported mobile devices. Failure to authenticate should fallback to a 6-digit PIN. The UI must show a clear 'Secure Session' indicator.",
  };
  return `[JIRA SOURCE: ${mockJiraData.key}]\nTitle: ${mockJiraData.summary}\nDescription: ${mockJiraData.description}`;
};

/**
 * Simulated GitHub Service
 */
export const createGithubIssue = async (testCaseId: string, logs: string): Promise<string> => {
  const sanitizedTcId = sanitizeRequirements(testCaseId);
  const sanitizedLogs = sanitizeRequirements(logs);
  logger.info(`Creating GitHub issue for test: ${sanitizedTcId}. Logs: ${sanitizedLogs.substring(0, 50)}...`);
  await new Promise(resolve => setTimeout(resolve, 1000));
  const issueNumber = Math.floor(Math.random() * 1000) + 100;
  return `https://github.com/org/project/issues/${issueNumber}?testCase=${sanitizedTcId}&logs=true`;
};
