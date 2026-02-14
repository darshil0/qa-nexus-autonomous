
import { logger } from "../utils/logger";

interface MemoryEntry {
  role: 'user' | 'assistant' | 'observation';
  content: string;
  timestamp: string;
}

/**
 * Agent Memory Service
 * Provides a short-term context buffer for agents to remember previous
 * interactions and findings within a single session.
 */
class MemoryService {
  private memory: MemoryEntry[] = [];
  private readonly MAX_MEMORIES = 20;

  /**
   * Add an entry to memory
   */
  public add(role: 'user' | 'assistant' | 'observation', content: string): void {
    this.memory.push({
      role,
      content,
      timestamp: new Date().toISOString()
    });

    // Keep memory within limits
    if (this.memory.length > this.MAX_MEMORIES) {
      this.memory.shift();
    }

    logger.info(`[Memory] Added ${role} entry. Buffer size: ${this.memory.length}`);
  }

  /**
   * Get all memories formatted for context
   */
  public getContext(): string {
    if (this.memory.length === 0) return "No previous session context.";

    return this.memory
      .map(m => `[${m.timestamp}] ${m.role.toUpperCase()}: ${m.content}`)
      .join("\n\n");
  }

  /**
   * Clear memory
   */
  public clear(): void {
    this.memory = [];
    logger.info("[Memory] Buffer cleared.");
  }
}

export const agentMemory = new MemoryService();
