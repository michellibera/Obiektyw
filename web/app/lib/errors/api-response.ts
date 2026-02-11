import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { AppError, ValidationError } from './index';

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data?: T;
  [key: string]: unknown;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  code?: string;
  details?: unknown;
}

export function successResponse<T extends Record<string, unknown>>(
  data: T,
  status: number = 200
): NextResponse<ApiSuccessResponse & T> {
  return NextResponse.json(
    { success: true as const, ...data },
    { status }
  );
}

export function errorResponse(
  error: string,
  status: number = 500,
  details?: unknown,
  code?: string
): NextResponse<ApiErrorResponse> {
  const response: ApiErrorResponse = {
    success: false,
    error
  };

  if (code) response.code = code;
  if (details) response.details = details;

  return NextResponse.json(response, { status });
}

export function handleApiError(error: unknown): NextResponse<ApiErrorResponse> {
  console.error('API Error:', error);

  if (error instanceof ValidationError) {
    return errorResponse(
      error.message,
      error.statusCode,
      error.details,
      error.code
    );
  }

  if (error instanceof ZodError) {
    return errorResponse(
      'Invalid request data',
      400,
      error.flatten(),
      'VALIDATION_ERROR'
    );
  }

  if (error instanceof AppError) {
    return errorResponse(
      error.message,
      error.statusCode,
      undefined,
      error.code
    );
  }

  if (error instanceof Error) {
    return errorResponse(error.message, 500);
  }

  return errorResponse('Unknown error occurred', 500);
}
