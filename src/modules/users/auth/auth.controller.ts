import { Controller, Get, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { Valibot } from 'src/common/decorators/valibot/valibot.decorator';
import { IJwtPayload } from 'src/common/interface/jwt-payload.interface';
import LoginCommand from './commands/impl/login.command';
import LogoutCommand from './commands/impl/logout.command';
import { LoginDto, LoginDtoType } from './dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly _commandBus: CommandBus) {}

  @Public()
  @Post('login')
  async login(@Valibot({ schema: LoginDto }) body: LoginDtoType) {
    return await this._commandBus.execute<LoginCommand>(new LoginCommand(body));
  }

  @Get('me')
  async getMe(@Auth() auth: IJwtPayload) {
    return auth;
  }

  @Post('logout')
  async logout(@Auth() auth: IJwtPayload) {
    const res = await this._commandBus.execute<LogoutCommand, string>(
      new LogoutCommand(auth.token_id),
    );

    return { message: res };
  }
}
