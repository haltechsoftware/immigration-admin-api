import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CommandBus } from '@nestjs/cqrs';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import RemoveSessionCommand from 'src/modules/users/auth/commands/impl/remove-session.command';
import { AuthRepository } from 'src/modules/users/auth/repositories/auth.repository';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { JwtErrorCode } from '../enum/jwt-error-code.enum';
import { IJwtPayload } from '../interface/jwt-payload.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly repository: AuthRepository,
    private readonly jwt: JwtService,
    private readonly commandBus: CommandBus,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const req = context.switchToHttp().getRequest();

    const authHeader = req.headers.authorization;

    if (!authHeader)
      throw new UnauthorizedException({
        message: 'ບໍ່ມີ Authorization header.',
        code: JwtErrorCode.MissingToken,
      });

    const token = authHeader.split(' ')[1];

    if (!token)
      throw new UnauthorizedException({
        message: 'ຮູບແບບຂອງ Authorization header ບໍ່ຖືກຕ້ອງ.',
        code: JwtErrorCode.InvalidTokenFormat,
      });

    try {
      const payload = await this.jwt.verifyAsync<IJwtPayload>(token);

      const session = await this.repository.getSession(payload.token_id);

      if (!session)
        throw new UnauthorizedException({
          message: 'ບໍ່ມີການເຂົ້າສູລະບົບ ກະລຸນາເຂົ້າສູ່ລະບົບກ່ອນ',
        });

      req.user = payload;
    } catch (error) {
      switch (true) {
        case error instanceof JsonWebTokenError:
          throw new UnauthorizedException({
            message: 'ໂທເຄັນ JWT ບໍ່ຖືກຕ້ອງ.',
            code: JwtErrorCode.InvalidToken,
          });

        case error instanceof TokenExpiredError:
          const payload = this.jwt.decode<IJwtPayload>(token);

          await this.commandBus.execute<RemoveSessionCommand>(
            new RemoveSessionCommand(payload.token_id),
          );

          throw new UnauthorizedException({
            message: 'JWT token ໝົດອາຍຸ.',
            code: JwtErrorCode.TokenExpired,
          });
        default:
          if (error instanceof HttpException) {
            throw error;
          }

          console.error(error);

          throw new UnauthorizedException({
            message: 'ເກີດຄວາມຜິດພາດທີ່ບໍ່ຄາດຄິດ',
            code: JwtErrorCode.InvalidToken,
          });
      }
    }

    return true;
  }
}
