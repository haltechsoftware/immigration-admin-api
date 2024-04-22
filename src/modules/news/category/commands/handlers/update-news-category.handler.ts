import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateNewsCategoryCommand } from "../impl/update-news-category.command";
import { NewsCategoryRepository } from "../../news-cateory.repository";
import { NotFoundException } from "@nestjs/common";
import { generateSlugs } from "src/modules/news/helpers/news-category.slug";
import { format } from "date-fns";
import { DateTimeFormat } from "src/common/enum/date-time-fomat.enum";

@CommandHandler(UpdateNewsCategoryCommand)
export class UpdateNewsCategoryHandler implements ICommandHandler<UpdateNewsCategoryCommand> {
    constructor(
        private readonly _repository: NewsCategoryRepository
    ) { }
    async execute({ id, input }: UpdateNewsCategoryCommand): Promise<any> {
        const newsCategory = await this._repository.findOne(id)
        if (!newsCategory) throw new NotFoundException({ message: 'ບໍ່ພົບຂໍ້ມູນ' })
        const data = generateSlugs(input)
        await this._repository.update({
            id,
            created_at: format(new Date(), DateTimeFormat.Timestamp),
            translates: [
                {
                    id: input.en_id,
                    name: input.en_name,
                    lang: 'en',
                    slug: data.en_name,
                },
                {
                    id: input.lo_id,
                    name: input.lo_name,
                    lang: 'lo',
                    slug: data.lo_name,
                },
                {
                    id: input.zh_cn_id,
                    name: input.zh_cn_name,
                    lang: 'zh_cn',
                    slug: data.zh_cn_name,
                },
            ],
        })
        return { message: 'ແກ້ໄຂຂໍ້ມູນສຳເລັດ' }
    }
}