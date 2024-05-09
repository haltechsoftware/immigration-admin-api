import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { generateSlugs } from "src/modules/checkpoints/helpers/slug-name";
import { UpdateCheckpointCategoryCommand } from "../impl/update.command";
import { NotFoundException } from "@nestjs/common";
import { CheckpointCategoryRepository } from "../../checkpoint_category.repository";
import { format } from "date-fns";
import { DateTimeFormat } from "src/common/enum/date-time-fomat.enum";


@CommandHandler(UpdateCheckpointCategoryCommand)
export class UpdateCheckpointCategoryHandler implements ICommandHandler<UpdateCheckpointCategoryCommand> {
    constructor(
        private readonly checkPointCategoryRepository: CheckpointCategoryRepository,
    ) { }
    async execute({ input, id }: UpdateCheckpointCategoryCommand): Promise<any> {
        const checkpointCategroy = await this.checkPointCategoryRepository.findOne(id)
        if (!checkpointCategroy) throw new NotFoundException({ message: 'ປະເທດນີ້ບໍ່ມີໃນລະບົບ' })
        const slug = generateSlugs(input);
        await this.checkPointCategoryRepository.update({
            id: checkpointCategroy.id,
            updated_at: format(new Date(), DateTimeFormat.Timestamp),
            translates: [
                {
                    id: input.en.id,
                    title: input.en.title,
                    description: input.en.description,
                    lang: 'en',
                    slug: slug.en_name
                },
                {
                    id: input.lo.id,
                    title: input.lo.title,
                    description: input.lo.description,
                    lang: 'lo',
                    slug: slug.lo_name
                },
                {
                    id: input.zh_cn.id,
                    title: input.zh_cn.title,
                    description: input.zh_cn.description,
                    lang: 'zh_cn',
                    slug: slug.zh_cn_name
                },
            ]
        })
        return { message: 'ແກ້ໄຂຂໍ້ມູນສຳເລັດ' }
    }
}