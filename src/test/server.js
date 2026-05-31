import { setupServer } from 'msw/node'
import { handlers } from './handlers'

/**
 * MSW server for Node (used in Vitest / jsdom environment).
 * Import this in individual test files or in setup.ts for global use.
 */
export const server = setupServer(...handlers)
