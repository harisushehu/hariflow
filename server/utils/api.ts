// API utilities for request/response handling

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export function createSuccessResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
  };
}

export function createErrorResponse(error: string): ApiResponse<null> {
  return {
    success: false,
    error,
  };
}

export function createPaginatedResponse<T>(
  items: T[],
  total: number,
  page: number,
  pageSize: number
): PaginatedResponse<T> {
  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export function parsePaginationParams(page?: string, pageSize?: string) {
  const parsedPage = page ? Math.max(1, parseInt(page)) : 1;
  const parsedPageSize = pageSize ? Math.min(100, Math.max(1, parseInt(pageSize))) : 20;
  return { page: parsedPage, pageSize: parsedPageSize };
}

export function calculateOffset(page: number, pageSize: number): number {
  return (page - 1) * pageSize;
}

export interface QueryParams {
  [key: string]: string | string[] | undefined;
}

export function parseQueryParams(query: QueryParams): Record<string, any> {
  const result: Record<string, any> = {};

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined) continue;

    if (Array.isArray(value)) {
      result[key] = value.length === 1 ? value[0] : value;
    } else {
      result[key] = value;
    }
  }

  return result;
}

export function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined) continue;

    if (Array.isArray(value)) {
      value.forEach((v) => searchParams.append(key, String(v)));
    } else {
      searchParams.set(key, String(value));
    }
  }

  const query = searchParams.toString();
  return query ? `?${query}` : '';
}
