
import { WorkflowState, WorkflowStatus } from "@/types";
import { logger } from "@/utils/logger";

const STORAGE_KEY = 'qa_nexus_state';
const SB_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SB_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

/**
 * Persistence Service
 * Handles saving and loading application state to/from LocalStorage and Supabase.
 */
export const persistenceService = {
  /**
   * Save the current state
   */
  saveState(state: WorkflowState): void {
    // 1. Save to LocalStorage (Immediate)
    try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem(STORAGE_KEY, serializedState);
    } catch (err) {
      logger.error('Failed to save state to LocalStorage:', err);
      if (err instanceof DOMException && err.name === 'QuotaExceededError') {
        logger.warn('LocalStorage quota exceeded. State may not be fully saved.');
      }
    }

    // 2. Save to Supabase (Background / Async)
    if (SB_URL && SB_KEY) {
      void this.saveToSupabase(state);
    }
  },

  /**
   * Async helper to save state to Supabase
   */
  async saveToSupabase(state: WorkflowState): Promise<void> {
    try {
      const response = await fetch(`${SB_URL}/rest/v1/qa_nexus_sessions`, {
        method: 'POST',
        headers: {
          'apikey': SB_KEY,
          'Authorization': `Bearer ${SB_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify({
          state,
          updated_at: new Date().toISOString()
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Supabase save failed: ${response.status} ${errorText}`);
      }
    } catch (err) {
      logger.error('Failed to save state to Supabase:', err);
    }
  },

  /**
   * Load the state
   */
  async loadState(): Promise<WorkflowState | null> {
    // 1. Attempt to load from Supabase first
    if (SB_URL && SB_KEY) {
      const sbState = await this.loadFromSupabase();
      if (sbState) {
        return sbState;
      }
    }

    // 2. Fall back to LocalStorage
    return this.loadFromLocalStorage();
  },

  /**
   * Helper to load from LocalStorage
   */
  loadFromLocalStorage(): WorkflowState | null {
    try {
      const serializedState = localStorage.getItem(STORAGE_KEY);
      if (serializedState === null) {
        return null;
      }

      const parsed = JSON.parse(serializedState) as WorkflowState;
      return this.sanitizeLoadedState(parsed);
    } catch (err) {
      logger.error('Failed to load state from LocalStorage:', err);
      return null;
    }
  },

  /**
   * Async helper to load most recent state from Supabase
   */
  async loadFromSupabase(): Promise<WorkflowState | null> {
    if (!SB_URL || !SB_KEY) { return null; }

    try {
      const response = await fetch(`${SB_URL}/rest/v1/qa_nexus_sessions?select=state&order=updated_at.desc&limit=1`, {
        method: 'GET',
        headers: {
          'apikey': SB_KEY,
          'Authorization': `Bearer ${SB_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Supabase load failed: ${response.status}`);
      }

      const data = await response.json() as { state: WorkflowState }[];
      const state = data[0]?.state || null;
      return state ? this.sanitizeLoadedState(state) : null;
    } catch (err) {
      logger.error('Failed to load state from Supabase:', err);
      return null;
    }
  },

  /**
   * Ensure we don't restore a "running" status which would be stale
   */
  sanitizeLoadedState(state: WorkflowState): WorkflowState {
    if (
      state.status === WorkflowStatus.AGENT1_REVIEWING ||
      state.status === WorkflowStatus.AGENT2_WRITING ||
      state.status === WorkflowStatus.AGENT3_EXECUTING
    ) {
      return {
        ...state,
        status: WorkflowStatus.IDLE,
        thinkingProcess: 'Session restored from storage.'
      };
    }
    return state;
  },

  /**
   * Clear the saved state
   */
  clearState(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      logger.error('Failed to clear state from LocalStorage:', err);
    }
  }
};
