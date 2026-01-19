// Custom error classes and error handling utilities

export class AppError extends Error {
  constructor(
    public code: string,
    public statusCode: number,
    message: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, any>) {
    super('VALIDATION_ERROR', 400, message, details);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id?: number | string) {
    const message = id ? `${resource} with id ${id} not found` : `${resource} not found`;
    super('NOT_FOUND', 404, message);
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super('UNAUTHORIZED', 401, message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super('FORBIDDEN', 403, message);
    this.name = 'ForbiddenError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string, details?: Record<string, any>) {
    super('CONFLICT', 409, message, details);
    this.name = 'ConflictError';
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = 'Internal Server Error', details?: Record<string, any>) {
    super('INTERNAL_SERVER_ERROR', 500, message, details);
    this.name = 'InternalServerError';
  }
}

export function handleError(error: unknown): { statusCode: number; message: string; code: string } {
  if (error instanceof AppError) {
    return {
      statusCode: error.statusCode,
      message: error.message,
      code: error.code,
    };
  }

  if (error instanceof Error) {
    return {
      statusCode: 500,
      message: error.message,
      code: 'INTERNAL_SERVER_ERROR',
    };
  }

  return {
    statusCode: 500,
    message: 'An unknown error occurred',
    code: 'UNKNOWN_ERROR',
  };
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function logError(error: unknown, context?: string): void {
  const timestamp = new Date().toISOString();
  const contextStr = context ? ` [${context}]` : '';

  if (error instanceof AppError) {
    console.error(`[${timestamp}] AppError${contextStr}: ${error.code} - ${error.message}`, error.details);
  } else if (error instanceof Error) {
    console.error(`[${timestamp}] Error${contextStr}: ${error.message}`, error.stack);
  } else {
    console.error(`[${timestamp}] Unknown Error${contextStr}:`, error);
  }
}
