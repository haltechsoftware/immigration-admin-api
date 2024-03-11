import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthRepository } from '../../repositories/auth.repository';
import RemoveSessionCommand from '../impl/remove-session.command';

@CommandHandler(RemoveSessionCommand)
export class RemoveSessionHandler
  implements ICommandHandler<RemoveSessionCommand>
{
  constructor(private readonly _repository: AuthRepository) {}

  async execute({ tokenId }: RemoveSessionCommand): Promise<any> {
    const session = await this._repository.getSession(tokenId);

    if (!session) throw new NotFoundException({ message: 'ບໍ່ພົບ Session' });

    await this._repository.removeSession(session.id);
  }
}
