import { env } from '../config/env';
import { BraveNewsRepository } from './BraveNewsRepository';
import { MockNewsRepository } from './MockNewsRepository';
import type { NewsRepository } from './types';

export * from './types';
export { BraveNewsRepository } from './BraveNewsRepository';
export { MockNewsRepository } from './MockNewsRepository';

/**
 * Factory function to get the appropriate NewsRepository implementation
 */
export function getNewsRepository(): NewsRepository {
  if (env.features.useMockNews) {
    return new MockNewsRepository();
  }
  return new BraveNewsRepository();
}
