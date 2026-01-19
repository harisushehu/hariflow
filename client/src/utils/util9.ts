// Frontend utility i

export function formati(value: any): string {
  if (value === null || value === undefined) {
    return '';
  }
  return String(value);
}

export function parsei(value: string): any {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

export function validatei(value: any): boolean {
  return value !== null && value !== undefined && value !== '';
}

export function transformi(value: any): any {
  if (typeof value === 'string') {
    return value.trim().toLowerCase();
  }
  return value;
}

export function comparei(a: any, b: any): number {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

export function debouncei(fn: Function, delay: number): Function {
  let timeoutId: NodeJS.Timeout;
  return function (...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function throttlei(fn: Function, delay: number): Function {
  let lastCall = 0;
  return function (...args: any[]) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      fn(...args);
      lastCall = now;
    }
  };
}

export function memoizei(fn: Function): Function {
  const cache = new Map();
  return function (...args: any[]) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}
