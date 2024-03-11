import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { hash } from 'bcrypt';
import { NodeFileUploadService } from 'src/infrastructure/file-upload/node/node-file-upload.service';
import { UserRepository } from '../../user.repository';
import CreateUserCommand from '../impl/create-user.command';

@CommandHandler(CreateUserCommand)
export default class CreateUserHandler
  implements ICommandHandler<CreateUserCommand, string>
{
  constructor(
    private readonly repository: UserRepository,
    private readonly fileUpload: NodeFileUploadService,
  ) {}

  async execute({ dto }: CreateUserCommand): Promise<string> {
    const password = await hash(dto.password, 10);
    const image = await this.fileUpload.upload(
      'profile/',
      dto.image.buffer,
      dto.image.originalName,
    );

    await this.repository.create({
      email: dto.email,
      password,
      profile: { first_name: dto.first_name, last_name: dto.last_name, image },
      roleIds: dto.role_ids,
    });

    return 'ເພີ່ມຜູ້ໃຊ້ສຳເລັດ';
  }
}
