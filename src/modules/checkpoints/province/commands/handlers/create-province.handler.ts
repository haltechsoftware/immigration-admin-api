import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateProvinceCommand } from "../impl/create-province.command";
import { ProvinceRepository } from "../../province.repository";
import { generateSlugs } from "src/modules/checkpoints/helpers/slug-name";


@CommandHandler(CreateProvinceCommand)
export class CreateProvinceHandler implements ICommandHandler<CreateProvinceCommand> {
    constructor(
        private readonly provinceRepository: ProvinceRepository
    ) { }
    async execute({ input }: CreateProvinceCommand): Promise<any> {

        const slug = generateSlugs(input)
        await this.provinceRepository.create({
            translates: [
                {
                    name: input.en.name,
                    description: input.en.description,
                    lang: 'en',
                    slug: slug.en_name
                },
                {
                    name: input.lo.name,
                    description: input.lo.description,
                    lang: 'lo',
                    slug: slug.lo_name
                },
                {
                    name: input.zh_cn.name,
                    description: input.zh_cn.description,
                    lang: 'zh_cn',
                    slug: slug.zh_cn_name
                },
            ]
        })
        return { message: 'ເພີ່ມຂໍ້ມູນສຳເລັດ' }
    }
}