import { ConflictException, Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { format } from 'date-fns';
import { DateTimeFormat } from 'src/common/enum/date-time-fomat.enum';
import generateSlug from 'src/common/utils/generate-slug';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { IFileUpload } from 'src/infrastructure/file-upload/file-upload.interface';
import { FILE_UPLOAD_SERVICE } from 'src/infrastructure/file-upload/inject-key';
import { CheckpointRepository } from '../../checkpoint.repository';
import { UpdateCheckpointCommand } from '../impl/update.command';

@CommandHandler(UpdateCheckpointCommand)
export class UpdateCheckpointHandler
  implements ICommandHandler<UpdateCheckpointCommand>
{
  constructor(
    private readonly checkPointRepository: CheckpointRepository,
    @Inject(FILE_UPLOAD_SERVICE) private readonly fileUpload: IFileUpload,
    private readonly drizzle: DrizzleService,
  ) {}
  async execute({ input, id }: UpdateCheckpointCommand): Promise<any> {
    console.log(input);
    if (
      input.lo.name === input.en.name ||
      input.zh_cn.name === input.en.name ||
      input.zh_cn.name === input.lo.name
    )
      throw new ConflictException({ message: 'ຂໍ້ມູນຊ້ຳກັນ!' });

    // if (
    //     input.lo.time_operation === input.en.time_operation ||
    //     input.zh_cn.time_operation === input.en.time_operation ||
    //     input.zh_cn.time_operation === input.lo.time_operation
    //   )
    //     throw new ConflictException({ message: 'ເວລາປິດ-ເປີດ ດ່ານ ຊ້ຳກັນ!' });

    const checkpoint = await this.checkPointRepository.findOne(id);

    if (!checkpoint)
      throw new NotFoundException({ message: 'ຂໍ້ມູນນີ້ບໍ່ມີໃນລະບົບ' });

    const conflict = await this.drizzle
      .db()
      .query.checkpointTranslate.findMany({
        where: (f, o) =>
          o.or(
            o.and(o.not(o.eq(f.id, input.lo.id)), o.eq(f.name, input.lo.name)),
            o.and(o.not(o.eq(f.id, input.en.id)), o.eq(f.name, input.en.name)),
            o.and(
              o.not(o.eq(f.id, input.zh_cn.id)),
              o.eq(f.name, input.zh_cn.name),
            ),
          ),
      });

    if (conflict.length > 0)
      throw new ConflictException({ message: 'ຂໍ້ມູນຊ້ຳກັນ!' });

    let image: string | undefined;

    if (input.image) {
      if (checkpoint.image) await this.fileUpload.remove(checkpoint.image);
      image = await this.fileUpload.upload(
        'checkpoint/image/',
        input.image.buffer,
        input.image.originalName,
      );
    }

    await this.checkPointRepository.update({
      id: checkpoint.id,
      category_id: input.category_id,
      province_id: input.province_id,
      country: input.country as any,
      image,
      link_map: input.link_map,
      phone_number: input.phone_number,
      email: input.email,
      updated_at: format(new Date(), DateTimeFormat.Timestamp),
      visa: input.visa,
      e_visa: input.e_visa,
      is_open: input.is_open,
      translates: [
        {
          id: input.lo.id,
          name: input.lo.name,
          content: input.lo.content,
          address: input.lo.address,
          lang: 'lo',
          slug: generateSlug(input.lo.name),
          time_operation: input.lo.time_operation,
        },
        {
          id: input.en.id,
          name: input.en.name,
          content: input.en.content,
          address: input.en.address,
          lang: 'en',
          slug: generateSlug(input.en.name),
          time_operation: input.en.time_operation,
        },
        {
          id: input.zh_cn.id,
          name: input.zh_cn.name,
          content: input.zh_cn.content,
          address: input.zh_cn.address,
          lang: 'zh_cn',
          slug: generateSlug(input.zh_cn.name),
          time_operation: input.zh_cn.time_operation,
        },
      ],
    });

    return 'ແກ້ໄຂຂໍ້ມູນສຳເລັດ';
  }
}
