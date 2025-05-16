
import { describe, it, expect } from 'vitest';
import { validatePassword } from '@/utils/passwordValidation';

describe('validatePassword', () => {
  it('returns invalid for short passwords', () => {
    const result = validatePassword('abc');
    expect(result.valid).toBe(false);
    expect(result.message).toContain('at least 8 characters');
    expect(result.score).toBe(0);
  });

  it('returns invalid for passwords missing complexity requirements', () => {
    const result = validatePassword('password');
    expect(result.valid).toBe(false);
    expect(result.message).toContain('uppercase letter');
    expect(result.score).toBe(2); // 1 for length, 1 for lowercase
  });

  it('validates passwords with sufficient complexity', () => {
    const result = validatePassword('Password1');
    expect(result.valid).toBe(true);
    expect(result.message).toBe('Password meets requirements');
    expect(result.score).toBe(4); // Length, uppercase, lowercase, number
  });

  it('gives highest score to passwords with all complexity requirements', () => {
    const result = validatePassword('Password1!');
    expect(result.valid).toBe(true);
    expect(result.score).toBe(5); // Length, uppercase, lowercase, number, special char
  });
});