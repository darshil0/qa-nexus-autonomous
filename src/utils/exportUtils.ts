
import { TestCase, ExecutionResult } from "../types";

/**
 * Trigger a browser download for a file
 */
function downloadFile(content: string, fileName: string, contentType: string): void {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export test cases to JSON
 */
export function exportTestCasesJson(testCases: TestCase[]): void {
  const content = JSON.stringify(testCases, null, 2);
  downloadFile(content, `qa_nexus_test_cases_${Date.now()}.json`, 'application/json');
}

/**
 * Export test cases to CSV
 */
export function exportTestCasesCsv(testCases: TestCase[]): void {
  if (testCases.length === 0) {return;}

  const headers = ['ID', 'Category', 'Preconditions', 'Steps', 'Expected Outcomes', 'Automation Candidate'];
  const rows = testCases.map(tc => [
    tc.id,
    tc.category,
    `"${tc.preconditions.replace(/"/g, '""')}"`,
    `"${tc.steps.join(' | ').replace(/"/g, '""')}"`,
    `"${tc.expectedOutcomes.replace(/"/g, '""')}"`,
    tc.isAutomationCandidate ? 'YES' : 'NO'
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  downloadFile(csvContent, `qa_nexus_test_cases_${Date.now()}.csv`, 'text/csv');
}

/**
 * Export execution results to JSON
 */
export function exportResultsJson(results: ExecutionResult[]): void {
  const content = JSON.stringify(results, null, 2);
  downloadFile(content, `qa_nexus_execution_report_${Date.now()}.json`, 'application/json');
}

/**
 * Export execution results to CSV
 */
export function exportResultsCsv(results: ExecutionResult[]): void {
  if (results.length === 0) {return;}

  const headers = ['TestCaseId', 'Status', 'Timestamp', 'Logs', 'GitHub Issue'];
  const rows = results.map(res => [
    res.testCaseId,
    res.status,
    res.timestamp,
    `"${res.logs.replace(/"/g, '""')}"`,
    res.githubIssueUrl || 'N/A'
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  downloadFile(csvContent, `qa_nexus_execution_report_${Date.now()}.csv`, 'text/csv');
}
