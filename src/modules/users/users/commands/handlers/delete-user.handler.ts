import { ConflictException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NodeFileUploadService } from 'src/infrastructure/file-upload/node/node-file-upload.service';
import { UserRepository } from '../../user.repository';
import DeleteUserCommand from '../impl/delete-user.command';

@CommandHandler(DeleteUserCommand)
export default class DeleteUserHandler
  implements ICommandHandler<DeleteUserCommand, string>
{
  constructor(
    private readonly repository: UserRepository,
    private readonly fileUpload: NodeFileUploadService,
  ) {}

  async execute({ id }: DeleteUserCommand): Promise<string> {
    const user = await this.repository.getById(id);

    if (!user)
      throw new NotFoundException({ message: 'ຜູ້ໃຊ້ນີ້ບໍ່ມີໃນລະບົບ' });

    if (
      user.roles.some((val) => val.is_default === true) ||
      user.roles.some((val) => val.is_default === true)
    )
      throw new ConflictException({ message: 'ບໍ່ສາມາດລຶບຜູ້ໃຊ້ນີ້ໄດ້' });

    if (user.profile && user.profile.image)
      await this.fileUpload.remove(user.profile.image);

    await this.repository.remove(id);

    return 'ລຶບຜູ້ໃຊ້ສຳເລັດ';
  }
}
