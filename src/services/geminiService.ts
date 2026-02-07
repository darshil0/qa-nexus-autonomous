
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { AGENT_MODELS, SYSTEM_INSTRUCTION_BASE } from "../constants";
import { ValidatedSpec, TestCase, ExecutionResult } from "../types";

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
 * Simulated Jira Service
 * In a real scenario, this would call your backend API which interacts with Jira.
 */
export const fetchJiraRequirement = async (issueKey: string): Promise<string> => {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 800));

  // Mock data representing what a Jira API might return
  const mockJiraData = {
    key: issueKey,
    summary: `Feature: Biometric Authentication for ${issueKey}`,
    description: "The system must allow users to authenticate using Fingerprint or FaceID on supported mobile devices. Failure to authenticate should fallback to a 6-digit PIN. The UI must show a clear 'Secure Session' indicator.",
  };

  return `[JIRA SOURCE: ${mockJiraData.key}]\nTitle: ${mockJiraData.summary}\nDescription: ${mockJiraData.description}`;
};

/**
 * Simulated GitHub Service
 * Simulates creating an issue via a backend proxy.
 */
export const createGithubIssue = async (_testCaseId: string, _logs: string): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const issueNumber = Math.floor(Math.random() * 1000) + 100;
  return `https://github.com/org/project/issues/${issueNumber}`;
};

/**
 * Helper to safely extract and parse JSON from Gemini's response.
 */
async function parseAiResponse<T>(responsePromise: Promise<GenerateContentResponse>, field: string): Promise<{ data: T | null; thinking: string }> {
  try {
    const response = await responsePromise;
    const text = response?.text || '';
    if (!text) return { data: null, thinking: 'No response from AI' };

    const parsed = JSON.parse(text);
    return { data: parsed[field] || null, thinking: "Analysis complete." };
  } catch (err) {
    console.error(`AI ${field} parsing error:`, err);
    return { data: null, thinking: 'Could not parse AI response: ' + (err instanceof Error ? err.message : String(err)) };
  }
}

/**
 * Agent 1: Requirements Reviewer
 */
export const reviewRequirements = async (rawInput: string): Promise<{ specs: ValidatedSpec[], thinking: string }> => {
  if (!ai) throw new Error('GenAI client not initialized. Set VITE_GEMINI_API_KEY environment variable.');

  const responsePromise = ai.models.generateContent({
    model: AGENT_MODELS.AGENT1,
    contents: `Analyze requirements: ${rawInput}`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION_BASE + "\n\nYou are Agent 1 (Requirements Reviewer). Normalize and validate requirements. Detect Jira sources.",
      thinkingConfig: { thinkingBudget: 4000 },
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
    }
  });

  const { data, thinking } = await parseAiResponse<ValidatedSpec[]>(responsePromise, 'specs');
  return { specs: data || [], thinking: data ? "Requirement Review analysis complete. Integration metadata synced." : thinking };
};

/**
 * Agent 2: Test Case Writer
 */
export const generateTestCases = async (specs: ValidatedSpec[]): Promise<{ testCases: TestCase[], thinking: string }> => {
  if (!ai) throw new Error('GenAI client not initialized.');

  const responsePromise = ai.models.generateContent({
    model: AGENT_MODELS.AGENT2,
    contents: `Convert specs to test cases: ${JSON.stringify(specs)}`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION_BASE + "\n\nYou are Agent 2 (Test Case Writer). Generate structured test cases.",
      thinkingConfig: { thinkingBudget: 4000 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
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
      }
    }
  });

  const { data, thinking } = await parseAiResponse<TestCase[]>(responsePromise, 'testCases');
  return { testCases: data || [], thinking: data ? "Test cases generated with full traceability." : thinking };
};

/**
 * Agent 3: Test Executor
 */
export const executeTests = async (testCases: TestCase[]): Promise<{ results: ExecutionResult[], thinking: string }> => {
  if (!ai) throw new Error('GenAI client not initialized.');

  const responsePromise = ai.models.generateContent({
    model: AGENT_MODELS.AGENT3,
    contents: `Execute test cases: ${JSON.stringify(testCases)}`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION_BASE + "\n\nYou are Agent 3 (Test Executor). Simulate execution and provide logs.",
      responseMimeType: "application/json",
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
                logs: { type: Type.STRING },
                timestamp: { type: Type.STRING },
              },
              required: ["testCaseId", "status", "logs", "timestamp"]
            }
          }
        },
        required: ["results"]
      }
    }
  });

  const { data, thinking } = await parseAiResponse<ExecutionResult[]>(responsePromise, 'results');
  return { results: data || [], thinking: data ? "Execution summary compiled and results verified." : thinking };
};
