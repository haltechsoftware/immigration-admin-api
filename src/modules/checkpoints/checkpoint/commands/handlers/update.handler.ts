import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { generateSlugs } from "src/modules/checkpoints/helpers/slug-name";
import { UpdateCheckpointCommand } from "../impl/update.command";
import { Inject, NotFoundException } from "@nestjs/common";
import { format } from "date-fns";
import { DateTimeFormat } from "src/common/enum/date-time-fomat.enum";
import { CheckpointRepository } from "../../checkpoint.repository";
import { FILE_UPLOAD_SERVICE } from "src/infrastructure/file-upload/inject-key";
import { IFileUpload } from "src/infrastructure/file-upload/file-upload.interface";


@CommandHandler(UpdateCheckpointCommand)
export class UpdateCheckpointHandler implements ICommandHandler<UpdateCheckpointCommand> {
    constructor(
        private readonly checkPointRepository: CheckpointRepository,
        @Inject(FILE_UPLOAD_SERVICE) private readonly fileUpload: IFileUpload,
    ) { }
    async execute({ input, id }: UpdateCheckpointCommand): Promise<any> {
        const checkpoint = await this.checkPointRepository.findOne(id)
        if (!checkpoint) throw new NotFoundException({ message: 'ຂໍ້ມູນນີ້ບໍ່ມີໃນລະບົບ' })
        const slug = generateSlugs(input);

        let image: string | undefined;
        if (input.image) {
            await this.fileUpload.remove(checkpoint.image);
            image = await this.fileUpload.upload(
                'checkpoint/',
                input.image.buffer,
                input.image.originalName,
            );
        }

        await this.checkPointRepository.update({
            id: checkpoint.id,
            category_id: input.category_id,
            country_id: input.country_id,
            province_id: input.province_id,
            image: image,
            link_map: input.link_map,
            phone_number: input.phone_number,
            email: input.email,
            updated_at: format(new Date(), DateTimeFormat.Timestamp),
            translates: [
                {
                    id: input.en_id,
                    name: input.en_name,
                    content: input.en_content,
                    address: input.en_address,
                    lang: 'en',
                    slug: slug.en_name
                },
                {
                    id: input.lo_id,
                    name: input.lo_name,
                    content: input.lo_content,
                    address: input.lo_address,
                    lang: 'lo',
                    slug: slug.lo_name
                },
                {
                    id: input.zh_cn_id,
                    name: input.zh_cn_name,
                    content: input.zh_cn_content,
                    address: input.zh_cn_address,
                    lang: 'zh_cn',
                    slug: slug.zh_cn_name
                },
            ]
        })
        return { message: 'ແກ້ໄຂຂໍ້ມູນສຳເລັດ' }
    }
}