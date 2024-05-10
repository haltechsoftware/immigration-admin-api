import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { generateSlugs } from "src/modules/checkpoints/helpers/slug-name";
import { CreateCheckPointCategoryCommand } from "../impl/create.command";
import { CheckpointCategoryRepository } from "../../checkpoint_category.repository";


@CommandHandler(CreateCheckPointCategoryCommand)
export class CreateCheckpointCategoryHandler implements ICommandHandler<CreateCheckPointCategoryCommand> {
    constructor(
        private readonly checkPointCategoryRepository: CheckpointCategoryRepository,
    ) { }
    async execute({ input }: CreateCheckPointCategoryCommand): Promise<any> {

        const slug = generateSlugs(input);
        
        await this.checkPointCategoryRepository.create({
            translates: [
                {
                    title: input.en.title,
                    description: input.en.description,
                    lang: 'en',
                    slug: slug.en_name
                },
                {
                    title: input.lo.title,
                    description: input.lo.description,
                    lang: 'lo',
                    slug: slug.lo_name
                },
                {
                    title: input.zh_cn.title,
                    description: input.zh_cn.description,
                    lang: 'zh_cn',
                    slug: slug.zh_cn_name
                },
            ]
        })
        return { message: 'ເພີ່ມຂໍ້ມູນສຳເລັດ' }
    }
}