import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { AGENT_MODELS, SYSTEM_INSTRUCTION_BASE } from "../constants";
import { ValidatedSpec, TestCase, ExecutionResult, AISettings } from "../types";
import { getSkillDescriptions } from "./agenticSkills";
import { mcpService } from "./mcpService";
import { agentMemory } from "./memoryService";
import { logger } from "../utils/logger";
import { sanitizeRequirements } from "../utils/sanitizeInput";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
let ai: GoogleGenAI | undefined;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
} else {
  console.warn('VITE_GEMINI_API_KEY is not set. Gemini client will not be initialized.');
}

// For testing and advanced usage, allow swapping the underlying AI client
export const setAiClient = (client: GoogleGenAI | undefined) => {
  ai = client;
};

/**
 * Safely extract text from Gemini response
 */
function extractText(response: GenerateContentResponse): string {
  try {
    // Handle the actual API response structure
    if (typeof response.text === 'function') {
      return response.text();
    }

    // Handle mock/test responses
    if (typeof response.text === 'string') {
      return response.text;
    }

    // Fallback: try to access as unknown type
    const rawResponse = response as unknown as { text: string | (() => string) };
    if (typeof rawResponse.text === 'function') {
      return rawResponse.text();
    }
    if (typeof rawResponse.text === 'string') {
      return rawResponse.text;
    }

    return '';
  } catch (error) {
    logger.error('Failed to extract text from response:', error);
    return '';
  }
}

/**
 * Helper to safely extract and parse JSON from Gemini's response.
 */
async function parseAiResponse<T>(
  response: GenerateContentResponse,
  field: string
): Promise<{
  data: T | null;
  thinking: string;
  toolCall?: { name: string; arguments: Record<string, string> }
}> {
  try {
    const text = extractText(response);

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
      data: parsed[field] || null,
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
): Promise<{ data: T | null; thinking: string }> {
  if (!ai) {
    throw new Error('GenAI client not initialized. Please set VITE_GEMINI_API_KEY in your .env file.');
  }

  const skillDocs = getSkillDescriptions();
  const sessionMemory = agentMemory.getContext();

  let currentInput = `[SESSION CONTEXT]\n${sessionMemory}\n\n[CURRENT TASK]\n${input}\n\nAvailable MCP Skills:\n${skillDocs}`;
  let finalThinking = "";
  let finalData: T | null = null;

  const maxIterations = settings?.maxIterations ?? 3;
  const temperature = settings?.temperature ?? 0.7;
  const model = settings?.useFlashModel ? 'gemini-1.5-flash' : agentModel;

  let iterations = 0;
  while (iterations < maxIterations) {
    iterations++;
    logger.info(`Running ${model} workflow (Pass ${iterations}/${maxIterations}) for field: ${field}`);

    try {
      const response = await ai.models.generateContent({
        model: model,
        contents: currentInput,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION_BASE + "\n\n" + instruction + " If you use a tool, provide your 'thought' and 'tool_call'. If you have all information, provide the final result.",
          thinkingConfig: { thinkingBudget: 4000 },
          responseMimeType: "application/json",
          temperature,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          responseSchema: schema as any
        }
      });

      const { data, thinking, toolCall } = await parseAiResponse<T>(response, field);
      finalThinking += (finalThinking ? "\n\n" : "") + `[Thought Step ${iterations}]: ${thinking}`;

      agentMemory.add('assistant', thinking);

      if (toolCall) {
        logger.info(`Agent requested tool: ${toolCall.name}`);
        const mcpRes = await mcpService.handleRequest({
          jsonrpc: "2.0",
          method: "tools/call",
          params: toolCall,
          id: `mcp-${Date.now()}`
        });

        const observation = JSON.stringify(mcpRes.result || mcpRes.error);
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

  return {
    data: finalData || ([] as unknown as T),
    thinking: finalThinking
  };
}

/**
 * Agent 1: Requirements Reviewer
 */
export const reviewRequirements = async (rawInput: string, settings?: AISettings): Promise<{ specs: ValidatedSpec[], thinking: string }> => {
  const sanitizedInput = sanitizeRequirements(rawInput);

  const schema: Record<string, unknown> = {
    type: Type.OBJECT,
    properties: {
      thought: { type: Type.STRING },
      tool_call: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          arguments: { type: Type.OBJECT }
        }
      },
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
  };

  const { data, thinking } = await runAgenticWorkflow<ValidatedSpec[]>(
    AGENT_MODELS.AGENT1,
    "You are Agent 1 (Requirements Reviewer). Normalize and validate requirements. Detect Jira sources.",
    `Analyze requirements: ${sanitizedInput}`,
    "specs",
    schema,
    settings
  );

  return { specs: data || [], thinking };
};

/**
 * Agent 2: Test Case Writer
 */
export const generateTestCases = async (specs: ValidatedSpec[], settings?: AISettings): Promise<{ testCases: TestCase[], thinking: string }> => {
  const schema: Record<string, unknown> = {
    type: Type.OBJECT,
    properties: {
      thought: { type: Type.STRING },
      tool_call: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          arguments: { type: Type.OBJECT }
        }
      },
      testCases: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            linkedRequirementIds: { type: Type.ARRAY, items: { type: Type.STRING } },
            category: { type: Type.STRING },
            preconditions: { type: Type.STRING },
            steps: { type: Type.ARRAY, items: { type: Type.STRING } },
            expectedOutcomes: { type: Type.STRING },
            isAutomationCandidate: { type: Type.BOOLEAN },
          },
          required: ["id", "linkedRequirementIds", "category", "preconditions", "steps", "expectedOutcomes", "isAutomationCandidate"]
        }
      }
    },
    required: ["testCases"]
  };

  const { data, thinking } = await runAgenticWorkflow<TestCase[]>(
    AGENT_MODELS.AGENT2,
    "You are Agent 2 (Test Case Writer). Generate structured test cases.",
    `Convert specs to test cases: ${JSON.stringify(specs)}`,
    "testCases",
    schema,
    settings
  );

  return { testCases: data || [], thinking };
};

/**
 * Agent 3: Test Executor
 */
export const executeTests = async (testCases: TestCase[], settings?: AISettings): Promise<{ results: ExecutionResult[], thinking: string }> => {
  const schema: Record<string, unknown> = {
    type: Type.OBJECT,
    properties: {
      thought: { type: Type.STRING },
      tool_call: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          arguments: { type: Type.OBJECT }
        }
      },
      results: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            testCaseId: { type: Type.STRING },
            status: { type: Type.STRING },
            logs: { type: Type.STRING },
            timestamp: { type: Type.STRING },
          },
          required: ["testCaseId", "status", "logs", "timestamp"]
        }
      }
    },
    required: ["results"]
  };

  const { data, thinking } = await runAgenticWorkflow<ExecutionResult[]>(
    AGENT_MODELS.AGENT3,
    "You are Agent 3 (Test Executor). Simulate execution and provide logs.",
    `Execute test cases: ${JSON.stringify(testCases)}`,
    "results",
    schema,
    settings
  );

  return { results: data || [], thinking };
};

/**
 * Simulated Jira Service
 */
export const fetchJiraRequirement = async (issueKey: string): Promise<string> => {
  logger.info(`Fetching Jira requirement: ${issueKey}`);
  await new Promise(resolve => setTimeout(resolve, 800));
  const mockJiraData = {
    key: issueKey,
    summary: `Feature: Biometric Authentication for ${issueKey}`,
    description: "The system must allow users to authenticate using Fingerprint or FaceID on supported mobile devices. Failure to authenticate should fallback to a 6-digit PIN. The UI must show a clear 'Secure Session' indicator.",
  };
  return `[JIRA SOURCE: ${mockJiraData.key}]\nTitle: ${mockJiraData.summary}\nDescription: ${mockJiraData.description}`;
};

/**
 * Simulated GitHub Service
 */
export const createGithubIssue = async (_testCaseId: string, _logs: string): Promise<string> => {
  logger.info(`Creating GitHub issue for test: ${_testCaseId}`);
  await new Promise(resolve => setTimeout(resolve, 1000));
  const issueNumber = Math.floor(Math.random() * 1000) + 100;
  return `https://github.com/org/project/issues/${issueNumber}`;
};
