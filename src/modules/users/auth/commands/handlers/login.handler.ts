import {
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcryptjs';
import * as crypto from 'node:crypto';
import { IJwtPayload } from 'src/common/interface/jwt-payload.interface';
import { LoginDtoType } from '../../dtos/login.dto';
import { AuthRepository } from '../../repositories/auth.repository';
import { LoginAttemptService } from '../../services/login-attempt.service';
import LoginCommand from '../impl/login.command';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    private readonly _repository: AuthRepository,
    private readonly _generateJwt: JwtService,
    private readonly _loginAttempts: LoginAttemptService,
  ) {}

  private async _checkUser(dto: LoginDtoType) {
    if (this._loginAttempts.isLocked(dto.email))
      throw new HttpException(
        {
          message:
            'ເຂົ້າສູ່ລະບົບຜິດພາດຫຼາຍເທື່ອເກີນໄປ. ກະລຸນາລອງໃໝ່ພາຍຫຼັງ 15 ນາທີ.',
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );

    const user = await this._repository.checkUser(dto.email);
    if (!user || !compareSync(dto.password, user.password)) {
      this._loginAttempts.recordFailure(dto.email);
      throw new UnauthorizedException({
        message:
          'ຊື່ຜູ້ໃຊ້ ຫຼືລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ. ກະລຸນາກວດເບິ່ງຂໍ້ມູນປະຈໍາຕົວຂອງທ່ານ.',
      });
    }

    this._loginAttempts.reset(dto.email);

    // Never return the password hash to the client.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user;
    return safeUser;
  }

  async execute({ dto }: LoginCommand) {
    const user = await this._checkUser(dto);

    const token_id = crypto.randomUUID();

    await this._repository.createSession({ id: token_id, user_id: user.id });

    const permissionNames: string[] = [];

    if (user.roles)
      user.roles.forEach(({ permissions }) => {
        if (permissions)
          permissions.forEach(({ name }) => {
            if (!permissionNames.includes(name)) permissionNames.push(name);
          });
      });

    const payload: IJwtPayload = {
      token_id: token_id,
      sub: String(user.id),
      hotel_id: user.hotel_id,
      roles: user.roles.map((val) => val.name),
      permissions: permissionNames,
    };

    delete user.usersToRoles;

    return {
      access_token: await this._generateJwt.signAsync(payload, {
        expiresIn: '1y',
      }),
      user,
      permissions: permissionNames,
      roles: user.roles.map((val) => val.name),
    };
  }
}
