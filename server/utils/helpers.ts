// Common utility functions

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function calculatePercentage(current: number, total: number): number {
  return total > 0 ? Math.round((current / total) * 100) : 0;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function sanitizeInput(input: string): string {
  return input.replace(/[<>]/g, '').trim();
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function groupBy<T>(array: T[], key: keyof T): { [key: string]: T[] } {
  return array.reduce(
    (result, item) => {
      const group = String(item[key]);
      if (!result[group]) {
        result[group] = [];
      }
      result[group].push(item);
      return result;
    },
    {} as { [key: string]: T[] }
  );
}

export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

export function flatten<T>(array: T[][]): T[] {
  return array.reduce((acc, val) => acc.concat(val), []);
}

export function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach((key) => {
    result[key] = obj[key];
  });
  return result;
}

export function omit<T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj };
  keys.forEach((key) => {
    delete result[key];
  });
  return result;
}

export function merge<T extends object>(target: T, source: Partial<T>): T {
  return { ...target, ...source };
}

export function isEmptyObject(obj: object): boolean {
  return Object.keys(obj).length === 0;
}

export function getRandomElement<T>(array: T[]): T | undefined {
  return array[Math.floor(Math.random() * array.length)];
}

export function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export function sum(numbers: number[]): number {
  return numbers.reduce((acc, num) => acc + num, 0);
}

export function average(numbers: number[]): number {
  return numbers.length > 0 ? sum(numbers) / numbers.length : 0;
}

export function max(numbers: number[]): number {
  return Math.max(...numbers);
}

export function min(numbers: number[]): number {
  return Math.min(...numbers);
}
