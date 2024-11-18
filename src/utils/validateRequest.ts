import { ZodSchema } from 'zod';
import { NextRequest } from 'next/server';
import { ZodError } from 'zod';

/**
 * Validates the incoming request against the provided Zod schema.
 *
 * @param req - The NextRequest object.
 * @param schema - The Zod schema to validate against.
 * @returns An object containing success status and either the parsed data or validation errors.
 */
export async function validateRequest<T>(
  req: NextRequest,
  schema: ZodSchema<T>
): Promise<{ success: boolean; data?: T; errors?: ZodError }> {
  try {
    const body = await req.json();
    const parsed = schema.parse(body);
    return { success: true, data: parsed };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, errors: error };
    }
    throw error; // Re-throw unexpected errors
  }
}
