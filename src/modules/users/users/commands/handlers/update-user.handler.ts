import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { hash } from 'bcrypt';
import { format } from 'date-fns';
import { DateTimeFormat } from 'src/common/enum/date-time-fomat.enum';
import { IFileUpload } from 'src/infrastructure/file-upload/file-upload.interface';
import { FILE_UPLOAD_SERVICE } from 'src/infrastructure/file-upload/inject-key';
import { UserRepository } from '../../user.repository';
import UpdateUserCommand from '../impl/update-user.command';

@CommandHandler(UpdateUserCommand)
export default class UpdateUserHandler
  implements ICommandHandler<UpdateUserCommand, string>
{
  constructor(
    private readonly repository: UserRepository,
    @Inject(FILE_UPLOAD_SERVICE) private readonly fileUpload: IFileUpload,
  ) {}

  async execute({ id, dto }: UpdateUserCommand): Promise<string> {
    const user = await this.repository.getById(id);

    if (!user)
      throw new NotFoundException({ message: 'ຜູ້ໃຊ້ນີ້ບໍ່ມີໃນລະບົບ' });

    let imageUrl: string | undefined;
    if (dto.image) {
      await this.fileUpload.remove(user.profile.image);

      imageUrl = await this.fileUpload.upload(
        'profile/',
        dto.image.buffer,
        dto.image.originalName,
      );
    }

    await this.repository.update({
      id,
      email: dto.email,
      password: dto.password ? await hash(dto.password, 10) : undefined,
      updated_at: format(new Date(), DateTimeFormat.Timestamp),
      profile: {
        first_name: dto.first_name,
        last_name: dto.last_name,
        image: imageUrl,
        updated_at: format(new Date(), DateTimeFormat.Timestamp),
      },
      roleIds: dto.role_ids,
    });

    return 'ອັບເດດຜູ້ໃຊ້ສຳເລັດ';
  }
}
