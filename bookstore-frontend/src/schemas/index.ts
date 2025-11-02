/**
 * Validation Schemas
 *
 * Purpose: Data validation schemas for forms and API responses.
 *
 * Tech Stack:
 * - Zod (validation library)
 * - TypeScript type inference from schemas
 *
 * Example:
 * import { z } from 'zod'
 * export const loginSchema = z.object({
 *   email: z.string().email(),
 *   password: z.string().min(8)
 * })
 * export type LoginInput = z.infer<typeof loginSchema>
 */

export {};
