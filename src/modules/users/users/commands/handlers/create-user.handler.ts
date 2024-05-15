import { ConflictException, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { hash } from 'bcrypt';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { IFileUpload } from 'src/infrastructure/file-upload/file-upload.interface';
import { FILE_UPLOAD_SERVICE } from 'src/infrastructure/file-upload/inject-key';
import { UserRepository } from '../../user.repository';
import CreateUserCommand from '../impl/create-user.command';

@CommandHandler(CreateUserCommand)
export default class CreateUserHandler
  implements ICommandHandler<CreateUserCommand, string>
{
  constructor(
    private readonly repository: UserRepository,
    @Inject(FILE_UPLOAD_SERVICE) private readonly fileUpload: IFileUpload,
    private readonly drizzle: DrizzleService,
  ) {}

  async execute({ dto }: CreateUserCommand): Promise<string> {
    const conflict = await this.drizzle.db().query.users.findFirst({
      where: ({ email }, { eq }) => eq(email, dto.email),
    });

    if (conflict) throw new ConflictException({ message: 'ອີເມວຊ້ຳກັນ!' });

    const roles = await this.drizzle.db().query.roles.findMany({
      where: ({ id }, { inArray }) => inArray(id, dto.role_ids),
    });

    if (roles.length !== dto.role_ids.length)
      throw new ConflictException({ message: 'ບົດບາດບາງລາຍການບໍ່ມີໃນລະບົບ' });

    let image: string | undefined;

    if (dto.image) {
      image = await this.fileUpload.upload(
        'profile/',
        dto.image.buffer,
        dto.image.originalName,
      );
    }

    await this.repository.create({
      email: dto.email,
      password: await hash(dto.password, 10),
      profile: { first_name: dto.first_name, last_name: dto.last_name, image },
      roleIds: dto.role_ids,
    });

    return 'ເພີ່ມຜູ້ໃຊ້ສຳເລັດ';
  }
}
