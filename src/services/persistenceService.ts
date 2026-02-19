
import { WorkflowState, WorkflowStatus } from "@/types";
import { logger } from "@/utils/logger";

const STORAGE_KEY = 'qa_nexus_state';

export const persistenceService = {
  getSBConfig() {
    return {
      url: import.meta.env.VITE_SUPABASE_URL as string,
      key: import.meta.env.VITE_SUPABASE_ANON_KEY as string
    };
  },
  saveState(state: WorkflowState): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      logger.error('Failed to save state to LocalStorage:', err);
    }
    const { url, key } = this.getSBConfig();
    if (url && key) { void this.saveToSupabase(state); }
  },
  async saveToSupabase(state: WorkflowState): Promise<void> {
    const { url, key } = this.getSBConfig();
    try {
      await fetch(`${url}/rest/v1/qa_nexus_sessions`, {
        method: 'POST',
        headers: { 'apikey': key, 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json', 'Prefer': 'resolution=merge-duplicates' },
        body: JSON.stringify({ state, updated_at: new Date().toISOString() })
      });
    } catch (err) { logger.error('Failed to save state to Supabase:', err); }
  },
  async loadState(): Promise<WorkflowState | null> {
    const { url, key } = this.getSBConfig();
    if (url && key) {
      const sbState = await this.loadFromSupabase();
      if (sbState) { return sbState; }
    }
    return this.loadFromLocalStorage();
  },
  loadFromLocalStorage(): WorkflowState | null {
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      return s ? this.sanitizeLoadedState(JSON.parse(s)) : null;
    } catch { return null; }
  },
  async loadFromSupabase(): Promise<WorkflowState | null> {
    const { url, key } = this.getSBConfig();
    if (!url || !key) { return null; }
    try {
      const res = await fetch(`${url}/rest/v1/qa_nexus_sessions?select=state&order=updated_at.desc&limit=1`, {
        headers: { 'apikey': key, 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      return data[0]?.state ? this.sanitizeLoadedState(data[0].state) : null;
    } catch { return null; }
  },
  sanitizeLoadedState(state: WorkflowState): WorkflowState {
    if ([WorkflowStatus.AGENT1_REVIEWING, WorkflowStatus.AGENT2_WRITING, WorkflowStatus.AGENT3_EXECUTING].includes(state.status)) {
      return { ...state, status: WorkflowStatus.IDLE, thinkingProcess: 'Session restored from storage.' };
    }
    return state;
  },
  clearState(): void { localStorage.removeItem(STORAGE_KEY); }
};
