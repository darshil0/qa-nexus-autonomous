import React from 'react';
import { Database, Loader2, Github, ChevronRight } from 'lucide-react';
import { WorkflowStatus } from '@/types';
import { AgentThinkingLog } from '../AgentThinkingLog';

interface OrchestratorTabProps {
    jiraIssueInput: string;
    setJiraIssueInput: (val: string) => void;
    handleJiraFetch: () => void;
    isJiraLoading: boolean;
    rawRequirements: string;
    setRawRequirements: (val: string) => void;
    runWorkflow: () => void;
    status: WorkflowStatus;
    thinkingProcess: string;
}

export const OrchestratorTab: React.FC<OrchestratorTabProps> = ({
    jiraIssueInput,
    setJiraIssueInput,
    handleJiraFetch,
    isJiraLoading,
    rawRequirements,
    setRawRequirements,
    runWorkflow,
    status,
    thinkingProcess
}) => {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
                    <h3 className="text-sm font-bold flex items-center gap-2">
                        <Database size={16} /> Jira Sync
                    </h3>
                    <div className="flex gap-2">
                        <label htmlFor="jira-ticket" className="sr-only">Jira Ticket ID</label>
                        <input
                            id="jira-ticket"
                            value={jiraIssueInput}
                            onChange={e => setJiraIssueInput(e.target.value)}
                            placeholder="Ticket ID (e.g., AUTH-101)"
                            className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 focus:border-transparent transition-all"
                            aria-label="Jira ticket ID"
                            aria-describedby="jira-help"
                        />
                        <button
                            onClick={handleJiraFetch}
                            disabled={isJiraLoading || !jiraIssueInput.trim()}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 transition-all"
                            aria-busy={isJiraLoading}
                            aria-label="Fetch requirements from Jira"
                        >
                            {isJiraLoading ? (
                                <span className="inline-flex items-center gap-1">
                                    <Loader2 size={14} className="animate-spin" /> Syncing...
                                </span>
                            ) : (
                                'Fetch'
                            )}
                        </button>
                    </div>
                    <p id="jira-help" className="text-xs text-slate-500 mt-1">
                        💡 Enter your Jira ticket ID to pull requirements directly
                    </p>
                </div>
                <div className="bg-white p-6 rounded-2xl border shadow-sm flex items-center gap-4">
                    <Github size={32} className="text-slate-400" />
                    <div>
                        <h3 className="text-sm font-bold">GitHub Repository</h3>
                        <p className="text-xs text-slate-400">repo: core-testing-matrix</p>
                    </div>
                </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-4">
                <h3 className="font-bold">Requirement Staging</h3>
                <label htmlFor="requirements-input" className="block text-sm font-semibold text-slate-700 mb-2">
                    Requirements
                </label>
                <textarea
                    id="requirements-input"
                    value={rawRequirements}
                    onChange={e => setRawRequirements(e.target.value)}
                    className="w-full h-40 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 focus:border-transparent transition-all resize-none"
                    placeholder="Paste requirements, PRD, or user stories here..."
                    aria-label="Raw requirements input"
                    aria-describedby="requirements-help"
                />
                <div className="flex justify-between items-center mt-2">
                    <p id="requirements-help" className="text-xs text-slate-500">
                        💡 Include business requirements, acceptance criteria, and edge cases for best results
                    </p>
                    <span className="text-xs text-slate-500">{rawRequirements.length} characters</span>
                </div>
                <div className="flex justify-end">
                    <button
                        onClick={runWorkflow}
                        disabled={status !== WorkflowStatus.IDLE || !rawRequirements.trim()}
                        aria-busy={status !== WorkflowStatus.IDLE}
                        aria-label="Launch multi-agent QA pipeline"
                        className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed disabled:shadow-none focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 transition-all flex items-center gap-2"
                    >
                        {status !== WorkflowStatus.IDLE && <Loader2 size={16} className="animate-spin" />}
                        {status === WorkflowStatus.IDLE
                            ? 'Launch Pipeline'
                            : `Running: ${status.replace(/_/g, ' ')}`}
                        {status === WorkflowStatus.IDLE && <ChevronRight size={16} />}
                    </button>
                </div>
            </div>

            <AgentThinkingLog thinkingProcess={thinkingProcess} />
        </div>
    );
};
