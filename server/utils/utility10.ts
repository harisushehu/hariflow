// Utility module i

export function transformi(data: any): any {
  return {
    ...data,
    transformed: true,
    transformedAt: new Date(),
    transformerId: 1,
  };
}

export function validatei(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data) {
    errors.push('Data is required');
  }

  if (typeof data !== 'object') {
    errors.push('Data must be an object');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function formati(data: any): string {
  try {
    return JSON.stringify(data, null, 2);
  } catch (error) {
    return String(data);
  }
}

export function parsei(str: string): any {
  try {
    return JSON.parse(str);
  } catch (error) {
    return null;
  }
}

export function mergei(obj1: any, obj2: any): any {
  return { ...obj1, ...obj2 };
}

export function clonei(obj: any): any {
  return JSON.parse(JSON.stringify(obj));
}

export function filteri(items: any[], predicate: (item: any) => boolean): any[] {
  return items.filter(predicate);
}

export function mapi(items: any[], mapper: (item: any) => any): any[] {
  return items.map(mapper);
}

export function reducei(items: any[], reducer: (acc: any, item: any) => any, initial: any): any {
  return items.reduce(reducer, initial);
}

export function debouncei(fn: Function, delay: number): Function {
  let timeoutId: NodeJS.Timeout;
  return function (...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}
