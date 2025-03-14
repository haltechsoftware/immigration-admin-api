import { ConflictException, Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { format } from 'date-fns';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { IFileUpload } from 'src/infrastructure/file-upload/file-upload.interface';
import { FILE_UPLOAD_SERVICE } from 'src/infrastructure/file-upload/inject-key';
import { DateTimeFormat } from '../../../../../common/enum/date-time-fomat.enum';
import { HotelRepository } from '../../hotel.repository';
import UpdateHotelCommand from '../imp/update-hotel.command';
import { hash } from 'bcryptjs';

@CommandHandler(UpdateHotelCommand)
export class UpdateHotelHandler implements ICommandHandler<UpdateHotelCommand> {
  constructor(
    private readonly repository: HotelRepository,
    @Inject(FILE_UPLOAD_SERVICE) private readonly fileUpload: IFileUpload,
    private readonly drizzle: DrizzleService,
  ) {}
  async execute({ id, input }: UpdateHotelCommand): Promise<any> {
    if (input.user) {
      let conflict = undefined;
      if (input.user.id) {
        conflict = await this.drizzle.db().query.users.findFirst({
          where: (f, { eq, and, not }) =>
            and(not(eq(f.id, input.user.id)), eq(f.email, input.user.email)),
        });
      } else {
        conflict = await this.drizzle.db().query.users.findFirst({
          where: ({ email }, { eq }) => eq(email, input.user.email),
        });
      }

      if (conflict) throw new ConflictException({ message: 'ອີເມວຊ້ຳກັນ!' });
    }

    const hotel = await this.repository.findOne(id);

    if (!hotel)
      throw new NotFoundException({ message: 'ໂຮງແຮມນີ້ບໍ່ມີໃນລະບົບ' });

    let imageUrl: string | undefined;

    if (input.image) {
      await this.fileUpload.remove(hotel.image);

      imageUrl = await this.fileUpload.upload(
        'hotel/image/',
        input.image.buffer,
        input.image.originalName,
      );
    }

    await this.repository.update(
      {
        id,
        image: imageUrl,
        link: input.link,
        phone_number: input.phone_number,
        updated_at: format(new Date(), DateTimeFormat.Timestamp),
        is_published: input.is_published,
        translates: [
          {
            lang: 'lo',
            id: input.lo.id,
            name: input.lo.name,
            province: input.lo.province,
            district: input.lo.district,
            village: input.lo.village,
          },
          {
            lang: 'en',
            id: input.en.id,
            name: input.en.name,
            province: input.en.province,
            district: input.en.district,
            village: input.en.village,
          },
          {
            lang: 'zh_cn',
            id: input.zh_cn.id,
            name: input.zh_cn.name,
            province: input.zh_cn.province,
            district: input.zh_cn.district,
            village: input.zh_cn.village,
          },
        ],
      },
      input.user
        ? {
            id: input.user.id ? input.user.id : undefined,
            email: input.user.email,
            password: input.user.password
              ? await hash(input.user.password, 10)
              : undefined,
          }
        : undefined,
    );

    return 'ແກ້ໄຂຂໍ້ມູນໂຮງແຮມສຳເລັດ';
  }
}
