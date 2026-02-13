
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { AGENT_MODELS, SYSTEM_INSTRUCTION_BASE } from "../constants";
import { ValidatedSpec, TestCase, ExecutionResult } from "../types";
import { getSkillDescriptions } from "./agenticSkills";
import { mcpService } from "./mcpService";

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
 * Helper to safely extract and parse JSON from Gemini's response.
 */
async function parseAiResponse<T>(response: GenerateContentResponse, field: string): Promise<{ data: T | null; thinking: string; toolCall?: any }> {
  try {
    const text = typeof response.text === 'function' ? response.text() : (response as any).text;
    if (!text) return { data: null, thinking: 'No response from AI' };

    const parsed = JSON.parse(text);
    const thinking = parsed.thought || "Analysis complete.";
    const toolCall = parsed.tool_call;

    return {
      data: parsed[field] || null,
      thinking,
      toolCall
    };
  } catch (err) {
    console.error(`AI ${field} parsing error:`, err);
    return { data: null, thinking: 'Could not parse AI response: ' + (err instanceof Error ? err.message : String(err)) };
  }
}

/**
 * Universal Agentic Loop
 */
async function runAgenticWorkflow<T>(
  agentModel: string,
  instruction: string,
  input: string,
  field: string,
  schema: any
): Promise<{ data: T | null; thinking: string }> {
  if (!ai) throw new Error('GenAI client not initialized.');

  const skillDocs = getSkillDescriptions();
  const fullInput = `${input}\n\nAvailable MCP Skills:\n${skillDocs}`;

  // First Pass
  let response = await ai.models.generateContent({
    model: agentModel,
    contents: fullInput,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION_BASE + "\n\n" + instruction + " If you use a tool, provide your 'thought' and 'tool_call'.",
      thinkingConfig: { thinkingBudget: 4000 },
      responseMimeType: "application/json",
      responseSchema: schema
    }
  });

  let { data, thinking, toolCall } = await parseAiResponse<T>(response, field);
  let finalThinking = thinking;

  if (toolCall) {
    const mcpRes = await mcpService.handleRequest({
      jsonrpc: "2.0",
      method: "tools/call",
      params: toolCall,
      id: `mcp-${Date.now()}`
    });

    const observation = JSON.stringify(mcpRes.result || mcpRes.error);
    finalThinking += `\n\n[MCP Skill Call: ${toolCall.name}]\nResult: ${observation}`;

    // Second Pass: Incorporate observation
    const secondPassInput = `${fullInput}\n\n[PREVIOUS THOUGHT]: ${thinking}\n[TOOL CALL]: ${toolCall.name}\n[OBSERVATION]: ${observation}\n\nPlease provide the final result based on this information.`;

    response = await ai.models.generateContent({
      model: agentModel,
      contents: secondPassInput,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_BASE + "\n\n" + instruction,
        thinkingConfig: { thinkingBudget: 4000 },
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });

    const secondPassResult = await parseAiResponse<T>(response, field);
    return {
      data: secondPassResult.data,
      thinking: finalThinking + "\n\n" + (secondPassResult.thinking || "Final analysis complete.")
    };
  }

  return { data, thinking: finalThinking };
}

/**
 * Agent 1: Requirements Reviewer
 */
export const reviewRequirements = async (rawInput: string): Promise<{ specs: ValidatedSpec[], thinking: string }> => {
  const schema = {
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
    `Analyze requirements: ${rawInput}`,
    "specs",
    schema
  );

  return { specs: data || [], thinking };
};

/**
 * Agent 2: Test Case Writer
 */
export const generateTestCases = async (specs: ValidatedSpec[]): Promise<{ testCases: TestCase[], thinking: string }> => {
  const schema = {
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
    schema
  );

  return { testCases: data || [], thinking };
};

/**
 * Agent 3: Test Executor
 */
export const executeTests = async (testCases: TestCase[]): Promise<{ results: ExecutionResult[], thinking: string }> => {
  const schema = {
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
    schema
  );

  return { results: data || [], thinking };
};

/**
 * Simulated Jira Service
 */
export const fetchJiraRequirement = async (issueKey: string): Promise<string> => {
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
  await new Promise(resolve => setTimeout(resolve, 1000));
  const issueNumber = Math.floor(Math.random() * 1000) + 100;
  return `https://github.com/org/project/issues/${issueNumber}`;
};
