import { ConflictException, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import generateSlug from 'src/common/utils/generate-slug';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { IFileUpload } from 'src/infrastructure/file-upload/file-upload.interface';
import { FILE_UPLOAD_SERVICE } from 'src/infrastructure/file-upload/inject-key';
import { CheckpointRepository } from '../../checkpoint.repository';
import { CreateCheckPointCommand } from '../impl/create.command';

@CommandHandler(CreateCheckPointCommand)
export class CreateCheckpointHandler
  implements ICommandHandler<CreateCheckPointCommand>
{
  constructor(
    private readonly checkPointRepository: CheckpointRepository,
    @Inject(FILE_UPLOAD_SERVICE) private readonly fileUpload: IFileUpload,
    private readonly drizzle: DrizzleService,
  ) {}
  async execute({ input }: CreateCheckPointCommand): Promise<any> {
    if (
      input.lo.name === input.en.name ||
      input.zh_cn.name === input.en.name ||
      input.zh_cn.name === input.lo.name
    )
      throw new ConflictException({ message: 'ຂໍ້ມູນຊ້ຳກັນ!' });

    const conflict = await this.drizzle
      .db()
      .query.checkpointTranslate.findMany({
        where: (f, o) =>
          o.inArray(f.name, [input.lo.name, input.en.name, input.zh_cn.name]),
      });

    if (conflict.length > 0)
      throw new ConflictException({ message: 'ຂໍ້ມູນຊ້ຳກັນ!' });

    const image = await this.fileUpload.upload(
      'checkpoint/image/',
      input.image.buffer,
      input.image.originalName,
    );

    await this.checkPointRepository.create({
      category_id: input.category_id,
      province_id: input.province_id,
      image,
      link_map: input.link_map,
      phone_number: input.phone_number,
      email: input.email,
      translates: [
        {
          name: input.lo.name,
          content: input.lo.content,
          address: input.lo.address,
          lang: 'lo',
          slug: generateSlug(input.lo.name),
        },
        {
          name: input.en.name,
          content: input.en.content,
          address: input.en.address,
          lang: 'en',
          slug: generateSlug(input.en.name),
        },
        {
          name: input.zh_cn.name,
          content: input.zh_cn.content,
          address: input.zh_cn.address,
          lang: 'zh_cn',
          slug: generateSlug(input.zh_cn.name),
        },
      ],
    });

    return 'ເພີ່ມຂໍ້ມູນສຳເລັດ';
  }
}
