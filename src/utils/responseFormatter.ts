/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from 'next/server';

/**
 * Defines the structure of the response options.
 * @template T - The type of the data field.
 */
interface ResponseOptions<T> {
  message: string;
  success: boolean;
  data?: T;
  errors?: any[];
}

/**
 * Formats and returns a standardized JSON response.
 *
 * @template T - The type of the data field.
 * @param options - The response options including message, success, data, and errors.
 * @param status - The HTTP status code.
 * @returns A NextResponse object with the formatted JSON.
 */
export function formatResponse<T>(
  options: ResponseOptions<T>,
  status: number
): NextResponse<ResponseOptions<T>> {
  return NextResponse.json(options, { status });
}
