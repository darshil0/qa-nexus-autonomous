
import { GoogleGenAI, Type } from "@google/genai";
import { AGENT_MODELS, SYSTEM_INSTRUCTION_BASE } from "../constants";
import { ValidatedSpec, TestCase, ExecutionResult } from "../types";

const apiKey = process.env.GENAI_API_KEY || process.env.API_KEY;
let ai: GoogleGenAI | undefined;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
} else {
  // Warn at import time; functions will throw when called without a configured client
  console.warn('GENAI API key is not set. Gemini client will not be initialized and calls will throw unless a key is provided.');
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
 * Agent 1: Requirements Reviewer
 * Normalizes and validates requirements for clarity and completeness.
 */
export const reviewRequirements = async (rawInput: string): Promise<{ specs: ValidatedSpec[], thinking: string }> => {
  if (!ai) throw new Error('GenAI client not initialized. Set GENAI_API_KEY environment variable.');
  let response: any;
  try {
    response = await ai.models.generateContent({
      model: AGENT_MODELS.AGENT1,
      contents: `Analyze the following product requirements and output a list of Validated Requirements Specifications. If the input starts with [JIRA SOURCE], preserve that context in the external metadata fields. Input: ${rawInput}`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_BASE + "\n\nYou are Agent 1 (Requirements Reviewer). Your role is to normalize and validate requirements. Always detect if the source is Jira and populate externalSource/externalKey accordingly.",
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
  } catch (err) {
    return { specs: [], thinking: 'AI request failed: ' + (err instanceof Error ? err.message : String(err)) };
  }

  const text = response?.text || '';
  if (!text) return { specs: [], thinking: 'No response from AI' };
  let data: { specs?: ValidatedSpec[] };
  try {
    data = JSON.parse(text);
  } catch (e) {
    return { specs: [], thinking: 'Could not parse AI response' };
  }

  return { specs: data.specs || [], thinking: "Requirement Review analysis complete. Integration metadata synced." };
};

/**
 * Agent 2: Test Case Writer
 * Generates structured, traceable test cases from validated specifications.
 */
export const generateTestCases = async (specs: ValidatedSpec[]): Promise<{ testCases: TestCase[], thinking: string }> => {
  if (!ai) throw new Error('GenAI client not initialized. Set GENAI_API_KEY environment variable.');
  let response: any;
  try {
    response = await ai.models.generateContent({
      model: AGENT_MODELS.AGENT2,
      contents: `Convert these validated specifications into structured test cases: ${JSON.stringify(specs)}`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_BASE + "\n\nYou are Agent 2 (Test Case Writer). Your role is to generate structured, traceable test cases.",
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
  } catch (err) {
    return { testCases: [], thinking: 'AI request failed: ' + (err instanceof Error ? err.message : String(err)) };
  }

  const text = response?.text || '';
  if (!text) return { testCases: [], thinking: 'No response from AI' };
  let data: { testCases?: TestCase[] };
  try {
    data = JSON.parse(text);
  } catch (e) {
    return { testCases: [], thinking: 'Could not parse AI response' };
  }

  return { testCases: data.testCases || [], thinking: "Test cases generated with full traceability to requirements." };
};

/**
 * Agent 3: Test Executor
 * Simulates execution of test cases and generates summary results.
 */
export const executeTests = async (testCases: TestCase[]): Promise<{ results: ExecutionResult[], thinking: string }> => {
  if (!ai) throw new Error('GenAI client not initialized. Set GENAI_API_KEY environment variable.');
  let response: any;
  try {
    response = await ai.models.generateContent({
      model: AGENT_MODELS.AGENT3,
      contents: `Simulate the execution of these test cases and provide detailed results: ${JSON.stringify(testCases)}`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_BASE + "\n\nYou are Agent 3 (Test Executor). Your role is to simulate execution and provide structured logs.",
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
                  status: { type: Type.STRING }, // "PASS" or "FAIL"
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
  } catch (err) {
    return { results: [], thinking: 'AI request failed: ' + (err instanceof Error ? err.message : String(err)) };
  }

  const text = response?.text || '';
  if (!text) return { results: [], thinking: 'No response from AI' };
  let data: { results?: ExecutionResult[] };
  try {
    data = JSON.parse(text);
  } catch (e) {
    return { results: [], thinking: 'Could not parse AI response' };
  }

  return { results: data.results || [], thinking: "Execution summary compiled. Readiness for GitHub issue creation identified." };
};
