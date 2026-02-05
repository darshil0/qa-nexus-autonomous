
export enum WorkflowStatus {
  IDLE = 'IDLE',
  AGENT1_REVIEWING = 'AGENT1_REVIEWING',
  AGENT2_WRITING = 'AGENT2_WRITING',
  AGENT3_EXECUTING = 'AGENT3_EXECUTING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export interface Requirement {
  id: string;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  externalSource?: 'Jira' | 'Manual';
  externalKey?: string;
}

export interface ValidatedSpec {
  requirementId: string;
  title: string;
  description: string;
  acceptanceCriteria: string[];
  riskClassification: string;
  priority: string;
  ambiguities: string[];
  externalSource?: string;
  externalKey?: string;
}

export interface TestCase {
  id: string;
  linkedRequirementIds: string[];
  category: string;
  preconditions: string;
  steps: string[];
  expectedOutcomes: string;
  isAutomationCandidate: boolean;
}

export interface ExecutionResult {
  testCaseId: string;
  status: 'PASS' | 'FAIL';
  logs: string;
  timestamp: string;
  githubIssueUrl?: string;
}

export interface WorkflowState {
  status: WorkflowStatus;
  rawRequirements: string;
  validatedSpecs: ValidatedSpec[];
  testCases: TestCase[];
  results: ExecutionResult[];
  error?: string;
  thinkingProcess: string;
  jiraIntegration?: {
    connected: boolean;
    projectKey: string;
  };
}
