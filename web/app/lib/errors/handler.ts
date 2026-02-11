import { NextResponse } from 'next/server';
import { handleApiError } from './api-response';

type RouteHandler = (request: Request, context?: unknown) => Promise<NextResponse>;

export function withErrorHandler(handler: RouteHandler): RouteHandler {
  return async (request: Request, context?: unknown) => {
    try {
      return await handler(request, context);
    } catch (error) {
      return handleApiError(error);
    }
  };
}
