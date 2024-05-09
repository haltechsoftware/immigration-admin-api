import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { generateSlugs } from "src/modules/checkpoints/helpers/slug-name";
import { CreateCheckPointCommand } from "../impl/create.command";
import { CheckpointRepository } from "../../checkpoint.repository";
import { Inject } from "@nestjs/common";
import { FILE_UPLOAD_SERVICE } from "src/infrastructure/file-upload/inject-key";
import { IFileUpload } from "src/infrastructure/file-upload/file-upload.interface";


@CommandHandler(CreateCheckPointCommand)
export class CreateCheckpointHandler implements ICommandHandler<CreateCheckPointCommand> {
    constructor(
        private readonly checkPointRepository: CheckpointRepository,
        @Inject(FILE_UPLOAD_SERVICE) private readonly fileUpload: IFileUpload,
    ) { }
    async execute({ input }: CreateCheckPointCommand): Promise<any> {
        const slug = generateSlugs(input);

        let image: string | undefined;
        if (input.image) {
            image = await this.fileUpload.upload(
                'checkpoint/',
                input.image.buffer,
                input.image.originalName,
            );
        }

        await this.checkPointRepository.create({
            category_id: input.category_id,
            country_id: input.country_id,
            province_id: input.province_id,
            image: image,
            link_map: input.link_map,
            phone_number: input.phone_number,
            email: input.email,

            translates: [
                {
                    name: input.en_name,
                    content: input.en_content,
                    address: input.en_address,
                    lang: 'en',
                    slug: slug.en_name
                },
                {
                    name: input.lo_name,
                    content: input.lo_content,
                    address: input.lo_address,
                    lang: 'lo',
                    slug: slug.lo_name
                },
                {
                    name: input.zh_cn_name,
                    content: input.zh_cn_content,
                    address: input.zh_cn_address,
                    lang: 'zh_cn',
                    slug: slug.zh_cn_name
                },
            ]
        })
        return { message: 'ເພີ່ມຂໍ້ມູນສຳເລັດ' }
    }
}