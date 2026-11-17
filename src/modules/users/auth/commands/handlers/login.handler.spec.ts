import { HttpStatus, UnauthorizedException } from '@nestjs/common';
import { hashSync } from 'bcryptjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LoginAttemptService } from '../../services/login-attempt.service';
import LoginCommand from '../impl/login.command';
import { LoginHandler } from './login.handler';

const PASSWORD = 'correct-password';
const HASH = hashSync(PASSWORD, 4);

describe('LoginHandler', () => {
  let repository: {
    checkUser: ReturnType<typeof vi.fn>;
    createSession: ReturnType<typeof vi.fn>;
  };
  let loginAttempts: LoginAttemptService;
  let handler: LoginHandler;

  beforeEach(() => {
    repository = {
      checkUser: vi.fn(async (email: string) =>
        email === 'admin@example.com'
          ? {
              id: 1,
              email,
              password: HASH,
              hotel_id: null,
              profile: null,
              usersToRoles: [],
              roles: [{ name: 'admin', permissions: [{ name: 'read' }] }],
            }
          : undefined,
      ),
      createSession: vi.fn(async () => undefined),
    };
    loginAttempts = new LoginAttemptService();
    handler = new LoginHandler(
      repository as any,
      { signAsync: vi.fn(async () => 'token') } as any,
      loginAttempts,
    );
  });

  const login = (email: string, password: string) =>
    handler.execute(new LoginCommand({ email, password }));

  it('does not return the password hash', async () => {
    const res = await login('admin@example.com', PASSWORD);

    expect(res.access_token).toBe('token');
    expect(res.user).not.toHaveProperty('password');
    expect(res.roles).toEqual(['admin']);
  });

  it('returns 429 after 5 failures, even with the correct password', async () => {
    for (let i = 0; i < 5; i++)
      await expect(login('admin@example.com', 'wrong-pass')).rejects.toThrow(
        UnauthorizedException,
      );

    await expect(login('admin@example.com', PASSWORD)).rejects.toMatchObject({
      status: HttpStatus.TOO_MANY_REQUESTS,
    });
    expect(repository.createSession).not.toHaveBeenCalled();
  });

  it('locks unknown emails the same way', async () => {
    for (let i = 0; i < 5; i++)
      await expect(login('nobody@example.com', 'wrong-pass')).rejects.toThrow(
        UnauthorizedException,
      );

    await expect(
      login('nobody@example.com', 'wrong-pass'),
    ).rejects.toMatchObject({ status: HttpStatus.TOO_MANY_REQUESTS });
  });

  it('resets the failure count on success', async () => {
    for (let i = 0; i < 4; i++)
      await expect(login('admin@example.com', 'wrong-pass')).rejects.toThrow();

    await login('admin@example.com', PASSWORD);

    for (let i = 0; i < 4; i++)
      await expect(login('admin@example.com', 'wrong-pass')).rejects.toThrow();
    await expect(login('admin@example.com', PASSWORD)).resolves.toBeDefined();
  });
});
