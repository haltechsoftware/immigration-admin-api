import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LoginAttemptService } from './login-attempt.service';

const MINUTE = 60 * 1000;

describe('LoginAttemptService', () => {
  let service: LoginAttemptService;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-17T00:00:00Z'));
    service = new LoginAttemptService();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const fail = (email: string, times: number) => {
    for (let i = 0; i < times; i++) service.recordFailure(email);
  };

  it('locks an email after 5 failures within the window', () => {
    fail('admin@example.com', 4);
    expect(service.isLocked('admin@example.com')).toBe(false);

    fail('admin@example.com', 1);
    expect(service.isLocked('admin@example.com')).toBe(true);
  });

  it('normalises email case and whitespace', () => {
    fail(' Admin@Example.com ', 5);
    expect(service.isLocked('admin@example.com')).toBe(true);
  });

  it('unlocks after 15 minutes', () => {
    fail('admin@example.com', 5);

    vi.advanceTimersByTime(15 * MINUTE - 1);
    expect(service.isLocked('admin@example.com')).toBe(true);

    vi.advanceTimersByTime(1);
    expect(service.isLocked('admin@example.com')).toBe(false);
  });

  it('starts a new window when failures are spread out', () => {
    fail('admin@example.com', 4);
    vi.advanceTimersByTime(15 * MINUTE);
    fail('admin@example.com', 1);

    expect(service.isLocked('admin@example.com')).toBe(false);
  });

  it('reset clears the failure count', () => {
    fail('admin@example.com', 4);
    service.reset('admin@example.com');
    fail('admin@example.com', 4);

    expect(service.isLocked('admin@example.com')).toBe(false);
  });

  it('tracks emails independently', () => {
    fail('a@example.com', 5);
    expect(service.isLocked('b@example.com')).toBe(false);
  });
});
