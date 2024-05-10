import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateCountryCommand } from "../impl/create-country.command";
import { generateSlugs } from "src/modules/checkpoints/helpers/slug-name";
import { CountryRepository } from "../../country.repository";
import { Inject } from "@nestjs/common";
import { FILE_UPLOAD_SERVICE } from "src/infrastructure/file-upload/inject-key";
import { IFileUpload } from "src/infrastructure/file-upload/file-upload.interface";


@CommandHandler(CreateCountryCommand)
export class CreateCountryHandler implements ICommandHandler<CreateCountryCommand> {
    constructor(
        private readonly countryRepository: CountryRepository,
        @Inject(FILE_UPLOAD_SERVICE) private readonly fileUpload: IFileUpload,
    ) { }
    async execute({ input }: CreateCountryCommand): Promise<any> {
        const provinceIdsArray: number[] = JSON.parse(input.province_ids);
        const slug = generateSlugs(input);
        let image: string | undefined;

        if (input.image) {
            image = await this.fileUpload.upload(
                'country/',
                input.image.buffer,
                input.image.originalName,
            );
        }
        await this.countryRepository.create({
            image: image,
            is_except_visa: input.is_except_visa,
            translates: [
                {
                    name: input.en_name,
                    description: input.en_description,
                    lang: 'en',
                    slug: slug.en_name
                },
                {
                    name: input.lo_name,
                    description: input.lo_description,
                    lang: 'lo',
                    slug: slug.lo_name
                },
                {
                    name: input.zh_cn_name,
                    description: input.zh_cn_description,
                    lang: 'zh_cn',
                    slug: slug.zh_cn_name
                },
            ]
        },
            provinceIdsArray,
        )
        return { message: 'ເພີ່ມຂໍ້ມູນສຳເລັດ' }
    }
}