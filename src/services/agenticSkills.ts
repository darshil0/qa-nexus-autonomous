
import { TestCase, ValidatedSpec } from "../types";

/**
 * Interface for an Agentic Skill (Tool)
 */
export interface Skill {
  name: string;
  description: string;
  parameters: Record<string, any>;
  execute: (...args: any[]) => Promise<any>;
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
    console.log(`[Skill: jira_search] Searching for: ${query}`);
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
  execute: async (title: string, body: string) => {
    console.log(`[Skill: github_issue_create] Creating issue: ${title}`);
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
    console.log(`[Skill: test_runner] Running test: ${testCaseId}`);
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
 * Skill Registry
 */
export const skillRegistry: Record<string, Skill> = {
  jira_search: jiraSearch,
  github_issue_create: githubIssueCreate,
  test_runner: testRunner
};

/**
 * Get all available skill descriptions for AI prompts.
 */
export const getSkillDescriptions = (): string => {
  return Object.values(skillRegistry)
    .map(skill => `- ${skill.name}: ${skill.description} (Params: ${JSON.stringify(skill.parameters)})`)
    .join("\n");
};
