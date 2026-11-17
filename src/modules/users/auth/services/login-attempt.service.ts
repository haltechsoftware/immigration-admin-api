import { Injectable } from '@nestjs/common';

const MAX_FAILURES = 5;
const WINDOW_MS = 15 * 60 * 1000;
const LOCK_MS = 15 * 60 * 1000;

interface AttemptState {
  failures: number;
  windowStart: number;
  lockedUntil: number;
}

/**
 * In-memory per-email login lockout. State resets on process restart and is
 * not shared across instances (single pm2 instance assumed).
 */
@Injectable()
export class LoginAttemptService {
  private readonly _attempts = new Map<string, AttemptState>();

  isLocked(email: string): boolean {
    const state = this._attempts.get(this._key(email));
    return !!state && state.lockedUntil > Date.now();
  }

  recordFailure(email: string): void {
    const key = this._key(email);
    const now = Date.now();
    const state = this._attempts.get(key);

    if (!state || now - state.windowStart >= WINDOW_MS) {
      this._attempts.set(key, {
        failures: 1,
        windowStart: now,
        lockedUntil: 0,
      });
      return;
    }

    state.failures += 1;
    if (state.failures >= MAX_FAILURES) state.lockedUntil = now + LOCK_MS;
  }

  reset(email: string): void {
    this._attempts.delete(this._key(email));
  }

  private _key(email: string): string {
    return email.trim().toLowerCase();
  }
}
