
import { logger } from "../utils/logger";

/**
 * Interface for an Agentic Skill (Tool)
 */
export interface Skill {
  name: string;
  description: string;
  parameters: Record<string, string>;
  execute: (...args: string[]) => Promise<unknown>;
}

/**
 * Skill: Jira Search
 * Simulates searching Jira for relevant requirements.
 */
export const jiraSearch: Skill = {
  name: "jira_search",
  description: "Search Jira for requirements or issues matching a query.",
  parameters: {
    query: "The search query or issue key."
  },
  execute: async (query: string) => {
    logger.info(`[Skill: jira_search] Searching for: ${query}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    return `Results for "${query}": Found 1 matching requirement (AUTH-101: Biometric Auth).`;
  }
};

/**
 * Skill: GitHub Issue Creator
 * Simulates creating a GitHub issue for a failed test.
 */
export const githubIssueCreate: Skill = {
  name: "github_issue_create",
  description: "Create a GitHub issue for a bug or failed test case.",
  parameters: {
    title: "The issue title.",
    body: "The issue description/logs."
  },
  execute: async (title: string, _body: string) => {
    logger.info(`[Skill: github_issue_create] Creating issue: ${title}`);
    await new Promise(resolve => setTimeout(resolve, 800));
    const issueId = Math.floor(Math.random() * 1000) + 100;
    return `Issue created successfully: https://github.com/org/repo/issues/${issueId}`;
  }
};

/**
 * Skill: Test Runner
 * Simulates running a test case and returning results.
 */
export const testRunner: Skill = {
  name: "test_runner",
  description: "Execute a specific test case simulation.",
  parameters: {
    testCaseId: "The ID of the test case to run."
  },
  execute: async (testCaseId: string) => {
    logger.info(`[Skill: test_runner] Running test: ${testCaseId}`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const status = Math.random() > 0.2 ? "PASSED" : "FAILED";
    return {
      testCaseId,
      status,
      logs: `Execution logs for ${testCaseId}... ${status}`,
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * Skill: Code Analysis
 * Simulates deep inspection of code for potential issues.
 */
export const codeAnalysisSkill: Skill = {
  name: "code_analysis",
  description: "Analyze code for security vulnerabilities, logic errors, and best practices.",
  parameters: {
    code: "The source code or snippet to analyze."
  },
  execute: async (code: string) => {
    logger.info(`[Skill: code_analysis] Analyzing code...`);
    await new Promise(resolve => setTimeout(resolve, 1200));
    const issues = [
      "Potential memory leak in effect cleanup.",
      "Insecure direct object reference (IDOR) risk detected in API call.",
      "Complexity is too high (O(N^2)). Suggest optimization."
    ];
    return {
      snippet: code.substring(0, 50) + "...",
      issuesDetected: issues,
      healthScore: 72
    };
  }
};

/**
 * Skill: Tiny GPT Reference
 * Allows agents to query the underlying GPT algorithm details.
 */
export const tinyGptSkill: Skill = {
  name: "tiny_gpt_reference",
  description: "Retrieve technical details about the dependency-free Python GPT implementation.",
  parameters: {
    topic: "The topic to query (e.g., 'autograd', 'attention', 'rmsnorm')."
  },
  execute: async (topic: string) => {
    logger.info(`[Skill: tiny_gpt_reference] Querying topic: ${topic}`);
    await new Promise(resolve => setTimeout(resolve, 600));
    const data: Record<string, string> = {
      autograd: "Tiny GPT uses a scalar-based Value class with manual backward pass implementation for automatic differentiation.",
      attention: "Uses multi-head causal self-attention with a KV cache for efficient inference.",
      rmsnorm: "Implements Root Mean Square Layer Normalization for improved stability and faster training.",
      optimizer: "Uses the Adam optimizer with linear learning rate decay."
    };
    return data[topic.toLowerCase()] || "Information not available for this topic. Available topics: autograd, attention, rmsnorm, optimizer.";
  }
};

/**
 * Skill: Performance Audit
 * Simulates performance profiling of an application.
 */
export const performanceAuditSkill: Skill = {
  name: "performance_audit",
  description: "Run a performance audit and retrieve metrics like FCP, LCP, and TTI.",
  parameters: {
    url: "The URL of the application to audit."
  },
  execute: async (url: string) => {
    logger.info(`[Skill: performance_audit] Auditing URL: ${url}`);
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      url,
      metrics: {
        fcp: "0.8s",
        lcp: "1.2s",
        tti: "1.4s",
        totalBlockingTime: "50ms"
      },
      recommendations: ["Optimize image sizes.", "Reduce main-thread work."]
    };
  }
};

/**
 * Skill: Gemini Knowledge Base
 * Provides technical details about Gemini 3 models.
 */
export const geminiKnowledgeBaseSkill: Skill = {
  name: "gemini_knowledge_base",
  description: "Retrieve technical details about Gemini 3 models, context limits, and prompt optimization.",
  parameters: {
    topic: "The topic to query (e.g., 'models', 'tokens', 'json', 'reasoning')."
  },
  execute: async (topic: string) => {
    logger.info(`[Skill: gemini_knowledge_base] Querying topic: ${topic}`);
    await new Promise(resolve => setTimeout(resolve, 700));
    const data: Record<string, string> = {
      models: "Gemini 3 Pro is optimized for complex reasoning; Gemini 3 Flash is built for speed and efficiency.",
      tokens: "Gemini 3 supports a context window of up to 2 million tokens for Pro and 1 million for Flash.",
      json: "For best JSON results, use system instructions and provide a clear TypeScript-like schema.",
      reasoning: "Gemini 3 features advanced multi-pass reasoning capabilities and improved multi-modal understanding."
    };
    return data[topic.toLowerCase()] || "Information not available for this topic. Available topics: models, tokens, json, reasoning.";
  }
};

/**
 * Skill Registry
 */
export const skillRegistry: Record<string, Skill> = {
  jira_search: jiraSearch,
  github_issue_create: githubIssueCreate,
  test_runner: testRunner,
  code_analysis: codeAnalysisSkill,
  tiny_gpt_reference: tinyGptSkill,
  performance_audit: performanceAuditSkill,
  gemini_knowledge_base: geminiKnowledgeBaseSkill
};

/**
 * Get all available skill descriptions for AI prompts.
 */
export const getSkillDescriptions = (): string => {
  return Object.values(skillRegistry)
    .map(skill => `- ${skill.name}: ${skill.description} (Params: ${JSON.stringify(skill.parameters)})`)
    .join("\n");
};
