import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { generateSlugs } from "src/modules/checkpoints/helpers/slug-name";
import { UpdateCountryCommand } from "../impl/update-country.command";
import { format } from "date-fns";
import { DateTimeFormat } from "src/common/enum/date-time-fomat.enum";
import { Inject, NotFoundException } from "@nestjs/common";
import { CountryRepository } from "../../country.repository";
import { FILE_UPLOAD_SERVICE } from "src/infrastructure/file-upload/inject-key";
import { IFileUpload } from "src/infrastructure/file-upload/file-upload.interface";


@CommandHandler(UpdateCountryCommand)
export class UpdateCountryHandler implements ICommandHandler<UpdateCountryCommand> {
    constructor(
        private readonly countryRepository: CountryRepository,
        @Inject(FILE_UPLOAD_SERVICE) private readonly fileUpload: IFileUpload,
    ) { }
    async execute({ input, id }: UpdateCountryCommand): Promise<any> {
        const provinceIdsArray: number[] = JSON.parse(input.province_ids);
        const country = await this.countryRepository.findOne(id)
        if (!country) throw new NotFoundException({ message: 'ປະເທດນີ້ບໍ່ມີໃນລະບົບ' })
        const slug = generateSlugs(input);
        let image: string | undefined;

        if (input.image) {
            await this.fileUpload.remove(country.image)
            image = await this.fileUpload.upload(
                'country/',
                input.image.buffer,
                input.image.originalName,
            );
        }
        await this.countryRepository.update({
            id: country.id,
            image: image,
            is_except_visa: input.is_except_visa,
            updated_at: format(new Date(), DateTimeFormat.Timestamp),
            translates: [
                {
                    id: input.en_id,
                    name: input.en_name,
                    description: input.en_description,
                    lang: 'en',
                    slug: slug.en_name
                },
                {
                    id: input.lo_id,
                    name: input.lo_name,
                    description: input.lo_description,
                    lang: 'lo',
                    slug: slug.lo_name
                },
                {
                    id: input.zh_cn_id,
                    name: input.zh_cn_name,
                    description: input.zh_cn_description,
                    lang: 'zh_cn',
                    slug: slug.zh_cn_name
                },
            ]
        }, provinceIdsArray)
        return { message: 'ແກ້ໄຂຂໍ້ມູນສຳເລັດ' }
    }
}