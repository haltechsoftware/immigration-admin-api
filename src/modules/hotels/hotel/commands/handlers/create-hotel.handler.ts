import { ConflictException, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { IFileUpload } from 'src/infrastructure/file-upload/file-upload.interface';
import { FILE_UPLOAD_SERVICE } from '../../../../../infrastructure/file-upload/inject-key';
import { HotelRepository } from '../../hotel.repository';
import CreateHotelCommand from '../imp/create-hotel.command';
import { hash } from 'bcryptjs';

@CommandHandler(CreateHotelCommand)
export default class CreateHotelHandler
  implements ICommandHandler<CreateHotelCommand, string>
{
  constructor(
    private readonly repository: HotelRepository,
    @Inject(FILE_UPLOAD_SERVICE) private readonly fileUpload: IFileUpload,
    private readonly drizzle: DrizzleService,
  ) {}
  async execute({ input }: CreateHotelCommand): Promise<any> {
    if (input.user) {
      const conflict = await this.drizzle.db().query.users.findFirst({
        where: ({ email }, { eq }) => eq(email, input.user.email),
      });

      if (conflict) throw new ConflictException({ message: 'ອີເມວຊ້ຳກັນ!' });
    }

    const image = await this.fileUpload.upload(
      'hotel/image/',
      input.image.buffer,
      input.image.originalName,
    );

    await this.repository.create(
      {
        image,
        link: input.link,
        phone_number: input.phone_number,
        is_published: input.is_published,
        translates: [
          {
            name: input.lo.name,
            lang: 'lo',
            province: input.lo.province,
            district: input.lo.district,
            village: input.lo.village,
          },
          {
            name: input.en.name,
            lang: 'en',
            province: input.en.province,
            district: input.en.district,
            village: input.en.village,
          },
          {
            name: input.zh_cn.name,
            lang: 'zh_cn',
            province: input.zh_cn.province,
            district: input.zh_cn.district,
            village: input.zh_cn.village,
          },
        ],
      },
      input.user
        ? {
            email: input.user.email,
            password: await hash(input.user.password, 10),
          }
        : undefined,
    );

    return 'ບັນທຶກຂໍ້ມູນໂຮງແຮມສຳເລັດ';
  }
}
