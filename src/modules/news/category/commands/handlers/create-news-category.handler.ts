import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateNewsCategoryCommand } from "../impl/create-news-category.command";
import { NewsCategoryRepository } from "../../news-cateory.repository";
import { generateSlug, generateSlugs } from "src/modules/news/helpers/news-category.slug";
@CommandHandler(CreateNewsCategoryCommand)
export class CreateNewsCategoryHandler implements ICommandHandler<CreateNewsCategoryCommand> {
  constructor(
    private readonly repository: NewsCategoryRepository
  ) { }
  async execute({ input }: CreateNewsCategoryCommand): Promise<any> {
    const data = generateSlugs(input)
    await this.repository.create({
      translates: [
        {
          name: input.en_name,
          lang: 'en',
          slug: data.en_name,
        },
        {
          name: input.lo_name,
          lang: 'lo',
          slug: data.lo_name,
        },
        {
          name: input.zh_cn_name,
          lang: 'zh_cn',
          slug: data.zh_cn_name,
        },
      ],
    })
    return { message: 'ບັນທຶກຂໍ້ມູນສຳເລັດ' }
  }

}