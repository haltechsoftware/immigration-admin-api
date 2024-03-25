import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BannerRepository } from "../../banner.repository";
import { NodeFileUploadService } from "src/infrastructure/file-upload/node/node-file-upload.service";
import { UpdateBannerCommand } from "../impl/updata.command";
import { format } from "date-fns";
import { DateTimeFormat } from "src/common/enum/date-time-fomat.enum";

@CommandHandler(UpdateBannerCommand)
export class UpdateBannerHandler implements ICommandHandler<UpdateBannerCommand> {
    constructor(
        private readonly _repository: BannerRepository,
        private readonly fileUpload: NodeFileUploadService,
    ) { }

    async execute({ id, input }: UpdateBannerCommand): Promise<any> {

        const banner = await this._repository.findOne(id);
        if (!banner) {
            throw new Error(`Banner with id ${id} not found`);
        }

        let imageUrl: string | undefined;
        if (input.image) {
            await this.fileUpload.remove(banner.image);
            imageUrl = await this.fileUpload.upload(
                'profile/',
                input.image.buffer,
                input.image.originalName,
            );
        }

        const startTimeFormat = format(new Date(input.start_time), DateTimeFormat.Timestamp);
        const endTimeFormat = format(new Date(input.end_time), DateTimeFormat.Timestamp);
      
        const startTime = new Date(startTimeFormat);
        const endTime = new Date(endTimeFormat);

        if (startTime >= endTime) {
            return Promise.resolve('ບໍ່ສາມາດປ້ອນ ວັນທີເລີ່ມຕົ້ນ ຫຼາຍກວ່າ ວັນທີ່ສິ້ນສຸດ')
        }
        const bannerData = {
            id,
            image: imageUrl,
            link: input.link,
            start_time: startTime,
            end_time: endTime,
            updated_at: format(new Date(), DateTimeFormat.Timestamp),
            is_private: input.is_private,
            translate_lo: { title: input.lo_title, lang: input.lo_lng, description: input.lo_description },
            translate_en: { title: input.en_title, lang: input.en_lng, description: input.en_description },
            translate_zh_cn: { title: input.zh_cn_title, lang: input.zh_cn_lng, description: input.zh_cn_description }

        };
        await this._repository.update(bannerData)

        return { status: 201, message: 'ແກ້ໄຂຂໍ້ມູນສຳເລັດ' }; // Return updated banner object
    }
}
