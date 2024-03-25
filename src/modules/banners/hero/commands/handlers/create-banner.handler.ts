import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateBannerCommand } from "../impl/create.command";
import { BannerRepository } from "../../banner.repository";
import { NodeFileUploadService } from "src/infrastructure/file-upload/node/node-file-upload.service";
import { format } from "date-fns";
import { DateTimeFormat } from "src/common/enum/date-time-fomat.enum";

@CommandHandler(CreateBannerCommand)
export class CreateBannerHandler implements ICommandHandler<CreateBannerCommand> {
  constructor(
    private readonly _repository: BannerRepository,
    private readonly fileUpload: NodeFileUploadService,
  ) { }

  async execute({ input }: CreateBannerCommand): Promise<any> {

    let image: string | undefined;
    if (input.image) {
      image = await this.fileUpload.upload(
        'profile/',
        input.image.buffer,
        input.image.originalName,
      );
    }

    const startTime = format(new Date(input.start_time), DateTimeFormat.Timestamp );
    const endTime = format(new Date(input.end_time), DateTimeFormat.Timestamp);
    const startDateFormate = new Date(startTime);
    const endDateFormate = new Date(endTime);

    if (startDateFormate >= endDateFormate) {
      return Promise.resolve('ບໍ່ສາມາດປ້ອນ ວັນທີເລີ່ມຕົ້ນ ຫຼາຍກວ່າ ວັນທີ່ສິ້ນສຸດ')
    }
    const bannerData = {
      image,
      link: input.link,
      start_time: startDateFormate,
      end_time: endDateFormate,
      is_private: input.is_private,
      translate_lo: { title: input.lo_title, lang: input.lo_lng, description: input.lo_description },
      translate_en: { title: input.en_title, lang: input.en_lng, description: input.en_description },
      translate_zh_cn: { title: input.zh_cn_title, lang: input.zh_cn_lng, description: input.zh_cn_description }

    };
    await this._repository.create(bannerData)
    return 'ບັນທຶກຂໍ້ມູນສຳເລັດ'
  }

}