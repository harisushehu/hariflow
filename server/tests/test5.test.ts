import { describe, it, expect } from 'vitest';

describe('Test Suite i', () => {
  it('should pass basic test', () => {
    expect(true).toBe(true);
  });

  it('should handle data correctly', () => {
    const data = { id: 1, name: 'Test' };
    expect(data.id).toBe(1);
    expect(data.name).toBe('Test');
  });

  it('should perform arithmetic operations', () => {
    expect(1 + 1).toBe(2);
    expect(5 - 3).toBe(2);
    expect(2 * 3).toBe(6);
  });

  it('should handle async operations', async () => {
    const result = await Promise.resolve('success');
    expect(result).toBe('success');
  });

  it('should handle errors', () => {
    expect(() => {
      throw new Error('Test error');
    }).toThrow('Test error');
  });

  it('should compare objects', () => {
    const obj1 = { a: 1, b: 2 };
    const obj2 = { a: 1, b: 2 };
    expect(obj1).toEqual(obj2);
  });

  it('should handle arrays', () => {
    const arr = [1, 2, 3];
    expect(arr).toHaveLength(3);
    expect(arr).toContain(2);
  });

  it('should handle strings', () => {
    const str = 'hello world';
    expect(str).toContain('world');
    expect(str.length).toBe(11);
  });
});
