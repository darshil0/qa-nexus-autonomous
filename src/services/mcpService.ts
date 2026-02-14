
import { skillRegistry, Skill } from "./agenticSkills";
import { logger } from "../utils/logger";

/**
 * MCP Request types
 */
export type MCPRequest = {
  jsonrpc: "2.0";
  method: string;
  params: Record<string, unknown>;
  id: string | number;
};

/**
 * MCP Response types
 */
export type MCPResponse = {
  jsonrpc: "2.0";
  result?: unknown;
  error?: {
    code: number;
    message: string;
  };
  id: string | number;
};

/**
 * MCP Service
 * Implements a subset of the Model Context Protocol for tool discovery and execution.
 */
export class MCPService {
  /**
   * List available tools (skills)
   */
  public listTools(): Skill[] {
    return Object.values(skillRegistry);
  }

  /**
   * Handle an MCP request
   */
  public async handleRequest(request: MCPRequest): Promise<MCPResponse> {
    logger.info(`[MCP] Handling request: ${request.method}`, request.params);

    try {
      switch (request.method) {
        case "tools/list": {
          return {
            jsonrpc: "2.0",
            result: { tools: this.listTools() },
            id: request.id
          };
        }

        case "tools/call": {
          const params = request.params as { name: string; arguments: Record<string, string> };
          const { name, arguments: args } = params;
          const skill = skillRegistry[name];

          if (!skill) {
            return {
              jsonrpc: "2.0",
              error: { code: -32601, message: `Skill not found: ${name}` },
              id: request.id
            };
          }

          const skillArgs = Object.keys(skill.parameters).map(key => args[key]);
          const result = await skill.execute(...skillArgs);
          return {
            jsonrpc: "2.0",
            result,
            id: request.id
          };
        }

        default: {
          return {
            jsonrpc: "2.0",
            error: { code: -32601, message: `Method not found: ${request.method}` },
            id: request.id
          };
        }
      }
    } catch (error) {
      logger.error(`[MCP] Error handling request:`, error);
      return {
        jsonrpc: "2.0",
        error: { code: -32603, message: "Internal error" },
        id: request.id
      };
    }
  }
}

export const mcpService = new MCPService();
