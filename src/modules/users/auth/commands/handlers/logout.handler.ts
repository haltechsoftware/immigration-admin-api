import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthRepository } from '../../repositories/auth.repository';
import LogoutCommand from '../impl/logout.command';

@CommandHandler(LogoutCommand)
export class LogoutHandler implements ICommandHandler<LogoutCommand, string> {
  constructor(private readonly _repository: AuthRepository) {}

  async execute({ tokenId }: LogoutCommand): Promise<string> {
    const session = await this._repository.getSession(tokenId);

    if (!session) throw new NotFoundException({ message: 'ບໍ່ພົບ Session' });

    await this._repository.removeSession(session.id);

    return 'ອອກຈາກລະບົບສຳເລັດແລ້ວ';
  }
}
