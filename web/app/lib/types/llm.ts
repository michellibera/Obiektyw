/**
 * LLM Provider Types
 */

export type LlmProvider = 'azure' | 'anthropic';

export interface LlmPromptOptions {
  model?: string;
  max_tokens?: number;
  temperature?: number;
}
