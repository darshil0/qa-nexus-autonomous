
import { WorkflowState, WorkflowStatus } from "@/types";
import { logger } from "@/utils/logger";

const STORAGE_KEY = 'qa_nexus_state';

/**
 * Persistence Service
 * Handles saving and loading application state to/from LocalStorage.
 */
export const persistenceService = {
  /**
   * Save the current state to LocalStorage
   */
  saveState(state: WorkflowState): void {
    try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem(STORAGE_KEY, serializedState);
    } catch (err) {
      logger.error('Failed to save state to LocalStorage:', err);
      // If quota is exceeded, we might want to clear old data or notify the user
      if (err instanceof DOMException && err.name === 'QuotaExceededError') {
        logger.warn('LocalStorage quota exceeded. State may not be fully saved.');
      }
    }
  },

  /**
   * Load the state from LocalStorage
   */
  loadState(): WorkflowState | null {
    try {
      const serializedState = localStorage.getItem(STORAGE_KEY);
      if (serializedState === null) {
        return null;
      }

      const parsed = JSON.parse(serializedState) as WorkflowState;

      // Ensure we don't restore a "running" status which would be stale
      if (
        parsed.status === WorkflowStatus.AGENT1_REVIEWING ||
        parsed.status === WorkflowStatus.AGENT2_WRITING ||
        parsed.status === WorkflowStatus.AGENT3_EXECUTING
      ) {
        parsed.status = WorkflowStatus.IDLE;
        parsed.thinkingProcess = 'Session restored from storage.';
      }

      return parsed;
    } catch (err) {
      logger.error('Failed to load state from LocalStorage:', err);
      return null;
    }
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
