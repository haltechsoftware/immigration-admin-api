import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ProvinceRepository } from "../../province.repository";
import { generateSlugs } from "src/modules/checkpoints/helpers/slug-name";
import { UpdateProvinceCommand } from "../impl/update-province.command";
import { format } from "date-fns";
import { DateTimeFormat } from "src/common/enum/date-time-fomat.enum";
import { NotFoundException } from "@nestjs/common";


@CommandHandler(UpdateProvinceCommand)
export class UpdateProvinceHandler implements ICommandHandler<UpdateProvinceCommand> {
    constructor(
        private readonly provinceRepository: ProvinceRepository
    ) { }
    async execute({ input, id }: UpdateProvinceCommand): Promise<any> {
        const province = await this.provinceRepository.findOne(id)
        if (!province) throw new NotFoundException({ message: 'ແຂວງນີ້ບໍ່ມີໃນລະບົບ' })
        const slug = generateSlugs(input)
        await this.provinceRepository.update({
            id: province.id,
            updated_at: format(new Date(), DateTimeFormat.Timestamp),
            translates: [
                {
                    id: input.en.id,
                    name: input.en.name,
                    description: input.en.description,
                    lang: 'en',
                    slug: slug.en_name
                },
                {
                    id: input.lo.id,
                    name: input.lo.name,
                    description: input.lo.description,
                    lang: 'lo',
                    slug: slug.lo_name
                },
                {
                    id: input.zh_cn.id,
                    name: input.zh_cn.name,
                    description: input.zh_cn.description,
                    lang: 'zh_cn',
                    slug: slug.zh_cn_name
                },
            ]
        })
        return { message: 'ແກ້ໄຂຂໍ້ມູນສຳເລັດ' }
    }
}